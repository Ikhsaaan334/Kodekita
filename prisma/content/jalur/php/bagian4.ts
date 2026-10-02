import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "php",
  moduleRange: [6, 7],
  modules: [
    {
      title: "Web dan Request",
      description: "Superglobal GET/POST, validasi dan sanitasi, session, cookie, header.",
    },
    {
      title: "File, JSON, dan Data",
      description: "File I/O, json_encode/decode, csv, dan serialisasi aman.",
    },
  ],
  lessons: [
    // ==================== MODUL 6: Web dan Request ====================
    {
      slug: "web-request-response",
      title: "Model Request dan Response",
      summary: "Pola dasar web: browser mengirim request, PHP membalas response, dan GET berbeda dari POST.",
      steps: [
        {
          kind: "theory",
          title: "Dua arah: request dan response",
          body: "Setiap interaksi web mengikuti satu pola: request dan response. Browser mengirim request berisi method (GET atau POST), path tujuan seperti /profil.php, header, dan kadang body berisi data. PHP di server membaca semuanya, menjalankan logika, lalu mengembalikan response berupa kode status, header, dan isi halaman. Satu request menghasilkan satu response, selesai, dan server langsung melupakan pengguna itu.\n\nMethod menentukan makna kiriman. GET menaruh data di URL setelah tanda tanya, misalnya /cari.php?kata=php, sehingga terlihat, ikut tersimpan di riwayat browser, dan cocok untuk membaca. POST menaruh data di body request sehingga tidak menempel di URL, dan cocok untuk mengubah sesuatu: mendaftar, login, mengirim formulir. Password yang lewat GET akan tersimpan di riwayat dan log server, jadi formulir sensitif selalu POST.\n\nResponse punya kode status sebagai ringkasan hasil: 200 berarti berhasil, 302 berarti pindah ke URL lain, 404 berarti halaman tidak ada, 500 berarti server error. Di modul ini latihan menyimulasikan isi request lewat stdin karena juri membaca stdin dan stdout; superglobal sungguhan seperti $_GET dan $_POST kita bahas di theory, sementara format datanya sama persis.",
          code: {
            language: "php",
            content: `<?php
// Skrip web sederhana yang menerima /sapa.php?nama=Budi

$nama = $_GET["nama"] ?? "tamu";
echo "Halo, " . htmlspecialchars($nama);
// Response: status 200, body "Halo, Budi"`,
            caption: "Di server sungguhan, isi query string sudah tersedia di $_GET.",
          },
        },
        {
          kind: "quiz",
          question: "Formulir login mengirim username dan password. Method mana yang tepat, dan mengapa?",
          options: [
            "GET, karena password ikut terlihat di URL sehingga mudah dicek",
            "POST, karena data dikirim di body request dan tidak menempel di URL",
            "GET, karena lebih cepat untuk data yang kecil",
            "POST, karena POST mengenkripsi password secara otomatis",
          ],
          answer: 1,
          explanation:
            "POST mengirim data di body sehingga tidak tersimpan di riwayat browser atau log akses. Catatan: POST tidak mengenkripsi apa pun; kerahasiaan jalan di lapisan HTTPS, bukan di method.",
        },
      ],
    },
    {
      slug: "web-query-string",
      title: "Query String dan parse_str",
      summary: "Memecah baris nama=Budi&umur=17 menjadi array, persis seperti kerja $_GET.",
      steps: [
        {
          kind: "theory",
          title: "Memecah query string seperti $_GET",
          body: "Query string adalah bagian URL setelah tanda tanya: nama=Budi&umur=17. Setiap pasangan kunci=nilai dipisah tanda `&`. Saat request GET masuk, PHP memecah string itu secara otomatis dan menyimpannya di superglobal `$_GET`, sehingga `$_GET[\"nama\"]` langsung berisi \"Budi\".\n\nFungsi yang mengerjakan pekerjaan yang sama adalah `parse_str($teks, $hasil)`: ia mengisi array `$hasil` dengan pasangan kunci dan nilai. Di latihan platform ini baris pertama stdin berisi query string tiruan, jadi kita memanggil parse_str sendiri. Hasilnya identik dengan yang $_GET sediakan di server sungguhan.\n\nSatu peringatan: `parse_str($teks)` tanpa argumen kedua mengisi variabel lokal langsung dari string itu, perilaku warisan yang berbahaya karena pengguna ikut menentukan nama variabelnya. Selalu sediakan argumen kedua. Dan karena hasil parsing bertipe string, lakukan validasi sebelum dipakai sebagai angka, topik lesson berikutnya.",
          code: {
            language: "php",
            content: `<?php
$query = "nama=Budi&umur=17&kota=Bandung";

parse_str($query, $get);

echo $get["nama"];              // Budi
echo $get["umur"] + 10;         // 27
echo $get["email"] ?? "kosong"; // kosong`,
            caption: "parse_str mengisi array; kunci yang tidak ada dicek dengan ??.",
          },
        },
        {
          kind: "code",
          title: "Lengkapi parser query string",
          prompt:
            "Program membaca satu baris query string dari stdin. Lengkapi dua kekosongan supaya baris pertama keluaran menyapa nama beserta umurnya, dan baris kedua menampilkan kota, atau teks `tidak diisi` bila kuncinya tidak ada.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

$query = trim(fgets(STDIN));
parse_str($query, ___);

echo "Halo " . $data["nama"] . ", umur " . $data["umur"] . "\\n";
echo "Kota: " . ($data["kota"] ___ "tidak diisi") . "\\n";`,
          solution: `<?php
declare(strict_types=1);

$query = trim(fgets(STDIN));
parse_str($query, $data);

echo "Halo " . $data["nama"] . ", umur " . $data["umur"] . "\\n";
echo "Kota: " . ($data["kota"] ?? "tidak diisi") . "\\n";`,
          tests: [
            { stdin: "nama=Budi&umur=17&kota=Bandung", expectedOutput: "Halo Budi, umur 17\nKota: Bandung" },
            { stdin: "nama=Sinta&umur=16", expectedOutput: "Halo Sinta, umur 16\nKota: tidak diisi" },
            { stdin: "nama=Rani&umur=19&kota=Medan", expectedOutput: "Halo Rani, umur 19\nKota: Medan", hidden: true },
          ],
          hints: [
            "Fungsi parse_str butuh dua argumen: teksnya dan array penampung hasilnya.",
            "Operator ?? memberi nilai bawaan bila kunci tidak ada di array.",
            "Jawabannya: isi ___ pertama dengan $data, dan ___ kedua dengan ??.",
          ],
        },
      ],
    },
    {
      slug: "web-validasi-input",
      title: "Validasi dengan filter_var",
      summary: "Periksa email dan rentang angka dengan filter_var sebelum data dipakai.",
      steps: [
        {
          kind: "theory",
          title: "filter_var: memutuskan terima atau tolak",
          body: "Aturan pertama data dari pengguna: jangan dipercaya. Validasi adalah proses memeriksa apakah data sesuai bentuk yang kita harapkan sebelum dipakai. PHP menyediakan `filter_var($nilai, $filter)` untuk pekerjaan ini. Ia mengembalikan nilainya bila valid dan false bila tidak, sehingga perbandingannya lazim ditulis `filter_var(...) !== false`.\n\nDua filter yang paling sering dipakai: `FILTER_VALIDATE_EMAIL` untuk alamat email dan `FILTER_VALIDATE_INT` untuk bilangan bulat. FILTER_VALIDATE_INT bisa diberi batas lewat array opsi: `[\"options\" => [\"min_range\" => 1, \"max_range\" => 120]]`. Dengan itu umur 300 ditolak tanpa kita menulis perbandingan manual.\n\nBedakan validasi dari sanitasi. Validasi memutuskan terima atau tolak, dan bila data gagal, jawabannya menolak kiriman, bukan memperbaiki diam-diam. Sanitasi membersihkan teks agar aman saat ditampilkan, dan itu topik lesson berikutnya. Keduanya dipakai berdampingan: validasi di pintu masuk, sanitasi sebelum keluar.",
          code: {
            language: "php",
            content: `<?php
$email = "budi@mail.com";
$umur = "300";

var_dump(filter_var($email, FILTER_VALIDATE_EMAIL) !== false); // bool(true)

$umurValid = filter_var($umur, FILTER_VALIDATE_INT, [
    "options" => ["min_range" => 1, "max_range" => 120],
]);
var_dump($umurValid); // bool(false): 300 di luar rentang`,
            caption: "filter_var mengembalikan false untuk data yang ditolak.",
          },
        },
        {
          kind: "code",
          title: "Periksa email dan umur",
          prompt:
            "Program membaca dua baris: alamat email lalu umur. Lengkapi dua kekosongan sehingga program mencetak `email: valid` atau `email: tidak valid`, lalu `umur: valid` atau `umur: tidak valid` (rentang sah 1 sampai 120).",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

$email = trim(fgets(STDIN));
$umur = trim(fgets(STDIN));

$emailValid = filter_var($email, ___) !== false;
$umurValid = filter_var($umur, FILTER_VALIDATE_INT, [
    "options" => ["min_range" => 1, ___ => 120],
]) !== false;

echo "email: " . ($emailValid ? "valid" : "tidak valid") . "\\n";
echo "umur: " . ($umurValid ? "valid" : "tidak valid") . "\\n";`,
          solution: `<?php
declare(strict_types=1);

$email = trim(fgets(STDIN));
$umur = trim(fgets(STDIN));

$emailValid = filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
$umurValid = filter_var($umur, FILTER_VALIDATE_INT, [
    "options" => ["min_range" => 1, "max_range" => 120],
]) !== false;

echo "email: " . ($emailValid ? "valid" : "tidak valid") . "\\n";
echo "umur: " . ($umurValid ? "valid" : "tidak valid") . "\\n";`,
          tests: [
            { stdin: "budi@mail.com\n17", expectedOutput: "email: valid\numur: valid" },
            { stdin: "budi@@mail\n17", expectedOutput: "email: tidak valid\numur: valid" },
            { stdin: "budi@mail.com\n300", expectedOutput: "email: valid\numur: tidak valid", hidden: true },
          ],
          hints: [
            "Konstanta filter untuk email diawali FILTER_VALIDATE_.",
            "Untuk batas atas rentang, kunci opsinya max_range, ditulis sebagai kunci array bertanda kutip.",
            "Jawabannya: FILTER_VALIDATE_EMAIL dan \"max_range\".",
          ],
        },
      ],
    },
    {
      slug: "web-sanitasi-output",
      title: "Sanitasi dengan htmlspecialchars",
      summary: "Netralkan tag HTML dengan htmlspecialchars dan buang tag dengan strip_tags.",
      steps: [
        {
          kind: "theory",
          title: "Teks tetap teks, bukan kode",
          body: "Sanitasi adalah pembersihan sebelum data ditampilkan. Bayangkan komentar pengguna berisi `<script>alert(1)</script>`. Bila dicetak mentah ke halaman HTML, browser mengeksekusinya. Serangan menyisipkan kode lewat input seperti ini disebut XSS, dan pertahanan pertamanya sederhana: jangan pernah mencetak input pengguna sebagai HTML.\n\n`htmlspecialchars($teks)` mengubah karakter istimewa HTML menjadi entity: `<` menjadi `&lt;`, `>` menjadi `&gt;`, `&` menjadi `&amp;`, dan sejak PHP 8.1 tanda kutip ikut juga. Hasilnya tampil persis sebagai teks yang diketik pengguna, tanpa pernah dijalankan. Fungsi ini wajib di setiap tempat input pengguna bertemu HTML.\n\nAlternatifnya `strip_tags($teks)` yang membuang tag sama sekali: `<b>halo</b>` menjadi halo. Pakai strip_tags saat tag memang tidak bernilai, misalnya ringkasan artikel; pakai htmlspecialchars saat isinya harus tampil utuh, misalnya komentar. Jangan gantungkan keamanan pada strip_tags saja karena tag yang ditulis salah kadang lolos, sementara htmlspecialchars selalu menetralkan.",
          code: {
            language: "php",
            content: `<?php
$komentar = "<b>Penting</b> & <script>aku</script>";

echo htmlspecialchars($komentar);
// &lt;b&gt;Penting&lt;/b&gt; &amp; &lt;script&gt;aku&lt;/script&gt;

echo strip_tags($komentar);
// Penting & aku`,
            caption: "htmlspecialchars menetralkan, strip_tags membuang.",
          },
        },
        {
          kind: "code",
          title: "Dua cara membersihkan komentar",
          prompt:
            "Program membaca satu baris komentar. Lengkapi dua fungsi pembersih: baris pertama keluaran adalah versi yang karakter HTMLnya dinetralkan menjadi entity, baris kedua versi tanpa tag sama sekali.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

$komentar = trim(fgets(STDIN));

echo ___($komentar) . "\\n";
echo ___($komentar) . "\\n";`,
          solution: `<?php
declare(strict_types=1);

$komentar = trim(fgets(STDIN));

echo htmlspecialchars($komentar) . "\\n";
echo strip_tags($komentar) . "\\n";`,
          tests: [
            { stdin: "<b>Tebak</b>", expectedOutput: "&lt;b&gt;Tebak&lt;/b&gt;\nTebak" },
            { stdin: "<i>Penting</i> dan aman", expectedOutput: "&lt;i&gt;Penting&lt;/i&gt; dan aman\nPenting dan aman" },
            { stdin: "Tulisan & <em>tebal</em>", expectedOutput: "Tulisan &amp; &lt;em&gt;tebal&lt;/em&gt;\nTulisan & tebal", hidden: true },
          ],
          hints: [
            "Fungsi pertama mengubah < menjadi &lt;; fungsi kedua menghapus tag sepenuhnya.",
            "Keduanya fungsi bawaan PHP yang menerima satu argumen: teks komentarnya.",
            "Jawabannya: htmlspecialchars untuk baris pertama, strip_tags untuk baris kedua.",
          ],
        },
      ],
    },
    {
      slug: "web-session",
      title: "Session: Mengingat Pengguna",
      summary: "Kenapa HTTP pelupa, dan bagaimana session menyimpan data pengguna di server.",
      steps: [
        {
          kind: "theory",
          title: "Ingatan di sisi server",
          body: "HTTP tidak ingat apa pun: dua request dari browser yang sama diperlakukan seperti dua orang asing. Padahal aplikasi butuh mengingat status login, isi keranjang, atau langkah formulir yang sedang diisi. Session menyelesaikan ini dengan dua bagian: data disimpan di server, dan browser hanya menyimpan sebuah tiket berisi session ID di cookie PHPSESSID.\n\nDi PHP, `session_start()` dipanggil di awal sebelum ada output, lalu data dibaca dan ditulis lewat superglobal `$_SESSION` yang bentuknya array asosiatif biasa. Isinya bertahan antar request karena PHP menyimpannya sebagai file di server, bukan di browser. Saat pengguna logout, `session_destroy()` menghapus data di sisi server.\n\nKarena data aslinya di server, session cocok untuk informasi penting seperti status login: pengguna hanya memegang ID acak, bukan isinya. Sisi lemahnya, session butuh penyimpanan server, dan sesi bisa dibajak bila session ID bocor, untuk itu ada masa berlaku dan regenerasi ID. Di platform ini $_SESSION tidak bisa dijalankan lewat juri karena butuh server web, jadi materi ini cukup dipahami lewat theory dan quiz.",
          code: {
            language: "php",
            content: `<?php
session_start(); // wajib paling awal, sebelum echo apa pun

$_SESSION["kunjungan"] = ($_SESSION["kunjungan"] ?? 0) + 1;
echo "Kunjungan ke-" . $_SESSION["kunjungan"];
// Request ke-3 dari pengguna yang sama mencetak: Kunjungan ke-3

// Saat logout:
// session_destroy();`,
            caption: "Satu array yang bertahan antar request, disimpan di server.",
          },
        },
        {
          kind: "quiz",
          question: "Di mana isi $_SESSION sebenarnya disimpan?",
          options: [
            "Di cookie browser, isinya utuh tersimpan",
            "Di URL setiap halaman yang dikunjungi",
            "Di server, browser hanya menyimpan session ID",
            "Di harddisk pengguna, terenkripsi oleh browser",
          ],
          answer: 2,
          explanation:
            "Session menyimpan datanya di server (umumnya sebagai file). Cookie PHPSESSID di browser hanya berisi ID acak untuk menemukan data itu kembali pada request berikutnya.",
        },
      ],
    },
    {
      slug: "web-cookie",
      title: "Cookie: Data di Sisi Browser",
      summary: "Server menitip data ke browser lewat cookie, dan batas-batasnya.",
      steps: [
        {
          kind: "theory",
          title: "Titipan yang dikembalikan setiap request",
          body: "Cookie adalah pasangan kunci=nilai yang server titipkan ke browser lewat header `Set-Cookie`. Sejak saat itu browser mengirimkan kembali cookie itu di header `Cookie` pada setiap request ke domain yang sama. Di PHP, server menulis cookie dengan `setcookie()` dan membaca kiriman balik browser dari superglobal `$_COOKIE`.\n\nMasa hidupnya dikendalikan lewat parameter ketiga: `setcookie(\"tema\", \"gelap\", time() + 86400)` berarti hidup 24 jam, sementara tanpa masa berlaku cookie hilang saat browser ditutup. Cookie cocok untuk data yang tidak sensitif dan memang milik browser: preferensi tema, bahasa, atau penanda keranjang tamu.\n\nBeda dengan session terletak pada tempat data. Isi cookie bisa dilihat dan diubah pengguna lewat menu developer, jadi nilai seperti role=admin yang ditulis mentah di cookie adalah pintu masuk gratis bagi orang lain. Aturan praktisnya: cookie menyimpan penanda, server menyimpan kebenaran. Nilai cookie yang dipakai untuk keputusan penting harus diverifikasi ulang di server.",
          code: {
            language: "php",
            content: `<?php
// Kirim cookie selama 1 hari, berlaku di seluruh path
setcookie("tema", "gelap", time() + 86400, "/");

// Pada request berikutnya, browser mengembalikannya:
$tema = $_COOKIE["tema"] ?? "terang";
echo "Tema kamu: " . htmlspecialchars($tema);`,
            caption: "setcookie mengirim header Set-Cookie; $_COOKIE berisi kiriman balik browser.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa nilai seperti role=admin tidak boleh dipercaya langsung dari cookie?",
          options: [
            "Karena cookie selalu kedaluwarsa sebelum sempat dibaca",
            "Karena pengguna bisa melihat dan mengubah isi cookie di browsernya",
            "Karena PHP membaca cookie hanya lewat session",
            "Karena cookie tidak bisa menyimpan huruf",
          ],
          answer: 1,
          explanation:
            "Cookie disimpan di perangkat pengguna, sehingga isinya terbuka dan bisa ditulis ulang. Nilai yang menentukan hak akses harus disimpan di server dan diverifikasi ulang, bukan dipercaya dari cookie.",
        },
      ],
    },
    {
      slug: "web-header-redirect",
      title: "header() dan Redirect",
      summary: "Kirim header sebelum output, arahkan pengguna dengan Location, tutup dengan exit.",
      steps: [
        {
          kind: "theory",
          title: "Bicara langsung ke protokol",
          body: "Sebelum PHP mencetak isi halaman, ia boleh mengirim header: baris metadata protokol HTTP seperti kode status, tipe isi, atau perintah pindah halaman. Fungsinya `header($teks)`. Yang paling sering dipakai adalah redirect: `header(\"Location: /terima-kasih.php\")` menyuruh browser membuka URL lain, dan `header(\"Content-Type: application/json\")` memberi tahu bahwa isi response berupa JSON.\n\nAturan kerasnya: header harus dikirim sebelum ada byte output. Satu echo, satu spasi, atau baris kosong di luar tag PHP yang terlanjur terkirim membuat header() gagal dengan warning headers already sent. Karena itu skrip PHP biasa menaruh semua logika dan header di paling atas, baru menyusun halaman di bawahnya.\n\nRedirect yang benar selalu diikuti `exit`. Tanpa itu, PHP masih menjalankan sisa skrip di server walaupun browser sudah diarahkan pergi, dan itu bisa memproses data dua kali atau membocorkan isi. Pola lengkapnya: proses formulir POST, simpan datanya, kirim Location, exit. Browser lalu membuka halaman hasil dengan GET, sehingga tombol refresh tidak mengirim formulir ulang.",
          code: {
            language: "php",
            content: `<?php
// Setelah formulir berhasil diproses:
header("Location: /terima-kasih.php", true, 302);
exit;

// Baris di bawah tidak pernah dijalankan:
echo "sampai jumpa";`,
            caption: "Location lalu exit: pasangan wajib untuk redirect yang aman.",
          },
        },
        {
          kind: "quiz",
          question: "Kenapa header('Location: /sukses.php') harus langsung diikuti exit?",
          options: [
            "Karena exit mengisi isi halaman tujuan",
            "Karena header() wajib dipanggil dua kali",
            "Karena exit mempercepat redirect di browser",
            "Supaya sisa skrip berhenti dan tidak dijalankan setelah pengguna diarahkan pergi",
          ],
          answer: 3,
          explanation:
            "header() hanya menandai response, skrip tetap berjalan sampai selesai. exit menghentikannya sehingga kode setelah redirect tidak sempat memproses data lagi.",
        },
      ],
    },
    {
      slug: "web-json",
      title: "JSON sebagai Isi Request",
      summary: "Decode body request menjadi array, proses, lalu encode balik sebagai response.",
      steps: [
        {
          kind: "theory",
          title: "JSON masuk, JSON keluar",
          body: "API modern tidak bertukar HTML, melainkan JSON. Klien mengirim body request berupa JSON, PHP mengubahnya menjadi array dengan `json_decode($teks, true)`, memprosesnya, lalu membalas dengan `json_encode($data)`. Header `Content-Type: application/json` menyatakan perjanjian itu ke klien.\n\nArgumen kedua true pada json_decode menentukan bentuk hasil: true menghasilkan array asosiatif yang diakses dengan `[]`, sedangkan tanpa argumen hasilnya object stdClass yang diakses dengan `->`. Array asosiatif lebih mudah dicek dengan `??` dan isset, jadi true adalah pilihan bawaan yang aman saat memproses.\n\nDi latihan ini baris pertama stdin berisi JSON tiruan sebagaimana body request. Alurnya selalu sama: decode di pintu masuk, proses, encode di pintu keluar. Sejak PHP 8, JSON yang rusak membuat json_decode mengembalikan null; periksa hasilnya sebelum dipakai, atau tambahkan flag `JSON_THROW_ON_ERROR` agar kegagalan melempar exception yang bisa ditangkap try/catch.",
          code: {
            language: "php",
            content: `<?php
$body = '{"nama":"Budi","umur":17}';

$data = json_decode($body, true);
$data["umur"] += 1;

echo json_encode($data);
// {"nama":"Budi","umur":18}`,
            caption: "Decode di pintu masuk, encode di pintu keluar.",
          },
        },
        {
          kind: "code",
          title: "Balas request dengan JSON",
          prompt:
            "Program membaca satu baris JSON berisi `nama` dan `umur`. Lengkapi decode dan encode supaya keluarannya JSON balasan berisi `sapaan` dan `umur_tahun_depan`.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

$teks = trim(fgets(STDIN));
$data = json_decode($teks, ___);

$balasan = [
    "sapaan" => "Halo " . $data["nama"],
    "umur_tahun_depan" => $data["umur"] + 1,
];

echo ___($balasan) . "\\n";`,
          solution: `<?php
declare(strict_types=1);

$teks = trim(fgets(STDIN));
$data = json_decode($teks, true);

$balasan = [
    "sapaan" => "Halo " . $data["nama"],
    "umur_tahun_depan" => $data["umur"] + 1,
];

echo json_encode($balasan) . "\\n";`,
          tests: [
            { stdin: '{"nama":"Budi","umur":17}', expectedOutput: '{"sapaan":"Halo Budi","umur_tahun_depan":18}' },
            { stdin: '{"nama":"Sinta","umur":25}', expectedOutput: '{"sapaan":"Halo Sinta","umur_tahun_depan":26}' },
            { stdin: '{"nama":"Rani","umur":30}', expectedOutput: '{"sapaan":"Halo Rani","umur_tahun_depan":31}', hidden: true },
          ],
          hints: [
            "Argumen kedua true membuat json_decode mengembalikan array, bukan object.",
            "Mengubah array menjadi teks JSON memakai fungsi yang berlawanan dengan decode.",
            "Jawabannya: true untuk decode, dan json_encode untuk mencetak balasan.",
          ],
        },
      ],
    },
    {
      slug: "web-mini-routing",
      title: "Mini Routing dengan Array",
      summary: "Petakan path ke handler dengan array dan sediakan fallback 404.",
      steps: [
        {
          kind: "theory",
          title: "Satu pintu, banyak halaman",
          body: "Situs kecil punya satu file per halaman: beranda.php, profil.php. Situs yang tumbuh memakai cara lain: semua request masuk ke satu file yang disebut front controller, lalu kode memilih penangan sesuai path. Pemetaan path ke penangan itu disebut routing, dan tabelnya di PHP sering kali cuma array asosiatif.\n\nDi server sungguhan path dibaca dari `$_SERVER[\"REQUEST_URI\"]`. Nilai di tabel routing bisa berupa nama fungsi, string nama class, atau closure. Mengambilnya memakai `??` langsung menyelesaikan kasus 404: path yang tidak terdaftar jatuh ke handler bawaan yang merespons tidak ditemukan.\n\nFramework seperti Laravel atau Slim memakai pola yang sama persis, ditambah fitur: parameter di dalam path seperti /kursus/{id}, method yang disyaratkan, dan middleware. Memahami versi array-nya membuat semua itu terasa bukan sulap. Di latihan ini path tiruan dibaca dari stdin, dan handler ditulis sebagai closure `fn () => ...`.",
          code: {
            language: "php",
            content: `<?php
$path = "/kursus";

$routes = [
    "/"       => fn () => "Beranda KodeKita",
    "/kursus" => fn () => "Daftar kursus",
];

$handler = $routes[$path] ?? fn () => "404: tidak ditemukan";
echo $handler(); // Daftar kursus`,
            caption: "Path dicari di array; kunci yang hilang jatuh ke handler 404.",
          },
        },
        {
          kind: "code",
          title: "Bangun tabel routing",
          prompt:
            "Program membaca satu baris path dari stdin. Lengkapi handler di tabel routing dan pemilih handler bawaan, supaya path terdaftar mencetak isi halamannya dan path asing mencetak `404: halaman tidak ditemukan`.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

$path = trim(fgets(STDIN));

$routes = [
    "/" => ___ () => "Beranda KodeKita",
    "/kursus" => fn () => "Daftar kursus",
    "/profil" => fn () => "Profil pengguna",
];

$handler = $routes[$path] ___ fn () => "404: halaman tidak ditemukan";

echo $handler() . "\\n";`,
          solution: `<?php
declare(strict_types=1);

$path = trim(fgets(STDIN));

$routes = [
    "/" => fn () => "Beranda KodeKita",
    "/kursus" => fn () => "Daftar kursus",
    "/profil" => fn () => "Profil pengguna",
];

$handler = $routes[$path] ?? fn () => "404: halaman tidak ditemukan";

echo $handler() . "\\n";`,
          tests: [
            { stdin: "/kursus", expectedOutput: "Daftar kursus" },
            { stdin: "/", expectedOutput: "Beranda KodeKita" },
            { stdin: "/admin", expectedOutput: "404: halaman tidak ditemukan", hidden: true },
          ],
          hints: [
            "Handler ditulis sebagai arrow function: fn () => teks.",
            "Operator ?? memberi handler bawaan untuk path yang tidak terdaftar.",
            "Jawabannya: ___ pertama fn, ___ kedua ??.",
          ],
        },
      ],
    },
    {
      slug: "web-formulir",
      title: "Latihan Gabungan: Handler Formulir",
      summary: "Parse, validasi, dan balas satu kiriman pendaftaran dalam satu alur.",
      steps: [
        {
          kind: "theory",
          title: "Satu alur lengkap: parse, validasi, balas",
          body: "Latihan penutup merangkai modul ini menjadi satu handler formulir seperti yang dipanggil saat POST /daftar. Alurnya selalu sama: ambil data, validasi setiap field, lalu balas. Bila ada field gagal, response menyebut field apa dan mengapa dengan \"ok\": false. Bila semua lolos, barulah data dipakai.\n\nUrutan pemeriksaan menentukan isi pesan: program memeriksa nama, lalu email, lalu umur, dan berhenti di kegagalan pertama dengan exit setelah mengirim response. Pola berhenti dini seperti ini menjaga satu response per request dan pesan yang pasti. Response dikirim sebagai JSON, format yang biasa dipakai handler modern.\n\nPerhatikan juga nilainya tetap divalidasi meski datanya terlihat jelas: query string bisa saja berisi umur=abc atau email tanpa @. Pengguna yang tidak jahat pun tetap bisa salah ketik. Validasi di pintu masuk itulah yang membuat sisa program boleh percaya pada datanya.",
          code: {
            language: "php",
            content: `// Bentuk akhir program yang akan kamu lengkapi:
// input: nama=Budi&email=budi@mail.com&umur=17
// output: {"ok":true,"pesan":"Selamat datang, Budi"}

parse_str($query, $f);

if (filter_var($f["email"] ?? "", FILTER_VALIDATE_EMAIL) === false) {
    echo json_encode(["ok" => false, "pesan" => "email tidak valid"]);
    exit;
}`,
            caption: "Gagal cepat dengan pesan yang jelas; sukses baru dipakai.",
          },
        },
        {
          kind: "quiz",
          question: "Setiap cabang kegagalan di handler mengirim response lalu langsung exit. Apa alasannya?",
          options: [
            "Agar memori server cepat kosong",
            "Supaya satu request menghasilkan tepat satu response dan kode setelahnya tidak dijalankan",
            "Karena json_encode membutuhkan exit untuk menghasilkan teks",
            "Agar query string ikut terhapus dari URL",
          ],
          answer: 1,
          explanation:
            "Response sudah terkirim, jadi sisa skrip tidak boleh berjalan lagi. exit menjamin satu request menghasilkan tepat satu response dan tidak ada pemrosesan nyasar setelahnya.",
        },
        {
          kind: "code",
          title: "Handler formulir pendaftaran",
          prompt:
            "Program membaca satu baris query string pendaftaran berisi `nama`, `email`, dan `umur`. Lengkapi dua kekosongan: filter email di pemeriksaan kedua, dan nama di pesan selamat datang. Program memeriksa berurutan: nama kosong, email tidak valid, lalu umur di luar rentang 1 sampai 120.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

$query = trim(fgets(STDIN));
parse_str($query, $f);

$nama = trim($f["nama"] ?? "");
$email = trim($f["email"] ?? "");
$umur = $f["umur"] ?? "";

if ($nama === "") {
    echo json_encode(["ok" => false, "pesan" => "nama wajib diisi"]) . "\\n";
    exit;
}

if (filter_var($email, ___) === false) {
    echo json_encode(["ok" => false, "pesan" => "email tidak valid"]) . "\\n";
    exit;
}

$umurValid = filter_var($umur, FILTER_VALIDATE_INT, [
    "options" => ["min_range" => 1, "max_range" => 120],
]) !== false;

if (!$umurValid) {
    echo json_encode(["ok" => false, "pesan" => "umur harus 1 sampai 120"]) . "\\n";
    exit;
}

echo json_encode(["ok" => true, "pesan" => "Selamat datang, " . ___]) . "\\n";`,
          solution: `<?php
declare(strict_types=1);

$query = trim(fgets(STDIN));
parse_str($query, $f);

$nama = trim($f["nama"] ?? "");
$email = trim($f["email"] ?? "");
$umur = $f["umur"] ?? "";

if ($nama === "") {
    echo json_encode(["ok" => false, "pesan" => "nama wajib diisi"]) . "\\n";
    exit;
}

if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    echo json_encode(["ok" => false, "pesan" => "email tidak valid"]) . "\\n";
    exit;
}

$umurValid = filter_var($umur, FILTER_VALIDATE_INT, [
    "options" => ["min_range" => 1, "max_range" => 120],
]) !== false;

if (!$umurValid) {
    echo json_encode(["ok" => false, "pesan" => "umur harus 1 sampai 120"]) . "\\n";
    exit;
}

echo json_encode(["ok" => true, "pesan" => "Selamat datang, " . $nama]) . "\\n";`,
          tests: [
            { stdin: "nama=Budi&email=budi@mail.com&umur=17", expectedOutput: '{"ok":true,"pesan":"Selamat datang, Budi"}' },
            { stdin: "nama=Budi&email=salah&umur=17", expectedOutput: '{"ok":false,"pesan":"email tidak valid"}' },
            { stdin: "nama=Sinta&email=sinta@mail.com&umur=200", expectedOutput: '{"ok":false,"pesan":"umur harus 1 sampai 120"}', hidden: true },
          ],
          hints: [
            "Konstanta filter email sama seperti lesson validasi: FILTER_VALIDATE_EMAIL.",
            "Pesan sukses menyambut pengguna memakai isi variabel namanya.",
            "Jawabannya: FILTER_VALIDATE_EMAIL di cek email, dan $nama di pesan selamat datang.",
          ],
        },
      ],
    },
    // ==================== MODUL 7: File, JSON, dan Data ====================
    {
      slug: "data-json-encode",
      title: "json_encode dan Flag-nya",
      summary: "Ubah array menjadi JSON, dan kendalikan format dengan flag seperti JSON_UNESCAPED_SLASHES.",
      steps: [
        {
          kind: "theory",
          title: "Encode dengan kendali lewat flag",
          body: "`json_encode($data)` mengubah array PHP menjadi teks JSON. Aturan pemetaannya: array berindeks yang kuncinya rapi dari 0 menjadi array JSON `[]`, sedangkan array asosiatif menjadi object JSON `{}`. Bentuk data PHP menentukan bentuk JSON keluarannya.\n\nPerilaku bawaan bisa disetel lewat flag yang digabung dengan `|`. `JSON_PRETTY_PRINT` menata keluaran dengan indentasi untuk berkas yang dibaca manusia. `JSON_UNESCAPED_SLASHES` berhenti mengubah `/` menjadi `\\/` sehingga URL tetap terbaca. `JSON_UNESCAPED_UNICODE` membiarkan karakter non-ASCII seperti é tampil apa adanya, bukan sebagai `\\u00e9`.\n\nSejak PHP 8, encoding yang gagal menghasilkan false dan hanya memberi peringatan; tambahkan `JSON_THROW_ON_ERROR` bila ingin kegagalan melempar JsonException yang bisa ditangani. Untuk keluaran program atau API, bentuk rapat tanpa pretty print lebih hemat, jadi flag yang paling sering menempel di produksi adalah dua yang mengatur escape.",
          code: {
            language: "php",
            content: `<?php
$data = ["url" => "https://kodekita.id", "motto" => "belajar koding"];

echo json_encode($data);
// {"url":"https:\/\/kodekita.id","motto":"belajar koding"}

echo json_encode($data, JSON_UNESCAPED_SLASHES);
// {"url":"https://kodekita.id","motto":"belajar koding"}`,
            caption: "Flag mengubah format, bukan isinya.",
          },
        },
        {
          kind: "code",
          title: "Dua versi kartu kursus",
          prompt:
            "Program membaca satu baris nama kursus, lalu mencetak kartu kursus berisi `nama` dan `url` dalam dua versi JSON: baris pertama versi rapat bawaan, baris kedua versi dengan flag pretty print sekaligus garis miring yang tidak di-escape.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

$nama = trim(fgets(STDIN));

$kursus = [
    "nama" => $nama,
    "url" => "https://kodekita.id/kursus",
];

echo ___($kursus) . "\\n";
echo json_encode($kursus, ___ | JSON_PRETTY_PRINT) . "\\n";`,
          solution: `<?php
declare(strict_types=1);

$nama = trim(fgets(STDIN));

$kursus = [
    "nama" => $nama,
    "url" => "https://kodekita.id/kursus",
];

echo json_encode($kursus) . "\\n";
echo json_encode($kursus, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . "\\n";`,
          tests: [
            {
              stdin: "KodeKita",
              expectedOutput:
                '{"nama":"KodeKita","url":"https:\\/\\/kodekita.id\\/kursus"}\n{\n    "nama": "KodeKita",\n    "url": "https://kodekita.id/kursus"\n}',
            },
            {
              stdin: "BelajarYuk",
              expectedOutput:
                '{"nama":"BelajarYuk","url":"https:\\/\\/kodekita.id\\/kursus"}\n{\n    "nama": "BelajarYuk",\n    "url": "https://kodekita.id/kursus"\n}',
            },
            {
              stdin: "SiAkad",
              expectedOutput:
                '{"nama":"SiAkad","url":"https:\\/\\/kodekita.id\\/kursus"}\n{\n    "nama": "SiAkad",\n    "url": "https://kodekita.id/kursus"\n}',
              hidden: true,
            },
          ],
          hints: [
            "Fungsi yang mengubah array menjadi teks JSON berawalan json_.",
            "Flag yang diminta berhenti meng-escape garis miring; namanya menyebut UNESCAPED_SLASHES.",
            "Jawabannya: json_encode untuk keduanya, dan JSON_UNESCAPED_SLASHES untuk baris kedua.",
          ],
        },
      ],
    },
    {
      slug: "data-json-decode",
      title: "json_decode dan Data Bersarang",
      summary: "Ubah teks JSON menjadi array dan telusuri isinya tingkat demi tingkat.",
      steps: [
        {
          kind: "theory",
          title: "Menelusuri sarang data",
          body: "`json_decode($teks, true)` mengubah teks JSON menjadi array PHP, termasuk semua tingkat sarangnya: object di dalam array di dalam object menjadi array di dalam array di dalam array. Aksesnya bertingkat: `$data[\"kursus\"][0][\"judul\"]` membaca judul kursus pertama.\n\nTanpa argumen true, hasilnya object stdClass dan aksesnya memakai `->`: `$data->kursus[0]->judul`. Isinya sama, hanya bentuk penyusunnya beda. Untuk hasil decode, fungsi biasa seperti count, foreach, dan `??` langsung bekerja, itulah alasan mode array lebih sering dipakai di kode pemrosesan data.\n\nTeks JSON yang tidak sah menghasilkan null sejak PHP 8, bukan error langsung. Membaca `null[\"kursus\"]` meledak di tengah program dan jauh lebih membingungkan daripada mengeceknya di awal: pastikan hasil decode bukan null sebelum dipakai, atau minta exception dengan `JSON_THROW_ON_ERROR` dan tangkap di try/catch.",
          code: {
            language: "php",
            content: `<?php
$teks = '{"siswa":"Budi","kursus":[{"judul":"PHP Dasar"}]}';

$data = json_decode($teks, true);

echo $data["siswa"];              // Budi
echo $data["kursus"][0]["judul"]; // PHP Dasar
var_dump(json_decode("{salah}", true)); // NULL`,
            caption: "Sarang JSON menjadi sarang array; decode yang gagal menghasilkan null.",
          },
        },
        {
          kind: "code",
          title: "Baca laporan bersarang",
          prompt:
            "Program membaca satu baris JSON laporan siswa berisi `siswa` dan daftar `kursus`. Lengkapi tiga kekosongan supaya baris pertama menyebut jumlah kursus yang diambil, dan baris kedua menyebut judul beserta jumlah modul kursus pertamanya.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

$teks = trim(fgets(STDIN));
$data = json_decode($teks, ___);

echo $data["siswa"] . " mengambil " . ___($data["kursus"]) . " kursus\\n";
echo "Kursus pertama: " . $data["kursus"][___]["judul"]
    . " (" . $data["kursus"][0]["modul"] . " modul)\\n";`,
          solution: `<?php
declare(strict_types=1);

$teks = trim(fgets(STDIN));
$data = json_decode($teks, true);

echo $data["siswa"] . " mengambil " . count($data["kursus"]) . " kursus\\n";
echo "Kursus pertama: " . $data["kursus"][0]["judul"]
    . " (" . $data["kursus"][0]["modul"] . " modul)\\n";`,
          tests: [
            {
              stdin: '{"siswa":"Budi","kursus":[{"judul":"PHP Dasar","modul":10},{"judul":"PHP Lanjutan","modul":8}]}',
              expectedOutput: "Budi mengambil 2 kursus\nKursus pertama: PHP Dasar (10 modul)",
            },
            {
              stdin: '{"siswa":"Sinta","kursus":[{"judul":"JSON dan Temannya","modul":5}]}',
              expectedOutput: "Sinta mengambil 1 kursus\nKursus pertama: JSON dan Temannya (5 modul)",
            },
            {
              stdin: '{"siswa":"Eko","kursus":[{"judul":"Routing","modul":3},{"judul":"Session","modul":4},{"judul":"Cookie","modul":2}]}',
              expectedOutput: "Eko mengambil 3 kursus\nKursus pertama: Routing (3 modul)",
              hidden: true,
            },
          ],
          hints: [
            "Argumen kedua true mengubah hasil decode menjadi array asosiatif.",
            "Jumlah elemen array dihitung dengan fungsi count.",
            "Jawabannya: true, count, dan 0 untuk indeks kursus pertama.",
          ],
        },
      ],
    },
    {
      slug: "data-json-daftar-objek",
      title: "JSON: Daftar Objek",
      summary: "Format favorit API: array berisi object, plus jebakan lupa argumen true.",
      steps: [
        {
          kind: "theory",
          title: "Array of objects di PHP",
          body: "Bentuk JSON yang paling sering ditukar aplikasi adalah array berisi object: daftar siswa, daftar produk, daftar transaksi. Di PHP ia menjadi array berindeks yang tiap elemennya array asosiatif. Pemrosesannya foreach biasa: loop sekali, ambil field yang perlu.\n\nDi sinilah argumen kedua `json_decode` paling sering membuat orang tersandung. Lupa menulis true menghasilkan object stdClass, dan membacanya dengan `$siswa[\"nama\"]` langsung fatal error Cannot use object of type stdClass as array. Pesannya selalu menunjuk baris akses, padahal sumber masalahnya di baris decode.\n\nSatu catatan yang sering ditanyakan: array PHP yang kosong di-encode menjadi `[]`, bukan `{}`, karena kuncinya memang berurutan dari nol. Untuk daftar yang mungkin kosong, pertahankan bentuk array berindeks agar klien selalu menerima `[]`, bukan object kosong yang bentuknya berubah-ubah.",
          code: {
            language: "php",
            content: `<?php
$teks = '[{"nama":"Budi","skor":90},{"nama":"Sinta","skor":85}]';

$daftar = json_decode($teks, true);

foreach ($daftar as $siswa) {
    echo $siswa["nama"] . ": " . $siswa["skor"] . "\\n";
}
// Budi: 90
// Sinta: 85`,
            caption: "Array of objects menjadi array berisi array asosiatif.",
          },
        },
        {
          kind: "code",
          title: "Perbaiki daftar skor",
          prompt:
            "Program ini seharusnya mencetak daftar skor bernomor dari JSON array of objects, tapi langsung fatal error saat dijalankan. Cari satu kesalahannya dan perbaiki sampai semua tes lulus.",
          mode: "fix",
          template: `<?php
declare(strict_types=1);

$json = trim(fgets(STDIN));
$daftar = json_decode($json);

$no = 1;
foreach ($daftar as $siswa) {
    echo $no . ". " . $siswa["nama"] . ": " . $siswa["skor"] . "\\n";
    $no++;
}`,
          solution: `<?php
declare(strict_types=1);

$json = trim(fgets(STDIN));
$daftar = json_decode($json, true);

$no = 1;
foreach ($daftar as $siswa) {
    echo $no . ". " . $siswa["nama"] . ": " . $siswa["skor"] . "\\n";
    $no++;
}`,
          tests: [
            {
              stdin: '[{"nama":"Budi","skor":90},{"nama":"Sinta","skor":85}]',
              expectedOutput: "1. Budi: 90\n2. Sinta: 85",
            },
            { stdin: '[{"nama":"Rani","skor":78}]', expectedOutput: "1. Rani: 78" },
            {
              stdin: '[{"nama":"Tono","skor":88},{"nama":"Dina","skor":95},{"nama":"Eko","skor":70}]',
              expectedOutput: "1. Tono: 88\n2. Dina: 95\n3. Eko: 70",
              hidden: true,
            },
          ],
          hints: [
            "Jalankan dulu: pesan errornya menunjuk ke baris akses $siswa[\"nama\"].",
            "Object stdClass tidak bisa diakses pakai []; itu petunjuk soal baris json_decode.",
            "Tambahkan argumen kedua true pada json_decode supaya hasilnya array.",
          ],
        },
      ],
    },
    {
      slug: "data-csv-parser",
      title: "CSV dari Stdin",
      summary: "Pecah baris koma menjadi kolom, versi ringkas fgetcsv di dunia stdin.",
      steps: [
        {
          kind: "theory",
          title: "Tabel yang disimpan sebagai teks",
          body: "CSV menyimpan tabel sebagai teks: satu baris satu record, kolom dipisah koma, dan baris pertama biasanya nama kolom. Ekspor spreadsheet, laporan bank, dan dataset latihan hampir selalu datang dalam format ini karena sederhana dan dibaca semua alat.\n\nDi PHP, pembaca file CSV sungguhan adalah `fgetcsv($fh)`: ia mengembalikan satu baris berupa array kolom dan paham aturan kutip, misalnya nilai \"Budi, Jr\" yang mengandung koma tidak terpotong. Di platform ini sumber datanya stdin, jadi kita membangun versi ringkasnya sendiri: `fgets` per baris, lalu `explode(\",\", $baris)` untuk memecah kolom.\n\nParser manual ini sengaja polos: ia tidak menangani kutip dan koma di dalam nilai. Untuk data yang kolomnya bersih itu cukup, dan polanya sama dengan versi produksi: baca baris, pecah kolom, pakai. Baris kosong di akhir input adalah tetangga yang sering muncul, jadi beri pemeriksaan dan lanjutkan loop bila barisnya kosong.",
          code: {
            language: "php",
            content: `<?php
// Input stdin tiap baris: nama,skor
while (($baris = fgets(STDIN)) !== false) {
    $baris = trim($baris);
    if ($baris === "") {
        continue;
    }

    [$nama, $skor] = explode(",", $baris);
    echo $nama . " nilainya " . $skor . "\\n";
}`,
            caption: "fgets per baris, explode per kolom: inti semua pembaca CSV.",
          },
        },
        {
          kind: "code",
          title: "Pecah CSV menjadi record",
          prompt:
            "Baris pertama stdin adalah header CSV, baris berikutnya datanya berisi `nama,skor`. Lengkapi tiga kekosongan supaya tiap baris data dicetak sebagai `nama: skor`, lalu baris terakhir menyebut jumlah baris datanya.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

$header = trim(fgets(STDIN)); // baris pertama adalah nama kolom
$jumlah = 0;

while (($baris = ___(STDIN)) !== false) {
    $baris = trim($baris);
    if (___ === "") {
        continue;
    }

    [$nama, $skor] = ___(",", $baris);
    echo $nama . ": " . $skor . "\\n";
    $jumlah++;
}

echo "total baris data: " . $jumlah . "\\n";`,
          solution: `<?php
declare(strict_types=1);

$header = trim(fgets(STDIN)); // baris pertama adalah nama kolom
$jumlah = 0;

while (($baris = fgets(STDIN)) !== false) {
    $baris = trim($baris);
    if ($baris === "") {
        continue;
    }

    [$nama, $skor] = explode(",", $baris);
    echo $nama . ": " . $skor . "\\n";
    $jumlah++;
}

echo "total baris data: " . $jumlah . "\\n";`,
          tests: [
            { stdin: "nama,skor\nBudi,90\nSinta,85", expectedOutput: "Budi: 90\nSinta: 85\ntotal baris data: 2" },
            { stdin: "nama,skor\nEko,70", expectedOutput: "Eko: 70\ntotal baris data: 1" },
            {
              stdin: "nama,skor\nTono,88\nDina,95\nLisa,91",
              expectedOutput: "Tono: 88\nDina: 95\nLisa: 91\ntotal baris data: 3",
              hidden: true,
            },
          ],
          hints: [
            "Membaca satu baris stdin memakai fgets(STDIN).",
            "Memecah string berdasar pemisah koma memakai fungsi explode.",
            "Jawabannya: fgets, explode, dan $baris untuk pemeriksaan baris kosong.",
          ],
        },
      ],
    },
    {
      slug: "data-file-get-put",
      title: "Baca dan Tulis File Sekali Panggil",
      summary: "file_get_contents dan file_put_contents, termasuk FILE_APPEND untuk menambah.",
      steps: [
        {
          kind: "theory",
          title: "Satu panggilan untuk satu file",
          body: "Untuk file yang muat dalam memori, PHP punya jalan pintas dua arah. `file_get_contents('catatan.txt')` membaca seluruh isi file dan mengembalikannya sebagai string, atau false bila file tidak ada. `file_put_contents('catatan.txt', $teks)` menulis seluruh string ke file dan mengembalikan jumlah byte yang ditulis, atau false bila gagal.\n\nBawaan file_put_contents adalah menimpa: isi lama hilang. Beri flag `FILE_APPEND` untuk menambah di akhir, misalnya menulis log baris demi baris, dan gabungkan `LOCK_EX` supaya penulisan tidak bertabrakan bila dua proses menulis bersamaan: `file_put_contents($file, $teks, FILE_APPEND | LOCK_EX)`.\n\nFungsi ini juga bisa membaca URL bila pengaturan allow_url_fopen aktif, sehingga `file_get_contents('https://api...')` terasa seperti fetch. Di aplikasi nyata koneksi seperti itu biasanya diganti HTTP client yang punya timeout dan penanganan error lebih rapi, tetapi untuk berkas lokal dua fungsi ini adalah pilihan pertama. Periksa selalu hasilnya terhadap false sebelum diproses.",
          code: {
            language: "php",
            content: `<?php
$file = "kunjungan.txt";

file_put_contents($file, "halo\\n");              // timpa isi lama
file_put_contents($file, "lagi\\n", FILE_APPEND); // sambung di akhir

$isi = file_get_contents($file);
echo $isi; // halo
           // lagi

if (file_get_contents("tidak-ada.txt") === false) {
    echo "file tidak ada\\n";
}`,
            caption: "Satu panggilan untuk membaca, satu untuk menulis.",
          },
        },
        {
          kind: "quiz",
          question: "Flag apa yang membuat file_put_contents menambah teks di akhir isi lama, bukan menimpanya?",
          options: ["FILE_NEW", "LOCK_EX", "FILE_APPEND", "FILE_ADD"],
          answer: 2,
          explanation:
            "FILE_APPEND memindahkan posisi tulis ke akhir file sehingga isi lama tetap utuh. LOCK_EX adalah kunci proses, bukan mode penambahan.",
        },
      ],
    },
    {
      slug: "data-fopen-fgets",
      title: "fopen dan Membaca Per Baris",
      summary: "Cara aman membaca file besar: satu baris di memori pada satu waktu.",
      steps: [
        {
          kind: "theory",
          title: "File besar dibaca pelan-pelan",
          body: "file_get_contents memuat seluruh file ke memori. Untuk log berukuran ratusan MB itu mahal, dan di sinilah cara klasik bekerja: `fopen($file, 'r')` membuka file dan mengembalikan handle, `fgets($fh)` membaca satu baris setiap panggilan, dan loop berhenti saat fgets mengembalikan false.\n\nPolanya selalu sama: `while (($baris = fgets($fh)) !== false)`. Memori yang dipakai hanya sebesar satu baris, apa pun ukuran filenya. Di akhir, `fclose($fh)` menutup handle. Alternatif modern yang berperilaku sama adalah `foreach (new SplFileObject($file) as $baris)`, dan di latihan platform ini `fgets(STDIN)` adalah bentuk handle-nya: stdin pun stream seperti file.\n\nMode pembukaan menentukan nasib isi file: `r` baca saja, `w` menimpa dari awal (isi lama langsung hilang begitu fopen sukses), `a` selalu menulis di akhir, dan `x` menolak membuat bila file sudah ada. Salah mode di sini bukan error yang terlihat, melainkan data yang hilang tanpa suara, jadi pastikan mode sebelum menulis.",
          code: {
            language: "php",
            content: `<?php
$fh = fopen("besar.log", "r");
$jumlah = 0;

while (($baris = fgets($fh)) !== false) {
    $jumlah++; // memori tetap kecil walau filenya gigabyte
}
fclose($fh);

echo $jumlah . " baris\\n";`,
            caption: "Satu baris di memori pada satu waktu.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi pada data.txt yang sudah berisi catatan lama saat program memanggil fopen('data.txt', 'w')?",
          options: [
            "fopen gagal karena file sudah ada",
            "Isi lama dihapus, file siap ditulis dari awal",
            "Data baru disambung di akhir isi lama",
            "File dibuka dan tidak bisa ditulis",
          ],
          answer: 1,
          explanation:
            "Mode w memotong isi file sampai nol byte begitu fopen sukses. Untuk menyambung di akhir isi lama, mode yang benar adalah a.",
        },
      ],
    },
    {
      slug: "data-serialize-aman",
      title: "serialize dan Bahayanya",
      summary: "Kenapa unserialize tidak pernah boleh menyentuh input pengguna.",
      steps: [
        {
          kind: "theory",
          title: "Format internal, bukan untuk orang luar",
          body: "`serialize($data)` mengubah array atau object PHP menjadi string yang bisa disimpan, dan `unserialize($teks)` mengembalikannya persis, termasuk tipe aslinya. Formatnya khas PHP seperti `a:2:{i:0;s:3:\"ini\";}` dan tidak dimengerti bahasa lain.\n\nBahayanya: string serialize bisa membawa definisi object, dan unserialize membangun object itu sungguhan, lengkap dengan memanggil magic method seperti `__wakeup()` dan `__destruct()`. Input dari pengguna yang berisi object jahatan bisa memicu jalur kode yang tidak kita izinkan; celah klasik ini bernama PHP object injection. Itulah sebabnya aturannya tegas: jangan pernah unserialize input tak tepercaya.\n\nUntuk data yang menyeberang batas, seperti body request, isi cookie, atau file unduhan, pakai JSON: `json_decode` hanya menghasilkan array dan nilai sederhana, tidak pernah membangun object class. unserialize masih wajar untuk cache internal yang sumbernya dikendalikan sendiri, dan bila terpaksa menerima input, kunci `['allowed_classes' => false]` mematikan pembentukan object sama sekali.",
          code: {
            language: "php",
            content: `<?php
$data = ["tema" => "gelap", "level" => 3];

$teks = serialize($data);
echo $teks . "\\n";
// a:2:{s:4:"tema";s:5:"gelap";s:5:"level";i:3;}

$kembali = unserialize($teks, ["allowed_classes" => false]);
echo $kembali["tema"]; // gelap

// Dari pengguna, selalu JSON:
$aman = json_decode('{"tema":"terang"}', true);`,
            caption: "serialize untuk penyimpanan sendiri, JSON untuk data dari luar.",
          },
        },
        {
          kind: "quiz",
          question: "Apa alasan utama unserialize() tidak boleh menerima input dari pengguna?",
          options: [
            "Karena string hasilnya tidak bisa dibaca manusia",
            "Karena unserialize hanya bekerja untuk array, bukan object",
            "Karena lebih lambat daripada json_decode",
            "Karena string buatan orang lain bisa membangun object berbahaya lewat magic method",
          ],
          answer: 3,
          explanation:
            "unserialize membangun object sungguhan dan memicu magic method seperti __wakeup dan __destruct. Input jahatan memakai jalur itu untuk menjalankan kode; celahnya dikenal sebagai PHP object injection.",
        },
      ],
    },
    {
      slug: "data-array-ke-json",
      title: "Dari Array ke Laporan JSON",
      summary: "Hitung ringkasan di loop, susun jadi array, encode di baris terakhir.",
      steps: [
        {
          kind: "theory",
          title: "Menyusun laporan sebelum di-encode",
          body: "Endpoint API jarang membalas data mentah. Ia merangkum dulu: nilai tertinggi, total, jumlah baris. Pola kerjanya: loop memproses data sambil mengisi beberapa variabel ringkasan, ringkasan ditata menjadi satu array asosiatif, dan `json_encode` di baris terakhir mengubahnya jadi response.\n\nMenyimpan ringkasan di array, bukan mencetak di dalam loop, adalah keputusan penting. Loop hanya menghitung, bagian akhir menyusun dan mencetak. Dengan begitu bentuk response berubah tanpa menyentuh logika perhitungan, dan mengubah urutan field cukup dilakukan di satu array.\n\nUntuk mencari nilai terbesar sambil mengingat pemiliknya, bandingkan dengan variabel penahan: `$maks` diawali 0, dan tiap baris yang lebih besar menimpa `$maks` sekaligus mencatat namanya. Pola ini tidak butuh fungsi khusus dan selesai dalam satu kali jalan, penting saat datanya besar. Di latihan ini datanya masuk lewat stdin dalam bentuk CSV mini.",
          code: {
            language: "php",
            content: `// Bentuk ringkas dari program yang akan kamu lengkapi:
$maks = 0;
$teratas = "";
$total = 0;

// di dalam loop tiap baris data:
// if ($pendapatan > $maks) { $maks = $pendapatan; $teratas = $nama; }
// $total += $pendapatan;

echo json_encode(["teratas" => $teratas, "total" => $total]);
// {"teratas":"","total":0}`,
            caption: "Loop menghitung, array menyusun, encode menutup.",
          },
        },
        {
          kind: "code",
          title: "Laporan pendapatan",
          prompt:
            "Baris pertama stdin berisi jumlah baris, lalu tiap baris berisi `nama,pendapatan`. Lengkapi tiga kekosongan supaya keluarannya JSON berisi `teratas` (pemilik pendapatan terbesar) dan `total` penjumlahan semua pendapatan.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

$n = (int) trim(fgets(STDIN));

$teratas = "";
$maks = 0;
$total = 0;

for ($i = 0; $i < $n; $i++) {
    [$nama, $pendapatan] = explode(",", trim(fgets(STDIN)));
    $pendapatan = (int) $pendapatan;

    if ($pendapatan ___ $maks) {
        $maks = $pendapatan;
        $teratas = $nama;
    }

    $total ___ $pendapatan;
}

$laporan = [
    "teratas" => $teratas,
    "total" => $total,
];

echo ___($laporan) . "\\n";`,
          solution: `<?php
declare(strict_types=1);

$n = (int) trim(fgets(STDIN));

$teratas = "";
$maks = 0;
$total = 0;

for ($i = 0; $i < $n; $i++) {
    [$nama, $pendapatan] = explode(",", trim(fgets(STDIN)));
    $pendapatan = (int) $pendapatan;

    if ($pendapatan > $maks) {
        $maks = $pendapatan;
        $teratas = $nama;
    }

    $total += $pendapatan;
}

$laporan = [
    "teratas" => $teratas,
    "total" => $total,
];

echo json_encode($laporan) . "\\n";`,
          tests: [
            { stdin: "3\nBudi,90000\nSinta,120000\nEko,70000", expectedOutput: '{"teratas":"Sinta","total":280000}' },
            { stdin: "2\nRani,50000\nDina,80000", expectedOutput: '{"teratas":"Dina","total":130000}' },
            { stdin: "1\nTono,45000", expectedOutput: '{"teratas":"Tono","total":45000}', hidden: true },
          ],
          hints: [
            "Untuk menemukan nilai terbesar, bandingkan pendapatan dengan $maks memakai operator lebih besar.",
            "Total bertambah tiap baris: operator += atau tulis $total = $total + ....",
            "Jawabannya: >, +=, dan json_encode.",
          ],
        },
      ],
    },
    {
      slug: "data-grouping",
      title: "Mengelompokkan Data dengan Array",
      summary: "Pola kumpulkan dan akumulasi: kunci array sebagai wadah kelompok.",
      steps: [
        {
          kind: "theory",
          title: "Array sebagai wadah pengelompok",
          body: "Mengelompokkan data adalah pekerjaan harian: transaksi per kategori, siswa per kelas. Polanya satu: kunci kelompok dipakai sebagai kunci array, dan nilainya array yang diisi terus. `$grup[$kota][] = $nama;` menambahkan nama ke daftar kotanya, dan PHP otomatis membuat array untuk kota yang belum ada.\n\nBaris tunggal itu menggantikan blok pemeriksaan `if (!isset($grup[$kota])) $grup[$kota] = [];` versi lama. Dengan pola yang sama kita bisa menghitung: `$jumlah[$kategori] = ($jumlah[$kategori] ?? 0) + 1;`. Dua pola ini, mengumpulkan dan mengakumulasi, menutup sebagian besar kebutuhan rekap data.\n\nUrutan keluaran array asosiatif mengikuti urutan kunci pertama kali muncul. Laporan yang butuh urutan pasti memanggil `ksort($grup)` untuk mengurutkan berdasarkan kunci, lalu foreach mencetak. Nilai yang terkumpul ditampilkan dengan `implode(\", \", $daftar)`. Semua ini bekerja juga untuk data yang masuk dari stdin.",
          code: {
            language: "php",
            content: `<?php
$barisan = ["Jakarta,Budi", "Bandung,Rani", "Jakarta,Sinta"];

$grup = [];
foreach ($barisan as $baris) {
    [$kota, $nama] = explode(",", $baris);
    $grup[$kota][] = $nama; // kunci baru otomatis jadi array
}

ksort($grup);
foreach ($grup as $kota => $anggota) {
    echo $kota . ": " . implode(", ", $anggota) . "\\n";
}
// Bandung: Rani
// Jakarta: Budi, Sinta`,
            caption: "Satu baris append membangun seluruh kelompok.",
          },
        },
        {
          kind: "code",
          title: "Kelompokkan siswa per kota",
          prompt:
            "Baris pertama stdin berisi jumlah baris, lalu tiap baris berisi `kota,nama`. Lengkapi tiga kekosongan supaya nama-nama terkumpul per kotanya, diurutkan menurut nama kota, dan dicetak sebagai `kota: nama1, nama2`.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

$n = (int) trim(fgets(STDIN));

$grup = [];

for ($i = 0; $i < $n; $i++) {
    [$kota, $nama] = explode(",", trim(fgets(STDIN)));
    $grup[$kota]___ $nama;
}

___($grup);

foreach ($grup as $kota => $anggota) {
    echo $kota . ": " . implode(___, $anggota) . "\\n";
}`,
          solution: `<?php
declare(strict_types=1);

$n = (int) trim(fgets(STDIN));

$grup = [];

for ($i = 0; $i < $n; $i++) {
    [$kota, $nama] = explode(",", trim(fgets(STDIN)));
    $grup[$kota][] = $nama;
}

ksort($grup);

foreach ($grup as $kota => $anggota) {
    echo $kota . ": " . implode(", ", $anggota) . "\\n";
}`,
          tests: [
            {
              stdin: "4\nJakarta,Budi\nBandung,Rani\nJakarta,Sinta\nBandung,Dina",
              expectedOutput: "Bandung: Rani, Dina\nJakarta: Budi, Sinta",
            },
            {
              stdin: "3\nSurabaya,Eko\nSurabaya,Tono\nMedan,Lisa",
              expectedOutput: "Medan: Lisa\nSurabaya: Eko, Tono",
            },
            {
              stdin: "2\nDenpasar,Kadek\nBandung,Ayu",
              expectedOutput: "Bandung: Ayu\nDenpasar: Kadek",
              hidden: true,
            },
          ],
          hints: [
            "Menambah elemen ke akhir array memakai kurung siku kosong sebelum tanda sama dengan.",
            "Pengurutan berdasar kunci array memakai ksort.",
            "Jawabannya: [] =, ksort, dan pemisah \", \".",
          ],
        },
      ],
    },
    {
      slug: "data-latihan-gabungan",
      title: "Latihan Gabungan: Laporan dari CSV",
      summary: "Dari CSV mentah di stdin menjadi laporan JSON satu baris.",
      steps: [
        {
          kind: "theory",
          title: "Dari CSV mentah ke laporan JSON",
          body: "Penutup modul merangkai semuanya dalam satu program kecil yang layak dipakai: membaca CSV dari stdin, menjumlah nilai per kategori, lalu menerbitkan laporan JSON dalam satu baris. Inilah bentuk mini dari pekerjaan nyata: data masuk dalam format tukar yang tua, keluar dalam format tukar yang muda.\n\nRekap per kategori memakai pola akumulasi: `$rekap[$kategori] = ($rekap[$kategori] ?? 0) + (int) $nilai;`. Cast `(int)` dipasang di pintu karena nilai dari CSV selalu string. Setelah loop selesai, `array_sum($rekap)` menghitung grand total, dan kunci total ditambahkan terakhir supaya posisinya di akhir laporan.\n\nPerhatikan urutan operasinya: ksort dulu agar kategori terurut abjad, lalu grand total dihitung dari nilai yang sudah terkumpul, baru `json_encode`. Satu baris JSON tanpa pretty print adalah keluaran yang tepat untuk program: ringkas, gampang di-parse, dan tidak menambah spasi yang menyulitkan perbandingan keluaran.",
          code: {
            language: "php",
            content: `// Bentuk akhir program yang akan kamu lengkapi:
$rekap[$kategori] = ($rekap[$kategori] ?? 0) + (int) $nilai;

ksort($rekap);
$rekap["total"] = array_sum($rekap);

echo json_encode($rekap);
// {"belanja":50000,"hiburan":15000,"total":65000}`,
            caption: "Akumulasi, urutkan, jumlahkan, encode.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa nilai dari explode untuk kolom angka masih perlu di-cast (int) sebelum dijumlahkan?",
          options: [
            "Karena explode kadang mengembalikan desimal",
            "Karena json_encode menolak string berisi angka",
            "Karena hasil explode selalu string, dan cast menjaga penjumlahan tetap numerik",
            "Karena ksort butuh kunci berupa int",
          ],
          answer: 2,
          explanation:
            "explode menghasilkan array of string, jadi \"15000\" adalah teks. Cast (int) di pintu masuk membuat penjumlahan bersih dan JSON keluarannya berupa angka, bukan string.",
        },
        {
          kind: "code",
          title: "Terbitkan laporan JSON",
          prompt:
            "Baris pertama stdin adalah header `kategori,nilai`, baris berikutnya datanya. Lengkapi tiga kekosongan supaya program mencetak satu baris JSON: total per kategori terurut abjad, ditutup kunci `total` berisi grand total.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

$header = trim(fgets(STDIN));

$rekap = [];

while (($baris = fgets(STDIN)) !== false) {
    $baris = trim($baris);
    if ($baris === "") {
        continue;
    }

    [$kategori, $nilai] = explode(",", $baris);
    $rekap[$kategori] = ($rekap[$kategori] ___ 0) + (int) $nilai;
}

___($rekap);
$rekap["total"] = ___($rekap);

echo json_encode($rekap) . "\\n";`,
          solution: `<?php
declare(strict_types=1);

$header = trim(fgets(STDIN));

$rekap = [];

while (($baris = fgets(STDIN)) !== false) {
    $baris = trim($baris);
    if ($baris === "") {
        continue;
    }

    [$kategori, $nilai] = explode(",", $baris);
    $rekap[$kategori] = ($rekap[$kategori] ?? 0) + (int) $nilai;
}

ksort($rekap);
$rekap["total"] = array_sum($rekap);

echo json_encode($rekap) . "\\n";`,
          tests: [
            {
              stdin: "kategori,nilai\nbelanja,20000\nhiburan,15000\nbelanja,30000",
              expectedOutput: '{"belanja":50000,"hiburan":15000,"total":65000}',
            },
            {
              stdin: "kategori,nilai\nmakan,12000\ntransport,8000",
              expectedOutput: '{"makan":12000,"transport":8000,"total":20000}',
            },
            {
              stdin: "kategori,nilai\nbuku,5000\nalat,7000\nbuku,3000",
              expectedOutput: '{"alat":7000,"buku":8000,"total":15000}',
              hidden: true,
            },
          ],
          hints: [
            "Kunci kategori bisa belum ada; operator ?? memberi nilai awal 0.",
            "Mengurutkan array asosiatif berdasarkan kuncinya memakai ksort.",
            "Jumlah seluruh nilai array dihitung oleh array_sum.",
          ],
        },
      ],
    },
  ],
};
