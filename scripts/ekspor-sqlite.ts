import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "node:fs";

// Ekspor data dari SQLite lokal ke JSON, sebagai bekal migrasi ke Supabase/Postgres.
// Jalankan SEBELUM `prisma generate` versi postgres (client sqlite masih terpasang).
// Berkas berisi passwordHash: jangan di-commit.

const db = new PrismaClient();

async function main() {
  const [users, submissions, lessonProgress, projectProgress, lessons, challenges, projects] =
    await Promise.all([
      db.user.findMany(),
      db.submission.findMany(),
      db.lessonProgress.findMany(),
      db.projectProgress.findMany(),
      db.lesson.findMany({ select: { id: true, slug: true } }),
      db.challenge.findMany({ select: { id: true, slug: true } }),
      db.project.findMany({ select: { id: true, slug: true } }),
    ]);

  const data = {
    diekspor: new Date().toISOString(),
    lessons: Object.fromEntries(lessons.map((l) => [l.id, l.slug])),
    challenges: Object.fromEntries(challenges.map((c) => [c.id, c.slug])),
    projects: Object.fromEntries(projects.map((p) => [p.id, p.slug])),
    users,
    submissions: submissions.map((s) => ({
      userEmail: null as string | null,
      userId: s.userId,
      challengeSlug: s.challengeId
        ? Object.fromEntries(challenges.map((c) => [c.id, c.slug]))[s.challengeId] ?? null
        : null,
      language: s.language,
      code: s.code,
      passed: s.passed,
      createdAt: s.createdAt,
    })),
    lessonProgress: lessonProgress.map((p) => ({
      userId: p.userId,
      lessonSlug: Object.fromEntries(lessons.map((l) => [l.id, l.slug]))[p.lessonId] ?? null,
      completedSteps: p.completedSteps,
      completed: p.completed,
      updatedAt: p.updatedAt,
    })),
    projectProgress: projectProgress.map((p) => ({
      userId: p.userId,
      projectSlug: Object.fromEntries(projects.map((p2) => [p2.id, p2.slug]))[p.projectId] ?? null,
      doneSteps: p.doneSteps,
      finalPassed: p.finalPassed,
      completed: p.completed,
      updatedAt: p.updatedAt,
    })),
  };

  writeFileSync("scripts/data-migrasi.json", JSON.stringify(data, null, 1), "utf8");
  console.log(`diekspor: ${users.length} user, ${submissions.length} submission, ${lessonProgress.length} lessonProgress, ${projectProgress.length} projectProgress`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
