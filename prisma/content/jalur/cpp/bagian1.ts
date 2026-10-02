import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "cpp",
  moduleRange: [0, 1],
  modules: [
    {
      title: "C++ Modern Sejak Awal",
      description: "Reference, auto, range-for, namespace, dan perbedaan penting dari C.",
    },
    {
      title: "Class dan Object",
      description: "Constructor/destructor, encapsulation, rule of three/five secara praktis.",
    },
  ],
  lessons: [
    // ==================== MODUL 0: C++ Modern Sejak Awal ====================
    {
      slug: "cpp-iostream-idiom",
      title: "cout dan cin: Idiom I/O Modern",
      summary: "I/O bertipe aman dengan cout dan cin, plus beda endl dan \"\\n\".",
      steps: [
        {
          kind: "theory",
          title: "iostream: I/O tanpa format specifier",
          body: "Untuk mencetak dan membaca, C++ modern memakai header `<iostream>`: `std::cout` untuk keluaran, `std::cin` untuk masukan. Keduanya tinggal di namespace `std`, dan keduanya memakai operator yang bisa dirantai: `<<` mengirim data ke keluaran, `>>` menarik data dari masukan.\n\nKelebihan terbesarnya adalah keamanan tipe. Compiler memilih perilaku operator dari tipe operand, sehingga mencetak `int` dan `double` tidak butuh kode apa pun seperti `%d` atau `%f`. Salah specifier pada `printf` bisa lolos kompilasi lalu mencetak sampah; dengan `cout`, jenis kesalahan itu nyaris tidak ada.\n\n`std::cin >> nilai` melewati spasi dan enter, jadi dua nilai boleh diketik dalam satu baris atau dua baris, hasilnya sama. Untuk keluaran, kenali bedanya: `std::endl` memindah baris sekaligus memaksa flush buffer, sedangkan `\"\\n\"` hanya memindah baris. Kebiasaan modern memakai `\"\\n\"` sebagai bawaan dan menyimpan `std::endl` untuk saat flush benar-benar dibutuhkan.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <string>

int main() {
    std::string nama;
    int umur;
    std::cin >> nama >> umur;

    std::cout << "Halo " << nama << ", umur " << umur << "\\n";
    std::cout << "Tahun depan: " << umur + 1 << std::endl;
}`,
            caption: "Dua nilai dibaca berantai, dan dua cara pindah baris: \"\\n\" serta std::endl.",
          },
        },
        {
          kind: "quiz",
          question: "Apa perbedaan `std::endl` dengan `\"\\n\"`?",
          options: [
            "Tidak ada beda, keduanya identik",
            "std::endl memindah baris sekaligus memaksa flush buffer, sedangkan \"\\n\" hanya memindah baris",
            "\"\\n\" lebih lambat karena harus diterjemahkan saat runtime",
            "std::endl hanya boleh dipakai di baris terakhir program",
          ],
          answer: 1,
          explanation:
            "std::endl melakukan dua hal: menambah newline dan flush. Untuk kebanyakan kasus \"\\n\" sudah cukup dan tidak memaksa flush berulang-ulang.",
        },
        {
          kind: "code",
          title: "Sapa pembaca dengan iostream",
          prompt:
            "Lengkapi program: baca nama (satu kata) dan umur dari input, lalu cetak `Halo <nama>, umur <umur> tahun`. Ganti setiap `___`.",
          mode: "fill",
          template: `#include <iostream>
#include <string>

int main() {
    std::string nama;
    int umur;
    ___ >> nama >> umur;

    std::cout << "Halo " << nama << ", umur " << ___ << " tahun\\n";
}`,
          solution: `#include <iostream>
#include <string>

int main() {
    std::string nama;
    int umur;
    std::cin >> nama >> umur;

    std::cout << "Halo " << nama << ", umur " << umur << " tahun\\n";
}`,
          tests: [
            { stdin: "Sinta 17", expectedOutput: "Halo Sinta, umur 17 tahun" },
            { stdin: "Bagas 21", expectedOutput: "Halo Bagas, umur 21 tahun" },
            { stdin: "Dewi 30", expectedOutput: "Halo Dewi, umur 30 tahun", hidden: true },
          ],
          hints: [
            "Objek yang membaca masukan ada di namespace std, namanya pendek dan mirip kata cin.",
            "Nilai kedua yang dibaca dari input adalah umur; cukup tulis nama variabelnya di rantai cout.",
            "Jawabannya: std::cin pada baris pembaca, dan umur pada baris cetak.",
          ],
        },
      ],
    },
    {
      slug: "cpp-reference-vs-pointer",
      title: "Reference: Alias Tanpa Pointer",
      summary: "Alias variabel yang wajib diikat sejak lahir, dan perannya di parameter fungsi.",
      steps: [
        {
          kind: "theory",
          title: "&: nama kedua untuk variabel yang sama",
          body: "`int& ref = x;` membuat reference: nama kedua untuk variabel yang sama. `ref` bukan salinan dan bukan penunjuk terpisah; ia adalah `x` dengan nama lain, dan setiap penulisan lewat `ref` mengubah `x`. Reference wajib diinisialisasi saat dibuat, tidak bisa dipindah menjadi alias variabel lain, dan tidak mengenal null.\n\nPeran terbesarnya ada di parameter fungsi. Parameter biasa (by value) hanyalah salinan, sehingga fungsi yang mengubah parameternya tidak pernah mengubah argumen pemanggil. Parameter `int&` menjadi alias argumen aslinya: fungsi bisa mengubahnya, dan salinan besar pun terhindar. Kalau fungsi hanya membaca, kunci dengan `const std::string&` supaya tetap tanpa salinan tapi tidak bisa diubah.\n\nPointer tetap diperlukan untuk menyimpan alamat, bisa bernilai null, dan bisa digeser. Namun untuk dua kebutuhan tadi, mengubah argumen dan menghindari salinan, reference lebih ringkas dan tidak punya mode gagal: tidak ada reference lupa diinisialisasi atau menunjuk alamat kacau.",
          code: {
            language: "cpp",
            content: `#include <iostream>

void tukar(int& a, int& b) {
    int sementara = a;
    a = b;
    b = sementara;
}

int main() {
    int x = 3;
    int y = 9;
    tukar(x, y);
    std::cout << x << " " << y << "\\n";   // 9 3

    int& alias = x;
    alias = 100;
    std::cout << x << "\\n";               // 100
}`,
            caption: "Parameter reference membuat pertukaran terlihat oleh pemanggil; alias mengubah x lewat nama keduanya.",
          },
        },
        {
          kind: "quiz",
          question: "Pernyataan mana yang benar tentang reference di C++?",
          options: [
            "Reference boleh dibuat tanpa inisialisasi, lalu diikat belakangan",
            "Reference bisa dilepas dan diikat ke variabel lain setelah dibuat",
            "Reference wajib diinisialisasi saat dibuat dan menjadi alias permanen variabel itu",
            "Reference adalah pointer dengan tampilan berbeda, termasuk bisa bernilai null",
          ],
          answer: 2,
          explanation:
            "Reference tidak punya masa bebas: sekali diikat ke satu variabel, ia alias variabel itu selamanya, tanpa null dan tanpa pindah alamat.",
        },
        {
          kind: "code",
          title: "Tukar dua nilai lewat reference",
          prompt:
            "Lengkapi parameter fungsi `tukar` agar dua argumen pemanggil benar-benar bertukar nilainya. Ganti setiap `___`.",
          mode: "fill",
          template: `#include <iostream>

void tukar(___ a, ___ b) {
    int sementara = a;
    a = b;
    b = sementara;
}

int main() {
    int x, y;
    std::cin >> x >> y;
    tukar(x, y);
    std::cout << x << " " << y << "\\n";
}`,
          solution: `#include <iostream>

void tukar(int& a, int& b) {
    int sementara = a;
    a = b;
    b = sementara;
}

int main() {
    int x, y;
    std::cin >> x >> y;
    tukar(x, y);
    std::cout << x << " " << y << "\\n";
}`,
          tests: [
            { stdin: "3 9", expectedOutput: "9 3" },
            { stdin: "-1 5", expectedOutput: "5 -1" },
            { stdin: "7 7", expectedOutput: "7 7", hidden: true },
          ],
          hints: [
            "Tanpa tambahan apa pun, a dan b hanyalah salinan, dan pemanggil tidak melihat pertukarannya.",
            "Tanda ampersand pada tipe parameter membuatnya menjadi alias argumen pemanggil.",
            "Jawabannya: int& untuk kedua parameter.",
          ],
        },
      ],
    },
    {
      slug: "cpp-auto-deduction",
      title: "auto: Tipe Disimpulkan Compiler",
      summary: "Deklarasi dengan tipe yang disimpulkan dari inisialisernya, beserta aturan mainnya.",
      steps: [
        {
          kind: "theory",
          title: "auto menyimpulkan tipe dari sisi kanan",
          body: "`auto` menyuruh compiler menuliskan tipe variabel dari inisialisernya: `auto x = 5;` menjadi `int`, `auto y = 3.14;` menjadi `double`, `auto s = std::string(\"kode\");` menjadi `std::string`. Variabel auto wajib punya initializer; deklarasi tanpa nilai ditolak compiler.\n\nTipe disimpulkan dari ekspresi, bukan dari nilai yang kamu harapkan. `auto hasil = 7 / 2;` menghasilkan `int` bernilai 3, karena kedua operandnya `int`; `auto` hanya mencatat kenyataan, tidak mengubah aturan pembagian. Selain itu, `auto` melucuti referensi dan const tingkat atas secara bawaan. Perlu alias atau kemampuan mengubah? Tulis eksplisit: `auto&` atau `const auto&`.\n\nKapan dipakai: ketika tipe panjang dan jelas dari konteks, terutama iterator dan tipe pustaka yang muncul di modul STL, `auto` menghemat baris tanpa menyembunyikan apa pun. Untuk angka sederhana, menulis `int` atau `double` kerap lebih terbaca. `auto` adalah alat kenyamanan, bukan kewajiban.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <string>

int main() {
    auto jumlah = 5;                   // int
    auto berat = 68.5;                 // double
    auto bahasa = std::string("C++");  // std::string

    auto hasil = 7 / 2;                // int: kedua operand int
    std::cout << hasil << "\\n";         // 3

    auto total = jumlah * berat;       // int * double menghasilkan double
    std::cout << total << "\\n";         // 342.5
}`,
            caption: "auto mencatat tipe hasil ekspresi; 7 / 2 tetap pembagian bulat.",
          },
        },
        {
          kind: "quiz",
          question: "Apa tipe dan nilai dari `auto hasil = 7 / 2;`?",
          options: ["double, 3.5", "int, 3", "int, 4 karena hasilnya dibulatkan", "double, 3.0"],
          answer: 1,
          explanation:
            "Pembagian dua int adalah pembagian bulat: 7 / 2 sama dengan 3. auto menyimpulkan int dari ekspresi itu, bukan mengubah aturan pembagiannya.",
        },
        {
          kind: "code",
          title: "Total belanja dengan auto",
          prompt:
            "Lengkapi deklarasi `total` dengan satu kata kunci yang menyimpulkan tipe dari hasil perkaliannya, lalu jalankan program.",
          mode: "fill",
          template: `#include <iostream>

int main() {
    double harga;
    int jumlah;
    std::cin >> harga >> jumlah;

    ___ total = harga * jumlah;
    std::cout << "Total: " << total << "\\n";
}`,
          solution: `#include <iostream>

int main() {
    double harga;
    int jumlah;
    std::cin >> harga >> jumlah;

    auto total = harga * jumlah;
    std::cout << "Total: " << total << "\\n";
}`,
          tests: [
            { stdin: "1500.5 5", expectedOutput: "Total: 7502.5" },
            { stdin: "2500 2", expectedOutput: "Total: 5000" },
            { stdin: "999.5 4", expectedOutput: "Total: 3998", hidden: true },
          ],
          hints: [
            "harga bertipe double dikali jumlah bertipe int; hasilnya double, dan kamu tidak perlu menulisnya sendiri.",
            "Cukup satu kata kunci C++ yang menyuruh compiler menyimpulkan tipe.",
            "Jawabannya: auto.",
          ],
        },
      ],
    },
    {
      slug: "cpp-range-for",
      title: "Range-based for",
      summary: "Iterasi seluruh isi array tanpa indeks, dan kapan butuh reference.",
      steps: [
        {
          kind: "theory",
          title: "for (elemen : kumpulan)",
          body: "Range-based for memproses setiap elemen sebuah kumpulan tanpa variabel indeks: `for (int x : data)`. Tidak ada batas yang bisa salah tulis, tidak ada `i++` yang kelewat, dan array C-style biasa pun didukung. Cara bacanya: untuk setiap x di dalam data.\n\nSecara bawaan `x` adalah salinan tiap elemen. Kalau tujuannya mengubah isi kumpulan, deklarasikan `x` sebagai reference: `for (int& x : data)`. Kalau hanya membaca dan elemennya besar, seperti `std::string`, hindari salinan dengan `for (const auto& x : data)`; kebiasaan ini akan terasa wajib saat masuk ke `std::vector` di modul berikutnya.\n\nLoop ini tidak memberi tahu posisi elemen. Ketika indeks memang dibutuhkan, misalnya untuk membandingkan elemen tetangga, pakai for klasik dengan batas eksplisit. Range-based for adalah alat untuk kasus paling umum: proses semua elemen, dari awal sampai akhir.",
          code: {
            language: "cpp",
            content: `#include <iostream>

int main() {
    int suhu[5] {30, 32, 29, 31, 33};

    int total = 0;
    for (int x : suhu) {
        total += x;              // membaca: salinan tidak masalah
    }

    for (int& x : suhu) {
        x = x + 1;               // mengubah: butuh reference
    }

    for (int x : suhu) {
        std::cout << x << " ";   // 31 32 30 32 34
    }
    std::cout << "\\n";
}`,
            caption: "Tiga loop untuk tiga maksud: membaca, mengubah, dan mencetak.",
          },
        },
        {
          kind: "quiz",
          question: "Bagaimana range-based for dibuat supaya benar-benar MENGUBAH isi array?",
          options: [
            "Cukup `for (int x : data)` lalu ubah x di dalam loop",
            "Deklarasi variabel loop sebagai reference: `for (int& x : data)`",
            "Tambahkan kata kunci `static` pada variabel loop",
            "Range-based for memang tidak bisa mengubah array",
          ],
          answer: 1,
          explanation:
            "Tanpa &, x hanyalah salinan elemen; mengubahnya tidak pernah menyentuh array. Reference membuat x menjadi alias elemen aslinya.",
        },
        {
          kind: "code",
          title: "Pengganda yang tidak bekerja",
          prompt:
            "Program ini seharusnya melipatgandakan setiap nilai array dengan dua, lalu mencetaknya satu per baris. Sekarang keluarannya masih nilai asli. Perbaiki satu kesalahannya.",
          mode: "fix",
          template: `#include <iostream>

int main() {
    int nilai[5];
    for (int i = 0; i < 5; i++) {
        std::cin >> nilai[i];
    }

    for (int x : nilai) {
        x = x * 2;
    }

    for (int x : nilai) {
        std::cout << x << "\\n";
    }
}`,
          solution: `#include <iostream>

int main() {
    int nilai[5];
    for (int i = 0; i < 5; i++) {
        std::cin >> nilai[i];
    }

    for (int& x : nilai) {
        x = x * 2;
    }

    for (int x : nilai) {
        std::cout << x << "\\n";
    }
}`,
          tests: [
            { stdin: "1 2 3 4 5", expectedOutput: "2\n4\n6\n8\n10" },
            { stdin: "0 1 0 1 0", expectedOutput: "0\n2\n0\n2\n0" },
            { stdin: "-3 5 -1 2 4", expectedOutput: "-6\n10\n-2\n4\n8", hidden: true },
          ],
          hints: [
            "Coba jalankan dengan input 1 2 3 4 5: hasilnya masih nilai asli, artinya penggandaan tidak pernah menyentuh array.",
            "Di loop tengah, x hanyalah salinan. Beri satu tanda pada tipenya agar x menjadi alias elemen array.",
            "Ubah deklarasi loop tengah menjadi for (int& x : nilai).",
          ],
        },
      ],
    },
    {
      slug: "cpp-namespace-using",
      title: "namespace dan using",
      summary: "Mengelompokkan nama agar tidak bentrok, dan memakai using secara terukur.",
      steps: [
        {
          kind: "theory",
          title: "Ruang nama: alamat lengkap setiap nama",
          body: "Namespace mengelompokkan nama di dalam ruangnya sendiri supaya tidak bertabrakan. Pustaka standar menaruh ribuan namanya di namespace `std`, dan itu sebabnya `cout` dan `cin` ditulis lengkap: `std::cout`, `std::cin`. Proyek besar melakukan hal yang sama: `namespace kasir { ... }` membungkus seluruh kode modul kasir di balik satu alamat.\n\n`using namespace std;` menyuntik seluruh isi `std` ke ruang nama yang sedang aktif. Di latihan sepuluh baris ini praktis dan sering dipakai; di kode produksi ia menimbulkan risiko nyata: nama apa pun yang kamu buat bisa bentrok dengan nama `std` yang tak terlihat, dan pesan errornya sulit dibaca. Di dalam header file, praktik ini hampir selalu dilarang karena setiap file yang menginclude ikut menelan semua nama itu.\n\nJalan tengahnya adalah using declaration yang tertarget: `using std::cout;` hanya membawa satu nama ke scope itu. Kebiasaan yang paling sering dijaga komunitas: tulis `std::` secara eksplisit, lalu gunakan using declaration untuk satu dua nama yang benar-benar dipakai terus di satu fungsi.",
          code: {
            language: "cpp",
            content: `#include <iostream>

namespace kasir {
    const double DISKON = 0.1;

    double potongan(double total) {
        return total * DISKON;
    }
}

int main() {
    using std::cout;   // satu nama, bukan seluruh std

    cout << kasir::potongan(200000) << "\\n";   // 20000
}`,
            caption: "Nama dibungkus namespace dan dipanggil dengan alamat lengkap: kasir::potongan.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa `using namespace std;` di dalam header file dianggap berbahaya?",
          options: [
            "Karena membuat proses kompilasi menjadi sangat lambat",
            "Karena seluruh nama std ikut disuntik ke setiap file yang menginclude header, memperbesar peluang tabrakan nama",
            "Karena melanggar standar C++, sehingga program tidak bisa dikompilasi",
            "Karena ukuran file header menjadi besar saat diunduh",
          ],
          answer: 1,
          explanation:
            "Header bisa diinclude oleh banyak file; setiap file itu mewarisi seluruh nama std tanpa memintanya. Tabrakan nama pun muncul di tempat yang tidak terduga.",
        },
      ],
    },
    {
      slug: "cpp-string-dasar",
      title: "std::string: Teks yang Mengurus Diri Sendiri",
      summary: "Teks yang mengurus memorinya sendiri: gabung, ukur, dan bandingkan isinya.",
      steps: [
        {
          kind: "theory",
          title: "Beda besar dari char*",
          body: "`std::string` dari header `<string>` mengurus teks dari ujung ke ujung: menyimpan, tumbuh saat ditambah, dan mengembalikan memorinya sendiri saat selesai. Panjangnya selalu bisa ditanya lewat `size()`, digabung dengan `+`, dan diakses per karakter lewat kurung siku: `s[0]`, `s[1]`, dan seterusnya.\n\nBandingkan dengan `char*` warisan C: kamu memegang alamat buffer, menghitung panjang dengan `strlen`, menggabung dengan `strcat` yang bisa meluber bila buffer kurang, dan membandingkan dengan `strcmp` karena `==` pada pointer hanya membandingkan alamat. Di `std::string`, operator `==` dibuat membandingkan isi karakter demi karakter, dan penggabungan ditulis `nama = depan + belakang;`.\n\nMembaca input: `std::cin >> s;` mengambil satu kata, berhenti di spasi. Untuk satu baris penuh termasuk spasinya, pakai `std::getline(std::cin, s);`. Dua pola ini akan terus dipakai di modul String dan Stream.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <string>

int main() {
    std::string depan = "Kode";
    std::string belakang = "Kita";

    std::string nama = depan + belakang;
    std::cout << nama << "\\n";         // KodeKita
    std::cout << nama.size() << "\\n";  // 8

    std::string tebakan;
    std::cin >> tebakan;
    if (tebakan == nama) {
        std::cout << "benar\\n";
    } else {
        std::cout << "salah\\n";
    }
}`,
            caption: "+ menggabungkan isi, == membandingkan isi, size() menghitung isi.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang dilakukan operator `==` ketika kedua sisi bertipe `std::string`?",
          options: [
            "Membandingkan alamat memori keduanya",
            "Membandingkan isi keduanya karakter demi karakter",
            "Hanya membandingkan panjang keduanya",
            "Selalu error kompilasi, harus memakai strcmp",
          ],
          answer: 1,
          explanation:
            "Pada char*, == membandingkan alamat dan perbandingan isi memakai strcmp. Pada std::string, operator == dibebanlintaskan untuk membandingkan isi.",
        },
        {
          kind: "code",
          title: "Gabung dan ukur",
          prompt:
            "Lengkapi program penggabung kata: gabungkan dua kata tanpa spasi, lalu cetak panjang hasilnya dengan method yang tepat.",
          mode: "fill",
          template: `#include <iostream>
#include <string>

int main() {
    std::string kata1, kata2;
    std::cin >> kata1 >> kata2;

    std::string gabung = ___;
    std::cout << gabung << "\\n";
    std::cout << "panjang " << gabung.___() << "\\n";
}`,
          solution: `#include <iostream>
#include <string>

int main() {
    std::string kata1, kata2;
    std::cin >> kata1 >> kata2;

    std::string gabung = kata1 + kata2;
    std::cout << gabung << "\\n";
    std::cout << "panjang " << gabung.size() << "\\n";
}`,
          tests: [
            { stdin: "kode kita", expectedOutput: "kodekita\npanjang 8" },
            { stdin: "belajar cpp", expectedOutput: "belajarcpp\npanjang 10" },
            { stdin: "a b", expectedOutput: "ab\npanjang 2", hidden: true },
          ],
          hints: [
            "Operator + bisa menggabungkan dua std::string menjadi satu.",
            "Method milik std::string yang menghitung jumlah karakter namanya size.",
            "Jawabannya: kata1 + kata2 dan gabung.size().",
          ],
        },
      ],
    },
    {
      slug: "cpp-printf-ke-cout",
      title: "Dari printf ke cout",
      summary: "Kenapa specifier yang salah bisa lolos di printf, dan bagaimana cout menutup celahnya.",
      steps: [
        {
          kind: "theory",
          title: "Format specifier: beban yang hilang",
          body: "Dua baris `printf(\"%d\", total);` dengan `total` bertipe `double` adalah masalah khas gaya C: compiler tidak menghubungkan `%d` dengan tipe argumen, sehingga kesalahan itu lolos kompilasi dan perilakunya tidak terdefinisi saat jalan. `scanf` menambah beban lain: setiap argumen harus berupa alamat, `scanf(\"%d\", &x)`; lupa `&` berarti menulis ke alamat sembarangan.\n\n`cout` dan `cin` meniadakan kedua kelas kesalahan itu. Perilaku operator dipilih dari tipe operand saat kompilasi, jadi tidak ada specifier yang bisa tertukar, dan `cin` menerima variabel langsung tanpa `&`. Format desimal tetap bisa dikendalikan lewat manipulator: `std::fixed` bersama `std::setprecision(2)` dari header `<iomanip>` mencetak dua angka di belakang koma, dan keduanya menempel pada `cout` sampai diubah.\n\n`printf` tidak dilarang; banyak programmer tetap memakainya karena formatnya ringkas. Aturan praktisnya: pilih satu gaya untuk satu alur keluaran, jangan mencampur `printf` dan `cout` pada urutan cetak yang saling bergantung karena buffer keduanya tidak selalu sinkron. Saat kecepatan I/O penting, idiom yang lazim adalah `std::ios::sync_with_stdio(false);` dan `std::cin.tie(nullptr);` di awal `main`.",
          code: {
            language: "cpp",
            content: `#include <iomanip>
#include <iostream>

int main() {
    double total = 1234.5;

    std::cout << total << "\\n";                                       // 1234.5
    std::cout << std::fixed << std::setprecision(2) << total << "\\n"; // 1234.50
    std::cout << total << "\\n";                                       // 1234.50, fixed masih menempel
}`,
            caption: "Manipulator menempel pada stream: setelah std::fixed, semua cetakan double mengikutinya.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang berisiko terjadi pada `scanf(\"%d\", x)` yang lupa tanda &?",
          options: [
            "Program berhenti dengan pesan yang jelas dari compiler",
            "Compiler menambahkan & secara otomatis",
            "scanf menganggap isi x sebagai alamat dan menulis ke alamat sembarangan; perilakunya tidak terdefinisi",
            "Nilai x otomatis diisi nol",
          ],
          answer: 2,
          explanation:
            "scanf membutuhkan alamat tujuan. Tanpa &, yang terkirim adalah isi x yang dibaca sebagai alamat; menulis ke sana bisa merusak memori apa pun.",
        },
        {
          kind: "code",
          title: "Total dengan dua desimal",
          prompt:
            "Program ini mencetak total harga lewat printf, tapi formatnya salah untuk double sehingga hasilnya kacau. Ganti baris cetaknya dengan cout dan manipulator yang tepat sampai tes lulus.",
          mode: "fix",
          template: `#include <cstdio>
#include <iomanip>
#include <iostream>

int main() {
    double harga;
    int jumlah;
    std::cin >> harga >> jumlah;

    double total = harga * jumlah;
    printf("Total: %d\\n", total);
}`,
          solution: `#include <cstdio>
#include <iomanip>
#include <iostream>

int main() {
    double harga;
    int jumlah;
    std::cin >> harga >> jumlah;

    double total = harga * jumlah;
    std::cout << "Total: " << std::fixed << std::setprecision(2) << total << "\\n";
}`,
          tests: [
            { stdin: "123.45 10", expectedOutput: "Total: 1234.50" },
            { stdin: "99.5 2", expectedOutput: "Total: 199.00" },
            { stdin: "0.1 3", expectedOutput: "Total: 0.30", hidden: true },
          ],
          hints: [
            "%d adalah specifier untuk int, sedangkan total bertipe double; itulah sumber keluaran kacau.",
            "Versi printf yang benar adalah %.2f, tapi latihan ini meminta versi cout.",
            "Tulis: std::cout << \"Total: \" << std::fixed << std::setprecision(2) << total << \"\\n\";",
          ],
        },
      ],
    },
    {
      slug: "cpp-const-constexpr",
      title: "const dan constexpr",
      summary: "Janji baca-saja versus janji dihitung saat kompilasi, dan kapan memakai yang mana.",
      steps: [
        {
          kind: "theory",
          title: "Dua kata kunci, dua janji",
          body: "`const` berarti tidak bisa diubah setelah dibuat: `const double PAJAK = 0.11;`, dan setiap upaya menulisnya ulang ditolak compiler. const juga menempel pada referensi dan parameter: fungsi yang menerima `const std::string& teks` menjanjikan tidak mengubah `teks`, sekaligus bekerja tanpa salinan. Janji ini menular: objek const tidak boleh diberikan ke fungsi yang menuntut non-const.\n\n`constexpr` berjanji lebih jauh: nilainya sudah selesai dihitung saat kompilasi. `constexpr int UKURAN = 8;` sah dipakai sebagai ukuran array `int data[UKURAN];`, dan ekspresi constexpr bisa dihitung compiler, bukan di runtime. Konstanta fisik, ukuran tetap, dan faktor konversi adalah kandidat alaminya.\n\nPembagian kerjanya sederhana: nilai yang benar-benar tetap dan bisa dihitung sebelum program jalan, pakai `constexpr`. Nilai yang bersifat baca-saja tapi baru diketahui saat jalan, misalnya hasil input, pakai `const`. Keduanya menggusur angka ajaib: `0.11` yang tersebar di sepuluh tempat diganti satu nama bermakna.",
          code: {
            language: "cpp",
            content: `#include <iostream>

constexpr int UKURAN = 5;
constexpr double PI = 3.14159;

int main() {
    double jari[UKURAN] {1.0, 2.0, 3.0, 4.0, 5.0};

    for (double r : jari) {
        double luas = PI * r * r;
        std::cout << luas << "\\n";
    }
}`,
            caption: "UKURAN dipakai sebagai panjang array; itu hanya sah karena nilainya diketahui saat kompilasi.",
          },
        },
        {
          kind: "quiz",
          question: "Mana pernyataan yang benar tentang `constexpr`?",
          options: [
            "constexpr hanya bisa dipakai untuk tipe int",
            "constexpr sama saja dengan const, bedanya hanya gaya penulisan",
            "constexpr menjanjikan nilai diketahui saat kompilasi, sehingga sah dipakai sebagai ukuran array",
            "constexpr nilainya baru terisi saat program pertama kali berjalan",
          ],
          answer: 2,
          explanation:
            "const menjamin nilai dibaca saja; constexpr menjamin nilai sudah ada sebelum program jalan. Ukuran array membutuhkan yang kedua.",
        },
      ],
    },
    {
      slug: "cpp-initializer-braces",
      title: "Inisialisasi dengan Kurung Kurawal",
      summary: "Satu bentuk inisialisasi untuk semua tipe, dengan penolak konversi penghilang data.",
      steps: [
        {
          kind: "theory",
          title: "{}: bentuk seragam sejak C++11",
          body: "Sejak C++11, bentuk inisialisasi yang dianjurkan memakai kurung kurawal: `int x{5};`, `double y{2.5};`, `std::string s{\"kode\"};`, `int arr[3]{1, 2, 3};`. Satu sintaks untuk semua tipe, termasuk container STL di modul berikutnya, sehingga tidak ada lagi perdebatan `=` versus `()` per tipe.\n\nKurawal punya jaring pengaman yang tidak dimiliki bentuk lain: ia melarang narrowing, yaitu konversi yang menghilangkan data. `int x{3.9};` tidak dikompilasi karena `3.9` tidak muat di `int` tanpa dipotong; bentuk lama `int x = 3.9;` diam-diam memotong menjadi 3 dan menyimpan bug untuk besok.\n\nKurawal kosong, `{}`, berarti zero-initialize. `int frek[26]{};` mengisi seluruh array dengan nol tanpa loop, sesuatu yang pada array lokal tanpa inisialisasi tidak dijamin isinya. Pengisian parsial juga berlaku: `int a[5]{1, 2};` membuat dua elemen pertama bernilai 1 dan 2, sisanya nol.",
          code: {
            language: "cpp",
            content: `#include <iostream>

int main() {
    int terjawab{7};
    double skor{92.5};
    int frek[5]{1, 0, 2};   // dua elemen terakhir otomatis nol

    int total = 0;
    for (int f : frek) {
        total += f;
    }

    std::cout << terjawab << " " << skor << " " << total << "\\n";   // 7 92.5 3
}`,
            caption: "Kurawal untuk semua tipe; pengisian parsial menyisakan nol untuk elemen yang tidak disebut.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi pada `int x{3.9};`?",
          options: [
            "x berisi 3 karena dipotong",
            "x berisi 3.9 karena dikonversi otomatis",
            "x berisi 4 karena dibulatkan ke atas",
            "Error kompilasi: kurawal melarang konversi yang menghilangkan data",
          ],
          answer: 3,
          explanation:
            "Inisialisasi kurawal menolak narrowing. Bentuk lama int x = 3.9; memotong menjadi 3 secara diam-diam; bentuk kurawal menangkapnya saat kompilasi.",
        },
        {
          kind: "code",
          title: "Frekuensi huruf",
          prompt:
            "Lengkapi deklarasi array `frekuensi` agar seluruh elemennya dimulai dari nol dengan satu bentuk inisialisasi. Program membaca 5 huruf kecil lalu mencetak kemunculan terbanyak.",
          mode: "fill",
          template: `#include <iostream>

int main() {
    int frekuensi[26] ___;   // semua elemen dimulai dari nol

    char huruf;
    for (int i = 0; i < 5; i++) {
        std::cin >> huruf;
        frekuensi[huruf - 'a'] += 1;
    }

    int maks = 0;
    for (int f : frekuensi) {
        if (f > maks) {
            maks = f;
        }
    }

    std::cout << maks << "\\n";
}`,
          solution: `#include <iostream>

int main() {
    int frekuensi[26] {};   // semua elemen dimulai dari nol

    char huruf;
    for (int i = 0; i < 5; i++) {
        std::cin >> huruf;
        frekuensi[huruf - 'a'] += 1;
    }

    int maks = 0;
    for (int f : frekuensi) {
        if (f > maks) {
            maks = f;
        }
    }

    std::cout << maks << "\\n";
}`,
          tests: [
            { stdin: "a b a c a", expectedOutput: "3" },
            { stdin: "z z y x w", expectedOutput: "2" },
            { stdin: "q q q q q", expectedOutput: "5", hidden: true },
          ],
          hints: [
            "Tanpa inisialisasi, isi array lokal tidak dijamin; kita butuh seluruh elemen bernilai nol.",
            "Kurung kurawal kosong setelah deklarasi array mengisi semua elemen dengan nol.",
            "Jawabannya: {} pada baris deklarasi frekuensi.",
          ],
        },
      ],
    },
    {
      slug: "cpp-latihan-modern",
      title: "Latihan Modul: Laporan Array",
      summary: "Rangkai iostream, reference, auto, range-for, dan kurawal dalam satu program.",
      steps: [
        {
          kind: "theory",
          title: "Idiom yang sudah kamu pegang",
          body: "Sampai di sini kamu punya perangkat dasar C++ modern: I/O bertipe aman lewat `iostream`, reference untuk argumen yang diubah fungsi, `auto` untuk tipe yang disimpulkan, range-based for, `std::string`, `const` dan `constexpr`, serta kurawal anti narrowing.\n\nLatihan penutup modul menyusunnya menjadi satu program pembaca array. Perhatikan pemisahan tugasnya: satu loop khusus mengisi array dari input (butuh reference agar `cin` menulis ke elemen asli), loop berikutnya menghitung. Membaca dan menghitung dipisah karena keduanya berubah dengan alasan yang berbeda.\n\nPola dua loop ini akan terus muncul: isi dulu sampai selesai, baru olah. Mencampur keduanya dalam satu loop masih bekerja untuk kasus sederhana, tapi pecah saat perhitungan membutuhkan data yang belum selesai dibaca.",
          code: {
            language: "cpp",
            content: `#include <iostream>

int main() {
    int data[4]{};

    for (int& x : data) {    // isi: reference agar cin menulis ke elemen asli
        std::cin >> x;
    }

    int total = 0;
    for (int x : data) {     // olah: baca saja
        total += x;
    }
}`,
            caption: "Dua loop, dua tugas, dua jenis deklarasi variabel loop.",
          },
        },
        {
          kind: "code",
          title: "Baca, jumlahkan, cari maksimum",
          prompt:
            "Lengkapi deklarasi variabel loop pembaca input agar menjadi alias elemen array, bukan salinan. Program membaca 4 bilangan lalu mencetak total dan maksimumnya.",
          mode: "fill",
          template: `#include <iostream>

int main() {
    int data[4]{};

    for (___ x : data) {
        std::cin >> x;
    }

    int total = 0;
    int maks = data[0];
    for (int x : data) {
        total += x;
        if (x > maks) {
            maks = x;
        }
    }

    std::cout << "total " << total << "\\n";
    std::cout << "maks " << maks << "\\n";
}`,
          solution: `#include <iostream>

int main() {
    int data[4]{};

    for (int& x : data) {
        std::cin >> x;
    }

    int total = 0;
    int maks = data[0];
    for (int x : data) {
        total += x;
        if (x > maks) {
            maks = x;
        }
    }

    std::cout << "total " << total << "\\n";
    std::cout << "maks " << maks << "\\n";
}`,
          tests: [
            { stdin: "3 9 5 1", expectedOutput: "total 18\nmaks 9" },
            { stdin: "-4 -1 -7 -2", expectedOutput: "total -14\nmaks -1" },
            { stdin: "0 0 0 0", expectedOutput: "total 0\nmaks 0", hidden: true },
          ],
          hints: [
            "Jalankan dulu: kalau yang kamu ketik tidak masuk ke array, berarti variabel loop itu hanya menulis ke salinannya.",
            "Variabel loop harus reference agar cin mengisi elemen array langsung.",
            "Jawabannya int&; auto& juga sah karena tipenya sama persis.",
          ],
        },
      ],
    },
    // ==================== MODUL 1: Class dan Object ====================
    {
      slug: "cpp-class-dasar",
      title: "Class Pertama dan Access Specifier",
      summary: "Bundel data dan perilaku, lalu atur siapa yang boleh menyentuhnya.",
      steps: [
        {
          kind: "theory",
          title: "class: data dan perilaku dalam satu paket",
          body: "`class` menggabungkan data (member) dan fungsi yang mengelola data itu (method) dalam satu tipe. Deklarasinya ditutup titik koma setelah kurung kurawal: `class Suhu { ... };`; lupa titik koma ini adalah error klasik C++. Objek dibuat dengan `Suhu s;`, dan anggotanya diakses lewat titik: `s.nilai`, `s.keFahrenheit()`.\n\nAccess specifier mengatur siapa yang boleh menyentuh: `public:` membuka member untuk semua kode, `private:` menguncinya hanya untuk kode di dalam class itu sendiri. Member class yang tidak diberi label apa pun dianggap private sejak awal, sampai label berikutnya membuka kunci. Di `struct` aturannya terbalik: tanpa label berarti public.\n\nKonvensi yang dipakai hampir semua kode C++: data dibuat private, method yang menjadi interface dibuat public. Manfaatnya baru terasa saat class berkembang: pemakai tidak bisa menyetel keadaan tak sah seperti `suhu.nilai = -999;`, dan pembuat class bebas merombak isi internal tanpa memecah kode pemakai, sebab satu-satunya pintu adalah interface yang tidak berubah.",
          code: {
            language: "cpp",
            content: `#include <iostream>

class Suhu {
  public:                    // interface: terbuka untuk semua
    double keFahrenheit() {
        return nilai * 1.8 + 32;
    }

  private:                   // internal: hanya untuk class ini
    double nilai;
};

int main() {
    Suhu s;
    // s.nilai = 25;          // ditolak: nilai berada setelah private:
}`,
            caption: "Member dianggap private sejak awal class, lalu mengikuti label terakhir di atasnya.",
          },
        },
        {
          kind: "quiz",
          question: "Di dalam `class`, member yang tidak diberi label access specifier apa pun secara bawaan bersifat?",
          options: ["public", "private", "protected", "tergantung compiler"],
          answer: 1,
          explanation:
            "Class bawaannya private, struct bawaannya public. Itulah perbedaan paling mendasar antara keduanya selain kebiasaan pemakaian.",
        },
        {
          kind: "code",
          title: "Buka kunci yang terkunci",
          prompt:
            "Program ini tidak bisa dikompilasi karena main menyentuh member class. Untuk latihan ini biarkan datanya terbuka: tambahkan SATU access specifier di posisi yang tepat agar `nilai` dan `keFahrenheit` bisa dipakai dari luar.",
          mode: "fix",
          template: `#include <iostream>

class Suhu {
    double nilai;

    double keFahrenheit() {
        return nilai * 1.8 + 32;
    }
};

int main() {
    Suhu s;
    std::cin >> s.nilai;
    std::cout << s.keFahrenheit() << "\\n";
}`,
          solution: `#include <iostream>

class Suhu {
  public:
    double nilai;

    double keFahrenheit() {
        return nilai * 1.8 + 32;
    }
};

int main() {
    Suhu s;
    std::cin >> s.nilai;
    std::cout << s.keFahrenheit() << "\\n";
}`,
          tests: [
            { stdin: "25", expectedOutput: "77" },
            { stdin: "100", expectedOutput: "212" },
            { stdin: "0", expectedOutput: "32", hidden: true },
          ],
          hints: [
            "Pesan error kompilasi menunjuk baris s.nilai: member itu dianggap private oleh compiler.",
            "Member class tanpa label apa pun dianggap private sampai ada label yang membukanya.",
            "Tambahkan public: sebelum double nilai; semua member setelahnya ikut terbuka.",
          ],
        },
      ],
    },
    {
      slug: "cpp-constructor-initlist",
      title: "Constructor dan Initializer List",
      summary: "Objek lahir utuh lewat constructor, diisi lewat member initializer list.",
      steps: [
        {
          kind: "theory",
          title: "Constructor: objek tidak boleh lahir setengah jadi",
          body: "Constructor adalah method bernama sama dengan class-nya, tanpa tipe kembalian, yang berjalan otomatis saat objek dibuat. Dengan constructor, tidak ada objek lahir setengah jadi: `Produk p{\"Kopi\", 42};` langsung utuh, dan pemakai tidak bisa lupa mengisi.\n\nCara mengisi member yang disarankan adalah member initializer list, daftar setelah titik dua: `Produk(std::string n, int s) : nama(n), stok(s) {}`. Di situ member benar-benar diinisialisasi dengan nilainya sebelum badan constructor berjalan. Mengisi lewat assignment di badan (`nama = n;`) menempuh dua langkah: inisialisasi default lalu penimpaan. Untuk member `const` dan reference, langkah penimpaan itu tidak tersedia, sehingga initializer list bukan soal gaya melainkan keharusan.\n\nConstructor tanpa parameter disebut default constructor. Compiler membuatkannya otomatis hanya selama kamu tidak menulis constructor apa pun. Begitu `Produk(std::string, int)` ada, baris `Produk p;` ditolak, dan kamu harus menambahkan default constructor sendiri (dibahas di lesson overloading).",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <string>

class Produk {
  public:
    std::string nama;
    int stok;

    Produk(std::string n, int s) : nama(n), stok(s) {}
};

int main() {
    Produk p{"Kopi", 42};
    std::cout << p.nama << " stok " << p.stok << "\\n";
}`,
            caption: "Initializer list mengisi nama dan stok sebelum badan constructor, yang di sini kosong, berjalan.",
          },
        },
        {
          kind: "quiz",
          question: "Kapan member initializer list menjadi WAJIB, bukan sekadar gaya?",
          options: [
            "Saat member bertipe int",
            "Saat member bertipe const atau reference, karena keduanya tidak bisa diisi lewat assignment",
            "Saat constructor punya lebih dari satu parameter",
            "Tidak pernah wajib, selalu hanya masalah gaya",
          ],
          answer: 1,
          explanation:
            "const dan reference harus diinisialisasi sekali sejak lahir dan tidak bisa ditimpa. Initializer list adalah satu-satunya pintu untuk itu.",
        },
        {
          kind: "code",
          title: "Produk dengan constructor",
          prompt:
            "Lengkapi constructor `Produk` dengan member initializer list, lalu periksa main: objek sudah dibuat dengan benar, jadi fokus pada satu tanda baca yang hilang.",
          mode: "fill",
          template: `#include <iostream>
#include <string>

class Produk {
  public:
    std::string nama;
    int harga;

    Produk(std::string n, int h) ___ nama(n), harga(h) {}
};

int main() {
    std::string nama;
    int harga;
    std::cin >> nama >> harga;

    Produk p(nama, harga);
    std::cout << p.nama << " Rp" << p.harga << "\\n";
}`,
          solution: `#include <iostream>
#include <string>

class Produk {
  public:
    std::string nama;
    int harga;

    Produk(std::string n, int h) : nama(n), harga(h) {}
};

int main() {
    std::string nama;
    int harga;
    std::cin >> nama >> harga;

    Produk p(nama, harga);
    std::cout << p.nama << " Rp" << p.harga << "\\n";
}`,
          tests: [
            { stdin: "Kopi 15000", expectedOutput: "Kopi Rp15000" },
            { stdin: "Roti 12000", expectedOutput: "Roti Rp12000" },
            { stdin: "Teh 5000", expectedOutput: "Teh Rp5000", hidden: true },
          ],
          hints: [
            "Pemisah antara header constructor dan daftar member yang diinisialisasi adalah satu tanda baca.",
            "Bentuknya: Nama(tipe a) : member(a) {}",
            "Jawabannya: titik dua, menjadi Produk(std::string n, int h) : nama(n), harga(h) {}",
          ],
        },
      ],
    },
    {
      slug: "cpp-destructor",
      title: "Destructor: Saat Objek Berakhir",
      summary: "Method beres-beres yang berjalan sendiri saat objek keluar dari scope.",
      steps: [
        {
          kind: "theory",
          title: "~: beres-beres otomatis",
          body: "Destructor ditulis `~Nama()`, tanpa parameter dan tanpa tipe kembalian, dan hanya boleh satu per class. Kamu hampir tidak pernah memanggilnya sendiri: compiler memanggilnya otomatis pada saat hidup objek berakhir, misalnya ketika objek lokal keluar dari scope-nya atau ketika objek di-`delete`.\n\nUrutannya terbalik dari kelahiran. Objek yang dibuat terakhir dihancurkan pertama, seperti tumpukan yang dibongkar dari puncak. Fungsi yang membuat `a` lalu `b` akan menjalankan destructor `b` lebih dulu saat selesai, baru `a`. Urutan yang pasti ini penting: resource yang dibuka belakangan kadang bergantung pada yang dibuka lebih awal.\n\nKegunaan destructor adalah beres-beres: menutup file, membebaskan memori, memutus koneksi, atau sekadar mencatat siklus hidup. Prinsip besar di baliknya bernama RAII, resource terikat pada hidup objek, dan akan menjadi tulang punggung modul Memori dan Smart Pointer. Untuk class sederhana yang membernya hanya `int` dan `std::string`, destructor bawaan sudah benar dan kamu tidak perlu menulis apa-apa.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <string>

class Log {
  public:
    std::string nama;

    Log(std::string n) : nama(n) {
        std::cout << nama << " dibuat\\n";
    }
    ~Log() {
        std::cout << nama << " dihancurkan\\n";
    }
};

int main() {
    Log a{"pertama"};
    Log b{"kedua"};
    std::cout << "isi main\\n";
}
// keluaran: pertama dibuat, kedua dibuat, isi main,
// kedua dihancurkan, pertama dihancurkan`,
            caption: "Yang dibangun terakhir dibongkar lebih dulu.",
          },
        },
        {
          kind: "quiz",
          question: "main membuat objek a lalu b, keduanya punya destructor. Apa urutan eksekusi destructor saat main selesai?",
          options: [
            "a lebih dulu, karena dibuat lebih awal",
            "b lebih dulu, lalu a: penghancuran terjadi terbalik dari pembuatan",
            "Tidak bisa dipastikan, tergantung compiler",
            "Destructor tidak dipanggil bila main selesai secara normal",
          ],
          answer: 1,
          explanation:
            "Objek hidup seperti tumpukan: yang dibuat terakhir berada paling atas dan dibongkar pertama. Destructor b jalan dulu, baru a.",
        },
      ],
    },
    {
      slug: "cpp-enkapsulasi",
      title: "Enkapsulasi: Getter dan Setter",
      summary: "Data dikunci private; perubahan hanya lewat method yang menjaga keadaan sah.",
      steps: [
        {
          kind: "theory",
          title: "Pintu satu-satunya",
          body: "Enkapsulasi adalah gabungan dua keputusan: data dikunci `private`, dan satu-satunya pintu masuk adalah method `public`. Pemakai tidak bisa menulis `r.saldo = -999999;` karena compiler menolaknya; ia harus lewat `r.setor(...)`, dan di situlah class bisa berbicara.\n\nSetter adalah method yang memeriksa aturan sebelum mengubah data: `setor` menolak nilai nol dan negatif, `setUmur` menolak angka tak masuk akal. Getter mengembalikan nilai untuk dibaca. Dengan pola ini class bisa menjamin satu hal penting: objek selalu dalam keadaan sah, tanpa harus mempercayai siapa pun di luar class. Aturan yang berubah cukup diperbaiki di satu tempat, bukan di sepuluh pemanggil.\n\nSekali lagi, bukan berarti semua member harus dipenjara. Data polos tanpa aturan boleh public, atau class-nya memang dibuat sebagai `struct`. Enkapsulasi bernilai ketika ada invarian yang harus dijaga: saldo tak boleh minus, stok tak boleh kurang dari nol, nama tak boleh kosong. Di titik itulah getter dan setter dibuat, bukan karena formalitas.",
          code: {
            language: "cpp",
            content: `#include <iostream>

class Rekening {
  private:
    int saldo;

  public:
    Rekening(int awal) : saldo(awal) {}

    int getSaldo() {
        return saldo;
    }

    void setor(int jumlah) {
        if (jumlah > 0) {
            saldo += jumlah;
        }
    }
};

int main() {
    Rekening r{100000};
    r.setor(50000);
    r.setor(-70000);                     // ditolak oleh setter
    std::cout << r.getSaldo() << "\\n";   // 150000
}`,
            caption: "saldo tidak bisa disentuh dari luar; setor menolak nilai yang tidak sah.",
          },
        },
        {
          kind: "quiz",
          question: "Apa manfaat utama memvalidasi input di setter, dibanding membiarkan datanya public?",
          options: [
            "Program menjadi lebih cepat",
            "Class bisa menjamin objek selalu dalam keadaan sah, karena tidak ada jalan masuk selain method",
            "Menghemat memori yang dipakai member",
            "Supaya class tidak butuh constructor",
          ],
          answer: 1,
          explanation:
            "Dengan data private, semua perubahan harus melewati method yang memeriksa aturan. Keadaan tak sah tidak pernah bisa terbentuk dari luar.",
        },
        {
          kind: "code",
          title: "Rekening dengan penjaga",
          prompt:
            "Lengkapi getter saldo dan baris penambahan di `setor` supaya hanya jumlah positif yang masuk. Program membaca saldo awal dan dua nilai setor, lalu mencetak saldo akhir.",
          mode: "fill",
          template: `#include <iostream>

class Rekening {
  private:
    int saldo;

  public:
    Rekening(int awal) : saldo(awal) {}

    int ___() {
        return saldo;
    }

    void setor(int jumlah) {
        if (jumlah > 0) {
            saldo ___ jumlah;
        }
    }
};

int main() {
    int awal, satu, dua;
    std::cin >> awal >> satu >> dua;

    Rekening r{awal};
    r.setor(satu);
    r.setor(dua);
    std::cout << r.getSaldo() << "\\n";
}`,
          solution: `#include <iostream>

class Rekening {
  private:
    int saldo;

  public:
    Rekening(int awal) : saldo(awal) {}

    int getSaldo() {
        return saldo;
    }

    void setor(int jumlah) {
        if (jumlah > 0) {
            saldo += jumlah;
        }
    }
};

int main() {
    int awal, satu, dua;
    std::cin >> awal >> satu >> dua;

    Rekening r{awal};
    r.setor(satu);
    r.setor(dua);
    std::cout << r.getSaldo() << "\\n";
}`,
          tests: [
            { stdin: "100000 50000 -70000", expectedOutput: "150000" },
            { stdin: "0 250 250", expectedOutput: "500" },
            { stdin: "500 -100 -400", expectedOutput: "500", hidden: true },
          ],
          hints: [
            "Method yang membaca saldo dipanggil getSaldo di main, jadi nama methodnya harus persis itu.",
            "Menambah nilai ke saldo bisa memakai satu operator aritmatika gabungan.",
            "Jawabannya: getSaldo dan saldo += jumlah.",
          ],
        },
      ],
    },
    {
      slug: "cpp-this-pointer",
      title: "this: Objek yang Sedang Dipanggil",
      summary: "Pointer ke objek pemanggil, untuk membedakan nama dan merangkai method.",
      steps: [
        {
          kind: "theory",
          title: "Ada aku di dalam method",
          body: "Setiap method non-static membawa satu pointer tersembunyi bernama `this`: penunjuk ke objek yang sedang memanggil method itu. `r.setor(500)` berarti di dalam `setor`, `this` berisi `&r`. Akses `saldo` di dalam method sebenarnya adalah `this->saldo`; biasanya cukup ditulis pendek, dan `this` baru tampil saat dibutuhkan.\n\nDua situasi membuat `this` eksplisit. Pertama, parameter yang menutupi nama member: `Timer(int detik) : detik(detik) {}` sah karena initializer list, tetapi di badan constructor kamu harus menulis `this->detik = detik;` agar keduanya tidak tertukar. Kedua, method chaining: mengembalikan `*this`, yaitu objek itu sendiri, sehingga pemanggilan bisa dirantai seperti `t.tambah(30).tambah(45);`.\n\nPerhatikan tipenya: `this` adalah pointer (`Timer*`), sedangkan `*this` adalah objeknya. Method berantai biasanya mengembalikan `Timer&`, reference ke objek yang sama, supaya rantai tidak menyalin apa pun dan perubahan tetap menempel pada objek asli.",
          code: {
            language: "cpp",
            content: `#include <iostream>

class Timer {
  private:
    int detik;

  public:
    Timer(int d) : detik(d) {}

    Timer& tambah(int detik) {   // parameter menutupi nama member
        this->detik += detik;    // this-> membedakan keduanya
        return *this;            // kembalikan objek ini, bisa dirantai
    }

    int getDetik() {
        return detik;
    }
};

int main() {
    Timer t{0};
    t.tambah(30).tambah(45).tambah(-10);
    std::cout << t.getDetik() << "\\n";   // 65
}`,
            caption: "tambah mengembalikan *this sehingga panggilan berikutnya menyambung.",
          },
        },
        {
          kind: "quiz",
          question: "Di dalam method non-const milik class `Timer`, tipe dari `this` adalah?",
          options: ["Timer", "Timer&", "Timer*", "void*"],
          answer: 2,
          explanation:
            "this adalah pointer ke objek pemanggil, tipenya Timer*. Dereference-nya, *this, barulah objek itu sendiri.",
        },
        {
          kind: "code",
          title: "Method berantai",
          prompt:
            "Lengkapi `return` di method `tambah` supaya mengembalikan objek ini sendiri, sehingga tiga panggilan di main bisa dirantai.",
          mode: "fill",
          template: `#include <iostream>

class Timer {
  private:
    int detik;

  public:
    Timer(int d) : detik(d) {}

    Timer& tambah(int d) {
        detik += d;
        return ___;
    }

    int getDetik() {
        return detik;
    }
};

int main() {
    Timer t{0};

    int a, b, c;
    std::cin >> a >> b >> c;
    t.tambah(a).tambah(b).tambah(c);

    std::cout << t.getDetik() << "\\n";
}`,
          solution: `#include <iostream>

class Timer {
  private:
    int detik;

  public:
    Timer(int d) : detik(d) {}

    Timer& tambah(int d) {
        detik += d;
        return *this;
    }

    int getDetik() {
        return detik;
    }
};

int main() {
    Timer t{0};

    int a, b, c;
    std::cin >> a >> b >> c;
    t.tambah(a).tambah(b).tambah(c);

    std::cout << t.getDetik() << "\\n";
}`,
          tests: [
            { stdin: "30 45 -10", expectedOutput: "65" },
            { stdin: "5 5 5", expectedOutput: "15" },
            { stdin: "100 200 300", expectedOutput: "600", hidden: true },
          ],
          hints: [
            "this adalah pointer ke objek pemanggil; kamu butuh bentuk yang sudah di-dereference.",
            "Mengembalikan objek ini sendiri ditulis dengan tanda bintang di depan this.",
            "Jawabannya: return *this;",
          ],
        },
      ],
    },
    {
      slug: "cpp-constructor-overloading",
      title: "Constructor Overloading dan Default Argument",
      summary: "Beberapa constructor untuk beberapa cara lahir, plus parameter bawaan.",
      steps: [
        {
          kind: "theory",
          title: "Satu nama, beberapa bentuk",
          body: "Overloading memperbolehkan beberapa constructor dengan nama sama selama daftar parameternya berbeda, baik jumlah maupun tipe. Compiler memilih lewat argumen pemanggil: `Kotak k1;` memakai versi tanpa parameter, `Kotak k2(5);` memakai versi satu parameter. Tipe kembalian tidak ikut membedakan dua overload, dan dua parameter dengan tipe sama pun tidak, walaupun namanya beda.\n\nDefault argument memangkas jumlah overload yang harus ditulis: `Kotak(double s = 1.0)` melayani `Kotak k;` sekaligus `Kotak k(2.5);`. Tapi jangan mencampurnya sembarangan: `Kotak()` bersanding dengan `Kotak(double s = 1.0)` membuat `Kotak k;` ambigu dan ditolak compiler. Untuk satu class, pilih satu gaya.\n\nC++11 menambah delegating constructor: satu constructor memanggil constructor lain lewat initializer list, `Kotak() : Kotak(1.0) {}`. Logika inisialisasi hidup di satu tempat, dan versi default hanya meneruskan nilai bawaan, bukan menyalin-tempel daftar pengisian member.",
          code: {
            language: "cpp",
            content: `#include <iostream>

class Kotak {
  private:
    double sisi;

  public:
    Kotak() : Kotak(1.0) {}        // delegasi ke versi berparameter
    Kotak(double s) : sisi(s) {}

    double luas() {
        return sisi * sisi;
    }
};

int main() {
    Kotak kecil;            // default constructor
    Kotak besar{3.0};

    std::cout << kecil.luas() << "\\n";   // 1
    std::cout << besar.luas() << "\\n";   // 9
}`,
            caption: "Dua cara lahir, satu logika inisialisasi.",
          },
        },
        {
          kind: "quiz",
          question: "Dua constructor dalam satu class dianggap overload yang sah jika bedanya adalah?",
          options: [
            "Tipe nilai kembaliannya",
            "Jumlah atau tipe parameternya",
            "Nama parameternya",
            "Access specifier methodnya",
          ],
          answer: 1,
          explanation:
            "Overload dibedakan dari daftar parameternya: jumlah atau tipe. Tipe kembalian dan nama parameter tidak ikut menentukan.",
        },
        {
          kind: "code",
          title: "Kotak dua cara",
          prompt:
            "Lengkapi constructor default supaya memanggil constructor lain dengan sisi 1.0 (delegating constructor). Program membaca satu sisi; bila nol atau kurang, versi default yang dipakai.",
          mode: "fill",
          template: `#include <iostream>

class Kotak {
  private:
    double sisi;

  public:
    Kotak() : ___ {}
    Kotak(double s) : sisi(s) {}

    double luas() {
        return sisi * sisi;
    }
};

int main() {
    double s;
    std::cin >> s;

    double hasil;
    if (s <= 0) {
        Kotak k;
        hasil = k.luas();
    } else {
        Kotak k{s};
        hasil = k.luas();
    }

    std::cout << hasil << "\\n";
}`,
          solution: `#include <iostream>

class Kotak {
  private:
    double sisi;

  public:
    Kotak() : Kotak(1.0) {}
    Kotak(double s) : sisi(s) {}

    double luas() {
        return sisi * sisi;
    }
};

int main() {
    double s;
    std::cin >> s;

    double hasil;
    if (s <= 0) {
        Kotak k;
        hasil = k.luas();
    } else {
        Kotak k{s};
        hasil = k.luas();
    }

    std::cout << hasil << "\\n";
}`,
          tests: [
            { stdin: "3", expectedOutput: "9" },
            { stdin: "-1", expectedOutput: "1" },
            { stdin: "2.5", expectedOutput: "6.25", hidden: true },
          ],
          hints: [
            "Delegating constructor memanggil constructor lain lewat initializer list, memakai nama class sendiri.",
            "Bentuknya: Nama() : Nama(nilaiDefault) {}",
            "Jawabannya: Kotak(1.0).",
          ],
        },
      ],
    },
    {
      slug: "cpp-copy-constructor",
      title: "Copy Constructor",
      summary: "Kapan salinan dibuat diam-diam, dan bentuk wajib penyalinnya.",
      steps: [
        {
          kind: "theory",
          title: "Menyalin objek itu sering terjadi tanpa terlihat",
          body: "Copy constructor `Kartu(const Kartu& lain)` dipanggil setiap kali objek BARU lahir dari objek lain yang sudah ada: inisialisasi `Kartu b = a;` atau `Kartu b(a);`, pengiriman parameter by value, dan pengembalian objek by value. Banyak salinan terjadi tanpa ditulis eksplisit; mengenalinya penting supaya kejutan performa tidak muncul diam-diam.\n\nParameternya wajib reference. Kalau ditulis by value, menyalin argumen butuh copy constructor lagi, dan begitu terus tanpa ujung; compiler menolak bentuk itu. `const` menjanjikan sumber tidak diubah sekaligus mengizinkan sumber berupa objek const atau temporary.\n\nVersi bawaan dari compiler menyalin member demi member, dan untuk member seperti `int`, `std::string`, atau `std::vector` hasilnya sudah benar. Masalah muncul di member pointer mentah: yang tersalin adalah alamatnya, sehingga dua objek berbagi satu buffer, lalu dua destructor membebaskan buffer yang sama dua kali. Di titik itu copy constructor ditulis sendiri, dan lesson rule of three akan merangkum kapan wajibnya.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <string>

class Kartu {
  public:
    std::string nama;

    Kartu(std::string n) : nama(n) {}
    Kartu(const Kartu& lain) : nama(lain.nama + "-salinan") {
        std::cout << "menyalin " << lain.nama << "\\n";
    }
};

void baca(Kartu k) {              // parameter by value: menyalin
    std::cout << "baca " << k.nama << "\\n";
}

int main() {
    Kartu a{"Ace"};
    Kartu b = a;                  // copy constructor
    baca(a);                      // copy constructor lagi
    std::cout << b.nama << "\\n";
}`,
            caption: "Dua salinan terjadi di sini: saat inisialisasi b, dan saat a masuk ke fungsi by value.",
          },
        },
        {
          kind: "quiz",
          question: "Baris `Kartu b = a;` dengan b belum ada sebelumnya memanggil?",
          options: [
            "operator assignment",
            "copy constructor",
            "default constructor",
            "destructor",
          ],
          answer: 1,
          explanation:
            "Walaupun tampak seperti assignment, b baru dibuat di baris itu. Pembuatan objek baru dari objek lain selalu lewat copy constructor.",
        },
      ],
    },
    {
      slug: "cpp-assignment-operator",
      title: "Copy Assignment Operator",
      summary: "Mengganti isi objek yang sudah ada, dan tiga aturan operator= yang benar.",
      steps: [
        {
          kind: "theory",
          title: "Copy constructor vs operator=",
          body: "Beda satu kata di kode, beda fungsi yang jalan: `Kartu b = a;` dengan `b` belum ada memanggil copy constructor, sedangkan `b = a;` dengan `b` sudah ada memanggil copy assignment operator, `Kartu& operator=(const Kartu& lain);`. Yang pertama menciptakan objek; yang kedua mengganti isi objek yang sudah hidup, termasuk membereskan isi lamanya.\n\noperator= yang benar melakukan tiga hal: menahan self-assignment (`a = a;`) dengan membandingkan `this != &lain`, mengganti resource lama sebelum memasang yang baru, dan mengembalikan `*this` bertipe `Kartu&` supaya rantai `c = b = a;` bekerja seperti pada tipe dasar.\n\nVersi bawaannya lagi-lagi memberwise dan benar untuk member biasa. Untuk pointer mentah, menyalin alamat berarti dua objek menunjuk resource yang sama; objek yang menimpa nilai pointernya kehilangan jejak buffer lamanya (bocor), atau dua destructor menghapus buffer yang sama. Karena itulah ketiga fungsi ini biasanya datang bersama di satu class.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <string>

class Catatan {
  public:
    std::string isi;

    Catatan(std::string i) : isi(i) {}
    Catatan& operator=(const Catatan& lain) {
        if (this != &lain) {          // tahan self-assignment
            isi = lain.isi;
        }
        return *this;                 // memungkinkan c = b = a
    }
};

int main() {
    Catatan a{"hujan"};
    Catatan b{"cerah"};
    Catatan c{"berawan"};

    c = b = a;                        // operator= jalan dua kali
    std::cout << b.isi << " " << c.isi << "\\n";   // hujan hujan
}`,
            caption: "Return *this membuat rantai assignment bekerja dari kanan ke kiri.",
          },
        },
        {
          kind: "quiz",
          question: "Diberikan `Catatan a{...};` dan `Catatan b{...};`, keduanya sudah ada. Baris `b = a;` memanggil?",
          options: [
            "copy constructor",
            "default constructor",
            "copy assignment operator (operator=)",
            "destructor lalu copy constructor",
          ],
          answer: 2,
          explanation:
            "Tidak ada objek baru yang lahir di baris itu, jadi yang berjalan operator=. Bandingkan dengan `Catatan b = a;` yang memanggil copy constructor.",
        },
      ],
    },
    {
      slug: "cpp-rule-of-three",
      title: "Rule of Three/Five",
      summary: "Tiga (atau lima) fungsi yang datang bersama saat class memegang resource.",
      steps: [
        {
          kind: "theory",
          title: "Tiga fungsi yang berjalan bersama",
          body: "Rule of three menyatakan: jika sebuah class perlu menulis sendiri salah satu dari destructor, copy constructor, atau copy assignment, hampir pasti ia perlu ketiganya. Penyebabnya selalu sama, yaitu class memegang resource yang harus dibereskan, biasanya memori dari pointer mentah. Destructor yang menghapus buffer berpasangan dengan copy bawaan yang menyalin alamat: hasilnya dua objek berbagi satu buffer dan menghapusnya dua kali.\n\nC++11 memperluasnya menjadi rule of five dengan move constructor dan move assignment, yang memindahkan resource daripada menyalinnya. Keduanya penting untuk performa, tapi konsep dasarnya tetap: fungsi-fungsi khusus ini bekerja pada resource yang sama, jadi keputusannya diambil bersama.\n\nJalan keluar yang disukai kode modern disebut rule of zero: pegang resource lewat member yang mengurus dirinya sendiri, `std::string`, `std::vector`, lalu smart pointer di modul Memori. Kelima fungsi khusus tidak ditulis sama sekali karena versi bawaannya sudah benar. Di C++ modern, pointer mentah sebagai member class adalah tanda pertanyaan, bukan gaya.",
          code: {
            language: "cpp",
            content: `#include <cstring>
#include <iostream>

class Teks {                         // rule of three dengan buffer mentah
  public:
    char* data;

    Teks(const char* s) : data(new char[std::strlen(s) + 1]) {
        std::strcpy(data, s);
    }

    ~Teks() { delete[] data; }                        // 1. destructor

    Teks(const Teks& lain)                            // 2. copy constructor
        : data(new char[std::strlen(lain.data) + 1]) {
        std::strcpy(data, lain.data);                 // salin ISI, bukan alamat
    }

    Teks& operator=(const Teks& lain) {               // 3. copy assignment
        if (this != &lain) {
            delete[] data;
            data = new char[std::strlen(lain.data) + 1];
            std::strcpy(data, lain.data);
        }
        return *this;
    }
};

int main() {
    Teks a{"kode"};
    Teks b = a;          // salinan berdiri sendiri: tidak ada double delete
    std::cout << b.data << "\\n";
}`,
            caption: "Tanpa copy constructor sendiri, a dan b akan berbagi satu buffer lalu menghapusnya dua kali.",
          },
        },
        {
          kind: "quiz",
          question: "Class punya member pointer mentah yang di-delete di destructor. Konsekuensi apa yang harus ditangani?",
          options: [
            "Tidak ada apa pun, copy bawaan sudah aman",
            "Copy constructor dan copy assignment harus ditulis sendiri agar setiap salinan punya buffer masing-masing, bukan berbagi alamat",
            "Semua method harus dibuat static",
            "Pointer mentah harus diganti array biasa",
          ],
          answer: 1,
          explanation:
            "Copy bawaan menyalin alamat: dua objek berbagi buffer, lalu dua destructor membebaskan memori yang sama (double delete). Salinan harus mendapat buffer sendiri.",
        },
      ],
    },
    {
      slug: "cpp-latihan-tabung",
      title: "Latihan Modul: Class Tabung",
      summary: "Satu class utuh: data private, initializer list, dan method volume.",
      steps: [
        {
          kind: "theory",
          title: "Satu class, semua kebiasaan modul ini",
          body: "Lesson penutup merangkai kebiasaan modul Class dan Object ke dalam satu class utuh. Datanya (`jari`, `tinggi`) dikunci private; constructor mengisi keduanya lewat member initializer list sehingga tabung tidak pernah lahir kosong; method `volume()` menjadi cara satu-satunya menghitung dari luar.\n\nUrutan berpikirnya bisa kamu pakai ulang: tentukan data yang harus dipegang, tentukan bagaimana objek lahir dalam keadaan sah lewat constructor, lalu tentukan perilaku yang diminta pemakai sebagai method publik. Volume tabung dihitung `phi kali jari kuadrat kali tinggi`; latihan ini memakai `3.14` agar hasilnya mudah diperiksa.\n\nSetelah modul ini, modul STL Container akan mengganti array mentah dengan `std::vector` dan menambah `map`, `set`, beserta algoritma bawaan; class yang kamu bangun di sini adalah isi container-nya nanti.",
          code: {
            language: "cpp",
            content: `class Tabung {
  private:
    double jari;
    double tinggi;

  public:
    Tabung(double j, double t) : jari(j), tinggi(t) {}

    double volume();   // kamu yang menuntaskannya di praktik
};`,
            caption: "Kerangka class Tabung: data tertutup, lahir terisi, perilaku publik.",
          },
        },
        {
          kind: "code",
          title: "Volume tabung",
          prompt:
            "Lengkapi constructor dan method `volume` supaya program mencetak volume tabung dengan phi 3.14. Volume = 3.14 kali jari kali jari kali tinggi.",
          mode: "fill",
          template: `#include <iostream>

class Tabung {
  private:
    double jari;
    double tinggi;

  public:
    Tabung(double j, double t) : jari(j), ___(t) {}

    double volume() {
        return 3.14 * jari * jari * ___;
    }
};

int main() {
    double j, t;
    std::cin >> j >> t;

    Tabung tabung(j, t);
    std::cout << tabung.volume() << "\\n";
}`,
          solution: `#include <iostream>

class Tabung {
  private:
    double jari;
    double tinggi;

  public:
    Tabung(double j, double t) : jari(j), tinggi(t) {}

    double volume() {
        return 3.14 * jari * jari * tinggi;
    }
};

int main() {
    double j, t;
    std::cin >> j >> t;

    Tabung tabung(j, t);
    std::cout << tabung.volume() << "\\n";
}`,
          tests: [
            { stdin: "3 10", expectedOutput: "282.6" },
            { stdin: "2 5", expectedOutput: "62.8" },
            { stdin: "1 1", expectedOutput: "3.14", hidden: true },
          ],
          hints: [
            "Member kedua yang diisi constructor bernama tinggi, parameternya t.",
            "Volume memakai tinggi yang tersimpan di class, bukan parameter apa pun.",
            "Jawabannya: tinggi untuk kedua ___",
          ],
        },
      ],
    },
  ],
};
