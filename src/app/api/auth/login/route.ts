import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";

const schema = z.object({
  identity: z.string().min(1, "Isi email atau username dulu"),
  password: z.string().min(1, "Isi password dulu"),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tidak valid" }, { status: 400 });
  }
  const { identity, password } = parsed.data;
  const user = await db.user.findFirst({
    where: { OR: [{ email: identity.toLowerCase() }, { username: identity }] },
  });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Email/username atau password salah." }, { status: 401 });
  }
  if (user.banned) {
    return NextResponse.json({ error: "Akun ini dibekukan. Hubungi administrator." }, { status: 403 });
  }
  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
