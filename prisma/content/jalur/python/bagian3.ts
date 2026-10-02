import type { JalurBagian } from "../../types";

// Bagian 3 dari jalur python: modul 4 (Pemrograman Berorientasi Objek) dan
// modul 5 (Modul, Paket, dan Lingkungan), 10 lesson per modul, tingkat menanjak.
export const BAGIAN: JalurBagian = {
  lang: "python",
  moduleRange: [4, 5],
  modules: [
    {
      title: "Pemrograman Berorientasi Objek",
      description: "class, @property, dataclass, inheritance, dunder methods, dan komposisi.",
    },
    {
      title: "Modul, Paket, dan Lingkungan",
      description: "import system, struktur proyek, venv, pip, dan idiom if __name__ == __main__.",
    },
  ],
  lessons: [
    // ===== modul 4: Pemrograman Berorientasi Objek =====
    {
      slug: "class-dan-instance",
      title: "Class dan Instance",
      summary: "Kenalan dengan class sebagai cetakan objek: __init__, self, dan pemanggilan method.",
      steps: [
        {
          kind: "theory",
          title: "Cetakan untuk membuat objek",
          body: "Class menggabungkan data dan perilaku dalam satu wadah. Objek yang lahir dari class disebut instance, dan satu class bisa menghasilkan banyak instance dengan isi yang berbeda-beda. Kalau class adalah cetakan kue, instance adalah tiap kue yang keluar dari cetakannya.\n\nMethod `__init__` dijalankan otomatis setiap kali instance dibuat. Parameter pertamanya, `self`, adalah objek yang sedang dikerjakan. Lewat `self` kita menempelkan data ke objek: `self.nama = nama` berarti instance ini punya atribut bernama nama dengan nilai dari parameter.\n\nMemanggil class sama saja dengan membuat instance: `Anjing(\"Rex\")`. Method biasa dipanggil lewat objek: `rex.salak()`. Python otomatis mengirim `rex` sebagai `self`, jadi kamu tidak menuliskannya di pemanggilan.",
          code: {
            language: "python",
            content: `class Anjing:
    def __init__(self, nama):
        self.nama = nama

    def salak(self):
        return f"{self.nama}: guk!"

rex = Anjing("Rex")
print(rex.salak())`,
            caption: "self diisi Python secara otomatis saat method dipanggil lewat objek.",
          },
        },
        {
          kind: "quiz",
          question: "Saat `buku = Buku(\"Laskar\", 549)` dijalankan, method apa yang otomatis dipanggil Python?",
          options: ["__init__", "print", "info", "__main__"],
          answer: 0,
          explanation: "`__init__` adalah initializer: ia jalan otomatis setiap kali instance dibuat, dan tugasnya menyiapkan atribut awal objek.",
        },
        {
          kind: "code",
          title: "Lengkapi __init__ milik Buku",
          prompt: "Lengkapi kedua `___` di `__init__` supaya parameter yang diterima menempel ke objek lewat `self`. Jalankan sampai tesnya lulus.",
          mode: "fill",
          template: `class Buku:
    def __init__(self, judul, halaman):
        self.judul = ___
        self.halaman = ___

    def info(self):
        return f"{self.judul}: {self.halaman} halaman"

bacaan = Buku(input(), int(input()))
print(bacaan.info())`,
          solution: `class Buku:
    def __init__(self, judul, halaman):
        self.judul = judul
        self.halaman = halaman

    def info(self):
        return f"{self.judul}: {self.halaman} halaman"

bacaan = Buku(input(), int(input()))
print(bacaan.info())`,
          tests: [
            { stdin: "Laskar Pelangi\n549", expectedOutput: "Laskar Pelangi: 549 halaman" },
            { stdin: "Bumi\n456", expectedOutput: "Bumi: 456 halaman" },
          ],
          hints: [
            "Atribut instance ditempel lewat self: nama atributnya boleh sama dengan nama parameternya.",
            "Baris pertama: self.judul = judul. Pola yang sama untuk halaman.",
          ],
        },
      ],
    },
    {
      slug: "atribut-instance-vs-class",
      title: "Atribut Instance vs Atribut Class",
      summary: "Di mana Python mencari atribut, dan jebakan atribut class yang dipakai bersama.",
      steps: [
        {
          kind: "theory",
          title: "Dua tempat lahirnya atribut",
          body: "Atribut instance dibuat di dalam `__init__` lewat `self`, dan setiap objek punya salinannya sendiri. Atribut class ditulis langsung di badan class, di luar method, dan nilainya dipakai bersama oleh semua instance. Konstanta yang memang sama untuk semua objek, seperti jumlah roda standar, cocok jadi atribut class.\n\nSaat kamu membaca `objek.atribut`, Python mencari di objek dulu, lalu naik ke class-nya. Itulah sebabnya `a.roda` tetap bisa dibaca meski `roda` tidak pernah ditempel ke `a`: nilainya ditemukan di class `Mobil`. Sebaliknya, menulis `objek.atribut = nilai` selalu membuat atribut baru milik objek itu, bukan mengubah milik class.\n\nJebakan paling sering: atribut class yang berupa list atau dict. Semua instance berbagi satu objek list yang sama, sehingga perubahan dari satu instance terlihat oleh instance lain. Untuk data yang seharusnya per objek, buat di dalam `__init__`.",
          code: {
            language: "python",
            content: `class Mobil:
    roda = 4  # atribut class: dipakai bersama

    def __init__(self, merk):
        self.merk = merk  # atribut instance: milik tiap objek

a = Mobil("Toyota")
b = Mobil("Daihatsu")
b.roda = 3  # hanya milik b
print(a.roda, b.roda)`,
            caption: "Penugasan lewat objek membuat atribut instance, tidak menyentuh class.",
          },
        },
        {
          kind: "quiz",
          question: "Perhatikan kode berikut.\n\n```python\nclass Keranjang:\n    isi = []\n\na = Keranjang()\nb = Keranjang()\na.isi.append(\"apel\")\nprint(b.isi)\n```\n\nApa keluarannya?",
          options: ["[]", "['apel', 'apel']", "['apel']", "Error: b tidak punya atribut isi"],
          answer: 2,
          explanation: "`isi` adalah atribut class, jadi a dan b berbagi satu list yang sama. Menambah lewat a terlihat juga lewat b.",
        },
        {
          kind: "quiz",
          question: "Bagaimana perbaikan yang tepat supaya setiap instance punya daftar isinya sendiri?",
          options: [
            "Pindahkan pembuatannya ke __init__: self.isi = []",
            "Tambahkan kata global di dalam class",
            "Ganti isi = [] dengan isi = tuple()",
            "Buat satu class terpisah untuk tiap instance",
          ],
          answer: 0,
          explanation: "List yang dibuat di `__init__` lahir baru setiap kali instance dibuat, jadi tidak ada lagi satu list yang dipakai bersama.",
        },
      ],
    },
    {
      slug: "property-dekorator",
      title: "@property: Atribut yang Dihitung",
      summary: "Ubah method jadi atribut yang selalu dihitung dari data terkini, plus gerbang validasi.",
      steps: [
        {
          kind: "theory",
          title: "Method yang dibaca seperti atribut",
          body: "Property adalah method yang dibaca seperti atribut. Tambahkan dekorator `@property` di atas method tanpa parameter tambahan, lalu pemanggilnya cukup menulis `objek.keliling`, tanpa kurung. Dari luar tidak terlihat bahwa ada perhitungan yang berjalan.\n\nIni cocok untuk nilai turunan: luas dari sisi, harga akhir dari harga dan diskon, nama lengkap dari nama depan dan belakang. Menyimpan hasil hitungan sebagai atribut biasa berisiko basi ketika data sumbernya berubah; property selalu menghitung ulang dari data terkini.\n\nProperty juga bisa jadi gerbang validasi. Dengan `@<nama>.setter` kamu menutup penugasan lewat penyaring: `suhu.celsius = -300` bisa ditolak sebelum merusak data. Property tanpa setter bersifat read-only, sehingga nilai turunannya tidak bisa ditimpa dari luar.",
          code: {
            language: "python",
            content: `class Persegi:
    def __init__(self, sisi):
        self.sisi = sisi

    @property
    def keliling(self):
        return 4 * self.sisi

p = Persegi(5)
print(p.keliling)`,
            caption: "Tanpa kurung: yang kelihatan atribut, yang jalan perhitungan.",
          },
        },
        {
          kind: "quiz",
          question: "Perhatikan kode berikut.\n\n```python\nclass Persegi:\n    def __init__(self, sisi):\n        self.sisi = sisi\n\n    @property\n    def keliling(self):\n        return 4 * self.sisi\n\np = Persegi(5)\nprint(p.keliling)\n```\n\nApa keluarannya?",
          options: ["Error, keliling harus dipanggil dengan kurung", "20", "keliling", "5"],
          answer: 1,
          explanation: "`@property` membuat method itu bisa dibaca tanpa kurung, dan nilainya dihitung saat dibaca: 4 kali 5 sama dengan 20.",
        },
        {
          kind: "code",
          title: "Jadikan harga akhir sebagai property",
          prompt: "Class `Produk` punya method `harga_akhir` yang belum berubah jadi atribut. Lengkapi `___` dengan dekorator yang tepat supaya bisa dibaca sebagai `p.harga_akhir` tanpa kurung, lalu jalankan.",
          mode: "fill",
          template: `class Produk:
    def __init__(self, nama, harga, diskon):
        self.nama = nama
        self.harga = harga
        self.diskon = diskon

    ___
    def harga_akhir(self):
        return self.harga * (100 - self.diskon) // 100

p = Produk(input(), int(input()), int(input()))
print(f"{p.nama}: {p.harga_akhir}")`,
          solution: `class Produk:
    def __init__(self, nama, harga, diskon):
        self.nama = nama
        self.harga = harga
        self.diskon = diskon

    @property
    def harga_akhir(self):
        return self.harga * (100 - self.diskon) // 100

p = Produk(input(), int(input()), int(input()))
print(f"{p.nama}: {p.harga_akhir}")`,
          tests: [
            { stdin: "Kopi\n20000\n25", expectedOutput: "Kopi: 15000" },
            { stdin: "Teh\n5000\n0", expectedOutput: "Teh: 5000" },
            { stdin: "Roti\n7777\n10", expectedOutput: "Roti: 6999", hidden: true },
          ],
          hints: [
            "Dekorator yang mengubah method jadi atribut yang bisa dibaca tanpa kurung.",
            "Tulis @property di baris tepat di atas def harga_akhir.",
          ],
        },
      ],
    },
    {
      slug: "dataclass",
      title: "@dataclass: Class untuk Data",
      summary: "Buat __init__, __repr__, dan __eq__ secara otomatis dari daftar field.",
      steps: [
        {
          kind: "theory",
          title: "Wadah data tanpa tulisan berulang",
          body: "Banyak class isinya cuma data: baris hasil query, item struk, titik koordinat. Menulis `__init__`, `__repr__`, dan `__eq__` untuk class seperti itu repetitif. Dekorator `@dataclass` dari modul `dataclasses` membuat ketiganya secara otomatis dari daftar field yang kamu anotasi.\n\nField ditulis seperti anotasi tipe: `judul: str`. Nilai bawaan ditulis langsung: `nilai: int = 0`, dengan catatan field bernilai bawaan harus diletakkan setelah field tanpa bawaan. `__eq__` yang dihasilkan membandingkan field satu per satu, jadi dua dataclass dengan isi sama dianggap sama. Beda dengan class biasa yang membandingkan identitas.\n\nPakai `@dataclass` ketika class memang berperan sebagai wadah data. Kalau class punya banyak aturan internal dan perilaku, class biasa dengan `__init__` tulisan sendiri masih lebih tepat.",
          code: {
            language: "python",
            content: `from dataclasses import dataclass

@dataclass
class Titik:
    x: int
    y: int = 0

a = Titik(3, 4)
b = Titik(3, 4)
print(a)
print(a == b)`,
            caption: "__repr__ otomatis menampilkan nama class beserta tiap field.",
          },
        },
        {
          kind: "quiz",
          question: "Dekorator `@dataclass` otomatis membuat method apa saja untuk class-mu?",
          options: ["Hanya __init__", "Hanya __repr__", "__getattr__ dan __setattr__", "__init__, __repr__, dan __eq__"],
          answer: 3,
          explanation: "Ketiganya dibuat dari daftar field: `__init__` untuk menerima data, `__repr__` untuk tampilan, `__eq__` untuk perbandingan isi.",
        },
        {
          kind: "code",
          title: "Pulihkan impor dataclass",
          prompt: "Program ini memakai `@dataclass`, tapi baris impornya sengaja dikosongkan. Lengkapi `___` di baris pertama supaya program jalan, lalu perhatikan hasil perbandingannya.",
          mode: "fill",
          template: `___ dataclass

@dataclass
class Buku:
    judul: str
    penulis: str

a = Buku(input(), input())
b = Buku(input(), input())
print(a == b)
print(a)`,
          solution: `from dataclasses import dataclass

@dataclass
class Buku:
    judul: str
    penulis: str

a = Buku(input(), input())
b = Buku(input(), input())
print(a == b)
print(a)`,
          tests: [
            { stdin: "Laskar Pelangi\nAndrea\nLaskar Pelangi\nAndrea", expectedOutput: "True\nBuku(judul='Laskar Pelangi', penulis='Andrea')" },
            { stdin: "Bumi\nTere\nBumi\nAndrea", expectedOutput: "False\nBuku(judul='Bumi', penulis='Tere')" },
          ],
          hints: [
            "Dekorator dataclass tinggal di modul bawaan bernama dataclasses.",
            "Baris lengkapnya: from dataclasses import dataclass.",
          ],
        },
      ],
    },
    {
      slug: "inheritance-dan-super",
      title: "Inheritance dan super()",
      summary: "Wariskan perilaku ke subclass, lalu perluas __init__ tanpa menyalin kode induk.",
      steps: [
        {
          kind: "theory",
          title: "Mewarisi dan melanjutkan",
          body: "Inheritance membuat class baru mewarisi atribut dan method class yang ada. Sintaksnya `class Burung(Hewan)`. Semua yang dimiliki `Hewan` otomatis dimiliki `Burung`, kecuali method yang ditulis ulang di class anak.\n\nSering kali class anak butuh pengaturan tambahan: `Manajer` menyimpan data tim yang tidak ada di `Pegawai`. Jangan salin ulang isi `__init__` induk. Panggil `super().__init__(...)` agar induk menyiapkan bagiannya, lalu anak menambah sisanya.\n\n`super()` juga berguna di method lain: `super().perkenalan()` memanggil versi induk dan hasilnya bisa dilanjutkan oleh anak. Pola ini menjaga satu sumber kebenaran: aturan perkenalan cukup ditulis sekali di `Pegawai`.",
          code: {
            language: "python",
            content: `class Hewan:
    def __init__(self, nama):
        self.nama = nama

    def gerak(self):
        return f"{self.nama} bergerak"

class Burung(Hewan):
    def gerak(self):
        return f"{self.nama} terbang"

for h in (Hewan("Ikan"), Burung("Nuri")):
    print(h.gerak())`,
            caption: "Method yang tidak dioverride diwariskan apa adanya.",
          },
        },
        {
          kind: "quiz",
          question: "`class Manajer(Pegawai)` menulis `__init__` sendiri yang memanggil `super().__init__(nama, gaji)`. Untuk apa panggilan itu?",
          options: [
            "Agar __init__ milik Manajer menimpa milik Pegawai sepenuhnya",
            "Untuk membuat instance Pegawai yang terpisah",
            "Supaya bagian inisialisasi milik Pegawai tetap dijalankan, lalu Manajer menambah sisanya",
            "super() hanyalah komentar, baris itu bisa dihapus",
          ],
          answer: 2,
          explanation: "`super()` meneruskan pekerjaan ke class induk. Nama dan gaji disiapkan oleh `Pegawai`, lalu `Manajer` cukup menambah atribut tim.",
        },
        {
          kind: "code",
          title: "Sambungkan Manajer ke Pegawai",
          prompt: "Lengkapi `___` di `__init__` milik `Manajer` agar inisialisasi induk tetap berjalan sebelum atribut tim ditambahkan. Jalankan sampai tesnya lulus.",
          mode: "fill",
          template: `class Pegawai:
    def __init__(self, nama, gaji):
        self.nama = nama
        self.gaji = gaji

    def perkenalan(self):
        return f"{self.nama}, gaji {self.gaji}"

class Manajer(Pegawai):
    def __init__(self, nama, gaji, tim):
        ___.__init__(nama, gaji)
        self.tim = tim

    def perkenalan(self):
        return super().perkenalan() + f", memimpin tim {self.tim}"

m = Manajer(input(), int(input()), input())
print(m.perkenalan())`,
          solution: `class Pegawai:
    def __init__(self, nama, gaji):
        self.nama = nama
        self.gaji = gaji

    def perkenalan(self):
        return f"{self.nama}, gaji {self.gaji}"

class Manajer(Pegawai):
    def __init__(self, nama, gaji, tim):
        super().__init__(nama, gaji)
        self.tim = tim

    def perkenalan(self):
        return super().perkenalan() + f", memimpin tim {self.tim}"

m = Manajer(input(), int(input()), input())
print(m.perkenalan())`,
          tests: [
            { stdin: "Sinta\n15000\nBackend", expectedOutput: "Sinta, gaji 15000, memimpin tim Backend" },
            { stdin: "Rizky\n12000\nMobile", expectedOutput: "Rizky, gaji 12000, memimpin tim Mobile" },
          ],
          hints: [
            "Kamu butuh cara memanggil method induk tanpa menyebut nama class induknya.",
            "Fungsi bawaan itu bernama super, cukup satu kata sebelum .__init__.",
          ],
        },
      ],
    },
    {
      slug: "override-method",
      title: "Method Override",
      summary: "Ganti perilaku warisan di subclass, dan kenali bug override yang diam-diam gagal.",
      steps: [
        {
          kind: "theory",
          title: "Menulis ulang milik induk",
          body: "Menulis ulang method milik induk di class anak disebut override. Python memilih method berdasarkan tipe objek sebenarnya, bukan tipe variabelnya: variabel bertipe `Kendaraan` yang isinya objek `Motor` tetap menjalankan versi `Motor`. Perilaku ini disebut polymorphism.\n\nOverride hanya bekerja kalau namanya persis sama. Bug paling licik di kategori ini adalah salah ketik nama method di class anak: tidak ada error, program jalan normal, tapi yang dieksekusi diam-diam adalah versi induk. Kalau perilaku warisan terasa tidak berlaku, cek dulu ejaan namanya.\n\nSaat meng-override, kamu tetap boleh memanggil `super()` kalau versi anak ingin menambah, bukan mengganti sepenuhnya. Ganti sepenuhnya hanya kalau makna methodnya memang berbeda.",
          code: {
            language: "python",
            content: `class Notifikasi:
    def kirim(self, pesan):
        return f"mengirim: {pesan}"

class Wa(Notifikasi):
    def kirim(self, pesan):
        return f"wa: {pesan}"

print(Wa().kirim("halo"))`,
            caption: "Versi Wa menang karena objeknya adalah Wa, bukan Notifikasi.",
          },
        },
        {
          kind: "quiz",
          question: "Perhatikan potongan berikut.\n\n```python\nclass Bentuk:\n    def nama(self):\n        return \"bentuk\"\n\nclass Lingkaran(Bentuk):\n    def nama(self):\n        return \"lingkaran\"\n\nfor b in [Bentuk(), Lingkaran()]:\n    print(b.nama())\n```\n\nApa keluarannya?",
          options: ["bentuk lalu bentuk", "bentuk lalu lingkaran", "lingkaran lalu lingkaran", "Error"],
          answer: 1,
          explanation: "Python melihat tipe objek sebenarnya: instance `Bentuk` menjalankan versi induk, instance `Lingkaran` menjalankan versi override-nya.",
        },
        {
          kind: "code",
          title: "Perbaiki override yang gagal diam-diam",
          prompt: "Kode ini seharusnya mencetak deskripsi motor, tapi yang keluar malah deskripsi umum dari class induk. Ada satu kesalahan di class `Motor`. Cari, perbaiki, lalu jalankan sampai tesnya lulus.",
          mode: "fix",
          template: `class Kendaraan:
    def __init__(self, nama):
        self.nama = nama

    def deskripsi(self):
        return f"{self.nama}: kendaraan umum"

class Sepeda(Kendaraan):
    def deskripsi(self):
        return f"{self.nama}: dua roda, tenaga manusia"

class Motor(Kendaraan):
    def deskripi(self):
        return f"{self.nama}: dua roda, bermesin"

k = Motor(input())
print(k.deskripsi())`,
          solution: `class Kendaraan:
    def __init__(self, nama):
        self.nama = nama

    def deskripsi(self):
        return f"{self.nama}: kendaraan umum"

class Sepeda(Kendaraan):
    def deskripsi(self):
        return f"{self.nama}: dua roda, tenaga manusia"

class Motor(Kendaraan):
    def deskripsi(self):
        return f"{self.nama}: dua roda, bermesin"

k = Motor(input())
print(k.deskripsi())`,
          tests: [
            { stdin: "Honda BeAT", expectedOutput: "Honda BeAT: dua roda, bermesin" },
            { stdin: "Vario 160", expectedOutput: "Vario 160: dua roda, bermesin" },
          ],
          hints: [
            "Jalankan dulu: keluarannya versi induk, artinya override di Motor tidak pernah terpakai.",
            "Override bekerja hanya kalau nama method di class anak persis sama dengan milik induk. Bandingkan huruf demi huruf.",
          ],
        },
      ],
    },
    {
      slug: "dunder-repr-str-eq",
      title: "Dunder: __repr__, __str__, dan __eq__",
      summary: "Atur cara objekmu tampil dan dibandingkan lewat method dunder.",
      steps: [
        {
          kind: "theory",
          title: "Method yang dipanggil Python diam-diam",
          body: "Nama method yang diawali dan diakhiri dua garis bawah disebut dunder. Python memanggilnya secara tidak langsung: `print(obj)` memakai `__str__` atau `__repr__`, operator `==` memakai `__eq__`, dan `len(obj)` memakai `__len__`. Dengan mendefinisikannya, objekmu berperilaku sopan di alat bawaan Python.\n\n`__repr__` ditujukan untuk pengembang: informatif dan mendekati cara objek itu dibuat. `__str__` untuk pengguna akhir dan boleh lebih ramah. Kalau hanya `__repr__` yang ada, `print` dan f-string memakainya sebagai cadangan.\n\nOperator `==` tanpa `__eq__` membandingkan identitas: dua objek beda instance selalu tidak sama walau isinya sama persis. Definisikan `__eq__` dengan membandingkan field yang relevan, seperti `self.x == lain.x and self.y == lain.y`.",
          code: {
            language: "python",
            content: `class Titik:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Titik({self.x}, {self.y})"

    def __eq__(self, lain):
        return self.x == lain.x and self.y == lain.y

a = Titik(1, 2)
b = Titik(1, 2)
print(a)
print(a == b)`,
            caption: "print memakai __repr__, == memakai __eq__.",
          },
        },
        {
          kind: "quiz",
          question: "Class `Titik` tidak mendefinisikan `__eq__`. Apa hasil `a == b` untuk dua instance berbeda dengan nilai atribut yang sama persis?",
          options: [
            "False, karena yang dibandingkan adalah identitas objeknya",
            "True, karena isinya sama",
            "True hanya jika keduanya dibuat di baris yang sama",
            "Error TypeError",
          ],
          answer: 0,
          explanation: "Tanpa `__eq__`, operator `==` untuk objek biasa membandingkan identitas: dua instance berbeda adalah dua objek berbeda, hasilnya False.",
        },
        {
          kind: "code",
          title: "Samakan Uang berdasarkan jumlah",
          prompt: "Lengkapi `___` di `__eq__` supaya dua objek `Uang` dianggap sama ketika jumlahnya sama. Jalankan dan pastikan kedua kasus tes benar.",
          mode: "fill",
          template: `class Uang:
    def __init__(self, jumlah):
        self.jumlah = jumlah

    def __repr__(self):
        return f"Uang({self.jumlah})"

    def __eq__(self, lain):
        return ___

a = Uang(int(input()))
b = Uang(int(input()))
print(a)
print(a == b)`,
          solution: `class Uang:
    def __init__(self, jumlah):
        self.jumlah = jumlah

    def __repr__(self):
        return f"Uang({self.jumlah})"

    def __eq__(self, lain):
        return self.jumlah == lain.jumlah

a = Uang(int(input()))
b = Uang(int(input()))
print(a)
print(a == b)`,
          tests: [
            { stdin: "5000\n5000", expectedOutput: "Uang(5000)\nTrue" },
            { stdin: "3000\n7000", expectedOutput: "Uang(3000)\nFalse" },
            { stdin: "0\n0", expectedOutput: "Uang(0)\nTrue", hidden: true },
          ],
          hints: [
            "__eq__ menerima objek pembanding di parameter lain. Bandingkan jumlah milik self dengan jumlah milik lain.",
            "Isi barisnya: self.jumlah == lain.jumlah",
          ],
        },
      ],
    },
    {
      slug: "komposisi-bukan-warisan",
      title: "Komposisi daripada Warisan",
      summary: "Bangun objek besar dari objek kecil lewat hubungan punya, lalu teruskan panggilan.",
      steps: [
        {
          kind: "theory",
          title: "Is-a versus punya",
          body: "Inheritance menggambarkan hubungan adalah: `Motor` adalah `Kendaraan`. Komposisi menggambarkan hubungan punya: `Mobil` punya `Mesin`. Aturan praktisnya, warisi hanya kalau memang hubungan is-a; untuk sisanya, simpan objek kecil sebagai atribut di dalam objek besar.\n\nBentuknya sederhana: `__init__` milik `Mobil` membuat `Mesin` sendiri dan menyimpannya sebagai atribut. Method `Mobil` yang butuh mesin tinggal meneruskan panggilan, misalnya `self.mesin.hidupkan()`. Pola penerusan ini disebut delegasi.\n\nKomposisi lebih lentur karena hubungannya tidak dibekukan sejak lahir. Mesin bisa diganti tanpa menyentuh definisi `Mobil`, dan `Mesin` yang sama bisa dipakai `Mobil`, `Motor`, maupun `Genset` tanpa duplikasi. Kode nyata lebih sering hidup dari komposisi daripada rantai warisan yang dalam.",
          code: {
            language: "python",
            content: `class Mesin:
    def __init__(self, tenaga):
        self.tenaga = tenaga

class Mobil:
    def __init__(self, merek, tenaga):
        self.merek = merek
        self.mesin = Mesin(tenaga)

    def tenaga(self):
        return self.mesin.tenaga

print(Mobil("Brio", 89).tenaga())`,
            caption: "Mobil tidak mewarisi Mesin; ia menyimpan Mesin di dalam dirinya.",
          },
        },
        {
          kind: "quiz",
          question: "Kamu merancang `Buku` yang menyimpan `Penulis`. Hubungan yang paling tepat adalah?",
          options: [
            "Buku mewarisi Penulis dengan class Buku(Penulis)",
            "Komposisi: Buku menyimpan objek Penulis sebagai atribut",
            "Penulis dibuat sebagai atribut class milik Buku",
            "Buku dan Penulis digabung jadi satu class",
          ],
          answer: 1,
          explanation: "Buku bukan Penulis; Buku punya Penulis. Hubungan punya dibangun lewat komposisi: simpan objek sebagai atribut.",
        },
        {
          kind: "code",
          title: "Pasang Mesin ke dalam Mobil",
          prompt: "Lengkapi `___` di `__init__` milik `Mobil` agar objek `Mesin` tersimpan sebagai atribut. Nama atribut itu nanti dipakai juga oleh `start` dan `status`. Jalankan sampai kedua status tercetak benar.",
          mode: "fill",
          template: `class Mesin:
    def __init__(self, tenaga):
        self.tenaga = tenaga
        self.menyala = False

    def hidupkan(self):
        self.menyala = True

class Mobil:
    def __init__(self, merek, tenaga):
        self.merek = merek
        self.___ = Mesin(tenaga)

    def start(self):
        self.mesin.hidupkan()

    def status(self):
        if self.mesin.menyala:
            return f"{self.merek} menyala, mesin {self.mesin.tenaga} HP"
        return f"{self.merek} masih mati"

mobil = Mobil(input(), int(input()))
print(mobil.status())
mobil.start()
print(mobil.status())`,
          solution: `class Mesin:
    def __init__(self, tenaga):
        self.tenaga = tenaga
        self.menyala = False

    def hidupkan(self):
        self.menyala = True

class Mobil:
    def __init__(self, merek, tenaga):
        self.merek = merek
        self.mesin = Mesin(tenaga)

    def start(self):
        self.mesin.hidupkan()

    def status(self):
        if self.mesin.menyala:
            return f"{self.merek} menyala, mesin {self.mesin.tenaga} HP"
        return f"{self.merek} masih mati"

mobil = Mobil(input(), int(input()))
print(mobil.status())
mobil.start()
print(mobil.status())`,
          tests: [
            { stdin: "Avanza\n98", expectedOutput: "Avanza masih mati\nAvanza menyala, mesin 98 HP" },
            { stdin: "Brio\n89", expectedOutput: "Brio masih mati\nBrio menyala, mesin 89 HP" },
          ],
          hints: [
            "Method start dan status sudah memanggil self.mesin, jadi nama atributnya pasti mesin.",
            "Barisnya: self.mesin = Mesin(tenaga)",
          ],
        },
      ],
    },
    {
      slug: "classmethod-staticmethod",
      title: "classmethod dan staticmethod",
      summary: "Constructor alternatif dengan @classmethod, fungsi utilitas dengan @staticmethod.",
      steps: [
        {
          kind: "theory",
          title: "Tiga jenis method",
          body: "Method biasa menerima `self`, objek pemanggil. `@classmethod` menerima `cls`, class-nya sendiri. Karena bekerja pada class, classmethod sering dipakai sebagai constructor alternatif: cara lain yang lebih nyaman untuk membuat instance, misalnya memparsing teks `\"3:45\"` menjadi objek `Durasi`.\n\nConstructor alternatif berakhir dengan `return cls(...)`. Pemanggilannya tidak lewat instance: `Durasi.dari_teks(\"3:45\")`. Memakai `cls` dibanding menyebut nama class sendiri punya untung: subclass yang mewarisinya otomatis mengikuti.\n\n`@staticmethod` kebalikannya: tidak menerima `self` maupun `cls`. Ia fungsi biasa yang ditempatkan di dalam class karena secara makna memang milik class itu, misalnya pemformat angka untuk `Durasi`. Kalau fungsi tidak menyentuh class maupun instance sama sekali, staticmethod tempatnya.",
          code: {
            language: "python",
            content: `class Durasi:
    def __init__(self, detik):
        self.detik = detik

    @classmethod
    def dari_menit(cls, menit):
        return cls(menit * 60)

print(Durasi.dari_menit(2).detik)`,
            caption: "dari_menit adalah pintu masuk kedua menuju instance Durasi.",
          },
        },
        {
          kind: "quiz",
          question: "Apa parameter pertama dari method yang diberi dekorator `@classmethod`?",
          options: [
            "self, sama seperti method biasa",
            "Tidak ada parameter khusus",
            "cls, yaitu class tempat method itu didefinisikan",
            "Nama class sebagai string",
          ],
          answer: 2,
          explanation: "`@classmethod` mengirim class sebagai argumen pertama, dan konvensinya dinamai `cls`. Lewat `cls` kamu membuat instance baru.",
        },
        {
          kind: "code",
          title: "Parsing teks menjadi Durasi",
          prompt: "Lengkapi `___` di `dari_teks` agar constructor alternatif mengembalikan instance `Durasi` hasil parsing teks `menit:detik`. Panggilan `cls(...)` adalah kuncinya.",
          mode: "fill",
          template: `class Durasi:
    def __init__(self, total_detik):
        self.total_detik = total_detik

    @classmethod
    def dari_teks(cls, teks):
        menit, detik = teks.split(":")
        return ___(int(menit) * 60 + int(detik))

    def format(self):
        return f"{self.total_detik // 60}:{self.total_detik % 60:02d}"

d = Durasi.dari_teks(input())
print(d.total_detik)
print(d.format())`,
          solution: `class Durasi:
    def __init__(self, total_detik):
        self.total_detik = total_detik

    @classmethod
    def dari_teks(cls, teks):
        menit, detik = teks.split(":")
        return cls(int(menit) * 60 + int(detik))

    def format(self):
        return f"{self.total_detik // 60}:{self.total_detik % 60:02d}"

d = Durasi.dari_teks(input())
print(d.total_detik)
print(d.format())`,
          tests: [
            { stdin: "3:45", expectedOutput: "225\n3:45" },
            { stdin: "12:05", expectedOutput: "725\n12:05" },
            { stdin: "0:59", expectedOutput: "59\n0:59", hidden: true },
          ],
          hints: [
            "Di dalam classmethod, instance baru dibuat dengan memanggil parameter cls seperti memanggil class.",
            "Barisnya: return cls(int(menit) * 60 + int(detik))",
          ],
        },
      ],
    },
    {
      slug: "latihan-kelas-keranjang",
      title: "Latihan Gabungan: Kelas Keranjang",
      summary: "Rangkum modul ini: class dengan property penghitung total dan penyusun struk.",
      steps: [
        {
          kind: "theory",
          title: "Satu class, tiga peran method",
          body: "Saatnya merangkai semuanya. Class `Keranjang` menyimpan daftar item berupa tuple `(nama, harga)`, menghitung total lewat `@property`, dan menyusun struk dengan comprehension. Perhatikan pembagian perannya: `tambah` mengubah data, `total` membaca data, `struk` menyusun tampilan.\n\nPerhatikan juga bentuk datanya. Tuple per item menjaga pasangan nama dan harga tetap utuh, dan `sum` dengan generator expression menghitung total dalam satu baris. Tanda `_` di dalam generator berarti variabel itu memang tidak dipakai.",
          code: {
            language: "python",
            content: `keranjang = Keranjang()
keranjang.tambah("Buku", 15000)
keranjang.tambah("Pulpen", 5000)
print(keranjang.total)  # 20000
print(keranjang.struk())`,
            caption: "Antarmuka yang jadi target latihan kali ini.",
          },
        },
        {
          kind: "code",
          title: "Selesaikan property total",
          prompt: "Class `Keranjang` sudah hampir jadi. Lengkapi `___` di property `total` supaya menjumlahkan seluruh harga di daftar `item`, lalu jalankan. Struk yang tercetak harus memuat tiap item dan totalnya.",
          mode: "fill",
          template: `class Keranjang:
    def __init__(self):
        self.item = []

    def tambah(self, nama, harga):
        self.item.append((nama, harga))

    @property
    def total(self):
        return ___

    def struk(self):
        baris = [f"{nama}: {harga}" for nama, harga in self.item]
        baris.append(f"Total: {self.total}")
        return "\\n".join(baris)

keranjang = Keranjang()
n = int(input())
for _ in range(n):
    keranjang.tambah(input(), int(input()))
print(keranjang.struk())`,
          solution: `class Keranjang:
    def __init__(self):
        self.item = []

    def tambah(self, nama, harga):
        self.item.append((nama, harga))

    @property
    def total(self):
        return sum(harga for _, harga in self.item)

    def struk(self):
        baris = [f"{nama}: {harga}" for nama, harga in self.item]
        baris.append(f"Total: {self.total}")
        return "\\n".join(baris)

keranjang = Keranjang()
n = int(input())
for _ in range(n):
    keranjang.tambah(input(), int(input()))
print(keranjang.struk())`,
          tests: [
            { stdin: "2\nBuku\n15000\nPulpen\n5000", expectedOutput: "Buku: 15000\nPulpen: 5000\nTotal: 20000" },
            { stdin: "1\nGitar\n750000", expectedOutput: "Gitar: 750000\nTotal: 750000" },
            { stdin: "3\nA\n100\nB\n200\nC\n300", expectedOutput: "A: 100\nB: 200\nC: 300\nTotal: 600", hidden: true },
          ],
          hints: [
            "total harus membaca self.item dan menjumlahkan setiap harga di dalamnya.",
            "Pakai sum dengan generator expression: sum(harga for _, harga in self.item). Tanda _ menampung nama yang tidak dipakai.",
          ],
        },
      ],
    },
    // ===== modul 5: Modul, Paket, dan Lingkungan =====
    {
      slug: "cara-kerja-import",
      title: "Cara Kerja import",
      summary: "Apa yang terjadi saat import, ke mana Python mencari modul, dan cache sys.modules.",
      steps: [
        {
          kind: "theory",
          title: "Tiga langkah di balik satu kata import",
          body: "Perintah `import math` melakukan tiga hal: mencari modulnya, menjalankan isinya sekali, lalu menyimpan hasilnya di cache `sys.modules` supaya impor berikutnya tidak mengulang eksekusi. Nama `math` kemudian menunjuk ke objek modul, dan semua isinya diakses lewat titik: `math.sqrt`, `math.pi`.\n\nUntuk mencari modul, Python menelusuri daftar folder di `sys.path`: folder skrip yang dijalankan, isi `PYTHONPATH`, lalu folder paket bawaan dan `site-packages` tempat pip memasang paket pihak ketiga. Modul pertama yang namanya cocok itulah yang terpakai. Karena itu hindari menamai file-mu sama dengan modul bawaan seperti `math.py` atau `json.py`: file-mu bisa ikut terpilih.\n\nKarena isi modul hanya dieksekusi sekali per proses, modul yang rapi tidak meletakkan efek samping berat di level atas: cukup definisi fungsi, class, dan konstanta.",
          code: {
            language: "python",
            content: `import math

print(math.gcd(24, 36))
print(math.sqrt(2))`,
            caption: "Isi modul diakses lewat titik: modul.fungsi.",
          },
        },
        {
          kind: "quiz",
          question: "Dalam satu program, `import math` ditulis tiga kali di tiga tempat. Berapa kali isi modul math benar-benar dieksekusi?",
          options: [
            "Tiga kali, mengikuti jumlah import",
            "Sekali, karena hasilnya dicache di sys.modules",
            "Nol kali, modul bawaan sudah termuat sejak awal",
            "Tergantung jumlah baris di dalam math",
          ],
          answer: 1,
          explanation: "Modul dieksekusi sekali saat pertama kali diimpor, lalu dicache di `sys.modules`. Impor kedua dan ketiga hanya mengikat nama yang sudah ada.",
        },
        {
          kind: "code",
          title: "Dua fungsi dari math",
          prompt: "Lengkapi kedua `___` dengan nama fungsi dari modul `math`: satu untuk akar kuadrat, satu untuk pembulatan ke atas. Lalu jalankan.",
          mode: "fill",
          template: `import math

n = int(input())
print(f"akar {n} = {math.___(n):.2f}")
print(f"bulat ke atas: {math.___(n / 3)}")`,
          solution: `import math

n = int(input())
print(f"akar {n} = {math.sqrt(n):.2f}")
print(f"bulat ke atas: {math.ceil(n / 3)}")`,
          tests: [
            { stdin: "2", expectedOutput: "akar 2 = 1.41\nbulat ke atas: 1" },
            { stdin: "10", expectedOutput: "akar 10 = 3.16\nbulat ke atas: 4" },
            { stdin: "25", expectedOutput: "akar 25 = 5.00\nbulat ke atas: 9", hidden: true },
          ],
          hints: [
            "Akar kuadrat di modul math bernama sqrt.",
            "Pembulatan ke atas bernama ceil, kependekan dari ceiling.",
          ],
        },
      ],
    },
    {
      slug: "from-import-dan-alias",
      title: "from-import dan Alias",
      summary: "Ambil nama tertentu dari modul, ganti namanya dengan as, dan waspadai penimpaan nama.",
      steps: [
        {
          kind: "theory",
          title: "Mengambil nama, bukan seluruh modul",
          body: "`from math import sqrt` mengikat nama `sqrt` langsung ke namespace-mu, sehingga pemanggilannya pendek tanpa awalan `math.`. Beberapa nama bisa sekaligus: `from math import sqrt, pi`. Versi paling boros, `from math import *`, sebaiknya dihindari: kamu tidak tahu nama apa saja yang masuk dan bisa menimpa nama milikmu sendiri tanpa sadar.\n\nAlias dengan `as` mengganti nama yang terikat: `from collections import defaultdict as dd`, atau `import numpy as np` di dunia data. Alias dipakai untuk nama yang panjang dan untuk kebiasaan yang sudah disepakati komunitas, bukan sekadar untuk singkat-singkatnya.\n\nRisiko from-import: nama yang diimpor bisa tertimpa. Setelah `from math import sqrt`, baris `sqrt = 5` mengubahnya jadi angka, dan `sqrt(16)` meledak. Kalau file-mu memakai banyak nama dari modul yang sama, `import math` biasa justru lebih aman karena satu-satunya nama yang rawan tertimpa adalah `math` itu sendiri.",
          code: {
            language: "python",
            content: `from math import sqrt, pi
from collections import defaultdict as dd

hitung = dd(int)
for huruf in "bananas":
    hitung[huruf] += 1
print(sqrt(16), pi, hitung["a"])`,
            caption: "Alias memendek nama panjang tanpa menimpa nama bawaan.",
          },
        },
        {
          kind: "quiz",
          question: "Perhatikan urutan ini.\n\n```python\nfrom math import sqrt\nsqrt = 5\nsqrt(16)\n```\n\nApa yang terjadi di baris terakhir?",
          options: [
            "Mengembalikan 4.0",
            "Mengembalikan 5",
            "Error: int tidak bisa dipanggil sebagai fungsi",
            "Mengembalikan 5.0",
          ],
          answer: 2,
          explanation: "Baris `sqrt = 5` menimpa fungsi yang diimpor dengan angka. Memanggil `sqrt(16)` berarti memanggil angka 5, dan Python menolak dengan TypeError.",
        },
        {
          kind: "code",
          title: "Dua gaya impor dalam satu program",
          prompt: "Lengkapi kedua `___`: kata kunci pada baris pertama, dan nama fungsi rata-rata dari modul `statistics` yang di-alias menjadi `rata`.",
          mode: "fill",
          template: `___ math import sqrt, pi
from statistics import ___ as rata

angka = [int(x) for x in input().split()]
print(f"{sqrt(angka[0]):.2f}")
print(f"pi = {pi:.3f}")
print(f"rata-rata: {rata(angka):.1f}")`,
          solution: `from math import sqrt, pi
from statistics import mean as rata

angka = [int(x) for x in input().split()]
print(f"{sqrt(angka[0]):.2f}")
print(f"pi = {pi:.3f}")
print(f"rata-rata: {rata(angka):.1f}")`,
          tests: [
            { stdin: "9 8 7", expectedOutput: "3.00\npi = 3.142\nrata-rata: 8.0" },
            { stdin: "16 4", expectedOutput: "4.00\npi = 3.142\nrata-rata: 10.0" },
          ],
          hints: [
            "Baris pertama polanya: from <modul> import <nama>.",
            "Fungsi rata-rata di modul statistics bernama mean.",
          ],
        },
      ],
    },
    {
      slug: "membuat-modul-sendiri",
      title: "Membuat Modul Sendiri",
      summary: "Pecah program menjadi file: cara Python memuat file-mu dan menjaga namespacenya.",
      steps: [
        {
          kind: "theory",
          title: "File .py milikmu juga modul",
          body: "Modul sendiri hanyalah file `.py` di proyekmu. File bernama `util.py` bisa diimpor dari file lain di folder yang sama dengan `import util`, dan namanya diambil dari nama file tanpa akhiran `.py`. Ini cara paling dasar memecah program panjang menjadi bagian yang mudah dicari.\n\nNama-nama di dalam modul terkurung dalam namespacenya sendiri: fungsi `bersih` di `util.py` dipanggil sebagai `util.bersih`, bukan `bersih` polos. Pemisahan ini mencegah dua modul yang kebetulan punya nama fungsi sama saling menimpa.\n\nKode di level atas modul, di luar fungsi dan class, dijalankan sekali pada saat modul pertama kali diimpor. Karena itu modul yang baik isinya definisi, bukan skrip yang langsung bekerja. Bagian yang hanya boleh jalan saat file dieksekusi langsung akan dikunci dengan guard di lesson berikutnya.",
          code: {
            language: "python",
            content: `# file: util.py
def bersih(teks):
    return teks.strip().lower()

# file: utama.py
import util

print(util.bersih("  Halo  "))`,
            caption: "Dua file di folder yang sama: util.py dimuat oleh utama.py.",
          },
        },
        {
          kind: "quiz",
          question: "Ada file `util.py` berisi fungsi `bersih`. File lain menulis `import util`. Bagaimana pemanggilan yang benar?",
          options: ["bersih()", "util.bersih()", "import.bersih()", "util->bersih()"],
          answer: 1,
          explanation: "Nama modul menjadi awalannya: fungsi di dalam `util.py` dijangkau lewat `util.bersih`, sesuai namespace modulnya.",
        },
        {
          kind: "quiz",
          question: "Di `util.py` ada baris `print(\"memuat util\")` di level atas, di luar fungsi apa pun. Program utama menulis `import util` dua kali. Berapa kali teks itu tercetak?",
          options: [
            "Sekali, saat modul pertama kali dimuat",
            "Dua kali, mengikuti jumlah import",
            "Nol kali, print di modul tidak pernah dijalankan",
            "Terus-menerus selama program hidup",
          ],
          answer: 0,
          explanation: "Isi modul dieksekusi sekali pada impor pertama; impor kedua hanya mengambil dari cache `sys.modules`, jadi baris level atas tidak diulang.",
        },
      ],
    },
    {
      slug: "paket-dan-init-py",
      title: "Paket dan __init__.py",
      summary: "Kelompokkan modul dalam folder: paket, subpaket, dan peran __init__.py.",
      steps: [
        {
          kind: "theory",
          title: "Folder yang bisa diimpor",
          body: "Paket adalah folder berisi modul yang ditandai dengan file `__init__.py`. Struktur `toko/keranjang.py` bersama `toko/__init__.py` bisa diimpor sebagai `toko.keranjang`, dan isinya dijangkau dengan `from toko.keranjang import Keranjang`. Titik pada nama impor mengikuti susunan foldernya.\n\n`__init__.py` dijalankan saat paket pertama kali diimpor. Isinya boleh kosong, cukup sebagai penanda, atau berisi inisialisasi ringan. Trik yang umum: re-export di `__init__.py`, sehingga pemakai cukup menulis `from toko import Keranjang` tanpa tahu file persisnya.\n\nPaket boleh bersarang: folder di dalam folder, masing-masing dengan `__init__.py` sendiri. Untuk proyek kecil, satu level biasanya cukup; kedalaman yang berlebihan justru menyulitkan navigasi.",
          code: {
            language: "python",
            content: `# file: toko/__init__.py
from toko.keranjang import Keranjang

# di file pemakai:
# from toko import Keranjang`,
            caption: "Re-export di __init__.py memperpendek impor bagi pemakai.",
          },
        },
        {
          kind: "quiz",
          question: "Struktur proyek:\n\n```text\ntoko/\n    __init__.py\n    pembayaran.py\n    laporan/\n        __init__.py\n        ringkas.py\n```\n\nSetelah `import toko`, bagaimana memanggil fungsi `proses` yang ada di `pembayaran.py`?",
          options: ["toko.pembayaran.proses()", "pembayaran.proses()", "toko.proses()", "proses() langsung"],
          answer: 0,
          explanation: "Jalur impor mengikuti susunan folder: paket `toko`, modul `pembayaran`, lalu nama fungsinya setelah titik terakhir.",
        },
        {
          kind: "quiz",
          question: "Apa peran file `__init__.py` di dalam sebuah folder paket?",
          options: [
            "Wajib berisi daftar semua fungsi yang boleh dipakai",
            "Menggantikan file requirements.txt",
            "Menandai folder sebagai paket dan dijalankan saat paket pertama kali diimpor",
            "Menjalankan test setiap kali paket diimpor",
          ],
          answer: 2,
          explanation: "`__init__.py` menandai folder sebagai paket biasa dan menjadi tempat inisialisasi ringan, termasuk re-export kalau perlu.",
        },
      ],
    },
    {
      slug: "idiom-if-name-main",
      title: "Idiom if __name__ == '__main__'",
      summary: "Satu file, dua peran: skrip yang bisa dijalankan dan modul yang bisa diimpor.",
      steps: [
        {
          kind: "theory",
          title: "Dua nilai __name__",
          body: "Setiap modul punya variabel `__name__`. Saat file dijalankan langsung dengan `python utama.py`, isinya `\"__main__\"`. Saat file yang sama diimpor sebagai modul, isinya nama modulnya, misalnya `\"utama\"`. Satu file jadi punya dua peran: skrip yang bisa dijalankan dan modul yang bisa diimpor.\n\nIdiom `if __name__ == \"__main__\":` memanfaatkan itu: blok di bawahnya hanya jalan saat file dieksekusi langsung. Semua pekerjaan utama dikumpulkan di fungsi seperti `utama()`, dan pemanggilannya dikunci di balik guard. Program lain yang mengimpor file ini tidak ikut menjalankan skripnya, hanya meminjam fungsi dan class-nya.\n\nKebiasaan ini fondasi kode yang bisa diuji: file tes boleh mengimpor modul tanpa memicu efek samping, dan file yang sama tetap nyaman dijalankan dari terminal.",
          code: {
            language: "python",
            content: `def utama():
    print("program jalan")

if __name__ == "__main__":
    utama()`,
            caption: "Blok bawah hanya dieksekusi saat file dijalankan langsung.",
          },
        },
        {
          kind: "quiz",
          question: "File `util.py` diimpor oleh program lain. Berapa nilai `util.__name__` saat itu?",
          options: ['"__main__"', '"main"', "Kosong", '"util"'],
          answer: 3,
          explanation: "Saat diimpor, `__name__` bernilai nama modulnya. Nilai `\"__main__\"` hanya muncul saat file dieksekusi langsung.",
        },
        {
          kind: "code",
          title: "Pasang guardnya",
          prompt: "Lengkapi `___` di guard terakhir supaya `utama()` hanya dijalankan saat file dieksekusi langsung, bukan saat diimpor. Jalankan dan pastikan hasilnya benar.",
          mode: "fill",
          template: `def proses(n):
    return n * n + 3

def utama():
    n = int(input())
    print(proses(n))

if __name__ == "___":
    utama()`,
          solution: `def proses(n):
    return n * n + 3

def utama():
    n = int(input())
    print(proses(n))

if __name__ == "__main__":
    utama()`,
          tests: [
            { stdin: "4", expectedOutput: "19" },
            { stdin: "10", expectedOutput: "103" },
            { stdin: "0", expectedOutput: "3", hidden: true },
          ],
          hints: [
            "Kamu butuh nilai yang dipegang __name__ saat file dijalankan lewat python file.py.",
            "Isinya __main__: dua garis bawah di awal dan dua di akhir, ditulis di dalam tanda kutip.",
          ],
        },
      ],
    },
    {
      slug: "venv-dan-pip",
      title: "venv dan pip",
      summary: "Lingkungan virtual per proyek, siklus pip install, dan pencatatan requirements.txt.",
      steps: [
        {
          kind: "theory",
          title: "Satu proyek, satu dunia paket",
          body: "Setiap proyek punya kebutuhan paket berbeda, dan dua proyek bisa membutuhkan versi paket yang sama dengan angka yang bertengkar. Virtual environment (venv) menyelesaikan itu dengan membuat folder interpreter dan paket yang terisolasi per proyek. Yang terpasang di proyek A tidak terlihat oleh proyek B.\n\nSiklusnya: `python -m venv .venv` membuat lingkungan, lalu mengaktifkannya. Di Windows: `.venv\\Scripts\\activate`, di macOS dan Linux: `source .venv/bin/activate`. Setelah aktif, `pip install` memasang paket ke lingkungan itu saja, dan prompt terminal biasanya menandai nama venv yang sedang hidup.\n\nVersi yang terpasang dicatat dengan `pip freeze > requirements.txt`. Di mesin lain, `pip install -r requirements.txt` memasang versi yang persis sama. Folder `.venv` sendiri tidak ikut dikirim dan tidak dimasukkan ke git: daftar di `requirements.txt` adalah cara membagikannya, bukan foldernya.",
          code: {
            language: "bash",
            content: `python -m venv .venv
.venv\\Scripts\\activate
pip install requests
pip freeze > requirements.txt`,
            caption: "Buat lingkungan, aktifkan, pasang paket, catat versinya.",
          },
        },
        {
          kind: "quiz",
          question: "Perintah yang benar untuk membuat virtual environment bernama `.venv` di folder proyek adalah?",
          options: [
            "pip install venv .venv",
            "python -m venv .venv",
            "venv --create .venv",
            "python --venv=.venv",
          ],
          answer: 1,
          explanation: "`venv` adalah modul bawaan Python yang dijalankan lewat `python -m venv <nama-folder>`, bukan paket yang dipasang lewat pip.",
        },
        {
          kind: "quiz",
          question: "Rekan satu tim menyalin proyekmu ke mesinnya. File apa yang membuat paket terpasangnya sama persis?",
          options: [
            "requirements.txt hasil pip freeze",
            "Folder .venv yang di-zip lalu dikirim",
            "Log pip di dalam .venv",
            "Tidak perlu file apa pun, pip otomatis mendeteksi kebutuhan",
          ],
          answer: 0,
          explanation: "`requirements.txt` mencatat nama dan versi paket. Rekanmu membuat venv sendiri lalu menjalankan `pip install -r requirements.txt`.",
        },
      ],
    },
    {
      slug: "struktur-proyek-kecil",
      title: "Struktur Proyek Kecil",
      summary: "Susun folder yang bisa dipahami orang lain: paket, tests, README, dan titik masuk.",
      steps: [
        {
          kind: "theory",
          title: "Kerangka yang bisa dibaca orang asing",
          body: "Struktur bukan kemewahan proyek besar; proyek kecil pun sepadan. Minimal yang dibutuhkan: folder paket untuk kode, folder `tests` untuk pengujiannya, `requirements.txt` untuk daftar paket, dan `README.md` yang menjelaskan cara menjalankan. Satu file menampung satu tanggung jawab.\n\nPola `src/` memisahkan kode paket dari folder proyek: `src/kasir/keranjang.py` berisi class `Keranjang`, dan `tests/test_keranjang.py` mengimpornya dengan `from kasir.keranjang import Keranjang`. Pemisahan ini membuat test memakai paket yang benar, bukan file yang kebetulan ada di folder yang sama.\n\nTitik masuk program ditandai jelas: biasanya `utama.py` di dalam paket yang diakhiri guard `if __name__ == \"__main__\"`. Orang yang baru membuka proyekmu cukup membaca README, memasang dependensi, lalu menjalankan satu perintah.",
          code: {
            language: "text",
            content: `proyek-kasir/
    README.md
    requirements.txt
    src/
        kasir/
            __init__.py
            keranjang.py
            utama.py
    tests/
        test_keranjang.py`,
            caption: "Struktur kecil yang sudah memadai untuk proyek sungguhan.",
          },
        },
        {
          kind: "quiz",
          question: "Proyek memakai paket `kasir` dengan modul `keranjang.py` di dalamnya. Di file `tests/test_keranjang.py`, impor yang tepat adalah?",
          options: [
            "import keranjang",
            "from kasir.keranjang import Keranjang",
            "from tests import kasir",
            "import src.kasir.keranjang",
          ],
          answer: 1,
          explanation: "Test mengimpor lewat jalur paketnya: `from kasir.keranjang import Keranjang`, bukan lewat nama file polos.",
        },
        {
          kind: "quiz",
          question: "Dalam struktur proyek kecil yang rapi, file `requirements.txt` fungsinya?",
          options: [
            "Menyimpan hasil eksekusi program",
            "Menggantikan README",
            "Mencatat daftar paket dan versinya agar bisa dipasang ulang",
            "Berisi konfigurasi editor tim",
          ],
          answer: 2,
          explanation: "`requirements.txt` adalah daftar paket dan versinya, dibuat dari `pip freeze` dan dipasang ulang dengan `pip install -r`.",
        },
      ],
    },
    {
      slug: "import-dinamis",
      title: "Import Dinamis",
      summary: "Muat modul dari string saat program berjalan dengan importlib dan getattr.",
      steps: [
        {
          kind: "theory",
          title: "Modul yang baru diketahui saat jalan",
          body: "`import` bersifat statis: nama modulnya tertulis di kode. Ada situasi di mana nama modul baru diketahui saat program berjalan, misalnya plugin yang namanya dibaca dari file konfigurasi. Untuk itu Python menyediakan `importlib.import_module(\"nama_modul\")` yang mengembalikan objek modul dari sebuah string.\n\nObjek modul yang kembali dipakai seperti biasa: `mod.sqrt`, atau lewat `getattr(mod, \"sqrt\")` kalau nama atributnya juga datang dari data. Fungsi lama `__import__` masih ada dan mendasari semuanya, tetapi untuk kebutuhan harian gunakan `importlib.import_module` yang antarmukanya lebih jelas.\n\nPakai seperlunya. Import dinamis menyembunyikan dependensi dari pembaca kode dan dari alat analisis statis. Tempat paling wajar: pemuat plugin dan kode yang memang berbasis konfigurasi, bukan pengganti impor biasa yang malas ditulis.",
          code: {
            language: "python",
            content: `import importlib

mod = importlib.import_module("math")
print(mod.gcd(12, 18))`,
            caption: "Nama modul berupa string, hasilnya objek modul biasa.",
          },
        },
        {
          kind: "quiz",
          question: "Nama modul baru diketahui saat program berjalan, tersimpan di variabel `nama`. Cara memuatnya yang tepat?",
          options: [
            "importlib.import_module(nama)",
            "import nama",
            "eval(\"import \" + nama)",
            "from nama import *",
          ],
          answer: 0,
          explanation: "Perintah `import` tidak menerima variabel. Fungsi yang dirancang untuk ini adalah `importlib.import_module(nama)`.",
        },
        {
          kind: "code",
          title: "Ambil fungsi lewat getattr",
          prompt: "Lengkapi `___` agar fungsi diambil dari objek modul berdasarkan namanya yang berupa string, lalu dipanggil dengan nilai dari input ketiga.",
          mode: "fill",
          template: `import importlib

nama_modul = input()
nama_fungsi = input()
mod = importlib.import_module(nama_modul)
fungsi = ___(mod, nama_fungsi)
nilai = int(input())
print(fungsi(nilai))`,
          solution: `import importlib

nama_modul = input()
nama_fungsi = input()
mod = importlib.import_module(nama_modul)
fungsi = getattr(mod, nama_fungsi)
nilai = int(input())
print(fungsi(nilai))`,
          tests: [
            { stdin: "math\nsqrt\n25", expectedOutput: "5.0" },
            { stdin: "math\nfactorial\n5", expectedOutput: "120" },
            { stdin: "math\nfabs\n-7", expectedOutput: "7.0", hidden: true },
          ],
          hints: [
            "Kamu butuh fungsi bawaan yang mengambil atribut objek berdasarkan nama string.",
            "getattr(mod, nama_fungsi) mengembalikan fungsi yang bisa langsung dipanggil.",
          ],
        },
      ],
    },
    {
      slug: "circular-import",
      title: "Circular Import dan Solusinya",
      summary: "Kenapa dua modul yang saling mengimpor bisa meledak, dan cara memutus lingkarannya.",
      steps: [
        {
          kind: "theory",
          title: "Lingkaran yang membuat modul setengah jadi",
          body: "Circular import terjadi saat `a.py` mengimpor `b.py`, dan `b.py` mengimpor `a.py`. Python mulai memuat `a`, di tengah jalan memuat `b`, lalu `b` meminta `a` yang ternyata belum selesai dimuat. Hasilnya `ImportError` atau `AttributeError` terhadap nama yang belum sempat dibuat.\n\nAkar masalahnya hampir selalu desain: dua modul yang saling bergantung berarti ada tanggung jawab yang salah tempat. Perbaikan paling sehat adalah memindahkan bagian yang dipakai keduanya ke modul ketiga yang netral, lalu kedua modul mengimpor ke sana. Lingkarannya putus karena arah dependensi jadi satu arah.\n\nKalau restrukturisasi terasa berat, ada dua jalan keluar yang lebih ringan: impor di dalam fungsi yang memang butuh (dijalankan belakangan, saat kedua modul sudah siap), dan untuk kebutuhan type hint saja, impor di dalam blok `if TYPE_CHECKING:` dari modul `typing` sehingga tidak dieksekusi saat runtime.",
          code: {
            language: "python",
            content: `# a.py:  import b            <- lingkaran: b juga mengimpor a
# b.py:  import a            <- a masih setengah dimuat di titik ini

# perbaikan ringan: impor di dalam fungsi
def laporan():
    import b  # aman: dijalankan saat fungsi dipanggil
    return b.ringkas()`,
            caption: "Lingkaran impor dan salah satu jalan keluarnya.",
          },
        },
        {
          kind: "quiz",
          question: "Kenapa circular import bisa membuat program gagal?",
          options: [
            "Python menolak lebih dari lima impor per file",
            "Modul yang diminta masih setengah dimuat sehingga namanya belum tersedia",
            "Jumlah baris kedua modul melebihi batas",
            "Impor hanya boleh dilakukan dari satu file saja",
          ],
          answer: 1,
          explanation: "Saat lingkaran terjadi, modul yang diimpor balik sedang dalam keadaan setengah dimuat, sehingga nama yang dicari belum ada di dalamnya.",
        },
        {
          kind: "quiz",
          question: "Modul A hanya butuh class dari modul B untuk type hint, bukan saat runtime. Solusi yang paling pas?",
          options: [
            "Salin definisi class-nya ke A",
            "Hapus type hint-nya saja",
            "Impor di dalam blok if TYPE_CHECKING:",
            "Gabungkan A dan B jadi satu file",
          ],
          answer: 2,
          explanation: "`if TYPE_CHECKING:` hanya benar bagi pemeriksa tipe statis, bukan saat runtime, jadi hint tetap ada tanpa memicu impor yang berbahaya.",
        },
      ],
    },
    {
      slug: "latihan-program-modular",
      title: "Latihan Gabungan: Program Modular",
      summary: "Tutup modul dengan program bergaya modular: impor stdlib, fungsi analisis, dan guard __main__.",
      steps: [
        {
          kind: "theory",
          title: "Anatomi program modular",
          body: "Tutup modul ini dengan program kecil bernuansa modular. Pola yang dipakai: impor stdlib di baris paling atas, logika di fungsi bernama jelas, lalu guard `if __name__ == \"__main__\":` di bawah sebagai titik masuk. Kalau nanti file ini tumbuh, fungsi `analisis` tinggal pindah ke modulnya sendiri tanpa mengubah alur program.\n\nPerhatikan fungsi `analisis`: ia menerima satu daftar angka dan mengembalikan dict ringkasan. Modul `statistics` menyediakan `mean` untuk rata-rata dan `stdev` untuk simpangan baku sampel. Dict di Python menjaga urutan penyisipan, sehingga hasil cetak per kunci berurutan sesuai yang kamu susun.",
          code: {
            language: "python",
            content: `import json

def muat(teks):
    return json.loads(teks)

def utama():
    data = muat(input())
    print(data["nama"])

if __name__ == "__main__":
    utama()`,
            caption: "Impor di atas, logika di tengah, titik masuk di bawah.",
          },
        },
        {
          kind: "code",
          title: "Lengkapi penghitung simpangan baku",
          prompt: "Baris impor di atas sudah menyediakan `mean` dan `stdev` dari modul `statistics`. Lengkapi `___` di fungsi `analisis` agar menghitung simpangan baku sampel, lalu jalankan.",
          mode: "fill",
          template: `from statistics import mean, stdev

def analisis(angka):
    return {
        "min": min(angka),
        "maks": max(angka),
        "rata": f"{mean(angka):.2f}",
        "simpangan": f"{___(angka):.2f}",
    }

def utama():
    angka = [int(x) for x in input().split()]
    for kunci, nilai in analisis(angka).items():
        print(f"{kunci}: {nilai}")

if __name__ == "__main__":
    utama()`,
          solution: `from statistics import mean, stdev

def analisis(angka):
    return {
        "min": min(angka),
        "maks": max(angka),
        "rata": f"{mean(angka):.2f}",
        "simpangan": f"{stdev(angka):.2f}",
    }

def utama():
    angka = [int(x) for x in input().split()]
    for kunci, nilai in analisis(angka).items():
        print(f"{kunci}: {nilai}")

if __name__ == "__main__":
    utama()`,
          tests: [
            { stdin: "2 4 6", expectedOutput: "min: 2\nmaks: 6\nrata: 4.00\nsimpangan: 2.00" },
            { stdin: "1 2 3", expectedOutput: "min: 1\nmaks: 3\nrata: 2.00\nsimpangan: 1.00" },
            { stdin: "10 10 10", expectedOutput: "min: 10\nmaks: 10\nrata: 10.00\nsimpangan: 0.00", hidden: true },
          ],
          hints: [
            "Fungsinya sudah diimpor di baris paling atas, tinggal dipanggil dengan daftar angkanya.",
            "Simpangan baku sampel dihitung dengan stdev(angka).",
          ],
        },
      ],
    },
  ],
};
