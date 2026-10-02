import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "php",
  moduleRange: [2, 3],
  modules: [
    {
      title: "Fungsi dan Scope",
      description: "Default/variadic/nullable param, anonymous function, arrow function, use.",
    },
    {
      title: "OOP Inti",
      description: "Class, visibility, static, constant, constructor property promotion.",
    },
  ],
  lessons: [
    // ==================== MODUL 2: Fungsi dan Scope ====================
    {
      slug: "fn-tipe-deklarasi",
      title: "Tipe Deklarasi pada Fungsi",
      summary: "Tulis fungsi dengan tipe di parameter dan return type, ditegakkan strict_types.",
      steps: [
        {
          kind: "theory",
          title: "Kontrak fungsi yang ditegakkan PHP",
          body: "Fungsi di PHP dideklarasikan dengan kata kunci `function`, diikuti nama, daftar parameter, dan return type setelah tanda `:`. Di jalur dasar kamu mungkin menulis fungsi tanpa tipe. Di level menengah, tipe deklarasi pada parameter dan return type adalah standar: ia mendokumentasikan kontrak fungsi sekaligus memberi PHP alat untuk menegakkannya.\n\nDengan `declare(strict_types=1)` di baris paling atas file, PHP menolak argumen yang tipenya tidak persis cocok. Memanggil fungsi bertipe `int` dengan string `\"5\"` melempar TypeError, bukan diam-diam dikonversi. Tanpa strict types PHP memaklumi perbedaan tipe, dan justru kelenturan itulah sumber bug yang halus.\n\nKonvensi penamaan fungsi mengikuti camelCase: `hargaTotal()`, `cariPengguna()`. Kurung kurawal pembuka ditulis di baris sendiri, dan tubuh fungsi menjorok empat spasi, sesuai gaya PSR-12 yang dipakai kebanyakan proyek PHP modern.",
          code: {
            language: "php",
            content: "<?php\ndeclare(strict_types=1);\n\nfunction potongan(int $harga, int $persen): int\n{\n    return (int) ($harga * $persen / 100);\n}\n\necho potongan(50000, 20); // 10000",
            caption: "Tipe di parameter dan return type membuat salah pakai langsung ketahuan.",
          },
        },
        {
          kind: "quiz",
          question:
            "Dengan `declare(strict_types=1)`, apa yang terjadi jika `function dobel(int $n): int` dipanggil dengan `dobel(\"5\")`?",
          options: [
            "Mengembalikan 10 karena \"5\" dikonversi diam-diam",
            "Mengembalikan 5",
            "TypeError karena tipe argumen tidak cocok",
            "Tidak terjadi apa-apa",
          ],
          answer: 2,
          explanation:
            "Strict types membuat PHP menegakkan tipe secara ketat. String \"5\" bukan int, jadi pemanggilan melempar TypeError sebelum tubuh fungsi dijalankan.",
        },
        {
          kind: "code",
          title: "Fungsi berlabel tipe",
          prompt:
            "Lengkapi dua kekosongan: return type fungsi `beratIdeal`, dan cast agar hasil `trim(fgets(STDIN))` benar-benar `int` sebelum masuk ke parameter bertipe `int`. Input: satu bilangan tinggi badan dalam cm.",
          mode: "fill",
          template:
            "<?php\ndeclare(strict_types=1);\n\nfunction beratIdeal(int $tinggiCm): ___\n{\n    return $tinggiCm - 110;\n}\n\n$tinggi = ___ trim(fgets(STDIN));\necho beratIdeal($tinggi) . \"\\n\";",
          solution:
            "<?php\ndeclare(strict_types=1);\n\nfunction beratIdeal(int $tinggiCm): int\n{\n    return $tinggiCm - 110;\n}\n\n$tinggi = (int) trim(fgets(STDIN));\necho beratIdeal($tinggi) . \"\\n\";",
          tests: [
            { stdin: "170", expectedOutput: "60" },
            { stdin: "155", expectedOutput: "45" },
            { stdin: "200", expectedOutput: "90", hidden: true },
          ],
          hints: [
            "Fungsi ini mengembalikan hasil pengurangan dua int, jadi return type-nya juga int.",
            "fgets mengembalikan string. Untuk memasukkannya ke parameter int di mode strict, cast dengan (int).",
          ],
        },
      ],
    },
    {
      slug: "fn-parameter-default",
      title: "Parameter Default",
      summary: "Beri nilai awal pada parameter supaya pemanggil boleh melewatkannya.",
      steps: [
        {
          kind: "theory",
          title: "Parameter yang boleh dilewati",
          body: "Parameter boleh diberi nilai default dengan tanda `=`. Kalau pemanggil tidak mengirim nilai, default yang dipakai. Ini membuat fungsi nyaman dipakai: kasus umum cukup satu argumen, kasus khusus mengirim sisanya.\n\nAturannya satu: parameter wajib ditulis lebih dulu, parameter berdefault belakangan. `function f(int $a, int $b = 1): void` sah, sedangkan `function f(int $a = 1, int $b): void` membuat PHP error karena tidak ada cara mengisi `$b` tanpa mengisi `$a` juga.\n\nNilai default harus berupa ekspresi tetap: angka, string, atau `null`. Bukan hasil pemanggilan fungsi atau nilai yang baru dihitung saat runtime.",
          code: {
            language: "php",
            content: "<?php\ndeclare(strict_types=1);\n\nfunction hargaTotal(int $harga, int $jumlah = 1): int\n{\n    return $harga * $jumlah;\n}\n\necho hargaTotal(5000) . \"\\n\";    // 5000, jumlah memakai default 1\necho hargaTotal(5000, 3) . \"\\n\";  // 15000",
            caption: "Panggilan kedua menimpa default 1 dengan nilai 3.",
          },
        },
        {
          kind: "quiz",
          question: "Manakah daftar parameter yang SAH di PHP?",
          options: [
            "function f(int $a = 1, int $b): void",
            "function f(int $a, int $b = 1): void",
            "function f(default $a): void",
            "function f(int $a, int $b = 1, int $c): void",
          ],
          answer: 1,
          explanation:
            "Parameter wajib harus mendahului parameter berdefault. Opsi pertama dan keempat menaruh parameter wajib setelah parameter berdefault sehingga PHP menolaknya.",
        },
        {
          kind: "code",
          title: "Sapaan dengan dua gaya",
          prompt:
            "Lengkapi fungsi `sapaDua`: parameter `$sapaan` berdefault string `Kakak`, dan baris return menyisipkan `$sapaan` di depan nama. Program mencetak dua sapaan, satu memakai default, satu dengan `Pak`. Input: satu baris nama.",
          mode: "fill",
          template:
            "<?php\ndeclare(strict_types=1);\n\nfunction sapaDua(string $nama, string $sapaan = ___): string\n{\n    return \"Halo, ___ $nama!\";\n}\n\n$nama = trim(fgets(STDIN));\necho sapaDua($nama) . \"\\n\";\necho sapaDua($nama, \"Pak\") . \"\\n\";",
          solution:
            "<?php\ndeclare(strict_types=1);\n\nfunction sapaDua(string $nama, string $sapaan = \"Kakak\"): string\n{\n    return \"Halo, $sapaan $nama!\";\n}\n\n$nama = trim(fgets(STDIN));\necho sapaDua($nama) . \"\\n\";\necho sapaDua($nama, \"Pak\") . \"\\n\";",
          tests: [
            { stdin: "Budi", expectedOutput: "Halo, Kakak Budi!\nHalo, Pak Budi!" },
            { stdin: "Sinta", expectedOutput: "Halo, Kakak Sinta!\nHalo, Pak Sinta!" },
            { stdin: "Rina", expectedOutput: "Halo, Kakak Rina!\nHalo, Pak Rina!", hidden: true },
          ],
          hints: [
            "Nilai default adalah string biasa, jadi diapit tanda kutip.",
            "Di dalam string petik dua, tulis nama variabelnya langsung: $sapaan akan diganti isinya.",
          ],
        },
      ],
    },
    {
      slug: "fn-nullable-type",
      title: "Nullable Type ?string",
      summary: "Izinkan null lewat tipe nullable, lalu periksa null sebelum dipakai.",
      steps: [
        {
          kind: "theory",
          title: "Tipe dengan ruang untuk null",
          body: "Tanda `?` di depan tipe berarti nilainya boleh null. Parameter `?string $nama` menerima string atau null, dan return type `?int` berarti fungsi boleh mengembalikan int atau null. Tanpa tanda itu, mengembalikan null dari fungsi bertipe `int` adalah TypeError.\n\nPola yang paling sering muncul: fungsi pencarian. Kalau data ditemukan, kembalikan nilainya; kalau tidak, kembalikan null. Pemanggil wajib memeriksa hasilnya dengan `=== null` sebelum dipakai, karena melanjutkan kerja dengan null hampir selalu berujung error.\n\nSejak PHP 8 ada juga tipe gabungan seperti `int|string` yang ditulis dengan tanda `|`. Bentuk `?string` tetap dipakai luas karena singkat dan maknanya jelas: satu tipe, plus izin null.",
          code: {
            language: "php",
            content: "<?php\ndeclare(strict_types=1);\n\nfunction cariIndeks(array $data, string $cari): ?int\n{\n    foreach ($data as $i => $nilai) {\n        if ($nilai === $cari) {\n            return $i;\n        }\n    }\n    return null; // tidak ketemu\n}\n\nvar_dump(cariIndeks([\"merah\", \"biru\"], \"biru\")); // int(1)\nvar_dump(cariIndeks([\"merah\"], \"hijau\"));        // NULL",
            caption: "Return type ?int mencakup dua kemungkinan hasil: indeks, atau null.",
          },
        },
        {
          kind: "quiz",
          question: "Apa arti return type `?float` pada sebuah fungsi?",
          options: [
            "float yang dibulatkan",
            "Bisa mengembalikan float atau null",
            "float yang wajib lebih dari nol",
            "float atau string",
          ],
          answer: 1,
          explanation:
            "Tanda ? menambahkan null sebagai nilai balik yang sah. Jadi fungsi itu boleh mengembalikan float, atau null saat tidak ada hasil.",
        },
        {
          kind: "code",
          title: "Ambil inisial atau null",
          prompt:
            "Lengkapi tiga kekosongan pada fungsi `inisial`: tipe parameter yang menerima string atau null, return type yang sama, dan nilai yang dikembalikan saat nama kosong. Input: satu baris nama, bisa juga baris kosong.",
          mode: "fill",
          template:
            "<?php\ndeclare(strict_types=1);\n\nfunction inisial(___ $nama): ___\n{\n    if ($nama === null || $nama === \"\") {\n        return ___;\n    }\n    return $nama[0] . \".\";\n}\n\n$baris = fgets(STDIN);\n$nama = $baris === false ? null : trim($baris);\nif ($nama === \"\") {\n    $nama = null;\n}\n\n$hasil = inisial($nama);\nif ($hasil === null) {\n    echo \"(tanpa inisial)\\n\";\n} else {\n    echo $hasil . \"\\n\";\n}",
          solution:
            "<?php\ndeclare(strict_types=1);\n\nfunction inisial(?string $nama): ?string\n{\n    if ($nama === null || $nama === \"\") {\n        return null;\n    }\n    return $nama[0] . \".\";\n}\n\n$baris = fgets(STDIN);\n$nama = $baris === false ? null : trim($baris);\nif ($nama === \"\") {\n    $nama = null;\n}\n\n$hasil = inisial($nama);\nif ($hasil === null) {\n    echo \"(tanpa inisial)\\n\";\n} else {\n    echo $hasil . \"\\n\";\n}",
          tests: [
            { stdin: "Rani", expectedOutput: "R." },
            { stdin: "\n", expectedOutput: "(tanpa inisial)" },
            { stdin: "Zaki", expectedOutput: "Z.", hidden: true },
          ],
          hints: [
            "Tanda tanya di depan tipe adalah cara PHP menulis nullable.",
            "Parameter dan return type-nya sama: keduanya string yang boleh null.",
            "Saat nama kosong, fungsi mengembalikan null, bukan string.",
          ],
        },
      ],
    },
    {
      slug: "fn-variadic",
      title: "Parameter Variadic ...$args",
      summary: "Terima jumlah argumen bebas dengan ..., dan kirim array lewat spread.",
      steps: [
        {
          kind: "theory",
          title: "Jumlah argumen yang bebas",
          body: "Menaruh `...` sebelum parameter terakhir membuat fungsi menerima argumen sebanyak apa pun. Semua nilai tambahan dikumpulkan menjadi satu array: di `function total(int ...$angka): int`, variabel `$angka` adalah array of int. Tipe di depan `...` berlaku untuk setiap elemennya, jadi argumen salah tipe tetap ditolak.\n\n`...` juga bekerja sebaliknya saat memanggil. Menulis `total(...$daftar)` membongkar isi array `$daftar` menjadi argumen satu per satu. Pasangan ini sering dipakai bersama: kumpulkan data ke array, lalu teruskan ke fungsi variadic.\n\nDi dalam tubuh fungsi, perlakukan parameter variadic seperti array biasa: `count()`, `array_sum()`, atau `foreach` semua sah. Ingat saja bisa saja kosong, jadi fungsi seperti `max()` yang menolak array kosong perlu dijaga.",
          code: {
            language: "php",
            content: "<?php\ndeclare(strict_types=1);\n\nfunction nilaiMaksimum(int ...$angka): int\n{\n    return max($angka);\n}\n\necho nilaiMaksimum(3, 9, 4); // 9\n\n$daftar = [12, 5, 30];\necho nilaiMaksimum(...$daftar); // 30, array dibongkar jadi argumen",
            caption: "Sisi definisi mengumpulkan, sisi pemanggilan membongkar.",
          },
        },
        {
          kind: "quiz",
          question: "Di dalam `function total(int ...$angka): int`, variabel `$angka` bertipe?",
          options: ["int tunggal", "Array berisi int", "Iterable tanpa tipe", "Mixed"],
          answer: 1,
          explanation:
            "Parameter variadic mengumpulkan seluruh argumen tambahan menjadi satu array. Karena ditulis int ...$angka, setiap elemennya wajib int.",
        },
        {
          kind: "code",
          title: "Total penjualan bebas banyak item",
          prompt:
            "Lengkapi dua kekosongan: deklarasi variadic di fungsi `total`, dan operator spread saat memanggilnya dengan array `$daftar`. Input: baris pertama banyaknya angka, lalu satu angka per baris.",
          mode: "fill",
          template:
            "<?php\ndeclare(strict_types=1);\n\nfunction total(int ___): int\n{\n    return array_sum($angka);\n}\n\n$n = (int) trim(fgets(STDIN));\n$daftar = [];\nfor ($i = 0; $i < $n; $i++) {\n    $daftar[] = (int) trim(fgets(STDIN));\n}\n\necho total(___ $daftar) . \"\\n\";",
          solution:
            "<?php\ndeclare(strict_types=1);\n\nfunction total(int ...$angka): int\n{\n    return array_sum($angka);\n}\n\n$n = (int) trim(fgets(STDIN));\n$daftar = [];\nfor ($i = 0; $i < $n; $i++) {\n    $daftar[] = (int) trim(fgets(STDIN));\n}\n\necho total(...$daftar) . \"\\n\";",
          tests: [
            { stdin: "3\n4\n10\n7", expectedOutput: "21" },
            { stdin: "1\n100", expectedOutput: "100" },
            { stdin: "5\n1\n2\n3\n4\n5", expectedOutput: "15", hidden: true },
          ],
          hints: [
            "Di sisi definisi, tiga titik ditulis sebelum nama parameter variadic.",
            "Di sisi pemanggilan, tiga titik ditulis sebelum nama array agar isinya dibongkar jadi argumen.",
          ],
        },
      ],
    },
    {
      slug: "fn-anonymous-function",
      title: "Anonymous Function",
      summary: "Simpan fungsi tanpa nama di variabel, lalu panggil lewat variabelnya.",
      steps: [
        {
          kind: "theory",
          title: "Fungsi sebagai nilai",
          body: "PHP mengizinkan fungsi tanpa nama, disebut anonymous function atau closure. Ia adalah nilai seperti angka dan string: bisa disimpan di variabel, dimasukkan ke array, atau dikirim sebagai argumen ke fungsi lain. Karena tanpa nama, pemanggilannya lewat variabel yang menampungnya.\n\nPerhatikan satu detail sintaks: setelah kurung kurawal penutup closure yang di-assign ke variabel, wajib ada titik koma, karena pernyataan itu adalah assignment biasa. Lupa titik koma adalah salah ketik paling sering saat baru mengenal closure.\n\nPenggunaan nyata paling sering terasa di `array_map`, `array_filter`, dan `usort`: kamu mengirim logika kecil sekali pakai tanpa mencemari namespace dengan nama fungsi yang cuma dipakai sekali.",
          code: {
            language: "php",
            content: "<?php\ndeclare(strict_types=1);\n\n$formatRupiah = function (int $angka): string {\n    return \"Rp\" . number_format($angka, 0, '', '.');\n};\n\necho $formatRupiah(1500000); // Rp1.500.000\n\n$daftar = [30000, 120000];\n$hasil = array_map($formatRupiah, $daftar);\nprint_r($hasil); // [0 => Rp30.000, 1 => Rp120.000]",
            caption: "Closure disimpan di variabel, lalu dipakai dua cara: langsung dan lewat array_map.",
          },
        },
        {
          kind: "quiz",
          question: "Bagaimana memanggil anonymous function yang disimpan di variabel `$f`?",
          options: ["$f();", "call $f;", "function $f();", "$f->run();"],
          answer: 0,
          explanation:
            "Variabel yang menampung closure dipanggil seperti fungsi biasa: $f() dengan argumen di dalam kurung.",
        },
        {
          kind: "code",
          title: "Kalkulator dua operasi",
          prompt:
            "Lengkapi tubuh operasi `kali` dan nama kunci array yang dicari dari input. Program membaca dua angka lalu nama operasi (`tambah` atau `kali`), memilih closure dari array `$operasi`, dan mencetak hasilnya.",
          mode: "fill",
          template:
            "<?php\ndeclare(strict_types=1);\n\n$operasi = [\n    \"tambah\" => function (int $a, int $b): int {\n        return $a + $b;\n    },\n    \"kali\" => function (int $a, int $b): int {\n        return ___;\n    },\n];\n\n$a = (int) trim(fgets(STDIN));\n$b = (int) trim(fgets(STDIN));\n$nama = trim(fgets(STDIN));\n\n$f = $operasi[___];\necho $f($a, $b) . \"\\n\";",
          solution:
            "<?php\ndeclare(strict_types=1);\n\n$operasi = [\n    \"tambah\" => function (int $a, int $b): int {\n        return $a + $b;\n    },\n    \"kali\" => function (int $a, int $b): int {\n        return $a * $b;\n    },\n];\n\n$a = (int) trim(fgets(STDIN));\n$b = (int) trim(fgets(STDIN));\n$nama = trim(fgets(STDIN));\n\n$f = $operasi[$nama];\necho $f($a, $b) . \"\\n\";",
          tests: [
            { stdin: "7\n5\ntambah", expectedOutput: "12" },
            { stdin: "7\n5\nkali", expectedOutput: "35" },
            { stdin: "12\n4\nkali", expectedOutput: "48", hidden: true },
          ],
          hints: [
            "Operasi kali mengembalikan hasil perkalian kedua parameternya.",
            "Kunci array yang dipakai adalah nama operasi yang dibaca dari input.",
          ],
        },
      ],
    },
    {
      slug: "fn-arrow-function",
      title: "Arrow Function fn",
      summary: "Tulis closure satu ekspresi dengan fn, tanpa use dan tanpa return.",
      steps: [
        {
          kind: "theory",
          title: "Closure ringkas satu baris",
          body: "Arrow function adalah bentuk singkat closure yang tubuhnya satu ekspresi. `fn(int $n): int => $n * 2` setara dengan closure yang mengembalikan `$n * 2`. Tidak ada kurung kurawal, tidak ada `return`: nilai ekspresi otomatis menjadi nilai balik, dan di akhir baris tetap butuh titik koma.\n\nKeunggulan terbesarnya di scope: variabel luar otomatis tertangkap by value. Bandingkan dengan closure biasa yang harus menuliskannya satu per satu di `use (...)`. Untuk callback pendek di `array_map` atau `array_filter`, arrow function membuat kode jauh lebih bersih.\n\nBatasnya satu: hanya satu ekspresi. Begitu logika butuh percabangan atau beberapa langkah, kembali ke closure biasa. Pemilihan keduanya bukan soal selera, tapi panjang logika yang ditulis.",
          code: {
            language: "php",
            content: "<?php\ndeclare(strict_types=1);\n\n$pajak = 11;\n$hargaAkhir = fn(int $harga): int => $harga + (int) ($harga * $pajak / 100);\n\necho $hargaAkhir(20000); // 22200, $pajak otomatis tertangkap",
            caption: "Variabel $pajak dipakai langsung tanpa use, karena arrow function menangkap scope luar.",
          },
        },
        {
          kind: "quiz",
          question: "Bagaimana arrow function mengakses variabel di luar tubuhnya?",
          options: [
            "Harus menuliskannya di dalam use (...)",
            "Otomatis tertangkap dari scope luar, by value",
            "Tidak bisa mengakses variabel luar sama sekali",
            "Hanya lewat kata kunci global",
          ],
          answer: 1,
          explanation:
            "Arrow function menangkap variabel luar secara otomatis dan by value. Closure biasa justru yang wajib menyebutnya di use (...).",
        },
        {
          kind: "code",
          title: "Saring nilai di atas batas",
          prompt:
            "Lengkapi arrow function `$lolos`: kata kuncinya, dan perbandingan yang benar agar nilai `>= $batas` yang lolos. Input: batas, banyaknya nilai, lalu nilai-nilainya. Keluaran: nilai yang lolos, dipisah koma.",
          mode: "fill",
          template:
            "<?php\ndeclare(strict_types=1);\n\n$batas = (int) trim(fgets(STDIN));\n$n = (int) trim(fgets(STDIN));\n\n$nilai = [];\nfor ($i = 0; $i < $n; $i++) {\n    $nilai[] = (int) trim(fgets(STDIN));\n}\n\n$lolos = ___(int $x): bool => $x ___ $batas;\n$terpilih = array_filter($nilai, $lolos);\n\necho implode(\",\", $terpilih) . \"\\n\";",
          solution:
            "<?php\ndeclare(strict_types=1);\n\n$batas = (int) trim(fgets(STDIN));\n$n = (int) trim(fgets(STDIN));\n\n$nilai = [];\nfor ($i = 0; $i < $n; $i++) {\n    $nilai[] = (int) trim(fgets(STDIN));\n}\n\n$lolos = fn(int $x): bool => $x >= $batas;\n$terpilih = array_filter($nilai, $lolos);\n\necho implode(\",\", $terpilih) . \"\\n\";",
          tests: [
            { stdin: "70\n5\n60\n70\n85\n90\n55", expectedOutput: "70,85,90" },
            { stdin: "80\n4\n100\n79\n80\n95", expectedOutput: "100,80,95" },
            { stdin: "50\n3\n50\n51\n49", expectedOutput: "50,51", hidden: true },
          ],
          hints: [
            "Kata kunci arrow function hanya dua huruf, ditulis sebelum daftar parameter.",
            "Nilai yang lolos adalah yang sama dengan batas atau lebih besar.",
          ],
        },
      ],
    },
    {
      slug: "fn-use-scope",
      title: "use dan Scope Closure",
      summary: "Closure tidak mewarisi scope: bawa variabel masuk lewat use, by value atau by reference.",
      steps: [
        {
          kind: "theory",
          title: "Membawa variabel masuk pagar",
          body: "Berbeda dari arrow function, closure biasa tidak melihat variabel luar sama sekali. Variabel di dalam closure adalah dunianya sendiri. Untuk memakai nilai luar, sebutkan eksplisit di klausa `use`: `function (int $harga) use ($pajak): int`. Tanpa itu, `$pajak` tidak dikenal di dalam tubuh closure.\n\nNilai yang dibawa `use` disalin saat closure didefinisikan, bukan saat dipanggil. Mengubah `$pajak` setelah closure dibuat tidak mengubah salinan di dalamnya. Ini penting diingat saat membaca kode: closure adalah snapshot, bukan jendela hidup ke variabel aslinya.\n\nKalau kamu memang butuh closure dan variabel luar saling terhubung, tambahkan `&`: `use (&$jumlah)`. Pola ini muncul pada penghitung yang dinaikkan dari dalam closure. Dan untuk kebanyakan kasus callback pendek, arrow function lebih pas karena menangkap scope otomatis by value.",
          code: {
            language: "php",
            content: "<?php\ndeclare(strict_types=1);\n\n$pajak = 11;\n\n$hitung = function (int $harga) use ($pajak): int {\n    return $harga + (int) ($harga * $pajak / 100);\n};\n\n$pajak = 50; // tidak berpengaruh: salinannya sudah dibuat\necho $hitung(20000); // 22200",
            caption: "use menyalin nilai saat definisi, jadi perubahan belakangan tidak ikut.",
          },
        },
        {
          kind: "quiz",
          question: "Apa keluaran kode berikut?\n\n```php\n$bunga = 10;\n$hitung = function (int $pokok) use ($bunga): int {\n    return $pokok + $pokok * $bunga / 100;\n};\n$bunga = 50;\necho $hitung(100);\n```",
          options: ["110", "150", "60", "Error: $bunga tidak dikenal"],
          answer: 0,
          explanation:
            "use ($bunga) menyalin nilai 10 saat closure didefinisikan. Perubahan $bunga menjadi 50 terjadi setelahnya, jadi tidak memengaruhi closure. Hasilnya 100 + 10 = 110.",
        },
      ],
    },
    {
      slug: "fn-referensi-parameter",
      title: "Pass by Reference pada Parameter",
      summary: "Ubah variabel pemanggil lewat parameter &, dan kenali fungsi bawaan yang memakainya.",
      steps: [
        {
          kind: "theory",
          title: "Tanda & yang mengubah kepemilikan",
          body: "Secara default PHP mengirim salinan nilai ke dalam fungsi: mengubah parameter hanya mengubah salinannya, dan variabel pemanggil tetap utuh. Menaruh `&` di depan parameter membalik keadaannya. `function setor(int &$saldo, int $nominal): void` menerima variabel asli, sehingga `$saldo += $nominal` benar-benar mengubah saldo milik pemanggil.\n\nTanda `&` cukup di deklarasi; pemanggilannya tetap `setor($saldo, 20000)` tanpa ampersand. Konsekuensinya serius: fungsi jadi punya efek samping yang tidak terlihat dari pemanggilannya, karena variabel bisa berubah tanpa diberi tahu. Karena itu gunakan hanya jika mengubah variabel pemanggil memang tujuan utamanya, dan sebutkan jelas di nama atau dokumentasinya.\n\nKamu sudah memakai perilaku ini tanpa sadar: `sort($daftar)` mengurutkan array langsung lewat parameter referensi, dan `str_replace()` punya parameter keempat opsional `&$count` untuk melaporkan berapa kali penggantian terjadi. Argumen literal seperti `tukar(1, 2)` ke parameter referensi adalah error, karena angka tidak punya alamat variabel untuk diubah.",
          code: {
            language: "php",
            content: "<?php\ndeclare(strict_types=1);\n\nfunction tukar(&$a, &$b): void\n{\n    [$a, $b] = [$b, $a];\n}\n\n$x = 1;\n$y = 2;\ntukar($x, $y);\necho $x . \" \" . $y; // 2 1, nilai pemanggil ikut tertukar",
            caption: "Parameter referensi menukar isi variabel asli, bukan salinannya.",
          },
        },
        {
          kind: "quiz",
          question: "Apa isi `$saldo` setelah kode berikut?\n\n```php\nfunction setor(int &$saldo, int $nominal): void\n{\n    $saldo += $nominal;\n}\n\n$saldo = 50000;\nsetor($saldo, 20000);\necho $saldo;\n```",
          options: ["50000", "70000", "20000", "Error: parameter tidak bisa diubah"],
          answer: 1,
          explanation:
            "Parameter &$saldo adalah referensi ke variabel asli, jadi penambahan di dalam fungsi tetap menempel. Saldo akhirnya 70000.",
        },
      ],
    },
    {
      slug: "fn-rekursif",
      title: "Fungsi Rekursif",
      summary: "Panggil fungsi dari tubuhnya sendiri dengan base case yang jelas.",
      steps: [
        {
          kind: "theory",
          title: "Fungsi yang memanggil dirinya",
          body: "Fungsi rekursif memanggil dirinya sendiri untuk menyelesaikan versi masalah yang lebih kecil. Faktorial adalah contoh klasik: `faktorial(5)` sama dengan `5 * faktorial(4)`, dan begitu terus sampai kasus terkecil.\n\nDua hal wajib ada. Base case: kondisi yang menghentikan pemanggilan ulang, misalnya `$n <= 1` mengembalikan 1. Dan kemajuan: setiap pemanggilan ulang harus mendekati base case, biasanya `$n - 1`. Tanpa base case, pemanggilan menumpuk sampai PHP berhenti dengan error kedalaman panggilan melebihi batas.\n\nSetiap panggilan menyimpan statusnya sendiri di stack, jadi rekursi terasa elegan untuk struktur berlapis seperti folder dan pohon. Untuk hitungan lurus seperti faktorial, loop biasa justru lebih murah dan aman. Pilih rekursi karena bentuk masalahnya rekursif, bukan karena terlihat pintar.",
          code: {
            language: "php",
            content: "<?php\ndeclare(strict_types=1);\n\nfunction hitungMundur(int $n): void\n{\n    if ($n === 0) {\n        echo \"Selesai\";\n        return; // base case: berhenti di sini\n    }\n    echo $n . \" \";\n    hitungMundur($n - 1); // maju menuju base case\n}\n\nhitungMundur(3); // 3 2 1 Selesai",
            caption: "Setiap pemanggilan mengecilkan n sampai menyentuh base case.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi jika fungsi rekursif tidak punya base case?",
          options: [
            "Mengembalikan null setelah selesai",
            "Error karena kedalaman pemanggilan melebihi batas",
            "Berhenti sendiri setelah satu kali memanggil diri",
            "Base case opsional, tidak berpengaruh",
          ],
          answer: 1,
          explanation:
            "Tanpa penghenti, fungsi terus memanggil dirinya dan setiap panggilan menumpuk di stack sampai PHP melempar error batas kedalaman rekursi.",
        },
        {
          kind: "code",
          title: "Perbaiki faktorial yang selalu nol",
          prompt:
            "Fungsi `faktorial` ini sudah rekursif, tapi hasilnya selalu 0 untuk input lebih dari 1. Ada SATU kesalahan di base case-nya. Perbaiki sampai semua tes lulus. Input: satu bilangan bulat positif.",
          mode: "fix",
          template:
            "<?php\ndeclare(strict_types=1);\n\nfunction faktorial(int $n): int\n{\n    if ($n <= 1) {\n        return 0;\n    }\n    return $n * faktorial($n - 1);\n}\n\n$n = (int) trim(fgets(STDIN));\necho faktorial($n) . \"\\n\";",
          solution:
            "<?php\ndeclare(strict_types=1);\n\nfunction faktorial(int $n): int\n{\n    if ($n <= 1) {\n        return 1;\n    }\n    return $n * faktorial($n - 1);\n}\n\n$n = (int) trim(fgets(STDIN));\necho faktorial($n) . \"\\n\";",
          tests: [
            { stdin: "5", expectedOutput: "120" },
            { stdin: "1", expectedOutput: "1" },
            { stdin: "7", expectedOutput: "5040", hidden: true },
          ],
          hints: [
            "Coba jalankan dengan input 1. Definisi matematisnya: 1! = 1.",
            "Base case adalah elemen netral perkalian, karena semua hasil dikalikan dengannya.",
            "Ubah return 0 pada base case menjadi return 1.",
          ],
        },
      ],
    },
    {
      slug: "fn-latihan-gabungan",
      title: "Latihan Gabungan: Statistik Nilai",
      summary: "Rangkai variadic, arrow function, dan spread dalam satu program statistik.",
      steps: [
        {
          kind: "theory",
          title: "Semua konsep modul ini dalam satu program",
          body: "Program statistik kecil berikut merangkai hampir semua yang kamu pelajari di modul ini. Fungsi `total` bertipe lengkap dengan parameter variadic. Arrow function `$rataDari` memakai variadic juga, karena arrow function boleh punya parameter apa pun, dan mengembalikan float dari satu ekspresi.\n\nPerhatikan pola pengirimannya: data dibaca ke array `$daftar`, lalu masuk ke fungsi variadic lewat spread `total(...$daftar)`. Format rata-rata memakai `number_format` dengan pemisah kustom `.` dan `\"\"` supaya keluaran tidak memakai koma ribuan bawaan.\n\nPola ini layak dihafal: kumpulkan data ke array, olah dengan fungsi kecil yang jelas kontraknya, lalu format di lapisan paling luar. Fungsi menghitung, program utama mengatur input dan keluaran.",
          code: {
            language: "php",
            content: "// Bentuk akhir program yang akan kamu lengkapi:\n// total: 340\n// rata: 85.00\n\nfunction total(int ...$angka): int\n{\n    return array_sum($angka);\n}\n\n$rataDari = fn(int ...$angka): float => array_sum($angka) / count($angka);",
            caption: "Dua fungsi kecil, dua kontrak tipe, nol kejutan.",
          },
        },
        {
          kind: "quiz",
          question: "Pada `$rataDari = fn(int ...$angka): float => array_sum($angka) / count($angka);`, mengapa return type boleh `float` padahal kedua fungsi mengembalikan int?",
          options: [
            "Karena float adalah nama lain dari int di PHP",
            "Karena operator / selalu menghasilkan float di PHP",
            "Karena arrow function mengubah tipe otomatis",
            "Sebenarnya tidak sah, harus di-cast dulu",
          ],
          answer: 1,
          explanation:
            "Di PHP, pembagian selalu menghasilkan float, bahkan 10 / 2. Jadi return type float adalah janji yang tepat untuk hasil pembagian.",
        },
        {
          kind: "code",
          title: "Program statistik nilai",
          prompt:
            "Lengkapi tiga kekosongan: parameter variadic di `total`, kata kunci arrow function, dan spread saat memanggil `total`. Input: banyaknya nilai, lalu nilai-nilainya. Keluaran dua baris: total dan rata-rata dua desimal.",
          mode: "fill",
          template:
            "<?php\ndeclare(strict_types=1);\n\nfunction total(int ___): int\n{\n    return array_sum($angka);\n}\n\n$rataDari = ___(int ...$angka): float => array_sum($angka) / count($angka);\n\n$n = (int) trim(fgets(STDIN));\n$daftar = [];\nfor ($i = 0; $i < $n; $i++) {\n    $daftar[] = (int) trim(fgets(STDIN));\n}\n\necho \"total: \" . total(___ $daftar) . \"\\n\";\necho \"rata: \" . number_format($rataDari(...$daftar), 2, '.', '') . \"\\n\";",
          solution:
            "<?php\ndeclare(strict_types=1);\n\nfunction total(int ...$angka): int\n{\n    return array_sum($angka);\n}\n\n$rataDari = fn(int ...$angka): float => array_sum($angka) / count($angka);\n\n$n = (int) trim(fgets(STDIN));\n$daftar = [];\nfor ($i = 0; $i < $n; $i++) {\n    $daftar[] = (int) trim(fgets(STDIN));\n}\n\necho \"total: \" . total(...$daftar) . \"\\n\";\necho \"rata: \" . number_format($rataDari(...$daftar), 2, '.', '') . \"\\n\";",
          tests: [
            { stdin: "4\n70\n80\n90\n100", expectedOutput: "total: 340\nrata: 85.00" },
            { stdin: "3\n10\n20\n30", expectedOutput: "total: 60\nrata: 20.00" },
            { stdin: "2\n5\n4", expectedOutput: "total: 9\nrata: 4.50", hidden: true },
          ],
          hints: [
            "Parameter variadic dan spread keduanya ditulis dengan tiga titik.",
            "Arrow function dimulai dengan dua huruf: fn.",
            "Kekosongan pertama menjadi ...$angka dan kekosongan ketiga menjadi ....",
          ],
        },
      ],
    },
    // ==================== MODUL 3: OOP Inti ====================
    {
      slug: "oop-class-dasar",
      title: "Class dan Object Dasar",
      summary: "Definisikan class sebagai cetakan, buat object dengan new, akses lewat ->.",
      steps: [
        {
          kind: "theory",
          title: "Cetakan dan hasil cetakannya",
          body: "Class adalah cetakan yang menjelaskan data dan perilaku satu jenis benda. Object adalah hasil cetakannya, dibuat dengan `new`. Satu class bisa dicetak berkali-kali, dan setiap object punya salinan property sendiri: mengubah `$bukuA->harga` tidak menggeser `$bukuB->harga`.\n\nProperty dideklarasikan dengan visibility dan tipe, misalnya `public string $judul = \"\"`. PHP menyebut ini typed property: tipe dijaga pada setiap assignment, bukan cuma di awal. Memberi nilai default di deklarasi membuat object baru langsung konsisten tanpa harus lewat constructor dulu.\n\nAkses anggota object memakai panah `->`, bukan titik. `$buku->judul` membaca property; `$buku->judul = \"X\"` menulisnya. Jika kamu datang dari bahasa lain, ini perbedaan sintaks yang paling sering bikin salah ketik di awal.",
          code: {
            language: "php",
            content: "<?php\ndeclare(strict_types=1);\n\nclass Buku\n{\n    public string $judul = \"\";\n    public int $harga = 0;\n}\n\n$buku = new Buku();\n$buku->judul = \"Belajar PHP\";\n$buku->harga = 99000;\n\necho $buku->judul . \" - Rp\" . $buku->harga; // Belajar PHP - Rp99000",
            caption: "Class mendefinisikan, object menampung nilai nyata.",
          },
        },
        {
          kind: "quiz",
          question: "Bagaimana cara membaca property `$nama` dari object yang disimpan di `$siswa`?",
          options: ["$siswa->nama", "$siswa.nama", "$siswa::nama", "$siswa['nama']"],
          answer: 0,
          explanation:
            "PHP memakai panah -> untuk anggota object: $siswa->nama. Titik adalah operator penggabung string, bukan akses property.",
        },
        {
          kind: "code",
          title: "Class Siswa pertamamu",
          prompt:
            "Lengkapi dua kekosongan: tipe property `$kelas`, dan nama class yang di-instansiasi dengan `new`. Input: baris pertama nama, baris kedua kelas. Keluaran: `nama kelas N`.",
          mode: "fill",
          template:
            "<?php\ndeclare(strict_types=1);\n\nclass Siswa\n{\n    public string $nama = \"\";\n    public ___ $kelas = 0;\n}\n\n$siswa = new ___();\n$siswa->nama = trim(fgets(STDIN));\n$siswa->kelas = (int) trim(fgets(STDIN));\n\necho $siswa->nama . \" kelas \" . $siswa->kelas . \"\\n\";",
          solution:
            "<?php\ndeclare(strict_types=1);\n\nclass Siswa\n{\n    public string $nama = \"\";\n    public int $kelas = 0;\n}\n\n$siswa = new Siswa();\n$siswa->nama = trim(fgets(STDIN));\n$siswa->kelas = (int) trim(fgets(STDIN));\n\necho $siswa->nama . \" kelas \" . $siswa->kelas . \"\\n\";",
          tests: [
            { stdin: "Dina\n11", expectedOutput: "Dina kelas 11" },
            { stdin: "Bagas\n12", expectedOutput: "Bagas kelas 12" },
            { stdin: "Rani\n10", expectedOutput: "Rani kelas 10", hidden: true },
          ],
          hints: [
            "Kelas disimpan sebagai angka, jadi tipenya int.",
            "Nama class sama persis dengan yang dideklarasikan: Siswa.",
          ],
        },
      ],
    },
    {
      slug: "oop-method-this",
      title: "Property, Method, dan $this",
      summary: "Tempelkan perilaku pada class dengan method, dan rujuk object sendiri lewat $this.",
      steps: [
        {
          kind: "theory",
          title: "Data plus perilaku dalam satu tempat",
          body: "Method adalah fungsi yang dideklarasikan di dalam class. Ia hidup di setiap object hasil class tersebut dan dipanggil lewat panah: `$tabungan->setor(20000)`. Menyatukan data dan perilakunya di satu tempat adalah inti OOP: aturan soal saldo tidak tersebar di seluruh program, tapi tinggal di class Rekening.\n\nDi dalam method, `$this` merujuk object yang sedang dipanggil. `$this->saldo` adalah saldo milik object itu, bukan milik class atau object lain. Dari `$this` pula method membaca dan mengubah property, serta memanggil method lain pada object yang sama.\n\nPerhatikan tanda `$` yang hanya ada di depan `$this`, tidak di depan nama property setelah panah: `$this->saldo` benar, `$this->$saldo` salah arti. Ini salah ketik klasik yang pesan errornya tidak selalu membantu pemula.",
          code: {
            language: "php",
            content: "<?php\ndeclare(strict_types=1);\n\nclass Rekening\n{\n    public int $saldo = 0;\n\n    public function setor(int $nominal): void\n    {\n        $this->saldo += $nominal;\n    }\n\n    public function deskripsi(): string\n    {\n        return \"Saldo: \" . $this->saldo;\n    }\n}\n\n$r = new Rekening();\n$r->setor(50000);\n$r->setor(25000);\necho $r->deskripsi(); // Saldo: 75000",
            caption: "$this mengikat method ke object pemanggilnya.",
          },
        },
        {
          kind: "quiz",
          question: "Di dalam method, cara merujuk object miliknya sendiri adalah?",
          options: ["$self", "$this", "self", "$current"],
          answer: 1,
          explanation:
            "$this tersedia di dalam method non-static dan merujuk object yang memanggil method itu. self adalah nama class, bukan object.",
        },
        {
          kind: "code",
          title: "Tabungan dengan method",
          prompt:
            "Lengkapi dua kekosongan: property yang ditambah di method `setor` lewat `$this`, dan method yang dipanggil saat mencetak. Input: dua baris nominal setoran. Keluaran: saldo akhir.",
          mode: "fill",
          template:
            "<?php\ndeclare(strict_types=1);\n\nclass Tabungan\n{\n    public int $saldo = 0;\n\n    public function setor(int $nominal): void\n    {\n        $this->___ += $nominal;\n    }\n\n    public function saldo(): int\n    {\n        return $this->saldo;\n    }\n}\n\n$tabungan = new Tabungan();\n$tabungan->setor((int) trim(fgets(STDIN)));\n$tabungan->setor((int) trim(fgets(STDIN)));\n\necho $tabungan->___() . \"\\n\";",
          solution:
            "<?php\ndeclare(strict_types=1);\n\nclass Tabungan\n{\n    public int $saldo = 0;\n\n    public function setor(int $nominal): void\n    {\n        $this->saldo += $nominal;\n    }\n\n    public function saldo(): int\n    {\n        return $this->saldo;\n    }\n}\n\n$tabungan = new Tabungan();\n$tabungan->setor((int) trim(fgets(STDIN)));\n$tabungan->setor((int) trim(fgets(STDIN)));\n\necho $tabungan->saldo() . \"\\n\";",
          tests: [
            { stdin: "20000\n30000", expectedOutput: "50000" },
            { stdin: "0\n5000", expectedOutput: "5000" },
            { stdin: "10000\n10000", expectedOutput: "20000", hidden: true },
          ],
          hints: [
            "Method setor menambah nominal ke saldo milik object, yang diakses lewat $this->.",
            "Yang dicetak di akhir adalah method pembaca saldo, dipanggil dengan tanda kurung.",
          ],
        },
      ],
    },
    {
      slug: "oop-visibility",
      title: "Visibility: public, private, protected",
      summary: "Batasi akses property dan method, dan wajibkan perubahan lewat aturan class.",
      steps: [
        {
          kind: "theory",
          title: "Pintu yang sengaja ditutup",
          body: "Setiap property dan method punya visibility. `public` bisa diakses dari mana saja, `private` hanya dari dalam class yang mendeklarasikannya, dan `protected` dari dalam class itu plus turunannya (pembahasan lengkapnya di modul OOP lanjut). Kalau visibility tidak ditulis, PHP memperlakukannya sebagai public, jadi selalu tulis eksplisit.\n\nKenapa menutup pintu? Karena aturan butuh satu tempat tinggal. Saldo tidak boleh negatif, stok tidak boleh minus: jika property dibuka lewat public, siapa pun bisa menulis `$akun->saldo = -99999` dan melangkahi semua aturan. Dengan private, satu-satunya jalan masuk adalah method class, dan di sanalah validasi berdiri.\n\nPrinsipnya sederhana: property hampir selalu private, method yang menjadi antarmuka wajar dibuka public. Mulailah tertutup, buka hanya yang memang perlu. Lebih mudah membuka pintu nanti daripada menutup pintu yang sudah dipakai orang.",
          code: {
            language: "php",
            content: "<?php\ndeclare(strict_types=1);\n\nclass Akun\n{\n    private int $saldo = 0;\n\n    public function setor(int $nominal): void\n    {\n        if ($nominal > 0) {\n            $this->saldo += $nominal; // aturan tinggal di satu tempat\n        }\n    }\n\n    public function saldo(): int\n    {\n        return $this->saldo;\n    }\n}\n\n$akun = new Akun();\n$akun->setor(50000);\n$akun->setor(-100000); // ditolak oleh aturan\necho $akun->saldo(); // 50000",
            caption: "Property private memaksa semua perubahan lewat method yang punya aturan.",
          },
        },
        {
          kind: "quiz",
          question: "Property `private int $kode;` diakses dari luar class dengan `$obj->kode`. Apa yang terjadi?",
          options: [
            "Error: property privat tidak bisa diakses dari luar class",
            "Mengembalikan null",
            "Mengembalikan 0",
            "Berjalan normal karena PHP longgar",
          ],
          answer: 0,
          explanation:
            "Akses property private dari luar class melempar Error: Cannot access private property. Satu-satunya jalan sah adalah method class itu sendiri.",
        },
        {
          kind: "code",
          title: "Perbaiki akses yang melanggar privat",
          prompt:
            "Program ini gagal jalan dengan error soal property private. Ada SATU baris yang mengakses property langsung. Perbaiki agar saldo dibaca lewat method yang disediakan. Input: satu baris nominal setoran.",
          mode: "fix",
          template:
            "<?php\ndeclare(strict_types=1);\n\nclass Dompet\n{\n    private int $saldo = 0;\n\n    public function setor(int $nominal): void\n    {\n        $this->saldo += $nominal;\n    }\n\n    public function saldo(): int\n    {\n        return $this->saldo;\n    }\n}\n\n$dompet = new Dompet();\n$dompet->setor((int) trim(fgets(STDIN)));\necho $dompet->saldo . \"\\n\";",
          solution:
            "<?php\ndeclare(strict_types=1);\n\nclass Dompet\n{\n    private int $saldo = 0;\n\n    public function setor(int $nominal): void\n    {\n        $this->saldo += $nominal;\n    }\n\n    public function saldo(): int\n    {\n        return $this->saldo;\n    }\n}\n\n$dompet = new Dompet();\n$dompet->setor((int) trim(fgets(STDIN)));\necho $dompet->saldo() . \"\\n\";",
          tests: [
            { stdin: "50000", expectedOutput: "50000" },
            { stdin: "0", expectedOutput: "0" },
            { stdin: "12500", expectedOutput: "12500", hidden: true },
          ],
          hints: [
            "Jalankan dulu dan baca errornya: PHP menyebut property mana yang tidak boleh diakses.",
            "Class sudah menyediakan method pembaca saldo, panggil dengan tanda kurung.",
          ],
        },
      ],
    },
    {
      slug: "oop-constructor-promotion",
      title: "Constructor dan Property Promotion",
      summary: "Isi property saat object dibuat, dan ringkas dengan promotion PHP 8.",
      steps: [
        {
          kind: "theory",
          title: "Dari gaya lama ke promotion",
          body: "Constructor adalah method khusus bernama `__construct` yang otomatis dijalankan saat `new`. Tempat yang tepat untuk menerima data awal dan memastikan object lahir dalam keadaan sah. Sebelum PHP 8, polanya panjang: deklarasikan property, terima parameter, assign satu per satu lewat `$this`.\n\nPHP 8 memotong semuanya dengan constructor property promotion: tulis visibility langsung di daftar parameter, dan property dibuat sekaligus diisi. `public function __construct(public string $nama, public int $stok)` dalam satu tarikan napas membuat dua property bertipe dan mengisinya dari argumen. Tubuh constructor jadi bebas untuk validasi atau pekerjaan lain yang benar-benar perlu.\n\nPromotion bukan kewajiban. Kalau parameter hanya sebagian yang disimpan, atau ada transformasi sebelum disimpan, gaya lama tetap sah dan kadang lebih jelas. Tapi di kode PHP 8 ke atas, promotion adalah bentuk yang paling sering kamu temui.",
          code: {
            language: "php",
            content: "<?php\ndeclare(strict_types=1);\n\n// Gaya sebelum PHP 8\nclass ProdukLama\n{\n    public string $nama;\n    public int $stok;\n\n    public function __construct(string $nama, int $stok)\n    {\n        $this->nama = $nama;\n        $this->stok = $stok;\n    }\n}\n\n// PHP 8: constructor property promotion\nclass ProdukBaru\n{\n    public function __construct(\n        public string $nama,\n        public int $stok,\n    ) {\n    }\n}\n\n$p = new ProdukBaru(\"Gula\", 25);\necho $p->nama; // Gula",
            caption: "Promotion mendeklarasikan property, tipenya, dan mengisinya dalam satu baris per parameter.",
          },
        },
        {
          kind: "quiz",
          question: "Manakah deklarasi constructor PHP 8 yang memakai property promotion dengan benar?",
          options: [
            "public function __construct(public string $nama) {}",
            "public function __construct(string public $nama) {}",
            "public promoted string $nama;",
            "function __promote(string $nama) {}",
          ],
          answer: 0,
          explanation:
            "Promotion ditulis dengan visibility sebelum tipe di daftar parameter constructor: public string $nama. Urutannya tidak boleh dibalik.",
        },
        {
          kind: "code",
          title: "Tiket dengan constructor promotion",
          prompt:
            "Lengkapi promotion pada parameter pertama constructor (visibility-nya) dan property yang dibaca di `ringkas`. Input: baris pertama nama acara, baris kedua harga. Keluaran: `acara - Rpharga`.",
          mode: "fill",
          template:
            "<?php\ndeclare(strict_types=1);\n\nclass Tiket\n{\n    public function __construct(\n        ___ string $acara,\n        public int $harga,\n    ) {\n    }\n\n    public function ringkas(): string\n    {\n        return $this->___ . \" - Rp\" . $this->harga;\n    }\n}\n\n$tiket = new Tiket(trim(fgets(STDIN)), (int) trim(fgets(STDIN)));\necho $tiket->ringkas() . \"\\n\";",
          solution:
            "<?php\ndeclare(strict_types=1);\n\nclass Tiket\n{\n    public function __construct(\n        public string $acara,\n        public int $harga,\n    ) {\n    }\n\n    public function ringkas(): string\n    {\n        return $this->acara . \" - Rp\" . $this->harga;\n    }\n}\n\n$tiket = new Tiket(trim(fgets(STDIN)), (int) trim(fgets(STDIN)));\necho $tiket->ringkas() . \"\\n\";",
          tests: [
            { stdin: "Konser\n150000", expectedOutput: "Konser - Rp150000" },
            { stdin: "Film\n45000", expectedOutput: "Film - Rp45000" },
            { stdin: "Teater\n75000", expectedOutput: "Teater - Rp75000", hidden: true },
          ],
          hints: [
            "Promotion menuntut visibility di depan tipe parameter, sama seperti parameter kedua.",
            "Yang dirangkai paling depan adalah nama acara.",
          ],
        },
      ],
    },
    {
      slug: "oop-this-chaining",
      title: "$this dan Method Chaining",
      summary: "Kembalikan $this dari method supaya panggilan bisa dirangkai dalam satu baris.",
      steps: [
        {
          kind: "theory",
          title: "Mengembalikan diri sendiri",
          body: "Kalau sebuah method mengembalikan `$this`, hasil pemanggilannya tetap object yang sama, sehingga bisa langsung dipanggil method berikutnya: `$keranjang->tambah(\"Buku\", 2)->tambah(\"Pulpen\", 3)`. Pola ini disebut method chaining, dan kamu akan menemuannya di banyak library PHP modern, dari query builder sampai koleksi.\n\nSyaratnya dua. Method tersebut mengembalikan `$this`, dan return type-nya ditulis `static` yang berarti class pemanggilnya. `self` juga sering dipakai; perbedaan halusnya baru terasa di pewarisan, jadi untuk sekarang cukup ingat keduanya berarti object yang sama kembali ke tanganmu.\n\nGunakan chaining untuk rangkaian yang alami dibaca seperti kalimat: isi, atur, bangun. Hindari merangkai delapan method sekaligus di satu baris; saat salah satu gagal, jejak errornya sulit dilacak. Chaining adalah gula: sedikit membuat enak, banyak membuat rewel.",
          code: {
            language: "php",
            content: "<?php\ndeclare(strict_types=1);\n\nclass Keranjang\n{\n    private array $barang = [];\n\n    public function tambah(string $nama, int $jumlah): static\n    {\n        $this->barang[$nama] = ($this->barang[$nama] ?? 0) + $jumlah;\n        return $this; // kunci chaining\n    }\n\n    public function totalItem(): int\n    {\n        return array_sum($this->barang);\n    }\n}\n\n$k = (new Keranjang())->tambah(\"Buku\", 2)->tambah(\"Pulpen\", 3);\necho $k->totalItem(); // 5",
            caption: "return $this membuat panggilan berikutnya tetap di object yang sama.",
          },
        },
        {
          kind: "quiz",
          question: "Apa syarat `$obj->tambah(1)->kurangi(1)` bisa ditulis berantai?",
          options: [
            "Kedua method wajib static",
            "Method tambah mengembalikan $this",
            "Kedua method wajib private",
            "PHP tidak mendukung pemanggilan berantai",
          ],
          answer: 1,
          explanation:
            "Rantai jalan karena method sebelumnya mengembalikan object yang sama lewat return $this, sehingga panggilan berikutnya menempel padanya.",
        },
      ],
    },
    {
      slug: "oop-static",
      title: "Static Property dan Method",
      summary: "Simpan milik class, bukan milik object: self:: di dalam, NamaClass:: di luar.",
      steps: [
        {
          kind: "theory",
          title: "Milik class, bukan milik object",
          body: "Property dan method static menempel pada class, bukan pada object. Artinya hanya ada satu untuk semua: berapa pun object yang dibuat, `Penghitung::$jumlahObject` tetap satu nilai bersama. Itu pas untuk penghitung, konfigurasi bersama, atau helper yang tidak butuh state object.\n\nAksesnya beda jalur. Di dalam class, gunakan `self::` untuk anggota static dan `$this->` untuk anggota object. Di luar class, gunakan nama class dengan empat titik dua: `Penghitung::$jumlahObject` atau `Penghitung::buat()`. Method static tidak punya `$this`, karena tidak dipanggil dari object mana pun; memakai `$this` di dalamnya adalah error langsung.\n\nJangan jadikan static tempat sampah untuk menghindari membuat object. Anggota static yang bisa diubah di mana-mana sama saja dengan variabel global berjubah. Pakai untuk hal yang memang milik class sebagai satu kesatuan, dan biarkan sisanya jadi object.",
          code: {
            language: "php",
            content: "<?php\ndeclare(strict_types=1);\n\nclass Penghitung\n{\n    public static int $jumlahObject = 0;\n\n    public function __construct()\n    {\n        self::$jumlahObject++; // milik class, satu untuk semua object\n    }\n}\n\nnew Penghitung();\nnew Penghitung();\necho Penghitung::$jumlahObject; // 2",
            caption: "Dua object dibuat, tapi counter static hanya satu dan terus bertambah.",
          },
        },
        {
          kind: "quiz",
          question: "Bagaimana memanggil static method `hitung()` dari class `Statistik` dari luar class?",
          options: [
            "(new Statistik())->hitung()",
            "Statistik::hitung()",
            "Statistik->hitung()",
            "$Statistik->hitung()",
          ],
          answer: 1,
          explanation:
            "Anggota static diakses lewat empat titik dua dari nama class: Statistik::hitung(). Tidak perlu membuat object dulu.",
        },
        {
          kind: "code",
          title: "Nomor pesanan otomatis",
          prompt:
            "Lengkapi dua kekosongan: nama class untuk mengakses counter static dari dalam constructor, dan nama class saat membaca counter di program utama. Input: banyaknya pesanan. Keluaran: nomor pesanan dipisah koma, lalu total pesanan.",
          mode: "fill",
          template:
            "<?php\ndeclare(strict_types=1);\n\nclass Pesanan\n{\n    public static int $counter = 0;\n    public int $nomor;\n\n    public function __construct()\n    {\n        ___::$counter++;\n        $this->nomor = self::$counter;\n    }\n}\n\n$n = (int) trim(fgets(STDIN));\n$nomor = [];\nfor ($i = 0; $i < $n; $i++) {\n    $nomor[] = (new Pesanan())->nomor;\n}\n\necho implode(\",\", $nomor) . \"\\n\";\necho \"total pesanan: \" . ___::$counter . \"\\n\";",
          solution:
            "<?php\ndeclare(strict_types=1);\n\nclass Pesanan\n{\n    public static int $counter = 0;\n    public int $nomor;\n\n    public function __construct()\n    {\n        self::$counter++;\n        $this->nomor = self::$counter;\n    }\n}\n\n$n = (int) trim(fgets(STDIN));\n$nomor = [];\nfor ($i = 0; $i < $n; $i++) {\n    $nomor[] = (new Pesanan())->nomor;\n}\n\necho implode(\",\", $nomor) . \"\\n\";\necho \"total pesanan: \" . Pesanan::$counter . \"\\n\";",
          tests: [
            { stdin: "3", expectedOutput: "1,2,3\ntotal pesanan: 3" },
            { stdin: "1", expectedOutput: "1\ntotal pesanan: 1" },
            { stdin: "4", expectedOutput: "1,2,3,4\ntotal pesanan: 4", hidden: true },
          ],
          hints: [
            "Dari dalam class, anggota static diakses lewat self dan empat titik dua.",
            "Dari luar class, ganti self dengan nama classnya.",
          ],
        },
      ],
    },
    {
      slug: "oop-class-constant",
      title: "Class Constant (const)",
      summary: "Kunci nilai tetap ke dalam class dengan const, akses lewat empat titik dua.",
      steps: [
        {
          kind: "theory",
          title: "Nilai yang tidak boleh berubah",
          body: "Class constant menyimpan nilai yang ditetapkan sekali dan tidak berubah: `public const MAKS_ITEM = 10;`. Bedanya dengan static property, constant tidak bisa diisi ulang dari mana pun, sehingga aman dipakai sebagai aturan main yang dijamin tetap.\n\nTempat paling wajar untuk constant adalah batas dan label yang dipakai class itu sendiri: batas maksimal, nilai diskon default, kode status. Akses dari dalam class lewat `self::MAKS_ITEM`, dari luar lewat `Keranjang::MAKS_ITEM`. Sama seperti static, tidak perlu object untuk membacanya.\n\nSejak PHP 8.1 constant juga bisa diberi visibility: `private const` hanya untuk dalam class, `public const` untuk umum. Konvensi penamaannya UPPER_SNAKE_CASE supaya langsung terlihat sebagai nilai tetap. Untuk kumpulan opsi tetap yang makin kompleks, PHP 8.1 juga punya enum yang akan terasa lebih pas.",
          code: {
            language: "php",
            content: "<?php\ndeclare(strict_types=1);\n\nclass Keranjang\n{\n    public const MAKS_ITEM = 10;\n\n    public function penuh(int $jumlah): bool\n    {\n        return $jumlah >= self::MAKS_ITEM;\n    }\n}\n\necho Keranjang::MAKS_ITEM; // 10\nvar_dump((new Keranjang())->penuh(10)); // bool(true)",
            caption: "Aturan batas tinggal di class, dan tidak ada yang bisa mengubahnya saat runtime.",
          },
        },
        {
          kind: "quiz",
          question: "Bagaimana mengakses constant `public const MAKS_ITEM = 10;` dari luar class Keranjang?",
          options: [
            "Keranjang->MAKS_ITEM",
            "Keranjang::MAKS_ITEM",
            "Keranjang::$MAKS_ITEM",
            "$Keranjang::MAKS_ITEM",
          ],
          answer: 1,
          explanation:
            "Constant class diakses dengan empat titik dua dari nama class: Keranjang::MAKS_ITEM. Tanpa tanda $, karena constant bukan property.",
        },
      ],
    },
    {
      slug: "oop-getter-setter",
      title: "Getter, Setter, dan __get",
      summary: "Buka akses terkendali lewat method, dan kenali magic method __get.",
      steps: [
        {
          kind: "theory",
          title: "Pintu dengan penjaga",
          body: "Property private butuh jalan keluar yang rapi. Getter adalah method pembaca sederhana seperti `getStok(): int`, dan setter adalah method penulis seperti `setStok(int $stok): void`. Nilai tambahnya di setter: validasi dan aturan tertulis di satu tempat, sehingga tidak ada jalur masuk yang meloloskan nilai kotor.\n\nKamu tidak wajib membuat keduanya untuk semua property. Property yang boleh berubah bebas bisa dibuat public; property read-only cukup getter tanpa setter. Sejak PHP 8.1 ada juga `readonly`, yang menutup setter manual untuk property yang sekali isi. Pilih bentuk paling sederhana yang tetap menjaga aturan.\n\nPHP juga menyediakan magic method `__get(string $nama)` yang dipanggil otomatis saat kode membaca property yang tidak bisa diakses. Dengan itu satu class bisa memproksi banyak pseudo-property sekaligus. Praktis, tapi menyembunyikan perilaku di balik sintaks biasa, jadi pakai seperlunya dan catat di dokumentasi class.",
          code: {
            language: "php",
            content: "<?php\ndeclare(strict_types=1);\n\nclass Produk\n{\n    private int $stok;\n\n    public function __construct(int $stok)\n    {\n        $this->setStok($stok); // lahir lewat pintu yang dijaga\n    }\n\n    public function getStok(): int\n    {\n        return $this->stok;\n    }\n\n    public function setStok(int $stok): void\n    {\n        $this->stok = max(0, $stok); // aturan: stok tidak minus\n    }\n}\n\n$p = new Produk(-5);\necho $p->getStok(); // 0",
            caption: "Setter menjadi satu-satunya pintu masuk, dan pintu itu menegakkan aturan.",
          },
        },
        {
          kind: "quiz",
          question: "Apa keuntungan utama setter dibanding property publik?",
          options: [
            "Eksekusi lebih cepat",
            "Validasi dan aturan tertulis di satu tempat",
            "Nama variabelnya lebih pendek",
            "Setter membuat property jadi static",
          ],
          answer: 1,
          explanation:
            "Setter menjadi satu jalur masuk yang bisa menegakkan aturan, misalnya menolak stok minus. Property publik tidak punya tempat untuk menaruh aturan.",
        },
      ],
    },
    {
      slug: "oop-instanceof-typehint",
      title: "Type Hint Class dan instanceof",
      summary: "Kunci parameter pada tipe class, dan periksa jenis object dengan instanceof.",
      steps: [
        {
          kind: "theory",
          title: "Kontrak berupa class",
          body: "Parameter fungsi dan method bisa diberi tipe berupa nama class: `function kirim(Pengguna $pengguna): string`. Kontraknya tegas, hanya object Pengguna (atau turunannya) yang boleh masuk; lainnya melempar TypeError sebelum tubuh method dijalankan. Ini alat dokumentasi paling jujur: pembaca langsung tahu method itu bekerja dengan object apa.\n\nOperator `instanceof` menjawab pertanyaan kebalikannya: object ini jenisnya apa? `$x instanceof Pengguna` menghasilkan bool. Pola paling sering adalah memeriksa dulu, baru bertindak, misalnya memberi perlakuan berbeda untuk dua jenis object sebelum ada hierarki class yang lebih rapi.\n\nPerhatikan penulisan tipe class tanpa tanda `$` di depan namanya, dan instanceof ditulis dengan huruf kecil semua. Keduanya bekerja dengan class maupun interface, yang akan sering kamu pakai di modul OOP lanjut.",
          code: {
            language: "php",
            content: "<?php\ndeclare(strict_types=1);\n\nclass Pengguna\n{\n    public function __construct(public string $nama)\n    {\n    }\n}\n\nclass Notifikasi\n{\n    public function kirim(Pengguna $pengguna): string\n    {\n        return \"Kirim ke \" . $pengguna->nama;\n    }\n}\n\n$pengguna = new Pengguna(\"Sinta\");\necho (new Notifikasi())->kirim($pengguna); // Kirim ke Sinta\nvar_dump($pengguna instanceof Pengguna);   // bool(true)",
            caption: "Type hint menjaga pintu masuk, instanceof memeriksa jenis object.",
          },
        },
        {
          kind: "quiz",
          question: "Apa keluaran `var_dump($x instanceof Produk)` saat `$x = new Produk();`?",
          options: ["bool(true)", "bool(false)", "string \"Produk\"", "Error"],
          answer: 0,
          explanation:
            "$x adalah object Produk, jadi instanceof menghasilkan true. var_dump menampilkannya sebagai bool(true).",
        },
      ],
    },
    {
      slug: "oop-latihan-gabungan",
      title: "Latihan Gabungan: Produk dengan Diskon",
      summary: "Rangkai promotion, default parameter, dan aturan class dalam satu class Produk.",
      steps: [
        {
          kind: "theory",
          title: "Satu class, semua konsep modul ini",
          body: "Latihan penutup modul meminta class `Produk` yang merangkai semuanya: constructor property promotion untuk `nama` public dan `harga` private, parameter default pada method diskon, dan aturan class yang melindungi harga.\n\nDesainnya sengaja begitu. Karena `$harga` private, satu-satunya cara menghitung adalah lewat method `hargaSetelahDiskon()`, yang punya parameter default `$persen = 0` sehingga bisa dipanggil tanpa argumen. Method `deskripsi()` memakai method tadi, bukan menghitung ulang: satu sumber kebenaran untuk satu aturan bisnis.\n\nPerhatikan juga cast `(int)` sebelum hasil perkalian diskon. Pembagian di PHP selalu menghasilkan float, sementara harga akhir yang dijanjikan adalah int. Konversi eksplisit seperti ini membuat kontrak tipe tetap terjaga dari input sampai keluaran.",
          code: {
            language: "php",
            content: "// Bentuk akhir program yang akan kamu lengkapi:\n// Buku: Rp20000 (diskon 20%)\n\nclass Produk\n{\n    public function __construct(\n        public string $nama,\n        private int $harga,\n    ) {\n    }\n\n    public function hargaSetelahDiskon(int $persen = 0): int\n    {\n        return $this->harga - (int) ($this->harga * $persen / 100);\n    }\n}",
            caption: "Promotion, visibility, dan default parameter bekerja di satu tempat.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa `$harga` dibuat private dan hanya dihitung lewat method di class Produk?",
          options: [
            "Supaya nama class lebih pendek",
            "Supaya harga hanya berubah dan dipakai lewat aturan yang ditetapkan class",
            "Karena PHP melarang property publik",
            "Agar harga bisa dihitung dua kali lebih cepat",
          ],
          answer: 1,
          explanation:
            "Property private menjadikan method class satu-satunya jalur ke harga, sehingga aturan seperti perhitungan diskon tidak bisa dilangkahi.",
        },
        {
          kind: "code",
          title: "Class Produk dengan diskon",
          prompt:
            "Lengkapi tiga kekosongan: tanda parameter default pada `$persen`, operator pembagian persen, dan kata kunci pembuat object. Input: nama, harga, lalu persen diskon. Keluaran: `nama: RphargaAkhir (diskon N%)`.",
          mode: "fill",
          template:
            "<?php\ndeclare(strict_types=1);\n\nclass Produk\n{\n    public function __construct(\n        public string $nama,\n        private int $harga,\n    ) {\n    }\n\n    public function hargaSetelahDiskon(int $persen ___ 0): int\n    {\n        return $this->harga - (int) ($this->harga * $persen ___ 100);\n    }\n\n    public function deskripsi(int $persen = 0): string\n    {\n        return $this->nama . \": Rp\" . $this->hargaSetelahDiskon($persen) . \" (diskon \" . $persen . \"%)\";\n    }\n}\n\n$nama = trim(fgets(STDIN));\n$harga = (int) trim(fgets(STDIN));\n$persen = (int) trim(fgets(STDIN));\n\n$produk = ___ Produk($nama, $harga);\necho $produk->deskripsi($persen) . \"\\n\";",
          solution:
            "<?php\ndeclare(strict_types=1);\n\nclass Produk\n{\n    public function __construct(\n        public string $nama,\n        private int $harga,\n    ) {\n    }\n\n    public function hargaSetelahDiskon(int $persen = 0): int\n    {\n        return $this->harga - (int) ($this->harga * $persen / 100);\n    }\n\n    public function deskripsi(int $persen = 0): string\n    {\n        return $this->nama . \": Rp\" . $this->hargaSetelahDiskon($persen) . \" (diskon \" . $persen . \"%)\";\n    }\n}\n\n$nama = trim(fgets(STDIN));\n$harga = (int) trim(fgets(STDIN));\n$persen = (int) trim(fgets(STDIN));\n\n$produk = new Produk($nama, $harga);\necho $produk->deskripsi($persen) . \"\\n\";",
          tests: [
            { stdin: "Buku\n25000\n20", expectedOutput: "Buku: Rp20000 (diskon 20%)" },
            { stdin: "Tas\n100000\n0", expectedOutput: "Tas: Rp100000 (diskon 0%)" },
            { stdin: "Topi\n19999\n50", expectedOutput: "Topi: Rp10000 (diskon 50%)", hidden: true },
          ],
          hints: [
            "Parameter default ditulis dengan satu tanda sama dengan di depan nilainya.",
            "Persen berarti per seratus, jadi pembilang dibagi seratus.",
            "Object dibuat dengan kata kunci new di depan nama class.",
          ],
        },
      ],
    },
  ],
};
