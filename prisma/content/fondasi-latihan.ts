import type { TestCase } from "./types";

/**
 * Tabel latihan kode kanonik untuk kurikulum fondasi: satu tugas per lesson,
 * dieksekusi di 7 bahasa, dengan SATU set test yang sama (dari kolom python).
 * Setiap solution wajib lolos verifikasi mesin (scripts/verify-konten.ts).
 * mode mengikuti pola lesson: fill, fix, fill, fill, fix, fill.
 */

export type LatihanBahasa = {
  mode: "fill" | "fix";
  prompt: string;
  template: string;
  solution: string;
  hints: string[];
};

export const LATIHAN_FONDASI: {
  tests: TestCase[];
  byLang: Record<string, LatihanBahasa>;
}[] = [
  // 0. Program Pertama: cetak "Halo, dunia!" (fill)
  {
    tests: [{ stdin: "", expectedOutput: "Halo, dunia!" }],
    byLang: {
      python: {
        mode: "fill",
        prompt: "Lengkapi kode di bawah supaya mencetak teks `Halo, dunia!` persis. Ganti tanda `___` dengan fungsi yang tepat.",
        template: '___("Halo, dunia!")',
        solution: 'print("Halo, dunia!")',
        hints: [
          "Yang dicari adalah fungsi bawaan Python untuk menampilkan teks.",
          "Namanya print, cukup tiga kata: print lalu teksnya di dalam tanda kutip dan kurung.",
        ],
      },
      go: {
        mode: "fill",
        prompt: "Lengkapi kode Go di bawah supaya mencetak teks `Halo, dunia!` persis. Ganti `___` dengan perintah cetak Go yang tepat.",
        template: 'package main\n\nimport "fmt"\n\nfunc main() {\n\t___("Halo, dunia!")\n}',
        solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Halo, dunia!")\n}',
        hints: [
          "Paket fmt punya beberapa perintah cetak; yang otomatis menambah pindah baris namanya Println.",
          "Tulis fmt.Println lalu teksnya di dalam tanda kutip.",
        ],
      },
      c: {
        mode: "fill",
        prompt: "Lengkapi kode C di bawah supaya mencetak teks `Halo, dunia!` persis. Ganti `___` dengan fungsi cetak C.",
        template: '#include <stdio.h>\n\nint main(void) {\n\t___("Halo, dunia!");\n\treturn 0;\n}',
        solution: '#include <stdio.h>\n\nint main(void) {\n\tprintf("Halo, dunia!\\n");\n\treturn 0;\n}',
        hints: [
          "Fungsi cetak di stdio.h bernama printf dan pakai format string.",
          "Jangan lupa \\n di akhir teks supaya berpindah baris.",
        ],
      },
      cpp: {
        mode: "fill",
        prompt: "Lengkapi kode C++ di bawah supaya mencetak teks `Halo, dunia!` persis. Ganti `___` dengan aliran keluaran C++.",
        template: '#include <iostream>\n\nint main() {\n\tstd::___ << "Halo, dunia!" << std::endl;\n\treturn 0;\n}',
        solution: '#include <iostream>\n\nint main() {\n\tstd::cout << "Halo, dunia!" << std::endl;\n\treturn 0;\n}',
        hints: [
          "Keluaran standar C++ adalah std::cout, dipakai dengan tanda <<.",
          "std::endl yang di ujung sudah menambahkan pindah baris.",
        ],
      },
      java: {
        mode: "fill",
        prompt: "Lengkapi kode Java di bawah supaya mencetak teks `Halo, dunia!` persis. Ganti `___` dengan perintah cetak Java.",
        template: 'public class Main {\n\tpublic static void main(String[] args) {\n\t\t___("Halo, dunia!");\n\t}\n}',
        solution: 'public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Halo, dunia!");\n\t}\n}',
        hints: [
          "Perintah cetak Java panjang: System.out.println.",
          "println otomatis menambahkan pindah baris di akhir.",
        ],
      },
      php: {
        mode: "fill",
        prompt: "Lengkapi kode PHP di bawah supaya mencetak teks `Halo, dunia!` persis. Ganti `___` dengan perintah cetak PHP.",
        template: '<?php\n___ "Halo, dunia!";',
        solution: '<?php\necho "Halo, dunia!";',
        hints: [
          "PHP tidak memakai kurung untuk perintah cetaknya; perintahnya diikuti langsung teks.",
          "Perintahnya bernama echo.",
        ],
      },
      csharp: {
        mode: "fill",
        prompt: "Lengkapi kode C# di bawah supaya mencetak teks `Halo, dunia!` persis. Ganti `___` dengan perintah cetak C#.",
        template: 'using System;\n\npublic class Program {\n\tpublic static void Main() {\n\t\t___("Halo, dunia!");\n\t}\n}',
        solution: 'using System;\n\npublic class Program {\n\tpublic static void Main() {\n\t\tConsole.WriteLine("Halo, dunia!");\n\t}\n}',
        hints: [
          "Kelas Console punya beberapa method cetak; yang menambah pindah baris adalah WriteLine.",
          "Tulis Console.WriteLine lalu teksnya di dalam tanda kutip.",
        ],
      },
    },
  },
  // 1. Variabel dan Tipe Data: perbaiki nama variabel, keluaran "Sinta - 17" (fix)
  {
    tests: [{ stdin: "", expectedOutput: "Sinta - 17" }],
    byLang: {
      python: {
        mode: "fix",
        prompt: "Kode ini seharusnya mencetak `Sinta - 17`. Ada satu kesalahan yang membuat program gagal jalan. Cari dan perbaiki, lalu jalankan.",
        template: 'nama = "Sinta"\numur = 17\nprint(f"{nama} - {umr}")',
        solution: 'nama = "Sinta"\numur = 17\nprint(f"{nama} - {umur}")',
        hints: [
          "Perhatikan pesan error saat kamu menjalankan: Python menyebut nama yang tidak dikenalinya.",
          "Variabelnya bernama umur, tapi yang dipanggil di dalam kurung kurawal ditulis beda.",
        ],
      },
      go: {
        mode: "fix",
        prompt: "Kode Go ini seharusnya mencetak `Sinta - 17`. Ada satu nama variabel yang salah tulis sehingga gagal kompilasi. Perbaiki lalu uji.",
        template: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tnama := "Sinta"\n\tumur := 17\n\tfmt.Println(nama, "-", umr)\n}',
        solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tnama := "Sinta"\n\tumur := 17\n\tfmt.Println(nama, "-", umur)\n}',
        hints: [
          "Pesan error kompilasi Go menyebut undefined: umr, artinya nama itu tidak ada.",
          "Variabel yang benar dideklarasikan sebagai umur, dua baris di atasnya.",
        ],
      },
      c: {
        mode: "fix",
        prompt: "Kode C ini seharusnya mencetak `Sinta - 17`. Ada satu nama variabel yang salah tulis sehingga gagal kompilasi. Perbaiki lalu uji.",
        template: '#include <stdio.h>\n\nint main(void) {\n\tchar nama[] = "Sinta";\n\tint umur = 17;\n\tprintf("%s - %d\\n", nama, umr);\n\treturn 0;\n}',
        solution: '#include <stdio.h>\n\nint main(void) {\n\tchar nama[] = "Sinta";\n\tint umur = 17;\n\tprintf("%s - %d\\n", nama, umur);\n\treturn 0;\n}',
        hints: [
          "Compiler menunjuk umr sebagai undeclared identifier.",
          "Variabel yang benar dideklarasikan sebagai umur.",
        ],
      },
      cpp: {
        mode: "fix",
        prompt: "Kode C++ ini seharusnya mencetak `Sinta - 17`. Ada satu nama variabel yang salah tulis sehingga gagal kompilasi. Perbaiki lalu uji.",
        template: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n\tstring nama = "Sinta";\n\tint umur = 17;\n\tcout << nama << " - " << umr << endl;\n\treturn 0;\n}',
        solution: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n\tstring nama = "Sinta";\n\tint umur = 17;\n\tcout << nama << " - " << umur << endl;\n\treturn 0;\n}',
        hints: [
          "Compiler C++ bilang umr was not declared, artinya nama itu tidak pernah dibuat.",
          "Yang benar ada di baris di atasnya: umur.",
        ],
      },
      java: {
        mode: "fix",
        prompt: "Kode Java ini seharusnya mencetak `Sinta - 17`. Ada satu nama variabel yang salah tulis sehingga gagal kompilasi. Perbaiki lalu uji.",
        template: 'public class Main {\n\tpublic static void main(String[] args) {\n\t\tString nama = "Sinta";\n\t\tint umur = 17;\n\t\tSystem.out.println(nama + " - " + umr);\n\t}\n}',
        solution: 'public class Main {\n\tpublic static void main(String[] args) {\n\t\tString nama = "Sinta";\n\t\tint umur = 17;\n\t\tSystem.out.println(nama + " - " + umur);\n\t}\n}',
        hints: [
          "Pesan error Java: cannot find symbol umr.",
          "Variabel yang benar dideklarasikan dua baris di atasnya: umur.",
        ],
      },
      php: {
        mode: "fix",
        prompt: "Kode PHP ini seharusnya mencetak `Sinta - 17`. Ada satu nama variabel yang salah tulis. Perbaiki lalu uji.",
        template: '<?php\n$nama = "Sinta";\n$umur = 17;\necho $nama . " - " . $umr;',
        solution: '<?php\n$nama = "Sinta";\n$umur = 17;\necho $nama . " - " . $umur;',
        hints: [
          "Perhatikan tanda dolar: nama variabel PHP selalu diawali $.",
          "Variabel yang benar bernama $umur; yang salah tulis kehilangan sesuatu.",
        ],
      },
      csharp: {
        mode: "fix",
        prompt: "Kode C# ini seharusnya mencetak `Sinta - 17`. Ada satu nama variabel yang salah tulis sehingga gagal kompilasi. Perbaiki lalu uji.",
        template: 'using System;\n\npublic class Program {\n\tpublic static void Main() {\n\t\tstring nama = "Sinta";\n\t\tint umur = 17;\n\t\tConsole.WriteLine(nama + " - " + umr);\n\t}\n}',
        solution: 'using System;\n\npublic class Program {\n\tpublic static void Main() {\n\t\tstring nama = "Sinta";\n\t\tint umur = 17;\n\t\tConsole.WriteLine(nama + " - " + umur);\n\t}\n}',
        hints: [
          "Error C#: The name umr does not exist.",
          "Variabel yang benar dideklarasikan sebagai umur.",
        ],
      },
    },
  },
  // 2. Membaca Input: sapa pengguna, keluaran "Halo, <nama>!" (fill)
  {
    tests: [
      { stdin: "Sinta", expectedOutput: "Halo, Sinta!" },
      { stdin: "Bagas", expectedOutput: "Halo, Bagas!" },
    ],
    byLang: {
      python: {
        mode: "fill",
        prompt: "Lengkapi program: baca satu baris nama dari input, lalu cetak `Halo, <nama>!`. Contoh: input `Sinta` menghasilkan keluaran `Halo, Sinta!`.",
        template: 'nama = ___\nprint(f"___")',
        solution: 'nama = input()\nprint(f"Halo, {nama}!")',
        hints: [
          "Baris pertama butuh fungsi pembaca input.",
          "Di dalam f-string, sisipkan variabel nama dengan {nama}, dan jangan lupa tanda seru di akhir.",
        ],
      },
      go: {
        mode: "fill",
        prompt: "Lengkapi program Go: baca satu kata nama dari input, lalu cetak `Halo, <nama>!`. Contoh: input `Sinta` menghasilkan `Halo, Sinta!`.",
        template: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tvar nama string\n\t___(&nama)\n\tfmt.Printf("Halo, %s!\\n", nama)\n}',
        solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tvar nama string\n\tfmt.Scan(&nama)\n\tfmt.Printf("Halo, %s!\\n", nama)\n}',
        hints: [
          "fmt.Scan membaca satu kata dari input ke variabel; jangan lupa tanda & di depan nama variabel.",
          "Printf dengan %s menyisipkan isi variabel nama ke dalam teks.",
        ],
      },
      c: {
        mode: "fill",
        prompt: "Lengkapi program C: baca satu kata nama dari input, lalu cetak `Halo, <nama>!`. Contoh: input `Sinta` menghasilkan `Halo, Sinta!`.",
        template: '#include <stdio.h>\n\nint main(void) {\n\tchar nama[100];\n\t___("%s", nama);\n\tprintf("Halo, %s!\\n", nama);\n\treturn 0;\n}',
        solution: '#include <stdio.h>\n\nint main(void) {\n\tchar nama[100];\n\tscanf("%s", nama);\n\tprintf("Halo, %s!\\n", nama);\n\treturn 0;\n}',
        hints: [
          "Fungsi pembaca berformat di C bernama scanf.",
          "%s membaca satu kata; nama array sudah mewakili alamat, jadi tanpa &.",
        ],
      },
      cpp: {
        mode: "fill",
        prompt: "Lengkapi program C++: baca satu kata nama dari input, lalu cetak `Halo, <nama>!`. Contoh: input `Sinta` menghasilkan `Halo, Sinta!`.",
        template: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n\tstring nama;\n\t___ >> nama;\n\tcout << "Halo, " << nama << "!" << endl;\n\treturn 0;\n}',
        solution: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n\tstring nama;\n\tcin >> nama;\n\tcout << "Halo, " << nama << "!" << endl;\n\treturn 0;\n}',
        hints: [
          "Aliran masukan standar C++ adalah cin, dipakai dengan tanda >>.",
          "cin >> nama membaca satu kata ke variabel nama.",
        ],
      },
      java: {
        mode: "fill",
        prompt: "Lengkapi program Java: baca satu kata nama dari input, lalu cetak `Halo, <nama>!`. Contoh: input `Sinta` menghasilkan `Halo, Sinta!`.",
        template: 'import java.util.Scanner;\n\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tScanner sc = new Scanner(System.in);\n\t\tString nama = sc.___();\n\t\tSystem.out.println("Halo, " + nama + "!");\n\t}\n}',
        solution: 'import java.util.Scanner;\n\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tScanner sc = new Scanner(System.in);\n\t\tString nama = sc.next();\n\t\tSystem.out.println("Halo, " + nama + "!");\n\t}\n}',
        hints: [
          "Scanner punya beberapa method pembacaan; yang membaca satu kata adalah next().",
          "nextInt untuk angka, next() untuk kata.",
        ],
      },
      php: {
        mode: "fill",
        prompt: "Lengkapi program PHP: baca satu baris nama dari input, bersihkan pindah barisnya, lalu cetak `Halo, <nama>!`. Contoh: input `Sinta` menghasilkan `Halo, Sinta!`.",
        template: '<?php\n$nama = ___(fgets(STDIN));\necho "Halo, " . $nama . "!\\n";',
        solution: '<?php\n$nama = trim(fgets(STDIN));\necho "Halo, " . $nama . "!\\n";',
        hints: [
          "fgets(STDIN) membaca satu baris termasuk pindah barisnya.",
          "trim() membuang spasi dan pindah baris di ujung teks.",
        ],
      },
      csharp: {
        mode: "fill",
        prompt: "Lengkapi program C#: baca satu baris nama dari input, lalu cetak `Halo, <nama>!`. Contoh: input `Sinta` menghasilkan `Halo, Sinta!`.",
        template: 'using System;\n\npublic class Program {\n\tpublic static void Main() {\n\t\tstring nama = Console.___();\n\t\tConsole.WriteLine("Halo, " + nama + "!");\n\t}\n}',
        solution: 'using System;\n\npublic class Program {\n\tpublic static void Main() {\n\t\tstring nama = Console.ReadLine();\n\t\tConsole.WriteLine("Halo, " + nama + "!");\n\t}\n}',
        hints: [
          "Kelas Console punya method untuk membaca satu baris.",
          "Namanya ReadLine, tanpa argumen.",
        ],
      },
    },
  },
  // 3. Percabangan: genap/ganjil (fill: == dan else)
  {
    tests: [
      { stdin: "4", expectedOutput: "genap" },
      { stdin: "9", expectedOutput: "ganjil" },
      { stdin: "0", expectedOutput: "genap" },
    ],
    byLang: {
      python: {
        mode: "fill",
        prompt: "Lengkapi program: baca satu bilangan bulat, cetak `genap` jika habis dibagi 2, selain itu cetak `ganjil`.",
        template: 'angka = int(input())\nif angka % 2 ___ 0:\n    print("genap")\n___:\n    print("ganjil")',
        solution: 'angka = int(input())\nif angka % 2 == 0:\n    print("genap")\nelse:\n    print("ganjil")',
        hints: [
          "Operator pembanding sama dengan ditulis dua tanda sama dengan.",
          "Blok penampung terakhir setelah if dalam pola ini bernama else, ditulis tanpa kondisi.",
        ],
      },
      go: {
        mode: "fill",
        prompt: "Lengkapi program Go: baca satu bilangan bulat, cetak `genap` jika habis dibagi 2, selain itu `ganjil`.",
        template: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tvar angka int\n\tfmt.Scan(&angka)\n\tif angka%2 ___ 0 {\n\t\tfmt.Println("genap")\n\t} ___ {\n\t\tfmt.Println("ganjil")\n\t}\n}',
        solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tvar angka int\n\tfmt.Scan(&angka)\n\tif angka%2 == 0 {\n\t\tfmt.Println("genap")\n\t} else {\n\t\tfmt.Println("ganjil")\n\t}\n}',
        hints: [
          "Pembanding sama dengan di Go ditulis ==, satu tanda saja berarti pengisian nilai.",
          "Cabang penampung ditulis langsung } else {, tanpa kondisi.",
        ],
      },
      c: {
        mode: "fill",
        prompt: "Lengkapi program C: baca satu bilangan bulat, cetak `genap` jika habis dibagi 2, selain itu `ganjil`.",
        template: '#include <stdio.h>\n\nint main(void) {\n\tint angka;\n\tscanf("%d", &angka);\n\tif (angka % 2 ___ 0) {\n\t\tprintf("genap\\n");\n\t} ___ {\n\t\tprintf("ganjil\\n");\n\t}\n\treturn 0;\n}',
        solution: '#include <stdio.h>\n\nint main(void) {\n\tint angka;\n\tscanf("%d", &angka);\n\tif (angka % 2 == 0) {\n\t\tprintf("genap\\n");\n\t} else {\n\t\tprintf("ganjil\\n");\n\t}\n\treturn 0;\n}',
        hints: [
          "Pembanding sama dengan di C ditulis ==.",
          "Cabang tanpa kondisi ditulis } else {.",
        ],
      },
      cpp: {
        mode: "fill",
        prompt: "Lengkapi program C++: baca satu bilangan bulat, cetak `genap` jika habis dibagi 2, selain itu `ganjil`.",
        template: '#include <iostream>\nusing namespace std;\n\nint main() {\n\tint angka;\n\tcin >> angka;\n\tif (angka % 2 ___ 0) {\n\t\tcout << "genap" << endl;\n\t} ___ {\n\t\tcout << "ganjil" << endl;\n\t}\n\treturn 0;\n}',
        solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n\tint angka;\n\tcin >> angka;\n\tif (angka % 2 == 0) {\n\t\tcout << "genap" << endl;\n\t} else {\n\t\tcout << "ganjil" << endl;\n\t}\n\treturn 0;\n}',
        hints: [
          "Pembanding sama dengan ditulis dua tanda sama dengan.",
          "Cabang penampung tanpa kondisi: } else {.",
        ],
      },
      java: {
        mode: "fill",
        prompt: "Lengkapi program Java: baca satu bilangan bulat, cetak `genap` jika habis dibagi 2, selain itu `ganjil`.",
        template: 'import java.util.Scanner;\n\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tScanner sc = new Scanner(System.in);\n\t\tint angka = sc.nextInt();\n\t\tif (angka % 2 ___ 0) {\n\t\t\tSystem.out.println("genap");\n\t\t} ___ {\n\t\t\tSystem.out.println("ganjil");\n\t\t}\n\t}\n}',
        solution: 'import java.util.Scanner;\n\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tScanner sc = new Scanner(System.in);\n\t\tint angka = sc.nextInt();\n\t\tif (angka % 2 == 0) {\n\t\t\tSystem.out.println("genap");\n\t\t} else {\n\t\t\tSystem.out.println("ganjil");\n\t\t}\n\t}\n}',
        hints: [
          "Pembanding sama dengan di Java adalah ==.",
          "Cabang tanpa kondisi ditulis } else {.",
        ],
      },
      php: {
        mode: "fill",
        prompt: "Lengkapi program PHP: baca satu bilangan bulat, cetak `genap` jika habis dibagi 2, selain itu `ganjil`.",
        template: '<?php\n$angka = (int)trim(fgets(STDIN));\nif ($angka % 2 ___ 0) {\n\techo "genap\\n";\n} ___ {\n\techo "ganjil\\n";\n}',
        solution: '<?php\n$angka = (int)trim(fgets(STDIN));\nif ($angka % 2 == 0) {\n\techo "genap\\n";\n} else {\n\techo "ganjil\\n";\n}',
        hints: [
          "Pembanding sama dengan ditulis dua tanda sama dengan.",
          "Cabang penampung tanpa kondisi: } else {.",
        ],
      },
      csharp: {
        mode: "fill",
        prompt: "Lengkapi program C#: baca satu bilangan bulat, cetak `genap` jika habis dibagi 2, selain itu `ganjil`.",
        template: 'using System;\n\npublic class Program {\n\tpublic static void Main() {\n\t\tint angka = Convert.ToInt32(Console.ReadLine());\n\t\tif (angka % 2 ___ 0) {\n\t\t\tConsole.WriteLine("genap");\n\t\t} ___ {\n\t\t\tConsole.WriteLine("ganjil");\n\t\t}\n\t}\n}',
        solution: 'using System;\n\npublic class Program {\n\tpublic static void Main() {\n\t\tint angka = Convert.ToInt32(Console.ReadLine());\n\t\tif (angka % 2 == 0) {\n\t\t\tConsole.WriteLine("genap");\n\t\t} else {\n\t\t\tConsole.WriteLine("ganjil");\n\t\t}\n\t}\n}',
        hints: [
          "Pembanding sama dengan ditulis ==.",
          "Cabang tanpa kondisi ditulis } else {.",
        ],
      },
    },
  },
  // 4. Perulangan: perbaiki batas agar cetak "1 2 3 4 5" (fix)
  {
    tests: [{ stdin: "", expectedOutput: "1 2 3 4 5" }],
    byLang: {
      python: {
        mode: "fix",
        prompt: "Program ini seharusnya mencetak `1 2 3 4 5` dalam satu baris. Hasilnya sekarang salah. Perbaiki sampai tesnya lulus.",
        template: 'for i in range(1, 5):\n    print(i, end=" ")',
        solution: 'for i in range(1, 6):\n    print(i, end=" ")',
        hints: [
          "Jalankan dulu dan lihat hasilnya: satu angka hilang di ujung.",
          "range(1, 5) berhenti sebelum 5. Batas akhir tidak ikut, jadi naikkan satu.",
        ],
      },
      go: {
        mode: "fix",
        prompt: "Program Go ini seharusnya mencetak `1 2 3 4 5` dalam satu baris. Sekarang satu angka hilang. Perbaiki lalu uji.",
        template: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfor i := 1; i <= 4; i++ {\n\t\tif i > 1 {\n\t\t\tfmt.Print(" ")\n\t\t}\n\t\tfmt.Print(i)\n\t}\n\tfmt.Println()\n}',
        solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfor i := 1; i <= 5; i++ {\n\t\tif i > 1 {\n\t\t\tfmt.Print(" ")\n\t\t}\n\t\tfmt.Print(i)\n\t}\n\tfmt.Println()\n}',
        hints: [
          "Jalankan dulu: yang tercetak cuma sampai 4.",
          "Syarat perulangan i <= 4 berhenti terlalu cepat; angka terakhir yang diinginkan adalah 5.",
        ],
      },
      c: {
        mode: "fix",
        prompt: "Program C ini seharusnya mencetak `1 2 3 4 5` dalam satu baris. Sekarang satu angka hilang. Perbaiki lalu uji.",
        template: '#include <stdio.h>\n\nint main(void) {\n\tfor (int i = 1; i <= 4; i++) {\n\t\tif (i > 1) printf(" ");\n\t\tprintf("%d", i);\n\t}\n\tprintf("\\n");\n\treturn 0;\n}',
        solution: '#include <stdio.h>\n\nint main(void) {\n\tfor (int i = 1; i <= 5; i++) {\n\t\tif (i > 1) printf(" ");\n\t\tprintf("%d", i);\n\t}\n\tprintf("\\n");\n\treturn 0;\n}',
        hints: [
          "Jalankan dulu: perulangan berhenti di 4.",
          "Syarat i <= 4 harus menjadi i <= 5 supaya angka 5 ikut tercetak.",
        ],
      },
      cpp: {
        mode: "fix",
        prompt: "Program C++ ini seharusnya mencetak `1 2 3 4 5` dalam satu baris. Sekarang satu angka hilang. Perbaiki lalu uji.",
        template: '#include <iostream>\nusing namespace std;\n\nint main() {\n\tfor (int i = 1; i <= 4; i++) {\n\t\tif (i > 1) cout << " ";\n\t\tcout << i;\n\t}\n\tcout << endl;\n\treturn 0;\n}',
        solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n\tfor (int i = 1; i <= 5; i++) {\n\t\tif (i > 1) cout << " ";\n\t\tcout << i;\n\t}\n\tcout << endl;\n\treturn 0;\n}',
        hints: [
          "Jalankan dulu: hasilnya cuma sampai 4.",
          "Naikkan batas perulangan dari i <= 4 menjadi i <= 5.",
        ],
      },
      java: {
        mode: "fix",
        prompt: "Program Java ini seharusnya mencetak `1 2 3 4 5` dalam satu baris. Sekarang satu angka hilang. Perbaiki lalu uji.",
        template: 'public class Main {\n\tpublic static void main(String[] args) {\n\t\tfor (int i = 1; i <= 4; i++) {\n\t\t\tif (i > 1) System.out.print(" ");\n\t\t\tSystem.out.print(i);\n\t\t}\n\t\tSystem.out.println();\n\t}\n}',
        solution: 'public class Main {\n\tpublic static void main(String[] args) {\n\t\tfor (int i = 1; i <= 5; i++) {\n\t\t\tif (i > 1) System.out.print(" ");\n\t\t\tSystem.out.print(i);\n\t\t}\n\t\tSystem.out.println();\n\t}\n}',
        hints: [
          "Jalankan dulu: angka 5 belum muncul.",
          "Syarat i <= 4 berhenti terlalu cepat; ganti batasnya menjadi 5.",
        ],
      },
      php: {
        mode: "fix",
        prompt: "Program PHP ini seharusnya mencetak `1 2 3 4 5` dalam satu baris. Sekarang satu angka hilang. Perbaiki lalu uji.",
        template: '<?php\nfor ($i = 1; $i <= 4; $i++) {\n\tif ($i > 1) {\n\t\techo " ";\n\t}\n\techo $i;\n}\necho "\\n";',
        solution: '<?php\nfor ($i = 1; $i <= 5; $i++) {\n\tif ($i > 1) {\n\t\techo " ";\n\t}\n\techo $i;\n}\necho "\\n";',
        hints: [
          "Jalankan dulu: berhenti di 4.",
          "Syarat $i <= 4 perlu diubah menjadi $i <= 5.",
        ],
      },
      csharp: {
        mode: "fix",
        prompt: "Program C# ini seharusnya mencetak `1 2 3 4 5` dalam satu baris. Sekarang satu angka hilang. Perbaiki lalu uji.",
        template: 'using System;\n\npublic class Program {\n\tpublic static void Main() {\n\t\tfor (int i = 1; i <= 4; i++) {\n\t\t\tif (i > 1) Console.Write(" ");\n\t\t\tConsole.Write(i);\n\t\t}\n\t\tConsole.WriteLine();\n\t}\n}',
        solution: 'using System;\n\npublic class Program {\n\tpublic static void Main() {\n\t\tfor (int i = 1; i <= 5; i++) {\n\t\t\tif (i > 1) Console.Write(" ");\n\t\t\tConsole.Write(i);\n\t\t}\n\t\tConsole.WriteLine();\n\t}\n}',
        hints: [
          "Jalankan dulu: hasilnya berhenti di 4.",
          "Ubah syarat perulangan menjadi i <= 5.",
        ],
      },
    },
  },
  // 5. Fungsi: sapa(nama) mengembalikan "Halo, <nama>!" (fill)
  {
    tests: [
      { stdin: "Dina", expectedOutput: "Halo, Dina!" },
      { stdin: "Rizky", expectedOutput: "Halo, Rizky!" },
    ],
    byLang: {
      python: {
        mode: "fill",
        prompt: "Lengkapi fungsi `sapa` agar menerima satu parameter nama dan MENGEMBALIKAN teks `Halo, <nama>!`. Baris cetak sudah tersedia, jangan diubah.",
        template: 'def sapa(___):\n    ___ f"Halo, {nama}!"\n\nprint(sapa(input()))',
        solution: 'def sapa(nama):\n    return f"Halo, {nama}!"\n\nprint(sapa(input()))',
        hints: [
          "Parameter fungsi adalah nama variabel yang menerima nilai saat dipanggil.",
          "Untuk mengirim hasil keluar fungsi, pakai return, bukan print.",
        ],
      },
      go: {
        mode: "fill",
        prompt: "Lengkapi fungsi `sapa` di Go agar menerima satu parameter nama (bertipe string) dan mengembalikan `Halo, <nama>!`. Baris cetak sudah tersedia.",
        template: 'package main\n\nimport "fmt"\n\nfunc sapa(___) string {\n\treturn fmt.Sprintf("Halo, %s!", nama)\n}\n\nfunc main() {\n\tvar nama string\n\tfmt.Scan(&nama)\n\tfmt.Println(sapa(nama))\n}',
        solution: 'package main\n\nimport "fmt"\n\nfunc sapa(nama string) string {\n\treturn fmt.Sprintf("Halo, %s!", nama)\n}\n\nfunc main() {\n\tvar nama string\n\tfmt.Scan(&nama)\n\tfmt.Println(sapa(nama))\n}',
        hints: [
          "Parameter Go selalu ditulis dengan tipenya: nama string.",
          "fmt.Sprintf menyusun teks tanpa mencetak; return mengirimnya ke pemanggil.",
        ],
      },
      c: {
        mode: "fill",
        prompt: "Lengkapi pemanggilan `sapa` di C agar hasil sapaan tersimpan lalu tercetak. Fungsi dan pembacaan inputnya sudah tersedia.",
        template: '#include <stdio.h>\n\nvoid sapa(char hasil[], char nama[]) {\n\tsprintf(hasil, "Halo, %s!", nama);\n}\n\nint main(void) {\n\tchar nama[100];\n\tchar hasil[120];\n\tscanf("%s", nama);\n\tsapa(___, nama);\n\tprintf("%s\\n", hasil);\n\treturn 0;\n}',
        solution: '#include <stdio.h>\n\nvoid sapa(char hasil[], char nama[]) {\n\tsprintf(hasil, "Halo, %s!", nama);\n}\n\nint main(void) {\n\tchar nama[100];\n\tchar hasil[120];\n\tscanf("%s", nama);\n\tsapa(hasil, nama);\n\tprintf("%s\\n", hasil);\n\treturn 0;\n}',
        hints: [
          "Fungsi sapa menulis hasilnya ke parameter pertama, jadi array hasil yang dikirim ke sana.",
          "C tidak punya return string langsung; hasilnya dikirim lewat array keluaran.",
        ],
      },
      cpp: {
        mode: "fill",
        prompt: "Lengkapi fungsi `sapa` di C++ agar menerima satu parameter nama dan mengembalikan `Halo, <nama>!`. Baris cetak sudah tersedia.",
        template: '#include <iostream>\n#include <string>\nusing namespace std;\n\nstring sapa(string ___) {\n\treturn "Halo, " + nama + "!";\n}\n\nint main() {\n\tstring nama;\n\tcin >> nama;\n\tcout << sapa(nama) << endl;\n\treturn 0;\n}',
        solution: '#include <iostream>\n#include <string>\nusing namespace std;\n\nstring sapa(string nama) {\n\treturn "Halo, " + nama + "!";\n}\n\nint main() {\n\tstring nama;\n\tcin >> nama;\n\tcout << sapa(nama) << endl;\n\treturn 0;\n}',
        hints: [
          "Parameter fungsi adalah nama variabel yang menerima nilai: tulis nama setelah string.",
          "return mengirim hasil ke pemanggil; tanda + menyambung string di C++.",
        ],
      },
      java: {
        mode: "fill",
        prompt: "Lengkapi fungsi (method) `sapa` di Java agar menerima satu parameter nama dan MENGEMBALIKAN `Halo, <nama>!`. Baris cetak sudah tersedia.",
        template: 'public class Main {\n\tstatic String sapa(String ___) {\n\t\treturn "Halo, " + nama + "!";\n\t}\n\n\tpublic static void main(String[] args) {\n\t\tjava.util.Scanner sc = new java.util.Scanner(System.in);\n\t\tSystem.out.println(sapa(sc.next()));\n\t}\n}',
        solution: 'public class Main {\n\tstatic String sapa(String nama) {\n\t\treturn "Halo, " + nama + "!";\n\t}\n\n\tpublic static void main(String[] args) {\n\t\tjava.util.Scanner sc = new java.util.Scanner(System.in);\n\t\tSystem.out.println(sapa(sc.next()));\n\t}\n}',
        hints: [
          "Parameter method dideklarasikan dengan tipenya: String nama.",
          "return mengirim hasil ke pemanggil, sesuai tipe String di depan nama method.",
        ],
      },
      php: {
        mode: "fill",
        prompt: "Lengkapi fungsi `sapa` di PHP agar menerima satu parameter nama dan mengembalikan `Halo, <nama>!`. Baris cetak sudah tersedia.",
        template: '<?php\nfunction sapa($___) {\n\treturn "Halo, " . $nama . "!";\n}\necho sapa(trim(fgets(STDIN))) . "\\n";',
        solution: '<?php\nfunction sapa($nama) {\n\treturn "Halo, " . $nama . "!";\n}\necho sapa(trim(fgets(STDIN))) . "\\n";',
        hints: [
          "Variabel PHP selalu diawali tanda dolar, termasuk parameter fungsi.",
          "return mengirim hasil ke pemanggil; tanda titik menyambung teks di PHP.",
        ],
      },
      csharp: {
        mode: "fill",
        prompt: "Lengkapi method `Sapa` di C# agar menerima satu parameter nama dan MENGEMBALIKAN `Halo, <nama>!`. Baris cetak sudah tersedia.",
        template: 'using System;\n\npublic class Program {\n\tstatic string Sapa(string ___) {\n\t\treturn "Halo, " + nama + "!";\n\t}\n\n\tpublic static void Main() {\n\t\tConsole.WriteLine(Sapa(Console.ReadLine()));\n\t}\n}',
        solution: 'using System;\n\npublic class Program {\n\tstatic string Sapa(string nama) {\n\t\treturn "Halo, " + nama + "!";\n\t}\n\n\tpublic static void Main() {\n\t\tConsole.WriteLine(Sapa(Console.ReadLine()));\n\t}\n}',
        hints: [
          "Parameter method dideklarasikan dengan tipenya: string nama.",
          "return mengirim hasil ke pemanggil, sesuai tipe string di depan nama method.",
        ],
      },
    },
  },
];
