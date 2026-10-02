import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { isLangId, type LangId } from "@/lib/languages";
import { judgeCode } from "@/lib/judge";
import { markLessonStep, markProjectFinal } from "@/lib/progress";
import { awardXp } from "@/lib/gamification";
import type { Step, TestCase } from "@content/types";

const schema = z.object({
  kind: z.enum(["lesson", "challenge", "project"]),
  refId: z.string().min(1),
  stepIndex: z.number().int().min(0).optional(),
  language: z.string().optional(),
  code: z.string().min(1, "Kodennya masih kosong").max(64 * 1024),
});

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Belum masuk" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tidak valid" }, { status: 400 });
  }
  const { kind, refId, stepIndex, code } = parsed.data;

  if (kind === "lesson") {
    if (stepIndex === undefined) return NextResponse.json({ error: "stepIndex wajib" }, { status: 400 });
    const lesson = await db.lesson.findUnique({
      where: { id: refId },
      include: { module: { include: { track: { select: { slug: true } } } } },
    });
    if (!lesson) return NextResponse.json({ error: "Pelajaran tidak ditemukan" }, { status: 404 });
    const steps = JSON.parse(lesson.steps) as Step[];
    const step = steps[stepIndex];
    if (!step || step.kind !== "code") {
      return NextResponse.json({ error: "Step bukan latihan kode" }, { status: 400 });
    }
    const lang =
      parsed.data.language && isLangId(parsed.data.language)
        ? parsed.data.language
        : trackLang(lesson.module.track.slug);
    const outcome = await judgeCode(lang, code, step.tests);
    const progress = outcome.allPassed ? await markLessonStep(user.id, refId, stepIndex) : null;
    return NextResponse.json({ outcome, progress });
  }

  if (kind === "challenge") {
    const challenge = await db.challenge.findUnique({
      where: { slug: refId },
      include: { track: { select: { slug: true } } },
    });
    if (!challenge) return NextResponse.json({ error: "Tantangan tidak ditemukan" }, { status: 404 });
    const tests = JSON.parse(challenge.tests) as TestCase[];
    // tantangan lintas-bahasa (trackId null): bahasa dipilih user saat mengerjakan
    const lang =
      challenge.trackId && challenge.track
        ? trackLang(challenge.track.slug)
        : parsed.data.language && isLangId(parsed.data.language)
          ? parsed.data.language
          : null;
    if (!lang) return NextResponse.json({ error: "Pilih bahasa pengerjaan dulu" }, { status: 400 });
    const priorPassed = await db.submission.count({
      where: { userId: user.id, challengeId: challenge.id, passed: true },
    });
    const outcome = await judgeCode(lang, code, tests);
    await db.submission.create({
      data: { userId: user.id, challengeId: challenge.id, language: lang, code, passed: outcome.allPassed },
    });
    let xpGained = 0;
    if (outcome.allPassed && priorPassed === 0) {
      await awardXp(user.id, challenge.xpReward);
      xpGained = challenge.xpReward;
    }
    return NextResponse.json({ outcome, xpGained });
  }

  const project = await db.project.findUnique({
    where: { slug: refId },
    include: { track: { select: { slug: true } } },
  });
  if (!project || !project.finalTests) {
    return NextResponse.json({ error: "Proyek tidak ditemukan atau tanpa ujian akhir" }, { status: 404 });
  }
  const tests = JSON.parse(project.finalTests) as TestCase[];
  const lang =
    project.trackId && project.track
      ? trackLang(project.track.slug)
      : parsed.data.language && isLangId(parsed.data.language)
        ? parsed.data.language
        : null;
  if (!lang) return NextResponse.json({ error: "Pilih bahasa pengerjaan dulu" }, { status: 400 });
  const outcome = await judgeCode(lang, code, tests);
  const progress = outcome.allPassed ? await markProjectFinal(user.id, project.id) : null;
  return NextResponse.json({ outcome, progress });
}

function trackLang(slug: string): LangId {
  return isLangId(slug) ? slug : "python";
}
