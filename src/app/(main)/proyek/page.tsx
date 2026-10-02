import Link from "next/link";
import { redirect } from "next/navigation";
import { FolderOpen } from "@phosphor-icons/react/dist/ssr";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { Reveal } from "@/components/motion-bits";

export const dynamic = "force-dynamic";
export const metadata = { title: "Proyek" };

export default async function ProyekPage() {
  const user = await getSessionUser();
  if (!user) redirect("/masuk?next=/proyek");
  const [projects, progresses] = await Promise.all([
    db.project.findMany({ orderBy: { xpReward: "asc" } }),
    db.projectProgress.findMany({ where: { userId: user.id } }),
  ]);
  const byProject = new Map(progresses.map((p) => [p.projectId, p]));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Proyek</h1>
      <p className="mt-2 max-w-2xl text-gading-300">
        Latihan terbesar di platform ini: brief nyata, langkah terpandu dengan hint, dan ujian akhir otomatis. Semuanya
        bebas bahasa: pilih bahasa pengerjaan di bagian ujian akhir.
      </p>
      <ul className="mt-8 space-y-2">
        {projects.map((pr, i) => {
          const p = byProject.get(pr.id);
          const done = p?.completed ?? false;
          const final = p?.finalPassed ?? false;
          return (
            <Reveal key={pr.id} delay={Math.min(i * 0.05, 0.3)}>
              <li>
                <Link
                  href={`/proyek/${pr.slug}`}
                  className={`flex min-h-[76px] items-center gap-4 rounded-xl border p-4 transition-colors ${
                    done ? "border-lulus/30 bg-lulus/5 hover:border-lulus/50" : "border-ink-600 bg-ink-800/40 hover:border-ink-500"
                  }`}
                >
                  <FolderOpen size={22} className={done ? "shrink-0 text-lulus" : "shrink-0 text-gading-500"} aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{pr.title}</span>
                    <span className="block truncate text-sm text-gading-500">{pr.summary}</span>
                  </span>
                  <span className="shrink-0 font-code text-xs">
                    {done ? (
                      <span className="rounded-full border border-lulus/40 px-2.5 py-1 text-lulus">tuntas</span>
                    ) : final ? (
                      <span className="rounded-full border border-emas-500/50 px-2.5 py-1 text-emas-400">tinggal checklist</span>
                    ) : (
                      <span className="text-gading-500">+{pr.xpReward} XP</span>
                    )}
                  </span>
                </Link>
              </li>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}
