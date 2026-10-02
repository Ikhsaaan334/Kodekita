import { db } from "./db";

export function levelFromXp(xp: number) {
  return Math.floor(xp / 500) + 1;
}

export function xpForNextLevel(xp: number) {
  const level = levelFromXp(xp);
  const floorXp = (level - 1) * 500;
  const nextXp = level * 500;
  return { level, floorXp, nextXp, progress: (xp - floorXp) / (nextXp - floorXp) };
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isYesterday(a: Date, b: Date) {
  const d = new Date(a);
  d.setDate(d.getDate() - 1);
  return isSameDay(d, b);
}

/** Tambah XP dan perbarui streak user. Dipanggil setiap kali ada pencapaian nyata. */
export async function awardXp(userId: string, amount: number) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { lastActiveAt: true, streakCount: true },
  });
  if (!user) return null;
  const now = new Date();
  let streak = user.streakCount;
  if (!user.lastActiveAt || isYesterday(user.lastActiveAt, now)) {
    streak = user.lastActiveAt && isSameDay(user.lastActiveAt, now) ? streak : streak + 1;
    if (!user.lastActiveAt) streak = 1;
  } else if (!isSameDay(user.lastActiveAt, now)) {
    streak = 1;
  }
  if (streak === 0) streak = 1;
  return db.user.update({
    where: { id: userId },
    data: { xp: { increment: amount }, streakCount: streak, lastActiveAt: now },
    select: { xp: true, streakCount: true },
  });
}
