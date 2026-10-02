<div align="center">

# KodeKita

**Platform belajar coding interaktif berbahasa Indonesia**

Belajar dengan mengetik kode, bukan menonton video. Setiap konsep langsung dieksekusi, diuji dengan test case, dan kesalahannya dijelaskan.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![CodeMirror](https://img.shields.io/badge/CodeMirror-6-D30707)](https://codemirror.net)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)

</div>

---

## Fitur

- **Fondasi lintas-bahasa**, 6 pelajaran konsep inti yang bisa dipraktikkan di 7 bahasa: bahasa dipilih di atas editor, teori, contoh, kuis, dan template ikut berganti.
- **Jalur mendalam per bahasa**, 10 modul bertingkat per bahasa dari idiom sampai praktik lapangan, dengan mini proyek di ujungnya.
- **Tantangan ala LeetCode**, test terbuka dan tersembunyi, bebas dikerjakan di bahasa mana pun.
- **Proyek terpandu**, brief nyata, checklist langkah dengan hint, dan ujian akhir otomatis.
- **Empat tipe latihan**: kuis konsep, lengkapi kode, perbaiki kode yang salah, dan tulis program utuh.
- **Gamifikasi**: XP, level, streak harian, dan papan peringkat dari data nyata.
- **Profil yang bisa dikustom**: foto PNG/JPG/**GIF** via Supabase Storage, warna nama, dan efek nama normal, pixel, atau glitch.
- **Judge eksekusi kode sungguhan**: kode dinilai dengan test case di sandbox terisolasi, bukan di browser.

## Bahasa yang didukung

| Bahasa | Jalur | Kompilator/Interpreter |
|---|---|---|
| Python | 100 materi | CPython 3 |
| Go | 100 materi | Go toolchain |
| C | 100 materi | gcc / MinGW-w64 |
| C++ | 100 materi | g++ / MinGW-w64 |
| Java | 100 materi | JDK |
| PHP | 100 materi | PHP CLI |
| C# | 100 materi | csc (.NET) / Mono |

Total **706 materi**: 6 pelajaran fondasi + 7 × 100 materi jalur mendalam, ditambah 18 tantangan algoritma dan 5 proyek lintas-bahasa.

## Memulai

```bash
git clone https://github.com/<username>/kodekita.git
cd kodekita
npm install
cp .env.example .env   # lalu isi nilainya, lihat tabel di bawah
npm run setup          # buat tabel + isi 706 materi
npm run dev            # buka http://localhost:3000
```

### Environment variables

| Variabel | Keterangan |
|---|---|
| `DATABASE_URL` | Koneksi Postgres Supabase. Runtime: pooler port 6543 + `?pgbouncer=true&connection_limit=1`. CLI: session pooler port 5432 |
| `AUTH_SECRET` | Kunci sesi JWT, minimal 32 karakter acak (`openssl rand -hex 32`) |
| `SUPABASE_URL` | URL proyek Supabase, untuk avatar |
| `SUPABASE_SERVICE_ROLE_KEY` | Kunci service role, hanya untuk server |
| `ENABLE_LOCAL_RUNNER` | `true` hanya untuk pengembangan lokal; produksi otomatis nonaktif |
| `PISTON_URL` | Alamat judge eksekusi kode (Piston), wajib di produksi |

Contoh konfigurasi lengkap ada di [.env.example](.env.example).

## Eksekusi kode

Kode pengguna tidak pernah dieksekusi di browser. Judge bekerja dengan dua backend yang bisa dipilih:

1. **Piston (produksi)**: instance [Piston](https://github.com/engineer-man/piston) yang di-self-host di container, diisi `PISTON_URL` di environment. Sandbox terisolasi dengan batas waktu dan memori.
2. **Local runner (pengembangan)**: memanggil toolchain yang terpasang di mesin, dengan auto-deteksi. Status tiap bahasa bisa dicek di `GET /api/runtimes`; bahasa tanpa toolchain tampil nonaktif beserta cara mengaktifkannya.

> Produksi wajib memakai judge terisolasi: set `ENABLE_LOCAL_RUNNER=false` dan arahkan `PISTON_URL` ke instance Piston.

## Deployment

Panduan lengkap ada di [DEPLOY.md](DEPLOY.md), mencakup dua jalur:

- **Serverless**: Supabase (database + storage avatar) + Vercel (aplikasi) + VPS kecil untuk Piston, termasuk tutor langkah demi langkah dan tabel troubleshoot.
- **Satu VPS**: Dockerfile multi-stage + docker-compose (app, Piston, nginx) di `docker-compose.yml`.

## Struktur proyek

```text
prisma/
  schema.prisma        # skema database (Postgres/Supabase)
  content/             # sumber seluruh konten kursus
    silabus.ts         #   silabus 10 modul per bahasa
    gabung.ts          #   peleburan fondasi lintas-bahasa
    fondasi-latihan.ts #   latihan kode kanonik 7 bahasa
    algoritma.ts       #   18 tantangan algoritma
    proyek-global.ts   #   5 proyek lintas-bahasa
    jalur/<bahasa>/    #   100 materi per bahasa (5 bagian x 20)
src/
  app/                 # halaman + API routes (Next.js App Router)
  components/          # editor, step player, workspace, grafik profil
  lib/
    runner/            # local runner + HTTP runner (Piston)
    judge.ts           # eksekusi per test case + normalisasi keluaran
    gamification.ts    # XP, level, streak
    storage.ts         # avatar via Supabase Storage
scripts/
  verify-jalur.ts      # verifikasi semua solusi jalur (1.271 test)
  verify-konten.ts     # verifikasi fondasi + tantangan + proyek
  ekspor-sqlite.ts     # ekspor data lama (SQLite -> JSON)
  impor-supabase.ts    # impor data ke Supabase (pemetaan via slug)
```

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm run setup` | `prisma db push` + seed seluruh konten |
| `npm run dev` | Jalankan server pengembangan |
| `npm run build` | Build produksi |
| `npm run db:seed` | Bangun ulang konten dari `prisma/content/` |
| `npx tsx scripts/verify-jalur.ts` | Uji seluruh solusi materi jalur terhadap test case |
| `npx tsx scripts/verify-algoritma.ts` | Uji solusi referensi tantangan algoritma |

## Atribusi konten

Soal-soal tantangan algoritma bersumber dari soal klasik LeetCode yang terkumpul di [haoel/leetcode](https://github.com/haoel/leetcode) dan [snehasishroy/leetcode-companywise-interview-questions](https://github.com/snehasishroy/leetcode-companywise-interview-questions), dipilih mengikuti daftar populer dari [ashishps1/awesome-leetcode-resources](https://github.com/ashishps1/awesome-leetcode-resources). Seluruh pernyataan soal ditulis ulang dalam bahasa Indonesia, bukan salinan.
