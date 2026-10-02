import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Flame } from "@phosphor-icons/react/dist/ssr";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { levelFromXp, xpForNextLevel } from "@/lib/gamification";
import { LANGUAGES, isLangId } from "@/lib/languages";
import { NameTag } from "@/components/NameTag";
import { Reveal } from "@/components/motion-bits";

export const dynamic = "force-dynamic";
export const metadata = { title: "Belajar" };

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/masuk?next=/belajar");

  // query yang independen dikirim serentak: tiap ronde jaringan ke Supabase mahal,
  // dan kolom steps yang berat tidak ikut ditarik untuk sekadar daftar judul
  const [tracks, progresses, solvedCount, tantanganTotal, proyekTuntas, proyekTotal, pengumuman] = await Promise.all([
    db.track.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        tagline: true,
        order: true,
        modules: {
          orderBy: { order: "asc" },
          select: {
            order: true,
            lessons: {
              orderBy: { order: "asc" },
              select: { id: true, slug: true, title: true, summary: true, order: true },
            },
          },
        },
      },
    }),
    db.lessonProgress.findMany({ where: { userId: user.id }, orderBy: { updatedAt: "desc" } }),
    db.submission.count({ where: { userId: user.id, passed: true, challengeId: { not: null } } }),
    db.challenge.count(),
    db.projectProgress.count({ where: { userId: user.id, completed: true } }),
    db.project.count(),
    db.announcement.findFirst({ where: { active: true }, orderBy: { createdAt: "desc" } }),
  ]);
  const track = tracks.find((t) => t.slug === "fondasi") ?? tracks[0];
  const jalur = tracks.filter((t) => t.slug !== "fondasi");

  const progressByLesson = new Map(progresses.map((p) => [p.lessonId, p]));
  const lessons = track?.modules.flatMap((m) => m.lessons) ?? [];
  const doneCount = lessons.filter((l) => progressByLesson.get(l.id)?.completed).length;
  const level = levelFromXp(user.xp);
  const lvl = xpForNextLevel(user.xp);

  // satu keputusan di layar ini: lanjut dari mana
  const started = progresses.find((p) => !p.completed);
  let continueHref: string | null = null;
  let continueTitle: string | null = null;
  let continueSub: string | null = null;
  if (started) {
    const lesson = lessons.find((l) => l.id === started.lessonId);
    if (lesson && track) {
      continueHref = `/belajar/${track.slug}/${lesson.slug}`;
      continueTitle = lesson.title;
      continueSub = "pelajaran yang setengah jalan";
    }
  }
  if (!continueHref && track && lessons[0]) {
    continueHref = `/belajar/${track.slug}/${lessons[0].slug}`;
    continueTitle = lessons[0].title;
    continueSub = "mulai pelajaran pertama";
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Halo, <NameTag name={user.username} color={user.nameColor} effect={user.nameEffect} />
          </h1>
          <p className="mt-1 text-gading-300">
            Level {level} , {lvl.nextXp - user.xp} XP lagi menuju level {level + 1}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-xl border border-ink-600 bg-ink-800/50 px-3 py-2 font-code text-xs"
            title="Bahasa yang aktif saat kamu membuka pelajaran; bisa diganti kapan saja di halaman pelajaran"
          >
            bahasa utama: {LANGUAGES[isLangId(user.preferredLang) ? user.preferredLang : "python"].label}
          </span>
          <div className="flex items-center gap-2 rounded-xl border border-ink-600 bg-ink-800/50 px-4 py-3" title="Hari berturut-turut ada aktivitas">
            <Flame size={20} className={user.streakCount > 0 ? "text-emas-400" : "text-gading-500"} aria-hidden />
            <span className="font-code font-semibold">{user.streakCount} hari</span>
          </div>
        </div>
      </header>

      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-ink-700"
        role="progressbar"
        aria-label="Kemajuan XP ke level berikutnya"
        aria-valuenow={Math.round(lvl.progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full rounded-full bg-emas-500" style={{ width: `${Math.max(lvl.progress * 100, 2)}%` }} />
      </div>
      <p className="mt-1 font-code text-xs text-gading-500">
        {user.xp} / {lvl.nextXp} XP
      </p>

      {pengumuman && (
        <Reveal>
          <aside aria-label="Pengumuman" className="mt-8 rounded-2xl border border-emas-600/40 bg-emas-500/10 p-5">
            <p className="font-code text-xs uppercase tracking-wide text-emas-400">Pengumuman</p>
            <p className="mt-1 text-lg font-bold text-gading-50">{pengumuman.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-gading-300">{pengumuman.body}</p>
          </aside>
        </Reveal>
      )}

      {continueHref && continueTitle && (
        <Reveal>
          <Link
            href={continueHref}
            className="group mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emas-600/40 bg-gradient-to-l from-emas-500/10 to-transparent p-6 transition-colors hover:border-emas-500"
          >
            <div>
              <p className="font-code text-xs uppercase tracking-wide text-emas-400">{continueSub}</p>
              <p className="mt-1 text-2xl font-bold">{continueTitle}</p>
              <p className="mt-1 text-sm text-gading-500">Soalnya sama untuk semua bahasa, pilih bahasa di atas editor.</p>
            </div>
            <span className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emas-500 px-5 font-semibold text-ink-950 transition-transform group-hover:-translate-y-0.5">
              Buka pelajaran
              <ArrowRight size={18} aria-hidden />
            </span>
          </Link>
        </Reveal>
      )}

      <section aria-label="Kemajuan kurikulum" className="mt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-2xl font-bold tracking-tight">Kemajuan kurikulummu</h2>
          <p className="font-code text-xs text-gading-500">
            {doneCount}/{lessons.length} pelajaran fondasi, {solvedCount}/{tantanganTotal} tantangan lulus, {proyekTuntas}/{proyekTotal} proyek tuntas
          </p>
        </div>
        <ol className="mt-6 space-y-2">
          {lessons.map((lesson, i) => {
            const p = progressByLesson.get(lesson.id);
            const done = p?.completed ?? false;
            const setengah = !done && p && (JSON.parse(p.completedSteps) as number[]).length > 0;
            return (
              <Reveal key={lesson.id} delay={Math.min(i * 0.05, 0.3)}>
                <li>
                  <Link
                    href={track ? `/belajar/${track.slug}/${lesson.slug}` : "/belajar"}
                    className={`flex min-h-[64px] items-center gap-4 rounded-xl border p-4 transition-colors ${
                      done
                        ? "border-lulus/30 bg-lulus/5 hover:border-lulus/50"
                        : setengah
                          ? "border-emas-600/40 bg-emas-500/5 hover:border-emas-500/70"
                          : "border-ink-600 bg-ink-800/40 hover:border-ink-500"
                    }`}
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-ink-600 bg-ink-950 font-code text-sm text-emas-400">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{lesson.title}</span>
                      <span className="block truncate text-sm text-gading-500">{lesson.summary}</span>
                    </span>
                    {done && <span className="shrink-0 font-code text-xs text-lulus">tuntas</span>}
                    {setengah && <span className="shrink-0 font-code text-xs text-emas-400">setengah jalan</span>}
                  </Link>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </section>

      {jalur.length > 0 && (
        <section aria-label="Jalur mendalam per bahasa" className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">Jalur mendalam per bahasa</h2>
          <p className="mt-2 max-w-2xl text-gading-300">
            Setelah fondasi, turuni jalur bahasa pilihanmu: 10 modul bertingkat per bahasa, dari idiom sampai topik
            ekosistem dan praktik lapangan.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jalur.map((t) => {
              const ls = t.modules.flatMap((m) => m.lessons);
              const d = ls.filter((l) => progressByLesson.get(l.id)?.completed).length;
              const pct = ls.length ? Math.round((d / ls.length) * 100) : 0;
              const next = ls.find((l) => !progressByLesson.get(l.id)?.completed);
              return (
                <Reveal key={t.slug} delay={Math.min(t.order * 0.05, 0.3)}>
                  <Link
                    href={`/belajar/${t.slug}`}
                    className="flex h-full min-h-[168px] flex-col rounded-2xl border border-ink-600 bg-ink-800/40 p-5 transition-colors hover:border-ink-500"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-bold">{t.name}</h3>
                      <span className="font-code text-xs text-gading-500">{pct}%</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-gading-500">
                      {next ? `Berikutnya: ${next.title}` : "Semua materi tuntas"}
                    </p>
                    <div className="mt-auto pt-4">
                      <div className="h-1.5 overflow-hidden rounded-full bg-ink-700" aria-hidden>
                        <div className="h-full rounded-full bg-emas-500" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="mt-2 font-code text-xs text-gading-500">{d}/{ls.length} materi</p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
