import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "go",
  moduleRange: [0, 1],
  modules: [
    {
      title: "Go yang Idiomatik",
      description: "Tipe dasar, zero value, const/iota, multiple return, dan konvensi penamaan Go.",
    },
    {
      title: "Slice, Map, dan Array",
      description: "Anatomi slice (len/cap), append dan copy, map patterns, dan jebakan referensi.",
    },
  ],
  lessons: [
    // ==================== MODUL 0: Go yang Idiomatik ====================
    {
      slug: "var-dan-short-declaration",
      title: "Deklarasi: var dan :=",
      summary: "Dua bentuk deklarasi Go, aturannya, dan kapan memakai yang mana.",
      steps: [
        {
          kind: "theory",
          title: "Dua rumpun deklarasi",
          body: "Semua variabel Go punya tipe yang tidak pernah berubah. Deklarasinya ada dua rumpun: `var nama tipe` dan `nama := nilai`. Bentuk `var` boleh dipakai di mana saja, termasuk di level package. Short declaration `:=` hanya boleh di dalam fungsi; ditulis di level package, compiler langsung menolaknya.\n\n`:=` menyimpulkan tipe dari nilai di sisi kanan, dan bisa mendeklarasikan beberapa variabel sekaligus: `a, b := 1, \"dua\"`. Menulis ulang sebagian nama juga sah selama ada minimal satu nama baru di sisi kiri: setelah `a, b := 1, 2`, baris `a, c := 3, 4` mendeklarasikan `c` dan hanya mengisi ulang `a`. Kalau tidak ada nama baru sama sekali, muncul error `no new variables on left side of :=`.\n\nKonvensi yang dijaga komunitas: pakai `:=` sebagai bawaan di dalam fungsi, dan pakai `var` ketika variabel sengaja dibiarkan zero value dulu (`var total int`) atau ketika tipenya berbeda dari yang tersirat dari nilainya. Di level package, `:=` tidak tersedia, jadi pilihannya tinggal `var`.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\nvar aplikasi = \"KasirKita\" // di level package, := tidak tersedia\n\nfunc main() {\n\tharga := 25000   // tipe disimpulkan menjadi int\n\tvar stok = 12    // var dengan nilai, hasilnya sama\n\tvar kasir string // tanpa nilai: zero value \"\"\n\n\tfmt.Printf(\"%s %d %d %q\\n\", aplikasi, harga, stok, kasir)\n}",
            caption: "var tanpa nilai menghasilkan zero value, bukan error.",
          },
        },
        {
          kind: "quiz",
          question: "Di mana `x := 10` TIDAK boleh ditulis?",
          options: [
            "Di dalam fungsi main",
            "Di level package, di luar fungsi",
            "Di dalam blok if",
            "Di dalam blok for",
          ],
          answer: 1,
          explanation:
            "Short declaration `:=` hanya berlaku di dalam fungsi atau blok di dalamnya. Di level package yang sah hanya deklarasi var, const, type, dan func.",
        },
        {
          kind: "code",
          title: "Deklarasi belanja",
          prompt:
            "Lengkapi program penjumlah belanja: baris pertama butuh deklarasi dua variabel bertipe int, baris kedua butuh operator deklarasi singkat. Ganti setiap `___`.",
          mode: "fill",
          template:
            "package main\n\nimport \"fmt\"\n\nfunc main() {\n\t___ harga, jumlah int\n\tfmt.Scan(&harga, &jumlah)\n\ttotal ___ harga * jumlah\n\tfmt.Printf(\"Total belanja: %d\\n\", total)\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tvar harga, jumlah int\n\tfmt.Scan(&harga, &jumlah)\n\ttotal := harga * jumlah\n\tfmt.Printf(\"Total belanja: %d\\n\", total)\n}",
          tests: [
            { stdin: "5000 3", expectedOutput: "Total belanja: 15000" },
            { stdin: "1250 8", expectedOutput: "Total belanja: 10000" },
            { stdin: "999 0", expectedOutput: "Total belanja: 0", hidden: true },
          ],
          hints: [
            "Deklarasi dua variabel sekaligus dengan tipe yang sama: var a, b int.",
            "Untuk mendeklarasikan sekaligus mengisi dengan hasil ekspresi, pakai kolon sama dengan.",
            "Jawabannya: var di baris pertama, := di baris kedua.",
          ],
        },
      ],
    },
    {
      slug: "zero-value",
      title: "Zero Value Setiap Tipe",
      summary: "Variabel tanpa nilai tetap berisi sesuatu: zero value dari tipenya.",
      steps: [
        {
          kind: "theory",
          title: "Tidak ada nilai sampah",
          body: "Go tidak punya variabel yang berisi nilai sampah. Setiap variabel yang dideklarasikan tanpa nilai langsung diisi zero value tipenya: `0` untuk semua tipe bilangan bulat, `0.0` untuk `float64`, `\"\"` untuk string, dan `false` untuk bool.\n\nTipe yang merujuk ke data lain zero valuenya `nil`: slice, map, pointer, function, channel, dan interface. Slice nil tetap bisa di-`append` dan `len`-nya nol, jadi pola `var hasil []int` lalu diisi di loop sepenuhnya sah. Map nil hanya boleh dibaca; menulisnya memicu panic, dibahas di modul berikutnya.\n\nZero value mengubah gaya menulis program. Penjumlah dan penanda tidak perlu diinisialisasi eksplisit: `var total int` sudah bernilai nol, `var ketemu bool` sudah bernilai false. Manfaatkan; `x := 0` yang berlebihan justru menyembunyikan niat.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tvar hitung int\n\tvar rata float64\n\tvar nama string\n\tvar aktif bool\n\tvar peserta []string\n\n\tfmt.Printf(\"%d %.1f %q %t\\n\", hitung, rata, nama, aktif)\n\tfmt.Printf(\"slice nil: %v, len %d\\n\", peserta, len(peserta))\n}",
            caption: "Empat zero value dasar, dan slice nil yang len-nya tetap bisa dihitung.",
          },
        },
        {
          kind: "quiz",
          question: "Apa zero value dari variabel bertipe `string`?",
          options: ['""', '"0"', "null", "undefined"],
          answer: 0,
          explanation:
            "String tanpa nilai adalah string kosong \"\". Angka nol, bool false, dan tipe referensi seperti slice dan map bernilai nil.",
        },
        {
          kind: "code",
          title: "Pilih zero value yang tepat",
          prompt:
            "Program menjumlah n bilangan dan menandai ada tidaknya bilangan ganjil. Lengkapi deklarasi dua akumulator dengan zero value yang tepat, sehingga tidak perlu inisialisasi manual.",
          mode: "fill",
          template:
            "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tvar total ___\n\tvar adaGanjil ___\n\tfor i := 0; i < n; i++ {\n\t\tvar x int\n\t\tfmt.Scan(&x)\n\t\ttotal += x\n\t\tif x%2 != 0 {\n\t\t\tadaGanjil = true\n\t\t}\n\t}\n\tfmt.Println(total)\n\tfmt.Println(adaGanjil)\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tvar total int\n\tvar adaGanjil bool\n\tfor i := 0; i < n; i++ {\n\t\tvar x int\n\t\tfmt.Scan(&x)\n\t\ttotal += x\n\t\tif x%2 != 0 {\n\t\t\tadaGanjil = true\n\t\t}\n\t}\n\tfmt.Println(total)\n\tfmt.Println(adaGanjil)\n}",
          tests: [
            { stdin: "3\n1 2 3", expectedOutput: "6\ntrue" },
            { stdin: "4\n2 4 6 8", expectedOutput: "20\nfalse" },
            { stdin: "1\n-5", expectedOutput: "-5\ntrue", hidden: true },
          ],
          hints: [
            "Penjumlah bilangan bulat dimulai dari nol tanpa perlu ditulis ulang.",
            "Penanda ada atau tidak bertipe bool, dan defaultnya false.",
            "Jawabannya: int untuk total, bool untuk adaGanjil.",
          ],
        },
      ],
    },
    {
      slug: "fmt-verbs-lanjut",
      title: "fmt Lanjut: %v, %T, dan Lebar Kolom",
      summary: "Kendalikan bentuk keluaran: verb umum, lebar, presisi, dan perataan.",
      steps: [
        {
          kind: "theory",
          title: "Verb yang sering dipakai kerja",
          body: "Verb `fmt` yang dipakai sehari-hari: `%v` mencetak nilai apa pun dalam bentuk bawaan, `%+v` menambah nama field untuk struct, `%T` mencetak tipe data, dan `%q` mencetak string lengkap dengan tanda kutip sehingga string kosong terlihat sebagai `\"\"`.\n\nAngka dan teks bisa diberi lebar kolom: `%6.2f` berarti minimal enam karakter dengan dua desimal dan rata kanan; `%-8s` berarti teks rata kiri selebar delapan karakter; `%05d` mengisi kekurangan lebar dengan nol di depan. Spasi pengisi membuat kolom tetap lurus tanpa penjumlahan manual.\n\nPola inilah yang dipakai untuk laporan dan struk: angka rata kanan, teks rata kiri, kolom dipisah `|`. Perhatikan contoh berikut dan hitung sendiri karakternya.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tpi := 3.14159\n\tnama := \"go\"\n\n\tfmt.Printf(\"%v %T %q\\n\", pi, pi, nama)\n\t// 3.14159 float64 \"go\"\n\n\tfmt.Printf(\"[%6.2f] [%-6s] [%06d]\\n\", pi, nama, 42)\n\t// [  3.14] [go    ] [000042]\n}",
            caption: "Lebar 6: 3.14 hanya empat karakter, dua spasi mengisi kekurangan. Minus membalik perataan.",
          },
        },
        {
          kind: "quiz",
          question: "Apa keluaran `fmt.Printf(\"%6.2f\", 3.14159)`?",
          options: ["3.14159", "  3.14", "3.14  ", "3.140000"],
          answer: 1,
          explanation:
            "Lebar 6 dengan 2 desimal: hasilnya 3.14 (empat karakter), rata kanan sehingga dua spasi mengisi di depan.",
        },
        {
          kind: "code",
          title: "Kartu nilai satu baris",
          prompt:
            "Program membaca nama (satu kata) dan sebuah nilai desimal, lalu mencetak tiga kolom: nama rata kiri selebar 8, nilai dengan dua desimal rata kanan lebar 6, dan tipe data nilai. Lengkapi dua verb yang hilang.",
          mode: "fill",
          template:
            "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tvar nama string\n\tvar nilai float64\n\tfmt.Scan(&nama)\n\tfmt.Scan(&nilai)\n\tfmt.Printf(\"%-8s|___|___\\n\", nama, nilai, nilai)\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tvar nama string\n\tvar nilai float64\n\tfmt.Scan(&nama)\n\tfmt.Scan(&nilai)\n\tfmt.Printf(\"%-8s|%6.2f|%T\\n\", nama, nilai, nilai)\n}",
          tests: [
            { stdin: "Dina\n3.14159", expectedOutput: "Dina    |  3.14|float64" },
            { stdin: "Bagas\n87.5", expectedOutput: "Bagas   | 87.50|float64" },
            { stdin: "Sinta\n100", expectedOutput: "Sinta   |100.00|float64", hidden: true },
          ],
          hints: [
            "Verb desimal dengan lebar dan presisi: persen, angka lebar, titik, angka desimal, huruf f.",
            "Tipe data sebuah nilai dicetak dengan verb huruf T besar.",
            "Jawabannya: %6.2f dan %T.",
          ],
        },
      ],
    },
    {
      slug: "multiple-return-named",
      title: "Multiple Return dan Named Return",
      summary: "Kembalikan beberapa nilai sekaligus dan ikuti idiom (hasil, err).",
      steps: [
        {
          kind: "theory",
          title: "Dua nilai dalam satu return",
          body: "Satu fungsi Go bisa mengembalikan beberapa nilai: tulis tipe-tipenya berurutan dalam tanda kurung, lalu kembalikan dengan koma. Fitur ini jantungnya desain error Go: fungsi yang bisa gagal mengembalikan `(hasil, error)`, dan pemanggil wajib memeriksa `err` sebelum memakai hasilnya.\n\nNilai kembali juga bisa diberi nama: `func minMax(a, b int) (kecil int, besar int)`. Nama itu sudah terdeklarasi di dalam fungsi sebagai zero value, dan `return` tanpa argumen (naked return) mengembalikan isinya. Untuk fungsi pendek ini terbaca bagus sekaligus jadi dokumentasi; pada fungsi panjang, naked return menyembunyikan alur, jadi tulis eksplisit.\n\nMenerima hasilnya juga dengan koma: `lo, hi := minMax(3, 7)`. Semua nilai yang diterima harus dipakai atau dibuang dengan `_`, aturan yang dibahas dalam lesson tersendiri.",
          code: {
            language: "go",
            content: "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\nfunc bagi(a, b float64) (float64, error) {\n\tif b == 0 {\n\t\treturn 0, errors.New(\"pembagi nol\")\n\t}\n\treturn a / b, nil\n}\n\nfunc main() {\n\thasil, err := bagi(7, 2)\n\tfmt.Println(hasil, err) // 3.5 <nil>\n\n\tgagal, err := bagi(7, 0)\n\tfmt.Println(gagal, err) // 0 pembagi nol\n}",
            caption: "Pola (hasil, err): hasil zero value saat gagal, err berisi pesan.",
          },
        },
        {
          kind: "quiz",
          question: "Pada fungsi Go yang bisa gagal, idiom nilai kembalian kedua yang paling umum adalah?",
          options: ["bool sukses", "int kode status", "error", "string pesan"],
          answer: 2,
          explanation:
            "Idiom Go adalah (hasil, error). Pemanggil memeriksa err != nil sebelum mempercayai hasilnya, bukan bool atau kode status seperti di bahasa lain.",
        },
        {
          kind: "code",
          title: "min dan max dari tiga angka",
          prompt:
            "Lengkapi fungsi `minMax` agar mengembalikan nilai terkecil dan terbesar dari tiga bilangan. Perhatikan urutan nilai kembalian: terkecil dulu, terbesar kemudian.",
          mode: "fill",
          template:
            "package main\n\nimport \"fmt\"\n\nfunc minMax(a, b, c int) (int, int) {\n\tkecil, besar := a, a\n\tif b < kecil {\n\t\tkecil = b\n\t}\n\tif b > besar {\n\t\tbesar = b\n\t}\n\tif c < kecil {\n\t\tkecil = c\n\t}\n\tif c > besar {\n\t\tbesar = c\n\t}\n\treturn ___, ___\n}\n\nfunc main() {\n\tvar a, b, c int\n\tfmt.Scan(&a, &b, &c)\n\tlo, hi := minMax(a, b, c)\n\tfmt.Println(\"min:\", lo)\n\tfmt.Println(\"max:\", hi)\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\nfunc minMax(a, b, c int) (int, int) {\n\tkecil, besar := a, a\n\tif b < kecil {\n\t\tkecil = b\n\t}\n\tif b > besar {\n\t\tbesar = b\n\t}\n\tif c < kecil {\n\t\tkecil = c\n\t}\n\tif c > besar {\n\t\tbesar = c\n\t}\n\treturn kecil, besar\n}\n\nfunc main() {\n\tvar a, b, c int\n\tfmt.Scan(&a, &b, &c)\n\tlo, hi := minMax(a, b, c)\n\tfmt.Println(\"min:\", lo)\n\tfmt.Println(\"max:\", hi)\n}",
          tests: [
            { stdin: "3 9 5", expectedOutput: "min: 3\nmax: 9" },
            { stdin: "7 1 4", expectedOutput: "min: 1\nmax: 7" },
            { stdin: "-2 0 8", expectedOutput: "min: -2\nmax: 8", hidden: true },
          ],
          hints: [
            "Variabel yang terus diperbarui di empat if itu bernama kecil dan besar.",
            "Urutan return harus cocok dengan urutan tipe kembalian (int, int): nilai terkecil lebih dulu.",
            "Jawabannya: return kecil, besar.",
          ],
        },
      ],
    },
    {
      slug: "type-conversion-eksplisit",
      title: "Konversi Tipe Eksplisit",
      summary: "int dan float64 tidak pernah dicampur diam-diam; tulis konversinya sendiri.",
      steps: [
        {
          kind: "theory",
          title: "T(nilai): tidak ada konversi senyap",
          body: "Go tidak pernah mengonversi tipe secara otomatis. Menjumlahkan `int` dengan `float64` langsung adalah error kompilasi, begitu juga mengisi variabel `float64` dengan `int`. Konversi selalu ditulis eksplisit dengan bentuk `T(nilai)`: `float64(total)`, `int(berat)`, `byte(x)`.\n\nKonversi `float64` ke `int` memotong bagian desimal, bukan membulatkan: `int(3.9)` menghasilkan 3 dan `int(-3.9)` menghasilkan -3. Untuk string dan angka, `T(nilai)` tidak berlaku begitu saja: gunakan package `strconv` (`strconv.Atoi`, `strconv.Itoa`). Menulis `int(teks)` justru menyalin byte string itu sebagai angka, bukan menguraikan isinya.\n\nKekakuan ini disengaja. Setiap konversi yang bisa kehilangan data terlihat di kode dan mudah dicari saat review. Kode Go mungkin sedikit lebih panjang, tapi tidak ada kejutan tipe yang tersembunyi di baris ke-200.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\ttotal := 17\n\tpembagi := 4\n\n\trata := float64(total) / float64(pembagi)\n\tfmt.Println(rata) // 4.25\n\n\tberat := 62.9\n\tfmt.Println(int(berat)) // 62, desimal dipotong\n}",
            caption: "Konversi ditulis di kedua operand agar pembagian benar-benar desimal.",
          },
        },
        {
          kind: "quiz",
          question: "Berapa hasil `int(3.9)`?",
          options: ["4", "3", "3.9", "error kompilasi"],
          answer: 1,
          explanation:
            "Konversi float64 ke int memotong bagian desimal, bukan membulatkan. 3.9 menjadi 3, dan -3.9 menjadi -3.",
        },
        {
          kind: "code",
          title: "Rata-rata yang selalu bulat",
          prompt:
            "Program rata-rata ini selalu mencetak hasil bulat padahal seharusnya desimal. Temukan satu kesalahannya dan perbaiki sampai semua tes lulus.",
          mode: "fix",
          template:
            "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tvar total, n int\n\tfmt.Scan(&total, &n)\n\trata := total / n\n\tfmt.Printf(\"%.2f\\n\", rata)\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tvar total, n int\n\tfmt.Scan(&total, &n)\n\trata := float64(total) / float64(n)\n\tfmt.Printf(\"%.2f\\n\", rata)\n}",
          tests: [
            { stdin: "17\n4", expectedOutput: "4.25" },
            { stdin: "10\n3", expectedOutput: "3.33" },
            { stdin: "9\n2", expectedOutput: "4.50", hidden: true },
          ],
          hints: [
            "total dan n bertipe int, sehingga pembagiannya pembagian bulat.",
            "Konversikan kedua operand ke float64 sebelum dibagi, bukan setelahnya.",
            "Jawabannya: rata := float64(total) / float64(n).",
          ],
        },
      ],
    },
    {
      slug: "const-dan-iota",
      title: "Konstanta dan iota",
      summary: "Nilai yang dihitung saat kompilasi dan cara Go membuat enum.",
      steps: [
        {
          kind: "theory",
          title: "const dan penghitung otomatis",
          body: "`const` mendeklarasikan nilai yang tetap dan dihitung saat kompilasi: angka, string, atau bool dari ekspresi literal. Konstanta tidak boleh diisi hasil variabel atau fungsi yang berjalan saat program jalan. Konstanta tanpa tipe disebut untyped: ia menyesuaikan diri dengan konteks, jadi `const kkm = 70` bisa dibandingkan dengan `int` maupun `float64` tanpa konversi.\n\n`iota` adalah penghitung yang hanya hidup di dalam blok `const`: bernilai 0 pada baris pertama dan bertambah satu tiap baris. Ekspresi pada baris pertama disalin ke baris berikut yang kosong, sehingga `Senin = iota + 1` membuat semua baris di bawahnya ikut bertambah: 1, 2, 3, dan seterusnya.\n\nIni cara Go membuat enum. Kombinasikan dengan tipe sendiri (`type Hari int`) supaya kelompok konstanta itu punya tipe yang jelas. Pola lanjutan yang akan kamu temui: `_ = iota` untuk melewati nilai, dan `1 << iota` untuk flag bitmask.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\ntype Hari int\n\nconst (\n\tSenin Hari = iota + 1 // 1\n\tSelasa                // 2, ekspresi di atas disalin\n\tRabu                  // 3\n)\n\nfunc main() {\n\tconst kkm = 70 // untyped: cocok untuk int maupun float64\n\tfmt.Println(Senin, Selasa, Rabu, kkm)\n}",
            caption: "iota mulai dari 0; +1 menggeser seluruh deret.",
          },
        },
        {
          kind: "quiz",
          question:
            "Pada blok konstanta `Senin = iota + 1`, lalu `Selasa`, lalu `Rabu`, berapa nilai `Rabu`?",
          options: ["2", "3", "4", "0"],
          answer: 1,
          explanation:
            "iota bernilai 0, 1, 2 untuk ketiga baris. Dengan +1: Senin 1, Selasa 2, Rabu 3.",
        },
        {
          kind: "quiz",
          question: "Nilai mana yang sah diisi ke sebuah `const`?",
          options: [
            "Hasil pemanggilan fungsi saat program berjalan",
            "Isi variabel yang baru dibaca dari input",
            "Ekspresi dari literal yang bisa dihitung saat kompilasi",
            "Nilai yang berubah setiap bulan",
          ],
          answer: 2,
          explanation:
            "const wajib bisa dihitung saat kompilasi: literal dan ekspresi antar literal boleh, variabel dan hasil fungsi runtime tidak.",
        },
      ],
    },
    {
      slug: "scope-dan-shadowing",
      title: "Scope dan Shadowing",
      summary:
        "Di mana variabel hidup, dan bagaimana := bisa membuat variabel baru yang menutupi yang lama.",
      steps: [
        {
          kind: "theory",
          title: "Blok menentukan umur variabel",
          body: "Variabel Go hidup dari baris deklarasinya sampai akhir blok kurung kurawal tempat ia dideklarasikan. Setiap `if`, `for`, dan fungsi membentuk blok sendiri. Kode di blok luar terlihat dari dalam, tetapi tidak sebaliknya.\n\nKarena `:=` selalu mendeklarasikan variabel baru, menulis `x := 20` di blok dalam saat `x` sudah ada di luar menciptakan variabel kedua yang sama sekali berbeda. Yang terlihat di blok dalam adalah yang baru; begitu blok berakhir, `x` di luar kembali. Fenomena ini bernama shadowing, dan bug akibatnya licik: program jalan tanpa error, tapi pembaruan tidak pernah sampai ke variabel yang dimaksud.\n\nScope pendek justru idiom Go yang baik. Bentuk `if v, ok := m[k]; ok { ... }` mendeklarasikan v dan ok hanya untuk if itu (termasuk blok else miliknya), lalu membuangnya. Variabel yang hidup sebentar membatasi kesalahan pembacaan.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tx := 10\n\tif x > 5 {\n\t\tx := 99       // variabel BARU, menutupi x di luar\n\t\tfmt.Println(x) // 99\n\t}\n\tfmt.Println(x) // 10, x di luar tak tersentuh\n}",
            caption: "Dua x yang berbeda hidup di dua blok berbeda.",
          },
        },
        {
          kind: "quiz",
          question:
            "Apa keluaran program berikut?\n\n```go\nx := 10\nif true {\n  x := 20\n  fmt.Println(x)\n}\nfmt.Println(x)\n```",
          options: [
            "20 lalu 20",
            "20 lalu 10",
            "10 lalu 10",
            "Error kompilasi karena x dideklarasikan dua kali",
          ],
          answer: 1,
          explanation:
            "x di dalam if adalah variabel baru hasil :=, jadi blok dalam mencetak 20. Setelah blok berakhir, x di luar tetap 10.",
        },
        {
          kind: "quiz",
          question:
            "Pada `if v := hitung(); v > 0 { ... } else { ... }`, sampai di mana variabel `v` bisa dipakai?",
          options: [
            "Sampai akhir fungsi tempat if itu berada",
            "Hanya di dalam blok if dan else miliknya",
            "Hanya di baris kondisinya",
            "Sampai akhir file",
          ],
          answer: 1,
          explanation:
            "Variabel yang dideklarasikan pada statement if hanya hidup di blok if dan else milik statement itu. Setelahnya v tidak ada lagi.",
        },
      ],
    },
    {
      slug: "unused-dan-blank-identifier",
      title: "Unused Variable dan Blank Identifier",
      summary: "Compiler Go menolak variabel yang tidak dipakai; _ membuang nilai dengan sengaja.",
      steps: [
        {
          kind: "theory",
          title: "Aturan compiler dan tempat pembuangan",
          body: "Go membatalkan kompilasi ketika ada variabel lokal yang dideklarasikan tetapi tidak pernah dipakai, dengan pesan `declared and not used`. Import yang tidak terpakai ditolak dengan alasan yang sama. Aturan ini menjaga kode bersih dari sisa percobaan, meski saat prototyping kadang menyebalkan.\n\nBlank identifier `_` adalah tempat pembuangan resmi. Saat fungsi mengembalikan beberapa nilai dan salah satunya tidak dibutuhkan, tangkap dengan `_`: `hasil, _ := bagi(a, b)`. Yang masuk ke `_` tidak bisa dibaca dan boleh ditimpa berkali-kali, karena `_` bukan variabel.\n\nPemakaian paling umum: membuang error untuk kasus tertentu, membuang indeks pada `for _, v := range ...`, dan membuang sisi kiri atau kanan multiple assignment. Tapi hati-hati: `_` untuk error jangan dijadikan kebiasaan. Error yang dibuang diam-diam adalah sumber bug yang paling sulit dilacak.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\nfunc bagi(a, b int) (hasil int, sisa int) {\n\treturn a / b, a % b\n}\n\nfunc main() {\n\thasil, _ := bagi(17, 5) // sisanya tidak dibutuhkan\n\tfmt.Println(hasil)      // 3\n\n\t_, sisa := bagi(17, 5)\n\tfmt.Println(sisa) // 2\n}",
            caption: "Posisi _ menentukan nilai mana yang dibuang.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi pada nilai yang ditampung blank identifier `_`?",
          options: [
            "Disimpan untuk dipakai nanti",
            "Dibuang; tidak bisa dibaca",
            "Otomatis diubah menjadi nol",
            "Ditandai sebagai komentar",
          ],
          answer: 1,
          explanation:
            "_ hanya menampung agar compiler tidak protes. Isinya tidak bisa diakses dan boleh ditimpa terus karena _ bukan variabel.",
        },
        {
          kind: "code",
          title: "Buang sisa yang tak terpakai",
          prompt:
            "Program ini gagal dikompilasi karena satu variabel tidak pernah dipakai. Perbaiki dengan blank identifier tanpa mengubah hasil cetak.",
          mode: "fix",
          template:
            "package main\n\nimport \"fmt\"\n\nfunc bagi(a, b int) (int, int) {\n\treturn a / b, a % b\n}\n\nfunc main() {\n\tvar a, b int\n\tfmt.Scan(&a, &b)\n\thasil, sisa := bagi(a, b)\n\tfmt.Println(hasil)\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\nfunc bagi(a, b int) (int, int) {\n\treturn a / b, a % b\n}\n\nfunc main() {\n\tvar a, b int\n\tfmt.Scan(&a, &b)\n\thasil, _ := bagi(a, b)\n\tfmt.Println(hasil)\n}",
          tests: [
            { stdin: "17\n5", expectedOutput: "3" },
            { stdin: "20\n6", expectedOutput: "3" },
            { stdin: "9\n4", expectedOutput: "2", hidden: true },
          ],
          hints: [
            "Baca pesan error compiler: ia menyebut nama variabel yang bermasalah.",
            "sisa tidak pernah dipakai; ganti dia dengan tempat pembuangan nilai.",
            "Jawabannya: hasil, _ := bagi(a, b).",
          ],
        },
      ],
    },
    {
      slug: "konvensi-penamaan-go",
      title: "Konvensi Penamaan Go",
      summary: "MixedCaps, aturan exported dan unexported, serta panjang nama yang wajar.",
      steps: [
        {
          kind: "theory",
          title: "Nama adalah kontrak",
          body: "Go memakai MixedCaps dan tidak mengenal snake_case: `userProfile` benar, `user_profile` salah. Akronim ditulis kapital penuh: `userID`, `httpURL`, `apiClient`. Konsistensi ini dijaga gofmt, jadi perbedaan gaya antar programmer praktis hilang.\n\nHuruf pertama adalah aturan visibilitas, bukan selera. Nama yang diawali huruf besar (misalnya `HitungPajak`, `StrukBelanja`) diekspor dan bisa dipakai dari package lain; yang diawali huruf kecil hanya hidup di package sendiri. Inilah satu-satunya mekanisme publik dan privat di Go. Konsekuensinya: jangan menulis huruf besar hanya karena terlihat penting, karena itu mengubah API package.\n\nPanjang nama menyesuaikan scope. Variabel di tiga baris loop boleh bernama `i` atau `r`; nama yang hidup lintas fungsi harus jelas tanpa konteks. Field struct memakai nama benda (`TotalHarga`), fungsi memakai kata kerja. Nama pendek yang paling sering muncul di kode Go: `err`, `ok`, `buf`, `dst`, `src`.",
          code: {
            language: "go",
            content: "package kasir\n\ntype StrukBelanja struct { // exported: bisa dipakai package lain\n\tTotalHarga int    // exported\n\tcatatan    string // unexported, privat untuk package kasir\n}\n\nfunc HitungPajak(total int) int { // exported\n\treturn total * 11 / 100\n}\n\nfunc hitungDiskon(total int) int { // unexported\n\treturn total / 10\n}",
            caption: "Huruf pertama menentukan siapa yang boleh memakai nama itu.",
          },
        },
        {
          kind: "quiz",
          question: "Variabel untuk menyimpan profil pengguna, mana nama yang idiomatik Go?",
          options: ["user_profile", "UserProfile", "userProfile", "usrprf"],
          answer: 2,
          explanation:
            "MixedCaps untuk variabel lokal diawali huruf kecil: userProfile. Underscore bukan gaya Go, dan UserProfile akan menjadikannya exported.",
        },
        {
          kind: "quiz",
          question: "Apa arti nama fungsi yang diawali huruf besar seperti `HitungPajak`?",
          options: [
            "Wajib dipanggil dengan kata kunci publik",
            "Exported: bisa dipakai dari package lain",
            "Menandai fungsi konstruktor",
            "Konstanta, bukan fungsi",
          ],
          answer: 1,
          explanation:
            "Huruf pertama besar berarti nama itu diekspor dan terlihat oleh package lain. Huruf kecil berarti privat untuk package sendiri.",
        },
      ],
    },
    {
      slug: "latihan-go-idiomatik",
      title: "Latihan Gabungan Modul 0",
      summary: "Konstanta, konversi, perbandingan, dan format keluaran dalam satu program.",
      steps: [
        {
          kind: "theory",
          title: "Merangkai kebiasaan kecil",
          body: "Modul ini mengumpulkan kebiasaan kecil yang membedakan kode Go dari kode yang hanya kebetulan jalan di Go: deklarasi yang tepat, zero value yang dimanfaatkan, konversi yang ditulis eksplisit, dan printf yang rapi. Latihan berikut merangkai semuanya sekaligus.\n\nProgram di bawah menghitung rata-rata tiga nilai dan memutuskan lulus atau tidak berdasarkan konstanta `kkm`. Perhatikan dua hal: konversi `float64` wajib sebelum pembagian desimal, dan konstanta untyped `kkm = 70` boleh dibandingkan langsung dengan rata-rata `float64` tanpa konversi tambahan.",
          code: {
            language: "go",
            content: "const kkm = 70 // untyped: bisa dibandingkan dengan float64\n\n// rata := float64(a+b+c) / 3\n// status lulus jika rata >= kkm",
            caption: "Gambaran program yang akan kamu lengkapi di langkah berikutnya.",
          },
        },
        {
          kind: "code",
          title: "Penentu kelulusan",
          prompt:
            "Lengkapi program penilaian: isi konversi tipe pada perhitungan rata-rata dan operator perbandingan pada kondisi kelulusan. Rata-rata dicetak dengan dua desimal.",
          mode: "fill",
          template:
            "package main\n\nimport \"fmt\"\n\nconst kkm = 70\n\nfunc main() {\n\tvar a, b, c int\n\tfmt.Scan(&a, &b, &c)\n\trata := ___(a+b+c) / 3\n\tstatus := \"remedi\"\n\tif rata ___ kkm {\n\t\tstatus = \"lulus\"\n\t}\n\tfmt.Printf(\"rata-rata: %.2f\\n\", rata)\n\tfmt.Println(status)\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\nconst kkm = 70\n\nfunc main() {\n\tvar a, b, c int\n\tfmt.Scan(&a, &b, &c)\n\trata := float64(a+b+c) / 3\n\tstatus := \"remedi\"\n\tif rata >= kkm {\n\t\tstatus = \"lulus\"\n\t}\n\tfmt.Printf(\"rata-rata: %.2f\\n\", rata)\n\tfmt.Println(status)\n}",
          tests: [
            { stdin: "70 80 90", expectedOutput: "rata-rata: 80.00\nlulus" },
            { stdin: "60 70 65", expectedOutput: "rata-rata: 65.00\nremedi" },
            { stdin: "70 70 71", expectedOutput: "rata-rata: 70.33\nlulus", hidden: true },
          ],
          hints: [
            "Pembagian desimal butuh operand float64; angka 3 adalah konstanta untyped yang menyesuaikan sendiri.",
            "Syarat lulus: rata-rata sama dengan atau di atas kkm.",
            "Jawabannya: float64 dan >=.",
          ],
        },
      ],
    },
    // ==================== MODUL 1: Slice, Map, dan Array ====================
    {
      slug: "array-vs-slice",
      title: "Array vs Slice",
      summary: "Kenali bedanya, dan kenapa slice yang dipakai sehari-hari.",
      steps: [
        {
          kind: "theory",
          title: "Tipe yang panjangnya melekat",
          body: "Array `[N]T` punya panjang tetap yang menjadi bagian tipenya: `[3]int` dan `[4]int` adalah dua tipe berbeda yang tidak bisa saling diisi. Panjangnya ikut terbawa saat array dikirim ke fungsi. Karena kaku, array jarang dipakai langsung; ia lebih sering jadi struktur di balik layar.\n\nSlice `[]T` adalah jendela ke sebuah backing array: tiga hal, yaitu pointer ke elemen pertama yang terlihat, panjang `len`, dan kapasitas `cap`. Karena itu slice murah dikirim ke fungsi (hanya header, bukan isinya) dan bisa bertambah lewat `append`: memakai sisa kapasitas, atau mengalokasikan backing array baru ketika tidak ada sisa.\n\nAturan praktisnya: nyaris selalu pakai slice. Kamu akan memakai array secara sadar hanya di situasi khusus, misalnya buffer berukuran pasti seperti `[32]byte` untuk hash.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tvar arr [3]int        // panjang 3, bagian dari tipenya\n\tslc := []int{1, 2, 3} // slice tanpa panjang tetap\n\n\tfmt.Println(arr, len(arr)) // [0 0 0] 3\n\tfmt.Println(slc, len(slc)) // [1 2 3] 3\n\n\tslc = append(slc, 4) // slice tumbuh, array tidak bisa\n\tfmt.Println(slc)\n}",
            caption: "Array [3]int dan slice []int terlihat mirip saat dicetak, tapi berbeda tipe.",
          },
        },
        {
          kind: "quiz",
          question: "Tipe mana yang panjangnya menjadi bagian dari tipenya?",
          options: ["[]int", "[3]int", "string", "map[string]int"],
          answer: 1,
          explanation:
            "[3]int dan [4]int adalah tipe yang berbeda dan tidak bisa saling diisi. Slice []int tidak membawa panjang dalam tipenya.",
        },
        {
          kind: "code",
          title: "Kumpulkan angka ke slice",
          prompt:
            "Program membaca n lalu n bilangan, mengumpulkannya ke slice dengan append, dan mencetak isinya beserta panjangnya. Lengkapi baris append.",
          mode: "fill",
          template:
            "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tangka := []int{}\n\tfor i := 0; i < n; i++ {\n\t\tvar x int\n\t\tfmt.Scan(&x)\n\t\tangka = ___(angka, x)\n\t}\n\tfmt.Println(angka)\n\tfmt.Println(len(angka))\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tangka := []int{}\n\tfor i := 0; i < n; i++ {\n\t\tvar x int\n\t\tfmt.Scan(&x)\n\t\tangka = append(angka, x)\n\t}\n\tfmt.Println(angka)\n\tfmt.Println(len(angka))\n}",
          tests: [
            { stdin: "3\n10 20 30", expectedOutput: "[10 20 30]\n3" },
            { stdin: "4\n1 2 3 4", expectedOutput: "[1 2 3 4]\n4" },
            { stdin: "1\n42", expectedOutput: "[42]\n1", hidden: true },
          ],
          hints: [
            "Fungsi bawaan yang menambah elemen ke slice dan mengembalikan slice hasilnya.",
            "Hasil append harus ditampung kembali ke variabel angka.",
            "Jawabannya: append.",
          ],
        },
      ],
    },
    {
      slug: "len-dan-cap",
      title: "len, cap, dan Pertumbuhan append",
      summary: "Panjang yang terlihat dan kapasitas di belakang layar.",
      steps: [
        {
          kind: "theory",
          title: "Dua angka dalam satu slice",
          body: "`len(s)` adalah banyaknya elemen yang terlihat lewat slice; `cap(s)` adalah ukuran backing array sejak awal jendelanya. `append` menambah elemen di posisi len; selama masih muat dalam cap, tidak ada alokasi baru dan slice yang dikembalikan berbagi backing array dengan yang lama.\n\nKetika len sudah menyamai cap dan append butuh ruang lagi, runtime mengalokasikan backing array baru yang lebih besar, menyalin isi lama, lalu mengembalikan slice yang menunjuk ke sana. Untuk slice kecil pertumbuhannya umumnya menggandakan kapasitas, tapi angka pastinya detail implementasi: jangan pernah menulis kode yang mengandalkan cap tertentu.\n\nSatu properti yang bisa diandalkan: slice nil pun len 0 dan cap 0, dan append ke slice nil sah. Karena itu `var hasil []int` diikuti loop append adalah cara idiomatik membangun slice tanpa make sama sekali.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\ts := make([]int, 2, 4)\n\tfmt.Println(s, len(s), cap(s)) // [0 0] 2 4\n\n\ts = append(s, 7)\n\ts = append(s, 8)\n\tfmt.Println(len(s), cap(s)) // 4 4, masih muat\n\n\ts = append(s, 9) // cap habis: backing array baru\n\tfmt.Println(s, len(s), cap(s))\n}",
            caption: "Setelah cap 4 terlampaui, kapasitas tumbuh dan isinya dipindahkan.",
          },
        },
        {
          kind: "quiz",
          question: "Setelah `s := make([]int, 2, 4)`, berapa `len(s)` dan `cap(s)`?",
          options: ["len 2, cap 2", "len 4, cap 4", "len 2, cap 4", "len 4, cap 2"],
          answer: 2,
          explanation:
            "Argumen pertama make mengisi len dengan elemen zero value; argumen kedua menetapkan cap backing array.",
        },
        {
          kind: "quiz",
          question: "Kapan append mengembalikan slice dengan backing array yang baru?",
          options: [
            "Setiap kali append dipanggil",
            "Saat elemen pertama diubah",
            "Saat len sudah mencapai cap sehingga elemen baru tidak muat lagi",
            "Append tidak pernah membuat backing array baru",
          ],
          answer: 2,
          explanation:
            "Selama masih ada kapasitas, append hanya mengisi ruang kosong backing array yang sama. Realokasi dan penyalinan terjadi ketika cap tidak cukup.",
        },
      ],
    },
    {
      slug: "slice-expression-sharing",
      title: "Slice Expression dan Sharing",
      summary: "Memotong slice tidak menyalin: hasilnya berbagi backing array dengan aslinya.",
      steps: [
        {
          kind: "theory",
          title: "Pemotongan bukan penyalinan",
          body: "`s[low:high]` mengambil elemen mulai indeks low sampai high-1; low dan high boleh kosong (`s[:3]`, `s[2:]`). Hasilnya bukan salinan, melainkan jendela baru yang berbagi backing array dengan s. Cap jendelanya adalah sisa ruang dari posisi low sampai ujung backing array.\n\nKonsekuensi pertama: mengubah elemen lewat jendela mengubah data asli. Konsekuensi kedua yang lebih licik: `append` pada jendela yang masih punya cap sisa akan menimpa elemen di luar jendelanya pada backing array yang sama. Ini jebakan nomor satu pada slice Go dan sering muncul di kode nyata saat seseorang memotong slice lalu append tanpa sadar.\n\nBentuk tiga indeks `s[low:high:max]` membatasi cap jendela menjadi `max - low`. Dengan cap yang pas, append langsung realokasi dan data asli aman. Kalau niatmu memang salinan, jangan bermain batas: pakai `copy` atau `append([]int(nil), s...)`.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tangka := []int{10, 20, 30, 40, 50}\n\tb := angka[1:3] // elemen indeks 1 dan 2\n\n\tfmt.Println(b, len(b), cap(b)) // [20 30] 2 4\n\n\tb[0] = 99 // menulis lewat jendela, data asli ikut berubah\n\tfmt.Println(angka) // [10 99 30 40 50]\n}",
            caption: "cap(b) = 4: sisa backing array dari indeks 1 sampai ujung.",
          },
        },
        {
          kind: "quiz",
          question:
            "Apa keluaran program berikut?\n\n```go\na := []int{1, 2, 3, 4}\nb := a[1:3]\nb[0] = 99\nfmt.Println(a)\n```",
          options: ["[1 2 3 4]", "[1 99 3 4]", "[99 2 3 4]", "[1 2 99 4]"],
          answer: 1,
          explanation:
            "b berbagi backing array dengan a; b[0] adalah a[1], jadi elemen kedua a berubah menjadi 99.",
        },
        {
          kind: "code",
          title: "Potongan yang menimpa data asli",
          prompt:
            "Program ini seharusnya menyisipkan satu angka ke potongan awal tanpa menyentuh `data`. Sekarang elemen ketiga `data` ikut tertimpa. Temukan satu kesalahannya dan perbaiki.",
          mode: "fix",
          template:
            "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tdata := []int{1, 2, 3, 4, 5}\n\tvar tambahan int\n\tfmt.Scan(&tambahan)\n\tdua := data[0:2]\n\tdua = append(dua, tambahan)\n\tfmt.Println(data)\n\tfmt.Println(dua)\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tdata := []int{1, 2, 3, 4, 5}\n\tvar tambahan int\n\tfmt.Scan(&tambahan)\n\tdua := data[0:2:2]\n\tdua = append(dua, tambahan)\n\tfmt.Println(data)\n\tfmt.Println(dua)\n}",
          tests: [
            { stdin: "99", expectedOutput: "[1 2 3 4 5]\n[1 2 99]" },
            { stdin: "-7", expectedOutput: "[1 2 3 4 5]\n[1 2 -7]" },
            { stdin: "50", expectedOutput: "[1 2 3 4 5]\n[1 2 50]", hidden: true },
          ],
          hints: [
            "Selama cap potongan masih sisa, append menulis ke backing array yang sama dengan data.",
            "Batasi kapasitas potongan lewat bentuk tiga indeks: s[low:high:max].",
            "Jawabannya: dua := data[0:2:2].",
          ],
        },
      ],
    },
    {
      slug: "copy-slice-aman",
      title: "copy dan Duplikasi yang Aman",
      summary: "Salin isi slice ke backing array baru sebelum mengubah atau menyimpannya.",
      steps: [
        {
          kind: "theory",
          title: "Menyalin dengan sadar",
          body: "`copy(dst, src)` menyalin elemen dari src ke dst sebanyak ukuran terkecil keduanya, lalu mengembalikan jumlah elemen yang benar-benar tersalin. dst harus sudah punya panjang: `make([]int, len(s))` dulu, baru copy. Menyalin ke slice kosong tidak menyalin apa pun, jebakan yang mirip lupa make.\n\nAlternatif satu baris yang juga idiomatik: `salinan := append([]int(nil), s...)`. Sejak Go 1.21 ada `slices.Clone(s)` di package `slices` yang lebih jelas lagi. Ketiganya menghasilkan backing array baru yang tidak berhubungan dengan aslinya.\n\nWaktu menyalin itu wajib: sebelum mengurutkan atau mengubah data yang juga dipakai pihak lain, sebelum menyimpan hasil potongan jangka panjang, dan sebelum append ke slice yang berbagi backing array. Kalau kepemilikan data masih samar, menyalin lebih murah daripada bug.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tnilai := []int{5, 10, 15}\n\n\tsalinan := make([]int, len(nilai))\n\tn := copy(salinan, nilai)\n\tfmt.Println(n, salinan) // 3 [5 10 15]\n\n\tsalinan[0] = 999\n\tfmt.Println(nilai) // [5 10 15], tetap utuh\n}",
            caption: "copy mengembalikan banyak elemen yang tersalin.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang dikembalikan `copy(dst, src)`?",
          options: [
            "Slice baru hasil salinan",
            "Jumlah elemen yang tersalin",
            "Error jika ukuran dst dan src berbeda",
            "true jika salinan berhasil",
          ],
          answer: 1,
          explanation:
            "copy mengembalikan int berupa banyak elemen yang tersalin, yaitu sebanyak len terkecil dari kedua slice.",
        },
        {
          kind: "code",
          title: "Salin sebelum mengubah",
          prompt:
            "Program membaca n bilangan, menyalinnya ke `salinan`, lalu mengubah elemen pertama salinan menjadi 999. Data asli tidak boleh ikut berubah. Lengkapi dua bagian yang hilang.",
          mode: "fill",
          template:
            "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tnilai := make([]int, n)\n\tfor i := 0; i < n; i++ {\n\t\tfmt.Scan(&nilai[i])\n\t}\n\tsalinan := make([]int, ___)\n\t___(salinan, nilai)\n\tsalinan[0] = 999\n\tfmt.Println(nilai)\n\tfmt.Println(salinan)\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tnilai := make([]int, n)\n\tfor i := 0; i < n; i++ {\n\t\tfmt.Scan(&nilai[i])\n\t}\n\tsalinan := make([]int, len(nilai))\n\tcopy(salinan, nilai)\n\tsalinan[0] = 999\n\tfmt.Println(nilai)\n\tfmt.Println(salinan)\n}",
          tests: [
            { stdin: "3\n5 10 15", expectedOutput: "[5 10 15]\n[999 10 15]" },
            { stdin: "4\n1 2 3 4", expectedOutput: "[1 2 3 4]\n[999 2 3 4]" },
            { stdin: "1\n7", expectedOutput: "[7]\n[999]", hidden: true },
          ],
          hints: [
            "Salinan harus punya panjang yang sama dengan sumbernya sebelum disalin.",
            "Fungsi bawaan yang menyalin elemen antar slice, dipanggil dengan dst dulu lalu src.",
            "Jawabannya: len(nilai) dan copy.",
          ],
        },
      ],
    },
    {
      slug: "make-dengan-cap",
      title: "make dengan cap",
      summary: "Satu alokasi untuk data yang ukurannya sudah diketahui.",
      steps: [
        {
          kind: "theory",
          title: "Len dulu atau cap dulu",
          body: "`make([]T, len)` membuat slice berisi len elemen zero value, sedangkan `make([]T, len, cap)` membuat jendela yang terlihat kosong tapi backing array-nya sudah disiapkan seluas cap. Keduanya mengalokasikan sejak awal; bedanya hanya pada berapa banyak yang terlihat.\n\nKalau jumlah akhir data sudah diketahui, pola preallocation `make([]T, 0, n)` diikuti n kali append memakai satu alokasi saja: tidak ada realokasi berulang dan tidak ada penyalinan isi lama. Untuk puluhan ribu elemen perbedaannya terasa nyata.\n\nJangan tertukar argumennya: `make([]int, 3)` menghasilkan slice dengan tiga elemen nol, bukan slice kosong berkapasitas tiga. Salah baca ini menghasilkan data nol ganda di depan saat loop tetap append dari len 3.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tpenuh := make([]int, 3)   // len 3: tiga elemen nol\n\tsiap := make([]int, 0, 3) // len 0, cap 3: kosong tapi siap\n\n\tfmt.Println(penuh, len(penuh), cap(penuh))\n\tfmt.Println(siap, len(siap), cap(siap))\n}",
            caption: "make dengan satu argumen mengisi len, bukan mengatur cap saja.",
          },
        },
        {
          kind: "quiz",
          question: "Berapa `len(make([]int, 0, 3))`?",
          options: ["0", "3", "Akan panic saat dipanggil", "Tergantung isi backing array"],
          answer: 0,
          explanation:
            "make([]int, 0, 3) membuat slice kosong dengan kapasitas 3. Len 0, cap 3.",
        },
        {
          kind: "quiz",
          question: "Apa manfaat `make([]T, 0, n)` sebelum loop yang append tepat n elemen?",
          options: [
            "Elemen otomatis terisi nol sehingga tidak perlu diisi",
            "Backing array dialokasikan sekali, sehingga append tidak perlu realokasi berulang",
            "Iterasi map menjadi berurutan",
            "Slice tidak bisa diubah setelahnya",
          ],
          answer: 1,
          explanation:
            "Kapasitas yang disiapkan di awal menghindari realokasi dan penyalinan berulang saat slice tumbuh sampai n elemen.",
        },
      ],
    },
    {
      slug: "map-dasar",
      title: "Map Dasar",
      summary: "Buat, isi, baca, dan hapus; pahami apa yang dikembalikan kunci yang tidak ada.",
      steps: [
        {
          kind: "theory",
          title: "Peta dari kunci ke nilai",
          body: "`map[K]V` memetakan kunci ke nilai. Buat dengan `make(map[string]int)` atau dengan literal `map[string]int{\"buku\": 10}`. Menulis ke kunci yang sama menimpa nilainya; `delete(m, k)` menghapus entri. Kunci harus bertipe yang bisa dibandingkan: string, angka, bool, dan sejenisnya; slice tidak bisa jadi kunci.\n\nMembaca kunci yang tidak ada tidak error: hasilnya zero value tipe nilai, jadi 0 untuk int dan `\"\"` untuk string. Ini nyaman untuk akumulasi (`hitung[k]++` langsung jalan untuk kunci baru), tapi berbahaya untuk pembacaan: tidak ada dan bernilai nol terlihat sama. Lesson berikutnya menuntaskannya dengan comma-ok.\n\nZero value sebuah map adalah nil. Membaca dari nil map sah dan menghasilkan zero value, tetapi menulis ke nil map memicu panic saat runtime. Karena itu selalu buat map dengan make atau literal; `var m map[string]int` hanya berguna kalau m akan diisi map lain nanti.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tstok := map[string]int{\n\t\t\"buku\": 10,\n\t\t\"tas\":  2,\n\t}\n\tstok[\"pensil\"] = 25 // kunci baru: ditambah\n\tstok[\"tas\"] = 3     // kunci lama: ditimpa\n\tdelete(stok, \"tas\")\n\n\tfmt.Println(stok[\"buku\"])   // 10\n\tfmt.Println(stok[\"pulpen\"]) // 0: kunci tidak ada\n}",
            caption: "Kunci yang tidak ada mengembalikan zero value, bukan error.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi jika program menulis ke map yang nilainya nil?",
          options: [
            "Entri dibuat otomatis",
            "Panic saat runtime",
            "Dikembalikan false",
            "Nilai ditulis sebagai nol",
          ],
          answer: 1,
          explanation:
            "Menulis ke nil map memicu panic: assignment to entry in nil map. Membaca dari nil map sah dan menghasilkan zero value.",
        },
        {
          kind: "code",
          title: "Catat stok gudang",
          prompt:
            "Program membaca n pasang barang dan jumlah stok, lalu membaca satu nama barang untuk dicari. Lengkapi pembuatan mapnya.",
          mode: "fill",
          template:
            "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tstok := ___\n\tvar n int\n\tfmt.Scan(&n)\n\tfor i := 0; i < n; i++ {\n\t\tvar nama string\n\t\tvar jumlah int\n\t\tfmt.Scan(&nama, &jumlah)\n\t\tstok[nama] = jumlah\n\t}\n\tvar cari string\n\tfmt.Scan(&cari)\n\tfmt.Println(stok[cari])\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tstok := make(map[string]int)\n\tvar n int\n\tfmt.Scan(&n)\n\tfor i := 0; i < n; i++ {\n\t\tvar nama string\n\t\tvar jumlah int\n\t\tfmt.Scan(&nama, &jumlah)\n\t\tstok[nama] = jumlah\n\t}\n\tvar cari string\n\tfmt.Scan(&cari)\n\tfmt.Println(stok[cari])\n}",
          tests: [
            { stdin: "3\nbuku 10\npensil 25\ntas 2\npensil", expectedOutput: "25" },
            { stdin: "2\nkunci 5\ngembok 1\ngembok", expectedOutput: "1" },
            { stdin: "1\npulpen 7\npulpen", expectedOutput: "7", hidden: true },
          ],
          hints: [
            "Map perlu dibuat dengan make sebelum bisa ditulis.",
            "Tipenya: kunci string, nilai int.",
            "Jawabannya: make(map[string]int).",
          ],
        },
      ],
    },
    {
      slug: "map-comma-ok",
      title: "comma-ok: Cek Keberadaan Kunci",
      summary: "Bedakan nilai nol yang sah dan kunci yang memang tidak ada.",
      steps: [
        {
          kind: "theory",
          title: "Dua nilai dari satu akses",
          body: "`v, ok := m[k]` mengembalikan nilai beserta penanda keberadaan: `ok` bernilai true hanya jika kunci ada. Tanpa comma-ok, tidak ada dan bernilai nol tidak bisa dibedakan; dengan comma-ok, keduanya terpisah jelas.\n\nBentuk yang paling sering dipakai menggabungkan deklarasi ke dalam `if`: `if v, ok := m[k]; ok { ... } else { ... }`. v dan ok hidup hanya di blok if itu, sesuai pelajaran scope pada modul sebelumnya. Kalau nilainya tidak dibutuhkan, buang dengan `_`: `_, ok := m[k]`.\n\nPemakaian nyata: lookup cache sebelum menghitung ulang, cek sebelum delete, dedup input, dan semua kasus di mana 0 atau `\"\"` adalah nilai sah yang tidak boleh disalahartikan sebagai tanda tidak ada.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tharga := map[string]int{\"kopi\": 3000, \"teh\": 2000}\n\n\tif v, ok := harga[\"teh\"]; ok {\n\t\tfmt.Println(\"teh terdaftar:\", v)\n\t}\n\n\tif v, ok := harga[\"roti\"]; !ok {\n\t\tfmt.Println(\"roti tidak terdaftar, hasil baca:\", v) // 0\n\t}\n}",
            caption: "ok memisahkan dua kasus yang tanpa comma-ok terlihat sama.",
          },
        },
        {
          kind: "quiz",
          question:
            "Setelah `v, ok := harga[\"roti\"]` di mana `roti` tidak ada dan nilai bertipe int, berapa `v` dan `ok`?",
          options: ["v 0 dan ok false", "v 0 dan ok true", "v nil dan ok false", "Error kompilasi"],
          answer: 0,
          explanation:
            "Membaca kunci yang tidak ada menghasilkan zero value tipenya (0 untuk int), dan ok false menandakan kuncinya memang tidak ada.",
        },
        {
          kind: "code",
          title: "Cari barang dengan comma-ok",
          prompt:
            "Program membaca n pasang harga barang, lalu menjawab q pertanyaan pencarian. Untuk setiap pencarian, cetak harga jika ada atau tulis `tidak ada`. Lengkapi pola comma-ok pada kondisi if.",
          mode: "fill",
          template:
            "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tharga := make(map[string]int)\n\tvar n int\n\tfmt.Scan(&n)\n\tfor i := 0; i < n; i++ {\n\t\tvar barang string\n\t\tvar h int\n\t\tfmt.Scan(&barang, &h)\n\t\tharga[barang] = h\n\t}\n\tvar q int\n\tfmt.Scan(&q)\n\tfor i := 0; i < q; i++ {\n\t\tvar dicari string\n\t\tfmt.Scan(&dicari)\n\t\tif h, ok := ___[dicari]; ___ {\n\t\t\tfmt.Printf(\"%s: %d\\n\", dicari, h)\n\t\t} else {\n\t\t\tfmt.Printf(\"%s: tidak ada\\n\", dicari)\n\t\t}\n\t}\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tharga := make(map[string]int)\n\tvar n int\n\tfmt.Scan(&n)\n\tfor i := 0; i < n; i++ {\n\t\tvar barang string\n\t\tvar h int\n\t\tfmt.Scan(&barang, &h)\n\t\tharga[barang] = h\n\t}\n\tvar q int\n\tfmt.Scan(&q)\n\tfor i := 0; i < q; i++ {\n\t\tvar dicari string\n\t\tfmt.Scan(&dicari)\n\t\tif h, ok := harga[dicari]; ok {\n\t\t\tfmt.Printf(\"%s: %d\\n\", dicari, h)\n\t\t} else {\n\t\t\tfmt.Printf(\"%s: tidak ada\\n\", dicari)\n\t\t}\n\t}\n}",
          tests: [
            { stdin: "2\nkopi 3000\nteh 2000\n2\nteh\nroti", expectedOutput: "teh: 2000\nroti: tidak ada" },
            { stdin: "1\nsusu 5000\n1\nsusu", expectedOutput: "susu: 5000" },
            { stdin: "3\na 1\nb 2\nc 3\n2\nc\nd", expectedOutput: "c: 3\nd: tidak ada", hidden: true },
          ],
          hints: [
            "Nama map yang menyimpan harganya adalah harga.",
            "Kondisi if harus menilai penanda keberadaan dari comma-ok, bukan nilainya.",
            "Jawabannya: harga dan ok.",
          ],
        },
      ],
    },
    {
      slug: "iterasi-map-sort-key",
      title: "Iterasi Map dan Urutan",
      summary: "Urutan range map tidak bisa diandalkan; urutkan kunci untuk keluaran yang pasti.",
      steps: [
        {
          kind: "theory",
          title: "Urutan yang disengaja acak",
          body: "`for k, v := range m` mengiterasi seluruh pasangan map, tetapi urutannya tidak ditentukan dan sengaja dirandom oleh runtime Go. Program yang sama bisa mencetak urutan berbeda setiap kali dijalankan, dan itu bukan bug: randomisasi ini disengaja supaya programmer tidak pernah bergantung pada urutan map.\n\nAturannya tegas: output yang butuh urutan pasti (laporan, hasil tes, data yang dikirim ke file) tidak boleh langsung dari iterasi map. Kumpulkan kuncinya ke slice, urutkan dengan `sort.Strings` (atau `slices.Sort` sejak Go 1.21), lalu iterasi slice kuncinya dan akses nilai lewat `m[k]`. Kunci yang berasal dari map itu pasti ada, jadi aksesnya aman.\n\nVarian range: `for k := range m` kalau hanya kunci yang dibutuhkan, dan `for _, v := range m` kalau hanya nilai. Mengurutkan berdasarkan nilai (bukan kunci) memakai pola yang sama; yang berubah hanya pembandingnya.",
          code: {
            language: "go",
            content: "package main\n\nimport (\n\t\"fmt\"\n\t\"sort\"\n)\n\nfunc main() {\n\tskor := map[string]int{\"ceri\": 90, \"andi\": 80}\n\n\tfor nama, nilai := range skor {\n\t\tfmt.Println(\"acak:\", nama, nilai) // urutan bisa berubah tiap run\n\t}\n\n\tkeys := make([]string, 0, len(skor))\n\tfor k := range skor {\n\t\tkeys = append(keys, k)\n\t}\n\tsort.Strings(keys)\n\n\tfor _, k := range keys {\n\t\tfmt.Println(k, skor[k]) // andi dulu, ceri kemudian: pasti\n\t}\n}",
            caption: "Kunci dipindah ke slice, diurutkan, baru dicetak.",
          },
        },
        {
          kind: "quiz",
          question: "Kenapa urutan iterasi `for k, v := range m` bisa berbeda antar eksekusi program?",
          options: [
            "Itu bug pada runtime Go",
            "Runtime sengaja merandomnya agar kode tidak bergantung pada urutan map",
            "Urutannya selalu mengikuti urutan input",
            "Map otomatis terurut abjad",
          ],
          answer: 1,
          explanation:
            "Runtime Go merandom titik mulai iterasi map. Kalau urutan penting, kumpulkan kunci ke slice dan urutkan sendiri.",
        },
        {
          kind: "code",
          title: "Daftar skor terurut",
          prompt:
            "Program membaca n pasang nama dan skor, lalu mencetak semuanya terurut abjad berdasarkan nama. Lengkapi penulisan ke map dan pemanggilan sorting kunci.",
          mode: "fill",
          template:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"sort\"\n)\n\nfunc main() {\n\tskor := make(map[string]int)\n\tvar n int\n\tfmt.Scan(&n)\n\tfor i := 0; i < n; i++ {\n\t\tvar nama string\n\t\tvar s int\n\t\tfmt.Scan(&nama, &s)\n\t\tskor[___] = s\n\t}\n\tkeys := make([]string, 0, len(skor))\n\tfor k := range skor {\n\t\tkeys = append(keys, k)\n\t}\n\t___(keys)\n\tfor _, k := range keys {\n\t\tfmt.Printf(\"%s: %d\\n\", k, skor[k])\n\t}\n}",
          solution:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"sort\"\n)\n\nfunc main() {\n\tskor := make(map[string]int)\n\tvar n int\n\tfmt.Scan(&n)\n\tfor i := 0; i < n; i++ {\n\t\tvar nama string\n\t\tvar s int\n\t\tfmt.Scan(&nama, &s)\n\t\tskor[nama] = s\n\t}\n\tkeys := make([]string, 0, len(skor))\n\tfor k := range skor {\n\t\tkeys = append(keys, k)\n\t}\n\tsort.Strings(keys)\n\tfor _, k := range keys {\n\t\tfmt.Printf(\"%s: %d\\n\", k, skor[k])\n\t}\n}",
          tests: [
            { stdin: "3\nceri 90\nandi 80\nbudi 85", expectedOutput: "andi: 80\nbudi: 85\nceri: 90" },
            { stdin: "2\nzaki 10\namin 20", expectedOutput: "amin: 20\nzaki: 10" },
            { stdin: "4\nb 1\na 2\nd 3\nc 4", expectedOutput: "a: 2\nb: 1\nc: 4\nd: 3", hidden: true },
          ],
          hints: [
            "Kunci mapnya adalah nama yang dibaca dari input.",
            "Fungsi pengurut slice string ada di package sort; parameternya keys.",
            "Jawabannya: nama dan sort.Strings.",
          ],
        },
      ],
    },
    {
      slug: "slice-of-struct",
      title: "Slice of Struct",
      summary: "Susun data bertabel: banyak record dalam satu slice, proses satu per satu.",
      steps: [
        {
          kind: "theory",
          title: "Record dalam satu baris data",
          body: "Kombinasi paling umum untuk data kehidupan nyata adalah `[]struct`: satu slice menampung banyak record, dan `for range` mengeluarkan satu record per putaran. Pola ini menggantikan paralel array (slice nama terpisah dari slice harga) yang mudah dibuat selaras tapi mudah juga rusak.\n\nMenurunkan data sering berupa slice of struct juga: filter dengan append ke slice baru, atau agregasi (hitung, total, rata-rata) dengan loop biasa dan akumulator. Tidak butuh library; `for`, `append`, dan zero value menyelesaikan semuanya.\n\nAturan sharing dari lesson sebelumnya tetap berlaku: menyalin satu struct ke variabel lain menyalin seluruh isinya, tetapi memotong slice struct tetap berbagi backing array. Mutasi lewat jendela tetap menyentuh data asli.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\ntype Produk struct {\n\tNama  string\n\tHarga int\n}\n\nfunc main() {\n\tkeranjang := []Produk{\n\t\t{\"Buku\", 35000},\n\t\t{\"Tas\", 120000},\n\t}\n\tkeranjang = append(keranjang, Produk{\"Pensil\", 4000})\n\n\ttotal := 0\n\tfor _, p := range keranjang {\n\t\ttotal += p.Harga\n\t}\n\tfmt.Println(len(keranjang), total) // 3 159000\n}",
            caption: "Satu record per putaran; akumulator total memakai zero value.",
          },
        },
        {
          kind: "quiz",
          question:
            "Pada `for i, p := range keranjang` dengan `keranjang []Produk`, apa tipe `i` dan `p`?",
          options: ["i int, p Produk", "i int, p *Produk", "i Produk, p int", "i int, p string"],
          answer: 0,
          explanation:
            "Indeks range di slice bertipe int, dan elemennya bertipe Produk biasa (bukan pointer) kecuali slice yang di-range adalah slice pointer.",
        },
        {
          kind: "quiz",
          question:
            "Apa keluaran program berikut?\n\n```go\ntype Barang struct {\n  Nama string\n  Stok int\n}\n\nfunc main() {\n  bs := []Barang{{\"Buku\", 3}, {\"Tas\", 1}}\n  bs[1].Stok = 9\n  fmt.Println(bs[1].Nama, bs[1].Stok)\n}\n```",
          options: ["Tas 1", "Tas 9", "Buku 9", "Error karena Stok belum dideklarasikan"],
          answer: 1,
          explanation:
            "bs[1] adalah record Tas. Mengubah field Stok lewat indeks memutasi record di backing array, hasilnya Tas 9.",
        },
      ],
    },
    {
      slug: "latihan-slice-map",
      title: "Latihan Gabungan: Nilai Unik",
      summary: "Map sebagai set, slice untuk hasil terurut, dan sorting dalam satu program.",
      steps: [
        {
          kind: "theory",
          title: "Map sebagai set",
          body: "Modul ini menutup dengan pola yang paling sering dipakai di kerja nyata: map sebagai set. Nilai yang pernah muncul ditandai `true`; pengecekan duplikat menjadi cepat tanpa mencari ulang di slice.\n\nUntuk keluaran yang urut, kumpulkan kunci set ke slice, urutkan, dan cetak. Program berikut membaca n bilangan, mencetak berapa nilai uniknya, lalu mencetak daftar nilai uniknya dalam urutan naik. Perhatikan bahwa `seen[x] = true` cukup untuk menambah kunci baru sekaligus menandainya, dan nilai boolnya tidak pernah dibaca.",
          code: {
            language: "go",
            content: "seen := make(map[int]bool)\n// seen[x] = true untuk setiap bilangan yang dibaca\n// kunci seen = kumpulan nilai unik",
            caption: "Gambaran pola set yang akan kamu lengkapi di langkah berikutnya.",
          },
        },
        {
          kind: "code",
          title: "Saring nilai unik",
          prompt:
            "Lengkapi program: tandai setiap bilangan yang dibaca ke map `seen`, lalu urutkan slice `unik` sebelum dicetak. Format cetak sudah ditangani program.",
          mode: "fill",
          template:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"sort\"\n)\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tseen := make(map[int]bool)\n\tfor i := 0; i < n; i++ {\n\t\tvar x int\n\t\tfmt.Scan(&x)\n\t\tseen[___] = true\n\t}\n\tunik := make([]int, 0, len(seen))\n\tfor v := range seen {\n\t\tunik = append(unik, v)\n\t}\n\tsort.___(unik)\n\tfmt.Println(len(unik))\n\tfmt.Println(unik)\n}",
          solution:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"sort\"\n)\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tseen := make(map[int]bool)\n\tfor i := 0; i < n; i++ {\n\t\tvar x int\n\t\tfmt.Scan(&x)\n\t\tseen[x] = true\n\t}\n\tunik := make([]int, 0, len(seen))\n\tfor v := range seen {\n\t\tunik = append(unik, v)\n\t}\n\tsort.Ints(unik)\n\tfmt.Println(len(unik))\n\tfmt.Println(unik)\n}",
          tests: [
            { stdin: "5\n4 2 4 1 2", expectedOutput: "3\n[1 2 4]" },
            { stdin: "6\n5 5 5 5 5 5", expectedOutput: "1\n[5]" },
            { stdin: "7\n10 -1 10 3 -1 3 3", expectedOutput: "3\n[-1 3 10]", hidden: true },
          ],
          hints: [
            "Kunci mapnya adalah bilangan yang baru dibaca.",
            "Pengurut bilangan bulat di package sort namanya diakhiri Ints.",
            "Jawabannya: x dan sort.Ints.",
          ],
        },
      ],
    },
  ],
};
