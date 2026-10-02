import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { catatAksi } from "@/lib/admin";

const schema = z.object({
  banned: z.boolean().optional(),
  xp: z.number().int().min(0).max(10_000_000).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Khusus admin" }, { status: 403 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  const target = await db.user.findUnique({
    where: { id },
    select: { id: true, username: true, role: true, banned: true, xp: true },
  });
  if (!target) return NextResponse.json({ error: "Pengguna tidak ditemukan" }, { status: 404 });
  if (target.id === admin.id && parsed.data.banned) {
    return NextResponse.json({ error: "Tidak bisa membekukan akun sendiri" }, { status: 400 });
  }
  if (target.role === "admin" && parsed.data.banned) {
    return NextResponse.json({ error: "Akun admin tidak bisa dibekukan" }, { status: 400 });
  }

  const data: { banned?: boolean; xp?: number } = {};
  if (parsed.data.banned !== undefined) data.banned = parsed.data.banned;
  if (parsed.data.xp !== undefined) data.xp = parsed.data.xp;
  const updated = await db.user.update({ where: { id }, data, select: { banned: true, xp: true } });

  const aksi: string[] = [];
  if (parsed.data.banned !== undefined) aksi.push(parsed.data.banned ? "ban" : "unban");
  if (parsed.data.xp !== undefined) aksi.push(`XP diset ${parsed.data.xp}`);
  await catatAksi(admin.username, "kelola-user", target.username, aksi.join(", "));

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Khusus admin" }, { status: 403 });
  const { id } = await params;

  const target = await db.user.findUnique({ where: { id }, select: { username: true, role: true } });
  if (!target) return NextResponse.json({ error: "Pengguna tidak ditemukan" }, { status: 404 });
  if (target.role === "admin") {
    return NextResponse.json({ error: "Akun admin tidak bisa dihapus lewat panel" }, { status: 400 });
  }
  if (target.username === admin.username) {
    return NextResponse.json({ error: "Tidak bisa menghapus akun sendiri" }, { status: 400 });
  }

  await db.lessonProgress.deleteMany({ where: { userId: id } });
  await db.projectProgress.deleteMany({ where: { userId: id } });
  await db.submission.deleteMany({ where: { userId: id } });
  await db.user.delete({ where: { id } });
  await catatAksi(admin.username, "hapus-user", target.username);

  return NextResponse.json({ ok: true });
}
