import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "java",
  moduleRange: [6, 7],
  modules: [
    {
      title: "Streams API",
      description: "filter/map/reduce, Collectors, grouping, dan pipeline data yang bersih.",
    },
    {
      title: "Concurrency Dasar",
      description: "Thread, ExecutorService, synchronized, dan pola aman data bersama.",
    },
  ],
  lessons: [
    // ==================== MODUL 6: Streams API ====================
    {
      slug: "str-stream-dari-list",
      title: "Stream dari List",
      summary: "Ubah List menjadi stream, saring dengan filter, dan konsumsi dengan forEach.",
      steps: [
        {
          kind: "theory",
          title: "Aliran data tanpa loop manual",
          body: "Sebuah List menyimpan data. Kadang yang kita butuhkan bukan menyimpan, melainkan mengalirkan data melalui serangkaian pengolahan: saring ini, ubah itu, lalu pakai hasilnya. Streams API menyediakan cara menyusun alur itu sebagai satu rangkaian yang terbaca dari kiri ke kanan. Panggil `.stream()` pada koleksi, rangkai operasi yang diinginkan, lalu tutup dengan satu operasi terminal, tanpa satu pun loop manual.\n\nOperasi stream terbagi dua jenis. Operasi menengah seperti `filter` mengembalikan stream baru sehingga bisa dirangkai terus. Operasi terminal seperti `forEach` mengonsumsi stream dan menutup rangkaiannya. Setelah operasi terminal dipanggil, stream yang sama tidak bisa dipakai lagi.\n\nYang penting diingat: stream tidak mengubah koleksi aslinya. `filter` tidak menghapus apa pun dari List, ia hanya memutuskan elemen mana yang boleh lewat ke tahap berikutnya. Data asli tetap utuh, dan nasib hasil akhir ditentukan operasi terminalmu.",
          code: {
            language: "java",
            content:
              'List<String> buah = List.of("apel", "jeruk", "kiwi", "mangga");\n\nbuah.stream()\n    .filter(b -> b.length() > 4)\n    .forEach(b -> System.out.println(b));\n// jeruk\n// mangga',
            caption: "filter memutuskan siapa yang lewat, forEach menampilkannya.",
          },
        },
        {
          kind: "code",
          title: "Saring angka genap",
          prompt:
            "Lengkapi pipeline di bawah supaya hanya angka genap yang tercetak, satu per baris. Ganti dua bagian yang masih kosong.",
          mode: "fill",
          template:
            'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        List<Integer> angka = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            angka.add(in.nextInt());\n        }\n\n        angka.___()\n             .filter(a -> a ___ 2 == 0)\n             .forEach(a -> System.out.println(a));\n    }\n}',
          solution:
            'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        List<Integer> angka = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            angka.add(in.nextInt());\n        }\n\n        angka.stream()\n             .filter(a -> a % 2 == 0)\n             .forEach(a -> System.out.println(a));\n    }\n}',
          tests: [
            { stdin: "6\n3\n8\n5\n12\n7\n10", expectedOutput: "8\n12\n10" },
            { stdin: "4\n1\n2\n4\n9", expectedOutput: "2\n4" },
            { stdin: "5\n2\n4\n6\n8\n10", expectedOutput: "2\n4\n6\n8\n10", hidden: true },
          ],
          hints: [
            "Blank pertama mengubah List menjadi stream; methodnya bernama stream dan dipanggil tanpa argumen.",
            "Blank kedua adalah operator sisa bagi untuk mengecek habis dibagi 2.",
            "Jawaban: stream untuk blank pertama, % untuk blank kedua.",
          ],
        },
      ],
    },
    {
      slug: "str-map-foreach",
      title: "map dan Method Reference",
      summary: "Ubah setiap elemen dengan map, lalu tampilkan dengan forEach lewat method reference.",
      steps: [
        {
          kind: "theory",
          title: "Satu elemen masuk, satu elemen keluar",
          body: "Kalau `filter` memilih elemen mana yang boleh lewat, `map` mengubah setiap elemen yang lewat. Satu elemen masuk, satu elemen keluar dalam bentuk baru: teks jadi huruf besar, angka jadi kuadratnya, objek jadi satu field miliknya. Bentuk pipeline tetap sama, hanya tahap tengahnya berganti.\n\nKarena transformasi sering berupa pemanggilan method sederhana, Java menyediakan method reference: `String::toUpperCase` artinya panggil `toUpperCase` pada setiap elemen. Bentuk ini setara dengan lambda `k -> k.toUpperCase()`, hanya lebih ringkas.\n\n`forEach` adalah operasi terminal yang tidak menghasilkan nilai: ia menjalankan aksi pada setiap elemen lalu selesai. Cocok untuk mencetak atau mengirim data, bukan untuk membangun koleksi baru. Untuk itu, beberapa lesson lagi kita kenalan dengan `collect`.",
          code: {
            language: "java",
            content:
              'List<String> nama = List.of("dina", "budi", "sari");\n\nnama.stream()\n    .map(String::toUpperCase)\n    .forEach(n -> System.out.println(n));\n// DINA\n// BUDI\n// SARI',
            caption: "map mengubah tiap elemen, forEach menampilkannya.",
          },
        },
        {
          kind: "code",
          title: "Kapitalkan seluruh daftar",
          prompt:
            "Lengkapi pipeline di bawah: ubah setiap kata menjadi huruf besar dengan lambda, lalu cetak lewat method reference `System.out::println`.",
          mode: "fill",
          template:
            'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        List<String> kata = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            kata.add(in.next());\n        }\n\n        kata.stream()\n            .map(k -> k.___())\n            .forEach(System.out::___);\n    }\n}',
          solution:
            'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        List<String> kata = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            kata.add(in.next());\n        }\n\n        kata.stream()\n            .map(k -> k.toUpperCase())\n            .forEach(System.out::println);\n    }\n}',
          tests: [
            { stdin: "3\nkopi\nteh\ncoklat", expectedOutput: "KOPI\nTEH\nCOKLAT" },
            { stdin: "2\nJava\nStream", expectedOutput: "JAVA\nSTREAM" },
            { stdin: "1\nbelajar", expectedOutput: "BELAJAR", hidden: true },
          ],
          hints: [
            "Method pada String yang mengubah huruf menjadi kapital bernama toUpperCase.",
            "Method yang mencetak satu baris bernama println.",
            "Jawaban: toUpperCase untuk blank pertama, println untuk blank kedua.",
          ],
        },
      ],
    },
    {
      slug: "str-sorted-distinct",
      title: "sorted dan distinct",
      summary: "Buang duplikat dan urutkan elemen di dalam pipeline, tanpa koleksi tambahan.",
      steps: [
        {
          kind: "theory",
          title: "Dua operasi menengah yang sering berpasangan",
          body: "Setelah `filter` dan `map`, dua operasi menengah yang paling sering berpasangan adalah `sorted` dan `distinct`. `sorted()` tanpa argumen mengurutkan elemen menurut urutan alaminya: angka dari kecil ke besar, teks menurut abjad. Untuk urutan lain, beri argumen berupa `Comparator` seperti yang sudah kamu kenal di modul Collections.\n\n`distinct()` membuang duplikat. Ia bekerja lewat `equals`: dua elemen yang sama menurut `equals` hanya satu yang lolos. Karena keduanya operasi menengah, urutan penulisannya bebas untuk kasus sederhana, tapi posisi operasi lain di sekitarnya bisa mengubah hasil maupun kinerja.\n\nIngat, keduanya masih menengah: hasilnya stream, belum dikonsumsi. Pipeline baru benar-benar berjalan ketika operasi terminal dipanggil di ujung.",
          code: {
            language: "java",
            content:
              "List<Integer> angka = List.of(5, 3, 5, 9, 3, 1);\n\nangka.stream()\n     .distinct()\n     .sorted()\n     .forEach(a -> System.out.println(a));\n// 1\n// 3\n// 5\n// 9",
            caption: "distinct membuang duplikat, sorted mengurutkan sisanya.",
          },
        },
        {
          kind: "code",
          title: "Daftar unik dan terurut",
          prompt:
            "Lengkapi pipeline di bawah supaya mencetak setiap angka sekali saja, terurut dari kecil ke besar, satu per baris.",
          mode: "fill",
          template:
            'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        List<Integer> angka = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            angka.add(in.nextInt());\n        }\n\n        angka.stream()\n             .___()\n             .___()\n             .forEach(a -> System.out.println(a));\n    }\n}',
          solution:
            'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        List<Integer> angka = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            angka.add(in.nextInt());\n        }\n\n        angka.stream()\n             .distinct()\n             .sorted()\n             .forEach(a -> System.out.println(a));\n    }\n}',
          tests: [
            { stdin: "6\n5\n3\n5\n9\n3\n1", expectedOutput: "1\n3\n5\n9" },
            { stdin: "5\n10\n2\n10\n2\n7", expectedOutput: "2\n7\n10" },
            { stdin: "3\n4\n4\n4", expectedOutput: "4", hidden: true },
          ],
          hints: [
            "Operasi pertama membuang angka yang kembar; namanya distinct, dipanggil tanpa argumen.",
            "Operasi kedua mengurutkan dari kecil ke besar; namanya sorted, juga tanpa argumen untuk urutan alami.",
            "Jawaban: distinct() lalu sorted().",
          ],
        },
      ],
    },
    {
      slug: "str-reduce-sum",
      title: "reduce: Melipat Menjadi Satu Nilai",
      summary: "Gabungkan seluruh elemen menjadi satu nilai akhir dengan nilai awal dan fungsi penggabung.",
      steps: [
        {
          kind: "theory",
          title: "Dari aliran panjang menjadi satu angka",
          body: "`filter` dan `map` mengolah isi aliran. Kadang yang dibutuhkan justru meringkas seluruh aliran menjadi satu nilai: total belanja, hasil kali, nilai terbesar. Untuk itu ada `reduce`, operasi terminal yang melipat elemen satu per satu menjadi akumulator.\n\n`reduce` butuh dua hal: nilai awal (identity) dan fungsi penggabung (accumulator). `reduce(0, Integer::sum)` memulai dari 0, lalu menjumlahkan setiap elemen ke akumulasi sebelumnya. Untuk hasil kali, identity-nya 1 dan penggabungnya perkalian; untuk mencari nilai terbesar, penggabungnya `Integer::max`.\n\nPilih identity dengan hati-hati. Nilai awal harus netral terhadap penggabungan: 0 untuk penjumlahan, 1 untuk perkalian. Salah identity, salah hasil, dan kesalahannya sering tidak terlihat pada data kecil.",
          code: {
            language: "java",
            content:
              "List<Integer> belanja = List.of(12000, 8000, 5000);\n\nint total = belanja.stream()\n                   .reduce(0, Integer::sum);\n\nSystem.out.println(total); // 25000",
            caption: "reduce melipat tiga angka menjadi satu total.",
          },
        },
        {
          kind: "code",
          title: "Total yang selalu kelebihan",
          prompt:
            "Program penjumlah ini selalu melaporkan total lebih besar dari seharusnya. Cari satu kesalahannya, perbaiki, lalu jalankan sampai semua tes lulus.",
          mode: "fix",
          template:
            'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        List<Integer> angka = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            angka.add(in.nextInt());\n        }\n\n        int total = angka.stream()\n                         .reduce(1, Integer::sum);\n        System.out.println("total: " + total);\n    }\n}',
          solution:
            'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        List<Integer> angka = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            angka.add(in.nextInt());\n        }\n\n        int total = angka.stream()\n                         .reduce(0, Integer::sum);\n        System.out.println("total: " + total);\n    }\n}',
          tests: [
            { stdin: "5\n4\n10\n7\n1\n3", expectedOutput: "total: 25" },
            { stdin: "3\n100\n200\n300", expectedOutput: "total: 600" },
            { stdin: "1\n42", expectedOutput: "total: 42", hidden: true },
          ],
          hints: [
            "Coba hitung manual: input 4, 10, 7, 1, 3 seharusnya berjumlah 25, tapi program menunjukkan 26. Kelebihannya satu, persis seperti nilai awal reduce.",
            "Nilai awal (identity) harus netral untuk penjumlahan: tidak menambah apa pun ke hasil.",
            "Ganti nilai awal reduce dari 1 menjadi 0.",
          ],
        },
      ],
    },
    {
      slug: "str-collectors-list-set",
      title: "Collectors.toList dan toSet",
      summary: "Kumpulkan hasil pipeline menjadi List atau Set yang bisa dipakai lagi di bagian lain.",
      steps: [
        {
          kind: "theory",
          title: "Dari sekali pakai menjadi koleksi awet",
          body: "Semua operasi yang kita bahas mengalirkan data sampai operasi terminal mengonsumsinya. `collect` adalah operasi terminal yang tidak sekadar mengonsumsi: ia menampung hasil ke dalam struktur data sungguhan. Collector paling sering dipakai adalah `Collectors.toList()`, yang mengembalikan `List` berisi elemen hasil pipeline. Karena kembali menjadi List, hasilnya bisa diindeks, dihitung dengan `size()`, atau diteruskan ke bagian program lain.\n\n`Collectors.toSet()` bekerja sama, tapi hasilnya `Set`: duplikat hilang, dan pada `HashSet` urutan tidak dijamin. Kalau kamu butuh himpunan yang terurut, kumpulkan lewat `Collectors.toCollection(TreeSet::new)`.\n\nKuncinya: stream itu sekali pakai, sedangkan hasil `collect` adalah koleksi biasa yang awet. Pola umum di kode produksi adalah membangun koleksi dengan stream, lalu melanjutkan kerja dengan koleksi tersebut.",
          code: {
            language: "java",
            content:
              "List<Integer> angka = List.of(3, -2, 8, -5, 3);\n\nList<Integer> positif = angka.stream()\n        .filter(a -> a > 0)\n        .collect(Collectors.toList());\n\nSet<Integer> unik = angka.stream()\n        .collect(Collectors.toSet());\n\nSystem.out.println(positif); // [3, 8, 3]\nSystem.out.println(unik);    // urutan tidak dijamin",
            caption: "collect mengubah stream menjadi koleksi yang bisa dipakai lagi.",
          },
        },
        {
          kind: "quiz",
          question: "Apa perbedaan utama hasil `Collectors.toList()` dan `Collectors.toSet()`?",
          options: [
            "toList menjaga urutan dan duplikat, toSet membuang duplikat tanpa jaminan urutan",
            "toList membuang duplikat, toSet justru menyimpannya",
            "toList hanya untuk angka, toSet hanya untuk teks",
            "Tidak ada perbedaan, keduanya selalu menghasilkan List",
          ],
          answer: 0,
          explanation:
            "toList menghasilkan List: urutan aliran dipertahankan dan duplikat ikut. toSet menghasilkan Set: duplikat dibuang lewat equals, dan HashSet tidak menjamin urutan.",
        },
        {
          kind: "code",
          title: "Kumpulkan angka positif",
          prompt:
            "Lengkapi pipeline di bawah: saring angka positif, kumpulkan menjadi `List<Integer>` dengan collector yang tepat, lalu program mencetak list-nya dan banyak elemennya.",
          mode: "fill",
          template:
            'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        List<Integer> angka = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            angka.add(in.nextInt());\n        }\n\n        List<Integer> positif = angka.stream()\n                .filter(a -> a > 0)\n                .___(Collectors.___());\n\n        System.out.println(positif);\n        System.out.println("banyak: " + positif.size());\n    }\n}',
          solution:
            'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        List<Integer> angka = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            angka.add(in.nextInt());\n        }\n\n        List<Integer> positif = angka.stream()\n                .filter(a -> a > 0)\n                .collect(Collectors.toList());\n\n        System.out.println(positif);\n        System.out.println("banyak: " + positif.size());\n    }\n}',
          tests: [
            { stdin: "6\n3\n-2\n8\n-5\n0\n12", expectedOutput: "[3, 8, 12]\nbanyak: 3" },
            { stdin: "4\n-1\n-2\n-3\n0", expectedOutput: "[]\nbanyak: 0" },
            { stdin: "5\n7\n-7\n7\n1\n-1", expectedOutput: "[7, 7, 1]\nbanyak: 3", hidden: true },
          ],
          hints: [
            "Untuk menampung hasil pipeline ke dalam koleksi, operasi terminalnya collect, menerima sebuah collector.",
            "Collector yang menghasilkan List bernama toList, dipanggil lewat Collectors.toList().",
            "Jawaban: collect(Collectors.toList()).",
          ],
        },
      ],
    },
    {
      slug: "str-collectors-joining",
      title: "Collectors.joining",
      summary: "Gabungkan seluruh elemen teks menjadi satu string berformat dalam satu baris kode.",
      steps: [
        {
          kind: "theory",
          title: "Merangkai teks tanpa drama koma",
          body: "Menggabungkan banyak potongan teks menjadi satu adalah kebutuhan sehari-hari: menyusun daftar menu, merangkai potongan log, atau membuat CSV sederhana. Loop biasa bisa, tapi rawan satu masalah klasik: pemisah yang menempel di awal atau di akhir. `Collectors.joining` menyelesaikan itu dalam satu baris.\n\n`joining` punya tiga bentuk. `joining(\"\")` merangkai tanpa pemisah. `joining(\", \")` menyisipkan pemisah hanya di antara elemen, tidak di ujung. `joining(delimiter, prefix, suffix)` menambah pembuka dan penutup, misalnya tanda kurung siku.\n\nCollector ini bekerja pada `Stream<String>`. Kalau elemenmu bukan string, `map` dulu ke `String`, lalu join. Hasilnya satu `String` utuh, siap dicetak atau disimpan.",
          code: {
            language: "java",
            content:
              'String hasil = Stream.of("kopi", "teh", "susu")\n        .collect(Collectors.joining(", ", "[", "]"));\n\nSystem.out.println(hasil); // [kopi, teh, susu]',
            caption: "pemisah hanya muncul di antara elemen, tidak di ujung.",
          },
        },
        {
          kind: "code",
          title: "Susun baris menu",
          prompt:
            "Lengkapi program di bawah supaya seluruh kata dari input dirangkai menjadi satu baris menu: diawali teks `menu: `, kata dipisah koma dan satu spasi. Ganti dua bagian yang kosong.",
          mode: "fill",
          template:
            'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        List<String> kata = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            kata.add(in.next());\n        }\n\n        String menu = kata.stream()\n                .___(Collectors.joining("___", "menu: ", ""));\n\n        System.out.println(menu);\n    }\n}',
          solution:
            'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        List<String> kata = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            kata.add(in.next());\n        }\n\n        String menu = kata.stream()\n                .collect(Collectors.joining(", ", "menu: ", ""));\n\n        System.out.println(menu);\n    }\n}',
          tests: [
            { stdin: "3\nkopi\nteh\ncoklat", expectedOutput: "menu: kopi, teh, coklat" },
            { stdin: "1\nroti", expectedOutput: "menu: roti" },
            { stdin: "4\nnasi\nayam\nsambal\nteh", expectedOutput: "menu: nasi, ayam, sambal, teh", hidden: true },
          ],
          hints: [
            "Collector-nya dipanggil lewat operasi terminal collect.",
            "Pemisah yang diminta adalah koma disusul satu spasi.",
            "Jawaban: collect untuk blank pertama, isi blank kedua dengan \", \".",
          ],
        },
      ],
    },
    {
      slug: "str-groupingby-counting",
      title: "groupingBy dan counting",
      summary: "Kelompokkan data menurut kunci, hitung anggota tiap kelompok, dan cetak laporan yang rapi.",
      steps: [
        {
          kind: "theory",
          title: "GROUP BY versi Java",
          body: "Perhatikan pertanyaan laporan klasik: dari sekumpulan transaksi, berapa banyak per jenisnya? Dari sekumpulan kata, mana yang paling sering muncul? Pola ini dikenal sebagai pengelompokan, dan `Collectors.groupingBy` adalah jawabannya di dunia stream.\n\n`groupingBy(classifier)` mengelompokkan elemen menurut kunci yang dihasilkan classifier. Tanpa collector tambahan, nilainya berupa `List` berisi anggota kelompok. Menambahkan downstream collector mengubah isi kelompoknya: `Collectors.counting()` menggantinya dengan jumlah anggota, `Collectors.summingInt(...)` dengan jumlah nilai.\n\nHasil `groupingBy` default berupa `HashMap`, sehingga urutan kunci tidak dijamin. Untuk laporan yang harus tampil konsisten, beri peta pabrikan `TreeMap`: `groupingBy(k -> k, TreeMap::new, downstream)`, sehingga kunci tercetak urut.",
          code: {
            language: "java",
            content:
              'List<String> kata = List.of("kopi", "teh", "kopi");\n\nMap<String, Long> hitung = kata.stream()\n        .collect(Collectors.groupingBy(\n                k -> k,\n                TreeMap::new,\n                Collectors.counting()));\n\nSystem.out.println(hitung); // {kopi=2, teh=1}',
            caption: "groupingBy membentuk kunci, counting mengisi nilainya.",
          },
        },
        {
          kind: "quiz",
          question: "Apa tipe hasil dari `collect(Collectors.groupingBy(k -> k))` pada sebuah `Stream<String>`?",
          options: [
            "List<String> berisi seluruh elemen",
            "Map dengan kunci hasil classifier dan value berupa List anggota kelompok",
            "Set<String> berisi kunci yang unik",
            "long berupa banyaknya kelompok",
          ],
          answer: 1,
          explanation:
            "groupingBy menghasilkan Map: kuncinya keluaran classifier, nilainya List berisi anggota kelompok. Dengan downstream collector seperti counting(), value berganti menjadi hitungan.",
        },
        {
          kind: "code",
          title: "Hitung kata berulang",
          prompt:
            "Lengkapi program penghitung kata: kelompokkan kata-kata dari input, hitung kemunculannya, dan cetak dari kunci terurut abjad dalam format `kata: jumlah`. Dua bagian masih kosong.",
          mode: "fill",
          template:
            'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        List<String> kata = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            kata.add(in.next());\n        }\n\n        Map<String, Long> hitung = kata.stream()\n                .___(Collectors.groupingBy(k -> k, TreeMap::new, Collectors.___()));\n\n        hitung.forEach((kunci, jumlah) -> System.out.println(kunci + ": " + jumlah));\n    }\n}',
          solution:
            'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        List<String> kata = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            kata.add(in.next());\n        }\n\n        Map<String, Long> hitung = kata.stream()\n                .collect(Collectors.groupingBy(k -> k, TreeMap::new, Collectors.counting()));\n\n        hitung.forEach((kunci, jumlah) -> System.out.println(kunci + ": " + jumlah));\n    }\n}',
          tests: [
            { stdin: "6\nkopi\nteh\nkopi\ncoklat\nteh\nkopi", expectedOutput: "coklat: 1\nkopi: 3\nteh: 2" },
            { stdin: "4\na\nb\na\nc", expectedOutput: "a: 2\nb: 1\nc: 1" },
            { stdin: "3\nx\nx\nx", expectedOutput: "x: 3", hidden: true },
          ],
          hints: [
            "Blank pertama adalah operasi terminal yang menampung hasil ke Map: collect.",
            "Downstream collector yang menghitung anggota tiap kelompok bernama counting.",
            "Jawaban: collect(...) di blank pertama, Collectors.counting() di blank kedua.",
          ],
        },
      ],
    },
    {
      slug: "str-flatmap",
      title: "flatMap: Meratakan Aliran",
      summary: "Buka setiap baris menjadi kata-kata, lalu satukan semuanya dalam satu aliran datar.",
      steps: [
        {
          kind: "theory",
          title: "Saat satu elemen berisi banyak elemen",
          body: "`map` mengubah satu elemen menjadi satu elemen. Lalu bagaimana kalau satu elemen justru berisi banyak elemen, misalnya satu baris teks berisi beberapa kata, atau satu pesanan berisi beberapa barang? Memetakan dengan `map` menghasilkan stream berisi stream, dan itu tidak nyaman dipakai.\n\n`flatMap` menyelesaikannya: ia mengubah setiap elemen menjadi stream, lalu meratakan semua stream itu menjadi satu aliran datar. Pasangan paling umum di Java adalah `flatMap(b -> Arrays.stream(b.split(\" \")))`: satu baris teks dibelah menjadi kata-kata, dan semua kata dari semua baris mengalir jadi satu.\n\nSetelah diratakan, semua operasi biasa berlaku lagi: `distinct`, `sorted`, `filter`, `collect`. Pola ini sering muncul saat memproses file per baris atau log per baris.",
          code: {
            language: "java",
            content:
              "List<List<Integer>> kelompok = List.of(\n        List.of(1, 2),\n        List.of(3, 4, 5));\n\nint total = kelompok.stream()\n        .flatMap(List::stream)\n        .mapToInt(Integer::intValue)\n        .sum();\n\nSystem.out.println(total); // 15",
            caption: "dua list di dalam list diratakan menjadi satu aliran angka.",
          },
        },
        {
          kind: "code",
          title: "Kosakata unik dari banyak baris",
          prompt:
            "Program membaca n baris, tiap baris berisi beberapa kata dipisah spasi. Lengkapi pipeline supaya mencetak setiap kata yang unik, terurut abjad, satu per baris.",
          mode: "fill",
          template:
            'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        in.nextLine();\n        List<String> baris = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            baris.add(in.nextLine());\n        }\n\n        List<String> unik = baris.stream()\n                .flatMap(b -> Arrays.___(b.split(" ")))\n                .___()\n                .sorted()\n                .collect(Collectors.toList());\n\n        unik.forEach(k -> System.out.println(k));\n    }\n}',
          solution:
            'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        in.nextLine();\n        List<String> baris = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            baris.add(in.nextLine());\n        }\n\n        List<String> unik = baris.stream()\n                .flatMap(b -> Arrays.stream(b.split(" ")))\n                .distinct()\n                .sorted()\n                .collect(Collectors.toList());\n\n        unik.forEach(k -> System.out.println(k));\n    }\n}',
          tests: [
            { stdin: "2\nteh kopi\nkopi susu", expectedOutput: "kopi\nsusu\nteh" },
            { stdin: "3\nmangga jeruk\njeruk apel\npisang mangga", expectedOutput: "apel\njeruk\nmangga\npisang" },
            { stdin: "1\nsatu dua", expectedOutput: "dua\nsatu", hidden: true },
          ],
          hints: [
            "Untuk mengubah array hasil split menjadi stream, gunakan Arrays.stream.",
            "Operasi yang membuang kata yang kembar bernama distinct.",
            "Jawaban: Arrays.stream(b.split(\" \")) untuk blank pertama, distinct() untuk blank kedua.",
          ],
        },
      ],
    },
    {
      slug: "str-intstream",
      title: "IntStream: Stream Primitif",
      summary: "Buat deret angka dengan range dan hitung langsung dengan sum, count, dan average tanpa boxing.",
      steps: [
        {
          kind: "theory",
          title: "Aliran angka tanpa bungkusan objek",
          body: "`Stream<Integer>` menyimpan angka dalam bungkusan objek: setiap elemen melewati proses boxing dan unboxing. Untuk aliran angka yang panjang, itu memboros memori dan waktu. Java menyediakan stream primitif: `IntStream`, `LongStream`, dan `DoubleStream`, yang bekerja langsung di atas tipe primitif.\n\nDua pabrikan yang wajib dikenal: `IntStream.range(a, b)` menghasilkan a sampai b dikurangi satu, sedangkan `IntStream.rangeClosed(a, b)` mengikutkan b. Keduanya menghasilkan deret berurutan yang sering dipakai menggantikan loop penghitung.\n\nStream primitif punya operasi numerik siap pakai tanpa melalui wrapper: `sum()`, `count()`, `average()`, `max()`, dan `min()`. Untuk berpindah dari stream objek ke stream primitif, gunakan `mapToInt`, `mapToLong`, atau `mapToDouble`.",
          code: {
            language: "java",
            content:
              "int jumlah = IntStream.rangeClosed(1, 5).sum(); // 15\nlong banyak = IntStream.range(0, 5).count();    // 5\n\nint totalGenap = IntStream.rangeClosed(1, 10)\n        .filter(a -> a % 2 == 0)\n        .sum(); // 30",
            caption: "operasi numerik langsung di atas primitif, tanpa boxing.",
          },
        },
        {
          kind: "quiz",
          question: "Angka apa saja yang dihasilkan `IntStream.range(1, 5)`?",
          options: ["1, 2, 3, 4, 5", "1, 2, 3, 4", "0, 1, 2, 3, 4", "5, 4, 3, 2, 1"],
          answer: 1,
          explanation:
            "range tidak mengikutkan batas atas: range(1, 5) menghasilkan 1 sampai 4. Kalau batas atas harus ikut, pakai rangeClosed(1, 5).",
        },
        {
          kind: "code",
          title: "Jumlah dan banyak deret",
          prompt:
            "Program membaca dua bilangan `a` dan `b` (a <= b) dalam satu baris. Lengkapi perhitungannya dengan `IntStream`: cetak jumlah seluruh bilangan dari a sampai b, lalu banyak bilangannya.",
          mode: "fill",
          template:
            'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int a = in.nextInt();\n        int b = in.nextInt();\n\n        int jumlah = IntStream.___(a, b).sum();\n        long banyak = IntStream.rangeClosed(a, b).___();\n\n        System.out.println("jumlah: " + jumlah);\n        System.out.println("banyak: " + banyak);\n    }\n}',
          solution:
            'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int a = in.nextInt();\n        int b = in.nextInt();\n\n        int jumlah = IntStream.rangeClosed(a, b).sum();\n        long banyak = IntStream.rangeClosed(a, b).count();\n\n        System.out.println("jumlah: " + jumlah);\n        System.out.println("banyak: " + banyak);\n    }\n}',
          tests: [
            { stdin: "1 5", expectedOutput: "jumlah: 15\nbanyak: 5" },
            { stdin: "3 3", expectedOutput: "jumlah: 3\nbanyak: 1" },
            { stdin: "4 10", expectedOutput: "jumlah: 49\nbanyak: 7", hidden: true },
          ],
          hints: [
            "Pabrikan deret yang mengikutkan kedua ujung bernama rangeClosed.",
            "Operasi yang menghitung banyaknya elemen bernama count, dan hasilnya long.",
            "Jawaban: rangeClosed(a, b) untuk blank pertama, count() untuk blank kedua.",
          ],
        },
      ],
    },
    {
      slug: "str-latihan-transaksi",
      title: "Latihan: Laporan Transaksi",
      summary: "Rangkai semuanya: parsing, mapToInt, groupingBy, dan max menjadi satu laporan utuh.",
      steps: [
        {
          kind: "theory",
          title: "Pipeline untuk laporan sungguhan",
          body: "Sekarang rangkai semuanya menjadi satu program kecil yang wajar di dunia kerja: membaca data mentah, mengubahnya menjadi struktur yang nyaman, lalu menyusun laporan dengan pipeline. Laporan semacam ini biasanya menanyakan total, rata-rata, dan pemilik nilai terbesar.\n\nUrutan kerjanya konsisten. Pertama parsing: setiap baris dibelah dengan `split` dan diubah menjadi objek kecil, misalnya class `Transaksi` dengan field nama dan jumlah. Kedua pengolahan: `mapToInt` untuk total, `groupingBy` dengan `summingInt` untuk rekap per nama. Ketiga penyimpulan: `max` di atas `entrySet` untuk menemukan pemilik pengeluaran terbesar.\n\nSatu catatan gaya: stream dan loop boleh berdampingan. Parsing yang sederhana kadang lebih jelas dengan loop `for`, sementara perhitungan laporan lebih ekspresif sebagai pipeline. Yang penting satu tahap dikerjakan dengan satu cara yang paling mudah dibaca.",
          code: {
            language: "java",
            content:
              "Map<String, Integer> perNama = data.stream().collect(\n        Collectors.groupingBy(t -> t.nama,\n                TreeMap::new,\n                Collectors.summingInt(t -> t.jumlah)));\n\nString terbanyak = perNama.entrySet().stream()\n        .max(Map.Entry.comparingByValue())\n        .get()\n        .getKey();",
            caption: "rekap per nama, lalu cari pemilik nilai terbesar.",
          },
        },
        {
          kind: "code",
          title: "Laporan kasir",
          prompt:
            "Kasir mencatat transaksi dengan format `nama;jumlah` per baris. Lengkapi tiga bagian kosong supaya program mencetak: total seluruh transaksi, rata-rata (bilangan bulat, jumlah selalu habis dibagi n), dan nama dengan total belanja terbesar.",
          mode: "fill",
          template:
            'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    static class Transaksi {\n        String nama;\n        int jumlah;\n\n        Transaksi(String nama, int jumlah) {\n            this.nama = nama;\n            this.jumlah = jumlah;\n        }\n    }\n\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = Integer.parseInt(in.nextLine());\n        List<Transaksi> data = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            String[] bagian = in.nextLine().split(";");\n            data.add(new Transaksi(bagian[0], Integer.parseInt(bagian[1])));\n        }\n\n        int total = data.stream().mapToInt(t -> t.jumlah).___();\n        System.out.println("total: " + total);\n        System.out.println("rata-rata: " + (total / n));\n\n        Map<String, Integer> perNama = data.stream().collect(\n                Collectors.groupingBy(t -> t.nama,\n                        TreeMap::new,\n                        Collectors.___(t -> t.jumlah)));\n\n        String terbanyak = perNama.entrySet().stream()\n                .max(Map.Entry.___())\n                .get()\n                .getKey();\n        System.out.println("pengeluaran terbanyak: " + terbanyak);\n    }\n}',
          solution:
            'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    static class Transaksi {\n        String nama;\n        int jumlah;\n\n        Transaksi(String nama, int jumlah) {\n            this.nama = nama;\n            this.jumlah = jumlah;\n        }\n    }\n\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = Integer.parseInt(in.nextLine());\n        List<Transaksi> data = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            String[] bagian = in.nextLine().split(";");\n            data.add(new Transaksi(bagian[0], Integer.parseInt(bagian[1])));\n        }\n\n        int total = data.stream().mapToInt(t -> t.jumlah).sum();\n        System.out.println("total: " + total);\n        System.out.println("rata-rata: " + (total / n));\n\n        Map<String, Integer> perNama = data.stream().collect(\n                Collectors.groupingBy(t -> t.nama,\n                        TreeMap::new,\n                        Collectors.summingInt(t -> t.jumlah)));\n\n        String terbanyak = perNama.entrySet().stream()\n                .max(Map.Entry.comparingByValue())\n                .get()\n                .getKey();\n        System.out.println("pengeluaran terbanyak: " + terbanyak);\n    }\n}',
          tests: [
            {
              stdin: "5\nandi;15000\nbudi;20000\nandi;5000\ncitra;35000\nbudi;10000",
              expectedOutput: "total: 85000\nrata-rata: 17000\npengeluaran terbanyak: citra",
            },
            {
              stdin: "4\ndewi;9000\neka;14000\ndewi;3000\nfaiz;8000",
              expectedOutput: "total: 34000\nrata-rata: 8500\npengeluaran terbanyak: eka",
            },
            {
              stdin: "4\nsari;7000\nsari;7000\nrudi;12000\nbima;8000",
              expectedOutput: "total: 34000\nrata-rata: 8500\npengeluaran terbanyak: sari",
              hidden: true,
            },
          ],
          hints: [
            "Operasi terminal penjumlahan untuk IntStream bernama sum.",
            "Collector yang menjumlahkan nilai int tiap anggota kelompok bernama summingInt.",
            "Comparator untuk membandingkan nilai (value) sebuah Map.Entry bernama comparingByValue.",
          ],
        },
      ],
    },

    // ==================== MODUL 7: Concurrency Dasar ====================
    {
      slug: "thr-konsep-race",
      title: "Thread dan Race Condition",
      summary: "Kenali thread, mengapa konkurensi menguntungkan, dan bagaimana dua thread bisa saling menimpa hasil.",
      steps: [
        {
          kind: "theory",
          title: "Banyak baris eksekusi dalam satu program",
          body: "Thread adalah baris eksekusi yang punya tumpukan panggilannya sendiri. Setiap program Java mulai dengan satu thread bernama main, dan dari sana kita bisa melahirkan thread lain yang berjalan bersamaan. Di komputer multicore, dua thread benar-benar bisa berjalan pada dua inti sekaligus; di kondisi lain mereka bergantian dipotong-potong oleh penjadwal, dan urutan potongannya tidak pernah kita kendalikan.\n\nKeuntungannya nyata: selagi satu thread menunggu data dari jaringan atau disk, thread lain bisa menghitung. Tapi ada harga yang harus dipahami sejak awal. Dua thread yang membaca dan menulis variabel yang sama bisa saling menimpa hasil. Operasi `counter++` terlihat seperti satu langkah, padahal tiga: baca, tambah, tulis. Kalau dua thread melakukan itu bersamaan, satu penulisan bisa hilang tertimpa.\n\nKejadian ini disebut race condition: kebenaran program bergantung pada urutan kedatangan thread, yang tidak pasti. Ia kejam bagi pemula karena tidak muncul setiap kali dijalankan. Program bisa lulus seratus kali uji, lalu salah sekali di produksi. Seluruh modul ini berisi cara menyusun kode supaya race seperti itu tidak punya celah.",
          code: {
            language: "java",
            content:
              'class Penghitung {\n    int nilai = 0;\n\n    void naik() {\n        nilai++; // baca, tambah, tulis: bukan satu langkah\n    }\n}\n\n// dua thread memanggil naik() 1000 kali masing-masing\n// hasilnya bisa kurang dari 2000, dan berbeda tiap dijalankan',
            caption: "increment yang terlihat atomik ternyata bisa terpotong.",
          },
        },
        {
          kind: "quiz",
          question:
            "Dua thread masing-masing menjalankan `counter++` seribu kali pada variabel yang sama. Hasil akhirnya kadang kurang dari 2000. Apa penyebab utamanya?",
          options: [
            "Garbage collector mengambil sebagian nilai counter",
            "counter++ terdiri dari baca, tambah, tulis yang bisa saling menimpa antar thread",
            "counter otomatis direset setiap seribu operasi",
            "Java membatasi jumlah increment per thread",
          ],
          answer: 1,
          explanation:
            "Increment bukan operasi atomik. Dua thread bisa membaca nilai yang sama, lalu sama-sama menulis hasil tambahannya, sehingga satu penambahan hilang. Itulah race condition.",
        },
      ],
    },
    {
      slug: "thr-thread-dasar-join",
      title: "Thread Dasar dan join",
      summary: "Lahirkan thread dengan start, tunggu hasilnya dengan join, lalu gabungkan hasil secara pasti.",
      steps: [
        {
          kind: "theory",
          title: "start melahirkan, join menyatukan",
          body: "Membuat thread di Java paling ringkas lewat lambda, karena `Runnable` adalah functional interface: `new Thread(() -> kerjakanSesuatu())`. Tapi hati-hati dengan satu jebakan klasik: memanggil `run()` langsung tidak menciptakan konkurensi apa pun, method itu dijalankan di thread pemanggil seperti method biasa. Yang melahirkan thread baru adalah `start()`.\n\nSetelah `start()`, dua thread berjalan dan urutan selesainya tidak dijamin. Di sinilah `join()` berperan: thread pemanggil berhenti sebentar dan menunggu thread yang di-join selesai tuntas. Kalau main memanggil `t1.join()` lalu `t2.join()`, maka setelah baris itu lewat, pekerjaan keduanya dijamin sudah selesai.\n\nAda janji memori yang menyertai `join`: semua tulisan yang thread kerja lakukan sebelum selesai terlihat oleh thread yang menunggunya setelah `join` kembali. Itu sebabnya pola di latihan ini aman: pekerjaan dibagi dua bagian yang tidak saling menyentuh, tiap thread menulis ke slot hasilnya sendiri, dan main menggabungkan hasil hanya setelah keduanya di-join.",
          code: {
            language: "java",
            content:
              'Thread t = new Thread(() -> System.out.println("kerja di thread lain"));\nt.start(); // thread baru lahir\nt.join();  // main menunggu t selesai\nSystem.out.println("baris ini pasti setelah pekerjaan t selesai");',
            caption: "start melahirkan thread, join menunggu dan menyatukan hasil.",
          },
        },
        {
          kind: "code",
          title: "Perbaiki penggabung yang tergesa",
          prompt:
            "Program membagi n angka menjadi dua paruh: thread pertama menjumlah paruh awal, thread kedua paruh akhir. Sayangnya main mencetak sebelum pekerjaan selesai, jadi hasilnya sering nol atau berubah-ubah. Perbaiki satu kesalahannya supaya hasil selalu benar.",
          mode: "fix",
          template:
            'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws InterruptedException {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        int[] angka = new int[n];\n        for (int i = 0; i < n; i++) {\n            angka[i] = in.nextInt();\n        }\n        int tengah = n / 2;\n        int[] hasil = new int[2];\n\n        Thread t1 = new Thread(() -> {\n            for (int i = 0; i < tengah; i++) {\n                hasil[0] += angka[i];\n            }\n        });\n        Thread t2 = new Thread(() -> {\n            for (int i = tengah; i < n; i++) {\n                hasil[1] += angka[i];\n            }\n        });\n        t1.start();\n        t2.start();\n\n        System.out.println("bagian 1: " + hasil[0]);\n        System.out.println("bagian 2: " + hasil[1]);\n        System.out.println("total: " + (hasil[0] + hasil[1]));\n    }\n}',
          solution:
            'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws InterruptedException {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        int[] angka = new int[n];\n        for (int i = 0; i < n; i++) {\n            angka[i] = in.nextInt();\n        }\n        int tengah = n / 2;\n        int[] hasil = new int[2];\n\n        Thread t1 = new Thread(() -> {\n            for (int i = 0; i < tengah; i++) {\n                hasil[0] += angka[i];\n            }\n        });\n        Thread t2 = new Thread(() -> {\n            for (int i = tengah; i < n; i++) {\n                hasil[1] += angka[i];\n            }\n        });\n        t1.start();\n        t2.start();\n        t1.join();\n        t2.join();\n\n        System.out.println("bagian 1: " + hasil[0]);\n        System.out.println("bagian 2: " + hasil[1]);\n        System.out.println("total: " + (hasil[0] + hasil[1]));\n    }\n}',
          tests: [
            { stdin: "4\n1\n2\n3\n4", expectedOutput: "bagian 1: 3\nbagian 2: 7\ntotal: 10" },
            { stdin: "5\n2\n4\n6\n8\n10", expectedOutput: "bagian 1: 6\nbagian 2: 24\ntotal: 30" },
            { stdin: "2\n7\n9", expectedOutput: "bagian 1: 7\nbagian 2: 9\ntotal: 16", hidden: true },
          ],
          hints: [
            "Jalankan programnya beberapa kali: hasilnya berubah-ubah atau nol. Artinya main mencetak sebelum kedua thread selesai.",
            "Setelah start, thread utama harus menunggu pekerjaan tuntas: panggil join pada tiap thread sebelum mencetak.",
            "Tambahkan t1.join(); lalu t2.join(); tepat setelah kedua start, sebelum baris cetak pertama.",
          ],
        },
      ],
    },
    {
      slug: "thr-executor-future",
      title: "ExecutorService dan Future",
      summary: "Serahkan tugas ke thread pool, lalu kumpulkan hasilnya secara terurut lewat Future.get.",
      steps: [
        {
          kind: "theory",
          title: "Pool thread dan tiket hasil",
          body: "Membuat `Thread` baru untuk setiap tugas tidak skalabel: tiap thread mahal di memori, dan membuat-membuangnya terus menyita waktu. Solusinya thread pool: sekumpulan thread yang dipakai ulang. Pintu masuknya `ExecutorService`, dibuat lewat pabrikan seperti `Executors.newFixedThreadPool(2)` untuk dua thread pekerja.\n\nKamu tidak lagi memberi tugas lewat `Runnable` yang tidak mengembalikan apa pun. `submit` menerima `Callable`, versi yang boleh `return` nilai, dan langsung memberi tiket berupa `Future`. Pemanggilan `submit` kembali seketika, sementara tugasnya berjalan di pool.\n\n`Future` mewakili hasil yang belum tentu sudah ada. Memanggil `get()` akan menunggu sampai tugasnya selesai lalu memberikan nilainya. Karena tiap `Future` terikat pada tugasnya masing-masing, kamu bisa mengumpulkan hasil secara terurut: simpan semua `Future`, lalu panggil `get` sesuai urutan yang kamu mau. Terakhir, matikan pool dengan `shutdown()` supaya program bisa berhenti; tanpa itu, thread pool masih setia menunggu tugas baru.",
          code: {
            language: "java",
            content:
              "ExecutorService pool = Executors.newFixedThreadPool(2);\n\nFuture<Integer> f = pool.submit(() -> 40 + 2);\nSystem.out.println(f.get()); // 42, menunggu bila perlu\n\npool.shutdown();",
            caption: "submit mengirim tugas, get mengambil hasilnya.",
          },
        },
        {
          kind: "code",
          title: "Hitung genap dengan dua tugas",
          prompt:
            "Hitung banyak angka genap secara paralel: tugas pertama mengurus paruh awal data, tugas kedua paruh akhir. Lengkapi pembuatan pool, pengambilan hasil, dan pematian pool.",
          mode: "fill",
          template:
            'import java.util.*;\nimport java.util.concurrent.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        int[] angka = new int[n];\n        for (int i = 0; i < n; i++) {\n            angka[i] = in.nextInt();\n        }\n        int tengah = n / 2;\n\n        ExecutorService pool = Executors.___(2);\n        Future<Integer> f1 = pool.submit(() -> {\n            int c = 0;\n            for (int i = 0; i < tengah; i++) {\n                if (angka[i] % 2 == 0) c++;\n            }\n            return c;\n        });\n        Future<Integer> f2 = pool.submit(() -> {\n            int c = 0;\n            for (int i = tengah; i < n; i++) {\n                if (angka[i] % 2 == 0) c++;\n            }\n            return c;\n        });\n\n        int genap1 = f1.___();\n        int genap2 = f2.___();\n        pool.___();\n\n        System.out.println("genap bagian 1: " + genap1);\n        System.out.println("genap bagian 2: " + genap2);\n        System.out.println("total genap: " + (genap1 + genap2));\n    }\n}',
          solution:
            'import java.util.*;\nimport java.util.concurrent.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        int[] angka = new int[n];\n        for (int i = 0; i < n; i++) {\n            angka[i] = in.nextInt();\n        }\n        int tengah = n / 2;\n\n        ExecutorService pool = Executors.newFixedThreadPool(2);\n        Future<Integer> f1 = pool.submit(() -> {\n            int c = 0;\n            for (int i = 0; i < tengah; i++) {\n                if (angka[i] % 2 == 0) c++;\n            }\n            return c;\n        });\n        Future<Integer> f2 = pool.submit(() -> {\n            int c = 0;\n            for (int i = tengah; i < n; i++) {\n                if (angka[i] % 2 == 0) c++;\n            }\n            return c;\n        });\n\n        int genap1 = f1.get();\n        int genap2 = f2.get();\n        pool.shutdown();\n\n        System.out.println("genap bagian 1: " + genap1);\n        System.out.println("genap bagian 2: " + genap2);\n        System.out.println("total genap: " + (genap1 + genap2));\n    }\n}',
          tests: [
            { stdin: "4\n1\n2\n3\n4", expectedOutput: "genap bagian 1: 1\ngenap bagian 2: 1\ntotal genap: 2" },
            { stdin: "6\n10\n3\n8\n7\n6\n5", expectedOutput: "genap bagian 1: 2\ngenap bagian 2: 1\ntotal genap: 3" },
            { stdin: "2\n4\n6", expectedOutput: "genap bagian 1: 1\ngenap bagian 2: 1\ntotal genap: 2", hidden: true },
          ],
          hints: [
            "Pabrikan pool dengan jumlah thread tetap bernama newFixedThreadPool, menerima jumlah thread.",
            "Untuk membaca hasil dari sebuah Future, panggil get; ia menunggu sampai tugasnya selesai.",
            "Jawaban: newFixedThreadPool untuk blank pertama, get untuk dua blank berikutnya, shutdown untuk yang terakhir.",
          ],
        },
      ],
    },
    {
      slug: "thr-synchronized",
      title: "synchronized: Satu Pintu Masuk",
      summary: "Kunci wilayah kritis agar hanya satu thread yang boleh berada di dalam pada satu waktu.",
      steps: [
        {
          kind: "theory",
          title: "Wilayah kritis dengan kunci objek",
          body: "Cara paling langsung mencegah race adalah menjadikan wilayah kritis eksklusif: hanya satu thread yang boleh berada di dalam pada satu waktu. Kata kuncinya `synchronized`. Method instance yang diberi `synchronized` mengunci objek tempat method itu dipanggil: thread lain yang memanggil method synchronized mana pun pada objek yang sama harus menunggu kunci dilepas.\n\nDi balik layar, setiap objek punya satu kunci bawaan (monitor). Itu sebabnya dua method synchronized pada objek yang sama tidak pernah dijalankan bersamaan oleh dua thread, dan itu juga sebabnya dua objek berbeda tidak saling mengganggu: kuncinya beda.\n\nGunakan secara terukur. Wilayah yang dikunci itu antrian: makin panjang bloknya, makin lama thread lain menunggu, dan keuntungan konkurensinya luntur. Kunci hanya bagian yang benar-benar menyentuh data bersama, dan pastikan semua akses ke data itu melewati kunci yang sama. Satu akses yang lolos tanpa kunci sudah cukup untuk membatalkan semuanya.",
          code: {
            language: "java",
            content:
              "class Penghitung {\n    private int nilai = 0;\n\n    synchronized void naik() {    // kunci: objek Penghitung ini\n        nilai++;\n    }\n\n    synchronized int nilai() {    // kunci yang sama\n        return nilai;\n    }\n}",
            caption: "dua method, satu kunci: objek yang sama.",
          },
        },
        {
          kind: "quiz",
          question: "Method instance yang diberi kata kunci `synchronized` mengunci apa saat dipanggil?",
          options: [
            "Thread yang memanggilnya",
            "Class tempat method itu dideklarasikan",
            "Objek (instance) tempat method itu dipanggil",
            "Seluruh heap JVM",
          ],
          answer: 2,
          explanation:
            "Method instance synchronized mengunci monitor milik objek pemanggil (this). Dua thread bisa masuk bersamaan hanya kalau mereka memanggil method pada objek yang berbeda.",
        },
      ],
    },
    {
      slug: "thr-atomic",
      title: "AtomicInteger dan Keluarga Atomic",
      summary: "Perbarui satu variabel bersama tanpa kunci, lewat operasi atomik berbasis compare-and-swap.",
      steps: [
        {
          kind: "theory",
          title: "Kunci tanpa kata kunci",
          body: "Untuk kasus penghitung sederhana, kunci penuh terasa berat. Java menyediakan kelas di paket `java.util.concurrent.atomic`: `AtomicInteger`, `AtomicLong`, `AtomicBoolean`, dan `AtomicReference`. Janjinya: operasi tertentu berjalan atomik tanpa satu pun kata `synchronized`.\n\nRahasianya ada pada instruksi compare-and-swap (CAS) yang didukung prosesor. `incrementAndGet` membaca nilai lama, menghitung nilai baru, lalu menuliskannya hanya jika nilainya masih sama seperti saat dibaca; kalau sempat diubah thread lain, ia mencoba lagi. Bisa saja mencoba beberapa kali, tapi hasilnya selalu benar: tidak ada penambahan yang menguap.\n\nBatasi pemakaiannya pada pekerjaan yang cocok: satu variabel, satu operasi atomik per langkah. Begitu logikamu menyentuh dua variabel yang harus berubah secara konsisten, atau perlunya lebih dari sekadar menambah, kembali ke `synchronized`. Dan untuk penghitung yang diperebutkan sangat banyak thread, `LongAdder` sering lebih cepat karena memecah hitungan ke beberapa sel.",
          code: {
            language: "java",
            content:
              "AtomicInteger counter = new AtomicInteger();\n\ncounter.incrementAndGet();        // +1, atomik\ncounter.addAndGet(5);             // +5, atomik\ncounter.updateAndGet(v -> v * 2); // transformasi bebas, tetap atomik",
            caption: "penghitung aman tanpa satu pun kata synchronized.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa `AtomicInteger.incrementAndGet()` aman dipakai dari banyak thread sekaligus tanpa `synchronized`?",
          options: [
            "Karena dia menyimpan nilai di luar heap",
            "Karena operasinya atomik: dibangun di atas compare-and-swap yang mencoba ulang saat nilainya berubah",
            "Karena dia otomatis membuat thread baru untuk tiap operasi",
            "Karena JVM menjalankan semua operasi AtomicInteger dalam satu antrean global",
          ],
          answer: 1,
          explanation:
            "incrementAndGet memakai CAS: penulisan hanya terjadi bila nilai masih sama seperti yang dibaca; kalau tidak, ia mencoba lagi. Satu operasi tetap utuh meski diperebutkan banyak thread.",
        },
      ],
    },
    {
      slug: "thr-countdownlatch",
      title: "CountDownLatch",
      summary: "Buat thread utama menunggu sejumlah pekerjaan selesai dengan pintu penghitung sekali pakai.",
      steps: [
        {
          kind: "theory",
          title: "Gerbang dengan penghitung",
          body: "Seringkali main tidak hanya perlu menunggu satu thread, tapi menunggu sejumlah pekerjaan selesai sebelum boleh lanjut. `CountDownLatch` adalah alat untuk itu: sebuah pintu dengan penghitung. Pabrikasinya diberi angka awal, misalnya `new CountDownLatch(3)`.\n\nSetiap pekerja yang menuntaskan tugasnya memanggil `countDown()`, menurunkan hitungan satu. Sementara itu thread yang menunggu memanggil `await()` dan tertidur sampai hitungan menyentuh nol. Pintu terbuka sekali untuk semua: semua thread yang menunggu dilepas bersamaan.\n\nIngat sifatnya sekali pakai. Hitungan tidak bisa diisi ulang; kalau kamu butuh gerbang yang dipakai berulang setiap putaran, itu tugas `CyclicBarrier`. Dan pastikan angka awalnya persis jumlah panggilan `countDown` yang dijanjikan: kurang satu panggilan, `await` menunggu selamanya.",
          code: {
            language: "java",
            content:
              'CountDownLatch latch = new CountDownLatch(3);\n\n// di setiap worker, setelah tugas selesai:\nlatch.countDown();\n\n// di thread utama:\nlatch.await(); // tertidur sampai hitungan habis\nSystem.out.println("semua worker selesai");',
            caption: "await terbuka tepat setelah hitungan menyentuh nol.",
          },
        },
        {
          kind: "quiz",
          question: "Thread utama memanggil `latch.await()` ketika hitungan `CountDownLatch` masih 2. Apa yang terjadi?",
          options: [
            "await langsung kembali dan program lanjut",
            "await melempar InterruptedException karena hitungannya belum nol",
            "await memblokir thread sampai hitungan menjadi 0",
            "await otomatis menurunkan hitungan menjadi 0",
          ],
          answer: 2,
          explanation:
            "await() hanya kembali saat hitungan sudah habis. Selama masih di atas nol, thread pemanggil tertidur menunggu panggilan countDown() dari para pekerja.",
        },
      ],
    },
    {
      slug: "thr-concurrent-collection",
      title: "Koleksi Concurrent",
      summary: "Pilih struktur data yang memang dirancang untuk diakses banyak thread, bukan yang sekadar cepat.",
      steps: [
        {
          kind: "theory",
          title: "Struktur yang dibuat untuk rebutan",
          body: "`HashMap` cepat untuk satu thread, tapi retak saat dipakai bersama. Dua thread yang `put` bersamaan bisa saling menimpa, kehilangan entry, atau lebih buruk lagi membuat struktur internalnya tidak konsisten. Solusi paling sering dipakai: `ConcurrentHashMap`, peta yang dirancang untuk akses bersama. Ia memecah datanya sehingga thread yang menulis ke kunci berbeda hampir tidak saling menunggu, dan operasi per kuncinya aman.\n\nTapi hati-hati dengan operasi majemuk. `containsKey(k)` lalu `put(k, v)` adalah dua langkah: di antaranya thread lain bisa menyelipkan. Kelas ini menyediakan versi atomik untuk pola umum: `putIfAbsent`, `compute`, `computeIfAbsent`, dan `merge`. Pakai mereka, jangan susun sendiri pola cek-lalu-isi.\n\nKeluarga concurrent juga punya list dan antrian. `CopyOnWriteArrayList` menyalin isinya setiap kali dimodifikasi, jadi membaca tanpa kunci selalu aman; cocok untuk daftar yang jarang berubah dan sering dibaca. `BlockingQueue` menahan thread pengambil sampai ada data, dan itu pondasi klasik pola produsen-konsumen.",
          code: {
            language: "java",
            content:
              'Map<String, Integer> stok = new ConcurrentHashMap<>();\n\nstok.putIfAbsent("kopi", 10);                    // atomik\nstok.computeIfPresent("kopi", (k, v) -> v - 1);  // atomik\n\n// containsKey lalu put yang disusun sendiri: bukan atomik',
            caption: "pakai operasi gabungan versi peta itu sendiri, bukan dua panggilan terpisah.",
          },
        },
        {
          kind: "quiz",
          question: "Kamu butuh Map yang dibaca dan ditulis beberapa thread sekaligus. Pilihan paling tepat dari daftar ini?",
          options: ["HashMap", "TreeMap", "ConcurrentHashMap", "LinkedList"],
          answer: 2,
          explanation:
            "ConcurrentHashMap dirancang untuk akses bersama: operasi per kunci aman dan penulisan ke kunci berbeda hampir tidak saling menunggu. HashMap dan TreeMap tidak dirancang untuk itu.",
        },
      ],
    },
    {
      slug: "thr-virtual-thread",
      title: "Virtual Thread Java 21",
      summary: "Pahami thread ringan buatan JVM: murah saat menunggu, dan kapan ia menguntungkan.",
      steps: [
        {
          kind: "theory",
          title: "Ribuan thread tanpa ribuan thread OS",
          body: "Thread yang selama ini kita pakai disebut platform thread: satu banding satu dengan thread milik sistem operasi. Setiap eksemplarnya mahal, ingatannya bisa jutaan byte sekadar untuk stack, dan jumlahnya di atas ribuan sudah dianggap banyak. Melayani satu koneksi atau satu request per platform thread cepat habis angkanya.\n\nJava 21 menghadirkan virtual thread: thread yang dijadwalkan JVM sendiri, bukan OS. Stack-nya kecil dan tumbuh sesuai kebutuhan, sehingga bisa dibuat sampai jutaan. Kuncinya di satu titik: kalau virtual thread menunggu (I/O, sleep, lock), JVM memarkir thread itu dan memakai thread pembawanya untuk mengerjakan yang lain. Menunggu jadi murah.\n\nKonsekuensinya: gaya kode thread-per-request yang sederhana kini layak untuk pekerjaan yang banyak menunggu I/O, tanpa harus menulis kode async berlapis. Tapi virtual thread bukan penyihir untuk semua hal: pekerjaan yang murni menghitung di CPU tetap dibatasi jumlah inti prosesor, seberapa pun banyak threadnya. Untuk memulai: `Thread.ofVirtual().start(...)` atau `Executors.newVirtualThreadPerTaskExecutor()`.",
          code: {
            language: "java",
            content:
              "try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {\n    for (int i = 0; i < 10_000; i++) {\n        pool.submit(() -> {\n            Thread.sleep(100); // simulasi menunggu layanan luar\n            return null;\n        });\n    }\n} // pool ditutup dan menunggu semua tugas selesai",
            caption: "sepuluh ribu tugas yang menunggu, tanpa sepuluh ribu thread OS.",
          },
        },
        {
          kind: "quiz",
          question: "Untuk jenis pekerjaan apa virtual thread paling memberi keuntungan?",
          options: [
            "Tugas yang sebagian waktunya habis untuk menunggu I/O atau lock",
            "Perhitungan matematika murni yang memenuhi CPU",
            "Tugas yang butuh ketepatan waktu realtime",
            "Semua jenis tugas tanpa kecuali",
          ],
          answer: 0,
          explanation:
            "Kekuatan virtual thread ada pada saat menunggu: JVM memarkir thread yang menunggu dan mengalihkan thread pembawanya. Perhitungan CPU murni tetap dibatasi jumlah inti.",
        },
      ],
    },
    {
      slug: "thr-worker-pool",
      title: "Worker Pool Deterministik",
      summary: "Bagi pekerjaan ke beberapa worker dengan pola round-robin, lalu kumpulkan hasil per index.",
      steps: [
        {
          kind: "theory",
          title: "Membagi kerja tanpa rebutan",
          body: "Latihan penggabungan modul ini: sebuah worker pool yang membagi pekerjaan ke beberapa thread, dengan keluaran yang tetap sama setiap dijalankan. Determinisme seperti ini bukan kemewahan, melainkan syarat agar program bisa diuji: hasil yang berbeda tiap dijalankan tidak mungkin dinyatakan benar.\n\nStrateginya dua lapis. Pertama, bagi pekerjaan berdasarkan index: worker w mengambil index w, w+M, w+2M, dan seterusnya (pola round-robin). Kedua, larang semua thread menyentuh slot yang sama: setiap worker menulis hasilnya ke index yang hanya miliknya, jadi tidak ada race karena tidak ada data yang diperebutkan.\n\nBarulah penggabungan dilakukan satu tempat, di thread utama, setelah semua tugas selesai. Kumpulkan `Future` dari tiap `submit`, panggil `get` untuk menunggu semuanya, lalu baca array hasil dari depan ke belakang. Urutan cetak ditentukan index, bukan oleh siapa yang selesai lebih dulu.",
          code: {
            language: "java",
            content:
              "// worker w mengerjakan index i yang memenuhi i % jumlahWorker == w\nfor (int i = worker; i < n; i += jumlahWorker) {\n    hasil[i] = angka[i] * angka[i]; // tiap index hanya disentuh satu worker\n}",
            caption: "pembagian round-robin: slot berbeda, tanpa rebutan.",
          },
        },
        {
          kind: "code",
          title: "Kuadrat paralel per index",
          prompt:
            "Bagi n angka ke 3 worker dengan pola round-robin: worker w mengurus index w, w+3, w+6, dan seterusnya, lalu menulis kuadratnya ke slot index yang sama. Lengkapi pengiriman tugas ke pool dan penungguan hasilnya. Program mencetak semua kuadratan berurutan dalam satu baris.",
          mode: "fill",
          template:
            'import java.util.*;\nimport java.util.concurrent.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        int[] angka = new int[n];\n        for (int i = 0; i < n; i++) {\n            angka[i] = in.nextInt();\n        }\n        int[] kuadrat = new int[n];\n        int jumlahWorker = 3;\n\n        ExecutorService pool = Executors.newFixedThreadPool(jumlahWorker);\n        List<Future<?>> tugas = new ArrayList<>();\n        for (int w = 0; w < jumlahWorker; w++) {\n            final int worker = w;\n            tugas.add(pool.___(() -> {\n                for (int i = worker; i < n; i += jumlahWorker) {\n                    kuadrat[i] = angka[i] * angka[i];\n                }\n            }));\n        }\n        for (Future<?> f : tugas) {\n            f.___();\n        }\n        pool.shutdown();\n\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < n; i++) {\n            sb.append(kuadrat[i]);\n            if (i < n - 1) sb.append(" ");\n        }\n        System.out.println(sb);\n    }\n}',
          solution:
            'import java.util.*;\nimport java.util.concurrent.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        int[] angka = new int[n];\n        for (int i = 0; i < n; i++) {\n            angka[i] = in.nextInt();\n        }\n        int[] kuadrat = new int[n];\n        int jumlahWorker = 3;\n\n        ExecutorService pool = Executors.newFixedThreadPool(jumlahWorker);\n        List<Future<?>> tugas = new ArrayList<>();\n        for (int w = 0; w < jumlahWorker; w++) {\n            final int worker = w;\n            tugas.add(pool.submit(() -> {\n                for (int i = worker; i < n; i += jumlahWorker) {\n                    kuadrat[i] = angka[i] * angka[i];\n                }\n            }));\n        }\n        for (Future<?> f : tugas) {\n            f.get();\n        }\n        pool.shutdown();\n\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < n; i++) {\n            sb.append(kuadrat[i]);\n            if (i < n - 1) sb.append(" ");\n        }\n        System.out.println(sb);\n    }\n}',
          tests: [
            { stdin: "5\n1\n2\n3\n4\n5", expectedOutput: "1 4 9 16 25" },
            { stdin: "4\n10\n-2\n3\n7", expectedOutput: "100 4 9 49" },
            { stdin: "3\n6\n0\n-9", expectedOutput: "36 0 81", hidden: true },
          ],
          hints: [
            "Tugas dikirim ke pool lewat submit, dan tiketnya (Future) disimpan ke list tugas.",
            "Supaya main tidak mencetak sebelum semua worker selesai, tiap Future ditunggu lewat get.",
            "Jawaban: pool.submit(...) untuk blank pertama, f.get() untuk blank kedua.",
          ],
        },
      ],
    },
    {
      slug: "thr-latihan-gabungan",
      title: "Latihan: Statistik Paralel",
      summary: "Gabungkan submit, Callable, dan penggabungan manual: dua thread menghitung, main menyimpulkan.",
      steps: [
        {
          kind: "theory",
          title: "Split, compute, merge",
          body: "Tugas penutup modul: statistik paralel yang hasilnya pasti. Kamu sudah punya semua bahannya. Belah data jadi dua paruh, kirim tiap paruh sebagai `Callable` ke pool dua thread, dan biarkan tiap tugas mengembalikan hasil bentukan miliknya sendiri, misalnya array berisi jumlah dan nilai terbesar paruh itu.\n\nBagian yang menentukan kepastian ada di penggabungan. Tidak ada thread kerja yang saling menulis: tiap `Callable` hanya membaca paruhnya dan mengembalikan nilai lewat `return`. Thread utama mengambil kedua hasil dengan `get`, lalu menggabungkannya sendirian: total dari penjumlahan dua sub total, nilai terbesar dari `Math.max` dua sub max. Satu thread, satu urutan, satu keluaran yang selalu sama.\n\nPola split-compute-merge ini adalah bentuk paling sederhana dari pemrosesan paralel data. Kerangka yang sama (dengan pemecahan yang lebih rapi) kamu temukan di `ForkJoin` dan stream paralel. Kuasai versi manualnya, dan mekanisme di balik alat otomatisnya tidak lagi misterius.",
          code: {
            language: "java",
            content:
              "Future<int[]> f = pool.submit(() -> {\n    int sum = 0;\n    int max = Integer.MIN_VALUE;\n    for (int i : paruhKu) {\n        sum += i;\n        if (i > max) max = i;\n    }\n    return new int[] { sum, max };\n});",
            caption: "tiap tugas mengembalikan hasilnya sendiri, tanpa data rebutan.",
          },
        },
        {
          kind: "code",
          title: "Total dan terbesar dari dua thread",
          prompt:
            "Lengkapi program statistik paralel: kirim tugas pertama ke pool dengan submit (tugas keduanya sudah jadi). Tiap tugas mengembalikan array `{jumlah, terbesar}` untuk paruhnya. Setelah kedua hasil diambil lewat get, program mencetak total dan nilai terbesar seluruh data. Dua bagian masih kosong.",
          mode: "fill",
          template:
            'import java.util.*;\nimport java.util.concurrent.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        int[] angka = new int[n];\n        for (int i = 0; i < n; i++) {\n            angka[i] = in.nextInt();\n        }\n        int tengah = n / 2;\n\n        ExecutorService pool = Executors.newFixedThreadPool(2);\n        Future<int[]> f1 = pool.___(() -> {\n            int sum = 0;\n            int max = angka[0];\n            for (int i = 0; i < tengah; i++) {\n                sum += angka[i];\n                if (angka[i] > max) max = angka[i];\n            }\n            return new int[] { sum, max };\n        });\n        Future<int[]> f2 = pool.submit(() -> {\n            int sum = 0;\n            int max = angka[tengah];\n            for (int i = tengah; i < n; i++) {\n                sum += angka[i];\n                if (angka[i] > max) max = angka[i];\n            }\n            return new int[] { sum, max };\n        });\n\n        int[] r1 = f1.get();\n        int[] r2 = f2.get();\n        pool.shutdown();\n\n        int total = r1[0] + ___[0];\n        int terbesar = Math.max(r1[1], ___[1]);\n\n        System.out.println("total: " + total);\n        System.out.println("terbesar: " + terbesar);\n    }\n}',
          solution:
            'import java.util.*;\nimport java.util.concurrent.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt();\n        int[] angka = new int[n];\n        for (int i = 0; i < n; i++) {\n            angka[i] = in.nextInt();\n        }\n        int tengah = n / 2;\n\n        ExecutorService pool = Executors.newFixedThreadPool(2);\n        Future<int[]> f1 = pool.submit(() -> {\n            int sum = 0;\n            int max = angka[0];\n            for (int i = 0; i < tengah; i++) {\n                sum += angka[i];\n                if (angka[i] > max) max = angka[i];\n            }\n            return new int[] { sum, max };\n        });\n        Future<int[]> f2 = pool.submit(() -> {\n            int sum = 0;\n            int max = angka[tengah];\n            for (int i = tengah; i < n; i++) {\n                sum += angka[i];\n                if (angka[i] > max) max = angka[i];\n            }\n            return new int[] { sum, max };\n        });\n\n        int[] r1 = f1.get();\n        int[] r2 = f2.get();\n        pool.shutdown();\n\n        int total = r1[0] + r2[0];\n        int terbesar = Math.max(r1[1], r2[1]);\n\n        System.out.println("total: " + total);\n        System.out.println("terbesar: " + terbesar);\n    }\n}',
          tests: [
            { stdin: "6\n4\n9\n1\n7\n3\n8", expectedOutput: "total: 32\nterbesar: 9" },
            { stdin: "4\n-5\n12\n-20\n30", expectedOutput: "total: 17\nterbesar: 30" },
            { stdin: "2\n100\n-100", expectedOutput: "total: 0\nterbesar: 100", hidden: true },
          ],
          hints: [
            "Tugas pertama dikirim ke pool dengan cara yang sama seperti tugas kedua: pool.submit(...).",
            "Hasil tugas kedua sudah tersimpan di variabel r2. Sub total ada di r2[0], sub max di r2[1].",
            "Jawaban: submit untuk blank pertama, r2 untuk dua blank terakhir.",
          ],
        },
      ],
    },
  ],
};
