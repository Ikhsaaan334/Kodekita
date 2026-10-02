import Link from "next/link";
import { db } from "@/lib/db";
import { LANGUAGES, LANG_IDS } from "@/lib/languages";
import { LandingDemo } from "@/components/LandingDemo";
import { Reveal } from "@/components/motion-bits";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export const dynamic = "force-dynamic";

const LATIHAN = [
  {
    judul: "Kuis konsep",
    detail: "Jawaban diperiksa langsung, salah paham dibahas sejurus setelahnya, bukan di ujian akhir.",
  },
  {
    judul: "Lengkapi kode",
    detail: "Kode sengaja ada bolongnya. Kamu yang isi, lalu judge yang menilai hasilnya lewat test case.",
  },
  {
    judul: "Perbaiki kode yang salah",
    detail: "Satu bug nyata ditanam di kode. Membaca error dan menelusuri baris adalah keterampilan inti di sini.",
  },
  {
    judul: "Tantangan & proyek",
    detail: "Soal ala LeetCode dengan test tersembunyi, dan proyek terpandu yang diakhiri ujian otomatis.",
  },
];

export default async function LandingPage() {
  const [modules, lessonCount, tantanganCount, proyekCount] = await Promise.all([
    db.track.findFirst({
      // landing cuma butuh judul dan ringkasan; kolom steps berat jangan ditarik
      select: {
        modules: {
          orderBy: { order: "asc" },
          select: {
            lessons: {
              orderBy: { order: "asc" },
              select: { id: true, slug: true, title: true, summary: true, order: true },
            },
          },
        },
      },
    }),
    db.lesson.count(),
    db.challenge.count(),
    db.project.count(),
  ]);
  const lessons = modules?.modules.flatMap((m) => m.lessons) ?? [];

  return (
    <div>
      {/* Hero: headline + demo produk yang benar-benar jalan, satu layar satu fokus */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 sm:pt-20 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            Belajar coding dengan mengetik kode,
            <span className="text-emas-400"> bukan menonton video</span>
            <span className="anim-caret ml-1 inline-block h-[0.9em] w-[0.14em] translate-y-[0.08em] bg-emas-500" aria-hidden />
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-gading-300">
            Setiap konsep langsung kamu praktikkan: kodenya dieksekusi, diuji dengan test case, dan salahnya dijelaskan.
            Kursus interaktif berbahasa Indonesia untuk tujuh bahasa.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/daftar"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-emas-500 px-6 text-lg font-semibold text-ink-950 transition-transform hover:-translate-y-0.5"
            >
              Buat Akun Gratis
            </Link>
            <Link
              href="#jalur"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-ink-500 px-6 font-semibold text-gading-50 transition-colors hover:bg-ink-800"
            >
              Lihat kurikulumnya
            </Link>
          </div>
        </div>
        <Reveal delay={0.15}>
          <LandingDemo />
        </Reveal>
      </section>

      {/* Cara latihan: satu blok besar + daftar bernomor, bukan deretan kartu kembar */}
      <section className="border-y border-ink-700 bg-ink-800/30">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight">Empat cara latihan, satu prinsip: kamu yang mengetik.</h2>
            <p className="mt-4 leading-relaxed text-gading-300">
              Menonton orang lain menulis kode itu menenangkan, tapi tidak menempel. Di sini setiap langkah berakhir
              dengan kode yang kamu tulis atau perbaiki sendiri, dan hasilnya dinilai mesin, bukan perasaan.
            </p>
            <p className="mt-4 leading-relaxed text-gading-300">
              Kalau macet, buka hint secara bertahap. Hint paling awal cuma mengarahkan; yang terakhir baru menunjukkan
              jalannya. Biar otakmu yang tetap bekerja duluan.
            </p>
          </Reveal>
          <ol className="space-y-4">
            {LATIHAN.map((l, i) => (
              <Reveal key={l.judul} delay={i * 0.08}>
                <li className="flex gap-4 rounded-2xl border border-ink-600 bg-ink-900 p-5 transition-colors hover:border-ink-500">
                  <span className="font-code text-2xl font-semibold text-emas-500">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-semibold">{l.judul}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gading-300">{l.detail}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Kurikulum: daftar konsep dengan data nyata dari database, plus pilihan bahasa */}
      <section id="jalur" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight">Satu kurikulum, tujuh bahasa</h2>
          <p className="mt-3 max-w-2xl text-gading-300">
            Tidak ada materi yang berulang per bahasa. Enam konsep inti ini diikuti sekali, dan di setiap latihan kamu
            memilih bahasa di atas editor: teori, contoh, kuis, dan template ikut berganti.
          </p>
        </Reveal>
        <div className="mt-6 flex flex-wrap gap-2">
          {LANG_IDS.map((l) => (
            <Link
              key={l}
              href={`/belajar/${l}`}
              className="rounded-full border border-ink-600 bg-ink-950 px-4 py-2 font-code text-sm font-semibold text-emas-400 transition-colors hover:border-emas-600"
            >
              {LANGUAGES[l].label}
            </Link>
          ))}
        </div>
        <Reveal>
          <p className="mt-4 text-sm text-gading-500">
            Tiap bahasa punya jalur mendalam sendiri: 10 modul bertingkat, dari idiom bahasa sampai praktik lapangan,
            di atas fondasi ini.
          </p>
        </Reveal>
        <ul className="mt-10 divide-y divide-ink-700 border-y border-ink-700">
          {lessons.map((lesson, i) => (
            <Reveal key={lesson.id} delay={Math.min(i * 0.05, 0.3)}>
              <li>
                <Link
                  href="/daftar"
                  className="group flex min-h-[72px] items-center gap-4 py-4 transition-colors hover:bg-ink-800/50 sm:gap-6"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-ink-600 bg-ink-950 font-code text-sm font-semibold text-emas-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-bold">{lesson.title}</span>
                    <span className="mt-0.5 block truncate text-sm text-gading-500">{lesson.summary}</span>
                  </span>
                  <ArrowRight
                    size={20}
                    className="shrink-0 text-gading-500 transition-transform group-hover:translate-x-1 group-hover:text-emas-400"
                    aria-hidden
                  />
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
        <Reveal>
          <p className="mt-4 font-code text-xs text-gading-500">
            {lessonCount} pelajaran, {tantanganCount} tantangan, {proyekCount} proyek. Semua dihitung langsung dari
            database.
          </p>
        </Reveal>
      </section>

      {/* Penutup: satu ajakan, satu tombol */}
      <section className="border-t border-ink-700 bg-ink-800/30">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight">
              Modul pertama cuma butuh satu baris kode
              <span className="anim-caret ml-1 inline-block h-[0.9em] w-[0.14em] translate-y-[0.08em] bg-emas-500" aria-hidden />
            </h2>
            <Link
              href="/daftar"
              className="mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-emas-500 px-8 text-lg font-semibold text-ink-950 transition-transform hover:-translate-y-0.5"
            >
              Mulai dari Baris Pertama
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
