import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";

// Impor hasil ekspor SQLite (scripts/data-migrasi.json) ke database baru
// (Supabase/Postgres). Jalankan SETELAH `prisma db push` + `db:seed`, supaya
// slug lesson/challenge/project sudah ada untuk dipetakan.
//   npx tsx scripts/impor-supabase.ts

type Dump = {
  lessons: Record<string, string>;
  challenges: Record<string, string>;
  projects: Record<string, string>;
  users: {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
    avatarUrl: string | null;
    nameColor: string;
    nameEffect: string;
    preferredLang: string;
    xp: number;
    streakCount: number;
    lastActiveAt: string | null;
    createdAt: string;
  }[];
  submissions: {
    userId: string;
    challengeSlug: string | null;
    language: string;
    code: string;
    passed: boolean;
    createdAt: string;
  }[];
  lessonProgress: {
    userId: string;
    lessonSlug: string | null;
    completedSteps: string;
    completed: boolean;
    updatedAt: string;
  }[];
  projectProgress: {
    userId: string;
    projectSlug: string | null;
    doneSteps: string;
    finalPassed: boolean;
    completed: boolean;
    updatedAt: string;
  }[];
};

const db = new PrismaClient();

async function main() {
  const dump: Dump = JSON.parse(readFileSync("scripts/data-migrasi.json", "utf8"));

  // 1. user: salin apa adanya (passwordHash ikut, jadi login tetap jalan)
  for (const u of dump.users) {
    await db.user.upsert({
      where: { email: u.email },
      create: {
        email: u.email,
        username: u.username,
        passwordHash: u.passwordHash,
        avatarUrl: u.avatarUrl,
        nameColor: u.nameColor,
        nameEffect: u.nameEffect,
        preferredLang: u.preferredLang ?? "python",
        xp: u.xp,
        streakCount: u.streakCount,
        lastActiveAt: u.lastActiveAt ? new Date(u.lastActiveAt) : null,
        createdAt: new Date(u.createdAt),
      },
      update: { xp: u.xp, streakCount: u.streakCount },
    });
  }
  console.log(`user: ${dump.users.length} tersinkron`);

  // peta id lama -> user baru (email adalah kunci stabilnya)
  const usersBaru = await db.user.findMany({ select: { id: true, email: true } });
  const emailByOldId = new Map(dump.users.map((u) => [u.id, u.email]));
  const idBaru = (oldId: string): string | null => {
    const email = emailByOldId.get(oldId);
    if (!email) return null;
    return usersBaru.find((u) => u.email === email)?.id ?? null;
  };

  // 2. submission (dipetakan via slug tantangan)
  const challenges = await db.challenge.findMany({ select: { id: true, slug: true } });
  const challengeBySlug = new Map(challenges.map((c) => [c.slug, c.id]));
  let sub = 0;
  for (const s of dump.submissions) {
    const uid = idBaru(s.userId);
    if (!uid) continue;
    await db.submission.create({
      data: {
        userId: uid,
        challengeId: s.challengeSlug ? (challengeBySlug.get(s.challengeSlug) ?? null) : null,
        language: s.language,
        code: s.code,
        passed: s.passed,
        createdAt: new Date(s.createdAt),
      },
    });
    sub++;
  }
  console.log(`submission: ${sub} diimpor`);

  // 3. lessonProgress (dipetakan via slug lesson)
  const lessons = await db.lesson.findMany({ select: { id: true, slug: true } });
  const lessonBySlug = new Map(lessons.map((l) => [l.slug, l.id]));
  let lp = 0;
  for (const p of dump.lessonProgress) {
    const uid = idBaru(p.userId);
    const lid = p.lessonSlug ? lessonBySlug.get(p.lessonSlug) : null;
    if (!uid || !lid) continue;
    await db.lessonProgress.upsert({
      where: { userId_lessonId: { userId: uid, lessonId: lid } },
      create: { userId: uid, lessonId: lid, completedSteps: p.completedSteps, completed: p.completed },
      update: { completedSteps: p.completedSteps, completed: p.completed },
    });
    lp++;
  }
  console.log(`lessonProgress: ${lp} diimpor`);

  // 4. projectProgress (dipetakan via slug proyek)
  const projects = await db.project.findMany({ select: { id: true, slug: true } });
  const projectBySlug = new Map(projects.map((p) => [p.slug, p.id]));
  let pp = 0;
  for (const p of dump.projectProgress) {
    const uid = idBaru(p.userId);
    const pid = p.projectSlug ? projectBySlug.get(p.projectSlug) : null;
    if (!uid || !pid) continue;
    await db.projectProgress.upsert({
      where: { userId_projectId: { userId: uid, projectId: pid } },
      create: {
        userId: uid,
        projectId: pid,
        doneSteps: p.doneSteps,
        finalPassed: p.finalPassed,
        completed: p.completed,
      },
      update: { doneSteps: p.doneSteps, finalPassed: p.finalPassed, completed: p.completed },
    });
    pp++;
  }
  console.log(`projectProgress: ${pp} diimpor`);
  console.log("MIGRASI SELESAI");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
