import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminUser } from "@/lib/auth";
import { catatAksi } from "@/lib/admin";
import { runCode } from "@/lib/runner";
import { isLangId } from "@/lib/languages";

// Program perkenalan per bahasa: keluarannya deterministik untuk tes judge.
const HELLO: Record<string, string> = {
  python: 'print("judge ok")',
  go: 'package main\n\nimport "fmt"\n\nfunc main() { fmt.Println("judge ok") }',
  c: '#include <stdio.h>\n\nint main(void) {\n\tprintf("judge ok\\n");\n\treturn 0;\n}',
  cpp: '#include <iostream>\n\nint main() {\n\tstd::cout << "judge ok" << std::endl;\n\treturn 0;\n}',
  java: 'public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("judge ok");\n\t}\n}',
  php: '<?php\necho "judge ok";',
  csharp: 'using System;\n\npublic class Program {\n\tpublic static void Main() {\n\t\tConsole.WriteLine("judge ok");\n\t}\n}',
};

const schema = z.object({ language: z.string().refine(isLangId, "Bahasa tidak dikenal") });

export async function POST(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Khusus admin" }, { status: 403 });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Bahasa tidak dikenal" }, { status: 400 });
  }
  const hasil = await runCode(parsed.data.language, HELLO[parsed.data.language], "");
  await catatAksi(admin.username, "tes-judge", parsed.data.language, hasil.ok ? "lulus" : "gagal");
  return NextResponse.json(hasil);
}
