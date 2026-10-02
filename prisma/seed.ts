import { PrismaClient } from "@prisma/client";
import { jalankanSeed } from "../src/lib/konten-seed";

// CLI seed: npx tsx prisma/seed.ts [--if-empty]

const db = new PrismaClient();

const ifEmpty = process.argv.includes("--if-empty");

jalankanSeed(db, { ifEmpty })
  .then((hasil) => {
    if (hasil.skipped) {
      console.log("seed --if-empty: konten sudah ada, lewati.");
      return;
    }
    console.log(
      `TOTAL: 1 fondasi (${hasil.fondasi} lesson lintas-bahasa) + 7 jalur (${hasil.jalur} lesson), ${hasil.tantangan} tantangan global, ${hasil.proyek} proyek global`
    );
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
