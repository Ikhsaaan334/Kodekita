import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "java",
  moduleRange: [2, 3],
  modules: [
    {
      title: "Inheritance dan Polymorphism",
      description: "Abstract class, interface, overriding, super, dan desain dengan kontrak.",
    },
    {
      title: "Collections Framework",
      description: "List/Set/Map, generics, equals/hashCode, Comparable/Comparator.",
    },
  ],
  lessons: [
    // ==================== MODUL 2: Inheritance dan Polymorphism ====================
    {
      slug: "oop-inheritance-dasar",
      title: "Inheritance dengan extends",
      summary: "Wariskan field dan method dari class induk ke subclass lewat extends.",
      steps: [
        {
          kind: "theory",
          title: "Class anak mewarisi class induk",
          body: "Inheritance adalah mekanisme di mana sebuah class menerima field dan method milik class lain. Class yang mewarisi disebut subclass (anak), class yang diwarisi disebut superclass (induk). Hubungannya dinyatakan dengan kata kunci `extends`: `class Mobil extends Kendaraan` berarti Mobil adalah Kendaraan yang dilengkapi kemampuan tambahan.\n\nObjek Mobil hasilnya punya semua anggota Kendaraan yang bisa diakses, ditambah anggota miliknya sendiri. Java hanya mengizinkan satu `extends`: sebuah class punya paling banyak satu induk langsung. Karena itu pohon inheritance Java berbentuk pohon, dan ujung akarnya adalah class `Object` yang menjadi induk dari semua class.\n\nPakai inheritance hanya untuk hubungan yang memang benar secara bahasa: Mobil adalah Kendaraan, Kucing adalah Hewan. Kalau tujuannya cuma berbagi kode tanpa hubungan itu, komposisi biasanya pilihan yang lebih sehat.",
          code: {
            language: "java",
            content:
              "class Kendaraan {\n    void jalan() {\n        System.out.println(\"brumm\");\n    }\n}\n\nclass Mobil extends Kendaraan {\n    void klakson() {\n        System.out.println(\"tiin\");\n    }\n}\n\n// di method lain:\nMobil m = new Mobil();\nm.jalan();    // diwarisi dari Kendaraan\nm.klakson();  // milik Mobil sendiri",
            caption: "Satu objek Mobil, dua method: warisan dan milik sendiri.",
          },
        },
        {
          kind: "quiz",
          question: "Manakah deklarasi yang benar untuk membuat class Kucing mewarisi class Hewan?",
          options: [
            "class Kucing inherits Hewan { }",
            "class Hewan extends Kucing { }",
            "class Kucing extends Hewan { }",
            "class Kucing implements Hewan { }",
          ],
          answer: 2,
          explanation:
            "Kata kunci Java untuk mewarisi adalah extends, ditulis pada class anak: class Kucing extends Hewan. implements dipakai untuk interface, bukan class.",
        },
        {
          kind: "code",
          title: "Bangun subclass Motor",
          prompt:
            "Lengkapi program di bawah supaya `Motor` mewarisi `Kendaraan`, lalu panggil method klakson miliknya. Ganti setiap `___` sehingga keluarannya benar saat program dijalankan.",
          mode: "fill",
          template:
            'import java.util.Scanner;\n\nclass Kendaraan {\n    String nama;\n\n    Kendaraan(String nama) {\n        this.nama = nama;\n    }\n\n    void info() {\n        System.out.println("Kendaraan: " + nama);\n    }\n}\n\nclass Motor ___ Kendaraan {\n    Motor(String nama) {\n        super(nama);\n    }\n\n    void klakson() {\n        System.out.println(nama + ": tin tin!");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        Motor m = new Motor(in.next());\n        m.info();\n        m.___();\n    }\n}',
          solution:
            'import java.util.Scanner;\n\nclass Kendaraan {\n    String nama;\n\n    Kendaraan(String nama) {\n        this.nama = nama;\n    }\n\n    void info() {\n        System.out.println("Kendaraan: " + nama);\n    }\n}\n\nclass Motor extends Kendaraan {\n    Motor(String nama) {\n        super(nama);\n    }\n\n    void klakson() {\n        System.out.println(nama + ": tin tin!");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        Motor m = new Motor(in.next());\n        m.info();\n        m.klakson();\n    }\n}',
          tests: [
            { stdin: "Beat", expectedOutput: "Kendaraan: Beat\nBeat: tin tin!" },
            { stdin: "Ninja", expectedOutput: "Kendaraan: Ninja\nNinja: tin tin!" },
            { stdin: "Vario", expectedOutput: "Kendaraan: Vario\nVario: tin tin!", hidden: true },
          ],
          hints: [
            "Blank pertama ada di deklarasi class: kata yang menyatakan Motor mewarisi Kendaraan.",
            "Blank kedua adalah nama method milik Motor yang ingin dipanggil pada objek m.",
            "Jawabannya: extends untuk blank pertama, klakson untuk blank kedua.",
          ],
        },
      ],
    },
    {
      slug: "oop-super-constructor",
      title: "super: Constructor dan Method Induk",
      summary: "Panggil constructor induk dengan super(...), dan jalankan versi induk lewat super.method().",
      steps: [
        {
          kind: "theory",
          title: "Constructor tidak diwarisi, tapi bisa dipanggil",
          body: "Constructor tidak pernah diwariskan. Setiap class menyusun constructor sendiri, dan subclass bertanggung jawab mengisi bagian yang dimiliki induknya. Cara ilainya memanggil constructor induk: `super(daftarArgumen)`, dan ia wajib menjadi pernyataan pertama di dalam constructor subclass.\n\nKalau kamu tidak menulis `super(...)` sama sekali, compiler diam-diam menyisipkan `super()` tanpa argumen. Masalah muncul saat induk tidak punya constructor tanpa parameter: kompilasi gagal dengan pesan tentang constructor yang tidak cocok. Solusinya selalu sama: panggil sendiri constructor induk yang benar.\n\nSelain constructor, `super` juga bisa memanggil method induk yang sudah dioverride: `super.tampilkan()` menjalankan versi induk. Pola ini dipakai saat subclass ingin menambah perilaku, bukan menggantinya total.",
          code: {
            language: "java",
            content:
              "class Akun {\n    String pemilik;\n    int saldo;\n\n    Akun(String pemilik, int saldo) {\n        this.pemilik = pemilik;\n        this.saldo = saldo;\n    }\n\n    void tampilkan() {\n        System.out.println(pemilik + \": \" + saldo);\n    }\n}\n\nclass AkunPremium extends Akun {\n    int bonus;\n\n    AkunPremium(String pemilik, int saldo, int bonus) {\n        super(pemilik, saldo); // isi bagian induk lebih dulu\n        this.bonus = bonus;\n    }\n\n    @Override\n    void tampilkan() {\n        super.tampilkan();          // jalankan versi induk\n        System.out.println(\"Bonus: \" + bonus);\n    }\n}",
            caption: "super(...) mengisi field induk, super.tampilkan() menambah isi versi induk.",
          },
        },
        {
          kind: "code",
          title: "Perbaiki constructor Kucing",
          prompt:
            "Program ini gagal dikompilasi. Constructor `Kucing` belum mengisi bagian yang dimiliki induknya, padahal `Hewan` tidak punya constructor tanpa parameter. Cari dan perbaiki satu kesalahannya, lalu jalankan sampai tes lulus.",
          mode: "fix",
          template:
            'import java.util.Scanner;\n\nclass Hewan {\n    String nama;\n\n    Hewan(String nama) {\n        this.nama = nama;\n    }\n\n    void sapa() {\n        System.out.println("Aku hewan " + nama);\n    }\n}\n\nclass Kucing extends Hewan {\n    Kucing(String nama) {\n        // masih kosong\n    }\n\n    void sapa() {\n        super.sapa();\n        System.out.println(nama + ": miaw");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        Kucing k = new Kucing(in.next());\n        k.sapa();\n    }\n}',
          solution:
            'import java.util.Scanner;\n\nclass Hewan {\n    String nama;\n\n    Hewan(String nama) {\n        this.nama = nama;\n    }\n\n    void sapa() {\n        System.out.println("Aku hewan " + nama);\n    }\n}\n\nclass Kucing extends Hewan {\n    Kucing(String nama) {\n        super(nama);\n    }\n\n    void sapa() {\n        super.sapa();\n        System.out.println(nama + ": miaw");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        Kucing k = new Kucing(in.next());\n        k.sapa();\n    }\n}',
          tests: [
            { stdin: "Milo", expectedOutput: "Aku hewan Milo\nMilo: miaw" },
            { stdin: "Oren", expectedOutput: "Aku hewan Oren\nOren: miaw" },
            { stdin: "Nala", expectedOutput: "Aku hewan Nala\nNala: miaw", hidden: true },
          ],
          hints: [
            "Baca pesan error kompilasinya: compiler mencari constructor Hewan tanpa parameter dan tidak menemukannya.",
            "Constructor subclass harus meneruskan datanya ke constructor induk lewat super(...), dan itu ditulis sebagai pernyataan pertama.",
            "Isi constructor Kucing dengan: super(nama);",
          ],
        },
      ],
    },
    {
      slug: "oop-overriding-annotation",
      title: "Overriding dan @Override",
      summary: "Tulis ulang method induk dengan signature sama, dan biarkan @Override menjaga kebenarannya.",
      steps: [
        {
          kind: "theory",
          title: "Mengganti perilaku warisan",
          body: "Overriding terjadi saat subclass menulis method dengan nama, parameter, dan return type yang sama persis dengan milik induknya. Versi subclass menutupi versi induk: begitu objek dibuat dari subclass, pemanggilan method selalu mendarat di versi barunya.\n\nAnotasi `@Override` di atas method tidak wajib, tapi sangat disarankan. Ia memerintahkan compiler memeriksa bahwa method ini benar-benar mengoverride sesuatu. Salah ketik nama, salah parameter, atau salah huruf besar kecil langsung jadi error saat kompilasi, bukan bug diam yang baru ketahuan jauh di kemudian hari.\n\nJangan campur dengan overloading. Overloading adalah dua method bernama sama dengan parameter berbeda, biasanya dalam satu class. Overriding adalah signature yang sama persis, tapi di subclass. Return type override harus sama atau lebih spesifik (covariant) dari versi induknya.",
          code: {
            language: "java",
            content:
              "class Hewan {\n    void suara() {\n        System.out.println(\"...\");\n    }\n}\n\nclass Anjing extends Hewan {\n    @Override\n    void suara() {\n        System.out.println(\"guk guk\");\n    }\n}\n\n// jika tertulis @Override void suara(String e) { }\n// kompilasi gagal: parameternya beda, itu bukan override",
            caption: "@Override mengubah salah ketik berbahaya menjadi error kompilasi.",
          },
        },
        {
          kind: "quiz",
          question:
            "Dua method bernama `hitung` berada dalam satu class yang sama: `int hitung(int a)` dan `int hitung(int a, int b)`. Ini disebut?",
          options: ["overriding", "overloading", "upcasting", "implementing"],
          answer: 1,
          explanation:
            "Nama sama dengan parameter berbeda dalam satu class adalah overloading. Overriding mensyaratkan signature yang sama persis, dan terjadi antara induk dan subclass.",
        },
        {
          kind: "code",
          title: "Override peran Manajer",
          prompt:
            "Lengkapi class `Manajer` supaya mengoverride method `peran` milik `Pegawai`: sertakan anotasi pemeriksa compiler dan nama method yang tepat. Program membaca dua kata, lalu memperkenalkan pegawai sesuai jenisnya.",
          mode: "fill",
          template:
            'import java.util.Scanner;\n\nclass Pegawai {\n    String nama;\n\n    Pegawai(String nama) {\n        this.nama = nama;\n    }\n\n    String peran() {\n        return "pegawai umum";\n    }\n\n    void perkenalan() {\n        System.out.println(nama + " bertugas sebagai " + peran());\n    }\n}\n\nclass Manajer extends Pegawai {\n    Manajer(String nama) {\n        super(nama);\n    }\n\n    @___\n    String ___() {\n        return "manajer tim";\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        Pegawai p;\n        if (in.next().equals("manajer")) {\n            p = new Manajer(in.next());\n        } else {\n            p = new Pegawai(in.next());\n        }\n        p.perkenalan();\n    }\n}',
          solution:
            'import java.util.Scanner;\n\nclass Pegawai {\n    String nama;\n\n    Pegawai(String nama) {\n        this.nama = nama;\n    }\n\n    String peran() {\n        return "pegawai umum";\n    }\n\n    void perkenalan() {\n        System.out.println(nama + " bertugas sebagai " + peran());\n    }\n}\n\nclass Manajer extends Pegawai {\n    Manajer(String nama) {\n        super(nama);\n    }\n\n    @Override\n    String peran() {\n        return "manajer tim";\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        Pegawai p;\n        if (in.next().equals("manajer")) {\n            p = new Manajer(in.next());\n        } else {\n            p = new Pegawai(in.next());\n        }\n        p.perkenalan();\n    }\n}',
          tests: [
            { stdin: "manajer Dina", expectedOutput: "Dina bertugas sebagai manajer tim" },
            { stdin: "staf Budi", expectedOutput: "Budi bertugas sebagai pegawai umum" },
            { stdin: "manajer Rara", expectedOutput: "Rara bertugas sebagai manajer tim", hidden: true },
          ],
          hints: [
            "Blank pertama adalah anotasi yang menyuruh compiler memeriksa sebuah override.",
            "Blank kedua harus sama persis dengan nama method yang ada di Pegawai, tanpa parameter.",
            "Jawabannya: @Override di atas, lalu String peran().",
          ],
        },
      ],
    },
    {
      slug: "oop-polymorphism-referensi-induk",
      title: "Polymorphism: Referensi Induk, Objek Anak",
      summary: "Satu referensi induk bisa menampung banyak bentuk objek, dan JVM memilih method sesuai objek aslinya.",
      steps: [
        {
          kind: "theory",
          title: "Satu variabel, banyak perilaku",
          body: "Polymorphism berarti banyak bentuk. Di Java bentuknya yang paling harian: variabel bertipe induk boleh menampung objek subclass. `Hewan h = new Anjing();` sah sepenuhnya, karena Anjing adalah Hewan. Arah sebaliknya tidak: `Anjing a = new Hewan();` ditolak compiler.\n\nPertanyaan pentingnya: kalau `h.suara()` dipanggil, versi milik siapa yang jalan? Jawabannya ditentukan saat program berjalan, berdasarkan tipe objek aslinya, bukan tipe variabelnya. Mekanisme ini disebut dynamic dispatch. Karena `h` menampung Anjing, yang tercetak adalah guk guk.\n\nManfaat besarnya muncul di koleksi campuran. Satu array `Hewan[]` boleh berisi anjing, kucing, dan burung sekaligus. Satu loop `h.suara()` memproses semuanya tanpa satu pun `if`. Menambah jenis hewan baru tidak mengubah loop itu sama sekali, cukup subclass baru dengan override-nya.",
          code: {
            language: "java",
            content:
              "Hewan h = new Anjing();\nh.suara(); // guk guk, sesuai objek aslinya\n\nHewan[] kebun = { new Anjing(), new Kucing(), new Burung() };\nfor (Hewan x : kebun) {\n    x.suara(); // tiap objek menjawab dengan caranya sendiri\n}",
            caption: "Tipe variabel menentukan apa yang boleh dipanggil; tipe objek menentukan isi yang berjalan.",
          },
        },
        {
          kind: "quiz",
          question:
            "Perhatikan kode berikut.\n\n```java\nHewan h = new Kucing();\nh.suara();\n```\n\n`Hewan.suara()` mencetak `...`, dan `Kucing` mengoverride `suara()` untuk mencetak `miaw`. Apa keluarannya?",
          options: ["...", "miaw", "...\nmiaw", "Error saat kompilasi"],
          answer: 1,
          explanation:
            "Dynamic dispatch memilih berdasarkan tipe objek, yaitu Kucing, meski variabelnya bertipe Hewan. Yang tercetak miaw.",
        },
        {
          kind: "code",
          title: "Kebun hewan yang polymorphic",
          prompt:
            "Lengkapi class `Anjing` supaya menjadi subclass `Hewan` yang mengoverride `suara`. Array di main sengaja bertipe `Hewan[]` berisi campuran objek; perhatikan keluarannya per baris.",
          mode: "fill",
          template:
            'import java.util.Scanner;\n\nclass Hewan {\n    String nama;\n\n    Hewan(String nama) {\n        this.nama = nama;\n    }\n\n    void suara() {\n        System.out.println(nama + " mengeluarkan suara");\n    }\n}\n\nclass Anjing ___ Hewan {\n    Anjing(String nama) {\n        super(nama);\n    }\n\n    @___\n    void suara() {\n        System.out.println(nama + ": guk guk");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        Hewan[] kebun = {\n            new Anjing(in.next()),\n            new Anjing(in.next()),\n            new Hewan(in.next())\n        };\n        for (Hewan h : kebun) {\n            h.suara();\n        }\n    }\n}',
          solution:
            'import java.util.Scanner;\n\nclass Hewan {\n    String nama;\n\n    Hewan(String nama) {\n        this.nama = nama;\n    }\n\n    void suara() {\n        System.out.println(nama + " mengeluarkan suara");\n    }\n}\n\nclass Anjing extends Hewan {\n    Anjing(String nama) {\n        super(nama);\n    }\n\n    @Override\n    void suara() {\n        System.out.println(nama + ": guk guk");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        Hewan[] kebun = {\n            new Anjing(in.next()),\n            new Anjing(in.next()),\n            new Hewan(in.next())\n        };\n        for (Hewan h : kebun) {\n            h.suara();\n        }\n    }\n}',
          tests: [
            {
              stdin: "Bobby\nMax\nKucing",
              expectedOutput: "Bobby: guk guk\nMax: guk guk\nKucing mengeluarkan suara",
            },
            {
              stdin: "Dig\nBruno\nIkan",
              expectedOutput: "Dig: guk guk\nBruno: guk guk\nIkan mengeluarkan suara",
            },
            {
              stdin: "Scooby\nPluto\nKoi",
              expectedOutput: "Scooby: guk guk\nPluto: guk guk\nKoi mengeluarkan suara",
              hidden: true,
            },
          ],
          hints: [
            "Blank pertama di deklarasi class: kata yang menyatakan Anjing mewarisi Hewan.",
            "Blank kedua adalah anotasi standar di atas method yang mengoverride.",
            "Jawabannya: extends dan @Override.",
          ],
        },
      ],
    },
    {
      slug: "oop-abstract-class",
      title: "Abstract Class dan Abstract Method",
      summary: "Kerangka class yang tidak bisa di-new, dengan method wajib yang harus diisi subclass.",
      steps: [
        {
          kind: "theory",
          title: "Kerangka yang melarang instansiasi",
          body: "Class yang ditandai `abstract` tidak bisa dibuat objeknya: `new Bentuk()` langsung error. Ia dirancang sebagai kerangka bersama: menyimpan field dan method yang sudah jadi, sekaligus memaksa setiap subclass mengisi bagian yang belum selesai.\n\nBagian yang belum selesai itu adalah abstract method: method dengan tanda `abstract` dan tanpa isi, ditutup titik koma. Setiap subclass konkret wajib mengisi semuanya. Kalau sebuah subclass hanya mengisi sebagian, subclass itu sendiri harus diberi tanda abstract dan tetap tidak bisa di-new.\n\nAbstract class boleh punya constructor, field, dan method biasa; constructor-nya dipanggil lewat `super(...)` oleh subclass. Posisinya di antara class biasa dan interface: masih boleh membawa state dan kode, tapi sudah memaksa kontrak ke semua turunannya.",
          code: {
            language: "java",
            content:
              "abstract class Bentuk {\n    abstract int luas(); // tanpa isi, wajib diisi subclass\n\n    void cetak() { // method biasa boleh ada\n        System.out.println(\"Luas: \" + luas());\n    }\n}\n\nclass Persegi extends Bentuk {\n    int sisi;\n\n    Persegi(int sisi) {\n        this.sisi = sisi;\n    }\n\n    @Override\n    int luas() {\n        return sisi * sisi;\n    }\n}",
            caption: "new Bentuk() ditolak compiler; new Persegi(...) sah dan wajib mengisi luas().",
          },
        },
        {
          kind: "quiz",
          question: "Manakah pernyataan yang BENAR tentang abstract class?",
          options: [
            "Abstract class bisa langsung dibuat objeknya dengan new",
            "Abstract class boleh punya method biasa yang sudah punya isi",
            "Abstract method wajib punya isi di class induknya",
            "Semua subclass dari abstract class boleh mengabaikan method abstraknya",
          ],
          answer: 1,
          explanation:
            "Abstract class boleh berisi method biasa lengkap dengan isinya. Yang dilarang adalah membuat objek langsung darinya, dan abstract method justru tidak boleh punya isi di induk.",
        },
        {
          kind: "code",
          title: "Perbaiki class Bentuk",
          prompt:
            "Program ini gagal dikompilasi: ada class yang berisi method `abstract` tapi tidak dinyatakan abstract. Cari satu kesalahannya, perbaiki, lalu jalankan sampai tes lulus.",
          mode: "fix",
          template:
            'import java.util.Scanner;\n\nclass Bentuk {\n    abstract int luas();\n}\n\nclass Persegi extends Bentuk {\n    int sisi;\n\n    Persegi(int sisi) {\n        this.sisi = sisi;\n    }\n\n    @Override\n    int luas() {\n        return sisi * sisi;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        Bentuk b = new Persegi(in.nextInt());\n        System.out.println("Luas: " + b.luas());\n    }\n}',
          solution:
            'import java.util.Scanner;\n\nabstract class Bentuk {\n    abstract int luas();\n}\n\nclass Persegi extends Bentuk {\n    int sisi;\n\n    Persegi(int sisi) {\n        this.sisi = sisi;\n    }\n\n    @Override\n    int luas() {\n        return sisi * sisi;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        Bentuk b = new Persegi(in.nextInt());\n        System.out.println("Luas: " + b.luas());\n    }\n}',
          tests: [
            { stdin: "5", expectedOutput: "Luas: 25" },
            { stdin: "12", expectedOutput: "Luas: 144" },
            { stdin: "9", expectedOutput: "Luas: 81", hidden: true },
          ],
          hints: [
            "Pesan error menyebut class yang tidak abstract padahal punya method abstract.",
            "Class yang memuat method abstract wajib ditandai abstract juga.",
            "Ubah baris pertamanya menjadi: abstract class Bentuk {",
          ],
        },
      ],
    },
    {
      slug: "oop-interface-dasar",
      title: "Interface dan implements",
      summary: "Kontrak murni berisi daftar method, dan class yang menepatinya lewat implements.",
      steps: [
        {
          kind: "theory",
          title: "Kontrak tanpa implementasi",
          body: "Interface adalah daftar kemampuan yang harus dipenuhi sebuah class, ditulis tanpa isi: `interface MetodeBayar { String label(); int biaya(int total); }`. Method di interface otomatis `public abstract`, jadi tidak perlu menulisnya. Class yang ingin menepati kontraknya memakai kata kunci `implements` dan wajib mengisi semua methodnya dengan modifier `public`.\n\nNilai utamanya: kode lain bisa bergantung pada kontrak, bukan pada class konkret. Method `cetak(MetodeBayar m, int total)` menerima QRIS, KartuKredit, atau metode baru mana pun yang belum dibayangkan, asal mengimplements `MetodeBayar`. Tidak ada satu pun `if` per jenis.\n\nBeda dengan abstract class: satu class hanya boleh `extends` satu induk, tapi boleh `implements` banyak interface sekaligus. Interface juga tidak menyimpan state; satu-satunya field yang sah adalah konstanta `public static final`.",
          code: {
            language: "java",
            content:
              "interface MetodeBayar {\n    String label();\n    int biaya(int total);\n}\n\nclass QRIS implements MetodeBayar {\n    public String label() {\n        return \"QRIS\";\n    }\n\n    public int biaya(int total) {\n        return 0;\n    }\n}\n\n// di tempat lain, bergantung pada kontrak saja:\nstatic void cetak(MetodeBayar m, int total) {\n    System.out.println(m.label() + \": \" + m.biaya(total));\n}",
            caption: "cetak tidak tahu dan tidak peduli class aslinya, cukup kontraknya.",
          },
        },
        {
          kind: "quiz",
          question: "Kata kunci apa yang dipakai class untuk menyatakan menepati kontrak sebuah interface?",
          options: ["extends", "implements", "imports", "abstract"],
          answer: 1,
          explanation:
            "class A implements B berarti A wajib mengisi semua method kontrak B. extends dipakai untuk mewarisi class atau interface lain (antara interface).",
        },
        {
          kind: "code",
          title: "Lengkapi KartuKredit",
          prompt:
            "Lengkapi class `KartuKredit` supaya menepati kontrak `MetodeBayar`: kata kunci penerapannya dan nama method pertama yang diisi. Program lalu mencetak biaya kedua metode untuk total yang dibaca dari input.",
          mode: "fill",
          template:
            'import java.util.Scanner;\n\ninterface MetodeBayar {\n    String label();\n\n    int biaya(int total);\n}\n\nclass QRIS implements MetodeBayar {\n    public String label() {\n        return "QRIS";\n    }\n\n    public int biaya(int total) {\n        return 0;\n    }\n}\n\nclass KartuKredit ___ MetodeBayar {\n    public String ___() {\n        return "Kartu Kredit";\n    }\n\n    public int biaya(int total) {\n        return total * 2 / 100;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int total = in.nextInt();\n        MetodeBayar a = new QRIS();\n        MetodeBayar b = new KartuKredit();\n        System.out.println(a.label() + ": biaya " + a.biaya(total));\n        System.out.println(b.label() + ": biaya " + b.biaya(total));\n    }\n}',
          solution:
            'import java.util.Scanner;\n\ninterface MetodeBayar {\n    String label();\n\n    int biaya(int total);\n}\n\nclass QRIS implements MetodeBayar {\n    public String label() {\n        return "QRIS";\n    }\n\n    public int biaya(int total) {\n        return 0;\n    }\n}\n\nclass KartuKredit implements MetodeBayar {\n    public String label() {\n        return "Kartu Kredit";\n    }\n\n    public int biaya(int total) {\n        return total * 2 / 100;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int total = in.nextInt();\n        MetodeBayar a = new QRIS();\n        MetodeBayar b = new KartuKredit();\n        System.out.println(a.label() + ": biaya " + a.biaya(total));\n        System.out.println(b.label() + ": biaya " + b.biaya(total));\n    }\n}',
          tests: [
            { stdin: "50000", expectedOutput: "QRIS: biaya 0\nKartu Kredit: biaya 1000" },
            { stdin: "12000", expectedOutput: "QRIS: biaya 0\nKartu Kredit: biaya 240" },
            { stdin: "9999", expectedOutput: "QRIS: biaya 0\nKartu Kredit: biaya 199", hidden: true },
          ],
          hints: [
            "Blank pertama menyatakan bahwa KartuKredit menepati kontrak MetodeBayar.",
            "Blank kedua adalah nama method kontrak yang mengembalikan String.",
            "Jawabannya: implements dan label.",
          ],
        },
      ],
    },
    {
      slug: "oop-multiple-interface",
      title: "Banyak Interface dan Default Method",
      summary: "Satu class, banyak kontrak sekaligus, plus method bawaan lewat kata kunci default.",
      steps: [
        {
          kind: "theory",
          title: "Banyak kontrak dalam satu class",
          body: "Karena `extends` hanya boleh satu, kebutuhan kombinasi kemampuan ditampung oleh interface: satu class boleh implements sebanyak apa pun, dipisah koma. `class Dokumen implements Cetak, Arsip` menyatakan Dokumen menepati dua kontrak sekaligus dan wajib mengisi semuanya.\n\nSejak Java 8, interface boleh punya method yang sudah berisi implementasi bawaan, ditandai kata kunci `default`. Class penerapannya bebas: memakai bawaannya langsung, atau mengoverride dengan versinya sendiri. Inilah cara interface berkembang tanpa memaksa semua class lama ditulis ulang.\n\nSatu aturan penting: kalau dua interface yang diimplements memberi default method dengan nama sama, compiler menolak sampai class itu mengoverride method tersebut sendiri, supaya jelas versi mana yang berlaku.",
          code: {
            language: "java",
            content:
              "interface Cetak {\n    default void siapCetak() {\n        System.out.println(\"siap dicetak\");\n    }\n}\n\ninterface Arsip {\n    void simpan();\n}\n\nclass Laporan implements Cetak, Arsip {\n    public void simpan() {\n        System.out.println(\"tersimpan\");\n    }\n    // siapCetak() dipakai dari bawaan Cetak\n}",
            caption: "Dua kontrak sekali jalan; default method boleh langsung dipakai.",
          },
        },
        {
          kind: "quiz",
          question: "Kata kunci apa yang menandai method interface punya isi bawaan?",
          options: ["static", "default", "final", "native"],
          answer: 1,
          explanation:
            "Method interface yang ditulis `default void nama() { ... }` punya implementasi bawaan dan tidak wajib dioverride oleh class penerapnya.",
        },
        {
          kind: "quiz",
          question:
            "Class P mengimplements dua interface yang sama-sama punya `default void jalankan()`. Apa yang terjadi?",
          options: [
            "Versi pertama yang dipakai, sesuai urutan implements",
            "Kedua versi dijalankan berurutan",
            "Kompilasi gagal sampai P mengoverride jalankan() sendiri",
            "Default method otomatis dihapus dari keduanya",
          ],
          answer: 2,
          explanation:
            "Compiler tidak mau menebak di antara dua bawaan yang sama nama. Class harus mengoverride method itu untuk menyatakan pilihannya secara eksplisit.",
        },
      ],
    },
    {
      slug: "oop-instanceof-casting",
      title: "instanceof dan Casting Aman",
      summary: "Turunkan kembali tipe referensi dengan aman: cek dulu dengan instanceof, atau pakai pattern matching.",
      steps: [
        {
          kind: "theory",
          title: "Menurunkan tipe tanpa menjatuhkan program",
          body: "Referensi bertipe induk hanya melihat anggota induk. Kalau objek aslinya `Anjing` punya method khusus `gulung()`, variabel `Hewan h` tidak bisa memanggilnya langsung. Untuk itu perlu downcast: `Anjing a = (Anjing) h;` yang menyatakan bahwa di balik referensi Hewan ini sebenarnya ada Anjing.\n\nTulisannya sah selalu, tapi kebenarannya baru diperiksa saat program berjalan. Kalau ternyata `h` menampung Kucing, cast itu melempar `ClassCastException` dan program berhenti. Karena itu pola amannya selalu dua langkah: periksa dengan `instanceof` dulu, baru cast di dalam blok if.\n\nSejak Java 16 ada versi ringkasnya, pattern matching: `if (h instanceof Anjing a) { a.gulung(); }`. Compiler sekaligus membuat variabel `a` bertipe Anjing, jadi cast manual tidak perlu lagi. Nilai `null` selalu dianggap bukan instance apa pun dan melewati blok, sehingga pola ini aman tanpa pemeriksaan null tambahan.",
          code: {
            language: "java",
            content:
              "static void periksa(Hewan h) {\n    if (h instanceof Anjing) {\n        Anjing a = (Anjing) h; // aman: baru saja dicek\n        a.gulung();\n    }\n\n    // Java 16 ke atas, lebih ringkas:\n    if (h instanceof Anjing a) {\n        a.gulung(); // a langsung bertipe Anjing\n    }\n}",
            caption: "Cek dulu, cast kemudian; atau biarkan pattern matching yang mengurus keduanya.",
          },
        },
        {
          kind: "quiz",
          question:
            "Variabel `Hewan h` sedang menampung objek `Kucing`. Apa akibat dari `(Anjing) h`?",
          options: [
            "Error saat kompilasi karena tipenya tidak cocok",
            "ClassCastException dilempar saat program berjalan",
            "Objek Kucing otomatis diubah menjadi Anjing",
            "Cast diam-diam menghasilkan null",
          ],
          answer: 1,
          explanation:
            "Compiler percaya programmer, jadi cast antar class dalam satu hierarki lolos kompilasi. Pemeriksaan aslinya terjadi saat berjalan, dan di situ dilempar ClassCastException.",
        },
        {
          kind: "quiz",
          question: "Apa keuntungan `if (h instanceof Anjing a)` dibanding cek dan cast terpisah?",
          options: [
            "Programnya berjalan lebih cepat karena tidak ada pemeriksaan",
            "Variabel a langsung bertipe Anjing di dalam blok, tanpa cast manual",
            "Cast yang gagal tidak lagi melempar exception",
            "Pola ini juga menerima null sebagai Anjing",
          ],
          answer: 1,
          explanation:
            "Pattern matching menggabungkan pemeriksaan dan pembuatan variabel: jika cek lolos, a sudah bertipe Anjing. Null tetap dianggap bukan instance, jadi blok dilewati.",
        },
      ],
    },
    {
      slug: "oop-object-equals-tostring",
      title: "Class Object: equals dan toString",
      summary: "Semua class berujung di Object; kenali perilaku bawaan equals dan toString sebelum mengoverride.",
      steps: [
        {
          kind: "theory",
          title: "Induk dari semuanya",
          body: "Class apa pun di Java, yang ditulis sendiri maupun bawaan, pada akhirnya turunan `Object`. Karena itu setiap objek punya method warisannya: `equals`, `toString`, `hashCode`, `getClass`, dan beberapa lainnya. Inilah alasan variabel `Object` bisa menampung apa saja.\n\nPerilaku bawaannya memang sengaja minimal. `equals` bawaan membandingkan referensi, sama persis dengan `==`: dua objek berisi sama dianggap beda. `toString` bawaan menghasilkan nama class, tanda @, lalu angka heksadesimal identitas objek, misalnya `Titik@1b6d3586`. Method `System.out.println(obj)` diam-diam memanggil `toString`, jadi cetakan default itulah yang kamu lihat.\n\nKarena itu dua override paling sering di Java: `equals` agar dua objek berisi sama dianggap sama, dan `toString` agar pencetakan terbaca manusia. Konsekuensi `equals` terhadap `hashCode` akan dibahas tuntas di modul Collections, karena di sanalah ia paling sering menggigit.",
          code: {
            language: "java",
            content:
              "class Titik {\n    int x, y;\n\n    Titik(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n\n    @Override\n    public String toString() {\n        return \"(\" + x + \", \" + y + \")\";\n    }\n\n    @Override\n    public boolean equals(Object o) {\n        if (!(o instanceof Titik t)) return false;\n        return t.x == x && t.y == y;\n    }\n}",
            caption: "Setelah dioverride: println(t) mencetak (3, 4), dan t1.equals(t2) membandingkan isi.",
          },
        },
        {
          kind: "quiz",
          question:
            "Class `Kucing` tidak mengoverride `toString`. Kira-kira apa hasil `System.out.println(new Kucing())`?",
          options: [
            "Kucing",
            "meow",
            "Kucing@6d06d69c",
            "Error, toString belum ada",
          ],
          answer: 2,
          explanation:
            "toString bawaan dari Object menghasilkan nama class, tanda @, dan representasi heksadesimal identitas objek. Angkanya beda tiap objek, bentuknya selalu seperti itu.",
        },
        {
          kind: "quiz",
          question:
            "Dua objek `Titik` dibuat terpisah dengan isi sama: t1 = (3, 4) dan t2 = (3, 4), tanpa override `equals`. Apa hasil `t1.equals(t2)`?",
          options: [
            "true, karena isinya sama",
            "false, karena bawaan equals membandingkan referensi",
            "Error saat kompilasi",
            "true hanya jika keduanya dicetak lebih dulu",
          ],
          answer: 1,
          explanation:
            "Tanpa override, equals berperilaku persis seperti ==: membandingkan apakah kedua variabel menunjuk objek yang sama. Dua objek berbeda selalu false.",
        },
      ],
    },
    {
      slug: "oop-latihan-bentuk",
      title: "Latihan: Hierarki Bentuk",
      summary: "Gabungkan abstract class, overriding, dan polymorphism dalam satu hierarki luas() yang utuh.",
      steps: [
        {
          kind: "theory",
          title: "Satu kerangka, tiga bentuk",
          body: "Lesson ini merangkai semuanya: `Bentuk` sebagai abstract class dengan method abstrak `luas()`, tiga subclass yang masing-masing mengisi rumusnya, dan satu array `Bentuk[]` yang menampung ketiganya sekaligus.\n\nPerhatikan bahwa loop di main tidak tahu dan tidak peduli isi arraynya bentuk apa. Ia memanggil `b.luas()` dan dynamic dispatch yang mengarahkan ke rumus yang benar. Inilah bentuk desain yang sehat: perilaku baru ditambahkan lewat subclass, bukan lewat rantai `if` yang makin panjang.\n\nTugasmu melengkapi dua bagian: rumus luas `Segitiga` (alas kali tinggi dibagi dua, dengan pembagian bilangan bulat) dan pemanggilan method luas di dalam loop.",
          code: {
            language: "java",
            content:
              "Bentuk[] daftar = {\n    new Persegi(4),\n    new PersegiPanjang(3, 5),\n    new Segitiga(6, 8)\n};\n\nfor (Bentuk b : daftar) {\n    System.out.println(b.luas()); // 16, 15, 24\n}",
            caption: "Satu loop, tiga rumus berbeda, tanpa satu pun if.",
          },
        },
        {
          kind: "code",
          title: "Selesaikan hierarki Bentuk",
          prompt:
            "Lengkapi rumus luas `Segitiga` (alas * tinggi / 2) dan pemanggilan luas di loop utama. Program membaca lima angka: sisi persegi, panjang dan lebar persegi panjang, lalu alas dan tinggi segitiga.",
          mode: "fill",
          template:
            'import java.util.Scanner;\n\nabstract class Bentuk {\n    abstract int luas();\n}\n\nclass Persegi extends Bentuk {\n    int sisi;\n\n    Persegi(int sisi) {\n        this.sisi = sisi;\n    }\n\n    int luas() {\n        return sisi * sisi;\n    }\n}\n\nclass PersegiPanjang extends Bentuk {\n    int panjang;\n    int lebar;\n\n    PersegiPanjang(int panjang, int lebar) {\n        this.panjang = panjang;\n        this.lebar = lebar;\n    }\n\n    int luas() {\n        return panjang * lebar;\n    }\n}\n\nclass Segitiga extends Bentuk {\n    int alas;\n    int tinggi;\n\n    Segitiga(int alas, int tinggi) {\n        this.alas = alas;\n        this.tinggi = tinggi;\n    }\n\n    int luas() {\n        return ___ * ___ / 2;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        Bentuk[] daftar = {\n            new Persegi(in.nextInt()),\n            new PersegiPanjang(in.nextInt(), in.nextInt()),\n            new Segitiga(in.nextInt(), in.nextInt())\n        };\n        for (Bentuk b : daftar) {\n            System.out.println(b.___());\n        }\n    }\n}',
          solution:
            'import java.util.Scanner;\n\nabstract class Bentuk {\n    abstract int luas();\n}\n\nclass Persegi extends Bentuk {\n    int sisi;\n\n    Persegi(int sisi) {\n        this.sisi = sisi;\n    }\n\n    int luas() {\n        return sisi * sisi;\n    }\n}\n\nclass PersegiPanjang extends Bentuk {\n    int panjang;\n    int lebar;\n\n    PersegiPanjang(int panjang, int lebar) {\n        this.panjang = panjang;\n        this.lebar = lebar;\n    }\n\n    int luas() {\n        return panjang * lebar;\n    }\n}\n\nclass Segitiga extends Bentuk {\n    int alas;\n    int tinggi;\n\n    Segitiga(int alas, int tinggi) {\n        this.alas = alas;\n        this.tinggi = tinggi;\n    }\n\n    int luas() {\n        return alas * tinggi / 2;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        Bentuk[] daftar = {\n            new Persegi(in.nextInt()),\n            new PersegiPanjang(in.nextInt(), in.nextInt()),\n            new Segitiga(in.nextInt(), in.nextInt())\n        };\n        for (Bentuk b : daftar) {\n            System.out.println(b.luas());\n        }\n    }\n}',
          tests: [
            { stdin: "4\n3 5\n6 8", expectedOutput: "16\n15\n24" },
            { stdin: "7\n2 9\n10 4", expectedOutput: "49\n18\n20" },
            { stdin: "10\n5 2\n8 3", expectedOutput: "100\n10\n12", hidden: true },
          ],
          hints: [
            "Dua blank pertama ada di rumus Segitiga: luasnya alas kali tinggi, dibagi dua.",
            "Blank terakhir adalah nama method yang dipanggil pada tiap objek di dalam loop.",
            "Jawabannya: return alas * tinggi / 2; dan b.luas() di loop.",
          ],
        },
      ],
    },
    // ==================== MODUL 3: Collections Framework ====================
    {
      slug: "col-generics-list",
      title: "Generics dan List",
      summary: "List dengan tipe elemen yang diketahui compiler: aman saat kompilasi, bukan saat berjalan.",
      steps: [
        {
          kind: "theory",
          title: "Tipe di dalam kurung sudut",
          body: "`List` adalah kontrak untuk kumpulan berurutan yang boleh diakses lewat index. Implementasi paling harian adalah `ArrayList`. Bagian `<String>` pada `List<String>` disebut generics: ia menyatakan tipe elemen yang boleh masuk, dan compiler memegang janji itu.\n\nManfaatnya nyata saat kompilasi. Pada `List<String>`, panggilan `add(123)` langsung ditolak compiler. Pada era tanpa generics, semua list menampung `Object`, dan kesalahan tipe baru meledak saat program berjalan dalam bentuk `ClassCastException`. Generics memindahkan kelas error ini ke depan, saat masih murah untuk diperbaiki.\n\nDua detail yang sering keluar: tipe primitif tidak boleh, jadi yang sah `List<Integer>`, bukan `List<int>` (autoboxing yang mengubah `int` ke `Integer` saat masuk list). Dan tanda `<>` kosong di sisi kanan disebut diamond operator: compiler menyimpulkan tipenya dari sisi kiri.",
          code: {
            language: "java",
            content:
              "List<String> kata = new ArrayList<>();\nkata.add(\"kode\");\nkata.add(\"kita\");\nkata.add(123); // ditolak compiler: bukan String\n\nString pertama = kata.get(0);\nSystem.out.println(pertama + \" \" + kata.size()); // kode 2",
            caption: "Tipe elemen dijanjikan sekali, lalu ditegakkan di seluruh kode.",
          },
        },
        {
          kind: "quiz",
          question:
            "Pada `List<String> daftar = new ArrayList<>();`, apa yang terjadi dengan pernyataan `daftar.add(123);`?",
          options: [
            "Angka 123 otomatis diubah menjadi teks lalu masuk",
            "Program berjalan, tapi melempar ClassCastException saat elemen dibaca",
            "Kompilasi gagal karena tipe elemennya tidak cocok",
            "Elemen masuk tapi diabaikan saat iterasi",
          ],
          answer: 2,
          explanation:
            "Generics ditegakkan saat kompilasi: add hanya menerima String. Kode tidak pernah jadi, dan error tertangkap sebelum program dijalankan.",
        },
        {
          kind: "code",
          title: "Daftar kata bernomor",
          prompt:
            "Lengkapi program: siapkan list generik bertipe String, isi dengan n kata dari input, lalu cetak setiap kata dengan nomor urut dan totalnya di baris akhir.",
          mode: "fill",
          template:
            'import java.util.ArrayList;\nimport java.util.List;\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        List<___> kata = new ArrayList<>();\n        int n = in.nextInt();\n        for (int i = 0; i < n; i++) {\n            kata.___(in.next());\n        }\n        for (int i = 0; i < kata.size(); i++) {\n            System.out.println((i + 1) + ". " + kata.get(i));\n        }\n        System.out.println("Total: " + kata.size());\n    }\n}',
          solution:
            'import java.util.ArrayList;\nimport java.util.List;\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        List<String> kata = new ArrayList<>();\n        int n = in.nextInt();\n        for (int i = 0; i < n; i++) {\n            kata.add(in.next());\n        }\n        for (int i = 0; i < kata.size(); i++) {\n            System.out.println((i + 1) + ". " + kata.get(i));\n        }\n        System.out.println("Total: " + kata.size());\n    }\n}',
          tests: [
            { stdin: "3\nkode\nkita\njava", expectedOutput: "1. kode\n2. kita\n3. java\nTotal: 3" },
            { stdin: "1\ntunggal", expectedOutput: "1. tunggal\nTotal: 1" },
            { stdin: "2\nalpha\nbeta", expectedOutput: "1. alpha\n2. beta\nTotal: 2", hidden: true },
          ],
          hints: [
            "Blank pertama adalah tipe elemen list, sesuai janji di deklarasi List<...>.",
            "Blank kedua adalah method list untuk menambah elemen di posisi terakhir.",
            "Jawabannya: String dan add.",
          ],
        },
      ],
    },
    {
      slug: "col-arraylist-operasi",
      title: "ArrayList: Operasi Inti",
      summary: "add, get, set, remove, dan size: lima operasi yang menutup hampir semua kebutuhan harian.",
      steps: [
        {
          kind: "theory",
          title: "Lima operasi, satu index",
          body: "Enam method ArrayList menutup kebutuhan harian: `add(e)` menaruh di belakang, `get(i)` membaca index, `set(i, e)` mengganti isi index, `remove(i)` membuang index, `size()` menghitung isi, dan `contains(e)` mengecek keanggotaan. Semua index mulai dari 0, dan `get` dengan index di luar 0 sampai size minus satu melempar `IndexOutOfBoundsException`.\n\n`remove` punya efek samping yang sering mengejutkan: elemen di belakangnya digeser maju, ukuran menyusut satu. Kalau kamu menghapus sambil menaikkan index, elemen bisa terlewati. Pola yang lebih aman: iterasi dari belakang ke depan, atau kumpulkan dulu yang mau dihapus.\n\nDi balik layar, ArrayList hanya array biasa yang diperbesar otomatis saat penuh. Konsekuensinya: membaca lewat index sangat cepat, sementara menyisip atau menghapus di tengah berarti menggeser elemen, dan itu mahal untuk list besar.",
          code: {
            language: "java",
            content:
              "ArrayList<String> tugas = new ArrayList<>();\ntugas.add(\"desain\");\ntugas.add(\"kode\");\ntugas.add(\"uji\");\ntugas.set(1, \"koding\");   // posisi 1 ganti isi\ntugas.remove(0);          // desain keluar, sisanya bergeser\n\nSystem.out.println(tugas.contains(\"uji\")); // true\nSystem.out.println(tugas.get(0) + \" \" + tugas.size()); // koding 2",
            caption: "Setelah remove(0), koding naik ke index 0 dan size turun jadi 2.",
          },
        },
        {
          kind: "quiz",
          question:
            "List berisi [A, B, C]. Setelah `daftar.remove(0)` dijalankan, apa isinya dan di mana posisi B?",
          options: [
            "[B, C], dan B kini di index 0",
            "[B, C], dan B tetap di index 1",
            "[A, C], dan C pindah ke index 2",
            "[B, C], tapi size masih 3 sampai program berakhir",
          ],
          answer: 0,
          explanation:
            "remove menggeser elemen setelahnya maju satu langkah dan size menyusut. A keluar, B turun ke index 0, C ke index 1.",
        },
        {
          kind: "code",
          title: "Perbaiki penggantian tugas",
          prompt:
            "Program ini seharusnya mengganti tugas pertama menjadi GANTI, menghapus tugas kedua, lalu mencetak sisanya beserta jumlahnya. Ada satu kesalahan yang membuatnya gagal dikompilasi. Perbaiki, lalu jalankan sampai tes lulus.",
          mode: "fix",
          template:
            'import java.util.ArrayList;\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        ArrayList<String> tugas = new ArrayList<>();\n        for (int i = 0; i < 3; i++) {\n            tugas.add(in.next());\n        }\n        tugas.get(0) = "GANTI";\n        tugas.remove(1);\n        for (String t : tugas) {\n            System.out.println(t);\n        }\n        System.out.println("Sisa: " + tugas.size());\n    }\n}',
          solution:
            'import java.util.ArrayList;\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        ArrayList<String> tugas = new ArrayList<>();\n        for (int i = 0; i < 3; i++) {\n            tugas.add(in.next());\n        }\n        tugas.set(0, "GANTI");\n        tugas.remove(1);\n        for (String t : tugas) {\n            System.out.println(t);\n        }\n        System.out.println("Sisa: " + tugas.size());\n    }\n}',
          tests: [
            { stdin: "a b c", expectedOutput: "GANTI\nc\nSisa: 2" },
            { stdin: "x y z", expectedOutput: "GANTI\nz\nSisa: 2" },
            { stdin: "merah biru hijau", expectedOutput: "GANTI\nhijau\nSisa: 2", hidden: true },
          ],
          hints: [
            "Baca pesan errornya: ada baris yang berusaha menugaskan nilai ke hasil sebuah method, dan itu bukan variabel.",
            "ArrayList menyediakan method khusus untuk mengganti isi pada satu index: dia menerima index dan nilai barunya.",
            "Ganti baris bermasalah dengan: tugas.set(0, \"GANTI\");",
          ],
        },
      ],
    },
    {
      slug: "col-linkedlist",
      title: "LinkedList Sekilas",
      summary: "Rantai node yang kuat di ujung dan lemah di akses acak, plus perannya sebagai Deque.",
      steps: [
        {
          kind: "theory",
          title: "Vagon yang saling memegang",
          body: "`LinkedList` menyimpan data sebagai rangkaian node; tiap node menyimpan nilai plus alamat tetangga kiri dan kanannya. Tidak ada array di belakangnya, hanya rantai. Konsekuensinya simetris: menyisip atau membuang di ujung sangat murah, cukup menyambung ulang satu dua alamat.\n\nHarganya dibayar di akses acak. `get(5000)` pada LinkedList tidak bisa melompat; ia berjalan dari ujung, node demi node, sampai posisi itu. ArrayList hanya menghitung alamat offset dalam satu langkah. Karena itu, untuk daftar yang sering dibaca lewat index, LinkedList jelas kalah.\n\nPermata aslinya adalah kontrak lain yang juga ia implements: `Deque` (double ended queue). Method seperti `addFirst`, `addLast`, `pollFirst`, dan `pollLast` membuat LinkedList siap dipakai sebagai queue maupun stack tanpa struktur tambahan. Untuk kebutuhan daftar biasa, ArrayList hampir selalu tetap pilihan pertama.",
          code: {
            language: "java",
            content:
              "LinkedList<String> antrean = new LinkedList<>();\nantrean.addLast(\"A\");\nantrean.addLast(\"B\");\nantrean.addFirst(\"Z\");\n\nSystem.out.println(antrean.pollFirst()); // Z keluar lebih dulu\nSystem.out.println(antrean);             // [A, B]",
            caption: "Sebagai Deque: masuk dan keluar di kedua ujung dengan biaya tetap.",
          },
        },
        {
          kind: "quiz",
          question: "Berapa biaya `get(5000)` pada LinkedList yang berisi 10.000 elemen?",
          options: [
            "Satu langkah, seperti ArrayList",
            "Berjalan node demi node dari ujung terdekat, sebanding dengan jaraknya",
            "Selalu sepuluh langkah karena dibagi segmen",
            "Sama cepatnya dengan contains()",
          ],
          answer: 1,
          explanation:
            "LinkedList tidak punya akses langsung ke index. get(i) menelusuri rantai node satu per satu, jadi makin jauh posisinya, makin lama.",
        },
        {
          kind: "quiz",
          question: "Selain `List`, interface besar apa yang juga diimplements LinkedList?",
          options: [
            "Set, sehingga otomatis menolak duplikat",
            "Map, sehingga punya pasangan key-value",
            "Deque, sehingga bisa dipakai sebagai queue atau stack",
            "Comparable, sehingga elemennya otomatis terurut",
          ],
          answer: 2,
          explanation:
            "LinkedList implements List dan Deque. Method addFirst/pollLast dan kawan-kawannya menjadikannya queue atau stack siap pakai.",
        },
      ],
    },
    {
      slug: "col-hashset-dedup",
      title: "HashSet dan Deduplikasi",
      summary: "Set yang menolak duplikat dengan pemeriksaan rata-rata satu langkah.",
      steps: [
        {
          kind: "theory",
          title: "Kumpulan tanpa kembar",
          body: "`Set` adalah kontrak koleksi yang menolak duplikat: satu nilai hanya muncul sekali. Implementasi paling umum, `HashSet`, bekerja lewat fungsi hash, sehingga `add`, `contains`, dan `remove` selesai rata-rata dalam satu langkah, tidak peduli ukurannya.\n\n`add` mengembalikan boolean yang jarang dimanfaatkan pemula: `true` kalau elemen benar masuk, `false` kalau ternyata sudah ada. Karena itu deduplikasi hampir tidak butuh kode: masukkan semua data ke Set, duplikatnya tersaring sendiri di pintu.\n\nSatu penjualannya harus dipahami sejak awal: HashSet tidak menjamin urutan apa pun. Urutan cetaknya bisa terlihat acak dan berubah antar versi Java. Kalau urutan penting untuk keluaran, pakai `TreeSet` (lesson berikutnya) atau urutkan dulu datanya.",
          code: {
            language: "java",
            content:
              "Set<String> unik = new HashSet<>();\nSystem.out.println(unik.add(\"apel\"));   // true\nSystem.out.println(unik.add(\"apel\"));   // false, sudah ada\nSystem.out.println(unik.contains(\"apel\")); // true\nSystem.out.println(unik.size());         // 1",
            caption: "Duplikat kedua ditolak di pintu, dan add melaporkannya lewat nilai kembaliannya.",
          },
        },
        {
          kind: "code",
          title: "Perbaiki penghitung kata unik",
          prompt:
            "Program ini membaca n kata, lalu satu kata carian. Seharusnya ia mencetak jumlah kata unik dan apakah kata carian ada di dalamnya. Hasil baris pertamanya sekarang salah. Cari satu kesalahannya, perbaiki, lalu jalankan sampai tes lulus.",
          mode: "fix",
          template:
            'import java.util.HashSet;\nimport java.util.Scanner;\nimport java.util.Set;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        Set<String> unik = new HashSet<>();\n        for (int i = 0; i < n; i++) {\n            unik.add(in.next());\n        }\n        String cari = in.next();\n        System.out.println("Unik: " + n);\n        System.out.println("Ada " + cari + ": " + unik.contains(cari));\n    }\n}',
          solution:
            'import java.util.HashSet;\nimport java.util.Scanner;\nimport java.util.Set;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        Set<String> unik = new HashSet<>();\n        for (int i = 0; i < n; i++) {\n            unik.add(in.next());\n        }\n        String cari = in.next();\n        System.out.println("Unik: " + unik.size());\n        System.out.println("Ada " + cari + ": " + unik.contains(cari));\n    }\n}',
          tests: [
            { stdin: "5\napel jeruk apel mangga jeruk\napel", expectedOutput: "Unik: 3\nAda apel: true" },
            { stdin: "4\nkucing ayam kucing ayam\nbebek", expectedOutput: "Unik: 2\nAda bebek: false" },
            { stdin: "3\nsatu dua tiga\ndua", expectedOutput: "Unik: 3\nAda dua: true", hidden: true },
          ],
          hints: [
            "Jalankan dengan input pertama: lima kata, tiga yang unik, tapi angka yang tercetak tetap lima.",
            "Yang dicetak sekarang adalah n, yaitu jumlah kata yang dibaca, bukan jumlah isi Set.",
            "Ganti baris pencetakannya dengan: System.out.println(\"Unik: \" + unik.size());",
          ],
        },
      ],
    },
    {
      slug: "col-treeset-terurut",
      title: "TreeSet: Set Terurut",
      summary: "Set yang menyimpan elemen dalam urutan naik dan mengulanginya selalu urut.",
      steps: [
        {
          kind: "theory",
          title: "Set dengan rasa kamus",
          body: "`TreeSet` adalah Set yang menyimpan elemennya dalam struktur pohon terurut. Setiap operasi butuh waktu sebanding logaritma ukurannya, sedikit lebih lambat dari HashSet, dan sebagai imbalannya iterasi selalu menghasilkan urutan naik: dari elemen terkecil ke terbesar.\n\nUrutan alami untuk angka jelas: naik sesuai nilai. Untuk String, urutannya seperti kamus (lexicographic), dan perbandingannya berdasar kode karakter: semua huruf besar datang sebelum huruf kecil, jadi `Zebra` dianggap lebih dulu daripada `apel`.\n\nElemen TreeSet harus bisa dibandingkan: tipe seperti Integer dan String sudah `Comparable` sejak lahir, dan untuk class buatan sendiri kamu bisa menyuplai `Comparator` saat TreeSet dibuat. Duplikat ditolak sama seperti Set lain, dengan penilaian kesamaan lewat `compareTo` yang menghasilkan 0.",
          code: {
            language: "java",
            content:
              "TreeSet<Integer> skor = new TreeSet<>();\nskor.add(85);\nskor.add(70);\nskor.add(90);\nskor.add(70); // ditolak, duplikat\n\nSystem.out.println(skor);        // [70, 85, 90]\nSystem.out.println(skor.first()); // 70\nSystem.out.println(skor.last());  // 90",
            caption: "Urutan cetak selalu naik, apa pun urutan masuknya.",
          },
        },
        {
          kind: "quiz",
          question:
            "Dibuat `TreeSet<Integer> t`, lalu dipanggil `t.add(3); t.add(1); t.add(2);`. Apa hasil `System.out.println(t)`?",
          options: ["[3, 1, 2]", "[1, 2, 3]", "[3, 2, 1]", "Urutannya tidak bisa dipastikan"],
          answer: 1,
          explanation:
            "TreeSet menyimpan elemen terurut naik. Urutan masuk tidak berpengaruh: keluarannya selalu [1, 2, 3].",
        },
        {
          kind: "quiz",
          question:
            "Pada TreeSet yang sudah berisi angka 7, apa akibat pemanggilan `t.add(7)`?",
          options: [
            "Elemen 7 ditulis dua kali",
            "Elemen lama 7 diganti versi baru 7",
            "Tidak ada perubahan, dan add mengembalikan false",
            "Melempar exception duplikat",
          ],
          answer: 2,
          explanation:
            "Set tidak menyimpan duplikat. Pemanggilan add dengan nilai yang sudah ada tidak mengubah apa pun dan mengembalikan false sebagai laporan.",
        },
      ],
    },
    {
      slug: "col-hashmap-dasar",
      title: "HashMap: getOrDefault dan Iterasi",
      summary: "Pasangan kunci-nilai, pola penghitung yang andal, dan cara berkeliling entrySet.",
      steps: [
        {
          kind: "theory",
          title: "Kunci menuju nilai",
          body: "`Map` menyimpan pasangan kunci dan nilai. `put(k, v)` menaruh pasangan, `get(k)` mengambil nilai lewat kuncinya, dan `containsKey(k)` mengecek keberadaan kunci. Kunci unik: menaruh nilai dengan kunci yang sama menimpa nilai lama.\n\nPerhatikan kontrak `get`: kunci yang tidak ada menghasilkan `null`, bukan error. Untuk angka ini berbahaya, karena unboxing `null` melempar `NullPointerException`. Di sinilah `getOrDefault(k, bawaan)` berguna: kembalikan nilai kuncinya, atau bawaan kalau kuncinya belum terdaftar. Dari situ lahir pola penghitung klasik: `put(k, getOrDefault(k, 0) + 1)`.\n\nUntuk berkeliling isi Map, kontrak yang paling sering dipakai adalah `entrySet()`: tiap entri menyediakan `getKey()` dan `getValue()`. Ingat bahwa `HashMap` tidak menjamin urutan; kalau keluaran harus urut berdasarkan kunci, `TreeMap` adalah gantinya dengan API yang sama.",
          code: {
            language: "java",
            content:
              "Map<String, Integer> stok = new HashMap<>();\nstok.put(\"kopi\", 3);\nstok.put(\"teh\", 1);\n\nSystem.out.println(stok.get(\"teh\"));            // 1\nSystem.out.println(stok.get(\"gula\"));           // null\nSystem.out.println(stok.getOrDefault(\"gula\", 0)); // 0\n\nfor (Map.Entry<String, Integer> e : stok.entrySet()) {\n    System.out.println(e.getKey() + \" = \" + e.getValue());\n}",
            caption: "Pola penghitung: put(k, getOrDefault(k, 0) + 1).",
          },
        },
        {
          kind: "quiz",
          question:
            "Pada `Map<String, Integer> m`, kunci `\"geo\"` tidak pernah ditambahkan. Apa hasil `m.get(\"geo\")`?",
          options: [
            "0",
            "null",
            "Melempar NullPointerException di baris itu",
            "String kosong",
          ],
          answer: 1,
          explanation:
            "get mengembalikan null untuk kunci yang tidak ada. Error baru muncul kalau null itu di-unboxing ke int; getOrDefault adalah cara menghindarinya.",
        },
        {
          kind: "code",
          title: "Penghitung frekuensi kata",
          prompt:
            "Lengkapi pola penghitung: baca n kata, hitung frekuensi tiap kata dengan getOrDefault, lalu baca satu kata carian dan cetak berapa kali ia muncul.",
          mode: "fill",
          template:
            'import java.util.HashMap;\nimport java.util.Map;\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        Map<String, Integer> hitung = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            String kata = in.next();\n            hitung.___(kata, hitung.getOrDefault(kata, ___) + 1);\n        }\n        String cari = in.next();\n        System.out.println(cari + " muncul " + hitung.getOrDefault(cari, 0) + " kali");\n    }\n}',
          solution:
            'import java.util.HashMap;\nimport java.util.Map;\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        Map<String, Integer> hitung = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            String kata = in.next();\n            hitung.put(kata, hitung.getOrDefault(kata, 0) + 1);\n        }\n        String cari = in.next();\n        System.out.println(cari + " muncul " + hitung.getOrDefault(cari, 0) + " kali");\n    }\n}',
          tests: [
            { stdin: "6\napel jeruk apel mangga apel jeruk\napel", expectedOutput: "apel muncul 3 kali" },
            { stdin: "4\na b c d\nz", expectedOutput: "z muncul 0 kali" },
            { stdin: "3\nx x x\nx", expectedOutput: "x muncul 3 kali", hidden: true },
          ],
          hints: [
            "Blank pertama: method Map untuk menaruh atau menimpa nilai pada sebuah kunci.",
            "Blank kedua: nilai awal yang dipakai getOrDefault saat kunci belum terdaftar.",
            "Jawabannya: put dan 0.",
          ],
        },
      ],
    },
    {
      slug: "col-equals-hashcode",
      title: "Kontrak equals dan hashCode",
      summary: "Dua method yang menentukan apakah HashMap dan HashSet menganggap dua objek sama.",
      steps: [
        {
          kind: "theory",
          title: "Dua tahap penentuan kembaran",
          body: "HashSet dan HashMap tidak menilai kesamaan dengan satu pemeriksaan, tapi dua. Tahap pertama: `hashCode` menentukan di ember mana objek ditaruh. Tahap kedua: di dalam ember, `equals` menyimpulkan apakah objeknya benar-benar sama. Ini alasan pencariannya cepat: hash langsung menunjuk ember, sehingga equals hanya membandingkan segelintir kandidat.\n\nKontrak yang mengikat keduanya: kalau `a.equals(b)` bernilai true, maka `a.hashCode()` wajib sama dengan `b.hashCode()`. Kebalikannya tidak dijamin: dua objek dengan hash sama belum tentu equals, itu cuma tabrakan ember yang ditangani tahap kedua.\n\nMasalah klasiknya: mengoverride `equals` saja. Dua objek yang dianggap sama punya hash berbeda, sehingga mendarat di ember berbeda dan tak pernah dibandingkan. HashSet bisa berisi dua objek yang katanya sama, dan `get` pada HashMap mengembalikan null untuk kunci yang kelihatannya ada. Solusinya disiplin: override keduanya bersamaan, atau pakai `record` yang membuat keduanya otomatis.",
          code: {
            language: "java",
            content:
              "class Titik {\n    int x, y;\n\n    Titik(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n\n    @Override\n    public boolean equals(Object o) {\n        if (!(o instanceof Titik t)) return false;\n        return t.x == x && t.y == y;\n    }\n\n    @Override\n    public int hashCode() {\n        return java.util.Objects.hash(x, y);\n    }\n}",
            caption: "Override berpasangan: equals membandingkan isi, hashCode mengikuti isi yang sama.",
          },
        },
        {
          kind: "quiz",
          question:
            "Class P mengoverride `equals` tapi tidak `hashCode`. Dua objek P yang equals dimasukkan ke satu HashSet. Apa yang mungkin terjadi?",
          options: [
            "HashSet menolak yang kedua, size tetap 1",
            "Keduanya masuk, size jadi 2, karena hashnya berbeda",
            "Program melempar exception saat add kedua",
            "HashSet otomatis menghitung ulang hashCode",
          ],
          answer: 1,
          explanation:
            "Tanpa override, hashCode masih memakai identitas objek, jadi dua objek sama isi mendarat di ember berbeda. equals tidak pernah bertemu, dan HashSet menampung keduanya.",
        },
        {
          kind: "quiz",
          question: "Bagaimana bunyi kontrak antara equals dan hashCode?",
          options: [
            "Objek dengan hashCode sama wajib equals",
            "Objek yang equals wajib punya hashCode yang sama",
            "equals dan hashCode harus mengembalikan tipe yang sama",
            "hashCode hanya wajib untuk objek yang masuk TreeSet",
          ],
          answer: 1,
          explanation:
            "Arah yang dijamin hanya satu: equals true berarti hashCode sama. Hash sama tanpa equals adalah tabrakan yang sah dan normal.",
        },
      ],
    },
    {
      slug: "col-comparable-sort",
      title: "Comparable: Urutan Alami",
      summary: "Beri class sendiri urutan bawaan lewat compareTo, lalu biarkan sort mengurutkannya.",
      steps: [
        {
          kind: "theory",
          title: "Class yang tahu cara mengurutkan dirinya",
          body: "`Comparable<T>` adalah kontrak satu method: `compareTo(T lain)`. Aturannya angka: hasil negatif berarti objek ini lebih dulu, nol berarti setara, positif berarti yang lain lebih dulu. Kelas yang implements kontrak ini dikatakan punya urutan alami (natural ordering), dan tipe bawaan seperti `Integer` serta `String` sudah melakukannya sejak lama.\n\n`Collections.sort(daftar)` dan `daftar.sort(null)` mengurutkan memakai urutan alami elemennya. Untuk class buatanmu, tinggal implements `Comparable<NamaClass>` dan isi compareTo-nya. Idiom yang aman untuk angka: `Integer.compare(this.harga, lain.harga)`, karena pengurangan langsung `a - b` bisa meluap untuk nilai ekstrem.\n\nSatu sifat sort Java yang patut diingat: ia stabil. Elemen yang dianggap setara oleh pembanding mempertahankan urutan aslinya dari sebelum diurutkan. Itu dasar dari teknik dua tahap: urutkan dulu dengan kriteria sekunder, lalu dengan kriteria utama.",
          code: {
            language: "java",
            content:
              "class Produk implements Comparable<Produk> {\n    String nama;\n    int harga;\n\n    Produk(String nama, int harga) {\n        this.nama = nama;\n        this.harga = harga;\n    }\n\n    @Override\n    public int compareTo(Produk lain) {\n        return Integer.compare(this.harga, lain.harga);\n    }\n}\n\nCollections.sort(daftar); // termurah lebih dulu",
            caption: "compareTo negatif, nol, atau positif: tiga kemungkinan itulah seluruh kontraknya.",
          },
        },
        {
          kind: "code",
          title: "Urutkan produk termurah dulu",
          prompt:
            "Lengkapi class `Produk`: kontrak Comparable untuk compareTo, dan utilitas aman untuk membandingkan dua int. Program membaca n produk berupa nama dan harga, lalu mencetaknya termurah lebih dulu.",
          mode: "fill",
          template:
            'import java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.List;\nimport java.util.Scanner;\n\nclass Produk implements ___<Produk> {\n    String nama;\n    int harga;\n\n    Produk(String nama, int harga) {\n        this.nama = nama;\n        this.harga = harga;\n    }\n\n    public int compareTo(Produk lain) {\n        return ___.compare(this.harga, lain.harga);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        List<Produk> daftar = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            daftar.add(new Produk(in.next(), in.nextInt()));\n        }\n        Collections.sort(daftar);\n        for (Produk p : daftar) {\n            System.out.println(p.nama + " " + p.harga);\n        }\n    }\n}',
          solution:
            'import java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.List;\nimport java.util.Scanner;\n\nclass Produk implements Comparable<Produk> {\n    String nama;\n    int harga;\n\n    Produk(String nama, int harga) {\n        this.nama = nama;\n        this.harga = harga;\n    }\n\n    public int compareTo(Produk lain) {\n        return Integer.compare(this.harga, lain.harga);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        List<Produk> daftar = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            daftar.add(new Produk(in.next(), in.nextInt()));\n        }\n        Collections.sort(daftar);\n        for (Produk p : daftar) {\n            System.out.println(p.nama + " " + p.harga);\n        }\n    }\n}',
          tests: [
            { stdin: "3\nKopi 15000\nGula 12000\nTeh 9000", expectedOutput: "Teh 9000\nGula 12000\nKopi 15000" },
            { stdin: "4\nb 5\na 5\nc 1\nd 3", expectedOutput: "c 1\nd 3\nb 5\na 5" },
            { stdin: "2\nzz 10\naa 2", expectedOutput: "aa 2\nzz 10", hidden: true },
          ],
          hints: [
            "Blank pertama: nama interface kontrak urutan alami yang diimplements Produk.",
            "Blank kedua: class pembungkus int yang menyediakan method compare yang aman.",
            "Jawabannya: Comparable dan Integer.",
          ],
        },
      ],
    },
    {
      slug: "col-comparator-kustom",
      title: "Comparator: Urutan Kustom",
      summary: "Banyak urutan untuk class yang sama, tanpa menyentuh isinya: nilai turun, nama naik.",
      steps: [
        {
          kind: "theory",
          title: "Urutan di luar class",
          body: "`Comparable` hanya menyediakan satu urutan. Sering kali butuh lebih: produk kadang diurutkan termurah dulu, kadang nama dulu, kadang stok terbanyak. `Comparator<T>` menjawab kebutuhan itu: pembanding terpisah yang tidak mengubah class yang dibandingkannya, cocok juga untuk class pihak ketiga yang tidak boleh diedit.\n\nIsinya satu method: `compare(a, b)` dengan aturan angka yang sama seperti compareTo. Cara menulisnya dua arah: idiom modern dengan rantai `Comparator.comparingInt(...).reversed().thenComparing(...)`, atau lambda langsung yang isinya keputusan sendiri. Dua pembanding untuk Siswa, nilai turun lalu nama naik, ditulis alami dalam dua baris lambda.\n\nCara memakainya: `daftar.sort(pembanding)` atau `Collections.sort(daftar, pembanding)`. Ingat juga bahwa sort Java stabil, jadi elemen yang setara menurut pembanding mempertahankan urutan semula.",
          code: {
            language: "java",
            content:
              "// idiom modern:\ndaftar.sort(Comparator.comparingInt((Siswa s) -> s.nilai).reversed());\n\n// setara, ditulis sebagai lambda:\ndaftar.sort((a, b) -> b.nilai - a.nilai);\n\n// dua kriteria: nilai turun, nama naik\ndaftar.sort((a, b) -> {\n    if (a.nilai != b.nilai) return b.nilai - a.nilai;\n    return a.nama.compareTo(b.nama);\n});",
            caption: "Comparator.comparingInt(...).thenComparing(...) merangkai kriteria tanpa if.",
          },
        },
        {
          kind: "quiz",
          question:
            "Apa hasil `daftar.sort(Comparator.comparingInt((Siswa s) -> s.nilai).reversed());`?",
          options: [
            "Nilai naik, karena comparingInt selalu naik",
            "Nilai turun: nilai terbesar lebih dulu",
            "Tidak berubah, reversed hanya membalik isi list",
            "Error karena reversed tidak punya parameter",
          ],
          answer: 1,
          explanation:
            "comparingInt menyusun urutan naik menurut nilai, dan reversed membaliknya menjadi turun. Method sort lalu memakai pembanding hasilnya.",
        },
        {
          kind: "code",
          title: "Peringkat siswa",
          prompt:
            "Lengkapi pembanding di main supaya siswa diurutkan nilai tertinggi lebih dulu; bila nilainya sama, nama yang lebih awal abjadnya lebih dulu. Program membaca n siswa berupa nama dan nilai.",
          mode: "fill",
          template:
            'import java.util.ArrayList;\nimport java.util.List;\nimport java.util.Scanner;\n\nclass Siswa {\n    String nama;\n    int nilai;\n\n    Siswa(String nama, int nilai) {\n        this.nama = nama;\n        this.nilai = nilai;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        List<Siswa> daftar = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            daftar.add(new Siswa(in.next(), in.nextInt()));\n        }\n        daftar.sort((a, b) -> {\n            if (a.nilai != b.nilai) {\n                return b.___ - a.nilai;\n            }\n            return a.nama.___(b.nama);\n        });\n        for (Siswa s : daftar) {\n            System.out.println(s.nama + " " + s.nilai);\n        }\n    }\n}',
          solution:
            'import java.util.ArrayList;\nimport java.util.List;\nimport java.util.Scanner;\n\nclass Siswa {\n    String nama;\n    int nilai;\n\n    Siswa(String nama, int nilai) {\n        this.nama = nama;\n        this.nilai = nilai;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        List<Siswa> daftar = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            daftar.add(new Siswa(in.next(), in.nextInt()));\n        }\n        daftar.sort((a, b) -> {\n            if (a.nilai != b.nilai) {\n                return b.nilai - a.nilai;\n            }\n            return a.nama.compareTo(b.nama);\n        });\n        for (Siswa s : daftar) {\n            System.out.println(s.nama + " " + s.nilai);\n        }\n    }\n}',
          tests: [
            { stdin: "3\nAndi 80\nBudi 90\nCitra 80", expectedOutput: "Budi 90\nAndi 80\nCitra 80" },
            { stdin: "2\nzeta 70\nalpha 70", expectedOutput: "alpha 70\nzeta 70" },
            { stdin: "4\nd 60\nb 70\na 60\nc 70", expectedOutput: "b 70\nc 70\na 60\nd 60", hidden: true },
          ],
          hints: [
            "Blank pertama: supaya hasil positif ketika a nilainya lebih kecil, angka yang dikurangkan harus milik b.",
            "Blank kedua: method String yang membandingkan urutan abjad dua teks.",
            "Jawabannya: b.nilai dan compareTo.",
          ],
        },
      ],
    },
    {
      slug: "col-latihan-gabungan",
      title: "Latihan: Rekap Kata dengan Map",
      summary: "Hitung frekuensi kata, keluarkan terurut lewat TreeMap, dan iterasi entrySet dalam satu program.",
      steps: [
        {
          kind: "theory",
          title: "Map, urutan, dan entri bekerja sama",
          body: "Latihan penutup modul ini memakai tiga hal sekaligus: `Map` untuk frekuensi, `getOrDefault` untuk pola penghitung, dan `TreeMap` agar keluaran terurut berdasarkan kunci. Kombinasi ini muncul terus di kerja nyata, dari rekap log sampai statistik kata.\n\nGanti `HashMap` dengan `TreeMap` tidak mengubah cara pakai apa pun: `put`, `getOrDefault`, dan `entrySet` tetap sama. Yang berubah hanya janji urutannya: setiap iterasi memberi kunci dari kecil ke besar, seperti urutan kamus untuk String.\n\nProgramnya membaca n kata, merangkum semua kata dengan jumlah kemunculannya dalam satu baris berformat `kata(jumlah)`, lalu mencetak jumlah kata unik. Tiga blank menantimu di tempat yang sudah dibahas lesson demi lesson.",
          code: {
            language: "java",
            content:
              "Map<String, Integer> frek = new TreeMap<>();\nfrek.put(\"jeruk\", 2);\nfrek.put(\"apel\", 3);\n\nfor (Map.Entry<String, Integer> e : frek.entrySet()) {\n    System.out.println(e.getKey() + \"(\" + e.getValue() + \")\");\n}\n// apel(3)\n// jeruk(2)",
            caption: "TreeMap menjamin urutan kunci; entrySet memberi pasangannya.",
          },
        },
        {
          kind: "code",
          title: "Rekap frekuensi kata",
          prompt:
            "Lengkapi program rekap kata: struktur Map yang terurut berdasarkan kunci, pola penghitungnya, dan method size-nya. Input: satu angka n, lalu n kata dalam satu baris.",
          mode: "fill",
          template:
            'import java.util.Map;\nimport java.util.Scanner;\nimport java.util.TreeMap;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        Map<String, Integer> frekuensi = new ___<>();\n        for (int i = 0; i < n; i++) {\n            String kata = in.next();\n            frekuensi.put(kata, frekuensi.getOrDefault(kata, 0) + 1);\n        }\n        StringBuilder sb = new StringBuilder();\n        for (Map.Entry<String, Integer> e : frekuensi.entrySet()) {\n            sb.append(e.___()).append("(").append(e.getValue()).append(") ");\n        }\n        System.out.println(sb.toString().trim());\n        System.out.println("Kata unik: " + frekuensi.size());\n    }\n}',
          solution:
            'import java.util.Map;\nimport java.util.Scanner;\nimport java.util.TreeMap;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        Map<String, Integer> frekuensi = new TreeMap<>();\n        for (int i = 0; i < n; i++) {\n            String kata = in.next();\n            frekuensi.put(kata, frekuensi.getOrDefault(kata, 0) + 1);\n        }\n        StringBuilder sb = new StringBuilder();\n        for (Map.Entry<String, Integer> e : frekuensi.entrySet()) {\n            sb.append(e.getKey()).append("(").append(e.getValue()).append(") ");\n        }\n        System.out.println(sb.toString().trim());\n        System.out.println("Kata unik: " + frekuensi.size());\n    }\n}',
          tests: [
            {
              stdin: "6\njeruk apel jeruk apel mangga apel",
              expectedOutput: "apel(3) jeruk(2) mangga(1)\nKata unik: 3",
            },
            {
              stdin: "3\nbanana apple cherry",
              expectedOutput: "apple(1) banana(1) cherry(1)\nKata unik: 3",
            },
            {
              stdin: "4\nd c b a",
              expectedOutput: "a(1) b(1) c(1) d(1)\nKata unik: 4",
              hidden: true,
            },
          ],
          hints: [
            "Blank pertama: implementasi Map yang menyimpan kunci terurut, sudah diimport di bagian atas.",
            "Blank kedua: method entry untuk mengambil kuncinya saat iterasi.",
            "Jawabannya: TreeMap dan getKey.",
          ],
        },
      ],
    },
  ],
};
