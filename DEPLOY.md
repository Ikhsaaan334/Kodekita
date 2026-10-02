# DEPLOY.md, panduan produksi KodeKita

Panduan ini menutup dua jalur deploy: **jalur serverless (Supabase + Vercel)** yang direkomendasikan, dan jalur Docker penuh di satu VPS. Keduanya memakai judge Piston terpisah karena eksekusi kode tidak bisa hidup di fungsi serverless.

## Arsitektur (jalur rekomendasi: Supabase)

```
[ pengguna ] --> [ Vercel (Next.js serverless) ]
                        |  DATABASE_URL (pooled 6543)
                        |  avatar -> Supabase Storage
                        v
                 [ Supabase Postgres ]
                        |
                        v  PISTON_URL
                 [ VPS kecil / Fly.io: Piston :2000 ]
```

- Database: Supabase Postgres, koneksi **pooled** (port 6543) supaya fungsi serverless tidak menghabiskan batas koneksi.
- Avatar: Supabase Storage bucket `avatars` (publik), otomatis aktif bila `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` terisi.
- Judge: satu VPS kecil (~1 GB RAM cukup) menjalankan container Piston. Eksekusi kode tidak bisa serverless: butuh toolchain dan sandbox level kernel.
- Redis: belum dibutuhkan. Tulisan per interaksi sangat kecil dan Postgres menangannya dengan santai; tambahkan Upstash hanya untuk rate limiting judge atau leaderboard sangat panas kelak.

## 0. Jalur serverless: Supabase + Vercel (langkah demi langkah)

### 0a. Dorong kode ke GitHub

Vercel mengambil kode dari repo Git, jadi ini langkah pertama. Jalankan di root proyek:

```bash
git init
git add .
git commit -m "KodeKita: siap deploy"
# buat repo kosong bernama kodekita di github.com/new (JANGAN centang README),
# lalu:
git remote add origin https://github.com/<username-kamu>/kodekita.git
git branch -M main
git push -u origin main
```

`.gitignore` sudah melindungi `.env`, `prisma/dev.db`, `uploads/`, dan `scripts/data-migrasi.json` — pastikan git tidak memasukkan salah satunya: `git status` tidak boleh mendaftarkan berkas itu.

### 0b. Kumpulkan nilai environment

| Variabel | Nilai | Dari mana |
|---|---|---|
| `DATABASE_URL` | URL transaction pooler port 6543 + `?pgbouncer=true&connection_limit=1` | Sudah ada di `.env` kamu (yang dipakai runtime) |
| `AUTH_SECRET` | `openssl rand -hex 32` | Jalankan sendiri; buat yang BARU, jangan pakai milik dev |
| `SUPABASE_URL` | `https://snxygjamqjuoqfsnnifu.supabase.co` | Sudah ada di `.env` |
| `SUPABASE_SERVICE_ROLE_KEY` | kunci service_role | Dashboard Supabase → Project Settings → API Keys |
| `ENABLE_LOCAL_RUNNER` | `false` | Tetap; kode user hanya lewat judge |
| `PISTON_URL` | `http://<ip-vps>:2000/api/v2` | Nanti setelah Piston terpasang di VPS; boleh diisi belakangan |
| `SEED_ON_START` | `false` | Tidak berlaku di Vercel; Supabase sudah di-seed dari lokal |

### 0c. Import di Vercel

1. Daftar di vercel.com pakai akun GitHub, lalu **Add New... → Project** → pilih repo `kodekita` → **Import**.
2. Framework Preset terdeteksi otomatis sebagai Next.js; biarkan.
3. **Build Command** ganti menjadi: `npx prisma generate && next build` (memastikan client Prisma ter-generate sebelum build).
4. Buka **Environment Variables**, tambahkan semua baris dari tabel 0b untuk scope **Production** dan **Preview**.
5. Sebelum menekan Deploy: **Settings → Functions → Function Region** pilih **Singapore (sin1)**, supaya fungsi dekat user Indonesia dan dekat VPS Piston nanti.
6. Tekan **Deploy**. Build pertama 2-4 menit.

### 0d. Verifikasi setelah hidup

```text
https://<proyek-kamu>.vercel.app/api/health   -> {"ok":true,...}
Daftar akun baru -> masuk dashboard -> jalankan pelajaran
```

Tanpa `PISTON_URL`, semua chip bahasa akan tampil dicoret dengan pesan jujur "Atur PISTON_URL" — itu perilaku benar. Selesaikan langkah Piston berikut supaya eksekusi kode aktif.

### 0e. Piston gratis di Oracle Cloud Always Free (langkah demi langkah)

Oracle Always Free memberi VPS ARM (Ampere A1) sampai 4 OCPU + 24 GB RAM, gratis selamanya — lebih dari cukup untuk Piston ketujuh bahasa.

1. **Daftar** di oracle.com/cloud/free. Kartu kredit hanya untuk verifikasi, tidak ditagih selama tetap di tier Always Free. **Pilih home region Singapore (ap-southeast-1)** — region tidak bisa diganti setelah akun jadi, dan ini yang paling dekat pengguna Indonesia.
2. **Buat instance**: Compute → Instances → Create Instance. Shape: `VM.Standard.A1.Flex` dengan 2 OCPU + 12 GB RAM. Image: Ubuntu 22.04. Tambahkan SSH key kamu (atau tempel public key). Kalau muncul "out of capacity", tunggu beberapa jam lalu coba lagi — kejadian umum di tier gratis.
3. **Buka pintu di dua tempat** (jebakan paling terkenal Oracle):
   - Dashboard: VCN → Security Lists → Add Ingress Rule → Source `0.0.0.0/0`, TCP, port `2000`.
   - Di dalam server, image Ubuntu Oracle membawa firewall internal yang menolak semua port selain SSH:
     ```bash
     sudo iptables -L INPUT --line-numbers      # lihat nomor baris REJECT
     sudo iptables -I INPUT <nomor-baris-REJECT> -p tcp --dport 2000 -j ACCEPT
     sudo netfilter-persistent save
     ```
4. **Pasang Docker**: `curl -fsSL https://get.docker.com | sh`
5. **Jalankan Piston**:
   ```bash
   docker run -d --privileged --name piston -p 2000:2000 \
     -v piston-packages:/piston/packages ghcr.io/engineer-man/piston
   ```
   Kalau container langsung mati dengan pesan `exec format error`, berarti image resmi belum ada versi ARM: build dari sumber — `git clone https://github.com/engineer-man/piston && cd piston && docker build -t piston-local .` lalu jalankan dengan `--name piston -p 2000:2000 piston-local`.
6. **Pasang runtime bahasa** (sekali; tersimpan di volume):
   ```bash
   docker exec piston piston install python 3.10.0
   docker exec piston piston install go 1.16.3
   docker exec piston piston install gcc 10.2.0
   docker exec piston piston install java 15.0.2
   docker exec piston piston install php 8.0.2
   docker exec piston piston install csharp 5.16.0
   ```
7. **Tes dari laptopmu**: `curl http://<IP-PUBLIK-VM>:2000/api/v2/runtimes` — harus mengembalikan daftar bahasa.
8. **Sambungkan ke aplikasi**: isi `PISTON_URL=http://<IP-PUBLIK-VM>:2000/api/v2` di Vercel → Redeploy. Cek dari panel admin → "Tes eksekusi" per bahasa.
9. **Pengaman tambahan (disarankan)**: Piston tidak punya autentikasi bawaan, jadi siapa pun yang tahu IP bisa memakai judge-mu. Lapisan mudah: pasang nginx di depan Piston yang mewajibkan header rahasia, dan set nilai yang sama di `PISTON_KEY` (aplikasi sudah mengirimkannya sebagai header Authorization).

## Arsitektur (jalur Docker di satu VPS)

```
[ pengguna ] --> [ nginx :80 ] --> [ app Next.js :3000 ] --> Supabase Postgres
                                        |
                                        v
                              [ Piston (judge) :2000 ]
                              sandbox eksekusi 7 bahasa
```

- **app**: Next.js + Prisma. Database di Supabase; folder avatar di volume (atau Supabase Storage).
- **piston**: judge eksekusi kode terisolasi (sandbox per bahasa). Local runner otomatis NONAKTIF di produksi; kode user tidak pernah dijalankan di host.
- **nginx**: reverse proxy, gzip, cache aset, batas unggahan, header keamanan.

## 1. Siapkan server

Kebutuhan: VPS 2 GB RAM minimum (Piston butuh memori), Ubuntu 22.04/Debian 12 contohnya, dan domain yang mengarah ke IP server (opsional tapi disarankan untuk HTTPS).

```bash
# di VPS (Linux)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER && newgrp docker
```

## 2. Unggah kode dan atur secret

```bash
git clone <repo-kamu> kodekita && cd kodekita
cp .env.example .env
# WAJIB: ganti AUTH_SECRET dengan acak baru
echo "AUTH_SECRET=$(openssl rand -hex 32)" > .env.tmp && cat .env >> /dev/null 2>&1 || true
# gabungkan manual: pastikan .env berisi AUTH_SECRET=<hasil openssl di atas>
```

Variabel yang wajib benar di `.env` versi produksi:

| Variabel | Nilai produksi |
|---|---|
| `AUTH_SECRET` | 32+ karakter acak, JANGAN pakai contoh |
| `DATABASE_URL` | `file:/data/kodekita.db` (di-set docker-compose) |
| `ENABLE_LOCAL_RUNNER` | `false` (di-set docker-compose) |
| `PISTON_URL` | `http://piston:2000/api/v2` (di-set docker-compose) |
| `SEED_ON_START` | `true` (isi konten hanya bila database kosong) |

## 3. Jalankan

```bash
docker compose up -d --build
docker compose ps          # app, piston, nginx: semuanya Up/healthy
curl http://localhost/api/health   # {"ok":true,...}
```

## 4. Pasang runtime bahasa di Piston (sekali)

Piston kosong saat pertama jalan; pasang bahasa yang mau ditawarkan:

```bash
docker compose exec piston piston install python 3.10.0
docker compose exec piston piston install go 1.16.3
docker compose exec piston piston install gcc 10.2.0     # untuk C dan C++
docker compose exec piston piston install java 15.0.2
docker compose exec piston piston install php 8.0.2
docker compose exec piston piston install csharp 5.16.0  # mono
```

Versi di atas contoh yang lazim; lihat yang tersedia dengan `docker compose exec piston piston install` (tanpa argumen) atau cek repo engineer-man/piston. Aplikasi otomatis membaca versi yang terpasang dari endpoint `/runtimes` Piston, jadi tidak ada config tambahan. Bahasa yang belum dipasang akan tampil dicoret di UI dengan alasan yang jujur.

## 5. HTTPS (opsional tapi disarankan)

Cara tercepat dengan domain: taruh Cloudflare atau pakai certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
# arahkan A record domain ke IP server, lalu:
sudo certbot --nginx -d kodekita.example.com
```

Setelah sertifikat aktif, tambahkan redirect 80 ke 443 dan ubah `listen 443 ssl` di `deploy/nginx.conf` sesuai output certbot (certbot --nginx umumnya menyunting otomatis bila nginx berjalan langsung di host; untuk nginx di container, pasang certbot di host dan mount sertifikat, atau gunakan container nginx-proxy/caddy). Untuk MVP di belakang Cloudflare, mode "Flexible/Full" tanpa sertifikat sendiri juga bisa.

## 6. Backup dan update

```bash
# backup (database + avatar): cukup dua folder volume
docker run --rm -v kodekita_app-data:/data -v $PWD:/b alpine tar czf /b/backup-data.tar.gz -C /data .
docker run --rm -v kodekita_app-uploads:/u -v $PWD:/b alpine tar czf /b/backup-uploads.tar.gz -C /u .

# update aplikasi
git pull
docker compose up -d --build
# skema database disinkronkan otomatis oleh entry point (prisma db push)
```

## 7. Troubleshoot lintas OS

| Gejala | Sebab | Obat |
|---|---|---|
| `AUTH_SECRET wajib diisi` saat compose up | `.env` tidak ada / variabel kosong | buat `.env` berisi `AUTH_SECRET=<openssl rand -hex 32>` |
| Chip bahasa semua dicoret di produksi | runtime Piston belum dipasang | langkah 4 di atas; cek `curl http://localhost:2000/api/v2/runtimes` dari dalam jaringan docker |
| Judge selalu gagal "koneksi" | Piston belum siap (pull image besar pertama kali) | `docker compose logs -f piston`, tunggu lalu coba lagi |
| `Error:EPERM ... query_engine` saat build di Windows | proses dev server mengunci DLL Prisma | matikan `npm run dev` sebelum `docker compose build` (build dijalankan di container Linux, jadi ini hanya urusan proses lokal yang mengunci berkas) |
| Avatar tidak muncul setelah rebuild | folder uploads tidak persisten | pastikan volume `app-uploads` ter-mount (sudah di compose); jangan ganti nama service app |
| Progres user hilang setelah restart | `SEED_ON_START` dijalankan ulang penuh | gunakan entry point bawaan: seed berjalan hanya bila database kosong (flag `--if-empty`) |
| Port 80 dipakai aplikasi lain | konflik port | ubah `"80:80"` di compose jadi mis. `"8080:80"` |
| Piston mati sendiri di VPS kecil | OOM (kehabisan memori) | tambah swap 2 GB, atau batasi bahasa yang dipasang |
| Waktu tanggal meleset | zona waktu container | tambah `environment: TZ=Asia/Jakarta` di service app |

## 8. Catatan keamanan

- Local runner (eksekusi via toolchain host) dikunci di produksi: `NODE_ENV=production` tanpa `ENABLE_LOCAL_RUNNER=true` akan menolak menjalankan kode lokal, apa pun yang terjadi. Jangan pernah menyalakannya di VPS publik.
- Database sudah Postgres (Supabase). Data akun lama dari SQLite bisa dipindah dengan `npx tsx scripts/impor-supabase.ts` setelah `db push` + seed (berkas hasil ekspor: `scripts/data-migrasi.json`, jangan di-commit).
- `SUPABASE_SERVICE_ROLE_KEY` melewati keamanan baris (RLS): hanya untuk server, jangan pernah dipakai di kode klien atau diekspos ke browser.
- Jalankan `docker compose down && docker compose up -d --build` hanya saat jendela sepi; build di staging dulu bila memungkinkan.
