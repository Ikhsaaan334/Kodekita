import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "csharp",
  moduleRange: [2, 3],
  modules: [
    {
      title: "OOP Inti",
      description: "Class, property, access modifier, static, constructor, this.",
    },
    {
      title: "OOP Lanjut dan Record",
      description: "Interface, inheritance, abstract, record, dan equality.",
    },
  ],
  lessons: [
    // ==================== MODUL 2: OOP Inti ====================
    {
      slug: "oop-class-dan-object",
      title: "Class dan Object",
      summary: "Definisikan cetakan dengan class, cetak objectnya dengan new, dan isi fieldnya.",
      steps: [
        {
          kind: "theory",
          title: "Class adalah cetakan, object adalah hasilnya",
          body: "Setelah dua modul menulis program yang berjalan dari atas ke bawah, sekarang kamu mengelompokkan data dan perilaku ke dalam satu wadah. Class adalah cetakan yang mendefinisikan data apa yang dimiliki dan perilaku apa yang bisa dilakukan. Object adalah hasil cetakannya: satu wujud nyata di memori yang dibuat dengan kata kunci `new`. Satu class bisa mencetak banyak object yang saling lepas.\n\nData yang dimiliki object disebut field. Class `Siswa` di bawah punya field `Nama` dan `Umur`; setiap object `Siswa` punya salinannya sendiri, jadi mengubah `a.Nama` tidak menyentuh `b.Nama`. Untuk mengakses field dari luar, pakai tanda titik: `a.Nama = \"Budi\";` mengisi field, dan `a.Nama` membacanya.\n\nKonvensi penamaan C#: nama class memakai PascalCase (`Siswa`, `RekeningBank`), field yang terbuka dari luar juga PascalCase, sedangkan variabel lokal memakai camelCase. Kebiasaan ini membuat kode C# lain mudah kamu baca balik.",
          code: {
            language: "csharp",
            content:
              'using System;\n\npublic class Siswa\n{\n    public string Nama;\n    public int Umur;\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Siswa a = new Siswa();\n        Siswa b = new Siswa();\n        a.Nama = "Budi";\n        a.Umur = 17;\n        b.Nama = "Sinta";\n        b.Umur = 16;\n\n        Console.WriteLine(a.Nama + " (" + a.Umur + " tahun)");\n        Console.WriteLine(b.Nama + " (" + b.Umur + " tahun)");\n    }\n}',
            caption: "Dua object dari satu class, masing-masing dengan datanya sendiri.",
          },
        },
        {
          kind: "quiz",
          question: "Apa hubungan class dan object di C#?",
          options: [
            "Class adalah variabel, object adalah tipe datanya",
            "Class adalah cetakan, object adalah instance nyata yang dibuat darinya dengan new",
            "Keduanya sama, hanya beda penulisan",
            "Satu class hanya boleh punya satu object",
          ],
          answer: 1,
          explanation:
            "Class mendefinisikan bentuk dan perilaku; setiap pemanggilan new membuat satu object baru yang berdiri sendiri di memori.",
        },
        {
          kind: "code",
          title: "Cetak profil siswa",
          prompt:
            "Lengkapi cetakan dan objectnya: deklarasi class `Siswa` serta pembuatan object dengan `new`. Program membaca nama lalu umur, dan mencetak `Nama - Umur`. Ganti dua `___` dengan kata kunci yang tepat.",
          mode: "fill",
          template:
            'using System;\n\n___ Siswa\n{\n    public string Nama;\n    public int Umur;\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Siswa a = ___ Siswa();\n        a.Nama = Console.ReadLine();\n        a.Umur = Convert.ToInt32(Console.ReadLine());\n        Console.WriteLine("{0} - {1}", a.Nama, a.Umur);\n    }\n}',
          solution:
            'using System;\n\npublic class Siswa\n{\n    public string Nama;\n    public int Umur;\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Siswa a = new Siswa();\n        a.Nama = Console.ReadLine();\n        a.Umur = Convert.ToInt32(Console.ReadLine());\n        Console.WriteLine("{0} - {1}", a.Nama, a.Umur);\n    }\n}',
          tests: [
            { stdin: "Budi\n17", expectedOutput: "Budi - 17" },
            { stdin: "Sinta\n16", expectedOutput: "Sinta - 16" },
            { stdin: "Wati\n18", expectedOutput: "Wati - 18", hidden: true },
          ],
          hints: [
            "Cetakan dideklarasikan dengan kata kunci class, object dibuat dengan kata kunci new.",
            "Bentuknya: public class Siswa untuk cetakan, dan Siswa a = new Siswa(); untuk objectnya.",
          ],
        },
      ],
    },
    {
      slug: "oop-field-dan-method",
      title: "Field dan Method",
      summary: "Field menyimpan keadaan object, method mengolahnya dan mengembalikan hasil.",
      steps: [
        {
          kind: "theory",
          title: "Data dipegang field, kerja dilakukan method",
          body: "Field menyimpan keadaan object; method mendefinisikan apa yang bisa dilakukan. Method yang ditulis di dalam class otomatis melihat semua field object tempat ia hidup, jadi `Total()` cukup membaca `HargaSatuan` dan `Jumlah` tanpa parameter apa pun.\n\nSetiap method menyebut tipe kembaliannya. `int Total()` menjanjikan angka `int`, dan kata `return` mengirim nilainya ke pemanggil. Method yang tidak mengembalikan apa pun bertipe `void`, misalnya method yang tugasnya hanya mencetak.\n\nPisahkan urusan menghitung dari urusan mencetak bila memungkinkan: method yang mengembalikan nilai lebih mudah dipakai ulang, sementara pemanggil memutuskan hasilnya mau dicetak, disimpan, atau dijumlahkan. Kebiasaan kecil ini terasa manfaatnya saat class kamu bertambah besar.",
          code: {
            language: "csharp",
            content:
              'using System;\n\npublic class Pesanan\n{\n    public int HargaSatuan;\n    public int Jumlah;\n\n    public int Total()\n    {\n        return HargaSatuan * Jumlah;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Pesanan p = new Pesanan();\n        p.HargaSatuan = 5000;\n        p.Jumlah = 3;\n        Console.WriteLine("Total: {0}", p.Total());\n    }\n}',
            caption: "Total() membaca field object sendiri tanpa parameter.",
          },
        },
        {
          kind: "quiz",
          question: "Apa arti void sebagai tipe kembalian sebuah method?",
          options: [
            "Method itu tidak mengembalikan nilai apa pun",
            "Method itu mengembalikan angka nol",
            "Method itu tidak boleh punya parameter",
            "Method itu hanya boleh dipanggil sekali",
          ],
          answer: 0,
          explanation:
            "void berarti tanpa nilai kembalian. Methodnya tetap bisa bekerja (misalnya mencetak), hanya tidak mengirim hasil ke pemanggil.",
        },
        {
          kind: "code",
          title: "Hitung total pesanan",
          prompt:
            "Lengkapi method `Total` pada class `Pesanan`: tipe kembaliannya int, isinya mengembalikan hasil kali kedua field. Dua `___` menantimu.",
          mode: "fill",
          template:
            'using System;\n\npublic class Pesanan\n{\n    public int HargaSatuan;\n    public int Jumlah;\n\n    public ___ Total()\n    {\n        ___;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Pesanan p = new Pesanan();\n        p.HargaSatuan = Convert.ToInt32(Console.ReadLine());\n        p.Jumlah = Convert.ToInt32(Console.ReadLine());\n        Console.WriteLine("Total: {0}", p.Total());\n    }\n}',
          solution:
            'using System;\n\npublic class Pesanan\n{\n    public int HargaSatuan;\n    public int Jumlah;\n\n    public int Total()\n    {\n        return HargaSatuan * Jumlah;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Pesanan p = new Pesanan();\n        p.HargaSatuan = Convert.ToInt32(Console.ReadLine());\n        p.Jumlah = Convert.ToInt32(Console.ReadLine());\n        Console.WriteLine("Total: {0}", p.Total());\n    }\n}',
          tests: [
            { stdin: "5000\n3", expectedOutput: "Total: 15000" },
            { stdin: "2500\n4", expectedOutput: "Total: 10000" },
            { stdin: "700\n6", expectedOutput: "Total: 4200", hidden: true },
          ],
          hints: [
            "Tipe kembalian method ditulis sebelum namanya, tepat setelah public.",
            "Untuk mengirim hasil keluar dari method, pakai return diikuti perhitungannya.",
          ],
        },
      ],
    },
    {
      slug: "oop-access-modifier",
      title: "Access Modifier: public dan private",
      summary: "public bebas diakses, private terkunci di dalam class; di sinilah encapsulation dimulai.",
      steps: [
        {
          kind: "theory",
          title: "public untuk dibaca siapa saja, private untuk urusan dalam rumah",
          body: "Setiap member class punya access modifier yang menentukan siapa yang boleh menyentuhnya. `public` berarti bebas diakses dari mana saja; `private` berarti hanya kode di dalam class yang sama. Membuat field private adalah keputusan desain: selama field bisa diisi siapa saja, class tidak punya daya kontrol atas isi itu.\n\nDengan field private, satu-satunya jalan masuk adalah method atau property yang kamu sediakan. Di situ kamu bisa memvalidasi (misalnya menolak sandi yang salah), memberi tahu pemanggil, atau mencatat perubahan. Inilah encapsulation: membungkus data bersama aturan mainnya, bukan sekadar menutup sesuatu.\n\nDua fakta yang sering ditanyakan: member class tanpa modifier otomatis private, dan class tingkat atas tanpa modifier otomatis internal yang berarti boleh dipakai di dalam satu project saja. Ada juga modifier `protected` yang akan kamu jumpai di modul berikutnya saat berbicara tentang inheritance.",
          code: {
            language: "csharp",
            content:
              'using System;\n\npublic class Akun\n{\n    private string sandi = "rahasia123";\n\n    public bool SandiBenar(string coba)\n    {\n        return sandi == coba;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Akun a = new Akun();\n        Console.WriteLine(a.SandiBenar("tebakan"));\n        // a.sandi = "baru";  // ditolak compiler: sandi private\n    }\n}',
            caption: "sandi tidak bisa disentuh dari luar; pemeriksaannya lewat method public.",
          },
        },
        {
          kind: "quiz",
          question: "Kata kunci yang membatasi akses member hanya dari dalam class yang sama adalah...",
          options: ["sealed", "private", "static", "internal"],
          answer: 1,
          explanation:
            "private mengunci member di dalam class-nya. sealed mengunci class dari diwarisi, static memindahkan kepemilikan ke class, dan internal membatasi per project, bukan per class.",
        },
        {
          kind: "quiz",
          question: "Tanpa modifier apa pun, member di dalam class secara bawaan bersifat...",
          options: ["public", "internal", "private", "protected"],
          answer: 2,
          explanation:
            "Bawaan member class adalah private. Itu sebabnya lupa menulis public sering membuat member tidak terlihat dari luar.",
        },
      ],
    },
    {
      slug: "oop-property-get-set",
      title: "Property get dan set",
      summary: "Property klasik dengan backing field: get, set, validasi, dan kata value.",
      steps: [
        {
          kind: "theory",
          title: "Property: pintu berpagar untuk field",
          body: "Property terlihat seperti field saat dipakai (`t.Saldo = 50000`), tetapi di dalamnya ada dua blok kecil: `get` yang berjalan saat dibaca dan `set` yang berjalan saat diisi. Property klasik menyimpan datanya di backing field private, misalnya `saldo`, lalu membukanya lewat property publik `Saldo`.\n\nDi dalam blok `set`, kata `value` adalah nilai yang dikirim pemanggil. Di sinilah validasi hidup: menolak angka negatif, membatasi rentang, atau menjalankan efek lain. Pemanggil tidak tahu dan tidak perlu tahu; ia tetap menulis seperti mengisi field biasa.\n\nProperty juga boleh punya `get` saja sehingga hanya-baca dari luar, atau `set` saja yang jarang dipakai. Bentuk property dan field tersembunyi dari pemanggil, dan itulah gunanya: suatu hari kamu bisa mengubah field menjadi property (atau sebaliknya) tanpa merombak kode pemanggil.",
          code: {
            language: "csharp",
            content:
              'using System;\n\npublic class Produk\n{\n    private int stok;\n\n    public int Stok\n    {\n        get { return stok; }\n        set\n        {\n            if (value < 0)\n            {\n                Console.WriteLine("Stok tidak boleh negatif");\n                stok = 0;\n            }\n            else\n            {\n                stok = value;\n            }\n        }\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Produk p = new Produk();\n        p.Stok = 10;\n        Console.WriteLine(p.Stok);\n        p.Stok = -3;\n        Console.WriteLine(p.Stok);\n    }\n}',
            caption: "Isi negatif ditolak di blok set; yang tersimpan tetap nilai yang sah.",
          },
        },
        {
          kind: "quiz",
          question: "Di dalam blok set sebuah property, kata value merujuk pada...",
          options: [
            "field privatnya",
            "nilai yang dikirim pemanggil",
            "nama property",
            "nilai kembalian blok get",
          ],
          answer: 1,
          explanation:
            "value adalah kata kunci khusus di blok set yang berisi nilai yang ingin disimpan, misalnya angka 10 pada t.Stok = 10.",
        },
        {
          kind: "code",
          title: "Saldo yang menolak minus",
          prompt:
            "Lengkapi property `Saldo` pada class `Tabungan`: blok `get` mengembalikan backing field, dan blok `set` hanya menerima nilai yang tidak negatif (jika negatif, saldo tetap 0). Dua `___` menantimu.",
          mode: "fill",
          template:
            'using System;\n\npublic class Tabungan\n{\n    private int saldo;\n\n    public int Saldo\n    {\n        get { ___; }\n        set\n        {\n            if (value < 0)\n            {\n                saldo = 0;\n            }\n            else\n            {\n                ___ = value;\n            }\n        }\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Tabungan t = new Tabungan();\n        t.Saldo = Convert.ToInt32(Console.ReadLine());\n        Console.WriteLine("Saldo: {0}", t.Saldo);\n    }\n}',
          solution:
            'using System;\n\npublic class Tabungan\n{\n    private int saldo;\n\n    public int Saldo\n    {\n        get { return saldo; }\n        set\n        {\n            if (value < 0)\n            {\n                saldo = 0;\n            }\n            else\n            {\n                saldo = value;\n            }\n        }\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Tabungan t = new Tabungan();\n        t.Saldo = Convert.ToInt32(Console.ReadLine());\n        Console.WriteLine("Saldo: {0}", t.Saldo);\n    }\n}',
          tests: [
            { stdin: "50000", expectedOutput: "Saldo: 50000" },
            { stdin: "-100", expectedOutput: "Saldo: 0" },
            { stdin: "0", expectedOutput: "Saldo: 0", hidden: true },
          ],
          hints: [
            "Blok get wajib mengembalikan sesuatu: isi backing field saldo.",
            "Di blok else, simpan nilai yang sudah sah: saldo = value.",
          ],
        },
      ],
    },
    {
      slug: "oop-auto-property",
      title: "Auto-Property dan Nilai Bawaan",
      summary: "{ get; set; } dalam satu baris, nilai bawaan tiap tipe, dan catatan versinya.",
      steps: [
        {
          kind: "theory",
          title: "Getter dan setter tanpa tulisan panjang",
          body: "Kalau `get` dan `set` tidak butuh logika tambahan, C# memungkinkan menuliskannya dalam satu baris: `public int Level { get; set; }`. Compiler diam-diam membuat backing field untukmu dengan nama yang dihasilkannya sendiri, dan kamu tetap memakainya seperti field biasa. Auto-property menjadi gaya bawaan untuk data yang tidak butuh validasi.\n\nKalau validasi dibutuhkan nanti, cukup ubah auto-property menjadi property penuh dengan backing field; kode pemanggil tidak berubah karena bentuk pemakaiannya sama. Fleksibilitas inilah alasan banyak tim melarang field publik dan mewajibkan auto-property.\n\nSatu catatan versi: member class yang tidak pernah diisi punya nilai bawaan, yaitu `null` untuk tipe referensi, `0` untuk angka, dan `false` untuk bool. Sejak C# 6 ada auto-property initializer seperti `public int Level { get; set; } = 1;`, tetapi platform ini menjalankan C# 5, jadi nilai awal diisi lewat constructor seperti pada contoh di bawah.",
          code: {
            language: "csharp",
            content:
              'using System;\n\npublic class Profil\n{\n    public string Nama { get; set; }\n    public int Level { get; set; }\n    public bool Aktif { get; set; }\n\n    public Profil()\n    {\n        Nama = "Tanpa nama";\n        Level = 1;\n        Aktif = true;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Profil p = new Profil();\n        Console.WriteLine("Nama: " + p.Nama);\n        Console.WriteLine("Level: " + p.Level);\n        Console.WriteLine("Aktif: " + p.Aktif);\n    }\n}',
            caption: "Pada C# 5, nilai awal auto-property diisi di constructor.",
          },
        },
        {
          kind: "quiz",
          question: "Penulisan auto-property yang benar untuk int Stok adalah...",
          options: [
            "public int Stok { get set; }",
            "public int Stok { get; set; }",
            "public int Stok = { get; set; };",
            "auto int Stok;",
          ],
          answer: 1,
          explanation:
            "Auto-property ditulis dengan aksesor di dalam kurung kurawal, dipisah titik koma: { get; set; }.",
        },
        {
          kind: "quiz",
          question: "Auto-property bertipe bool yang tidak pernah diisi nilainya bernilai...",
          options: ["null", "true", "false", "error saat kompilasi"],
          answer: 2,
          explanation:
            "Nilai bawaan bool adalah false. Angka bernilai 0 dan tipe referensi bernilai null sampai diisi.",
        },
      ],
    },
    {
      slug: "oop-constructor-overloading",
      title: "Constructor dan Overloading",
      summary: "Isi object sejak lahir dengan constructor, dan sediakan beberapa bentuk lewat overloading.",
      steps: [
        {
          kind: "theory",
          title: "Constructor: rutinitas saat object lahir",
          body: "Constructor adalah method istimewa yang berjalan tepat saat `new` dipanggil. Namanya harus sama dengan nama class, dan ia tidak punya tipe kembalian, bahkan tidak `void`. Gunanya jelas: field terisi sejak detik pertama, sehingga object tidak pernah hidup dalam keadaan setengah jadi.\n\nSatu class boleh punya beberapa constructor sekaligus, asal daftar parameternya berbeda. Ini disebut overloading. `new Tiket(\"Sinta\")` memilih versi satu parameter, `new Tiket(\"Budi\", 120000)` memilih versi dua parameter; compiler menentukannya dari jumlah dan tipe argumen.\n\nPerhatian kecil yang sering menjebak: constructor tanpa parameter hanya didapat gratis jika kamu belum menulis constructor apa pun. Begitu satu constructor ditulis, versi tanpa parameter harus ditulis sendiri bila masih diperlukan.",
          code: {
            language: "csharp",
            content:
              'using System;\n\npublic class Tiket\n{\n    public string Nama;\n    public int Harga;\n\n    public Tiket(string nama)\n    {\n        Nama = nama;\n        Harga = 50000;\n    }\n\n    public Tiket(string nama, int harga)\n    {\n        Nama = nama;\n        Harga = harga;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Tiket a = new Tiket("Sinta");\n        Tiket b = new Tiket("Budi", 120000);\n        Console.WriteLine("{0}: Rp {1}", a.Nama, a.Harga);\n        Console.WriteLine("{0}: Rp {1}", b.Nama, b.Harga);\n    }\n}',
            caption: "Compiler memilih constructor dari jumlah dan tipe argumen.",
          },
        },
        {
          kind: "quiz",
          question: "Kapan class mendapat constructor tanpa parameter secara otomatis?",
          options: [
            "Selalu, apa pun yang ditulis di classnya",
            "Hanya jika tidak ada constructor lain yang ditulis",
            "Hanya jika semua fieldnya public",
            "Hanya untuk class static",
          ],
          answer: 1,
          explanation:
            "Constructor tanpa parameter hanya disediakan compiler saat class belum punya satu pun constructor. Setelah kamu menulis satu, versi tanpa parameter harus dibuat sendiri bila dibutuhkan.",
        },
        {
          kind: "code",
          title: "Constructor yang gagal dikompilasi",
          prompt:
            "Class `Tiket` punya dua constructor, tetapi salah satunya ditulis dengan cara yang tidak sah sehingga kompilasi gagal. Baca pesan errornya, perbaiki satu kesalahan itu tanpa mengubah perilaku program, lalu jalankan sampai tesnya lulus.",
          mode: "fix",
          template:
            'using System;\n\npublic class Tiket\n{\n    public string Nama;\n    public int Harga;\n\n    public void Tiket(string nama)\n    {\n        Nama = nama;\n        Harga = 50000;\n    }\n\n    public Tiket(string nama, int harga)\n    {\n        Nama = nama;\n        Harga = harga;\n    }\n\n    public void Cetak()\n    {\n        Console.WriteLine("{0}: Rp {1}", Nama, Harga);\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        string nama = Console.ReadLine();\n        string pilihan = Console.ReadLine();\n\n        Tiket t;\n        if (pilihan == "reguler")\n        {\n            t = new Tiket(nama);\n        }\n        else\n        {\n            int harga = Convert.ToInt32(Console.ReadLine());\n            t = new Tiket(nama, harga);\n        }\n        t.Cetak();\n    }\n}',
          solution:
            'using System;\n\npublic class Tiket\n{\n    public string Nama;\n    public int Harga;\n\n    public Tiket(string nama)\n    {\n        Nama = nama;\n        Harga = 50000;\n    }\n\n    public Tiket(string nama, int harga)\n    {\n        Nama = nama;\n        Harga = harga;\n    }\n\n    public void Cetak()\n    {\n        Console.WriteLine("{0}: Rp {1}", Nama, Harga);\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        string nama = Console.ReadLine();\n        string pilihan = Console.ReadLine();\n\n        Tiket t;\n        if (pilihan == "reguler")\n        {\n            t = new Tiket(nama);\n        }\n        else\n        {\n            int harga = Convert.ToInt32(Console.ReadLine());\n            t = new Tiket(nama, harga);\n        }\n        t.Cetak();\n    }\n}',
          tests: [
            { stdin: "Sinta\nreguler", expectedOutput: "Sinta: Rp 50000" },
            { stdin: "Budi\nvip\n120000", expectedOutput: "Budi: Rp 120000" },
            { stdin: "Gilang\nvip\n75000", expectedOutput: "Gilang: Rp 75000", hidden: true },
          ],
          hints: [
            "Pesan errornya menyebut member tidak boleh bernama sama dengan class-nya.",
            "Constructor tidak punya tipe kembalian; hapus satu kata di depan Tiket(string nama).",
          ],
        },
      ],
    },
    {
      slug: "oop-this-keyword",
      title: "this dalam Method dan Constructor",
      summary: "this merujuk instance saat ini, dan : this(...) mendelegasikan ke constructor lain.",
      steps: [
        {
          kind: "theory",
          title: "this: menunjuk diri sendiri",
          body: "Di dalam method instance, kata kunci `this` adalah referensi ke object yang sedang menjalankan method itu. Kegunaan paling umum: membedakan field dari parameter yang namanya sama. `this.sisi = sisi;` berarti field milik object ini diisi dari parameter bernama sisi.\n\n`this` juga bisa dipakai untuk memanggil method lain milik object yang sama, atau dikirim sebagai argumen bila pihak lain butuh merujuk ke object ini. Kapan pun kamu menulis `this.`, maksudnya tegas: milik instance ini, bukan milik parameter atau variabel lokal.\n\nConstructor punya bentuk khusus: `public Kotak(int s, int t) : this(s, t, 0)` artinya panggil dulu constructor lain di class yang sama yang cocok dengan argumen itu, baru jalankan sisa badan constructor. Pola ini mencegah logika awal yang sama ditulis dua kali, dan di modul berikutnya bentuknya muncul lagi sebagai `base(...)` untuk memanggil constructor induk.",
          code: {
            language: "csharp",
            content:
              'using System;\n\npublic class Kotak\n{\n    public int Sisi;\n    public int Tinggi;\n\n    public Kotak(int sisi, int tinggi)\n    {\n        this.Sisi = sisi;      // field vs parameter yang namanya sama\n        this.Tinggi = tinggi;\n    }\n\n    public Kotak(int sisi) : this(sisi, sisi)\n    {\n        // delegasi ke constructor utama\n    }\n\n    public int Volume()\n    {\n        return this.Sisi * this.Sisi * this.Tinggi;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Kotak k1 = new Kotak(3, 4);\n        Kotak k2 = new Kotak(2);\n        Console.WriteLine(k1.Volume());\n        Console.WriteLine(k2.Volume());\n    }\n}',
            caption: ": this(...) menyuruh constructor lain berjalan lebih dulu.",
          },
        },
        {
          kind: "quiz",
          question: "Di dalam method instance, this merujuk pada...",
          options: [
            "class-nya sebagai tipe",
            "object yang sedang menjalankan method",
            "parameter pertama method",
            "field static milik class",
          ],
          answer: 1,
          explanation:
            "this adalah referensi ke instance yang sedang aktif. Dua object dari class yang sama punya this yang berbeda saat methodnya jalan.",
        },
        {
          kind: "quiz",
          question: "Pada `public Kotak(int s) : this(s, s)`, bagian `: this(s, s)` berarti...",
          options: [
            "membuat object Kotak baru di dalam constructor",
            "memanggil constructor lain di class yang sama lebih dulu",
            "memanggil constructor class induk",
            "mengisi field s dua kali",
          ],
          answer: 1,
          explanation:
            "Constructor initializer dengan this memilih constructor lain di class yang sama yang cocok dengan argumennya, menjalankannya lebih dulu, lalu melanjutkan badan constructor semula.",
        },
      ],
    },
    {
      slug: "oop-static-member",
      title: "Static Member dan Helper Class",
      summary: "Member milik class, diakses lewat nama class, dan helper class static.",
      steps: [
        {
          kind: "theory",
          title: "Static: milik class, bukan milik object",
          body: "Member biasa hidup di object: tiap `Siswa` punya `Nama` sendiri. Member `static` hidup di class: hanya ada satu untuk semua, dan diakses lewat nama class, seperti `Convert.ToInt32` dan `Math.Max` yang selama ini kamu pakai tanpa membuat object-nya dulu.\n\nField static dipakai untuk keadaan yang benar-benar bersama, misalnya penghitung id: setiap pemanggilan `GeneratorId.Buat()` menaikkan satu angka yang sama. Method static bekerja hanya dari parameternya; ia tidak bisa membaca field instance karena tidak ada object yang melingkupinya.\n\nBila sebuah class isinya cuma kumpulan method static (misalnya `Matematika` berisi rumus), tandai class-nya `static` agar tidak bisa di-`new`. Sebaliknya, jangan mengubah kebutuhan instance menjadi static hanya supaya praktis: begitu ada keadaan bersama yang berubah, dua bagian program bisa saling menimpa tanpa sadar.",
          code: {
            language: "csharp",
            content:
              'using System;\n\npublic class GeneratorId\n{\n    public static int Berikutnya = 1;\n\n    public static string Buat(string awalan)\n    {\n        string id = awalan + "-" + Berikutnya;\n        Berikutnya++;\n        return id;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Console.WriteLine(GeneratorId.Buat("USR"));\n        Console.WriteLine(GeneratorId.Buat("USR"));\n        Console.WriteLine(GeneratorId.Buat("LOG"));\n        Console.WriteLine("Total id: " + (GeneratorId.Berikutnya - 1));\n    }\n}',
            caption: "Satu angka static dipakai bersama oleh semua pemanggil.",
          },
        },
        {
          kind: "quiz",
          question: "Method static dipanggil lewat...",
          options: [
            "nama object yang sudah dibuat",
            "nama class-nya",
            "kata kunci this",
            "kata kunci new",
          ],
          answer: 1,
          explanation:
            "Karena static milik class, pemanggilannya lewat nama class: Matematika.Fpb(12, 18), tanpa membuat object.",
        },
        {
          kind: "code",
          title: "Helper class Matematika",
          prompt:
            "Lengkapi helper class: method `Fpb` harus static supaya bisa dipanggil lewat nama class tanpa object. Algoritma Euclid di dalamnya sudah ditulis; fokuskan dirimu pada penanda static dan pemanggilannya. Dua `___` menantimu.",
          mode: "fill",
          template:
            'using System;\n\npublic class Matematika\n{\n    public ___ int Fpb(int a, int b)\n    {\n        while (b != 0)\n        {\n            int sisa = a % b;\n            a = b;\n            b = sisa;\n        }\n        return a;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        int a = Convert.ToInt32(Console.ReadLine());\n        int b = Convert.ToInt32(Console.ReadLine());\n        Console.WriteLine("FPB: {0}", Matematika.___(a, b));\n    }\n}',
          solution:
            'using System;\n\npublic class Matematika\n{\n    public static int Fpb(int a, int b)\n    {\n        while (b != 0)\n        {\n            int sisa = a % b;\n            a = b;\n            b = sisa;\n        }\n        return a;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        int a = Convert.ToInt32(Console.ReadLine());\n        int b = Convert.ToInt32(Console.ReadLine());\n        Console.WriteLine("FPB: {0}", Matematika.Fpb(a, b));\n    }\n}',
          tests: [
            { stdin: "12\n18", expectedOutput: "FPB: 6" },
            { stdin: "7\n13", expectedOutput: "FPB: 1" },
            { stdin: "100\n75", expectedOutput: "FPB: 25", hidden: true },
          ],
          hints: [
            "Method milik class ditandai kata static sebelum tipe kembaliannya.",
            "Panggil dengan nama class lalu nama methodnya: Matematika.Fpb(a, b).",
          ],
        },
      ],
    },
    {
      slug: "oop-const-vs-static-readonly",
      title: "const vs static readonly",
      summary: "Dua cara mengunci nilai: const saat kompilasi, static readonly saat runtime.",
      steps: [
        {
          kind: "theory",
          title: "Nilai yang tidak boleh diganti, dua rasa",
          body: "Ada dua cara menyatakan nilai yang tak boleh diganti. `const` (misalnya `public const int HariPerMinggu = 7;`) dihitung saat kompilasi: nilainya harus konstanta yang sudah diketahui compiler, hanya untuk tipe sederhana (angka, bool, string, enum), dan otomatis bersifat static karena memang tidak ada tempatnya di object.\n\n`static readonly` (misalnya `public static readonly string DimulaiPada = ...;`) dikunci setelah diisi: nilainya boleh baru diketahui saat program berjalan, tipenya bebas, dan pengisiannya boleh di deklarasi atau di static constructor. Setelah itu tidak ada yang boleh menimpanya.\n\nAturan jempol: angka atau teks yang berlaku abadi pakai `const`; apa pun yang bergantung pada lingkungan, waktu, atau hasil pemanggilan method pakai `static readonly`. Keduanya ditulis PascalCase, dan keduanya membuat niat tidak boleh diubah tertulis jelas di kode.",
          code: {
            language: "csharp",
            content:
              'using System;\n\npublic class Pengaturan\n{\n    public const int HariPerMinggu = 7;\n    public static readonly string DimulaiPada = DateTime.Today.ToString("yyyy-MM-dd");\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Console.WriteLine("Hari per minggu: {0}", Pengaturan.HariPerMinggu);\n        Console.WriteLine("Dimulai pada: {0}", Pengaturan.DimulaiPada);\n        // Pengaturan.HariPerMinggu = 8;  // ditolak compiler\n    }\n}',
            caption: "const untuk konstanta murni; static readonly untuk nilai yang baru jelas saat runtime.",
          },
        },
        {
          kind: "quiz",
          question: "const secara implisit juga bersifat...",
          options: ["virtual", "static", "abstract", "protected"],
          answer: 1,
          explanation:
            "Nilai const menempel pada class, bukan pada object, sehingga selalu boleh diakses lewat nama class tanpa menulis static.",
        },
        {
          kind: "quiz",
          question:
            "Nilai yang baru diketahui saat program berjalan, misalnya hasil DateTime.Now, paling tepat disimpan dalam...",
          options: ["const", "static readonly", "variabel lokal saja", "parameter method"],
          answer: 1,
          explanation:
            "const menuntut nilai yang sudah pasti saat kompilasi. static readonly boleh diisi hasil pemanggilan method, lalu terkunci setelahnya.",
        },
      ],
    },
    {
      slug: "oop-latihan-rekening",
      title: "Latihan Gabungan: Class Rekening",
      summary: "Rangkai class utuh: property private set, constructor, dan aturan setor-tarik.",
      steps: [
        {
          kind: "theory",
          title: "Merangkai satu modul jadi satu class",
          body: "Saatnya merakit materi modul ini menjadi satu class utuh. `Rekening` menyimpan `Pemilik` dan `Saldo` sebagai auto-property dengan `private set`: siapa pun boleh membaca, tetapi perubahan hanya boleh lewat method milik class. Constructor mengisi keduanya sejak awal sehingga tidak ada rekening tanpa pemilik atau tanpa saldo awal.\n\nAturan mainnya ada di method: `Setor` selalu menambah, sedangkan `Tarik` memeriksa dulu apakah jumlah penarikan melebihi saldo. Kalau melebihi, class menolak dengan pesan dan saldo tidak tersentuh. Perhatikan bahwa `Main` tidak bisa mengotori saldo secara langsung; satu-satunya jalan adalah method yang punya aturan.\n\nBaca kerangka kodenya pelan-pelan dari atas ke bawah, lalu isi bagian yang kosong. Kalau tes pertama lulus tetapi tes kedua gagal, kemungkinan besar penolakan penarikanmu justru mengubah saldo; periksa kembali jalur else di `Tarik`.",
          code: {
            language: "csharp",
            content:
              'using System;\n\npublic class Rekening\n{\n    public string Pemilik { get; private set; }\n    public int Saldo { get; private set; }\n\n    public Rekening(string pemilik, int saldoAwal)\n    {\n        Pemilik = pemilik;\n        Saldo = saldoAwal;\n    }\n\n    public void Setor(int jumlah)\n    {\n        Saldo += jumlah;\n    }\n\n    public void Tarik(int jumlah)\n    {\n        if (jumlah > Saldo)\n        {\n            Console.WriteLine("Saldo tidak cukup");\n        }\n        else\n        {\n            Saldo -= jumlah;\n        }\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Rekening r = new Rekening("Budi", 100000);\n        r.Setor(50000);\n        r.Tarik(30000);\n        Console.WriteLine("Saldo {0}: {1}", r.Pemilik, r.Saldo);\n    }\n}',
            caption: "private set membuat saldo hanya bisa berubah lewat Setor dan Tarik.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa Saldo ditulis { get; private set; } dan bukan { get; set; }?",
          options: [
            "Supaya penulisannya lebih pendek",
            "Supaya perubahan saldo hanya bisa lewat method milik Rekening",
            "Supaya Saldo tidak bisa dibaca dari luar class",
            "Karena set publik tidak diizinkan C#",
          ],
          answer: 1,
          explanation:
            "get tetap publik sehingga boleh dibaca, tetapi private set menutup jalur isi langsung; mutasi harus lewat Setor dan Tarik yang punya aturan.",
        },
        {
          kind: "code",
          title: "Bangun class Rekening",
          prompt:
            "Lengkapi method `Setor` supaya menambah saldo dengan jumlah yang masuk. Bagian lain sudah lengkap: constructor mengisi data awal, dan `Tarik` menolak penarikan yang melebihi saldo. Program membaca nama, saldo awal, jumlah setor, lalu jumlah tarik.",
          mode: "fill",
          template:
            'using System;\n\npublic class Rekening\n{\n    public string Pemilik { get; private set; }\n    public int Saldo { get; private set; }\n\n    public Rekening(string pemilik, int saldoAwal)\n    {\n        Pemilik = pemilik;\n        Saldo = saldoAwal;\n    }\n\n    public void Setor(int jumlah)\n    {\n        ___;\n    }\n\n    public void Tarik(int jumlah)\n    {\n        if (jumlah > Saldo)\n        {\n            Console.WriteLine("Saldo tidak cukup");\n        }\n        else\n        {\n            Saldo -= jumlah;\n        }\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        string nama = Console.ReadLine();\n        int saldoAwal = Convert.ToInt32(Console.ReadLine());\n        Rekening r = new Rekening(nama, saldoAwal);\n\n        r.Setor(Convert.ToInt32(Console.ReadLine()));\n        r.Tarik(Convert.ToInt32(Console.ReadLine()));\n\n        Console.WriteLine("Saldo {0}: {1}", nama, r.Saldo);\n    }\n}',
          solution:
            'using System;\n\npublic class Rekening\n{\n    public string Pemilik { get; private set; }\n    public int Saldo { get; private set; }\n\n    public Rekening(string pemilik, int saldoAwal)\n    {\n        Pemilik = pemilik;\n        Saldo = saldoAwal;\n    }\n\n    public void Setor(int jumlah)\n    {\n        Saldo += jumlah;\n    }\n\n    public void Tarik(int jumlah)\n    {\n        if (jumlah > Saldo)\n        {\n            Console.WriteLine("Saldo tidak cukup");\n        }\n        else\n        {\n            Saldo -= jumlah;\n        }\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        string nama = Console.ReadLine();\n        int saldoAwal = Convert.ToInt32(Console.ReadLine());\n        Rekening r = new Rekening(nama, saldoAwal);\n\n        r.Setor(Convert.ToInt32(Console.ReadLine()));\n        r.Tarik(Convert.ToInt32(Console.ReadLine()));\n\n        Console.WriteLine("Saldo {0}: {1}", nama, r.Saldo);\n    }\n}',
          tests: [
            {
              stdin: "Budi\n100000\n50000\n30000",
              expectedOutput: "Saldo Budi: 120000",
            },
            {
              stdin: "Sinta\n80000\n20000\n150000",
              expectedOutput: "Saldo tidak cukup\nSaldo Sinta: 100000",
            },
            {
              stdin: "Rara\n0\n0\n0",
              expectedOutput: "Saldo Rara: 0",
              hidden: true,
            },
          ],
          hints: [
            "Setor menambah: pakai operator += pada Saldo.",
            "Polanya sama seperti Saldo -= jumlah pada Tarik, arahnya saja berlawanan.",
          ],
        },
      ],
    },

    // ==================== MODUL 3: OOP Lanjut dan Record ====================
    {
      slug: "oop2-inheritance-dasar",
      title: "Inheritance Dasar",
      summary: "Hubungan is-a dengan titik dua, apa yang diwarisi dan apa yang tidak.",
      steps: [
        {
          kind: "theory",
          title: "Class anak mewarisi class induk",
          body: "Inheritance menyatakan hubungan is-a: `Motor` adalah `Kendaraan`. Penulisannya satu titik dua: `class Motor : Kendaraan`. Motor mewarisi semua member yang tidak private milik `Kendaraan`, jadi field `Nama` dan method `Cetak()` dipakai seolah ditulis di `Motor` sendiri.\n\nInduk disebut base class, anak disebut derived class. Yang tidak ikut diwariskan: constructor, yang memang milik classnya masing-masing dan dipanggil lewat `base(...)` (dibahas di lesson tersendiri), serta member private yang tetap tersembunyi dari anak.\n\nC# hanya mengizinkan satu class induk langsung (single inheritance), berbeda dengan C++ yang membebaskan beberapa induk untuk class. Kebutuhan banyak bentuk kemampuan diakali lewat interface, topik lesson keempat. Satu lagi: semua class di C# pada akhirnya mewarisi `object`, itulah sebabnya setiap object punya `ToString()` dan `Equals()`.",
          code: {
            language: "csharp",
            content:
              'using System;\n\npublic class Kendaraan\n{\n    public string Nama;\n    public int JumlahRoda;\n\n    public void Cetak()\n    {\n        Console.WriteLine("{0} punya {1} roda", Nama, JumlahRoda);\n    }\n}\n\npublic class Motor : Kendaraan\n{\n    public int KapasitasTanki;\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Motor m = new Motor();\n        m.Nama = "Vario";          // diwarisi dari Kendaraan\n        m.JumlahRoda = 2;\n        m.KapasitasTanki = 5;      // milik Motor sendiri\n        m.Cetak();                 // diwarisi dari Kendaraan\n    }\n}',
            caption: "Motor memakai Nama dan Cetak() tanpa menulisnya ulang.",
          },
        },
        {
          kind: "quiz",
          question: "Bagaimana C# menyatakan bahwa class Motor mewarisi class Kendaraan?",
          options: [
            "class Motor -> Kendaraan",
            "class Motor : Kendaraan",
            "class Motor inherits Kendaraan",
            "class Motor extends Kendaraan",
          ],
          answer: 1,
          explanation:
            "C# memakai titik dua untuk inheritance. extends adalah milik Java, dan inherits bukan kata kunci di C#.",
        },
        {
          kind: "code",
          title: "Manajer mewarisi Pegawai",
          prompt:
            "Lengkapi class `Manajer` supaya mewarisi `Pegawai`, lalu lengkapi method `TotalGaji` yang menjumlahkan gaji pokok milik induk dengan tunjangan milik manajer. Dua `___` menantimu.",
          mode: "fill",
          template:
            'using System;\n\npublic class Pegawai\n{\n    public string Nama;\n    public int Gaji;\n\n    public void Cetak()\n    {\n        Console.WriteLine("{0}, gaji {1}", Nama, Gaji);\n    }\n}\n\npublic class Manajer ___ Pegawai\n{\n    public int Tunjangan;\n\n    public int TotalGaji()\n    {\n        ___;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Manajer m = new Manajer();\n        m.Nama = Console.ReadLine();\n        m.Gaji = Convert.ToInt32(Console.ReadLine());\n        m.Tunjangan = Convert.ToInt32(Console.ReadLine());\n        m.Cetak();\n        Console.WriteLine("Total: {0}", m.TotalGaji());\n    }\n}',
          solution:
            'using System;\n\npublic class Pegawai\n{\n    public string Nama;\n    public int Gaji;\n\n    public void Cetak()\n    {\n        Console.WriteLine("{0}, gaji {1}", Nama, Gaji);\n    }\n}\n\npublic class Manajer : Pegawai\n{\n    public int Tunjangan;\n\n    public int TotalGaji()\n    {\n        return Gaji + Tunjangan;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Manajer m = new Manajer();\n        m.Nama = Console.ReadLine();\n        m.Gaji = Convert.ToInt32(Console.ReadLine());\n        m.Tunjangan = Convert.ToInt32(Console.ReadLine());\n        m.Cetak();\n        Console.WriteLine("Total: {0}", m.TotalGaji());\n    }\n}',
          tests: [
            { stdin: "Dina\n8000\n2000", expectedOutput: "Dina, gaji 8000\nTotal: 10000" },
            { stdin: "Budi\n5000\n1000", expectedOutput: "Budi, gaji 5000\nTotal: 6000" },
            {
              stdin: "Rara\n9000\n3000",
              expectedOutput: "Rara, gaji 9000\nTotal: 12000",
              hidden: true,
            },
          ],
          hints: [
            "Hubungan is-a di C# ditulis dengan satu karakter: titik dua.",
            "Field Gaji milik induk tetap terbaca dari anak; jumlahkan dengan Tunjangan.",
          ],
        },
      ],
    },
    {
      slug: "oop2-virtual-override",
      title: "virtual dan override",
      summary: "Izin mengganti perilaku induk dengan virtual dan override.",
      steps: [
        {
          kind: "theory",
          title: "Mengganti perilaku induk dengan izin dua arah",
          body: "Begitu mewarisi, anak bebas menambah member baru. Tapi bagaimana dengan mengganti perilaku yang sudah ada di induk? C# meminta persetujuan dua arah: method induk ditandai `virtual` yang artinya boleh diganti, lalu anak menulis ulang dengan tanda `override`. Tanpa `virtual` di induk, `override` di anak ditolak compiler.\n\nTanda tangan methodnya harus sama persis: nama, tipe kembalian, dan parameter. Di dalam method hasil override, `base.NamaMethod(...)` memanggil versi induk; berguna bila anak hanya menambah langkah sebelum atau sesudahnya, bukan mengganti total.\n\nAda juga kata kunci `new` yang menyembunyikan member induk alih-alih menggantinya; hasilnya membingungkan karena method yang terpanggil bergantung pada tipe variabelnya, bukan tipe objectnya. Kecuali kamu punya alasan kuat, pakai pasangan `virtual` dan `override`: pasangan ini dasar dari polymorphism di lesson berikutnya.",
          code: {
            language: "csharp",
            content:
              'using System;\n\npublic class Hewan\n{\n    public virtual void Bersuara()\n    {\n        Console.WriteLine("Suara hewan");\n    }\n}\n\npublic class Kucing : Hewan\n{\n    public override void Bersuara()\n    {\n        Console.WriteLine("Meong");\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Kucing k = new Kucing();\n        k.Bersuara();\n    }\n}',
            caption: "Versi Kucing menang karena Bersuara() dioverride.",
          },
        },
        {
          kind: "quiz",
          question: "Method induk harus ditandai kata apa supaya sah dioverride anaknya?",
          options: ["override", "virtual", "static", "sealed"],
          answer: 1,
          explanation:
            "virtual di induk memberi izin diganti; override di anak menyatakan penggantinya. sealed justru menutup jalur penggantian.",
        },
        {
          kind: "code",
          title: "Diskon member tidak jalan",
          prompt:
            "Program ini seharusnya mencetak harga normal dan harga member (potongan 10 persen), tetapi gagal dikompilasi. Ada satu kata yang kurang di class induk. Cari, tambahkan, lalu jalankan sampai kedua tes lulus.",
          mode: "fix",
          template:
            'using System;\n\npublic class Pembayaran\n{\n    public int Bayar(int jumlah)\n    {\n        return jumlah;\n    }\n}\n\npublic class PembayaranMember : Pembayaran\n{\n    public override int Bayar(int jumlah)\n    {\n        return jumlah * 90 / 100;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        int jumlah = Convert.ToInt32(Console.ReadLine());\n        Pembayaran biasa = new Pembayaran();\n        PembayaranMember member = new PembayaranMember();\n        Console.WriteLine("Biasa: {0}", biasa.Bayar(jumlah));\n        Console.WriteLine("Member: {0}", member.Bayar(jumlah));\n    }\n}',
          solution:
            'using System;\n\npublic class Pembayaran\n{\n    public virtual int Bayar(int jumlah)\n    {\n        return jumlah;\n    }\n}\n\npublic class PembayaranMember : Pembayaran\n{\n    public override int Bayar(int jumlah)\n    {\n        return jumlah * 90 / 100;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        int jumlah = Convert.ToInt32(Console.ReadLine());\n        Pembayaran biasa = new Pembayaran();\n        PembayaranMember member = new PembayaranMember();\n        Console.WriteLine("Biasa: {0}", biasa.Bayar(jumlah));\n        Console.WriteLine("Member: {0}", member.Bayar(jumlah));\n    }\n}',
          tests: [
            { stdin: "100000", expectedOutput: "Biasa: 100000\nMember: 90000" },
            { stdin: "50000", expectedOutput: "Biasa: 50000\nMember: 45000" },
            { stdin: "250000", expectedOutput: "Biasa: 250000\nMember: 225000", hidden: true },
          ],
          hints: [
            "Pesan errornya menyebut member yang dioverride tidak bertanda virtual, abstract, atau override.",
            "Method Bayar di class Pembayaran perlu ditandai virtual.",
          ],
        },
      ],
    },
    {
      slug: "oop2-abstract-class",
      title: "Abstract Class dan Abstract Method",
      summary: "Class yang tidak bisa di-new dan method yang wajib dijawab anaknya.",
      steps: [
        {
          kind: "theory",
          title: "Cetakan yang menolak dicetak",
          body: "`abstract` pada class berarti: class ini belum lengkap, tidak boleh di-`new`, dan hanya bermakna sebagai induk. `Karyawan` di contoh tidak punya jawaban tunggal untuk pertanyaan berapa gajinya; jawabannya tergantung jenis karyawan. Yang pasti, semua karyawan punya `Nama` dan kewajiban menghitung gaji.\n\nMethod abstract menyerahkan bentuknya: ditulis tanpa badan, diakhiri titik koma, dan setiap anak non-abstract wajib mengisinya dengan `override`. Kalau anak lupa, compiler yang mengingatkan. Ini bedanya dengan `virtual`: override itu pilihan, abstract itu kewajiban.\n\nAbstract class tetap boleh punya member biasa yang sudah jadi: field, constructor, dan method konkret seperti `CetakSlip()` yang memanggil method abstract miliknya sendiri. Kombinasi inilah kekuatannya: kerangka alur ditulis sekali di induk, dan detail yang berubah-ubah diserahkan ke anak.",
          code: {
            language: "csharp",
            content:
              'using System;\n\npublic abstract class Karyawan\n{\n    public string Nama;\n\n    public abstract int HitungGaji();\n\n    public void CetakSlip()\n    {\n        Console.WriteLine("{0}: Rp {1}", Nama, HitungGaji());\n    }\n}\n\npublic class KaryawanTetap : Karyawan\n{\n    public int GajiPokok;\n\n    public override int HitungGaji()\n    {\n        return GajiPokok;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        KaryawanTetap k = new KaryawanTetap();\n        k.Nama = "Dina";\n        k.GajiPokok = 6000000;\n        k.CetakSlip();\n        // Karyawan x = new Karyawan();  // ditolak: class abstract\n    }\n}',
            caption: "CetakSlip() yang konkret memanggil HitungGaji() yang abstract.",
          },
        },
        {
          kind: "quiz",
          question:
            "Apa yang terjadi jika program menulis new Karyawan() dan Karyawan adalah abstract class?",
          options: [
            "Object dibuat dengan semua field bernilai bawaan",
            "Program tetap jalan, hanya memberi peringatan",
            "Kompilasi gagal karena class abstract tidak bisa diinstansiasi",
            "Object dibuat, tapi method abstractnya error saat dipanggil",
          ],
          answer: 2,
          explanation:
            "Abstract class memang sengaja tidak lengkap, jadi new-nya ditolak compiler. Yang bisa dibuat adalah class anaknya yang sudah menjawab semua method abstract.",
        },
        {
          kind: "code",
          title: "Dua jenis karyawan",
          prompt:
            "Lengkapi tiga penanda yang hilang: class `Karyawan` dan method `HitungGaji()` miliknya harus abstract, sedangkan `KaryawanTetap` wajib menandai ulang methodnya sebagai pengganti dari induk.",
          mode: "fill",
          template:
            'using System;\n\npublic ___ class Karyawan\n{\n    public string Nama;\n\n    public ___ int HitungGaji();\n}\n\npublic class KaryawanTetap : Karyawan\n{\n    public int GajiPokok;\n\n    public ___ int HitungGaji()\n    {\n        return GajiPokok;\n    }\n}\n\npublic class KaryawanParuhWaktu : Karyawan\n{\n    public int JamKerja;\n    public int TarifPerJam;\n\n    public override int HitungGaji()\n    {\n        return JamKerja * TarifPerJam;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        string jenis = Console.ReadLine();\n        string nama = Console.ReadLine();\n\n        if (jenis == "tetap")\n        {\n            KaryawanTetap k = new KaryawanTetap();\n            k.Nama = nama;\n            k.GajiPokok = Convert.ToInt32(Console.ReadLine());\n            Console.WriteLine("Gaji {0}: {1}", k.Nama, k.HitungGaji());\n        }\n        else\n        {\n            KaryawanParuhWaktu k = new KaryawanParuhWaktu();\n            k.Nama = nama;\n            k.JamKerja = Convert.ToInt32(Console.ReadLine());\n            k.TarifPerJam = Convert.ToInt32(Console.ReadLine());\n            Console.WriteLine("Gaji {0}: {1}", k.Nama, k.HitungGaji());\n        }\n    }\n}',
          solution:
            'using System;\n\npublic abstract class Karyawan\n{\n    public string Nama;\n\n    public abstract int HitungGaji();\n}\n\npublic class KaryawanTetap : Karyawan\n{\n    public int GajiPokok;\n\n    public override int HitungGaji()\n    {\n        return GajiPokok;\n    }\n}\n\npublic class KaryawanParuhWaktu : Karyawan\n{\n    public int JamKerja;\n    public int TarifPerJam;\n\n    public override int HitungGaji()\n    {\n        return JamKerja * TarifPerJam;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        string jenis = Console.ReadLine();\n        string nama = Console.ReadLine();\n\n        if (jenis == "tetap")\n        {\n            KaryawanTetap k = new KaryawanTetap();\n            k.Nama = nama;\n            k.GajiPokok = Convert.ToInt32(Console.ReadLine());\n            Console.WriteLine("Gaji {0}: {1}", k.Nama, k.HitungGaji());\n        }\n        else\n        {\n            KaryawanParuhWaktu k = new KaryawanParuhWaktu();\n            k.Nama = nama;\n            k.JamKerja = Convert.ToInt32(Console.ReadLine());\n            k.TarifPerJam = Convert.ToInt32(Console.ReadLine());\n            Console.WriteLine("Gaji {0}: {1}", k.Nama, k.HitungGaji());\n        }\n    }\n}',
          tests: [
            { stdin: "tetap\nDina\n6000000", expectedOutput: "Gaji Dina: 6000000" },
            { stdin: "paruh\nBudi\n40\n25000", expectedOutput: "Gaji Budi: 1000000" },
            {
              stdin: "paruh\nRara\n20\n30000",
              expectedOutput: "Gaji Rara: 600000",
              hidden: true,
            },
          ],
          hints: [
            "Class yang tidak boleh di-new ditandai abstract; method tanpa badan juga abstract.",
            "Penggantian method abstract di anak selalu diawali kata override.",
          ],
        },
      ],
    },
    {
      slug: "oop2-interface",
      title: "Interface: Kontrak Perilaku",
      summary: "Kontrak tanpa isi, class yang menepatinya, dan interface sebagai tipe variabel.",
      steps: [
        {
          kind: "theory",
          title: "Janji tanpa isinya",
          body: "Interface mendeklarasikan janji tanpa isinya: nama method, tipe kembalian, dan parameternya, tanpa badan. `IKirim` menjanjikan `int Biaya(int berat);`, selesai. Class yang mau menepatinya menulis `: IKirim` lalu menyediakan semua method yang dijanjikan; kurang satu saja, kompilasi ditolak.\n\nKonvensi penamaannya diawali huruf I besar: `IKirim`, `IPrinter`, `IComparable`. Member interface secara bawaan public, dan kamu tidak menulis `virtual` atau `override` di sini: class pelaksana tinggal menulis method biasa yang cocok dengan janjinya.\n\nKekuatan sesungguhnya terasa saat variabelnya bertipe interface: `IKirim k;` boleh menampung `KurirDarat` atau `KurirUdara`, dan `k.Biaya(berat)` menjalankan versi milik object aslinya. Pemanggil tidak perlu tahu classnya apa; ia hanya percaya pada kontrak. Pola inilah yang membuat bagian program mudah ditukar implementasinya.",
          code: {
            language: "csharp",
            content:
              'using System;\n\npublic interface IKirim\n{\n    int Biaya(int berat);\n}\n\npublic class KurirDarat : IKirim\n{\n    public int Biaya(int berat)\n    {\n        return berat * 5000;\n    }\n}\n\npublic class KurirUdara : IKirim\n{\n    public int Biaya(int berat)\n    {\n        return berat * 12000 + 20000;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        IKirim k = new KurirDarat();\n        Console.WriteLine("Biaya: {0}", k.Biaya(3));\n\n        k = new KurirUdara();\n        Console.WriteLine("Biaya: {0}", k.Biaya(3));\n    }\n}',
            caption: "Variabel bertipe IKirim, isinya bisa dua class berbeda.",
          },
        },
        {
          kind: "quiz",
          question: "Class yang menulis : IKirim wajib...",
          options: [
            "membuat object IKirim",
            "menyediakan semua member yang dijanjikan IKirim",
            "mewarisi satu class lain dulu",
            "menandai dirinya abstract",
          ],
          answer: 1,
          explanation:
            "Interface adalah kontrak: class pelaksana harus menyediakan seluruh member yang dijanjikan. Interface sendiri tidak bisa di-new.",
        },
        {
          kind: "code",
          title: "Kontrak layanan kirim",
          prompt:
            "Lengkapi dua bagian: deklarasi janji di dalam `interface IKirim` (method tanpa badan, diakhiri titik koma) dan tanda bahwa `KurirUdara` menepati kontrak itu. Dua `___` menantimu.",
          mode: "fill",
          template:
            'using System;\n\npublic interface IKirim\n{\n    ___;\n}\n\npublic class KurirDarat : IKirim\n{\n    public int Biaya(int berat)\n    {\n        return berat * 5000;\n    }\n}\n\npublic class KurirUdara ___ IKirim\n{\n    public int Biaya(int berat)\n    {\n        return berat * 12000 + 20000;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        int berat = Convert.ToInt32(Console.ReadLine());\n        string layanan = Console.ReadLine();\n\n        IKirim k;\n        if (layanan == "darat")\n        {\n            k = new KurirDarat();\n        }\n        else\n        {\n            k = new KurirUdara();\n        }\n        Console.WriteLine("Biaya: {0}", k.Biaya(berat));\n    }\n}',
          solution:
            'using System;\n\npublic interface IKirim\n{\n    int Biaya(int berat);\n}\n\npublic class KurirDarat : IKirim\n{\n    public int Biaya(int berat)\n    {\n        return berat * 5000;\n    }\n}\n\npublic class KurirUdara : IKirim\n{\n    public int Biaya(int berat)\n    {\n        return berat * 12000 + 20000;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        int berat = Convert.ToInt32(Console.ReadLine());\n        string layanan = Console.ReadLine();\n\n        IKirim k;\n        if (layanan == "darat")\n        {\n            k = new KurirDarat();\n        }\n        else\n        {\n            k = new KurirUdara();\n        }\n        Console.WriteLine("Biaya: {0}", k.Biaya(berat));\n    }\n}',
          tests: [
            { stdin: "3\ndarat", expectedOutput: "Biaya: 15000" },
            { stdin: "3\nudara", expectedOutput: "Biaya: 56000" },
            { stdin: "0\ndarat", expectedOutput: "Biaya: 0", hidden: true },
          ],
          hints: [
            "Janji interface ditulis seperti method tanpa badan: tipe kembalian, nama, parameter, lalu titik koma.",
            "Hubungan menepati kontrak memakai titik dua, sama seperti penulisan inheritance.",
          ],
        },
      ],
    },
    {
      slug: "oop2-multiple-interface",
      title: "Multiple Interface",
      summary: "Satu base class saja, tetapi banyak interface; jalur C# menggantikan multiple inheritance.",
      steps: [
        {
          kind: "theory",
          title: "Satu class, banyak kontrak",
          body: "Class di C# hanya boleh punya satu base class, tetapi boleh mengimplementasikan banyak interface sekaligus. Urutannya: base class dulu (kalau ada), lalu daftar interface dipisah koma. `public class MesinMultifungsi : AlatCetak, IPrinter, IScanner` berarti MesinMultifungsi adalah AlatCetak, dan sekaligus menepati dua kontrak.\n\nInilah jalan C# menggantikan multiple inheritance: kebutuhan punya banyak kemampuan dilepas ke interface. `IPrinter` minta `Cetak(string dokumen)`, `IScanner` minta `Scan()`, dan satu class melayani keduanya tanpa saling mengganggu. Bagi pemanggil, mesin itu bisa ditampung di variabel `IPrinter` maupun `IScanner` sesuai kebutuhan momen itu.\n\nKalau dua interface meminta member bernama sama, class bisa menulis implementation eksplisit: `void IPrinter.Cetak()` dan `void IScanner.Cetak()`; member itu baru terpanggil lewat variabel bertipe interface masing-masing. Bentuk ini jarang dibutuhkan, tetapi bagus dikenali agar tidak bingung saat membaca kode pustaka.",
          code: {
            language: "csharp",
            content:
              'using System;\n\npublic interface IPrinter\n{\n    void Cetak(string dokumen);\n}\n\npublic interface IScanner\n{\n    string Scan();\n}\n\npublic class MesinMultifungsi : IPrinter, IScanner\n{\n    public void Cetak(string dokumen)\n    {\n        Console.WriteLine("Mencetak " + dokumen);\n    }\n\n    public string Scan()\n    {\n        return "hasil-scan";\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        MesinMultifungsi mesin = new MesinMultifungsi();\n        IPrinter p = mesin;\n        IScanner s = mesin;\n        p.Cetak("laporan.pdf");\n        Console.WriteLine(s.Scan());\n    }\n}',
            caption: "Satu object, dua kontrak: variabel IPrinter dan IScanner menampung mesin yang sama.",
          },
        },
        {
          kind: "quiz",
          question: "Di C#, satu class...",
          options: [
            "boleh mewarisi banyak base class asal interface-nya satu",
            "boleh satu base class dan banyak interface",
            "hanya boleh satu interface dan satu base class",
            "boleh banyak base class kalau ditulis dalam satu baris",
          ],
          answer: 1,
          explanation:
            "Single inheritance hanya membatasi class induk. Interface tidak dihitung sebagai class, jadi boleh banyak sekaligus.",
        },
        {
          kind: "quiz",
          question: "Pada `public class Mesin : Alat, IPrinter, IScanner`, posisi Alat di paling depan berarti...",
          options: [
            "Alat adalah interface pertama",
            "Alat adalah base class, dan base class memang ditulis paling depan",
            "Alat boleh ditulis di posisi mana saja",
            "Penulisan itu salah",
          ],
          answer: 1,
          explanation:
            "Setelah titik dua, posisi pertama disediakan untuk base class (kalau ada), lalu diikuti daftar interface.",
        },
      ],
    },
    {
      slug: "oop2-base-constructor-chaining",
      title: "base dan Constructor Chaining",
      summary: "Urutan pembangunan object: constructor induk selalu jalan lebih dulu.",
      steps: [
        {
          kind: "theory",
          title: "Constructor induk berjalan lebih dulu",
          body: "Constructor tidak diwarisi, tetapi setiap pembuatan object anak selalu menjalankan constructor induknya lebih dulu. Tidak mungkin `AkunPremium` dibangun sebelum bagian `Akun`-nya selesai; C# mengatur urutan itu secara otomatis.\n\nSecara bawaan, anak memanggil constructor tanpa parameter milik induk. Kalau induk hanya punya constructor berparameter, anak wajib menyebutnya lewat `: base(...)`: `public AkunPremium(string nama, int level) : base(nama)`. Argumennya boleh datang dari parameter anak itu sendiri, seperti `nama` di sini.\n\nUrutan eksekusinya tegas: dulu badan constructor induk, lalu badan constructor anak. Itulah sebabnya contoh ini mencetak `Akun Budi dibuat` sebelum `Level 3`. Polanya sama dengan `: this(...)` di modul sebelumnya; bedanya cuma targetnya: `this` menuju constructor class sendiri, `base` menuju constructor induk.",
          code: {
            language: "csharp",
            content:
              'using System;\n\npublic class Akun\n{\n    public string Nama;\n\n    public Akun(string nama)\n    {\n        Nama = nama;\n        Console.WriteLine("Akun {0} dibuat", nama);\n    }\n}\n\npublic class AkunPremium : Akun\n{\n    public int Level;\n\n    public AkunPremium(string nama, int level) : base(nama)\n    {\n        Level = level;\n        Console.WriteLine("Level {0}", level);\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        AkunPremium a = new AkunPremium("Budi", 3);\n    }\n}',
            caption: "Keluarannya dua baris: bagian induk selesai sebelum bagian anak.",
          },
        },
        {
          kind: "quiz",
          question: "Pada pembuatan object anak yang menulis : base(...), urutan eksekusinya adalah...",
          options: [
            "badan constructor anak dulu, lalu induk",
            "badan constructor induk dulu, lalu anak",
            "keduanya berjalan bersamaan",
            "hanya constructor anak yang berjalan",
          ],
          answer: 1,
          explanation:
            "Constructor induk selalu selesai lebih dulu, baru badan constructor anak jalan. Object induk harus rapi sebelum anak menambahkan miliknya.",
        },
        {
          kind: "code",
          title: "Rantai constructor dua tingkat",
          prompt:
            "Lengkapi dua bagian: constructor induk yang mengisi field `Nama`, dan pemanggilan constructor induk dari `AkunPremium` lewat `: base(...)`. Dua `___` menantimu. Program tidak membaca apa pun selain argumen constructor.",
          mode: "fill",
          template:
            'using System;\n\npublic class Akun\n{\n    public string Nama;\n\n    public Akun(string nama)\n    {\n        ___;\n        Console.WriteLine("Akun {0} dibuat", nama);\n    }\n}\n\npublic class AkunPremium : Akun\n{\n    public int Level;\n\n    public AkunPremium(string nama, int level) ___(nama)\n    {\n        Level = level;\n        Console.WriteLine("Level {0}", level);\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        AkunPremium a = new AkunPremium(Console.ReadLine(), Convert.ToInt32(Console.ReadLine()));\n    }\n}',
          solution:
            'using System;\n\npublic class Akun\n{\n    public string Nama;\n\n    public Akun(string nama)\n    {\n        Nama = nama;\n        Console.WriteLine("Akun {0} dibuat", nama);\n    }\n}\n\npublic class AkunPremium : Akun\n{\n    public int Level;\n\n    public AkunPremium(string nama, int level) : base(nama)\n    {\n        Level = level;\n        Console.WriteLine("Level {0}", level);\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        AkunPremium a = new AkunPremium(Console.ReadLine(), Convert.ToInt32(Console.ReadLine()));\n    }\n}',
          tests: [
            { stdin: "Budi\n3", expectedOutput: "Akun Budi dibuat\nLevel 3" },
            { stdin: "Sinta\n7", expectedOutput: "Akun Sinta dibuat\nLevel 7" },
            { stdin: "Wati\n1", expectedOutput: "Akun Wati dibuat\nLevel 1", hidden: true },
          ],
          hints: [
            "Constructor induk mengisi fieldnya sendiri: Nama = nama.",
            "Memanggil constructor induk: titik dua, kata base, lalu argumennya dalam kurung.",
          ],
        },
      ],
    },
    {
      slug: "oop2-polymorphism",
      title: "Polymorphism lewat Referensi Induk",
      summary: "Referensi induk menampung object anak, dan method mengikuti wujud aslinya.",
      steps: [
        {
          kind: "theory",
          title: "Satu wadah induk, banyak wujud anak",
          body: "Polymorphism terjadi saat referensi bertipe induk menampung object anak: `Hewan h = new Kucing();` sah, karena setiap Kucing adalah Hewan. Banyak object berbeda bisa masuk satu wadah yang sama, misalnya `Hewan[] kebun` berisi Kucing, Anjing, dan Bebek sekaligus.\n\nSaat loop memanggil `h.Bersuara()`, yang berjalan adalah versi milik object aslinya, bukan versi induk. Keputusan diambil saat runtime dengan melihat tipe sebenarnya, dan itu hanya terjadi bila methodnya `virtual` atau `abstract` yang sudah dioverride. Satu baris pemanggilan, tiga keluaran berbeda: itulah banyak wujudnya.\n\nArah sebaliknya butuh cast: dari `Hewan` ke `Kucing` harus eksplisit, karena tidak setiap hewan adalah kucing, dan cast yang keliru melempar exception. Gaya yang disukai jelas: perlakukan semua lewat induk dan methodnya, dan seminimal mungkin mengintip tipe aslinya.",
          code: {
            language: "csharp",
            content:
              'using System;\n\npublic class Hewan\n{\n    public virtual void Bersuara()\n    {\n        Console.WriteLine("...");\n    }\n}\n\npublic class Kucing : Hewan\n{\n    public override void Bersuara()\n    {\n        Console.WriteLine("Meong");\n    }\n}\n\npublic class Anjing : Hewan\n{\n    public override void Bersuara()\n    {\n        Console.WriteLine("Guk guk");\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Hewan[] kebun = new Hewan[2];\n        kebun[0] = new Kucing();\n        kebun[1] = new Anjing();\n\n        foreach (Hewan h in kebun)\n        {\n            h.Bersuara();   // mengikuti wujud aslinya\n        }\n    }\n}',
            caption: "Tipe array Hewan, isinya object anak, keluarannya mengikuti masing-masing.",
          },
        },
        {
          kind: "quiz",
          question:
            "Hewan h = new Kucing(); lalu h.Bersuara(); dengan Bersuara dioverride Kucing. Yang berjalan adalah...",
          options: [
            "versi Hewan, karena tipenya Hewan",
            "versi Kucing, karena object aslinya Kucing",
            "keduanya, berurutan",
            "tidak ada; program error",
          ],
          answer: 1,
          explanation:
            "Untuk method virtual, keputusan mengikuti tipe object saat runtime, bukan tipe variabelnya. Inilah inti polymorphism.",
        },
        {
          kind: "code",
          title: "Kebun binatang yang bersuara",
          prompt:
            "Lengkapi pembuatan array dan loop-nya. Perhatikan tipenya: array dan variabel loop sama-sama bertipe induk, meski isinya object anak. Program membaca tiga baris jenis hewan (kucing, anjing, atau bebek) lalu mencetak suaranya berurutan.",
          mode: "fill",
          template:
            'using System;\n\npublic class Hewan\n{\n    public virtual void Bersuara()\n    {\n        Console.WriteLine("...");\n    }\n}\n\npublic class Kucing : Hewan\n{\n    public override void Bersuara()\n    {\n        Console.WriteLine("Meong");\n    }\n}\n\npublic class Anjing : Hewan\n{\n    public override void Bersuara()\n    {\n        Console.WriteLine("Guk guk");\n    }\n}\n\npublic class Bebek : Hewan\n{\n    public override void Bersuara()\n    {\n        Console.WriteLine("Kwek kwek");\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Hewan[] kebun = ___ Hewan[3];\n        for (int i = 0; i < 3; i++)\n        {\n            string jenis = Console.ReadLine();\n            if (jenis == "kucing")\n            {\n                kebun[i] = new Kucing();\n            }\n            else if (jenis == "anjing")\n            {\n                kebun[i] = new Anjing();\n            }\n            else\n            {\n                kebun[i] = new Bebek();\n            }\n        }\n\n        foreach (___ h in kebun)\n        {\n            h.Bersuara();\n        }\n    }\n}',
          solution:
            'using System;\n\npublic class Hewan\n{\n    public virtual void Bersuara()\n    {\n        Console.WriteLine("...");\n    }\n}\n\npublic class Kucing : Hewan\n{\n    public override void Bersuara()\n    {\n        Console.WriteLine("Meong");\n    }\n}\n\npublic class Anjing : Hewan\n{\n    public override void Bersuara()\n    {\n        Console.WriteLine("Guk guk");\n    }\n}\n\npublic class Bebek : Hewan\n{\n    public override void Bersuara()\n    {\n        Console.WriteLine("Kwek kwek");\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Hewan[] kebun = new Hewan[3];\n        for (int i = 0; i < 3; i++)\n        {\n            string jenis = Console.ReadLine();\n            if (jenis == "kucing")\n            {\n                kebun[i] = new Kucing();\n            }\n            else if (jenis == "anjing")\n            {\n                kebun[i] = new Anjing();\n            }\n            else\n            {\n                kebun[i] = new Bebek();\n            }\n        }\n\n        foreach (Hewan h in kebun)\n        {\n            h.Bersuara();\n        }\n    }\n}',
          tests: [
            { stdin: "kucing\nanjing\nbebek", expectedOutput: "Meong\nGuk guk\nKwek kwek" },
            { stdin: "bebek\nbebek\nkucing", expectedOutput: "Kwek kwek\nKwek kwek\nMeong" },
            {
              stdin: "anjing\nanjing\nanjing",
              expectedOutput: "Guk guk\nGuk guk\nGuk guk",
              hidden: true,
            },
          ],
          hints: [
            "Array dibuat dengan kata new dan ukurannya di dalam kurung siku.",
            "Variabel loop memakai tipe induk: Hewan, dan cukup satu tipe untuk semua isinya.",
          ],
        },
      ],
    },
    {
      slug: "oop2-tostring-override",
      title: "Override ToString()",
      summary: "Ganti representasi teks bawaan object dengan override ToString().",
      steps: [
        {
          kind: "theory",
          title: "Representasi teks milikmu sendiri",
          body: "Setiap class di C# mewarisi `object`, dan `object` menyediakan `virtual string ToString()`. Versi bawaannya membosankan: hanya nama tipe lengkap object, misalnya `Buku`. Makanya mencetak object mentah menghasilkan tulisan aneh, bukan isinya.\n\nDengan menulis `public override string ToString()`, kamu mengganti representasi itu. Kepraktisannya, semua yang butuh teks otomatis memakainya: `Console.WriteLine(b)` dan `\"Buku: \" + b` sama-sama memanggil `ToString()` tanpa diminta. Satu override, banyak pemakaian.\n\nKapan berguna: saat debugging (tampilkan object langsung), saat menyusun pesan log, atau saat class memang punya bentuk teks alami. Kalau butuh versi induk di tengah jalan, `base.ToString()` masih tersedia. Dan karena ToString mengembalikan string biasa, susun isinya dengan penggabungan `+` atau `string.Format` seperti biasa.",
          code: {
            language: "csharp",
            content:
              'using System;\n\npublic class Buku\n{\n    public string Judul;\n    public string Penulis;\n    public int Tahun;\n\n    public Buku(string judul, string penulis, int tahun)\n    {\n        Judul = judul;\n        Penulis = penulis;\n        Tahun = tahun;\n    }\n\n    public override string ToString()\n    {\n        return Judul + " (" + Penulis + ", " + Tahun + ")";\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Buku b = new Buku("Laskar Pelangi", "Andrea Hirata", 2005);\n        Console.WriteLine(b);            // otomatis memanggil ToString()\n        Console.WriteLine("Buku: " + b); // sama juga\n    }\n}',
            caption: "Kedua baris cetak memakai ToString() hasil override.",
          },
        },
        {
          kind: "quiz",
          question:
            "Tanpa override ToString(), Console.WriteLine(obj) untuk object class Buah mencetak...",
          options: [
            "isi field object",
            "nama tipe lengkap object",
            "alamat memori dalam heksadesimal",
            "tidak mencetak apa pun",
          ],
          answer: 1,
          explanation:
            "Versi bawaan object.ToString() mengembalikan nama tipe lengkapnya, misalnya Buah. Isi field baru muncul setelah kamu mengoverride.",
        },
        {
          kind: "code",
          title: "Buku yang bisa mencetak dirinya",
          prompt:
            "Lengkapi override `ToString()` pada class `Buku` supaya mengembalikan teks `Judul (Penulis, Tahun)`. Program membaca ketiga datanya, lalu mencetak object itu dua kali dengan dua cara. Dua `___` menantimu.",
          mode: "fill",
          template:
            'using System;\n\npublic class Buku\n{\n    public string Judul;\n    public string Penulis;\n    public int Tahun;\n\n    public Buku(string judul, string penulis, int tahun)\n    {\n        Judul = judul;\n        Penulis = penulis;\n        Tahun = tahun;\n    }\n\n    public ___ string ToString()\n    {\n        return ___ + " (" + Penulis + ", " + Tahun + ")";\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Buku b = new Buku(Console.ReadLine(), Console.ReadLine(), Convert.ToInt32(Console.ReadLine()));\n        Console.WriteLine(b);\n        Console.WriteLine("Buku: " + b);\n    }\n}',
          solution:
            'using System;\n\npublic class Buku\n{\n    public string Judul;\n    public string Penulis;\n    public int Tahun;\n\n    public Buku(string judul, string penulis, int tahun)\n    {\n        Judul = judul;\n        Penulis = penulis;\n        Tahun = tahun;\n    }\n\n    public override string ToString()\n    {\n        return Judul + " (" + Penulis + ", " + Tahun + ")";\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Buku b = new Buku(Console.ReadLine(), Console.ReadLine(), Convert.ToInt32(Console.ReadLine()));\n        Console.WriteLine(b);\n        Console.WriteLine("Buku: " + b);\n    }\n}',
          tests: [
            {
              stdin: "Laskar Pelangi\nAndrea Hirata\n2005",
              expectedOutput:
                "Laskar Pelangi (Andrea Hirata, 2005)\nBuku: Laskar Pelangi (Andrea Hirata, 2005)",
            },
            {
              stdin: "Ronggeng Dukuh Paruk\nAhmad Tohari\n1980",
              expectedOutput:
                "Ronggeng Dukuh Paruk (Ahmad Tohari, 1980)\nBuku: Ronggeng Dukuh Paruk (Ahmad Tohari, 1980)",
            },
            {
              stdin: "Cantik Itu Luka\nEka Kurniawan\n2002",
              expectedOutput:
                "Cantik Itu Luka (Eka Kurniawan, 2002)\nBuku: Cantik Itu Luka (Eka Kurniawan, 2002)",
              hidden: true,
            },
          ],
          hints: [
            "Mengganti method milik object diawali kata override.",
            "Susun hasilnya dengan penggabungan: Judul + \" (\" + Penulis + \", \" + Tahun + \")\".",
          ],
        },
      ],
    },
    {
      slug: "oop2-equality-record",
      title: "Equality dan Record",
      summary: "== membandingkan referensi, record membandingkan nilai; padanan record untuk C# 5.",
      steps: [
        {
          kind: "theory",
          title: "Kapan dua object disebut sama",
          body: "Untuk class, `==` membandingkan referensi: apakah dua variabel menunjuk object yang sama di memori. `Equals()` bawaan juga begitu. Akibatnya, dua object berisi nilai persis sama tetap dianggap berbeda; `string` satu-satunya yang terkenal berkecuali karena memang dirancang membandingkan isinya.\n\nKalau yang kamu mau adalah kesetaraan nilai, tulis sendiri aturannya: override `Equals(object)` untuk membandingkan field demi field (dan ikutkan `GetHashCode()` supaya konsisten saat object dipakai di `Dictionary` atau `HashSet`), atau sediakan method pembanding sendiri. Menyetel `Equals` tanpa `GetHashCode` adalah sumber bug klasik yang baru terasa saat object masuk koleksi.\n\nC# 9 menjawab kebutuhan itu dengan `record`: tipe seperti class yang otomatis membandingkan berdasarkan nilai semua membernya, plus salin-ubah mudah lewat `with`. Platform ini menjalankan C# 5, jadi record belum bisa dipraktikkan di sini; padanannya adalah class immutable: fieldnya `readonly`, diisi sekali lewat constructor, dan tak berubah setelahnya. Object yang tidak berubah aman dibagikan ke bagian program mana pun tanpa takut ditimpa.",
          code: {
            language: "csharp",
            content:
              'using System;\n\npublic class Titik\n{\n    public readonly int X;\n    public readonly int Y;\n\n    public Titik(int x, int y)\n    {\n        X = x;\n        Y = y;\n    }\n\n    public bool SamaDengan(Titik lain)\n    {\n        return lain != null && X == lain.X && Y == lain.Y;\n    }\n\n    public Titik Geser(int dx, int dy)\n    {\n        return new Titik(X + dx, Y + dy);\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Titik a = new Titik(1, 2);\n        Titik b = new Titik(1, 2);\n        Console.WriteLine(a == b);          // false: beda referensi\n        Console.WriteLine(a.SamaDengan(b)); // true: isinya sama\n        Titik c = a.Geser(1, 0);\n        Console.WriteLine(c.X + "," + c.Y); // 2,2 dan a tidak berubah\n    }\n}',
            caption: "== membandingkan referensi; pembanding nilai ditulis sendiri, ala record sebelum era record.",
          },
        },
        {
          kind: "quiz",
          question:
            "Titik a = new Titik(1, 2); Titik b = new Titik(1, 2); apa hasil a == b untuk class biasa tanpa override?",
          options: [
            "true, karena isinya sama",
            "false, karena referensinya berbeda",
            "error saat kompilasi",
            "tergantung versi C#",
          ],
          answer: 1,
          explanation:
            "== pada class membandingkan referensi. Dua pemanggilan new menghasilkan dua object berbeda, sekecil apa pun kemiripan isinya.",
        },
        {
          kind: "quiz",
          question: "record di C# 9 membandingkan dua instance berdasarkan...",
          options: [
            "alamat memori",
            "nilai seluruh membernya",
            "nama tipenya",
            "urutan pembuatan",
          ],
          answer: 1,
          explanation:
            "Record menghasilkan Equals dan == yang membandingkan nilai semua member secara otomatis; itu kegunaan utamanya dibanding class biasa.",
        },
        {
          kind: "quiz",
          question: "Ciri class immutable yang jadi padanan record pada C# 5 adalah...",
          options: [
            "fieldnya semua static",
            "fieldnya readonly dan diisi sekali lewat constructor",
            "tidak boleh punya method",
            "wajib ditandai abstract",
          ],
          answer: 1,
          explanation:
            "readonly menjamin field hanya diisi satu kali, di constructor. Setelah itu nilainya beku, sehingga object aman dipakai bersama tanpa disalin.",
        },
      ],
    },
    {
      slug: "oop2-latihan-bentuk",
      title: "Latihan Gabungan: Hierarki Bentuk",
      summary: "Abstract class, constructor chaining, override, dan polymorphism dalam satu hierarki.",
      steps: [
        {
          kind: "theory",
          title: "Ujian akhir modul OOP",
          body: "Modul ini ditutup dengan satu hierarki yang merangkai semuanya. `Bentuk` adalah abstract class: punya `Nama`, constructor yang mengisinya, method konkret `Perkenalan()` yang mencetak, dan satu method abstract `Luas()` yang sengaja tidak dijawab di induk.\n\nAnak-anaknya menjawab dengan caranya masing-masing: `Persegi` mengalikan sisi dengan sisi, `Segitiga` mengalikan alas dan tinggi lalu membagi dua. Keduanya memanggil `base(...)` supaya constructor induk tetap mengisi `Nama`, lalu mengisi fieldnya sendiri.\n\nDi `Main`, keduanya ditampung dalam satu array bertipe `Bentuk` dan loop hanya memanggil `Perkenalan()`. Tidak ada if yang mengecek tipe; override yang bekerja. Satu catatan hitungan: `alas * tinggi / 2` memakai pembagian bilangan bulat, jadi luas segitiga yang ganjil terpotong ke bawah, dan itu disengaja agar keluaran tetap bilangan bulat.",
          code: {
            language: "csharp",
            content:
              'using System;\n\npublic abstract class Bentuk\n{\n    public string Nama;\n\n    public Bentuk(string nama)\n    {\n        Nama = nama;\n    }\n\n    public abstract int Luas();\n\n    public void Perkenalan()\n    {\n        Console.WriteLine("{0} luasnya {1}", Nama, Luas());\n    }\n}\n\npublic class Persegi : Bentuk\n{\n    public int Sisi;\n\n    public Persegi(int sisi) : base("Persegi")\n    {\n        Sisi = sisi;\n    }\n\n    public override int Luas()\n    {\n        return Sisi * Sisi;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Bentuk[] daftar = new Bentuk[1];\n        daftar[0] = new Persegi(5);\n\n        foreach (Bentuk b in daftar)\n        {\n            b.Perkenalan();\n        }\n    }\n}',
            caption: "Perkenalan() konkret memanggil Luas() yang dijawab tiap anak.",
          },
        },
        {
          kind: "quiz",
          question: "Array bertipe Bentuk[] bisa menampung object Persegi dan Segitiga karena...",
          options: [
            "array di C# menampung tipe apa saja",
            "keduanya mewarisi Bentuk, dan referensi tipe induk boleh menampung object anak",
            "Bentuk adalah interface",
            "keduanya ditandai static",
          ],
          answer: 1,
          explanation:
            "Persegi dan Segitiga adalah Bentuk, jadi keduanya muat di wadah Bentuk[]. Saat methodnya dipanggil, versi milik masing-masing yang jalan.",
        },
        {
          kind: "code",
          title: "Selesaikan hierarki Bentuk",
          prompt:
            "Tiga bagian hilang: penanda abstract pada class dan method `Luas()`, serta rumus luas segitiga di class `Segitiga`. Program membaca sisi persegi, lalu alas dan tinggi segitiga, dan mencetak luas keduanya lewat satu loop.",
          mode: "fill",
          template:
            'using System;\n\npublic ___ class Bentuk\n{\n    public string Nama;\n\n    public Bentuk(string nama)\n    {\n        Nama = nama;\n    }\n\n    public abstract int ___();\n\n    public void Perkenalan()\n    {\n        Console.WriteLine("{0} luasnya {1}", Nama, Luas());\n    }\n}\n\npublic class Persegi : Bentuk\n{\n    public int Sisi;\n\n    public Persegi(int sisi) : base("Persegi")\n    {\n        Sisi = sisi;\n    }\n\n    public override int Luas()\n    {\n        return Sisi * Sisi;\n    }\n}\n\npublic class Segitiga : Bentuk\n{\n    public int Alas;\n    public int Tinggi;\n\n    public Segitiga(int alas, int tinggi) : base("Segitiga")\n    {\n        Alas = alas;\n        Tinggi = tinggi;\n    }\n\n    public override int Luas()\n    {\n        return ___;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Bentuk[] daftar = new Bentuk[2];\n        daftar[0] = new Persegi(Convert.ToInt32(Console.ReadLine()));\n        daftar[1] = new Segitiga(Convert.ToInt32(Console.ReadLine()), Convert.ToInt32(Console.ReadLine()));\n\n        foreach (Bentuk b in daftar)\n        {\n            b.Perkenalan();\n        }\n    }\n}',
          solution:
            'using System;\n\npublic abstract class Bentuk\n{\n    public string Nama;\n\n    public Bentuk(string nama)\n    {\n        Nama = nama;\n    }\n\n    public abstract int Luas();\n\n    public void Perkenalan()\n    {\n        Console.WriteLine("{0} luasnya {1}", Nama, Luas());\n    }\n}\n\npublic class Persegi : Bentuk\n{\n    public int Sisi;\n\n    public Persegi(int sisi) : base("Persegi")\n    {\n        Sisi = sisi;\n    }\n\n    public override int Luas()\n    {\n        return Sisi * Sisi;\n    }\n}\n\npublic class Segitiga : Bentuk\n{\n    public int Alas;\n    public int Tinggi;\n\n    public Segitiga(int alas, int tinggi) : base("Segitiga")\n    {\n        Alas = alas;\n        Tinggi = tinggi;\n    }\n\n    public override int Luas()\n    {\n        return Alas * Tinggi / 2;\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Bentuk[] daftar = new Bentuk[2];\n        daftar[0] = new Persegi(Convert.ToInt32(Console.ReadLine()));\n        daftar[1] = new Segitiga(Convert.ToInt32(Console.ReadLine()), Convert.ToInt32(Console.ReadLine()));\n\n        foreach (Bentuk b in daftar)\n        {\n            b.Perkenalan();\n        }\n    }\n}',
          tests: [
            { stdin: "5\n4\n5", expectedOutput: "Persegi luasnya 25\nSegitiga luasnya 10" },
            { stdin: "10\n6\n7", expectedOutput: "Persegi luasnya 100\nSegitiga luasnya 21" },
            {
              stdin: "3\n8\n3",
              expectedOutput: "Persegi luasnya 9\nSegitiga luasnya 12",
              hidden: true,
            },
          ],
          hints: [
            "Class tanpa bentuk jadi dan methodnya sama-sama ditandai abstract.",
            "Luas segitiga: alas kali tinggi dibagi dua, ditulis Alas * Tinggi / 2.",
          ],
        },
      ],
    },
  ],
};
