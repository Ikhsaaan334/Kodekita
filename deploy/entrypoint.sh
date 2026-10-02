#!/bin/sh
# Entry point container: sinkronkan skema, isi konten bila kosong, lalu jalankan Next.js.
set -e

echo "[kodekita] menyinkronkan skema database..."
./node_modules/.bin/prisma db push --skip-generate

if [ "${SEED_ON_START:-true}" = "true" ]; then
  echo "[kodekita] mengisi konten kursus bila database masih kosong..."
  ./node_modules/.bin/tsx prisma/seed.ts --if-empty
fi

echo "[kodekita] menjalankan Next.js di port ${PORT:-3000}"
exec ./node_modules/.bin/next start -H 0.0.0.0 -p "${PORT:-3000}"
