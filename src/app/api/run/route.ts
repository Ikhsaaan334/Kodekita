import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { runCode } from "@/lib/runner";
import { isLangId } from "@/lib/languages";

const schema = z.object({
  language: z.string().refine(isLangId, "Bahasa tidak dikenal"),
  code: z.string().min(1, "Kodennya masih kosong").max(64 * 1024),
  stdin: z.string().max(64 * 1024).default(""),
});

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Belum masuk" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tidak valid" }, { status: 400 });
  }
  const result = await runCode(parsed.data.language as never, parsed.data.code, parsed.data.stdin);
  return NextResponse.json(result);
}
