import { db } from "./db";
import { awardXp } from "./gamification";

export async function markLessonStep(userId: string, lessonId: string, stepIndex: number) {
  const lesson = await db.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) return null;
  const total = (JSON.parse(lesson.steps) as unknown[]).length;
  const existing = await db.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });
  const done = new Set<number>(existing ? JSON.parse(existing.completedSteps) : []);
  done.add(stepIndex);
  const completedSteps = [...done].filter((i) => i < total).sort((a, b) => a - b);
  const completed = completedSteps.length >= total;
  let xpGained = 0;
  if (completed && !(existing?.completed ?? false)) {
    await awardXp(userId, lesson.xpReward);
    xpGained = lesson.xpReward;
  }
  await db.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: { userId, lessonId, completedSteps: JSON.stringify(completedSteps), completed },
    update: { completedSteps: JSON.stringify(completedSteps), completed },
  });
  return { completedSteps, completed, xpGained };
}

export async function toggleProjectStep(userId: string, projectId: string, stepIndex: number, done: boolean) {
  const project = await db.project.findUnique({ where: { id: projectId } });
  if (!project) return null;
  const total = (JSON.parse(project.steps) as unknown[]).length;
  const existing = await db.projectProgress.findUnique({
    where: { userId_projectId: { userId, projectId } },
  });
  const doneSet = new Set<number>(existing ? JSON.parse(existing.doneSteps) : []);
  if (done) doneSet.add(stepIndex);
  else doneSet.delete(stepIndex);
  const doneSteps = [...doneSet].filter((i) => i < total).sort((a, b) => a - b);
  const finalPassed = existing?.finalPassed ?? false;
  const completed = doneSteps.length >= total && (project.finalTests ? finalPassed : true);
  let xpGained = 0;
  if (completed && !(existing?.completed ?? false)) {
    await awardXp(userId, project.xpReward);
    xpGained = project.xpReward;
  }
  await db.projectProgress.upsert({
    where: { userId_projectId: { userId, projectId } },
    create: { userId, projectId, doneSteps: JSON.stringify(doneSteps), completed },
    update: { doneSteps: JSON.stringify(doneSteps), completed },
  });
  return { doneSteps, completed, xpGained };
}

export async function markProjectFinal(userId: string, projectId: string) {
  const project = await db.project.findUnique({ where: { id: projectId } });
  if (!project) return null;
  const existing = await db.projectProgress.findUnique({
    where: { userId_projectId: { userId, projectId } },
  });
  const doneSteps = existing ? JSON.parse(existing.doneSteps) : [];
  const total = (JSON.parse(project.steps) as unknown[]).length;
  const completed = doneSteps.length >= total;
  let xpGained = 0;
  if (completed && !(existing?.completed ?? false)) {
    await awardXp(userId, project.xpReward);
    xpGained = project.xpReward;
  }
  await db.projectProgress.upsert({
    where: { userId_projectId: { userId, projectId } },
    create: { userId, projectId, finalPassed: true, completed },
    update: { finalPassed: true, completed },
  });
  return { finalPassed: true, completed, xpGained };
}
