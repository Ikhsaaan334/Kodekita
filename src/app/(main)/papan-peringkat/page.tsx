import { redirect } from "next/navigation";
import { Flame } from "@phosphor-icons/react/dist/ssr";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { levelFromXp } from "@/lib/gamification";
import { Avatar } from "@/components/Avatar";
import { NameTag } from "@/components/NameTag";
import { Reveal } from "@/components/motion-bits";

export const dynamic = "force-dynamic";
export const metadata = { title: "Papan Peringkat" };

export default async function PapanPeringkatPage() {
  const user = await getSessionUser();
  if (!user) redirect("/masuk?next=/papan-peringkat");

  const top = await db.user.findMany({
    orderBy: [{ xp: "desc" }, { createdAt: "asc" }],
    take: 50,
    select: { id: true, username: true, avatarUrl: true, nameColor: true, nameEffect: true, xp: true, streakCount: true },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Papan Peringkat</h1>
      <p className="mt-2 text-gading-300">
        Peringkat dihitung dari XP nyata yang terkumpul. Semua nama di sini dipasang oleh pemiliknya, lengkap dengan
        warna dan efeknya masing-masing.
      </p>
      <ol className="mt-8 space-y-2">
        {top.map((u, i) => {
          const me = u.id === user.id;
          return (
            <Reveal key={u.id} delay={Math.min(i * 0.03, 0.25)}>
              <li
                className={`flex min-h-[64px] items-center gap-4 rounded-xl border p-4 ${
                  me ? "border-emas-500 bg-emas-500/10" : "border-ink-600 bg-ink-800/40"
                }`}
              >
                <span className="w-8 shrink-0 text-center font-code text-lg font-semibold text-gading-500">{i + 1}</span>
                <Avatar url={u.avatarUrl} name={u.username} size={40} />
                <span className="min-w-0 flex-1">
                  <NameTag name={u.username} color={u.nameColor} effect={u.nameEffect} className="text-lg" />
                  {me && <span className="ml-2 font-code text-[0.68rem] uppercase text-emas-400">kamu</span>}
                  <span className="block font-code text-xs text-gading-500">level {levelFromXp(u.xp)}</span>
                </span>
                <span className="flex shrink-0 items-center gap-1 font-code text-sm text-gading-300" title="Streak harian">
                  <Flame size={14} className={u.streakCount > 0 ? "text-emas-400" : "text-gading-500"} aria-hidden />
                  {u.streakCount}
                </span>
                <span className="w-20 shrink-0 text-right font-code font-semibold text-emas-400">{u.xp} XP</span>
              </li>
            </Reveal>
          );
        })}
      </ol>
      {top.length <= 1 && (
        <p className="mt-4 rounded-2xl border border-ink-600 bg-ink-800/40 p-6 text-sm text-gading-300">
          Baru ada satu pemain terdaftar. Ajak temanmu bergabung supaya papan ini hidup.
        </p>
      )}
    </div>
  );
}
