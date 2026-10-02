import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "java",
  moduleRange: [0, 1],
  modules: [
    {
      title: "Java yang Idiomatik",
      description: "Tipe primitif vs wrapper, var, immutable String, StringBuilder, dan konvensi.",
    },
    {
      title: "OOP Inti",
      description: "Class, encapsulation, static vs instance, this, constructor chaining, package.",
    },
  ],
  lessons: [
    // ==================== MODUL 0: Java yang Idiomatik ====================
    {
      slug: "primitif-vs-wrapper",
      title: "Primitif vs Wrapper",
      summary: "Kapan int, kapan Integer, dan bagaimana autoboxing menjembatani keduanya.",
      steps: [
        {
          kind: "theory",
          title: "Nilai langsung vs objek penuh",
          body: "Java punya delapan tipe primitif: `byte`, `short`, `int`, `long`, `float`, `double`, `char`, dan `boolean`. Primitif menyimpan nilai langsung tanpa dibungkus objek, jadi ringan dan cepat. Setiap primitif punya pasangan wrapper berupa objek penuh: `Integer`, `Long`, `Double`, `Character`, `Boolean`, dan seterusnya.\n\nCompiler mengubah `int` menjadi `Integer` dan sebaliknya secara otomatis. Perubahan dua arah ini disebut autoboxing dan unboxing: `Integer stok = 12;` membungkus nilai tanpa perintah eksplisit, dan `int n = stok;` membukanya kembali. Meski otomatis, keduanya tetap dunia yang berbeda: `Integer` boleh bernilai `null` dan bisa dipakai di koleksi generik, sedangkan `List<int>` tidak sah; yang benar `List<Integer>`.\n\nWrapper juga menjadi rumah utilitas statis yang sering dipakai: `Integer.parseInt` menguraikan teks menjadi `int`, `Integer.MAX_VALUE` menyimpan batas atas `int`, dan `Double.parseDouble` menguraikan desimal. Kebiasaan yang sehat: pakai primitif untuk angka murni di dalam logika, pindah ke wrapper saat butuh `null`, koleksi, atau utilitasnya.",
          code: {
            language: "java",
            content: "int jumlah = 3;            // primitif: nilai langsung\nInteger cadangan = null;   // wrapper: boleh null\n\nint total = jumlah * 2;    // 6, aritmetika biasa\njava.util.List<Integer> antrean = new java.util.ArrayList<>();\nantrean.add(jumlah);       // autoboxing: int dibungkus jadi Integer",
            caption: "Primitif untuk hitungan, wrapper saat butuh null atau koleksi.",
          },
        },
        {
          kind: "quiz",
          question: "Manakah deklarasi yang SAH di Java?",
          options: ["List<int> daftar;", "List<Integer> daftar;", "List<long> daftar;", "List<double> daftar;"],
          answer: 1,
          explanation:
            "Koleksi generik hanya menampung tipe objek, bukan primitif. Untuk bilangan bulat, pakai wrapper Integer sehingga jadi List<Integer>; int akan di-autobox otomatis saat ditambahkan.",
        },
        {
          kind: "code",
          title: "Uraikan teks menjadi angka",
          prompt:
            "Program ini membaca dua baris teks berisi angka, lalu mencetak jumlahnya. Karena input datang sebagai `String`, keduanya harus diuraikan dulu menjadi `int`. Ganti setiap `___` dengan bagian wrapper yang tepat.",
          mode: "fill",
          template:
            'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        String a = in.next();\n        String b = in.next();\n        int x = ___.parseInt(a);\n        int y = Integer.___(b);\n        System.out.println(x + y);\n    }\n}',
          solution:
            'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        String a = in.next();\n        String b = in.next();\n        int x = Integer.parseInt(a);\n        int y = Integer.parseInt(b);\n        System.out.println(x + y);\n    }\n}',
          tests: [
            { stdin: "12\n30", expectedOutput: "42" },
            { stdin: "-7\n7", expectedOutput: "0" },
            { stdin: "100\n250", expectedOutput: "350", hidden: true },
          ],
          hints: [
            "Method parseInt dimiliki class Integer dan dipanggil lewat nama class, bukan lewat objek.",
            "Kedua baris kosong itu meminta pola yang sama: nama class wrappernya lalu nama methodnya.",
            "Jawabannya: Integer untuk keduanya, dan methodnya parseInt.",
          ],
        },
      ],
    },
    {
      slug: "var-lokal-java",
      title: "var untuk Variabel Lokal",
      summary: "Tipe yang disimpulkan compiler sejak Java 10, aturannya, dan batasannya.",
      steps: [
        {
          kind: "theory",
          title: "Compiler tahu tipenya, var menyatakannya",
          body: "Sejak Java 10, variabel lokal bisa dideklarasikan dengan `var`: compiler menyimpulkan tipenya dari sisi kanan. `var nama = \"Dina\";` sama persis dengan `String nama = \"Dina\";`. Java tetap bahasa statis; tipe `nama` adalah `String` sejak baris itu dan tidak pernah berubah. Yang hilang hanya penulisannya, bukan pemeriksaannya.\n\nBatasannya jelas: `var` hanya untuk variabel lokal di dalam method. Ia tidak boleh dipakai untuk field class, parameter method, atau tipe kembalian. Deklarasi tanpa inisialisasi juga ditolak karena compiler tidak punya dasar menebak: `var x;` langsung error saat kompilasi.\n\nKonvensinya: pakai `var` saat tipe sudah terlihat dari sisi kanan, misalnya `var sb = new StringBuilder();` atau `var panjang = teks.length();`. Pakai tipe eksplisit saat sisi kanan tidak mengatakan apa-apa, misalnya hasil method dengan nama samar. `var` dipakai agar kode lebih mudah dibaca, bukan supaya tipe jadi teka-teki.",
          code: {
            language: "java",
            content: "var nama = \"KodeKita\";            // disimpulkan: String\nvar huruf = nama.length();        // disimpulkan: int\nvar sb = new StringBuilder();     // disimpulkan: StringBuilder\nsb.append(nama);\n\nSystem.out.println(huruf + \" \" + sb); // 8 KodeKita",
            caption: "Ketiga var punya tipe pasti, hanya penulisannya yang disingkat.",
          },
        },
        {
          kind: "quiz",
          question: "Manakah pemakaian `var` yang SAH?",
          options: [
            "`var x;` di dalam method",
            "`var x = 10;` di dalam method",
            "`var nama;` sebagai field class",
            "`var` pada parameter method",
          ],
          answer: 1,
          explanation:
            "var hanya untuk variabel lokal dan wajib disertai inisialisasi, karena tipe disimpulkan dari nilai di sisi kanannya.",
        },
        {
          kind: "quiz",
          question: "Apa tipe data dari variabel `nilai` pada `var nilai = 9.0;`?",
          options: ["int", "double", "float", "var, tipenya berubah-ubah"],
          answer: 1,
          explanation:
            "Literal 9.0 bertipe double, jadi nilai disimpulkan sebagai double dan tetap double selamanya. var bukan tipe dinamis.",
        },
      ],
    },
    {
      slug: "string-immutable-dan-pool",
      title: "String Itu Immutable",
      summary: "Objek String tidak pernah berubah, dan string pool menghemat di belakang layar.",
      steps: [
        {
          kind: "theory",
          title: "Objek yang menolak berubah",
          body: "Objek `String` tidak bisa diubah setelah dibuat. Sifat ini disebut immutable. Method seperti `toUpperCase()`, `replace()`, dan `concat()` tidak menyentuh string aslinya; semuanya mengembalikan objek baru berisi hasil. Karena itu `s.toUpperCase();` tanpa menampung hasilnya tidak mengubah apa pun, dan itu bukan bug compiler, melainkan konsekuensi sifat immutable.\n\nImmutability membuka jalan untuk penghematan bernama string pool. Literal yang sama, misalnya `\"kode\"`, hanya dibuat satu objek dan dipakai bersama oleh semua variabel yang memakai literal itu. Sebaliknya `new String(\"kode\")` memaksa objek baru di luar pool; pola ini tidak berguna dan dihindari di kode Java.\n\nKonsekuensi praktisnya muncul di loop: menyambung String berulang kali dengan `+` membuat satu objek baru di tiap iterasi, karena string lama tidak pernah bisa dimodifikasi. Untuk pekerjaan seperti itu Java menyediakan `StringBuilder`, dibahas khusus dalam lesson berikutnya.",
          code: {
            language: "java",
            content: "String s = \"kota\";\ns.toUpperCase();               // hasil objek baru, tidak ditampung\nSystem.out.println(s);         // kota, s tidak pernah berubah\n\nString t = s.toUpperCase();    // baru benar: hasilnya ditampung\nSystem.out.println(t);         // KOTA",
            caption: "Method String mengembalikan objek baru; string aslinya tetap.",
          },
        },
        {
          kind: "quiz",
          question:
            "Apa keluaran program berikut?\n\n```java\nString s = \"kota\";\ns.toUpperCase();\nSystem.out.println(s);\n```",
          options: ["KOTA", "kota", "Kota", "Terjadi error saat kompilasi"],
          answer: 1,
          explanation:
            "toUpperCase() mengembalikan objek baru dan tidak mengubah s. Karena hasilnya tidak ditampung, yang tercetak tetap kota.",
        },
        {
          kind: "quiz",
          question: "Baris mana yang membuat objek `String` baru di luar string pool?",
          options: [
            'String a = "kode";',
            'String b = new String("kode");',
            "String c = a;",
            'String d = "ko" + "de";',
          ],
          answer: 1,
          explanation:
            "new String(...) selalu membuat objek baru di luar pool. Literal, penugasan referensi, dan penyambungan literal yang sudah diketahui saat kompilasi memakai pool.",
        },
      ],
    },
    {
      slug: "string-equals-vs-double-equals",
      title: "equals vs ==",
      summary: "Membandingkan isi String selalu dengan equals, bukan referensinya.",
      steps: [
        {
          kind: "theory",
          title: "Referensi vs isi",
          body: "Operator `==` pada objek membandingkan referensi: apakah dua variabel menunjuk objek yang sama. Untuk membandingkan isi `String`, gunakan `equals`. Kalau huruf besar dan kecil tak perlu dipedulikan, ada `equalsIgnoreCase`.\n\nJebakannya: `==` kadang menghasilkan true secara kebetulan. Ketika kedua sisi adalah literal yang sama, string pool mengarahkan keduanya ke objek yang sama, sehingga `==` bernilai true. Begitu salah satu sisi berasal dari input pengguna, `new String`, atau hasil method, ia berada di luar pool dan `==` berbalik false, padahal isinya identik. Bug semacam ini sering lolos saat dicoba di satu mesin lalu gagal di mesin lain.\n\nAturannya tunggal dan mudah dipegang: isi `String` dibandingkan dengan `equals`, titik. Tidak ada kasus di kode aplikasi yang membutuhkan `==` untuk String.",
          code: {
            language: "java",
            content: 'String a = "go";\nString b = new String("go");\n\nSystem.out.println(a == b);      // false: objek berbeda\nSystem.out.println(a.equals(b)); // true: isinya sama\n\nvar in = new java.util.Scanner(System.in);\nString ketikan = in.next();\nSystem.out.println(ketikan.equals("go")); // aman untuk input apa pun',
            caption: "Kebetulan pool bisa membuat == tampak benar; equals selalu benar.",
          },
        },
        {
          kind: "quiz",
          question:
            "Apa keluaran program berikut?\n\n```java\nString a = \"go\";\nString b = new String(\"go\");\nSystem.out.println(a == b);\nSystem.out.println(a.equals(b));\n```",
          options: ["true lalu true", "false lalu true", "true lalu false", "false lalu false"],
          answer: 1,
          explanation:
            "new String membuat objek baru di luar pool, jadi a == b bernilai false. equals membandingkan isi, dan isinya sama, sehingga bernilai true.",
        },
        {
          kind: "code",
          title: "Perbaiki pemeriksa sandi",
          prompt:
            "Program ini memeriksa apakah ketikan pengguna sama dengan `rahasia`. Sepertinya benar, tetapi pemeriksaannya membandingkan referensi, bukan isi, sehingga input dari Scanner tidak pernah dianggap cocok. Perbaiki satu kesalahannya, lalu jalankan sampai semua tes lulus.",
          mode: "fix",
          template:
            'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        String sandi = in.next();\n        if (sandi == "rahasia") {\n            System.out.println("cocok");\n        } else {\n            System.out.println("salah");\n        }\n    }\n}',
          solution:
            'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        String sandi = in.next();\n        if (sandi.equals("rahasia")) {\n            System.out.println("cocok");\n        } else {\n            System.out.println("salah");\n        }\n    }\n}',
          tests: [
            { stdin: "rahasia", expectedOutput: "cocok" },
            { stdin: "abc123", expectedOutput: "salah" },
            { stdin: "Rahasia", expectedOutput: "salah", hidden: true },
          ],
          hints: [
            "String yang datang dari Scanner berada di luar string pool, sehingga == membandingkan objek yang berbeda.",
            "Method milik String yang membandingkan isi satu per satu namanya equals.",
            "Jawabannya: ganti sandi == \"rahasia\" menjadi sandi.equals(\"rahasia\").",
          ],
        },
      ],
    },
    {
      slug: "stringbuilder-untuk-loop",
      title: "StringBuilder untuk Loop",
      summary: "Menyambung teks di dalam loop tanpa membuat objek baru di tiap iterasi.",
      steps: [
        {
          kind: "theory",
          title: "Buffer yang bisa berubah",
          body: "Karena `String` immutable, setiap `+` membuat objek baru lalu menyalin isi lama ke sana. Di dalam loop ribuan iterasi, itu berarti ribuan objek sementara dan penyalinan yang makin panjang. `StringBuilder` menyelesaikannya: ia menyimpan karakter dalam buffer internal yang bisa dimodifikasi, dan `append` hanya menambah isi buffer tanpa membuat objek String baru.\n\nAPI yang dipakai sehari-hari: `append(x)` menerima semua tipe (String, int, double, char), `toString()` menghasilkan String final saat pekerjaan selesai, `reverse()` membalik isinya, dan `length()` menghitung panjangnya. Penyambungan bersyarat seperti pemisah antar item juga mudah: cek dulu apakah buffer masih kosong sebelum menambahkan tanda pemisah.\n\nBatasi pemakaiannya pada loop. Menyambung sekali di satu baris seperti `\"Halo, \" + nama` tetap lebih baik pakai `+`: compiler modern sudah mengoptimalkannya dan bentuknya paling terbaca. `StringBuilder` adalah alat untuk akumulasi, bukan pengganti seluruh `+`.",
          code: {
            language: "java",
            content: 'String[] buah = {"apel", "mangga", "jeruk"};\nStringBuilder sb = new StringBuilder();\nfor (int i = 0; i < buah.length; i++) {\n    if (i > 0) {\n        sb.append(", ");\n    }\n    sb.append(buah[i]);\n}\nSystem.out.println(sb.toString()); // apel, mangga, jeruk',
            caption: "Satu buffer diisi berkali-kali, String final dibuat sekali di ujung.",
          },
        },
        {
          kind: "quiz",
          question: "Method `StringBuilder` untuk menambah teks di ujung buffer adalah?",
          options: ["add()", "push()", "append()", "concat()"],
          answer: 2,
          explanation:
            "append() menambah representasi teks dari argumennya ke ujung buffer. add dan push adalah milik koleksi, bukan StringBuilder.",
        },
        {
          kind: "code",
          title: "Ulang kata dengan pemisah",
          prompt:
            "Program membaca satu kata dan satu bilangan `n`, lalu mencetak kata itu sebanyak `n` kali dipisah tanda `-`. Lengkapi dua pemanggilan `StringBuilder` yang hilang.",
          mode: "fill",
          template:
            'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        String kata = in.next();\n        int n = in.nextInt();\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < n; i++) {\n            if (i > 0) {\n                sb.append("-");\n            }\n            sb.___(kata);\n        }\n        System.out.println(sb.___());\n    }\n}',
          solution:
            'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        String kata = in.next();\n        int n = in.nextInt();\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < n; i++) {\n            if (i > 0) {\n                sb.append("-");\n            }\n            sb.append(kata);\n        }\n        System.out.println(sb.toString());\n    }\n}',
          tests: [
            { stdin: "ha\n3", expectedOutput: "ha-ha-ha" },
            { stdin: "kode\n2", expectedOutput: "kode-kode" },
            { stdin: "x\n5", expectedOutput: "x-x-x-x-x", hidden: true },
          ],
          hints: [
            "Method untuk menambah isi ke buffer StringBuilder dipakai dua kali di program ini.",
            "Setelah selesai diisi, buffer harus diubah menjadi String sebelum dicetak.",
            "Jawabannya: append untuk menambah kata, dan toString untuk menghasilkan String final.",
          ],
        },
      ],
    },
    {
      slug: "konvensi-penamaan-java",
      title: "Konvensi Penamaan Java",
      summary: "PascalCase, camelCase, UPPER_SNAKE, dan package huruf kecil semua.",
      steps: [
        {
          kind: "theory",
          title: "Nama yang membaca dirinya sendiri",
          body: "Konvensi penamaan Java dipegang seluruh ekosistem, sehingga pembaca langsung tahu peran sebuah nama tanpa melihat deklarasinya. Class dan interface memakai PascalCase: `RekeningBank`, `StringBuilder`. Method dan variabel memakai camelCase dan diawali huruf kecil: `hitungTotal`, `sukuBunga`. Konstanta ditulis huruf besar semua dengan pemisah garis bawah: `BATAS_UMUR`. Package ditulis huruf kecil semua tanpa pemisah: `util`, `kasirmodel`.\n\nIsi nama juga punya pola. Class menyebut benda: `Pelanggan`, `Produk`. Method menyebut aksi dan diawali kata kerja: `cetakStruk`, `hitungDiskon`. Variabel boolean dibaca seperti pernyataan ya atau tidak: `aktif`, `habisStok`, `sudahBayar`. Akronim diperlakukan seperti kata biasa agar tetap konsisten dalam camelCase, misalnya `bukaUrl` dan `idPesanan`.\n\nCompiler tidak peduli nama yang kamu pilih; pembaca kodemu yang peduli. Menyimpang dari konvensi tidak membuat program gagal jalan, tetapi membuat setiap pembaca berhenti sejenak untuk menebak maksudmu, dan itu biaya yang terus berulang.",
          code: {
            language: "java",
            content: "package kasir;\n\nclass StrukBelanja {                 // class: PascalCase\n    static final double PPN = 0.11;  // konstanta: huruf besar + garis bawah\n    private int totalBelanja;        // variabel: camelCase\n\n    int hitungPajak() {              // method: kata kerja, camelCase\n        return (int) (totalBelanja * PPN);\n    }\n}",
            caption: "Bentuk nama langsung memberi tahu perannya di dalam kode.",
          },
        },
        {
          kind: "quiz",
          question: "Nama method yang mengikuti konvensi Java untuk menghitung diskon adalah?",
          options: ["Hitung_Diskon", "hitungDiskon", "HitungDiskon", "hitung_diskon"],
          answer: 1,
          explanation:
            "Method memakai camelCase diawali huruf kecil dan berisi kata kerja, jadi hitungDiskon. Bentuk PascalCase adalah milik class, dan garis bawah bukan gaya Java untuk method.",
        },
        {
          kind: "quiz",
          question: "Deklarasi konstanta yang mengikuti konvensi Java adalah?",
          options: [
            "static final double ppn = 0.11;",
            "static final double PPN = 0.11;",
            "static final Double Ppn = 0.11;",
            "final static double PpnPersen = 0.11;",
          ],
          answer: 1,
          explanation:
            "Konstanta ditulis static final dengan nama huruf besar semua dan pemisah garis bawah: PPN. Nama campuran atau huruf kecil membuatnya tak terbedakan dari variabel biasa.",
        },
      ],
    },
    {
      slug: "konstanta-static-final",
      title: "Konstanta static final",
      summary: "Nilai yang terkunci sejak deklarasi, dan kenapa konstanta bernama mengalahkan angka telanjang.",
      steps: [
        {
          kind: "theory",
          title: "final untuk nilai yang tak boleh berganti",
          body: "Kata kunci `final` pada variabel berarti nilainya tidak bisa diisi ulang setelah inisialisasi. Digabung dengan `static` (milik class, satu salinan dibagi semua objek) dan konvensi UPPER_SNAKE, terbentuklah cara Java mendeklarasikan konstanta: `static final int HARI_MAX = 30;`. Deklarasinya biasa ditaruh di paling atas class agar terlihat sebelum dipakai.\n\nKonstanta bernama mengalahkan angka telanjang. `if (umur >= 17)` memaksa pembaca menebak makna 17; `if (umur >= UMUR_DEWASA)` menyatakannya langsung. Saat aturan berubah, yang disunting satu tempat saja, dan semua pemakai ikut. Angka telanjang yang tersebar di banyak method adalah sumber bug sunyi: satu terlewat, perilaku program terbelah.\n\n`final` juga sah untuk variabel lokal, misalnya `final int batas = 3;` di dalam method, bila nilainya memang tidak seharusnya berganti di tengah jalan. Catatan untuk nanti: pada tipe objek, final mengunci referensinya, bukan isi objeknya; itu dibahas lebih lanjut di modul collections.",
          code: {
            language: "java",
            content: "public class Main {\n    static final int UMUR_DEWASA = 17;\n    static final String SAPAAN = \"Selamat datang\";\n\n    public static void main(String[] args) {\n        int umur = 19;\n        if (umur >= UMUR_DEWASA) {\n            System.out.println(SAPAAN + \", dewasa\");\n        } else {\n            System.out.println(SAPAAN + \", belum dewasa\");\n        }\n    }\n}",
            caption: "Makna angka 17 tinggal di satu tempat bernama.",
          },
        },
        {
          kind: "quiz",
          question: "Apa arti `final` pada `final int batas = 3;`?",
          options: [
            "batas boleh diisi ulang satu kali lagi",
            "batas tidak bisa diisi ulang setelah inisialisasi",
            "batas hanya bisa dibaca dari class lain",
            "batas otomatis menjadi static",
          ],
          answer: 1,
          explanation:
            "final mengunci variabel pada nilai inisialisasinya. Setiap usaha mengisi ulang batas ditolak saat kompilasi.",
        },
        {
          kind: "code",
          title: "Diskon member dari konstanta",
          prompt:
            "Program menghitung harga setelah diskon member 20 persen. Diskonnya sudah jadi konstanta bernama `DISKON_MEMBER`; lengkapi baris perhitungan agar memakai konstanta itu, bukan angka telanjang.",
          mode: "fill",
          template:
            'import java.util.Scanner;\n\npublic class Main {\n    static final int DISKON_MEMBER = 20; // persen\n\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int total = in.nextInt();\n        int potongan = total * ___ / 100;\n        System.out.println(total - potongan);\n    }\n}',
          solution:
            'import java.util.Scanner;\n\npublic class Main {\n    static final int DISKON_MEMBER = 20; // persen\n\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int total = in.nextInt();\n        int potongan = total * DISKON_MEMBER / 100;\n        System.out.println(total - potongan);\n    }\n}',
          tests: [
            { stdin: "50000", expectedOutput: "40000" },
            { stdin: "250000", expectedOutput: "200000" },
            { stdin: "99999", expectedOutput: "80000", hidden: true },
          ],
          hints: [
            "Persen diskon sudah tersimpan di konstanta class bernama DISKON_MEMBER.",
            "Perhitungannya dibaca dari kanan ke kiri: persen diskon, lalu bagi seratus.",
            "Jawabannya: DISKON_MEMBER.",
          ],
        },
      ],
    },
    {
      slug: "casting-dan-konversi-angka",
      title: "Casting dan Konversi Angka",
      summary: "Melebar otomatis, menyempit dengan cast, dan mengurai angka dari String.",
      steps: [
        {
          kind: "theory",
          title: "Dua arah konversi yang tidak setara",
          body: "Konversi melebar (widening) berjalan otomatis dan tanpa kehilangan data: `int` ke `long`, atau tipe bulat apa pun ke `double`. Konversi menyempit (narrowing) wajib ditulis dengan cast eksplisit, misalnya `(int) 7.9`, dan hasilnya bagian desimal dipotong, bukan dibulatkan: hasilnya 7. Untuk bilangan negatif juga memotong ke arah nol, jadi `(int) -7.9` menghasilkan -7.\n\nBila yang dimaksud membulatkan, pakai `Math.round`: ia mengembalikan `long` dengan aturan membulatkan ke terdekat, `Math.round(7.5)` menghasilkan 8. Bedakan dua ini dengan sadar; salah pilih menghasilkan selisih satu yang sulit dilacak di laporan keuangan atau statistik.\n\nDari dan ke `String`, cast tidak berlaku. Uraikan teks menjadi angka dengan `Integer.parseInt(\"42\")` atau `Double.parseDouble(\"3.5\")`; keduanya melempar `NumberFormatException` bila isinya bukan angka sah. Arah sebaliknya memakai `String.valueOf(angka)` atau cukup penyambungan `\"\" + angka`.",
          code: {
            language: "java",
            content: "int total = 17;\nint n = 4;\ndouble rata = (double) total / n; // cast dulu, baru dibagi: 4.25\n\nSystem.out.println((int) 7.9);    // 7, dipotong\nSystem.out.println(Math.round(7.5)); // 8, dibulatkan\nint angka = Integer.parseInt(\"42\");\nString teks = String.valueOf(angka); // \"42\"",
            caption: "Cast dipasang pada operand sebelum operasi, bukan setelah hasilnya.",
          },
        },
        {
          kind: "quiz",
          question: "Berapa nilai `x` pada `int x = (int) 7.9;`?",
          options: ["7", "8", "7.9", "error kompilasi"],
          answer: 0,
          explanation:
            "Cast double ke int memotong bagian desimal, bukan membulatkan. 7.9 menjadi 7, dan -7.9 menjadi -7.",
        },
        {
          kind: "code",
          title: "Rata-rata yang selalu bulat",
          prompt:
            "Program ini menghitung rata-rata `total` dibagi `n`, tetapi hasilnya selalu bilangan bulat padahal seharusnya desimal. Temukan satu kesalahannya dan perbaiki sampai semua tes lulus.",
          mode: "fix",
          template:
            'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int total = in.nextInt();\n        int n = in.nextInt();\n        double rata = total / n;\n        System.out.println(rata);\n    }\n}',
          solution:
            'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int total = in.nextInt();\n        int n = in.nextInt();\n        double rata = (double) total / n;\n        System.out.println(rata);\n    }\n}',
          tests: [
            { stdin: "17\n4", expectedOutput: "4.25" },
            { stdin: "7\n2", expectedOutput: "3.5" },
            { stdin: "30\n8", expectedOutput: "3.75", hidden: true },
          ],
          hints: [
            "total dan n sama-sama int, sehingga pembagiannya selesai sebagai pembagian bulat sebelum hasilnya masuk ke double.",
            "Cukup satu operand yang dikonversi; cast dipasang sebelum pembagian dijalankan.",
            "Jawabannya: double rata = (double) total / n;",
          ],
        },
      ],
    },
    {
      slug: "printf-dan-string-format",
      title: "printf dan String.format",
      summary: "Keluaran terformat dengan %d, %s, %.2f, dan jebakan locale yang jarang disebut.",
      steps: [
        {
          kind: "theory",
          title: "Format string yang mengatur bentuk cetak",
          body: "`System.out.printf` mencetak mengikuti format string: `%d` untuk bilangan bulat, `%s` untuk teks, `%f` untuk desimal dengan enam angka di belakang pemisah secara bawaan, dan `%.2f` untuk dua angka. Tanda `%%` mencetak karakter persen. Argumen diisi berurutan sesuai urutan specifiernya, jadi `printf(\"%s: %d%n\", nama, umur)` mengharapkan teks dulu, angka kemudian.\n\nSatu jebakan yang jarang dijelaskan: `printf` dan `String.format` mengikuti locale bawaan untuk pemisah desimal. Di komputer dengan locale Indonesia, `%.2f` menghasilkan koma seperti `3,14`; di server yang berlocale Inggris hasilnya titik `3.14`. Supaya keluaran pasti dan sama di mana pun program dijalankan, kirim locale secara eksplisit: `System.out.printf(Locale.US, \"%.2f\", nilai)`. Bentuk itulah yang dipakai saat format output menjadi bagian dari hasil kerja program.\n\nBedakan `printf` dengan `String.format`: keduanya memakai aturan format yang sama, tetapi `String.format` tidak mencetak apa pun dan hanya mengembalikan `String`. Pakai `String.format` ketika teks terformat perlu disusun dulu, misalnya disimpan ke variabel atau dikirim ke tempat lain, dan `printf` ketika langsung dicetak.",
          code: {
            language: "java",
            content: 'import java.util.Locale;\n\npublic class Main {\n    public static void main(String[] args) {\n        String nama = "Dina";\n        double nilai = 87.5;\n\n        System.out.printf(Locale.US, "%s: %.2f\\n", nama, nilai); // Dina: 87.50\n        String baris = String.format(Locale.US, "[%8.2f]", nilai);\n        System.out.println(baris); // [   87.50]\n    }\n}',
            caption: "Lebar 8 dengan dua desimal: sisa kolom diisi spasi, rata kanan.",
          },
        },
        {
          kind: "quiz",
          question: "Apa keluaran `System.out.printf(Locale.US, \"[%6.2f]\", 3.14159);`?",
          options: ["[3.14]", "[  3.14]", "[3.14159]", "[3.14  ]"],
          answer: 1,
          explanation:
            "%.2f memotong menjadi 3.14 (empat karakter), lebar 6 mengharuskan dua spasi mengisi kekurangan, dan tanpa tanda minus hasilnya rata kanan.",
        },
        {
          kind: "code",
          title: "Laporan rata-rata terformat",
          prompt:
            "Program membaca nama dan dua nilai, lalu mencetak `nama rata-rata xx.xx` dalam satu baris. Lengkapi format string-nya: teks dulu, lalu rata-rata dengan dua desimal, diakhiri pindah baris.",
          mode: "fill",
          template:
            'import java.util.Locale;\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        String nama = in.next();\n        int a = in.nextInt();\n        int b = in.nextInt();\n        double rata = (a + b) / 2.0;\n        System.out.printf(Locale.US, "___", nama, rata);\n    }\n}',
          solution:
            'import java.util.Locale;\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        String nama = in.next();\n        int a = in.nextInt();\n        int b = in.nextInt();\n        double rata = (a + b) / 2.0;\n        System.out.printf(Locale.US, "%s rata-rata %.2f\\n", nama, rata);\n    }\n}',
          tests: [
            { stdin: "Dina\n85\n90", expectedOutput: "Dina rata-rata 87.50" },
            { stdin: "Budi\n70\n75", expectedOutput: "Budi rata-rata 72.50" },
            { stdin: "Citra\n100\n85", expectedOutput: "Citra rata-rata 92.50", hidden: true },
          ],
          hints: [
            "Argumen pertama adalah teks, argumen kedua desimal; specifier harus mengikuti urutan itu.",
            "Specifier desimal dua angka di belakang ditulis dengan titik dan angka di antara % dan f.",
            "Jawabannya: %s rata-rata %.2f diakhiri \\n.",
          ],
        },
      ],
    },
    {
      slug: "latihan-modul-0",
      title: "Latihan Gabungan Modul 0",
      summary: "Parse, hitung, format, dan konstanta bertemu di satu program penilaian.",
      steps: [
        {
          kind: "theory",
          title: "Menggabungkan kebiasaan kecil",
          body: "Modul ini mengumpulkan kebiasaan yang membedakan kode Java yang idiomatik dari kode yang hanya kebetulan jalan: primitif untuk hitungan murni dan wrapper saat butuh utilitas atau koleksi, `equals` untuk isi String, `StringBuilder` untuk akumulasi, konstanta `static final` yang memberi nama pada angka, dan `printf` dengan locale eksplisit supaya keluaran pasti.\n\nLatihan penutup memakai semuanya sekaligus. Program membaca nama siswa dan tiga nilai, menghitung rata-rata sebagai `double` lewat cast sebelum pembagian, membandingkannya dengan konstanta `KKM`, lalu mencetak laporan dua baris dengan format dua desimal. Perhatikan bahwa pembacaan nilai memakai loop dengan akumulator, pola yang sejak kini sebaiknya terasa otomatis.",
          code: {
            language: "java",
            content: "// rata = (double) jumlah / 3\n// status = rata >= KKM ? \"LULUS\" : \"REMEDI\"\n// printf(Locale.US, \"%s: %.2f\\n\", nama, rata)",
            caption: "Gambaran tiga baris kunci yang akan kamu lengkapi di langkah berikutnya.",
          },
        },
        {
          kind: "code",
          title: "Penentu kelulusan siswa",
          prompt:
            "Lengkapi dua bagian yang hilang: pembanding dengan konstanta `KKM` pada penentuan status, dan specifier desimal dua angka pada format cetak. Sisanya sudah beres.",
          mode: "fill",
          template:
            'import java.util.Locale;\nimport java.util.Scanner;\n\npublic class Main {\n    static final int KKM = 75;\n\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        String nama = in.next();\n        int jumlah = 0;\n        for (int i = 0; i < 3; i++) {\n            jumlah += in.nextInt();\n        }\n        double rata = (double) jumlah / 3;\n        String status = rata >= ___ ? "LULUS" : "REMEDI";\n        System.out.printf(Locale.US, "%s: ___\\n", nama, rata);\n        System.out.println(status);\n    }\n}',
          solution:
            'import java.util.Locale;\nimport java.util.Scanner;\n\npublic class Main {\n    static final int KKM = 75;\n\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        String nama = in.next();\n        int jumlah = 0;\n        for (int i = 0; i < 3; i++) {\n            jumlah += in.nextInt();\n        }\n        double rata = (double) jumlah / 3;\n        String status = rata >= KKM ? "LULUS" : "REMEDI";\n        System.out.printf(Locale.US, "%s: %.2f\\n", nama, rata);\n        System.out.println(status);\n    }\n}',
          tests: [
            { stdin: "Rina\n80\n70\n90", expectedOutput: "Rina: 80.00\nLULUS" },
            { stdin: "Budi\n60\n70\n65", expectedOutput: "Budi: 65.00\nREMEDI" },
            { stdin: "Dewi\n75\n75\n75", expectedOutput: "Dewi: 75.00\nLULUS", hidden: true },
          ],
          hints: [
            "Konstanta batas kelulusan sudah dideklarasikan di atas class dengan nama KKM.",
            "Specifier untuk desimal dua angka di belakang dipakai juga pada lesson printf.",
            "Jawabannya: KKM untuk pembanding, dan %.2f untuk formatnya.",
          ],
        },
      ],
    },
    // ==================== MODUL 1: OOP Inti ====================
    {
      slug: "class-dan-object-dasar",
      title: "Class dan Object",
      summary: "Cetak biru, instansi dengan new, dan referensi yang bisa dibagi.",
      steps: [
        {
          kind: "theory",
          title: "Satu cetak biru, banyak objek",
          body: "Class menggabungkan data (field) dan perilaku (method) dalam satu tempat. Objek adalah wujud nyata dari cetak biru itu, dibuat dengan `new`: setiap pemanggilan menghasilkan objek baru dengan salinan field sendiri. `Produk a = new Produk();` dan `Produk b = new Produk();` adalah dua objek terpisah; mengubah `a` tidak pernah menyentuh `b`.\n\nVariabel objek menyimpan referensi, bukan isinya. `Produk c = a;` menyalin referensinya saja, sehingga `a` dan `c` menunjuk objek yang sama dan lewat `c` pun datanya ikut berubah. Inilah pembeda utama objek dari primitif pada modul sebelumnya: primitif disalin nilainya, objek dibagi referensinya.\n\nSatu file `.java` boleh berisi beberapa class, tetapi hanya satu yang boleh `public`, dan namanya harus sama dengan nama file. Class pendamping seperti `Produk` pada contoh cukup ditulis tanpa `public`; begitulah cara latihan di platform ini menyatukan `Main` dan class datanya dalam satu file.",
          code: {
            language: "java",
            content: 'class Produk {\n    String nama;\n    int harga;\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Produk a = new Produk();\n        a.nama = "Buku";\n        a.harga = 45000;\n\n        Produk c = a;          // referensi yang sama, bukan salinan\n        c.harga = 50000;\n        System.out.println(a.harga); // 50000, ikut berubah\n    }\n}',
            caption: "c dan a menunjuk satu objek yang sama.",
          },
        },
        {
          kind: "quiz",
          question:
            "Setelah `Produk a = new Produk();` dan `Produk b = a;`, apa yang terjadi saat `b.harga = 9000;` dijalankan?",
          options: [
            "harga milik a ikut menjadi 9000 karena a dan b menunjuk objek yang sama",
            "harga milik a tetap, karena b punya objek sendiri",
            "error karena harga belum dideklarasikan",
            "a otomatis kehilangan referensinya",
          ],
          answer: 0,
          explanation:
            "Penugasan b = a menyalin referensi, bukan objeknya. Keduanya menunjuk satu objek yang sama, jadi perubahan lewat b terlihat lewat a.",
        },
        {
          kind: "code",
          title: "Instansiasi Produk",
          prompt:
            "Program membaca nama dan harga, menyimpannya ke sebuah objek `Produk`, lalu mencetaknya. Ganti `___` dengan tipe yang tepat supaya objeknya bisa dibuat.",
          mode: "fill",
          template:
            'import java.util.Scanner;\n\nclass Produk {\n    String nama;\n    int harga;\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        ___ p = new Produk();\n        p.nama = in.next();\n        p.harga = in.nextInt();\n        System.out.println(p.nama + " - " + p.harga);\n    }\n}',
          solution:
            'import java.util.Scanner;\n\nclass Produk {\n    String nama;\n    int harga;\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        Produk p = new Produk();\n        p.nama = in.next();\n        p.harga = in.nextInt();\n        System.out.println(p.nama + " - " + p.harga);\n    }\n}',
          tests: [
            { stdin: "Pensil\n3000", expectedOutput: "Pensil - 3000" },
            { stdin: "Tas\n120000", expectedOutput: "Tas - 120000" },
            { stdin: "Buku\n45000", expectedOutput: "Buku - 45000", hidden: true },
          ],
          hints: [
            "Tipe variabelnya harus sama dengan hasil new di sebelah kanan.",
            "Class yang menyediakan cetak birunya dideklarasikan tepat di atas Main.",
            "Jawabannya: Produk.",
          ],
        },
      ],
    },
    {
      slug: "field-dan-method-instance",
      title: "Field dan Method Instance",
      summary: "Perilaku yang bekerja pada data milik satu objek.",
      steps: [
        {
          kind: "theory",
          title: "Method yang membawa datanya sendiri",
          body: "Method instance adalah perilaku yang beroperasi pada data milik satu objek. Di dalam tubuhnya, field dipanggil tanpa awalan karena sudah jelas milik objek pemanggil: `p.luas()` menghitung dari field milik `p`, dan `q.luas()` menghitung dari milik `q`. Method yang sama, data yang berbeda, hasil yang sesuai masing-masing.\n\nMethod instance punya parameter dan tipe kembali seperti method biasa. Kebiasaan yang baik dipertahankan dari fondasi: method menghitung dan mengembalikan nilai, sedangkan keputusan mencetak diserahkan ke pemanggil. Dengan begitu method yang sama bisa dipakai untuk cetak, banding, maupun hitung lanjutan tanpa disentuh lagi.\n\nObjek juga bisa bekerja atas objek lain lewat parameter: `struk.total(produk)` menerima referensi `produk` dan membaca field publiknya dari dalam. Perhatikan batas antar class tetap berlaku; method satu class boleh membaca field class lain selama field itu tidak dipagari `private`, yang menjadi pembahasan lesson berikutnya.",
          code: {
            language: "java",
            content: "class Segitiga {\n    double alas;\n    double tinggi;\n\n    double luas() {\n        return alas * tinggi / 2;\n    }\n}\n\n// di main:\n// Segitiga t = new Segitiga();\n// t.alas = 10; t.tinggi = 6;\n// System.out.println(t.luas()); // 30.0",
            caption: "luas() membaca alas dan tinggi milik objek yang memanggilnya.",
          },
        },
        {
          kind: "quiz",
          question: "Bagaimana cara memanggil method `luas()` pada objek `t` bertipe `Segitiga`?",
          options: ["luas(t)", "t.luas()", "Segitiga.luas()", "t -> luas()"],
          answer: 1,
          explanation:
            "Method instance dipanggil lewat objeknya dengan titik: t.luas(). Segitiga.luas() hanya sah untuk method static, dan itu bukan kasus di sini.",
        },
        {
          kind: "quiz",
          question:
            "Apa keluaran program berikut?\n\n```java\nclass Counter {\n    int hitung = 0;\n    void tambah() {\n        hitung = hitung + 1;\n    }\n}\n\nCounter c = new Counter();\nc.tambah();\nc.tambah();\nc.tambah();\nSystem.out.println(c.hitung);\n```",
          options: ["0", "1", "3", "error kompilasi"],
          answer: 2,
          explanation:
            "Setiap pemanggilan tambah() menaikkan field hitung milik objek c. Tiga pemanggilan menghasilkan 3.",
        },
      ],
    },
    {
      slug: "encapsulation-getter-setter",
      title: "Encapsulation: private, Getter, Setter",
      summary: "Data dipagari private, dan semua perubahan lewat satu pintu yang memegang aturan.",
      steps: [
        {
          kind: "theory",
          title: "Satu pintu untuk masuk ke data",
          body: "Encapsulation dimulai dari kata kunci `private` pada field: hanya method di class yang sama yang boleh menyentuhnya. Dunia luar berinteraksi lewat getter untuk membaca dan setter untuk mengubah, dengan konvensi nama `getHarga` dan `setHarga`; untuk boolean lazimnya `isAktif`.\n\nManfaat nyatanya letaknya di setter: aturan menjadi terpusat. Kalau harga tidak boleh negatif, pemeriksaannya ditulis satu kali di `setHarga`, dan tidak ada kode lain yang bisa memaksa harga jadi negatif. Field public membiarkan siapa pun menulis apa saja, lalu setiap class pemakai harus ingat aturan yang sama secara terpisah; begitu aturannya berubah, semua titik itu harus diburu satu per satu.\n\nGetter dan setter yang isinya satu baris memang terasa bertele-tele, dan banyak yang mengeluh soal itu. Nilainya baru terlihat saat aturan muncul atau saat representasi internal perlu diganti: selama pintunya ada, class bisa berubah tanpa merusak pemakainya. Mulai dari private sejak awal jauh lebih murah daripada membongkar field public nanti.",
          code: {
            language: "java",
            content: "class Produk {\n    private int harga;\n\n    void setHarga(int hargaBaru) {\n        if (hargaBaru >= 0) {\n            harga = hargaBaru;\n        }\n    }\n\n    int getHarga() {\n        return harga;\n    }\n}\n\n// di luar class:\n// Produk p = new Produk();\n// p.setHarga(-1000);      // ditolak setter\n// System.out.println(p.getHarga()); // 0",
            caption: "Aturan harga tak negatif hidup di satu tempat: setHarga.",
          },
        },
        {
          kind: "quiz",
          question: "Alasan utama menjadikan field data `private` adalah?",
          options: [
            "supaya program berjalan lebih cepat",
            "supaya perubahan data lewat satu pintu yang bisa memegang aturan",
            "karena Java melarang field public",
            "supaya field tidak memakai memori",
          ],
          answer: 1,
          explanation:
            "private memaksa semua akses lewat method milik class, sehingga validasi dan aturan cukup ditulis satu kali. Kecepatan dan memori tidak terpengaruh.",
        },
        {
          kind: "code",
          title: "Harga yang menolak negatif",
          prompt:
            "Program membuat objek `Produk`, mengisi harganya, mencoba mengisi ulang dengan nilai negatif, lalu mencetak harga akhir. Lengkapi getter-nya dan pemanggilan cetaknya.",
          mode: "fill",
          template:
            'import java.util.Scanner;\n\nclass Produk {\n    private int harga;\n\n    void setHarga(int hargaBaru) {\n        if (hargaBaru >= 0) {\n            harga = hargaBaru;\n        }\n    }\n\n    int getHarga() {\n        ___ harga;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        Produk p = new Produk();\n        p.setHarga(in.nextInt());\n        p.setHarga(-500);\n        System.out.println(p.___());\n    }\n}',
          solution:
            'import java.util.Scanner;\n\nclass Produk {\n    private int harga;\n\n    void setHarga(int hargaBaru) {\n        if (hargaBaru >= 0) {\n            harga = hargaBaru;\n        }\n    }\n\n    int getHarga() {\n        return harga;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        Produk p = new Produk();\n        p.setHarga(in.nextInt());\n        p.setHarga(-500);\n        System.out.println(p.getHarga());\n    }\n}',
          tests: [
            { stdin: "20000", expectedOutput: "20000" },
            { stdin: "-100", expectedOutput: "0" },
            { stdin: "0", expectedOutput: "0", hidden: true },
          ],
          hints: [
            "Getter membaca field private lalu mengirimnya keluar dengan kata kunci pengirim nilai.",
            "Membaca nilai field dari luar class dilakukan lewat method aksesnya, bukan langsung ke field.",
            "Jawabannya: return di getter, dan getHarga pada pemanggilan cetak.",
          ],
        },
      ],
    },
    {
      slug: "constructor-dan-overloading",
      title: "Constructor dan Overloading",
      summary: "Menjamin objek lahir dalam keadaan sah, dengan beberapa versi sekaligus.",
      steps: [
        {
          kind: "theory",
          title: "Method yang berjalan saat lahir",
          body: "Constructor adalah method khusus yang namanya sama dengan class, tanpa tipe kembali, dan berjalan tepat saat `new` dijalankan. Tugasnya satu: menjamin objek lahir dalam keadaan sah, field terisi, tidak ada keadaan lupa diatur. Kalau seluruh isi objek dibiarkan `null` dan `0` sampai dipikirkan pemanggil, aturan mainnya kabur.\n\nKalau class tidak punya constructor sama sekali, compiler menyediakan default constructor tanpa parameter. Begitu kamu menulis satu constructor berparameter, default itu hilang: `new Kotak()` menjadi error sampai kamu menulis `Kotak()` sendiri. Aturan ini sering mengejutkan pemula, dan sebabnya logis: kalau keberadaan constructor menandakan ada inisialisasi wajib, compiler menolak jalan pintas yang melewatkannya.\n\nConstructor boleh di-overload: beberapa versi dengan daftar parameter berbeda, dan compiler memilih lewat argumen pemanggil. Pola yang sehat: versi tanpa parameter mengisi nilai bawaan yang aman, versi berparameter menerima data nyata, dan keduanya meninggalkan objek dalam keadaan yang sama-sama sah.",
          code: {
            language: "java",
            content: 'class Kotak {\n    int sisi;\n\n    Kotak() {\n        sisi = 1;          // bawaan aman\n    }\n\n    Kotak(int s) {\n        sisi = s;          // data nyata dari pemanggil\n    }\n}\n\n// Kotak kecil = new Kotak();   -> sisi 1\n// Kotak besar = new Kotak(5);  -> sisi 5',
            caption: "Dua jalan menuju keadaan yang sama-sama sah.",
          },
        },
        {
          kind: "quiz",
          question: "Kapan constructor default tanpa parameter tersedia untuk sebuah class?",
          options: [
            "Selalu tersedia di setiap class",
            "Hanya saat class tidak memiliki constructor apa pun",
            "Hanya untuk class yang public",
            "Hanya jika semua field-nya private",
          ],
          answer: 1,
          explanation:
            "Begitu satu constructor ditulis, compiler menarik default constructor yang selama ini diberikannya. new NamaClass() tanpa argumen akan error sampai versi tanpa parameter ditulis sendiri.",
        },
        {
          kind: "code",
          title: "Dua kotak, dua constructor",
          prompt:
            "Program membuat kotak kecil dengan constructor bawaan dan kotak besar dari input. Lengkapi isi constructor berparameternya.",
          mode: "fill",
          template:
            'import java.util.Scanner;\n\nclass Kotak {\n    int sisi;\n\n    Kotak() {\n        sisi = 1;\n    }\n\n    Kotak(int s) {\n        ___ = s;\n    }\n\n    int luas() {\n        return sisi * sisi;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int s = in.nextInt();\n        Kotak kecil = new Kotak();\n        Kotak besar = new Kotak(s);\n        System.out.println(kecil.luas());\n        System.out.println(besar.luas());\n    }\n}',
          solution:
            'import java.util.Scanner;\n\nclass Kotak {\n    int sisi;\n\n    Kotak() {\n        sisi = 1;\n    }\n\n    Kotak(int s) {\n        sisi = s;\n    }\n\n    int luas() {\n        return sisi * sisi;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int s = in.nextInt();\n        Kotak kecil = new Kotak();\n        Kotak besar = new Kotak(s);\n        System.out.println(kecil.luas());\n        System.out.println(besar.luas());\n    }\n}',
          tests: [
            { stdin: "5", expectedOutput: "1\n25" },
            { stdin: "3", expectedOutput: "1\n9" },
            { stdin: "10", expectedOutput: "1\n100", hidden: true },
          ],
          hints: [
            "Constructor bertugas mengisi field milik objek yang sedang lahir.",
            "Field yang diisi sama dengan yang dipakai method luas().",
            "Jawabannya: sisi.",
          ],
        },
      ],
    },
    {
      slug: "this-dan-constructor-chaining",
      title: "this dan Constructor Chaining",
      summary: "Referensi objek saat ini, dan this(...) untuk mendelegasikan ke constructor lain.",
      steps: [
        {
          kind: "theory",
          title: "this: objek yang sedang bekerja",
          body: "`this` adalah referensi ke objek yang sedang menjalankan kode. Ia paling sering dibutuhkan saat nama parameter menutupi nama field: `this.nama = nama;` berarti field milik objek ini diisi dari parameter. Tanpa `this`, baris `nama = nama` hanya menyalin variabel ke dirinya sendiri; field tak tersentuh, program tetap lolos kompilasi, dan bug-nya diam sampai `null` muncul di layar.\n\nBentuk kedua, `this(...)`, memanggil constructor lain di class yang sama dan wajib menjadi pernyataan pertama di tubuh constructor. Inilah constructor chaining: versi tanpa parameter mengisi nilai bawaan lalu mendelegasikan ke versi paling lengkap, sehingga logika inisialisasi hanya ada di satu tempat.\n\nContoh: `Kotak() { this(1); }` dan `Kotak(int s) { this.sisi = s; }`. Pemanggilan `new Kotak()` melahirkan objek dengan sisi 1 lewat jalur yang sama persis dengan `new Kotak(5)`. Satu aturan inisialisasi, dua pintu masuk.",
          code: {
            language: "java",
            content: "class Mahasiswa {\n    String nama;\n    int npm;\n\n    Mahasiswa(String nama, int npm) {\n        this.nama = nama;   // field = parameter, tanpa this nama saling menutupi\n        this.npm = npm;\n    }\n\n    Mahasiswa() {\n        this(\"Tanpa Nama\", 0); // wajib di baris pertama\n    }\n}",
            caption: "Dua constructor, satu tempat logika isinya.",
          },
        },
        {
          kind: "quiz",
          question: "Di mana pemanggilan `this(...)` boleh ditulis?",
          options: [
            "Di baris mana pun di dalam constructor",
            "Hanya sebagai pernyataan pertama di dalam constructor",
            "Di dalam method biasa",
            "Di dalam static method",
          ],
          answer: 1,
          explanation:
            "this(...) harus jadi pernyataan pertama tubuh constructor supaya inisialisasi constructor lain selesai sebelum kode berikutnya berjalan. Java menolaknya di posisi lain.",
        },
        {
          kind: "code",
          title: "Mahasiswa tanpa nama",
          prompt:
            "Program ini seharusnya mencetak nama dan NPM mahasiswa, tetapi namanya selalu `null`. Ada satu kesalahan di constructor: parameternya saling menutupi dengan fieldnya. Perbaiki, lalu jalankan sampai semua tes lulus.",
          mode: "fix",
          template:
            'import java.util.Scanner;\n\nclass Mahasiswa {\n    String nama;\n    int npm;\n\n    Mahasiswa(String nama, int npm) {\n        nama = nama;\n        this.npm = npm;\n    }\n\n    String info() {\n        return nama + " (" + npm + ")";\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        Mahasiswa m = new Mahasiswa(in.next(), in.nextInt());\n        System.out.println(m.info());\n    }\n}',
          solution:
            'import java.util.Scanner;\n\nclass Mahasiswa {\n    String nama;\n    int npm;\n\n    Mahasiswa(String nama, int npm) {\n        this.nama = nama;\n        this.npm = npm;\n    }\n\n    String info() {\n        return nama + " (" + npm + ")";\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        Mahasiswa m = new Mahasiswa(in.next(), in.nextInt());\n        System.out.println(m.info());\n    }\n}',
          tests: [
            { stdin: "Budi\n2101", expectedOutput: "Budi (2101)" },
            { stdin: "Sinta\n2102", expectedOutput: "Sinta (2102)" },
            { stdin: "Rara\n2103", expectedOutput: "Rara (2103)", hidden: true },
          ],
          hints: [
            "Baris nama = nama menyalin parameter ke parameternya sendiri; field class tidak pernah diisi.",
            "Referensi ke field milik objek saat ini diawali this diikuti titik.",
            "Jawabannya: this.nama = nama;",
          ],
        },
      ],
    },
    {
      slug: "static-field-dan-method",
      title: "static Field dan Method",
      summary: "Milik class, dibagi semua instance: penghitung, utilitas, dan konstanta.",
      steps: [
        {
          kind: "theory",
          title: "Satu salinan untuk semua objek",
          body: "Anggota `static` milik class, bukan milik satu objek. Static field hanya ada satu salinan yang dibagi semua instance: `static int totalPesanan` pada class `Pesanan` menghitung seluruh pesanan yang pernah dibuat, bukan pesanan milik satu objek. Static method dipanggil lewat nama class, misalnya `Pesanan.getTotal()`, sama seperti kamu selama ini memanggil `Math.max` dan `Integer.parseInt`.\n\nStatic method tidak punya `this`, karena berjalan tanpa objek apa pun. Karena itu ia tidak bisa membaca field instance secara langsung; yang tersedia hanya parameternya dan anggota static lain. Sebaliknya berlaku longgar: method dan constructor instance boleh membaca dan mengubah static field, dan itulah yang dipakai untuk menaikkan penghitung setiap kali objek baru lahir.\n\nPemakaian yang sehat: utilitas murni yang hasilnya hanya bergantung pada argumen, konstanta tingkat class, dan data memang milik class seperti penghitung objek. Untuk data yang seharusnya berbeda tiap objek, ia field biasa; garis batasnya dirinci di lesson berikutnya.",
          code: {
            language: "java",
            content: 'class Pesanan {\n    static int totalPesanan = 0;\n    String nama;\n\n    Pesanan(String nama) {\n        this.nama = nama;\n        totalPesanan++;\n    }\n}\n\n// new Pesanan("kopi"); new Pesanan("teh");\n// System.out.println(Pesanan.totalPesanan); // 2',
            caption: "Dua objek lahir, satu penghitung class ikut naik dua kali.",
          },
        },
        {
          kind: "quiz",
          question: "Bagaimana cara memanggil method static `hitungPajak` yang ada di class `Util`?",
          options: [
            "new Util().hitungPajak()",
            "Util.hitungPajak()",
            "this.hitungPajak()",
            "hitungPajak(new Util())",
          ],
          answer: 1,
          explanation:
            "Anggota static dipanggil lewat nama class: Util.hitungPajak(). Membuat objek hanya untuk memanggil method static adalah pemborosan dan menyesatkan pembaca.",
        },
        {
          kind: "code",
          title: "Penghitung pesanan",
          prompt:
            "Setiap `Pesanan` yang dibuat harus menaikkan penghitung class, dan `main` mencetak hasil akhirnya lewat nama class. Lengkapi dua bagian yang hilang.",
          mode: "fill",
          template:
            'import java.util.Scanner;\n\nclass Pesanan {\n    static int totalPesanan = 0;\n    String nama;\n\n    Pesanan(String nama) {\n        this.nama = nama;\n        ___++;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        for (int i = 0; i < n; i++) {\n            new Pesanan(in.next());\n        }\n        System.out.println(Pesanan.___);\n    }\n}',
          solution:
            'import java.util.Scanner;\n\nclass Pesanan {\n    static int totalPesanan = 0;\n    String nama;\n\n    Pesanan(String nama) {\n        this.nama = nama;\n        totalPesanan++;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        for (int i = 0; i < n; i++) {\n            new Pesanan(in.next());\n        }\n        System.out.println(Pesanan.totalPesanan);\n    }\n}',
          tests: [
            { stdin: "3\nayam bakso soto", expectedOutput: "3" },
            { stdin: "1\nkopi", expectedOutput: "1" },
            { stdin: "5\np q r s t", expectedOutput: "5", hidden: true },
          ],
          hints: [
            "Penghitungnya dideklarasikan di paling atas class dengan kata kunci static.",
            "Field yang sama dipakai dua kali: dinaikkan di constructor, dibaca lewat nama class di main.",
            "Jawabannya: totalPesanan untuk keduanya.",
          ],
        },
      ],
    },
    {
      slug: "static-vs-instance",
      title: "Kapan static, Kapan Instance",
      summary: "Garis batas praktis antara data tingkat class dan data milik objek.",
      steps: [
        {
          kind: "theory",
          title: "Satu pertanyaan penentu",
          body: "Ujinya satu kalimat: apakah nilainya sama untuk semua objek, atau berbeda tiap objek? Nama, saldo, dan stok milik tiap objek, jadi field instance. Konstanta PPN, utilitas konversi, dan penghitung seluruh objek nilainya satu untuk se-class, jadi static. Kalau pertanyaannya sulit dijawab, kemungkinan besar data itu milik objek dan harus instance.\n\nKebiasaan buruk yang sering ditemui di kode nyata: menjadikan semuanya static supaya gampang dipanggil tanpa `new`. Akibatnya state menumpuk di class dan dibagi diam-diam ke seluruh program; dua bagian kode yang tidak saling kenal menulis data yang sama pada waktu yang bersamaan, dan kejutan muncul di tempat lain. Static bukan jalan pintas menghindari pembuatan objek, melainkan pernyataan bahwa data itu memang tingkat class.\n\nAturan praktis yang bisa dibawa kerja: fungsi kecil tanpa state dan konstanta boleh static; apa pun yang punya identitas dan keadaan sendiri, seperti `Pelanggan` atau `Pesanan`, hampir selalu instance. Modul berikutnya menambahkan lapisan di atasnya: class yang berhubungan lewat warisan dan kontrak.",
          code: {
            language: "java",
            content: "class Pesanan {\n    static int totalDibuat = 0; // milik class: satu untuk semua\n    String nama;                // milik objek: beda tiap pesanan\n    int jumlah;                 // milik objek\n\n    Pesanan(String nama, int jumlah) {\n        this.nama = nama;\n        this.jumlah = jumlah;\n        totalDibuat++;\n    }\n}",
            caption: "Static untuk yang se-class, instance untuk yang per objek.",
          },
        },
        {
          kind: "quiz",
          question: "Field `nama` pada class `Pelanggan` sebaiknya static atau instance, dan mengapa?",
          options: [
            "static, supaya mudah dipanggil tanpa membuat objek",
            "instance, karena tiap pelanggan punya nama berbeda",
            "static final, karena nama tidak seharusnya berubah",
            "tidak perlu dideklarasikan, cukup variabel di method",
          ],
          answer: 1,
          explanation:
            "Nama berbeda untuk setiap pelanggan, jadi datanya per objek dan harus field instance. Menjadikannya static berarti seluruh program berbagi satu nama yang sama.",
        },
        {
          kind: "quiz",
          question: "Kenapa static method tidak bisa membaca field instance secara langsung?",
          options: [
            "Karena field instance selalu private",
            "Karena static method berjalan tanpa objek, sehingga tidak ada this yang bisa dipakai",
            "Karena field instance hanya ada saat kompilasi",
            "Karena static method hanya boleh mengembalikan void",
          ],
          answer: 1,
          explanation:
            "Static method dipanggil lewat nama class tanpa objek apa pun, jadi tidak ada this yang menunjuk ke data instance. Field instance hanya hidup bersama sebuah objek.",
        },
      ],
    },
    {
      slug: "package-dan-import",
      title: "Package dan Import",
      summary: "Mengelompokkan class, memanggil class lain, dan java.lang yang datang otomatis.",
      steps: [
        {
          kind: "theory",
          title: "Folder logis untuk class",
          body: "Package mengelompokkan class yang sekeluarga dan memberi ruang nama: dua class bernama `Util` di package berbeda tidak bertabrakan. Deklarasinya selalu baris pertama file, `package kasir.model;`, dan mengikuti struktur folder secara harfiah. Konvensi namanya huruf kecil semua, dan perusahaan biasanya memakai domain terbalik seperti `com.kodekita.kasir` agar unik di dunia.\n\n`import` menyebut class dari package lain supaya cukup dipanggil pendek. Setelah `import java.util.Scanner;`, seluruh file boleh menulis `Scanner` saja; tanpa import, harus ditulis lengkap setiap kali: `java.util.Scanner in = new java.util.Scanner(System.in);`. Bentuk `import java.util.*;` mengambil semua class yang menempel langsung di `java.util`, tetapi tidak class di subpackage-nya; wildcard nyaman, meski banyak tim memilih import eksplisit supaya asal tiap class terbaca.\n\nSatu package diimpor otomatis tanpa baris apa pun: `java.lang`. Itulah sebabnya `String`, `System`, `Math`, dan `Integer` selama ini bisa langsung dipakai. Sisanya, dari `Scanner` sampai `ArrayList`, wajib di-import atau ditulis lengkap.",
          code: {
            language: "java",
            content: 'package kasir;\n\nimport java.util.Scanner;   // satu class\nimport java.util.ArrayList; // class lain dari package yang sama\n\npublic class KasirApp {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in); // java.lang: System, String, tanpa import\n        ArrayList<String> keranjang = new ArrayList<>();\n        keranjang.add(in.next());\n        System.out.println(keranjang);\n    }\n}',
            caption: "Baris pertama milik package, baris berikutnya milik import.",
          },
        },
        {
          kind: "quiz",
          question: "Class mana yang bisa langsung dipakai tanpa baris import?",
          options: ["Scanner", "ArrayList", "String", "HashMap"],
          answer: 2,
          explanation:
            "String berasal dari java.lang yang diimpor otomatis oleh setiap file Java. Scanner, ArrayList, dan HashMap harus di-import atau ditulis dengan nama package lengkapnya.",
        },
        {
          kind: "quiz",
          question: "Apa arti `import java.util.*;`?",
          options: [
            "Mengimpor semua class di java.util beserta semua subpackage-nya",
            "Mengimpor semua class yang menempel langsung di java.util, tanpa subpackage",
            "Mengimpor satu class bernama bintang",
            "Membuat seluruh program bebas dari kewajiban import",
          ],
          answer: 1,
          explanation:
            "Wildcard hanya mengambil class di tingkat paling atas package itu. Class di dalam subpackage, misalnya java.util.concurrent, tetap perlu import sendiri.",
        },
      ],
    },
    {
      slug: "override-tostring",
      title: "Override toString()",
      summary: "Supaya println(obj) menampilkan keadaan objek, bukan kode hash.",
      steps: [
        {
          kind: "theory",
          title: "Cetakan bawaan yang tidak informatif",
          body: "Setiap class di Java mewarisi method `toString()` dari class `Object`, leluhur semua tipe referensi. Versi bawaannya tidak informatif: nama class, tanda `@`, dan kode hash, misalnya `Produk@1b6d3586`. `System.out.println(obj)` memanggil `toString()` secara diam-diam, sehingga cetakannya ikut jadi begitu, dan itu yang membuat banyak pemula bingung saat pertama mencetak objek.\n\nOverride `toString()` untuk mengembalikan teks yang mewakili keadaan objek, misalnya `return judul + \" (\" + tahun + \")\";`. Selalu sertakan anotasi `@Override` di atasnya: compiler lalu memeriksa bahwa method dengan tanda tangan yang sama memang ada di class induk, sehingga salah ketik seperti `tostring` atau `ToString` tertangkap saat kompilasi, bukan jadi method baru yang tidak pernah dipanggil.\n\nManfaatnya melampaui println. Saat debugging dan logging, satu baris teks yang mewakili objek sering menjadi selisih antara langsung melihat masalah dan membongkar kode untuk mencarinya. Biasakan setiap class data punya `toString` yang layak baca sejak hari pertama ia dibuat.",
          code: {
            language: "java",
            content: 'class Buku {\n    String judul;\n    int tahun;\n\n    Buku(String judul, int tahun) {\n        this.judul = judul;\n        this.tahun = tahun;\n    }\n\n    @Override\n    public String toString() {\n        return judul + " (" + tahun + ")";\n    }\n}\n\n// System.out.println(new Buku("Kamus", 2008));\n// tanpa override: Buku@1b6d3586\n// dengan override: Kamus (2008)',
            caption: "Anotasi @Override memasang penjaga di waktu kompilasi.",
          },
        },
        {
          kind: "quiz",
          question: "Apa hasil `System.out.println(obj)` jika class obj tidak meng-override `toString()`?",
          options: [
            "Isi semua field objek dicetak satu per satu",
            "Nama class, tanda @, dan kode hash, misalnya Produk@1b6d3586",
            "Terjadi error saat runtime",
            "Dicetak string kosong",
          ],
          answer: 1,
          explanation:
            "println memanggil toString() milik Object, dan versi bawaannya menghasilkan nama class diikuti @ dan kode hash. Tanpa override, cetakan tidak menceritakan apa pun tentang isinya.",
        },
        {
          kind: "code",
          title: "Buku yang bisa dicantumkan",
          prompt:
            "Program mencetak objek `Buku` langsung. Lengkapi satu baris yang membuat compiler menjaga agar method ini benar-benar meng-override `toString()` milik class induk.",
          mode: "fill",
          template:
            'import java.util.Scanner;\n\nclass Buku {\n    String judul;\n    int tahun;\n\n    Buku(String judul, int tahun) {\n        this.judul = judul;\n        this.tahun = tahun;\n    }\n\n    ___\n    public String toString() {\n        return judul + " (" + tahun + ")";\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        Buku b = new Buku(in.next(), in.nextInt());\n        System.out.println(b);\n    }\n}',
          solution:
            'import java.util.Scanner;\n\nclass Buku {\n    String judul;\n    int tahun;\n\n    Buku(String judul, int tahun) {\n        this.judul = judul;\n        this.tahun = tahun;\n    }\n\n    @Override\n    public String toString() {\n        return judul + " (" + tahun + ")";\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        Buku b = new Buku(in.next(), in.nextInt());\n        System.out.println(b);\n    }\n}',
          tests: [
            { stdin: "Kamus\n2008", expectedOutput: "Kamus (2008)" },
            { stdin: "Novel\n2015", expectedOutput: "Novel (2015)" },
            { stdin: "Puisi\n1999", expectedOutput: "Puisi (1999)", hidden: true },
          ],
          hints: [
            "Yang dicari bukan kata kunci, melainkan anotasi yang menjaga method override.",
            "Anotasinya ditulis sendirian di atas public String toString().",
            "Jawabannya: @Override.",
          ],
        },
      ],
    },
    {
      slug: "latihan-modul-1-rekening",
      title: "Latihan Gabungan: Class Rekening",
      summary: "Encapsulation, constructor, aturan saldo, dan toString dalam satu class utuh.",
      steps: [
        {
          kind: "theory",
          title: "Class yang menjaga aturannya sendiri",
          body: "Latihan penutup merangkai seluruh modul OOP Inti dalam satu class: field `private`, constructor berparameter yang mengisi lewat `this`, method yang menegakkan aturan bisnis, dan `toString()` untuk cetakan rapi. `Rekening` memegang dua aturan: setoran hanya diterima bila jumlahnya positif, dan penarikan hanya boleh bila saldonya cukup.\n\nPerhatikan `main` pada latihan berikut: ia tidak pernah menyentuh `saldo` secara langsung. Semua perubahan lewat `setor` dan `tarik`, dan pembacaan akhir lewat `println` yang memanggil `toString()`. Itulah encapsulation yang bekerja sungguhan: `main` menyuruh, class menjaga. Kalau nanti aturannya berubah, misalnya penarikan kena batas harian, yang disunting hanya satu class.",
          code: {
            language: "java",
            content: "// Rekening(String pemilik, int saldo) -> this.pemilik, this.saldo\n// setor: hanya jumlah > 0\n// tarik: hanya jumlah > 0 dan tidak melebihi saldo\n// toString: \"nama: Rpjumlah\"",
            caption: "Empat kontrak yang harus dipenuhi class Rekening di langkah berikutnya.",
          },
        },
        {
          kind: "code",
          title: "Bangun class Rekening",
          prompt:
            "Lengkapi tiga bagian yang hilang: pengisian field `pemilik` di constructor, syarat saldo pada `tarik`, dan isi `toString()` dengan bentuk `nama: Rpjumlah`.",
          mode: "fill",
          template:
            'import java.util.Scanner;\n\nclass Rekening {\n    private String pemilik;\n    private int saldo;\n\n    Rekening(String pemilik, int saldo) {\n        ___ = pemilik;\n        this.saldo = saldo;\n    }\n\n    void setor(int jumlah) {\n        if (jumlah > 0) {\n            saldo += jumlah;\n        }\n    }\n\n    void tarik(int jumlah) {\n        if (jumlah > 0 && jumlah ___ saldo) {\n            saldo -= jumlah;\n        }\n    }\n\n    @Override\n    public String toString() {\n        return ___;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        Rekening r = new Rekening(in.next(), in.nextInt());\n        r.setor(in.nextInt());\n        r.tarik(in.nextInt());\n        r.tarik(in.nextInt());\n        System.out.println(r);\n    }\n}',
          solution:
            'import java.util.Scanner;\n\nclass Rekening {\n    private String pemilik;\n    private int saldo;\n\n    Rekening(String pemilik, int saldo) {\n        this.pemilik = pemilik;\n        this.saldo = saldo;\n    }\n\n    void setor(int jumlah) {\n        if (jumlah > 0) {\n            saldo += jumlah;\n        }\n    }\n\n    void tarik(int jumlah) {\n        if (jumlah > 0 && jumlah <= saldo) {\n            saldo -= jumlah;\n        }\n    }\n\n    @Override\n    public String toString() {\n        return pemilik + ": Rp" + saldo;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        Rekening r = new Rekening(in.next(), in.nextInt());\n        r.setor(in.nextInt());\n        r.tarik(in.nextInt());\n        r.tarik(in.nextInt());\n        System.out.println(r);\n    }\n}',
          tests: [
            { stdin: "Andi\n50000\n20000\n30000\n0", expectedOutput: "Andi: Rp40000" },
            { stdin: "Budi\n100000\n0\n150000\n50000", expectedOutput: "Budi: Rp50000" },
            { stdin: "Citra\n20000\n80000\n99000\n1000", expectedOutput: "Citra: Rp0", hidden: true },
          ],
          hints: [
            "Parameter constructor menutupi nama field pemilik, sama seperti kasus Mahasiswa di lesson this.",
            "Penarikan sah bila jumlahnya positif dan tidak melebihi saldo yang ada.",
            "Jawabannya: this.pemilik untuk constructor, <= untuk syarat tarik, dan pemilik + \": Rp\" + saldo untuk toString.",
          ],
        },
      ],
    },
  ],
};
