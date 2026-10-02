import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "csharp",
  moduleRange: [0, 1],
  modules: [
    {
      title: "C# yang Idiomatik",
      description: "Tipe dan var, string interpolation, nullable reference, pattern matching dasar.",
    },
    {
      title: "Collections dan Generics",
      description: "List/Dictionary/HashSet, generics, IEnumerable, dan comparator.",
    },
  ],
  lessons: [
    // ==================== MODUL 0: C# yang Idiomatik ====================
    {
      slug: "tipe-dasar-dan-var",
      title: "Tipe Dasar dan var",
      summary: "Tipe bawaan C#, alias di balik namanya, dan kapan var membuat kode lebih terbaca.",
      steps: [
        {
          kind: "theory",
          title: "Tipe yang ditulis, tipe yang disimpulkan",
          body: "C# adalah bahasa bertipe statis: setiap variabel punya tipe yang dinyatakan sejak deklarasi dan tidak pernah berganti. Tipe bawaan yang paling sering dipakai: `int` untuk bilangan bulat 32 bit, `long` untuk bulat 64 bit, `double` untuk desimal berbasis biner, `decimal` untuk desimal berbasis sepuluh yang cocok untuk uang, `bool` untuk benar atau salah, `char` untuk satu karakter dengan kutip tunggal, dan `string` untuk teks dengan kutip ganda.\n\nNama-nama itu sebenarnya alias. `int` adalah singkatan `System.Int32` dan `string` adalah alias `System.String`; keduanya sah, tetapi konvensi .NET memilih kata kunci kecil. Dua catatan literal yang sering keliru: `decimal` butuh akhiran m, misalnya `decimal harga = 15000.5m;`, dan pembagian dua `int` menghasilkan `int` sehingga `7 / 2` bernilai 3, sedangkan `7 / 2.0` bernilai 3.5 karena satu sisi sudah desimal.\n\nSejak C# 3 ada `var`: compiler menyimpulkan tipe dari sisi kanan. `var jumlah = stok * 2;` membuat `jumlah` bertipe `int`, bukan tipe ajaib yang bisa berubah-ubah. Aturannya tegas: wajib diinisialisasi, hanya untuk variabel lokal, dan tidak boleh untuk field, parameter, atau tipe kembalian. Gunakan `var` saat tipe sudah terlihat dari sisi kanan, dan kembali ke tipe eksplisit bila penulisannya justru lebih menjelaskan maksud.",
          code: {
            language: "csharp",
            content: "using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int stok = 12;\n        bool aktif = true;\n        char kelas = 'A';\n        string nama = \"KodeKita\";\n\n        var jumlah = stok * 2;   // disimpulkan: int\n        var sapaan = \"Halo\";     // disimpulkan: string\n\n        Console.WriteLine(jumlah); // 24\n        Console.WriteLine(aktif);  // True\n        Console.WriteLine(kelas);  // A\n        Console.WriteLine(sapaan); // Halo\n        Console.WriteLine(nama);   // KodeKita\n    }\n}",
            caption: "var menyimpulkan tipe dari sisi kanan; tipenya tetap statis.",
          },
        },
        {
          kind: "quiz",
          question: "Untuk menyimpan saldo uang pada aplikasi keuangan, tipe C# mana yang paling tepat?",
          options: ["float", "double", "decimal", "long"],
          answer: 2,
          explanation:
            "decimal bekerja berbasis sepuluh sehingga nilai uang tidak kehilangan presisi. float dan double berbasis biner dan bisa menyimpan 0.1 sebagai nilai hampir-hampir benar, yang berbahaya untuk uang.",
        },
        {
          kind: "code",
          title: "Deklarasi dengan var",
          prompt:
            "Program membaca dua bilangan dan mencetak hasil kalinya. Ganti `___` dengan satu kata kunci yang membuat compiler menyimpulkan tipe variabel dari sisi kanannya.",
          mode: "fill",
          template:
            'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int a = Convert.ToInt32(Console.ReadLine());\n        int b = Convert.ToInt32(Console.ReadLine());\n        ___ jumlah = a * b;\n        Console.WriteLine(jumlah);\n    }\n}',
          solution:
            'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int a = Convert.ToInt32(Console.ReadLine());\n        int b = Convert.ToInt32(Console.ReadLine());\n        var jumlah = a * b;\n        Console.WriteLine(jumlah);\n    }\n}',
          tests: [
            { stdin: "3\n4", expectedOutput: "12" },
            { stdin: "-7\n7", expectedOutput: "-49" },
            { stdin: "25\n40", expectedOutput: "1000", hidden: true },
          ],
          hints: [
            "Yang dicari kata kunci sejak C# 3 yang menyuruh compiler menyimpulkan tipe dari sisi kanan.",
            "Variabelnya tetap bertipe int; hanya penulisannya yang disingkat.",
            "Jawabannya: var.",
          ],
        },
      ],
    },
    {
      slug: "console-in-out-idiomatik",
      title: "Console In dan Out yang Idiomatik",
      summary: "Membaca baris, mengonversi angka, dan mencetak dengan format {0} seperti kode C# sehari-hari.",
      steps: [
        {
          kind: "theory",
          title: "Satu baris, satu ReadLine",
          body: "`Console.ReadLine()` membaca satu baris dari stdin sebagai `string`, tanpa karakter pindah baris di ujungnya. Bila input sudah habis, ia mengembalikan `null`, jadi program yang membaca lebih banyak baris dari yang tersedia harus siap menghadapi kondisi itu. Pasangannya `Console.WriteLine` mencetak lalu pindah baris, sedangkan `Console.Write` mencetak tanpa pindah baris.\n\nKarena `ReadLine` selalu mengembalikan teks, angka dikonversi lewat `Convert.ToInt32` atau `int.Parse`. Untuk menyisipkan variabel saat mencetak, pakai bentuk berformat: `Console.WriteLine(\"Nama: {0}\", nama)` menyusun teksnya seperti `string.Format` lalu mencetak hasilnya. Pola satu baris satu `ReadLine` inilah yang dipakai semua latihan di platform ini.\n\nDi balik layar, `Console.Out` adalah `TextWriter` untuk keluaran standar dan `Console.In` adalah `TextReader` untuk masukan; `WriteLine` hanyalah pintasan `Console.Out.WriteLine`. Ada juga `Console.Error` untuk pesan galat yang tidak bercampur dengan keluaran biasa, kebiasaan yang penting saat program dipakai di dalam pipeline.",
          code: {
            language: "csharp",
            content: 'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        string nama = Console.ReadLine();\n        int umur = Convert.ToInt32(Console.ReadLine());\n\n        Console.WriteLine("Nama: {0}", nama);\n        Console.WriteLine("Umur tahun depan: {0}", umur + 1);\n        Console.Write("selesai");\n        Console.WriteLine(); // hanya pindah baris\n    }\n}',
            caption: "Satu ReadLine membaca satu baris; angka dikonversi lewat Convert.",
          },
        },
        {
          kind: "quiz",
          question: "Console.ReadLine() mengembalikan tipe apa?",
          options: ["string", "int", "char", "tergantung isi yang diketik"],
          answer: 0,
          explanation:
            "ReadLine selalu mengembalikan string, meski isinya terlihat seperti angka. Ubah dengan Convert.ToInt32 atau int.TryParse bila butuh angka.",
        },
        {
          kind: "quiz",
          question: "Apa beda Console.Write dan Console.WriteLine?",
          options: [
            "Write untuk angka, WriteLine untuk teks",
            "WriteLine menambah baris baru setelah teks, Write tidak",
            "Tidak ada beda, hanya nama berbeda",
            "Write menulis ke file, WriteLine ke layar",
          ],
          answer: 1,
          explanation:
            "WriteLine mencetak lalu menambah karakter pindah baris; Write tidak. Write diikuti WriteLine() kosong setara satu WriteLine penuh.",
        },
        {
          kind: "code",
          title: "Baca dua angka, cetak jumlahnya",
          prompt:
            "Lengkapi program ini supaya membaca dua bilangan bulat dari input lalu mencetak `Jumlah: <hasil>`. Ganti `___` dengan class yang menyediakan method konversinya.",
          mode: "fill",
          template:
            'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int a = ___.ToInt32(Console.ReadLine());\n        int b = Convert.ToInt32(Console.ReadLine());\n        Console.WriteLine("Jumlah: {0}", a + b);\n    }\n}',
          solution:
            'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int a = Convert.ToInt32(Console.ReadLine());\n        int b = Convert.ToInt32(Console.ReadLine());\n        Console.WriteLine("Jumlah: {0}", a + b);\n    }\n}',
          tests: [
            { stdin: "3\n4", expectedOutput: "Jumlah: 7" },
            { stdin: "10\n-5", expectedOutput: "Jumlah: 5" },
            { stdin: "0\n0", expectedOutput: "Jumlah: 0", hidden: true },
          ],
          hints: [
            "Class yang sama dipakai pada baris kedua; kedua baris memang seharusnya simetris.",
            "Method ToInt32 hidup di class Convert, bukan di Console.",
            "Jawabannya: Convert.",
          ],
        },
      ],
    },
    {
      slug: "string-format-dan-interpolasi",
      title: "string.Format dan Interpolasi",
      summary: "Tempat sisip {0}, specifier N dan C, culture yang menentukan bentuk angka, dan posisi $\"\" di C# modern.",
      steps: [
        {
          kind: "theory",
          title: "Format berindeks dengan specifier opsional",
          body: "`string.Format` menyusun teks dari potongan dan nilai. Tempat sisip ditulis dengan indeks di dalam kurung kurawal: `{0}` untuk argumen pertama, `{1}` untuk kedua, dan satu argumen boleh dipakai berkali-kali. Setelah titik dua bisa ditambah specifier format: `{0:N2}` angka bergrup dengan dua desimal, `{0:F2}` desimal tetap, `{0:D5}` bilangan bulat dengan pengisi nol, `{0:C}` mata uang, dan `{0,12:N2}` memakai lebar kolom dua belas rata kanan.\n\nSpecifier N dan C mengikuti culture. Dengan culture `id-ID`, `string.Format(\"{0:C}\", 1500000)` menghasilkan `Rp1.500.000,00`, sedangkan `CultureInfo.InvariantCulture` menghasilkan `1,234,567.89` untuk `{0:N2}`. Ketika keluaran program dibandingkan atau disimpan untuk dibaca mesin, kirim culture secara eksplisit sebagai argumen pertama agar hasilnya sama di komputer mana pun.\n\nMulai C# 6 ada interpolasi string: `$\"Halo {nama}\"`, lebih pendek dan dikompilasi menjadi pemanggilan `string.Format` di belakang layar. Compiler C# 5 yang dipakai judge platform ini belum mendukungnya, jadi di latihan gunakan `string.Format` atau penyambungan `+`. Saat bekerja di proyek .NET modern nanti, `$\"\"` adalah bentuk yang lazim.",
          code: {
            language: "csharp",
            content: 'using System;\nusing System.Globalization;\n\npublic class Program\n{\n    public static void Main()\n    {\n        string nama = "Dina";\n        double nilai = 1234567.891;\n\n        Console.WriteLine(string.Format("Halo {0}, poinmu {1}", nama, 320));\n        Console.WriteLine(string.Format(CultureInfo.InvariantCulture, "{0:N2}", nilai));\n        Console.WriteLine(string.Format(CultureInfo.InvariantCulture, "[{0,12:N2}]", nilai));\n        // di C# 6 ke atas: $"Halo {nama}, poinmu {320}"\n    }\n}',
            caption: "Indeks menentukan argumen mana yang masuk ke tiap tempat sisip.",
          },
        },
        {
          kind: "quiz",
          question:
            'Apa keluaran `string.Format(CultureInfo.InvariantCulture, "{0:N2}", 1234567.891)`?',
          options: ["1234567.891", "1,234,567.89", "1.234.567,89", "1,234,567.891"],
          answer: 1,
          explanation:
            "N2 membulatkan ke dua desimal dan menambah pemisah ribuan versi invariant: koma untuk grup, titik untuk desimal. Dengan culture id-ID, bentuknya menjadi 1.234.567,89.",
        },
        {
          kind: "quiz",
          question: "Baris mana yang TIDAK bisa dikompilasi oleh compiler C# 5?",
          options: [
            'string s = string.Format("{0}", 12);',
            "var x = 12;",
            'Console.WriteLine($"umur {12}");',
            "int? n = null;",
          ],
          answer: 2,
          explanation:
            "Interpolasi $\"\" baru ada sejak C# 6. var sudah ada sejak C# 3, int? sejak C# 2, dan string.Format sejak C# 1.",
        },
        {
          kind: "code",
          title: "Total dengan pemisah ribuan",
          prompt:
            "Program menghitung total belanja dan mencetaknya dengan pemisah ribuan gaya invariant, misalnya input `Buku`, `15000`, `3` menghasilkan `Buku: 45,000`. Ganti `___` dengan specifier format yang tepat.",
          mode: "fill",
          template:
            'using System;\nusing System.Globalization;\n\npublic class Program\n{\n    public static void Main()\n    {\n        string barang = Console.ReadLine();\n        int harga = Convert.ToInt32(Console.ReadLine());\n        int jumlah = Convert.ToInt32(Console.ReadLine());\n        int total = harga * jumlah;\n        string baris = string.Format(CultureInfo.InvariantCulture, "{0}: {1:___}", barang, total);\n        Console.WriteLine(baris);\n    }\n}',
          solution:
            'using System;\nusing System.Globalization;\n\npublic class Program\n{\n    public static void Main()\n    {\n        string barang = Console.ReadLine();\n        int harga = Convert.ToInt32(Console.ReadLine());\n        int jumlah = Convert.ToInt32(Console.ReadLine());\n        int total = harga * jumlah;\n        string baris = string.Format(CultureInfo.InvariantCulture, "{0}: {1:N0}", barang, total);\n        Console.WriteLine(baris);\n    }\n}',
          tests: [
            { stdin: "Buku\n15000\n3", expectedOutput: "Buku: 45,000" },
            { stdin: "Pensil\n2500\n4", expectedOutput: "Pensil: 10,000" },
            { stdin: "Tas\n275000\n2", expectedOutput: "Tas: 550,000", hidden: true },
          ],
          hints: [
            "Specifier ditulis setelah titik dua pada tempat sisip kedua.",
            "Huruf N memformat angka dengan pemisah grup; angka di belakangnya menyatakan jumlah desimal.",
            "Jawabannya: N0, artinya N tanpa angka desimal.",
          ],
        },
      ],
    },
    {
      slug: "nullable-tipe-nilai",
      title: "Nullable: int? dan HasValue",
      summary: "Memberi tipe nilai kemampuan kosong: int?, HasValue, GetValueOrDefault, dan operator ??.",
      steps: [
        {
          kind: "theory",
          title: "Makna kosong untuk tipe nilai",
          body: "Tipe nilai seperti `int`, `double`, `bool`, dan `char` selalu membawa nilai dan tidak bisa diisi `null`. Padahal ada keadaan yang justru butuh makna kosong: kolom formulir belum diisi, kolom database bernilai NULL, atau hasil pencarian yang tidak ketemu. Untuk itu C# menyediakan `Nullable<T>` yang ditulis pendek sebagai `T?`: `int? stok = null;` sah, dan `stok` sama-sama bisa diisi angka biasa.\n\nAda tiga cara membacanya. `stok.HasValue` berupa bool yang menjawab ada atau tidaknya nilai. `stok.Value` mengembalikan nilainya, tetapi melempar `InvalidOperationException` bila kosong. `stok.GetValueOrDefault()` memberi nilai bawaan tipe (0 untuk int) saat kosong, atau nilai cadangan lewat `GetValueOrDefault(10)`. Operator `??` juga klasik di sini: `int dipakai = stok ?? 0;` membaca nilai bila ada dan 0 bila kosong.\n\nC# yang lebih baru menambahkan operator null-conditional `?.` pada C# 6 dan nullable reference type untuk `string` pada C# 8. Keduanya bermanfaat di proyek modern, tetapi compiler C# 5 yang dipakai judge ini belum mendukungnya. Dalam latihan, periksa kehadiran nilai dengan `HasValue`, `??`, atau `GetValueOrDefault`.",
          code: {
            language: "csharp",
            content: "using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int? stok = null;\n        int? cadangan = 5;\n\n        Console.WriteLine(stok.HasValue);            // False\n        Console.WriteLine(cadangan.HasValue);        // True\n        Console.WriteLine(stok.GetValueOrDefault()); // 0\n        Console.WriteLine(cadangan ?? 0);            // 5\n\n        int dipakai = cadangan.GetValueOrDefault();\n        Console.WriteLine(dipakai + 10);             // 15\n    }\n}",
            caption: "Nullable memisahkan makna kosong dari nilai nol.",
          },
        },
        {
          kind: "quiz",
          question: "Apa keluaran `Console.WriteLine(n.HasValue);` bila sebelumnya `int? n = null;`?",
          options: ["True", "False", "0", "Melempar InvalidOperationException"],
          answer: 1,
          explanation:
            "HasValue menjawab keberadaan nilai, dan n memang kosong, jadi hasilnya False. Tidak ada exception karena hanya memeriksa, bukan membaca isi.",
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi saat memanggil `n.Value` ketika `n` bertipe `int?` sedang kosong?",
          options: [
            "Mengembalikan 0",
            "Mengembalikan null",
            "Melempar InvalidOperationException saat runtime",
            "Tidak lolos kompilasi",
          ],
          answer: 2,
          explanation:
            "Value hanya sah bila ada isinya; pada keadaan kosong ia melempar InvalidOperationException. Pakai GetValueOrDefault atau ?? bila ingin nilai cadangan.",
        },
      ],
    },
    {
      slug: "if-dan-switch-klasik",
      title: "if dan switch Klasik",
      summary: "Kondisi wajib bool, aturan break pada switch, dan kenapa C# melarang jatuh antar case.",
      steps: [
        {
          kind: "theory",
          title: "Cabang dengan aturan yang tegas",
          body: "Percabangan C# memakai `if`, `else if`, dan `else` dengan kondisi yang wajib bertipe `bool`. Tidak ada kebenaran angka nol atau teks kosong seperti di C atau JavaScript: `if (n)` dengan `n` bertipe `int` langsung ditolak compiler. Biasakan menulis kurung kurawal untuk setiap cabang meski isinya satu baris; kebiasaan ini mencegah bug klasik saat cabang ditambah belakangan.\n\n`switch` klasik memilih berdasarkan satu nilai: tipe bulat, `char`, `enum`, atau `string`. Setiap case yang tidak kosong wajib diakhiri `break`, `return`, atau `throw`; C# melarang eksekusi jatuh ke case berikutnya sehingga kekeliruan salin dari bahasa lain tertangkap saat kompilasi. Ingin dua label berbagi isi? Tumpuk label kosong: `case \"a\": case \"b\": break;`. Bagian `default` opsional seperti `else`.\n\nC# 7 memperluas `switch` dengan pattern matching: `case int n when n > 0;` menyeleksi tipe dan nilai sekaligus. Fitur itu belum ada di compiler C# 5 yang dipakai di sini, jadi pada modul ini gunakan switch klasik. Ada juga `goto case` untuk melompat antar case, tetapi hampir selalu lebih jelas menata ulang logikanya daripada memakainya.",
          code: {
            language: "csharp",
            content: 'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int nilai = Convert.ToInt32(Console.ReadLine());\n        string predikat;\n\n        if (nilai >= 85)\n        {\n            predikat = "A";\n        }\n        else if (nilai >= 70)\n        {\n            predikat = "B";\n        }\n        else\n        {\n            predikat = "C";\n        }\n\n        switch (predikat)\n        {\n            case "A":\n                Console.WriteLine("Sangat baik");\n                break;\n            case "B":\n                Console.WriteLine("Baik");\n                break;\n            default:\n                Console.WriteLine("Perlu latihan");\n                break;\n        }\n    }\n}',
            caption: "if menentukan predikat, switch menerjemahkannya menjadi pesan.",
          },
        },
        {
          kind: "quiz",
          question: "Di C#, apa yang terjadi bila isi sebuah case yang tidak kosong tidak diakhiri break?",
          options: [
            "Eksekusi lanjut ke case berikutnya seperti di C++",
            "Program berhenti saat runtime",
            "Tidak lolos kompilasi: kontrol tidak boleh jatuh ke case lain",
            "Case itu diabaikan sepenuhnya",
          ],
          answer: 2,
          explanation:
            "C# memeriksa aturan jatuh antar case saat kompilasi. Isi case yang tidak kosong harus ditutup break, return, atau throw.",
        },
        {
          kind: "quiz",
          question: "Percabangan mana yang SAH pada compiler C# 5?",
          options: [
            "switch (2.5) dengan case 1.5:",
            'switch (teks) dengan case "A": break;',
            "case int n when n > 0:",
            "case tanpa break untuk isi yang tidak kosong",
          ],
          answer: 1,
          explanation:
            "switch pada string sah sejak lama di C#. double tidak boleh jadi selektor switch klasik, dan pattern matching case int n baru ada sejak C# 7.",
        },
        {
          kind: "code",
          title: "Perbaiki switch yang melompat",
          prompt:
            "Program ini menerjemahkan predikat menjadi pesan, tetapi ada satu kesalahan yang membuatnya bahkan tidak lolos kompilasi. Temukan dan perbaiki, lalu jalankan sampai semua tes lulus.",
          mode: "fix",
          template:
            'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        string predikat = Console.ReadLine();\n\n        switch (predikat)\n        {\n            case "A":\n                Console.WriteLine("Sangat baik");\n                break;\n            case "B":\n                Console.WriteLine("Baik");\n            case "C":\n                Console.WriteLine("Cukup");\n                break;\n            default:\n                Console.WriteLine("Perlu latihan");\n                break;\n        }\n    }\n}',
          solution:
            'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        string predikat = Console.ReadLine();\n\n        switch (predikat)\n        {\n            case "A":\n                Console.WriteLine("Sangat baik");\n                break;\n            case "B":\n                Console.WriteLine("Baik");\n                break;\n            case "C":\n                Console.WriteLine("Cukup");\n                break;\n            default:\n                Console.WriteLine("Perlu latihan");\n                break;\n        }\n    }\n}',
          tests: [
            { stdin: "A", expectedOutput: "Sangat baik" },
            { stdin: "B", expectedOutput: "Baik" },
            { stdin: "C", expectedOutput: "Cukup", hidden: true },
          ],
          hints: [
            "Pesan error kompilasi menyebut control cannot fall through dari satu case ke case berikutnya.",
            "Setiap case yang tidak kosong harus ditutup dengan pernyataan keluar, dan satu case kehilangan itu.",
            "Jawabannya: tambah break setelah pencetakan pada case \"B\".",
          ],
        },
      ],
    },
    {
      slug: "parse-dan-tryparse",
      title: "Parse dan TryParse",
      summary: "Dua cara menguraikan teks menjadi angka, dan kenapa TryParse lebih aman untuk input.",
      steps: [
        {
          kind: "theory",
          title: "Melempar atau bertanya dulu",
          body: "`int.Parse(teks)` menguraikan teks menjadi angka dan menganggap inputnya bisa dipercaya: teks yang tidak sah melempar `FormatException`, teks null melempar `ArgumentNullException`. `Convert.ToInt32(teks)` mirip, bedanya null dikembalikan sebagai 0. Keduanya tepat saat data berasal dari sumber internal yang sudah tervalidasi.\n\nInput pengguna tidak bisa dipercaya. `int.TryParse(teks, out hasil)` tidak melempar apa pun: ia mengembalikan `bool`, dan bila gagal, `hasil` diisi 0. Pola idiomatiknya: deklarasikan variabel, panggil di dalam `if`, tangani dua cabangnya. Parameter `out` wajib diawali kata `out` pada pemanggilan, dan pada C# 5 variabelnya harus dideklarasikan lebih dulu; bentuk ringkas `out int hasil` baru ada sejak C# 7.\n\nPasangan `double.TryParse` dan `decimal.TryParse` bekerja sama, dengan catatan culture: teks `1,5` sah di culture berdesimal koma dan ditolak di invariant. Untuk angka berformat mesin, kirim `CultureInfo.InvariantCulture` sebagai argumen tambahan TryParse. Untuk latihan di platform ini input sudah bersih, tetapi kebiasaan TryParse sejak sekarang akan menyelamatkanmu di kode nyata.",
          code: {
            language: "csharp",
            content: 'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        string teks = "123abc";\n\n        int hasil;\n        bool ok = int.TryParse(teks, out hasil);\n\n        Console.WriteLine(ok); // False\n        if (ok)\n        {\n            Console.WriteLine(hasil * 2);\n        }\n        else\n        {\n            Console.WriteLine("Input tidak sah");\n        }\n    }\n}',
            caption: "TryParse memisahkan pertanyaan sah atau tidak dari nilai hasilnya.",
          },
        },
        {
          kind: "quiz",
          question: 'Apa hasil `int.TryParse("abc", out hasil)`?',
          options: [
            "true dan hasil berisi 0",
            "false dan hasil berisi 0",
            "Melempar FormatException",
            "false dan hasil tidak disentuh",
          ],
          answer: 1,
          explanation:
            "Saat gagal, TryParse mengembalikan false dan tetap mengisi variabel out dengan 0. Ia tidak pernah melempar exception untuk teks yang tidak sah.",
        },
        {
          kind: "quiz",
          question: 'Apa yang terjadi pada `int.Parse("abc")`?',
          options: [
            "Mengembalikan 0",
            "Mengembalikan null",
            "Melempar FormatException saat runtime",
            "Mengembalikan -1",
          ],
          answer: 2,
          explanation:
            "Parse menganggap inputnya pasti sah; teks yang tidak dapat diuraikan melempar FormatException. Untuk input dari luar, TryParse lebih aman.",
        },
        {
          kind: "code",
          title: "Uraikan dengan aman lalu proses",
          prompt:
            "Program membaca satu baris, menguraikannya sebagai bilangan, lalu mencetak nilainya ditambah 10, atau `tidak sah` bila isinya bukan angka. Lengkapi dua bagian yang hilang.",
          mode: "fill",
          template:
            'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        string teks = Console.ReadLine();\n        int hasil;\n        bool ok = int.___(teks, ___ hasil);\n\n        if (ok)\n        {\n            Console.WriteLine(hasil + 10);\n        }\n        else\n        {\n            Console.WriteLine("tidak sah");\n        }\n    }\n}',
          solution:
            'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        string teks = Console.ReadLine();\n        int hasil;\n        bool ok = int.TryParse(teks, out hasil);\n\n        if (ok)\n        {\n            Console.WriteLine(hasil + 10);\n        }\n        else\n        {\n            Console.WriteLine("tidak sah");\n        }\n    }\n}',
          tests: [
            { stdin: "35", expectedOutput: "45" },
            { stdin: "-5", expectedOutput: "5" },
            { stdin: "abc", expectedOutput: "tidak sah", hidden: true },
          ],
          hints: [
            "Method yang dicari anggota class int dan tidak pernah melempar exception.",
            "Kata kunci parameter keluaran di C# ditulis sebelum nama variabelnya pada pemanggilan.",
            "Jawabannya: TryParse dan out.",
          ],
        },
      ],
    },
    {
      slug: "const-dan-readonly",
      title: "const dan readonly",
      summary: "Konstanta waktu kompilasi versus field yang dipasang sekali, dan kapan memakai yang mana.",
      steps: [
        {
          kind: "theory",
          title: "Dua cara mengunci nilai",
          body: "`const` membuat konstanta waktu kompilasi: nilainya harus diketahui saat kode dikompilasi, hanya boleh bertipe primitif, `string`, atau referensi null, dan otomatis bersifat static sehingga dipanggil lewat nama class. Konsekuensi yang jarang disadari: nilai const dibakar ke dalam setiap assembly yang memakainya, jadi mengubah const di satu library menuntut kompilasi ulang seluruh pemakainya.\n\n`readonly` mengunci field agar hanya bisa diisi di deklarasi atau di dalam constructor, dievaluasi saat runtime, dan boleh bertipe apa pun termasuk objek. Untuk tipe referensi, `readonly` mengunci referensinya, bukan isinya: elemen array readonly tetap boleh diganti. Pilih `const` untuk nilai yang benar-benar abadi seperti `Pi`, dan `readonly` untuk nilai yang dihitung saat program jalan atau milik tiap objek.\n\nKonvensi penamaan C# menulis konstanta dengan PascalCase: `BatasUmur`, bukan `BATAS_UMUR` ala Java atau C. Apa pun bentuknya, angka telanjang di tengah logika tetap sebaiknya diganti konstanta bernama; makna 70 dalam `nilai >= BatasLulus` terbaca tanpa menebak, dan perubahan aturan cukup di satu tempat.",
          code: {
            language: "csharp",
            content: "using System;\n\npublic class Program\n{\n    const int UmurMinimal = 17;  // konstanta waktu kompilasi, implisit static\n    readonly int tahunDibuat;    // dipasang sekali lewat constructor\n\n    Program(int tahun)\n    {\n        tahunDibuat = tahun;\n    }\n\n    public static void Main()\n    {\n        Program p = new Program(2026);\n        Console.WriteLine(UmurMinimal);\n        Console.WriteLine(p.tahunDibuat);\n        // UmurMinimal = 20;     // ditolak: const tidak bisa diisi ulang\n        // p.tahunDibuat = 2027; // ditolak: readonly hanya di constructor\n    }\n}",
            caption: "const untuk nilai abadi, readonly untuk nilai yang dipasang sekali.",
          },
        },
        {
          kind: "quiz",
          question: "Pernyataan mana yang benar tentang `const`?",
          options: [
            "const harus diisi di dalam constructor",
            "const implisit static dan nilainya harus diketahui saat kompilasi",
            "const boleh diisi ulang satu kali",
            "const hanya bisa bertipe int",
          ],
          answer: 1,
          explanation:
            "const dievaluasi saat kompilasi, otomatis static, dan hanya untuk primitif, string, atau null. readonly adalah yang diisi lewat constructor.",
        },
        {
          kind: "quiz",
          question: "Field `readonly` boleh diisi di mana?",
          options: [
            "Di deklarasi atau di dalam constructor",
            "Di method mana pun sebelum dibaca",
            "Di dalam blok static saja",
            "Di mana saja asal hanya sekali",
          ],
          answer: 0,
          explanation:
            "readonly hanya menerima pengisian di tempat deklarasinya atau di dalam constructor. Pengisian di method biasa ditolak compiler.",
        },
        {
          kind: "code",
          title: "Luas lingkaran dari konstanta",
          prompt:
            "Program menghitung luas lingkaran memakai nilai Pi yang tersimpan sebagai konstanta class. Ganti `___` dengan kata kunci yang membuat nilainya terkunci sejak kompilasi.",
          mode: "fill",
          template:
            'using System;\nusing System.Globalization;\n\npublic class Program\n{\n    ___ double Pi = 3.14159;\n\n    public static void Main()\n    {\n        int r = Convert.ToInt32(Console.ReadLine());\n        double luas = Pi * r * r;\n        Console.WriteLine(string.Format(CultureInfo.InvariantCulture, "{0:F2}", luas));\n    }\n}',
          solution:
            'using System;\nusing System.Globalization;\n\npublic class Program\n{\n    const double Pi = 3.14159;\n\n    public static void Main()\n    {\n        int r = Convert.ToInt32(Console.ReadLine());\n        double luas = Pi * r * r;\n        Console.WriteLine(string.Format(CultureInfo.InvariantCulture, "{0:F2}", luas));\n    }\n}',
          tests: [
            { stdin: "7", expectedOutput: "153.94" },
            { stdin: "1", expectedOutput: "3.14" },
            { stdin: "10", expectedOutput: "314.16", hidden: true },
          ],
          hints: [
            "Nilainya sudah pasti sejak program ditulis, jadi waktu kompilasi memenuhi syarat.",
            "Kata kuncinya satu, dan karena implisit static, Pi bisa dipakai langsung di Main.",
            "Jawabannya: const.",
          ],
        },
      ],
    },
    {
      slug: "konvensi-penamaan-csharp",
      title: "Konvensi Penamaan C#",
      summary: "PascalCase untuk method dan property, camelCase lokal, field privat dengan garis bawah.",
      steps: [
        {
          kind: "theory",
          title: "Bentuk nama sebagai peta peran",
          body: "Konvensi .NET membagi nama berdasarkan perannya. Class, struct, interface, method, dan property memakai PascalCase: `RekeningBank`, `HitungDiskon`, `SaldoAkhir`. Variabel lokal dan parameter memakai camelCase: `totalSementara`, `hargaSatuan`. Field privat lazim ditulis dengan garis bawah lalu camelCase: `_saldo`; penulisan ini membedakannya dari variabel lokal sekilas pandang.\n\nYang paling sering mengejutkan pengan Java: method di C# ditulis PascalCase karena ia anggota tipe, terlihat dari `Console.WriteLine` dan `nama.ToUpper()` di library bawaan. Method diberi nama kata kerja: `CetakStruk`, `HitungPajak`. Interface diawali huruf I: `IDisposable`, `IComparable<T>`. Konstanta juga PascalCase, bukan huruf besar semua.\n\nCompiler menerima nama apa pun; pembaca kodemu yang menanggung biayanya. Ketika nama mengikuti konvensi, pembaca bisa menebak peran sebuah nama tanpa melompat ke definisinya, dan kode library .NET terasa seperti kode timmu sendiri. Konsistensi internal proyek selalu di atas selera pribadi.",
          code: {
            language: "csharp",
            content: "using System;\n\npublic class Program\n{\n    static int totalPesanan = 0;   // field privat: _totalPesanan juga lazim\n\n    static int HitungTotal(int harga, int jumlah)  // method: PascalCase\n    {\n        return harga * jumlah;\n    }\n\n    public static void Main()\n    {\n        int hargaSatuan = 5000;    // lokal: camelCase\n        int jumlah = 3;\n        totalPesanan++;\n        Console.WriteLine(HitungTotal(hargaSatuan, jumlah));\n        Console.WriteLine(totalPesanan);\n    }\n}",
            caption: "Bentuk nama langsung membeberkan perannya.",
          },
        },
        {
          kind: "quiz",
          question: "Nama method C# yang mengikuti konvensi untuk menghitung diskon adalah?",
          options: ["hitungDiskon", "HitungDiskon", "hitung_diskon", "HITUNGDISKON"],
          answer: 1,
          explanation:
            "Method adalah anggota tipe sehingga memakai PascalCase: HitungDiskon. Bentuk camelCase adalah milik variabel lokal dan parameter.",
        },
        {
          kind: "quiz",
          question: "Menurut konvensi .NET, field privat lazim ditulis bagaimana?",
          options: ["saldo", "_saldo", "Saldo", "SALDO"],
          answer: 1,
          explanation:
            "Field privat ditulis dengan garis bawah diikuti camelCase: _saldo. Garis bawah itu sengaja membedakannya dari variabel lokal.",
        },
      ],
    },
    {
      slug: "komentar-dan-xml-doc",
      title: "Komentar dan XML Doc",
      summary: "Komentar yang layak, /// untuk dokumentasi API, dan yang sebaiknya tidak ditulis.",
      steps: [
        {
          kind: "theory",
          title: "Menjelaskan yang tidak terlihat",
          body: "Komentar C# ada dua bentuk: `//` untuk satu baris dan `/* ... */` untuk blok. Aturan praktisnya ketat: komentar menjelaskan kendala yang tidak terlihat dari kode, bukan menerjemahkan kode ke bahasa lain. `i++; // menaikkan i` hanya menambah kebisingan; yang layak ditulis semacam `// indeks di server mulai dari 0, kurangi satu dulu`.\n\nTiga garis miring `///` memulai komentar dokumentasi XML yang diletakkan di atas class, method, property, atau parameternya. Isinya berupa tag seperti `<summary>`, `<param name=\"nama\">`, dan `<returns>`; compiler bisa mengekspornya menjadi file dokumentasi, dan IntelliSense menampilkan summary itu saat pemanggil mengetik. Inilah cara ekosistem .NET mendokumentasikan API publiknya.\n\nTulis XML doc untuk API yang dipakai orang lain atau lintas tim; untuk method kecil bernama jelas, nama yang baik sudah cukup. Komentar yang tertinggal dari kode yang sudah berubah lebih berbahaya daripada tanpa komentar: saat menyunting kode, ikut memperbarui komentarnya, atau hapus.",
          code: {
            language: "csharp",
            content: 'using System;\n\npublic class Program\n{\n    /// <summary>\n    /// Menghitung total bayar setelah diskon persen.\n    /// </summary>\n    /// <param name="total">Total sebelum diskon.</param>\n    /// <param name="persen">Diskon dalam persen, 0 sampai 100.</param>\n    /// <returns>Total akhir setelah potongan.</returns>\n    static double HitungBayar(double total, double persen)\n    {\n        return total - total * persen / 100;\n    }\n\n    public static void Main()\n    {\n        Console.WriteLine(HitungBayar(100000, 20)); // 80000\n    }\n}',
            caption: "XML doc di atas method tampil sebagai bantuan saat dipanggil.",
          },
        },
        {
          kind: "quiz",
          question: "Komentar apa yang memulai dokumentasi XML di C#?",
          options: ["//", "///", "<!--", "#"],
          answer: 1,
          explanation:
            "Tiga garis miring /// menandai komentar dokumentasi XML yang bisa diekspor compiler dan dibaca IntelliSense.",
        },
        {
          kind: "quiz",
          question: "Komentar mana yang layak dipertahankan?",
          options: [
            "i++; // menambah i satu",
            "HitungTotal(a, b); // memanggil HitungTotal",
            "// kurangi satu karena indeks di server mulai dari nol",
            "// deklarasi variabel",
          ],
          answer: 2,
          explanation:
            "Hanya komentar kedua yang menjelaskan kendala yang tidak terlihat dari kodenya. Tiga lainnya sekadar menyalin ulang apa yang sudah tertulis.",
        },
      ],
    },
    {
      slug: "latihan-modul-0",
      title: "Latihan Gabungan Modul 0",
      summary: "Tipe, format, TryParse, const, dan percabangan bertemu di satu program rapor.",
      steps: [
        {
          kind: "theory",
          title: "Kebiasaan kecil yang bergabung",
          body: "Modul ini merangkai kebiasaan yang membedakan C# yang idiomatik dari yang sekadar jalan: tipe yang tepat dengan `var` seperlunya, input dan keluaran lewat `Console` dengan format `{0}`, penguraian teks aman lewat `TryParse`, konstanta bernama dengan `const`, dan percabangan yang rapi. Latihan penutup memakai semuanya dalam satu program rapor mini.\n\nProgram yang akan kamu lengkapi membaca nama dan teks nilai, menguraikannya dengan `int.TryParse`, lalu menolak input tidak sah dengan pesan khusus. Bila sah, nilainya dibandingkan dengan konstanta `BatasLulus` dan statusnya dicetak terformat lewat `string.Format` dengan `CultureInfo.InvariantCulture`. Perhatikan pemakaian `!ok` pada cabang gagal; menangani kegagalan lebih dulu membuat cabang utama tidak bersarang.",
          code: {
            language: "csharp",
            content: '// bool ok = int.TryParse(teksNilai, out nilai);\n// if (!ok) -> "Nilai tidak sah"\n// nilai >= BatasLulus -> "{0}: LULUS ({1})"\n// selain itu -> "{0}: TIDAK LULUS ({1})"',
            caption: "Empat kontrak program rapor yang kamu lengkapi di langkah berikutnya.",
          },
        },
        {
          kind: "code",
          title: "Penentu kelulusan",
          prompt:
            "Lengkapi tiga bagian yang hilang: kata kunci konstanta pada `BatasLulus`, tipe variabel hasil penguraian, dan method penguraian yang aman. Sisanya sudah beres.",
          mode: "fill",
          template:
            'using System;\nusing System.Globalization;\n\npublic class Program\n{\n    ___ int BatasLulus = 70;\n\n    public static void Main()\n    {\n        string nama = Console.ReadLine();\n        string teksNilai = Console.ReadLine();\n\n        ___ nilai;\n        bool ok = int.___(teksNilai, out nilai);\n\n        if (!ok)\n        {\n            Console.WriteLine("Nilai tidak sah");\n        }\n        else if (nilai >= BatasLulus)\n        {\n            Console.WriteLine(string.Format(CultureInfo.InvariantCulture, "{0}: LULUS ({1})", nama, nilai));\n        }\n        else\n        {\n            Console.WriteLine(string.Format(CultureInfo.InvariantCulture, "{0}: TIDAK LULUS ({1})", nama, nilai));\n        }\n    }\n}',
          solution:
            'using System;\nusing System.Globalization;\n\npublic class Program\n{\n    const int BatasLulus = 70;\n\n    public static void Main()\n    {\n        string nama = Console.ReadLine();\n        string teksNilai = Console.ReadLine();\n\n        int nilai;\n        bool ok = int.TryParse(teksNilai, out nilai);\n\n        if (!ok)\n        {\n            Console.WriteLine("Nilai tidak sah");\n        }\n        else if (nilai >= BatasLulus)\n        {\n            Console.WriteLine(string.Format(CultureInfo.InvariantCulture, "{0}: LULUS ({1})", nama, nilai));\n        }\n        else\n        {\n            Console.WriteLine(string.Format(CultureInfo.InvariantCulture, "{0}: TIDAK LULUS ({1})", nama, nilai));\n        }\n    }\n}',
          tests: [
            { stdin: "Dina\n85", expectedOutput: "Dina: LULUS (85)" },
            { stdin: "Budi\n60", expectedOutput: "Budi: TIDAK LULUS (60)" },
            { stdin: "Citra\nabc", expectedOutput: "Nilai tidak sah", hidden: true },
          ],
          hints: [
            "Batas kelulusan tidak pernah berubah, jadi layak jadi konstanta waktu kompilasi.",
            "Variabel hasil penguraian harus dideklarasikan sebelum dipakai sebagai argumen out.",
            "Jawabannya: const, int, dan TryParse.",
          ],
        },
      ],
    },
    // ==================== MODUL 1: Collections dan Generics ====================
    {
      slug: "list-dasar-operasi-inti",
      title: "List<T> dan Operasi Inti",
      summary: "Daftar yang tumbuh sendiri: Add, Count, indexer, Insert, Remove, dan Contains.",
      steps: [
        {
          kind: "theory",
          title: "Array yang bisa tumbuh",
          body: "Array punya panjang tetap sejak dibuat; `List<T>` tumbuh dan menyusut sesuai kebutuhan. `T` di dalam kurung sudut adalah parameter tipe: `List<int>` hanya menampung int, `List<string>` hanya string, dan kekeliruan tipe tertangkap saat kompilasi. Semua ada di `System.Collections.Generic`, jadi file perlu `using System.Collections.Generic;` di baris atas.\n\nOperasi intinya sedikit dan padat. `Add(item)` menambah di ujung. `Count` adalah property jumlah elemen, bukan method. Indexer `daftar[i]` membaca dan menulis elemen pada posisi i. `Insert(i, item)` menyisipkan, `Remove(item)` menghapus kemunculan pertama berdasarkan nilai dan mengembalikan bool, `RemoveAt(i)` menghapus dari posisi, `Contains(item)` mengecek keanggotaan, dan `Clear()` mengosongkan.\n\nBentuk kinerjanya cukup dipahami sekali: indexer dan `Count` murah, `Add` di ujung rata-rata murah, sedangkan `Insert` atau `Remove` di tengah menggeser elemen sesudahnya. `Contains` memeriksa satu per satu sehingga mahal di daftar panjang; bila pencarian anggota menjadi inti program, `HashSet` pada lesson berikutnya adalah penggantinya.",
          code: {
            language: "csharp",
            content: 'using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    public static void Main()\n    {\n        List<string> tugas = new List<string>();\n        tugas.Add("belajar");\n        tugas.Add("ngoding");\n        tugas.Insert(1, "istirahat");\n\n        Console.WriteLine(tugas.Count);               // 3\n        Console.WriteLine(tugas[0]);                  // belajar\n        Console.WriteLine(tugas.Contains("ngoding")); // True\n\n        tugas.Remove("istirahat");\n        tugas.RemoveAt(0);\n        Console.WriteLine(tugas[0]);                  // ngoding\n    }\n}',
            caption: "List tumbuh lewat Add dan Insert, menyusut lewat Remove dan RemoveAt.",
          },
        },
        {
          kind: "quiz",
          question: "Method `List<T>` untuk menghapus elemen pada posisi tertentu adalah?",
          options: ["Remove", "RemoveAt", "Delete", "Erase"],
          answer: 1,
          explanation:
            "RemoveAt(i) menghapus berdasarkan posisi. Remove(item) mencari berdasarkan nilai dan menghapus kemunculan pertamanya.",
        },
        {
          kind: "code",
          title: "Jumlahkan isi daftar",
          prompt:
            "Program membaca `n` lalu `n` bilangan ke dalam `List<int>`, dan mencetak jumlah semuanya. Lengkapi dua bagian yang hilang.",
          mode: "fill",
          template:
            'using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int n = Convert.ToInt32(Console.ReadLine());\n        List<int> angka = new List<int>();\n\n        for (int i = 0; i < n; i++)\n        {\n            angka.___(Convert.ToInt32(Console.ReadLine()));\n        }\n\n        int total = 0;\n        for (int i = 0; i < angka.___; i++)\n        {\n            total += angka[i];\n        }\n\n        Console.WriteLine(total);\n    }\n}',
          solution:
            'using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int n = Convert.ToInt32(Console.ReadLine());\n        List<int> angka = new List<int>();\n\n        for (int i = 0; i < n; i++)\n        {\n            angka.Add(Convert.ToInt32(Console.ReadLine()));\n        }\n\n        int total = 0;\n        for (int i = 0; i < angka.Count; i++)\n        {\n            total += angka[i];\n        }\n\n        Console.WriteLine(total);\n    }\n}',
          tests: [
            { stdin: "3\n4\n10\n7", expectedOutput: "21" },
            { stdin: "1\n5", expectedOutput: "5" },
            { stdin: "4\n2\n8\n-3\n9", expectedOutput: "16", hidden: true },
          ],
          hints: [
            "Bagian pertama menambah elemen ke ujung daftar, bagian kedua adalah property jumlah elemen.",
            "Count di sini property, bukan method, jadi tanpa tanda kurung.",
            "Jawabannya: Add dan Count.",
          ],
        },
      ],
    },
    {
      slug: "foreach-dan-for-koleksi",
      title: "foreach dan for pada Koleksi",
      summary: "foreach untuk membaca, for saat butuh indeks, dan larangan mengubah koleksi saat menelusuri.",
      steps: [
        {
          kind: "theory",
          title: "Dua loop dengan dua maksud",
          body: "`foreach` menelusuri koleksi apa pun yang bisa dienumerasi tanpa memikirkan indeks: `foreach (string t in tugas)`. Variabel loopnya read-only, dan itu disengaja: foreach berarti sedang membaca, bukan menyusun ulang.\n\nStruktur koleksi tidak boleh berubah selama foreach berjalan. `Add` atau `Remove` pada list yang sedang ditelusuri melempar `InvalidOperationException` saat runtime, bukan saat kompilasi. Mengganti isi elemen juga tidak bisa lewat foreach karena variabelnya read-only; di situlah `for` masuk: `for (int i = 0; i < daftar.Count; i++)` memberi indeks untuk membaca, menulis `daftar[i] = nilai`, atau melompat.\n\nKaidah praktisnya: mulai dari foreach karena maksudnya paling jelas, lalu pindah ke for hanya saat indeks benar-benar dibutuhkan, misalnya mengganti nilai, membandingkan elemen bersebelahan, atau merekam posisi. Lesson berikutnya menambah iterasi atas Dictionary yang datang sebagai pasangan kunci dan nilai.",
          code: {
            language: "csharp",
            content: 'using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    public static void Main()\n    {\n        List<int> nilai = new List<int> { 70, 40, 95 };\n\n        int total = 0;\n        foreach (int n in nilai)\n        {\n            total += n;\n        }\n\n        for (int i = 0; i < nilai.Count; i++)\n        {\n            if (nilai[i] < 60)\n            {\n                nilai[i] = 60; // nilai ditingkatkan ke batas minimum\n            }\n        }\n\n        Console.WriteLine(total);\n        Console.WriteLine(string.Join(" ", nilai)); // 70 60 95\n    }\n}',
            caption: "foreach untuk membaca, for untuk menulis lewat indeks.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi bila `daftar.Add(x)` dipanggil di dalam foreach yang sedang menelusuri `daftar` yang sama?",
          options: [
            "Elemen ditambahkan tanpa masalah",
            "Loop langsung selesai tanpa error",
            "InvalidOperationException saat runtime",
            "Tidak lolos kompilasi",
          ],
          answer: 2,
          explanation:
            "List mendeteksi perubahan struktur saat sedang dienumerasi dan melempar InvalidOperationException. Aturan ini berlaku saat runtime, jadi kompilasi tetap lolos.",
        },
        {
          kind: "quiz",
          question: "Cara yang benar mengganti nilai elemen di posisi i pada `List<T>` adalah?",
          options: [
            "item = nilai di dalam foreach",
            "daftar[i] = nilai di dalam for",
            "daftar.SetValue(i, nilai)",
            "Tidak mungkin mengganti isi List",
          ],
          answer: 1,
          explanation:
            "Variabel foreach read-only sehingga tidak bisa ditugasi. Indexer di dalam for adalah cara yang benar, dan SetValue bukan anggota List<T>.",
        },
      ],
    },
    {
      slug: "dictionary-dan-trygetvalue",
      title: "Dictionary dan TryGetValue",
      summary: "Peta kunci ke nilai, indexer yang melempar saat kunci hilang, dan pola TryGetValue.",
      steps: [
        {
          kind: "theory",
          title: "Kunci yang menjaga pintu",
          body: "`Dictionary<TKey, TValue>` memetakan kunci ke nilai dengan pencarian cepat lewat hash: `Dictionary<string, int> stok` memetakan nama barang ke jumlahnya. Kunci unik; `Add` dengan kunci yang sudah ada melempar `ArgumentException`, sedangkan indexer `stok[kunci] = nilai` berlaku untuk kunci baru maupun lama dan menjadi cara paling ringkas untuk mengisi atau mengganti.\n\nMembaca adalah bagian yang menipu. `stok[\"tas\"]` pada kunci yang belum ada melempar `KeyNotFoundException`, berbeda dari kamus di beberapa bahasa yang diam-diam mengembalikan nilai kosong. Periksa dulu dengan `ContainsKey`, atau lebih baik langsung `stok.TryGetValue(kunci, out nilai)` yang menjawab bool sekaligus mengisi nilai dalam satu kali pencarian; pola ini idiomatik dan menghindari pencarian ganda.\n\nPola menghitung frekuensi lahir dari aturan itu: bila kunci ada, naikkan hitungannya, bila belum, isi satu. Saat enumerasi, elemen datang sebagai `KeyValuePair<TKey, TValue>` dengan property `Key` dan `Value`. Urutan enumerasi tidak dijanjikan oleh kontrak Dictionary, jadi jangan menaruh logika pada urutannya; urutkan sendiri bila urutan penting.",
          code: {
            language: "csharp",
            content: 'using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    public static void Main()\n    {\n        Dictionary<string, int> stok = new Dictionary<string, int>();\n        stok.Add("buku", 12);\n        stok["pensil"] = 40;\n        stok["buku"] = 15; // indexer mengganti tanpa protes\n\n        int jumlah;\n        if (stok.TryGetValue("buku", out jumlah))\n        {\n            Console.WriteLine("buku: {0}", jumlah);\n        }\n\n        if (stok.TryGetValue("tas", out jumlah))\n        {\n            Console.WriteLine("tas: {0}", jumlah);\n        }\n        else\n        {\n            Console.WriteLine("tas tidak ada");\n        }\n    }\n}',
            caption: "TryGetValue menjawab keberadaan kunci dan isinya sekaligus.",
          },
        },
        {
          kind: "quiz",
          question: 'Apa yang terjadi pada `Console.WriteLine(stok["tas"]);` bila kunci "tas" tidak ada di dictionary?',
          options: [
            "Mencetak 0",
            "Mencetak baris kosong",
            "KeyNotFoundException saat runtime",
            "Tidak lolos kompilasi",
          ],
          answer: 2,
          explanation:
            "Indexer Dictionary melempar KeyNotFoundException untuk kunci yang belum ada. Gunakan ContainsKey atau TryGetValue sebelum membaca.",
        },
        {
          kind: "code",
          title: "Penghitung kata",
          prompt:
            "Program membaca `n` kata, menghitung frekuensinya dengan dictionary, lalu membaca satu kata carian dan mencetak jumlah kemunculannya, atau 0 bila tidak pernah muncul. Lengkapi dua pemeriksaan yang hilang.",
          mode: "fill",
          template:
            'using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int n = Convert.ToInt32(Console.ReadLine());\n        Dictionary<string, int> hitung = new Dictionary<string, int>();\n\n        for (int i = 0; i < n; i++)\n        {\n            string kata = Console.ReadLine();\n            if (hitung.___(kata))\n            {\n                hitung[kata]++;\n            }\n            else\n            {\n                hitung[kata] = 1;\n            }\n        }\n\n        string cari = Console.ReadLine();\n        int jumlah;\n        if (hitung.___(cari, out jumlah))\n        {\n            Console.WriteLine(jumlah);\n        }\n        else\n        {\n            Console.WriteLine(0);\n        }\n    }\n}',
          solution:
            'using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int n = Convert.ToInt32(Console.ReadLine());\n        Dictionary<string, int> hitung = new Dictionary<string, int>();\n\n        for (int i = 0; i < n; i++)\n        {\n            string kata = Console.ReadLine();\n            if (hitung.ContainsKey(kata))\n            {\n                hitung[kata]++;\n            }\n            else\n            {\n                hitung[kata] = 1;\n            }\n        }\n\n        string cari = Console.ReadLine();\n        int jumlah;\n        if (hitung.TryGetValue(cari, out jumlah))\n        {\n            Console.WriteLine(jumlah);\n        }\n        else\n        {\n            Console.WriteLine(0);\n        }\n    }\n}',
          tests: [
            { stdin: "5\nkopi\nteh\nkopi\nkopi\nteh\nteh", expectedOutput: "2" },
            { stdin: "3\na\nb\nc\nd", expectedOutput: "0" },
            { stdin: "4\nx\nx\ny\ny\nx", expectedOutput: "2", hidden: true },
          ],
          hints: [
            "Pemeriksaan pertama hanya butuh jawaban ada atau tidak sebelum menaikkan hitungan.",
            "Pemeriksaan kedua sekaligus mengambil nilainya ke variabel jumlah lewat parameter out.",
            "Jawabannya: ContainsKey dan TryGetValue.",
          ],
        },
      ],
    },
    {
      slug: "hashset-dan-operasi-himpunan",
      title: "HashSet dan Operasi Himpunan",
      summary: "Anggota unik, pencarian cepat, dan UnionWith, IntersectWith, ExceptWith yang mengubah set pemanggil.",
      steps: [
        {
          kind: "theory",
          title: "Unik dan cepat diperiksa",
          body: "`HashSet<T>` menyimpan anggota unik tanpa indeks dan tanpa urutan yang dijanjikan. `Add` mengembalikan bool: true bila anggota baru diterima, false bila sudah ada, sehingga penolakan duplikat terjadi diam tanpa exception. `Count` menghitung anggota, dan karena tanpa indeks, satu-satunya cara mengunjunginya adalah foreach.\n\nNilai utamanya kecepatan: `Contains` rata-rata O(1) lewat hash, dibanding `List.Contains` yang memeriksa satu per satu. Untuk cek keanggotaan pada data besar, ganti list dengan set dan biaya pencarian praktis menghilang.\n\nOperasi himpunannya bekerja dengan mengubah set pemanggil, bukan menghasilkan set baru: `UnionWith(lain)` menjadikan gabungan, `IntersectWith(lain)` irisan, `ExceptWith(lain)` selisih, dan `SymmetricExceptWith(lain)` anggota yang hanya ada di salah satu. Karena mengubah isi, salin dulu dengan `new HashSet<T>(setLama)` bila himpunan aslinya harus dipertahankan; perilaku ini berbeda dari set di Python yang operasinya mengembalikan objek baru.",
          code: {
            language: "csharp",
            content: 'using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    public static void Main()\n    {\n        HashSet<string> hadir = new HashSet<string>();\n        bool pertama = hadir.Add("dina");\n        bool kedua = hadir.Add("dina");\n\n        Console.WriteLine(pertama);                // True\n        Console.WriteLine(kedua);                  // False\n        Console.WriteLine(hadir.Count);            // 1\n        Console.WriteLine(hadir.Contains("budi")); // False\n    }\n}',
            caption: "Set menolak duplikat secara diam lewat nilai balik Add.",
          },
        },
        {
          kind: "quiz",
          question: 'Apa hasil `unik.Add("dina");` ketika "dina" sudah ada di dalam HashSet?',
          options: [
            "true dan isinya diganti",
            "false dan set tidak berubah",
            "Melempar exception",
            "Menambah salinan kedua",
          ],
          answer: 1,
          explanation:
            "Add mengembalikan false bila anggota sudah ada, dan isi set tetap satu dina. Tidak ada exception dan tidak ada duplikat.",
        },
        {
          kind: "code",
          title: "Hitung anggota unik",
          prompt:
            "Program membaca `n` bilangan ke dalam HashSet lalu mencetak jumlah anggota uniknya dan apakah angka 7 termasuk di dalamnya. Lengkapi dua bagian yang hilang.",
          mode: "fill",
          template:
            'using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int n = Convert.ToInt32(Console.ReadLine());\n        HashSet<int> unik = new HashSet<int>();\n\n        for (int i = 0; i < n; i++)\n        {\n            unik.___(Convert.ToInt32(Console.ReadLine()));\n        }\n\n        Console.WriteLine(unik.___);\n        Console.WriteLine(unik.Contains(7));\n    }\n}',
          solution:
            'using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int n = Convert.ToInt32(Console.ReadLine());\n        HashSet<int> unik = new HashSet<int>();\n\n        for (int i = 0; i < n; i++)\n        {\n            unik.Add(Convert.ToInt32(Console.ReadLine()));\n        }\n\n        Console.WriteLine(unik.Count);\n        Console.WriteLine(unik.Contains(7));\n    }\n}',
          tests: [
            { stdin: "5\n1\n2\n2\n3\n3", expectedOutput: "3\nFalse" },
            { stdin: "4\n7\n7\n7\n7", expectedOutput: "1\nTrue" },
            { stdin: "6\n10\n20\n30\n10\n20\n7", expectedOutput: "4\nTrue", hidden: true },
          ],
          hints: [
            "Satu method untuk memasukkan anggota, satu property untuk menghitungnya.",
            "Duplikat yang masuk berkali-kali tetap dihitung satu.",
            "Jawabannya: Add dan Count.",
          ],
        },
      ],
    },
    {
      slug: "queue-dan-stack",
      title: "Queue dan Stack",
      summary: "Antrean FIFO dengan Enqueue dan Dequeue, tumpukan LIFO dengan Push dan Pop.",
      steps: [
        {
          kind: "theory",
          title: "Antrean dan tumpukan",
          body: "`Queue<T>` adalah antrean dengan pola FIFO, first in first out: `Enqueue` menambah di ekor, `Dequeue` mengambil dari kepala, `Peek` melihat kepala tanpa mengambil. Cocok untuk pekerjaan yang harus dilayani sesuai urutan datang: antrean cetak, daftar tugas, penelusuran graf BFS.\n\n`Stack<T>` kebalikannya dengan pola LIFO: `Push` menumpuk di atas, `Pop` mengambil yang paling atas, `Peek` mengintip tanpa mengambil. Dipakai untuk undo, jejak navigasi mundur, dan penelusuran DFS. Keduanya generik di `System.Collections.Generic`; versi lama non-generik di `System.Collections` tersisa untuk kompatibilitas dan tidak perlu dipakai kode baru.\n\nDua hal yang sering menjegal: `Peek`, `Dequeue`, dan `Pop` pada koleksi kosong melempar `InvalidOperationException`, jadi periksa `Count` dulu bila kekosongan mungkin terjadi. Saat di-foreach, Queue mengalir dari depan ke belakang, Stack dari atas ke bawah, dan penelusuran itu tidak menghapus isinya.",
          code: {
            language: "csharp",
            content: 'using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    public static void Main()\n    {\n        Queue<string> antrean = new Queue<string>();\n        antrean.Enqueue("dina");\n        antrean.Enqueue("budi");\n        Console.WriteLine(antrean.Peek());    // dina\n        Console.WriteLine(antrean.Dequeue()); // dina\n        Console.WriteLine(antrean.Dequeue()); // budi\n\n        Stack<int> riwayat = new Stack<int>();\n        riwayat.Push(1);\n        riwayat.Push(2);\n        Console.WriteLine(riwayat.Pop());  // 2\n        Console.WriteLine(riwayat.Peek()); // 1\n    }\n}',
            caption: "Queue melayani yang datang duluan, Stack yang masuk terakhir.",
          },
        },
        {
          kind: "quiz",
          question: "Queue<T> mengatur elemen dengan pola FIFO. Elemen mana yang dikembalikan Dequeue()?",
          options: [
            "Yang terakhir masuk",
            "Yang pertama masuk",
            "Yang berada di tengah",
            "Bergantian acak",
          ],
          answer: 1,
          explanation:
            "Dequeue mengambil elemen paling depan, yaitu yang pertama kali di-Enqueue dan belum pernah diambil. Itulah makna first in first out.",
        },
        {
          kind: "quiz",
          question: "Apa keluaran program yang menjalankan Push(1), Push(2), Push(3), lalu Pop() dua kali?",
          options: ["3 lalu 3", "1 lalu 2", "1 lalu 3", "3 lalu 2"],
          answer: 3,
          explanation:
            "Stack bersifat LIFO: Pop mengambil yang terakhir masuk. Tiga nilai bertumpuk 1, 2, 3, sehingga Pop pertama mengambil 3 dan Pop kedua mengambil 2.",
        },
      ],
    },
    {
      slug: "ienumerable-dan-yield",
      title: "IEnumerable dan yield return",
      summary: "Kontrak di balik foreach, dan yield untuk memproduksi urutan tanpa List perantara.",
      steps: [
        {
          kind: "theory",
          title: "Kontrak yang bisa di-foreach",
          body: "Setiap foreach sebenarnya bermuara pada satu kontrak: `IEnumerable<T>` dengan method `GetEnumerator()` yang mengembalikan enumerator. Tipe apa pun yang memenuhi kontrak itu bisa ditelusuri, dan method yang mengembalikan `IEnumerable<T>` bisa memberi pemanggil sesuatu untuk di-foreach tanpa membuka list internalnya.\n\nMenulis enumerator manual itu melelahkan, maka sejak C# 2 ada `yield return`: compiler mengubah method menjadi iterator. Eksekusi berhenti di tiap `yield return`, mengirim satu nilai, lalu lanjut persis dari situ saat pemanggil meminta nilai berikutnya. Syaratnya method bertipe kembalian `IEnumerable<T>` atau `IEnumerator<T>`, di dalamnya boleh ada loop biasa, dan `yield break` menghentikan urutan lebih awal.\n\nPerbedaan pentingnya dari mengembalikan `List<T>` adalah sifat malas: nilai diproduksi saat ditelusuri, bukan dikumpulkan lebih dulu, sehingga urutan panjang bisa disajikan tanpa menampung semuanya di memori. Batasannya: method iterator tidak boleh punya parameter `ref` atau `out`. Pola ini juga fondasi LINQ yang dibahas di modul lanjutan.",
          code: {
            language: "csharp",
            content: "using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    static IEnumerable<int> GenapSampai(int batas)\n    {\n        for (int i = 0; i <= batas; i += 2)\n        {\n            yield return i;\n        }\n    }\n\n    public static void Main()\n    {\n        foreach (int n in GenapSampai(7))\n        {\n            Console.WriteLine(n); // 0, 2, 4, 6 satu per baris\n        }\n    }\n}",
            caption: "Method biasa diubah compiler menjadi iterator penuh.",
          },
        },
        {
          kind: "quiz",
          question: "foreach di C# bisa menelusuri tipe yang?",
          options: [
            "Punya property Count",
            "Mengimplementasikan IEnumerable",
            "Berupa class apa pun",
            "Mengimplementasikan IList saja",
          ],
          answer: 1,
          explanation:
            "Syarat foreach hanya satu: tipe itu bisa dienumerasi, yaitu mengimplementasikan IEnumerable atau IEnumerable<T>. List dan array memenuhinya, tapi tidak hanya keduanya.",
        },
        {
          kind: "code",
          title: "Urutan kuadrat dari iterator",
          prompt:
            "Method `Kuadrat` seharusnya menghasilkan 1, 4, 9, dan seterusnya sampai n, tanpa List perantara. Lengkapi bagian yang mengirim satu nilai per langkah.",
          mode: "fill",
          template:
            'using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    static IEnumerable<int> Kuadrat(int n)\n    {\n        for (int i = 1; i <= n; i++)\n        {\n            yield ___ i * i;\n        }\n    }\n\n    public static void Main()\n    {\n        int batas = Convert.ToInt32(Console.ReadLine());\n        foreach (int hasil in Kuadrat(batas))\n        {\n            Console.WriteLine(hasil);\n        }\n    }\n}',
          solution:
            'using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    static IEnumerable<int> Kuadrat(int n)\n    {\n        for (int i = 1; i <= n; i++)\n        {\n            yield return i * i;\n        }\n    }\n\n    public static void Main()\n    {\n        int batas = Convert.ToInt32(Console.ReadLine());\n        foreach (int hasil in Kuadrat(batas))\n        {\n            Console.WriteLine(hasil);\n        }\n    }\n}',
          tests: [
            { stdin: "3", expectedOutput: "1\n4\n9" },
            { stdin: "1", expectedOutput: "1" },
            { stdin: "5", expectedOutput: "1\n4\n9\n16\n25", hidden: true },
          ],
          hints: [
            "yield selalu berpasangan dengan satu kata kunci pengirim nilai.",
            "Kata kuncinya sama seperti yang mengirim hasil keluar dari method biasa.",
            "Jawabannya: return.",
          ],
        },
      ],
    },
    {
      slug: "sort-dengan-comparison",
      title: "List.Sort dengan Comparison<T>",
      summary: "Mengurutkan dengan delegate pembanding: menaik, menurun, dan dua kunci sekaligus.",
      steps: [
        {
          kind: "theory",
          title: "Tanda hasil menentukan arah",
          body: "`List.Sort()` tanpa argumen mengurutkan menaik memakai perbandingan bawaan tipe: angka secara nilai, string secara abjad menurut culture saat itu. Untuk kebutuhan lain, `Sort` menerima delegate `Comparison<T>`: method kecil dengan dua argumen yang mengembalikan angka negatif bila argumen pertama harus di depan, nol bila setara, dan positif bila harus di belakang.\n\nIdiom yang aman memakai `CompareTo` alih-alih pengurangan: `(a, b) => a.CompareTo(b)` mengurutkan menaik dan `(a, b) => b.CompareTo(a)` menurun. Pola `a - b` memang lazim di bahasa lain tetapi bisa meluap pada nilai ekstrem, sedangkan `CompareTo` bebas dari jebakan itu. Sejak C# 3, lambda menjadi cara paling ringkas menulis Comparison; bentuk anonymous `delegate(int a, int b) { ... }` juga sah di compiler C# 5.\n\nUrutan dua kunci ditulis berlapis: bandingkan kunci utama, bila nol baru bandingkan kunci kedua, misalnya panjang teks lalu isinya. Satu catatan penting: `List.Sort` tidak stabil, elemen yang dianggap setara bisa saling menukar posisi. Bila urutan hasil harus pasti, pecah semua kemungkinan seri di dalam pembanding, misalnya dengan nama sebagai kunci terakhir.",
          code: {
            language: "csharp",
            content: 'using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    public static void Main()\n    {\n        List<int> nilai = new List<int> { 70, 95, 60, 85 };\n\n        nilai.Sort();\n        Console.WriteLine(string.Join(" ", nilai)); // 60 70 85 95\n\n        nilai.Sort((a, b) => b.CompareTo(a));\n        Console.WriteLine(string.Join(" ", nilai)); // 95 85 70 60\n    }\n}',
            caption: "Arah pengurutan ditentukan tanda hasil pembanding.",
          },
        },
        {
          kind: "quiz",
          question: "Pada `Comparison<T>`, kapan elemen a diletakkan sebelum b?",
          options: [
            "Bila delegate mengembalikan angka positif",
            "Bila delegate mengembalikan angka negatif",
            "Bila delegate mengembalikan nol",
            "Urutan tidak dipengaruhi hasil delegate",
          ],
          answer: 1,
          explanation:
            "Hasil negatif berarti a harus di depan b, positif berarti di belakang, nol berarti setara. Idiom a.CompareTo(b) menghasilkan negatif bila a lebih kecil.",
        },
        {
          kind: "code",
          title: "Urutkan kata: pendek dulu, seri dipecah abjad",
          prompt:
            "Program membaca `n` kata dan mencetaknya terurut dari yang terpendek; kata yang sama panjang diurutkan abjad menaik. Lengkapi dua pembandingan yang hilang.",
          mode: "fill",
          template:
            'using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int n = Convert.ToInt32(Console.ReadLine());\n        List<string> kata = new List<string>();\n\n        for (int i = 0; i < n; i++)\n        {\n            kata.Add(Console.ReadLine());\n        }\n\n        kata.Sort((a, b) =>\n        {\n            int bedaPanjang = a.Length.___(b.Length);\n            if (bedaPanjang != 0)\n            {\n                return bedaPanjang;\n            }\n            return a.___(b);\n        });\n\n        foreach (string s in kata)\n        {\n            Console.WriteLine(s);\n        }\n    }\n}',
          solution:
            'using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int n = Convert.ToInt32(Console.ReadLine());\n        List<string> kata = new List<string>();\n\n        for (int i = 0; i < n; i++)\n        {\n            kata.Add(Console.ReadLine());\n        }\n\n        kata.Sort((a, b) =>\n        {\n            int bedaPanjang = a.Length.CompareTo(b.Length);\n            if (bedaPanjang != 0)\n            {\n                return bedaPanjang;\n            }\n            return a.CompareTo(b);\n        });\n\n        foreach (string s in kata)\n        {\n            Console.WriteLine(s);\n        }\n    }\n}',
          tests: [
            { stdin: "4\ne\nbb\nccc\ndd", expectedOutput: "e\nbb\ndd\nccc" },
            { stdin: "3\npisang\napel\nkiwi", expectedOutput: "apel\nkiwi\npisang" },
            { stdin: "5\naaa\nb\ncc\ndd\ne", expectedOutput: "b\ne\ncc\ndd\naaa", hidden: true },
          ],
          hints: [
            "Perbandingan pertama menyandingkan panjang kedua kata, perbandingan kedua menyandingkan isinya.",
            "Method bawaan tipe yang membandingkan dirinya dengan yang lain dan mengembalikan negatif, nol, atau positif.",
            "Jawabannya: CompareTo untuk keduanya.",
          ],
        },
      ],
    },
    {
      slug: "method-generik",
      title: "Method Generik",
      summary: "Satu logika untuk banyak tipe: parameter tipe, penyimpulan compiler, dan constraint.",
      steps: [
        {
          kind: "theory",
          title: "Placeholder yang diganti tiap pemanggilan",
          body: "Method generik mendeklarasikan parameter tipe sendiri: `static T Pertama<T>(List<T> daftar)`. Huruf `T` adalah placeholder yang diganti tipe nyata di tiap pemanggilan, dan compiler menyimpulkannya dari argumen: `Pertama(nama)` dengan `nama` bertipe `List<string>` membuat T menjadi `string` tanpa perlu ditulis.\n\nTanpa generic, satu logika untuk banyak tipe harus jatuh ke `object` lalu di-cast, dan semua jaminan tipe hilang. Dengan generic, `Tukar<T>(ref T a, ref T b)` menukar dua nilai bertipe apa pun dan tetap aman saat kompilasi. Bila tubuh method perlu berbuat lebih daripada memindahkan referensi, batasi T dengan constraint: `where T : IComparable<T>` menjamin T punya `CompareTo`, sehingga `Terbesar<T>` bisa membandingkan dua nilai tipe apa pun yang sejenis.\n\nBedakan dengan generic tingkat class seperti `List<T>`: pada class, T dibagikan ke seluruh anggota; pada method, T hidup hanya dalam satu pemanggilan dan bisa disimpulkan. Kebiasaan yang sehat: tulis method konkret dulu, lalu angkat menjadi generik hanya saat tipe kedua benar-benar muncul; generalisasi sebelum waktunya membuat kode sulit dibaca tanpa manfaat.",
          code: {
            language: "csharp",
            content: 'using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    static T Pertama<T>(List<T> daftar)\n    {\n        return daftar[0];\n    }\n\n    static T Terbesar<T>(T a, T b) where T : IComparable<T>\n    {\n        return a.CompareTo(b) >= 0 ? a : b;\n    }\n\n    public static void Main()\n    {\n        List<string> nama = new List<string>();\n        nama.Add("andi");\n        nama.Add("budi");\n\n        Console.WriteLine(Pertama(nama));   // andi\n        Console.WriteLine(Terbesar(12, 7)); // 12\n    }\n}',
            caption: "T berganti menjadi string di pemanggilan pertama dan int di yang kedua.",
          },
        },
        {
          kind: "quiz",
          question: "Pada `Pertama(nama)` dengan `nama` bertipe `List<string>`, bagaimana compiler menentukan T?",
          options: [
            "Dari panjang nama variabelnya",
            "Dari tipe argumennya, yaitu List<string>",
            "T selalu string secara bawaan",
            "Harus ditulis eksplisit Pertama<T>",
          ],
          answer: 1,
          explanation:
            "Penyimpulan tipe bekerja dari argumen pemanggilan. Menulis Pertama<string>(nama) juga sah, tetapi compiler bisa menebaknya sendiri.",
        },
        {
          kind: "code",
          title: "Terbesar untuk dua tipe",
          prompt:
            "Lengkapi method generik `Terbesar` yang mengembalikan nilai lebih besar dari dua nilai sejenis, untuk int maupun string. Dua bagian yang hilang menyangkut parameter tipenya dan pembandingannya.",
          mode: "fill",
          template:
            'using System;\n\npublic class Program\n{\n    static ___ Terbesar<T>(T a, T b) where T : IComparable<T>\n    {\n        if (a.___(b) >= 0)\n        {\n            return a;\n        }\n        return b;\n    }\n\n    public static void Main()\n    {\n        int a = Convert.ToInt32(Console.ReadLine());\n        int b = Convert.ToInt32(Console.ReadLine());\n        Console.WriteLine(Terbesar(a, b));\n\n        string s1 = Console.ReadLine();\n        string s2 = Console.ReadLine();\n        Console.WriteLine(Terbesar(s1, s2));\n    }\n}',
          solution:
            'using System;\n\npublic class Program\n{\n    static T Terbesar<T>(T a, T b) where T : IComparable<T>\n    {\n        if (a.CompareTo(b) >= 0)\n        {\n            return a;\n        }\n        return b;\n    }\n\n    public static void Main()\n    {\n        int a = Convert.ToInt32(Console.ReadLine());\n        int b = Convert.ToInt32(Console.ReadLine());\n        Console.WriteLine(Terbesar(a, b));\n\n        string s1 = Console.ReadLine();\n        string s2 = Console.ReadLine();\n        Console.WriteLine(Terbesar(s1, s2));\n    }\n}',
          tests: [
            { stdin: "12\n7\napel\nkiwi", expectedOutput: "12\nkiwi" },
            { stdin: "100\n100\nz\nm", expectedOutput: "100\nz" },
            { stdin: "-5\n3\nb\na", expectedOutput: "3\nb", hidden: true },
          ],
          hints: [
            "Tipe kembalian method generik adalah placeholder yang sama seperti parameternya.",
            "Constraint where T : IComparable<T> menjanjikan satu method pembanding pada T.",
            "Jawabannya: T untuk tipe kembalian dan CompareTo di dalam method.",
          ],
        },
      ],
    },
    {
      slug: "konversi-toarray-tolist",
      title: "ToArray dan ToList",
      summary: "Membekukan urutan menjadi array atau menyalin daftar, dan jebakan berbagi referensi.",
      steps: [
        {
          kind: "theory",
          title: "Referensi dibagi, salinan dibela",
          body: "Penugasan biasa tidak menyalin koleksi: `var salinan = daftar;` hanya menyalin referensi, sehingga `salinan` dan `daftar` adalah satu objek yang sama, dan `Add` lewat nama mana pun terlihat oleh keduanya. Ini sering menjadi sumber bug diam: sebuah method mengubah daftar yang dikirimi padahal pemanggil mengira aman.\n\n`ToArray()` dan `ToList()` menyalin isi ke objek baru. Setelah `var salinan = daftar.ToList();`, perubahan pada `daftar` tidak lagi memengaruhi `salinan`, dan sebaliknya. Salinan berbiaya satu kali sebesar jumlah elemennya, jadi tempat yang tepat adalah di batas: membekukan input sebelum diproses, melindungi data yang disimpan, atau menyimpan snapshot hasil.\n\nBedakan wujud hasilnya. `T[]` punya panjang tetap lewat property `Length` dan tidak bisa bertambah; `List<T>` dinamis lewat property `Count`. Mengubah bolak-balik array dan list tanpa alasan hanya memboroskan penyalinan; konversi sekali di tepi, proses di tengah dengan satu wujud. Kedua method ini juga dipakai luas di LINQ untuk mewujudkan hasil query, yang dibahas pada modul lanjutan.",
          code: {
            language: "csharp",
            content: 'using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\npublic class Program\n{\n    public static void Main()\n    {\n        List<int> asli = new List<int> { 1, 2, 3 };\n\n        List<int> referensi = asli;          // satu objek, dua nama\n        List<int> salinan = asli.ToList();   // objek baru hasil salinan\n\n        asli.Add(99);\n        Console.WriteLine(referensi.Count);  // 4, ikut bertambah\n        Console.WriteLine(salinan.Count);    // 3, tetap\n\n        int[] beku = salinan.ToArray();\n        Console.WriteLine(beku.Length);      // 3\n    }\n}',
            caption: "referensi dan asli satu objek; salinan dan beku berdiri sendiri.",
          },
        },
        {
          kind: "quiz",
          question: "Setelah `var salinan = daftar;`, apa yang terjadi bila `daftar.Add(x);` dijalankan?",
          options: [
            "salinan ikut bertambah karena keduanya menunjuk satu List yang sama",
            "salinan tetap karena isinya sudah disalin",
            "Tidak lolos kompilasi",
            "salinan berubah menjadi array",
          ],
          answer: 0,
          explanation:
            "Penugasan hanya menyalin referensi. Tidak ada objek baru, jadi perubahan lewat satu nama terlihat lewat nama lainnya.",
        },
        {
          kind: "quiz",
          question: "Setelah `var salinan = daftar.ToList();`, apa yang terjadi bila `daftar.Add(x);` dijalankan?",
          options: [
            "salinan ikut bertambah",
            "salinan tetap karena ToList menyalin isi ke List baru",
            "Error saat runtime",
            "salinan menjadi kosong",
          ],
          answer: 1,
          explanation:
            "ToList menghasilkan objek List baru berisi salinan elemen. Setelah itu kedua list hidup sendiri-sendiri.",
        },
      ],
    },
    {
      slug: "latihan-modul-1-inventaris",
      title: "Latihan Gabungan: Inventaris",
      summary: "Dictionary, List kunci, dan pembanding dua kunci bertemu di satu program inventaris.",
      steps: [
        {
          kind: "theory",
          title: "Data di dictionary, urutan lewat daftar",
          body: "Penutup modul merangkai Dictionary, List, dan Comparison dalam satu program inventaris kecil: baca `n` barang dengan nama dan stoknya, simpan ke `Dictionary<string, int>`, hitung total stok, lalu cetak daftar terurut dari stok terbesar, dengan nama menaik untuk stok yang seri.\n\nStrateginya: dictionary memegang data sehingga stok dicari cepat lewat kunci; daftar nama untuk dicetak berasal dari `inventaris.Keys` yang disalin ke `List<string>`; urutan akhir dihitung `List.Sort` dengan pembanding dua kunci yang membaca stok dari dictionary. Pola ini, menyimpan data di dictionary dan menyusun urutan lewat daftar kuncinya, muncul terus di kode nyata.",
          code: {
            language: "csharp",
            content: '// inventaris[bagian[0]] = Convert.ToInt32(bagian[1]);\n// List<string> daftarNama = new List<string>(inventaris.Keys);\n// beda = inventaris[b].CompareTo(inventaris[a]); // stok menurun\n// seri: return a.CompareTo(b); // nama menaik',
            caption: "Empat potongan kunci yang akan kamu lengkapi di langkah berikutnya.",
          },
        },
        {
          kind: "code",
          title: "Laporan inventaris terurut",
          prompt:
            "Lengkapi tiga bagian yang hilang: sumber daftar nama, dan dua pembanding pada pengurutan (stok menurun, lalu nama menaik untuk stok seri). Format keluaran sudah tersedia.",
          mode: "fill",
          template:
            'using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int n = Convert.ToInt32(Console.ReadLine());\n        Dictionary<string, int> inventaris = new Dictionary<string, int>();\n\n        for (int i = 0; i < n; i++)\n        {\n            string[] bagian = Console.ReadLine().Split(\' \');\n            inventaris[bagian[0]] = Convert.ToInt32(bagian[1]);\n        }\n\n        List<string> daftarNama = new List<string>(inventaris.___);\n        int total = 0;\n        foreach (KeyValuePair<string, int> pasangan in inventaris)\n        {\n            total += pasangan.Value;\n        }\n\n        daftarNama.Sort((a, b) =>\n        {\n            int beda = inventaris[b].___(inventaris[a]);\n            if (beda != 0)\n            {\n                return beda;\n            }\n            return a.___(b);\n        });\n\n        Console.WriteLine("Total item: {0}", total);\n        foreach (string nama in daftarNama)\n        {\n            Console.WriteLine("{0}: {1}", nama, inventaris[nama]);\n        }\n    }\n}',
          solution:
            'using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int n = Convert.ToInt32(Console.ReadLine());\n        Dictionary<string, int> inventaris = new Dictionary<string, int>();\n\n        for (int i = 0; i < n; i++)\n        {\n            string[] bagian = Console.ReadLine().Split(\' \');\n            inventaris[bagian[0]] = Convert.ToInt32(bagian[1]);\n        }\n\n        List<string> daftarNama = new List<string>(inventaris.Keys);\n        int total = 0;\n        foreach (KeyValuePair<string, int> pasangan in inventaris)\n        {\n            total += pasangan.Value;\n        }\n\n        daftarNama.Sort((a, b) =>\n        {\n            int beda = inventaris[b].CompareTo(inventaris[a]);\n            if (beda != 0)\n            {\n                return beda;\n            }\n            return a.CompareTo(b);\n        });\n\n        Console.WriteLine("Total item: {0}", total);\n        foreach (string nama in daftarNama)\n        {\n            Console.WriteLine("{0}: {1}", nama, inventaris[nama]);\n        }\n    }\n}',
          tests: [
            { stdin: "3\nbuku 12\npensil 40\ntas 5", expectedOutput: "Total item: 57\npensil: 40\nbuku: 12\ntas: 5" },
            {
              stdin: "4\nkiwi 10\napel 10\nmangga 20\njeruk 10",
              expectedOutput: "Total item: 50\nmangga: 20\napel: 10\njeruk: 10\nkiwi: 10",
            },
            { stdin: "2\nzz 1\naa 1", expectedOutput: "Total item: 2\naa: 1\nzz: 1", hidden: true },
          ],
          hints: [
            "Property dictionary yang berisi seluruh kuncinya bisa langsung disalin menjadi List.",
            "Stok menurun berarti membandingkan stok b terhadap stok a, kebalikan arah menaik.",
            "Jawabannya: Keys, lalu CompareTo untuk kedua pembanding.",
          ],
        },
      ],
    },
  ],
};
