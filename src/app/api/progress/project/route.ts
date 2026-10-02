import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { toggleProjectStep } from "@/lib/progress";

const schema = z.object({
  projectId: z.string().min(1),
  stepIndex: z.number().int().min(0),
  done: z.boolean(),
});

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Belum masuk" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tidak valid" }, { status: 400 });
  }
  const result = await toggleProjectStep(user.id, parsed.data.projectId, parsed.data.stepIndex, parsed.data.done);
  if (!result) return NextResponse.json({ error: "Proyek tidak ditemukan" }, { status: 404 });
  return NextResponse.json(result);
}
