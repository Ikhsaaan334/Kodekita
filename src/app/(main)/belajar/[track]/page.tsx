import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle, Circle, Trophy, FolderOpen } from "@phosphor-icons/react/dist/ssr";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { availabilityMap } from "@/lib/runner";
import { LANG_IDS, LANGUAGES } from "@/lib/languages";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  const t = await db.track.findUnique({ where: { slug: track } });
  return { title: t ? t.name : "Jalur tidak ditemukan" };
}

export default async function TrackPage({ params }: { params: Promise<{ track: string }> }) {
  const { track: slug } = await params;
  const user = await getSessionUser();
  if (!user) redirect(`/masuk?next=/belajar/${slug}`);
  const track = await db.track.findUnique({
    where: { slug },
    // halaman ini cuma butuh judul/ringkasan; steps berat tidak ditarik
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      modules: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          description: true,
          order: true,
          lessons: {
            orderBy: { order: "asc" },
            select: { id: true, slug: true, title: true, summary: true, order: true, xpReward: true },
          },
        },
      },
    },
  });
  if (!track) notFound();

  const [progresses, avail, tantanganCount, proyekCount] = await Promise.all([
    db.lessonProgress.findMany({ where: { userId: user.id } }),
    availabilityMap(),
    db.challenge.count(),
    db.project.count(),
  ]);
  const progressByLesson = new Map(progresses.map((p) => [p.lessonId, p]));
  const availableLangs = LANG_IDS.filter((id) => avail[id].available);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header>
        <Link href="/belajar" className="text-sm text-gading-500 transition-colors hover:text-gading-50">
          Beranda belajar
        </Link>
        <h1 className="mt-1 text-4xl font-bold tracking-tight">{track.name}</h1>
        <p className="mt-2 max-w-2xl text-gading-300">{track.description}</p>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-ink-600 bg-ink-800/60 px-3 py-1.5 font-code text-xs">
          <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-lulus" />
          Bisa dipraktikkan di: {availableLangs.map((l) => LANGUAGES[l].label).join(", ")}
        </p>
      </header>

      {track.modules.map((mod) => (
        <section key={mod.id} aria-label={mod.title} className="mt-10">
          <h2 className="text-xl font-bold">{mod.title}</h2>
          <p className="mt-1 text-sm text-gading-500">{mod.description}</p>
          <ol className="mt-4 space-y-2">
            {mod.lessons.map((lesson, i) => {
              const p = progressByLesson.get(lesson.id);
              const done = p?.completed ?? false;
              return (
                <li key={lesson.id}>
                  <Link
                    href={`/belajar/${track.slug}/${lesson.slug}`}
                    className={`flex min-h-[64px] items-center gap-4 rounded-xl border p-4 transition-colors ${
                      done ? "border-lulus/30 bg-lulus/5 hover:border-lulus/50" : "border-ink-600 bg-ink-800/40 hover:border-ink-500"
                    }`}
                  >
                    {done ? (
                      <CheckCircle size={22} className="shrink-0 text-lulus" aria-hidden />
                    ) : (
                      <Circle size={22} className="shrink-0 text-gading-500" aria-hidden />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">
                        {i + 1}. {lesson.title}
                      </span>
                      <span className="block truncate text-sm text-gading-500">{lesson.summary}</span>
                    </span>
                    <span className="shrink-0 font-code text-xs text-gading-500">+{lesson.xpReward} XP</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ))}

      <section aria-label="Lanjutan" className="mt-12 grid gap-4 sm:grid-cols-2">
        <Link
          href="/tantangan"
          className="flex min-h-[72px] items-center gap-4 rounded-2xl border border-ink-600 bg-ink-800/40 p-5 transition-colors hover:border-ink-500"
        >
          <Trophy size={22} className="shrink-0 text-emas-400" aria-hidden />
          <span>
            <span className="block font-semibold">Tantangan algoritma</span>
            <span className="block text-sm text-gading-500">{tantanganCount} soal, kerjakan di bahasa mana pun</span>
          </span>
        </Link>
        <Link
          href="/proyek"
          className="flex min-h-[72px] items-center gap-4 rounded-2xl border border-ink-600 bg-ink-800/40 p-5 transition-colors hover:border-ink-500"
        >
          <FolderOpen size={22} className="shrink-0 text-emas-400" aria-hidden />
          <span>
            <span className="block font-semibold">Proyek</span>
            <span className="block text-sm text-gading-500">{proyekCount} proyek terpandu, bebas bahasa</span>
          </span>
        </Link>
      </section>
    </div>
  );
}
