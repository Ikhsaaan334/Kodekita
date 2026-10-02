import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin, catatAksi } from "@/lib/admin";
import { jalankanSeed } from "@/lib/konten-seed";

const schema = z.object({ confirm: z.literal("HAPUS PROGRES") });

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Khusus admin" }, { status: 403 });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Konfirmasi harus teks persis: HAPUS PROGRES" },
      { status: 400 }
    );
  }
  const hasil = await jalankanSeed(db);
  await catatAksi(
    admin.username,
    "seed-ulang",
    undefined,
    `${hasil.fondasi + hasil.jalur} materi, ${hasil.tantangan} tantangan`
  );
  return NextResponse.json(hasil);
}
