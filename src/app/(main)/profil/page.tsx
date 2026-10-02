import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { levelFromXp } from "@/lib/gamification";
import { ProfileEditor } from "@/components/ProfileEditor";
import { NameTag } from "@/components/NameTag";
import { Reveal } from "@/components/motion-bits";

export const dynamic = "force-dynamic";
export const metadata = { title: "Profil" };

export default async function ProfilPage() {
  const user = await getSessionUser();
  if (!user) redirect("/masuk?next=/profil");

  const [submissions, lessonDone] = await Promise.all([
    db.submission.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { challenge: { select: { title: true, slug: true } } },
    }),
    db.lessonProgress.count({ where: { userId: user.id, completed: true } }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
      <p className="mt-2 text-gading-300">
        Foto profil boleh GIF, warna dan efek nama terserah kamu. Nama ini yang tampil di papan peringkat.
      </p>

      <div className="mt-8">
        <ProfileEditor user={user} />
      </div>

      <section aria-label="Ringkasan aktivitas" className="mt-12">
        <h2 className="text-xl font-bold">Ringkasan aktivitas</h2>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-ink-600 bg-ink-800/40 p-4">
            <dt className="font-code text-[0.68rem] uppercase tracking-wide text-gading-500">Level</dt>
            <dd className="mt-1 font-code text-2xl font-semibold text-emas-400">{levelFromXp(user.xp)}</dd>
          </div>
          <div className="rounded-xl border border-ink-600 bg-ink-800/40 p-4">
            <dt className="font-code text-[0.68rem] uppercase tracking-wide text-gading-500">Total XP</dt>
            <dd className="mt-1 font-code text-2xl font-semibold text-emas-400">{user.xp}</dd>
          </div>
          <div className="rounded-xl border border-ink-600 bg-ink-800/40 p-4">
            <dt className="font-code text-[0.68rem] uppercase tracking-wide text-gading-500">Pelajaran tuntas</dt>
            <dd className="mt-1 font-code text-2xl font-semibold text-emas-400">{lessonDone}</dd>
          </div>
          <div className="rounded-xl border border-ink-600 bg-ink-800/40 p-4">
            <dt className="font-code text-[0.68rem] uppercase tracking-wide text-gading-500">Streak</dt>
            <dd className="mt-1 font-code text-2xl font-semibold text-emas-400">{user.streakCount} hari</dd>
          </div>
        </dl>
      </section>

      <section aria-label="Riwayat submission" className="mt-12">
        <h2 className="text-xl font-bold">Submission terakhir</h2>
        {submissions.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-ink-600 bg-ink-800/40 p-8 text-center">
            <p className="font-semibold">Belum ada submission.</p>
            <p className="mt-1 text-sm text-gading-500">
              Setiap kode yang kamu uji di tantangan akan tercatat di sini beserta hasilnya.
            </p>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-ink-700 rounded-2xl border border-ink-600 bg-ink-800/40">
            {submissions.map((s) => (
              <Reveal key={s.id}>
                <li className="flex flex-wrap items-center gap-3 p-4 text-sm">
                  <span
                    className={`rounded-full px-2.5 py-1 font-code text-[0.68rem] uppercase ${
                      s.passed ? "border border-lulus/40 text-lulus" : "border border-gagal/40 text-gagal"
                    }`}
                  >
                    {s.passed ? "lulus" : "gagal"}
                  </span>
                  {s.challenge ? (
                    <a href={`/tantangan/${s.challenge.slug}`} className="font-semibold hover:underline">
                      {s.challenge.title}
                    </a>
                  ) : (
                    <span className="text-gading-500">latihan kode pelajaran</span>
                  )}
                  <span className="ml-auto font-code text-xs text-gading-500">
                    {s.language} , {new Date(s.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                </li>
              </Reveal>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-10 text-xs text-gading-500">
        Masuk sebagai <NameTag name={user.username} color={user.nameColor} effect={user.nameEffect} /> ({user.email})
      </p>
    </div>
  );
}
