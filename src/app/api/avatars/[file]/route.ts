import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!/^[a-zA-Z0-9_-]+\.(png|jpe?g|gif|webp)$/.test(file)) {
    return NextResponse.json({ error: "Nama berkas tidak valid" }, { status: 400 });
  }
  const ext = file.slice(file.lastIndexOf("."));
  try {
    const bytes = await readFile(join(process.cwd(), "uploads", "avatars", file));
    return new NextResponse(new Uint8Array(bytes), {
      headers: { "Content-Type": TYPES[ext] ?? "application/octet-stream", "Cache-Control": "private, max-age=60" },
    });
  } catch {
    return NextResponse.json({ error: "Avatar tidak ditemukan" }, { status: 404 });
  }
}
