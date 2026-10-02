import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin, catatAksi } from "@/lib/admin";

const schema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter").max(120),
  body: z.string().min(3, "Isi minimal 3 karakter").max(1000),
});

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Khusus admin" }, { status: 403 });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tidak valid" }, { status: 400 });
  }
  // pengumuman baru menggantikan yang aktif: hanya satu yang tampil
  await db.announcement.updateMany({ data: { active: false } });
  const created = await db.announcement.create({
    data: { title: parsed.data.title, body: parsed.data.body, active: true },
  });
  await catatAksi(admin.username, "terbitkan-pengumuman", undefined, parsed.data.title);
  return NextResponse.json(created);
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Khusus admin" }, { status: 403 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id wajib" }, { status: 400 });
  await db.announcement.delete({ where: { id } });
  await catatAksi(admin.username, "hapus-pengumuman");
  return NextResponse.json({ ok: true });
}
