import Link from "next/link";
import { redirect } from "next/navigation";
import { Trophy } from "@phosphor-icons/react/dist/ssr";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { Reveal } from "@/components/motion-bits";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tantangan" };

const DIFFICULTIES = ["mudah", "sedang", "sulit"] as const;

export default async function TantanganPage({
  searchParams,
}: {
  searchParams: Promise<{ difficulty?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/masuk?next=/tantangan");
  const { difficulty } = await searchParams;

  const where: { difficulty?: string } = {};
  if (difficulty && (DIFFICULTIES as readonly string[]).includes(difficulty)) where.difficulty = difficulty;

  const [challenges, passed] = await Promise.all([
    db.challenge.findMany({
      where,
      orderBy: { xpReward: "asc" },
    }),
    db.submission.findMany({
      where: { userId: user.id, passed: true, challengeId: { not: null } },
      select: { challengeId: true },
    }),
  ]);
  const passedIds = new Set(passed.map((s) => s.challengeId));

  const chip = (active: boolean) =>
    `min-h-[44px] inline-flex items-center rounded-full border px-4 text-sm font-semibold transition-colors ${
      active ? "border-emas-500 bg-emas-500/15 text-emas-300" : "border-ink-600 text-gading-300 hover:border-ink-500"
    }`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Tantangan</h1>
      <p className="mt-2 max-w-2xl text-gading-300">
        Soal mandiri dengan test tersembunyi, semuanya bebas bahasa: pilih bahasa pengerjaan di atas editor saat
        mengerjakan. Setiap soal menyebut format input dan outputnya dengan jelas.
      </p>

      <div className="mt-6 flex flex-wrap gap-2" aria-label="Filter tingkat kesulitan">
        <Link href="/tantangan" className={chip(!difficulty)}>
          Semua tingkat
        </Link>
        {DIFFICULTIES.map((d) => (
          <Link key={d} href={`/tantangan?difficulty=${d}`} className={chip(difficulty === d)}>
            {d}
          </Link>
        ))}
      </div>

      {challenges.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-ink-600 bg-ink-800/40 p-8 text-center">
          <p className="font-semibold">Tidak ada tantangan untuk filter ini.</p>
          <p className="mt-1 text-sm text-gading-500">Coba pilih tingkat kesulitan lain.</p>
          <Link href="/tantangan" className="mt-4 inline-flex min-h-[44px] items-center rounded-xl border border-ink-500 px-4 font-semibold transition-colors hover:bg-ink-700">
            Reset filter
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-2">
          {challenges.map((ch, i) => {
            const solved = passedIds.has(ch.id);
            return (
              <Reveal key={ch.id} delay={Math.min(i * 0.04, 0.25)}>
                <li>
                  <Link
                    href={`/tantangan/${ch.slug}`}
                    className={`flex min-h-[68px] items-center gap-4 rounded-xl border p-4 transition-colors ${
                      solved ? "border-lulus/30 bg-lulus/5 hover:border-lulus/50" : "border-ink-600 bg-ink-800/40 hover:border-ink-500"
                    }`}
                  >
                    <Trophy size={20} className={solved ? "shrink-0 text-lulus" : "shrink-0 text-gading-500"} aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{ch.title}</span>
                      <span className="block text-sm text-gading-500">{ch.difficulty} , bebas bahasa</span>
                    </span>
                    <span className="hidden shrink-0 font-code text-xs text-gading-500 sm:block">+{ch.xpReward} XP</span>
                    {solved && <span className="shrink-0 rounded-full border border-lulus/40 px-2.5 py-1 font-code text-[0.68rem] uppercase text-lulus">lulus</span>}
                  </Link>
                </li>
              </Reveal>
            );
          })}
        </ul>
      )}
    </div>
  );
}
