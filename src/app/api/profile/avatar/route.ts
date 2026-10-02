import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { simpanAvatar, storageAktif } from "@/lib/storage";

const ALLOWED = new Map([
  ["image/png", ".png"],
  ["image/jpeg", ".jpg"],
  ["image/gif", ".gif"],
  ["image/webp", ".webp"],
]);
const MAX_BYTES = 2 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Belum masuk" }, { status: 401 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!form || !(file instanceof File)) {
    return NextResponse.json({ error: "Pilih berkas gambar dulu." }, { status: 400 });
  }
  const ext = ALLOWED.get(file.type);
  if (!ext) {
    return NextResponse.json({ error: "Format harus PNG, JPG, GIF, atau WebP." }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Ukuran maksimal 2 MB." }, { status: 413 });
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  const nama = `${user.id}${ext}`;

  // produksi/serverless: Supabase Storage (URL publik permanen).
  // dev tanpa Supabase: disk lokal lewat route /api/avatars.
  if (storageAktif()) {
    try {
      const avatarUrl = await simpanAvatar(user.id, nama, bytes);
      await db.user.update({ where: { id: user.id }, data: { avatarUrl } });
      return NextResponse.json({ avatarUrl });
    } catch {
      return NextResponse.json({ error: "Gagal menyimpan avatar ke storage." }, { status: 500 });
    }
  }

  const namaLokal = `${user.id}-${Date.now()}${ext}`;
  const dir = join(process.cwd(), "uploads", "avatars");
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, namaLokal), bytes);
  const avatarUrl = `/api/avatars/${namaLokal}`;
  await db.user.update({ where: { id: user.id }, data: { avatarUrl } });
  return NextResponse.json({ avatarUrl });
}
