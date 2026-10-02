import type {
  AgnosticLessonContent,
  AgnosticStep,
  TrackContent,
} from "./types";
import { LATIHAN_FONDASI } from "./fondasi-latihan";

/**
 * Melebur 7 track fundamental yang isinya setara menjadi 6 lesson lintas-bahasa.
 - Teori dan kuis: varian per bahasa diambil dari masing-masing track (bahasa
   punya sintaks berbeda, jadi penjelasannya memang per bahasa).
 - Latihan kode: SATU tugas kanonik per lesson dari fondasi-latihan.ts, dengan
   template/solusi per bahasa dan SATU set test yang sama untuk semua bahasa.
 */

const JUDUL_GENERIK = [
  {
    slug: "program-pertama",
    title: "Program Pertama",
    summary: "Cetak teks pertamamu ke layar di bahasa pilihanmu.",
  },
  {
    slug: "variabel-tipe-data",
    title: "Variabel dan Tipe Data",
    summary: "Simpan angka dan teks di variabel, lalu gabungkan ke keluaran.",
  },
  {
    slug: "membaca-input",
    title: "Membaca Input",
    summary: "Buat program yang mendengarkan pengguna lalu membalasnya.",
  },
  {
    slug: "percabangan",
    title: "Percabangan",
    summary: "Program yang bisa memilih jalur sesuai kondisi.",
  },
  {
    slug: "perulangan",
    title: "Perulangan",
    summary: "Mengulang pekerjaan tanpa menulis ulang kode.",
  },
  {
    slug: "fungsi",
    title: "Fungsi",
    summary: "Bungkus logika jadi blok yang bisa dipanggil ulang.",
  },
];

export const LESSON_COUNT = JUDUL_GENERIK.length;

export function gabungFondasi(tracks: TrackContent[]): {
  lessons: AgnosticLessonContent[];
  peringatan: string[];
} {
  const peringatan: string[] = [];
  const lessons: AgnosticLessonContent[] = [];

  for (const [li, judul] of JUDUL_GENERIK.entries()) {
    const bodyByLang: Record<string, string> = {};
    const codeByLang: Record<string, { content: string; caption?: string }> = {};
    const quizByLang: Record<string, { question: string; options: string[]; answer: number; explanation: string }> = {};

    for (const track of tracks) {
      const lang = track.track.slug;
      const lesson = track.modules.flatMap((m) => m.lessons)[li];
      if (!lesson) {
        peringatan.push(`${lang}: lesson index ${li} tidak ada, dilewati`);
        continue;
      }
      const teori = lesson.steps[0];
      const kuis = lesson.steps[1];
      if (!teori || teori.kind !== "theory" || !kuis || kuis.kind !== "quiz") {
        throw new Error(`${lang} lesson ${li}: dua step pertama harusnya theory lalu quiz`);
      }
      bodyByLang[lang] = teori.body;
      codeByLang[lang] = { content: teori.code?.content ?? "", caption: teori.code?.caption };
      quizByLang[lang] = {
        question: kuis.question,
        options: kuis.options,
        answer: kuis.answer,
        explanation: kuis.explanation,
      };
    }

    const latihan = LATIHAN_FONDASI[li];
    if (!latihan) throw new Error(`fondasi-latihan.ts: tabel lesson index ${li} tidak ada`);
    lessons.push({
      slug: judul.slug,
      title: judul.title,
      summary: judul.summary,
      steps: [
        { kind: "theory", title: judul.title, bodyByLang, codeByLang },
        { kind: "quiz", byLang: quizByLang },
        { kind: "code", title: judul.title, tests: latihan.tests, byLang: latihan.byLang },
      ] as AgnosticStep[],
    });
  }

  return { lessons, peringatan };
}
