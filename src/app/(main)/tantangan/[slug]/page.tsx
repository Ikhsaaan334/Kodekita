import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { availabilityMap } from "@/lib/runner";
import { LANG_IDS, type LangId } from "@/lib/languages";
import { Markdown } from "@/components/Markdown";
import { ChallengeWorkspace } from "@/components/ChallengeWorkspace";
import type { TestCase } from "@content/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ch = await db.challenge.findUnique({ where: { slug } });
  return { title: ch?.title ?? "Tantangan tidak ditemukan" };
}

export default async function ChallengeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await getSessionUser();
  if (!user) redirect(`/masuk?next=/tantangan/${slug}`);

  const challenge = await db.challenge.findUnique({
    where: { slug },
    include: { track: { select: { slug: true, name: true } } },
  });
  if (!challenge) notFound();

  const tests = JSON.parse(challenge.tests) as TestCase[];
  const publicTests = tests.filter((t) => !t.hidden);
  const solved = await db.submission.findFirst({
    where: { userId: user.id, challengeId: challenge.id, passed: true },
    select: { id: true },
  });

  // tantangan lintas-bahasa: starter per bahasa + daftar runtime yang benar-benar jalan di server ini
  const global = challenge.trackId === null || challenge.track === null;
  let starters: Record<string, string>;
  let availableLangs: LangId[];
  let trackName: string | undefined;
  if (global) {
    starters = JSON.parse(challenge.starterByLang ?? "{}") as Record<string, string>;
    if (!Object.keys(starters).length) starters = { python: challenge.starterCode };
    const avail = await availabilityMap();
    availableLangs = LANG_IDS.filter((id) => avail[id].available);
  } else {
    const trackSlug = challenge.track!.slug;
    starters = { [trackSlug]: challenge.starterCode };
    availableLangs = [trackSlug as LangId];
    trackName = challenge.track!.name;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/tantangan" className="text-sm text-gading-500 transition-colors hover:text-gading-50">
        Semua tantangan
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.15fr]">
        <section aria-label="Soal">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{challenge.title}</h1>
            <span
              className={`rounded-full border px-2.5 py-1 font-code text-[0.68rem] uppercase tracking-wide ${
                challenge.difficulty === "mudah"
                  ? "border-lulus/40 text-lulus"
                  : challenge.difficulty === "sedang"
                    ? "border-emas-500/50 text-emas-400"
                    : "border-gagal/40 text-gagal"
              }`}
            >
              {challenge.difficulty}
            </span>
            <span className="font-code text-xs text-gading-500">+{challenge.xpReward} XP</span>
          </div>
          <p className="mt-2 text-sm text-gading-500">
            {global ? "Koleksi algoritma, kerjakan di bahasa mana pun" : `Bahasa: ${trackName}`}
          </p>
          <div className="mt-6">
            <Markdown text={challenge.statement} />
          </div>
          <div className="mt-6 rounded-xl border border-ink-600 bg-ink-800/40 p-4 text-sm text-gading-300">
            <p className="font-semibold text-gading-50">Cara dinilai</p>
            <p className="mt-1">
              Kode kamu dijalankan {tests.length} kali dengan input berbeda. {publicTests.length} test terbuka (detailnya
              tampil), {tests.length - publicTests.length} test tersembunyi. Keluaran dibandingkan persis, abaikan spasi
              di akhir baris.
            </p>
          </div>
        </section>
        <section aria-label="Editor solusi">
          <ChallengeWorkspace
            slug={challenge.slug}
            starters={starters}
            availableLangs={availableLangs}
            totalTests={tests.length}
            hints={JSON.parse(challenge.hints) as string[]}
            solved={solved !== null}
            backHref="/tantangan"
            trackName={trackName}
          />
        </section>
      </div>
    </div>
  );
}
