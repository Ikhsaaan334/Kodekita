import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { availabilityMap } from "@/lib/runner";
import { LANG_IDS, type LangId } from "@/lib/languages";
import { Markdown } from "@/components/Markdown";
import { ProjectWorkspace } from "@/components/ProjectWorkspace";
import type { ProjectProgressDto } from "@/lib/client-types";
import type { ProjectStepContent } from "@content/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pr = await db.project.findUnique({ where: { slug } });
  return { title: pr?.title ?? "Proyek tidak ditemukan" };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await getSessionUser();
  if (!user) redirect(`/masuk?next=/proyek/${slug}`);

  const project = await db.project.findUnique({ where: { slug } });
  if (!project) notFound();

  const existing = await db.projectProgress.findUnique({
    where: { userId_projectId: { userId: user.id, projectId: project.id } },
  });
  const initialProgress: ProjectProgressDto = {
    doneSteps: existing ? JSON.parse(existing.doneSteps) : [],
    finalPassed: existing?.finalPassed ?? false,
    completed: existing?.completed ?? false,
  };

  const avail = await availabilityMap();
  const availableLangs = LANG_IDS.filter((id) => avail[id].available);
  let starters: Record<string, string> = {};
  try {
    starters = JSON.parse(project.starterByLang ?? "{}") as Record<string, string>;
  } catch {
    starters = {};
  }
  if (!Object.keys(starters).length) starters = { python: "# tulis solusimu\n" };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/proyek" className="text-sm text-gading-500 transition-colors hover:text-gading-50">
        Semua proyek
      </Link>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
        <span className="font-code text-xs text-gading-500">+{project.xpReward} XP</span>
      </div>
      <p className="mt-1 text-sm text-gading-500">Bebas bahasa: pilih bahasa pengerjaan di bagian ujian akhir.</p>

      <section aria-label="Brief proyek" className="mt-6 rounded-2xl border border-ink-600 bg-ink-800/40 p-6">
        <Markdown text={project.brief} />
      </section>

      <div className="mt-8">
        <ProjectWorkspace
          project={{
            id: project.id,
            slug: project.slug,
            title: project.title,
            brief: project.brief,
            steps: JSON.parse(project.steps) as ProjectStepContent[],
          }}
          starters={starters}
          availableLangs={availableLangs}
          initialLang={user.preferredLang}
          hasFinalTests={project.finalTests !== null}
          initialProgress={initialProgress}
          backHref="/proyek"
        />
      </div>
    </div>
  );
}
