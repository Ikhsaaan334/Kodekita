import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "php",
  moduleRange: [8, 9],
  modules: [
    {
      title: "Composer dan Pengujian",
      description: "Composer, PSR-4 autoload, PHPUnit dasar, dan struktur proyek.",
    },
    {
      title: "Menuju Proyek Lapangan",
      description:
        "Front controller sederhana, routing, hashing password, prepared statement konsep, mini proyek akhir.",
    },
  ],
  lessons: [
    // ==================== MODUL 8: Composer dan Pengujian ====================
    {
      slug: "comp-composer-autoload",
      title: "Composer dan vendor/autoload",
      summary: "Pasang pustaka orang lain dengan Composer dan muat semuanya lewat satu file autoloader.",
      steps: [
        {
          kind: "theory",
          title: "Satu perintah untuk semua pustaka",
          body: "Proyek PHP nyata hampir selalu memakai pustaka buatan orang lain: kirim email, baca file Excel, atau framework lengkap. Memasangnya manual berarti mengunduh folder, menyalinnya berulang kali, dan menebak versi mana yang cocok satu sama lain. Composer menyelesaikan itu dengan satu deklarasi: daftar pustaka dan versinya ditulis di `composer.json`, lalu Composer mengunduh semuanya ke folder `vendor/` dan mengunci versi persis yang terpasang di `composer.lock` agar teman satu tim mendapatkan kombinasi yang sama.\n\nPerintah yang paling sering dipakai adalah `composer require nama/pustaka`. Contoh: `composer require monolog/monolog` menambahkan pustaka logging populer, membuat folder `vendor/`, dan mencatatnya di `composer.json`. Katalog pustaka PHP terpusat di Packagist, dan hampir semua pustaka modern di sana dipasang lewat Composer.\n\nHadiah terbesarnya justru satu file: `vendor/autoload.php`. Cukup me-require file itu, dan setiap class dari semua pustaka terpasang siap dipakai tanpa perintah `require` satu per satu. Mekanismenya disebut autoloading: PHP memanggil autoloader hanya saat sebuah class benar-benar dipakai, lalu file class itu dimuat otomatis. Kebiasaan ini juga berlaku untuk kode proyekmu sendiri, seperti dibahas pada lesson berikutnya.",
          code: {
            language: "php",
            content: `<?php
require __DIR__ . "/vendor/autoload.php";

use Monolog\\Logger;
use Monolog\\Handler\\StreamHandler;

$log = new Logger("aplikasi");
$log->pushHandler(new StreamHandler("php://stdout"));
$log->info("Aplikasi berjalan");`,
            caption: "Satu require untuk semua class dari vendor; sisanya urusan autoloader.",
          },
        },
        {
          kind: "quiz",
          question: "File mana yang di-require di awal skrip supaya autoloader Composer aktif?",
          options: ["composer.json", "vendor/autoload.php", "composer.lock", "Packagist"],
          answer: 1,
          explanation:
            "vendor/autoload.php adalah hasil rakitan Composer: me-require satu file ini membuat semua class pustaka bisa dipakai tanpa require manual. composer.json hanya deklarasi, composer.lock hanya catatan versi terpasang.",
        },
      ],
    },
    {
      slug: "comp-psr4-mapping",
      title: "composer.json dan Pemetaan PSR-4",
      summary: "Petakan namespace App\\ ke folder src/ dan pahami kontrak antara nama class dan alamat file.",
      steps: [
        {
          kind: "theory",
          title: "Aturan pemetaan namespace ke folder",
          body: "PSR-4 adalah kesepakatan pemetaan dari namespace ke folder. Di `composer.json`, bagian `autoload.psr-4` menyatakan: namespace berawalan tertentu hidup di folder tertentu. Tulisan `\"App\\\\\": \"src/\"` berarti setiap class yang berawalan `App\\` dicari di dalam folder `src/`.\n\nAturannya sederhana: buang prefix, sisanya jadi alamat file, dan tanda `\\` menjadi pemisah folder. Class `App\\Billing\\Invoice` berarti file `src/Billing/Invoice.php`; class `App\\Keranjang` berarti `src/Keranjang.php`. Setelah mengubah pemetaan, jalankan `composer dump-autoload` supaya autoloadernya dibuat ulang. Bila nama namespace dan foldernya melenceng sedikit saja, PHP melempar error class not found, jadi perlakukan ini sebagai kontrak yang wajib dipenuhi.\n\nKeuntungan besarnya: menambah class baru tidak perlu mendaftar di mana-mana. Buat file di tempat yang benar, samakan namanya, dan autoloader menemukannya. Pola yang sama dipakai untuk folder `tests/` lewat kunci `autoload-dev`, sehingga kode pengujian pun termuat otomatis saat PHPUnit menjalankannya.",
          code: {
            language: "json",
            content: `{
    "autoload": {
        "psr-4": {
            "App\\\\": "src/"
        }
    }
}`,
            caption: "Prefix App\\ dipetakan ke folder src/. Dua backslash di JSON adalah satu backslash sungguhan.",
          },
        },
        {
          kind: "quiz",
          question: "Dengan pemetaan `\"App\\\\\": \"src/\"`, class `App\\Pembayaran\\Tagihan` harus disimpan di file mana?",
          options: [
            "src/Pembayaran/Tagihan.php",
            "src/App/Pembayaran/Tagihan.php",
            "App/src/Pembayaran/Tagihan.php",
            "src/pembayaran.tagihan.php",
          ],
          answer: 0,
          explanation:
            "Prefix App\\ diganti src/, sisanya mengikuti bentuk namespace: Pembayaran\\Tagihan menjadi folder Pembayaran dan file Tagihan.php di dalamnya.",
        },
      ],
    },
    {
      slug: "comp-phpunit-assertion",
      title: "PHPUnit: Assertion Dasar",
      summary: "Tulis test class dengan TestCase, kenal assertSame dan assertEquals, dan pahami siklus merah-hijau.",
      steps: [
        {
          kind: "theory",
          title: "Kode yang menguji kode",
          body: "Unit test adalah kode yang menguji kode: panggil fungsi dengan masukan tertentu, bandingkan hasilnya dengan nilai yang diharapkan, dan laporkan bila meleset. PHPUnit adalah alat standar untuk itu di PHP. Satu class test menampung satu class produksi: namanya diakhiri `Test`, mewarisi `TestCase`, dan tiap methodnya diawali kata `test` supaya PHPUnit tahu mana yang harus dijalankan.\n\nJantungnya assertion. `$this->assertSame(5000, $keranjang->total())` berarti: hasil harus persis 5000, nilai dan tipenya. `$this->assertEquals(...)` lebih longgar soal tipe, sedangkan `assertTrue` dan `assertCount` memeriksa boolean dan jumlah elemen. Satu method test idealnya menguji satu perilaku, dan bila harapan tak terpenuhi, PHPUnit melapor jelas di baris mana.\n\nAlur kerjanya disebut merah-hijau: tulis test dulu, lihat merah (gagal), tulis kode sampai hijau (lulus), lalu rapikan. Catatan untuk platform ini: PHPUnit tidak ikut dijalankan di juri, jadi latihan modul ini meniru polanya dengan PHP murni. Yang penting konsepnya: panggil, bandingkan, laporkan. PHPUnit hanya membungkus kebiasaan itu dengan laporan yang rapi.",
          code: {
            language: "php",
            content: `<?php
use PHPUnit\\Framework\\TestCase;

final class KeranjangTest extends TestCase
{
    public function testTotalKeranjangKosongNol(): void
    {
        $keranjang = new Keranjang();
        $this->assertSame(0, $keranjang->total());
    }

    public function testTotalIsiSatuBarang(): void
    {
        $keranjang = new Keranjang();
        $keranjang->tambah("Pena", 5000);
        $this->assertSame(5000, $keranjang->total());
    }
}`,
            caption: "Dua method test, dua kasus: keranjang kosong dan keranjang berisi satu barang.",
          },
        },
        {
          kind: "quiz",
          question: "Pernyataan mana yang benar tentang `assertSame` dan `assertEquals`?",
          options: [
            "Keduanya sama, hanya berbeda nama",
            "assertSame memeriksa nilai sekaligus tipe, assertEquals cukup nilai yang setara",
            "assertEquals lebih ketat daripada assertSame",
            "assertSame hanya bisa memeriksa string",
          ],
          answer: 1,
          explanation:
            "assertSame memakai pembandingan === sehingga 5 dan \"5\" dianggap beda; assertEquals memakai pembandingan longgar sehingga keduanya dianggap sama. Untuk logika uang dan jumlah, assertSame pilihan yang lebih aman.",
        },
      ],
    },
    {
      slug: "comp-dataprovider",
      title: "Data Provider: Satu Test, Banyak Kasus",
      summary: "Jalankan satu method test berkali-kali dengan data berbeda dari method penyedia data.",
      steps: [
        {
          kind: "theory",
          title: "Berhenti menyalin method test",
          body: "Menulis satu method test untuk tiap kasus cepat berubah boros: sepuluh kasus berarti sepuluh method yang isinya nyaris identik. dataProvider menyelesaikannya: satu method test dijalankan berkali-kali, tiap kali dengan satu set data dari method penyedia data.\n\nPenyedia datanya method biasa yang mengembalikan array; tiap elemennya satu baris argumen untuk method test. Pada PHPUnit modern data dipasang lewat attribute `#[DataProvider(\"kasusDiskon\")]` di atas method test, pada versi lama lewat annotation `@dataProvider` di docblock. Isi penyedianya sengaja polos: array literal berisi kasus dan hasil yang diharapkan, tanpa logika apa pun, supaya bila ada yang salah, yang dicurigai kode produksinya, bukan testnya.\n\nManfaatnya terasa saat kebutuhan berubah: menambah kasus berarti menambah satu baris data, bukan satu method baru. Kasus tepi juga jadi murah: nilai nol, nilai negatif, string kosong, tinggal baris tambahan di array.",
          code: {
            language: "php",
            content: `<?php
#[DataProvider("kasusDiskon")]
public function testPotongan(int $total, string $level, int $harap): void
{
    $this->assertSame($harap, potongan($total, $level));
}

public static function kasusDiskon(): array
{
    return [
        "gold 400000" => [400000, "gold", 80000],
        "silver 250000" => [250000, "silver", 25000],
        "level tanpa diskon" => [90000, "bronze", 0],
    ];
}`,
            caption: "Tiga baris data, tiga kali test dijalankan: satu method untuk semua kasus.",
          },
        },
        {
          kind: "quiz",
          question: "Method penyedia data (dataProvider) di PHPUnit mengembalikan apa?",
          options: [
            "string berisi nama class yang diuji",
            "array; tiap elemennya satu set argumen untuk satu kali test dijalankan",
            "objek TestCase baru",
            "true bila test lulus",
          ],
          answer: 1,
          explanation:
            "dataProvider mengembalikan array kasus. PHPUnit memutar method test sebanyak elemennya dan menyuntikkan tiap elemen sebagai argumen.",
        },
      ],
    },
    {
      slug: "comp-struktur-proyek",
      title: "Struktur Proyek PHP Modern",
      summary: "Kenali tempat tetap: src untuk kode utama, tests untuk pengujian, vendor untuk pustaka unduhan.",
      steps: [
        {
          kind: "theory",
          title: "Setiap hal punya rumahnya",
          body: "Proyek PHP modern punya tempat tetap untuk tiap hal. `composer.json` di akar berisi deklarasi pustaka dan pemetaan autoload. Kode utama hidup di `src/` dengan namespace `App\\`. Kode pengujian hidup di `tests/`, biasanya dengan namespace sendiri seperti `App\\Tests\\` yang dipetakan lewat `autoload-dev`. `vendor/` berisi pustaka pihak lain: dibuat oleh `composer install`, jangan diedit, dan tidak ikut di-commit karena bisa dibuat ulang kapan saja. Pintu masuk aplikasi web biasanya `public/index.php`.\n\nBentuk tipikalnya:\n\n```text\nproyek-kasir/\n  composer.json\n  public/\n    index.php\n  src/\n    Keranjang.php\n    Diskon.php\n  tests/\n    KeranjangTest.php\n  vendor/\n```\n\nKonvensi penamaan ikut disepakati: satu class satu file dengan nama file sama persis seperti classnya, dan tiap class test diakhiri `Test` supaya PHPUnit menemukannya otomatis. Struktur ini bukan sekadar kerapian: framework besar seperti Laravel dan Symfony memakai pola yang sama, jadi kebiasaan yang dibangun di sini langsung terpakai nanti.",
          code: {
            language: "json",
            content: `{
    "autoload": {
        "psr-4": {
            "App\\\\": "src/"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "App\\\\Tests\\\\": "tests/"
        }
    }
}`,
            caption: "Dua pemetaan: src/ untuk kode produksi, tests/ untuk pengujian.",
          },
        },
        {
          kind: "quiz",
          question: "Folder mana yang tidak ikut di-commit ke repositori karena bisa dibuat ulang dengan `composer install`?",
          options: ["src/", "tests/", "vendor/", "public/"],
          answer: 2,
          explanation:
            "vendor/ adalah hasil unduhan Composer. composer.lock mencatat versi persis yang dipakai, sehingga siapa pun bisa membangun ulang vendor/ yang identik.",
        },
      ],
    },
    {
      slug: "comp-testable-dependency",
      title: "Menulis Kode yang Mudah Dites: Dependency Sederhana",
      summary: "Pisahkan logika dari sumber dunia luar supaya hasilnya deterministik dan gampang diuji.",
      steps: [
        {
          kind: "theory",
          title: "Fungsi murni teman terbaik pengujian",
          body: "Perhatikan dua fungsi di contoh. Versi pertama membaca jam sistem sendiri lewat `date()`: hasilnya berubah tergantung kapan test dijalankan, dan tidak ada cara menetapkan harapan yang stabil. Versi kedua menerima jam sebagai parameter: untuk masukan yang sama, hasilnya selalu sama, dan test bisa menulis `assertSame(\"Selamat pagi\", sapa(7))` tanpa peduli waktu.\n\nSumber nilai dari luar seperti itu disebut dependency: jam sistem, koneksi database, session, layanan pihak ketiga. Kode yang mudah dites memisahkan dependency dari logika: bagian yang bergantung pada dunia luar dikumpulkan di tepi (pemanggil, controller, atau constructor), dan logika inti menjadi fungsi murni yang menerima semua yang dibutuhkannya lewat parameter. Di OOP kebiasaan ini berkembang menjadi dependency injection: kebutuhan class disuntikkan lewat constructor, sehingga test bisa menyuntikkan versi tiruan.\n\nLatihan berikut melatih bentuk paling dasarnya: aturan bisnis ditulis sebagai fungsi murni, dan program pembaca stdin menjadi pengganti dunia luar. Bila kelak aturannya dipindah ke class besar, fungsi murni ini tetap bisa diuji tanpa mengubah satu baris pun.",
          code: {
            language: "php",
            content: `<?php
// sulit dites: membaca jam sistem sendiri
function sapaPengguna(): string
{
    $jam = (int) date("H");
    return $jam < 12 ? "Selamat pagi" : "Selamat siang";
}

// mudah dites: jam datang dari parameter
function sapa(int $jam): string
{
    return $jam < 12 ? "Selamat pagi" : "Selamat siang";
}`,
            caption: "sapa(7) selalu mengembalikan hasil yang sama, kapan pun testnya dijalankan.",
          },
        },
        {
          kind: "quiz",
          question: "Manakah fungsi yang paling mudah diuji dengan unit test?",
          options: [
            "fungsi yang membaca jam sistem sendiri di dalam tubuhnya",
            "fungsi murni yang menerima semua yang dibutuhkannya lewat parameter",
            "fungsi yang mengambil data dari session langsung",
            "fungsi yang hasilnya bergantung pada angka acak",
          ],
          answer: 1,
          explanation:
            "Fungsi murni deterministik: masukan sama selalu menghasilkan keluaran sama, sehingga harapan test bisa ditulis pasti. Fungsi yang membaca dunia luar diam-diam hasilnya berubah-ubah dan sulit dikunci.",
        },
        {
          kind: "code",
          title: "Aturan diskon sebagai fungsi murni",
          prompt:
            "Program membaca dua baris: total belanja dan level member (`gold`, `silver`, atau lainnya). Aturannya: potongan gold 20%, silver 10%, level lain tidak dapat. Potongan dibatasi maksimal 100000, jadi bila hasil perhitungannya melampaui batas, yang berlaku tetap 100000. Lengkapi dua kekosongan pada fungsi-fungsinya. Input `600000` dengan level `gold` harus menghasilkan `100000` karena 20% dari 600000 melebihi batas.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

function persenDiskon(string $level): int
{
    return match ($level) {
        "gold" => ___,
        "silver" => 10,
        default => 0,
    };
}

function potongan(int $total, string $level): int
{
    $kasar = (int) round($total * persenDiskon($level) / 100);
    return ___($kasar, 100000);
}

$total = (int) trim(fgets(STDIN));
$level = trim(fgets(STDIN));

echo potongan($total, $level) . "\\n";`,
          solution: `<?php
declare(strict_types=1);

function persenDiskon(string $level): int
{
    return match ($level) {
        "gold" => 20,
        "silver" => 10,
        default => 0,
    };
}

function potongan(int $total, string $level): int
{
    $kasar = (int) round($total * persenDiskon($level) / 100);
    return min($kasar, 100000);
}

$total = (int) trim(fgets(STDIN));
$level = trim(fgets(STDIN));

echo potongan($total, $level) . "\\n";`,
          tests: [
            { stdin: "600000\ngold", expectedOutput: "100000" },
            { stdin: "250000\nsilver", expectedOutput: "25000" },
            { stdin: "150000\nbronze", expectedOutput: "0", hidden: true },
          ],
          hints: [
            "Arm gold mengembalikan persennya sebagai angka, bukan teks: 20, bukan \"20\".",
            "Pembatas nilai tertinggi di PHP: bila $kasar melebihi 100000, ambil 100000. Fungsi min() memilih yang lebih kecil.",
            "Jawabannya: 20 untuk arm gold, dan min($kasar, 100000) untuk baris pembatas.",
          ],
        },
      ],
    },
    {
      slug: "comp-refactor-ke-class",
      title: "Refactoring: Fungsi Global ke Class",
      summary: "Pindahkan state global dan fungsi lepas ke dalam class dengan property private dan method.",
      steps: [
        {
          kind: "theory",
          title: "Dari global ke instance",
          body: "Skrip prosedural menaruh state di variabel global: `$saldo` di atas file, lalu fungsi `setor()` mengubahnya lewat `global $saldo`. Ia bekerja sampai kebutuhan bertambah: dua rekening mustahil dibuat, test satu fungsi meninggalkan sisa state untuk test berikutnya, dan siapa pun bisa mengubah saldo dari baris mana pun.\n\nRefactoring ke class memindahkan data dan perilaku ke satu tempat: `saldo` menjadi property private, `setor()` dan `tarik()` menjadi method, dan `$this` merujuk instance yang sedang bekerja. Tiap `new Rekening()` membawa salinannya sendiri, jadi dua rekening bisa hidup berdampingan tanpa saling mengganggu. Constructor property promotion membuat class kecil tetap ringkas.\n\nYang membuat refactoring ini aman adalah pengujian dari modul ini: tulis dulu test yang mengunci perilaku sekarang, geser kodenya jadi class, jalankan test, dan bila tetap hijau, berarti perilakunya tidak berubah. Refactoring bukan menulis ulang; ia mengubah bentuk dengan jaring pengaman.",
          code: {
            language: "php",
            content: `<?php
// sebelum: saldo global, fungsi lepas
$saldo = 0;

function setorGlobal(int $nominal): void
{
    global $saldo;
    $saldo += $nominal;
}

// sesudah: data dan perilaku hidup di class
class Rekening
{
    public function __construct(private int $saldo = 0)
    {
    }

    public function setor(int $nominal): void
    {
        $this->saldo += $nominal;
    }
}`,
            caption: "Class membawa statenya sendiri; tiap instance punya saldo yang terpisah.",
          },
        },
        {
          kind: "code",
          title: "Perbaiki method tarik",
          prompt:
            "Program membaca saldo awal dan nominal penarikan, lalu mencoba menarik lewat class `Rekening`. Perilaku yang benar: penarikan berhasil bila nominalnya tidak melebihi saldo, termasuk bila nominalnya persis sama sehingga saldonya habis. Saat ini ada satu kekeliruan yang membuat kasus pas habis ikut ditolak. Cari dan perbaiki satu barisnya.",
          mode: "fix",
          template: `<?php
declare(strict_types=1);

class Rekening
{
    public function __construct(private int $saldo = 0)
    {
    }

    public function tarik(int $nominal): bool
    {
        if ($nominal >= $this->saldo) {
            return false;
        }
        $this->saldo -= $nominal;
        return true;
    }

    public function saldo(): int
    {
        return $this->saldo;
    }
}

$awal = (int) trim(fgets(STDIN));
$nominal = (int) trim(fgets(STDIN));

$rek = new Rekening($awal);
$berhasil = $rek->tarik($nominal);

echo ($berhasil ? "tarik berhasil" : "saldo tidak cukup") . "\\n";
echo "saldo akhir: " . $rek->saldo() . "\\n";`,
          solution: `<?php
declare(strict_types=1);

class Rekening
{
    public function __construct(private int $saldo = 0)
    {
    }

    public function tarik(int $nominal): bool
    {
        if ($nominal > $this->saldo) {
            return false;
        }
        $this->saldo -= $nominal;
        return true;
    }

    public function saldo(): int
    {
        return $this->saldo;
    }
}

$awal = (int) trim(fgets(STDIN));
$nominal = (int) trim(fgets(STDIN));

$rek = new Rekening($awal);
$berhasil = $rek->tarik($nominal);

echo ($berhasil ? "tarik berhasil" : "saldo tidak cukup") . "\\n";
echo "saldo akhir: " . $rek->saldo() . "\\n";`,
          tests: [
            { stdin: "50000\n50000", expectedOutput: "tarik berhasil\nsaldo akhir: 0" },
            { stdin: "30000\n45000", expectedOutput: "saldo tidak cukup\nsaldo akhir: 30000" },
            { stdin: "100000\n25000", expectedOutput: "tarik berhasil\nsaldo akhir: 75000", hidden: true },
          ],
          hints: [
            "Jalankan dengan saldo 50000 dan penarikan 50000: hasilnya ditolak, padahal seharusnya berhasil.",
            "Method tarik boleh menolak hanya bila nominal melebihi saldo. Pembanding yang terpasang sekarang menolak juga bila nominal sama persis.",
            "Ubah $nominal >= $this->saldo menjadi $nominal > $this->saldo pada method tarik.",
          ],
        },
      ],
    },
    {
      slug: "comp-match-expression",
      title: "Match Expression PHP 8",
      summary: "Petakan nilai ke hasil dengan match: ketat, tanpa fall-through, dan mengembalikan nilai.",
      steps: [
        {
          kind: "theory",
          title: "Switch yang dibenahi",
          body: "Sejak PHP 8 ada `match`, pengganti switch untuk kasus pemetaan nilai ke hasil. Bedanya tegas: match adalah ekspresi yang mengembalikan nilai (jadi bisa langsung di-`return` atau masuk variabel), perbandingannya ketat seperti `===`, dan tidak ada fall-through sehingga `break` tidak diperlukan. Satu arm boleh menampung beberapa kondisi sekaligus, dipisah koma: `301, 302, 307 => \"pindahan\"`.\n\nBila tidak ada arm yang cocok dan tidak ada `default`, match melempar `UnhandledMatchError`, bukan diam. Itu kelebihan: nilai tak terduga langsung terlihat, bukan lolos senyap dengan hasil null.\n\nKapan memakai match: saat satu masukan dipetakan ke satu hasil, seperti kode status ke label atau level member ke persen diskon. Bila cabangnya punya efek samping atau kondisinya rumit (perbandingan rentang, beberapa variabel), if tetap pilihan yang lebih jujur.",
          code: {
            language: "php",
            content: `<?php
$kode = 302;

$label = match ($kode) {
    200 => "sukses",
    301, 302, 307 => "pindahan",
    404 => "tidak ditemukan",
    default => "kode lain",
};

echo $label; // pindahan`,
            caption: "match mengembalikan nilai langsung; 301, 302, dan 307 berbagi satu arm.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi bila tidak ada arm match yang cocok dan match tidak punya default?",
          options: [
            "match mengembalikan null",
            "match mengembalikan 0",
            "dilempar UnhandledMatchError",
            "arm pertama yang dipakai",
          ],
          answer: 2,
          explanation:
            "Tanpa kecocokan dan tanpa default, PHP melempar UnhandledMatchError. Ini disengaja: nilai yang tak terduga terlihat segera, bukan lolos sebagai null.",
        },
        {
          kind: "code",
          title: "Label kode status",
          prompt:
            "Program membaca N lalu N kode status HTTP (satu per baris) dan mencetak labelnya: 200 `sukses`; 301, 302, dan 307 `pindahan`; 404 `tidak ditemukan`; 500, 502, dan 503 `server error`; sisanya `kode tak dikenal`. Lengkapi dua kekosongan pada match.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

function labelStatus(int $kode): string
{
    return match ($kode) {
        200 => "sukses",
        ___ => "pindahan",
        404 => "tidak ditemukan",
        500, 502, 503 => "server error",
        ___ => "kode tak dikenal",
    };
}

$n = (int) trim(fgets(STDIN));
for ($i = 0; $i < $n; $i++) {
    echo labelStatus((int) trim(fgets(STDIN))) . "\\n";
}`,
          solution: `<?php
declare(strict_types=1);

function labelStatus(int $kode): string
{
    return match ($kode) {
        200 => "sukses",
        301, 302, 307 => "pindahan",
        404 => "tidak ditemukan",
        500, 502, 503 => "server error",
        default => "kode tak dikenal",
    };
}

$n = (int) trim(fgets(STDIN));
for ($i = 0; $i < $n; $i++) {
    echo labelStatus((int) trim(fgets(STDIN))) . "\\n";
}`,
          tests: [
            { stdin: "4\n200\n404\n302\n418", expectedOutput: "sukses\ntidak ditemukan\npindahan\nkode tak dikenal" },
            { stdin: "3\n503\n201\n301", expectedOutput: "server error\nkode tak dikenal\npindahan" },
            { stdin: "3\n307\n500\n999", expectedOutput: "pindahan\nserver error\nkode tak dikenal", hidden: true },
          ],
          hints: [
            "Tiga kode berbagi satu hasil ditulis berdampingan di satu arm, dipisah koma.",
            "Arm penampung sisa pada match bernama default, ditulis tanpa kondisi.",
            "Kekosongan pertama: 301, 302, 307. Kekosongan kedua: default.",
          ],
        },
      ],
    },
    {
      slug: "comp-named-arguments",
      title: "Named Arguments PHP 8",
      summary: "Kirim argumen lewat namanya: lewati parameter opsional tengah dan bacakan maksud panggilan.",
      steps: [
        {
          kind: "theory",
          title: "Panggilan yang menjelaskan dirinya",
          body: "Sejak PHP 8, argumen boleh dikirim disertai namanya: `buatTagihan(jumlah: 100000, catatan: \"Jatuh tempo 30 hari\")`. Keuntungannya langsung terasa pada fungsi dengan banyak parameter opsional: parameter tengah bisa dilewati tanpa menulisnya, urutan tidak lagi menentukan, dan pembaca panggilan langsung tahu tiap nilai untuk siapa.\n\nTanpa named argument, mengisi `$catatan` pada fungsi tiga parameter tadi wajib menulis `$diskon` lebih dulu, meski nilainya nol. Dengan named argument, parameter yang tidak disebut memakai nilai bawaannya. Named argument bekerja juga pada constructor, jadi class dengan banyak opsi bisa dibangun dengan panggilan yang membaca sendiri.\n\nKonsekuensinya serius: nama parameter menjadi bagian dari kontrak publik. Mengganti nama `$diskon` menjadi `$potongan` berarti memecah semua pemanggil yang memakai namanya. Karena itu gunakan named argument seperlunya, terutama pada API yang parameternya banyak dan opsional.",
          code: {
            language: "php",
            content: `<?php
function buatTagihan(int $jumlah, int $diskon = 0, string $catatan = ""): string
{
    $bayar = $jumlah - $diskon;
    return "Bayar $bayar. $catatan";
}

echo buatTagihan(jumlah: 100000, catatan: "Jatuh tempo 30 hari");
// Bayar 100000. Jatuh tempo 30 hari`,
            caption: "$diskon dilewati dan memakai bawaannya; $catatan diisi lewat namanya.",
          },
        },
        {
          kind: "code",
          title: "Perbaiki panggilan dengan named argument",
          prompt:
            "Program membaca judul tugas dan prioritasnya, lalu mencetak ringkasannya lewat fungsi `tandaiTugas()`. Saat ini panggilannya membuat program mati dengan TypeError. Perbaiki panggilannya dengan named argument sehingga nilai prioritas mendarat di parameter yang benar dan program mencetak ringkasan seperti yang diharapkan.",
          mode: "fix",
          template: `<?php
declare(strict_types=1);

function tandaiTugas(string $judul, bool $selesai = false, string $prioritas = "sedang"): string
{
    $status = $selesai ? "selesai" : "terbuka";
    return "$judul ($status, prioritas $prioritas)";
}

$judul = trim(fgets(STDIN));
$prioritas = trim(fgets(STDIN));

echo tandaiTugas($judul, $prioritas) . "\\n";`,
          solution: `<?php
declare(strict_types=1);

function tandaiTugas(string $judul, bool $selesai = false, string $prioritas = "sedang"): string
{
    $status = $selesai ? "selesai" : "terbuka";
    return "$judul ($status, prioritas $prioritas)";
}

$judul = trim(fgets(STDIN));
$prioritas = trim(fgets(STDIN));

echo tandaiTugas($judul, prioritas: $prioritas) . "\\n";`,
          tests: [
            { stdin: "Kirim laporan\ntinggi", expectedOutput: "Kirim laporan (terbuka, prioritas tinggi)" },
            { stdin: "Bayar tagihan\nrendah", expectedOutput: "Bayar tagihan (terbuka, prioritas rendah)" },
          ],
          hints: [
            "Jalankan dulu dan baca pesannya: parameter kedua, $selesai, menolak string. Nilai $prioritas seharusnya untuk parameter ketiga.",
            "Kirim nilai lewat namanya supaya urutan tidak lagi relevan: nama parameternya adalah prioritas.",
            "Perbaikannya: tandaiTugas($judul, prioritas: $prioritas). Parameter $selesai tidak disebut sehingga memakai bawaannya.",
          ],
        },
      ],
    },
    {
      slug: "comp-latihan-gabungan",
      title: "Latihan Gabungan: Fungsi Hitung dengan Tes Manual",
      summary: "Satukan aturan bisnis, kasus uji, dan pembanding LULUS atau GAGAL dalam satu program.",
      steps: [
        {
          kind: "theory",
          title: "Semua pola modul ini dalam satu program",
          body: "Tutup modul ini dengan menyatukan semuanya. Pola yang sudah dilatih: aturan bisnis hidup di fungsi murni, kasus uji berisi pasangan masukan dan harapan, dan pembanding sederhana melaporkan LULUS atau GAGAL per kasus. PHPUnit adalah mesin yang sama dengan laporan yang jauh lebih rapi: dataProvider menggantikan array kasus, assertion menggantikan pembandingan manual, dan keluaran merah-hijau menggantikan echo.\n\nPola tes manual ini tetap berguna di pekerjaan nyata: saat menulis fungsi hitung, menyalin aturan pajak, atau memverifikasi hasil refactor cepat tanpa menyiapkan proyek PHPUnit penuh. Buka editor, tulis fungsi, tulis tiga sampai lima kasus di bawahnya, jalankan. Lima detik per jalanan memberi keyakinan yang tidak diberi oleh sekadar membaca kode.\n\nLatihan penutup meminta begitu: fungsi tarif pengiriman yang benar, diuji oleh kasus yang datang dari stdin. Bila semua baris melaporkan LULUS, berarti fungsi dan pengujinya sama-sama benar.",
          code: {
            language: "php",
            content: `<?php
function genap(int $n): bool
{
    return $n % 2 === 0;
}

$kasus = [[4, true], [7, false], [0, true]];

foreach ($kasus as [$masukan, $harap]) {
    $dapat = genap($masukan);
    echo $dapat === $harap ? "LULUS" : "GAGAL";
    echo "\\n";
}`,
            caption: "Panggil, bandingkan, laporkan: inti semua alat pengujian.",
          },
        },
        {
          kind: "code",
          title: "Fungsi ongkir dengan kasus dari stdin",
          prompt:
            "Tarif pengiriman: berat sampai 1000 gram membayar 10000; sampai 3000 gram membayar 15000; lebih dari itu, tiap kelipatan 1000 gram tambahan (dibulatkan ke atas) menambah 5000. Contoh: 4500 gram berarti 15000 ditambah 2 kelipatan, jadi 25000. Stdin berisi kasus uji, tiap baris `berat|harapan`. Program menguji fungsi `ongkir()` untuk tiap kasus dan mencetak `LULUS`, atau `GAGAL: dapat X, harap Y` bila meleset. Lengkapi tiga kekosongan sampai semua kasus lulus.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

function ongkir(int $beratGram): int
{
    if ($beratGram <= 1000) {
        return 10000;
    }
    if ($beratGram <= 3000) {
        return 15000;
    }
    $kgTambahan = ___(($beratGram - 3000) / 1000);
    return 15000 + $kgTambahan * ___;
}

while (($baris = fgets(STDIN)) !== false) {
    $baris = trim($baris);
    if ($baris === "") {
        continue;
    }
    [$berat, $harap] = explode("|", $baris);
    $dapat = ongkir((int) $berat);
    if ($dapat ___ (int) $harap) {
        echo "LULUS\\n";
    } else {
        echo "GAGAL: dapat $dapat, harap $harap\\n";
    }
}`,
          solution: `<?php
declare(strict_types=1);

function ongkir(int $beratGram): int
{
    if ($beratGram <= 1000) {
        return 10000;
    }
    if ($beratGram <= 3000) {
        return 15000;
    }
    $kgTambahan = (int) ceil(($beratGram - 3000) / 1000);
    return 15000 + $kgTambahan * 5000;
}

while (($baris = fgets(STDIN)) !== false) {
    $baris = trim($baris);
    if ($baris === "") {
        continue;
    }
    [$berat, $harap] = explode("|", $baris);
    $dapat = ongkir((int) $berat);
    if ($dapat === (int) $harap) {
        echo "LULUS\\n";
    } else {
        echo "GAGAL: dapat $dapat, harap $harap\\n";
    }
}`,
          tests: [
            { stdin: "500|10000\n1000|10000\n1001|15000\n3000|15000", expectedOutput: "LULUS\nLULUS\nLULUS\nLULUS" },
            { stdin: "3001|20000\n4500|25000\n8000|40000", expectedOutput: "LULUS\nLULUS\nLULUS" },
            {
              stdin: "3500|20000\n7000|35000\n10000|50000",
              expectedOutput: "LULUS\nLULUS\nLULUS",
              hidden: true,
            },
          ],
          hints: [
            "Kelipatan tambahan dibulatkan ke atas: kelebihan 1 gram saja tetap dihitung satu kelipatan. Fungsi ceil() yang membulatkan ke atas.",
            "Tiap kelipatan 1000 gram tambahan menambah biaya 5000.",
            "Pembandingan hasil dengan harapan harus ketat: === membandingkan nilai sekaligus tipe.",
          ],
        },
      ],
    },
    // ==================== MODUL 9: Menuju Proyek Lapangan ====================
    {
      slug: "lap-front-controller",
      title: "Pola Front Controller",
      summary: "Satukan semua request ke satu titik masuk dan kenali kenapa framework modern memilihnya.",
      steps: [
        {
          kind: "theory",
          title: "Satu pintu untuk semua request",
          body: "Aplikasi PHP lama biasanya punya satu file per halaman: `profil.php`, `kontak.php`, `login.php`. Tiap file harus mengurus ulang hal yang sama di baris awalnya: require autoload, membaca konfigurasi, membuka koneksi database, memeriksa login. Salin-tempel sebanyak jumlah halaman, dan satu perubahan aturan berarti menyunting banyak file.\n\nPola front controller membaliknya: satu titik masuk, biasanya `public/index.php`, menerima SEMUA request. Web server diatur agar path apa pun diarahkan ke file itu, lalu aplikasi membaca path dari request dan memutuskan siapa yang menjawab. Persiapan cukup ditulis sekali, aturan lintas halaman seperti pemeriksaan login dan header keamanan punya satu rumah, dan URL tidak lagi terikat nama file.\n\nSemua framework PHP modern memakai pola ini: Laravel dan Symfony sama-sama menjalankan `index.php` untuk request apa pun. Router yang dipelajari pada lesson berikutnya adalah mesin yang hidup di belakang front controller itu.",
          code: {
            language: "php",
            content: `<?php
// public/index.php: satu-satunya pintu masuk
declare(strict_types=1);

require __DIR__ . "/../vendor/autoload.php";

$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

$halaman = match ($path) {
    "/", "/beranda" => "Halaman beranda",
    "/profil" => "Halaman profil",
    default => "404 tidak ditemukan",
};

echo $halaman;`,
            caption: "Satu pintu untuk semua request; path menentukan jawabannya.",
          },
        },
        {
          kind: "quiz",
          question: "Keuntungan utama front controller dibanding satu file PHP per halaman adalah...",
          options: [
            "Server tidak perlu menjalankan PHP lagi",
            "Persiapan seperti autoload dan pemeriksaan login cukup ditulis sekali di satu titik masuk",
            "URL menjadi lebih panjang sehingga lebih aman",
            "Aplikasi tidak lagi memerlukan routing",
          ],
          answer: 1,
          explanation:
            "Dengan satu titik masuk, kode persiapan dan aturan lintas halaman ditulis sekali. Routing tetap dibutuhkan; justru routing bekerja di dalam front controller itu.",
        },
      ],
    },
    {
      slug: "lap-router-array",
      title: "Router: Path ke Handler",
      summary: "Bangun tabel rute array, jalankan dispatch, dan jawab 404 untuk path yang tak terdaftar.",
      steps: [
        {
          kind: "theory",
          title: "Tabel rute paling polos",
          body: "Router paling polos hanyalah array: kuncinya path, isinya handler. Handler boleh closure, fungsi biasa, atau `[NamaClass::class, \"method\"]`. Kerjanya tiga langkah: ambil path dari request, cari di tabel, lalu panggil handler yang cocok. Bila path tidak terdaftar, jawab 404, bukan error mentah.\n\nBentuk array ini layak dipahami lebih dulu sebelum menyentuh router framework: Laravel dan Symfony memakai mesin yang jauh lebih lengkap (path dinamis seperti `/tugas/{id}`, pembedaan method HTTP, middleware), tetapi intinya tetap sama, yaitu tabel rute plus pencocokan plus pemanggilan. Memahami versi polos membuat versi framework mudah terbaca.\n\nSatu lagi yang berharga: handler yang dipisah dari HTTP murni menerima masukan dan mengembalikan teks. Fungsi seperti itu bisa diuji unit test tanpa server web sama sekali, dan di latihan berikut kamu menjalankan dispatch-nya dari stdin.",
          code: {
            language: "php",
            content: `<?php
$rute = [
    "/" => fn () => "beranda",
    "/tentang" => fn () => "tentang kami",
];

$path = "/tentang";

if (isset($rute[$path])) {
    echo $rute[$path]();
} else {
    echo "404 tidak ditemukan";
}`,
            caption: "Tabel rute sederhana: path dipetakan ke callable, sisanya 404.",
          },
        },
        {
          kind: "code",
          title: "Jalankan dispatch router",
          prompt:
            "Program membaca N lalu N path (satu per baris), dan mencetak jawaban tiap request lewat fungsi `jalankan()`. Tabel rutenya punya `/`, `/profil`, dan `/kontak`; path yang tidak terdaftar dijawab `404 tidak ditemukan`. Lengkapi dua kekosongan: satu path yang belum terisi di tabel, dan operator fallback di dalam `jalankan()`.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

function jalankan(array $rute, string $path): string
{
    $handler = $rute[$path] ___ fn () => "404 tidak ditemukan";
    return $handler();
}

$rute = [
    "/" => fn () => "Halo dari beranda",
    ___ => fn () => "Profil pengguna",
    "/kontak" => fn () => "Email: halo@kodekita.id",
];

$n = (int) trim(fgets(STDIN));
for ($i = 0; $i < $n; $i++) {
    echo jalankan($rute, trim(fgets(STDIN))) . "\\n";
}`,
          solution: `<?php
declare(strict_types=1);

function jalankan(array $rute, string $path): string
{
    $handler = $rute[$path] ?? fn () => "404 tidak ditemukan";
    return $handler();
}

$rute = [
    "/" => fn () => "Halo dari beranda",
    "/profil" => fn () => "Profil pengguna",
    "/kontak" => fn () => "Email: halo@kodekita.id",
];

$n = (int) trim(fgets(STDIN));
for ($i = 0; $i < $n; $i++) {
    echo jalankan($rute, trim(fgets(STDIN))) . "\\n";
}`,
          tests: [
            {
              stdin: "3\n/\n/kontak\n/absen",
              expectedOutput: "Halo dari beranda\nEmail: halo@kodekita.id\n404 tidak ditemukan",
            },
            { stdin: "2\n/profil\n/tidak-ada", expectedOutput: "Profil pengguna\n404 tidak ditemukan" },
            { stdin: "1\n/kontak", expectedOutput: "Email: halo@kodekita.id", hidden: true },
          ],
          hints: [
            "Bila kunci tidak ada di array, PHP punya operator yang memberi nilai alternatif tanpa error: dua tanda tanya berurutan.",
            "Path yang hilang dari tabel adalah /profil, sesuai jawaban yang diharapkan pada tes kedua.",
            "Kekosongan pertama: \"/profil\". Kekosongan kedua: ?? sebelum handler fallback 404.",
          ],
        },
      ],
    },
    {
      slug: "lap-password-hash",
      title: "password_hash dan password_verify",
      summary: "Simpan hash, bukan password, dan verifikasi login dengan pasangan fungsi bawaan PHP.",
      steps: [
        {
          kind: "theory",
          title: "Yang disimpan bukan passwordnya",
          body: "Aturan nomor satu autentikasi: password tidak pernah disimpan apa adanya. Bila database bocor dan password tersimpan polos, semua akun langsung tumbang, dan karena banyak orang memakai sandi yang sama di beberapa layanan, kerusakannya menular ke tempat lain. Yang disimpan adalah hash satu arah: string yang dihitung dari password dan tidak bisa dibalik menjadi password lagi.\n\nDi PHP pekerjaan ini satu fungsi: `password_hash($teks, PASSWORD_DEFAULT)` yang memakai bcrypt saat ini. Ia lambat dengan sengaja supaya menebak password jadi mahal, dan menyuntikkan salt acak otomatis sehingga dua pengguna dengan sandi sama pun punya hash berbeda. Pasangannya `password_verify($teks, $hash)` menghitung ulang dan membandingkan dengan aman. Jangan memakai `md5` atau `sha1` untuk password: keduanya terlalu cepat dan tanpa salt, cocok untuk checksum file, tidak untuk autentikasi.\n\nSatu konsekuensi yang sering mengejutkan: hash yang sama tidak pernah dihasilkan dua kali dari password yang sama, karena saltnya acak tiap panggilan. Itu bukan cacat, melainkan pertahanan; verifikasi tetap berhasil karena salt ikut tersimpan di dalam hash.",
          code: {
            language: "php",
            content: `<?php
// saat registrasi: simpan hashnya, bukan passwordnya
$hash = password_hash("kopiPagi123", PASSWORD_DEFAULT);
echo strlen($hash); // 60, panjang tetap bcrypt

// saat login: bandingkan lewat password_verify
var_dump(password_verify("kopiPagi123", $hash)); // bool(true)
var_dump(password_verify("kopipagi123", $hash)); // bool(false)`,
            caption: "Verifikasi membandingkan hash dari teks kandidat dengan hash yang tersimpan.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa `md5` dan `sha1` tidak layak dipakai untuk menyimpan password?",
          options: [
            "Hasilnya terlalu panjang untuk disimpan di database",
            "Keduanya bekerja terlalu cepat dan tanpa salt otomatis, sehingga menebak password jadi murah",
            "PHP sudah menghapus keduanya sehingga tidak bisa dipanggil",
            "Hasilnya tidak bisa disimpan sebagai teks",
          ],
          answer: 1,
          explanation:
            "Untuk password dibutuhkan fungsi yang lambat dan berganti salt, seperti bcrypt lewat password_hash. md5 dan sha1 didesain cepat untuk checksum, bukan untuk menahan penebakan.",
        },
        {
          kind: "code",
          title: "Demo login dengan hash",
          prompt:
            "Program meniru proses login dari stdin: baris pertama adalah teks password yang dicoba, dan hash tersimpan sudah ada di kode, seolah dibaca dari database. Lengkapi tiga kekosongan: fungsi verifikasi, fungsi penghitung panjang, dan pembanding ketat yang memastikan hash baru berbeda dari hash lama. Password yang benar adalah `kopiPagi123`.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

// hash ini lahir dari password_hash("kopiPagi123", PASSWORD_DEFAULT)
// saat registrasi; yang disimpan di database hanya hashnya.
$hashTersimpan = '$2y$12$idTf9kwRO1qtIOOpo2247eWCzDmpzRD6Z7dK2qGp55RJMCZ3cDiTi';

$kataSandi = trim(fgets(STDIN));

echo (___($kataSandi, $hashTersimpan) ? "login berhasil" : "password salah") . "\\n";

$hashBaru = password_hash($kataSandi, PASSWORD_DEFAULT);

echo "panjang hash: " . ___($hashBaru) . "\\n";
echo (password_verify($kataSandi, $hashBaru) ? "hash baru cocok" : "hash baru tidak cocok") . "\\n";
echo ($hashBaru ___ $hashTersimpan ? "hash selalu berbeda" : "hash identik") . "\\n";`,
          solution: `<?php
declare(strict_types=1);

// hash ini lahir dari password_hash("kopiPagi123", PASSWORD_DEFAULT)
// saat registrasi; yang disimpan di database hanya hashnya.
$hashTersimpan = '$2y$12$idTf9kwRO1qtIOOpo2247eWCzDmpzRD6Z7dK2qGp55RJMCZ3cDiTi';

$kataSandi = trim(fgets(STDIN));

echo (password_verify($kataSandi, $hashTersimpan) ? "login berhasil" : "password salah") . "\\n";

$hashBaru = password_hash($kataSandi, PASSWORD_DEFAULT);

echo "panjang hash: " . strlen($hashBaru) . "\\n";
echo (password_verify($kataSandi, $hashBaru) ? "hash baru cocok" : "hash baru tidak cocok") . "\\n";
echo ($hashBaru !== $hashTersimpan ? "hash selalu berbeda" : "hash identik") . "\\n";`,
          tests: [
            {
              stdin: "kopiPagi123",
              expectedOutput: "login berhasil\npanjang hash: 60\nhash baru cocok\nhash selalu berbeda",
            },
            {
              stdin: "salahTerus",
              expectedOutput: "password salah\npanjang hash: 60\nhash baru cocok\nhash selalu berbeda",
            },
          ],
          hints: [
            "Fungsi verifikasi menerima dua argumen: teks kandidat dan hash tersimpan. Namanya menyatu dengan kegunaannya: password_verify.",
            "Panjang hash bcrypt selalu sama, 60 karakter, dan fungsi penghitungnya strlen.",
            "Kekosongan terakhir: !== (tidak identik), karena salt acak membuat hash baru berbeda dari yang lama.",
          ],
        },
      ],
    },
    {
      slug: "lap-prepared-statement",
      title: "Prepared Statement dan SQL Injection",
      summary: "Lihat bagaimana input merusak query rakitan string dan cegahnya dengan placeholder.",
      steps: [
        {
          kind: "theory",
          title: "Input bukan SQL",
          body: "SQL injection lahir dari kebiasaan merakit query dengan menyambung string: `\"SELECT * FROM users WHERE email = '$email'\"`. Input pengguna ikut menjadi bagian teks SQL, dan tanda kutip dari input bisa keluar dari perannya. Contoh klasiknya di form login: email diisi `' OR '1'='1' --` sehingga kondisi WHERE menjadi selalu benar, dan pengunjung masuk tanpa sandi yang sah. Varian lain bisa membaca data yang bukan haknya atau menghapus tabel. Masalah ini bertahun-tahun masuk daftar risiko web paling umum versi OWASP, dan aplikasi PHP yang masih merakit query dengan sambungan string tetap rentan sampai sekarang.\n\nPerlengkapan dasarnya prepared statement: query dikirim ke database dulu sebagai templat dengan placeholder, `:email` atau `?`, lalu datanya dikirim terpisah lewat `execute`. Driver menjamin data diperlakukan murni sebagai nilai, bukan bagian SQL, sehingga tanda kutip dari input tidak punya kekuatan apa pun.\n\nKebiasaannya satu kalimat: bila ada input pengguna di query, ada placeholder. Sambungkan string hanya untuk bagian yang tidak pernah berasal dari input.",
          code: {
            language: "php",
            content: `<?php
// berbahaya: dirakit dari sambungan string, input ikut menjadi SQL
$sqlRusak = "SELECT * FROM users WHERE email = '$email'";

// aman: templat dulu, data menyusul lewat execute
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
$stmt->execute(["email" => $email]);`,
            caption: "Placeholder memisahkan bentuk query dari isinya; driver yang menjaga perannya.",
          },
        },
        {
          kind: "quiz",
          question:
            "Query login dirakit dengan sambungan string: `\"... WHERE email = '$email' AND sandi = '$sandi'\"`. Seorang pengunjung mengisi email `' OR '1'='1' --` dan sandi apa pun. Apa akibatnya?",
          options: [
            "Query gagal karena sintaks SQL rusak",
            "Sisa kondisi ikut berkomentar dan WHERE menjadi selalu benar, sehingga login lolos tanpa sandi yang sah",
            "PHP otomatis membersihkan tanda kutip dari input",
            "Database menolak karena email tidak valid",
          ],
          answer: 1,
          explanation:
            "Input menutup kutip email, menambah OR '1'='1' yang selalu benar, lalu -- menandai sisanya sebagai komentar. Prepared statement mencegah ini karena input diperlakukan sebagai nilai, bukan bagian SQL.",
        },
      ],
    },
    {
      slug: "lap-struktur-aplikasi",
      title: "Struktur Aplikasi Kecil",
      summary: "Susun folder public, src, config, dan templates, dan simpan kredensial di luar kode.",
      steps: [
        {
          kind: "theory",
          title: "Peta folder yang bisa tumbuh",
          body: "Aplikasi kecil yang ingin tumbuh butuh peta folder yang disepakati. `public/` hanya berisi `index.php`, satu-satunya file yang bisa dijangkau web server, dan isinya front controller. `src/` berisi kode aplikasi: `Router.php`, controller per fitur, model per tabel. `config/` menyimpan pengaturan, `templates/` menyimpan tampilan, dan `tests/` menampung pengujian dari modul sebelumnya.\n\n```text\naplikasi-tugas/\n  public/\n    index.php\n  src/\n    Router.php\n    Controller/\n    Model/\n  config/\n  templates/\n  tests/\n  vendor/\n  composer.json\n```\n\nAturan yang paling sering dilanggar pemula: kredensial database ditulis langsung di kode. Akibatnya kredensial ikut ke git, berpindah ke semua yang menyalin repo, dan mengganti server berarti menyunting kode. Kebiasaan yang benar: aplikasi membaca pengaturan dari environment (di lokal lewat file `.env` yang masuk `.gitignore`), dan repo hanya menyimpan contoh kosong seperti `.env.example`.\n\nKaitkan dengan dua modul terakhir: autoloading PSR-4 menyatukan semua folder ini tanpa require manual, dan front controller di `public/index.php` menjadi pintunya. Struktur seperti inilah yang membuat proyek kecil bisa bertambah besar tanpa dibongkar.",
          code: {
            language: "php",
            content: `<?php
// config/aplikasi.php: pengaturan dibaca dari environment, bukan ditulis di kode
return [
    "db" => [
        "host" => getenv("DB_HOST") ?: "127.0.0.1",
        "nama" => getenv("DB_NAME") ?: "kodekita",
        "user" => getenv("DB_USER"),
        "sandi" => getenv("DB_PASS"),
    ],
];`,
            caption: "Kredensial datang dari environment; file ini aman di-commit karena tidak berisi rahasia.",
          },
        },
        {
          kind: "quiz",
          question: "Di mana sebaiknya kredensial database aplikasi disimpan?",
          options: [
            "Ditulis langsung di public/index.php",
            "Di komentar atas file Model",
            "Di file konfigurasi yang dibaca dari environment dan tidak di-commit",
            "Dikirim dari browser bersama formulir",
          ],
          answer: 2,
          explanation:
            "Kredensial adalah rahasia: disimpan di environment atau file .env yang diabaikan git. Kode hanya membacanya, sehingga repo bisa dibagikan tanpa membocorkan akses.",
        },
      ],
    },
    {
      slug: "lap-api-tugas",
      title: "Mini Proyek 1: API Tugas",
      summary: "Bangun API tugas mini dengan perintah add, done, dan list dari stdin, lengkap dengan validasi.",
      steps: [
        {
          kind: "theory",
          title: "Endpoint dalam bentuk baris perintah",
          body: "API tugas mini bekerja seperti endpoint REST yang sudah lazim: menambah tugas, melihat daftar, menandai selesai. Di aplikasi web sungguhan ketiganya adalah `POST /tugas`, `GET /tugas`, dan perubahan status di `/tugas/{id}`; di latihan ini masukannya baris perintah dari stdin dan jawabannya stdout, supaya bisa diuji ulang dengan hasil yang persis sama.\n\nStruktur programnya tetap pola aplikasi nyata: baca masukan, validasi, ubah state, jawab dengan format yang tetap. State disimpan array; tiap tugas membawa judul dan status selesai. Nomor tugas 1-based supaya manusia nyaman membacanya, dan setiap kali menyentuh array, ingat selisih satu: tugas nomor 3 tinggal di index 2.\n\nPerhatikan juga kontrak yang tegas: judul boleh mengandung spasi, jadi pemisahan perintah dan argumen memakai batas dua bagian (`explode` dengan limit 2). Perintah yang tidak dikenal dijawab dengan pesan, bukan didiamkan. Kebiasaan kecil seperti inilah yang membedakan program sekadar jalan dengan program yang enak dipakai.",
          code: {
            language: "php",
            content: `<?php
// pola handler: menerima state, mengubah, mengembalikan
function tambahTugas(array $tugas, string $judul): array
{
    $tugas[] = ["judul" => $judul, "selesai" => false];
    echo "ditambahkan #" . count($tugas) . ": $judul\\n";

    return $tugas;
}`,
            caption: "Handler kecil dengan kontrak yang jelas mudah diuji terpisah.",
          },
        },
        {
          kind: "code",
          title: "Selesaikan API tugas mini",
          prompt:
            "Baris pertama stdin: jumlah perintah. Tiap baris berikut: `add <judul>`, `done <nomor>`, atau `list`. Tugas bernomor mulai 1 dan judul boleh mengandung spasi. Jawaban tiap perintah: add mencetak `ditambahkan #<nomor>: <judul>`; done mencetak `selesai: <judul>`, atau `sudah selesai: <judul>` bila sebelumnya sudah selesai, atau `nomor tidak ada` bila nomornya di luar daftar; list mencetak tiap tugas sebagai `<nomor>. [x] <judul>` bila selesai atau `<nomor>. [ ] <judul>` bila belum, dan `belum ada tugas` bila kosong. Lengkapi tiga kekosongan.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

$tugas = [];
$jumlah = (int) trim(fgets(STDIN));

for ($i = 0; $i < $jumlah; $i++) {
    [$perintah, $argumen] = array_pad(explode(" ", trim(fgets(STDIN)), 2), 2, "");

    if ($perintah === "add") {
        $tugas[] = ["judul" => $argumen, "selesai" => false];
        echo "ditambahkan #" . count($tugas) . ": $argumen\\n";
    } elseif ($perintah === "done") {
        $nomor = (int) $argumen;
        if ($nomor < 1 || $nomor > ___) {
            echo "nomor tidak ada\\n";
        } elseif ($tugas[$nomor - 1]["selesai"]) {
            echo "sudah selesai: " . $tugas[$nomor - 1]["judul"] . "\\n";
        } else {
            $tugas[___]["selesai"] = true;
            echo "selesai: " . $tugas[$nomor - 1]["judul"] . "\\n";
        }
    } elseif ($perintah === "list") {
        if ($tugas === []) {
            echo "belum ada tugas\\n";
        }
        foreach ($tugas as $k => $t) {
            $tanda = $t["selesai"] ? "x" : ___;
            echo ($k + 1) . ". [$tanda] " . $t["judul"] . "\\n";
        }
    } else {
        echo "perintah tidak dikenal\\n";
    }
}`,
          solution: `<?php
declare(strict_types=1);

$tugas = [];
$jumlah = (int) trim(fgets(STDIN));

for ($i = 0; $i < $jumlah; $i++) {
    [$perintah, $argumen] = array_pad(explode(" ", trim(fgets(STDIN)), 2), 2, "");

    if ($perintah === "add") {
        $tugas[] = ["judul" => $argumen, "selesai" => false];
        echo "ditambahkan #" . count($tugas) . ": $argumen\\n";
    } elseif ($perintah === "done") {
        $nomor = (int) $argumen;
        if ($nomor < 1 || $nomor > count($tugas)) {
            echo "nomor tidak ada\\n";
        } elseif ($tugas[$nomor - 1]["selesai"]) {
            echo "sudah selesai: " . $tugas[$nomor - 1]["judul"] . "\\n";
        } else {
            $tugas[$nomor - 1]["selesai"] = true;
            echo "selesai: " . $tugas[$nomor - 1]["judul"] . "\\n";
        }
    } elseif ($perintah === "list") {
        if ($tugas === []) {
            echo "belum ada tugas\\n";
        }
        foreach ($tugas as $k => $t) {
            $tanda = $t["selesai"] ? "x" : " ";
            echo ($k + 1) . ". [$tanda] " . $t["judul"] . "\\n";
        }
    } else {
        echo "perintah tidak dikenal\\n";
    }
}`,
          tests: [
            {
              stdin: "5\nadd Belajar PHP\nadd Kirim laporan\ndone 1\nlist\ndone 5",
              expectedOutput:
                "ditambahkan #1: Belajar PHP\nditambahkan #2: Kirim laporan\nselesai: Belajar PHP\n1. [x] Belajar PHP\n2. [ ] Kirim laporan\nnomor tidak ada",
            },
            {
              stdin: "3\nlist\nadd Nonton kelas\ndone 1",
              expectedOutput: "belum ada tugas\nditambahkan #1: Nonton kelas\nselesai: Nonton kelas",
            },
            {
              stdin: "4\nadd A\ndone 1\ndone 1\nlist",
              expectedOutput: "ditambahkan #1: A\nselesai: A\nsudah selesai: A\n1. [x] A",
              hidden: true,
            },
          ],
          hints: [
            "Nomor tugas 1-based, array 0-based. Tugas nomor N tinggal di index N dikurangi satu.",
            "Nomor dianggap sah bila antara 1 dan jumlah tugas. Jumlahnya bisa dihitung dengan count($tugas).",
            "Tanda tugas: x bila selesai, dan satu spasi di dalam tanda kutip bila belum: \" \".",
          ],
        },
      ],
    },
    {
      slug: "lap-laporan-penjualan",
      title: "Mini Proyek 2: Laporan Penjualan",
      summary: "Baca data transaksi dari stdin, agregasi omzet dan terlaris, lalu sajikan laporan rapi.",
      steps: [
        {
          kind: "theory",
          title: "Parsing, pemrosesan, penyajian",
          body: "Pekerjaan dengan data nyata mengikuti pola yang bisa diandalkan: parsing, pemrosesan, penyajian. Parsing mengubah baris teks menjadi nilai yang bisa dihitung (`explode` lalu cast ke int). Pemrosesan mengelola akumulator: menjumlahkan omzet, mencatat transaksi terbesar. Penyajian memformat hasil untuk manusia, misalnya `number_format($nilai, 0, \",\", \".\")` untuk menulis 1250000 sebagai 1.250.000 sesuai gaya Indonesia.\n\nTempat paling licin ada di pencarian nilai terbesar. Yang dibandingkan harus besaran yang benar: nilai transaksi adalah jumlah dikali harga, bukan jumlahnya saja; menjual 2 buah barang mahal bisa melebihi 10 buah barang murah. Akumulatornya juga harus dimulai dari nilai yang kalah dari semua kandidat, misalnya -1, dan pembandingnya `>` supaya kasus seri jatuh ke yang muncul lebih dulu.\n\nRata-rata pun punya keputusan yang harus dijelaskan: dibulatkan ke atas, ke bawah, atau apa. Di latihan ini dipilih ke bawah lewat `intdiv`, dan aturan itu ditulis di soalnya supaya jawabannya tidak rancu.",
          code: {
            language: "php",
            content: `<?php
// tiga tahap dalam empat baris: pecah, hitung, sajikan
[$produk, $jumlah, $harga] = explode("|", "Kopi|2|50000");

$nilai = (int) $jumlah * (int) $harga;

echo "omzet: Rp" . number_format($nilai, 0, ",", ".");
// omzet: Rp100.000`,
            caption: "number_format dengan pemisah ribuan titik untuk format Indonesia.",
          },
        },
        {
          kind: "code",
          title: "Perbaiki pencarian produk terlaris",
          prompt:
            "Program membaca N lalu N baris data `produk|jumlah|harga`, lalu mencetak tiga baris laporan: total omzet, produk dengan nilai transaksi terbesar (jumlah kali harga; bila seri, yang muncul lebih dulu), dan rata-rata per transaksi dibulatkan ke bawah. Total dan rata-ratanya sudah benar, tetapi produk terlaris yang keluar saat ini sering meleset. Cari satu kekeliruannya dan perbaiki.",
          mode: "fix",
          template: `<?php
declare(strict_types=1);

$n = (int) trim(fgets(STDIN));
$omzet = 0;
$nilaiTerbesar = -1;
$produkTerlaris = "";

for ($i = 0; $i < $n; $i++) {
    [$produk, $jumlah, $harga] = explode("|", trim(fgets(STDIN)));
    $nilai = (int) $jumlah * (int) $harga;
    $omzet += $nilai;
    if ($jumlah > $nilaiTerbesar) {
        $nilaiTerbesar = $nilai;
        $produkTerlaris = $produk;
    }
}

echo "total omzet: Rp" . number_format($omzet, 0, ",", ".") . "\\n";
echo "produk terlaris: $produkTerlaris\\n";
echo "rata-rata: Rp" . number_format(intdiv($omzet, $n), 0, ",", ".") . "\\n";`,
          solution: `<?php
declare(strict_types=1);

$n = (int) trim(fgets(STDIN));
$omzet = 0;
$nilaiTerbesar = -1;
$produkTerlaris = "";

for ($i = 0; $i < $n; $i++) {
    [$produk, $jumlah, $harga] = explode("|", trim(fgets(STDIN)));
    $nilai = (int) $jumlah * (int) $harga;
    $omzet += $nilai;
    if ($nilai > $nilaiTerbesar) {
        $nilaiTerbesar = $nilai;
        $produkTerlaris = $produk;
    }
}

echo "total omzet: Rp" . number_format($omzet, 0, ",", ".") . "\\n";
echo "produk terlaris: $produkTerlaris\\n";
echo "rata-rata: Rp" . number_format(intdiv($omzet, $n), 0, ",", ".") . "\\n";`,
          tests: [
            {
              stdin: "3\nGula|10|3000\nKopi|2|50000\nTeh|1|80000",
              expectedOutput: "total omzet: Rp210.000\nproduk terlaris: Kopi\nrata-rata: Rp70.000",
            },
            {
              stdin: "1\ndompet|1|125000",
              expectedOutput: "total omzet: Rp125.000\nproduk terlaris: dompet\nrata-rata: Rp125.000",
            },
            {
              stdin: "4\nBuku|3|15000\nPena|50|500\nTas|1|90000\nCangkir|4|25000",
              expectedOutput: "total omzet: Rp260.000\nproduk terlaris: Cangkir\nrata-rata: Rp65.000",
              hidden: true,
            },
          ],
          hints: [
            "Lihat isi loop: pembanding di dalam if memakai variabel yang belum dikalikan harga.",
            "Nilai transaksi sudah dihitung tepat di atasnya: $nilai adalah jumlah kali harga. Pembandingnya seharusnya memakai $nilai.",
            "Ubah if ($jumlah > $nilaiTerbesar) menjadi if ($nilai > $nilaiTerbesar).",
          ],
        },
      ],
    },
    {
      slug: "lap-kalkulator-exception",
      title: "Mini Proyek 3: Kalkulator dengan Exception",
      summary: "Kalkulator baris perintah yang lempar exception bernama dan tetap hidup setelah kesalahan.",
      steps: [
        {
          kind: "theory",
          title: "Gagal dengan nama, lalu lanjutkan",
          body: "Program yang dipakai orang lain pasti menemui masukan yang tidak rapi: pembagian dengan nol, operator yang tidak ada, angka yang hilang. Pilihan pertama, membiarkan program mati dengan pesan error bawaan PHP, memang mudah; tapi satu baris buruk menutup seluruh sesi. Pilihan yang lebih dewasa: lempar exception dengan nama yang jelas, tangkap di satu tempat, laporkan, lalu lanjutkan.\n\nException buatan sendiri memberi nama pada kegagalan: `BagiNolException` menyampaikan maksud lebih baik daripada memakai RuntimeException generik. Sejak PHP 8, `throw` adalah ekspresi, jadi bisa berdiri di dalam arm match, misalnya arm pembagian yang menolak penyebut nol tepat di tempat aturannya berada.\n\nLetak try/catch juga keputusan desain. Di latihan ini ia melingkupi satu baris masukan di dalam loop: kesalahan satu baris dilaporkan dan loop berlanjut ke baris berikutnya, seperti server yang tetap hidup meski satu request gagal.",
          code: {
            language: "php",
            content: `<?php
class BagiNolException extends RuntimeException
{
}

function bagi(float $a, float $b): float
{
    if ($b === 0.0) {
        throw new BagiNolException("pembagian dengan nol");
    }

    return $a / $b;
}

try {
    echo bagi(10, 0);
} catch (BagiNolException $e) {
    echo "ditangkap: " . $e->getMessage();
}
// ditangkap: pembagian dengan nol`,
            caption: "Kesalahan dilaporkan dengan pesan yang jelas; program tetap hidup.",
          },
        },
        {
          kind: "code",
          title: "Kalkulator yang tidak mati di tengah jalan",
          prompt:
            "Kalkulator membaca baris sampai habis; tiap baris berformat `a op b` dengan op salah satu dari `+`, `-`, `*`, `/`. Hasil dicetak per baris: bilangan bulat tanpa desimal (misalnya `15`), selain itu dibulatkan empat desimal (misalnya `2.5`). Pembagian dengan penyebut nol melempar `BagiNolException` berpesan `pembagian dengan nol`, dan operator di luar empat itu dilempar dari arm `default` dengan pesan `operator <op> tidak dikenal`. Kesalahan dicetak sebagai `error: <pesan>` dan program lanjut ke baris berikutnya. Lengkapi tiga kekosongan.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

class BagiNolException extends RuntimeException
{
}

class OperatorTidakDikenalException extends InvalidArgumentException
{
}

function hitung(float $a, string $op, float $b): float
{
    return match ($op) {
        "+" => $a + $b,
        "-" => $a - $b,
        "*" => $a * $b,
        "/" => $b === 0.0 ? throw new BagiNolException(___) : $a / $b,
        ___ => throw new OperatorTidakDikenalException("operator $op tidak dikenal"),
    };
}

while (($baris = fgets(STDIN)) !== false) {
    $baris = trim($baris);
    if ($baris === "") {
        continue;
    }
    [$a, $op, $b] = explode(" ", $baris);
    try {
        $hasil = hitung((float) $a, $op, (float) $b);
        echo ($hasil == (int) $hasil ? (string) (int) $hasil : (string) round($hasil, 4)) . "\\n";
    } catch (RuntimeException | InvalidArgumentException $e) {
        echo ___ . $e->getMessage() . "\\n";
    }
}`,
          solution: `<?php
declare(strict_types=1);

class BagiNolException extends RuntimeException
{
}

class OperatorTidakDikenalException extends InvalidArgumentException
{
}

function hitung(float $a, string $op, float $b): float
{
    return match ($op) {
        "+" => $a + $b,
        "-" => $a - $b,
        "*" => $a * $b,
        "/" => $b === 0.0 ? throw new BagiNolException("pembagian dengan nol") : $a / $b,
        default => throw new OperatorTidakDikenalException("operator $op tidak dikenal"),
    };
}

while (($baris = fgets(STDIN)) !== false) {
    $baris = trim($baris);
    if ($baris === "") {
        continue;
    }
    [$a, $op, $b] = explode(" ", $baris);
    try {
        $hasil = hitung((float) $a, $op, (float) $b);
        echo ($hasil == (int) $hasil ? (string) (int) $hasil : (string) round($hasil, 4)) . "\\n";
    } catch (RuntimeException | InvalidArgumentException $e) {
        echo "error: " . $e->getMessage() . "\\n";
    }
}`,
          tests: [
            {
              stdin: "10 + 5\n8 / 0\n7 * 3\n9 ? 2\n10 / 4",
              expectedOutput: "15\nerror: pembagian dengan nol\n21\nerror: operator ? tidak dikenal\n2.5",
            },
            { stdin: "3.5 + 1.5\n5 / 2\n2 - 10", expectedOutput: "5\n2.5\n-8" },
            { stdin: "0 / 5\n1 / 3\n6 / 0", expectedOutput: "0\n0.3333\nerror: pembagian dengan nol", hidden: true },
          ],
          hints: [
            "Pesan exception harus persis seperti yang dijanjikan soal: \"pembagian dengan nol\", lengkap dengan tanda kutipnya di kode.",
            "Arm penampung sisa pada match bernama default; di situlah operator tak dikenal dilempar.",
            "Awalan laporan kesalahan adalah teks \"error: \" diikuti pesan exception lewat $e->getMessage().",
          ],
        },
      ],
    },
    {
      slug: "lap-checklist-kerja",
      title: "Checklist Kesiapan Kerja",
      summary: "Rangkum kebiasaan yang dicari pemberi kerja dan ubah jalur ini jadi bukti portofolio.",
      steps: [
        {
          kind: "theory",
          title: "Dari materi ke bukti",
          body: "Sepuluh modul lewat; mari lurus dulu soal yang sudah di tangan: bahasa inti dan idiom PHP 8, array dan fungsi, OOP dari class sampai trait, exception, request dan response, file serta JSON, Composer dengan autoloading dan pengujian, sampai pola aplikasi seperti front controller, router, prepared statement, dan hashing password. Itu peta keterampilan yang nyata, bukan sekadar daftar topik yang dilewati.\n\nYang ditanyakan pemberi kerja pada kandidat junior biasanya bukan hafalan, melainkan kebiasaan: memakai Composer dan git tiap hari, mengikuti gaya kode tim seperti PSR-12, menulis test untuk logika inti, dan menuntaskan keamanan dasar: placeholder di query, `password_hash` untuk sandi, `htmlspecialchars` untuk keluaran. Semuanya sudah pernah kamu lakukan di jalur ini.\n\nCara mengubahnya jadi bukti: bangun satu atau dua proyek sampai benar-benar selesai, simpan di git dengan README yang menjelaskan cara menjalankannya, dan sertakan test untuk bagian logikanya. Lalu minta orang lain meninjau. Proyek kecil yang utuh dan teruji berbicara lebih jujur daripada banyak proyek setengah jalan.",
          code: {
            language: "json",
            content: `{
    "scripts": {
        "test": "phpunit --testdox",
        "cek": "php-cs-fixer fix --dry-run --diff"
    }
}`,
            caption: "composer test dan composer cek: menjalankan pengujian dan pemeriksaan gaya kode.",
          },
        },
        {
          kind: "quiz",
          question: "Proyek portofolio seperti apa yang paling meyakinkan saat melamar kerja junior PHP?",
          options: [
            "Sepuluh proyek setengah jadi supaya terlihat luas",
            "Satu atau dua proyek yang selesai: ada di git, README menjelaskan cara menjalankannya, dan logika intinya ada testnya",
            "Semua kode dipadatkan dalam satu file supaya terlihat sederhana",
            "Proyek yang tidak ditaruh di git agar riwayat kesalahan tidak terlihat",
          ],
          answer: 1,
          explanation:
            "Pemberi kerja menilai kebiasaan kerja: proyek yang selesai, terdokumentasi, dan teruji menunjukkan cara kerja, bukan sekadar pernah menyentuh banyak topik.",
        },
      ],
    },
    {
      slug: "lap-rekap-lanjutan",
      title: "Rekap dan Jalur Lanjutan",
      summary: "Rangkum perjalanan sepuluh modul dan pilih langkah berikutnya: framework, test, dan kode orang lain.",
      steps: [
        {
          kind: "theory",
          title: "Perjalanan sepuluh modul",
          body: "Perjalanan jalur ini bisa diringkas satu kalimat: dari menulis PHP yang benar menjadi merancang program PHP yang tahan pakai. Awalnya kita merapikan idiom dan perbandingan, lalu array dan fungsi, dua modul OOP, exception, web dan request, file dan data, Composer dengan pengujian, dan ditutup pola aplikasi beserta tiga mini proyek. Kekuatan yang terbentuk bukan hafalan fungsi, melainkan kebiasaan: data pengguna tidak dipercaya, logika inti hidup di fungsi murni yang dites, state dibungkus class, dan kegagalan dilempar dengan nama yang jelas.\n\nLanjutannya jelas: framework. Laravel adalah pilihan yang paling banyak dipakai di ekosistem PHP Indonesia, dan Symfony layak dipelajari untuk memahami komponennya yang dipakai di mana-mana. Semua yang sudah dikuasai adalah bekal langsung: routing, autoloading, pengujian, prepared statement, hashing. Di framework, kamu akan mengenali semua itu lagi, hanya dengan pakaian baru.\n\nSelain framework, tiga arah menambah tenaga: perdalam pengujian (test integrasi dan mock), pelajari Docker supaya aplikasi berjalan konsisten di mesin siapa pun, dan biasakan membaca kode proyek open source PHP untuk melihat pola nyata dalam skala besar. Jalur ini selesai, tapi siklusnya belum: bangun, rusak, perbaiki, ulangi.",
          code: {
            language: "bash",
            content: `composer create-project laravel/laravel aplikasi-tugas
cd aplikasi-tugas
php artisan serve`,
            caption: "Satu perintah Composer dan kamu berdiri di atas segala yang sudah dipelajari.",
          },
        },
        {
          kind: "quiz",
          question: "Langkah paling masuk akal setelah menyelesaikan jalur ini adalah...",
          options: [
            "Menghafal ulang daftar fungsi bawaan PHP dari awal",
            "Membangun proyek nyata dengan framework seperti Laravel, memakai kebiasaan dari jalur ini: Composer, autoloading, pengujian, dan keamanan dasar",
            "Berhenti belajar karena materi sudah habis",
            "Meninggalkan Composer dan test pada proyek berikutnya supaya lebih cepat selesai",
          ],
          answer: 1,
          explanation:
            "Framework adalah tempat semua bekal ini dipakai bersama. Proyek nyata dengan kebiasaan yang benar menambah kemampuan lebih banyak daripada mengulang hafalan.",
        },
      ],
    },
  ],
};
