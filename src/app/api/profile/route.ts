import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { isLangId } from "@/lib/languages";
import { isNameColor, isNameEffect } from "@/lib/profile";

const schema = z.object({
  nameColor: z.string().refine(isNameColor, "Warna tidak dikenal"),
  nameEffect: z.string().refine(isNameEffect, "Efek tidak dikenal"),
  preferredLang: z.string().refine(isLangId, "Bahasa tidak dikenal"),
});

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Belum masuk" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tidak valid" }, { status: 400 });
  }
  const updated = await db.user.update({
    where: { id: user.id },
    data: {
      nameColor: parsed.data.nameColor,
      nameEffect: parsed.data.nameEffect,
      preferredLang: parsed.data.preferredLang,
    },
    select: { nameColor: true, nameEffect: true, preferredLang: true },
  });
  return NextResponse.json(updated);
}
