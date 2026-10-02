# AGENTS.md — KodeKita (judul kerja) / Platform Belajar Coding

Platform SaaS belajar coding interaktif. Stack: Next.js 15 (App Router) + TypeScript + Tailwind v4 + Prisma (SQLite) + CodeMirror + motion.

## antislop (WAJIB untuk pekerjaan UI, copy, atau komentar kode)

1. Baca `docs/antislop.md` (inti: aturan R-01..R-38 + Delivery Gate).
2. Baca `DESIGN.md` (arah desain milik pemilik) sebelum membangun atau mengubah UI (R-37).
3. Jalankan Delivery Gate sebelum menyerahkan hasil; laporkan PASS/FAIL per butir.
4. Mode penggunaan: **DURING** (aturan dipakai saat menulis, bukan audit belakangan). Diputuskan pemilik, 2026-09-29.
5. Untuk memasang skill antislop lengkap (copywriting, human, mobile, code): `npx antislop-ai`. Skill UI sudah dibaca dan diterapkan sejak sesi 2026-09-29.

## Perintah

- `npm run setup`: prisma db push + seed konten kursus
- `npm run dev`: jalankan dev server
- `npm run build`: build produksi

## Konvensi

- Copy UI berbahasa Indonesia; tanpa em dash (R-02); tanpa buzzword (R-16); CTA spesifik (R-15).
- Angka dan klaim hanya dari data nyata di database (R-17, R-38).
- Fitur eksekusi kode: runner pluggable (`src/lib/runner/`); jangan jalankan kode user di server produksi tanpa isolasi; local runner hanya untuk dev.
- Komentar kode hanya untuk kendala yang tidak terlihat dari kodenya sendiri.
