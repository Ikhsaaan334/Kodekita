import type { TrackContent } from "./types";

export const csharp: TrackContent = {
  track: {
    slug: "csharp",
    name: "C#",
    tagline: "Bahasa andal dari keluarga .NET: rapi, tegas soal tipe, dan enak diikuti pemula.",
    description:
      "Mulai dari mencetak teks dengan Console.WriteLine, mengelola variabel, membaca input, percabangan, perulangan, sampai menulis fungsi. Setiap pelajaran diakhiri dengan kode yang kamu ketik dan jalankan sendiri.",
  },
  modules: [
    {
      title: "Fondasi",
      description: "Kenalan dengan C#: mencetak teks, menyimpan data di variabel, dan membaca input.",
      lessons: [
        {
          slug: "halo-csharp",
          title: "Halo, C#",
          summary: "Cetak teks pertamamu dengan Console.WriteLine.",
          steps: [
            {
              kind: "theory",
              title: "Program pertama: mencetak teks",
              body: "Program C# selalu berbentuk class, dan eksekusi dimulai dari method `Main`. Di bagian atas ada `using System;` supaya kita bisa memakai `Console` tanpa menulis nama lengkapnya.\n\nUntuk menampilkan satu baris ke layar, panggil `Console.WriteLine`. Teks ditulis di dalam tanda kutip, dan setiap perintah ditutup titik koma.",
              code: {
                language: "csharp",
                content:
                  'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        Console.WriteLine("Halo, dunia!");\n        Console.WriteLine("Aku sedang belajar C#");\n    }\n}',
                caption: "Main adalah pintu masuk program; isi di dalamnya yang dijalankan lebih dulu.",
              },
            },
            {
              kind: "quiz",
              question: "Method apa yang menjadi titik awal eksekusi program C#?",
              options: ["Main", "Start", "Run", "awal"],
              answer: 0,
              explanation:
                "Runtime C# mencari method `static Main` untuk mulai menjalankan program. Tanpa Main, program tidak tahu harus mulai dari mana.",
            },
            {
              kind: "code",
              title: "Lengkapi program pertamamu",
              prompt:
                "Lengkapi kode di bawah supaya mencetak teks `Halo, dunia!` persis. Ganti tanda `___` dengan bagian yang tepat.",
              mode: "fill",
              template:
                'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        Console.___("Halo, dunia!");\n    }\n}',
              solution:
                'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        Console.WriteLine("Halo, dunia!");\n    }\n}',
              tests: [{ stdin: "", expectedOutput: "Halo, dunia!" }],
              hints: [
                "Kelas Console punya method yang mencetak teks lalu otomatis pindah baris.",
                "Namanya WriteLine, ditulis setelah Console dan tanda titik.",
              ],
            },
          ],
        },
        {
          slug: "variabel-tipe-data",
          title: "Variabel dan Tipe Data",
          summary: "Simpan angka dan teks ke dalam variabel, lalu gabungkan.",
          steps: [
            {
              kind: "theory",
              title: "Kotak berlabel untuk data",
              body: "C# memilih jalan yang tegas: setiap variabel dideklarasikan dengan tipenya di depan, misalnya `int` untuk bilangan bulat, `double` untuk desimal, `string` untuk teks, dan `bool` untuk benar/salah.\n\nUntuk menyambung teks dengan isi variabel saat mencetak, pakai tanda `+`. Setelah bertemu teks, `+` berarti menyambung, bukan menjumlah.",
              code: {
                language: "csharp",
                content:
                  'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        string nama = "Sinta";\n        int umur = 17;\n        Console.WriteLine(nama + " berumur " + umur + " tahun");\n    }\n}',
                caption: "Tipe ditulis di depan nama variabel; tanda + menyambung teks dan angka.",
              },
            },
            {
              kind: "quiz",
              question:
                'Apa keluaran dari kode berikut?\n\n```csharp\nint harga = 2500;\nConsole.WriteLine("Total: " + harga);\n```',
              options: ["Total: harga", "Total: 2500", "Total: {harga}", "Error kompilasi"],
              answer: 1,
              explanation:
                "Tanda + menyambung teks dengan isi variabel, jadi harga diganti nilainya, yaitu 2500.",
            },
            {
              kind: "code",
              title: "Perbaiki kartu nama yang kebalik",
              prompt:
                "Kode ini seharusnya mencetak `Sinta - 17`, tapi hasilnya kebalik. Cari kesalahannya, perbaiki, lalu jalankan.",
              mode: "fix",
              template:
                'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        string nama = "Sinta";\n        int umur = 17;\n        Console.WriteLine(umur + " - " + nama);\n    }\n}',
              solution:
                'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        string nama = "Sinta";\n        int umur = 17;\n        Console.WriteLine(nama + " - " + umur);\n    }\n}',
              tests: [{ stdin: "", expectedOutput: "Sinta - 17" }],
              hints: [
                "Jalankan dulu dan bandingkan urutan keluarannya dengan yang diminta.",
                "Baris WriteLine menyebut umur lebih dulu. Tukar posisinya: nama dulu, baru umur.",
              ],
            },
          ],
        },
        {
          slug: "input-pengguna",
          title: "Membaca Input",
          summary: "Buat program yang berinteraksi: baca input, ubah ke angka, balas pengguna.",
          steps: [
            {
              kind: "theory",
              title: "Console.ReadLine(): mendengarkan pengguna",
              body: "`Console.ReadLine()` membaca satu baris ketikan sebagai teks (`string`). Kalau kita butuh angka, ubah dulu dengan `Convert.ToInt32` (bilangan bulat) atau `Convert.ToDouble` (desimal).\n\nDi latihan platform ini, input berasal dari kotak *stdin* saat kode dijalankan, jadi kamu tidak perlu mengetik saat program berjalan.",
              code: {
                language: "csharp",
                content:
                  'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        string nama = Console.ReadLine();\n        int umur = Convert.ToInt32(Console.ReadLine());\n        Console.WriteLine("Tahun depan " + nama + " berumur " + (umur + 1) + " tahun");\n    }\n}',
                caption:
                  "Baris pertama stdin masuk ke nama, baris kedua ke umur. Perhatikan hitungannya dibungkus tanda kurung.",
              },
            },
            {
              kind: "quiz",
              question:
                'Apa keluaran dari kode berikut?\n\n```csharp\nint umur = 17;\nConsole.WriteLine("Umur: " + umur + 1);\n```',
              options: ["Umur: 18", "Umur: 171", "Umur: 17", "Error kompilasi"],
              answer: 1,
              explanation:
                'Penggabungan dievaluasi kiri ke kanan. Setelah bertemu teks, tanda + berarti menyambung, jadi angka 1 ikut ditempel: hasilnya "Umur: 171". Bungkus hitungan dengan tanda kurung: (umur + 1).',
            },
            {
              kind: "code",
              title: "Sapa pengguna dengan namanya",
              prompt:
                "Lengkapi program: baca satu baris nama dari input, lalu cetak `Halo, <nama>!`. Contoh: input `Sinta` menghasilkan keluaran `Halo, Sinta!`.",
              mode: "fill",
              template:
                'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        string nama = ___;\n        Console.WriteLine("Halo, " + nama + "!");\n    }\n}',
              solution:
                'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        string nama = Console.ReadLine();\n        Console.WriteLine("Halo, " + nama + "!");\n    }\n}',
              tests: [
                { stdin: "Sinta", expectedOutput: "Halo, Sinta!" },
                { stdin: "Bagas", expectedOutput: "Halo, Bagas!" },
              ],
              hints: [
                "Yang membaca satu baris masukan adalah method milik kelas Console.",
                "Console.ReadLine() mengembalikan satu baris teks, pas untuk diisi ke variabel nama.",
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Alur Program",
      description: "Buat program yang mengambil keputusan, mengulang pekerjaan, dan dibagi menjadi fungsi.",
      lessons: [
        {
          slug: "percabangan-if",
          title: "Percabangan if",
          summary: "Program yang bisa memilih: if, else if, dan else.",
          steps: [
            {
              kind: "theory",
              title: "Berpilih sesuai kondisi",
              body: "`if` menjalankan blok kode hanya jika kondisinya benar, `else` menampung sisanya. Kondisi ditulis di dalam kurung biasa, dan isi blok dibungkus kurung kurawal { }.\n\nOperator yang sering dipakai: `==` sama dengan, `!=` tidak sama, `>` `<` `>=` `<=`, dan `%` sisa bagi yang sering dipakai untuk cek genap/ganjil.",
              code: {
                language: "csharp",
                content:
                  'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int angka = Convert.ToInt32(Console.ReadLine());\n        if (angka % 2 == 0)\n        {\n            Console.WriteLine("genap");\n        }\n        else\n        {\n            Console.WriteLine("ganjil");\n        }\n    }\n}',
                caption: "% 2 == 0 berarti habis dibagi dua.",
              },
            },
            {
              kind: "quiz",
              question: "Apa keluaran program di atas jika input-nya `7`?",
              options: ["genap", "ganjil", "7", "Error"],
              answer: 1,
              explanation:
                "7 % 2 hasilnya 1, jadi kondisi == 0 salah, program masuk ke blok else dan mencetak ganjil.",
            },
            {
              kind: "code",
              title: "Genap atau ganjil",
              prompt:
                "Lengkapi program: baca satu bilangan bulat, cetak `genap` jika habis dibagi 2, selain itu cetak `ganjil`.",
              mode: "fill",
              template:
                'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int angka = Convert.ToInt32(Console.ReadLine());\n        if (angka % 2 ___ 0)\n        {\n            Console.WriteLine("genap");\n        }\n        ___\n        {\n            Console.WriteLine("ganjil");\n        }\n    }\n}',
              solution:
                'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int angka = Convert.ToInt32(Console.ReadLine());\n        if (angka % 2 == 0)\n        {\n            Console.WriteLine("genap");\n        }\n        else\n        {\n            Console.WriteLine("ganjil");\n        }\n    }\n}',
              tests: [
                { stdin: "4", expectedOutput: "genap" },
                { stdin: "9", expectedOutput: "ganjil" },
                { stdin: "0", expectedOutput: "genap" },
              ],
              hints: [
                "Operator pembanding 'sama dengan' ditulis dua tanda sama dengan.",
                "Blok penampung terakhir setelah if dalam pola ini ditulis else tanpa kondisi.",
              ],
            },
          ],
        },
        {
          slug: "perulangan-for",
          title: "Perulangan for",
          summary: "Ulangi pekerjaan dengan for tanpa menulis ulang kode.",
          steps: [
            {
              kind: "theory",
              title: "for: hitung tanpa capek",
              body: "`for` mengulang blok kode sebanyak yang kita minta. Di dalam kurungnya ada tiga bagian yang dipisah titik koma: nilai awal, syarat jalan, dan perubahan. Contoh `for (int i = 1; i <= 5; i++)`: mulai dari 1, jalan selama i kurang dari sama dengan 5, dan `i++` menaikkan nilai satu per satu.\n\nSedikit beda dengan WriteLine, `Console.Write` mencetak tanpa pindah baris, pas untuk menyusun hitungan dalam satu baris.",
              code: {
                language: "csharp",
                content:
                  'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        for (int i = 1; i <= 5; i++)\n        {\n            Console.Write(i + " ");\n        }\n    }\n}',
                caption: "Perulangan berhenti saat syarat i <= 5 tidak terpenuhi lagi.",
              },
            },
            {
              kind: "quiz",
              question: "Berapa kali blok dalam `for (int i = 0; i < 3; i++)` dijalankan?",
              options: ["2 kali", "3 kali", "4 kali", "Terkadang error"],
              answer: 1,
              explanation:
                "i bernilai 0, 1, 2. Saat i mencapai 3, syarat i < 3 sudah salah, jadi tiga kali dijalankan.",
            },
            {
              kind: "code",
              title: "Perbaiki hitungan yang melompat",
              prompt:
                "Program ini seharusnya mencetak `1 2 3 4 5` dalam satu baris. Hasilnya sekarang kurang satu angka. Perbaiki sampai tesnya lulus.",
              mode: "fix",
              template:
                'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        for (int i = 1; i <= 4; i++)\n        {\n            Console.Write(i + " ");\n        }\n    }\n}',
              solution:
                'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        for (int i = 1; i <= 5; i++)\n        {\n            Console.Write(i + " ");\n        }\n    }\n}',
              tests: [{ stdin: "", expectedOutput: "1 2 3 4 5" }],
              hints: [
                "Jalankan dulu dan lihat hasilnya: angka terakhir hilang.",
                "Syarat i <= 4 berhenti di 4. Naikkan batasnya supaya 5 ikut tercetak.",
              ],
            },
          ],
        },
        {
          slug: "fungsi",
          title: "Fungsi",
          summary: "Bungkus logika jadi blok yang bisa dipakai ulang dengan method.",
          steps: [
            {
              kind: "theory",
              title: "Method: mendefinisikan sendiri perintah",
              body: "Di C#, fungsi disebut method dan hidup di dalam class. Bentuknya: tipe hasil, nama method, lalu parameter dengan tipenya. Di dalamnya, `return` mengirim hasil kembali ke pemanggil.\n\nPisahkan urusan mencetak dari urusan menghitung: method yang baik menghitung dan mengembalikan nilai, Main yang memutuskan mau diapakan.",
              code: {
                language: "csharp",
                content:
                  'using System;\n\npublic class Program\n{\n    static int LuasPersegiPanjang(int panjang, int lebar)\n    {\n        return panjang * lebar;\n    }\n\n    public static void Main()\n    {\n        int p = Convert.ToInt32(Console.ReadLine());\n        int l = Convert.ToInt32(Console.ReadLine());\n        Console.WriteLine(LuasPersegiPanjang(p, l));\n    }\n}',
                caption: "Method menghitung, Main yang mencetak.",
              },
            },
            {
              kind: "quiz",
              question: "Kata kunci apa yang mengirim hasil keluar dari sebuah method?",
              options: ["echo", "return", "send", "show"],
              answer: 1,
              explanation:
                "`return` mengembalikan nilai ke pemanggil. `Console.WriteLine` hanya menampilkan, tidak mengirim nilai balik.",
            },
            {
              kind: "code",
              title: "Bangun fungsi sapaan",
              prompt:
                "Lengkapi method `Sapa` agar menerima satu parameter bertipe `string` bernama nama dan MENGEMBALIKAN teks `Halo, <nama>!`. Baris cetak di Main sudah tersedia, jangan diubah.",
              mode: "fill",
              template:
                'using System;\n\npublic class Program\n{\n    static string Sapa(___)\n    {\n        ___ "Halo, " + nama + "!";\n    }\n\n    public static void Main()\n    {\n        Console.WriteLine(Sapa(Console.ReadLine()));\n    }\n}',
              solution:
                'using System;\n\npublic class Program\n{\n    static string Sapa(string nama)\n    {\n        return "Halo, " + nama + "!";\n    }\n\n    public static void Main()\n    {\n        Console.WriteLine(Sapa(Console.ReadLine()));\n    }\n}',
              tests: [
                { stdin: "Dina", expectedOutput: "Halo, Dina!" },
                { stdin: "Rizky", expectedOutput: "Halo, Rizky!" },
              ],
              hints: [
                "Parameter ditulis seperti deklarasi variabel: tipe dulu, baru nama.",
                "Method dengan tipe hasil string wajib memakai kata return di dalamnya.",
              ],
            },
          ],
        },
      ],
    },
  ],
  challenges: [
    {
      slug: "jumlah-dua-angka",
      title: "Jumlah Dua Angka",
      difficulty: "mudah",
      statement:
        "Baca dua bilangan bulat dari input (satu per baris), lalu cetak jumlahnya.\n\n**Format input**\nBaris 1: bilangan pertama\nBaris 2: bilangan kedua\n\n**Format output**\nSatu baris: hasil penjumlahan\n\n**Contoh**\nInput: `3` dan `4` menjadi `7`",
      starterCode:
        'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int a = Convert.ToInt32(Console.ReadLine());\n        // baca baris kedua, lalu cetak jumlahnya\n        int b = ___;\n        Console.WriteLine(a + b);\n    }\n}\n',
      tests: [
        { stdin: "3\n4", expectedOutput: "7" },
        { stdin: "-10\n25", expectedOutput: "15" },
        { stdin: "0\n0", expectedOutput: "0" },
      ],
      hints: [
        "Console.ReadLine() mengembalikan teks; ubah ke bilangan bulat dengan Convert.ToInt32 sebelum dijumlah.",
        "Baris kedua polanya sama seperti baris pertama: int b = Convert.ToInt32(Console.ReadLine());",
      ],
      xpReward: 100,
    },
    {
      slug: "kata-terbalik",
      title: "Kata Terbalik",
      difficulty: "mudah",
      statement:
        "Baca satu baris teks, cetak teks yang sama dengan urutan karakter terbalik.\n\n**Format input**: satu baris teks tanpa spasi\n**Format output**: teks terbalik\n\n**Contoh**: input `kode` menjadi `edok`",
      starterCode:
        'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        string teks = Console.ReadLine();\n        // cetak teks terbalik\n    }\n}\n',
      tests: [
        { stdin: "kode", expectedOutput: "edok" },
        { stdin: "abc", expectedOutput: "cba" },
        { stdin: "aaaa", expectedOutput: "aaaa" },
      ],
      hints: [
        "Ubah teks jadi deret karakter dengan teks.ToCharArray(), simpan di variabel bertipe char[].",
        "Array.Reverse(arr) membalik isi array langsung di tempat, lalu ubah kembali jadi teks dengan new string(arr).",
        "Rangkaiannya: char[] arr = teks.ToCharArray(); Array.Reverse(arr); Console.WriteLine(new string(arr));",
      ],
      xpReward: 100,
    },
    {
      slug: "hitung-vokal",
      title: "Hitung Vokal",
      difficulty: "sedang",
      statement:
        "Baca satu baris teks kecil (huruf kecil semua), hitung berapa banyak huruf vokal (a, i, u, e, o) di dalamnya, lalu cetak jumlahnya.\n\n**Contoh**: input `belajar kode` menjadi `5` (e, a, a, o, e)",
      starterCode:
        'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        string teks = Console.ReadLine();\n        int jumlah = 0;\n        // hitung vokalnya\n    }\n}\n',
      tests: [
        { stdin: "belajar kode", expectedOutput: "5" },
        { stdin: "xyz", expectedOutput: "0" },
        { stdin: "aaaaa", expectedOutput: "5" },
      ],
      hints: [
        "Ulangi dari 0 sampai teks.Length - 1, lalu ambil satu karakter dengan teks[i].",
        "Karakter dibandingkan dengan tanda kutip tunggal, misalnya c == 'a'. Gabungkan cek kelima vokal dengan ||, lalu jumlah++.",
        "Jangan lupa mencetak hasilnya: Console.WriteLine(jumlah);",
      ],
      xpReward: 150,
    },
    {
      slug: "statistik-mini",
      title: "Statistik Mini",
      difficulty: "sulit",
      statement:
        "Baca satu bilangan `n`, lalu baca `n` bilangan bulat (satu per baris). Cetak tiga baris:\n\n```\nmin: <nilai terkecil>\nmax: <nilai terbesar>\nrata: <rata-rata, dua angka desimal>\n```\n\n**Contoh**\nInput: `3`, `4`, `10`, `7` menjadi:\n```\nmin: 4\nmax: 10\nrata: 7.00\n```",
      starterCode:
        'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int n = Convert.ToInt32(Console.ReadLine());\n        int[] angka = new int[n];\n        for (int i = 0; i < n; i++)\n        {\n            angka[i] = Convert.ToInt32(Console.ReadLine());\n        }\n        // cetak min, max, rata dua desimal\n    }\n}\n',
      tests: [
        { stdin: "3\n4\n10\n7", expectedOutput: "min: 4\nmax: 10\nrata: 7.00" },
        { stdin: "1\n5", expectedOutput: "min: 5\nmax: 5\nrata: 5.00" },
        { stdin: "4\n2\n8\n-3\n9", expectedOutput: "min: -3\nmax: 9\nrata: 4.00" },
      ],
      hints: [
        "Awali min dan max dengan angka pertama (angka[0]), lalu bandingkan satu per satu di dalam for.",
        "Jumlahkan total di loop yang sama: total += angka[i]. Rata-rata: (double)total / n supaya desimalnya tidak dibuang.",
        'Format dua desimal dengan pemisah titik: rata.ToString("0.00", CultureInfo.InvariantCulture), dan tambahkan using System.Globalization; di bagian atas.',
      ],
      xpReward: 250,
    },
  ],
  projects: [
    {
      slug: "tagihan-listrik",
      title: "Tagihan Listrik Rumah",
      summary: "Program PLN mini: pilih tarif per golongan, kalikan pemakaian, lalu tambahkan abodemen.",
      brief:
        "Kamu diminta membuat program penghitung tagihan listrik. Program membaca golongan pelanggan dan jumlah pemakaian dalam kWh, lalu menghitung total tagihan.\n\nAturan: setiap golongan punya tarif per kWh dan biaya abodemen tetap.\n\n- Golongan 1: tarif 1000 per kWh, abodemen 15000\n- Golongan 2: tarif 1300 per kWh, abodemen 25000\n- Golongan 3: tarif 1500 per kWh, abodemen 40000\n\nTotal tagihan = tarif kali pemakaian, ditambah abodemen.\n\n**Format input**\nBaris 1: golongan (int, 1 sampai 3)\nBaris 2: pemakaian dalam kWh (int)\n\n**Format output**\nSatu baris: total tagihan (int)",
      steps: [
        {
          title: "Baca input dan siapkan variabel",
          detail:
            "Baca golongan dan pemakaian dengan Convert.ToInt32(Console.ReadLine()), lalu siapkan variabel tarif dan abodemen.",
          hint: "int golongan = Convert.ToInt32(Console.ReadLine()); dan int kwh = Convert.ToInt32(Console.ReadLine());",
        },
        {
          title: "Tentukan tarif dan abodemen",
          detail:
            "Pakai if, else if, dan else untuk memilih nilai tarif dan abodemen sesuai golongan. Jangan sampai golongan 2 terlewat.",
          hint: "if (golongan == 1) { tarif = 1000; abodemen = 15000; } else if (golongan == 2) { tarif = 1300; abodemen = 25000; } else { tarif = 1500; abodemen = 40000; }",
        },
        {
          title: "Hitung total tagihan",
          detail: "Kalikan tarif dengan pemakaian, lalu tambahkan abodemen. Simpan di variabel total.",
          hint: "int total = tarif * kwh + abodemen;",
        },
        {
          title: "Cetak dan uji dengan kasus nyata",
          detail:
            "Cetak total. Uji dengan contoh: golongan 1, pemakaian 100 kWh. Hasil yang benar: 115000. Lalu kumpulkan lewat tombol Kumpulkan di bawah.",
          hint: "Console.WriteLine(total); sudah cukup.",
        },
      ],
      finalTests: [
        { stdin: "1\n100", expectedOutput: "115000" },
        { stdin: "2\n50", expectedOutput: "90000" },
        { stdin: "3\n25", expectedOutput: "77500" },
      ],
      xpReward: 300,
    },
  ],
};
