import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "cpp",
  moduleRange: [8, 9],
  modules: [
    {
      title: "Praktik Modern",
      description: "enum class, structured bindings, const correctness, dan idioma modern.",
    },
    {
      title: "Menuju Proyek Lapangan",
      description: "Program multi-file dengan CMake/g++ sederhana, parsing data, dan mini proyek akhir.",
    },
  ],
  lessons: [
    // ==================== MODUL 8: Praktik Modern ====================
    {
      slug: "mod-enum-class",
      title: "enum class: Enum yang Disiplin",
      summary: "Kenali enum class, enum yang anggotanya terkurung dan tidak bisa tercampur dengan int.",
      steps: [
        {
          kind: "theory",
          title: "Enum yang punya pagarnya sendiri",
          body: "Enum biasa punya dua kebiasaan yang sering menimbulkan bug. Pertama, nama anggotanya bocor ke scope tempat enum dideklarasikan: `enum Warna { Merah, Hijau };` membuat `Merah` bisa dipakai tanpa awalan di mana mana. Kedua, nilainya diam diubah menjadi int, sehingga `int x = Merah;` sah menurut compiler dan `Merah == 0` dianggap benar.\n\nC++11 memperkenalkan enum class untuk menutup kedua celah itu. Anggota hanya bisa diakses lewat namanya, misalnya `Status::Diproses`. Konversi ke int harus disengaja lewat `static_cast`. Akibatnya dua enum berbeda tidak bisa tercampur, dan perbandingan yang tidak disengaja ditolak saat kompilasi, bukan saat program sudah jalan salah.\n\nCara paling umum memakai enum class adalah switch: menerjemahkan satu nilai enum menjadi teks atau perilaku. Lihat contohnya di bawah.",
          code: {
            language: "cpp",
            content: `#include <iostream>
using namespace std;

enum class Status { Menunggu, Diproses, Selesai };

int main() {
    Status s = Status::Diproses;
    switch (s) {
        case Status::Menunggu:
            cout << "menunggu antrian" << "\\n";
            break;
        case Status::Diproses:
            cout << "sedang diproses" << "\\n";
            break;
        case Status::Selesai:
            cout << "sudah selesai" << "\\n";
            break;
    }
    return 0;
}`,
            caption: "Anggota enum class wajib ditulis dengan awalan Status::, tidak bisa dipanggil telanjang.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi jika `enum class Warna { Merah };` lalu kamu menulis `cout << Warna::Merah;`?",
          options: [
            "Mencetak 0",
            "Mencetak Merah",
            "Error kompilasi karena enum class tidak otomatis menjadi int",
            "Mencetak alamat memorinya",
          ],
          answer: 2,
          explanation:
            "enum class tidak mau dikonversi diam ke int, dan cout tidak tahu cara mencetak enum class. Kalau angkanya memang dibutuhkan, ubah dengan static_cast<int>(Warna::Merah).",
        },
        {
          kind: "code",
          title: "Terjemahkan kode status",
          prompt:
            "Lengkapi program: baca satu angka (0, 1, atau 2), ubah menjadi enum class Status, lalu cetak labelnya: `menunggu`, `diproses`, atau `selesai`. Ganti setiap `___` dengan kode yang tepat.",
          mode: "fill",
          template: `#include <iostream>
using namespace std;

___ enum Status { Menunggu, Diproses, Selesai };

int main() {
    int kode;
    cin >> kode;
    Status s = static_cast<Status>(kode);
    switch (s) {
        case Status::Menunggu:
            cout << "menunggu" << "\\n";
            break;
        ___ Status::Diproses:
            cout << "diproses" << "\\n";
            break;
        case Status::Selesai:
            cout << "selesai" << "\\n";
            break;
    }
    return 0;
}`,
          solution: `#include <iostream>
using namespace std;

enum class Status { Menunggu, Diproses, Selesai };

int main() {
    int kode;
    cin >> kode;
    Status s = static_cast<Status>(kode);
    switch (s) {
        case Status::Menunggu:
            cout << "menunggu" << "\\n";
            break;
        case Status::Diproses:
            cout << "diproses" << "\\n";
            break;
        case Status::Selesai:
            cout << "selesai" << "\\n";
            break;
    }
    return 0;
}`,
          tests: [
            { stdin: "0", expectedOutput: "menunggu" },
            { stdin: "1", expectedOutput: "diproses" },
            { stdin: "2", expectedOutput: "selesai", hidden: true },
          ],
          hints: [
            "Kata kunci yang membuat enum terkurung dalam namanya dan kuat bertipe ada di teori.",
            "Deklarasinya diawali enum class, dan di switch setiap label diawali kata case.",
          ],
        },
      ],
    },
    {
      slug: "mod-structured-bindings",
      title: "Structured Bindings: Bongkar Isi Pasangan",
      summary: "Bongkar isi pair, tuple, atau struct langsung ke beberapa nama dengan satu baris C++17.",
      steps: [
        {
          kind: "theory",
          title: "Satu baris untuk membongkar beberapa nilai",
          body: "Sejak C++17 ada structured bindings: `auto [a, b] = ...` mengambil isi satu pasangan data langsung ke beberapa nama sekaligus. Yang didukung: `std::pair`, `std::tuple`, array, dan struct biasa. Tidak perlu lagi mengakses `first` dan `second` satu per satu.\n\nFitur ini paling terasa saat beriterasi map. Setiap elemen map adalah pasangan kunci dan nilai; dengan structured bindings, loop membaca seperti kalimat: `for (const auto& [nama, jumlah] : stok)`. Kode yang membaca begini tidak perlu komentar penjelas.\n\nSatu catatan kecil: dengan `auto` biasa, hasil binding berupa salinan. Dengan `const auto&`, nama yang kamu berikat menempel pada data aslinya. Untuk elemen map besar, pilih referensi supaya tidak ada salinan yang sia sia.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> umur = {{"Dina", 17}, {"Bagas", 18}};
    for (const auto& [nama, umurOrang] : umur) {
        cout << nama << " berumur " << umurOrang << "\\n";
    }

    pair<int, int> ukuran = {3, 4};
    auto [p, l] = ukuran;
    cout << "luas: " << p * l << "\\n";
    return 0;
}`,
            caption: "Elemen map dibongkar langsung ke nama dan umurOrang, tanpa iterator eksplisit.",
          },
        },
        {
          kind: "quiz",
          question: "Apa keluaran kode berikut?\n\n```cpp\npair<int, string> p = {2, \"dua\"};\nauto [angka, teks] = p;\ncout << teks << angka;\n```",
          options: ["2dua", "dua2", "angka teks", "Error kompilasi"],
          answer: 1,
          explanation:
            "auto [angka, teks] mengisi angka dengan 2 dan teks dengan dua. Urutan cetaknya teks dulu lalu angka, jadi hasilnya dua2.",
        },
        {
          kind: "code",
          title: "Daftar stok dengan structured bindings",
          prompt:
            "Lengkapi program: baca n baris berisi nama barang dan jumlahnya, simpan di map, lalu cetak seluruh isi map terurut abjad dengan structured bindings dalam format `nama: jumlah`. Ganti setiap `___`.",
          mode: "fill",
          template: `#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    int n;
    cin >> n;
    map<string, int> stok;
    for (int i = 0; i < n; i++) {
        string nama;
        int jumlah;
        cin >> nama >> jumlah;
        stok[___] = jumlah;
    }
    for (const auto& [nama, jumlah] : ___) {
        cout << nama << ": " << jumlah << "\\n";
    }
    return 0;
}`,
          solution: `#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    int n;
    cin >> n;
    map<string, int> stok;
    for (int i = 0; i < n; i++) {
        string nama;
        int jumlah;
        cin >> nama >> jumlah;
        stok[nama] = jumlah;
    }
    for (const auto& [nama, jumlah] : stok) {
        cout << nama << ": " << jumlah << "\\n";
    }
    return 0;
}`,
          tests: [
            { stdin: "3\npensil 10\nbuku 5\npenghapus 3", expectedOutput: "buku: 5\npenghapus: 3\npensil: 10" },
            { stdin: "2\nkunci 4\ngantungan 1", expectedOutput: "gantungan: 1\nkunci: 4" },
            { stdin: "1\ntas 2", expectedOutput: "tas: 2", hidden: true },
          ],
          hints: [
            "Kunci penyimpanan map adalah nama barang yang baru dibaca dari input.",
            "Yang diiterasi pada loop terakhir adalah map-nya sendiri, bukan indeks angka.",
          ],
        },
      ],
    },
    {
      slug: "mod-const-correctness",
      title: "const Correctness: Janji Tanpa Perubahan",
      summary: "Tandai data dan method yang tidak berubah, biarkan compiler yang mengawalinya.",
      steps: [
        {
          kind: "theory",
          title: "Janji const: data tidak berubah",
          body: "const correctness berarti setiap bagian kode yang hanya membaca data menyatakannya dengan const. Parameter `const string& nama` adalah janji bahwa fungsi tidak mengubah teksnya, dan compiler yang mengawasi janji itu. Langgar sedikit saja, program gagal dikompilasi, dan itu justru kabar baik: kesalahan tertangkap lebih awal.\n\nPada class, const di akhir deklarasi method menandai method pembaca: `int getHarga() const`. Method seperti ini boleh dipanggil pada objek const atau lewat referensi const. Method tanpa const dianggap bisa mengubah objek, sehingga compiler menolak pemanggilannya dari konteks const.\n\nKebiasaan praktisnya: mulai dari getter. Kalau tubuh getter tidak mengubah member, beri const. Fungsi lain yang menerima `const Produk&` lalu tetap bisa membaca semua informasinya, dan desain API-mu jadi tidak menutup pintu untuk pemakai yang menjanjikan data tidak diubah.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <string>
using namespace std;

class Produk {
public:
    Produk(string nama, int harga) : nama(nama), harga(harga) {}
    string getNama() const { return nama; }
    int getHarga() const { return harga; }
private:
    string nama;
    int harga;
};

void cetak(const Produk& p) {
    cout << p.getNama() << ": " << p.getHarga() << "\\n";
}

int main() {
    Produk buku("Buku", 15000);
    cetak(buku);
    return 0;
}`,
            caption: "Kedua getter bertanda const sehingga bisa dipanggil lewat referensi const.",
          },
        },
        {
          kind: "quiz",
          question: "Pada deklarasi `int getHarga() const;`, kata const di akhir itu menandakan apa?",
          options: [
            "Nilai baliknya bertipe const int",
            "Method hanya boleh dipanggil satu kali",
            "Method tidak boleh mengubah member class",
            "Member class otomatis menjadi const",
          ],
          answer: 2,
          explanation:
            "const setelah kurung parameter adalah janji bahwa method tidak mengubah objek. Nilai baliknya tetap int biasa, tidak ada hubungannya dengan const int.",
        },
        {
          kind: "code",
          title: "Getter yang menutup pintu",
          prompt:
            "Fungsi tampilkan menerima `const Produk&`, tetapi program ini gagal dikompilasi. Ada SATU kesalahan. Jalankan, baca pesan errornya tentang discards qualifiers, perbaiki, lalu pastikan semua tes lulus.",
          mode: "fix",
          template: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Produk {
public:
    Produk(string nama, int harga) : nama(nama), harga(harga) {}
    string getNama() const { return nama; }
    int getHarga() { return harga; }
private:
    string nama;
    int harga;
};

void tampilkan(const Produk& p) {
    cout << p.getNama() << ": " << p.getHarga() << "\\n";
}

int main() {
    int n;
    cin >> n;
    vector<Produk> daftar;
    for (int i = 0; i < n; i++) {
        string nama;
        int harga;
        cin >> nama >> harga;
        daftar.push_back(Produk(nama, harga));
    }
    for (const Produk& p : daftar) {
        tampilkan(p);
    }
    return 0;
}`,
          solution: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Produk {
public:
    Produk(string nama, int harga) : nama(nama), harga(harga) {}
    string getNama() const { return nama; }
    int getHarga() const { return harga; }
private:
    string nama;
    int harga;
};

void tampilkan(const Produk& p) {
    cout << p.getNama() << ": " << p.getHarga() << "\\n";
}

int main() {
    int n;
    cin >> n;
    vector<Produk> daftar;
    for (int i = 0; i < n; i++) {
        string nama;
        int harga;
        cin >> nama >> harga;
        daftar.push_back(Produk(nama, harga));
    }
    for (const Produk& p : daftar) {
        tampilkan(p);
    }
    return 0;
}`,
          tests: [
            { stdin: "2\nBuku 15000\nPensil 3000", expectedOutput: "Buku: 15000\nPensil: 3000" },
            { stdin: "1\nKopi 18000", expectedOutput: "Kopi: 18000" },
            { stdin: "3\nGula 12000\nTeh 5000\nRoti 9000", expectedOutput: "Gula: 12000\nTeh: 5000\nRoti: 9000", hidden: true },
          ],
          hints: [
            "Pesan errornya berbunyi seperti passing const Produk as this argument discards qualifiers.",
            "Compiler curiga getHarga bisa mengubah objek karena tidak bertanda const, padahal dia hanya membaca.",
            "Tambahkan const setelah kurung pada getHarga, sama seperti yang sudah dipasang pada getNama.",
          ],
        },
      ],
    },
    {
      slug: "mod-constexpr",
      title: "constexpr: Hitung di Waktu Kompilasi",
      summary: "Serahkan perhitungan yang bisa dihitung lebih awal kepada compiler lewat constexpr.",
      steps: [
        {
          kind: "theory",
          title: "Biarkan compiler yang menghitung",
          body: "const berarti tidak berubah setelah dibuat. constexpr berarti lebih dari itu: dihitung saat kompilasi, selama semua inputnya dikenal saat kompilasi juga. `constexpr int SISI_MIN = 3;` bukan sekadar konstanta, dia sudah selesai dihitung sebelum program berjalan.\n\nFungsi constexpr boleh dipakai di dua dunia. Dipanggil dengan input konstan, hasilnya dihitung compiler. Dipanggil dengan input runtime, misalnya angka dari `cin`, fungsinya berperilaku seperti fungsi biasa. Satu definisi, dua kegunaan, tanpa trik macro.\n\nPakai constexpr untuk konstanta program: batas minimum, ukuran tetap, konversi satuan. Dia pengganti `#define` yang modern karena punya tipe, punya scope, dan ikut diperiksa compiler penuh.",
          code: {
            language: "cpp",
            content: `#include <iostream>
using namespace std;

constexpr int detikPerJam() {
    return 60 * 60;
}

int main() {
    constexpr int DETIK_HARI = detikPerJam() * 24;
    cout << "sehari: " << DETIK_HARI << "\\n";

    int jam;
    cin >> jam;
    cout << "detik: " << jam * detikPerJam() << "\\n";
    return 0;
}`,
            caption: "DETIK_HARI selesai dihitung saat kompilasi; baris kedua dihitung saat runtime.",
          },
        },
        {
          kind: "quiz",
          question: "Kapan ekspresi dengan constexpr benar benar dihitung saat kompilasi?",
          options: [
            "Selalu, tanpa kecuali",
            "Saat program ditutup",
            "Hanya kalau dipakai untuk ukuran array",
            "Kalau semua inputnya dikenal saat kompilasi",
          ],
          answer: 3,
          explanation:
            "constexpr memberi kesempatan dihitung saat kompilasi. Kalau ada input dari cin, fungsinya jalan seperti fungsi biasa saat program berjalan.",
        },
        {
          kind: "code",
          title: "Kuadrat dua dunia",
          prompt:
            "Lengkapi fungsi constexpr `kuadrat` supaya bisa dipakai untuk konstanta saat kompilasi dan untuk input dari user saat runtime. Format keluaran: `min: <hasil>` lalu `input: <hasil>`.",
          mode: "fill",
          template: `#include <iostream>
using namespace std;

___ int kuadrat(int x) {
    return x ___ x;
}

int main() {
    constexpr int SISI_MIN = 3;
    int sisi;
    cin >> sisi;
    cout << "min: " << kuadrat(SISI_MIN) << "\\n";
    cout << "input: " << kuadrat(sisi) << "\\n";
    return 0;
}`,
          solution: `#include <iostream>
using namespace std;

constexpr int kuadrat(int x) {
    return x * x;
}

int main() {
    constexpr int SISI_MIN = 3;
    int sisi;
    cin >> sisi;
    cout << "min: " << kuadrat(SISI_MIN) << "\\n";
    cout << "input: " << kuadrat(sisi) << "\\n";
    return 0;
}`,
          tests: [
            { stdin: "5", expectedOutput: "min: 9\ninput: 25" },
            { stdin: "12", expectedOutput: "min: 9\ninput: 144" },
            { stdin: "-4", expectedOutput: "min: 9\ninput: 16", hidden: true },
          ],
          hints: [
            "Kata kunci di depan `int kuadrat` adalah yang membuat perhitungan bisa selesai saat kompilasi.",
            "Kuadrat artinya x dikalikan dengan dirinya sendiri.",
            "Jawabannya: constexpr di depan fungsi, dan return x * x.",
          ],
        },
      ],
    },
    {
      slug: "mod-if-init",
      title: "if dengan Initializer (C++17)",
      summary: "Deklarasikan variabel di dalam if supaya hidupnya tepat sepanjang percabangan.",
      steps: [
        {
          kind: "theory",
          title: "Variabel yang hidupnya seumur percabangan",
          body: "C++17 menambah bentuk `if (inisialisasi; kondisi)`. Bagian pertama mendeklarasikan variabel yang hanya terlihat di dalam if dan else-nya. Begitu percabangan selesai, nama itu hilang dan tidak bisa dipakai di bawahnya.\n\nPola paling sering: mencari di map. `if (auto it = m.find(k); it != m.end())` menampung hasil `find` sekali, memakainya di kondisi dan di badan if, tanpa menumpahkan nama `it` ke seluruh fungsi. Tanpa bentuk ini, orang terpaksa mendeklarasikan `it` di luar if sehingga dia hidup lebih lama dari yang perlu dan bisa bentrok dengan nama lain.\n\nRuang lingkup kecil artinya sedikit celah bug. Aturannya sederhana: deklarasikan variabel sedekat mungkin dengan pemakaiannya, dan if dengan initializer adalah alat yang paling pas untuk hasil pencarian dan konversi yang langsung dicek.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> stok = {{"buku", 12}, {"pensil", 30}};
    string cari;
    cin >> cari;
    if (auto it = stok.find(cari); it != stok.end()) {
        cout << "stok " << it->second << "\\n";
    } else {
        cout << "tidak dijual" << "\\n";
    }
    return 0;
}`,
            caption: "it hanya ada di dalam if dan else, tepat sepanjang yang dibutuhkan.",
          },
        },
        {
          kind: "quiz",
          question: "Di area mana variabel dari bagian inisialisasi `if (auto it = m.find(k); it != m.end())` bisa dipakai?",
          options: [
            "Seluruh fungsi main",
            "Hanya di dalam blok if dan else",
            "Hanya di kondisi if",
            "Juga di kode setelah if selesai",
          ],
          answer: 1,
          explanation:
            "Variabel itu scopenya sebatas if dan else-nya. Setelah blok selesai, nama it tidak dikenal lagi, dan itu memang tujuannya.",
        },
        {
          kind: "code",
          title: "Cek ketersediaan barang",
          prompt:
            "Lengkapi program pencarian harga: baca satu kata, cari di map harga dengan if berinitializer, cetak `harga <angka>` kalau ketemu atau `tidak ada` kalau tidak.",
          mode: "fill",
          template: `#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> harga = {{"buku", 15000}, {"pensil", 3000}};
    string cari;
    cin >> cari;
    if (___ it = harga.find(cari); it != harga.end()) {
        cout << "harga " << it->___ << "\\n";
    } else {
        cout << "tidak ada" << "\\n";
    }
    return 0;
}`,
          solution: `#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> harga = {{"buku", 15000}, {"pensil", 3000}};
    string cari;
    cin >> cari;
    if (auto it = harga.find(cari); it != harga.end()) {
        cout << "harga " << it->second << "\\n";
    } else {
        cout << "tidak ada" << "\\n";
    }
    return 0;
}`,
          tests: [
            { stdin: "buku", expectedOutput: "harga 15000" },
            { stdin: "penggaris", expectedOutput: "tidak ada" },
            { stdin: "pensil", expectedOutput: "harga 3000", hidden: true },
          ],
          hints: [
            "Tipe hasil find tidak perlu ditulis lengkap; C++ punya kata kunci untuk menyerahkan penentuannya pada compiler.",
            "Isi pasangan hasil map adalah first untuk kunci dan second untuk nilai.",
            "Jawabannya: auto untuk tipenya, dan it->second untuk mengambil harganya.",
          ],
        },
      ],
    },
    {
      slug: "mod-string-view",
      title: "std::string_view: Melihat Tanpa Menyalin",
      summary: "Perkenalan string_view, jendela baca ke teks tanpa salinan, lengkap dengan bahayanya.",
      steps: [
        {
          kind: "theory",
          title: "Melihat string tanpa menyalinnya",
          body: "Setiap kali fungsi menerima `string teks` by value, C++ menyalin seluruh isi teks itu. Untuk teks panjang yang hanya dibaca, salinan tersebut mubazir. C++17 menjawabnya dengan `std::string_view`: sebuah jendela baca yang menunjuk teks tanpa memiliki dan tanpa menyalin.\n\nstring_view bisa dibuat dari `std::string` maupun dari literal seperti `\"admin\"`. Ia punya `size()`, bisa dibandingkan dengan `==`, dan bisa dicetak langsung. Parameter fungsi pembaca teks bisa bertipe `string_view` sehingga menerima dua sumber sekaligus tanpa membuat salinan baru.\n\nSatu bahaya besar harus diingat: view tidak memiliki datanya. Kalau string aslinya hancur, misalnya karena keluar dari fungsi, view menggantung dan membaca memori yang sudah tidak sah. Karena itu string_view cocok untuk parameter dan pemrosesan sesaat, bukan untuk disimpan lama. Kalau perlu menyimpan, simpan `std::string`.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <string>
#include <string_view>
using namespace std;

void periksa(string_view teks) {
    if (teks == "admin") {
        cout << "teks cocok" << "\\n";
    } else {
        cout << "teks: " << teks << ", panjang " << teks.size() << "\\n";
    }
}

int main() {
    periksa("admin");
    string nama = "pengguna";
    periksa(nama);
    return 0;
}`,
            caption: "Satu fungsi, dua sumber teks: literal dan string, keduanya tanpa salinan.",
          },
        },
        {
          kind: "quiz",
          question: "Apa bahaya utama menyimpan std::string_view sebagai member yang berumur panjang?",
          options: [
            "View menyalin string asli berkali kali",
            "View tidak bisa dibandingkan dengan string",
            "View bisa menggantung jika string aslinya sudah hancur",
            "Ukurannya membesar sendiri setiap dipakai",
          ],
          answer: 2,
          explanation:
            "string_view hanya menunjuk, tidak memiliki. Kalau pemilik aslinya mati, view menunjuk memori yang sudah tidak sah. Untuk data yang disimpan, pakai std::string.",
        },
      ],
    },
    {
      slug: "mod-alias",
      title: "using dan Type Alias",
      summary: "Beri nama baru pada tipe yang panjang dengan using supaya kode lebih mudah dibaca.",
      steps: [
        {
          kind: "theory",
          title: "Nama tipe yang lebih manusiawi",
          body: "Tipe C++ bisa memanjang: `map<string, vector<int>>`. Menulisnya berulang kali melelahkan dan rawan beda tipis antar tempat. Type alias dengan `using` memberi nama baru untuk tipe lama: `using StokBarang = map<string, int>;` lalu `StokBarang` bisa dipakai di mana saja.\n\nAlias bukan tipe baru. `StokBarang` dan `map<string, int>` bisa saling menggantikan sepenuhnya, dan compiler memperlakukannya sama persis. Nilai alias yang sesungguhnya ada di dua tempat: sebagai dokumentasi yang dijaga compiler, dan sebagai satu titik perubahan. Ganti tipe dasarnya sekali, semua pemakai ikut.\n\nGunakan alias saat satu nama tipe muncul lebih dari dua kali, atau saat alias memperjelas maksud: `Koordinat` berbicara lebih banyak daripada `pair<int, int>`. Untuk `typedef` gaya lama, bentuk `using` lebih terbaca dan bekerja pula di template.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

using DaftarKata = vector<string>;

DaftarKata potong(const DaftarKata& sumber, size_t maks) {
    DaftarKata hasil;
    for (const string& kata : sumber) {
        if (kata.size() <= maks) {
            hasil.push_back(kata);
        }
    }
    return hasil;
}

int main() {
    DaftarKata kata = {"api", "abu", "bangku", "ia"};
    for (const string& k : potong(kata, 3)) {
        cout << k << " ";
    }
    cout << "\\n";
    return 0;
}`,
            caption: "DaftarKata dipakai seperti vector<string> biasa, hanya namanya lebih pendek.",
          },
        },
        {
          kind: "quiz",
          question: "Setelah `using Stok = map<string, int>;`, apa tipe sebenarnya dari variabel `Stok s;`?",
          options: [
            "map<string, int>",
            "Tipe baru yang berbeda dari map<string, int>",
            "string_view",
            "auto",
          ],
          answer: 0,
          explanation:
            "using hanya memberi nama lain, bukan membuat tipe berbeda. Stok dan map<string, int> bisa saling dipakai tanpa konversi apa pun.",
        },
        {
          kind: "code",
          title: "Alias untuk daftar angka",
          prompt:
            "Lengkapi program dengan type alias `Angka` untuk `vector<int>`, lalu lengkapi tipe nilai balik fungsi `total` yang menjumlahkan isinya.",
          mode: "fill",
          template: `#include <iostream>
#include <vector>
using namespace std;

___ Angka = vector<int>;

___ total(const Angka& daftar) {
    int hasil = 0;
    for (int x : daftar) {
        hasil += x;
    }
    return hasil;
}

int main() {
    int n;
    cin >> n;
    Angka daftar;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        daftar.push_back(x);
    }
    cout << "jumlah: " << total(daftar) << "\\n";
    cout << "banyak: " << daftar.size() << "\\n";
    return 0;
}`,
          solution: `#include <iostream>
#include <vector>
using namespace std;

using Angka = vector<int>;

int total(const Angka& daftar) {
    int hasil = 0;
    for (int x : daftar) {
        hasil += x;
    }
    return hasil;
}

int main() {
    int n;
    cin >> n;
    Angka daftar;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        daftar.push_back(x);
    }
    cout << "jumlah: " << total(daftar) << "\\n";
    cout << "banyak: " << daftar.size() << "\\n";
    return 0;
}`,
          tests: [
            { stdin: "4\n3 1 4 1", expectedOutput: "jumlah: 9\nbanyak: 4" },
            { stdin: "1\n42", expectedOutput: "jumlah: 42\nbanyak: 1" },
            { stdin: "3\n-5 5 10", expectedOutput: "jumlah: 10\nbanyak: 3", hidden: true },
          ],
          hints: [
            "Deklarasi alias diawali kata using, lalu nama aliasnya, tanda sama dengan, dan tipe aslinya.",
            "Fungsi total mengembalikan hasil penjumlahan yang bertipe int.",
            "Jawabannya: using Angka = vector<int>; dan int total(const Angka& daftar).",
          ],
        },
      ],
    },
    {
      slug: "mod-default-member-init",
      title: "Default Member Initializer",
      summary: "Tulis nilai awal member langsung di deklarasinya supaya tidak ada data sampah.",
      steps: [
        {
          kind: "theory",
          title: "Nilai awal yang tinggal di tempatnya",
          body: "Member class atau struct yang tidak diinisialisasi berisi nilai sampah, dan itu salah satu sumber bug paling sulit dilacak. Sejak C++11, nilai awal bisa ditulis langsung di deklarasi member: `int stok = 0;`. Kini setiap objek baru lahir dengan nilai yang masuk akal.\n\nNilai default itu dipakai setiap kali constructor TIDAK menginisialisasi member tersebut. Constructor yang memberi nilai sendiri tetap menang. Hasilnya: struct sederhana tanpa constructor otomatis aman, dan constructor yang hanya mengisi sebagian member tidak meninggalkan sisanya kosong.\n\nFitur ini pasangan natural dari aggregate initialization. Dengan struct `Item` yang punya nilai default, penulisan `{\"Buku\"}` membuat satu member terisi dan sisanya mengambil nilai default. Kurang satu nilai pun program tetap terdefinisi rapi, tidak ada data sampah yang ikut terbawa.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <string>
using namespace std;

struct Titik {
    int x = 0;
    int y = 0;
    string label = "tanpa nama";
};

int main() {
    Titik a;
    Titik b{5};
    Titik c{3, 4, "pusat"};
    cout << a.x << "," << a.y << " " << a.label << "\\n";
    cout << b.x << "," << b.y << " " << b.label << "\\n";
    cout << c.x << "," << c.y << " " << c.label << "\\n";
    return 0;
}`,
            caption: "Member yang tidak diberi nilai tetap mendapat nilai defaultnya.",
          },
        },
        {
          kind: "quiz",
          question: "Kapan default member initializer seperti `int stok = 0;` benar benar dipakai?",
          options: [
            "Selalu, dan menimpa nilai dari constructor",
            "Hanya untuk member static",
            "Saat constructor tidak menginisialisasi member itu",
            "Hanya saat objek dibuat dengan new",
          ],
          answer: 2,
          explanation:
            "Constructor yang menulis sendiri nilai member menang. Default member initializer mengisi member yang ditinggalkan, jadi tidak ada yang bernilai sampah.",
        },
        {
          kind: "code",
          title: "Stok dengan nilai aman",
          prompt:
            "Lengkapi struct `Item` dengan default member initializer, lalu lengkapi hitungan sisa stok. Barang yang hanya diberi nama harus punya stok 0 dan terjual 0.",
          mode: "fill",
          template: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct Item {
    string nama;
    int stok ___;
    int terjual = 0;
};

int main() {
    vector<Item> item = {{"Buku"}, {"Pensil", 12}, {"Penghapus", 7, 2}};
    string cari;
    cin >> cari;
    for (const Item& it : item) {
        if (it.nama == cari) {
            int sisa = it.stok ___ it.terjual;
            cout << it.nama << " sisa " << sisa << "\\n";
        }
    }
    return 0;
}`,
          solution: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct Item {
    string nama;
    int stok = 0;
    int terjual = 0;
};

int main() {
    vector<Item> item = {{"Buku"}, {"Pensil", 12}, {"Penghapus", 7, 2}};
    string cari;
    cin >> cari;
    for (const Item& it : item) {
        if (it.nama == cari) {
            int sisa = it.stok - it.terjual;
            cout << it.nama << " sisa " << sisa << "\\n";
        }
    }
    return 0;
}`,
          tests: [
            { stdin: "Penghapus", expectedOutput: "Penghapus sisa 5" },
            { stdin: "Buku", expectedOutput: "Buku sisa 0" },
            { stdin: "Pensil", expectedOutput: "Pensil sisa 12", hidden: true },
          ],
          hints: [
            "Nilai default ditulis langsung di deklarasi member dengan tanda sama dengan, seperti terjual yang sudah benar.",
            "Sisa barang adalah stok dikurangi terjual.",
            "Jawabannya: int stok = 0; dan int sisa = it.stok - it.terjual;",
          ],
        },
      ],
    },
    {
      slug: "mod-nodiscard",
      title: "[[nodiscard]]: Jangan Buang Hasil",
      summary: "Kenali atribut [[nodiscard]] yang memerintahkan compiler memberi peringatan saat hasil fungsi diabaikan.",
      steps: [
        {
          kind: "theory",
          title: "Atribut yang menahan hasil agar tidak dibuang",
          body: "Beberapa fungsi mengembalikan hasil yang membahayakan kalau diabaikan: kode error, sisa pembagian, hasil konversi. Masalahnya, C++ membolehkan pemanggil menulis `hitungDiskon(total);` lalu melupakan nilai baliknya, tanpa suara dari compiler.\n\nAtribut `[[nodiscard]]` (C++17) dipasang di deklarasi fungsi untuk mengatakan: nilai balik ini jangan dibuang. Compiler lalu memberi peringatan setiap pemanggilan yang mengabaikan hasilnya. Peringatan, bukan error: program tetap terkompilasi, tetapi penyimpangannya terlihat di output build.\n\nAtribut ini sering muncul di kode pustaka dan di standar yang makin baru, jadi kamu akan sering membacanya, bukan sekadar menulisnya. Saat fungsi buatanmu punya kontrak hasil yang wajib dipakai, memasang `[[nodiscard]]` sejak awal jauh lebih murah daripada mengejar pemanggil yang lupa.",
          code: {
            language: "cpp",
            content: `#include <iostream>
using namespace std;

[[nodiscard]] int hitungDiskon(int total) {
    if (total >= 100000) {
        return total / 10;
    }
    return 0;
}

int main() {
    int diskon = hitungDiskon(120000);
    cout << "diskon: " << diskon << "\\n";
    return 0;
}`,
            caption: "Kalau baris pertama main diubah jadi panggilan telanjang tanpa menampung, compiler memberi peringatan.",
          },
        },
        {
          kind: "quiz",
          question: "Program yang memanggil fungsi [[nodiscard]] tetapi membuang hasilnya akan?",
          options: [
            "Gagal dikompilasi",
            "Berhenti saat runtime",
            "Otomatis menyimpan hasilnya ke variabel",
            "Tetap terkompilasi, tetapi compiler memberi peringatan",
          ],
          answer: 3,
          explanation:
            "[[nodiscard]] memicu warning, bukan error. Program tetap jalan, tetapi build yang memperlakukan warning serius akan menangkap pemanggilannya.",
        },
      ],
    },
    {
      slug: "mod-refactor-modern",
      title: "Refactor ke Gaya Modern",
      summary: "Gabungkan enum class, if dengan initializer, dan structured bindings dalam satu refactor.",
      steps: [
        {
          kind: "theory",
          title: "Merapikan kode lama tanpa mengubah perilaku",
          body: "Refactor berarti memperbaiki bentuk kode tanpa mengubah hasilnya. Dalam C++ modern, itu biasanya rangkaian langkah kecil: enum biasa jadi enum class, akses map lewat find dengan if initializer, pasangan iterator dibongkar dengan structured bindings, dan getter diberi const.\n\nDisiplinnya satu kalimat: ubah satu hal, jalankan program atau testnya, pastikan keluaran persis sama, baru lanjut ke perubahan berikutnya. Refactor yang mencampur banyak perubahan sekaligus adalah cara tercepat menambah bug sambil merasa produktif.\n\nLatihan penutup modul ini menggabungkan tiga idiom dari lesson sebelumnya dalam satu program kecil. Contoh berikut memperlihatkan bentuk lama dan bentuk modern dari loop yang sama, sebagai pemanasan sebelum kamu menulis sendiri.",
          code: {
            language: "cpp",
            content: `// SEBELUM
void cetak(map<string, int> m) {
    map<string, int>::iterator it;
    for (it = m.begin(); it != m.end(); it++) {
        cout << it->first << ": " << it->second << "\\n";
    }
}

// SESUDAH
void cetak(const map<string, int>& m) {
    for (const auto& [nama, nilai] : m) {
        cout << nama << ": " << nilai << "\\n";
    }
}`,
            caption: "Dua bentuk menghasilkan keluaran yang sama persis; bentuk modern lebih pendek dan lebih aman.",
          },
        },
        {
          kind: "code",
          title: "Tiga idiom dalam satu program",
          prompt:
            "Program pencarian barang ini memakai tiga idiom modern sekaligus: enum class, if dengan initializer, dan structured bindings. Lengkapi ketiga bagian kosongnya sampai semua tes lulus.",
          mode: "fill",
          template: `#include <iostream>
#include <map>
#include <string>
using namespace std;

enum ___ Kategori { Makanan, Elektronik };

struct Barang {
    string nama;
    int harga;
    Kategori kategori;
};

string label(Kategori k) {
    switch (k) {
        case Kategori::Makanan:
            return "makanan";
        case Kategori::Elektronik:
            return "elektronik";
    }
    return "?";
}

int main() {
    map<string, Barang> toko;
    toko["gula"] = {"Gula Pasir", 12000, Kategori::Makanan};
    toko["kabel"] = {"Kabel USB", 25000, Kategori::Elektronik};

    string cari;
    cin >> cari;
    if (___ it = toko.find(cari); it != toko.end()) {
        const auto& [kunci, barang] = ___;
        cout << barang.nama << " = " << barang.harga << " (" << label(barang.kategori) << ")\\n";
    } else {
        cout << "tidak dijual" << "\\n";
    }
    return 0;
}`,
          solution: `#include <iostream>
#include <map>
#include <string>
using namespace std;

enum class Kategori { Makanan, Elektronik };

struct Barang {
    string nama;
    int harga;
    Kategori kategori;
};

string label(Kategori k) {
    switch (k) {
        case Kategori::Makanan:
            return "makanan";
        case Kategori::Elektronik:
            return "elektronik";
    }
    return "?";
}

int main() {
    map<string, Barang> toko;
    toko["gula"] = {"Gula Pasir", 12000, Kategori::Makanan};
    toko["kabel"] = {"Kabel USB", 25000, Kategori::Elektronik};

    string cari;
    cin >> cari;
    if (auto it = toko.find(cari); it != toko.end()) {
        const auto& [kunci, barang] = *it;
        cout << barang.nama << " = " << barang.harga << " (" << label(barang.kategori) << ")\\n";
    } else {
        cout << "tidak dijual" << "\\n";
    }
    return 0;
}`,
          tests: [
            { stdin: "gula", expectedOutput: "Gula Pasir = 12000 (makanan)" },
            { stdin: "kabel", expectedOutput: "Kabel USB = 25000 (elektronik)" },
            { stdin: "sabun", expectedOutput: "tidak dijual", hidden: true },
          ],
          hints: [
            "Enum yang anggotanya wajib lewat awalan Kategori:: dideklarasikan dengan enum class.",
            "Tipe hasil find tidak perlu ditulis panjang, dan elemen map yang ditunjuk it dibuka dengan tanda bintang.",
            "Jawabannya: enum class, auto, dan *it.",
          ],
        },
      ],
    },
    // ==================== MODUL 9: Menuju Proyek Lapangan ====================
    {
      slug: "lap-multifile",
      title: "Program Multi-File dan g++",
      summary: "Pecah program jadi header dan source file, lalu satukan kembali dengan satu perintah g++.",
      steps: [
        {
          kind: "theory",
          title: "Satu proyek, banyak file",
          body: "Program nyata jarang berupa satu `main.cpp`. Kode biasanya dipecah jadi header (`.h`) yang berisi deklarasi dan source file (`.cpp`) yang berisi definisi. `main.cpp` memanggil fungsi util tanpa perlu tahu isinya; cukup membaca deklarasinya di `util.h`.\n\ng++ menerima daftar file sekaligus: `g++ main.cpp util.cpp -o app`. Setiap file dikompilasi menjadi unit terpisah, lalu linker menyambungkan setiap pemanggilan ke definisinya. Kalau deklarasi dan definisi tidak cocok, error muncul di fase linking dengan pesan tentang undefined reference.\n\nDi platform ini semua kode berjalan dalam satu file, jadi kita simulasikan bentuknya: deklarasi ditulis lebih dulu seperti yang akan ada di `util.h`, definisinya seperti isi `util.cpp`, dan `main` memanggilnya. Bentuk pikirannya yang penting: antarmuka dipisah dari implementasi.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <vector>
using namespace std;

// Deklarasi: di proyek nyata baris ini ada di util.h
int total(const vector<int>& daftar);

// Definisi: di proyek nyata blok ini ada di util.cpp
int total(const vector<int>& daftar) {
    int hasil = 0;
    for (int x : daftar) {
        hasil += x;
    }
    return hasil;
}

int main() {
    vector<int> nilai = {80, 75, 90};
    cout << "total: " << total(nilai) << "\\n";
    return 0;
}`,
            caption: "main memanggil total hanya dengan membaca deklarasinya, seperti memakai util.h sungguhan.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang dilakukan perintah `g++ main.cpp util.cpp -o app`?",
          options: [
            "Hanya mengompilasi main.cpp",
            "Mengompilasi kedua file lalu menautkannya menjadi satu program app",
            "Membuat dua program terpisah",
            "Menggabungkan isi util.cpp ke dalam main.cpp secara teks",
          ],
          answer: 1,
          explanation:
            "Kedua file dikompilasi menjadi unit objek masing masing, lalu linker menyatukannya menjadi satu program bernama app.",
        },
        {
          kind: "code",
          title: "Panggil fungsi dari file lain",
          prompt:
            "Simulasi proyek dua file: deklarasi `total` (dari util.h) dan definisinya (dari util.cpp) sudah ada. Lengkapi bagian yang kosong supaya main membaca n angka dan mencetak `total: <hasil>`.",
          mode: "fill",
          template: `#include <iostream>
#include <vector>
using namespace std;

// Deklarasi: biasanya tinggal di util.h
___ total(const vector<int>& daftar);

// Definisi: biasanya tinggal di util.cpp
int total(const vector<int>& daftar) {
    int hasil = 0;
    for (int x : daftar) {
        hasil += x;
    }
    return hasil;
}

int main() {
    int n;
    cin >> n;
    vector<int> daftar;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        daftar.push_back(x);
    }
    cout << "total: " << ___(daftar) << "\\n";
    return 0;
}`,
          solution: `#include <iostream>
#include <vector>
using namespace std;

// Deklarasi: biasanya tinggal di util.h
int total(const vector<int>& daftar);

// Definisi: biasanya tinggal di util.cpp
int total(const vector<int>& daftar) {
    int hasil = 0;
    for (int x : daftar) {
        hasil += x;
    }
    return hasil;
}

int main() {
    int n;
    cin >> n;
    vector<int> daftar;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        daftar.push_back(x);
    }
    cout << "total: " << total(daftar) << "\\n";
    return 0;
}`,
          tests: [
            { stdin: "3\n4 10 7", expectedOutput: "total: 21" },
            { stdin: "1\n9", expectedOutput: "total: 9" },
            { stdin: "5\n1 2 3 4 5", expectedOutput: "total: 15", hidden: true },
          ],
          hints: [
            "Deklarasi wajib menyebut tipe nilai balik fungsi, dan fungsi ini mengembalikan hasil penjumlahan.",
            "Yang dipanggil di dalam cout adalah fungsi yang deklarasinya berada di bagian atas file.",
            "Jawabannya: int pada deklarasi, dan total(daftar) di dalam cout.",
          ],
        },
      ],
    },
    {
      slug: "lap-cmake",
      title: "CMake: Resep Build Proyek",
      summary: "Rekam langkah build proyekmu sekali saja di CMakeLists.txt, jalankan berulang kali.",
      steps: [
        {
          kind: "theory",
          title: "Resep build yang tidak ikut diketik ulang",
          body: "Mengetik `g++ a.cpp b.cpp c.cpp -o app` setiap kali masih menyenangkan untuk dua file, lalu cepat melelahkan untuk sepuluh. CMake mengambil peran sebagai perekam resep build: kamu mendeskripsikan sekali nama programnya dan file sumber apa saja isinya, lalu alat yang menjalankan kompilasinya.\n\nInti resepnya adalah file `CMakeLists.txt`. Baris `cmake_minimum_required` menyatakan versi CMake minimal, `project` memberi nama proyek, dan `add_executable` menyebut nama program plus daftar source-nya. Dari resep sesederhana itu, CMake menyiapkan build untuk berbagai lingkungan dengan perintah yang sama.\n\nAlur kerjanya dua langkah. `cmake -B build` membaca resep dan menyiapkan folder build, lalu `cmake --build build` menjalankan kompilasi sesuai resep. Kode sumber dan hasil build terpisah rapi, dan anggota tim baru cukup menjalankan dua perintah yang sama seperti yang tertulis di README proyek.",
          code: {
            language: "cpp",
            content: `# CMakeLists.txt
cmake_minimum_required(VERSION 3.16)
project(aplikasi_stok)

add_executable(stok main.cpp stok.cpp laporan.cpp)`,
            caption: "Tiga baris resep: versi minimal, nama proyek, lalu nama program beserta file sumbernya.",
          },
        },
        {
          kind: "quiz",
          question: "Perintah CMake mana yang menyatakan nama program hasil build beserta file sumbernya?",
          options: [
            "project()",
            "cmake_minimum_required()",
            "add_executable()",
            "set()",
          ],
          answer: 2,
          explanation:
            "add_executable(nama file1 file2) mendefinisikan target program: namanya dan daftar file yang dikompilasi untuknya.",
        },
      ],
    },
    {
      slug: "lap-argv",
      title: "Parsing Argumen Baris Perintah",
      summary: "Baca perintah dan argumen pengguna, dari argc/argv sampai simulasi lewat stdin.",
      steps: [
        {
          kind: "theory",
          title: "Membaca perintah pengguna",
          body: "Program CLI menerima instruksi lewat argumen: pada `convert data.csv laporan.txt`, program `convert` membawa dua argumen. Di C++ itu diterima lewat `int main(int argc, char* argv[])`: `argc` menghitung banyaknya, `argv` berisi teksnya, dan `argv[0]` selalu nama program seperti yang dipanggil.\n\nArgumen datang sebagai teks, bukan angka. Konversikan dengan `stoi` atau `stol`, dan program yang sopan mengecek dulu apakah argumennya cukup sebelum mengakses `argv[1]` atau `argv[2]`. Mengakses indeks yang tidak ada membuat program crash, bukan error yang rapi.\n\nPlatform ini menjalankan program tanpa argumen nyata, jadi kita simulasikan: baris pertama stdin dianggap baris perintah, lalu dipecah per kata memakai `istringstream`. Logika parsingnya identik dengan membedah argv: pisahkan perintahnya, baca argumennya, baru kerjakan.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <sstream>
#include <string>
#include <vector>
using namespace std;

int main() {
    string baris;
    getline(cin, baris);
    istringstream in(baris);
    vector<string> arg;
    string kata;
    while (in >> kata) {
        arg.push_back(kata);
    }
    cout << "banyak argumen: " << arg.size() << "\\n";
    for (size_t i = 0; i < arg.size(); i++) {
        cout << i << ": " << arg[i] << "\\n";
    }
    return 0;
}`,
            caption: "Pemecah per kata ini bekerja sama seperti membedah argv, hanya sumbernya stdin.",
          },
        },
        {
          kind: "quiz",
          question: "Pada `int main(int argc, char* argv[])`, apa isi argv[0]?",
          options: [
            "Argumen pertama yang diketik pengguna",
            "Banyaknya argumen",
            "Nama program seperti yang dipanggil",
            "Selalu string kosong",
          ],
          answer: 2,
          explanation:
            "argv[0] adalah nama program itu sendiri. Argumen pengguna mulai dari argv[1], dan argc menghitung semuanya termasuk argv[0].",
        },
        {
          kind: "code",
          title: "Dua perintah dalam satu program",
          prompt:
            "Lengkapi CLI mini: baris pertama stdin adalah perintah. `jumlah <a> <b>` mencetak hasil penjumlahan dua angka, `besar <teks>` mencetak teks kapital, selain itu cetak `perintah tidak dikenal`.",
          mode: "fill",
          template: `#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include <cctype>
using namespace std;

int main() {
    string baris;
    getline(cin, baris);
    istringstream in(baris);
    vector<string> arg;
    string kata;
    while (in >> kata) {
        arg.push_back(kata);
    }

    if (arg.empty()) {
        cout << "tidak ada perintah\\n";
        return 0;
    }

    if (arg[0] == ___) {
        int a = ___(arg[1]);
        int b = stoi(arg[2]);
        cout << a + b << "\\n";
    } else if (arg[0] == "besar") {
        for (char c : arg[1]) {
            cout << (char)___(c);
        }
        cout << "\\n";
    } else {
        cout << "perintah tidak dikenal\\n";
    }
    return 0;
}`,
          solution: `#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include <cctype>
using namespace std;

int main() {
    string baris;
    getline(cin, baris);
    istringstream in(baris);
    vector<string> arg;
    string kata;
    while (in >> kata) {
        arg.push_back(kata);
    }

    if (arg.empty()) {
        cout << "tidak ada perintah\\n";
        return 0;
    }

    if (arg[0] == "jumlah") {
        int a = stoi(arg[1]);
        int b = stoi(arg[2]);
        cout << a + b << "\\n";
    } else if (arg[0] == "besar") {
        for (char c : arg[1]) {
            cout << (char)toupper(c);
        }
        cout << "\\n";
    } else {
        cout << "perintah tidak dikenal\\n";
    }
    return 0;
}`,
          tests: [
            { stdin: "jumlah 3 4", expectedOutput: "7" },
            { stdin: "besar kode", expectedOutput: "KODE" },
            { stdin: "sapu lantai", expectedOutput: "perintah tidak dikenal", hidden: true },
          ],
          hints: [
            "Perintah pertama dibandingkan dengan string literal yang sama dengan namanya.",
            "Argumen angka masih berupa teks; ada fungsi std yang mengubah teks menjadi int.",
            "Jawabannya: \"jumlah\", stoi, dan toupper.",
          ],
        },
      ],
    },
    {
      slug: "lap-stok",
      title: "Mini Proyek 1: Manajemen Stok",
      summary: "Bangun program stok berbasis perintah: tambah, cari, dan daftar barang dari stdin.",
      steps: [
        {
          kind: "theory",
          title: "Spesifikasi: stok toko dari baris perintah",
          body: "Program membaca perintah satu baris demi satu baris sampai baris `selesai`. Ada tiga perintah: `tambah <nama> <jumlah>` menambah stok (barang yang sama dijumlahkan), `cari <nama>` mencetak `nama jumlah` atau `nama tidak ada`, dan `list` mencetak seluruh isi stok terurut abjad dalam format `nama jumlah`.\n\nWadah yang tepat adalah `map<string, int>`: kuncinya nama barang, nilainya jumlah, dan map otomatis menyimpan kunci terurut sehingga perintah list tidak butuh sorting manual. Untuk `tambah`, kuncinya satu detail: barang yang sudah ada harus bertambah, bukan tertimpa nilainya.\n\nPerhatikan pola pembacaannya: `getline` di kondisi `while`, baris kosong dilewati, lalu kata pertama dibaca sebagai nama perintah. Pola ini bernama REPL (read, evaluate, print, loop) dan merupakan bentuk paling dasar dari program interaktif nyata, dari shell sampai bot pesan.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <sstream>
#include <string>
using namespace std;

// Kerangka program berbasis perintah
int main() {
    string baris;
    while (getline(cin, baris)) {
        istringstream in(baris);
        string perintah;
        if (!(in >> perintah)) continue; // baris kosong: lewati
        if (perintah == "selesai") break;
        // baca sisa argumen lalu kerjakan perintahnya
    }
    return 0;
}`,
            caption: "Skema while getline ini yang menopang seluruh mini proyek di modul ini.",
          },
        },
        {
          kind: "code",
          title: "Bangun program stok",
          prompt:
            "Bangun program stok dengan tiga perintah: `tambah <nama> <jumlah>`, `cari <nama>`, `list`, diakhiri baris `selesai`. Lengkapi dua bagian yang kosong, lalu pastikan ketiga tes lulus.",
          mode: "fill",
          template: `#include <iostream>
#include <map>
#include <sstream>
#include <string>
using namespace std;

int main() {
    map<string, int> stok;
    string baris;
    while (getline(cin, baris)) {
        istringstream in(baris);
        string perintah;
        if (!(in >> perintah)) continue;
        if (perintah == "selesai") break;

        if (perintah == "tambah") {
            string nama;
            int jumlah;
            in >> nama >> jumlah;
            stok[nama] ___ jumlah;
        } else if (perintah == "cari") {
            string nama;
            in >> nama;
            auto it = stok.find(nama);
            if (it != stok.end()) {
                cout << it->first << " " << it->second << "\\n";
            } else {
                cout << nama << " tidak ada\\n";
            }
        } else if (perintah == "list") {
            for (const auto& [nama, jumlah] : ___) {
                cout << nama << " " << jumlah << "\\n";
            }
        }
    }
    return 0;
}`,
          solution: `#include <iostream>
#include <map>
#include <sstream>
#include <string>
using namespace std;

int main() {
    map<string, int> stok;
    string baris;
    while (getline(cin, baris)) {
        istringstream in(baris);
        string perintah;
        if (!(in >> perintah)) continue;
        if (perintah == "selesai") break;

        if (perintah == "tambah") {
            string nama;
            int jumlah;
            in >> nama >> jumlah;
            stok[nama] += jumlah;
        } else if (perintah == "cari") {
            string nama;
            in >> nama;
            auto it = stok.find(nama);
            if (it != stok.end()) {
                cout << it->first << " " << it->second << "\\n";
            } else {
                cout << nama << " tidak ada\\n";
            }
        } else if (perintah == "list") {
            for (const auto& [nama, jumlah] : stok) {
                cout << nama << " " << jumlah << "\\n";
            }
        }
    }
    return 0;
}`,
          tests: [
            {
              stdin: "tambah buku 10\ntambah pensil 5\ntambah buku 2\nlist\nselesai",
              expectedOutput: "buku 12\npensil 5",
            },
            {
              stdin: "tambah gula 3\ncari gula\ncari garam\nselesai",
              expectedOutput: "gula 3\ngaram tidak ada",
            },
            {
              stdin: "tambah a 1\ntambah b 2\ntambah a 1\ncari a\nlist\nselesai",
              expectedOutput: "a 2\na 2\nb 2",
              hidden: true,
            },
          ],
          hints: [
            "Barang yang sudah ada harus bertambah jumlahnya, bukan tertimpa nilai barunya.",
            "Hasil find pada perintah cari dicek dulu terhadap end() sebelum dipakai.",
            "Jawabannya: stok[nama] += jumlah; dan for (const auto& [nama, jumlah] : stok).",
          ],
        },
      ],
    },
    {
      slug: "lap-statistik",
      title: "Mini Proyek 2: Statistik Nilai",
      summary: "Proses sekumpulan nilai ujian menjadi laporan lengkap dengan rata rata dua desimal.",
      steps: [
        {
          kind: "theory",
          title: "Spesifikasi: laporan nilai ujian",
          body: "Program membaca satu bilangan `n` lalu `n` nilai ujian (dipisah spasi). Keluarannya lima baris: banyak nilai, nilai terkecil, nilai terbesar, rata rata dengan dua angka desimal, dan banyak nilai yang berada di atas rata rata.\n\nKoleksinya `vector<int>`: isi dulu, lalu `min_element` dan `max_element` dari `<algorithm>` memberi iterator ke nilai ekstrem, tinggal dibuka dengan `*`. Rata rata dihitung dari total, dan totalnya dikonversi ke `double` sebelum dibagi supaya tidak terpotong menjadi bilangan bulat.\n\nSatu detail yang sering keliru: pembanding di atas rata rata. Nilai yang persis sama dengan rata rata tidak dihitung, jadi pembandingnya lebih besar secara ketat. Karena rata rata bertipe double, membandingkan `int` dengannya aman: int dinaikkan menjadi double secara otomatis oleh compiler.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> nilai = {70, 80, 90, 60};
    auto minim = min_element(nilai.begin(), nilai.end());
    auto maks = max_element(nilai.begin(), nilai.end());
    cout << "min: " << *minim << ", max: " << *maks << "\\n";

    double rata = 0;
    for (int x : nilai) {
        rata += x;
    }
    rata /= nilai.size();
    cout << "rata: " << rata << "\\n";
    return 0;
}`,
            caption: "min_element mengembalikan iterator; nilai aslinya dibuka dengan tanda bintang.",
          },
        },
        {
          kind: "code",
          title: "Lima baris laporan",
          prompt:
            "Lengkapi program laporan: baca n lalu n nilai, cetak `banyak`, `min`, `max`, `rata` (dua desimal), dan `di atas rata`. Nilai yang persis sama dengan rata rata tidak dihitung.",
          mode: "fill",
          template: `#include <iostream>
#include <vector>
#include <algorithm>
#include <iomanip>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> nilai(n);
    for (int i = 0; i < n; i++) {
        cin >> nilai[i];
    }

    int minim = *min_element(nilai.begin(), nilai.end());
    int maks = *max_element(nilai.begin(), nilai.end());
    int total = 0;
    for (int x : nilai) total += x;
    ___ rata = static_cast<double>(total) / n;

    int diAtas = 0;
    for (int x : nilai) {
        if (x ___ rata) diAtas++;
    }

    cout << "banyak: " << n << "\\n";
    cout << "min: " << minim << "\\n";
    cout << "max: " << maks << "\\n";
    cout << fixed << setprecision(2) << "rata: " << rata << "\\n";
    cout << "di atas rata: " << diAtas << "\\n";
    return 0;
}`,
          solution: `#include <iostream>
#include <vector>
#include <algorithm>
#include <iomanip>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> nilai(n);
    for (int i = 0; i < n; i++) {
        cin >> nilai[i];
    }

    int minim = *min_element(nilai.begin(), nilai.end());
    int maks = *max_element(nilai.begin(), nilai.end());
    int total = 0;
    for (int x : nilai) total += x;
    double rata = static_cast<double>(total) / n;

    int diAtas = 0;
    for (int x : nilai) {
        if (x > rata) diAtas++;
    }

    cout << "banyak: " << n << "\\n";
    cout << "min: " << minim << "\\n";
    cout << "max: " << maks << "\\n";
    cout << fixed << setprecision(2) << "rata: " << rata << "\\n";
    cout << "di atas rata: " << diAtas << "\\n";
    return 0;
}`,
          tests: [
            {
              stdin: "5\n70 80 90 60 100",
              expectedOutput: "banyak: 5\nmin: 60\nmax: 100\nrata: 80.00\ndi atas rata: 2",
            },
            {
              stdin: "1\n75",
              expectedOutput: "banyak: 1\nmin: 75\nmax: 75\nrata: 75.00\ndi atas rata: 0",
            },
            {
              stdin: "4\n50 50 70 30",
              expectedOutput: "banyak: 4\nmin: 30\nmax: 70\nrata: 50.00\ndi atas rata: 1",
              hidden: true,
            },
          ],
          hints: [
            "Rata rata yang terpotong bulatnya akan salah; hasil bagi harus bertipe pecahan.",
            "Di atas rata rata berarti lebih besar secara ketat, bukan lebih besar atau sama.",
            "Jawabannya: double rata = static_cast<double>(total) / n; dan if (x > rata).",
          ],
        },
      ],
    },
    {
      slug: "lap-csv-laporan",
      title: "Mini Proyek 3: CSV ke Laporan",
      summary: "Bedah baris CSV jadi kolom, hitung subtotal dan total, cetak laporan rapi.",
      steps: [
        {
          kind: "theory",
          title: "Spesifikasi: CSV jadi laporan",
          body: "Data masuk sebagai baris CSV tanpa header dengan tiga kolom: `nama,harga,jumlah`, misalnya `buku,15000,2`. Program mencetak satu baris per data dalam format `nama: jumlah x harga = subtotal`, lalu ditutup baris `total: <jumlah semua subtotal>`.\n\nKolom CSV dipotong dengan `getline` yang diberi argumen ketiga: `getline(in, kolom, ',')` membaca sampai koma berikutnya. Untuk kolom terakhir, getline berhenti di akhir baris, jadi tanpa koma pun aman. Angka yang masih berupa teks diubah dengan `stoi` sebelum dihitung.\n\nUrutan keluaran mengikuti urutan masukan, jadi wadahnya `vector`, bukan map: map akan mengurutkan nama dan menghapus urutan asli. Membungkus satu baris data dalam struct kecil juga membuat kode lebih jujur daripada tiga vector paralel yang bisa saling meleset.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main() {
    string baris = "buku,15000,2";
    istringstream in(baris);
    string nama, harga, jumlah;
    getline(in, nama, ',');
    getline(in, harga, ',');
    getline(in, jumlah, ',');
    cout << nama << " " << stoi(jumlah) * stoi(harga) << "\\n";
    return 0;
}`,
            caption: "getline dengan pembatas koma memotong satu baris CSV menjadi kolom teks.",
          },
        },
        {
          kind: "code",
          title: "Konverter CSV ke laporan",
          prompt:
            "Lengkapi konverter: baca semua baris `nama,harga,jumlah` dari stdin sampai habis, cetak satu baris laporan per data, lalu baris total. Urutan keluaran mengikuti urutan masukan.",
          mode: "fill",
          template: `#include <iostream>
#include <sstream>
#include <string>
#include <vector>
using namespace std;

struct Baris {
    string nama;
    int harga;
    int jumlah;
};

int main() {
    vector<Baris> data;
    string baris;
    while (getline(cin, baris)) {
        if (baris.empty()) continue;
        istringstream in(baris);
        string nama, sHarga, sJumlah;
        getline(in, nama, ___);
        getline(in, sHarga, ',');
        getline(in, sJumlah, ',');
        data.push_back({nama, ___(sHarga), ___(sJumlah)});
    }

    int total = 0;
    for (const Baris& b : data) {
        int subtotal = b.harga * b.jumlah;
        cout << b.nama << ": " << b.jumlah << " x " << b.harga << " = " << subtotal << "\\n";
        total += subtotal;
    }
    cout << "total: " << total << "\\n";
    return 0;
}`,
          solution: `#include <iostream>
#include <sstream>
#include <string>
#include <vector>
using namespace std;

struct Baris {
    string nama;
    int harga;
    int jumlah;
};

int main() {
    vector<Baris> data;
    string baris;
    while (getline(cin, baris)) {
        if (baris.empty()) continue;
        istringstream in(baris);
        string nama, sHarga, sJumlah;
        getline(in, nama, ',');
        getline(in, sHarga, ',');
        getline(in, sJumlah, ',');
        data.push_back({nama, stoi(sHarga), stoi(sJumlah)});
    }

    int total = 0;
    for (const Baris& b : data) {
        int subtotal = b.harga * b.jumlah;
        cout << b.nama << ": " << b.jumlah << " x " << b.harga << " = " << subtotal << "\\n";
        total += subtotal;
    }
    cout << "total: " << total << "\\n";
    return 0;
}`,
          tests: [
            {
              stdin: "buku,15000,2\npensil,3000,10",
              expectedOutput: "buku: 2 x 15000 = 30000\npensil: 10 x 3000 = 30000\ntotal: 60000",
            },
            {
              stdin: "kabel,25000,1",
              expectedOutput: "kabel: 1 x 25000 = 25000\ntotal: 25000",
            },
            {
              stdin: "gula,12000,3\nkopi,20000,2\nteh,5000,4",
              expectedOutput: "gula: 3 x 12000 = 36000\nkopi: 2 x 20000 = 40000\nteh: 4 x 5000 = 20000\ntotal: 96000",
              hidden: true,
            },
          ],
          hints: [
            "Pembatas CSV bukan spasi; getline menerima argumen ketiga berupa karakter pemisah.",
            "Harga dan jumlah masih berupa teks; ada fungsi std yang mengubahnya menjadi int.",
            "Jawabannya: getline(in, nama, ','); lalu data.push_back({nama, stoi(sHarga), stoi(sJumlah)});",
          ],
        },
      ],
    },
    {
      slug: "lap-error-compiler",
      title: "Membaca Error Compiler",
      summary: "Bedah pesan error dan warning, lalu latih disiplin debugging yang bisa diulang.",
      steps: [
        {
          kind: "theory",
          title: "Error compiler adalah pesan, bukan hinaan",
          body: "Kebiasaan yang paling menolong saat error: baca dari pesan PERTAMA. Compiler melaporkan semua yang ditemukan, tetapi error di awal biasanya yang asli, sedangkan error berikutnya hanya efek susulan. Perbaiki satu, kompilasi ulang, lihat sisanya.\n\nTiga keluarga error paling sering. `was not declared in this scope` berarti nama tidak dikenal: salah ketik, lupa include, atau deklarasi belum ditulis. `no matching function` berarti argumen tidak cocok dengan tipe yang diminta. `discards qualifiers` berarti method non-const dipanggil lewat objek const, seperti pada lesson const correctness. Ketiganya selalu menyertakan nomor baris: mulailah dari situ, jangan dari baris yang paling menakutkan.\n\nWarning layak diperlakukan seperti error. Variabel yang tidak pernah dipakai hampir selalu tanda ada logika yang terlewat, dan peringatan konversi yang memotong nilai tanda ada data yang menyusut diam diam. Disiplin debuggingnya bisa dilatih: pastikan masalahnya bisa dimunculkan ulang, persempit dengan `cout` di titik tengah program, perbaiki satu penyebab, lalu jalankan lagi dari awal.",
          code: {
            language: "cpp",
            content: `#include <iostream>
using namespace std;

int main() {
    int jumlah = 10;
    cout << jumlah << "\\n";
    return 0;
}`,
            caption: "Compiler menunjuk barisnya dan menyebut 'jumlah' was not declared in this scope: satu huruf yang salah ketik.",
          },
        },
        {
          kind: "quiz",
          question: "Compiler menampilkan `error: 'harga' was not declared in this scope`. Penyebab yang paling mungkin?",
          options: [
            "harga berisi nilai nol",
            "Memori komputer penuh",
            "harga ada di file lain sehingga pasti dilarang",
            "Nama harga belum dideklarasikan atau salah ketik",
          ],
          answer: 3,
          explanation:
            "Pesan ini berarti compiler tidak mengenal nama itu di scope tersebut. Cek salah ketik, urutan deklarasi, dan include yang kurang.",
        },
      ],
    },
    {
      slug: "lap-checklist",
      title: "Checklist Kesiapan Kerja",
      summary: "Ukur kesiapanmu dengan kebiasaan nyata: membaca error, kode terbaca, dan build yang bisa diulang.",
      steps: [
        {
          kind: "theory",
          title: "Tanda kamu siap menulis kode untuk orang lain",
          body: "Kelulusan jalur ini bukan soal hafalan, tapi soal kebiasaan. Cek sendiri: bisa tidak kamu membaca pesan error tanpa panik, memecah masalah besar menjadi fungsi kecil, dan memilih container karena alasannya (map untuk pencarian kunci, vector untuk urutan), bukan karena kebiasaan?\n\nChecklist berikutnya soal kerja bersama. Kode yang kamu tulis akan dibaca orang lain: nama yang jujur, fungsi yang pendek, dan langkah build yang bisa diulang siapa pun (seperti dua perintah CMake pada lesson sebelumnya) adalah bentuk sopan santun teknis. Determinisme juga masuk daftar: program yang hasilnya bergantung pada keberuntungan memori bukan program yang selesai.\n\nSatu ukuran sederhana untuk semua di atas: kalau kamu kembali ke kode sendiri setelah tiga minggu, bisa tidak kamu mengertinya dengan cepat tanpa menebak? Kalau jawabannya ya, kebiasaanmu sudah di jalur yang benar. Kalau tidak, lesson lesson modul ini adalah daftar yang perlu dilatih ulang.",
          code: {
            language: "cpp",
            content: `int hitungSubtotal(const vector<int>& hargaSatuan) {
    int total = 0;
    for (int harga : hargaSatuan) {
        total += harga;
    }
    return total;
}`,
            caption: "Nama yang menggambarkan maksud membuat kode terbaca tanpa perlu penjelasan.",
          },
        },
        {
          kind: "quiz",
          question: "Kebiasaan mana yang paling mencegah masalah program jalan di satu komputer tetapi gagal di komputer lain?",
          options: [
            "Menambah komentar di setiap baris",
            "Mencatat langkah build dan menjalankannya dengan perintah yang sama di mana pun",
            "Selalu memakai komputer yang sama",
            "Memperbanyak file header",
          ],
          answer: 1,
          explanation:
            "Langkah build yang tercatat dan bisa diulang (seperti resep CMake) membuat hasil build tidak bergantung pada ingatan satu orang.",
        },
      ],
    },
    {
      slug: "lap-ekosistem",
      title: "Peta Ekosistem C++ Modern",
      summary: "Rencanakan belajar lanjutan: standar baru, alat build, pengujian, dan pustaka pihak ketiga.",
      steps: [
        {
          kind: "theory",
          title: "Peta belajar setelah jalur ini",
          body: "Bahasa C++ bergerak dengan rilis standar setiap tiga tahun. C++20 membawa concepts dan ranges yang mengubah cara menulis template dan alur data, dan C++23 melanjutkannya. Tidak perlu buru buru: fondasi di jalur ini membuat fitur baru mudah ditangkap karena pola dasarnya sama.\n\nEkosistem alatnya juga patut dijelajahi. Untuk build, selain CMake ada generator seperti Ninja. Untuk pustaka pihak ketiga ada vcpkg dan Conan. Untuk pengujian ada GoogleTest dan Catch2. Untuk menangkap bug memori, compiler modern menyediakan sanitizer, misalnya AddressSanitizer lewat opsi `-fsanitize=address` pada saat kompilasi.\n\nCara belajar berikutnya yang paling menolong: membaca kode orang lain dan mengambil kontribusi kecil di proyek terbuka, plus melatih kebiasaan memecah program nyata menjadi file dan modul seperti pada lesson multi-file. Alat yang paling menentukan bukan daftar fitur baru, tetapi kebiasaan membaca error, menguji, dan memecah masalah.",
          code: {
            language: "cpp",
            content: `#include <concepts>

// Fitur C++20: requires membatasi template pada tipe yang memenuhi syarat
template <typename T>
requires std::integral<T>
T duaKali(T x) {
    return x * 2;
}`,
            caption: "Concepts (C++20) menuliskan syarat tipe langsung di deklarasi template.",
          },
        },
        {
          kind: "quiz",
          question: "Pustaka pengujian unit yang umum dipakai untuk C++ adalah?",
          options: ["JUnit", "pytest", "GoogleTest", "RSpec"],
          answer: 2,
          explanation:
            "GoogleTest dan Catch2 adalah pustaka pengujian populer untuk C++. JUnit untuk Java, pytest untuk Python, dan RSpec untuk Ruby.",
        },
      ],
    },
    {
      slug: "lap-rekap",
      title: "Rekap Jalur C++",
      summary: "Rangkum sepuluh modul perjalananmu dan tentukan proyek pertama yang akan kamu bangun.",
      steps: [
        {
          kind: "theory",
          title: "Sepuluh modul, satu kebiasaan",
          body: "Kamu mulai dari C++ modern sejak awal: reference, auto, range-for. Lalu class dan rule of three/five, STL container, algoritma dan lambda, string dan stream, memori dan smart pointer, template, penanganan error, praktik modern, sampai membangun program multi file dan mini proyek dari stdin.\n\nBenang merahnya satu: membuat compiler yang bekerja untukmu. auto dan structured bindings mengurangi tulisan yang bisa salah; const dan enum class menutup celah kesalahan; RAII dan smart pointer memindahkan beban manajemen memori ke objek; STL memberi struktur data yang sudah teruji. Kode C++ yang baik bukan kode yang paling pintar, melainkan yang paling susah disalahgunakan.\n\nLangkah berikutnya bukan menonton materi lagi, tapi membangun. Pilih masalah kecil milikmu sendiri, misalnya pelacak keuangan, pengubah format file, atau pengelola koleksi. Pecah jadi file, tulis resep CMake, jalankan dengan input nyata, dan rapikan setiap kali error muncul. Setiap lesson di jalur ini adalah pola yang bisa dipakai ulang di program pertamamu yang sungguhan.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <map>
#include <string>
using namespace std;

void tampilkanStok(const map<string, int>& stok) {
    for (const auto& [nama, jumlah] : stok) {
        cout << nama << ": " << jumlah << "\\n";
    }
}

int main() {
    map<string, int> stok = {{"buku", 3}, {"pensil", 10}};
    string cari;
    cin >> cari;
    if (auto it = stok.find(cari); it != stok.end()) {
        cout << "stok " << it->second << "\\n";
    } else {
        tampilkanStok(stok);
    }
    return 0;
}`,
            caption: "Empat idiom jalur ini bertemu dalam satu program kecil: const correctness, structured bindings, map, dan if dengan initializer.",
          },
        },
        {
          kind: "quiz",
          question: "Inti dari RAII yang dipakai smart pointer dan container di sepanjang jalur ini adalah?",
          options: [
            "Memori dialokasikan di tempat acak agar cepat",
            "Semua sumber daya harus global",
            "Programmer wajib memanggil delete di setiap jalur kode",
            "Umur sumber daya diikat ke umur objek: diperoleh di constructor, dilepas di destructor",
          ],
          answer: 3,
          explanation:
            "RAII menyatukan kepemilikan sumber daya dengan masa hidup objek. Saat objek keluar dari scope, destructor melepas sumber dayanya secara otomatis.",
        },
      ],
    },
  ],
};
