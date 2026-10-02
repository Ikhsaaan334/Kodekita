import "server-only";
import type { PrismaClient } from "@prisma/client";
import { ALL_TRACKS } from "../../prisma/content";
import { gabungFondasi } from "../../prisma/content/gabung";
import { ALGORITMA, makeStarters } from "../../prisma/content/algoritma";
import { PROYEK_GLOBAL, startersProyek } from "../../prisma/content/proyek-global";
import { JALUR } from "../../prisma/content/jalur";
import { keAgnostic } from "../../prisma/content/normalisasi";
import { LANGUAGES, type LangId } from "./languages";

/**
 * Membangun ulang seluruh konten kursus dari sumber. Dipakai CLI seed dan
 * tombol seed ulang di panel admin. PERINGATAN: menghapus progres user.
 */
export async function jalankanSeed(db: PrismaClient, opts: { ifEmpty?: boolean } = {}) {
  if (opts.ifEmpty && (await db.track.count()) > 0) {
    return { skipped: true as const, fondasi: 0, jalur: 0, tantangan: 0, proyek: 0 };
  }

  await db.lessonProgress.deleteMany();
  await db.projectProgress.deleteMany();
  await db.submission.deleteMany();
  await db.lesson.deleteMany();
  await db.module.deleteMany();
  await db.challenge.deleteMany();
  await db.project.deleteMany();
  await db.track.deleteMany();

  // ===== track fondasi =====
  const { lessons: fondasiLessons, peringatan } = gabungFondasi(ALL_TRACKS);
  for (const w of peringatan) console.log(`peringatan: ${w}`);

  const track = await db.track.create({
    data: {
      slug: "fondasi",
      name: "Dasar Pemrograman",
      tagline: "Satu kurikulum, tujuh bahasa: pilih bahasamu di setiap latihan.",
      description:
        "Enam konsep inti (cetak, variabel, input, percabangan, perulangan, fungsi) dengan penjelasan dan contoh untuk tujuh bahasa. Di setiap langkah kamu memilih bahasa di atas editor: teorinya berganti contoh, kuisnya berganti soal, dan latihan kodenya dinilai dengan test yang sama untuk semua bahasa.",
      order: 0,
    },
  });
  const modul = await db.module.create({
    data: {
      trackId: track.id,
      title: "Konsep Dasar",
      description: "Enam konsep yang dipakai di semua bahasa pemrograman.",
      order: 0,
    },
  });
  for (const [li, lesson] of fondasiLessons.entries()) {
    await db.lesson.create({
      data: {
        moduleId: modul.id,
        slug: lesson.slug,
        title: lesson.title,
        summary: lesson.summary,
        order: li,
        xpReward: lesson.xpReward ?? 50,
        steps: JSON.stringify(lesson.steps),
      },
    });
  }

  // ===== jalur mendalam per bahasa =====
  let jalurLessonTotal = 0;
  const orderLang = ["python", "go", "c", "cpp", "java", "php", "csharp"];
  for (const [oi, lang] of orderLang.entries()) {
    const bagians = JALUR[lang] ?? [];
    if (bagians.length === 0) continue;
    const label = LANGUAGES[lang as LangId].label;
    const t = await db.track.create({
      data: {
        slug: lang,
        name: label,
        tagline: "Jalur mendalam: modul bertingkat dari idiom bahasa sampai siap lapangan.",
        description: `Jalur lanjutan khusus ${label}: memulai sedikit di atas fondasi dan menanjak sampai topik ekosistem dan praktik lapangan. Selesaikan fondasi dulu, lalu masuk sini untuk kedalaman yang tidak ada padanannya antar bahasa.`,
        order: oi + 1,
      },
    });
    let lessonCounter = 0;
    const bagianUrut = [...bagians].sort((a, b) => a.moduleRange[0] - b.moduleRange[0]);
    for (const bagian of bagianUrut) {
      if (bagian.lang !== lang) throw new Error(`jalur ${lang}: bagian mengaku lang ${bagian.lang}`);
      const [dari, sampai] = bagian.moduleRange;
      if (bagian.modules.length !== sampai - dari + 1) {
        throw new Error(`jalur ${lang}: jumlah modul tidak cocok dengan moduleRange`);
      }
      for (let mi = dari; mi <= sampai; mi++) {
        const mod = bagian.modules[mi - dari];
        const lessonsMilik = bagian.lessons.filter((_, i) => Math.floor(i / 10) === mi - dari);
        if (lessonsMilik.length === 0) continue;
        const m = await db.module.create({
          data: { trackId: t.id, title: mod.title, description: mod.description, order: mi },
        });
        for (const [li, lesson] of lessonsMilik.entries()) {
          await db.lesson.create({
            data: {
              moduleId: m.id,
              slug: lesson.slug,
              title: lesson.title,
              summary: lesson.summary,
              order: li,
              xpReward: lesson.xpReward ?? 60,
              steps: JSON.stringify(keAgnostic(lesson.steps, lang)),
            },
          });
          lessonCounter++;
        }
      }
    }
    jalurLessonTotal += lessonCounter;
  }

  // ===== tantangan algoritma lintas-bahasa =====
  for (const p of ALGORITMA) {
    const starters = makeStarters(p.lcRef ?? p.title);
    await db.challenge.create({
      data: {
        trackId: null,
        slug: p.slug,
        title: p.title,
        difficulty: p.difficulty,
        statement: p.statement,
        starterCode: starters["python"] ?? "",
        starterByLang: JSON.stringify(starters),
        tests: JSON.stringify(p.tests),
        hints: JSON.stringify(p.hints),
        xpReward: p.xpReward ?? 100,
      },
    });
  }

  // ===== proyek lintas-bahasa =====
  for (const p of PROYEK_GLOBAL) {
    await db.project.create({
      data: {
        trackId: null,
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        brief: p.brief,
        steps: JSON.stringify(p.steps),
        starterByLang: JSON.stringify(startersProyek(p.title)),
        finalTests: JSON.stringify(p.finalTests),
        xpReward: p.xpReward ?? 300,
      },
    });
  }

  return {
    skipped: false as const,
    fondasi: fondasiLessons.length,
    jalur: jalurLessonTotal,
    tantangan: ALGORITMA.length,
    proyek: PROYEK_GLOBAL.length,
  };
}
