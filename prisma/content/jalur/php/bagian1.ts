import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "php",
  moduleRange: [0, 1],
  modules: [
    {
      title: "PHP yang Idiomatik",
      description: "Strict types, perbandingan == vs ===, coercion, null handling, dan konvensi.",
    },
    {
      title: "Array Secara Dalam",
      description: "Array asosiatif, map/filter/reduce, sorting, destructuring, dan referensi.",
    },
  ],
  lessons: [
    // ==================== MODUL 0: PHP yang Idiomatik ====================
    {
      slug: "echo-dan-tag-php",
      title: "Tag PHP dan echo",
      summary: "Kenapa file PHP murni dibuka tanpa ditutup, dan cara echo benar-benar bekerja.",
      steps: [
        {
          kind: "theory",
          title: "Buka saja, tanpa tutup",
          body: "Tag `<?php` memberi tahu interpreter bahwa kode PHP dimulai di situ. Segala teks di luar tag diperlakukan sebagai keluaran mentah; itu penting saat PHP bercampur HTML, tapi tidak relevan untuk file yang isinya murni PHP. Justru karena itu PSR-12 mewajibkan file PHP murni tanpa tag penutup `?>`: satu baris kosong yang lolos setelah `?>` bisa terkirim ke output tanpa kamu sadari dan merusak header.\n\n`echo` bukan fungsi, melainkan konstruksi bahasa: tidak butuh tanda kurung, dan bisa menerima beberapa argumen sekaligus yang dipisah koma. `print` adalah alternatif yang hanya menerima satu argumen dan selalu mengembalikan 1, sehingga nyaris tidak pernah punya alasan untuk dipilih daripada `echo`.\n\nDi CLI, hasil `echo` menuju terminal; di latihan platform ini, hasil itulah yang dibandingkan dengan keluaran yang diharapkan. Baris biasanya ditutup dengan `\\n` di dalam string kutip ganda agar keluarannya rapi per baris.",
          code: {
            language: "php",
            content: `<?php

echo "Laporan harian", "\\n", "Semua sistem normal";

// echo tanpa kurung: ia konstruksi bahasa, bukan fungsi.
// Baris terakhir file sengaja tanpa tag penutup ?>`,
            caption: "Satu echo dengan tiga argumen: teks, pindah baris, lalu teks berikutnya.",
          },
        },
        {
          kind: "quiz",
          question: "Pada file PHP yang isinya murni kode PHP, apa praktik yang dianjurkan PSR-12 soal tag penutup?",
          options: [
            "Selalu tutup dengan ?> supaya filenya lengkap",
            "Menutupnya dengan tag <?php lagi",
            "Menghilangkan ?> di akhir file",
            "Menutup dengan tag <php>",
          ],
          answer: 2,
          explanation:
            "Tag penutup dihilangkan pada file PHP murni supaya tidak ada spasi atau baris kosong yang tidak sengaja terkirim setelah kode. ?> hanya perlu saat file bercampur HTML.",
        },
        {
          kind: "code",
          title: "Sapa pembaca lewat CLI",
          prompt:
            "Program membaca satu baris nama lalu mencetak `Halo, <nama>!` diakhiri pindah baris. Lengkapi dua bagian yang hilang: konstruksi pencetaknya dan karakter pindah baris.",
          mode: "fill",
          template: `<?php

$nama = trim(fgets(STDIN));
___ "Halo, ", $nama, ___;`,
          solution: `<?php

$nama = trim(fgets(STDIN));
echo "Halo, ", $nama, "!\\n";`,
          tests: [
            { stdin: "Dina", expectedOutput: "Halo, Dina!" },
            { stdin: "Bagas", expectedOutput: "Halo, Bagas!" },
            { stdin: "Rani", expectedOutput: "Halo, Rani!", hidden: true },
          ],
          hints: [
            "Konstruksi bahasa untuk mencetak di PHP ditulis tanpa tanda kurung.",
            "Pindah baris adalah dua karakter dalam string kutip ganda: garis miring terbalik dan huruf n.",
            "Jawabannya: echo di depan, dan \"!\\n\" sebagai argumen terakhir.",
          ],
        },
      ],
    },
    {
      slug: "tipe-dan-deklarasi",
      title: "Tipe Data dan Deklarasi",
      summary: "Variabel PHP tidak bertipe; tipe menempel pada nilainya, dan pembagian / punya aturan sendiri.",
      steps: [
        {
          kind: "theory",
          title: "Tipe menempel pada nilai",
          body: "PHP bertipe dinamis: variabel hanya nama berawalan `$`, dan tipenya mengikuti nilai yang sedang dipegang. `$saldo` bisa berisi int sekarang lalu string lima baris kemudian, tanpa keluhan. Empat tipe skalar yang dipakai setiap hari: `int`, `float`, `string`, dan `bool`. Tidak ada deklarasi tipe pada variabel; tipe hanya muncul pada parameter dan nilai kembalian fungsi, yang dibahas di lesson `declare(strict_types=1)`.\n\nKonsekuensi yang sering mengejutkan ada di pembagian. Operator `/` mengembalikan float kecuali kedua operand int dan hasilnya habis dibagi: `10 / 4` menghasilkan `2.5` (float), `9 / 3` menghasilkan `3` (int). Untuk pembagian bulat yang hasilnya selalu int, gunakan `intdiv()`. Periksa tipe kapan saja dengan `gettype()` atau `var_dump()`.\n\nKonversi manual ditulis sebagai cast: `(int) $teks`, `(float) $angka`, `(string) $nilai`. Cast `(int)` memotong bagian desimal, bukan membulatkan: `(int) 3.9` menghasilkan 3. Cast ini wajib saat membaca input karena `fgets()` selalu memberi string.",
          code: {
            language: "php",
            content: `<?php

$saldo = 150000;     // int
$harga = 7500.5;     // float
$nama = "Kopi Gayo"; // string
$aktif = true;       // bool

var_dump(gettype($saldo), gettype($harga));
var_dump(10 / 4);        // float(2.5)
var_dump(9 / 3);         // int(3): habis dibagi
var_dump(intdiv(10, 4)); // int(2): selalu dibulatkan ke arah nol`,
            caption: "Tipe berubah mengikuti nilai; / dan intdiv bisa menghasilkan tipe berbeda.",
          },
        },
        {
          kind: "quiz",
          question: "Berapa tipe hasil `9 / 3` di PHP?",
          options: [
            "int, karena kedua operand int dan hasilnya habis dibagi",
            "float, karena operator / selalu menghasilkan float",
            "string, karena hasil pembagian selalu berupa teks",
            "tergantung versi PHP yang dipakai",
          ],
          answer: 0,
          explanation:
            "Pembagian dengan / hanya menghasilkan int bila kedua operand int dan hasilnya genap. 10 / 4 justru menghasilkan float 2.5.",
        },
        {
          kind: "code",
          title: "Dua rasa pembagian",
          prompt:
            "Program membaca dua bilangan bulat lalu mencetak hasil pembagian biasa, lalu hasil pembagian bulat. Lengkapi dua baris echo yang hilang.",
          mode: "fill",
          template: `<?php

$a = (int) trim(fgets(STDIN));
$b = (int) trim(fgets(STDIN));

// pembagian biasa: hasil bisa float
echo ___ . "\\n";
// pembagian bulat: hasil selalu int
echo ___ . "\\n";`,
          solution: `<?php

$a = (int) trim(fgets(STDIN));
$b = (int) trim(fgets(STDIN));

// pembagian biasa: hasil bisa float
echo $a / $b . "\\n";
// pembagian bulat: hasil selalu int
echo intdiv($a, $b) . "\\n";`,
          tests: [
            { stdin: "10\n4", expectedOutput: "2.5\n2" },
            { stdin: "9\n3", expectedOutput: "3\n3" },
            { stdin: "20\n4", expectedOutput: "5\n5", hidden: true },
          ],
          hints: [
            "Baris pertama cukup memakai operator pembagian biasa yang sudah kamu kenal.",
            "Fungsi bawaan khusus pembagian bulat bernama intdiv dan menerima pembilang lalu penyebut.",
            "Jawabannya: $a / $b untuk baris pertama, intdiv($a, $b) untuk baris kedua.",
          ],
        },
      ],
    },
    {
      slug: "perbandingan-vs-identik",
      title: "== vs ===",
      summary: "Perbandingan yang menyamakan tipe lebih dulu, dan perbandingan identik yang tidak.",
      steps: [
        {
          kind: "theory",
          title: "Dua operator yang terlihat sama",
          body: "`==` membandingkan nilai setelah menyamakan tipe kedua sisi; `===` membandingkan nilai dan tipe sekaligus. Karena itu `5 == \"5\"` bernilai true sedangkan `5 === \"5\"` false. Perbandingan `==` punya tabel aturan coercion-nya sendiri yang tidak selalu intuitif, dan tabel itu pernah berubah di PHP 8: `0 == \"php\"` yang dulu true kini false.\n\nYang tidak berubah: dua string numerik tetap dibandingkan sebagai angka, jadi `\"1e2\" == \"100\"` bernilai true. Aturan praktis yang dipakai kode PHP modern: jadikan `===` dan `!==` pilihan bawaan, dan pakai `==` hanya saat kamu benar-benar menginginkan penyamaan tipe.\n\nKasus klasik yang membuat aturan ini wajib: `strpos()` mengembalikan `0` saat kecocokan ada di posisi paling awal, dan `false` saat tidak ketemu. Dengan `==`, posisi 0 dan false terlihat sama. Hanya `!== false` yang bisa membedakan tidak ketemu dari ketemu di posisi nol.",
          code: {
            language: "php",
            content: `<?php

var_dump(5 == "5");       // true: "5" diubah jadi int dulu
var_dump(5 === "5");      // false: tipenya beda
var_dump(0 == "php");     // false di PHP 8 (dulu true)
var_dump("1e2" == "100"); // true: dua-duanya string numerik

$posisi = strpos("KodeKita", "Kode");
var_dump($posisi);          // int(0), bukan false
var_dump($posisi !== false); // true: ketemu tepat di posisi 0`,
            caption: "strpos yang ketemu di awal mengembalikan 0; hanya !== false yang benar.",
          },
        },
        {
          kind: "quiz",
          question: "Apa keluaran `var_dump(strpos(\"KodeKita\", \"Kode\") == false);`?",
          options: [
            "bool(false), karena strpos berhasil menemukan",
            "bool(true), karena hasilnya 0 dan 0 setara false",
            "bool(true), karena tipenya sama-sama bukan string",
            "Terjadi error karena hasil strpos bukan bool",
          ],
          answer: 1,
          explanation:
            "strpos mengembalikan int 0 untuk kecocokan di posisi pertama. Pada perbandingan lemah, 0 == false bernilai true; itulah alasan pemeriksaannya wajib memakai !== false.",
        },
        {
          kind: "code",
          title: "Pencarian yang salah tuduh",
          prompt:
            "Program mencari suku kata `ka` dalam satu baris teks. Untuk teks yang diawali `ka`, program justru menyebut tidak ketemu. Temukan satu kesalahannya dan perbaiki sampai semua tes lulus.",
          mode: "fix",
          template: `<?php

$teks = trim(fgets(STDIN));
$posisi = strpos($teks, "ka");

if ($posisi == false) {
    echo "tidak ketemu\\n";
} else {
    echo "ketemu di posisi $posisi\\n";
}`,
          solution: `<?php

$teks = trim(fgets(STDIN));
$posisi = strpos($teks, "ka");

if ($posisi === false) {
    echo "tidak ketemu\\n";
} else {
    echo "ketemu di posisi $posisi\\n";
}`,
          tests: [
            { stdin: "kakak", expectedOutput: "ketemu di posisi 0" },
            { stdin: "pakaian", expectedOutput: "ketemu di posisi 2" },
            { stdin: "bumi", expectedOutput: "tidak ketemu", hidden: true },
          ],
          hints: [
            "Jalankan dengan input kakak: hasilnya tidak ketemu padahal suku katanya jelas ada di posisi 0.",
            "Angka 0 dianggap sama dengan false oleh perbandingan lemah, jadi kondisi masuk ke blok tidak ketemu.",
            "Ganti == dengan === supaya yang diperiksa nilai dan tipenya: $posisi === false. Dengan begitu posisi 0 tidak lagi dianggap false dan program benar masuk ke blok else.",
          ],
        },
      ],
    },
    {
      slug: "coercion-dan-jebakannya",
      title: "Coercion dan Jebakannya",
      summary: "Tipe yang berubah tanpa diminta: aturan aritmetika dan perbandingan PHP 8.",
      steps: [
        {
          kind: "theory",
          title: "Berubah tanpa diminta",
          body: "Coercion adalah pengubahan tipe otomatis ketika sebuah operasi butuh tipe tertentu. Pada aritmetika, string numerik diubah ke angka: `\"5\" + 5` menghasilkan int 10 dan `\"3.5\" + 1` menghasilkan float 4.5. Sejak PHP 8, string yang sama sekali tidak numerik melempar `TypeError` saat dihitung, dan string yang diawali angka seperti `\"5 apel\"` memicu warning sementara hanya angka depannya yang dipakai.\n\nPerbandingan juga melakukan coercion, dan tabelnya penuh kejutan: `\"\" == null` true, tetapi `\"0\" == null` false; `null == false` true; `\"abc\" == 0` false sejak PHP 8. Dua string numerik dibandingkan sebagai angka, bukan sebagai teks.\n\nCara bersiasat sederhana: bandingkan dengan `===`, pastikan tipe sebelum dihitung lewat cast eksplisit, dan jangan pernah menggantungkan logika penting pada coercion. Perlakukan setiap `==` di kode sebagai pertanyaan yang harus dibenarkan.",
          code: {
            language: "php",
            content: `<?php

var_dump("5" + 5);       // int(10)
var_dump("3.5" + 1);     // float(4.5)

var_dump("" == null);    // true
var_dump("0" == null);   // false: "0" adalah string berisi satu karakter
var_dump(null == false); // true
var_dump("abc" == 0);    // false sejak PHP 8`,
            caption: "Coercion di perbandingan punya tabel aturannya sendiri; hafalkan yang sering muncul.",
          },
        },
        {
          kind: "quiz",
          question: "Apa hasil `var_dump(\"0\" == null)` di PHP 8?",
          options: ["bool(true)", "bool(false)", "null", "Error saat runtime"],
          answer: 1,
          explanation:
            "Hanya string kosong \"\" yang setara null. \"0\" adalah string berisi satu karakter; ia falsy saat dipakai di if, tapi tidak setara null dalam perbandingan.",
        },
        {
          kind: "quiz",
          question: "Mana pernyataan yang benar soal aritmetika string di PHP 8?",
          options: [
            "Semua string boleh dihitung dengan angka tanpa konsekuensi apa pun",
            "String non-numerik melempar TypeError, dan string seperti \"5 apel\" memicu warning",
            "String \"5 apel\" otomatis diabaikan sehingga hasilnya 0",
            "Semua string yang dihitung hasilnya selalu 0",
          ],
          answer: 1,
          explanation:
            "Sejak PHP 8, aritmetika dengan string non-numerik seperti \"php\" + 1 melempar TypeError. String berawalan angka seperti \"5 apel\" masih dihitung memakai angka depannya, tapi menyalakan warning.",
        },
      ],
    },
    {
      slug: "strict-types",
      title: "declare(strict_types=1)",
      summary: "Satu baris pertama file yang mematikan coercion di pintu fungsi.",
      steps: [
        {
          kind: "theory",
          title: "Menutup pintu coercion",
          body: "Parameter dan nilai kembalian fungsi PHP bisa diberi tipe: `function kaliDua(int $x): int`. Tanpa deklarasi khusus, mode lemah yang berlaku: argumen `\"5\"` yang berupa string numerik dipaksa jadi int diam-diam, dan bahkan `strlen(12.5)` jalan karena float diubah jadi string dulu.\n\n`declare(strict_types=1);` mengubahnya. Ia wajib menjadi statement pertama di file (hanya declare lain yang boleh mendahului), dan berlaku untuk pemanggilan fungsi yang dilakukan dari file itu. Dengan strict mode, mengirim `\"5\"` ke parameter int melempar `TypeError`, bukan dipaksa senyap. Perhatikan: yang menentukan strict atau lemah adalah file tempat pemanggilan ditulis, bukan file tempat fungsi didefinisikan.\n\nBatas kekuatannya juga perlu jelas: `strict_types` tidak mengubah operasi biasa seperti `\"5\" + 5`, karena itu coercion aritmetika, bukan pemanggilan fungsi. Yang berubah hanyalah pemeriksaan argumen dan nilai kembalian pada fungsi bertipe, baik fungsi bawaan maupun buatanmu sendiri.",
          code: {
            language: "php",
            content: `<?php

declare(strict_types=1);

function kaliDua(int $x): int
{
    return $x * 2;
}

echo kaliDua(21), "\\n"; // 42
// kaliDua("21");       // TypeError saat strict_types aktif`,
            caption: "Tanpa strict_types, kaliDua(\"21\") juga menghasilkan 42, tanpa suara.",
          },
        },
        {
          kind: "quiz",
          question: "Di mana `declare(strict_types=1);` harus ditulis?",
          options: [
            "Di baris mana pun sebelum pemanggilan fungsi pertama",
            "Sebagai statement pertama di file",
            "Di dalam setiap fungsi yang parameternya bertipe",
            "Di file konfigurasi php.ini",
          ],
          answer: 1,
          explanation:
            "declare(strict_types=1) harus menjadi statement pertama file; hanya declare lain yang boleh mendahuluinya. Ia berlaku per file, bukan global.",
        },
        {
          kind: "quiz",
          question:
            "Tanpa strict_types, apa yang terjadi pada `kaliDua(\"5\")` jika parameter fungsi dideklarasikan bertipe `int`?",
          options: [
            "Fatal error karena tipe argumen tidak cocok",
            "String \"5\" dipaksa jadi int 5 dan fungsi berjalan normal",
            "Argumen diabaikan dan dipakai nilai 0",
            "Nilai kembalian berubah menjadi string",
          ],
          answer: 1,
          explanation:
            "Mode lemah mengubah string numerik menjadi int tanpa pemberitahuan. Dengan strict_types=1, pemanggilan yang sama melempar TypeError.",
        },
      ],
    },
    {
      slug: "null-dan-coalesce",
      title: "null dan Operator ??",
      summary: "Membedakan tidak ada nilai dari bernilai nol, dan fallback satu baris dengan ??.",
      steps: [
        {
          kind: "theory",
          title: "Tiga cara melihat ketiadaan",
          body: "`null` berarti variabel tidak berisi nilai. `is_null($x)` identik dengan `$x === null`. Kebalikannya `isset($x)`: ia mengembalikan false untuk null sekaligus untuk variabel yang belum pernah ada, tanpa warning. `is_null($belumada)` justru memicu warning `Undefined variable` sebelum mengembalikan true.\n\nOperator `??` (null coalescing) adalah `isset` yang langsung memilih: `$hasil = $kandidat ?? \"default\"` mengambil sisi kiri bila ia terpasang dan bukan null, kalau tidak ambil kanan. Ia bisa dirantai: `$a ?? $b ?? $c`. Bedakan dengan elvis `$a ?: $b` yang juga mundur ke kanan ketika kiri falsy, termasuk `0`, `\"\"`, dan `false`. Untuk arti tidak ada nilai, `??` yang benar.\n\nDi CLI ada satu nuansa: `fgets(STDIN)` mengembalikan `false` saat input habis, dan `trim(false)` menghasilkan `\"\"`. Baris yang tidak ada jadi string kosong, bukan null. Kalau ingin memperlakukan baris kosong sebagai ketiadaan, konversikan dulu: `if ($x === \"\") { $x = null; }`.",
          code: {
            language: "php",
            content: `<?php

$username = null;
echo "Masuk sebagai: " . ($username ?? "tamu") . "\\n";

$nol = 0;
echo "Skor awal: " . ($nol ?? "belum ada") . "\\n"; // 0, bukan "belum ada"

var_dump(is_null($username)); // true
var_dump(isset($belumada));   // false, tanpa warning`,
            caption: "0 bukan null; ?? hanya mundur saat nilainya benar-benar tidak ada.",
          },
        },
        {
          kind: "quiz",
          question: "Apa keluaran `echo 0 ?? \"default\";`?",
          options: ["default", "0", "null", "Terjadi error"],
          answer: 1,
          explanation:
            "0 terpasang dan bukan null, jadi ?? mengambil sisi kiri. Barulah elvis ?: yang mundur pada nilai falsy seperti 0.",
        },
        {
          kind: "code",
          title: "Sapaan dengan nama panggilan",
          prompt:
            "Baris pertama berisi nama, baris kedua berisi nama panggilan dan boleh tidak ada sama sekali. Lengkapi satu baris yang hilang supaya program memakai panggilan kalau ada, dan jatuh ke nama kalau tidak.",
          mode: "fill",
          template: `<?php

$nama = trim(fgets(STDIN));
$panggilan = trim(fgets(STDIN));

// baris kedua yang tidak ada terbaca false, lalu trim() menjadi ""
if ($panggilan === "") {
    $panggilan = null;
}

$sapaan = $panggilan ___ $nama;
echo "Hai, $sapaan!\\n";`,
          solution: `<?php

$nama = trim(fgets(STDIN));
$panggilan = trim(fgets(STDIN));

// baris kedua yang tidak ada terbaca false, lalu trim() menjadi ""
if ($panggilan === "") {
    $panggilan = null;
}

$sapaan = $panggilan ?? $nama;
echo "Hai, $sapaan!\\n";`,
          tests: [
            { stdin: "Dina Pratiwi\nDina", expectedOutput: "Hai, Dina!" },
            { stdin: "Bagas", expectedOutput: "Hai, Bagas!" },
            { stdin: "Rizky Ananda\nAnan", expectedOutput: "Hai, Anan!", hidden: true },
          ],
          hints: [
            "Yang dicari operator dengan dua tanda tanya berurutan.",
            "Operator itu mengambil sisi kiri hanya jika kiri terpasang dan bukan null.",
            "Jawabannya: $sapaan = $panggilan ?? $nama;",
          ],
        },
      ],
    },
    {
      slug: "konstanta-define-const",
      title: "Konstanta: define vs const",
      summary: "Dua pintu membuat nilai yang tidak boleh berubah, dan beda kapasitas keduanya.",
      steps: [
        {
          kind: "theory",
          title: "Nilai yang dikunci",
          body: "Konstanta menyimpan nilai tetap: dipanggil tanpa `$`, dan mengisinya ulang adalah error. Ada dua cara membuatnya. `const TARIF = 0.11;` dihitung saat kompilasi, sedangkan `define(\"TARIF\", 0.11);` dibuat saat runtime lewat pemanggilan fungsi.\n\nBeda waktunya membawa beda kemampuan. `const` hanya boleh di level atas file atau di dalam class, jadi tidak bisa berada di dalam `if`; `define` bisa, dan itu jadi pilihan satu-satunya untuk konstanta yang dibuat bersyarat. Di dalam class hanya `const` yang tersedia. Keduanya menerima ekspresi konstan: angka, string, array literal, dan konstanta lain. Nama konstanta lazim ditulis UPPER_SNAKE_CASE.\n\nSatu kejutan kecil: konstanta tidak ikut interpolasi string. `\"Tarif: TARIF\"` hanya teks biasa; untuk menampilkannya, keluar dari string dan gabung dengan titik. Cek keberadaannya dengan `defined(\"NAMA\")`.",
          code: {
            language: "php",
            content: `<?php

const VERSI = "1.4.0";
const BATAS = 3 * 10; // ekspresi konstan, dihitung saat kompilasi

if (!defined("MODE_DEBUG")) {
    define("MODE_DEBUG", false); // satu-satunya cara di dalam if
}

echo "Versi " . VERSI . ", batas " . BATAS . "\\n";
var_dump(MODE_DEBUG, defined("VERSI"));`,
            caption: "const untuk konstanta yang selalu ada; define untuk yang dibuat bersyarat.",
          },
        },
        {
          kind: "quiz",
          question: "Mana yang TIDAK bisa dilakukan oleh `const`?",
          options: [
            "Menyimpan sebuah array",
            "Memakai ekspresi dari literal dan konstanta lain",
            "Dideklarasikan di dalam blok if",
            "Dideklarasikan di dalam class",
          ],
          answer: 2,
          explanation:
            "const hanya sah di level atas file atau di dalam class. Konstanta yang dibuat bersyarat di dalam if harus lewat define().",
        },
        {
          kind: "code",
          title: "Harga dengan PPN",
          prompt:
            "Program membaca satu harga lalu mencetak harga setelah ditambah PPN 11 persen, dengan dua angka desimal. Lengkapi deklarasi konstanta tarifnya.",
          mode: "fill",
          template: `<?php

___ TARIF_PPN = 0.11;

$harga = (float) trim(fgets(STDIN));
$total = $harga * (1 + TARIF_PPN);
echo sprintf("%.2f", $total) . "\\n";`,
          solution: `<?php

const TARIF_PPN = 0.11;

$harga = (float) trim(fgets(STDIN));
$total = $harga * (1 + TARIF_PPN);
echo sprintf("%.2f", $total) . "\\n";`,
          tests: [
            { stdin: "10000", expectedOutput: "11100.00" },
            { stdin: "7200", expectedOutput: "7992.00" },
            { stdin: "0", expectedOutput: "0.00", hidden: true },
          ],
          hints: [
            "Kata kunci konstanta di level file terdiri atas lima huruf.",
            "Bentuk lengkapnya: const NAMA = nilai;",
            "Jawabannya: const TARIF_PPN = 0.11;",
          ],
        },
      ],
    },
    {
      slug: "konvensi-penamaan-psr",
      title: "Konvensi Penamaan dan PSR",
      summary: "Kesepakatan PSR-1 dan PSR-12 yang membuat kode PHP siapa pun terasa familiar.",
      steps: [
        {
          kind: "theory",
          title: "PSR: aturan main bersama",
          body: "PSR-1 dan PSR-12 adalah standar gaya dari PHP-FIG yang dipakai hampir semua proyek PHP modern. Aturan namanya: class dan interface memakai StudlyCaps (tiap kata diawali huruf besar, tanpa pemisah), method memakai camelCase, dan konstanta class memakai UPPER_SNAKE_CASE. Variabel tidak diatur PSR; komunitas lazim memakai camelCase atau snake_case asal satu proyek konsisten.\n\nDetail kecil yang sering diuji saat review: kata kunci `true`, `false`, dan `null` ditulis huruf kecil semua. File PHP murni tidak menutup tag. Satu class per file, dan nama file mengikuti nama class; kesepakatan inilah yang nanti dipakai autoloading PSR-4 saat kita masuk modul Composer.\n\nPSR-1 juga memisahkan dua dunia dalam satu file: deklarasi (class, function, constant) dan efek samping (menjalankan logika, mencetak, mengubah file). File yang mendeklarasikan tidak sekalian mengeksekusi; yang mengeksekusi tidak mendeklarasikan. Disiplin ini membuat file aman di-include tanpa efek yang tidak terduga.",
          code: {
            language: "php",
            content: `<?php

class LaporanKeuangan
{
    public const MAX_BARIS = 100;

    public function hitungTotal(array $item): float
    {
        return array_sum($item);
    }
}

// true ditulis huruf kecil semua
echo LaporanKeuangan::MAX_BARIS, "\\n";`,
            caption: "Nama class menentukan nama file; itulah kunci autoloading nanti.",
          },
        },
        {
          kind: "quiz",
          question: "Menurut PSR-1, nama class yang benar untuk laporan keuangan adalah?",
          options: ["laporan_keuangan", "laporanKeuangan", "LaporanKeuangan", "Laporan-Keuangan"],
          answer: 2,
          explanation:
            "Class memakai StudlyCaps: setiap kata diawali huruf besar tanpa pemisah. Bentuk laporanKeuangan adalah gaya method dan variabel.",
        },
        {
          kind: "quiz",
          question: "Menurut PSR-12, kapan tag penutup `?>` boleh ada di sebuah file PHP?",
          options: [
            "Selalu, karena setiap file PHP wajib ditutup",
            "Hanya di file yang berisi deklarasi class",
            "Hanya di file campuran PHP dan HTML",
            "Tidak boleh ada di file PHP mana pun",
          ],
          answer: 2,
          explanation:
            "File PHP murni dianjurkan tanpa ?> supaya tidak ada keluaran liar setelah kode. Tag penutup tetap dibutuhkan saat setelah kode PHP ada HTML yang harus dikirim.",
        },
      ],
    },
    {
      slug: "interpolasi-vs-konkatenasi",
      title: "Interpolasi vs Konkatenasi",
      summary: "Menyisipkan variabel ke string lewat kutip ganda, dan menyambung dengan titik.",
      steps: [
        {
          kind: "theory",
          title: "Dua cara menyusun kalimat",
          body: "String kutip ganda memproses karakter escape (`\\n`, `\\t`) dan melakukan interpolasi: nama variabel di dalamnya langsung diganti isinya. String kutip tunggal nyaris mentah; hanya `\\'` dan `\\\\` yang spesial. Karena itu `'Harga: $harga'` mencetak teks apa adanya.\n\nUntuk akses array atau properti di dalam string kutip ganda, pakai sintaks kurung kurawal: `\"Sisa {$stok['pensil']} buah\"`. Sintaks ini juga penanda jelas di mana nama variabelnya berakhir. Sedangkan hasil fungsi atau perhitungan tidak bisa diinterpolasi; jalur keluarnya konkatenasi dengan titik: `\"Total: \" . ($harga * 2)`.\n\nPilihan gayanya sederhana: interpolasi untuk kalimat dengan satu dua variabel karena paling mudah dibaca; konkatenasi saat menyambung banyak sumber atau memanggil fungsi. Konsistensi satu gaya dalam satu proyek lebih berharga daripada debat mana yang lebih cepat.",
          code: {
            language: "php",
            content: `<?php

$barang = "buku";
$harga = 25000;
$stok = ["pensil" => 12];

echo "1 $barang = $harga rupiah\\n";
echo "Sisa {$stok['pensil']} pensil\\n";
echo 'Harga: $harga' . "\\n"; // $harga tidak diganti
echo "Total: " . ($harga * 2) . " untuk 2 $barang\\n";`,
            caption: "Kutip tunggal menampilkan $harga apa adanya; kutip ganda menggantinya.",
          },
        },
        {
          kind: "quiz",
          question: "Apa keluaran `echo 'Hasil: $total';` jika `$total` bernilai 5?",
          options: ["Hasil: 5", "Hasil: $total", "Hasil:", "Terjadi error karena variabel tak dikenal"],
          answer: 1,
          explanation:
            "Kutip tunggal tidak menginterpolasi variabel. Teks $total dicetak apa adanya; untuk interpolasi gunakan kutip ganda.",
        },
        {
          kind: "code",
          title: "Kartu hasil belajar",
          prompt:
            "Baris pertama berisi nama, baris kedua berisi skor. Program menentukan status lulus atau remedi, lalu mencetak kartu berformat `[status] nama: skor`. Lengkapi satu baris echo dengan interpolasi.",
          mode: "fill",
          template: `<?php

$nama = trim(fgets(STDIN));
$skor = (int) trim(fgets(STDIN));
$status = $skor >= 75 ? "lulus" : "remedi";

echo "___\\n";`,
          solution: `<?php

$nama = trim(fgets(STDIN));
$skor = (int) trim(fgets(STDIN));
$status = $skor >= 75 ? "lulus" : "remedi";

echo "[$status] $nama: $skor\\n";`,
          tests: [
            { stdin: "Dina\n80", expectedOutput: "[lulus] Dina: 80" },
            { stdin: "Bagas\n52", expectedOutput: "[remedi] Bagas: 52" },
            { stdin: "Rani\n75", expectedOutput: "[lulus] Rani: 75", hidden: true },
          ],
          hints: [
            "Semua yang perlu disisipkan sudah ada di variabel $status, $nama, dan $skor.",
            "Tanda kurung siku boleh ditulis langsung di dalam string kutip ganda karena bukan sintaks array.",
            "Jawabannya: \"[$status] $nama: $skor\".",
          ],
        },
      ],
    },
    {
      slug: "latihan-gabungan-php-0",
      title: "Latihan Gabungan Modul 0",
      summary: "Konstanta, perbandingan yang tepat, dan format desimal dalam satu program struk.",
      steps: [
        {
          kind: "theory",
          title: "Merangkai kebiasaan modul ini",
          body: "Program struk mini ini merangkai modul: baca nama barang, harga, dan jumlah, lalu jika total melampaui batas tertentu, potong 10 persen. Semua kebiasaan yang baru dilatih hadir sekaligus: `const` untuk nilai tetap, konversi input dengan cast karena `fgets()` selalu memberi string, dan `sprintf(\"%.2f\", ...)` untuk memformat dua desimal.\n\nPerhatikan juga urutannya: konversi tipe dilakukan tepat setelah membaca input, sehingga perbandingan `$total >= BATAS_DISKON` membandingkan float dengan float, bukan string dengan angka. Itulah gaya yang mencegah jebakan coercion sejak awal.",
          code: {
            language: "php",
            content: `<?php

const BATAS_DISKON = 100000.0;
const DISKON = 0.1;

// total di atas BATAS_DISKON dipotong DISKON
// keluaran: "Nama: total" dengan dua desimal`,
            caption: "Gambaran program yang akan kamu lengkapi di langkah berikutnya.",
          },
        },
        {
          kind: "code",
          title: "Struk dengan diskon bertingkat",
          prompt:
            "Lengkapi kondisi diskonnya: total sama dengan atau di atas batas dipotong sesuai konstanta DISKON. Selain bagian `___`, semua barisnya sudah benar.",
          mode: "fill",
          template: `<?php

const BATAS_DISKON = 100000.0;
const DISKON = 0.1;

$barang = trim(fgets(STDIN));
$harga = (float) trim(fgets(STDIN));
$jumlah = (int) trim(fgets(STDIN));
$total = $harga * $jumlah;

if ($total ___ BATAS_DISKON) {
    $total = $total * (1 - DISKON);
}

echo $barang . ": " . sprintf("%.2f", $total) . "\\n";`,
          solution: `<?php

const BATAS_DISKON = 100000.0;
const DISKON = 0.1;

$barang = trim(fgets(STDIN));
$harga = (float) trim(fgets(STDIN));
$jumlah = (int) trim(fgets(STDIN));
$total = $harga * $jumlah;

if ($total >= BATAS_DISKON) {
    $total = $total * (1 - DISKON);
}

echo $barang . ": " . sprintf("%.2f", $total) . "\\n";`,
          tests: [
            { stdin: "Buku\n25000\n5", expectedOutput: "Buku: 112500.00" },
            { stdin: "Pensil\n2000\n10", expectedOutput: "Pensil: 20000.00" },
            { stdin: "Gelas\n15000\n10", expectedOutput: "Gelas: 135000.00", hidden: true },
          ],
          hints: [
            "Syaratnya: total sama dengan atau di atas batas diskon.",
            "Operator perbandingan lebih besar atau sama ditulis dua karakter.",
            "Jawabannya: >=.",
          ],
        },
      ],
    },
    // ==================== MODUL 1: Array Secara Dalam ====================
    {
      slug: "array-list-dan-map",
      title: "Array: List dan Map",
      summary: "Satu tipe array untuk dua peran: barisan berindeks dan peta kunci ke nilai.",
      steps: [
        {
          kind: "theory",
          title: "Ordered map berpakaian list",
          body: "PHP hanya punya satu tipe array: peta terurut dari kunci ke nilai. Tanpa kunci eksplisit, PHP memberi kunci int berurutan mulai dari 0, sehingga array terlihat seperti list di bahasa lain. Dengan `=>`, kuncinya kamu yang menentukan, boleh int atau string. List dan map di bahasa lain sama-sama array di PHP.\n\nAturan kunci otomatisnya: elemen tanpa kunci diberi kunci int terbesar ditambah satu. `[5 => \"lima\", \"enam\"]` menyimpan `\"enam\"` di kunci 6. Kunci yang sama ditulis dua kali membuat yang belakangan menang. Campuran kunci int dan string dalam satu array sah dan kadang berguna.\n\nMembaca kunci yang tidak ada dengan kurung siku memicu warning `Undefined array key` dan menghasilkan null. Untuk kunci yang mungkin tidak ada, pakai `$arr[$k] ?? default`: operator ini berbasis isset sehingga bekerja tanpa warning.",
          code: {
            language: "php",
            content: `<?php

$huruf = ["a", "b", "c"]; // kunci 0, 1, 2 diberi otomatis
$kata = ["kopi" => "coffee", "teh" => "tea"];
$campur = [5 => "lima", "enam"]; // "enam" berada di kunci 6

print_r($huruf);
echo $kata["kopi"], "\\n";
echo $campur[5], " lalu ", $campur[6], "\\n";
echo $kata["gula"] ?? "tidak terdaftar", "\\n";`,
            caption: "print_r menampilkan kunci secara eksplisit; perhatikan kunci 6 pada $campur.",
          },
        },
        {
          kind: "quiz",
          question: "Setelah `$a = [7 => \"x\"];` lalu `$a[] = \"y\";`, di kunci berapa `\"y\"` disimpan?",
          options: ["0", "7", "8", "Terjadi warning karena kunci campuran"],
          answer: 2,
          explanation:
            "Penambahan tanpa kunci memakai kunci int terbesar ditambah satu. Kunci terbesar 7, jadi \"y\" disimpan di kunci 8.",
        },
        {
          kind: "code",
          title: "Kamus harga",
          prompt:
            "Baris pertama berisi n. n baris berikutnya berisi `nama harga`. Simpan semuanya ke array asosiatif, lalu baca satu nama barang dan cetak harganya, atau `tidak ada` bila tidak terdaftar. Lengkapi baris pengisian array.",
          mode: "fill",
          template: `<?php

$n = (int) trim(fgets(STDIN));
$harga = [];
for ($i = 0; $i < $n; $i++) {
    $bagian = explode(" ", trim(fgets(STDIN)));
    $harga[___] = (int) $bagian[1];
}

$cari = trim(fgets(STDIN));
echo $harga[$cari] ?? "tidak ada";
echo "\\n";`,
          solution: `<?php

$n = (int) trim(fgets(STDIN));
$harga = [];
for ($i = 0; $i < $n; $i++) {
    $bagian = explode(" ", trim(fgets(STDIN)));
    $harga[$bagian[0]] = (int) $bagian[1];
}

$cari = trim(fgets(STDIN));
echo $harga[$cari] ?? "tidak ada";
echo "\\n";`,
          tests: [
            { stdin: "3\nkopi 3000\nteh 2000\nroti 1500\nteh", expectedOutput: "2000" },
            { stdin: "2\nsusu 5000\nkeju 8000\nkeju", expectedOutput: "8000" },
            { stdin: "1\nmadu 25000\nsusu", expectedOutput: "tidak ada", hidden: true },
          ],
          hints: [
            "Nama barang ada di hasil explode, tepat di indeks 0.",
            "Kunci array-nya nama barangnya, bukan angka dari loop.",
            "Jawabannya: $harga[$bagian[0]] = (int) $bagian[1];",
          ],
        },
      ],
    },
    {
      slug: "tambah-hapus-elemen",
      title: "Menambah dan Menghapus Elemen",
      summary: "Append, unshift, pop, dan unset beserta efek masing-masing pada indeks.",
      steps: [
        {
          kind: "theory",
          title: "Tumbuh, menyusut, dan berlubang",
          body: "Menambah di ekor ada dua cara: `$arr[] = nilai` yang paling ringkas, atau `array_push($arr, a, b)` untuk beberapa elemen sekaligus. Menyisipkan di kepala memakai `array_unshift`; mengambil dari ekor `array_pop`; dari kepala `array_shift`. Dari segi indeks: yang bekerja di ekor (`$arr[]`, `array_push`, `array_pop`) tidak menggeser siapa pun; yang menomori ulang semua elemen hanyalah `array_shift` dan `array_unshift` karena keduanya menyentuh kepala array. Nilai kembaliannya pun berbeda: `array_shift` dan `array_pop` mengembalikan elemennya, sedangkan `array_unshift` dan `array_push` mengembalikan jumlah elemen.\n\n`unset($arr[$k])` menghapus satu kunci tanpa menggeser sisanya. Array bisa jadi berlubang: `count` turun, tapi kunci 1 bisa saja tidak ada sementara 0 dan 2 ada. Untuk array berindeks yang harus kembali rapi 0, 1, 2, lewati hasilnya ke `array_values`.\n\nPada array asosiatif, `unset` justru cara hapus yang paling wajar: kuncinya bermakna dan tidak ada urutan yang harus dijaga.",
          code: {
            language: "php",
            content: `<?php

$tumpukan = ["a", "b", "c"];
$tumpukan[] = "d";             // kunci 3
array_unshift($tumpukan, "z"); // z, a, b, c, d
unset($tumpukan[1]);           // a hilang, indeks lain TIDAK digeser

print_r($tumpukan); // kunci 0, 2, 3, 4
echo count($tumpukan), "\\n";
print_r(array_values($tumpukan)); // rapi lagi: 0, 1, 2, 3`,
            caption: "unset membuat lubang pada kunci; array_values menata ulang kuncinya.",
          },
        },
        {
          kind: "quiz",
          question: "Setelah `$a = [10, 20, 30]; unset($a[1]);`, berapa `count($a)` dan apa saja kuncinya?",
          options: [
            "2 dengan kunci 0 dan 1",
            "2 dengan kunci 0 dan 2",
            "3 dengan kunci 0, 1, dan 2",
            "count menghasilkan error karena array berlubang",
          ],
          answer: 1,
          explanation:
            "unset menghapus tanpa menggeser elemen lain. Tersisa 10 di kunci 0 dan 30 di kunci 2, sehingga count 2 dan kuncinya 0 serta 2.",
        },
        {
          kind: "code",
          title: "Buang satu posisi",
          prompt:
            "Baris pertama berisi n, lalu n bilangan satu per baris, lalu satu posisi yang harus dibuang (mulai 0). Hapus elemen di posisi itu tanpa menggeser yang lain, cetak sisa jumlah elemennya, lalu isinya dipisah koma sesuai urutan asli.",
          mode: "fill",
          template: `<?php

$n = (int) trim(fgets(STDIN));
$angka = [];
for ($i = 0; $i < $n; $i++) {
    $angka[] = (int) trim(fgets(STDIN));
}
$posisi = (int) trim(fgets(STDIN));

___($angka[$posisi]);

echo count($angka) . "\\n";
echo implode(",", array_values($angka)) . "\\n";`,
          solution: `<?php

$n = (int) trim(fgets(STDIN));
$angka = [];
for ($i = 0; $i < $n; $i++) {
    $angka[] = (int) trim(fgets(STDIN));
}
$posisi = (int) trim(fgets(STDIN));

unset($angka[$posisi]);

echo count($angka) . "\\n";
echo implode(",", array_values($angka)) . "\\n";`,
          tests: [
            { stdin: "4\n5\n10\n15\n20\n1", expectedOutput: "3\n5,15,20" },
            { stdin: "3\n1\n2\n3\n0", expectedOutput: "2\n2,3" },
            { stdin: "5\n9\n8\n7\n6\n5\n4", expectedOutput: "4\n9,8,7,6", hidden: true },
          ],
          hints: [
            "Konstruksi bahasa yang biasa menghapus variabel juga bisa menghapus kunci array.",
            "Yang dicari menghapus tanpa menggeser indeks elemen lain sama sekali.",
            "Jawabannya: unset($angka[$posisi]);",
          ],
        },
      ],
    },
    {
      slug: "foreach-dengan-key",
      title: "foreach dengan Key",
      summary: "Iterasi pasangan kunci dan nilai, serta apa yang terjadi saat elemen diubah di tengah loop.",
      steps: [
        {
          kind: "theory",
          title: "Dua variabel per putaran",
          body: "`foreach ($arr as $k => $v)` memberi kunci dan nilai pada setiap putaran; pada list, `$k` adalah indeksnya. Versi satu variabel `foreach ($arr as $v)` cukup bila kunci tidak dibutuhkan. Untuk loop pendek, nama `$k` dan `$v` lazim; untuk loop panjang, pakai nama bermakna seperti `$barang => $stok`.\n\nMengubah `$v` langsung tidak menyentuh array, karena `$v` adalah salinan nilai. Untuk mengubah isi selama iterasi, tulis kembali lewat kuncinya: `$arr[$k] = nilaiBaru`. Cara ini aman dan jelas maksudnya.\n\nSatu fakta yang jarang diketahui: foreach dengan nilai mengiterasi potret array saat loop dimulai. Menambah elemen di dalam loop tidak memperpanjang iterasi, meski array aslinya bertambah. Perilaku berbeda berlaku untuk foreach by reference yang dibahas di lesson referensi.",
          code: {
            language: "php",
            content: `<?php

$stok = ["pensil" => 12, "buku" => 5, "tas" => 2];

foreach ($stok as $barang => $jumlah) {
    echo "$barang: $jumlah\\n";
}

// ubah lewat kunci agar array aslinya ikut berubah
foreach ($stok as $barang => $jumlah) {
    if ($jumlah < 10) {
        $stok[$barang] = 0;
    }
}
print_r($stok);`,
            caption: "Yang ditulis adalah $stok[$barang], bukan $jumlah.",
          },
        },
        {
          kind: "quiz",
          question: "Setelah `foreach ($angka as $v) { $v = 99; }` dengan `$angka = [1, 2, 3];`, apa isi `$angka`?",
          options: ["[99, 99, 99]", "[1, 2, 3]", "[99]", "Terjadi error karena array berubah saat iterasi"],
          answer: 1,
          explanation:
            "$v hanyalah salinan nilai, jadi mengubahnya tidak menyentuh array. Untuk mengubah isi selama loop, tulis lewat kunci: $angka[$k] = 99.",
        },
        {
          kind: "code",
          title: "Restock gudang",
          prompt:
            "Baris pertama berisi n. n baris berikutnya berisi `nama jumlah` sebagai stok awal. Baris terakhir berisi `nama tambahan` untuk menambah stok barang itu. Cetak seluruh stok akhir berformat `nama: jumlah` sesuai urutan awal. Lengkapi foreach-nya.",
          mode: "fill",
          template: `<?php

$n = (int) trim(fgets(STDIN));
$stok = [];
for ($i = 0; $i < $n; $i++) {
    $bagian = explode(" ", trim(fgets(STDIN)));
    $stok[$bagian[0]] = (int) $bagian[1];
}
$tambahan = explode(" ", trim(fgets(STDIN)));
$stok[$tambahan[0]] += (int) $tambahan[1];

foreach (___ as $nama => $jumlah) {
    echo "$nama: $jumlah\\n";
}`,
          solution: `<?php

$n = (int) trim(fgets(STDIN));
$stok = [];
for ($i = 0; $i < $n; $i++) {
    $bagian = explode(" ", trim(fgets(STDIN)));
    $stok[$bagian[0]] = (int) $bagian[1];
}
$tambahan = explode(" ", trim(fgets(STDIN)));
$stok[$tambahan[0]] += (int) $tambahan[1];

foreach ($stok as $nama => $jumlah) {
    echo "$nama: $jumlah\\n";
}`,
          tests: [
            { stdin: "3\nkopi 5\nteh 2\nroti 7\nteh 10", expectedOutput: "kopi: 5\nteh: 12\nroti: 7" },
            { stdin: "2\npensil 4\nbuku 9\npensil 6", expectedOutput: "pensil: 10\nbuku: 9" },
            { stdin: "1\nkunci 3\nkunci 0", expectedOutput: "kunci: 3", hidden: true },
          ],
          hints: [
            "Array yang menyimpan stok bernama $stok.",
            "Foreach asosiatif memakai pola as $kunci => $nilai.",
            "Jawabannya: $stok.",
          ],
        },
      ],
    },
    {
      slug: "fungsi-array-inti",
      title: "Fungsi Array Inti",
      summary: "count, in_array, array_search, array_keys, dan array_values yang dipakai setiap hari.",
      steps: [
        {
          kind: "theory",
          title: "Peralatan wajib yang harus lancar",
          body: "`count($arr)` menghitung elemen. `in_array($jarum, $jerami)` memeriksa keberadaan nilai, dengan satu jebakan: secara bawaan ia memakai `==`, sehingga `in_array(\"1\", [1, 2])` bernilai true. Beri argumen ketiga `true` untuk memaksa perbandingan identik; kebiasaan baik adalah selalu mengirimnya.\n\n`array_search($jarum, $jerami)` mengembalikan kunci pertama yang cocok, atau `false` bila tidak ada. Karena kunci sah bisa bernilai 0, pemeriksaannya wajib `!== false`; `if ($hasil)` akan salah menilai kunci 0 sebagai tidak ketemu. Dua fungsi ini pun menerima argumen ketiga strict.\n\n`array_keys($arr)` mengumpulkan semua kunci; dengan argumen kedua, ia mencari kunci dari nilai tertentu. `array_values($arr)` membuang kunci dan merapikan array jadi list 0, 1, 2. Untuk kunci asosiatif, ingat beda `isset($arr[$k])` yang menganggap nilai null sebagai tidak ada, dengan `array_key_exists($k, $arr)` yang membedakannya.",
          code: {
            language: "php",
            content: `<?php

$peserta = ["dina", "bagas", "rani", "dina"];

echo count($peserta), "\\n";               // 4
var_dump(in_array("rani", $peserta));     // true
var_dump(in_array("1", [1, 2]));          // true: mode lemah!
var_dump(array_search("dina", $peserta)); // int(0)
print_r(array_keys($peserta, "dina"));    // kunci 0 dan 3
print_r(array_values(["a" => 1, "b" => 2])); // 1 dan 2 tanpa kunci`,
            caption: "Argumen ketiga in_array dan array_search memaksa perbandingan identik.",
          },
        },
        {
          kind: "quiz",
          question: "Apa hasil `in_array(\"1\", [1, 2, 3])`?",
          options: [
            "false, karena tipe keduanya berbeda",
            "true, karena perbandingan lemah mengubah \"1\" menjadi 1",
            "Warning karena tipe elemen campuran",
            "null, karena string tidak ditemukan",
          ],
          answer: 1,
          explanation:
            "Tanpa argumen ketiga, in_array memakai == sehingga \"1\" dipaksa menjadi 1. Beri true sebagai argumen ketiga agar perbandingannya identik.",
        },
        {
          kind: "quiz",
          question: "Cara aman memeriksa hasil `array_search` yang bisa berupa kunci 0 atau `false`?",
          options: [
            "if ($hasil) {",
            "if ($hasil != false) {",
            "if ($hasil !== false) {",
            "if (count($hasil) > 0) {",
          ],
          answer: 2,
          explanation:
            "Kunci 0 setara false pada perbandingan lemah, jadi if ($hasil) dan != false sama-sama salah tuduh. Hanya !== false yang membedakan nilai 0 dari false.",
        },
      ],
    },
    {
      slug: "array-map-filter",
      title: "array_map dan array_filter",
      summary: "Mengubah setiap elemen dan menyaring yang lolos syarat, tanpa loop manual.",
      steps: [
        {
          kind: "theory",
          title: "Pipa dua tahap",
          body: "`array_map($callback, $arr)` memanggil callback untuk setiap elemen lalu mengembalikan array baru yang panjangnya sama; array asli tidak tersentuh. Callback boleh berupa nama fungsi yang ditulis sebagai string: `array_map(\"strlen\", $kata)` atau fungsi buatanmu sendiri seperti contoh di bawah.\n\n`array_filter($arr, $callback)` menyimpan elemen yang callbacknya true. Kunci asli dipertahankan, sehingga menyaring array berindeks bisa menghasilkan array berlubang. Panggil `array_values` setelahnya bila kuncinya harus kembali rapi 0, 1, 2, terutama sebelum di-implode atau dihitung posisinya.\n\nTanpa callback, `array_filter($arr)` membuang semua elemen falsy: `0`, `\"\"`, `null`, `false`, dan array kosong. Praktis sesekali, tapi pastikan niatmu memang membuang falsy, bukan sekadar elemen tertentu.",
          code: {
            language: "php",
            content: `<?php

function kuadratkan($x)
{
    return $x * $x;
}

function genap($x)
{
    return $x % 2 === 0;
}

$angka = [3, -2, 4, -1, 6];

print_r(array_map("kuadratkan", $angka)); // 9, 4, 16, 1, 36
print_r(array_filter($angka, "genap"));   // kunci 1, 2, 4
print_r(array_values(array_filter($angka, "genap"))); // rapi lagi`,
            caption: "array_filter mempertahankan kunci asli; array_values menata ulang.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa `array_values` sering menyusul `array_filter` pada list?",
          options: [
            "Supaya hasilnya menjadi array asosiatif",
            "Karena filter mengembalikan null saat hasilnya kosong",
            "Karena filter mempertahankan kunci asli sehingga indeks bisa berlubang",
            "Supaya elemennya ikut terurut",
          ],
          answer: 2,
          explanation:
            "Elemen yang gugur filter meninggalkan celah pada kunci. array_values merapikan kunci kembali menjadi 0, 1, 2, dan seterusnya.",
        },
        {
          kind: "code",
          title: "Saring panjang kata",
          prompt:
            "Program menghitung panjang tiap kata pada satu baris input, lalu menyimpan panjang yang minimal 5 dan mencetaknya dipisah koma. Sekarang batasnya salah sehingga panjang tepat 5 ikut terbuang. Temukan satu kesalahannya dan perbaiki.",
          mode: "fix",
          template: `<?php

function cukupPanjang($n)
{
    return $n > 5;
}

$kata = explode(" ", trim(fgets(STDIN)));
$panjang = array_map("strlen", $kata);
$cukup = array_values(array_filter($panjang, "cukupPanjang"));
echo implode(",", $cukup) . "\\n";`,
          solution: `<?php

function cukupPanjang($n)
{
    return $n >= 5;
}

$kata = explode(" ", trim(fgets(STDIN)));
$panjang = array_map("strlen", $kata);
$cukup = array_values(array_filter($panjang, "cukupPanjang"));
echo implode(",", $cukup) . "\\n";`,
          tests: [
            { stdin: "belajar semua hal baru", expectedOutput: "7,5" },
            { stdin: "kita semua sedang belajar", expectedOutput: "5,6,7" },
            { stdin: "empat lima", expectedOutput: "5", hidden: true },
          ],
          hints: [
            "Jalankan tes kedua: panjang tepat 5 dari kata semua hilang dari hasil.",
            "Syarat soalnya minimal 5, bukan di atas 5.",
            "Ganti $n > 5 menjadi $n >= 5 pada fungsi cukupPanjang.",
          ],
        },
      ],
    },
    {
      slug: "array-reduce",
      title: "array_reduce",
      summary: "Melingkupkan seluruh array menjadi satu nilai lewat akumulator.",
      steps: [
        {
          kind: "theory",
          title: "Menjadi satu",
          body: "`array_reduce($arr, $callback, $awal)` menyeret seluruh array menjadi satu nilai. Callback menerima dua argumen, akumulator dan elemen saat ini, lalu mengembalikan akumulator yang baru. Putaran terakhir menghasilkan nilai akhirnya. Cocok untuk penjumlahan custom, menggabungkan string, atau mencari nilai terbaik dengan aturan sendiri.\n\nNilai awal bukan formalitas: ia akumulator pada putaran pertama sekaligus hasil untuk array kosong. Tanpa nilai awal, akumulator pertama diambil dari elemen pertama, dan array kosong menghasilkan null, bukan nol. Beda kecil yang sering memicu bug saat hasilnya dipakai menghitung.\n\nJangan memaksa reduce untuk semua hal: `array_sum`, `count`, `max`, dan `min` sudah ada dan lebih jelas niatnya. `array_reduce` bersinar saat aturannya memang khas milikmu sendiri, seperti menyusun label `a,b,c` dari array.",
          code: {
            language: "php",
            content: `<?php

function jumlahkan($bawa, $item)
{
    return $bawa + $item;
}

$belanja = [2500, 4000, 3500];
echo array_reduce($belanja, "jumlahkan", 0), "\\n"; // 10000
echo array_reduce($belanja, "jumlahkan"), "\\n";    // 10000 juga, dari elemen pertama

var_dump(array_reduce([], "jumlahkan", 0)); // int(0): nilai awal dipakai
var_dump(array_reduce([], "jumlahkan"));    // NULL: tanpa nilai awal`,
            caption: "Tanpa nilai awal, array kosong menghasilkan null, bukan 0.",
          },
        },
        {
          kind: "quiz",
          question: "Apa hasil `array_reduce([], \"jumlahkan\", 100)`?",
          options: ["null", "100", "0", "Terjadi error karena array kosong"],
          answer: 1,
          explanation:
            "Array kosong berarti callback tidak pernah dipanggil, sehingga hasilnya langsung nilai awal, yaitu 100. Tanpa nilai awal barulah hasilnya null.",
        },
        {
          kind: "quiz",
          question:
            "Diberikan `function kurangi($b, $x) { return $b - $x; }`, berapa hasil `array_reduce([10, 20], \"kurangi\", 100)`?",
          options: ["70", "-70", "110", "90"],
          answer: 0,
          explanation:
            "100 menjadi akumulator awal, dikurangi 10 menjadi 90, lalu dikurangi 20 menjadi 70. Urutan callback-nya: kurangi(kurangi(100, 10), 20).",
        },
      ],
    },
    {
      slug: "mengurutkan-array",
      title: "Mengurutkan Array",
      summary: "sort, ksort, asort, dan usort: masing-masing punya urusan berbeda dengan kunci.",
      steps: [
        {
          kind: "theory",
          title: "Empat fungsi satu keluarga",
          body: "`sort($arr)` mengurutkan nilai menaik dan menyusun ulang kunci menjadi 0, 1, 2; `rsort` ke arah menurun. Keduanya bekerja langsung pada array (in place) dan mengembalikan true, bukan array baru. Lupa sifat ini sering membuat orang menampung hasilnya dan kehilangan data.\n\nUntuk array asosiatif ada pasangan lain: `ksort` mengurutkan berdasar kunci, `asort` berdasar nilai, dan keduanya mempertahankan pasangan kunci-nilai. Kebalikannya `krsort` dan `arsort`. Pilih berdasar dua pertanyaan: mengurutkan menurut apa, dan apakah kunci harus utuh.\n\n`usort($arr, $pembanding)` menyerahkan aturan ke kamu. Pembanding menerima dua elemen dan mengembalikan negatif, nol, atau positif. Operator `<=>` (spaceship) menghitung itu dalam sekali tulis: `$a <=> $b` untuk menaik, `$b <=> $a` untuk menurun. Sejak PHP 8, pengurutan PHP stabil: elemen yang bandingnya 0 mempertahankan urutan aslinya.",
          code: {
            language: "php",
            content: `<?php

function turun($a, $b)
{
    return $b <=> $a;
}

$nilai = [40, 10, 35];
sort($nilai);
print_r($nilai); // 10, 35, 40

$stok = ["buku" => 3, "tas" => 1, "pensil" => 10];
asort($stok); // urut berdasar nilai, kunci tetap utuh
print_r($stok);

$skor = [80, 95, 70];
usort($skor, "turun");
print_r($skor); // 95, 80, 70`,
            caption: "sort merapikan kunci; asort menjaga kunci; usort menerima aturanmu sendiri.",
          },
        },
        {
          kind: "quiz",
          question: "Fungsi mana yang mengurutkan array asosiatif berdasarkan NILAI tanpa merusak kuncinya?",
          options: ["sort", "ksort", "asort", "usort"],
          answer: 2,
          explanation:
            "asort mengurutkan berdasar nilai dan mempertahankan pasangan kunci-nilai. sort justru menyusun ulang kunci, sedangkan ksort mengurutkan berdasar kuncinya.",
        },
        {
          kind: "code",
          title: "Papan skor menurun",
          prompt:
            "Baris pertama berisi n, lalu n bilangan satu per baris. Urutkan menurun memakai usort dengan fungsi pembanding yang sudah disediakan, lalu cetak hasilnya dipisah spasi.",
          mode: "fill",
          template: `<?php

function turun($a, $b)
{
    return $b <=> $a;
}

$n = (int) trim(fgets(STDIN));
$angka = [];
for ($i = 0; $i < $n; $i++) {
    $angka[] = (int) trim(fgets(STDIN));
}

___($angka, "turun");

echo implode(" ", $angka) . "\\n";`,
          solution: `<?php

function turun($a, $b)
{
    return $b <=> $a;
}

$n = (int) trim(fgets(STDIN));
$angka = [];
for ($i = 0; $i < $n; $i++) {
    $angka[] = (int) trim(fgets(STDIN));
}

usort($angka, "turun");

echo implode(" ", $angka) . "\\n";`,
          tests: [
            { stdin: "4\n3\n1\n4\n1", expectedOutput: "4 3 1 1" },
            { stdin: "5\n10\n-2\n7\n7\n0", expectedOutput: "10 7 7 0 -2" },
            { stdin: "1\n42", expectedOutput: "42", hidden: true },
          ],
          hints: [
            "Fungsi pengurut yang menerima pembanding khusus diawali huruf u.",
            "Fungsi itu mengubah array langsung; nilainya true, bukan array baru.",
            "Jawabannya: usort($angka, \"turun\");",
          ],
        },
      ],
    },
    {
      slug: "destructuring-list",
      title: "Destructuring dengan list()",
      summary: "Membongkar array ke beberapa variabel dalam satu baris, termasuk menukar dua nilai.",
      steps: [
        {
          kind: "theory",
          title: "Bongkar sekali jalan",
          body: "`[$a, $b] = $arr;` menugaskan elemen array ke variabel sekaligus. Bentuk lama `list($a, $b) = $arr;` bermakna sama dan masih sah. Posisi boleh dilewati dengan kosong: `[, $kedua] = $arr;`. Untuk array asosiatif, sebut kuncinya: `[\"nama\" => $n, \"skor\" => $s] = $pemain;`.\n\nDua pola yang paling sering dipakai kerja: menukar dua variabel tanpa tempat bantu, `[$a, $b] = [$b, $a];`, dan membongkar hasil `explode`: `[$nama, $skor] = explode(\" \", $baris);`. Keduanya memangkas tiga baris penugasan menjadi satu.\n\nPerhatikan batasnya: elemen yang tidak ada menghasilkan null disertai warning `Undefined array key`. Destructuring tidak error dan tidak mengisi default; kalau butuh cadangan, saring dengan `??` pada variabel setelahnya.",
          code: {
            language: "php",
            content: `<?php

$titik = [3, 8];
[$x, $y] = $titik;

["nama" => $nama, "skor" => $s] = ["nama" => "Dina", "skor" => 90];

$a = 1;
$b = 2;
[$a, $b] = [$b, $a]; // tukar tanpa variabel bantu

[, $kedua] = [10, 20, 30]; // lewati posisi pertama

echo "$x $y $nama $s $a $b $kedua\\n";`,
            caption: "Satu baris destructuring menggantikan beberapa baris penugasan.",
          },
        },
        {
          kind: "quiz",
          question: "Setelah `[$a, $b] = [1];`, apa nilai `$a` dan `$b`?",
          options: [
            "1 dan null, disertai warning",
            "1 dan 0",
            "Keduanya null",
            "Fatal error karena jumlahnya tidak cocok",
          ],
          answer: 0,
          explanation:
            "Elemen kedua tidak ada, sehingga $b bernilai null dan PHP menyalakan warning Undefined array key. Destructuring tidak mengisi default secara otomatis.",
        },
        {
          kind: "code",
          title: "Tukar tanpa gelas bantu",
          prompt:
            "Program membaca dua bilangan lalu harus mencetaknya dalam urutan terbalik. Tukar isinya memakai destructuring tanpa variabel tambahan. Ganti setiap `___` dengan variabel yang tepat.",
          mode: "fill",
          template: `<?php

$a = (int) trim(fgets(STDIN));
$b = (int) trim(fgets(STDIN));

[___, ___] = [___, ___];

echo "$a $b\\n";`,
          solution: `<?php

$a = (int) trim(fgets(STDIN));
$b = (int) trim(fgets(STDIN));

[$b, $a] = [$a, $b];

echo "$a $b\\n";`,
          tests: [
            { stdin: "3\n8", expectedOutput: "8 3" },
            { stdin: "10\n-5", expectedOutput: "-5 10" },
            { stdin: "0\n7", expectedOutput: "7 0", hidden: true },
          ],
          hints: [
            "Sisi kanan membuat array baru berisi nilai lama sebelum hasilnya ditugaskan kembali.",
            "Urutan di sisi kiri harus kebalikan sisi kanan supaya isinya benar-benar tertukar.",
            "Jawabannya: [$b, $a] = [$a, $b];",
          ],
        },
      ],
    },
    {
      slug: "referensi-array",
      title: "Referensi dan Tanda &",
      summary: "Penugasan array menyalin isi; tanda & membuat alias yang berbagi data yang sama.",
      steps: [
        {
          kind: "theory",
          title: "Salinan dan alias",
          body: "`$b = $a;` pada array membuat salinan isi (di belakang layar lewat copy on write, jadi murah sampai salah satunya benar-benar diubah). Mengubah `$b` tidak menyentuh `$a`. Ini berbeda dari objek, yang salinannya berbagi data yang sama.\n\n`$c = &$a;` membuat alias: `$c` dan `$a` adalah dua nama untuk satu data, dan perubahan lewat salah satunya terlihat di keduanya. Kekuatan sekaligus bahayanya satu paket; karena alur data jadi tersirat, gaya PHP modern memakai referensi secukupnya dan lebih memilih mengembalikan nilai baru.\n\nBentuk yang paling sering ditemui adalah foreach by reference: `foreach ($arr as &$v)` mengizinkan mengubah elemen langsung. Kewajibannya dua. Setelah loop, panggil `unset($v);` karena `$v` masih terikat referensi ke elemen terakhir; menulis `$v` tanpa sengaja berarti mengubah array. Dan ingat foreach by reference mengiterasi array hidup, bukan potret.",
          code: {
            language: "php",
            content: `<?php

$a = [1, 2, 3];
$b = $a;     // salinan
$b[0] = 99;
print_r($a); // tetap 1, 2, 3

$c = &$a;    // alias
$c[1] = 77;
print_r($a); // 1, 77, 3: berubah lewat $c

$angka = [1, 2, 3];
foreach ($angka as &$v) {
    $v *= 10;
}
unset($v);       // wajib: putus ikatan referensi
print_r($angka); // 10, 20, 30`,
            caption: "Satu tanda & mengubah makna penugasan: dari menyalin menjadi berbagi.",
          },
        },
        {
          kind: "quiz",
          question: "Setelah `$a = [1, 2, 3]; $b = $a; $b[0] = 99;`, berapa `$a[0]`?",
          options: ["99", "1", "null", "Tergantung versi PHP"],
          answer: 1,
          explanation:
            "Penugasan array menyalin isinya; setelah itu $b punya data sendiri. Hanya penugasan dengan & yang membuat dua nama berbagi data yang sama.",
        },
        {
          kind: "quiz",
          question: "Kenapa `unset($v);` dianjurkan setelah `foreach ($arr as &$v) { ... }`?",
          options: [
            "Agar memori array langsung dibebaskan",
            "Agar $v berhenti menunjuk elemen terakhir yang masih terikat referensi",
            "Karena $v wajib dihapus supaya loop berikutnya bisa berjalan",
            "Supaya array kembali terurut",
          ],
          answer: 1,
          explanation:
            "Setelah loop, $v masih referensi ke elemen terakhir. Menulis ke $v setelahnya tanpa sengaja akan mengubah elemen itu; unset memutus ikatannya.",
        },
      ],
    },
    {
      slug: "latihan-gabungan-php-1",
      title: "Latihan Gabungan Modul 1",
      summary: "Filter, urut menurun, dan iterasi hasil dalam satu program papan kelulusan.",
      steps: [
        {
          kind: "theory",
          title: "Satu pipa penuh",
          body: "Program penutup modul ini menyatukan gerakannya: baca n peserta berformat `nama skor`, saring yang skornya minimal 70 dengan `array_filter`, urutkan skornya menurun dengan `usort`, lalu cetak dengan foreach.\n\nDua detail teknis patut dicermati. Callback `usort` di contoh ditulis sebagai fungsi tanpa nama di tempatnya dipakai; bentuk lengkapnya dibahas di modul Fungsi dan Scope, untuk sekarang cukup pahami ia menerima dua peserta dan mengembalikan hasil `<=>`. Lalu urutan panggilan penting: filter dulu agar yang diurutkan sedikit, dan `usort` menyusun ulang kunci sehingga lubang sisa filter tidak menjadi masalah.",
          code: {
            language: "php",
            content: `<?php

// tiap peserta: ["nama" => string, "skor" => int]
// saring skor >= 70, urutkan skor tertinggi dulu, lalu cetak "nama: skor"`,
            caption: "Gambaran program yang akan kamu lengkapi di langkah berikutnya.",
          },
        },
        {
          kind: "code",
          title: "Papan kelulusan",
          prompt:
            "Lengkapi dua bagian yang hilang: syarat filter skor minimal 70, dan pembanding usort yang mengurutkan skor dari tertinggi.",
          mode: "fill",
          template: `<?php

$n = (int) trim(fgets(STDIN));
$peserta = [];
for ($i = 0; $i < $n; $i++) {
    [$nama, $skor] = explode(" ", trim(fgets(STDIN)));
    $peserta[] = ["nama" => $nama, "skor" => (int) $skor];
}

$lulus = array_filter($peserta, function ($p) {
    return $p["skor"] ___ 70;
});

usort($lulus, function ($a, $b) {
    return $b["skor"] ___ $a["skor"];
});

foreach ($lulus as $p) {
    echo "{$p['nama']}: {$p['skor']}\\n";
}`,
          solution: `<?php

$n = (int) trim(fgets(STDIN));
$peserta = [];
for ($i = 0; $i < $n; $i++) {
    [$nama, $skor] = explode(" ", trim(fgets(STDIN)));
    $peserta[] = ["nama" => $nama, "skor" => (int) $skor];
}

$lulus = array_filter($peserta, function ($p) {
    return $p["skor"] >= 70;
});

usort($lulus, function ($a, $b) {
    return $b["skor"] <=> $a["skor"];
});

foreach ($lulus as $p) {
    echo "{$p['nama']}: {$p['skor']}\\n";
}`,
          tests: [
            {
              stdin: "4\nDina 80\nBagas 65\nRani 95\nTono 70",
              expectedOutput: "Rani: 95\nDina: 80\nTono: 70",
            },
            { stdin: "3\nAyu 60\nBima 40\nCitra 100", expectedOutput: "Citra: 100" },
            {
              stdin: "3\nEko 70\nFitri 85\nGilang 70",
              expectedOutput: "Fitri: 85\nEko: 70\nGilang: 70",
              hidden: true,
            },
          ],
          hints: [
            "Yang lolos filter adalah skor sama dengan atau di atas 70.",
            "Pembanding memakai operator tiga karakter: lebih kecil, sama dengan, lebih besar. Urutan operand menentukan arah urutan.",
            "Jawabannya: >= pada filter, dan <=> pada pembanding.",
          ],
        },
      ],
    },
  ],
};
