import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";

const schema = z.object({
  email: z.string().email("Format email tidak valid"),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(20, "Username maksimal 20 karakter")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan garis bawah"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tidak valid" }, { status: 400 });
  }
  const { email, username, password } = parsed.data;
  const emailTaken = await db.user.findUnique({ where: { email } });
  if (emailTaken) {
    return NextResponse.json({ error: "Email sudah terdaftar. Coba masuk saja." }, { status: 409 });
  }
  const usernameTaken = await db.user.findUnique({ where: { username } });
  if (usernameTaken) {
    return NextResponse.json({ error: "Username sudah dipakai. Pilih yang lain." }, { status: 409 });
  }
  const user = await db.user.create({
    data: { email, username, passwordHash: await hashPassword(password) },
  });
  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
