import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "cpp",
  moduleRange: [6, 7],
  modules: [
    {
      title: "Template Dasar",
      description: "Function/class template, auto return, dan constexpr sederhana.",
    },
    {
      title: "Error dan Ketahanan",
      description: "exception, std::optional, assert, dan desain API yang aman.",
    },
  ],
  lessons: [
    // ==================== MODUL 6: Template Dasar ====================
    {
      slug: "tpl-function-dasar",
      title: "Function Template: Satu Resep Banyak Tipe",
      summary: "Tulis satu function template dengan template <typename T> dan pakai ulang untuk int, double, sampai string.",
      steps: [
        {
          kind: "theory",
          title: "Berhenti menyalin fungsi yang sama",
          body: "Menulis `maks(int, int)`, lalu `maks(double, double)`, lalu `maks(string, string)` adalah pekerjaan yang persis sama berulang dengan tipe berbeda. Function template menyelesaikan itu: kamu menulis satu resep dengan parameter tipe, dan compiler yang membuat versi nyata untuk setiap tipe yang benar-benar dipakai.\n\nDeklarasi `template <typename T>` di atas fungsi memperkenalkan `T` sebagai tempat tipe. Saat compiler melihat pemanggilan `maks(3, 7)` ia membuat `maks<int>`; saat melihat `maks(s1, s2)` untuk dua `string` ia membuat `maks<string>`. Proses ini disebut instantiasi, dan `T` hanyalah nama: kamu boleh menulis `U`, `Tipe`, atau apa pun yang jelas.\n\nAda dua cara memanggil. Cara implisit membiarkan compiler menebak dari argumen. Cara eksplisit menuliskannya: `maks<double>(3, 4)`, berguna saat tipe argumen tidak sama persis atau kamu ingin konversi tertentu. Ingat batasnya: dalam contoh ini kedua argumen memakai `T` yang sama, jadi `maks(3, 4.5)` akan ditolak compiler. Percampuran tipe dibahas di lesson berikutnya.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <string>
using namespace std;

template <typename T>
T maks(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    cout << maks(3, 7) << "\\n";
    cout << maks(2.5, 1.8) << "\\n";
    cout << maks(string("kode"), string("kita")) << "\\n";
    return 0;
}`,
            caption: "Satu template, tiga instantiasi: maks<int>, maks<double>, dan maks<string>.",
          },
        },
        {
          kind: "quiz",
          question: "Pada `template <typename T> T maks(T a, T b)`, apa peran `T`?",
          options: [
            "Nama wajib fungsi template",
            "Parameter tipe yang diganti compiler dengan tipe nyata saat fungsi dipanggil",
            "Tipe data khusus yang datang dari header <template>",
            "Variabel lokal yang otomatis dibuat di dalam fungsi",
          ],
          answer: 1,
          explanation:
            "T adalah nama parameter tipe. Saat instantiasi, compiler menggantinya dengan tipe argumen; namanya bebas, T hanya kebiasaan umum.",
        },
        {
          kind: "code",
          title: "Bangun template maks pertamamu",
          prompt:
            "Lengkapi template fungsi `maks` supaya mengembalikan nilai yang lebih besar dari dua argumennya, untuk int maupun string. Ganti setiap `___`; nama parameter tipenya adalah `T`.",
          mode: "fill",
          template: `#include <iostream>
#include <string>
using namespace std;

template <typename ___>
___ maks(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    int a, b;
    cin >> a >> b;
    cout << "Maks: " << maks(a, b) << "\\n";

    string s1, s2;
    cin >> s1 >> s2;
    cout << "Maks: " << maks(s1, s2) << "\\n";
    return 0;
}`,
          solution: `#include <iostream>
#include <string>
using namespace std;

template <typename T>
T maks(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    int a, b;
    cin >> a >> b;
    cout << "Maks: " << maks(a, b) << "\\n";

    string s1, s2;
    cin >> s1 >> s2;
    cout << "Maks: " << maks(s1, s2) << "\\n";
    return 0;
}`,
          tests: [
            { stdin: "3 7 kucing kuda", expectedOutput: "Maks: 7\nMaks: kuda" },
            { stdin: "-5 -2 apel durian", expectedOutput: "Maks: -2\nMaks: durian" },
            { stdin: "10 10 satu dua", expectedOutput: "Maks: 10\nMaks: satu", hidden: true },
          ],
          hints: [
            "Parameter tipe dideklarasikan di antara kurung sudut setelah kata typename.",
            "Variabel a, b, dan pembandingnya sudah memakai huruf T, jadi parameter tipenya harus bernama sama.",
            "Isi kedua ___ dengan T: template <typename T> di atas, dan T sebagai tipe kembalian.",
          ],
        },
      ],
    },
    {
      slug: "tpl-dua-param-tipe",
      title: "Template dengan Dua Parameter Tipe",
      summary: "Gunakan T dan U sekaligus untuk argumen yang bertipe berbeda, dan biarkan auto memilih tipe hasil.",
      steps: [
        {
          kind: "theory",
          title: "Satu T tidak selalu cukup",
          body: "Dengan satu parameter tipe `T`, semua argumen harus satu tipe. Dunia nyata sering campur: nama dan umur, jumlah barang (`int`) dan harga satuan (`double`), teks dan angka. Untuk itu template boleh punya lebih dari satu parameter: `template <typename T, typename U>`. Urutan argumen menentukan mana yang menjadi `T` dan mana yang menjadi `U`.\n\nTipe kembalian jadi pertanyaan menarik. Hasil `10 / 4` adalah `int` bernilai 2, sedangkan `9 / 2.0` adalah `double` bernilai 4.5. Kalau tipe kembalian dipaksa satu tipe, salah satu kasus pasti terkonversi paksa. Sejak C++14, tipe kembalian bisa ditulis `auto` dan compiler memilihnya dari ekspresi `return`. Detail auto dibahas khusus di lesson kelima modul ini.\n\nDua parameter tipe juga membantu membaca maksud fungsi: `perkenalkan(const T& nama, const U& umur)` lebih jelas daripada dua `T` yang samar. Kebiasaan baiknya: satu huruf per peran, `T` untuk tipe utama dan `U` untuk tipe kedua.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <string>
using namespace std;

template <typename T, typename U>
void perkenalkan(const T& nama, const U& umur) {
    cout << nama << " berumur " << umur << "\\n";
}

int main() {
    perkenalkan(string("Sinta"), 17);
    perkenalkan(string("Bagas"), 21.5);
    perkenalkan(42, string("tahun pengalaman"));
    return 0;
}`,
            caption: "T menampung teks, U menampung angka; posisinya mengikuti argumen, boleh terbalik.",
          },
        },
        {
          kind: "quiz",
          question:
            "Pemanggilan `bagi(9, 2.0)` gagal dikompilasi saat templatenya `template <typename T> auto bagi(T a, T b)`. Apa penyebabnya?",
          options: [
            "Pembagian int dengan double memang tidak diizinkan di C++",
            "Compiler mendapat dua dugaan tipe berbeda untuk satu parameter tipe T, yaitu int dan double",
            "auto tidak boleh dipakai sebagai tipe kembalian template",
            "Fungsi template wajib punya minimal tiga parameter",
          ],
          answer: 1,
          explanation:
            "Satu T harus menebak satu tipe. Argumen 9 menyuruh T = int, argumen 2.0 menyuruh T = double, dan dua dugaan itu bertentangan sehingga kompilasi gagal.",
        },
        {
          kind: "code",
          title: "Perbaiki pembagi yang menolak angka campuran",
          prompt:
            "Program ini gagal dikompilasi karena templatenya hanya punya satu parameter tipe, padahal dipanggil dengan campuran int dan double. Perbaiki satu kekurangan pada baris template sampai semua tes lulus.",
          mode: "fix",
          template: `#include <iostream>
using namespace std;

template <typename T>
auto bagi(T a, T b) {
    return a / b;
}

int main() {
    int a, b, c;
    cin >> a >> b >> c;
    cout << bagi(a, b) << "\\n";
    cout << bagi(c, 2.0) << "\\n";
    return 0;
}`,
          solution: `#include <iostream>
using namespace std;

template <typename T, typename U>
auto bagi(T a, U b) {
    return a / b;
}

int main() {
    int a, b, c;
    cin >> a >> b >> c;
    cout << bagi(a, b) << "\\n";
    cout << bagi(c, 2.0) << "\\n";
    return 0;
}`,
          tests: [
            { stdin: "10 4 9", expectedOutput: "2\n4.5" },
            { stdin: "20 5 7", expectedOutput: "4\n3.5" },
            { stdin: "8 2 5", expectedOutput: "4\n2.5", hidden: true },
          ],
          hints: [
            "Pesan errornya menyebut deduksi T yang bertentangan: satu parameter tipe dipaksa menebak dua tipe sekaligus.",
            "Tambahkan parameter tipe kedua pada baris template, dan biarkan tipe kembalian menyimpulkan sendiri dengan auto.",
            "Ubah barisnya menjadi: template <typename T, typename U> auto bagi(T a, U b).",
          ],
        },
      ],
    },
    {
      slug: "tpl-class-box",
      title: "Class Template: Membuat Box<T>",
      summary: "Bungkus satu nilai dalam class template Box<T>, dengan method simpan dan ambil yang bekerja untuk tipe apa pun.",
      steps: [
        {
          kind: "theory",
          title: "Class yang menerima tipe",
          body: "Fungsi bukan satu-satunya yang bisa dijadikan template. Class juga bisa: `vector<int>` yang sudah kamu pakai dari awal sebenarnya adalah class template. Sekarang kamu membuatnya sendiri: `Box<T>`, cetakan kotak yang menyimpan satu nilai bertipe `T`.\n\nDi dalam class, `T` dipakai seperti tipe biasa: sebagai tipe member `isi`, sebagai parameter `simpan`, dan sebagai tipe kembalian `ambil`. Saat membuat objeknya, tipe nyata wajib ditulis: `Box<int> kotakAngka;` atau `Box<string> kotakTeks;`. `Box<int>` dan `Box<string>` adalah dua tipe berbeda yang lahir dari satu cetakan yang sama.\n\nMethod yang ditulis di dalam badan class otomatis mengikuti template, tanpa deklarasi tambahan. Kalau suatu saat method ditulis di luar class, barulah kamu mengulang `template <typename T>` di atasnya dan menandainya sebagai `Box<T>::`. Untuk saat ini, tulis method di dalam badan class saja seperti kebanyakan template kecil.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <string>
using namespace std;

template <typename T>
class Box {
public:
    void simpan(T nilai) { isi = nilai; }
    T ambil() const { return isi; }
private:
    T isi;
};

int main() {
    Box<int> kotakAngka;
    kotakAngka.simpan(99);
    Box<string> kotakTeks;
    kotakTeks.simpan("KodeKita");

    cout << kotakAngka.ambil() << "\\n";
    cout << kotakTeks.ambil() << "\\n";
    return 0;
}`,
            caption: "Box<int> dan Box<string> adalah dua tipe berbeda yang lahir dari satu cetakan.",
          },
        },
        {
          kind: "quiz",
          question: "Bagaimana cara membuat Box yang menyimpan double?",
          options: [
            "Box<double> kotak;",
            "Box kotak;",
            "double<Box> kotak;",
            "Box kotak<double>;",
          ],
          answer: 0,
          explanation:
            "Nama class template harus disertai argumen tipenya saat membuat objek. Tanpa <double>, compiler tidak tahu apa isi T.",
        },
        {
          kind: "code",
          title: "Lengkapi Box untuk dua tipe",
          prompt:
            "Lengkapi class template `Box` supaya method `ambil` mengembalikan isi kotak dan member `isi` menyimpan nilai bertipe `T`. Program utamanya sudah lengkap; cukup isi dua `___` di dalam class.",
          mode: "fill",
          template: `#include <iostream>
#include <string>
using namespace std;

template <typename T>
class Box {
public:
    void simpan(T nilai) { isi = nilai; }
    ___ ambil() const { return isi; }
private:
    ___ isi;
};

int main() {
    int n;
    string s;
    cin >> n >> s;

    Box<int> angka;
    angka.simpan(n);
    Box<string> teks;
    teks.simpan(s);

    cout << "int: " << angka.ambil() << "\\n";
    cout << "string: " << teks.ambil() << "\\n";
    return 0;
}`,
          solution: `#include <iostream>
#include <string>
using namespace std;

template <typename T>
class Box {
public:
    void simpan(T nilai) { isi = nilai; }
    T ambil() const { return isi; }
private:
    T isi;
};

int main() {
    int n;
    string s;
    cin >> n >> s;

    Box<int> angka;
    angka.simpan(n);
    Box<string> teks;
    teks.simpan(s);

    cout << "int: " << angka.ambil() << "\\n";
    cout << "string: " << teks.ambil() << "\\n";
    return 0;
}`,
          tests: [
            { stdin: "7 teh", expectedOutput: "int: 7\nstring: teh" },
            { stdin: "100 kopi", expectedOutput: "int: 100\nstring: kopi" },
            { stdin: "-5 kodok", expectedOutput: "int: -5\nstring: kodok", hidden: true },
          ],
          hints: [
            "Tipe kembalian ambil dan tipe member isi mengikuti parameter tipe yang sudah dideklarasikan di atas class.",
            "Di dalam class template, T dipakai persis seperti tipe biasa: sebagai tipe kembalian maupun tipe member.",
            "Kedua ___ cukup ditulis T.",
          ],
        },
      ],
    },
    {
      slug: "tpl-specialisasi",
      title: "Template Specialization",
      summary: "Beri implementasi khusus untuk satu tipe tertentu tanpa menyentuh template umumnya.",
      steps: [
        {
          kind: "theory",
          title: "Versi umum, plus satu pengecualian",
          body: "Template bekerja bagus selama logikanya cocok untuk semua tipe. Kadang satu tipe butuh perlakuan berbeda: `to_string` tidak tersedia untuk `string` itu sendiri, atau `bool` lebih hemat dihitung dengan cara lain. Template specialization memungkinkan kamu menulis implementasi khusus untuk tipe itu, sementara template umum tetap melayani tipe lain tanpa berubah.\n\nPenulisannya dimulai dengan `template <>` kosong, lalu signature yang menyebut tipe eksplisitnya. Pada contoh di bawah, `perkenalan(80)` memakai versi umum dan menghasilkan teks dari `to_string`, sedangkan `perkenalan(string(\"KodeKita\"))` memakai spesialisasi untuk `string`. Compiler memilih spesialisasi ketika tipe argumen pemanggilan persis sama dengan tipe pada spesialisasi.\n\nPakai secukupnya. Setiap spesialisasi adalah cabang tambahan yang harus dijaga: perubahan perilaku di versi umum tidak otomatis ikut ke versi khusus. Standar library sendiri memakainya hemat dan dengan alasan kuat, contoh terkenalnya `vector<bool>` yang memadatkan tiap nilai jadi satu bit.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <string>
using namespace std;

template <typename T>
string perkenalan(T nilai) {
    return "nilai umum: " + to_string(nilai);
}

template <>
string perkenalan<string>(string nilai) {
    return "teks: " + nilai;
}

int main() {
    cout << perkenalan(80) << "\\n";
    cout << perkenalan(string("KodeKita")) << "\\n";
    return 0;
}`,
            caption: "template <> menandai pengecualian untuk tipe string; tipe lain tetap lewat versi umum.",
          },
        },
        {
          kind: "quiz",
          question: "Kapan compiler memakai versi spesialisasi, bukan versi umumnya?",
          options: [
            "Setiap kali template umum juga bisa dipakai",
            "Ketika tipe argumen pemanggilan persis sama dengan tipe yang disebut pada spesialisasi",
            "Hanya kalau versi umum gagal dikompilasi",
            "Kalau spesialisasi ditulis lebih dulu di file",
          ],
          answer: 1,
          explanation:
            "Spesialisasi dipilih saat cocok persis dengan tipe argumennya. Versi umum tetap dipakai untuk semua tipe lain, dan urutan penulisan di file tidak menentukan pilihan.",
        },
      ],
    },
    {
      slug: "tpl-auto-return",
      title: "auto sebagai Tipe Kembalian",
      summary: "Serahkan tipe hasil fungsi ke compiler dengan auto, dan pahami aturan deduksinya.",
      steps: [
        {
          kind: "theory",
          title: "Compiler tahu hasilnya apa",
          body: "Sejak C++14, tipe kembalian fungsi boleh ditulis `auto` selama setiap jalur `return` bisa diukur compilernya. `ambilPertama` yang mengembalikan `data.front()` menghasilkan `int`; `bagiDua` yang mengembalikan `total / 2.0` menghasilkan `double`. Kamu tidak menulis tipe itu, compiler menyimpulkannya dari ekspresi return.\n\nAturan deduksinya perlu dikenali. `auto` membuang referensi dan const tingkat atas: fungsi yang `return` sebuah `const int&` tetap dianggap menghasilkan salinan `int`. Kalau referensinya memang ingin dipertahankan, tulis `decltype(auto)`. Untuk fungsi biasa yang mengembalikan nilai, `auto` saja sudah tepat.\n\nAda dua batasan yang sering dijumpai. Pertama, semua pernyataan `return` harus menyimpulkan tipe yang sama; `if (p) return 1; return 2.5;` ditolak karena int berhadapan dengan double. Kedua, fungsi dengan tipe kembalian `auto` tidak boleh memanggil dirinya sendiri sebelum ada `return` yang menetapkan tipenya, jadi rekursi murni seperti `auto fak(int n) { return n * fak(n - 1); }` gagal dikompilasi.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <vector>
using namespace std;

auto ambilPertama(const vector<int>& data) {
    return data.front();
}

auto bagiDua(int total) {
    return total / 2.0;
}

int main() {
    cout << ambilPertama({10, 20, 30}) << "\\n";
    cout << bagiDua(7) << "\\n";
    return 0;
}`,
            caption: "ambilPertama menghasilkan int, bagiDua menghasilkan double; compiler yang menyimpulkan.",
          },
        },
        {
          kind: "quiz",
          question: "Tipe kembalian apa yang dipilih compiler untuk `auto f(double x) { return x * 2; }`?",
          options: ["int", "double", "float", "auto itu sendiri"],
          answer: 1,
          explanation:
            "Ekspresi x * 2 dengan x bertipe double menghasilkan double, jadi tipe kembalian yang disimpulkan adalah double.",
        },
        {
          kind: "code",
          title: "Template perkalian dengan auto return",
          prompt:
            "Lengkapi template `kali` supaya tipe kembalian menyimpulkan sendiri dan perkaliannya benar. `kali(a, b)` memakai angka dari input, `kali(a, 3)` memakai konstanta. Ganti setiap `___`.",
          mode: "fill",
          template: `#include <iostream>
using namespace std;

template <typename T, typename U>
___ kali(T a, U b) {
    return a ___ b;
}

int main() {
    int a;
    double b;
    cin >> a >> b;
    cout << kali(a, b) << "\\n";
    cout << kali(a, 3) << "\\n";
    return 0;
}`,
          solution: `#include <iostream>
using namespace std;

template <typename T, typename U>
auto kali(T a, U b) {
    return a * b;
}

int main() {
    int a;
    double b;
    cin >> a >> b;
    cout << kali(a, b) << "\\n";
    cout << kali(a, 3) << "\\n";
    return 0;
}`,
          tests: [
            { stdin: "5 2.5", expectedOutput: "12.5\n15" },
            { stdin: "4 0.5", expectedOutput: "2\n12" },
            { stdin: "7 1.5", expectedOutput: "10.5\n21", hidden: true },
          ],
          hints: [
            "Tipe kembalian yang menyimpulkan sendiri ditulis dengan satu kata, sama seperti deklarasi variabel tanpa tipe eksplisit.",
            "Perkaliannya operasi aritmetika biasa: a dikali b.",
            "Tulis auto sebagai tipe kembalian, dan return a * b sebagai isi fungsi.",
          ],
        },
      ],
    },
    {
      slug: "tpl-constexpr-function",
      title: "constexpr Function",
      summary: "Tulis fungsi yang bisa dijalankan compiler saat kompilasi, dan tetap berfungsi seperti biasa saat runtime.",
      steps: [
        {
          kind: "theory",
          title: "Perhitungan yang selesai sebelum program jalan",
          body: "Menambah kata `constexpr` pada fungsi memberi izin: fungsi ini boleh dijalankan saat kompilasi, selama argumennya konstanta yang sudah diketahui. Hasilnya bisa dipakai di tempat yang menuntut konstanta: ukuran array, argumen template, atau `static_assert` yang memverifikasi langsung di waktu kompilasi.\n\nFungsi yang sama tetap normal saat dipanggil dengan nilai runtime. `kuadrat(9)` di dalam `static_assert` dihitung compiler, sedangkan `kuadrat(n)` dengan `n` dari input dihitung saat program berjalan. Satu fungsi, dua peran, tanpa duplikasi.\n\nSejak C++14, badan `constexpr` sudah longgar: boleh ada variabel lokal, loop, dan if. Cocok untuk perhitungan yang memang tetap nilainya: faktorial, konversi satuan, atau ukuran tabel yang bergantung konstanta proyek. Dengan begitu kesalahan aritmetika tertangkap lebih awal oleh `static_assert`, bukan saat pengguna memakai program.",
          code: {
            language: "cpp",
            content: `#include <iostream>
using namespace std;

constexpr int faktorial(int n) {
    int hasil = 1;
    for (int i = 2; i <= n; i++) {
        hasil *= i;
    }
    return hasil;
}

int main() {
    constexpr int f5 = faktorial(5);
    int n;
    cin >> n;
    cout << f5 << "\\n";
    cout << faktorial(n) << "\\n";
    return 0;
}`,
            caption: "faktorial(5) dihitung compiler; faktorial(n) dihitung saat program berjalan.",
          },
        },
        {
          kind: "quiz",
          question: "Kapan fungsi constexpr benar-benar dijalankan saat kompilasi?",
          options: [
            "Selalu, tanpa kecuali",
            "Ketika dipanggil dengan argumen yang nilainya sudah diketahui saat kompilasi dan hasilnya diminta sebagai konstanta",
            "Hanya jika fungsinya tidak punya parameter",
            "Hanya pada mode release",
          ],
          answer: 1,
          explanation:
            "Dengan argumen runtime, fungsi constexpr berjalan seperti fungsi biasa saat program dieksekusi. Evaluasi saat kompilasi terjadi ketika seluruh inputnya konstanta dan hasilnya dipakai di konteks konstanta.",
        },
        {
          kind: "code",
          title: "Verifikasi kuadrat saat kompilasi",
          prompt:
            "Lengkapi fungsi `kuadrat` supaya layak dipanggil compiler: beri dia kata kunci constexpr, dan benarkan perkaliannya. `static_assert` di bawahnya akan memeriksa versi konstanta, sedangkan main mengujinya dengan input. Ganti setiap `___`.",
          mode: "fill",
          template: `#include <iostream>
using namespace std;

___ int kuadrat(int n) {
    return n ___ n;
}

static_assert(kuadrat(9) == 81, "harus dihitung saat kompilasi");

int main() {
    int n;
    cin >> n;
    cout << kuadrat(n) << "\\n";
    return 0;
}`,
          solution: `#include <iostream>
using namespace std;

constexpr int kuadrat(int n) {
    return n * n;
}

static_assert(kuadrat(9) == 81, "harus dihitung saat kompilasi");

int main() {
    int n;
    cin >> n;
    cout << kuadrat(n) << "\\n";
    return 0;
}`,
          tests: [
            { stdin: "5", expectedOutput: "25" },
            { stdin: "12", expectedOutput: "144" },
            { stdin: "-4", expectedOutput: "16", hidden: true },
          ],
          hints: [
            "Kata kuncinya satu keluarga dengan const, tapi lebih kuat: ia menjanjikan evaluasi saat kompilasi dimungkinkan.",
            "Kuadrat berarti bilangan dikali dirinya sendiri.",
            "Isi dengan constexpr dan tanda bintang: constexpr int kuadrat(int n), lalu return n * n.",
          ],
        },
      ],
    },
    {
      slug: "tpl-variadic",
      title: "Variadic Template",
      summary: "Terima jumlah argumen yang tidak tentu dengan parameter tipe pack dan sizeof....",
      steps: [
        {
          kind: "theory",
          title: "Argumen yang jumlahnya bebas",
          body: "Kadang kamu ingin fungsi menerima satu argumen, lima argumen, atau dua puluh, semuanya dengan tipe campuran. Variadic template menjawabnya dengan parameter tipe pack: `template <typename... Args>`. Di dalam fungsi, `Args...` adalah kantong berisi tipe-tipe argumen pemanggilan, dan `sizeof...(Args)` menghitung isinya.\n\nCara klasik memakainya adalah pola satu dan sisanya: tangani argumen pertama, panggil ulang fungsi untuk sisanya, dan sediakan versi tanpa argumen sebagai pemberhenti rekursi. C++17 menyediakan jalan pintas bernama fold expression: `(0 + ... + angka)` menjumlahkan seluruh isi kantong dalam satu ekspresi, dan hasilnya 0 kalau kantongnya kosong.\n\nDi dunia nyata mekanisme ini bekerja diam-diam di banyak tempat: `make_unique<T>(...)` meneruskan argumen ke constructor, `emplace_back` membangun elemen langsung di dalam vector, dan berbagai wrapper logging meneruskan pesan berformat. Kemampuannya kuat, tapi pesan errornya bisa panjang, jadi tulis variadic hanya ketika jumlah argumen memang tidak bisa ditentukan.",
          code: {
            language: "cpp",
            content: `#include <iostream>
using namespace std;

template <typename... Args>
int jumlah(Args... angka) {
    return (0 + ... + angka);
}

int main() {
    cout << jumlah(1, 2, 3) << "\\n";
    cout << jumlah(10, 20, 30, 40, 50) << "\\n";
    cout << jumlah() << "\\n";
    return 0;
}`,
            caption: "Fold expression C++17 menjumlahkan seluruh isi pack tanpa rekursi manual.",
          },
        },
        {
          kind: "quiz",
          question:
            "Dengan template `template <typename T, typename... Sisa> int jumlah(T pertama, Sisa... sisanya)`, berapa nilai `sizeof...(sisanya)` saat dipanggil sebagai `jumlah(1, 2, 3, 4)`?",
          options: ["0", "1", "3", "4"],
          answer: 2,
          explanation:
            "Argumen pertama (1) ditampung oleh pertama, jadi kantong sisanya berisi 2, 3, dan 4: tiga elemen, dan itulah hasil sizeof...(sisanya).",
        },
      ],
    },
    {
      slug: "tpl-helper-stl",
      title: "Helper Generik untuk STL",
      summary: "Tulis fungsi template yang menerima const vector<T>& untuk mencetak dan menjumlahkan container tipe apa pun.",
      steps: [
        {
          kind: "theory",
          title: "Helper sendiri di atas STL",
          body: "STL sudah generik, tapi kebutuhan proyek sering lebih spesifik: cetak isi dengan pemisah tertentu, jumlahkan, cari rata-rata. Daripada menulis tiga versi untuk `vector<int>`, `vector<double>`, dan `vector<string>`, tulis sekali sebagai template `void cetakSemua(const vector<T>& data)`. Compiler yang membuat versi per tipe, persis seperti template yang selama ini kamu tulis.\n\nPerhatikan parameternya: `const vector<T>&`. Tanda `&` membuat vector tidak disalin ulang setiap pemanggilan, dan `const` menjanjikan fungsi tidak mengubah isinya. Untuk menjumlahkan, helper `total` mengembalikan `T`: `int` untuk vector<int>, dan `string` hasil sambungan kalau kamu memang memanggilnya untuk vector<string>. Kebiasaan `T hasil = {};` memberi nilai awal netral: 0 untuk angka, string kosong untuk teks.\n\nKalau nanti helper harus melayani container lain juga, parameternya bisa diganti iterator atau range seperti yang dipakai `<algorithm>`. Untuk kebanyakan kebutuhan internal, `const vector<T>&` sudah cukup dan paling mudah dibaca.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

template <typename T>
void cetak(const vector<T>& data) {
    for (const T& item : data) {
        cout << item << " ";
    }
    cout << "\\n";
}

int main() {
    vector<int> angka = {3, 1, 4};
    vector<string> kata = {"belajar", "template"};
    cetak(angka);
    cetak(kata);
    return 0;
}`,
            caption: "Satu fungsi cetak untuk tipe apa pun yang punya operator <<.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa helper generik menerima `const vector<T>&`, bukan `vector<T>` biasa?",
          options: [
            "Supaya vector tidak disalin ulang setiap pemanggilan dan isinya tidak bisa diubah oleh fungsi",
            "Karena vector<T> tanpa & tidak bisa dikompilasi",
            "Supaya fungsi bisa menambah elemen baru ke vector",
            "Karena kata const membuat program mencetak lebih cepat",
          ],
          answer: 0,
          explanation:
            "Pass by reference menghindari penyalinan seluruh isi, dan const menjaga janji bahwa fungsi hanya membaca. Dua hal itu jadi kontrak yang terlihat jelas di signature.",
        },
        {
          kind: "code",
          title: "Cetak dan jumlahkan dua jenis data",
          prompt:
            "Lengkapi helper generiknya: `cetakSemua` harus merujuk tipe elemen vector-nya, mencetak pemisah spasi hanya di antara elemen, dan `total` harus memulai dari nilai netral. Input berisi n, n angka, lalu n kata. Ganti setiap `___`.",
          mode: "fill",
          template: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

template <typename T>
void cetakSemua(const vector<___>& data) {
    for (size_t i = 0; i < data.size(); i++) {
        cout << data[i];
        if (___) {
            cout << " ";
        }
    }
    cout << "\\n";
}

template <typename T>
T total(const vector<T>& data) {
    T hasil = ___;
    for (const T& item : data) {
        hasil += item;
    }
    return hasil;
}

int main() {
    int n;
    cin >> n;

    vector<int> angka(n);
    for (int i = 0; i < n; i++) {
        cin >> angka[i];
    }

    vector<string> kata(n);
    for (int i = 0; i < n; i++) {
        cin >> kata[i];
    }

    cetakSemua(angka);
    cout << "Jumlah: " << total(angka) << "\\n";
    cetakSemua(kata);
    return 0;
}`,
          solution: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

template <typename T>
void cetakSemua(const vector<T>& data) {
    for (size_t i = 0; i < data.size(); i++) {
        cout << data[i];
        if (i + 1 < data.size()) {
            cout << " ";
        }
    }
    cout << "\\n";
}

template <typename T>
T total(const vector<T>& data) {
    T hasil = {};
    for (const T& item : data) {
        hasil += item;
    }
    return hasil;
}

int main() {
    int n;
    cin >> n;

    vector<int> angka(n);
    for (int i = 0; i < n; i++) {
        cin >> angka[i];
    }

    vector<string> kata(n);
    for (int i = 0; i < n; i++) {
        cin >> kata[i];
    }

    cetakSemua(angka);
    cout << "Jumlah: " << total(angka) << "\\n";
    cetakSemua(kata);
    return 0;
}`,
          tests: [
            { stdin: "3\n10 20 30\nsatu dua tiga", expectedOutput: "10 20 30\nJumlah: 60\nsatu dua tiga" },
            { stdin: "4\n1 2 3 4\na b c d", expectedOutput: "1 2 3 4\nJumlah: 10\na b c d" },
            { stdin: "1\n-7\nsolo", expectedOutput: "-7\nJumlah: -7\nsolo", hidden: true },
          ],
          hints: [
            "cetakSemua bekerja untuk tipe apa pun, jadi tipe elemen vector-nya harus merujuk parameter tipe yang sama.",
            "Spasi hanya dicetak kalau elemen itu bukan yang terakhir: bandingkan posisi berikutnya dengan data.size().",
            "Isi berturut-turut: T, lalu i + 1 < data.size(), lalu {} sebagai nilai awal netral untuk int maupun string.",
          ],
        },
      ],
    },
    {
      slug: "tpl-kapan-tidak",
      title: "Kapan Tidak Perlu Template",
      summary: "Kenali biaya template dan tanda bahwa fungsi biasa sudah cukup.",
      steps: [
        {
          kind: "theory",
          title: "Abstraksi itu bukan gratis",
          body: "Template menyelesaikan duplikasi logika yang sama lintas tipe. Kalau logikanya hanya untuk satu tipe, fungsi biasa menang di semua lini: lebih mudah dibaca, pesan errornya jelas, dan kompilasinya lebih cepat. `int kuadratInt(int x)` yang sederhana lebih baik daripada `template <typename T> int kuadrat(T x)` yang hanya pernah dipanggil dengan int.\n\nBiaya template nyata dan terasa di proyek besar. Definisi template biasanya harus terlihat di header, bukan di file .cpp terpisah, karena compiler harus membuat versinya di tempat pemanggilan. Kompilasi melambat, pesan error untuk kesalahan deduksi bisa belasan baris, dan pembaca kode harus berpikir abstrak: nilai apa saja yang mungkin masuk ke T?\n\nPatokan yang sehat: tulis template ketika logika yang identik dibutuhkan beberapa tipe nyata yang sudah ada, atau ketika kamu sedang membangun pustaka untuk dipakai orang lain. Jangan menyiapkan template supaya terasa siap untuk masa depan; tunggu sampai tipe keduanya benar-benar muncul, lalu naikkan ke template. Refaktor dari fungsi biasa ke template murah dan aman, refaktor sebaliknya sering menyisakan panggilan eksplisit yang berantakan.",
          code: {
            language: "cpp",
            content: `#include <iostream>
using namespace std;

template <typename T>
int kuadrat(T x) {
    return x * x;
}

int kuadratInt(int x) {
    return x * x;
}

int main() {
    cout << kuadratInt(9) << "\\n";
    return 0;
}`,
            caption: "Kuadrat yang hanya dipakai int cukup ditulis sebagai fungsi int biasa.",
          },
        },
        {
          kind: "quiz",
          question:
            "Seorang rekan menulis `template <typename T> int hitungUmur(T tahunLahir)` padahal tahun lahir di seluruh proyek selalu int. Menurut praktik yang sehat, apa tindakan paling tepat?",
          options: [
            "Biarkan saja, template selalu pilihan paling aman untuk masa depan",
            "Ubah menjadi fungsi biasa bertipe int karena logikanya hanya berlaku untuk satu tipe",
            "Tambahkan parameter tipe lagi supaya makin generik",
            "Ganti semua tipe di proyek menjadi double supaya templatennya berguna",
          ],
          answer: 1,
          explanation:
            "Tanpa tipe kedua yang nyata, template hanya menambah biaya baca dan kompilasi. Tulis fungsi biasa dulu; naikkan ke template saat tipe lain memang muncul.",
        },
      ],
    },
    {
      slug: "tpl-latihan-tas",
      title: "Latihan: Tas Generik dan Helper Terbesar",
      summary: "Gabungkan class template dan function template: Tas<T> menyimpan data, terbesar mengolahnya untuk int maupun string.",
      steps: [
        {
          kind: "theory",
          title: "Dua template yang saling melengkapi",
          body: "Class template dan function template hampir selalu dipasangkan di kode nyata: class menyimpan dan menjaga data, function template mengolahnya. `vector` hidup seperti itu, dan `std::max_element` bekerja untuk hampir semua container karena keduanya berbagi satu kontrak sederhana.\n\nDi lesson penutup modul ini kamu melengkapinya sendiri. Class `Tas<T>` sudah lengkap: `tambah` memasukkan, `ambil` membaca posisi, `ukuran` menghitung isinya. Fungsi `terbesar(const Tas<T>&)` menerima tas tipe apa pun dan mencari elemen terbesarnya. Syaratnya satu: `T` harus punya operator `>`, dan memang `int` maupun `string` memilikinya, itulah kenapa satu fungsi melayani dua tipe.\n\nPerhatikan polanya saat mengerjakan: fungsi generik hanya boleh memakai kemampuan yang dijamin dimiliki T. `terbesar` tidak menyambung teks, tidak menghitung rata-rata, hanya membandingkan. Batasan itu justru membuatnya benar untuk semua tipe yang memenuhi syarat, bukan hanya yang kamu pikirkan hari ini.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <vector>
using namespace std;

template <typename T>
class Tas {
public:
    void tambah(const T& item) { isi.push_back(item); }
    T ambil(int i) const { return isi[i]; }
    int ukuran() const { return static_cast<int>(isi.size()); }
private:
    vector<T> isi;
};

int main() {
    Tas<int> t;
    t.tambah(5);
    t.tambah(8);
    cout << t.ukuran() << " isi, pertama " << t.ambil(0) << "\\n";
    return 0;
}`,
            caption: "Class template menyimpan dan menjaga; sisanya tinggal dipakai siapa pun.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa satu fungsi `terbesar(const Tas<T>&)` bisa dipakai untuk Tas<int> dan Tas<string> sekaligus?",
          options: [
            "Karena compiler mengubah string menjadi int secara otomatis",
            "Karena fungsinya hanya memakai ambil dan operator >, yang dimiliki kedua tipe itu",
            "Karena terbesar ditulis sebagai friend di dalam class Tas",
            "Karena Tas<int> dan Tas<string> sebenarnya tipe yang sama",
          ],
          answer: 1,
          explanation:
            "Fungsi generik benar selama hanya memakai kemampuan yang dijamin T. int dan string sama-sama punya operator >, jadi satu resep cukup untuk keduanya.",
        },
        {
          kind: "code",
          title: "Selesaikan pencari terbesar",
          prompt:
            "Lengkapi bagian yang kurang pada fungsi `terbesar`: deklarasi parameter tipenya sendiri, dan arah pembandingnya supaya elemen yang lebih besar menang. Class Tas dan program utama sudah benar. Ganti setiap `___`.",
          mode: "fill",
          template: `#include <iostream>
#include <string>
using namespace std;

template <typename T>
class Tas {
public:
    void tambah(const T& item) {
        isi.push_back(item);
    }
    int ukuran() const {
        return static_cast<int>(isi.size());
    }
    T ambil(int i) const {
        return isi[i];
    }
private:
    vector<T> isi;
};

template <___>
T terbesar(const Tas<T>& tas) {
    T maks = tas.ambil(0);
    for (int i = 1; i < tas.ukuran(); i++) {
        if (tas.ambil(i) ___ maks) {
            maks = tas.ambil(i);
        }
    }
    return maks;
}

int main() {
    int n;
    cin >> n;
    Tas<int> angka;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        angka.tambah(x);
    }
    cout << "angka: " << angka.ukuran() << " buah, terbesar " << terbesar(angka) << "\\n";

    int m;
    cin >> m;
    Tas<string> kata;
    for (int i = 0; i < m; i++) {
        string s;
        cin >> s;
        kata.tambah(s);
    }
    cout << "kata: " << kata.ukuran() << " buah, terbesar " << terbesar(kata) << "\\n";
    return 0;
}`,
          solution: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

template <typename T>
class Tas {
public:
    void tambah(const T& item) {
        isi.push_back(item);
    }
    int ukuran() const {
        return static_cast<int>(isi.size());
    }
    T ambil(int i) const {
        return isi[i];
    }
private:
    vector<T> isi;
};

template <typename T>
T terbesar(const Tas<T>& tas) {
    T maks = tas.ambil(0);
    for (int i = 1; i < tas.ukuran(); i++) {
        if (tas.ambil(i) > maks) {
            maks = tas.ambil(i);
        }
    }
    return maks;
}

int main() {
    int n;
    cin >> n;
    Tas<int> angka;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        angka.tambah(x);
    }
    cout << "angka: " << angka.ukuran() << " buah, terbesar " << terbesar(angka) << "\\n";

    int m;
    cin >> m;
    Tas<string> kata;
    for (int i = 0; i < m; i++) {
        string s;
        cin >> s;
        kata.tambah(s);
    }
    cout << "kata: " << kata.ukuran() << " buah, terbesar " << terbesar(kata) << "\\n";
    return 0;
}`,
          tests: [
            { stdin: "4\n3 17 8 5\n3\nkiwi apel mangga", expectedOutput: "angka: 4 buah, terbesar 17\nkata: 3 buah, terbesar mangga" },
            { stdin: "2\n100 99\n2\nzebra yakin", expectedOutput: "angka: 2 buah, terbesar 100\nkata: 2 buah, terbesar zebra" },
            { stdin: "1\n-9\n4\nb c a d", expectedOutput: "angka: 1 buah, terbesar -9\nkata: 4 buah, terbesar d", hidden: true },
          ],
          hints: [
            "terbesar juga fungsi template: ia butuh deklarasi parameter tipenya sendiri, sama seperti yang ada di atas class Tas.",
            "Pembandingnya meminta elemen saat ini mengalahkan maks; perhatikan arah tanda pada kata lebih besar.",
            "Isi dengan typename T pada baris template, dan tanda > pada pembanding.",
          ],
        },
      ],
    },

    // ==================== MODUL 7: Error dan Ketahanan ====================
    {
      slug: "err-throw-catch",
      title: "throw, try, dan catch",
      summary: "Lempar exception saat kejadian tak terduga, tangkap di tempat yang tahu cara merespons, dan biarkan program lanjut.",
      steps: [
        {
          kind: "theory",
          title: "Ketika asumsi rusak",
          body: "Program sejauh ini hidup di dunia mulus: input selalu benar, pembagi tidak pernah nol. Kenyataannya tidak begini. C++ menyediakan exception untuk kejadian yang membuat fungsi tidak bisa menepati tugasnya: fungsi yang membagi melempar (`throw`) sebuah objek kesalahan ketika pembaginya nol, dan pemanggil yang tahu cara merespons menangkapnya.\n\nMekaniknya tiga kata kunci. `throw runtime_error(\"pembagi nol\")` melempar objek kesalahan lengkap dengan pesan. Blok `try` membungkus kode yang berpotensi melempar. `catch` menampung objeknya; eksekusi melompat dari titik lempar langsung ke handler yang cocok, melewati sisa blok try. Setelah catch selesai, program berjalan lagi seperti biasa dari baris sesudahnya.\n\nYang membedakan ini dari `if` biasa adalah jaraknya. Exception bisa melewati beberapa lapis fungsi sekaligus sampai menemukan penangkap, sehingga lapisan tengah tidak perlu tahu soal pembagi nol. Kalau tidak ada penangkap apa pun sampai keluar dari main, program berhenti lewat `std::terminate`; itulah sebabnya setiap throw yang kamu tulis harus punya rencana tangkap yang jelas.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <stdexcept>
using namespace std;

double bagi(int a, int b) {
    if (b == 0) {
        throw runtime_error("pembagi nol");
    }
    return static_cast<double>(a) / b;
}

int main() {
    int a, b;
    cin >> a >> b;
    try {
        double hasil = bagi(a, b);
        cout << "hasil: " << hasil << "\\n";
    } catch (const runtime_error& e) {
        cout << "gagal: " << e.what() << "\\n";
    }
    cout << "program masih jalan\\n";
    return 0;
}`,
            caption: "Input 7 0 melempar; catch menampung, lalu baris terakhir tetap tereksekusi.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi kalau exception dilempar tapi tidak ada satu pun catch yang cocok sepanjang jalan keluar dari main?",
          options: [
            "Exception diabaikan dan program lanjut seperti biasa",
            "Program berhenti lewat std::terminate",
            "Compiler menolak mengompilasi program itu",
            "Exception otomatis dikembalikan sebagai nilai balik fungsi",
          ],
          answer: 1,
          explanation:
            "Exception yang tidak tertangkap sampai keluar main memanggil std::terminate dan program berakhir. Setiap throw butuh rencana tangkap.",
        },
        {
          kind: "code",
          title: "Lengkapi lempar dan tangkap",
          prompt:
            "Lengkapi program pembagi yang tahan banting: lempar `runtime_error` saat pembagi nol, bungkus pemanggilan dengan blok yang tepat, dan tangkap exceptionnya. Ganti setiap `___`.",
          mode: "fill",
          template: `#include <iostream>
#include <stdexcept>
using namespace std;

double bagi(int a, int b) {
    if (b == 0) {
        ___ runtime_error("pembagi nol");
    }
    return static_cast<double>(a) / b;
}

int main() {
    int a, b;
    cin >> a >> b;
    ___ {
        double hasil = bagi(a, b);
        cout << "hasil: " << hasil << "\\n";
    } ___ (const runtime_error& e) {
        cout << "gagal: " << e.what() << "\\n";
    }
    cout << "program masih jalan\\n";
    return 0;
}`,
          solution: `#include <iostream>
#include <stdexcept>
using namespace std;

double bagi(int a, int b) {
    if (b == 0) {
        throw runtime_error("pembagi nol");
    }
    return static_cast<double>(a) / b;
}

int main() {
    int a, b;
    cin >> a >> b;
    try {
        double hasil = bagi(a, b);
        cout << "hasil: " << hasil << "\\n";
    } catch (const runtime_error& e) {
        cout << "gagal: " << e.what() << "\\n";
    }
    cout << "program masih jalan\\n";
    return 0;
}`,
          tests: [
            { stdin: "10 2", expectedOutput: "hasil: 5\nprogram masih jalan" },
            { stdin: "7 0", expectedOutput: "gagal: pembagi nol\nprogram masih jalan" },
            { stdin: "9 4", expectedOutput: "hasil: 2.25\nprogram masih jalan", hidden: true },
          ],
          hints: [
            "Melemparkan pengecualian dan menampungnya masing-masing satu kata kunci.",
            "Blok yang berpotensi melempar dibungkus kata kunci kedua, dan handler menyusul dengan pola } kata_kunci (const runtime_error& e) {.",
            "Isi berturut-turut: throw, try, dan catch.",
          ],
        },
      ],
    },
    {
      slug: "err-exception-what",
      title: "std::exception dan what()",
      summary: "Kenali keluarga exception standar, tangkap lewat const reference ke base class, dan baca pesannya lewat what().",
      steps: [
        {
          kind: "theory",
          title: "Satu leluhur, banyak turunan",
          body: "Semua exception bawaan C++ adalah turunan `std::exception`, yang punya satu method penting: `what()`, mengembalikan pesan kesalahan sebagai teks. Turunan yang sering dipakai: `runtime_error` untuk kegagalan yang baru terlihat saat program berjalan, `invalid_argument` untuk nilai yang ditolak sejak awal, `out_of_range` untuk akses di luar batas yang sah.\n\nKarena keduanya turunan `std::exception`, satu handler `catch (const exception& e)` menampung semuanya, dan `e.what()` tetap mengembalikan pesan asli dari turunannya. Tangkap selalu lewat reference: menangkap `exception e` tanpa `&` menyalin objek dan memotongnya (slicing) menjadi base class. Kalau perlakuannya harus berbeda per jenis, tulis beberapa catch dengan yang paling spesifik di atas, karena compiler memilih handler pertama yang cocok.\n\nSaat melempar sendiri, isi pesannya untuk pembaca manusia. `\"umur tidak boleh negatif\"` langsung menjawab apa dan kenapa; pesan seperti `\"error\"` hanya menambah kerja saat mencari sumber masalah. Pesan itulah yang muncul di log produksi.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <stdexcept>
using namespace std;

void periksaUmur(int umur) {
    if (umur < 0) {
        throw invalid_argument("umur tidak boleh negatif");
    }
    if (umur > 120) {
        throw out_of_range("umur tidak masuk akal");
    }
    cout << "umur valid: " << umur << "\\n";
}

int main() {
    int umur;
    cin >> umur;
    try {
        periksaUmur(umur);
    } catch (const exception& e) {
        cout << "ditolak: " << e.what() << "\\n";
    }
    return 0;
}`,
            caption: "Satu catch untuk exception& menampung invalid_argument maupun out_of_range, lengkap dengan pesannya.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa handler umumnya ditulis `catch (const exception& e)`, bukan `catch (exception e)`?",
          options: [
            "Supaya objek exception tidak disalin dan tidak terpotong (slicing) menjadi base class-nya",
            "Karena exception hanya bisa ditangkap lewat pointer",
            "Supaya what() bisa dipanggil dua kali",
            "Karena versi tanpa & tidak akan dikompilasi",
          ],
          answer: 0,
          explanation:
            "Menangkap by value menyalin objek dan hanya menyisakan bagian base class-nya, sehingga informasi turunannya hilang. Const reference menjaga objek utuh tanpa biaya salin.",
        },
        {
          kind: "code",
          title: "Satu penangkap untuk semua jenis",
          prompt:
            "Lengkapi handler supaya menampung semua turunan `std::exception` sekaligus, lalu tampilkan pesannya dengan method yang tepat. Ganti setiap `___`.",
          mode: "fill",
          template: `#include <iostream>
#include <stdexcept>
using namespace std;

void periksaUmur(int umur) {
    if (umur < 0) {
        throw invalid_argument("umur tidak boleh negatif");
    }
    if (umur > 120) {
        throw out_of_range("umur tidak masuk akal");
    }
    cout << "umur valid: " << umur << "\\n";
}

int main() {
    int umur;
    cin >> umur;
    try {
        periksaUmur(umur);
    } catch (const ___& e) {
        cout << "ditolak: " << e.___() << "\\n";
    }
    return 0;
}`,
          solution: `#include <iostream>
#include <stdexcept>
using namespace std;

void periksaUmur(int umur) {
    if (umur < 0) {
        throw invalid_argument("umur tidak boleh negatif");
    }
    if (umur > 120) {
        throw out_of_range("umur tidak masuk akal");
    }
    cout << "umur valid: " << umur << "\\n";
}

int main() {
    int umur;
    cin >> umur;
    try {
        periksaUmur(umur);
    } catch (const exception& e) {
        cout << "ditolak: " << e.what() << "\\n";
    }
    return 0;
}`,
          tests: [
            { stdin: "17", expectedOutput: "umur valid: 17" },
            { stdin: "-3", expectedOutput: "ditolak: umur tidak boleh negatif" },
            { stdin: "300", expectedOutput: "ditolak: umur tidak masuk akal", hidden: true },
          ],
          hints: [
            "Semua exception standar punya satu leluhur bersama; menangkap leluhurnya menampung semua turunannya.",
            "Method yang mengembalikan pesan kesalahan berbentuk teks dipunyai setiap objek std::exception.",
            "Tulis exception pada catch, dan what() pada pemanggilan method-nya.",
          ],
        },
      ],
    },
    {
      slug: "err-exception-safety",
      title: "Exception Safety dan Stack Unwinding",
      summary: "Pahami apa yang terjadi pada objek lokal saat exception menyebar, dan tiga tingkat janji ketahanan fungsi.",
      steps: [
        {
          kind: "theory",
          title: "Yang dibereskan sebelum catch dieksekusi",
          body: "Saat exception menyebar keluar dari sebuah fungsi, C++ memanggil destruktor semua objek lokal di sepanjang jalannya, dari yang paling dalam ke luar. Proses ini disebut stack unwinding. Pada contoh di bawah, sebelum catch di main sempat berjalan, destruktor `dalam` dan `luar` sudah tereksekusi dengan urutan yang benar.\n\nInilah alasan RAII (lesson modul memori) tetap aman dalam kondisi kacau: `vector`, `string`, dan `unique_ptr` membereskan sumber dayanya di destruktor, dan destruktor itu dijamin berjalan meski eksekusi melompat. Kamu tidak perlu blok pembersihan manual di setiap lapis; cukup bungkus sumber daya dalam objek yang punya destruktor.\n\nKetahanan fungsi sering dinyatakan sebagai tiga tingkat janji. Janji dasar: tidak ada kebocoran dan invariannya tetap utuh, meski nilainya berubah sebagian. Janji kuat: berhasil penuh atau tidak berubah sama sekali, seperti transaksi. Janji tanpa lempar: dijamin tidak melempar apa pun, ini yang nanti ditandai `noexcept`. Dua larangan penting menutup materi ini: jangan biarkan exception keluar dari destructor, dan jangan pakai exception sebagai pengganti `if` di jalur normal.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <stdexcept>
using namespace std;

class Penanda {
public:
    explicit Penanda(string nama) : nama_(nama) {}
    ~Penanda() {
        cout << "destruktor " << nama_ << " berjalan\\n";
    }
private:
    string nama_;
};

void proses() {
    Penanda luar("luar");
    Penanda dalam("dalam");
    throw runtime_error("ada masalah");
}

int main() {
    try {
        proses();
    } catch (const exception& e) {
        cout << "ditangkap: " << e.what() << "\\n";
    }
    return 0;
}`,
            caption: "Destruktor berjalan otomatis dari yang paling dalam, sebelum catch mulai bekerja.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi pada objek lokal ketika exception menyebar keluar dari fungsi?",
          options: [
            "Destruktor mereka tidak dipanggil sama sekali, memorinya bocor",
            "Semua objek lokal di-stack dipanggil destruktornya secara otomatis, dari yang paling dalam ke luar",
            "Hanya destruktor objek global yang dipanggil",
            "Program berhenti sebelum ada satu pun destruktor berjalan",
          ],
          answer: 1,
          explanation:
            "Stack unwinding memanggil destruktor semua objek lokal di sepanjang jalur lemparan. Karena itu RAII aman meski eksekusi melompat ke penangkap.",
        },
      ],
    },
    {
      slug: "err-optional-dasar",
      title: "std::optional: Hasil yang Mungkin Kosong",
      summary: "Kembalikan nilai atau nullopt untuk hasil yang mungkin tidak ada, tanpa nilai sentinel yang membingungkan.",
      steps: [
        {
          kind: "theory",
          title: "Kotak yang boleh kosong",
          body: "Fungsi pencarian punya dua hasil yang mungkin: ketemu atau tidak. Trik lama mengembalikan nilai sentinel: -1 untuk indeks, string kosong untuk nama. Masalahnya sentinel itu bisa jadi nilai sah, dan pemanggil bisa lupa mengeceknya. C++17 punya jawaban yang jujur lewat tipenya: `std::optional<T>`, kotak yang berisi satu nilai T, atau kosong yang ditandai `nullopt`.\n\nCara memakainya ada urutannya: cek dulu, baru ambil. Cek dengan `opt.has_value()` atau langsung `if (opt)`. Setelah yakin berisi, ambil isinya dengan `*opt` atau `opt.value()`. Bedanya tipis tapi penting: `value()` pada kotak kosong melempar `bad_optional_access`, sedangkan `*opt` pada kotak kosong adalah perilaku tak terdefinisi. Keduanya sama-sama menuntut kamu cek dulu.\n\nManfaat terbesarnya ada di signature: `optional<int> cari(...)` sudah memberi tahu pembacanya bahwa hasil bisa tidak ada, tanpa membaca dokumentasi. Perjanjian itu terlihat di setiap pemanggilan, dan compiler membantu menegakkannya.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <optional>
#include <string>
#include <vector>
using namespace std;

optional<int> cari(const vector<string>& data, const string& target) {
    for (int i = 0; i < static_cast<int>(data.size()); i++) {
        if (data[i] == target) {
            return i;
        }
    }
    return nullopt;
}

int main() {
    vector<string> buah = {"apel", "mangga", "kiwi"};
    string target;
    cin >> target;

    optional<int> posisi = cari(buah, target);
    if (posisi.has_value()) {
        cout << "ditemukan di index " << *posisi << "\\n";
    } else {
        cout << "tidak ada\\n";
    }
    return 0;
}`,
            caption: "Kotaknya dicek dulu lewat has_value; isinya diambil dengan * setelah yakin ada.",
          },
        },
        {
          kind: "quiz",
          question: "Cara paling tepat mengecek apakah sebuah std::optional berisi nilai?",
          options: [
            "Bandingkan dengan 0",
            "Panggil has_value(), atau pakai optional itu langsung di kondisi if",
            "Bungkus pemanggilannya dengan try/catch",
            "Cek panjangnya dengan size()",
          ],
          answer: 1,
          explanation:
            "optional punya konversi eksplisit ke bool, jadi if (opt) dan opt.has_value() sama-sama benar. Optional tidak punya size(), dan membandingkan dengan 0 tidak mengecek keberadaan nilai.",
        },
        {
          kind: "code",
          title: "Pencarian yang jujur lewat tipenya",
          prompt:
            "Lengkapi fungsi `cari`: kalau target tidak ditemukan, kembalikan kotak kosong; di main, cek kotaknya dengan method yang tepat sebelum mengambil isinya. Ganti setiap `___`.",
          mode: "fill",
          template: `#include <iostream>
#include <optional>
#include <string>
#include <vector>
using namespace std;

optional<int> cari(const vector<string>& data, const string& target) {
    for (int i = 0; i < static_cast<int>(data.size()); i++) {
        if (data[i] == target) {
            return i;
        }
    }
    return ___;
}

int main() {
    vector<string> buah = {"apel", "mangga", "kiwi"};
    string target;
    cin >> target;

    optional<int> posisi = cari(buah, target);
    if (posisi.___()) {
        cout << "ditemukan di index " << *posisi << "\\n";
    } else {
        cout << "tidak ada\\n";
    }
    return 0;
}`,
          solution: `#include <iostream>
#include <optional>
#include <string>
#include <vector>
using namespace std;

optional<int> cari(const vector<string>& data, const string& target) {
    for (int i = 0; i < static_cast<int>(data.size()); i++) {
        if (data[i] == target) {
            return i;
        }
    }
    return nullopt;
}

int main() {
    vector<string> buah = {"apel", "mangga", "kiwi"};
    string target;
    cin >> target;

    optional<int> posisi = cari(buah, target);
    if (posisi.has_value()) {
        cout << "ditemukan di index " << *posisi << "\\n";
    } else {
        cout << "tidak ada\\n";
    }
    return 0;
}`,
          tests: [
            { stdin: "mangga", expectedOutput: "ditemukan di index 1" },
            { stdin: "durian", expectedOutput: "tidak ada" },
            { stdin: "apel", expectedOutput: "ditemukan di index 0", hidden: true },
          ],
          hints: [
            "Kalau tidak ketemu, kotaknya dikembalikan dalam keadaan kosong; namanya diakhiri kata opt.",
            "Untuk mengecek isi kotak, optional punya method yang persis berarti punya nilai.",
            "Kembalikan nullopt pada jalur gagal, dan cek dengan posisi.has_value() di main.",
          ],
        },
      ],
    },
    {
      slug: "err-optional-value-or",
      title: "optional Lanjutan: value_or",
      summary: "Sediakan nilai cadangan dengan value_or, dan bedakan tiga cara mengambil isi optional.",
      steps: [
        {
          kind: "theory",
          title: "Nilai cadangan sekali jalan",
          body: "Sering kali kotak kosong bukan masalah: tinggal pakai nilai bawaan. `value_or(default)` menyingkat pola if itu jadi satu panggilan: kalau berisi, kembalikan isinya; kalau kosong, kembalikan cadangan. Tidak ada exception, tidak ada cabang yang harus ditulis pemanggil.\n\nSekarang kamu punya tiga cara mengambil isi, masing-masing dengan kontrak berbeda. `*opt` paling ringkas tapi menuntut kamu yakin kotaknya berisi. `opt.value()` mengecek saat runtime dan melempar `bad_optional_access` kalau kosong, cocok ketika kekosongan memang kejadian luar biasa. `opt.value_or(x)` selalu menghasilkan nilai, cocok ketika ada jawaban bawaan yang masuk akal. Memilih yang tepat adalah bagian dari mendesain API.\n\nPola ini berguna di banyak tempat: membaca konfigurasi yang mungkin tidak ada (`bacaPort(\"staging\").value_or(80)`), memberi nama panggilan bawaan, atau mengisi nilai statistik saat data masih kosong. Satu catatan: cadangan dievaluasi setiap pemanggilan, jadi jangan menaruh operasi berat di dalamnya kalau kotaknya biasanya berisi.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <optional>
using namespace std;

optional<int> bacaPort(const string& setting) {
    if (setting == "dev") return 3000;
    if (setting == "prod") return 8080;
    return nullopt;
}

int main() {
    cout << bacaPort("dev").value_or(80) << "\\n";
    cout << bacaPort("staging").value_or(80) << "\\n";
    return 0;
}`,
            caption: "Setting yang tidak dikenal jatuh ke nilai cadangan 80 tanpa cabang if tambahan.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang dikembalikan `opt.value_or(7)` ketika opt sedang kosong?",
          options: [
            "0",
            "7, tanpa melempar exception apa pun",
            "Exception bad_optional_access",
            "nullptr",
          ],
          answer: 1,
          explanation:
            "value_or mengembalikan nilai cadangan saat kotak kosong. Yang melempar bad_optional_access adalah value() tanpa cadangan.",
        },
        {
          kind: "code",
          title: "Kode warna dengan nilai cadangan",
          prompt:
            "Lengkapi fungsi `kodeWarna`: tipe kembaliannya pembungkus yang bisa kosong, dan main harus mengambil isinya dengan nilai cadangan `#808080` ketika warna tidak dikenal. Ganti setiap `___`.",
          mode: "fill",
          template: `#include <iostream>
#include <optional>
#include <string>
using namespace std;

___<string> kodeWarna(const string& nama) {
    if (nama == "merah") return "#ff0000";
    if (nama == "hijau") return "#00ff00";
    if (nama == "biru") return "#0000ff";
    return nullopt;
}

int main() {
    string nama;
    cin >> nama;
    string kode = kodeWarna(nama).___("#808080");
    cout << "warna " << nama << " memakai kode " << kode << "\\n";
    return 0;
}`,
          solution: `#include <iostream>
#include <optional>
#include <string>
using namespace std;

optional<string> kodeWarna(const string& nama) {
    if (nama == "merah") return "#ff0000";
    if (nama == "hijau") return "#00ff00";
    if (nama == "biru") return "#0000ff";
    return nullopt;
}

int main() {
    string nama;
    cin >> nama;
    string kode = kodeWarna(nama).value_or("#808080");
    cout << "warna " << nama << " memakai kode " << kode << "\\n";
    return 0;
}`,
          tests: [
            { stdin: "merah", expectedOutput: "warna merah memakai kode #ff0000" },
            { stdin: "ungu", expectedOutput: "warna ungu memakai kode #808080" },
            { stdin: "biru", expectedOutput: "warna biru memakai kode #0000ff", hidden: true },
          ],
          hints: [
            "Tipe kembalian fungsi ini bukan string biasa, melainkan pembungkus yang boleh kosong, sama seperti tipe kembalian cari di lesson sebelumnya.",
            "Methodnya menerima satu argumen: nilai yang dipakai ketika kotak kosong.",
            "Tulis optional pada tipe kembalian, dan value_or(#808080) pada pemanggilan.",
          ],
        },
      ],
    },
    {
      slug: "err-assert",
      title: "assert: Kontrak Internal",
      summary: "Periksa asumsi yang seharusnya selalu benar dengan assert, dan pahami bedanya dengan penanganan error sungguhan.",
      steps: [
        {
          kind: "theory",
          title: "Alarm untuk programmer, bukan pengguna",
          body: "Ada kondisi yang menurut desainmu tidak boleh pernah terjadi: pembagi `kecepatan` pasti positif karena sudah divalidasi pemanggilnya, indeks pasti di dalam batas karena sudah dijaga loop. `assert(kondisi)` dari header `<cassert>` menuliskan asumsi itu dalam kode: kalau ternyata dilanggar saat program berjalan, program berhenti di tempat kejadian sambil menyebut file, baris, dan ekspresinya.\n\nPeran assert berbeda dari try/catch atau if penanganan error. Assert adalah alat untuk menangkap bug programmer selama pengembangan: salah urutan panggilan, nilai yang lolos validasi, invarian yang rusak. Error yang datang dari pengguna atau dunia luar tetap harus ditangani dengan kode sungguhan yang memberi pesan ramah, karena pengguna tidak boleh dihadapkan pada program yang mati mendadak.\n\nSatu sifat yang wajib diingat: saat kompilasi dengan `NDEBUG` (umumnya mode release), semua assert dimatikan dan ekspresinya tidak dievaluasi. Karena itu jangan menaruh efek samping di dalamnya, seperti `assert(simpanKeDatabase())`; saat release, panggilan itu hilang dan datanya tidak pernah tersimpan. Assert untuk pemeriksaan, bukan untuk pekerjaan.",
          code: {
            language: "cpp",
            content: `#include <cassert>
#include <iostream>
using namespace std;

double kecepatan(double jarak, double waktu) {
    assert(waktu > 0);
    return jarak / waktu;
}

int main() {
    cout << kecepatan(100, 20) << "\\n";
    return 0;
}`,
            caption: "Kalau asumsi dilanggar, assert menghentikan program tepat di baris kejadian.",
          },
        },
        {
          kind: "quiz",
          question: "Kapan assert adalah pilihan yang tepat?",
          options: [
            "Untuk memvalidasi input pengguna di program produksi",
            "Untuk memeriksa asumsi internal yang menurut desain harus selalu benar selama pengembangan",
            "Untuk menangkap exception dari pustaka lain",
            "Untuk mengganti semua if dalam program",
          ],
          answer: 1,
          explanation:
            "Assert bisa hilang total saat NDEBUG aktif, jadi ia hanya cocok untuk asumsi internal. Input pengguna harus ditangani dengan kode yang tetap bekerja di mode release.",
        },
        {
          kind: "code",
          title: "Pasang kontrak di fungsi kecepatan",
          prompt:
            "Lengkapi fungsi `kecepatan`: pasang macro pemeriksa asumsi untuk memastikan waktu positif, dan benarkan perhitungannya. Ganti setiap `___`.",
          mode: "fill",
          template: `#include <cassert>
#include <iostream>
using namespace std;

double kecepatan(double jarak, double waktu) {
    ___(waktu > 0);
    return ___ / waktu;
}

int main() {
    double jarak, waktu;
    cin >> jarak >> waktu;
    cout << kecepatan(jarak, waktu) << "\\n";
    return 0;
}`,
          solution: `#include <cassert>
#include <iostream>
using namespace std;

double kecepatan(double jarak, double waktu) {
    assert(waktu > 0);
    return jarak / waktu;
}

int main() {
    double jarak, waktu;
    cin >> jarak >> waktu;
    cout << kecepatan(jarak, waktu) << "\\n";
    return 0;
}`,
          tests: [
            { stdin: "100 20", expectedOutput: "5" },
            { stdin: "50 4", expectedOutput: "12.5" },
            { stdin: "90 45", expectedOutput: "2", hidden: true },
          ],
          hints: [
            "Header cassert sudah di-include; ia menyediakan macro dengan nama yang sama dengan artinya dalam bahasa Inggris.",
            "Macro itu menerima satu ekspresi boolean; kalau salah, program berhenti dan menyebut barisnya.",
            "Tulis assert(waktu > 0) dan kembalikan jarak.",
          ],
        },
      ],
    },
    {
      slug: "err-error-code",
      title: "Error Code vs Exception",
      summary: "Pilih antara enum class berisi status dan exception dengan mempertimbangkan seberapa sering kegagalan itu terjadi.",
      steps: [
        {
          kind: "theory",
          title: "Dua gaya melaporkan kegagalan",
          body: "C++ memberi dua jalur untuk melaporkan kegagalan: nilai status yang dikembalikan (enum class berisi kode, atau `optional`) dan exception. Pembeda utamanya bukan selera, melainkan pertanyaan sederhana: seberapa sering kegagalan itu terjadi, dan siapa yang paling wajar meresponsnya?\n\nKegagalan yang biasa, seperti input pengguna salah format atau data yang memang tidak ada, laporkan lewat nilai balik. `enum class Status { Ok, Kosong, TidakValid }` membuat semua jalur kegagalan terlihat di tanda tangan fungsi, dan pemanggil memeriksanya dengan `if` biasa. Exception lebih cocok untuk kejadian langka yang membuat fungsi tidak bisa melanjutkan tugas sama sekali: file rusak, koneksi putus, invarian yang dilanggar. Melempar exception untuk input yang salah setiap detik berarti memakai mekanisme paling berat untuk kejadian paling biasa.\n\nAturan perekatnya konsistensi: satu lapisan API memakai satu gaya, dan jangan campur sembarangan. Kelebihan enum class dibanding `int` biasa adalah namanya bermakna (`Status::Kosong`, bukan 2) dan tidak bisa dicampur semena-mena dengan bilangan lain. Kelebihan exception adalah tidak bisa diabaikan diam-diam: kalau pemanggil tidak menangkap, program berhenti, bukan melanjutkan dengan data sampah.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <string>
using namespace std;

enum class Status { Ok, Kosong, TidakValid };

Status proses(const string& teks, int& hasil) {
    if (teks.empty()) return Status::Kosong;
    if (teks != "42") return Status::TidakValid;
    hasil = 42;
    return Status::Ok;
}

int main() {
    int hasil = 0;
    Status s = proses("42", hasil);
    if (s == Status::Ok) {
        cout << "berhasil: " << hasil << "\\n";
    } else {
        cout << "ditolak\\n";
    }
    return 0;
}`,
            caption: "Kode status menaruh semua kemungkinan kegagalan di tanda tangan fungsi.",
          },
        },
        {
          kind: "quiz",
          question:
            "Sebuah fungsi memparsing ribuan input pengguna setiap menit dan input salah terjadi setiap saat. Pendekatan mana yang paling pas?",
          options: [
            "Lempar exception untuk setiap input yang salah",
            "Kembalikan kode status atau optional, karena kegagalan adalah kasus normal di sini",
            "Panggil exit langsung saat menemukan input salah",
            "Pakai assert supaya program berhenti di input pertama yang salah",
          ],
          answer: 1,
          explanation:
            "Ketika gagal adalah bagian rutin dari pekerjaan, laporkan lewat nilai balik: murah, alurnya terbaca, dan pemanggil memeriksanya dengan if biasa. Exception lebih cocok untuk kejadian luar biasa.",
        },
      ],
    },
    {
      slug: "err-validasi-api",
      title: "Fungsi API yang Tidak Pernah Crash",
      summary: "Rancang fungsi yang memvalidasi seluruh input dan selalu menjawab dengan nilai atau penolakan, bukan mati mendadak.",
      steps: [
        {
          kind: "theory",
          title: "Semua input berbahaya sampai terbukti sehat",
          body: "Fungsi yang layak dipakai orang lain punya satu sifat: untuk input apa pun yang masuk, ia menjawab, baik berupa nilai maupun penolakan yang jelas. Ia tidak pernah crash. Crash hampir selalu lahir dari akses tanpa pemeriksaan: indeks yang tidak dicek, konversi angka yang tidak dibungkus, kotak optional yang dibuka tanpa dilihat isinya.\n\nTekniknya berlapis dan berurutan. Tolak dulu yang mencolok: input kosong, panjang yang tidak masuk akal. Periksa karakter satu per satu sebelum percaya formatnya. Terakhir, bungkus operasi pustaka yang bisa melempar, seperti `stoi` yang melempar `out_of_range` untuk angka yang melebihi kapasitas int, dengan try/catch, lalu ubah hasilnya jadi jalur penolakan yang sama dengan yang lain. Pemanggil tidak perlu tahu ada empat cara gagal; bagi dia hanya ada sukses dan `nullopt`.\n\nPerhatikan template latihan ini: jalurnya sudah menolak input kosong dan karakter bukan digit, tapi `stoi` masih telanjang. Input `99999999999999999999` lolos cek digit, lalu melempar out_of_range, dan karena tidak ada penangkap, program berhenti tanpa mencetak apa pun. Tugasmu memperbaikinya.",
          code: {
            language: "cpp",
            content: `#include <cctype>
#include <iostream>
#include <optional>
#include <string>
using namespace std;

optional<int> parseAngkaPositif(const string& teks) {
    if (teks.empty()) {
        return nullopt;
    }
    for (char c : teks) {
        if (!isdigit(static_cast<unsigned char>(c))) {
            return nullopt;
        }
    }
    try {
        int nilai = stoi(teks);
        if (nilai <= 0) {
            return nullopt;
        }
        return nilai;
    } catch (const exception&) {
        return nullopt;
    }
}

int main() {
    string teks;
    cin >> teks;
    optional<int> hasil = parseAngkaPositif(teks);
    if (hasil) {
        cout << "angka valid: " << *hasil << "\\n";
    } else {
        cout << "input ditolak\\n";
    }
    return 0;
}`,
            caption: "Semua jalur buruk bermuara ke nullopt; fungsi tidak pernah melempar apa pun ke pemanggil.",
          },
        },
        {
          kind: "quiz",
          question:
            "Fungsi parse sudah menolak input kosong dan karakter bukan digit, tapi masih crash untuk angka raksasa. Penyebab paling mungkin?",
          options: [
            "stoi melempar exception saat angkanya melebihi kapasitas int, dan lemparan itu tidak ditangkap",
            "String terlalu panjang untuk tipe string di C++",
            "optional tidak sanggup menyimpan angka besar",
            "isdigit tidak bekerja untuk digit yang banyak",
          ],
          answer: 0,
          explanation:
            "stoi menghasilkan out_of_range untuk angka di luar batas int. Tanpa try/catch, lemparan itu sampai ke std::terminate dan program mati sebelum menjawab.",
        },
        {
          kind: "code",
          title: "Tutup celah yang bisa melempar",
          prompt:
            "Fungsi ini sudah menolak input kosong dan karakter bukan digit, tapi masih crash untuk angka yang melebihi kapasitas int. Perbaiki satu kekurangannya supaya semua input buruk kembali sebagai penolakan yang sama.",
          mode: "fix",
          template: `#include <cctype>
#include <iostream>
#include <optional>
#include <string>
using namespace std;

optional<int> parseAngkaPositif(const string& teks) {
    if (teks.empty()) {
        return nullopt;
    }
    for (char c : teks) {
        if (!isdigit(static_cast<unsigned char>(c))) {
            return nullopt;
        }
    }
    int nilai = stoi(teks);
    if (nilai <= 0) {
        return nullopt;
    }
    return nilai;
}

int main() {
    string teks;
    cin >> teks;
    optional<int> hasil = parseAngkaPositif(teks);
    if (hasil) {
        cout << "angka valid: " << *hasil << "\\n";
    } else {
        cout << "input ditolak\\n";
    }
    return 0;
}`,
          solution: `#include <cctype>
#include <iostream>
#include <optional>
#include <string>
using namespace std;

optional<int> parseAngkaPositif(const string& teks) {
    if (teks.empty()) {
        return nullopt;
    }
    for (char c : teks) {
        if (!isdigit(static_cast<unsigned char>(c))) {
            return nullopt;
        }
    }
    try {
        int nilai = stoi(teks);
        if (nilai <= 0) {
            return nullopt;
        }
        return nilai;
    } catch (const exception&) {
        return nullopt;
    }
}

int main() {
    string teks;
    cin >> teks;
    optional<int> hasil = parseAngkaPositif(teks);
    if (hasil) {
        cout << "angka valid: " << *hasil << "\\n";
    } else {
        cout << "input ditolak\\n";
    }
    return 0;
}`,
          tests: [
            { stdin: "42", expectedOutput: "angka valid: 42" },
            { stdin: "12a4", expectedOutput: "input ditolak" },
            { stdin: "99999999999999999999", expectedOutput: "input ditolak", hidden: true },
          ],
          hints: [
            "Jalankan dengan input berupa angka yang sangat panjang: program mati tanpa sempat mencetak apa pun.",
            "stoi melempar out_of_range ketika angkanya melebihi kapasitas int, dan exception tanpa penangkap menghentikan program.",
            "Bungkus pemanggilan stoi dengan try/catch; pada catch, kembalikan nullopt seperti jalur gagal lainnya.",
          ],
        },
      ],
    },
    {
      slug: "err-noexcept",
      title: "noexcept: Janji Tanpa Exception",
      summary: "Tandai fungsi yang dijamin tidak melempar, kenali akibatnya kalau janji dilanggar, dan manfaat optimasinya.",
      steps: [
        {
          kind: "theory",
          title: "Janji yang ditagih tegas",
          body: "Menulis `void tukar(int& a, int& b) noexcept` adalah janji di muka compiler: fungsi ini tidak melempar exception apa pun. Janjinya ditagih serius. Kalau ternyata exception terlempar dari dalam fungsi noexcept, program langsung memanggil `std::terminate`; tidak ada catch di dunia yang bisa menolongnya. Karena itu tandai hanya fungsi yang benar-benar tidak punya jalur lempar: pertukaran dua nilai, pembacaan hitungan sederhana, operasi pada angka.\n\nJanji ini juga bernilai performa. Saat `vector` tumbuh dan memindahkan elemen ke memori baru, ia memilih antara move dan copy. Move constructor yang ditandai `noexcept` aman dipakai karena dijamin tidak meninggalkan kekacauan setengah jalan; tanpa jaminan itu, vector jatuh kembali ke copy yang lebih mahal. Satu kata kecil, dampak nyata di kode yang memindahkan jutaan elemen.\n\nKamu juga bisa bertanya, bukan berjanji: `noexcept(ekspresi)` adalah operator yang menghasilkan true atau false saat kompilasi, tergantung ekspresinya dijamin tidak melempar. Pada contoh di bawah, `noexcept(tukar(x, y))` bernilai true dan tercetak sebagai 1. Kebiasaan baiknya: tandai move constructor, swap, dan fungsi kecil yang jelas aman; jangan tandai fungsi yang memang bisa gagal seperti parsing atau I/O.",
          code: {
            language: "cpp",
            content: `#include <iostream>
using namespace std;

void tukar(int& a, int& b) noexcept {
    int sementara = a;
    a = b;
    b = sementara;
}

int main() {
    int x = 1, y = 2;
    tukar(x, y);
    cout << x << y << "\\n";
    cout << noexcept(tukar(x, y)) << "\\n";
    return 0;
}`,
            caption: "noexcept(ekspresi) mengecek janji itu saat kompilasi; hasil true tercetak sebagai 1.",
          },
        },
        {
          kind: "quiz",
          question: "Fungsi diberi label noexcept tapi ternyata tetap melempar exception. Apa akibatnya?",
          options: [
            "Exception ditangkap otomatis oleh main",
            "Program langsung memanggil std::terminate dan berhenti",
            "Label noexcept diabaikan dan fungsinya berperilaku normal",
            "Compiler mengubah fungsi itu menjadi tidak noexcept saat kompilasi",
          ],
          answer: 1,
          explanation:
            "Melanggar janji noexcept berujung std::terminate: mekanisme penangkapan tidak diberi kesempatan. Karena itu tandai noexcept hanya pada fungsi yang benar-benar tidak melempar.",
        },
      ],
    },
    {
      slug: "err-latihan-parser",
      title: "Latihan: Parser Aman dengan optional",
      summary: "Rangkai optional, validasi karakter, dan try/catch menjadi parser baris angka yang tidak pernah crash.",
      steps: [
        {
          kind: "theory",
          title: "Merangkai semua perlindungan sekaligus",
          body: "Modul ini bertemu di satu titik: fungsi yang menghadap dunia luar harus menganggap setiap input berbahaya sampai terbukti sehat. Parser di latihan penutup ini mempraktikkan seluruh rantainya: token kosong ditolak, karakter diperiksa satu per satu lewat `isdigit`, konversi `stoi` dibungkus try/catch untuk mencegat angka yang melebihi int, dan hasilnya kembali sebagai `optional<int>`. Tidak ada satu pun jalur yang menghentikan program secara mendadak.\n\nBagian main merakitnya: `getline` membaca satu baris penuh, `istringstream` memecahnya jadi token, dan setiap token diperiksa `parseToken`. Kalau ada satu token saja yang gagal, parser melaporkan token bermasalahnya lalu berhenti dengan rapi, alih-alih menjumlahkan data yang setengah sah. Penjumlahan memakai `long long` supaya banyak token kecil pun tidak meluap.\n\nPerhatikan dua detail yang sering keliru. Tanda minus dan plus di depan token sah, jadi pemeriksaan digit dimulai dari karakter kedua untuk token bertanda. Dan saat membaca isi kotak optional, pakai dereferensi `*nilai` hanya setelah dipastikan tidak kosong. Dua kebiasaan itu yang membedakan parser dari mainan dan parser produksi.",
          code: {
            language: "cpp",
            content: `#include <cctype>
#include <iostream>
#include <optional>
#include <string>
using namespace std;

optional<int> parseToken(const string& teks) {
    if (teks.empty()) return nullopt;
    for (char c : teks) {
        if (!isdigit(static_cast<unsigned char>(c))) return nullopt;
    }
    return stoi(teks);
}

int main() {
    cout << parseToken("123").value_or(-1) << "\\n";
    cout << parseToken("12x").value_or(-1) << "\\n";
    return 0;
}`,
            caption: "Versi mini: karakter dicek satu per satu sebelum konversi; latihan menambah tanda dan batas int.",
          },
        },
        {
          kind: "quiz",
          question: "Dalam parser latihan ini, mengapa pemanggilan stoi dibungkus try/catch padahal karakternya sudah semua digit?",
          options: [
            "Karena stoi bisa melempar out_of_range untuk angka yang melebihi kapasitas int",
            "Karena stoi tidak menerima string yang berisi digit",
            "Karena try/catch membuat parser berjalan lebih cepat",
            "Karena digit dengan tanda minus tidak dikenali isdigit",
          ],
          answer: 0,
          explanation:
            "Semua digit tetap bisa meluap: angka dua puluh digit melewati batas int dan membuat stoi melempar out_of_range. Validasi karakter tidak menggantikan penanganan konversi.",
        },
        {
          kind: "code",
          title: "Selesaikan parser baris penuh",
          prompt:
            "Lengkapi tiga keputusan penting di parser ini: jalur penolakan pada pemeriksaan karakter, kondisi untuk mendeteksi token gagal di main, dan cara mengambil isi kotak optional saat menjumlahkan. Ganti setiap `___`.",
          mode: "fill",
          template: `#include <cctype>
#include <iostream>
#include <optional>
#include <sstream>
#include <string>
using namespace std;

optional<int> parseToken(const string& teks) {
    if (teks.empty()) {
        return nullopt;
    }
    size_t mulai = 0;
    if (teks[0] == '-' || teks[0] == '+') {
        mulai = 1;
    }
    if (mulai == teks.size()) {
        return nullopt;
    }
    for (size_t i = mulai; i < teks.size(); i++) {
        if (!isdigit(static_cast<unsigned char>(teks[i]))) {
            ___;
        }
    }
    try {
        return stoi(teks);
    } catch (const exception&) {
        return nullopt;
    }
}

int main() {
    string baris;
    getline(cin, baris);

    istringstream stream(baris);
    string token;
    long long total = 0;
    bool valid = true;

    while (stream >> token) {
        optional<int> nilai = parseToken(token);
        if (___) {
            cout << "token tidak valid: " << token << "\\n";
            valid = false;
            break;
        }
        total += ___;
    }

    if (valid) {
        cout << "total: " << total << "\\n";
    }
    return 0;
}`,
          solution: `#include <cctype>
#include <iostream>
#include <optional>
#include <sstream>
#include <string>
using namespace std;

optional<int> parseToken(const string& teks) {
    if (teks.empty()) {
        return nullopt;
    }
    size_t mulai = 0;
    if (teks[0] == '-' || teks[0] == '+') {
        mulai = 1;
    }
    if (mulai == teks.size()) {
        return nullopt;
    }
    for (size_t i = mulai; i < teks.size(); i++) {
        if (!isdigit(static_cast<unsigned char>(teks[i]))) {
            return nullopt;
        }
    }
    try {
        return stoi(teks);
    } catch (const exception&) {
        return nullopt;
    }
}

int main() {
    string baris;
    getline(cin, baris);

    istringstream stream(baris);
    string token;
    long long total = 0;
    bool valid = true;

    while (stream >> token) {
        optional<int> nilai = parseToken(token);
        if (!nilai) {
            cout << "token tidak valid: " << token << "\\n";
            valid = false;
            break;
        }
        total += *nilai;
    }

    if (valid) {
        cout << "total: " << total << "\\n";
    }
    return 0;
}`,
          tests: [
            { stdin: "10 -3 5", expectedOutput: "total: 12" },
            { stdin: "4 x 6", expectedOutput: "token tidak valid: x" },
            { stdin: "7 99999999999999999999 1", expectedOutput: "token tidak valid: 99999999999999999999", hidden: true },
          ],
          hints: [
            "Karakter yang bukan digit harus memutus validasi token itu di tempat, dengan cara yang sama seperti jalur gagal lain di fungsi itu.",
            "Di main, kotak optional harus dibalik dulu kondisinya sebelum dipakai untuk mendeteksi kegagalan.",
            "Isi berturut-turut: return nullopt, lalu kondisi !nilai, lalu *nilai untuk mengambil isinya.",
          ],
        },
      ],
    },
  ],
};
