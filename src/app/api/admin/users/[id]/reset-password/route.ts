import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { requireAdmin, catatAksi } from "@/lib/admin";

const schema = z.object({
  newPassword: z.string().min(8, "Password baru minimal 8 karakter").max(72).optional(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Khusus admin" }, { status: 403 });
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body ?? {});
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const target = await db.user.findUnique({ where: { id }, select: { username: true } });
  if (!target) return NextResponse.json({ error: "Pengguna tidak ditemukan" }, { status: 404 });

  const password = parsed.data.newPassword ?? randomBytes(9).toString("base64url");
  await db.user.update({
    where: { id },
    data: { passwordHash: await hashPassword(password) },
  });
  await catatAksi(admin.username, "reset-password", target.username);

  // plaintext hanya dikirim sekali di respons ini, tidak pernah disimpan
  return NextResponse.json({ password });
}
