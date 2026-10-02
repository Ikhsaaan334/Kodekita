import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { availabilityMap } from "@/lib/runner";
import { LANG_IDS, type LangId } from "@/lib/languages";
import { LessonStepPlayer } from "@/components/LessonStepPlayer";
import type { LessonProgressDto } from "@/lib/client-types";
import type { AgnosticStep } from "@content/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ track: string; lesson: string }> }) {
  const { lesson: lessonSlug } = await params;
  const lesson = await db.lesson.findFirst({ where: { slug: lessonSlug } });
  return { title: lesson?.title ?? "Pelajaran tidak ditemukan" };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ track: string; lesson: string }>;
}) {
  const { track: trackSlug, lesson: lessonSlug } = await params;
  const user = await getSessionUser();
  if (!user) redirect(`/masuk?next=/belajar/${trackSlug}/${lessonSlug}`);

  const lesson = await db.lesson.findFirst({
    where: { slug: lessonSlug, module: { track: { slug: trackSlug } } },
    include: { module: { include: { track: true } } },
  });
  if (!lesson) notFound();

  const trackLessons = await db.lesson.findMany({
    where: { module: { track: { slug: trackSlug } } },
    orderBy: [{ module: { order: "asc" } }, { order: "asc" }],
    select: { id: true, slug: true },
  });
  const idx = trackLessons.findIndex((l) => l.id === lesson.id);
  const next = idx >= 0 && idx < trackLessons.length - 1 ? trackLessons[idx + 1] : null;

  const existing = await db.lessonProgress.findUnique({
    where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
  });
  const initialProgress: LessonProgressDto = {
    completedSteps: existing ? JSON.parse(existing.completedSteps) : [],
    completed: existing?.completed ?? false,
  };

  const avail = await availabilityMap();
  const availableLangs = LANG_IDS.filter((id) => avail[id].available);

  // semua track menyimpan steps dalam bentuk agnostic (jalur dinormalisasi saat seed)
  const steps = JSON.parse(lesson.steps) as AgnosticStep[];

  return (
    <LessonStepPlayer
      lesson={{ id: lesson.id, title: lesson.title, steps }}
      availableLangs={availableLangs}
      initialLang={user.preferredLang}
      trackTitle={lesson.module.track.name}
      trackHref={`/belajar/${trackSlug}`}
      nextHref={next ? `/belajar/${trackSlug}/${next.slug}` : null}
      initialProgress={initialProgress}
    />
  );
}
