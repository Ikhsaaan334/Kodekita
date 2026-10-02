import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "cpp",
  moduleRange: [4, 5],
  modules: [
    {
      title: "String dan Stream",
      description: "std::string, stringstream, file stream, dan parsing input teks.",
    },
    {
      title: "Memori dan Smart Pointer",
      description: "RAII, unique_ptr, shared_ptr, dan menghindari new/delete manual.",
    },
  ],
  lessons: [
    // ==================== MODUL 4: String dan Stream ====================
    {
      slug: "str-dasar-concat",
      title: "std::string: Lebih dari Sekadar Teks",
      summary: "Sambung, hitung, dan akses karakter std::string tanpa mengurus buffer.",
      steps: [
        {
          kind: "theory",
          title: "Teks yang mengurus dirinya sendiri",
          body: "Kamu sudah sering memakai `string` untuk membaca kata dari `cin`. Lesson ini mengangkatnya dari tipe teks biasa menjadi alat kerja penuh: `std::string` adalah class yang memiliki dan mengurus memorinya sendiri, jadi menyambung, menyalin, dan memperbesar teks tidak pernah melibatkan perhitungan buffer manual seperti di C.\n\nMenyambung string memakai `+` atau `+=`. Ada satu aturan yang sering mengejutkan: minimal satu sisi `+` harus bertipe `string`. Kalau kedua sisanya literal teks seperti `\"kode\" + \"kita\"`, compiler menolak karena itu terbaca sebagai aritmetika pointer, bukan penyambungan.\n\nPanjang teks dibaca dengan `size()` (padanannya `length()`, keduanya sama persis). Karakter tunggal diakses lewat indeks seperti vector: `s[0]` huruf pertama. Ingat juga bahwa `cin >> s` berhenti di spasi pertama; membaca satu baris penuh punya lesson tersendiri di depan.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string depan = "kode";
    string belakang = "kita";
    string penuh = depan + belakang;
    penuh += "!";
    cout << penuh << endl;
    cout << "panjang: " << penuh.size() << endl;
    cout << "huruf pertama: " << penuh[0] << endl;
    return 0;
}`,
            caption: "+ menyambung string, += menambah di belakang, size() menghitung karakter.",
          },
        },
        {
          kind: "quiz",
          question: "Apa keluaran dari kode berikut?\n\n```cpp\nstring depan = \"kode\";\nstring belakang = \"kita\";\ncout << depan + \" \" + belakang;\n```\n\nPerhatikan ada spasi di tengah.",
          options: ["kodekita", "kode kita", "kode+kita", "Error, string tidak bisa ditambah"],
          answer: 1,
          explanation:
            "Operator + menyambung string satu per satu. Karena ada literal spasi di tengah, hasilnya adalah kode kita, bukan kodekita.",
        },
        {
          kind: "code",
          title: "Sambung dua kata dan hitung panjangnya",
          prompt: "Lengkapi program: baca dua kata dari input, cetak gabungannya tanpa spasi, lalu cetak banyak karakternya. Ganti setiap `___` dengan kode yang tepat.",
          mode: "fill",
          template: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string kata1, kata2;
    cin >> kata1 >> kata2;
    string gabungan = kata1 ___ kata2;
    cout << gabungan << "\\n";
    cout << "panjang: " << gabungan.___() << "\\n";
    return 0;
}`,
          solution: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string kata1, kata2;
    cin >> kata1 >> kata2;
    string gabungan = kata1 + kata2;
    cout << gabungan << "\\n";
    cout << "panjang: " << gabungan.size() << "\\n";
    return 0;
}`,
          tests: [
            { stdin: "kode kita", expectedOutput: "kodekita\npanjang: 8" },
            { stdin: "belajar cpp", expectedOutput: "belajarcpp\npanjang: 10" },
            { stdin: "halo dunia", expectedOutput: "halodunia\npanjang: 9", hidden: true },
          ],
          hints: [
            "Operator penyambung string sudah muncul di teori.",
            "Banyak karakter sebuah string dibaca lewat fungsi yang mengembalikan ukurannya.",
            "Jawabannya: + pada penyambungan, dan size untuk panjang.",
          ],
        },
      ],
    },
    {
      slug: "str-find-substr-replace",
      title: "substr, find, dan replace",
      summary: "Potong, cari, dan ganti bagian string dengan substr, find, dan replace.",
      steps: [
        {
          kind: "theory",
          title: "Tiga operasi pemotongan, pencarian, dan penggantian",
          body: "Tiga method inilah pisau utama membedah string. `substr(pos, len)` mengembalikan salinan sepanjang `len` karakter mulai indeks `pos`; kalau `len` tidak diberi, potongannya berjalan sampai akhir teks. Ia mengembalikan string baru, jadi string aslinya tidak berubah.\n\n`find(teks)` mencari kemunculan pertama dan mengembalikan indeksnya. Kalau tidak ditemukan, ia mengembalikan nilai spesial `string::npos`, bukan -1 seperti di beberapa bahasa lain. Karena itu hasil `find` selalu dicek dulu sebelum dipakai: `if (s.find(\"x\") != string::npos)`. Pasangannya `rfind` mencari dari belakang.\n\n`replace(pos, len, teksBaru)` mengganti `len` karakter mulai indeks `pos` dengan `teksBaru`. Panjang teks baru boleh berbeda dari `len`; string menyesuaikan ukurannya sendiri. Kombinasi find lalu replace adalah pola standar untuk mengganti kemunculan pertama sebuah subteks.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string kalimat = "belajar cpp itu menyenangkan";
    size_t pos = kalimat.find("cpp");
    if (pos != string::npos) {
        cout << "cpp ditemukan di indeks " << pos << endl;
        cout << "tiga huruf dari situ: " << kalimat.substr(pos, 3) << endl;
    }
    string diganti = kalimat;
    diganti.replace(pos, 3, "C++");
    cout << diganti << endl;
    return 0;
}`,
            caption: "find memberi posisi, substr mengambil salinan, replace mengganti di tempat.",
          },
        },
        {
          kind: "quiz",
          question: "Apa hasil dari `string kata = \"belajar\";` lalu `kata.substr(2, 3)`?",
          options: ["\"ela\"", "\"laj\"", "\"laja\"", "\"bel\""],
          answer: 1,
          explanation:
            "substr(2, 3) mengambil tiga karakter mulai indeks 2. Indeks 0 adalah b dan 1 adalah e, jadi indeks 2 adalah l: hasilnya l, a, j.",
        },
        {
          kind: "code",
          title: "Sensor kata pertama yang cocok",
          prompt: "Lengkapi program: baca satu kata teks dan satu kata target. Kalau target ada di dalam teks, ganti kemunculan pertamanya dengan `***`, lalu cetak hasilnya. Kalau tidak ada, cetak teks apa adanya.",
          mode: "fill",
          template: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string teks, target;
    cin >> teks >> target;
    size_t pos = teks.___(target);
    if (pos != string::npos) {
        teks.___(pos, target.size(), "***");
    }
    cout << teks << "\\n";
    return 0;
}`,
          solution: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string teks, target;
    cin >> teks >> target;
    size_t pos = teks.find(target);
    if (pos != string::npos) {
        teks.replace(pos, target.size(), "***");
    }
    cout << teks << "\\n";
    return 0;
}`,
          tests: [
            { stdin: "sandal\ndal", expectedOutput: "san***" },
            { stdin: "pinta\nz", expectedOutput: "pinta" },
            { stdin: "gundam\ngun", expectedOutput: "***dam", hidden: true },
          ],
          hints: [
            "Mencari posisi kemunculan pertama adalah kerja satu method yang namanya sesuai fungsinya.",
            "Penggantian butuh posisi awal, panjang yang diganti, dan teks penggantinya.",
            "Jawabannya: find untuk mencari, dan replace(pos, panjang, teksBaru) untuk mengganti.",
          ],
        },
      ],
    },
    {
      slug: "str-sort-banding",
      title: "Membandingkan dan Mengurutkan String",
      summary: "Pahami perbandingan leksikografis dan urutkan kumpulan string dengan sort.",
      steps: [
        {
          kind: "theory",
          title: "Urutan versi komputer, bukan versi kamus",
          body: "String bisa dibandingkan dengan semua operator biasa: `==`, `!=`, `<`, `>`. Perbandingannya leksikografis, tapi dasar penilaiannya adalah kode karakter, bukan kamus bahasa manusia. Konsekuensinya: `\"Zebra\" < \"apple\"` bernilai true, karena kode `'Z'` adalah 90 dan `'a'` adalah 97. Huruf kapital semua mendahului huruf kecil.\n\nKonsekuensi kedua: angka pun ikut urutan kode. `\"file10\"` dianggap lebih kecil dari `\"file9\"`, karena `'1'` (49) lebih kecil dari `'9'` (57). Urutan seperti ini disebut leksikografis murni; kalau butuh urutan versi manusia, kamu harus menulis comparator sendiri.\n\nUntuk mengurutkan kumpulan string, polanya sama persis dengan vector angka di modul algoritma: `sort(kata.begin(), kata.end())` tanpa comparator sudah menghasilkan urutan naik leksikografis. Comparator lambda baru dibutuhkan kalau kamu ingin urutan lain, misalnya mengabaikan besar kecil huruf dengan mengubah kedua sisi ke huruf kecil dulu sebelum dibandingkan.",
          code: {
            language: "cpp",
            content: `#include <algorithm>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    vector<string> kata = {"pisang", "Apel", "ceri", "anggur"};
    sort(kata.begin(), kata.end());
    for (const string& k : kata) {
        cout << k << endl;
    }
    return 0;
}`,
            caption: "Apel mendahului anggur karena kode 'A' lebih kecil dari 'a'.",
          },
        },
        {
          kind: "quiz",
          question: "Menurut perbandingan string C++, mana yang lebih besar?",
          options: [
            "Zebra, karena huruf kapital selalu didahulukan",
            "apple, karena huruf kecil punya kode karakter lebih besar",
            "keduanya sama",
            "string tidak bisa dibandingkan dengan >",
          ],
          answer: 1,
          explanation:
            "Perbandingan memakai kode karakter. 'Z' bernilai 90 dan 'a' bernilai 97, jadi apple lebih besar dari Zebra meski kamus manusia mengatakan sebaliknya.",
        },
        {
          kind: "code",
          title: "Urutkan daftar kata",
          prompt: "Lengkapi program: baca `n`, lalu `n` buah kata, dan cetak semua kata dalam urutan naik leksikografis (perilaku bawaan sort), satu per baris.",
          mode: "fill",
          template: `#include <algorithm>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<string> kata(n);
    for (int i = 0; i < n; i++) {
        cin >> kata[i];
    }
    ___(kata.begin(), kata.end());
    for (const string& k : kata) {
        cout << k << "\\n";
    }
    return 0;
}`,
          solution: `#include <algorithm>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<string> kata(n);
    for (int i = 0; i < n; i++) {
        cin >> kata[i];
    }
    sort(kata.begin(), kata.end());
    for (const string& k : kata) {
        cout << k << "\\n";
    }
    return 0;
}`,
          tests: [
            { stdin: "3\nceri\napel\nmangga", expectedOutput: "apel\nceri\nmangga" },
            { stdin: "4\nZaki\nzaki\nAli\nbudi", expectedOutput: "Ali\nZaki\nbudi\nzaki" },
            { stdin: "2\nsatu\ndua", expectedOutput: "dua\nsatu", hidden: true },
          ],
          hints: [
            "Urutan naik adalah perilaku bawaan; tidak perlu comparator apa pun.",
            "Fungsi pengurutnya sudah kamu pakai di modul algoritma.",
            "Jawabannya: sort(kata.begin(), kata.end()).",
          ],
        },
      ],
    },
    {
      slug: "str-sstream-kata",
      title: "stringstream: Memecah Baris jadi Kata",
      summary: "Pecah satu baris kalimat menjadi kata-kata dengan getline dan stringstream.",
      steps: [
        {
          kind: "theory",
          title: "Stream yang sumbernya sebuah string",
          body: "`cin >> kata` hanya mengambil satu kata. Untuk membedah satu baris penuh, polanya dua langkah: `getline(cin, baris)` mengambil seluruh baris, lalu baris itu disalurkan ke sebuah `stringstream`, stream yang berperilaku seperti `cin` tetapi sumbernya adalah string yang kamu berikan.\n\nDari situ membaca semua kata menjadi loop yang sangat khas: `while (ss >> kata)`. Setiap iterasi mengambil satu kata dan melewati spasi berapa pun jumlahnya. Loop berhenti otomatis saat isi stringstream habis, karena ekstraksi yang gagal membuat stream masuk kondisi gagal dan `while` membacanya sebagai false.\n\nSemua ini butuh header `<sstream>`. `stringstream` sendiri versi dua arah: bisa dibaca seperti di sini, bisa juga ditulis. Untuk kejelasan, lesson lain di modul ini memakai versi khususnya, `istringstream` dan `ostringstream`.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main() {
    string kalimat = "saya sedang belajar cpp";
    stringstream ss(kalimat);
    string kata;
    int nomor = 1;
    while (ss >> kata) {
        cout << nomor << ": " << kata << endl;
        nomor++;
    }
    return 0;
}`,
            caption: "stringstream memperlakukan isi string seperti input: >> mengambil satu kata per langkah.",
          },
        },
        {
          kind: "quiz",
          question: "Pola loop mana yang membaca seluruh kata dari sebuah `stringstream ss` sampai habis?",
          options: ["for (kata : ss)", "while (ss >> kata)", "while (ss.next(kata))", "if (ss >> kata)"],
          answer: 1,
          explanation:
            "Ekstraksi >> mengembalikan stream itu sendiri, dan stream bisa dinilai sebagai kondisi: true selama ekstraksi terakhir berhasil. Itulah cara idiomatik membaca sampai habis.",
        },
        {
          kind: "code",
          title: "Pecah kalimat dan hitung katanya",
          prompt: "Lengkapi program: baca satu baris penuh, cetak setiap kata di baris sendiri, lalu cetak totalnya dengan format `total: N kata`.",
          mode: "fill",
          template: `#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main() {
    string baris;
    getline(cin, baris);
    stringstream ss(baris);
    string kata;
    int jumlah = 0;
    while (___ >> kata) {
        cout << kata << "\\n";
        jumlah++;
    }
    cout << "total: " << jumlah << " kata\\n";
    return 0;
}`,
          solution: `#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main() {
    string baris;
    getline(cin, baris);
    stringstream ss(baris);
    string kata;
    int jumlah = 0;
    while (ss >> kata) {
        cout << kata << "\\n";
        jumlah++;
    }
    cout << "total: " << jumlah << " kata\\n";
    return 0;
}`,
          tests: [
            { stdin: "saya suka kode", expectedOutput: "saya\nsuka\nkode\ntotal: 3 kata" },
            { stdin: "satu", expectedOutput: "satu\ntotal: 1 kata" },
            { stdin: "a b c d", expectedOutput: "a\nb\nc\nd\ntotal: 4 kata", hidden: true },
          ],
          hints: [
            "Yang membaca dari stringstream adalah operator >>, tinggal sebut sumbernya.",
            "Sumbernya adalah stream yang sudah dibuat dari baris tersebut.",
            "Jawabannya: while (ss >> kata).",
          ],
        },
      ],
    },
    {
      slug: "str-sstream-angka",
      title: "Parsing Angka dari Satu Baris",
      summary: "Ekstrak deretan angka dari satu baris teks dan ringkas nilai terbesarnya.",
      steps: [
        {
          kind: "theory",
          title: "Satu baris, banyak angka",
          body: "Soal klasik I/O C++: satu baris berisi beberapa angka, dan banyaknya baru diketahui saat program berjalan. Dengan `cin >> x` saja kamu tidak bisa tahu kapan barisnya selesai. Jalur yang rapi: `getline` ambil satu baris utuh, serahkan ke `stringstream`, lalu ekstrak angka satu per satu dengan loop.\n\n`while (ss >> x)` dengan `x` bertipe `int` berhenti saat angka habis, dan juga berhenti kalau ketemu token yang bukan angka: stream masuk kondisi gagal dan loop berhenti di situ. Untuk input yang dijamin berisi angka saja, perilaku itu pas sebagai batas akhir.\n\nAda satu teknik kecil yang sering menyelamatkan: pembacaan pemanasan. Nilai pertama dibaca sebelum loop, sehingga variabel `total` dan `maks` bisa diinisialisasi dari angka sungguhan, bukan dari tebakan seperti nol yang salah begitu semua inputnya negatif. Setelah itu loop tinggal memperbarui kedua penampung.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main() {
    string baris = "80 90 75";
    stringstream ss(baris);
    int nilai;
    int total = 0;
    int banyak = 0;
    while (ss >> nilai) {
        total += nilai;
        banyak++;
    }
    cout << "rata-rata: " << (double)total / banyak << endl;
    return 0;
}`,
            caption: "Angka diekstrak bertipe int langsung dari string; tidak ada konversi manual.",
          },
        },
        {
          kind: "quiz",
          question: "Sebuah baris berisi `12 34 abc 56`. Program mengekstraknya dengan `while (ss >> x)` di mana `x` bertipe `int`. Berapa angka yang berhasil dibaca?",
          options: ["4", "3", "2", "1"],
          answer: 2,
          explanation:
            "12 dan 34 terbaca. Saat tiba di abc, ekstraksi ke int gagal, stream masuk kondisi gagal, dan loop berhenti. Angka 56 tidak pernah terbaca.",
        },
        {
          kind: "code",
          title: "Total dan nilai terbesar satu baris",
          prompt: "Lengkapi program: baca satu baris berisi beberapa bilangan bulat, lalu cetak `total: X` dan `terbesar: Y`. Angka pertama sudah dibaca sebelum loop supaya maksimum punya titik awal yang benar.",
          mode: "fill",
          template: `#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main() {
    string baris;
    getline(cin, baris);
    stringstream ss(baris);
    int x;
    ___ >> x;
    int total = x;
    int maks = x;
    while (ss >> x) {
        total += x;
        if (x > maks) {
            ___;
        }
    }
    cout << "total: " << total << "\\n";
    cout << "terbesar: " << maks << "\\n";
    return 0;
}`,
          solution: `#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main() {
    string baris;
    getline(cin, baris);
    stringstream ss(baris);
    int x;
    ss >> x;
    int total = x;
    int maks = x;
    while (ss >> x) {
        total += x;
        if (x > maks) {
            maks = x;
        }
    }
    cout << "total: " << total << "\\n";
    cout << "terbesar: " << maks << "\\n";
    return 0;
}`,
          tests: [
            { stdin: "10 20 30", expectedOutput: "total: 60\nterbesar: 30" },
            { stdin: "5", expectedOutput: "total: 5\nterbesar: 5" },
            { stdin: "-3 7 -1", expectedOutput: "total: 3\nterbesar: 7", hidden: true },
          ],
          hints: [
            "Pembacaan pemanasan membaca dari stream yang sama dengan loop di bawahnya.",
            "Ketika angka baru lebih besar dari maks, maks harus diperbarui dengan angka itu.",
            "Jawabannya: ss >> x untuk pembacaan pertama, dan maks = x di dalam if.",
          ],
        },
      ],
    },
    {
      slug: "str-getline-newline",
      title: "Jebakan Newline: getline Setelah cin >>",
      summary: "Kenali jebakan newline saat mencampur cin >> dengan getline, dan cara membersihkannya.",
      steps: [
        {
          kind: "theory",
          title: "Karakter sisa yang merusak pembacaan",
          body: "Ini jebakan I/O yang paling sering menggigit pemrogram C++. Operator `cin >> n` berhenti membaca begitu angkanya selesai, dan karakter newline hasil tombol Enter tetap tertinggal di buffer input. `getline` yang dipanggil sesudahnya membaca mulai dari sisa itu, ketemu newline pada huruf pertama, dan langsung selesai: hasilnya string kosong.\n\nGejalanya khas: program tampak melompati satu input. Input pertama berupa baris teks selalu kosong, sementara input-input berikutnya bergeser satu tempat. Bukan `getline` yang rusak, ia justru bekerja sesuai spesifikasi, hanya saja ada sampah di depan jalurnya.\n\nObatnya satu baris: `cin.ignore()` setelah `cin >>`, yang membuang satu karakter berikutnya dari buffer, tepat newline yang tertinggal. Untuk kasus yang lebih kurus (misalnya ada spasi sisa), bentuk lengkapnya adalah `cin.ignore(numeric_limits<streamsize>::max(), '\\n')` dari header `<limits>`, yang membuang semua karakter sampai newline. Kaidahnya: setiap kali `>>` bertemu `getline` di alur yang sama, beri pembersih di antaranya.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <string>
using namespace std;

int main() {
    int n;
    cin >> n;
    cin.ignore(); // buang newline yang tertinggal di buffer
    string baris;
    getline(cin, baris);
    cout << "[" << baris << "]" << endl;
    return 0;
}`,
            caption: "Tanpa cin.ignore(), baris yang tercetak akan kosong.",
          },
        },
        {
          kind: "quiz",
          question: "Inputnya adalah baris `3` lalu baris `Budi`. Apa isi `s` setelah kode ini?\n\n```cpp\nint n;\ncin >> n;\nstring s;\ngetline(cin, s);\n```",
          options: ["\"Budi\"", "\"3\"", "string kosong", "program error"],
          answer: 2,
          explanation:
            "cin >> n meninggalkan newline di buffer. getline langsung menemukan newline itu dan selesai tanpa membaca apa pun, jadi s kosong. Baris Budi masih mengantre di buffer.",
        },
        {
          kind: "code",
          title: "Perbaiki daftar nama yang bergeser",
          prompt: "Program ini seharusnya membaca `n` lalu `n` baris nama, kemudian menampilkannya bernomor. Saat dijalankan, nama pertama hilang dan penggantinya baris kosong. Cari penyebabnya dan perbaiki sampai semua tes lulus.",
          mode: "fix",
          template: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<string> nama(n);
    for (int i = 0; i < n; i++) {
        getline(cin, nama[i]);
    }
    for (int i = 0; i < n; i++) {
        cout << i + 1 << ". " << nama[i] << "\\n";
    }
    return 0;
}`,
          solution: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    cin.ignore();
    vector<string> nama(n);
    for (int i = 0; i < n; i++) {
        getline(cin, nama[i]);
    }
    for (int i = 0; i < n; i++) {
        cout << i + 1 << ". " << nama[i] << "\\n";
    }
    return 0;
}`,
          tests: [
            { stdin: "3\nsiti\nbudi\nani", expectedOutput: "1. siti\n2. budi\n3. ani" },
            { stdin: "1\ndewi", expectedOutput: "1. dewi" },
            { stdin: "2\nalgo ritma\ncpp plus", expectedOutput: "1. algo ritma\n2. cpp plus", hidden: true },
          ],
          hints: [
            "Jalankan dengan satu nama: yang keluar adalah 1. (kosong). getline membaca sesuatu yang bukan nama.",
            "cin >> n tidak memakan tombol Enter. Karakter newline itu masih di buffer saat getline pertama berjalan.",
            "Tambahkan cin.ignore(); tepat setelah cin >> n.",
          ],
        },
      ],
    },
    {
      slug: "str-sstream-dua-arah",
      title: "istringstream dan ostringstream",
      summary: "Gunakan istringstream untuk parsing dan ostringstream untuk menyusun teks.",
      steps: [
        {
          kind: "theory",
          title: "Versi khusus untuk baca dan untuk susun",
          body: "`stringstream` adalah nama umum yang bisa dua arah, tapi `sstream` juga menyediakan dua versi khusus yang lebih jelas niatnya. `istringstream` adalah stream yang sumbernya string: cocok untuk parsing, seperti memecah baris menjadi kata atau angka. `ostringstream` adalah stream yang tujuannya string: cocok untuk menyusun teks potongan demi potongan.\n\n`ostringstream` membawa pola yang berguna: bangun sekali, cetak sekali. Semua potongan dikumpulkan lewat `<<`, lalu hasil akhirnya diambil dengan method `str()`. Ini lebih rapi daripada mencetak berulang ke `cout` ketika hasilnya harus jadi satu string utuh, misalnya untuk log atau pesan error yang disusun bertahap.\n\nKeduanya memakai operator dan loop yang sama seperti `cin`, `cout`, dan `stringstream`, jadi tidak ada sintaks baru yang perlu dihafal. Yang berubah hanya pilihan tipe: pilih yang paling sempit sesuai arah datamu, dan maksud kode jadi terbaca dari deklarasinya.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main() {
    istringstream masukan("10 20 30");
    int a, b, c;
    masukan >> a >> b >> c;
    cout << a + b + c << endl;

    ostringstream keluaran;
    keluaran << "hasil akhir: " << a * b * c;
    string laporan = keluaran.str();
    cout << laporan << endl;
    return 0;
}`,
            caption: "istringstream untuk membaca string, ostringstream untuk menyusun string lewat str().",
          },
        },
        {
          kind: "quiz",
          question: "Method apa yang mengambil hasil rangkaian teks dari sebuah `ostringstream`?",
          options: ["ambil()", "str()", "toString()", "get()"],
          answer: 1,
          explanation:
            "str() mengembalikan seluruh isi ostringstream sebagai std::string. Setelah itu string bebas dipakai seperti string biasa.",
        },
      ],
    },
    {
      slug: "str-fstream-dasar",
      title: "Membaca dan Menulis File dengan fstream",
      summary: "Baca dan tulis file dengan ifstream dan ofstream memakai pola yang sama dengan cin dan cout.",
      steps: [
        {
          kind: "theory",
          title: "Stream yang tujuannya file",
          body: "Keluarga `<fstream>` membawa cara kerja `cin` dan `cout` ke dunia file: `ifstream` untuk membaca, `ofstream` untuk menulis, dan `fstream` untuk keduanya. Pola pemakaiannya persis yang sudah kamu kuasai: `<<` untuk menulis, `getline` untuk membaca baris. Hanya sumber dan tujuannya yang berpindah dari terminal ke file.\n\nSatu kebiasaan wajib: cek `is_open()` sebelum memakai file. Pembukaan yang gagal (file tidak ada, tanpa izin) tidak melempar exception secara bawaan; stream cuma menandai dirinya gagal, dan kode lanjut membaca seolah file kosong. Satu if kecil mengubah kegagalan senyap menjadi pesan yang jelas.\n\nCatatan untuk platform ini: judge hanya menyediakan stdin dan stdout, jadi latihan file stream di sini cukup sampai pemahaman. Saat kamu memakainya di proyek nyata, perhatikan juga bahwa destructor stream menutup file otomatis, pola RAII yang akan kita bedah tuntas di modul berikutnya; `close()` eksplisit hanya perlu kalau file harus selesai sebelum titik lain di program.",
          code: {
            language: "cpp",
            content: `#include <fstream>
#include <iostream>
#include <string>
using namespace std;

int main() {
    ofstream keluar("catatan.txt");
    keluar << "baris pertama" << endl;
    keluar << "baris kedua" << endl;
    keluar.close();

    ifstream masukan("catatan.txt");
    if (!masukan.is_open()) {
        cout << "file tidak bisa dibuka" << endl;
        return 1;
    }
    string baris;
    while (getline(masukan, baris)) {
        cout << baris << endl;
    }
    return 0;
}`,
            caption: "Menulis lalu membaca kembali: sintaksnya identik dengan cin dan cout.",
          },
        },
        {
          kind: "quiz",
          question: "Class mana yang dipakai untuk MENULIS ke sebuah file?",
          options: ["ifstream", "ofstream", "ostringstream", "filebuf"],
          answer: 1,
          explanation:
            "Nama diambil dari sudut pandang program: output stream menulis keluar. ifstream (input) untuk membaca, ofstream (output) untuk menulis.",
        },
      ],
    },
    {
      slug: "str-konversi-angka",
      title: "to_string, stoi, dan stod",
      summary: "Konversi dua arah antara angka dan teks dengan to_string, stoi, dan stod.",
      steps: [
        {
          kind: "theory",
          title: "Jembatan antara angka dan teks",
          body: "Data yang masuk sebagai teks sering harus dihitung, dan hasil hitungan sering harus ditampilkan sebagai teks. Standar C++ menyediakan dua arah jembatannya. Arah angka ke string: `to_string(17)` menghasilkan `\"17\"`. Arah string ke angka: `stoi` (int), `stol`, `stof` (float), dan `stod` (double).\n\nKeluarga `sto*` punya perilaku yang perlu dihafal: ia membaca dari awal string sebanyak mungkin karakter yang sah. `stoi(\"42abc\")` menghasilkan 42 tanpa protes, karena setelah 42 ia berhenti. Tapi kalau tidak ada satu pun angka sah di awal, misalnya `stoi(\"kode\")`, ia melempar exception `invalid_argument`. Untuk input yang tidak terjamin, bungkus dengan try-catch, topik modul Error dan Ketahanan nanti.\n\nSisi `to_string` juga punya catatan: untuk `double` ia memakai format bawaan C, sehingga `to_string(3.14)` menjadi `\"3.140000\"`. Kalau kamu butuh bentuk tampilan tertentu, menyusun lewat `ostringstream` memberi kontrol yang lebih baik, seperti `fixed` dan `setprecision`.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <string>
using namespace std;

int main() {
    int umur = 17;
    string s = "umur: " + to_string(umur);
    cout << s << endl;

    string angkaTxt = "3.14";
    double pi = stod(angkaTxt);
    cout << pi * 2 << endl;
    return 0;
}`,
            caption: "to_string mengangka menjadi teks; stod membaca teks menjadi double.",
          },
        },
        {
          kind: "quiz",
          question: "Apa hasil dari `to_string(12) + \"7\"`?",
          options: ["\"19\"", "\"127\"", "\"12 7\"", "tidak bisa dikompilasi"],
          answer: 1,
          explanation:
            "to_string(12) menghasilkan teks \"12\", dan + di sini menyambung string, bukan menjumlah angka. Hasilnya \"127\".",
        },
        {
          kind: "code",
          title: "Angka atau teks? Keduanya",
          prompt: "Lengkapi program: baca dua kata yang isinya angka. Cetak `angka: X` berupa hasil penjumlahan keduanya sebagai bilangan bulat, lalu `teks: Y` berupa kedua kata disambung apa adanya.",
          mode: "fill",
          template: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string a, b;
    cin >> a >> b;
    int angka = ___(a) + ___(b);
    string teks = a + b;
    cout << "angka: " << angka << "\\n";
    cout << "teks: " << teks << "\\n";
    return 0;
}`,
          solution: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string a, b;
    cin >> a >> b;
    int angka = stoi(a) + stoi(b);
    string teks = a + b;
    cout << "angka: " << angka << "\\n";
    cout << "teks: " << teks << "\\n";
    return 0;
}`,
          tests: [
            { stdin: "12\n34", expectedOutput: "angka: 46\nteks: 1234" },
            { stdin: "7\n8", expectedOutput: "angka: 15\nteks: 78" },
            { stdin: "100\n200", expectedOutput: "angka: 300\nteks: 100200", hidden: true },
          ],
          hints: [
            "Mengubah string menjadi int butuh fungsi konversi dari header <string>.",
            "Dua konversi yang sama, satu untuk tiap kata, lalu dijumlahkan.",
            "Jawabannya: stoi(a) + stoi(b).",
          ],
        },
      ],
    },
    {
      slug: "str-parser-csv",
      title: "Latihan Gabungan: Parser CSV",
      summary: "Gabungkan getline, stringstream, dan stoi menjadi parser CSV utuh dari stdin.",
      steps: [
        {
          kind: "theory",
          title: "Satu alur, semua kemampuan modul ini",
          body: "Penutup modul menyatukan semuanya menjadi parser CSV kecil. Setiap baris berbentuk `nama,usia`. Alurnya: baca `n` dengan `cin >>`, beri `cin.ignore()` untuk jebakan newline, lalu per baris: `getline` ambil baris utuh, serahkan ke `stringstream`, dan bedah kolomnya.\n\nKolom dibedah dengan `getline` versi tiga argumen: `getline(ss, nama, ',')` membaca sampai koma dan berhenti di situ; pemanggilan `getline(ss, usiaTxt)` berikutnya melanjutkan dari setelah koma sampai akhir baris. Kolom angka lalu dikonversi dengan `stoi`, lengkap dengan pemakaiannya, sebelum data dicetak dan dicatat siapa yang tertua.\n\nPola ini skalanya mulus: butuh kolom ketiga, tambah satu `getline` dengan delimiter koma; butuh kolom angka kedua, tambah satu `stoi`. Kerangka inilah yang dipakai parser data nyata sebelum akhirnya beralih ke library CSV penuh.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main() {
    string baris = "kopi,18000";
    stringstream ss(baris);
    string nama, hargaTxt;
    getline(ss, nama, ',');
    getline(ss, hargaTxt);
    int harga = stoi(hargaTxt);
    cout << nama << " Rp" << harga << endl;
    return 0;
}`,
            caption: "getline dengan delimiter koma membedah kolom; stoi menyalakan kolom angkanya.",
          },
        },
        {
          kind: "code",
          title: "Parse daftar peserta CSV",
          prompt: "Lengkapi parser peserta: input diawali `n`, lalu `n` baris berbentuk `nama,usia`. Cetak setiap peserta sebagai `nama: usia`, lalu di akhir cetak `tertua: nama` untuk peserta dengan usia paling besar.",
          mode: "fill",
          template: `#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main() {
    int n;
    cin >> n;
    cin.ignore();
    string terbaik;
    int usiaTerbaik = -1;
    for (int i = 0; i < n; i++) {
        string baris;
        getline(cin, baris);
        stringstream ss(baris);
        string nama, usiaTxt;
        getline(ss, nama, ___);
        getline(ss, usiaTxt);
        int usia = ___(usiaTxt);
        cout << nama << ": " << usia << "\\n";
        if (usia > usiaTerbaik) {
            usiaTerbaik = usia;
            terbaik = nama;
        }
    }
    cout << "tertua: " << terbaik << "\\n";
    return 0;
}`,
          solution: `#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main() {
    int n;
    cin >> n;
    cin.ignore();
    string terbaik;
    int usiaTerbaik = -1;
    for (int i = 0; i < n; i++) {
        string baris;
        getline(cin, baris);
        stringstream ss(baris);
        string nama, usiaTxt;
        getline(ss, nama, ',');
        getline(ss, usiaTxt);
        int usia = stoi(usiaTxt);
        cout << nama << ": " << usia << "\\n";
        if (usia > usiaTerbaik) {
            usiaTerbaik = usia;
            terbaik = nama;
        }
    }
    cout << "tertua: " << terbaik << "\\n";
    return 0;
}`,
          tests: [
            {
              stdin: "3\nAndi,17\nBudi,19\nCitra,18",
              expectedOutput: "Andi: 17\nBudi: 19\nCitra: 18\ntertua: Budi",
            },
            { stdin: "2\nDewi,25\nEka,31", expectedOutput: "Dewi: 25\nEka: 31\ntertua: Eka" },
            { stdin: "1\nZaki,40", expectedOutput: "Zaki: 40\ntertua: Zaki", hidden: true },
          ],
          hints: [
            "Delimiter kolom CSV adalah satu karakter yang memisahkan nama dari usia.",
            "Kolom kedua masih berupa teks; ubah ke int dengan fungsi konversi dari lesson sebelumnya.",
            "Jawabannya: ',' sebagai delimiter getline, dan stoi untuk kolom usia.",
          ],
        },
      ],
    },
    // ==================== MODUL 5: Memori dan Smart Pointer ====================
    {
      slug: "mem-new-delete",
      title: "new dan delete: Kekuatan dengan Tagihan",
      summary: "Kenali cara kerja new/delete beserta tiga jebakannya: leak, double delete, dan dangling pointer.",
      steps: [
        {
          kind: "theory",
          title: "Memori yang hidup melampaui scope",
          body: "`new` memesan memori di heap yang tetap hidup sekalipun fungsi pembuatnya sudah kembali, dan `delete` mengembalikannya. Untuk array, pasangannya `new[]` dan `delete[]`. Inilah kekuatan memori dinamis: ukurannya boleh ditentukan saat runtime, dan objeknya boleh hidup lebih lama dari fungsi yang membuatnya.\n\nTagihannya disiplin. Setiap `new` harus dibayar tepat satu kali `delete`: lupa berarti kebocoran memori, dua kali berarti perilaku tidak terdefinisi, dan masih dipakai setelah didelete berarti dangling pointer. Jalur eksekusi yang bercabang memperparah keadaan: satu `return` di tengah fungsi atau satu exception terlempar cukup untuk melompati baris `delete` yang sudah kamu tulis dengan sepenuh hati.\n\nKarena itu C++ modern menaruh `new` dan `delete` manual di tepi paling luar kode: hampir tidak pernah ditulis langsung. Modul ini membangun penggantinya, smart pointer, tetapi kamu wajib mengenali bentuk lamanya, karena kode warisan penuh dengan pola ini dan kamu harus bisa menilai apakah `delete`-nya benar.",
          code: {
            language: "cpp",
            content: `#include <iostream>
using namespace std;

int main() {
    int* data = new int[3];
    data[0] = 10;
    data[1] = 20;
    data[2] = 30;
    cout << data[1] << endl;
    delete[] data;
    return 0;
}`,
            caption: "Bentuk manual yang benar: satu new[], satu delete[], tidak lebih tidak kurang.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi jika `delete` dipanggil dua kali untuk pointer yang sama?",
          options: [
            "program tetap berjalan normal",
            "perilaku tidak terdefinisi: bisa crash atau merusak memori",
            "memori dikosongkan dua kali tanpa masalah",
            "compiler menolak mengompilasi",
          ],
          answer: 1,
          explanation:
            "Double delete adalah undefined behavior. Compiler biasanya tidak memberi peringatan, dan gejalanya bisa diam diam merusak heap lalu crash jauh dari lokasi kesalahannya.",
        },
      ],
    },
    {
      slug: "mem-raii",
      title: "RAII: Memori Mengikuti Masa Hidup",
      summary: "Serahkan kepemilikan sumber daya pada objek dan biarkan destructor yang membereskan.",
      steps: [
        {
          kind: "theory",
          title: "Buka di constructor, tutup di destructor",
          body: "RAII (Resource Acquisition Is Initialization) adalah ide paling penting di modul ini: sumber daya seperti memori, file, atau koneksi dimiliki sebuah objek. Objeknya membuka sumber daya saat lahir (constructor) dan mengembalikannya saat mati (destructor). Bahasa C++ menjamin destructor terpanggil ketika objek keluar scope, apa pun jalurnya, termasuk ketika exception terlempar di tengah jalan.\n\nPerhatikan contoh di bawah: tidak ada satu pun pemanggilan tutup yang manual. Urutan penghancuran adalah kebalikan urutan konstruksi, dan objek di blok dalam mati duluan begitu bloknya selesai. Pemakai class cukup mendeklarasikan variabel; kebersihannya bukan lagi tanggung jawabnya.\n\nRAII adalah fondasi seluruh modul ini. `unique_ptr` yang segera kita bahas adalah class RAII untuk pointer, dan `ofstream` yang menutup file di destructor-nya juga RAII. Begitu pola ini melekat, lupa mengembalikan sumber daya hilang sebagai kelas bug: pengembaliannya ikut masa hidup objek, bukan ingatan programmer.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <string>
using namespace std;

class Koneksi {
public:
    Koneksi(string nama) : nama_(nama) {
        cout << "koneksi " << nama_ << " dibuka" << endl;
    }
    ~Koneksi() {
        cout << "koneksi " << nama_ << " ditutup" << endl;
    }
private:
    string nama_;
};

int main() {
    Koneksi a("database");
    {
        Koneksi b("cache");
        cout << "sedang bekerja" << endl;
    }
    cout << "blok luar berjalan" << endl;
    return 0;
}`,
            caption: "Destructor berjalan saat scope berakhir; urutannya kebalikan constructor.",
          },
        },
        {
          kind: "code",
          title: "Lengkapi pelacak masa hidup",
          prompt: "Lengkapi class `Pelacak`: destructor harus mencetak `tutup: <nama>` memakai member nama_. Jalankan dan perhatikan urutannya: objek di blok dalam dihancurkan lebih dulu, dan objek luar baru dihancurkan setelah baris terakhir main.",
          mode: "fill",
          template: `#include <iostream>
#include <string>
using namespace std;

class Pelacak {
public:
    Pelacak(string nama) : nama_(nama) {
        cout << "buka: " << nama_ << "\\n";
    }
    ___Pelacak() {
        cout << "tutup: " << ___ << "\\n";
    }
private:
    string nama_;
};

int main() {
    string nama;
    cin >> nama;
    Pelacak luar("fileA");
    {
        Pelacak dalam(nama);
    }
    cout << "selesai\\n";
    return 0;
}`,
          solution: `#include <iostream>
#include <string>
using namespace std;

class Pelacak {
public:
    Pelacak(string nama) : nama_(nama) {
        cout << "buka: " << nama_ << "\\n";
    }
    ~Pelacak() {
        cout << "tutup: " << nama_ << "\\n";
    }
private:
    string nama_;
};

int main() {
    string nama;
    cin >> nama;
    Pelacak luar("fileA");
    {
        Pelacak dalam(nama);
    }
    cout << "selesai\\n";
    return 0;
}`,
          tests: [
            {
              stdin: "fileB",
              expectedOutput: "buka: fileA\nbuka: fileB\ntutup: fileB\nselesai\ntutup: fileA",
            },
            {
              stdin: "log",
              expectedOutput: "buka: fileA\nbuka: log\ntutup: log\nselesai\ntutup: fileA",
            },
            {
              stdin: "kunci",
              expectedOutput: "buka: fileA\nbuka: kunci\ntutup: kunci\nselesai\ntutup: fileA",
              hidden: true,
            },
          ],
          hints: [
            "Destructor diberi tanda tilde di depan nama class.",
            "Member yang menyimpan nama sudah dideklarasikan di bagian private.",
            "Jawabannya: ~Pelacak() sebagai tanda tangan, dan nama_ yang dicetak di dalamnya.",
          ],
        },
      ],
    },
    {
      slug: "mem-unique-ptr-dasar",
      title: "unique_ptr dan make_unique",
      summary: "Miliki objek lewat unique_ptr dan buat tanpa new manual memakai make_unique.",
      steps: [
        {
          kind: "theory",
          title: "Satu pemilik, tanpa lupa delete",
          body: "`unique_ptr<T>` adalah pembungkus pointer yang menjadi satu satunya pemilik sebuah objek. Ketika unique_ptr itu mati di akhir scope, objeknya otomatis di-delete. Ini RAII yang bekerja pada memori: kebocoran karena lupa `delete` praktis hilang, karena tidak ada lagi `delete` yang perlu diingat.\n\nCara membuatnya yang dianjurkan adalah `make_unique<T>(args...)`: ia membuat objeknya langsung di dalam smart pointer tanpa menulis `new` manual. Aksesnya sama seperti pointer biasa: `*p` untuk membaca isi pointer, `p->member` untuk anggota class. Kata `unique` serius: unique_ptr tidak boleh disalin, percobaan menyalinnya gagal saat kompilasi, karena dua pemilik berarti tanggung jawab yang samar.\n\nBiayanya nyaris nol: setelah optimasi, unique_ptr sama cepatnya dengan pointer mentah. Karena itu kaidahnya tegas, jadikan unique_ptr pilihan bawaan untuk kepemilikan. `shared_ptr` yang lebih berat hanya untuk kasus kepemilikan yang benar benar dibagi, topik lesson berikutnya.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <memory>
#include <string>
using namespace std;

class Pesan {
public:
    Pesan(string isi) : isi_(isi) {
        cout << "pesan dibuat" << endl;
    }
    ~Pesan() {
        cout << "pesan dihancurkan otomatis" << endl;
    }
    string isi() const { return isi_; }
private:
    string isi_;
};

int main() {
    auto p = make_unique<Pesan>("halo");
    cout << p->isi() << endl;
    return 0;
}`,
            caption: "Tidak ada new dan delete di seluruh program, tetapi objek tetap dihancurkan rapi.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa `make_unique<T>(...)` lebih dianjurkan daripada `unique_ptr<T> p(new T(...))`?",
          options: [
            "make_unique lebih cepat saat program berjalan",
            "make_unique meniadakan new manual dan lebih aman dari kebocoran bila ada error di antara alokasi",
            "new sudah dilarang oleh standar C++17",
            "make_unique otomatis memakai shared_ptr",
          ],
          answer: 1,
          explanation:
            "make_unique mengalokasikan objek dan mengurungnya dalam unique_ptr dalam satu langkah, tanpa new telanjang. Bentuk lama membuka celah bocor bila sesuatu gagal di antara alokasi dan pengurungan.",
        },
        {
          kind: "code",
          title: "Objek pertamamu milik smart pointer",
          prompt: "Lengkapi program: baca nama dan harga sebuah barang, buat objek `Barang` lewat `make_unique`, lalu cetak `nama berharga harga` lewat pointer.",
          mode: "fill",
          template: `#include <iostream>
#include <memory>
#include <string>
using namespace std;

class Barang {
public:
    Barang(string nama, int harga) : nama_(nama), harga_(harga) {}
    string nama() const { return nama_; }
    int harga() const { return harga_; }
private:
    string nama_;
    int harga_;
};

int main() {
    string nama;
    int harga;
    cin >> nama >> harga;
    ___<Barang> b = make_unique<Barang>(nama, harga);
    cout << b->___() << " berharga " << b->harga() << "\\n";
    return 0;
}`,
          solution: `#include <iostream>
#include <memory>
#include <string>
using namespace std;

class Barang {
public:
    Barang(string nama, int harga) : nama_(nama), harga_(harga) {}
    string nama() const { return nama_; }
    int harga() const { return harga_; }
private:
    string nama_;
    int harga_;
};

int main() {
    string nama;
    int harga;
    cin >> nama >> harga;
    unique_ptr<Barang> b = make_unique<Barang>(nama, harga);
    cout << b->nama() << " berharga " << b->harga() << "\\n";
    return 0;
}`,
          tests: [
            { stdin: "kopi 15000", expectedOutput: "kopi berharga 15000" },
            { stdin: "teko 40000", expectedOutput: "teko berharga 40000" },
            { stdin: "gelas 5000", expectedOutput: "gelas berharga 5000", hidden: true },
          ],
          hints: [
            "Tipe yang mengembalikan make_unique adalah smart pointer satu pemilik.",
            "Mengakses member lewat smart pointer memakai panah, sama seperti pointer biasa.",
            "Jawabannya: unique_ptr<Barang> dan b->nama().",
          ],
        },
      ],
    },
    {
      slug: "mem-unique-move",
      title: "Memindahkan Kepemilikan dengan move",
      summary: "Pindahkan kepemilikan unique_ptr dengan move dan pahami kondisi sumbernya.",
      steps: [
        {
          kind: "theory",
          title: "Tidak disalin, melainkan berpindah",
          body: "Karena unique_ptr melarang penyalinan, bagaimana memindahkan objek dari satu pemilik ke pemilik lain? Jawabannya `std::move`: `auto tujuan = move(sumber);`. Setelah baris itu, `tujuan` adalah pemilik baru, dan `sumber` menjadi `nullptr`. Yang berpindah bukan byte objeknya, melainkan siapa yang bertanggung jawab menghancurkannya.\n\nAturan yang menyertai: setelah move, perlakukan sumber sebagai kosong. Dereference pointer yang sudah kosong adalah perilaku tidak terdefinisi. Bila ragu, cek dulu dengan `if (sumber)`. `std::move` sendiri sebenarnya hanya sebuah tanda untuk compiler; yang benar benar bekerja adalah move constructor milik unique_ptr.\n\nDalam API, pola ini muncul sebagai kontrak kepemilikan: fungsi yang menerima `unique_ptr<T>` by value berarti menerima kepemilikan itu, dan fungsi yang mengembalikan `make_unique<T>(...)` menyerahkan objek baru ke pemanggilnya. Saat return, compiler bahkan memindahkan otomatis tanpa perlu `std::move` yang eksplisit.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <memory>
#include <string>
using namespace std;

int main() {
    auto sumber = make_unique<string>("dokumen penting");
    auto tujuan = move(sumber);
    cout << (sumber ? "sumber masih berisi" : "sumber kosong") << endl;
    cout << "tujuan: " << *tujuan << endl;
    return 0;
}`,
            caption: "Setelah move, sumber menjadi nullptr dan tanggung jawab berpindah ke tujuan.",
          },
        },
        {
          kind: "quiz",
          question: "Setelah `auto b = move(a);` di mana `a` dan `b` keduanya `unique_ptr`, apa kondisi `a`?",
          options: [
            "a masih berisi objek yang sama",
            "a menjadi nullptr",
            "a menunjuk objek yang sama dengan b",
            "a berisi salinan objek",
          ],
          answer: 1,
          explanation:
            "Move memindahkan kepemilikan utuh: b menjadi satu satunya pemilik, dan a dibiarkan kosong (nullptr). Tidak ada salinan objek yang dibuat.",
        },
        {
          kind: "code",
          title: "Perbaiki serah terima kepemilikan",
          prompt: "Program ini bahkan tidak bisa dikompilasi: unique_ptr melarang disalin. Ubah satu baris agar kepemilikan berpindah, sehingga pemilik1 kosong setelah penyerahan dan tesnya lulus.",
          mode: "fix",
          template: `#include <iostream>
#include <memory>
#include <string>
using namespace std;

int main() {
    string isi;
    getline(cin, isi);
    auto pemilik1 = make_unique<string>(isi);
    unique_ptr<string> pemilik2 = pemilik1;
    cout << "pemilik2: " << *pemilik2 << "\\n";
    cout << "pemilik1 kosong: " << (pemilik1 == nullptr ? "ya" : "tidak") << "\\n";
    return 0;
}`,
          solution: `#include <iostream>
#include <memory>
#include <string>
using namespace std;

int main() {
    string isi;
    getline(cin, isi);
    auto pemilik1 = make_unique<string>(isi);
    unique_ptr<string> pemilik2 = move(pemilik1);
    cout << "pemilik2: " << *pemilik2 << "\\n";
    cout << "pemilik1 kosong: " << (pemilik1 == nullptr ? "ya" : "tidak") << "\\n";
    return 0;
}`,
          tests: [
            { stdin: "kunci rahasia", expectedOutput: "pemilik2: kunci rahasia\npemilik1 kosong: ya" },
            { stdin: "dokumen", expectedOutput: "pemilik2: dokumen\npemilik1 kosong: ya" },
            { stdin: "X", expectedOutput: "pemilik2: X\npemilik1 kosong: ya", hidden: true },
          ],
          hints: [
            "Pesan error compiler menunjuk baris penyalinan: penggunaan konstruktor salinan yang dihapus.",
            "Kepemilikan unique_ptr tidak disalin, melainkan dipindahkan.",
            "Bungkus sumbernya dengan move: unique_ptr<string> pemilik2 = move(pemilik1);",
          ],
        },
      ],
    },
    {
      slug: "mem-shared-ptr",
      title: "shared_ptr dan use_count",
      summary: "Bagi kepemilikan dengan shared_ptr dan pantau hitungan pemiliknya lewat use_count.",
      steps: [
        {
          kind: "theory",
          title: "Banyak pemilik, yang terakhir menutup pintu",
          body: "`shared_ptr<T>` mengizinkan yang tidak boleh dilakukan unique_ptr: disalin. Setiap salinan menunjuk objek yang sama, dan sebuah penghitung (reference count) mencatat berapa banyak pemilik yang masih hidup. Saat salinan terakhir keluar scope, hitungan turun ke nol, dan barulah objek dihancurkan.\n\n`use_count()` membaca penghitung itu, alat yang bagus untuk memahami mekaniknya. Pembuatannya dianjurkan lewat `make_shared<T>(...)`, yang mengalokasikan objek dan blok penghitungnya dalam satu panggilan sehingga lebih hemat dan lebih rapi.\n\nKenyamanan ini berbiaya: penghitung harus diperbarui secara aman, jadi ada overhead yang tidak dimiliki unique_ptr. Ditambah risiko siklus reference yang akan dibahas dalam dua lesson lagi. Karena itu kaidahnya jelas: unique_ptr adalah bawaan, shared_ptr hanya ketika banyak pemilik benar benar dibutuhkan dan tidak ada satu pun yang bisa disebut pemilik utama.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <memory>
using namespace std;

int main() {
    auto a = make_shared<int>(42);
    cout << "pemilik: " << a.use_count() << endl;
    {
        auto b = a;
        cout << "pemilik: " << a.use_count() << endl;
    }
    cout << "pemilik: " << a.use_count() << endl;
    cout << *a << endl;
    return 0;
}`,
            caption: "Salinan di blok dalam menaikkan hitungan, dan keluar scope menurunkannya kembali.",
          },
        },
        {
          kind: "quiz",
          question: "Perhatikan kode ini. Berapa nilai `a.use_count()` setelah blok selesai?\n\n```cpp\nauto a = make_shared<int>(5);\n{\n    auto b = a;\n}\n// di sini\n```",
          options: ["0", "1", "2", "3"],
          answer: 1,
          explanation:
            "Saat b hidup, hitungannya 2. Ketika blok berakhir, b hancur dan hitungan turun menjadi 1: hanya a yang tersisa, dan objeknya tetap hidup.",
        },
      ],
    },
    {
      slug: "mem-weak-ptr",
      title: "weak_ptr: Mengintip tanpa Memiliki",
      summary: "Amati objek tanpa memiliki dengan weak_ptr dan akses lewat lock.",
      steps: [
        {
          kind: "theory",
          title: "Pengamat yang tidak ikut menahan",
          body: "`weak_ptr<T>` menunjuk ke objek milik sebuah `shared_ptr` tanpa ikut menaikkan penghitung pemilik. Ia murni pengamat: bisa menjawab apakah objeknya masih ada, tapi tidak berhak menahan objek itu tetap hidup.\n\nKarena tidak memiliki, weak_ptr tidak bisa didereference langsung. Untuk memakai objeknya, panggil `lock()`, yang mengembalikan sebuah `shared_ptr` sementara. Kalau objek masih hidup, kamu mendapat akses yang aman sampai shared_ptr sementara itu habis. Kalau objek sudah hilang, `lock()` mengembalikan shared_ptr kosong, dan cek sederhana dengan `if` menyelamatkanmu dari akses yang salah.\n\nPemakaian alaminya ada dua. Pertama, cache dan daftar pengamat: tempat yang ingin tahu adanya objek tanpa menahan hidupnya. Kedua, yang lebih penting untuk modul ini: memutus siklus reference shared_ptr, yang kita bedah pada lesson berikutnya.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <memory>
using namespace std;

int main() {
    auto hidup = make_shared<int>(7);
    weak_ptr<int> pengamat = hidup;
    cout << "pemilik: " << pengamat.use_count() << endl;
    if (auto kunci = pengamat.lock()) {
        cout << "isi: " << *kunci << endl;
    }
    hidup.reset();
    cout << "masih ada: " << (pengamat.lock() ? "ya" : "tidak") << endl;
    return 0;
}`,
            caption: "weak_ptr tidak menaikkan hitungan; lock() yang menyewa akses sebentar.",
          },
        },
        {
          kind: "quiz",
          question: "Bagaimana cara mengakses objek yang diamati oleh sebuah `weak_ptr`?",
          options: [
            "dereference langsung dengan *",
            "panggil lock() yang mengembalikan shared_ptr",
            "panggil get()",
            "weak_ptr tidak pernah bisa dipakai",
          ],
          answer: 1,
          explanation:
            "lock() mengembalikan shared_ptr sementara kalau objeknya masih hidup, atau shared_ptr kosong kalau sudah hilang. Dari situ baru objek bisa dipakai dengan aman.",
        },
      ],
    },
    {
      slug: "mem-smart-parameter",
      title: "Smart Pointer sebagai Parameter dan Return",
      summary: "Rancang kontrak kepemilikan lewat parameter dan return value yang tepat.",
      steps: [
        {
          kind: "theory",
          title: "Tanda tangan fungsi sebagai kontrak kepemilikan",
          body: "Setelah mengenal semua jenis smart pointer, kita bisa membaca tanda tangan fungsi sebagai kontrak kepemilikan. Fungsi yang mengembalikan `unique_ptr<T>` by value berarti membuat objek baru dan menyerahkan penuh kepemilikannya ke pemanggil: pola factory. Sebaliknya, parameter bertipe `unique_ptr<T>` by value berarti pemanggil menyerahkan kepemilikannya kepada fungsi; setelah panggilan, pemanggil tidak lagi punya objek itu.\n\nAturan yang paling sering dilanggar pemula: fungsi yang hanya memakai objek tidak boleh meminta smart pointer. Cukup `T&` atau `const T&` (atau `T*` kalau null adalah kemungkinan yang sah). Fungsi seperti itu tidak peduli apakah pemanggil memakai unique_ptr, shared_ptr, atau objek stack; ia hanya butuh melihat isinya.\n\nRingkasannya jadi tabel kecil di kepala: keluar dari fungsi, kembalikan `unique_ptr` (atau `make_unique` langsung). Masuk untuk dipakai saja, terima referensi. `shared_ptr` di parameter hanya bila fungsi akan menyimpan salinan kepemilikannya untuk dipakai nanti, dan itu keputusan desain yang harus punya alasan.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <memory>
#include <string>
using namespace std;

class Profil {
public:
    Profil(string nama) : nama_(nama) {}
    string nama() const { return nama_; }
private:
    string nama_;
};

unique_ptr<Profil> buatProfil(string nama) {
    return make_unique<Profil>(nama);
}

void tampilkan(const Profil& p) {
    cout << "profil: " << p.nama() << endl;
}

int main() {
    auto p = buatProfil("sinta");
    tampilkan(*p);
    return 0;
}`,
            caption: "Factory menyerahkan kepemilikan lewat return; pemakai cukup minta referensi.",
          },
        },
        {
          kind: "quiz",
          question: "Sebuah fungsi membuat objek baru lalu menyerahkan kepemilikannya sepenuhnya ke pemanggil. Return type yang paling tepat?",
          options: ["T by value", "T& (referensi)", "unique_ptr<T> by value", "shared_ptr<T> selalu wajib"],
          answer: 2,
          explanation:
            "Mengembalikan unique_ptr by value adalah kontrak yang jelas dan murah: objek baru pindah milik ke pemanggil, tidak ada salinan, dan tidak ada komitmen kepemilikan bersama.",
        },
      ],
    },
    {
      slug: "mem-cycle-reference",
      title: "Jebakan Siklus Reference",
      summary: "Kenali siklus shared_ptr yang membuat objek tak pernah dihancurkan, dan putus dengan weak_ptr.",
      steps: [
        {
          kind: "theory",
          title: "Dua pemilik yang saling menahan",
          body: "Inilah jebakan terbesar shared_ptr. Bayangkan dua objek yang saling memegang `shared_ptr` satu sama lain, misalnya `OrangTua` memegang `Anak`, dan `Anak` memegang balik `OrangTua`. Ketika semua variabel di luar sudah hilang, penghitung masing-masing tetap berada di satu: setiap objek masih dipegang satu sama lain. Tidak ada yang mencapai nol, tidak ada yang dihancurkan, dan memorinya bocor diam diam sampai program berakhir.\n\nSolusinya memilih arah. Pertanyaannya: arah mana yang benar benar memiliki, dan arah mana yang hanya mengamati? Dalam kasus orang tua dan anak, orang tua memiliki anak, tetapi anak tidak memiliki orang tuanya; anak hanya perlu tahu di mana orang tuanya. Arah kembalian itulah yang diubah menjadi `weak_ptr`, yang tidak menaikkan penghitung sehingga rantai saling menahan putus.\n\nJadikan pola dua class yang saling menunjuk sebagai alarm. Begitu melihatnya, tanyakan arah kepemilikan sebelum memilih tipe pointer. Kode di bawah memakai weak_ptr untuk arah balik, dan kamu bisa membuktikan efeknya sendiri: ganti weak_ptr menjadi shared_ptr, jalankan, dan kedua baris pesan penghancuran tidak akan pernah muncul.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <memory>
using namespace std;

struct Anak;

struct OrangTua {
    ~OrangTua() { cout << "orang tua dihancurkan" << endl; }
    shared_ptr<Anak> anak;
};

struct Anak {
    ~Anak() { cout << "anak dihancurkan" << endl; }
    weak_ptr<OrangTua> orangTua;
};

int main() {
    auto ortu = make_shared<OrangTua>();
    auto anak = make_shared<Anak>();
    ortu->anak = anak;
    anak->orangTua = ortu;
    cout << "selesai" << endl;
    return 0;
}`,
            caption: "Dengan weak_ptr pada arah balik, kedua objek dihancurkan rapi saat main berakhir.",
          },
        },
        {
          kind: "quiz",
          question: "Dua objek saling memegang `shared_ptr` ke satu sama lain, lalu semua variabel di luar sudah hilang. Mengapa keduanya tidak pernah dihancurkan?",
          options: [
            "karena memori heap penuh",
            "karena use_count masing-masing tidak pernah mencapai nol: mereka saling menahan",
            "karena lupa memanggil delete secara manual",
            "karena weak_ptr ikut menahan penghitung",
          ],
          answer: 1,
          explanation:
            "Setiap objek masih memegang satu shared_ptr ke pasangannya, jadi penghitung masing-masing berhenti di satu dan tidak pernah nol. weak_ptr justru solusinya, karena tidak ikut menahan.",
        },
      ],
    },
    {
      slug: "mem-vector-polimorfik",
      title: "vector<unique_ptr>: Koleksi Polimorfik",
      summary: "Simpan objek berbeda dalam satu vector polimorfik milik unique_ptr.",
      steps: [
        {
          kind: "theory",
          title: "Satu vector, banyak bentuk, satu pemilik",
          body: "Pola standar koleksi polimorfik di C++ modern adalah `vector<unique_ptr<Basis>>`. Vector menyimpan pointer, bukan objek, supaya class turunan apa pun bisa masuk ke dalamnya. Dan setiap elemennya milik unique_ptr, sehingga saat vector hancur, semua objek di dalamnya dihancurkan otomatis, tanpa satu pun `delete` manual.\n\nKenapa bukan `vector<Basis>`? Karena vector menyimpan nilainya, objek `Turunan` yang masuk akan terpotong menjadi bagian `Basis` saja (object slicing): fungsi virtualnya hilang, ukurannya menyusut. Kenapa bukan `vector<Basis*>`? Karena timbul pertanyaan yang tidak terjawab: siapa yang memanggil `delete` untuk tiap elemen? unique_ptr menjawabnya sekali untuk semua.\n\nSyarat teknisnya hanya dua. `Basis` harus punya virtual destructor, supaya menghancurkan lewat pointer basis menurunkan destructor turunan dengan benar. Dan fungsinya virtual supaya pemanggilan lewat pointer memanggil versi turunannya. Saat menjelajah, pakai `const auto&` di range-for: menyalin unique_ptr tidak diizinkan, dan menyalin objeknya pun tidak perlu.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <memory>
#include <string>
#include <vector>
using namespace std;

class Hewan {
public:
    virtual ~Hewan() = default;
    virtual string suara() const = 0;
};

class Kucing : public Hewan {
public:
    string suara() const override { return "meong"; }
};

class Anjing : public Hewan {
public:
    string suara() const override { return "guk"; }
};

int main() {
    vector<unique_ptr<Hewan>> kandang;
    kandang.push_back(make_unique<Kucing>());
    kandang.push_back(make_unique<Anjing>());
    for (const auto& h : kandang) {
        cout << h->suara() << endl;
    }
    return 0;
}`,
            caption: "Dua class berbeda dalam satu vector, dan tidak ada satu pun delete manual.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa `vector<Basis>` (menyimpan objek langsung) tidak cocok untuk koleksi polimorfik?",
          options: [
            "karena vector tidak bisa menampung banyak elemen",
            "karena objek turunan terpotong menjadi bagian basis (object slicing) dan perilaku virtualnya hilang",
            "karena basis wajib bertipe pointer",
            "karena virtual function tidak boleh dipanggil dari vector",
          ],
          answer: 1,
          explanation:
            "Vector menyimpan elemen by value dengan ukuran basis. Objek turunan yang dimasukkan terpotong: datanya yang milik turunan hilang, dan pemanggilan virtual berhenti menjadi versi basis.",
        },
        {
          kind: "code",
          title: "Hitung luas dua bentuk",
          prompt: "Lengkapi loop yang menjelajahi `vector<unique_ptr<Bentuk>>`: cetak `nama luasnya X` untuk setiap bentuk di dalam koleksi, memakai fungsi virtual miliknya.",
          mode: "fill",
          template: `#include <iostream>
#include <memory>
#include <string>
#include <vector>
using namespace std;

class Bentuk {
public:
    virtual ~Bentuk() = default;
    virtual string nama() const = 0;
    virtual int luas() const = 0;
};

class Persegi : public Bentuk {
public:
    Persegi(int sisi) : sisi_(sisi) {}
    string nama() const override { return "persegi"; }
    int luas() const override { return sisi_ * sisi_; }
private:
    int sisi_;
};

class PersegiPanjang : public Bentuk {
public:
    PersegiPanjang(int panjang, int lebar) : panjang_(panjang), lebar_(lebar) {}
    string nama() const override { return "persegi panjang"; }
    int luas() const override { return panjang_ * lebar_; }
private:
    int panjang_, lebar_;
};

int main() {
    int sisi, p, l;
    cin >> sisi >> p >> l;
    vector<unique_ptr<Bentuk>> koleksi;
    koleksi.push_back(make_unique<Persegi>(sisi));
    koleksi.push_back(make_unique<PersegiPanjang>(p, l));
    for (const auto& b : koleksi) {
        cout << b->___() << " luasnya " << b->___() << "\\n";
    }
    return 0;
}`,
          solution: `#include <iostream>
#include <memory>
#include <string>
#include <vector>
using namespace std;

class Bentuk {
public:
    virtual ~Bentuk() = default;
    virtual string nama() const = 0;
    virtual int luas() const = 0;
};

class Persegi : public Bentuk {
public:
    Persegi(int sisi) : sisi_(sisi) {}
    string nama() const override { return "persegi"; }
    int luas() const override { return sisi_ * sisi_; }
private:
    int sisi_;
};

class PersegiPanjang : public Bentuk {
public:
    PersegiPanjang(int panjang, int lebar) : panjang_(panjang), lebar_(lebar) {}
    string nama() const override { return "persegi panjang"; }
    int luas() const override { return panjang_ * lebar_; }
private:
    int panjang_, lebar_;
};

int main() {
    int sisi, p, l;
    cin >> sisi >> p >> l;
    vector<unique_ptr<Bentuk>> koleksi;
    koleksi.push_back(make_unique<Persegi>(sisi));
    koleksi.push_back(make_unique<PersegiPanjang>(p, l));
    for (const auto& b : koleksi) {
        cout << b->nama() << " luasnya " << b->luas() << "\\n";
    }
    return 0;
}`,
          tests: [
            { stdin: "4 5 3", expectedOutput: "persegi luasnya 16\npersegi panjang luasnya 15" },
            { stdin: "10 2 2", expectedOutput: "persegi luasnya 100\npersegi panjang luasnya 4" },
            { stdin: "7 9 6", expectedOutput: "persegi luasnya 49\npersegi panjang luasnya 54", hidden: true },
          ],
          hints: [
            "Kedua fungsi virtual Bentuk sudah dideklarasikan di class dan dioverride di kedua turunannya.",
            "Yang dicetak pertama adalah nama bentuk, yang kedua hasil luasnya.",
            "Jawabannya: b->nama() dan b->luas().",
          ],
        },
      ],
    },
    {
      slug: "mem-latihan-tugas",
      title: "Latihan Gabungan: Papan Tugas",
      summary: "Gabungkan factory, vector unique_ptr, dan akses referensi jadi program tanpa new/delete manual.",
      steps: [
        {
          kind: "theory",
          title: "Tanpa satu pun new dan delete",
          body: "Penutup modul menyatukan pola polanya dalam satu program: fungsi factory yang mengembalikan `unique_ptr` by value, vector yang menjadi pemilik seluruh kumpulan objek, dan loop yang mengakses isi lewat `const auto&`. Cari baik baik program ini: tidak ada satu pun `new` atau `delete` manual, tetapi setiap objek tetap dihancurkan tepat saat main berakhir.\n\nPerhatikan juga gaya bacanya. Nama `buatTugas` dengan return `unique_ptr<Tugas>` langsung menyatakan kontraknya: kamu minta, ia buat dan serahkan. Vector menyatakan bahwa kumpulan ini yang memiliki semua tugas. Loop `const auto&` menyatakan bahwa kita hanya membaca. Memori dan maksud kode tertata oleh tipe, bukan komentar.\n\nKalau kamu bisa menulis program seperti ini tanpa kebocoran dan tanpa ragu, kamu sudah bekerja dengan memori gaya C++ modern. Sisanya hanya variasi pola yang sama: unique_ptr untuk kepemilikan tunggal, shared_ptr hanya ketika benar benar dibagi, dan weak_ptr untuk arah yang hanya mengamati.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <memory>
#include <string>
#include <vector>
using namespace std;

class Tugas {
public:
    Tugas(string judul) : judul_(judul) {}
    string judul() const { return judul_; }
private:
    string judul_;
};

unique_ptr<Tugas> buatTugas(string judul) {
    return make_unique<Tugas>(judul);
}

int main() {
    vector<unique_ptr<Tugas>> papan;
    papan.push_back(buatTugas("setup build"));
    papan.push_back(buatTugas("tulis test"));
    for (const auto& t : papan) {
        cout << "- " << t->judul() << endl;
    }
    return 0;
}`,
            caption: "Factory membuat, vector memiliki, loop membaca: tiga peran, nol new/delete manual.",
          },
        },
        {
          kind: "code",
          title: "Susun papan tugas prioritas",
          prompt: "Lengkapi program: baca `n`, lalu `n` pasangan nama tugas dan prioritasnya. Simpan setiap tugas lewat factory `buatTugas` ke dalam vector, cetak semua sebagai `nama (prioritas)`, lalu cetak `prioritas tertinggi: X`.",
          mode: "fill",
          template: `#include <iostream>
#include <memory>
#include <string>
#include <vector>
using namespace std;

class Tugas {
public:
    Tugas(string nama, int prioritas) : nama_(nama), prioritas_(prioritas) {}
    string nama() const { return nama_; }
    int prioritas() const { return prioritas_; }
private:
    string nama_;
    int prioritas_;
};

___<Tugas> buatTugas(string nama, int prioritas) {
    return ___<Tugas>(nama, prioritas);
}

int main() {
    int n;
    cin >> n;
    vector<unique_ptr<Tugas>> daftar;
    for (int i = 0; i < n; i++) {
        string nama;
        int prio;
        cin >> nama >> prio;
        daftar.push_back(buatTugas(nama, prio));
    }
    int tertinggi = 0;
    for (const auto& t : daftar) {
        cout << t->nama() << " (" << t->prioritas() << ")\\n";
        if (t->prioritas() > tertinggi) {
            tertinggi = t->prioritas();
        }
    }
    cout << "prioritas tertinggi: " << tertinggi << "\\n";
    return 0;
}`,
          solution: `#include <iostream>
#include <memory>
#include <string>
#include <vector>
using namespace std;

class Tugas {
public:
    Tugas(string nama, int prioritas) : nama_(nama), prioritas_(prioritas) {}
    string nama() const { return nama_; }
    int prioritas() const { return prioritas_; }
private:
    string nama_;
    int prioritas_;
};

unique_ptr<Tugas> buatTugas(string nama, int prioritas) {
    return make_unique<Tugas>(nama, prioritas);
}

int main() {
    int n;
    cin >> n;
    vector<unique_ptr<Tugas>> daftar;
    for (int i = 0; i < n; i++) {
        string nama;
        int prio;
        cin >> nama >> prio;
        daftar.push_back(buatTugas(nama, prio));
    }
    int tertinggi = 0;
    for (const auto& t : daftar) {
        cout << t->nama() << " (" << t->prioritas() << ")\\n";
        if (t->prioritas() > tertinggi) {
            tertinggi = t->prioritas();
        }
    }
    cout << "prioritas tertinggi: " << tertinggi << "\\n";
    return 0;
}`,
          tests: [
            {
              stdin: "3\nbuild 5\ntest 8\ndeploy 3",
              expectedOutput: "build (5)\ntest (8)\ndeploy (3)\nprioritas tertinggi: 8",
            },
            { stdin: "1\ndokumentasi 1", expectedOutput: "dokumentasi (1)\nprioritas tertinggi: 1" },
            {
              stdin: "4\nlint 2\naudit 9\nbackup 9\ncleanup 1",
              expectedOutput: "lint (2)\naudit (9)\nbackup (9)\ncleanup (1)\nprioritas tertinggi: 9",
              hidden: true,
            },
          ],
          hints: [
            "Factory mengembalikan smart pointer satu pemilik, dan isinya dibuat dengan fungsi pendampingnya.",
            "Pasangan return type dan pembuatannya: unique_ptr<Tugas> di tanda tangan, make_unique<Tugas> di badan fungsi.",
            "Jawabannya: unique_ptr<Tugas> buatTugas(...) yang isinya return make_unique<Tugas>(nama, prioritas);",
          ],
        },
      ],
    },
  ],
};
