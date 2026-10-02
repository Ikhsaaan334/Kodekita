export type LangId = "python" | "go" | "c" | "cpp" | "java" | "php" | "csharp";

export type LocalSpec = {
  /** File sumber yang ditulis ke folder sementara; %s diganti nama berkas. */
  sourceFile: string;
  /** Perintah deteksi toolchain, mis. ["gcc", "--version"]. */
  detect: string[];
  /** Perintah kompilasi; null kalau interpretasi langsung. */
  compile: string[] | null;
  /** Perintah eksekusi setelah kompilasi (atau langsung). */
  run: string[];
  /** ID bahasa Piston yang setara. */
  piston: string;
  /** Pesan bila toolchain tidak ada di mesin ini. */
  missingHint: string;
};

export const LANGUAGES: Record<LangId, { label: string; local: LocalSpec }> = {
  python: {
    label: "Python",
    local: {
      sourceFile: "main.py",
      detect: ["python", "--version"],
      compile: null,
      run: ["python", "main.py"],
      piston: "python",
      missingHint: "Pasang Python 3 dari python.org lalu muat ulang server.",
    },
  },
  go: {
    label: "Go",
    local: {
      sourceFile: "main.go",
      detect: ["go", "version"],
      compile: null,
      run: ["go", "run", "main.go"],
      piston: "go",
      missingHint: "Pasang Go dari go.dev/dl lalu muat ulang server.",
    },
  },
  c: {
    label: "C",
    local: {
      sourceFile: "main.c",
      detect: ["gcc", "--version"],
      compile: ["gcc", "main.c", "-o", "program.exe"],
      run: ["./program.exe"],
      piston: "c",
      missingHint: "Pasang MinGW-w64 (gcc) atau arahkan PISTON_URL ke instance judge.",
    },
  },
  cpp: {
    label: "C++",
    local: {
      sourceFile: "main.cpp",
      detect: ["g++", "--version"],
      compile: ["g++", "-std=c++17", "main.cpp", "-o", "program.exe"],
      run: ["./program.exe"],
      piston: "c++",
      missingHint: "Pasang MinGW-w64 (g++) atau arahkan PISTON_URL ke instance judge.",
    },
  },
  java: {
    label: "Java",
    local: {
      sourceFile: "Main.java",
      detect: ["javac", "-version"],
      compile: ["javac", "Main.java"],
      run: ["java", "-cp", ".", "Main"],
      piston: "java",
      missingHint: "Pasang JDK (mis. Eclipse Adoptium) lalu muat ulang server.",
    },
  },
  php: {
    label: "PHP",
    local: {
      sourceFile: "main.php",
      detect: ["php", "-v"],
      compile: null,
      run: ["php", "main.php"],
      piston: "php",
      missingHint: "Pasang PHP CLI dari windows.php.net lalu muat ulang server.",
    },
  },
  csharp: {
    label: "C#",
    local: {
      sourceFile: "Main.cs",
      detect: ["csc-detect"],
      compile: ["CSC_PATH", "/nologo", "/out:program.exe", "Main.cs"],
      run: ["./program.exe"],
      piston: "csharp",
      missingHint: "Pasang .NET SDK, atau arahkan PISTON_URL ke instance judge.",
    },
  },
};

export const LANG_IDS = Object.keys(LANGUAGES) as LangId[];

export function isLangId(x: string): x is LangId {
  return LANG_IDS.includes(x as LangId);
}
