import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Penyimpanan avatar: Supabase Storage bila env lengkap (produksi/serverless),
 * fallback ke disk lokal untuk pengembangan tanpa Supabase.
 */

let client: SupabaseClient | null | undefined;

function supabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  // SUPABASE_URL dulu, lalu nama NEXT_PUBLIC_ dari wizard resmi Supabase
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  client = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return client;
}

export function storageAktif(): boolean {
  return supabase() !== null;
}

const BUCKET = "avatars";

async function pastikanBucket(sb: SupabaseClient) {
  const { data: buckets } = await sb.storage.listBuckets();
  if (buckets?.some((b) => b.name === BUCKET)) return;
  const { error } = await sb.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: "2MB",
    allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
  });
  // "already exists" berarti instance lain keburu membuatnya: aman dilanjutkan
  if (error && !/exist/i.test(error.message)) throw error;
}

/** Simpan avatar; kembalikan URL publik yang bisa dipakai langsung di <img>. Bucket dibuat otomatis bila belum ada. */
export async function simpanAvatar(userId: string, nama: string, bytes: Uint8Array): Promise<string> {
  const sb = supabase();
  if (!sb) throw new Error("storage tidak aktif");
  const path = `${userId}-${Date.now()}-${nama}`;
  let { error } = await sb.storage.from(BUCKET).upload(path, bytes, {
    contentType: tipeKonten(nama),
    upsert: false,
  });
  if (error && /bucket not found/i.test(error.message)) {
    await pastikanBucket(sb);
    ({ error } = await sb.storage.from(BUCKET).upload(path, bytes, {
      contentType: tipeKonten(nama),
      upsert: false,
    }));
  }
  if (error) throw error;
  const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function tipeKonten(nama: string): string {
  const ext = nama.slice(nama.lastIndexOf(".")).toLowerCase();
  const map: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };
  return map[ext] ?? "application/octet-stream";
}
