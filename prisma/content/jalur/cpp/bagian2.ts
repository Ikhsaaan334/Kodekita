import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "cpp",
  moduleRange: [2, 3],
  modules: [
    {
      title: "STL Container",
      description: "vector, map, set, deque, stack, queue, dan memilih container yang tepat.",
    },
    {
      title: "Algoritma dan Lambda",
      description: "sort/find/accumulate, iterator, lambda, dan compose logika tanpa loop manual.",
    },
  ],
  lessons: [
    // ==================== MODUL 2: STL Container ====================
    {
      slug: "stl-vector-dasar",
      title: "vector: Array yang Bisa Tumbuh",
      summary: "Tambah elemen ke vector dengan push_back dan baca ukurannya dengan size.",
      steps: [
        {
          kind: "theory",
          title: "Array yang mengurus memorinya sendiri",
          body: "Selama ini kamu mungkin terbiasa dengan array berukuran tetap: `int data[10]` berarti sepuluh elemen, tidak kurang tidak lebih, dan ukurannya disepakati saat menulis kode. `vector` adalah jawaban STL untuk masalah itu: array yang bisa tumbuh dan menyusut saat program berjalan. Tipe elemennya ditulis di dalam kurung sudut, misalnya `vector<int>` untuk bilangan bulat atau `vector<string>` untuk teks.\n\nUntuk menambah elemen baru di akhir, panggil `push_back`. Vector lalu mengurus memorinya sendiri: kalau kapasitasnya tidak cukup, ia otomatis memesan tempat yang lebih besar. Ukuran saat ini dibaca dengan `size()`, dan elemen paling akhir dengan `back()`.\n\nDua fungsi ini adalah pasangan yang paling sering dipakai saat membaca data yang jumlahnya baru diketahui saat program jalan: baca satu nilai, `push_back`, ulangi sampai selesai.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> angka;
    angka.push_back(10);
    angka.push_back(30);
    angka.push_back(20);
    cout << "isi: " << angka.size() << " elemen" << endl;
    cout << "terakhir: " << angka.back() << endl;
    return 0;
}`,
            caption: "push_back menambah di akhir, size() membaca banyak elemen, back() membaca yang terakhir.",
          },
        },
        {
          kind: "quiz",
          question: "Fungsi apa yang menambah satu elemen baru di bagian akhir sebuah vector?",
          options: ["add", "push_back", "append", "insert_back"],
          answer: 1,
          explanation: "`push_back` menambahkan elemen ke akhir vector dan mengurus kapasitasnya otomatis. Nama `add` dan `append` bukan milik vector.",
        },
        {
          kind: "code",
          title: "Kumpulkan nilai lalu laporkan",
          prompt: "Lengkapi program di bawah supaya membaca `n` buah nilai lalu menyimpannya satu per satu ke dalam `vector` bernama `nilai`, kemudian mencetak banyak elemennya dan elemen terakhirnya. Ganti setiap `___` dengan kode yang tepat.",
          mode: "fill",
          template: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nilai;
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        nilai.___(x);
    }
    cout << "jumlah elemen: " << nilai.___() << "\\n";
    cout << "elemen terakhir: " << nilai.back() << "\\n";
    return 0;
}`,
          solution: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nilai;
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        nilai.push_back(x);
    }
    cout << "jumlah elemen: " << nilai.size() << "\\n";
    cout << "elemen terakhir: " << nilai.back() << "\\n";
    return 0;
}`,
          tests: [
            { stdin: "3\n4 10 7", expectedOutput: "jumlah elemen: 3\nelemen terakhir: 7" },
            { stdin: "1\n42", expectedOutput: "jumlah elemen: 1\nelemen terakhir: 42" },
            { stdin: "5\n1 2 3 4 5", expectedOutput: "jumlah elemen: 5\nelemen terakhir: 5", hidden: true },
          ],
          hints: [
            "Fungsi untuk menambah elemen ke akhir vector sudah dipakai di teori.",
            "Banyak elemen dibaca lewat fungsi yang mengembalikan ukuran vector.",
            "Jawabannya: push_back dan size.",
          ],
        },
      ],
    },
    {
      slug: "stl-vector-akses-iterasi",
      title: "Membaca dan Menjelajah vector",
      summary: "Baca elemen lewat indeks dan jelajahi seluruh isi vector.",
      steps: [
        {
          kind: "theory",
          title: "Indeks dan range-for",
          body: "Setelah data masuk ke vector, dua pekerjaan paling umum adalah membaca satu elemen tertentu dan menjelajahi semuanya satu per satu. Untuk membaca satu elemen, pakai kurung siku dengan indeks: `nilai[0]` adalah elemen pertama, `nilai[1]` elemen kedua, dan seterusnya sampai `nilai[size() - 1]`. Indeks mulai dari 0, dan membaca di luar rentang itu adalah perilaku tidak terdefinisi: program bisa mencetak angka sampah atau langsung crash tanpa peringatan.\n\nKalau ingin versi yang lebih berjaga, `nilai.at(i)` melakukan hal yang sama tetapi mengecek batas; kalau `i` di luar rentang, ia melempar error yang jelas alih alih membaca sembarangan. Ada juga pintasan: `front()` untuk elemen pertama dan `back()` untuk yang terakhir.\n\nUntuk menjelajah seluruh isi, range-for lebih ringkas daripada for biasa: `for (int x : nilai)` memberimu salinan tiap elemen, sedangkan `for (int& x : nilai)` memberi referensi sehingga perubahan pada `x` ikut mengubah isi vector.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nilai = {5, 8, 2, 9};
    cout << "pertama: " << nilai.front() << endl;
    cout << "indeks 2: " << nilai[2] << endl;
    cout << "terakhir: " << nilai.back() << endl;
    for (int x : nilai) {
        cout << x << " ";
    }
    cout << endl;
    return 0;
}`,
            caption: "Indeks mulai dari 0; range-for menyapu semua elemen tanpa mengurus indeks.",
          },
        },
        {
          kind: "code",
          title: "Cetak semua elemen",
          prompt: "Program ini seharusnya mencetak semua nilai yang dibaca, dipisah spasi dalam satu baris. Saat dijalankan, satu nilai tidak pernah muncul. Cari kesalahannya dan perbaiki sampai kedua tes lulus.",
          mode: "fix",
          template: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> nilai(n);
    for (int i = 0; i < n; i++) {
        cin >> nilai[i];
    }
    for (int i = 1; i < n; i++) {
        cout << nilai[i] << " ";
    }
    cout << "\\n";
    return 0;
}`,
          solution: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> nilai(n);
    for (int i = 0; i < n; i++) {
        cin >> nilai[i];
    }
    for (int i = 0; i < n; i++) {
        cout << nilai[i] << " ";
    }
    cout << "\\n";
    return 0;
}`,
          tests: [
            { stdin: "4\n5 8 2 9", expectedOutput: "5 8 2 9" },
            { stdin: "3\n7 7 7", expectedOutput: "7 7 7" },
            { stdin: "1\n100", expectedOutput: "100", hidden: true },
          ],
          hints: [
            "Jalankan dulu dengan tes pertama: empat nilai masuk, tapi yang tercetak hanya tiga. Perhatikan nilai mana yang hilang.",
            "Indeks vector dimulai dari 0, jadi perulangan pencetaknya harus mulai dari situ.",
            "Ubah nilai awal i pada perulangan pencetakan menjadi 0.",
          ],
        },
      ],
    },
    {
      slug: "stl-vector-2d",
      title: "vector 2D: Tabel dalam Tabel",
      summary: "Bangun tabel dua dimensi dari vector dalam vector dan jumlahkan tiap barisnya.",
      steps: [
        {
          kind: "theory",
          title: "vector yang isinya vector",
          body: "Sebuah vector tidak harus berisi angka atau teks; isinya juga boleh vector lain. `vector<vector<int>>` adalah cara paling praktis membuat tabel dua dimensi: elemen ke-i adalah sebuah baris, dan baris itu sendiri berisi kolom-kolom angka.\n\nCara paling ringkas membuat tabel berisi nol adalah lewat constructor dua argumen: `vector<vector<int>> grid(r, vector<int>(c))` membuat `r` baris, masing-masing berisi `c` buah nol. Mengisinya tinggal dua for bersarang, dan membaca satu sel dilakukan dengan dua pasang kurung siku: `grid[baris][kolom]`.\n\nBerbeda dengan array dua dimensi `int t[3][4]` yang ukurannya beku sejak kompilasi, tabel vector bisa dibuat dengan ukuran yang baru diketahui saat program berjalan, misalnya dibaca dari input.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int r = 2, c = 3;
    vector<vector<int>> grid(r, vector<int>(c));
    grid[0][0] = 1;
    grid[1][2] = 7;
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            cout << grid[i][j] << " ";
        }
        cout << endl;
    }
    return 0;
}`,
            caption: "Semua sel mulai dari 0, lalu dua sel diisi manual.",
          },
        },
        {
          kind: "quiz",
          question: "Bagaimana cara membaca elemen pada baris indeks 1, kolom indeks 2 dari `vector<vector<int>> grid`?",
          options: ["grid[2][1]", "grid[1][2]", "grid(1)(2)", "grid[1, 2]"],
          answer: 1,
          explanation: "Indeks baris dulu, baru kolom, dan keduanya memakai kurung siku: `grid[1][2]`. Bentuk `grid(1)(2)` dan `grid[1, 2]` tidak dikenal C++.",
        },
        {
          kind: "code",
          title: "Jumlahkan tiap baris tabel",
          prompt: "Program di bawah membaca ukuran tabel `r x c`, membaca semua selnya, lalu mencetak jumlah setiap baris: satu baris keluaran untuk satu baris tabel. Lengkapi dua kekosongan yang ada.",
          mode: "fill",
          template: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int r, c;
    cin >> r >> c;
    vector<vector<int>> grid(r, vector<int>(c));
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < ___; j++) {
            cin >> grid[i][j];
        }
    }
    for (int i = 0; i < r; i++) {
        int total = 0;
        for (int j = 0; j < c; j++) {
            total ___ grid[i][j];
        }
        cout << total << "\\n";
    }
    return 0;
}`,
          solution: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int r, c;
    cin >> r >> c;
    vector<vector<int>> grid(r, vector<int>(c));
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            cin >> grid[i][j];
        }
    }
    for (int i = 0; i < r; i++) {
        int total = 0;
        for (int j = 0; j < c; j++) {
            total += grid[i][j];
        }
        cout << total << "\\n";
    }
    return 0;
}`,
          tests: [
            { stdin: "2 3\n1 2 3\n4 5 6", expectedOutput: "6\n15" },
            { stdin: "1 1\n9", expectedOutput: "9" },
            { stdin: "3 2\n10 -3\n5 5\n0 1", expectedOutput: "7\n10\n1", hidden: true },
          ],
          hints: [
            "Perulangan dalam menyapu kolom-kolom di dalam satu baris. Batasnya adalah banyak kolom.",
            "Menambahkan nilai ke penampung memakai operator gabung: tambah sama dengan.",
            "Jawabannya: c dan +=.",
          ],
        },
      ],
    },
    {
      slug: "stl-map-dasar",
      title: "map: Kamus Kunci ke Nilai",
      summary: "Hitung frekuensi kata dengan map dan pahami perilaku kunci baru.",
      steps: [
        {
          kind: "theory",
          title: "Menyimpan nilai di bawah sebuah kunci",
          body: "`map` adalah pasangan kunci dan nilai: kamu menyimpan nilai di bawah sebuah kunci, lalu mengambilnya kembali lewat kunci yang sama. `map<string, int>` artinya kuncinya teks dan nilainya bilangan bulat, pola yang paling sering muncul untuk penghitungan: kuncinya kata, nilainya berapa kali kata itu muncul.\n\nAkses memakai kurung siku seperti array: `frek[kata]` membaca nilai untuk kunci itu, dan `frek[kata] = 5` menulisnya. Yang istimewa: kalau kuncinya belum ada, map otomatis membuatnya dengan nilai bawaan. Untuk `int`, nilai bawaannya 0. Karena itu idiom penghitung cukup satu baris: `frek[kata]++`.\n\nButuh header `<map>`, dan biasanya juga `<string>` karena kuncinya sering berupa teks. Satu kunci hanya punya satu nilai; menulis dua kali pada kunci yang sama berarti menimpa.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> stok;
    stok["gula"] = 10;
    stok["teh"] = 5;
    stok["gula"] += 3;
    cout << "gula: " << stok["gula"] << endl;
    cout << "kopi: " << stok["kopi"] << endl;
    cout << "jenis: " << stok.size() << endl;
    return 0;
}`,
            caption: "Membaca kunci yang belum ada (kopi) otomatis membuatnya bernilai 0.",
          },
        },
        {
          kind: "quiz",
          question: "Pada `map<string, int> frek` yang baru dibuat, apa isi `frek[\"kata\"]` saat kunci itu belum pernah diisi?",
          options: [
            "0, karena kunci baru otomatis dibuat dengan nilai bawaan",
            "Program error karena kunci tidak ada",
            "Nilai acak sisa memori",
            "Teks kosong",
          ],
          answer: 0,
          explanation: "Mengakses kunci yang belum ada membuat map menciptakannya dengan nilai bawaan tipe; untuk `int` nilainya 0. Perilaku inilah yang dipakai idiom `frek[kata]++`.",
        },
        {
          kind: "code",
          title: "Hitung frekuensi kata",
          prompt: "Program ini menghitung frekuensi kata. Baca `n` kata dari input, hitung masing-masing dengan map, lalu baca satu kata yang dicari dan cetak berapa kali kata itu muncul. Lengkapi dua kekosongan.",
          mode: "fill",
          template: `#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    int n;
    cin >> n;
    map<string, int> frek;
    for (int i = 0; i < n; i++) {
        string kata;
        cin >> kata;
        frek[kata]___;
    }
    string cari;
    cin >> cari;
    cout << cari << " muncul " << frek[___] << " kali" << endl;
    return 0;
}`,
          solution: `#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    int n;
    cin >> n;
    map<string, int> frek;
    for (int i = 0; i < n; i++) {
        string kata;
        cin >> kata;
        frek[kata]++;
    }
    string cari;
    cin >> cari;
    cout << cari << " muncul " << frek[cari] << " kali" << endl;
    return 0;
}`,
          tests: [
            { stdin: "4\napel jeruk apel mangga\napel", expectedOutput: "apel muncul 2 kali" },
            { stdin: "3\nsusu roti susu\nkeju", expectedOutput: "keju muncul 0 kali" },
            { stdin: "5\na b a c a\na", expectedOutput: "a muncul 3 kali", hidden: true },
          ],
          hints: [
            "Menambah penghitung satu per satu bisa lewat operator gabung tambah sama dengan atau tanda plus ganda.",
            "Kata yang dicari sudah tersimpan di variabel cari; masukkan nama variabel itu ke dalam kurung siku.",
            "Jawabannya: ++ dan cari.",
          ],
        },
      ],
    },
    {
      slug: "stl-map-iterasi-find",
      title: "Menjelajah dan Mencari di map",
      summary: "Jelajahi map yang otomatis terurut dan cek keberadaan kunci dengan find.",
      steps: [
        {
          kind: "theory",
          title: "Terurut dari awal, dan find alih alih kurung siku",
          body: "Kalau dijelajahi dengan range-for, sebuah map selalu mengunjungi kunci-kuncinya dalam urutan terurut menaik, bukan urutan saat dimasukkan. Setiap elemennya adalah sepasang `pair`: `p.first` berisi kunci dan `p.second` berisi nilai. Urutan otomatis ini membuat map nyaman dipakai untuk laporan yang harus rapi tanpa sort tambahan.\n\nUntuk mengecek apakah sebuah kunci ada, jangan asal menulis `stok[kunci]`, karena akses itu sekalian menciptakan kunci baru bernilai 0 kalau belum ada. Cara yang benar adalah `find`: ia mengembalikan iterator ke elemen yang kuncinya cocok, atau `end()` kalau tidak ketemu. Alternatif singkatnya `count(kunci)`, yang hasilnya 0 atau 1.\n\nPola paling umum: `if (stok.find(cari) != stok.end())` berarti kunci ada, dan baru setelah itu nilainya dibaca.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> umur = {{"budi", 17}, {"sari", 19}, {"anto", 18}};
    for (const auto& p : umur) {
        cout << p.first << " umur " << p.second << endl;
    }
    if (umur.find("sari") != umur.end()) {
        cout << "sari terdaftar" << endl;
    }
    return 0;
}`,
            caption: "Keluaran tercetak terurut sesuai kunci: anto, budi, sari.",
          },
        },
        {
          kind: "quiz",
          question: "Saat range-for menyapu sebuah map<string, int>, urutan kunjungan elemennya bagaimana?",
          options: [
            "Sesuai urutan pertama kali dimasukkan",
            "Terurut menaik berdasarkan kuncinya",
            "Acak, bisa berubah setiap dijalankan",
            "Terurut menurun berdasarkan nilainya",
          ],
          answer: 1,
          explanation: "`map` menyimpan kuncinya terurut menaik, jadi penjelajahan selalu menghasilkan urutan kunci dari kecil ke besar, bukan urutan masuk.",
        },
        {
          kind: "code",
          title: "Cek stok dengan find",
          prompt: "Lengkapi program pencarian stok di bawah. Kode harus mencetak `tersedia` beserta jumlahnya kalau nama yang dicari ada, atau pesan `tidak ada di daftar` kalau tidak. Satu kekosongan tersisa.",
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
        stok[nama] = jumlah;
    }
    string cari;
    cin >> cari;
    if (stok.find(cari) != stok.___()) {
        cout << cari << " tersedia " << stok[cari] << endl;
    } else {
        cout << cari << " tidak ada di daftar" << endl;
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
    string cari;
    cin >> cari;
    if (stok.find(cari) != stok.end()) {
        cout << cari << " tersedia " << stok[cari] << endl;
    } else {
        cout << cari << " tidak ada di daftar" << endl;
    }
    return 0;
}`,
          tests: [
            { stdin: "3\ngula 10\nteh 5\nberas 3\nteh", expectedOutput: "teh tersedia 5" },
            { stdin: "3\ngula 10\nteh 5\nberas 3\nkopi", expectedOutput: "kopi tidak ada di daftar" },
            { stdin: "1\nminyak 2\nminyak", expectedOutput: "minyak tersedia 2", hidden: true },
          ],
          hints: [
            "find mengembalikan iterator yang harus dibandingkan dengan penanda akhir container.",
            "Penanda akhir map adalah fungsi end().",
            "Jawabannya: end.",
          ],
        },
      ],
    },
    {
      slug: "stl-set-dasar",
      title: "set: Kumpulan Tanpa Duplikat",
      summary: "Simpan nilai unik dan terurut dengan set, dari insert sampai size.",
      steps: [
        {
          kind: "theory",
          title: "Unik dan terurut, otomatis",
          body: "`set` menyimpan kumpulan nilai dengan dua janji: tidak ada duplikat, dan isinya selalu terurut menaik. Memasukkan nilai yang sudah ada tidak mengubah apa-apa dan tidak melempar error; set-nya tetap berisi satu nilai itu.\n\nFungsi utamanya mirip map: `insert` untuk menambah, `count(x)` untuk mengecek keanggotaan (hasilnya 0 atau 1), `erase(x)` untuk menghapus, dan `size()` untuk menghitung isi. Karena isinya otomatis terurut, menjelajahnya dengan range-for menghasilkan urutan menaik tanpa perlu sort.\n\nSet dipakai saat yang penting adalah keanggotaan dan keunikan: daftar nomor yang sudah dipakai, kata yang pernah muncul, atau menghitung ada berapa nilai berbeda dalam data. Header-nya `<set>`.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <set>
using namespace std;

int main() {
    set<string> hadir = {"budi", "sari", "budi"};
    cout << "yang tercatat: " << hadir.size() << endl;
    hadir.insert("anto");
    hadir.insert("sari");
    cout << "sekarang: " << hadir.size() << endl;
    for (const string& nama : hadir) {
        cout << nama << " ";
    }
    cout << endl;
    return 0;
}`,
            caption: "Duplikat budi hanya tercatat sekali, dan anto masuk ke posisi terurutnya.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi kalau `insert` dipanggil dengan nilai yang sudah ada di dalam set?",
          options: [
            "Nilai itu tersimpan dua kali",
            "Nilai lama ditimpa",
            "Tidak ada yang berubah, set tetap berisi satu nilai itu",
            "Set dikosongkan lalu diisi ulang",
          ],
          answer: 2,
          explanation: "`set` menolak duplikat secara diam: memasukkan nilai yang sudah ada tidak mengubah isinya dan tidak error.",
        },
        {
          kind: "code",
          title: "Hitung nilai berbeda",
          prompt: "Program di bawah membaca `n` bilangan yang mungkin mengandung duplikat, lalu mencetak ada berapa nilai berbeda dan daftar nilai berbeda itu dalam urutan menaik. Lengkapi dua kekosongan.",
          mode: "fill",
          template: `#include <iostream>
#include <set>
using namespace std;

int main() {
    int n;
    cin >> n;
    set<int> unik;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        unik.___(x);
    }
    cout << unik.___() << " nilai berbeda" << endl;
    for (int x : unik) {
        cout << x << " ";
    }
    cout << endl;
    return 0;
}`,
          solution: `#include <iostream>
#include <set>
using namespace std;

int main() {
    int n;
    cin >> n;
    set<int> unik;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        unik.insert(x);
    }
    cout << unik.size() << " nilai berbeda" << endl;
    for (int x : unik) {
        cout << x << " ";
    }
    cout << endl;
    return 0;
}`,
          tests: [
            { stdin: "6\n4 7 4 1 7 4", expectedOutput: "3 nilai berbeda\n1 4 7" },
            { stdin: "3\n5 5 5", expectedOutput: "1 nilai berbeda\n5" },
            { stdin: "5\n9 -2 3 -2 9", expectedOutput: "3 nilai berbeda\n-2 3 9", hidden: true },
          ],
          hints: [
            "Untuk memasukkan nilai ke set, pakai fungsi tambah milik set.",
            "Banyak isi set dibaca lewat fungsi ukuran.",
            "Jawabannya: insert dan size.",
          ],
        },
      ],
    },
    {
      slug: "stl-stack-queue",
      title: "stack dan queue: Tumpukan dan Antrean",
      summary: "Masukkan dan keluarkan data lewat stack LIFO dan queue FIFO.",
      steps: [
        {
          kind: "theory",
          title: "Dua aturan keluar masuk",
          body: "`stack` dan `queue` adalah container adapter: pembungkus yang membatasi akses ke satu pola tertentu. Stack memakai prinsip LIFO, terakhir masuk pertama keluar, seperti tumpukan piring: yang ditaruh paling atas diambil duluan. Queue memakai FIFO, pertama masuk pertama keluar, seperti antrean tiket: yang datang duluan dilayani duluan.\n\nKeduanya punya `push` untuk memasukkan dan `pop` untuk mengeluarkan, tetapi `pop` tidak mengembalikan apa pun. Nilai yang keluar harus dibaca dulu sebelum di-pop: dari stack lewat `top()`, dari queue lewat `front()`. Kekosongan dicek dengan `empty()`.\n\nPolanya muncul di mana saja: stack untuk undo, pengecekan kurung seimbang, atau penelusuran mendalam; queue untuk antrean proses dan penelusuran melebar. Header-nya masing-masing `<stack>` dan `<queue>`.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <stack>
using namespace std;

int main() {
    stack<string> riwayat;
    riwayat.push("beranda");
    riwayat.push("katalog");
    riwayat.push("detail");
    while (!riwayat.empty()) {
        cout << riwayat.top() << endl;
        riwayat.pop();
    }
    return 0;
}`,
            caption: "detail keluar duluan karena terakhir masuk: perilaku LIFO.",
          },
        },
        {
          kind: "quiz",
          question: "Urutan keluarnya elemen seperti apa yang dijamin sebuah stack?",
          options: [
            "Terakhir masuk, pertama keluar",
            "Pertama masuk, pertama keluar",
            "Nilai terkecil keluar duluan",
            "Urutannya acak",
          ],
          answer: 0,
          explanation: "Stack bekerja dengan prinsip LIFO (last in, first out): elemen yang terakhir di-push selalu keluar lebih dulu lewat `top()` lalu `pop()`.",
        },
        {
          kind: "code",
          title: "Dua urutan dari data yang sama",
          prompt: "Program ini memasukkan semua nilai yang dibaca ke sebuah stack dan sebuah queue, lalu mengosongkan keduanya. Hasilnya dua baris: urutan keluar dari stack, lalu urutan keluar dari queue. Lengkapi dua fungsi pembaca puncak.",
          mode: "fill",
          template: `#include <iostream>
#include <stack>
#include <queue>
using namespace std;

int main() {
    int n;
    cin >> n;
    stack<int> s;
    queue<int> q;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        s.push(x);
        q.push(x);
    }
    while (!s.empty()) {
        cout << s.___() << " ";
        s.pop();
    }
    cout << endl;
    while (!q.empty()) {
        cout << q.___() << " ";
        q.pop();
    }
    cout << endl;
    return 0;
}`,
          solution: `#include <iostream>
#include <stack>
#include <queue>
using namespace std;

int main() {
    int n;
    cin >> n;
    stack<int> s;
    queue<int> q;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        s.push(x);
        q.push(x);
    }
    while (!s.empty()) {
        cout << s.top() << " ";
        s.pop();
    }
    cout << endl;
    while (!q.empty()) {
        cout << q.front() << " ";
        q.pop();
    }
    cout << endl;
    return 0;
}`,
          tests: [
            { stdin: "4\n1 2 3 4", expectedOutput: "4 3 2 1\n1 2 3 4" },
            { stdin: "1\n9", expectedOutput: "9\n9" },
            { stdin: "5\n10 20 30 40 50", expectedOutput: "50 40 30 20 10\n10 20 30 40 50", hidden: true },
          ],
          hints: [
            "Yang dibaca dari stack adalah elemen paling atas tumpukan.",
            "Yang dibaca dari queue adalah elemen paling depan antrean.",
            "Jawabannya: top dan front.",
          ],
        },
      ],
    },
    {
      slug: "stl-deque",
      title: "deque: Antrean Dua Arah",
      summary: "Kenali deque, antrean dua arah dengan push_front dan push_back.",
      steps: [
        {
          kind: "theory",
          title: "Masuk dan keluar dari kedua ujung",
          body: "`deque`, singkatan dari double-ended queue, adalah antrean dua arah: elemen bisa masuk dan keluar dari kedua ujung dengan cepat. Selain `push_back` dan `pop_back` seperti vector, ia punya `push_front` dan `pop_front`, sesuatu yang mahal dilakukan vector karena seluruh isinya harus bergeser.\n\nAkses acak tetap tersedia: `d[i]` bekerja seperti pada vector, jadi deque terasa seperti menggabungkan kelebihan keduanya. Di balik layar ia disusun dari beberapa blok memori, bukan satu blok berurutan, dan itulah alasan menyisipkan di ujung depannya murah.\n\nPakai deque saat data hidup di dua ujung: riwayat yang bisa dipangkas dari depan dan belakang, penampung kerja yang itemnya diambil dari depan sementara yang baru masuk dari belakang, atau fondasi pola sliding window. Kalau hanya butuh menambah di belakang, vector tetap pilihan yang lebih sederhana.",
          code: {
            language: "cpp",
            content: `#include <deque>
#include <iostream>
using namespace std;

int main() {
    deque<int> d = {20, 30};
    d.push_front(10);
    d.push_back(40);
    d.pop_front();
    for (int x : d) {
        cout << x << " ";
    }
    cout << endl;
    cout << "elemen indeks 0: " << d[0] << endl;
    return 0;
}`,
            caption: "Masuk dari depan dan belakang sama-sama murah pada deque.",
          },
        },
        {
          kind: "quiz",
          question: "Kamu butuh penampung yang item barunya masuk dari belakang sementara pemakaian selalu mengambil dari depan, keduanya dengan cepat. Container mana yang paling tepat?",
          options: [
            "vector, karena punya push_back",
            "stack, karena punya pop",
            "deque, karena punya push_front dan pop_front yang murah",
            "set, karena isinya terurut",
          ],
          answer: 2,
          explanation: "Mengambil dari depan vector berarti menggeser semua elemennya. `deque` dirancang untuk kerja dua ujung: `push_front` dan `pop_front` sama murahnya dengan versi back-nya.",
        },
      ],
    },
    {
      slug: "stl-priority-queue",
      title: "priority_queue: Terbesar Keluar Duluan",
      summary: "Pahami priority_queue: elemen terbesar selalu keluar duluan.",
      steps: [
        {
          kind: "theory",
          title: "Antrean yang mengutamakan kepentingan",
          body: "`priority_queue` adalah antrean yang paling penting keluar duluan, bukan yang pertama masuk. Secara default ia menyimpan nilai terbesar di puncak: `top()` selalu mengembalikan elemen terbesar yang ada di dalamnya, dan `pop()` mengeluarkannya. Struktur di baliknya adalah heap, sehingga push dan pop berjalan dalam O(log n) tanpa perlu mengurutkan seluruh isinya.\n\nTingkah lakunya bisa dibalik. Dengan memberi comparator `greater<int>` pada deklarasinya, `priority_queue<int, vector<int>, greater<int>>` menjadikan elemen terkecil yang keluar duluan. Pola ini sering dipakai untuk kumpulan data yang terus ditanya: mana yang terbesar, terkecil, terdekat, atau prioritasnya tertinggi.\n\nBedanya dengan queue biasa: queue menjaga urutan kedatangan, priority_queue menjaga urutan kepentingan. Perhatikan juga `top()` hanya membaca; untuk mengambil sekaligus mengeluarkan, panggil `top()` dulu lalu `pop()`.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    priority_queue<int> pq;
    pq.push(30);
    pq.push(10);
    pq.push(50);
    cout << "puncak: " << pq.top() << endl;
    pq.pop();
    cout << "puncak baru: " << pq.top() << endl;

    priority_queue<int, vector<int>, greater<int>> naik;
    naik.push(30);
    naik.push(10);
    cout << "terkecil: " << naik.top() << endl;
    return 0;
}`,
            caption: "Tanpa comparator, yang terbesar di puncak; dengan greater<int>, yang terkecil.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang dikembalikan `pq.top()` untuk `priority_queue<int>` tanpa comparator?",
          options: [
            "Elemen pertama yang masuk",
            "Elemen terakhir yang masuk",
            "Elemen terkecil",
            "Elemen terbesar",
          ],
          answer: 3,
          explanation: "Priority_queue default adalah max-heap: `top()` selalu menunjuk elemen terbesar. Untuk menjadikan yang terkecil keluar duluan, deklarasikan dengan `greater<int>`.",
        },
      ],
    },
    {
      slug: "stl-inventaris",
      title: "Latihan Gabungan: Inventaris Toko",
      summary: "Pilih container yang tepat lalu perbaiki program inventaris berbasis map.",
      steps: [
        {
          kind: "theory",
          title: "Memilih container yang tepat",
          body: "Setelah berkenalan dengan banyak container, keterampilan yang paling menentukan sekarang adalah memilih yang pas. Kaidah praktisnya: vector untuk deretan utama yang sering diakses lewat posisi; map untuk mencocokkan kunci dengan nilai; set untuk mengetahui apa saja nilai berbeda yang pernah muncul; stack untuk urutan terakhir masuk pertama keluar; queue untuk antrean yang adil urut kedatangan; dan priority_queue untuk yang terpenting keluar duluan.\n\nDalam satu program nyata, container-container itu biasanya bekerja bersama. Program inventaris misalnya, hidup dari map: setiap kali pasokan datang, stok untuk nama barang itu ditambah, bukan ditimpa. Kesalahan klasik di sini adalah menulis `stok[nama] = jumlah` padahal maksudnya `stok[nama] += jumlah`; keduanya kompilasi tanpa keluhan, tetapi hasilnya berbeda.\n\nLatihan kali ini sengaja berbentuk perbaikan: programnya hampir benar, dan tugasmu menemukan satu baris yang membuat hitungannya keliru. Kebiasaan yang sama seperti mencari bug di kode sungguhan.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> stok;
    stok["gula"] += 10;
    stok["teh"] += 5;
    stok["gula"] += 7;
    int total = 0;
    for (const auto& p : stok) {
        total += p.second;
    }
    cout << "gula: " << stok["gula"] << endl;
    cout << "total unit: " << total << endl;
    return 0;
}`,
            caption: "+= menambah stok yang sudah ada; kalau pakai =, pasokan lama tertimpa.",
          },
        },
        {
          kind: "quiz",
          question: "Untuk mencatat berapa unit setiap jenis barang, container mana yang paling pas?",
          options: [
            "vector<int> berisi jumlah tiap kiriman",
            "map<string, int> dengan nama barang sebagai kunci",
            "stack<pair<string, int>>",
            "deque<string> berisi nama barang",
          ],
          answer: 1,
          explanation: "Yang dibutuhkan adalah pencocokan nama ke jumlah, dan itu definisi `map`. vector hanya menyimpan deretan tanpa kunci; stack dan deque mengatur urutan, bukan pencocokan.",
        },
        {
          kind: "code",
          title: "Perbaiki catatan inventaris",
          prompt: "Program ini membaca `n` kiriman barang (nama dan jumlah per baris), lalu satu nama yang dicari. Keluarannya dua baris: stok untuk nama yang dicari, dan total seluruh unit. Sayangnya hasil hitungannya salah. Cari satu kesalahannya dan perbaiki.",
          mode: "fix",
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
        stok[nama] = jumlah;
    }
    string cari;
    cin >> cari;
    if (stok.count(cari) > 0) {
        cout << cari << ": " << stok[cari] << endl;
    } else {
        cout << cari << ": habis" << endl;
    }
    int total = 0;
    for (const auto& p : stok) {
        total += p.second;
    }
    cout << "total unit: " << total << endl;
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
        stok[nama] += jumlah;
    }
    string cari;
    cin >> cari;
    if (stok.count(cari) > 0) {
        cout << cari << ": " << stok[cari] << endl;
    } else {
        cout << cari << ": habis" << endl;
    }
    int total = 0;
    for (const auto& p : stok) {
        total += p.second;
    }
    cout << "total unit: " << total << endl;
    return 0;
}`,
          tests: [
            { stdin: "4\ngula 10\nteh 5\ngula 7\nberas 3\ngula", expectedOutput: "gula: 17\ntotal unit: 25" },
            { stdin: "2\nbuku 3\npulpen 4\npulpen", expectedOutput: "pulpen: 4\ntotal unit: 7" },
            { stdin: "3\ncat 2\ncat 1\noli 5\ncat", expectedOutput: "cat: 3\ntotal unit: 8", hidden: true },
          ],
          hints: [
            "Jalankan tes pertama: gula dikirim dua kali, 10 lalu 7, dan seharusnya berakhir 17. Bandingkan dengan hasil programmu.",
            "Perhatikan loop pembacaan kiriman: setiap kiriman seharusnya menambah stok yang sudah ada, bukan menimpanya.",
            "Ganti penugasan timpa (sama dengan) dengan penugasan tambah (+=) pada baris stok[nama].",
          ],
        },
      ],
    },
    // ==================== MODUL 3: Algoritma dan Lambda ====================
    {
      slug: "alg-sort-dasar",
      title: "sort: Mengurutkan Satu Baris",
      summary: "Urutkan vector menaik dan menurun dengan sort dan greater.",
      steps: [
        {
          kind: "theory",
          title: "Dua argumen untuk menaik, satu comparator untuk menurun",
          body: "Header `<algorithm>` berisi kumpulan fungsi yang dulu ditulis sendiri dengan for: mengurutkan, mencari, menghitung. Fungsi paling terkenalnya `sort`: beri dia iterator awal dan akhir, dan seluruh rentang itu terurut menaik. Untuk vector, bentuknya selalu sama: `sort(nilai.begin(), nilai.end())`.\n\nUrutan default-nya menaik karena sort membandingkan elemen dengan `<`. Kalau ingin menurun, beri argumen ketiga berupa comparator siap pakai `greater<int>()`; ia membalik perbandingannya sehingga yang besar ditaruh duluan. Ada juga `less<int>()`, yang perilakunya sama dengan default dan karena itu jarang ditulis.\n\nKasus lain tidak butuh trik: string terurut sesuai abjad, dan kalau data mengandung duplikat, semua duplikat tetap ada berdampingan. Waktu jalannya dijamin O(n log n), jauh lebih baik daripada sort sederhana buatan sendiri yang biasanya `O(n^2)`.",
          code: {
            language: "cpp",
            content: `#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nilai = {4, 10, 7, 1};
    sort(nilai.begin(), nilai.end());
    for (int x : nilai) {
        cout << x << " ";
    }
    cout << endl;
    sort(nilai.begin(), nilai.end(), greater<int>());
    for (int x : nilai) {
        cout << x << " ";
    }
    cout << endl;
    return 0;
}`,
            caption: "Baris pertama menaik, baris kedua menurun, dari data yang sama.",
          },
        },
        {
          kind: "quiz",
          question: "Header apa yang wajib disertakan untuk memakai `sort`?",
          options: ["<vector>", "<numeric>", "<algorithm>", "<iostream>"],
          answer: 2,
          explanation: "`sort`, `find`, `count`, `min_element`, dan `transform` semuanya tinggal di `<algorithm>`. `<numeric>` mengurus accumulate.",
        },
        {
          kind: "code",
          title: "Naik lalu turun",
          prompt: "Program ini membaca `n` bilangan lalu mencetaknya dua kali: dulu terurut menaik, lalu terurut menurun. Perulangan pencetakannya sudah selesai; tugasmu melengkapi dua panggilan sort, khususnya argumen ketiganya untuk urutan menurun.",
          mode: "fill",
          template: `#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> nilai(n);
    for (int i = 0; i < n; i++) {
        cin >> nilai[i];
    }
    ___(nilai.begin(), nilai.end());
    for (int x : nilai) {
        cout << x << " ";
    }
    cout << "\\n";
    sort(nilai.begin(), nilai.end(), ___);
    for (int x : nilai) {
        cout << x << " ";
    }
    cout << endl;
    return 0;
}`,
          solution: `#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> nilai(n);
    for (int i = 0; i < n; i++) {
        cin >> nilai[i];
    }
    sort(nilai.begin(), nilai.end());
    for (int x : nilai) {
        cout << x << " ";
    }
    cout << "\\n";
    sort(nilai.begin(), nilai.end(), greater<int>());
    for (int x : nilai) {
        cout << x << " ";
    }
    cout << endl;
    return 0;
}`,
          tests: [
            { stdin: "5\n4 10 7 1 3", expectedOutput: "1 3 4 7 10\n10 7 4 3 1" },
            { stdin: "3\n5 5 2", expectedOutput: "2 5 5\n5 5 2" },
            { stdin: "1\n8", expectedOutput: "8\n8", hidden: true },
          ],
          hints: [
            "Sort menaik cukup dua argumen; yang menurun butuh comparator bawaan.",
            "Comparator bawaan untuk membalik perbandingan int adalah greater<int>(), lengkap dengan tanda kurung karena ini objek, bukan tipe.",
            "Jawabannya: sort dan greater<int>().",
          ],
        },
      ],
    },
    {
      slug: "alg-sort-lambda",
      title: "Comparator Lambda: Urutan Buatan Sendiri",
      summary: "Tentukan urutan sendiri dengan comparator lambda pada sort.",
      steps: [
        {
          kind: "theory",
          title: "Lambda sebagai pembanding",
          body: "Sebagian besar data nyata tidak sesederhana sekumpulan int. Data lomba misalnya, tersusun dari nama dan skor: `pair<string, int>`. Kalau diberikan `sort` biasa, urutannya menaik berdasarkan nama, bukan berdasarkan skor. Untuk urutan buatan sendiri, sort menerima argumen ketiga berupa comparator: sebuah fungsi yang menerima dua elemen dan mengembalikan `true` kalau elemen pertama boleh berada sebelum yang kedua.\n\nMenulis fungsi terpisah untuk satu pemakaian terasa jauh. Lambda menyelesaikannya di tempat: `[](const pair<string, int>& a, const pair<string, int>& b) { return a.second > b.second; }`. Bagian `[]` di depan disebut capture, urusan yang dibahas tersendiri nanti. Mengurutkan menurun cukup dengan membalik tanda perbandingannya menjadi `>`.\n\nSatu syarat yang harus dijaga: comparator harus konsisten, hasilnya tidak boleh berubah-ubah untuk pasangan yang sama. Comparator yang menilai `a < b` benar tetapi `b < a` juga benar membuat sort menghasilkan urutan acak atau bahkan crash.",
          code: {
            language: "cpp",
            content: `#include <algorithm>
#include <iostream>
#include <string>
#include <utility>
#include <vector>
using namespace std;

int main() {
    vector<pair<string, int>> stok = {{"buku", 12}, {"pulpen", 40}, {"penggaris", 5}};
    sort(stok.begin(), stok.end(),
        [](const pair<string, int>& a, const pair<string, int>& b) {
            return a.second > b.second;
        });
    for (const auto& p : stok) {
        cout << p.first << " " << p.second << endl;
    }
    return 0;
}`,
            caption: "Stok terbanyak berada di baris pertama: diurutkan menurun lewat kolom kedua.",
          },
        },
        {
          kind: "quiz",
          question: "Dalam comparator sort, apa arti comparator mengembalikan true untuk pasangan (a, b)?",
          options: [
            "a dan b dianggap sama saja",
            "a boleh ditaruh sebelum b",
            "b wajib ditaruh sebelum a",
            "sort menghentikan prosesnya",
          ],
          answer: 1,
          explanation: "Comparator menjawab pertanyaan: apakah a harus berada sebelum b? true berarti ya, false berarti urutannya dibalik atau dibiarkan.",
        },
        {
          kind: "code",
          title: "Klasemen lomba",
          prompt: "Urutkan klasemen lomba: baca `n` peserta (nama dan skor per baris), lalu cetak dari skor tertinggi ke terendah. Dua kekosongan tersisa: perbandingan di dalam comparator dan bagian skor saat mencetak.",
          mode: "fill",
          template: `#include <algorithm>
#include <iostream>
#include <string>
#include <utility>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<string, int>> pemain(n);
    for (int i = 0; i < n; i++) {
        cin >> pemain[i].first >> pemain[i].second;
    }
    sort(pemain.begin(), pemain.end(),
        [](const pair<string, int>& a, const pair<string, int>& b) {
            return a.second ___ b.second;
        });
    for (const auto& p : pemain) {
        cout << p.first << " " << ___ << "\\n";
    }
    return 0;
}`,
          solution: `#include <algorithm>
#include <iostream>
#include <string>
#include <utility>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<string, int>> pemain(n);
    for (int i = 0; i < n; i++) {
        cin >> pemain[i].first >> pemain[i].second;
    }
    sort(pemain.begin(), pemain.end(),
        [](const pair<string, int>& a, const pair<string, int>& b) {
            return a.second > b.second;
        });
    for (const auto& p : pemain) {
        cout << p.first << " " << p.second << "\\n";
    }
    return 0;
}`,
          tests: [
            { stdin: "3\nbudi 80\nsari 95\nanto 70", expectedOutput: "sari 95\nbudi 80\nanto 70" },
            { stdin: "4\ndina 1\narya 4\ncika 3\nbima 2", expectedOutput: "arya 4\ncika 3\nbima 2\ndina 1" },
            { stdin: "2\nzaki 10\nyuni 20", expectedOutput: "yuni 20\nzaki 10", hidden: true },
          ],
          hints: [
            "Skor tertinggi dulu berarti comparator mengembalikan true saat skor a lebih besar dari b. Perhatikan arah tanda perbandingannya.",
            "Skor sebuah pair terletak di second, sama seperti yang dipakai di comparator.",
            "Jawabannya: > pada perbandingan, dan p.second pada pencetakan.",
          ],
        },
      ],
    },
    {
      slug: "alg-find-count",
      title: "find dan count: Mencari Tanpa for",
      summary: "Cari dan hitung elemen dengan find, count, dan count_if.",
      steps: [
        {
          kind: "theory",
          title: "Iterator jawaban, count menghitung, count_if menyeleksi",
          body: "Dua pekerjaan paling sering pada kumpulan data: ada tidaknya sebuah nilai, dan berapa banyak kemunculannya. `find(data.begin(), data.end(), cari)` menyapu rentang itu dan mengembalikan iterator ke kemunculan pertama. Kalau tidak ketemu, ia mengembalikan `data.end()`, sehingga pengecekannya selalu berupa perbandingan dengan end.\n\nIterator hasil find bisa dipakai lebih jauh: dikurangi `data.begin()` ia berubah menjadi indeks kemunculan itu, persis seperti indeks array. Bisa juga untuk melanjutkan pencarian dari titik ketemu: mulai pencarian berikutnya dari `it + 1`.\n\nUntuk menghitung kemunculan, pakai `count` dengan tiga argumen yang sama. Kalau syaratnya bukan kesamaan tetapi kondisi, misalnya nilai di atas 70, pakai `count_if` dan beri predikat lambda: `count_if(data.begin(), data.end(), [](int x) { return x > 70; })`.",
          code: {
            language: "cpp",
            content: `#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nilai = {4, 8, 15, 8, 4};
    auto it = find(nilai.begin(), nilai.end(), 15);
    if (it != nilai.end()) {
        cout << "15 di indeks " << it - nilai.begin() << endl;
    }
    int banyak8 = count(nilai.begin(), nilai.end(), 8);
    cout << "8 muncul " << banyak8 << " kali" << endl;
    return 0;
}`,
            caption: "Selisih iterator dengan begin() menghasilkan indeks.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang dikembalikan `find` kalau nilai yang dicari tidak ada di rentang itu?",
          options: [
            "Iterator ke elemen pertama",
            "Nilai -1",
            "Iterator yang sama dengan end() rentang itu",
            "Iterator ke elemen terakhir",
          ],
          answer: 2,
          explanation: "Tanda tidak ketemunya adalah iterator `end()`. Karena itu pengecekannya selalu berbentuk `if (it != v.end())`.",
        },
        {
          kind: "code",
          title: "Cari dan hitung",
          prompt: "Program ini membaca `n`, satu nilai yang dicari, lalu `n` bilangan. Keluarannya dua baris: posisi kemunculan pertama (atau pesan tidak ada) dan banyaknya kemunculan. Lengkapi dua panggilan algoritma.",
          mode: "fill",
          template: `#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, cari;
    cin >> n >> cari;
    vector<int> data(n);
    for (int i = 0; i < n; i++) {
        cin >> data[i];
    }
    auto it = ___(data.begin(), data.end(), cari);
    if (it != data.end()) {
        cout << "ada di indeks " << it - data.begin() << endl;
    } else {
        cout << "tidak ada" << endl;
    }
    int jumlah = ___(data.begin(), data.end(), cari);
    cout << "muncul " << jumlah << " kali" << endl;
    return 0;
}`,
          solution: `#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, cari;
    cin >> n >> cari;
    vector<int> data(n);
    for (int i = 0; i < n; i++) {
        cin >> data[i];
    }
    auto it = find(data.begin(), data.end(), cari);
    if (it != data.end()) {
        cout << "ada di indeks " << it - data.begin() << endl;
    } else {
        cout << "tidak ada" << endl;
    }
    int jumlah = count(data.begin(), data.end(), cari);
    cout << "muncul " << jumlah << " kali" << endl;
    return 0;
}`,
          tests: [
            { stdin: "6 8\n4 8 15 8 4 8", expectedOutput: "ada di indeks 1\nmuncul 3 kali" },
            { stdin: "4 7\n1 2 3 4", expectedOutput: "tidak ada\nmuncul 0 kali" },
            { stdin: "1 5\n5", expectedOutput: "ada di indeks 0\nmuncul 1 kali", hidden: true },
          ],
          hints: [
            "Fungsi untuk mencari kemunculan pertama mengembalikan iterator.",
            "Fungsi untuk menghitung kemunculan mengembalikan angka.",
            "Jawabannya: find dan count.",
          ],
        },
      ],
    },
    {
      slug: "alg-accumulate",
      title: "accumulate: Merangkum Jadi Satu Nilai",
      summary: "Jumlahkan isi vector dengan accumulate, termasuk nilai awalnya yang penting.",
      steps: [
        {
          kind: "theory",
          title: "Nilai awal bukan formalitas",
          body: "Menjumlahkan seluruh isi vector adalah pekerjaan yang terlalu sering muncul untuk ditulis manual setiap kali. `<numeric>` menyediakan `accumulate`: ia menyapu rentang sambil membawa angka penampung, dimulai dari nilai awal yang kamu tentukan. `accumulate(data.begin(), data.end(), 0)` menghasilkan total seluruh elemen.\n\nNilai awal bukan formalitas. Selain sebagai titik mulai, ia menentukan tipe penampungnya; itulah alasan nilai awal penjumlahan int ditulis `0`, dan kalau hasilnya mau pecahan, tipe penampung dan pembaginya harus diatur juga. Ada versi empat argumen yang mengganti penjumlahan dengan operasi lain, misalnya lambda untuk mengalikan semua elemen atau menjumlahkan kuadratnya.\n\nSatu kebiasaan yang perlu dibentuk sejak sekarang: periksa nilai awalnya setiap kali memakai accumulate. Kesalahan satu angka di sana tidak pernah membuat program error; hasilnya hanya bergeser diam-diam, dan bug seperti itu paling sulit ditemukan.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <numeric>
#include <vector>
using namespace std;

int main() {
    vector<int> nilai = {4, 10, 7};
    int total = accumulate(nilai.begin(), nilai.end(), 0);
    int kuadrat = accumulate(nilai.begin(), nilai.end(), 0,
        [](int penampung, int x) { return penampung + x * x; });
    cout << "total: " << total << endl;
    cout << "jumlah kuadrat: " << kuadrat << endl;
    return 0;
}`,
            caption: "Versi empat argumen mengganti penjumlahan biasa dengan operasi lambda.",
          },
        },
        {
          kind: "quiz",
          question: "Header apa yang dibutuhkan untuk memakai `accumulate`?",
          options: ["<algorithm>", "<numeric>", "<cmath>", "<iterator>"],
          answer: 1,
          explanation: "`accumulate` tinggal di `<numeric>`, terpisah dari saudaranya di `<algorithm>`. Lupa header ini adalah error kompilasi paling umum soal accumulate.",
        },
        {
          kind: "code",
          title: "Perbaiki total yang bergeser",
          prompt: "Program ini seharusnya mencetak total dan rata-rata (dua desimal) dari `n` bilangan yang dibaca. Hasilnya sekarang selalu lebih besar dari seharusnya. Temukan satu kesalahannya dan perbaiki.",
          mode: "fix",
          template: `#include <iostream>
#include <iomanip>
#include <numeric>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> data(n);
    for (int i = 0; i < n; i++) {
        cin >> data[i];
    }
    int total = accumulate(data.begin(), data.end(), 1);
    cout << "total: " << total << endl;
    cout << fixed << setprecision(2) << "rata-rata: " << (double)total / n << endl;
    return 0;
}`,
          solution: `#include <iostream>
#include <iomanip>
#include <numeric>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> data(n);
    for (int i = 0; i < n; i++) {
        cin >> data[i];
    }
    int total = accumulate(data.begin(), data.end(), 0);
    cout << "total: " << total << endl;
    cout << fixed << setprecision(2) << "rata-rata: " << (double)total / n << endl;
    return 0;
}`,
          tests: [
            { stdin: "5\n4 10 7 1 3", expectedOutput: "total: 25\nrata-rata: 5.00" },
            { stdin: "3\n2 2 2", expectedOutput: "total: 6\nrata-rata: 2.00" },
            { stdin: "4\n1 2 3 4", expectedOutput: "total: 10\nrata-rata: 2.50", hidden: true },
          ],
          hints: [
            "Coba tes pertama dengan hitungan manual: 4 + 10 + 7 + 1 + 3. Bandingkan dengan keluaran programmu; selisihnya konsisten.",
            "Argumen ketiga accumulate adalah nilai awal penjumlahan, dan nilai awal yang benar untuk penjumlahan adalah 0.",
            "Ganti angka 1 pada pemanggilan accumulate menjadi 0.",
          ],
        },
      ],
    },
    {
      slug: "alg-min-max-element",
      title: "min_element dan max_element",
      summary: "Ambil nilai terkecil dan terbesar lewat min_element dan max_element.",
      steps: [
        {
          kind: "theory",
          title: "Pencarian ekstrem dalam satu panggilan",
          body: "Sebelum ada `<algorithm>`, mencari nilai terkecil berarti menyalin pola yang sama lagi dan lagi: variabel penampung, for, perbandingan. `min_element` dan `max_element` memotong semua itu. Keduanya menerima rentang iterator dan mengembalikan iterator menuju elemen terkecil atau terbesar.\n\nKarena kembaliannya iterator, nilainya diambil dengan tanda bintang: `*min_element(data.begin(), data.end())`. Iterator itu juga bisa langsung dipakai untuk hal lain, misalnya menghapus elemen terbesar atau menghitung posisinya lewat selisih dengan `begin()`.\n\nPerhatian khusus untuk vector kosong: saat tidak ada elemen, kedua fungsi mengembalikan `end()`, dan membaca `*end()` adalah perilaku tidak terdefinisi. Kebiasaan amannya, cek `data.empty()` dulu kalau vector-nya mungkin kosong. Kalau ada beberapa elemen bernilai sama, kedua fungsi mengembalikan yang paling awal.",
          code: {
            language: "cpp",
            content: `#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> suhu = {28, 31, 25, 31};
    auto terdingin = min_element(suhu.begin(), suhu.end());
    auto terpanas = max_element(suhu.begin(), suhu.end());
    cout << "terdingin: " << *terdingin << endl;
    cout << "terpanas: " << *terpanas << " di indeks " << terpanas - suhu.begin() << endl;
    return 0;
}`,
            caption: "Kembaliannya iterator: dibaca dengan tanda bintang, indeksnya dihitung lewat selisih.",
          },
        },
        {
          kind: "quiz",
          question: "Apa tipe kembalian `min_element`?",
          options: [
            "Nilai terkecil dalam bentuk int",
            "Indeks elemen terkecil",
            "bool penanda ketemu atau tidak",
            "Iterator menuju elemen terkecil",
          ],
          answer: 3,
          explanation: "Kembaliannya iterator, karena itu nilainya diambil dengan tanda bintang dan indeksnya dihitung lewat selisih dengan `begin()`.",
        },
        {
          kind: "code",
          title: "Min, max, dan selisihnya",
          prompt: "Program ini membaca `n` bilangan lalu mencetak nilai terkecil, terbesar, dan selisih keduanya, masing-masing satu baris dengan awalan min, max, dan selisih. Lengkapi dua panggilan algoritma di dalamnya.",
          mode: "fill",
          template: `#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> data(n);
    for (int i = 0; i < n; i++) {
        cin >> data[i];
    }
    int terkecil = *___(data.begin(), data.end());
    int terbesar = *___(data.begin(), data.end());
    cout << "min: " << terkecil << endl;
    cout << "max: " << terbesar << endl;
    cout << "selisih: " << terbesar - terkecil << endl;
    return 0;
}`,
          solution: `#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> data(n);
    for (int i = 0; i < n; i++) {
        cin >> data[i];
    }
    int terkecil = *min_element(data.begin(), data.end());
    int terbesar = *max_element(data.begin(), data.end());
    cout << "min: " << terkecil << endl;
    cout << "max: " << terbesar << endl;
    cout << "selisih: " << terbesar - terkecil << endl;
    return 0;
}`,
          tests: [
            { stdin: "5\n4 10 7 1 3", expectedOutput: "min: 1\nmax: 10\nselisih: 9" },
            { stdin: "3\n5 5 5", expectedOutput: "min: 5\nmax: 5\nselisih: 0" },
            { stdin: "4\n-8 3 -1 12", expectedOutput: "min: -8\nmax: 12\nselisih: 20", hidden: true },
          ],
          hints: [
            "Dua fungsi yang dicari mengembalikan iterator menuju elemen, dan nilainya sudah dibaca dengan tanda bintang.",
            "Yang pertama mencari nilai terkecil, yang kedua terbesar.",
            "Jawabannya: min_element dan max_element.",
          ],
        },
      ],
    },
    {
      slug: "alg-transform",
      title: "transform: Mengubah Setiap Elemen",
      summary: "Ubah setiap elemen dengan transform tanpa menulis for manual.",
      steps: [
        {
          kind: "theory",
          title: "Satu operasi untuk semua elemen",
          body: "`transform` menerapkan satu operasi ke setiap elemen dan menaruh hasilnya di tempat tujuan. Bentuk paling umumnya empat argumen: awal, akhir, tujuan, dan operasinya. Operasi itu berupa fungsi atau lambda yang menerima satu elemen dan mengembalikan satu hasil, misalnya `[](int x) { return x * 2; }`.\n\nTujuannya boleh vector itu sendiri, seperti pada contoh di bawah, sehingga seluruh isinya berubah di tempat. Bisa juga vector kosong, dengan satu syarat: pakai `back_inserter` sebagai tujuan supaya hasil ditambahkan satu per satu alih alih ditulis ke posisi yang belum ada isinya.\n\nPerbedaannya dengan for manual bukan kemampuan, melainkan maksud: transform menyatakan niat bahwa setiap elemen diubah dengan operasi yang sama, dan pembaca langsung paham tanpa menelusuri isi loop. Sisa rentang, indeks, dan variabel bantu tidak ikut muncul di kode.",
          code: {
            language: "cpp",
            content: `#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> harga = {10, 25, 40};
    transform(harga.begin(), harga.end(), harga.begin(),
        [](int x) { return x + 5; });
    for (int x : harga) {
        cout << x << " ";
    }
    cout << endl;
    return 0;
}`,
            caption: "Setiap harga dinaikkan 5, langsung di vector yang sama.",
          },
        },
        {
          kind: "quiz",
          question: "Setelah `transform(v.begin(), v.end(), v.begin(), [](int x) { return x * 2; })` dengan v berisi {1, 2, 3}, isi v menjadi?",
          options: ["{1, 2, 3}", "{3, 6, 9}", "{2, 4, 6}", "{1, 4, 9}"],
          answer: 2,
          explanation: "Setiap elemen diganti hasil operasinya: 1 menjadi 2, 2 menjadi 4, 3 menjadi 6. Yang terjadi penggandaan, bukan pengkuadratan.",
        },
      ],
    },
    {
      slug: "alg-iterator-dasar",
      title: "Iterator: Penunjuk Universal Container",
      summary: "Pahami iterator: begin, end, dereference, dan aritmetikanya.",
      steps: [
        {
          kind: "theory",
          title: "Bahasa bersama semua algoritma",
          body: "Iterator adalah penunjuk posisi di dalam container, dan bisa dibayangkan sebagai generalisasi pointer. Setiap container menyediakan `begin()` yang menunjuk elemen pertama dan `end()` yang menunjuk posisi tepat setelah elemen terakhir. Rentang `[begin, end)` inilah bahasa resmi semua algoritma STL: sort, find, accumulate semuanya berbicara lewat iterator, bukan lewat nama container.\n\nMembaca elemen yang ditunjuk dilakukan dengan tanda bintang: `*it`. Iterator juga bisa dimajukan (`++it`) dan dibandingkan (`it != end()`). Pola for klasik dengan iterator persis seperti di contoh, dan range-for yang selama ini kamu pakai sebenarnya menulis pola itu untukmu di belakang layar.\n\nPada vector dan deque, iterator bersifat random access sehingga bisa dilompati: `v.begin() + 3` langsung menunjuk elemen keempat, dan `it - v.begin()` menghasilkan indeksnya. Iterator map dan set hanya bisa maju satu langkah, dan itu wajar: isinya tersusun sebagai pohon, bukan deret berurutan di memori.",
          code: {
            language: "cpp",
            content: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> data = {10, 20, 30, 40};
    auto it = data.begin();
    cout << "*it: " << *it << endl;
    it += 2;
    cout << "setelah maju dua: " << *it << endl;
    cout << "indeksnya: " << it - data.begin() << endl;
    for (auto p = data.begin(); p != data.end(); ++p) {
        cout << *p << " ";
    }
    cout << endl;
    return 0;
}`,
            caption: "begin(), end(), tanda bintang, dan selisih iterator: empat gerakan dasarnya.",
          },
        },
        {
          kind: "quiz",
          question: "Pada vector berisi {10, 20, 30, 40}, berapa nilai `*(v.begin() + 2)`?",
          options: ["10", "20", "30", "40"],
          answer: 2,
          explanation: "`begin()` menunjuk elemen indeks 0, jadi `begin() + 2` menunjuk elemen indeks 2, yaitu 30.",
        },
      ],
    },
    {
      slug: "alg-lambda-capture",
      title: "Capture [&] dan [=]: Apa yang Dibawa Lambda",
      summary: "Bawa variabel luar ke dalam lambda lewat capture [=] dan [&].",
      steps: [
        {
          kind: "theory",
          title: "Daftar bawaan di dalam kurung siku",
          body: "Tanda kurung siku di depan lambda bukan hiasan; itu daftar variabel luar yang dibawa masuk. Lambda tanpa capture, `[]`, hanya bisa memakai parameternya sendiri. Begitu isi lambda menyebut variabel dari luar, variabel itu wajib dicapture, dan compiler akan protes kalau tidak.\n\n`[=]` membawa salinan nilai semua variabel yang dipakai: aman untuk lambda yang disimpan dan dijalankan nanti, tetapi perubahan di dalam lambda tidak pernah menyentuh variabel aslinya. `[&]` membawa semuanya lewat referensi: perubahan di dalam lambda terjadi sungguhan pada variabel aslinya, dengan konsekuensi lambda tidak boleh hidup lebih lama dari variabel yang dirujuknya. Satu per satu juga bisa: `[&total, batas]` membawa total lewat referensi dan menyalin batas.\n\nKaidah memilihnya singkat: pakai `[&]` saat lambda harus mengubah variabel luar atau menghindari salinan data besar, dan `[=]` saat hanya membaca nilai kecil yang tidak berubah. Comparator sort pada lesson sebelumnya tidak capture apa pun karena semua data sampai lewat parameter, dan itu pola yang sehat.",
          code: {
            language: "cpp",
            content: `#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> data = {5, 12, 8, 20};
    int batas = 10;
    int hitung = 0;
    for_each(data.begin(), data.end(), [&](int x) {
        if (x > batas) {
            hitung++;
        }
    });
    cout << "di atas " << batas << ": " << hitung << " buah" << endl;
    return 0;
}`,
            caption: "Tanpa capture &, lambda tidak akan bisa menyentuh batas maupun hitung.",
          },
        },
        {
          kind: "quiz",
          question: "Lambda ini ingin benar-benar menaikkan penghitung di luarnya: `auto tambah = [???]() { hitung++; };`. Capture apa yang harus mengisi ??? ?",
          options: ["[]", "[=]", "[hitung]", "[&]"],
          answer: 3,
          explanation: "`[=]` dan `[hitung]` menyalin nilai, jadi yang naik hanya salinannya. Yang mengubah variabel aslinya adalah capture referensi, `[&]`.",
        },
      ],
    },
    {
      slug: "alg-remove-erase",
      title: "Idiom remove-erase",
      summary: "Hapus elemen dengan benar lewat idiom remove-erase.",
      steps: [
        {
          kind: "theory",
          title: "remove tidak menghapus, erase yang memotong",
          body: "`remove` punya nama yang menipu: ia tidak menghapus apa pun. Yang ia lakukan adalah memindahkan semua elemen yang dipertahankan ke bagian depan, lalu mengembalikan iterator ke ujung logis yang baru. Apa yang tersisa di belakang ujung itu tidak lagi terpakai, tetapi masih ada: `size()` vector tidak berubah sedikit pun.\n\nAgar benar-benar hilang, hasil remove dipakai sebagai awal pemanggilan `erase`: `data.erase(remove(data.begin(), data.end(), 4), data.end())`. erase-lah yang memotong ekornya. Pasangan ini begitu rapat sampai punya nama sendiri, idiom remove-erase, dan bentuk satu barisnya wajib dikenali karena muncul di hampir semua kode C++ yang membaca data.\n\nSejak C++20 ada jalan pintas berupa `std::erase` dan `std::erase_if` yang mengerjakan keduanya sekaligus. Tetap saja idiom lama layak dipahami: di banyak kode warisan, tutorial, dan codebase nyata, remove-erase adalah bentuk yang kamu temui.",
          code: {
            language: "cpp",
            content: `#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> data = {4, 1, 4, 2};
    auto ujung = remove(data.begin(), data.end(), 4);
    cout << "size setelah remove: " << data.size() << endl;
    data.erase(ujung, data.end());
    for (int x : data) {
        cout << x << " ";
    }
    cout << endl;
    return 0;
}`,
            caption: "remove memindahkan yang disimpan ke depan, erase yang memotong ukurannya.",
          },
        },
        {
          kind: "quiz",
          question: "Setelah `remove(v.begin(), v.end(), 4)` saja, tanpa erase, pada v berisi {4, 1, 4, 2}, pernyataan mana yang benar?",
          options: [
            "v berisi {1, 2} dan size() menjadi 2",
            "v menjadi kosong",
            "size() tetap 4 dan bagian belakangnya berisi data sisa",
            "remove melempar error",
          ],
          answer: 2,
          explanation: "`remove` hanya memindahkan elemen yang disimpan ke depan dan mengembalikan ujung logis baru. Ukuran tidak berubah; yang memotong adalah `erase`.",
        },
      ],
    },
    {
      slug: "alg-laporan-data",
      title: "Latihan Gabungan: Laporan Penjualan",
      summary: "Rangkum data penjualan dengan accumulate dan max_element dalam satu laporan.",
      steps: [
        {
          kind: "theory",
          title: "Baca, rangkum, laporkan",
          body: "Penutup modul ini menyatukan semuanya dalam satu pola kerja yang sangat umum: baca data ke dalam container, rangkum dengan algoritma, cetak laporannya. Data penjualan per toko muat sempurna dalam `vector<pair<string, int>>`, dan dari situ dua pertanyaan paling sering muncul langsung dijawab oleh dua fungsi yang sudah kamu kenal.\n\nTotal seluruh penjualan dihitung dengan accumulate versi empat argumen: nilai awal 0 dan lambda yang menambahkan `p.second` ke penampung. Peraih omzet tertinggi dicari dengan max_element plus lambda pembanding pada kolom kedua; hasilnya iterator, dan nama serta angkanya diakses lewat `->first` dan `->second`.\n\nPerhatikan satu hal di latihan berikut: tidak ada satu pun for manual di bagian penghitungan. Membaca data memang butuh for, tetapi meringkas dan mencari yang terbaik selesai dalam dua panggilan algoritma. Itulah gaya yang membuat kode tetap terbaca saat data dan pertanyaannya bertambah.",
          code: {
            language: "cpp",
            content: `#include <algorithm>
#include <iostream>
#include <numeric>
#include <string>
#include <utility>
#include <vector>
using namespace std;

int main() {
    vector<pair<string, int>> penjualan = {{"tokoA", 120}, {"tokoB", 250}, {"tokoC", 90}};
    int total = accumulate(penjualan.begin(), penjualan.end(), 0,
        [](int penampung, const pair<string, int>& p) { return penampung + p.second; });
    auto terbaik = max_element(penjualan.begin(), penjualan.end(),
        [](const pair<string, int>& a, const pair<string, int>& b) { return a.second < b.second; });
    cout << "total omzet: " << total << endl;
    cout << "terbaik: " << terbaik->first << " (" << terbaik->second << ")" << endl;
    return 0;
}`,
            caption: "Dua algoritma menjawab dua pertanyaan laporan tanpa for manual.",
          },
        },
        {
          kind: "quiz",
          question: "Seluruh algoritma STL seperti sort, find, dan accumulate menerima rentang kerjanya lewat...",
          options: ["nama containernya", "header <vector>", "iterator awal dan akhir", "tipe data int"],
          answer: 2,
          explanation: "Bahasa bersama semua algoritma adalah pasangan iterator `[begin, end)`. Karena itu algoritma yang sama bekerja pada vector, deque, sampai array biasa.",
        },
        {
          kind: "code",
          title: "Susun laporan penjualan",
          prompt: "Susun laporan penjualan: baca `n` baris berisi nama toko dan omzetnya, lalu cetak total seluruh omzet dan toko dengan omzet tertinggi. Dua kekosongan tersisa di bagian algoritma.",
          mode: "fill",
          template: `#include <algorithm>
#include <iostream>
#include <numeric>
#include <string>
#include <utility>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<string, int>> penjualan(n);
    for (int i = 0; i < n; i++) {
        cin >> penjualan[i].first >> penjualan[i].second;
    }
    int total = accumulate(penjualan.begin(), penjualan.end(), 0,
        [](int akumulasi, const pair<string, int>& p) {
            return akumulasi ___ p.second;
        });
    auto terbaik = ___(penjualan.begin(), penjualan.end(),
        [](const pair<string, int>& a, const pair<string, int>& b) {
            return a.second < b.second;
        });
    cout << "total omzet: " << total << endl;
    cout << "terbaik: " << terbaik->first << " (" << terbaik->second << ")" << endl;
    return 0;
}`,
          solution: `#include <algorithm>
#include <iostream>
#include <numeric>
#include <string>
#include <utility>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<string, int>> penjualan(n);
    for (int i = 0; i < n; i++) {
        cin >> penjualan[i].first >> penjualan[i].second;
    }
    int total = accumulate(penjualan.begin(), penjualan.end(), 0,
        [](int akumulasi, const pair<string, int>& p) {
            return akumulasi + p.second;
        });
    auto terbaik = max_element(penjualan.begin(), penjualan.end(),
        [](const pair<string, int>& a, const pair<string, int>& b) {
            return a.second < b.second;
        });
    cout << "total omzet: " << total << endl;
    cout << "terbaik: " << terbaik->first << " (" << terbaik->second << ")" << endl;
    return 0;
}`,
          tests: [
            { stdin: "4\ntokoA 120\ntokoB 250\ntokoC 90\ntokoD 40", expectedOutput: "total omzet: 500\nterbaik: tokoB (250)" },
            { stdin: "1\ntunggal 77", expectedOutput: "total omzet: 77\nterbaik: tunggal (77)" },
            { stdin: "3\nmerah 15\nbiru 8\nhijau 22", expectedOutput: "total omzet: 45\nterbaik: hijau (22)", hidden: true },
          ],
          hints: [
            "Total memakai accumulate dengan lambda; yang ditambahkan ke penampung adalah kolom omzet milik tiap pair.",
            "Pencari nilai tertinggi pada rentang pair memakai max_element dengan comparator yang membandingkan kolom kedua.",
            "Jawabannya: + pada lambda accumulate, dan max_element.",
          ],
        },
      ],
    },
  ],
};
