import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "python",
  moduleRange: [2, 3],
  modules: [
    {
      title: "Fungsi dan Gaya Fungsional",
      description: "args/kwargs, default mutable pitfall, lambda, map/filter, closure, dan decorator dasar.",
    },
    {
      title: "Error dan Exception",
      description: "try/except/else/finally, raise, exception chain, custom exception, dan prinsip EAFP.",
    },
  ],
  lessons: [
    // ==================== MODUL 2: Fungsi dan Gaya Fungsional ====================
    {
      slug: "args-dan-kwargs",
      title: "args dan kwargs",
      summary: "Terima seberapa pun banyak argumen dengan *args dan **kwargs.",
      steps: [
        {
          kind: "theory",
          title: "Packing argumen: *args dan **kwargs",
          body: "Di fondasi kamu sudah menulis fungsi dengan parameter tetap. Sekarang balik arahnya: bagaimana kalau jumlah argumennya tidak pasti? Python menyediakan packing. Parameter dengan satu tanda bintang, misalnya `*args`, mengumpulkan sisa argumen posisional menjadi sebuah tuple. Dua tanda bintang, misalnya `**kwargs`, mengumpulkan sisa argumen kata kunci menjadi sebuah dict.\n\nNama `args` dan `kwargs` hanyalah kebiasaan; yang dibaca Python adalah tanda bintangnya, jadi `*nilai` sama sahnya dengan `*args`. Urutan parameternya kaku: parameter posisi biasa dulu, lalu `*args`, lalu `**kwargs`.\n\nKombinasi ini sering muncul di kode nyata, terutama pada fungsi pembungkus yang meneruskan argumen apa adanya: `func(*args, **kwargs)`. Pola itu akan kamu pakai lagi di akhir modul ini saat membuat decorator.",
          code: {
            language: "python",
            content: "def rekap(judul, *nilai, **opsi):\n    print(judul, nilai)\n    print(opsi)\n\nrekap(\"penjualan\", 10, 20, satuan=\"kg\", diskon=True)\n# penjualan (10, 20)\n# {'satuan': 'kg', 'diskon': True}",
            caption: "*nilai menampung 10 dan 20, **opsi menampung dua argumen kata kunci.",
          },
        },
        {
          kind: "quiz",
          question: "Di dalam fungsi dengan parameter `*args`, tipe data `args` adalah?",
          options: ["list", "tuple", "dict", "set"],
          answer: 1,
          explanation: "*args mengumpulkan argumen posisional menjadi tuple. Yang mengumpulkan ke dict adalah **kwargs.",
        },
        {
          kind: "code",
          title: "Jumlahkan seberapa pun banyak angka",
          prompt: "Lengkapi fungsi `jumlahkan` supaya bisa menerima seberapa pun banyak argumen posisional dan mengembalikan jumlahnya. Program sudah membaca tiga bilangan dari input, jangan diubah.",
          mode: "fill",
          template: "def jumlahkan(___):\n    return sum(angka)\n\na = int(input())\nb = int(input())\nc = int(input())\nprint(jumlahkan(a, b, c))",
          solution: "def jumlahkan(*angka):\n    return sum(angka)\n\na = int(input())\nb = int(input())\nc = int(input())\nprint(jumlahkan(a, b, c))",
          tests: [
            { stdin: "4\n8\n15", expectedOutput: "27" },
            { stdin: "1\n1\n1", expectedOutput: "3" },
            { stdin: "-10\n5\n0", expectedOutput: "-5" },
          ],
          hints: [
            "Parameter yang mengumpulkan banyak argumen posisional diawali satu tanda bintang.",
            "Nama parameternya bebas, tapi baris return di bawahnya sudah memakai nama angka.",
            "Jawabannya: *angka",
          ],
        },
      ],
    },
    {
      slug: "jebakan-default-mutable",
      title: "Jebakan Default Mutable",
      summary: "Kenapa list sebagai default argument bocor antar pemanggilan, dan pola perbaikannya.",
      steps: [
        {
          kind: "theory",
          title: "Default yang dievaluasi sekali",
          body: "Nilai default parameter dievaluasi satu kali, saat baris `def` dijalankan, bukan pada setiap pemanggilan. Untuk angka atau string tidak terasa dampaknya. Tapi untuk list, dict, atau set, objek default yang sama dipakai ulang di semua pemanggilan yang tidak memberi nilainya.\n\nAkibatnya list default terlihat mengingat isi dari pemanggilan sebelumnya. Ini salah satu jebakan paling sering ditemui di kode Python nyata, sekaligus pertanyaan wawancara yang klasik.\n\nSolusi standarnya: jadikan default `None`, lalu buat objek baru di dalam fungsi. `None` tidak bisa diubah isinya, jadi aman dipakai sebagai penanda belum diisi.",
          code: {
            language: "python",
            content: "def tambah_item(item, keranjang=[]):\n    keranjang.append(item)\n    return keranjang\n\nprint(tambah_item(\"buku\"))\nprint(tambah_item(\"pensil\"))\n# ['buku']\n# ['buku', 'pensil']\n# yang diharapkan: ['buku'] lalu ['pensil']",
            caption: "List default yang sama terus dipakai ulang antar pemanggilan.",
          },
        },
        {
          kind: "code",
          title: "Perbaiki daftar tugas yang bocor",
          prompt: "Fungsi ini seharusnya mengembalikan daftar baru berisi satu tugas setiap kali dipanggil tanpa argumen kedua. Sekarang isinya menumpuk antar pemanggilan. Temukan satu kesalahannya dan perbaiki.",
          mode: "fix",
          template: "def tambah_tugas(tugas, daftar=[]):\n    daftar.append(tugas)\n    return daftar\n\nprint(tambah_tugas(input()))\nprint(tambah_tugas(input()))\nprint(tambah_tugas(input()))",
          solution: "def tambah_tugas(tugas, daftar=None):\n    if daftar is None:\n        daftar = []\n    daftar.append(tugas)\n    return daftar\n\nprint(tambah_tugas(input()))\nprint(tambah_tugas(input()))\nprint(tambah_tugas(input()))",
          tests: [
            { stdin: "rapat\nngoding\nistirahat", expectedOutput: "['rapat']\n['ngoding']\n['istirahat']" },
            { stdin: "a\nb\nc", expectedOutput: "['a']\n['b']\n['c']" },
          ],
          hints: [
            "Masalahnya ada di nilai default parameter daftar, bukan di append.",
            "Ganti default yang mutable dengan penanda immutable, lalu buat list baru di dalam fungsi sebelum append.",
            "Pola solusinya: def tambah_tugas(tugas, daftar=None), lalu if daftar is None: daftar = []",
          ],
        },
        {
          kind: "quiz",
          question: "Kapan nilai default parameter dievaluasi oleh Python?",
          options: ["Setiap kali fungsi dipanggil", "Sekali, saat def dieksekusi", "Saat fungsi mengembalikan nilai", "Saat parameter pertama kali dibaca"],
          answer: 1,
          explanation: "Python mengevaluasi default satu kali saat def dijalankan, lalu menyimpannya di objek fungsi. Itu sebabnya objek mutable sebagai default dipakai ulang antar pemanggilan.",
        },
      ],
    },
    {
      slug: "keyword-only-parameters",
      title: "Parameter Keyword-Only",
      summary: "Paksa pemanggil menyebut nama parameter supaya salah urutan tidak mungkin terjadi.",
      steps: [
        {
          kind: "theory",
          title: "Parameter yang wajib disebut namanya",
          body: "Parameter yang ditulis setelah `*args`, atau setelah tanda bintang telanjang (`*`), hanya bisa diisi lewat kata kunci. Python menolak pemanggilan posisional untuk mereka. Tanda bintang telanjang dipakai kalau kamu tidak butuh `*args` sama sekali, hanya ingin memaksa parameter berikutnya disebut namanya.\n\nManfaatnya paling terasa saat ada banyak parameter opsional atau flag: `kirim(paket, express=True)` jauh lebih sulit salah urut daripada `kirim(paket, True)`. Banyak fungsi bawaan dirancang begini, misalnya parameter `key` dan `reverse` pada `sorted`.\n\nKebiasaan baiknya: parameter yang maknanya bergantung pada nama, seperti flag dan opsi konfigurasi, dibuat keyword-only. Parameter yang urutannya memang alami boleh tetap posisional.",
          code: {
            language: "python",
            content: "def kirim(paket, *, express=False, asuransi=0):\n    biaya = 10000 + (5000 if express else 0) + asuransi\n    return f\"{paket}: Rp{biaya}\"\n\nprint(kirim(\"B112\", express=True))\nprint(kirim(\"B113\", asuransi=3000))\n# B112: Rp15000\n# B113: Rp13000",
            caption: "Tanda * memaksa express dan asuransi ditulis dengan nama.",
          },
        },
        {
          kind: "quiz",
          question: "Pada `def laporan(judul, *, ringkas=False)`, pemanggilan mana yang sah?",
          options: [
            'laporan("penjualan", True)',
            'laporan("penjualan", ringkas=True)',
            'laporan(judul="penjualan", True)',
            'laporan(True, "penjualan")',
          ],
          answer: 1,
          explanation: "Parameter setelah tanda bintang hanya boleh diisi dengan kata kunci, jadi laporan(\"penjualan\", ringkas=True) yang sah. Pemanggilan posisional seperti True tanpa nama akan ditolak.",
        },
        {
          kind: "quiz",
          question: "Apa fungsi tanda bintang telanjang, satu `*` tanpa nama, di daftar parameter?",
          options: [
            "Menerima sisa argumen posisional seperti *args",
            "Membatalkan parameter sebelum tanda bintang",
            "Menandai bahwa parameter setelahnya wajib ditulis dengan nama",
            "Mengubah fungsi menjadi generator",
          ],
          answer: 2,
          explanation: "Tanda * telanjang hanya pembatas: ia tidak menampung argumen apa pun, tapi parameter setelahnya menjadi keyword-only.",
        },
      ],
    },
    {
      slug: "fungsi-first-class",
      title: "Fungsi First-Class",
      summary: "Simpan, kirim, dan kembalikan fungsi seperti nilai biasa.",
      steps: [
        {
          kind: "theory",
          title: "Fungsi adalah nilai biasa",
          body: "Di Python, fungsi adalah objek seperti nilai lainnya. Bisa disimpan ke variabel, masuk list atau dict, dikirim sebagai argumen, dan dikembalikan dari fungsi lain. Tidak ada kata kunci khusus: nama fungsi tanpa tanda kurung merujuk ke objek fungsinya, dengan tanda kurung berarti memanggilnya.\n\nSifat inilah fondasi seluruh modul ini: `lambda` adalah fungsi tanpa nama yang dikirim begitu saja, `map` dan `filter` menerima fungsi sebagai argumen, dan decorator adalah fungsi yang menerima sekaligus mengembalikan fungsi.\n\nPembeda yang sering menjebak: `f` mengirim fungsinya, `f()` menjalankannya lalu mengirim hasilnya. Melewatkan `f()` padahal yang diminta `f` adalah bug yang sangat umum, dan pesan errornya semacam `TypeError: 'int' object is not callable` baru muncul jauh dari sumbernya.",
          code: {
            language: "python",
            content: "def jalankan(func, data):\n    return func(data)\n\ndef panjang(teks):\n    return len(teks)\n\ndef bersihkan(teks):\n    return teks.strip().lower()\n\nprint(jalankan(panjang, \"  KodeKita \"))\nprint(jalankan(bersihkan, \"  KodeKita \"))",
            caption: "jalankan menerima fungsi apa pun dan memanggilnya dengan data.",
          },
        },
        {
          kind: "quiz",
          question: "Apa keluaran kode berikut?\n\n```python\ndef dobel(x):\n    return x * 2\n\nf = dobel\nprint(f(5))\n```",
          options: ["5", "10", "Error karena f belum didefinisikan", "None"],
          answer: 1,
          explanation: "f menunjuk ke objek fungsi dobel yang sama, jadi f(5) sama dengan dobel(5), hasilnya 10.",
        },
        {
          kind: "quiz",
          question: "`jalankan(dobel, 4)` mengembalikan 8. Apa yang terjadi jika program menulis `jalankan(dobel(4), 2)`? Perhatikan tanda kurungnya.",
          options: [
            "Sama saja, hasilnya 8",
            "dobel(4) dijalankan dulu menjadi 8, lalu jalankan mencoba memanggil angka 8 sehingga terjadi TypeError",
            "Hasilnya 16",
            "Hasilnya None",
          ],
          answer: 1,
          explanation: "dobel(4) dievaluasi dulu menjadi 8, lalu jalankan mencoba memanggil 8 seperti fungsi. Yang seharusnya dikirim adalah fungsinya, bukan hasil panggilannya.",
        },
      ],
    },
    {
      slug: "lambda-dan-sorted-key",
      title: "Lambda dan sorted key",
      summary: "Tulis key sorting pendek dengan lambda, termasuk urutan menurun dan multi kriteria.",
      steps: [
        {
          kind: "theory",
          title: "lambda: fungsi sebaris untuk key",
          body: "`lambda parameter: ekspresi` membuat fungsi tanpa nama dalam satu ekspresi. Tidak ada `return` eksplisit: hasil ekspresinya otomatis menjadi nilai kembali. Kalau logikanya butuh lebih dari satu baris, tulis `def` biasa; lambda memang untuk hal pendek.\n\nTempat paling alami lambda adalah parameter `key` di `sorted`, `min`, dan `max`: fungsi key menerima satu item dan mengembalikan nilai pembandingnya. Untuk urutan menurun pada angka, trik umumnya memakai negasi. Untuk beberapa kriteria sekaligus, kembalikan tuple: elemen pertama yang diprioritaskan, elemen berikutnya menjadi penentu saat seri.\n\nMenyimpan lambda ke variabel jarang bermanfaat; kalau butuh nama, lebih baik `def`. Lambda paling pas dikirim langsung sebagai argumen.",
          code: {
            language: "python",
            content: "kata = [\"durian\", \"aki\", \"mangga\"]\nprint(sorted(kata, key=lambda k: len(k)))\n# ['aki', 'durian', 'mangga']",
            caption: "Diurutkan berdasarkan panjang kata, bukan abjad.",
          },
        },
        {
          kind: "quiz",
          question: "Manakah lambda yang benar untuk mengurutkan list tuple berdasarkan elemen keduanya?",
          options: ["lambda p: p[1]", "lambda p -> p[1]", "lambda {p: p[1]}", "lambda(p): return p[1]"],
          answer: 0,
          explanation: "Bentuknya lambda p: p[1]. Tidak ada kata return dan tidak ada panah; badan lambda adalah satu ekspresi yang hasilnya otomatis dikembalikan.",
        },
        {
          kind: "code",
          title: "Papan skor turnamen",
          prompt: "Setiap baris input setelah baris pertama berisi nama dan skor. Cetak papan skor: nilai tertinggi dulu, dan kalau nilai sama, nama yang lebih awal abjadnya dulu. Lengkapi fungsi key-nya.",
          mode: "fill",
          template: "n = int(input())\npeserta = []\nfor _ in range(n):\n    nama, skor = input().split()\n    peserta.append((nama, int(skor)))\n\nurutan = sorted(peserta, key=lambda p: (___, p[0]))\nfor nama, skor in urutan:\n    print(f\"{nama}: {skor}\")",
          solution: "n = int(input())\npeserta = []\nfor _ in range(n):\n    nama, skor = input().split()\n    peserta.append((nama, int(skor)))\n\nurutan = sorted(peserta, key=lambda p: (-p[1], p[0]))\nfor nama, skor in urutan:\n    print(f\"{nama}: {skor}\")",
          tests: [
            { stdin: "3\nBudi 80\nAni 90\nCitra 80", expectedOutput: "Ani: 90\nBudi: 80\nCitra: 80" },
            { stdin: "2\nZaki 70\nAli 95", expectedOutput: "Ali: 95\nZaki: 70" },
            { stdin: "4\nDodi 50\nBani 70\nAri 50\nCika 70", expectedOutput: "Bani: 70\nCika: 70\nAri: 50\nDodi: 50" },
          ],
          hints: [
            "p adalah tuple (nama, skor); skornya ada di indeks 1.",
            "sorted mengurutkan menaik. Supaya skor besar muncul lebih dulu, pakai negasi pada skornya.",
            "Jawabannya: -p[1]",
          ],
        },
      ],
    },
    {
      slug: "map-dan-filter",
      title: "map dan filter",
      summary: "Ubah dan saring data dengan map dan filter, lalu bandingkan dengan comprehension.",
      steps: [
        {
          kind: "theory",
          title: "map, filter, dan pesaingnya",
          body: "`map(f, iterable)` menerapkan f pada tiap item; `filter(pred, iterable)` menyaring item yang predikatnya benar. Keduanya mengembalikan iterator lazy di Python 3: isinya baru dihitung saat dipakai, misalnya dibungkus `list(...)` atau dibaca dalam loop.\n\nPola kombinasinya seperti `list(map(f, filter(pred, angka)))`. Berfungsi, tapi dibaca dari dalam ke luar. Comprehension menulis hal yang sama dengan urutan baca alami: `[x * x for x in angka if x % 2 == 0]`. Kamu sudah mengenal comprehension di modul koleksi; untuk transformasi biasa, dia lebih sering dipilih karena lebih mudah dibaca.\n\nKapan map dan filter tetap layak? Saat fungsinya sudah ada dan tinggal dipakai, misalnya `map(int, input().split())`, atau saat pipeline dibangun bertahap lewat variabel. Keputusannya soal keterbacaan, bukan kecepatan.",
          code: {
            language: "python",
            content: "angka = [3, 8, 1, 6]\nkali_dua = map(lambda a: a * 2, angka)\nprint(list(kali_dua))\n# [6, 16, 2, 12]",
            caption: "map mengembalikan iterator; list() menghabiskannya.",
          },
        },
        {
          kind: "code",
          title: "Saring genap lalu kuadratkan",
          prompt: "Program ini seharusnya mengambil bilangan genap dari input, mengkuadratkannya, lalu mencetak hasilnya sebagai list. Sekarang program error saat dijalankan. Perbaiki satu kesalahannya.",
          mode: "fix",
          template: "angka = list(map(int, input().split()))\ngenap = filter(a % 2 == 0, angka)\nkuadrat = map(lambda a: a * a, genap)\nprint(list(kuadrat))",
          solution: "angka = list(map(int, input().split()))\ngenap = filter(lambda a: a % 2 == 0, angka)\nkuadrat = map(lambda a: a * a, genap)\nprint(list(kuadrat))",
          tests: [
            { stdin: "1 2 3 4 5 6", expectedOutput: "[4, 16, 36]" },
            { stdin: "7 8 9", expectedOutput: "[64]" },
            { stdin: "1 3 5", expectedOutput: "[]" },
          ],
          hints: [
            "Jalankan dulu dan baca pesan errornya: nama a tidak dikenal di baris filter.",
            "filter butuh fungsi sebagai argumen pertamanya, bukan ekspresi yang dievaluasi langsung.",
            "Bungkus kondisinya menjadi lambda: filter(lambda a: a % 2 == 0, angka)",
          ],
        },
        {
          kind: "quiz",
          question: "Apa yang dikembalikan `map(f, data)` di Python 3?",
          options: ["List berisi semua hasil", "Iterator yang menghitung hasil saat dibutuhkan", "Satu nilai hasil terakhir", "Tuple berisi hasil"],
          answer: 1,
          explanation: "Di Python 3, map dan filter mengembalikan iterator lazy. Untuk melihat isinya sekaligus, bungkus dengan list().",
        },
      ],
    },
    {
      slug: "closure",
      title: "Closure",
      summary: "Buat fungsi yang mengingat lingkungannya lewat fungsi dalam fungsi.",
      steps: [
        {
          kind: "theory",
          title: "Fungsi yang membawa ingatan",
          body: "Fungsi dalam bisa membaca variabel milik fungsi luarnya. Yang menarik: ikatan itu tetap hidup bahkan setelah fungsi luar selesai dijalankan. Fungsi dalam beserta variabel lingkungannya yang tersisa itulah yang disebut closure.\n\nBentuk paling umumnya adalah factory. `buat_sapa('Hai')` mengembalikan fungsi baru yang mengingat sapaan Hai selamanya; setiap pemanggilan factory menghasilkan closure dengan ingatan yang berbeda.\n\nKalau closure perlu mengubah variabel luarnya, bukan sekadar membaca, deklarasikan `nonlocal`. Tanpa itu, penugasan justru menciptakan variabel baru di scope dalam. Konsep ini yang mendasari decorator di dua lesson berikutnya: wrapper adalah closure yang mengingat func.",
          code: {
            language: "python",
            content: "def buat_sapa(sapaan):\n    def sapa(nama):\n        return f\"{sapaan}, {nama}!\"\n    return sapa\n\nsapa_dosen = buat_sapa(\"Selamat pagi\")\nsapa_teman = buat_sapa(\"Hai\")\nprint(sapa_dosen(\"Bu Rina\"))\nprint(sapa_teman(\"Dita\"))\n# Selamat pagi, Bu Rina!\n# Hai, Dita!",
            caption: "Dua closure, dua ingatan sapaan yang berbeda.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang membuat closure berbeda dari fungsi biasa?",
          options: [
            "Closure selalu mengembalikan None",
            "Closure menyimpan ikatan ke variabel dari lingkungan luarnya",
            "Closure tidak bisa menerima argumen",
            "Closure hanya bisa dibuat dengan lambda",
          ],
          answer: 1,
          explanation: "Closure adalah fungsi dalam yang tetap membawa ikatan ke variabel fungsi luarnya, meski fungsi luar sudah selesai dijalankan.",
        },
        {
          kind: "code",
          title: "Pabrik pengali",
          prompt: "Lengkapi fungsi dalam `kali` supaya mengingat `faktor` dari fungsi luarnya. Program membaca faktor lalu satu angka, dan mencetak hasil kalinya.",
          mode: "fill",
          template: "def buat_pengali(faktor):\n    def kali(x):\n        return x * ___\n    return kali\n\nfaktor = int(input())\npengali = buat_pengali(faktor)\nprint(pengali(int(input())))",
          solution: "def buat_pengali(faktor):\n    def kali(x):\n        return x * faktor\n    return kali\n\nfaktor = int(input())\npengali = buat_pengali(faktor)\nprint(pengali(int(input())))",
          tests: [
            { stdin: "3\n7", expectedOutput: "21" },
            { stdin: "-2\n5", expectedOutput: "-10" },
            { stdin: "12\n5", expectedOutput: "60" },
          ],
          hints: [
            "kali hanya butuh satu nilai dari luar dirinya: faktor.",
            "Variabel faktor masih terbaca dari dalam kali lewat closure, tanpa perlu dikirim sebagai argumen.",
            "Jawabannya: return x * faktor",
          ],
        },
      ],
    },
    {
      slug: "decorator-dasar",
      title: "Decorator Dasar",
      summary: "Tambah perilaku ke fungsi lain lewat sintaks @ tanpa menyentuh isinya.",
      steps: [
        {
          kind: "theory",
          title: "@: gula sintaks untuk membungkus fungsi",
          body: "Decorator adalah fungsi yang menerima sebuah fungsi dan mengembalikan fungsi penggantinya. Baris `@catat` di atas `def jumlah` persis sama dengan `jumlah = catat(jumlah)`; tanda @ hanya membuat pembungkusannya terlihat jelas.\n\nFungsi penggantinya biasanya bernama `wrapper`: closure yang mengingat func. Wrapper bebas menambah pekerjaan sebelum dan sesudah memanggil func, dan wajib mengembalikan hasil func kalau pemanggilnya mengharapkan nilai kembali.\n\nPerhatikan `*args, **kwargs` di wrapper: dengan itu, satu decorator bisa membungkus fungsi dengan tanda tangan apa pun. Pola yang sama dipakai decorator log, cache, retry, dan pengukur waktu.",
          code: {
            language: "python",
            content: "def catat(func):\n    def wrapper(*args, **kwargs):\n        print(f\"mulai {func.__name__}\")\n        hasil = func(*args, **kwargs)\n        print(f\"selesai {func.__name__}\")\n        return hasil\n    return wrapper\n\n@catat\ndef jumlah(a, b):\n    return a + b\n\nprint(jumlah(2, 3))\n# mulai jumlah\n# selesai jumlah\n# 5",
            caption: "Wrapper menambah perilaku di sekitar func dan tetap mengembalikan hasilnya.",
          },
        },
        {
          kind: "code",
          title: "Bungkus dengan pencatat",
          prompt: "Lengkapi dua bagian kosong: pemanggilan fungsi asli di dalam wrapper, dan penerapan decorator `catat` pada fungsi `jumlah` dengan sintaks @.",
          mode: "fill",
          template: "def catat(func):\n    def wrapper(*args, **kwargs):\n        print(f\"memanggil {func.__name__}\")\n        hasil = ___\n        return hasil\n    return wrapper\n\n___\ndef jumlah(a, b):\n    return a + b\n\nprint(jumlah(int(input()), int(input())))",
          solution: "def catat(func):\n    def wrapper(*args, **kwargs):\n        print(f\"memanggil {func.__name__}\")\n        hasil = func(*args, **kwargs)\n        return hasil\n    return wrapper\n\n@catat\ndef jumlah(a, b):\n    return a + b\n\nprint(jumlah(int(input()), int(input())))",
          tests: [
            { stdin: "3\n4", expectedOutput: "memanggil jumlah\n7" },
            { stdin: "10\n-2", expectedOutput: "memanggil jumlah\n8" },
          ],
          hints: [
            "Wrapper harus memanggil func dengan seluruh argumen yang diterimanya, lalu menyimpan hasilnya.",
            "Pola meneruskan argumen apa adanya: func(*args, **kwargs).",
            "Baris di atas def jumlah yang menempelkan decorator ditulis @catat",
          ],
        },
        {
          kind: "quiz",
          question: "`@catat` di atas `def f()` setara dengan baris mana?",
          options: ["f = catat(f)", "f = catat()", "catat(f)", "f = f(catat)"],
          answer: 0,
          explanation: "@catat memanggil catat dengan f dan mengganti nama f dengan hasil kembaliannya: f = catat(f).",
        },
      ],
    },
    {
      slug: "functools-wraps",
      title: "Decorator dan functools.wraps",
      summary: "Jaga nama dan docstring fungsi asli tetap benar di balik decorator.",
      steps: [
        {
          kind: "theory",
          title: "Menjaga identitas fungsi asli",
          body: "Setelah dibungkus, nama yang kamu panggil sebenarnya adalah wrapper. Tanpa langkah tambahan, `jumlah.__name__` berubah menjadi `wrapper`, docstring fungsi asli tersembunyi, dan alat bantu seperti `help()` serta debugger menampilkan informasi yang menyesatkan.\n\nSolusinya ada di stdlib: `functools.wraps`. Dipasang sebagai decorator di atas wrapper, ia menyalin `__name__`, `__doc__`, `__module__`, dan metadata lain dari func ke wrapper. Biayanya satu baris.\n\nJadikan kebiasaan: setiap decorator yang kamu tulis memakai `@functools.wraps(func)`. Ini bukan urusan gaya, tapi urusan traceback error dan dokumentasi yang tetap benar saat decorator ditumpuk beberapa lapis.",
          code: {
            language: "python",
            content: "import functools\n\ndef catat(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs)\n    return wrapper\n\n@catat\ndef jumlah(a, b):\n    \"\"\"Jumlahkan dua angka.\"\"\"\n    return a + b\n\nprint(jumlah.__name__)\nprint(jumlah.__doc__)\n# jumlah\n# Jumlahkan dua angka.",
            caption: "wraps menyalin metadata func ke wrapper.",
          },
        },
        {
          kind: "quiz",
          question: "Tanpa @functools.wraps, apa nilai `jumlah.__name__` setelah `jumlah` dibungkus decorator berbasis wrapper?",
          options: ["jumlah", "wrapper", "func", "None"],
          answer: 1,
          explanation: "Nama yang terpasang adalah nama wrapper, karena jumlah diganti dengan fungsi penggantinya. wraps menyalin kembali nama aslinya.",
        },
        {
          kind: "quiz",
          question: "Di mana @functools.wraps(func) diletakkan?",
          options: [
            "Di atas def decorator terluar",
            "Di atas def wrapper, di dalam decorator",
            "Di atas fungsi yang akan dibungkus, di samping decorator lain",
            "Di dalam return wrapper",
          ],
          answer: 1,
          explanation: "wraps adalah decorator untuk wrapper itu sendiri: diletakkan tepat di atas def wrapper di dalam decorator.",
        },
      ],
    },
    {
      slug: "latihan-gabungan-fungsional",
      title: "Latihan Gabungan: Pemroses Data",
      summary: "Gabungkan decorator, filter, dan lambda dalam satu program pemroses data.",
      steps: [
        {
          kind: "theory",
          title: "Menyatukan alat modul ini",
          body: "Lesson penutup modul ini merakit beberapa alat sekaligus: decorator untuk perilaku di sekeliling fungsi, `filter` dengan lambda untuk memilih data, dan `sum` untuk menghitung. Program praktiknya membaca satu baris angka, menjumlahkan bilangan genapnya, dan melaporkan berapa item yang diproses.\n\nPerhatikan pembagian tugasnya. Decorator `ringkas` tidak tahu apa-apa soal bilangan genap; ia hanya melihat ukuran argumennya. Logika bisnis ada di `total_genap`. Pemisahan seperti ini yang membuat sebuah decorator aman dipakai ulang di fungsi mana pun.",
          code: {
            language: "python",
            content: "def ringkas(func):\n    def wrapper(*args, **kwargs):\n        hasil = func(*args, **kwargs)\n        print(f\"memproses {len(args[0])} item\")\n        return hasil\n    return wrapper\n\n@ringkas\ndef total_genap(angka):\n    return sum(a for a in angka if a % 2 == 0)\n\nprint(total_genap([1, 2, 3, 4]))\n# memproses 4 item\n# 6",
            caption: "Decorator melaporkan, fungsi menghitung.",
          },
        },
        {
          kind: "code",
          title: "Ringkasan data dengan decorator",
          prompt: "Lengkapi dua bagian kosong: pemanggilan func di dalam wrapper, dan pemilihan bilangan genap dengan filter dan lambda di dalam `total_genap`. Program membaca satu baris angka, mencetak laporan decorator, lalu totalnya.",
          mode: "fill",
          template: "def ringkas(func):\n    def wrapper(*args, **kwargs):\n        hasil = ___\n        print(f\"memproses {len(args[0])} item\")\n        return hasil\n    return wrapper\n\n@ringkas\ndef total_genap(angka):\n    return sum(filter(___, angka))\n\nangka = list(map(int, input().split()))\nprint(total_genap(angka))",
          solution: "def ringkas(func):\n    def wrapper(*args, **kwargs):\n        hasil = func(*args, **kwargs)\n        print(f\"memproses {len(args[0])} item\")\n        return hasil\n    return wrapper\n\n@ringkas\ndef total_genap(angka):\n    return sum(filter(lambda a: a % 2 == 0, angka))\n\nangka = list(map(int, input().split()))\nprint(total_genap(angka))",
          tests: [
            { stdin: "1 2 3 4 5 6", expectedOutput: "memproses 6 item\n12" },
            { stdin: "-2 -4 7", expectedOutput: "memproses 3 item\n-6" },
            { stdin: "10 20 30", expectedOutput: "memproses 3 item\n60" },
          ],
          hints: [
            "Wrapper meneruskan argumen apa adanya ke func, polanya func(*args, **kwargs).",
            "filter butuh fungsi predikat sebagai argumen pertamanya.",
            "Predikat genapnya ditulis sebagai lambda: filter(lambda a: a % 2 == 0, angka)",
          ],
        },
      ],
    },
    // ==================== MODUL 3: Error dan Exception ====================
    {
      slug: "try-dan-except",
      title: "try dan except",
      summary: "Tangkap error yang diperkirakan supaya program tidak mati di tengah jalan.",
      steps: [
        {
          kind: "theory",
          title: "Jalur normal dan jalur darurat",
          body: "Exception adalah cara Python melaporkan kegagalan saat program berjalan. Tanpa penanganan, exception merambat ke atas dan menghentikan program sambil mencetak traceback. Blok `try` menyatakan: jalankan ini, dan kalau jenis error tertentu terjadi, pindah ke blok `except` yang cocok.\n\nKuncinya: sebut jenis exceptionnya. `int('abc')` melempar `ValueError`, membuka file yang tidak ada melempar `FileNotFoundError`, akses indeks di luar batas melempar `IndexError`. Menyebut jenisnya membuat maksud kode terbaca, dan error lain di luar dugaan tetap terlihat.\n\nSatu catatan penting: kalau blok try berjalan mulus, blok except dilewati begitu saja. Penanganan exception tidak mengubah jalur sukses sama sekali.",
          code: {
            language: "python",
            content: "try:\n    angka = int(\"abc\")\n    print(\"berhasil\")\nexcept ValueError:\n    print(\"teksnya bukan angka\")",
            caption: "print(\"berhasil\") tidak pernah tercapai karena error terjadi di baris di atasnya.",
          },
        },
        {
          kind: "quiz",
          question: "Exception apa yang dilempar `int(\"abc\")`?",
          options: ["TypeError", "ValueError", "KeyError", "IndexError"],
          answer: 1,
          explanation: "int menerima str, tapi isinya tidak bisa dikonversi ke bilangan. Kegagalan konversi nilai dilaporkan sebagai ValueError.",
        },
        {
          kind: "code",
          title: "Konversi yang tahan salah ketik",
          prompt: "Lengkapi jenis exception yang ditangkap supaya input yang bukan bilangan bulat tidak membuat program mati, melainkan mencetak pesan penolakan.",
          mode: "fill",
          template: "teks = input()\ntry:\n    angka = int(teks)\n    print(f\"angka: {angka}\")\nexcept ___:\n    print(\"bukan bilangan bulat\")",
          solution: "teks = input()\ntry:\n    angka = int(teks)\n    print(f\"angka: {angka}\")\nexcept ValueError:\n    print(\"bukan bilangan bulat\")",
          tests: [
            { stdin: "42", expectedOutput: "angka: 42" },
            { stdin: "hai", expectedOutput: "bukan bilangan bulat" },
            { stdin: "-7", expectedOutput: "angka: -7" },
          ],
          hints: [
            "int() gagal mengonversi teks biasa ke bilangan bulat. Jenis exceptionnya memuat kata Value.",
            "Jawabannya: ValueError",
          ],
        },
      ],
    },
    {
      slug: "multi-except",
      title: "Multi except",
      summary: "Bedakan beberapa kegagalan dengan beberapa blok except dan tuple jenis.",
      steps: [
        {
          kind: "theory",
          title: "Beberapa risiko, beberapa pintu tangkap",
          body: "Satu `try` boleh punya beberapa blok `except`, satu untuk tiap jenis exception. Python memeriksa dari atas ke bawah dan menjalankan blok pertama yang cocok; sisanya dilewati. Susun urutannya dari yang spesifik ke yang umum.\n\nKalau penanganannya sama, beberapa jenis bisa ditulis dalam satu blok memakai tuple: `except (ValueError, TypeError):`. Tapi begitu digabung, kamu tidak tahu yang gagal mana, kecuali mengikat objeknya dengan `as` lalu memeriksa isinya.\n\nPraktik lesson ini menyandingkan dua kegagalan yang berbeda pada pembagian dua angka dari input: konversi yang gagal (`ValueError`) dan pembagi nol (`ZeroDivisionError`). Keduanya layak mendapat pesan yang berbeda.",
          code: {
            language: "python",
            content: "data = {\"satu\": 1}\ntry:\n    nilai = data[\"dua\"]\nexcept KeyError:\n    print(\"kunci tidak ada\")\nexcept TypeError:\n    print(\"kunci bukan tipe yang cocok\")",
            caption: "Blok except pertama yang cocok dijalankan, sisanya dilewati.",
          },
        },
        {
          kind: "code",
          title: "Pembagi dengan dua jalur gagal",
          prompt: "Lengkapi dua jenis exception di bawah: satu untuk pembagi nol, satu untuk input yang tidak bisa dikonversi ke angka. Perhatikan pesan yang diharapkan tiap kasus.",
          mode: "fill",
          template: "try:\n    a = int(input())\n    b = int(input())\n    hasil = a / b\n    print(f\"hasil: {hasil}\")\nexcept ___:\n    print(\"pembagi nol\")\nexcept ___:\n    print(\"input bukan angka\")",
          solution: "try:\n    a = int(input())\n    b = int(input())\n    hasil = a / b\n    print(f\"hasil: {hasil}\")\nexcept ZeroDivisionError:\n    print(\"pembagi nol\")\nexcept ValueError:\n    print(\"input bukan angka\")",
          tests: [
            { stdin: "8\n2", expectedOutput: "hasil: 4.0" },
            { stdin: "5\n0", expectedOutput: "pembagi nol" },
            { stdin: "x\n2", expectedOutput: "input bukan angka" },
          ],
          hints: [
            "Pembagian dengan nol punya jenis exception sendiri, namanya menyebut Zero.",
            "Pembagi nol: ZeroDivisionError. Untuk int() yang gagal konversi, kamu sudah kenal dari lesson sebelumnya.",
            "Jawabannya: ZeroDivisionError di except pertama, ValueError di except kedua",
          ],
        },
      ],
    },
    {
      slug: "else-dan-finally",
      title: "else dan finally",
      summary: "Pisahkan jalur sukses dengan else dan jamin pembersihan dengan finally.",
      steps: [
        {
          kind: "theory",
          title: "Blok pelengkap: else dan finally",
          body: "`else` berjalan hanya kalau blok try selesai tanpa error. Manfaatnya: kode yang bergantung pada hasil try ditaruh di else, sehingga error dari kode itu tidak ikut tertangkap except milik try. Pola tipikalnya: konversi di try, pemrosesan di else.\n\n`finally` berjalan selalu: sukses, error, bahkan saat ada `return` di tengah jalan. Tempatnya pembersihan yang tidak boleh terlewat, seperti menutup koneksi atau mencatat proses usai. Untuk file, context manager `with` akan mengambil alih tugas ini di modul File dan Data, tapi `finally` tetap hidup di banyak kode nyata.\n\nUrutannya kaku: `try`, satu atau banyak `except`, `else` (opsional, setelah semua except), `finally` (opsional, paling akhir).",
          code: {
            language: "python",
            content: "try:\n    angka = int(\"7\")\nexcept ValueError:\n    print(\"gagal konversi\")\nelse:\n    print(f\"kuadrat: {angka ** 2}\")\nfinally:\n    print(\"proses usai\")\n# kuadrat: 49\n# proses usai",
            caption: "else hanya lewat kalau try bersih; finally selalu lewat.",
          },
        },
        {
          kind: "quiz",
          question: "Kapan blok `finally` dijalankan?",
          options: ["Hanya saat tidak ada exception", "Hanya saat exception tertangkap", "Selalu, entah sukses, error, atau exception lolos", "Hanya jika else tidak ditulis"],
          answer: 2,
          explanation: "finally berjalan di semua jalur, termasuk saat exception tertangkap dan saat exception lolos ke atas. Itulah kenapa dia dipercaya untuk pembersihan.",
        },
        {
          kind: "code",
          title: "Cek lalu laporkan, apa pun hasilnya",
          prompt: "Lengkapi blok yang mencetak hasil perkalian hanya kalau konversi berhasil. Baris `pemeriksaan selesai` harus tercetak di semua kasus; struktur finally sudah disiapkan.",
          mode: "fill",
          template: "try:\n    angka = int(input())\nexcept ValueError:\n    print(\"input salah\")\n___:\n    print(f\"kali 10: {angka * 10}\")\nfinally:\n    print(\"pemeriksaan selesai\")",
          solution: "try:\n    angka = int(input())\nexcept ValueError:\n    print(\"input salah\")\nelse:\n    print(f\"kali 10: {angka * 10}\")\nfinally:\n    print(\"pemeriksaan selesai\")",
          tests: [
            { stdin: "5", expectedOutput: "kali 10: 50\npemeriksaan selesai" },
            { stdin: "abc", expectedOutput: "input salah\npemeriksaan selesai" },
            { stdin: "0", expectedOutput: "kali 10: 0\npemeriksaan selesai" },
          ],
          hints: [
            "Yang dicari adalah blok yang berjalan saat try selesai tanpa error.",
            "Blok itu ditulis dengan satu kata sebelum tanda titik dua, tanpa kondisi apa pun.",
            "Jawabannya: else",
          ],
        },
      ],
    },
    {
      slug: "bare-except-dan-hierarki",
      title: "Hindari Bare except",
      summary: "Kenali hierarki exception dan kenapa bare except menyembunyikan bug.",
      steps: [
        {
          kind: "theory",
          title: "Pohon exception dan jaring yang terlalu lebar",
          body: "Exception tersusun sebagai pohon kelas. Di puncaknya `BaseException`, dan di bawahnya `Exception` yang menjadi induk hampir semua error sehari-hari: `ValueError`, `KeyError`, `IndexError`, `ZeroDivisionError`, dan kawan-kawannya. `except ValueError:` menangkap ValueError dan subkelasnya saja, tidak lebih.\n\n`except:` tanpa jenis, disebut bare except, menangkap semuanya, termasuk `KeyboardInterrupt` saat pengguna menekan Ctrl+C dan `SystemExit` saat program minta berhenti. Program yang seharusnya bisa dihentikan jadi sulit dihentikan, dan bug seperti `NameError` tertelan menjadi perilaku aneh yang sulit dilacak.\n\nPedoman praktisnya: tangkap jenis sekecil mungkin yang bisa kamu tangani dengan bermakna. Jaring pengaman yang luas memang kadang perlu di batas atas aplikasi, tapi pakai `except Exception as e` sambil mencatat errornya, bukan bare except.",
          code: {
            language: "python",
            content: "try:\n    daftar = [1, 2, 3]\n    nilai = daftar[10]\nexcept IndexError as e:\n    print(f\"tertangkap: {e}\")\n# tertangkap: list index out of range",
            caption: "as e mengikat objek exception agar pesannya bisa dipakai.",
          },
        },
        {
          kind: "quiz",
          question: "Apa masalah utama `except:` tanpa jenis exception?",
          options: [
            "Menyebabkan program berjalan lebih lambat",
            "Menangkap semua exception, termasuk KeyboardInterrupt dan SystemExit, sehingga bug dan sinyal berhenti tertelan",
            "Hanya bekerja di Python 2",
            "Tidak bisa dipakai bersama finally",
          ],
          answer: 1,
          explanation: "Bare except menangkap semua, termasuk BaseException seperti KeyboardInterrupt dan SystemExit. Bug yang tidak terduga ikut tertelan tanpa jejak.",
        },
        {
          kind: "quiz",
          question: "Manakah penulisan yang benar untuk mengikat exception ke variabel `e`?",
          options: ["except ValueError, e:", "except ValueError as e:", "except (e) ValueError:", "catch ValueError as e"],
          answer: 1,
          explanation: "Python memakai kata as: except ValueError as e:. Bentuk koma adalah sintaks Python 2 yang sudah tidak berlaku.",
        },
      ],
    },
    {
      slug: "raise",
      title: "Melempar Exception dengan raise",
      summary: "Tolak keadaan tidak valid dengan raise dan pilih jenis exception yang tepat.",
      steps: [
        {
          kind: "theory",
          title: "Melempar sendiri laporannya",
          body: "Exception bukan hanya milik Python; kodemu bisa melemparnya dengan `raise`. Ini cara yang tepat untuk menolak input tidak valid atau keadaan yang mustahil diproses. Jauh lebih jujur daripada mengembalikan nilai samar seperti -1 atau `None` yang bisa diabaikan pemanggil tanpa sadar.\n\nPilih jenisnya sesuai makna: `ValueError` untuk nilai bertipe benar tapi isinya tidak pantas, `TypeError` untuk tipe yang salah, `KeyError` untuk kunci yang tidak ada. Pesannya ditulis untuk manusia yang akan membacanya di traceback: sebut apa yang salah, bukan sekadar kata salah.\n\nFungsi yang berani melempar exception punya kontrak yang jelas: parameternya valid, atau kegagalannya terlapor dengan jelas. Dasar ini yang dipakai terus di lesson berikutnya.",
          code: {
            language: "python",
            content: "def bagi(a, b):\n    if b == 0:\n        raise ValueError(\"pembagi tidak boleh nol\")\n    return a / b\n\ntry:\n    print(bagi(10, 0))\nexcept ValueError as e:\n    print(f\"ditolak: {e}\")\n# ditolak: pembagi tidak boleh nol",
            caption: "Pesan di raise muncul sebagai isi e.",
          },
        },
        {
          kind: "code",
          title: "Penjaga usia",
          prompt: "Lengkapi baris yang menolak usia negatif dengan melempar ValueError. Pesan penolakannya harus muncul lewat blok except di bawah.",
          mode: "fill",
          template: "def cek_usia(usia):\n    if usia < 0:\n        ___ ValueError(\"usia tidak boleh negatif\")\n    return usia\n\ntry:\n    print(cek_usia(int(input())))\nexcept ValueError as e:\n    print(f\"ditolak: {e}\")",
          solution: "def cek_usia(usia):\n    if usia < 0:\n        raise ValueError(\"usia tidak boleh negatif\")\n    return usia\n\ntry:\n    print(cek_usia(int(input())))\nexcept ValueError as e:\n    print(f\"ditolak: {e}\")",
          tests: [
            { stdin: "20", expectedOutput: "20" },
            { stdin: "-3", expectedOutput: "ditolak: usia tidak boleh negatif" },
            { stdin: "0", expectedOutput: "0" },
          ],
          hints: [
            "Yang dicari adalah kata kunci Python untuk melempar exception.",
            "Jawabannya: raise ValueError(\"usia tidak boleh negatif\")",
          ],
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi saat baris `raise ValueError(\"skor tidak wajar\")` dijalankan?",
          options: [
            "Program mencetak pesannya lalu lanjut ke baris berikutnya",
            "Exception ValueError dibuat dan dilempar; jalur normal berhenti sampai ada yang menangkapnya",
            "Fungsi mengembalikan string skor tidak wajar",
            "Program langsung keluar tanpa traceback",
          ],
          answer: 1,
          explanation: "raise membuat objek exception lalu melemparnya. Eksekusi jalur normal berhenti dan merambat ke atas sampai ditangkap except yang cocok.",
        },
      ],
    },
    {
      slug: "melempar-ulang",
      title: "Melempar Ulang Exception",
      summary: "Catat lalu teruskan exception asli dengan raise tanpa argumen.",
      steps: [
        {
          kind: "theory",
          title: "Catat, lalu teruskan",
          body: "Di dalam blok `except`, `raise` tanpa argumen melempar ulang exception yang sedang ditangani, dengan traceback aslinya utuh. Pola ini dipakai saat kode kamu tahu terjadi error, bisa mencatatnya, tapi tidak berhak memutuskan akibatnya; keputusan itu milik pemanggil.\n\nBandingkan dengan menelan error, misalnya blok except yang isinya hanya `pass`: pemanggil tidak pernah tahu ada kegagalan, dan data bisa rusak diam-diam. Bandingkan juga dengan melempar exception baru: itu mengganti jenis laporannya, berguna tapi beda tujuan, dan dibahas khusus di lesson berikutnya.\n\nPedoman singkatnya: tangani kalau kamu bisa memulihkan keadaan; catat lalu raise kalau tidak; jangan pernah menelan error tanpa alasan yang bisa kamu jelaskan.",
          code: {
            language: "python",
            content: "import json\n\ndef muat(teks):\n    try:\n        return json.loads(teks)\n    except json.JSONDecodeError:\n        print(\"parsing gagal, diteruskan ke pemanggil\")\n        raise\n\nmuat(\"{salah}\")\n# parsing gagal, diteruskan ke pemanggil\n# lalu traceback json.JSONDecodeError tetap muncul",
            caption: "raise tanpa argumen meneruskan exception yang sedang ditangani.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang dilakukan `raise` tanpa argumen di dalam blok except?",
          options: [
            "Melempar RuntimeError baru",
            "Melempar ulang exception yang sedang ditangani dengan traceback aslinya",
            "Menghentikan program tanpa traceback",
            "Tidak melakukan apa-apa",
          ],
          answer: 1,
          explanation: "Bare raise meneruskan exception yang sedang ditangani apa adanya, traceback aslinya tidak diubah.",
        },
        {
          kind: "quiz",
          question: "Kapan pola catat lalu raise paling tepat?",
          options: [
            "Saat kamu bisa memperbaiki keadaan dan melanjutkan",
            "Saat error perlu dicatat di lapisan ini, tapi keputusan akhirnya milik pemanggil",
            "Saat error sepele dan bisa diabaikan",
            "Saat ingin mengganti jenis exceptionnya",
          ],
          answer: 1,
          explanation: "Lapisan yang tidak bisa memulihkan keadaan sebaiknya mencatat kejadian lalu meneruskan exception, bukan menelannya atau memutuskan akibatnya sendiri.",
        },
      ],
    },
    {
      slug: "exception-chaining",
      title: "Exception Chaining",
      summary: "Sambungkan penyebab asli ke exception baru dengan raise ... from.",
      steps: [
        {
          kind: "theory",
          title: "Menyambung penyebab: raise ... from",
          body: "Saat blok except melempar exception baru, yang asli tidak hilang: Python menyimpannya sebagai konteks dan traceback mencatat keduanya. Ini chaining implisit, dan sering kali sudah cukup.\n\n`raise Baru(...) from asal` membuat rantai eksplisit: exception asal tersimpan di `__cause__` dan traceback menampilkannya sebagai penyebab langsung. Pilih bentuk ini kalau kamu sengaja menerjemahkan error teknis menjadi error yang bermakna bagi domain aplikasimu.\n\nSebaliknya, `from None` menekan penyebabnya sehingga traceback hanya menampilkan exception baru. Dipakai saat detail teknis membingungkan pengguna akhir atau berisiko membocorkan informasi. Di luar itu, jangan buang petunjuk debugging.",
          code: {
            language: "python",
            content: "def baca_usia(teks):\n    try:\n        return int(teks)\n    except ValueError as err:\n        raise RuntimeError(\"data usia rusak\") from err\n\nbaca_usia(\"dua\")\n# Traceback: RuntimeError: data usia rusak\n# dengan ValueError aslinya tampil sebagai penyebab langsung",
            caption: "from err menyambung penyebab secara eksplisit.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang diatur oleh `raise Baru(...) from asal`?",
          options: [
            "Menyatukan dua exception menjadi satu",
            "Menetapkan exception asal sebagai penyebab langsung (__cause__) dari exception baru",
            "Mencegah exception asal tercetak",
            "Mengubah jenis exception asal",
          ],
          answer: 1,
          explanation: "from menyimpan exception asal di __cause__ dan traceback mencetaknya sebagai direct cause dari exception baru.",
        },
        {
          kind: "quiz",
          question: "Kapan `raise X from None` layak dipakai?",
          options: [
            "Selalu, supaya traceback pendek",
            "Saat penyebab asalnya perlu disembunyikan dari pengguna akhir, misalnya karena membingungkan atau sensitif",
            "Saat exception asalnya ValueError",
            "Saat tidak ada blok try",
          ],
          answer: 1,
          explanation: "from None menekan penyebab asli. Hanya layak kalau detail teknisnya tidak menolong pembaca traceback, misalnya di batas antara kode dan pengguna akhir.",
        },
      ],
    },
    {
      slug: "custom-exception",
      title: "Custom Exception",
      summary: "Buat jenis error milik aplikasi dengan subclass Exception.",
      steps: [
        {
          kind: "theory",
          title: "Error yang berbicara bahasa domain",
          body: "Custom exception adalah class biasa yang mewarisi `Exception` atau subkelasnya. Isinya sering sesederhana `pass`, karena nilai utamanya ada pada namanya: `SaldoKurangError` menyampaikan maksud jauh lebih jelas daripada ValueError generik.\n\nDengan jenis sendiri, pemanggil bisa menangkap kegagalan aplikasimu secara selektif tanpa ikut menangkap error teknis tak terduga. Kalau error aplikasimu banyak, buat satu induk, misalnya `ErrorAplikasi(Exception)`, lalu turunkan semua error dari sana; `except ErrorAplikasi` nanti menangkap satu keluarga sekaligus.\n\nConstructor warisan dari Exception tetap bekerja: `SaldoKurangError('kurang 30')` menyimpan pesannya di `args` dan menampilkannya di traceback. Kalau pemanggil butuh data tambahan, tambahkan `__init__` sendiri dan simpan sebagai atribut.",
          code: {
            language: "python",
            content: "class SkorTidakWajar(Exception):\n    pass\n\ndef simpan_skor(skor):\n    if not 0 <= skor <= 100:\n        raise SkorTidakWajar(f\"skor {skor} di luar 0-100\")\n    return \"tersimpan\"\n\ntry:\n    simpan_skor(250)\nexcept SkorTidakWajar as e:\n    print(f\"ditolak: {e}\")\n# ditolak: skor 250 di luar 0-100",
            caption: "Nama kelasnya saja sudah setengah pesan error.",
          },
        },
        {
          kind: "quiz",
          question: "Kelas dasar yang wajib diwarisi untuk custom exception aplikasi adalah?",
          options: ["BaseException", "Exception", "ValueError", "object"],
          answer: 1,
          explanation: "Turunkan dari Exception atau subkelasnya. Mewarisi langsung dari BaseException membuat exception kamu tidak tertangkap except Exception, karena BaseException juga induk KeyboardInterrupt dan SystemExit.",
        },
        {
          kind: "code",
          title: "Kartu saldomu",
          prompt: "Lengkapi dua bagian kosong: kelas dasar untuk `SaldoKurangError`, dan baris yang melemparkannya saat penarikan melebihi saldo. Program membaca saldo lalu jumlah penarikan.",
          mode: "fill",
          template: "class SaldoKurangError(___):\n    pass\n\ndef tarik_saldo(saldo, jumlah):\n    if jumlah > saldo:\n        ___ SaldoKurangError(f\"kurang {jumlah - saldo}\")\n    return saldo - jumlah\n\ntry:\n    saldo = int(input())\n    jumlah = int(input())\n    print(tarik_saldo(saldo, jumlah))\nexcept SaldoKurangError as e:\n    print(f\"ditolak: {e}\")",
          solution: "class SaldoKurangError(Exception):\n    pass\n\ndef tarik_saldo(saldo, jumlah):\n    if jumlah > saldo:\n        raise SaldoKurangError(f\"kurang {jumlah - saldo}\")\n    return saldo - jumlah\n\ntry:\n    saldo = int(input())\n    jumlah = int(input())\n    print(tarik_saldo(saldo, jumlah))\nexcept SaldoKurangError as e:\n    print(f\"ditolak: {e}\")",
          tests: [
            { stdin: "100\n30", expectedOutput: "70" },
            { stdin: "50\n80", expectedOutput: "ditolak: kurang 30" },
            { stdin: "0\n0", expectedOutput: "0" },
          ],
          hints: [
            "Custom exception diturunkan dari kelas dasar Exception.",
            "Melempar exception di dalam if memakai kata kunci yang sama dengan lesson Melempar Exception.",
            "Jawabannya: class SaldoKurangError(Exception) dan raise SaldoKurangError(...)",
          ],
        },
      ],
    },
    {
      slug: "eafp-vs-lbyl",
      title: "EAFP vs LBYL",
      summary: "Pilih antara cek dulu (LBYL) dan coba lalu tangkap (EAFP), plus kenalan singkat dengan except*.",
      steps: [
        {
          kind: "theory",
          title: "Minta izin, atau minta maaf?",
          body: "LBYL (Look Before You Leap) mengecek syarat dulu sebelum beraksi: `if kunci in data: data[kunci]`. EAFP (Easier to Ask Forgiveness than Permission) langsung beraksi lalu menangkap kegagalan: `try: data[kunci] except KeyError:`. Keduanya sah, tapi budaya Python condong ke EAFP, sampai terkenal sebagai idiom.\n\nKeunggulan teknis EAFP muncul saat pengecekan dan aksi tidak atomik. Pola cek dulu lalu akses bisa gagal kalau data berubah di antara keduanya, misalnya di kode yang berjalan paralel. EAFP juga tidak bekerja dua kali: `if angka in daftar` memindai daftar, lalu `daftar[angka]` memindai lagi.\n\nSatu tambahan modern: sejak Python 3.11 ada ExceptionGroup dan `except*` untuk menangani beberapa exception sekaligus dari satu kejadian, misalnya dari tugas async yang berjalan paralel. Untuk kode sehari-hari, try dan except biasa tetap alat utamanya.",
          code: {
            language: "python",
            content: "nilai = {\"budi\": 80}\n\n# LBYL: cek dulu\nif \"ani\" in nilai:\n    print(nilai[\"ani\"])\nelse:\n    print(\"tidak ada\")\n\n# EAFP: coba dulu\ntry:\n    print(nilai[\"ani\"])\nexcept KeyError:\n    print(\"tidak ada\")",
            caption: "Dua jalur, hasil sama; pilihannya soal keterbacaan dan konteks.",
          },
        },
        {
          kind: "quiz",
          question: "Manakah pendekatan EAFP untuk membaca kunci dict yang mungkin tidak ada?",
          options: [
            "if kunci in data:\n    print(data[kunci])",
            "try:\n    print(data[kunci])\nexcept KeyError:\n    print('tidak ada')",
            "for k in data:\n    print(data[k])",
            "print(data.get(kunci))",
          ],
          answer: 1,
          explanation: "EAFP langsung mencoba aksinya lalu menangkap kegagalan spesifiknya. Pola if-in dulu adalah LBYL.",
        },
        {
          kind: "quiz",
          question: "`except*` di Python 3.11+ dirancang untuk menangani apa?",
          options: [
            "Semua exception tanpa menyebut jenisnya",
            "ExceptionGroup, yaitu kumpulan beberapa exception yang dilempar bersamaan",
            "Exception di dalam generator",
            "Warning, bukan exception",
          ],
          answer: 1,
          explanation: "except* menangani ExceptionGroup, yang muncul saat beberapa operasi paralel gagal sekaligus. Untuk exception tunggal, except biasa yang dipakai.",
        },
      ],
    },
    {
      slug: "latihan-gabungan-exception",
      title: "Latihan Gabungan: Validasi Input",
      summary: "Rakit custom exception, terjemahan error, else, dan finally jadi validator yang utuh.",
      steps: [
        {
          kind: "theory",
          title: "Menyusun validasi yang tahan banting",
          body: "Lesson penutup modul merakit hampir semuanya: exception khusus domain, konversi yang ditangkap, terjemahan error dengan `from`, lalu `else` dan `finally` untuk alurnya. Program praktiknya memvalidasi nilai ujian 0 sampai 100 dari satu baris input.\n\nAlurnya: teks dikonversi di try; kegagalan konversi diterjemahkan menjadi `NilaiTidakValid` dengan `from None` karena detail ValueError tidak menolong pengguna; rentang dicek setelahnya; hasil sah dilaporkan di else; finally mencatat pemeriksaan selesai di semua kasus.\n\nHasil akhirnya, kode validasi terbaca seperti kebijakan: apa yang dianggap sah, apa yang ditolak, dengan pesan yang persis. Itulah tujuan modul ini: error bukan peristiwa menakutkan, tapi bagian antarmuka programmu.",
          code: {
            language: "python",
            content: "class NilaiTidakValid(Exception):\n    pass\n\ndef validasi_nilai(teks):\n    try:\n        nilai = int(teks)\n    except ValueError:\n        raise NilaiTidakValid(f\"{teks} bukan angka\") from None\n    if not 0 <= nilai <= 100:\n        raise NilaiTidakValid(\"nilai di luar rentang 0-100\")\n    return nilai\n\nteks = input()\ntry:\n    hasil = validasi_nilai(teks)\nexcept NilaiTidakValid as e:\n    print(f\"ditolak: {e}\")\nelse:\n    print(f\"nilai sah: {hasil}\")\nfinally:\n    print(\"pemeriksaan selesai\")",
            caption: "Validasi utuh: terjemahan error, pemeriksaan rentang, laporan, dan penutup.",
          },
        },
        {
          kind: "code",
          title: "Perbaiki rentang yang lolos",
          prompt: "Program ini punya satu kesalahan: nilai di luar rentang 0 sampai 100 ikut diterima. Temukan dan perbaiki, lalu pastikan ketiga kasus uji lolos: nilai sah, bukan angka, dan di luar rentang.",
          mode: "fix",
          template: "class NilaiTidakValid(Exception):\n    pass\n\ndef validasi_nilai(teks):\n    try:\n        nilai = int(teks)\n    except ValueError:\n        raise NilaiTidakValid(f\"{teks} bukan angka\") from None\n    if nilai < 0 and nilai > 100:\n        raise NilaiTidakValid(\"nilai di luar rentang 0-100\")\n    return nilai\n\nteks = input()\ntry:\n    hasil = validasi_nilai(teks)\nexcept NilaiTidakValid as e:\n    print(f\"ditolak: {e}\")\nelse:\n    print(f\"nilai sah: {hasil}\")\nfinally:\n    print(\"pemeriksaan selesai\")",
          solution: "class NilaiTidakValid(Exception):\n    pass\n\ndef validasi_nilai(teks):\n    try:\n        nilai = int(teks)\n    except ValueError:\n        raise NilaiTidakValid(f\"{teks} bukan angka\") from None\n    if nilai < 0 or nilai > 100:\n        raise NilaiTidakValid(\"nilai di luar rentang 0-100\")\n    return nilai\n\nteks = input()\ntry:\n    hasil = validasi_nilai(teks)\nexcept NilaiTidakValid as e:\n    print(f\"ditolak: {e}\")\nelse:\n    print(f\"nilai sah: {hasil}\")\nfinally:\n    print(\"pemeriksaan selesai\")",
          tests: [
            { stdin: "85", expectedOutput: "nilai sah: 85\npemeriksaan selesai" },
            { stdin: "abc", expectedOutput: "ditolak: abc bukan angka\npemeriksaan selesai" },
            { stdin: "150", expectedOutput: "ditolak: nilai di luar rentang 0-100\npemeriksaan selesai" },
          ],
          hints: [
            "Nilai 150 seharusnya ditolak, tapi program mencetak nilai sah. Berarti kondisi penolakannya tidak pernah benar.",
            "Tidak ada angka yang sekaligus kurang dari 0 dan lebih dari 100. Pikirkan operator logikanya.",
            "Ganti and menjadi or: if nilai < 0 or nilai > 100:",
          ],
        },
      ],
    },
  ],
};
