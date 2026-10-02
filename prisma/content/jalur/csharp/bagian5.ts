import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "csharp",
  moduleRange: [8, 9],
  modules: [
    {
      title: "Kode Rapi dan Teruji",
      description: "Naming, unit test konsep dengan assert, debugging, dan refactoring.",
    },
    {
      title: "Menuju Proyek Lapangan",
      description: "Program CLI multi-file, parsing argumen, konfigurasi, logging, dan mini proyek akhir.",
    },
  ],
  lessons: [
    // ==================== MODUL 8: Kode Rapi dan Teruji ====================
    {
      slug: "rap-naming-dan-clean-code",
      title: "Konvensi Penamaan dan Clean Code",
      summary: "Nama yang menyatakan maksud, konvensi .NET, dan kebiasaan clean code yang praktis.",
      steps: [
        {
          kind: "theory",
          title: "Nama yang menyatakan maksud",
          body: "Kode dibaca jauh lebih sering daripada ditulis: oleh rekan satu tim, oleh kamu sendiri enam bulan lagi, oleh pewawancara yang menilai tugas teknis. Nama yang baik membuat pembaca paham maksud tanpa membuka isi method: `sisaStok`, `HitungOngkir`, `ApakahNomorValid`. Nama buruk seperti `x`, `data2`, atau `proses()` memaksa orang membaca seluruh isi method hanya untuk menebak artinya.\n\nKonvensi .NET yang dipakai hampir semua tim C#: `PascalCase` untuk nama class, method, property, dan konstanta (`HitungTotal`, `NamaLengkap`, `NilaiMaksimal`); `camelCase` untuk variabel lokal dan parameter (`totalBelanja`, `namaFile`); field privat lazim diberi awalan garis bawah (`_stokAwal`). Hindari awalan tipe semacam `strNama` atau `intUmur`: compiler sudah melihat tipenya, awalan seperti itu hanya menambah kebisingan.\n\nClean code versi ringkas: satu method mengerjakan satu hal dan namanya kata kerja; magic number diganti konstanta bernama sehingga `100000` menjadi `AmbangGratisKirim`; bersarang yang dalam dipangkas dengan early return supaya alur utama tidak terkubur empat tingkat di dalam. Semua ini bukan kosmetik: nama dan struktur yang jelas menurunkan jumlah bug yang lolos lewat review.",
          code: {
            language: "csharp",
            content:
              "const int HargaPerUnit = 12000;\nconst int AmbangGratisKirim = 100000;\n\nint subtotal = jumlahBarang * HargaPerUnit;\nbool gratisKirim = subtotal >= AmbangGratisKirim;",
            caption: "Konstanta bernama menghapus tebakan; pembaca langsung tahu makna 100000.",
          },
        },
        {
          kind: "quiz",
          question: "Deklarasi method publik mana yang mengikuti konvensi .NET?",
          options: ["public void hitung_total()", "public void HitungTotal()", "public void HITUNG_TOTAL()", "public void hitungTotal()"],
          answer: 1,
          explanation:
            "Method dan class publik memakai PascalCase: HitungTotal. Bentuk camelCase dipakai untuk variabel lokal dan parameter, sedangkan garis bawah dan huruf kapital semua bukan konvensi .NET.",
        },
      ],
    },
    {
      slug: "rap-test-manual-assert",
      title: "Menulis Test Manual ala Assert",
      summary: "Konsep unit test, assert, dan alat cek LULUS/GAGAL yang kamu bangun sendiri.",
      steps: [
        {
          kind: "theory",
          title: "Unit test sebagai jaring pengaman",
          body: "Unit test menguji satu unit kecil, biasanya satu method, secara terisolasi dari input pengguna dan berkas. Nilai praktisnya besar: kau boleh membenahi kode sebebas apa pun dan dalam hitungan detik tahu apakah perilakunya berubah. Di dunia kerja C# yang menangani ini antara lain xUnit, NUnit, dan MSTest; mesinnya sama semua: bandingkan hasil aktual dengan ekspektasi, lalu laporkan bila tidak cocok.\n\nInti sebuah test adalah assert: satu pernyataan yang gagal bila asumsinya salah. Bentuk manualnya cukup satu method: `Cek(nama, aktual, ekspektasi)` yang mencetak `LULUS` saat kedua nilai sama dan `GAGAL` lengkap dengan kedua nilai saat beda. Pola penulisan yang lazim: susun datanya, panggil yang diuji, bandingkan hasilnya.\n\nTest yang baik itu deterministik: hasilnya tidak bergantung pada waktu, urutan eksekusi, atau keberuntungan, dan satu test hanya menguji satu perilaku sehingga namanya bisa menyebut perilaku itu. Di pelatihan ini kita membangun runner manualnya supaya mekanik di balik kerangka test terlihat tanpa tutupan.",
          code: {
            language: "csharp",
            content:
              "static void Cek(string nama, int aktual, int ekspektasi)\n{\n    if (aktual == ekspektasi)\n    {\n        Console.WriteLine(nama + \": LULUS\");\n    }\n    else\n    {\n        Console.WriteLine(nama + \": GAGAL (dapat \" + aktual + \", seharusnya \" + ekspektasi + \")\");\n    }\n}",
            caption: "Seluruh kerangka test versi mini: satu perbandingan dan dua pesan.",
          },
        },
        {
          kind: "code",
          title: "Bangun alat cek mini",
          prompt:
            "Program membaca dua baris dari stdin: total transaksi dan diskon yang diharapkan (dalam persen). Lengkapi alat cek `Cek` dan pemanggilannya: ganti setiap `___` supaya tes mencetak `LULUS` saat cocok dan `GAGAL` lengkap dengan nilai aktual saat tidak cocok.",
          mode: "fill",
          template:
            "using System;\n\npublic class Program\n{\n    static int DiskonPersen(int total)\n    {\n        if (total >= 100000) return 10;\n        if (total >= 50000) return 5;\n        return 0;\n    }\n\n    // Alat cek mini: bandingkan hasil aktual dengan ekspektasi.\n    static void Cek(string nama, int aktual, int ekspektasi)\n    {\n        if (aktual ___ ekspektasi)\n        {\n            Console.WriteLine(nama + \": LULUS\");\n        }\n        else\n        {\n            Console.WriteLine(nama + \": GAGAL (dapat \" + ___ + \", seharusnya \" + ekspektasi + \")\");\n        }\n    }\n\n    public static void Main()\n    {\n        int total = Convert.ToInt32(Console.ReadLine());\n        int ekspektasi = Convert.ToInt32(Console.ReadLine());\n\n        Cek(\"diskon total \" + total, DiskonPersen(total), ___);\n    }\n}",
          solution:
            "using System;\n\npublic class Program\n{\n    static int DiskonPersen(int total)\n    {\n        if (total >= 100000) return 10;\n        if (total >= 50000) return 5;\n        return 0;\n    }\n\n    // Alat cek mini: bandingkan hasil aktual dengan ekspektasi.\n    static void Cek(string nama, int aktual, int ekspektasi)\n    {\n        if (aktual == ekspektasi)\n        {\n            Console.WriteLine(nama + \": LULUS\");\n        }\n        else\n        {\n            Console.WriteLine(nama + \": GAGAL (dapat \" + aktual + \", seharusnya \" + ekspektasi + \")\");\n        }\n    }\n\n    public static void Main()\n    {\n        int total = Convert.ToInt32(Console.ReadLine());\n        int ekspektasi = Convert.ToInt32(Console.ReadLine());\n\n        Cek(\"diskon total \" + total, DiskonPersen(total), ekspektasi);\n    }\n}",
          tests: [
            { stdin: "120000\n10", expectedOutput: "diskon total 120000: LULUS" },
            { stdin: "60000\n10", expectedOutput: "diskon total 60000: GAGAL (dapat 5, seharusnya 10)" },
            { stdin: "20000\n0", expectedOutput: "diskon total 20000: LULUS", hidden: true },
          ],
          hints: [
            "Tiga tanda ___ mewakili tiga hal: cara membandingkan dua nilai, nilai yang benar-benar keluar dari fungsi, dan nilai yang kita harapkan.",
            "Perbandingan kesamaan memakai dua tanda sama dengan: ==.",
            "Nilai aktual berasal dari parameter kedua Cek, sedangkan parameter ketiga menerima ekspektasi yang dibaca dari input.",
          ],
        },
      ],
    },
    {
      slug: "rap-happy-edge-case",
      title: "Happy Path dan Edge Case",
      summary: "Test kasus normal dan kasus batas: nol, penuh, dan melebihi kapasitas.",
      steps: [
        {
          kind: "theory",
          title: "Bug paling sering bersembunyi di tepi",
          body: "Happy path adalah alur normal: input valid dan urutan kejadian sesuai harapan. Test yang hanya menutup happy path adalah jaring yang bolong, karena bug paling sering bersembunyi di tepi: nilai nol, nilai negatif, satu elemen, kapasitas penuh, atau satu tingkat di atas batas. Perbandingan `>=` yang tertukar dengan `>` hampir tidak pernah ketahuan dari happy path.\n\nCara praktisnya: untuk setiap `if` dan perulangan pada kode, tanyakan apa yang terjadi tepat di batas kondisinya, lalu buat satu test untuk tiap sisi batas. Untuk angka, siapkan minimal tiga kasus: satu di bawah batas, satu tepat di batas, dan satu di atasnya.\n\nContoh berikut menghitung sisa kuota. Tiga perilaku harus benar: pemakaian normal, pemakaian pas penuh, dan pemakaian melebihi kapasitas yang tidak boleh menghasilkan angka negatif. Versi naif akan menampilkan sisa -50 untuk pemakaian 150 dari kapasitas 100; versi yang menjaga batas mengembalikan 0.",
          code: {
            language: "csharp",
            content:
              "Cek(\"normal\", SisaKuota(100, 30), 70);\nCek(\"pas penuh\", SisaKuota(100, 100), 0);\nCek(\"melebihi kapasitas\", SisaKuota(100, 150), 0);",
            caption: "Tiga kasus untuk satu fungsi: bawah batas, tepat batas, di atas batas.",
          },
        },
        {
          kind: "code",
          title: "Jaga batas kuota",
          prompt:
            "Fungsi `SisaKuota` tidak boleh pernah mengembalikan angka negatif: pemakaian melebihi kapasitas tetap menghasilkan 0. Lengkapi pemeriksaan batasnya, lalu jalankan ketiga kasus uji.",
          mode: "fill",
          template:
            "using System;\n\npublic class Program\n{\n    static int SisaKuota(int kapasitas, int terpakai)\n    {\n        int sisa = kapasitas - terpakai;\n\n        if (sisa ___ 0)\n        {\n            return ___;\n        }\n\n        return sisa;\n    }\n\n    public static void Main()\n    {\n        int kapasitas = Convert.ToInt32(Console.ReadLine());\n        int terpakai = Convert.ToInt32(Console.ReadLine());\n\n        Console.WriteLine(\"Sisa kuota: \" + SisaKuota(kapasitas, terpakai));\n    }\n}",
          solution:
            "using System;\n\npublic class Program\n{\n    static int SisaKuota(int kapasitas, int terpakai)\n    {\n        int sisa = kapasitas - terpakai;\n\n        if (sisa < 0)\n        {\n            return 0;\n        }\n\n        return sisa;\n    }\n\n    public static void Main()\n    {\n        int kapasitas = Convert.ToInt32(Console.ReadLine());\n        int terpakai = Convert.ToInt32(Console.ReadLine());\n\n        Console.WriteLine(\"Sisa kuota: \" + SisaKuota(kapasitas, terpakai));\n    }\n}",
          tests: [
            { stdin: "100\n30", expectedOutput: "Sisa kuota: 70" },
            { stdin: "100\n100", expectedOutput: "Sisa kuota: 0" },
            { stdin: "100\n150", expectedOutput: "Sisa kuota: 0", hidden: true },
          ],
          hints: [
            "Kasus berbahaya muncul saat pemakaian melebihi kapasitas sehingga selisihnya negatif.",
            "Selisih negatif dikembalikan sebagai 0: perbandingannya kurang dari, dan nilai kembaliannya nol.",
          ],
        },
      ],
    },
    {
      slug: "rap-extract-method",
      title: "Refactoring: Extract Method",
      summary: "Mengubah struktur tanpa mengubah perilaku, dengan test sebagai penjaga.",
      steps: [
        {
          kind: "theory",
          title: "Ubah bentuk, jaga perilaku",
          body: "Refactoring adalah mengubah struktur kode tanpa mengubah perilaku: output tetap sama untuk input yang sama. Penjaga kesetiaan perilaku itu bukan mata, melainkan test; karena itu refactor selalu dimulai dengan test yang hijau dan diakhiri dengan test yang hijau.\n\nTeknik yang paling sering dipakai adalah extract method: tarik blok yang berdiri sendiri menjadi method bernama, lalu ganti blok asalnya dengan satu pemanggilan. Tanda blok layak ditarik: butuh komentar agar bisa dijelaskan, dipakai di lebih dari satu tempat, atau `Main` yang makin panjang dan berlapis. Nama methodnya menyatakan niat, bukan posisi: `HitungDiskon`, bukan `ProsesBagianSatu`.\n\nCaranya bertahap: tarik satu blok, jalankan test, baru lanjut ke blok berikutnya. Satu langkah kecil per kali ubah memudahkan mencari penyebab bila ada yang rusak, dan commit yang kecil membuat perubahan mudah ditinjau ulang.",
          code: {
            language: "csharp",
            content:
              "// Sebelum: logika menumpuk di Main, komentar jadi pengganti nama.\nint subtotal = harga * jumlah;\nint diskon = subtotal * persenDiskon / 100; // aturan diskon\n\n// Sesudah: niat terbaca dari pemanggilannya.\nint subtotal = HitungSubtotal(harga, jumlah);\nint diskon = HitungDiskon(subtotal, persenDiskon);",
            caption: "Komentar yang menjelaskan satu blok adalah tanda blok itu ingin menjadi method.",
          },
        },
        {
          kind: "code",
          title: "Rapikan struk dengan extract method",
          prompt:
            "Seorang programer menarik logika subtotal dan diskon dari `Main` ke dua method terpisah, tetapi restrukturisasinya belum selesai. Lengkapi setiap `___` supaya keluaran persis sama dengan versi semula: tiga baris Subtotal, Diskon, dan Total.",
          mode: "fill",
          template:
            "using System;\n\npublic class Program\n{\n    static int HitungSubtotal(int harga, int jumlah)\n    {\n        return ___ * ___;\n    }\n\n    static int HitungDiskon(int subtotal, int persen)\n    {\n        return subtotal ___ persen / 100;\n    }\n\n    public static void Main()\n    {\n        int harga = Convert.ToInt32(Console.ReadLine());\n        int jumlah = Convert.ToInt32(Console.ReadLine());\n        int persenDiskon = Convert.ToInt32(Console.ReadLine());\n\n        int subtotal = HitungSubtotal(harga, jumlah);\n        int diskon = ___(subtotal, persenDiskon);\n        int total = subtotal - diskon;\n\n        Console.WriteLine(\"Subtotal: \" + subtotal);\n        Console.WriteLine(\"Diskon: \" + diskon);\n        Console.WriteLine(\"Total: \" + total);\n    }\n}",
          solution:
            "using System;\n\npublic class Program\n{\n    static int HitungSubtotal(int harga, int jumlah)\n    {\n        return harga * jumlah;\n    }\n\n    static int HitungDiskon(int subtotal, int persen)\n    {\n        return subtotal * persen / 100;\n    }\n\n    public static void Main()\n    {\n        int harga = Convert.ToInt32(Console.ReadLine());\n        int jumlah = Convert.ToInt32(Console.ReadLine());\n        int persenDiskon = Convert.ToInt32(Console.ReadLine());\n\n        int subtotal = HitungSubtotal(harga, jumlah);\n        int diskon = HitungDiskon(subtotal, persenDiskon);\n        int total = subtotal - diskon;\n\n        Console.WriteLine(\"Subtotal: \" + subtotal);\n        Console.WriteLine(\"Diskon: \" + diskon);\n        Console.WriteLine(\"Total: \" + total);\n    }\n}",
          tests: [
            { stdin: "25000\n3\n20", expectedOutput: "Subtotal: 75000\nDiskon: 15000\nTotal: 60000" },
            { stdin: "10000\n2\n0", expectedOutput: "Subtotal: 20000\nDiskon: 0\nTotal: 20000" },
            { stdin: "19999\n1\n50", expectedOutput: "Subtotal: 19999\nDiskon: 9999\nTotal: 10000", hidden: true },
          ],
          hints: [
            "Subtotal adalah harga kali jumlah; diskon adalah subtotal kali persen lalu dibagi 100.",
            "Perkalian ditulis dengan tanda bintang *, dan pemanggilan diskon memakai nama method kedua.",
          ],
        },
      ],
    },
    {
      slug: "rap-hapus-duplikasi",
      title: "Refactoring: Menghapus Duplikasi",
      summary: "Satu pengetahuan satu tempat: bahaya rumus yang disalin-tempel.",
      steps: [
        {
          kind: "theory",
          title: "Duplikasi adalah utang",
          body: "Prinsip DRY (dont repeat yourself) menyebut satu pengetahuan sebaiknya hanya punya satu representasi di kode. Aturan bisnis yang disalin-tempel ke tiga tempat berarti perubahan aturan harus diburu di tiga tempat, dan satu salinan yang terlewat menghasilkan bug yang tampak hampir sama dengan kode yang benar: jenis bug paling licik untuk ditangkap mata saat review.\n\nObat standarnya: tarik salinan yang sama menjadi satu method, dan jadikan bagian yang berbeda sebagai parameter. Hasilnya dua pemanggil, satu rumus. Duplikasi insidental dua baris yang kebetulan mirip tetap boleh; yang berbahaya adalah pengetahuan domain (aturan diskon, rumus poin, batas umur) yang hidup di lebih dari satu tempat.\n\nLatihan berikut memperlihatkan akibat nyatanya: dua baris rumus poin untuk dua pemain, dan salah satu salinannya salah angka. Perbaiki bugnya sampai lulus, lalu coba bayangkan versi bersihnya: satu method `HitungPoin(level, bonus)` dan dua pemanggil. Dengan bentuk itu, jenis bug ini mustahil terjadi.",
          code: {
            language: "csharp",
            content:
              "int poinAni = levelAni * 10 + bonusAni;\nint poinBudi = levelBudi * 10 + bonusBudi;\n\n// Aturan yang sama hidup dua kali: satu perubahan harus diingat dua kali.",
            caption: "Duplikasi kecil hari ini bisa jadi pemburuan bug minggu depan.",
          },
        },
        {
          kind: "code",
          title: "Dua pemain, satu rumus, satu bug",
          prompt:
            "Poin kedua pemain dihitung dengan aturan yang sama: level dikali 10 lalu ditambah bonus. Program ini punya satu bug yang lahir dari rumus yang diduplikasi. Cari dan perbaiki sampai kedua pemain dipoin dengan aturan yang sama.",
          mode: "fix",
          template:
            "using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int level1 = Convert.ToInt32(Console.ReadLine());\n        int bonus1 = Convert.ToInt32(Console.ReadLine());\n        int level2 = Convert.ToInt32(Console.ReadLine());\n        int bonus2 = Convert.ToInt32(Console.ReadLine());\n\n        int poin1 = level1 * 10 + bonus1;\n        int poin2 = level2 * 100 + bonus2;\n\n        Console.WriteLine(\"Pemain 1: \" + poin1);\n        Console.WriteLine(\"Pemain 2: \" + poin2);\n    }\n}",
          solution:
            "using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int level1 = Convert.ToInt32(Console.ReadLine());\n        int bonus1 = Convert.ToInt32(Console.ReadLine());\n        int level2 = Convert.ToInt32(Console.ReadLine());\n        int bonus2 = Convert.ToInt32(Console.ReadLine());\n\n        int poin1 = level1 * 10 + bonus1;\n        int poin2 = level2 * 10 + bonus2;\n\n        Console.WriteLine(\"Pemain 1: \" + poin1);\n        Console.WriteLine(\"Pemain 2: \" + poin2);\n    }\n}",
          tests: [
            { stdin: "3\n5\n2\n7", expectedOutput: "Pemain 1: 35\nPemain 2: 27" },
            { stdin: "10\n0\n1\n1", expectedOutput: "Pemain 1: 100\nPemain 2: 11" },
            { stdin: "5\n10\n7\n3", expectedOutput: "Pemain 1: 60\nPemain 2: 73", hidden: true },
          ],
          hints: [
            "Dua baris rumus seharusnya identik; bandingkan keduanya angka demi angka.",
            "Pengali level pemain 2 tertulis 100, padahal aturannya level kali 10.",
          ],
        },
      ],
    },
    {
      slug: "rap-debugging-disiplin",
      title: "Debugging Secara Disiplin",
      summary: "Reproduksi, output diagnosa, hipotesis tunggal, dan uji satu perubahan.",
      steps: [
        {
          kind: "theory",
          title: "Dari menebak menjadi eksperimen",
          body: "Debugging yang disiplin bukan menebak acak, melainkan siklus eksperimen: reproduksi masalah secara pasti (input sama, kegagalan sama), perkecil kasus sampai seminimal mungkin, ajukan satu hipotesis penyebab, ubah satu hal saja, lalu uji. Siklus ini terdengar kaku, tetapi jauh lebih cepat dari mengubah lima hal sekaligus lalu kehilangan jejak.\n\nAlat paling murah adalah output diagnosa: cetak nilai variabel kunci di dekat titik curiga dengan penanda yang mudah dicari, misalnya `[diagnosa] n = 4, jumlah = 30`. Baris seperti ini bukan untuk pengguna, jadi setelah masalah ketemu, hapus. Saat program melempar exception, baca pesannya dari atas: baris pertama menyebut jenis dan penyebabnya, baris berikutnya menunjuk lokasi persis di kode.\n\nDisiplin yang paling sering dilanggar: satu perubahan per percobaan. Tiga hal diubah sekaligus lalu program jalan berarti kau tidak tahu penyembuhnya yang mana, dan dua sisanya bisa menyimpan bug baru yang meledak di lain hari.",
          code: {
            language: "csharp",
            content:
              "Console.WriteLine(\"[diagnosa] n = \" + n + \", jumlah = \" + jumlah);\nint rata = jumlah / n;",
            caption: "Cetak nilai sebelum baris yang dicurigai, hapus setelah tuntas.",
          },
        },
        {
          kind: "quiz",
          question:
            "Kamu mengubah tiga hal sekaligus, lalu test yang tadinya gagal jadi lulus. Langkah yang paling disiplin?",
          options: [
            "Langsung lanjut mengubah hal keempat",
            "Kembalikan ketiganya, lalu terapkan satu per satu sambil menguji",
            "Hapus test yang tadi gagal karena sekarang sudah lulus",
            "Ulangi proyek dari awal supaya pasti bersih",
          ],
          answer: 1,
          explanation:
            "Satu hipotesis, satu eksperimen: dengan mengubah satu hal per percobaan, penyebab perbaikan pasti ketemu dan perubahan sisanya tidak menyimpan bug tersembunyi.",
        },
        {
          kind: "code",
          title: "Temukan bug rata-rata",
          prompt:
            "Program membaca banyak nilai lalu mencetak rata-ratanya yang dibulatkan ke bawah, tetapi hasilnya salah dan bahkan bisa mati saat inputnya pendek. Pakai disiplin diagnosa: uji dengan kasus terkecil lebih dulu, lalu temukan dan perbaiki satu bugnya.",
          mode: "fix",
          template:
            "using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int n = Convert.ToInt32(Console.ReadLine());\n        int jumlah = 0;\n\n        for (int i = 0; i < n; i++)\n        {\n            jumlah += Convert.ToInt32(Console.ReadLine());\n        }\n\n        int rata = jumlah / (n - 1);\n        Console.WriteLine(\"Rata-rata: \" + rata);\n    }\n}",
          solution:
            "using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int n = Convert.ToInt32(Console.ReadLine());\n        int jumlah = 0;\n\n        for (int i = 0; i < n; i++)\n        {\n            jumlah += Convert.ToInt32(Console.ReadLine());\n        }\n\n        int rata = jumlah / n;\n        Console.WriteLine(\"Rata-rata: \" + rata);\n    }\n}",
          tests: [
            { stdin: "4\n4\n10\n7\n9", expectedOutput: "Rata-rata: 7" },
            { stdin: "1\n5", expectedOutput: "Rata-rata: 5" },
            { stdin: "3\n2\n2\n3", expectedOutput: "Rata-rata: 2", hidden: true },
          ],
          hints: [
            "Coba kasus terkecil lebih dulu: satu nilai. Saat program mati di situ, perhatikan pembaginya.",
            "Pembagi harus banyaknya nilai, yaitu n; kode memakai n - 1 sehingga kasus satu nilai membagi dengan nol.",
          ],
        },
      ],
    },
    {
      slug: "rap-solid-sekilas",
      title: "Prinsip SOLID Sekilas",
      summary: "Lima prinsip desain OOP dalam bahasa sehari-hari dan gejala saat dipakai.",
      steps: [
        {
          kind: "theory",
          title: "Lima prinsip, gejala nyata",
          body: "SOLID adalah lima prinsip desain berorientasi objek yang sering menjadi bahasa bersama saat tim membicarakan struktur kode. S: single responsibility, satu kelas satu alasan untuk berubah. O: open/closed, terbuka untuk diperluas lewat interface atau abstract class, tertutup untuk dimodifikasi isi lama. L: Liskov substitution, subclass layak menggantikan induknya tanpa kejutan perilaku. I: interface segregation, beberapa interface kecil dan spesifik lebih baik daripada satu interface raksasa. D: dependency inversion, modul tingkat tinggi bergantung pada abstraksi, bukan pada detail konkret.\n\nTidak perlu memaksakan kelima-limanya sekaligus. Pakai saat gejalanya nyata: kelas yang terus membesar karena menumpuk pekerjaan adalah gejala S; setiap penambahan jenis baru memaksa mengedit `switch` lama adalah gejala O; pemakai interface hanya memakai separuh methodnya adalah gejala I.\n\nContoh cepat: kelas `Laporan` yang membaca database, menghitung statistik, lalu mencetak PDF menyimpan tiga alasan berubah dalam satu kelas. Dipecah menjadi `PembacaData`, `KalkulatorStatistik`, dan `PenyajiLaporan`, tiap bagian menjadi kecil, mudah diuji sendiri, dan bisa berganti tanpa saling menyeret.",
          code: {
            language: "csharp",
            content:
              "public class Laporan\n{\n    public void BacaDariDatabase() { }\n    public void HitungStatistik() { }\n    public void CetakPdf() { }\n}",
            caption: "Gejala kelas menumpuk pekerjaan: tiga kata kerja dari tiga dunia yang berbeda.",
          },
        },
        {
          kind: "quiz",
          question:
            "Kelas `SimpanLaporan` membaca input pengguna, menghitung statistik, memvalidasi data, lalu menulis berkas. Prinsip SOLID mana yang paling dilanggar?",
          options: [
            "Single Responsibility Principle",
            "Open/Closed Principle",
            "Interface Segregation Principle",
            "Dependency Inversion Principle",
          ],
          answer: 0,
          explanation:
            "Satu kelas menumpuk banyak tanggung jawab berarti banyak alasan untuk berubah. Ini pelanggaran paling langsung terhadap single responsibility: pecah per tanggung jawab agar tiap bagian kecil dan teruji sendiri.",
        },
      ],
    },
    {
      slug: "rap-xml-documentation",
      title: "XML Documentation Ringkas",
      summary: "Komentar tiga garis miring yang menjadi kontrak API di IntelliSense.",
      steps: [
        {
          kind: "theory",
          title: "Dokumentasi yang tinggal di kode",
          body: "Komentar yang dimulai dengan tiga garis miring `///` tepat di atas deklarasi class, method, atau property berubah menjadi XML documentation: terbaca oleh compiler dan IDE, muncul di IntelliSense pemakai, dan bisa dirakit menjadi halaman referensi API. Tag yang paling sering: `<summary>` untuk gambaran anggota, `<param name=\"...\">` per parameter, `<returns>` untuk nilai kembali, dan `<exception cref=\"...\">` untuk kegagalan yang mungkin dilempar.\n\nBedanya dengan komentar biasa `//`: komentar biasa menjelaskan keputusan internal kepada pembaca kode, sedangkan XML documentation menjelaskan kontrak kepada pemakai yang tidak membuka isi method: arti tiap parameter, satuan angka, rentang nilai yang sah, dan apa yang dikembalikan saat daftarnya kosong.\n\nAturan isinya: jangan menyalin nama. `<summary>Menghitung total.</summary>` untuk method bernama `HitungTotal` tidak menambah pengetahuan apa pun; jelaskan yang tidak terlihat, misalnya satuan rupiah dan jaminan hasil tidak negatif. Dokumentasi yang salah lebih berbahaya daripada tanpa dokumentasi, jadi perbarui bersama perubahan perilaku.",
          code: {
            language: "csharp",
            content:
              "/// <summary>Menghitung potongan harga untuk satu transaksi.</summary>\n/// <param name=\"subtotal\">Subtransaksi dalam rupiah, tidak negatif.</param>\n/// <param name=\"persen\">Persen diskon, 0 sampai 100.</param>\n/// <returns>Besaran potongan dalam rupiah.</returns>\nstatic int HitungDiskon(int subtotal, int persen)\n{\n    return subtotal * persen / 100;\n}",
            caption: "Kontrak yang tampil di IntelliSense pemanggil, bukan sekadar catatan internal.",
          },
        },
        {
          kind: "quiz",
          question: "Tag XML documentation apa yang dipakai untuk menjelaskan makna satu parameter?",
          options: [
            "<param name=\"nama\">...</param>",
            "<summary>...</summary>",
            "<returns>...</returns>",
            "<remarks>...</remarks>",
          ],
          answer: 0,
          explanation:
            "<param name=\"...\"> dipakai satu kali per parameter dan wajib menyebut nama parameternya. <summary> menjelaskan gambaran method, <returns> nilai kembalinya.",
        },
      ],
    },
    {
      slug: "rap-code-review-checklist",
      title: "Checklist Code Review",
      summary: "Daftar periksa sebelum dan sesudah review, plus cara berkomentar yang membangun.",
      steps: [
        {
          kind: "theory",
          title: "Mata kedua sebelum digabung",
          body: "Code review adalah mata kedua sebelum kode digabung: penulis sering tidak melihat apa yang tidak ia tulis. Checklist yang ringkas dan bisa dipakai hari ini: nama menyatakan maksud; satu method satu tanggung jawab; tanpa duplikasi logika; magic number sudah jadi konstanta; test menutup happy path dan edge case; error di tepi program ditangani; tidak ada cetakan diagnosa yang tertinggal; gaya menulis konsisten dengan sisa proyek.\n\nCara berkomentar sepenting apa yang dikomentari: tunjuk kodenya, bukan orangnya; sebut alasan dan tawarkan alternatif; bedakan yang wajib (bug, kebocoran data, test bolong) dari yang sekadar saran (penamaan, gaya). Frasa `bagaimana kalau...` menghasilkan lebih banyak perbaikan daripada frasa `ini salah`.\n\nSebagai penulis, lakukan review sendiri lebih dulu: baca ulang perubahan sebelum meminta ditinjau, hapus eksperimen yang tak terpakai, dan pastikan seluruh test lulus. Reviewer yang menerima perubahan yang rapi bisa memakai perhatiannya untuk hal yang benar-benar penting.",
          code: {
            language: "csharp",
            content:
              "// Yang paling sering lolos saat review sendiri:\nConsole.WriteLine(\"[diagnosa] n = \" + n + \", jumlah = \" + jumlah);",
            caption: "Cetakan diagnosa yang tertinggal: kecil, tapi ikut terpush ke cabang utama.",
          },
        },
        {
          kind: "quiz",
          question: "Komentar review mana yang paling membangun?",
          options: [
            "Nama variabelmu berantakan, tolong dibereskan",
            "Ini salah, ganti semuanya",
            "Nama `x` kurang menjelaskan; bagaimana kalau `sisaStok` karena isinya jumlah barang yang tersisa?",
            "Kode kamu memang selalu bermasalah ya",
          ],
          answer: 2,
          explanation:
            "Review yang baik menunjuk kode spesifik, menjelaskan alasannya, dan menawarkan alternatif. Menyerang orang atau menghakimi tanpa alasan tidak menghasilkan perbaikan apa pun.",
        },
      ],
    },
    {
      slug: "rap-latihan-gabungan-rapi",
      title: "Latihan Gabungan: Modul Penilaian",
      summary: "Merapikan modul kecil dari ujung ke ujung: konstanta, method, dan penghitung.",
      steps: [
        {
          kind: "theory",
          title: "Urutan kerja merapikan",
          body: "Mari rangkai semuanya. Urutan kerja yang warak saat merapikan modul kecil: kunci perilakunya dengan test; ganti magic number dengan konstanta bernama; tarik logika ke method yang namanya menyatakan niat; hapus duplikasi; jalankan test lagi. Setiap langkah kecil, dan setiap langkah harus meninggalkan test yang tetap hijau.\n\nLatihan berikut adalah modul penilaian siswa dengan struktur yang sudah sebagian rapi: ada konstanta ambang lulus dan method `Status` yang memisahkan keputusan dari pencetakan. Tugasmu melengkapi bagian yang menyentuh konvensi: nama konstantanya, batas perbandingannya, dan penghitung jumlah lulus. Keluaran harus persis, karena itulah sifat refactor: perilaku tidak berubah sedikit pun.\n\nPerhatikan satu detail edge case: nilai tepat 60 harus LULUS, jadi perbandingannya `>=`, bukan `>`. Inilah jenis bug batas yang dibahas di awal modul, dan ia paling sering lolos bila test hanya memakai nilai jauh dari ambang.",
          code: {
            language: "csharp",
            content:
              "const int NilaiMinimalLulus = 60;\n\nstatic string Status(int nilai)\n{\n    if (nilai >= NilaiMinimalLulus) return \"LULUS\";\n    return \"GAGAL\";\n}",
            caption: "Keputusan dipisah dari tampilan, ambangnya punya nama.",
          },
        },
        {
          kind: "code",
          title: "Selesaikan modul penilaian",
          prompt:
            "Modul penilaian ini sudah mengikuti pola rapi: konstanta ambang, method `Status`, dan `Main` yang mencetak. Lengkapi bagian yang masih kosong supaya konvensinya utuh: nilai tepat 60 dihitung LULUS dan jumlah lulus dicetak dengan benar.",
          mode: "fill",
          template:
            "using System;\n\npublic class Program\n{\n    const int ___ = 60;\n\n    static string Status(int nilai)\n    {\n        if (nilai ___ NilaiMinimal)\n        {\n            return \"LULUS\";\n        }\n        return \"GAGAL\";\n    }\n\n    public static void Main()\n    {\n        int n = Convert.ToInt32(Console.ReadLine());\n        int jumlahLulus = 0;\n\n        for (int i = 0; i < n; i++)\n        {\n            string[] bagian = Console.ReadLine().Split(' ');\n            string nama = bagian[0];\n            int nilai = Convert.ToInt32(bagian[1]);\n\n            string status = Status(nilai);\n            if (status == \"LULUS\")\n            {\n                jumlahLulus++;\n            }\n\n            Console.WriteLine(nama + \": \" + status);\n        }\n\n        Console.WriteLine(\"Lulus: \" + ___ + \" dari \" + n);\n    }\n}",
          solution:
            "using System;\n\npublic class Program\n{\n    const int NilaiMinimal = 60;\n\n    static string Status(int nilai)\n    {\n        if (nilai >= NilaiMinimal)\n        {\n            return \"LULUS\";\n        }\n        return \"GAGAL\";\n    }\n\n    public static void Main()\n    {\n        int n = Convert.ToInt32(Console.ReadLine());\n        int jumlahLulus = 0;\n\n        for (int i = 0; i < n; i++)\n        {\n            string[] bagian = Console.ReadLine().Split(' ');\n            string nama = bagian[0];\n            int nilai = Convert.ToInt32(bagian[1]);\n\n            string status = Status(nilai);\n            if (status == \"LULUS\")\n            {\n                jumlahLulus++;\n            }\n\n            Console.WriteLine(nama + \": \" + status);\n        }\n\n        Console.WriteLine(\"Lulus: \" + jumlahLulus + \" dari \" + n);\n    }\n}",
          tests: [
            {
              stdin: "3\nAni 80\nBudi 55\nCitra 60",
              expectedOutput: "Ani: LULUS\nBudi: GAGAL\nCitra: LULUS\nLulus: 2 dari 3",
            },
            { stdin: "1\nDedi 59", expectedOutput: "Dedi: GAGAL\nLulus: 0 dari 1" },
            { stdin: "2\nEka 60\nFahri 100", expectedOutput: "Eka: LULUS\nFahri: LULUS\nLulus: 2 dari 2", hidden: true },
          ],
          hints: [
            "Nilai tepat 60 harus LULUS: perbandingannya lebih besar atau sama dengan.",
            "Penghitung yang dinaikkan di cabang LULUS bernama jumlahLulus, dan itulah yang dicetak di baris terakhir.",
          ],
        },
      ],
    },
    // ==================== MODUL 9: Menuju Proyek Lapangan ====================
    {
      slug: "lap-struktur-multifile",
      title: "Anatomi Program Multi-File",
      summary: "Pembagian Program, Models, dan Services dalam satu arah ketergantungan.",
      steps: [
        {
          kind: "theory",
          title: "Satu file satu tanggung jawab",
          body: "Program nyata dipecah menjadi banyak file dengan pembagian yang familiar: `Program.cs` berisi `Main` yang tipis; folder `Models` menampung kelas data murni; folder `Services` menampung logika dan aturan bisnis. Konvensi .NET: satu kelas publik per file dan nama file mengikuti nama kelasnya, semuanya di bawah satu namespace proyek.\n\nArah ketergantungan dijaga satu jalur: Program memakai Service, Service memakai Model, dan Model tidak mengenal keduanya. Begitu ketergantungan mulai melingkar, misalnya Service A memakai B sementara B memakai A, itu tanda tanggung jawabnya campur dan perlu dipisah ulang.\n\nDi lingkungan latihan ini seluruh file disatukan menjadi satu saat diuji, jadi kita menuliskan kelas-kelas itu berjalan dalam satu berkas lengkap dengan penanda asal filenya. Disiplinnya tetap sama seperti proyek sungguhan: `Main` hanya membaca input, memanggil service, dan menulis output.",
          code: {
            language: "csharp",
            content:
              "// Models/Paket.cs: kelas data murni, tanpa logika.\npublic class Paket\n{\n    public string Kota;\n    public int Berat;\n}\n\n// Services/OngkirService.cs: aturan bisnis.\npublic class OngkirService\n{\n    public static int Hitung(int berat)\n    {\n        int biaya = berat * 5000;\n        if (biaya < 10000) biaya = 10000;\n        return biaya;\n    }\n}",
            caption: "Model menampung data, service memegang aturan; Main nanti hanya menyambungkan.",
          },
        },
        {
          kind: "quiz",
          question: "Dalam program multi-file yang rapi, isi `Main` sebaiknya apa?",
          options: [
            "Semua logika supaya mudah dicari di satu tempat",
            "Alur tipis: baca input, panggil service, tulis output",
            "Deklarasi variabel global untuk seluruh program",
            "Koneksi database langsung tanpa perantara",
          ],
          answer: 1,
          explanation:
            "Main bertindak sebagai konduktor tipis: membaca input, memanggil service, menulis output. Logika di service dan data di model sehingga keduanya mudah diuji terpisah.",
        },
        {
          kind: "code",
          title: "Satukan struktur tiga lapis",
          prompt:
            "Kelas `Paket` (model), `OngkirService` (aturan biaya), dan `Program` (Main tipis) meniru struktur tiga file dalam satu berkas. Lengkapi aturan ongkirnya: 5000 per kilogram dengan biaya minimum 10000, lalu pemanggilannya dari Main.",
          mode: "fill",
          template:
            "using System;\n\n// Model: hanya wadah data.\npublic class Paket\n{\n    public string Kota;\n    public int Berat;\n}\n\n// Service: aturan bisnis.\npublic class OngkirService\n{\n    public static int Hitung(int berat)\n    {\n        int biaya = berat * ___;\n        if (biaya ___ 10000)\n        {\n            biaya = 10000;\n        }\n        return biaya;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        string kota = Console.ReadLine();\n        int berat = Convert.ToInt32(Console.ReadLine());\n\n        Paket paket = new Paket();\n        paket.Kota = kota;\n        paket.Berat = berat;\n\n        Console.WriteLine(\"Ongkir ke \" + paket.Kota + \": \" + ___.Hitung(paket.Berat));\n    }\n}",
          solution:
            "using System;\n\n// Model: hanya wadah data.\npublic class Paket\n{\n    public string Kota;\n    public int Berat;\n}\n\n// Service: aturan bisnis.\npublic class OngkirService\n{\n    public static int Hitung(int berat)\n    {\n        int biaya = berat * 5000;\n        if (biaya < 10000)\n        {\n            biaya = 10000;\n        }\n        return biaya;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        string kota = Console.ReadLine();\n        int berat = Convert.ToInt32(Console.ReadLine());\n\n        Paket paket = new Paket();\n        paket.Kota = kota;\n        paket.Berat = berat;\n\n        Console.WriteLine(\"Ongkir ke \" + paket.Kota + \": \" + OngkirService.Hitung(paket.Berat));\n    }\n}",
          tests: [
            { stdin: "Bandung\n1", expectedOutput: "Ongkir ke Bandung: 10000" },
            { stdin: "Surabaya\n3", expectedOutput: "Ongkir ke Surabaya: 15000" },
            { stdin: "Medan\n5", expectedOutput: "Ongkir ke Medan: 25000", hidden: true },
          ],
          hints: [
            "Aturan di service: biaya adalah berat kali 5000; bila hasilnya di bawah 10000, dinaikkan ke 10000.",
            "Main memanggil logika lewat OngkirService.Hitung, bukan menghitung sendiri di dalam Main.",
          ],
        },
      ],
    },
    {
      slug: "lap-parsing-args",
      title: "Parsing Argumen Main",
      summary: "Main(string[] args), disiplin cek panjang array, dan simulasi lewat stdin.",
      steps: [
        {
          kind: "theory",
          title: "args: pintu masuk dari terminal",
          body: "Sejak awal jalur ini `Main` ditulis tanpa parameter; versi lengkapnya `static void Main(string[] args)`. Array `args` berisi argumen yang diketik setelah nama program: memanggil `kotak.exe laporan --detail maret` menghasilkan tiga string: `laporan`, `--detail`, `maret`. Berbeda dari beberapa bahasa lain, di C# nama program tidak ikut masuk `args`.\n\nDisiplin parsing yang menyelamatkan: periksa `args.Length` sebelum mengindeks, karena membaca `args[2]` pada array dua elemen melempar `IndexOutOfRangeException`. Tetapkan konvensi yang jelas: argumen posisi (`args[0]` perintah, sisanya nilai) untuk perintah sederhana, flag berawalan `-` atau `--` untuk opsi, dan pesan pemakaian saat jumlah argumen salah.\n\nLingkungan uji di sini tidak menyodorkan argumen baris perintah, jadi kita menyimulasinya: baris pertama stdin diperlakukan sebagai baris perintah lalu dipotong dengan `Split(' ')`. Logika cabangnya persis seperti memproses `args` asli; yang berbeda hanya sumber arraynya.",
          code: {
            language: "csharp",
            content:
              "public static void Main(string[] args)\n{\n    if (args.Length < 2)\n    {\n        Console.WriteLine(\"Pemakaian: kotak <perintah> <nilai>\");\n        return;\n    }\n\n    string perintah = args[0];\n    Console.WriteLine(\"Perintah: \" + perintah);\n}",
            caption: "Periksa panjang array lebih dulu, baru mengindeks.",
          },
        },
        {
          kind: "quiz",
          question: "Program dipanggil dengan `kotak.exe laporan --detail maret`. Isi `args`-nya?",
          options: [
            "args.Length == 2, isinya laporan dan maret",
            "args.Length == 3, isinya laporan, --detail, dan maret",
            "args.Length == 4 karena nama program ikut dihitung",
            "args.Length == 0 karena argumen hanya ada saat debug",
          ],
          answer: 1,
          explanation:
            "Di C# nama program tidak ikut masuk args. Isinya tiga string: laporan, --detail, dan maret, sehingga args.Length bernilai 3.",
        },
        {
          kind: "code",
          title: "Urai baris perintah",
          prompt:
            "Baris pertama stdin diperlakukan sebagai baris perintah: kata pertamanya adalah perintah. `jumlah a b` mencetak `Hasil: <a+b>`, `sapa nama` mencetak `Halo, <nama>!`, dan perintah lain mencetak `Perintah tidak dikenal: <perintah>`. Lengkapi penguraian array dan cabangnya.",
          mode: "fill",
          template:
            "using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        string barisPerintah = Console.ReadLine();\n        string[] args = barisPerintah.___(' ');\n\n        string perintah = ___[0];\n\n        if (perintah == ___ && args.Length >= 3)\n        {\n            int a = Convert.ToInt32(args[1]);\n            int b = Convert.ToInt32(args[2]);\n            Console.WriteLine(\"Hasil: \" + (a + b));\n        }\n        else if (perintah == \"sapa\" && args.Length >= 2)\n        {\n            Console.WriteLine(\"Halo, \" + args[1] + \"!\");\n        }\n        else\n        {\n            Console.WriteLine(\"Perintah tidak dikenal: \" + perintah);\n        }\n    }\n}",
          solution:
            "using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        string barisPerintah = Console.ReadLine();\n        string[] args = barisPerintah.Split(' ');\n\n        string perintah = args[0];\n\n        if (perintah == \"jumlah\" && args.Length >= 3)\n        {\n            int a = Convert.ToInt32(args[1]);\n            int b = Convert.ToInt32(args[2]);\n            Console.WriteLine(\"Hasil: \" + (a + b));\n        }\n        else if (perintah == \"sapa\" && args.Length >= 2)\n        {\n            Console.WriteLine(\"Halo, \" + args[1] + \"!\");\n        }\n        else\n        {\n            Console.WriteLine(\"Perintah tidak dikenal: \" + perintah);\n        }\n    }\n}",
          tests: [
            { stdin: "jumlah 4 5", expectedOutput: "Hasil: 9" },
            { stdin: "sapa Dina", expectedOutput: "Halo, Dina!" },
            { stdin: "bagi 8 2", expectedOutput: "Perintah tidak dikenal: bagi", hidden: true },
          ],
          hints: [
            "Baris perintah dipotong pada tiap spasi: methodnya Split.",
            "Perintah ada di elemen pertama array args, dan cabang pertama menerima kata jumlah.",
          ],
        },
      ],
    },
    {
      slug: "lap-konfigurasi-appconfig",
      title: "Konfigurasi App.config",
      summary: "appSettings di App.config, cara membacanya, dan nilai bawaan saat kunci hilang.",
      steps: [
        {
          kind: "theory",
          title: "Nilai yang hidup di luar kode",
          body: "Nilai yang berbeda tiap lingkungan, seperti alamat server, batas maksimal, atau nama folder keluaran, sebaiknya tidak ditulis mati di kode. Di .NET Framework tempatnya App.config: berkas XML di sebelah program, dengan bagian `<appSettings>` berisi pasangan `key` dan `value`. Mengganti konfigurasi tidak menuntut kompilasi ulang: ubah berkasnya, jalankan ulang program.\n\nCara membacanya lewat `ConfigurationManager.AppSettings[\"NamaKunci\"]` (butuh referensi `System.Configuration`). Hasilnya selalu string: konversi sendiri dengan `int.Parse` atau `bool.Parse`, dan selalu siapkan nilai bawaan bila kunci tidak ada, karena akses ke kunci yang hilang mengembalikan null.\n\nSatu larangan yang sering diuji saat audit keamanan: rahasia seperti password dan kunci API tidak ditaruh di berkas konfigurasi yang ikut repositori. Di .NET modern pola ini berlanjut ke `appsettings.json` berlapis dengan `IOptions`, tetapi prinsipnya sama: kode membaca nilai, bukan menanamnya.",
          code: {
            language: "xml",
            content:
              "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<configuration>\n  <appSettings>\n    <add key=\"BatasKuota\" value=\"100\" />\n    <add key=\"FolderLaporan\" value=\"laporan\" />\n  </appSettings>\n</configuration>",
            caption: "Dibaca dengan ConfigurationManager.AppSettings[\"BatasKuota\"]; hasilnya selalu string.",
          },
        },
        {
          kind: "quiz",
          question: "Cara yang benar untuk membaca kunci `Bahasa` dari appSettings di App.config?",
          options: [
            "ConfigurationManager.AppSettings[\"Bahasa\"]",
            "App.Config.Get(\"Bahasa\")",
            "Environment.GetSetting(\"Bahasa\")",
            "Settings.Read(\"Bahasa\")",
          ],
          answer: 0,
          explanation:
            "Kelas ConfigurationManager dengan indeks nama kunci adalah cara baku di .NET Framework. Hasilnya string, jadi konversi sendiri bila butuh angka, dan cek null untuk kunci yang belum ada.",
        },
      ],
    },
    {
      slug: "lap-logging-ringkas",
      title: "Logging Ringkas",
      summary: "Level log, format satu baris, dan logger mini dengan batas level.",
      steps: [
        {
          kind: "theory",
          title: "Catatan kejadian yang dipertahankan",
          body: "Log adalah catatan kejadian saat program berjalan, dan pembedanya dari cetakan diagnosa sementara: log punya level, format konsisten, dan sengaja dipertahankan untuk diperiksa belakangan. Level yang lazim: `Debug` untuk detail yang hanya pemrogram butuhkan, `Info` untuk kejadian normal yang penting (mulai, selesai, transaksi masuk), `Warning` untuk hal aneh yang masih jalan, dan `Error` untuk kegagalan yang ditangani.\n\nDi dunia kerja C# yang menangani ini antara lain log4net, NLog, dan Serilog; semuanya menyediakan pembatasan level minimum dan banyak tujuan keluaran, dari konsol sampai berkas. Logger sederhana bisa ditulis sendiri: simpan batas level, bandingkan setiap pesan dengannya, dan format keluarannya satu baris rapi seperti `[ERROR] Gagal simpan`.\n\nSopan santun logging: cukup catat kejadian penting, bukan setiap baris perulangan; sertakan konteks yang bisa dicari seperti nomor transaksi; dan jangan pernah menulis rahasia seperti password atau token ke log, karena log tersebar dan tersimpan lama.",
          code: {
            language: "csharp",
            content:
              "static void Log(string level, string pesan)\n{\n    Console.WriteLine(\"[\" + level + \"] \" + pesan);\n}\n\nLog(\"INFO\", \"Program dimulai\");\nLog(\"ERROR\", \"Gagal simpan laporan\");",
            caption: "Format satu baris yang mudah dicari: [LEVEL] pesan.",
          },
        },
        {
          kind: "code",
          title: "Saring log dengan level minimum",
          prompt:
            "Program menerima batas level di baris pertama (`INFO`, `WARNING`, atau `ERROR`), lalu sejumlah baris log berformat `LEVEL pesan`. Tampilkan hanya log yang levelnya mencapai batas, dengan format `[LEVEL] pesan`. Urutan level: INFO < WARNING < ERROR.",
          mode: "fill",
          template:
            "using System;\n\npublic class Program\n{\n    static int LevelKeAngka(string level)\n    {\n        if (level == \"ERROR\") return 3;\n        if (level == ___) return 2;\n        return 1;\n    }\n\n    public static void Main()\n    {\n        string batas = Console.ReadLine();\n        int batasAngka = LevelKeAngka(batas);\n\n        int n = Convert.ToInt32(Console.ReadLine());\n        for (int i = 0; i < n; i++)\n        {\n            string baris = Console.ReadLine();\n            int spasiPertama = baris.IndexOf(' ');\n            string level = baris.Substring(0, spasiPertama);\n            string pesan = baris.Substring(spasiPertama + 1);\n\n            if (LevelKeAngka(level) ___ batasAngka)\n            {\n                Console.WriteLine(\"[\" + level + \"] \" + pesan);\n            }\n        }\n    }\n}",
          solution:
            "using System;\n\npublic class Program\n{\n    static int LevelKeAngka(string level)\n    {\n        if (level == \"ERROR\") return 3;\n        if (level == \"WARNING\") return 2;\n        return 1;\n    }\n\n    public static void Main()\n    {\n        string batas = Console.ReadLine();\n        int batasAngka = LevelKeAngka(batas);\n\n        int n = Convert.ToInt32(Console.ReadLine());\n        for (int i = 0; i < n; i++)\n        {\n            string baris = Console.ReadLine();\n            int spasiPertama = baris.IndexOf(' ');\n            string level = baris.Substring(0, spasiPertama);\n            string pesan = baris.Substring(spasiPertama + 1);\n\n            if (LevelKeAngka(level) >= batasAngka)\n            {\n                Console.WriteLine(\"[\" + level + \"] \" + pesan);\n            }\n        }\n    }\n}",
          tests: [
            {
              stdin: "WARNING\n3\nINFO Mulai program\nWARNING Stok menipis\nERROR Gagal simpan",
              expectedOutput: "[WARNING] Stok menipis\n[ERROR] Gagal simpan",
            },
            { stdin: "INFO\n2\nINFO Mulai\nERROR Meledak", expectedOutput: "[INFO] Mulai\n[ERROR] Meledak" },
            {
              stdin: "ERROR\n3\nINFO A\nWARNING B\nERROR C gagal total",
              expectedOutput: "[ERROR] C gagal total",
              hidden: true,
            },
          ],
          hints: [
            "Level ditukar menjadi angka agar bisa dibandingkan: ERROR tiga, WARNING dua, INFO satu.",
            "Pesan tampil saat levelnya sama atau lebih tinggi dari batas: perbandingan lebih besar atau sama dengan.",
          ],
        },
      ],
    },
    {
      slug: "lap-proyek-tugas",
      title: "Mini Proyek: Manajemen Tugas",
      summary: "Program CLI add/list/done dari kontrak, state di memori, sampai nomor tak sah.",
      steps: [
        {
          kind: "theory",
          title: "Dari kontrak ke program",
          body: "Proyek kecil dimulai dari kontrak, bukan dari mengetik: daftar perintah, format masukan, dan format keluaran. Kontrak manajemen tugas kita: `add <judul>` menyimpan tugas baru tanpa keluaran; `list` mencetak semua tugas bernomor; `done <nomor>` menandai tugas selesai; `selesai` mengakhiri program. Menulis kontrak ini lebih dulu memangkas separuh kebingungan saat koding.\n\nKeadaan program disimpan di memori: dua list paralel (judul dan status selesai) atau satu list objek kecil. Rangka utamanya satu perulangan: baca baris, kenali perintahnya, jalankan cabang yang cocok, dan berhenti saat baris `selesai` atau input habis.\n\nTiga detail yang menentukan lulus: judul boleh berisi spasi, jadi ambil sisanya dengan `Substring(4)` setelah awalan `add `, bukan dengan `Split`; nomor yang tampil dimulai dari 1 padahal indeks list mulai dari 0; dan nomor di luar jangkauan harus dijawab pesan `Nomor tidak ditemukan`, bukan dibiarkan sampai program crash.",
          code: {
            language: "csharp",
            content:
              "// add Belajar CSharp   -> (tanpa keluaran)\n// list                 -> 1. [ ] Belajar CSharp\n// done 1               -> Selesai: Belajar CSharp\n// selesai              -> program berhenti",
            caption: "Kontrak perintah dalam empat baris; tulis seperti ini sebelum koding.",
          },
        },
        {
          kind: "code",
          title: "Bangun manajemen tugas",
          prompt:
            "Lengkapi program manajemen tugas sesuai kontrak: `add <judul>` tanpa keluaran, `list` mencetak `nomor. [x| ] judul` atau `Tidak ada tugas` saat kosong, `done <nomor>` mencetak `Selesai: <judul>` atau `Nomor tidak ditemukan`, dan `selesai` menghentikan program. Judul boleh mengandung spasi.",
          mode: "fill",
          template:
            "using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    public static void Main()\n    {\n        List<string> judul = new List<string>();\n        List<bool> selesai = new List<bool>();\n\n        while (true)\n        {\n            string baris = Console.ReadLine();\n            if (baris == null) break;\n            if (baris == \"selesai\") break;\n\n            if (baris.___(\"add \"))\n            {\n                judul.Add(baris.___(4));\n                selesai.Add(false);\n            }\n            else if (baris == \"list\")\n            {\n                if (judul.Count == 0)\n                {\n                    Console.WriteLine(\"Tidak ada tugas\");\n                }\n                for (int i = 0; i < judul.Count; i++)\n                {\n                    string tanda = selesai[i] ? ___ : \" \";\n                    Console.WriteLine((i + 1) + \". [\" + tanda + \"] \" + judul[i]);\n                }\n            }\n            else if (baris.StartsWith(\"done \"))\n            {\n                int nomor = Convert.ToInt32(baris.Substring(5));\n                if (nomor >= 1 && nomor <= ___)\n                {\n                    selesai[nomor - 1] = true;\n                    Console.WriteLine(\"Selesai: \" + judul[nomor - 1]);\n                }\n                else\n                {\n                    Console.WriteLine(\"Nomor tidak ditemukan\");\n                }\n            }\n        }\n    }\n}",
          solution:
            "using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    public static void Main()\n    {\n        List<string> judul = new List<string>();\n        List<bool> selesai = new List<bool>();\n\n        while (true)\n        {\n            string baris = Console.ReadLine();\n            if (baris == null) break;\n            if (baris == \"selesai\") break;\n\n            if (baris.StartsWith(\"add \"))\n            {\n                judul.Add(baris.Substring(4));\n                selesai.Add(false);\n            }\n            else if (baris == \"list\")\n            {\n                if (judul.Count == 0)\n                {\n                    Console.WriteLine(\"Tidak ada tugas\");\n                }\n                for (int i = 0; i < judul.Count; i++)\n                {\n                    string tanda = selesai[i] ? \"x\" : \" \";\n                    Console.WriteLine((i + 1) + \". [\" + tanda + \"] \" + judul[i]);\n                }\n            }\n            else if (baris.StartsWith(\"done \"))\n            {\n                int nomor = Convert.ToInt32(baris.Substring(5));\n                if (nomor >= 1 && nomor <= judul.Count)\n                {\n                    selesai[nomor - 1] = true;\n                    Console.WriteLine(\"Selesai: \" + judul[nomor - 1]);\n                }\n                else\n                {\n                    Console.WriteLine(\"Nomor tidak ditemukan\");\n                }\n            }\n        }\n    }\n}",
          tests: [
            {
              stdin: "add Belajar CSharp\nadd Tulis laporan\nlist\nselesai",
              expectedOutput: "1. [ ] Belajar CSharp\n2. [ ] Tulis laporan",
            },
            {
              stdin: "add Rapat tim\nadd Kunci pintu\ndone 1\nlist\nselesai",
              expectedOutput: "Selesai: Rapat tim\n1. [x] Rapat tim\n2. [ ] Kunci pintu",
            },
            {
              stdin: "list\nadd Beli susu\ndone 5\ndone 1\nlist\nselesai",
              expectedOutput: "Tidak ada tugas\nNomor tidak ditemukan\nSelesai: Beli susu\n1. [x] Beli susu",
              hidden: true,
            },
          ],
          hints: [
            "Judul bisa berisi spasi, jadi jangan memakai Split: ambil sisa baris setelah awalan add dengan Substring(4).",
            "Tanda di dalam kurung siku: x untuk tugas selesai, spasi untuk yang belum.",
            "Nomor yang sah mulai dari 1 sampai judul.Count; di luar itu jawab dengan pesan, jangan sampai mengindeks list.",
          ],
        },
      ],
    },
    {
      slug: "lap-proyek-penjualan",
      title: "Mini Proyek: Laporan Penjualan",
      summary: "Agregasi data tabular: total pendapatan dan produk terlaris dengan Dictionary.",
      steps: [
        {
          kind: "theory",
          title: "Mengagregasi baris demi baris",
          body: "Data tabular dari stdin dibaca baris demi baris; tiap baris dipotong dengan `Split(' ')`. Laporan penjualan kita mengagregasi dua hal: total pendapatan seluruh transaksi dan produk terlaris berdasarkan total jumlah terjual. Polanya khas agregasi: jumlahkan sambil mengelompokkan, dengan `Dictionary<string, int>` sebagai tempat akumulasi per produk.\n\nDua jebakan yang menyasar pemula: pertama, hasil kali jumlah kali harga mudah melampaui batas `int` bila volume besar, jadi total ditampung di `long`; kedua, produk yang sama boleh muncul di banyak baris, sehingga jumlahnya harus diakumulasi lebih dulu sebelum menentukan siapa yang terlaris.\n\nPenentu terlaris memakai perbandingan `>`, bukan `>=`, sehingga saat nilai seri, produk yang lebih dulu mencapai rekor yang menang. Untuk latihan ini data uji sengaja dibuat tidak seri supaya jawabannya tunggal.",
          code: {
            language: "csharp",
            content:
              "if (jumlahPerProduk.ContainsKey(produk))\n{\n    jumlahPerProduk[produk] += jumlah;\n}\nelse\n{\n    jumlahPerProduk[produk] = jumlah;\n}",
            caption: "Pola akumulasi Dictionary: cek kuncinya, tambah bila ada, isi bila belum.",
          },
        },
        {
          kind: "code",
          title: "Susun laporan penjualan",
          prompt:
            "Baris pertama stdin berisi banyaknya transaksi; tiap baris berikutnya berformat `produk jumlah harga`. Cetak dua baris: `Total pendapatan: <total>` dan `Produk terlaris: <nama> (<jumlah> unit)`. Akumulasi jumlah untuk produk yang muncul berkali-kali, dan tampung total di `long` karena nilainya bisa besar.",
          mode: "fill",
          template:
            "using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int n = Convert.ToInt32(Console.ReadLine());\n\n        long total = 0;\n        Dictionary<string, int> jumlahPerProduk = new Dictionary<string, int>();\n        string terlaris = \"\";\n        int jumlahTerlaris = 0;\n\n        for (int i = 0; i < n; i++)\n        {\n            string[] bagian = Console.ReadLine().Split(' ');\n            string produk = bagian[0];\n            int jumlah = Convert.ToInt32(bagian[1]);\n            int harga = Convert.ToInt32(bagian[2]);\n\n            total += (___) jumlah * harga;\n\n            if (jumlahPerProduk.___(produk))\n            {\n                jumlahPerProduk[produk] += jumlah;\n            }\n            else\n            {\n                jumlahPerProduk[produk] = jumlah;\n            }\n\n            if (jumlahPerProduk[produk] ___ jumlahTerlaris)\n            {\n                jumlahTerlaris = jumlahPerProduk[produk];\n                terlaris = produk;\n            }\n        }\n\n        Console.WriteLine(\"Total pendapatan: \" + total);\n        Console.WriteLine(\"Produk terlaris: \" + terlaris + \" (\" + jumlahTerlaris + \" unit)\");\n    }\n}",
          solution:
            "using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    public static void Main()\n    {\n        int n = Convert.ToInt32(Console.ReadLine());\n\n        long total = 0;\n        Dictionary<string, int> jumlahPerProduk = new Dictionary<string, int>();\n        string terlaris = \"\";\n        int jumlahTerlaris = 0;\n\n        for (int i = 0; i < n; i++)\n        {\n            string[] bagian = Console.ReadLine().Split(' ');\n            string produk = bagian[0];\n            int jumlah = Convert.ToInt32(bagian[1]);\n            int harga = Convert.ToInt32(bagian[2]);\n\n            total += (long) jumlah * harga;\n\n            if (jumlahPerProduk.ContainsKey(produk))\n            {\n                jumlahPerProduk[produk] += jumlah;\n            }\n            else\n            {\n                jumlahPerProduk[produk] = jumlah;\n            }\n\n            if (jumlahPerProduk[produk] > jumlahTerlaris)\n            {\n                jumlahTerlaris = jumlahPerProduk[produk];\n                terlaris = produk;\n            }\n        }\n\n        Console.WriteLine(\"Total pendapatan: \" + total);\n        Console.WriteLine(\"Produk terlaris: \" + terlaris + \" (\" + jumlahTerlaris + \" unit)\");\n    }\n}",
          tests: [
            {
              stdin: "3\nKopi 5 20000\nGula 2 15000\nTeh 7 8000",
              expectedOutput: "Total pendapatan: 186000\nProduk terlaris: Teh (7 unit)",
            },
            {
              stdin: "4\nKopi 3 20000\nKopi 2 20000\nTeh 4 8000\nRoti 1 12000",
              expectedOutput: "Total pendapatan: 144000\nProduk terlaris: Kopi (5 unit)",
            },
            {
              stdin: "2\nBuku 10 5000\nPensil 9 2000",
              expectedOutput: "Total pendapatan: 68000\nProduk terlaris: Buku (10 unit)",
              hidden: true,
            },
          ],
          hints: [
            "Perkalian ditampung di long: ubah salah satu faktornya dengan cast (long) sebelum dikali.",
            "Dictionary perlu dicek kuncinya lebih dulu dengan ContainsKey supaya nilai lama tidak tertimpa.",
            "Produk baru jadi terlaris hanya saat jumlah akumulasinya lebih besar dari rekor sebelumnya: perbandingan >, bukan >=.",
          ],
        },
      ],
    },
    {
      slug: "lap-proyek-konverter",
      title: "Mini Proyek: Konverter Satuan",
      summary: "Konversi lewat satuan dasar dengan tabel dua arah dan format desimal tetap.",
      steps: [
        {
          kind: "theory",
          title: "Satu titik tengah untuk semua satuan",
          body: "Konverter untuk banyak satuan paling rapi lewat satu titik tengah: dari satuan asal ke satuan dasar (Celsius untuk suhu, meter untuk panjang), lalu dari satuan dasar ke satuan tujuan. Dengan dua tabel searah itu, kombinasi n satuan cukup 2n rumus; menambah satuan berarti menambah dua baris tanpa menyentuh yang lama, semangat open/closed versi sehari-hari.\n\nUntuk angka desimal, parse dan format dengan budaya tetap: `double.Parse(s, CultureInfo.InvariantCulture)` dan `ToString(\"0.##\", CultureInfo.InvariantCulture)`. Tanpa ini, mesin dengan pengaturan regional berbeda bisa memakai koma sebagai pemisah desimal dan programmu membaca `2.5` sebagai sesuatu yang lain. Format `0.##` juga membuang nol berlebih sehingga 77.00 dicetak sebagai 77.\n\nKontrak programnya empat baris input: jenis (`suhu` atau `panjang`), nilai, satuan asal, dan satuan tujuan; keluarannya satu baris berbentuk `nilai dari = hasil ke`.",
          code: {
            language: "csharp",
            content:
              "static double KeCelsius(double nilai, string satuan)\n{\n    if (satuan == \"F\") return (nilai - 32) * 5 / 9;\n    if (satuan == \"K\") return nilai - 273.15;\n    return nilai;\n}",
            caption: "Satu arah menuju satuan dasar; arah sebaliknya tinggal dibalik.",
          },
        },
        {
          kind: "code",
          title: "Rakit konverter dua arah",
          prompt:
            "Program konverter membaca jenis (`suhu` atau `panjang`), nilai, satuan asal, dan satuan tujuan, lalu mencetak `nilai dari = hasil ke`. Jalur konversinya lewat satuan dasar: Celsius untuk suhu, meter untuk panjang. Lengkapi rumus yang kosong dan pemilihan jenisnya.",
          mode: "fill",
          template:
            "using System;\nusing System.Globalization;\n\npublic class Program\n{\n    static double KeCelsius(double nilai, string satuan)\n    {\n        if (satuan == \"F\") return (nilai - 32) ___ 5 / 9;\n        if (satuan == \"K\") return nilai - 273.15;\n        return nilai;\n    }\n\n    static double DariCelsius(double c, string satuan)\n    {\n        if (satuan == \"F\") return c ___ 9 / 5 + 32;\n        if (satuan == \"K\") return c + 273.15;\n        return c;\n    }\n\n    static double KeMeter(double nilai, string satuan)\n    {\n        if (satuan == \"km\") return nilai * 1000;\n        if (satuan == \"cm\") return nilai ___ 100;\n        if (satuan == \"mm\") return nilai / 1000;\n        return nilai;\n    }\n\n    static double DariMeter(double m, string satuan)\n    {\n        if (satuan == \"km\") return m / 1000;\n        if (satuan == \"cm\") return m * 100;\n        if (satuan == \"mm\") return m * 1000;\n        return m;\n    }\n\n    static string Format(double nilai)\n    {\n        return nilai.ToString(\"0.##\", CultureInfo.InvariantCulture);\n    }\n\n    public static void Main()\n    {\n        string jenis = Console.ReadLine();\n        double nilai = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture);\n        string dari = Console.ReadLine();\n        string ke = Console.ReadLine();\n\n        double hasil;\n        if (jenis == ___)\n        {\n            hasil = DariCelsius(KeCelsius(nilai, dari), ke);\n        }\n        else\n        {\n            hasil = DariMeter(KeMeter(nilai, dari), ke);\n        }\n\n        Console.WriteLine(Format(nilai) + \" \" + dari + \" = \" + Format(hasil) + \" \" + ke);\n    }\n}",
          solution:
            "using System;\nusing System.Globalization;\n\npublic class Program\n{\n    static double KeCelsius(double nilai, string satuan)\n    {\n        if (satuan == \"F\") return (nilai - 32) * 5 / 9;\n        if (satuan == \"K\") return nilai - 273.15;\n        return nilai;\n    }\n\n    static double DariCelsius(double c, string satuan)\n    {\n        if (satuan == \"F\") return c * 9 / 5 + 32;\n        if (satuan == \"K\") return c + 273.15;\n        return c;\n    }\n\n    static double KeMeter(double nilai, string satuan)\n    {\n        if (satuan == \"km\") return nilai * 1000;\n        if (satuan == \"cm\") return nilai / 100;\n        if (satuan == \"mm\") return nilai / 1000;\n        return nilai;\n    }\n\n    static double DariMeter(double m, string satuan)\n    {\n        if (satuan == \"km\") return m / 1000;\n        if (satuan == \"cm\") return m * 100;\n        if (satuan == \"mm\") return m * 1000;\n        return m;\n    }\n\n    static string Format(double nilai)\n    {\n        return nilai.ToString(\"0.##\", CultureInfo.InvariantCulture);\n    }\n\n    public static void Main()\n    {\n        string jenis = Console.ReadLine();\n        double nilai = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture);\n        string dari = Console.ReadLine();\n        string ke = Console.ReadLine();\n\n        double hasil;\n        if (jenis == \"suhu\")\n        {\n            hasil = DariCelsius(KeCelsius(nilai, dari), ke);\n        }\n        else\n        {\n            hasil = DariMeter(KeMeter(nilai, dari), ke);\n        }\n\n        Console.WriteLine(Format(nilai) + \" \" + dari + \" = \" + Format(hasil) + \" \" + ke);\n    }\n}",
          tests: [
            { stdin: "suhu\n25\nC\nF", expectedOutput: "25 C = 77 F" },
            { stdin: "panjang\n2.5\nkm\nm", expectedOutput: "2.5 km = 2500 m" },
            { stdin: "suhu\n212\nF\nC", expectedOutput: "212 F = 100 C", hidden: true },
          ],
          hints: [
            "Fahrenheit ke Celsius: kurangi 32 lalu kali 5 bagi 9; arah sebaliknya kali 9 bagi 5 lalu tambah 32.",
            "cm ke meter mengecil: bagi 100. km ke meter membesar: kali 1000.",
            "Jenis yang diarahkan ke tabel suhu adalah kata suhu; selain itu masuk tabel panjang.",
          ],
        },
      ],
    },
    {
      slug: "lap-checklist-kerja",
      title: "Checklist Kesiapan Kerja",
      summary: "Kebiasaan yang membedakan kode latihan dari kode produksi: commit, test, komunikasi.",
      steps: [
        {
          kind: "theory",
          title: "Yang dilihat tim, bukan algoritmanya",
          body: "Perbedaan kode latihan dan kode kerja jarang soal algoritma; lebih sering soal kebiasaan. Yang membuat rekan satu tim tenang: version control dengan commit kecil dan pesan yang menjelaskan kenapa, bukan hanya apa; test yang lulus sebelum kode digabung; error ditangani di tepi program; dan tidak ada cetakan diagnosa yang tertinggal di cabang utama.\n\nKebiasaan berkomunikasi sama pentingnya: saat spesifikasi kabur, tanyakan lebih awal sambil menawarkan dua opsi, jangan mendiamkan sampai tenggat; saat terhenti lebih dari beberapa puluh menit, minta bantuan sambil membawa ringkasan apa yang sudah dicoba. Keduanya tanda kedewasaan teknis, bukan kelemahan.\n\nChecklist sebelum menyerahkan pekerjaan: program jalan tanpa warning yang berarti; perilaku baru tertutup test; nama konsisten dengan sisa proyek; log tertulis di titik penting; README singkat menjelaskan cara menjalankan. Daftar pendek ini yang paling terasa oleh tim, jauh lebih dari trik apa pun.",
        },
        {
          kind: "quiz",
          question: "Kebiasaan version control mana yang paling sesuai praktik kerja tim?",
          options: [
            "Commit besar sekali sebulan supaya riwayatnya pendek",
            "Commit kecil dengan pesan yang menjelaskan perubahan dan alasannya",
            "Pesan commit kosong asal cepat selesai",
            "Menyimpan pekerjaan di folder pribadi tanpa version control",
          ],
          answer: 1,
          explanation:
            "Commit kecil dengan pesan yang jelas membuat riwayat bisa ditelusuri, perubahan mudah ditinjau, dan pembatalan sebagian menjadi mungkin tanpa merusak sisanya.",
        },
      ],
    },
    {
      slug: "lap-ekosistem-dotnet-nuget",
      title: "Ekosistem .NET dan NuGet",
      summary: ".NET Framework vs .NET modern, NuGet sebagai manajer paket, pustaka yang sering dipakai.",
      steps: [
        {
          kind: "theory",
          title: "Dua generasi, satu fondasi",
          body: "Dunia C# kini terbelah dua generasi. .NET Framework adalah generasi klasik: hanya berjalan di Windows, dengan compiler `csc` yang dipakai pelatihan ini (bahasa setara C# 5). .NET modern, yang dulu bernama .NET Core dan kini dinomori .NET 6, .NET 8, dan seterusnya, lintas platform, terbuka, dan menerima fitur bahasa baru: string interpolation `$\"...\"`, record, pattern matching, dan top-level statement. Semua itu hidup di dunia modern; fondasi yang kamu bangun di jalur ini tetap terpakai apa adanya di keduanya.\n\nNuGet adalah manajer paket .NET: katalog pustaka pihak ketiga yang dipasang, diperbarui, dan dilepas lewat `dotnet add package NamaPaket` atau antarmuka Visual Studio. Daftar paket dan versinya tercatat di berkas proyek `.csproj`, sehingga satu perintah `dotnet restore` membuat seluruh tim memasang versi yang sama.\n\nPustaka yang hampir pasti ditemui saat bekerja: Newtonsoft.Json atau System.Text.Json untuk JSON, Serilog untuk log, Dapper dan Entity Framework Core untuk database, serta xUnit untuk test. Keterampilan yang menyertainya: membaca dokumentasi dan contoh resmi pustaka sebelum bertanya ke siapa pun.",
          code: {
            language: "xml",
            content:
              "<Project Sdk=\"Microsoft.NET.Sdk\">\n  <PropertyGroup>\n    <TargetFramework>net8.0</TargetFramework>\n  </PropertyGroup>\n  <ItemGroup>\n    <PackageReference Include=\"Newtonsoft.Json\" Version=\"13.0.3\" />\n  </ItemGroup>\n</Project>",
            caption: "Paket dan versinya tercatat di .csproj; satu perintah restore untuk seluruh tim.",
          },
        },
        {
          kind: "quiz",
          question: "Untuk apa NuGet dipakai di ekosistem .NET?",
          options: [
            "Mengompres gambar untuk web",
            "Mengelola pustaka pihak ketiga: memasang, memperbarui, dan mencatat versinya",
            "Men-debug aplikasi langkah demi langkah",
            "Membuat desain antarmuka aplikasi",
          ],
          answer: 1,
          explanation:
            "NuGet adalah manajer paket .NET. Pustaka dipasang lewat dotnet add package atau Visual Studio, dan daftar paketnya tercatat di berkas .csproj.",
        },
      ],
    },
    {
      slug: "lap-rekap-jalur-lanjutan",
      title: "Rekap dan Jalur Lanjutan",
      summary: "Rekap sembilan modul, arah lanjutan yang alami, dan cara menjaga kemampuan.",
      steps: [
        {
          kind: "theory",
          title: "Yang sudah kamu punya, dan yang berikutnya",
          body: "Sampai di sini sembilan modul telah lewat: idiom dan tipe C#, koleksi dan generics, OOP dari class sampai interface, exception dan file, LINQ dari Where sampai GroupBy, async dan Task, kode rapi dan teruji, sampai program CLI multi-file dengan parsing argumen, konfigurasi, dan logging. Modal ini cukup untuk membaca dan menulis program C# konsol yang layak masuk repositori.\n\nArah lanjutan yang alami setelah jalur ini: web dengan ASP.NET Core untuk membangun API dan aplikasi server, database dengan Entity Framework Core, test otomatis dengan xUnit sebagai kelanjutan alat cek manual di modul 8, dan arsitektur aplikasi: dependency injection yang sudah terpasang di .NET modern serta pemisahan lapisan yang dibahas di prinsip SOLID.\n\nCara menjaga kemampuan ini hidup hanya satu: kerja nyata. Bangun satu proyek sendiri sampai tuntas walau kecil, baca kode proyek terbuka untuk melihat keputusan orang lain, dan tulis ulang proyek lamamu dengan standar modul 8. Jalur mendalam C# resmi tuntas; berikutnya panggungnya milikmu.",
        },
        {
          kind: "quiz",
          question: "Kerangka kerja yang paling alami untuk lanjut membangun aplikasi web dengan C#?",
          options: ["ASP.NET Core", "Django", "Laravel", "Ruby on Rails"],
          answer: 0,
          explanation:
            "ASP.NET Core adalah kerangka web dari .NET untuk API dan aplikasi server. Django milik Python, Laravel milik PHP, dan Ruby on Rails milik Ruby.",
        },
      ],
    },
  ],
};
