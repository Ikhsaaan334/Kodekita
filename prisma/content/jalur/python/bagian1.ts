import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "python",
  moduleRange: [0, 1],
  modules: [
    {
      title: "Python yang Idiomatik",
      description: "Multiple assignment, walrus operator, f-string lanjut, None, truthiness, dan konvensi penamaan PEP 8.",
    },
    {
      title: "Koleksi Inti",
      description: "Comprehension, slicing lanjut, tuple, set, dict bercabang, dan kapan memakai struktur mana.",
    },
  ],
  lessons: [
    // ==================== MODUL 0: Python yang Idiomatik ====================
    {
      slug: "multiple-assignment-dan-swap",
      title: "Multiple Assignment dan Swap",
      summary: "Isi banyak variabel sekaligus dan tukar nilainya tanpa variabel bantu.",
      steps: [
        {
          kind: "theory",
          title: "Banyak variabel, satu baris",
          body: "Di fondasi kamu mengisi variabel satu per satu. Python membolehkan beberapa penugasan dalam satu baris: `a, b = 3, 8`. Sisi kanan dikumpulkan menjadi sebuah tuple, lalu dibongkar ke nama-nama di kiri. Inilah alasan trik pertukaran nilai berfungsi: `a, b = b, a`. Semua di sisi kanan dievaluasi dulu sebelum ada nilai yang ditimpa, jadi tidak perlu variabel bantu seperti di bahasa lain.\n\nAda juga penugasan berantai: `x = y = 0` memberi dua nama nilai yang sama. Untuk angka dan string ini aman. Tapi hati-hati dengan list: `a = b = []` membuat dua nama menunjuk satu list yang sama, sehingga `a.append(1)` juga mengubah `b`. Kalau memang butuh list terpisah, tulis dua baris penugasan.\n\nLatihan di bawah meminta kamu memutar tiga nilai sekaligus. Tulis dulu urutan sisi kanannya di kepala (atau di kertas), baru ketik. Setelah terbiasa, pola ini terasa jauh lebih ringkas daripada memakai variabel sementara.",
          code: {
            language: "python",
            content: "a, b = 3, 8\na, b = b, a\nprint(a, b)  # 8 3\n\nx = y = 0\nx = x + 5\nprint(x, y)  # 5 0",
            caption: "Sisi kanan dievaluasi dulu, baru ditugaskan ke kiri.",
          },
        },
        {
          kind: "quiz",
          question: "Apa keluaran dari kode berikut?\n\n```python\na, b = 1, 2\na, b = b, a\nprint(a, b)\n```",
          options: ["1 2", "2 1", "2 2", "Error"],
          answer: 1,
          explanation: "Sisi kanan (b, a) dievaluasi dulu menjadi (2, 1), baru ditugaskan ke a dan b. Jadi nilainya benar-benar tertukar.",
        },
        {
          kind: "code",
          title: "Putar tiga nilai dalam satu baris",
          prompt: "Lengkapi baris penugasan di bawah supaya ketiga nilai berputar: nilai a pindah ke b, nilai b pindah ke c, dan nilai c pindah ke a. Semuanya dalam satu baris, tanpa variabel bantu.",
          mode: "fill",
          template: "a = int(input())\nb = int(input())\nc = int(input())\n# putar posisi: nilai a pindah ke b, nilai b pindah ke c, nilai c pindah ke a\na, b, c = ___\nprint(f\"{a} {b} {c}\")",
          solution: "a = int(input())\nb = int(input())\nc = int(input())\n# putar posisi: nilai a pindah ke b, nilai b pindah ke c, nilai c pindah ke a\na, b, c = c, a, b\nprint(f\"{a} {b} {c}\")",
          tests: [
            { stdin: "1\n2\n3", expectedOutput: "3 1 2" },
            { stdin: "10\n20\n30", expectedOutput: "30 10 20" },
            { stdin: "7\n-2\n0", expectedOutput: "0 7 -2", hidden: true },
          ],
          hints: [
            "Semua nilai di sisi kanan dibaca dulu sebelum penugasan, jadi tidak ada yang tertimpa di tengah jalan.",
            "Sisi kanan hanya berisi tiga variabel lama, urutannya yang menentukan hasilnya.",
            "Jawabannya: c, a, b",
          ],
        },
      ],
    },
    {
      slug: "f-string-format-angka",
      title: "f-string untuk Format Angka",
      summary: "Atur desimal, pemisah ribuan, persen, dan lebar kolom langsung di dalam f-string.",
      steps: [
        {
          kind: "theory",
          title: "Format spec: mengatur tampilan angka",
          body: "f-string tidak hanya menyisipkan nilai. Setelah nama variabel di dalam kurung kurawal, kamu boleh menambah titik dua dan sebuah format spec: aturan singkat tentang bagaimana nilai itu ditampilkan. Spec `:.2f` membulatkan ke dua angka di belakang koma desimal, `:,` menyisipkan pemisah ribuan, dan `:.1%` menampilkan angka sebagai persen.\n\nSpec juga mengatur lebar dan perataan, berguna saat mencetak kolom agar tetap rata: `:>8` berarti rata kanan dalam lebar delapan karakter. Untuk tanggal, objek `datetime` punya kode format sendiri yang bisa dipakai langsung di f-string, misalnya `f\"{hari:%d/%m/%Y}\"`. Materi tanggal dibahas lebih dalam di modul Stdlib nanti.\n\nKebiasaan yang baik: biarkan data tetap mentah di variabel, dan atur tampilannya hanya di titik cetak. Nilai dan tampilan itu dua hal berbeda; `1,234,567.89` adalah tampilan, `1234567.89` adalah nilainya.",
          code: {
            language: "python",
            content: "total = 1234567.891\nprint(f\"{total:.2f}\")    # 1234567.89\nprint(f\"{total:,.2f}\")   # 1,234,567.89\nprint(f\"{0.856:.1%}\")    # 85.6%\nprint(f\"[{7:>6}]\")       # [     7]",
            caption: "Format spec ditulis setelah titik dua di dalam kurung kurawal.",
          },
        },
        {
          kind: "quiz",
          question: 'Apa keluaran dari `print(f"{3.14159:.2f}")`?',
          options: ["3.14", "3.1", "3.142", "3,14"],
          answer: 0,
          explanation: "Format spec `:.2f` membulatkan ke dua angka di belakang koma desimal, jadi 3.14159 tampil sebagai 3.14.",
        },
        {
          kind: "code",
          title: "Cetak harga dengan pemisah ribuan",
          prompt: "Lengkapi format spec di dalam kurung kurawal supaya angka dicetak dengan pemisah ribuan koma dan tepat dua angka desimal di belakang koma.",
          mode: "fill",
          template: "angka = float(input())\nprint(f\"{angka:___}\")",
          solution: "angka = float(input())\nprint(f\"{angka:,.2f}\")",
          tests: [
            { stdin: "1234567.891", expectedOutput: "1,234,567.89" },
            { stdin: "5000", expectedOutput: "5,000.00" },
            { stdin: "-98765.4", expectedOutput: "-98,765.40", hidden: true },
          ],
          hints: [
            "Format spec ditulis setelah tanda titik dua di dalam kurung kurawal.",
            "Pemisah ribuan diwakili satu koma, lalu dua desimal dengan .2f.",
            "Urutannya koma dulu untuk ribuan, lalu .2f untuk dua desimal, jadi ,.2f",
          ],
        },
      ],
    },
    {
      slug: "chained-comparison",
      title: "Chained Comparison",
      summary: "Tulis rentang seperti di matematika: satu ekspresi, dua pembanding.",
      steps: [
        {
          kind: "theory",
          title: "Perbandingan berantai",
          body: "Python membaca `0 <= x <= 100` persis seperti di matematika: x harus berada di antara 0 dan 100. Ekspresi ini setara dengan `0 <= x and x <= 100`, tapi ada dua kelebihannya: lebih pendek, dan `x` hanya dievaluasi satu kali. Kalau `x` adalah hasil pemanggilan fungsi, beda ini terasa.\n\nRantai boleh memakai operator apa pun yang biasa kamu pakai: `<`, `<=`, `==`, `in`, bahkan campuran seperti `0 <= indeks < len(data)`. Satu mekanisme penting di baliknya: rantai berhenti begitu ada satu bandingan yang salah, dan sisa bandingan tidak dieksekusi.\n\nDua hal yang perlu dijaga. Pertama, jangan meniru gaya bahasa lain: di C atau JavaScript, `0 <= x < 100` tidak bekerja seperti ini, jadi kebiasaan menulis `x > 0 and x < 100` sering terbawa padahal tidak perlu. Kedua, bedakan dengan `and` biasa: `a < b and c` bukan perbandingan berantai, itu hasil `a < b` yang digabung dengan truthiness dari `c`.",
          code: {
            language: "python",
            content: "umur = 19\nprint(13 <= umur <= 17)  # False\nprint(17 <= umur <= 25)  # True\n\nskor = 74\nif 70 <= skor < 80:\n    print(\"nilai B\")",
            caption: "Rentang ditulis sekali jalan, tanpa and yang berulang.",
          },
        },
        {
          kind: "quiz",
          question: "Apa nilai dari ekspresi `1 < 5 < 10`?",
          options: ["True", "False", "Error", "5"],
          answer: 0,
          explanation: "Rantainya setara dengan `1 < 5 and 5 < 10`. Keduanya benar, jadi hasilnya True.",
        },
        {
          kind: "quiz",
          question: "Ekspresi `a < b <= c` setara dengan?",
          options: ["a < b and b <= c", "a < b or b <= c", "a < b and c <= b", "(a < b) <= c"],
          answer: 0,
          explanation: "Nilai tengah b dipakai di kedua pembanding, jadi padanannya adalah `a < b and b <= c`. Pernyataan `or` salah karena rantai menuntut semua bandingan benar.",
        },
      ],
    },
    {
      slug: "ternary-expression",
      title: "Ekspresi Ternary",
      summary: "Pilih satu dari dua nilai dalam satu baris dengan conditional expression.",
      steps: [
        {
          kind: "theory",
          title: "Conditional expression",
          body: "Python punya versi satu baris untuk memilih antara dua nilai: `nilai_benar if kondisi else nilai_salah`. Bacaannya mengalir: pertama nilai saat kondisi benar, lalu kata if, kondisinya, else, dan nilai saat kondisi salah. Perhatikan urutannya kebalikan dari bahasa seperti C atau JavaScript yang menulis kondisi lebih dulu.\n\nYang membuat bentuk ini berbeda dari if/else biasa: ia adalah ekspresi, artinya punya nilai dan bisa dipakai di dalam hal lain. Cocok untuk `return`, argumen fungsi, atau di dalam f-string. Kalau isinya butuh beberapa langkah, kembali ke if/else biasa; satu baris yang sesak justru sulit dibaca.\n\nAturan praktisnya: pakai ternary saat kedua cabang hanya memilih nilai. Begitu salah satu cabang mulai bekerja (mengubah variabel, memanggil fungsi yang efeknya penting), tulis pernyataan if biasa.",
          code: {
            language: "python",
            content: "stok = 0\nstatus = \"habis\" if stok == 0 else \"tersedia\"\nprint(status)  # habis\n\nprint(f\"{stok} unit {'(kosong)' if stok == 0 else '(ada)'}\")",
            caption: "Ternary memilih nilai, bukan menjalankan cabang kerja.",
          },
        },
        {
          kind: "quiz",
          question: "Apa keluaran dari kode berikut?\n\n```python\nskor = 40\nstatus = \"lulus\" if skor >= 60 else \"belum lulus\"\nprint(status)\n```",
          options: ["lulus", "belum lulus", "40", "Error"],
          answer: 1,
          explanation: "Kondisi skor >= 60 salah untuk 40, jadi ternary memilih nilai di sebelah kanan else, yaitu belum lulus.",
        },
        {
          kind: "code",
          title: "Cetak status genap atau ganjil dengan ternary",
          prompt: "Lengkapi dua bagian di dalam f-string supaya program mencetak genap atau ganjil sesuai nilai n. Ganti kedua tanda ___ dengan kata yang tepat.",
          mode: "fill",
          template: "n = int(input())\nprint(f\"{n} adalah bilangan {'___' if n % 2 == 0 else '___'}\")",
          solution: "n = int(input())\nprint(f\"{n} adalah bilangan {'genap' if n % 2 == 0 else 'ganjil'}\")",
          tests: [
            { stdin: "4", expectedOutput: "4 adalah bilangan genap" },
            { stdin: "7", expectedOutput: "7 adalah bilangan ganjil" },
            { stdin: "0", expectedOutput: "0 adalah bilangan genap", hidden: true },
          ],
          hints: [
            "Pola ternary Python: nilai_jika_benar if kondisi else nilai_jika_salah.",
            "Kata yang dicetak saat kondisi benar ditulis sebelum if, sisanya setelah else.",
            "Isi genap di bagian pertama dan ganjil di bagian kedua.",
          ],
        },
      ],
    },
    {
      slug: "truthiness",
      title: "Truthiness",
      summary: "Pahami nilai mana yang dianggap False dan idiom if daftar: yang lazim di Python.",
      steps: [
        {
          kind: "theory",
          title: "Nilai apa pun bisa jadi kondisi",
          body: 'Di if dan while, Python tidak menuntut kondisi berupa True atau False. Setiap nilai dikonversi dulu ke boolean: yang dianggap False disebut falsy, sisanya truthy. Yang falsy hanya sedikit dan patut diingat: `0`, `0.0`, string kosong `""`, list/dict/set/tuple kosong, dan `None`.\n\nKonsekuensi yang sering mengejutkan: string `"0"` dan list `[0]` itu truthy karena isinya tidak kosong, dan angka `-1` juga truthy. Jadi `if pesan:` memeriksa apakah pesan ada isinya, bukan apakah pesannya "benar" dalam arti sehari-hari.\n\nIdiom `if daftar:` lebih ringkas daripada `if len(daftar) > 0` dan lazim di kode Python nyata. Tapi ada batasnya: truthiness tidak bisa membedakan `0` dari `None`, atau `""` dari `None`. Untuk itu ada `is None` yang dibahas di lesson berikutnya. Dan jangan pernah menulis `if x == True`; cukup `if x`.',
          code: {
            language: "python",
            content: 'nama = ""\nif not nama:\n    print("nama belum diisi")\n\nkeranjang = ["buku"]\nif keranjang:\n    print(f"ada {len(keranjang)} item")',
            caption: "String dan list kosong dianggap False.",
          },
        },
        {
          kind: "quiz",
          question: "Manakah yang bernilai falsy (dianggap False)?",
          options: ['"0" (string berisi satu karakter nol)', "0 (angka nol)", "[0] (list berisi angka nol)", "-1 (angka minus satu)"],
          answer: 1,
          explanation: 'Angka nol adalah falsy. String "0" dan list [0] berisi sesuatu sehingga truthy, dan -1 adalah angka bukan nol.',
        },
        {
          kind: "quiz",
          question: 'Apa keluaran kode ini?\n\n```python\nitems = []\nif items:\n    print("ada")\nelse:\n    print("kosong")\n```',
          options: ["ada", "kosong", "Error", "Tidak mencetak apa pun"],
          answer: 1,
          explanation: "List kosong dianggap falsy, jadi blok if dilewati dan else yang berjalan.",
        },
      ],
    },
    {
      slug: "none-dan-is-none",
      title: "None dan is None",
      summary: "Gunakan None sebagai penanda tidak ada, dan cek dengan is, bukan ==.",
      steps: [
        {
          kind: "theory",
          title: "None: penanda tidak ada",
          body: "`None` adalah satu-satunya nilai bertipe `NoneType`, dan maknanya tunggal: tidak ada nilai. Fungsi yang selesai tanpa `return` sebenarnya mengembalikan `None`, begitu juga fungsi pencarian yang tidak menemukan apa pun. Itu bukan error, itu kontrak: tidak ketemu.\n\nUntuk membandingkan dengan None, pakai `is None` dan `is not None`, bukan `==`. `is` memeriksa identitas: apakah dua nama menunjuk objek yang sama. Karena Python hanya punya satu objek None, cek ini selalu akurat. `== None` mungkin berjalan untuk kasus sederhana, tapi rapuh pada objek yang mendefinisikan `__eq__` sendiri, dan bukan kebiasaan penulis Python.\n\nNone itu falsy, tapi jangan gunakan truthiness untuk mendeteksinya. `if nilai:` tidak bisa membedakan None dari 0 atau string kosong. Pola yang sering muncul: fungsi mengembalikan None saat tidak ketemu, dan pemanggil mengecek `if hasil is None:` sebelum memakai hasilnya.",
          code: {
            language: "python",
            content: 'def indeks_kata(daftar, kata):\n    if kata in daftar:\n        return daftar.index(kata)\n    return None\n\nhasil = indeks_kata(["a", "b", "c"], "z")\nif hasil is None:\n    print("tidak ketemu")',
            caption: "None menyatakan hasil kosong tanpa menabrak nilai sah seperti 0.",
          },
        },
        {
          kind: "code",
          title: "Perbaiki fungsi pencarian stok",
          prompt: "Program ini seharusnya mencetak `barang tidak terdaftar` ketika barang tidak ada di dict. Coba jalankan dengan input penghapus untuk melihat masalahnya, lalu temukan satu kesalahan di fungsi cari_stok dan perbaiki.",
          mode: "fix",
          template: 'def cari_stok(stok, barang):\n    if barang in stok:\n        return stok[barang]\n    return 0\n\nstok = {"buku": 5, "pensil": 12}\nbarang = input()\njumlah = cari_stok(stok, barang)\nif jumlah is None:\n    print("barang tidak terdaftar")\nelse:\n    print(f"stok {barang}: {jumlah}")',
          solution: 'def cari_stok(stok, barang):\n    if barang in stok:\n        return stok[barang]\n    return None\n\nstok = {"buku": 5, "pensil": 12}\nbarang = input()\njumlah = cari_stok(stok, barang)\nif jumlah is None:\n    print("barang tidak terdaftar")\nelse:\n    print(f"stok {barang}: {jumlah}")',
          tests: [
            { stdin: "buku", expectedOutput: "stok buku: 5" },
            { stdin: "penghapus", expectedOutput: "barang tidak terdaftar" },
            { stdin: "pensil", expectedOutput: "stok pensil: 12", hidden: true },
          ],
          hints: [
            "Jalankan dengan input penghapus dan bandingkan hasilnya dengan maksud program.",
            "Penanda untuk barang yang tidak ada harus None, karena bagian bawah mengecek `jumlah is None`.",
            "Ganti return 0 di akhir fungsi menjadi return None. Angka nol bertabrakan dengan stok yang memang bernilai nol.",
          ],
        },
      ],
    },
    {
      slug: "unpacking-dengan-bintang",
      title: "Unpacking dengan Bintang",
      summary: "Bongkar urutan ke beberapa nama sekaligus, termasuk menyisakan sisanya dengan tanda bintang.",
      steps: [
        {
          kind: "theory",
          title: "Unpacking: bongkar urutan ke nama",
          body: "Unpacking adalah kebalikan packing: satu urutan dibongkar ke beberapa nama sekaligus. `tanggal, bulan, tahun = [1, 5, 2026]` bekerja pada list, tuple, string, bahkan `range`. Syaratnya satu: jumlah nama harus pas dengan jumlah nilai, kalau tidak Python melempar ValueError.\n\nSering kali kamu hanya butuh sebagian. Tambahkan satu tanda bintang pada salah satu nama: `pertama, *tengah, terakhir = data`. Nama berbintang menampung sisa nilai sebagai list, dan boleh berisi kosong. Posisinya bebas, tapi hanya satu nama yang boleh berbintang.\n\nNama yang nilainya tidak dipakai lazim diganti garis bawah: `_, *sisa = baris.split()` artinya ambil kata pertama, sisanya simpan. Di dalam for, unpacking juga bekerja: `for nama, nilai in pasangan:` membongkar tiap pasangan otomatis. Kebiasaan ini yang membuat loop Python terasa ringkas.",
          code: {
            language: "python",
            content: 'tanggal, bulan, tahun = [1, 5, 2026]\nprint(f"{tanggal}/{bulan}/{tahun}")  # 1/5/2026\n\npertama, *tengah, terakhir = "abcdef"\nprint(pertama, tengah, terakhir)  # a [\'b\', \'c\', \'d\', \'e\'] f',
            caption: "Satu nama berbintang menampung sisa nilai sebagai list.",
          },
        },
        {
          kind: "quiz",
          question: "Apa isi variabel `sisa` setelah baris ini?\n\n```python\na, *sisa = [10, 20, 30]\n```",
          options: ["10", "[20, 30]", "[10, 20, 30]", "Error, terlalu banyak nilai"],
          answer: 1,
          explanation: "a menerima nilai pertama, dan sisa (berbintang) menampung sisanya sebagai list: [20, 30].",
        },
        {
          kind: "code",
          title: "Pisahkan perintah dan argumennya",
          prompt: "Lengkapi baris kedua supaya kata pertama masuk ke perintah dan seluruh sisanya masuk ke argumen sebagai list, berapa pun jumlah katanya.",
          mode: "fill",
          template: 'baris = input().split()\n___, ___ = baris\nprint(f"perintah: {perintah}")\nprint(f"argumen: {argumen}")',
          solution: 'baris = input().split()\nperintah, *argumen = baris\nprint(f"perintah: {perintah}")\nprint(f"argumen: {argumen}")',
          tests: [
            { stdin: "gambar kotak 10 20", expectedOutput: "perintah: gambar\nargumen: ['kotak', '10', '20']" },
            { stdin: "keluar", expectedOutput: "perintah: keluar\nargumen: []" },
            { stdin: "buka berkas data.txt", expectedOutput: "perintah: buka\nargumen: ['berkas', 'data.txt']", hidden: true },
          ],
          hints: [
            "Dua nama di kiri harus menerima semua nilai dari baris, walaupun jumlahnya berbeda-beda.",
            "Nama bertanda bintang menampung sisa nilai sebagai list, dan boleh berisi kosong.",
            "Jawabannya: perintah, *argumen",
          ],
        },
      ],
    },
    {
      slug: "walrus-operator",
      title: "Walrus Operator",
      summary: "Beri nilai ke variabel di dalam kondisi dengan := supaya tidak menghitung dua kali.",
      steps: [
        {
          kind: "theory",
          title: "Walrus: assign sambil mengecek",
          body: "Sejak Python 3.8 ada penugasan di dalam ekspresi, ditulis dengan `:=` dan dijuluki walrus karena bentuk tandanya. `if (n := len(data)) > 10:` memberi nilai ke n sekaligus memakainya sebagai kondisi. Tanpa ini, kamu harus menghitung len di baris terpisah, atau memanggilnya dua kali.\n\nTempat paling alami untuk walrus adalah kondisi while yang membaca input: `while (baris := input()) != \"selesai\":`. Tanpa walrus, loop ini ditulis dengan membaca satu kali sebelum loop lalu membaca lagi di akhir badan loop, pola yang gampang salah salin.\n\nGunakan secukupnya. Walrus menghemat satu baris, tapi kalau dipakai di dalam ekspresi yang sudah rumit, keterbacaannya turun. Aturan praktis: walrus untuk nilai yang memang dibutuhkan di kondisi dan di badan blok, bukan pengganti `=` biasa.",
          code: {
            language: "python",
            content: 'data = [3, 1, 4, 1, 5, 9, 2, 6]\nif (n := len(data)) > 5:\n    print(f"list panjang: {n} elemen")\n\n# n masih bisa dipakai setelahnya\nprint(n)',
            caption: ":= memberi nilai ke n di dalam kondisi if.",
          },
        },
        {
          kind: "code",
          title: "Hitung baris sampai kata selesai",
          prompt: "Lengkapi kondisi while supaya loop terus membaca baris sampai baris berisi selesai, lalu program mencetak berapa baris yang dibaca sebelum kata itu.",
          mode: "fill",
          template: 'jumlah = 0\nwhile (baris := input()) ___ "selesai":\n    jumlah += 1\nprint(jumlah)',
          solution: 'jumlah = 0\nwhile (baris := input()) != "selesai":\n    jumlah += 1\nprint(jumlah)',
          tests: [
            { stdin: "a\nb\nc\nselesai", expectedOutput: "3" },
            { stdin: "selesai", expectedOutput: "0" },
            { stdin: "x\nselesai", expectedOutput: "1", hidden: true },
          ],
          hints: [
            "Perulangan harus lanjut selama baris bukan kata selesai.",
            "Operator tidak sama dengan terdiri dari dua karakter: seru dan sama dengan.",
            "Isi blank dengan !=",
          ],
        },
      ],
    },
    {
      slug: "konvensi-nama-pep8",
      title: "Konvensi Penamaan PEP 8",
      summary: "Ikuti kesepakatan penamaan Python: snake_case, PascalCase, dan UPPER_CASE untuk peran yang tepat.",
      steps: [
        {
          kind: "theory",
          title: "PEP 8: kesepakatan penulisan kode",
          body: "PEP 8 adalah panduan gaya resmi Python. Isinya bukan aturan sintaks, melainkan kesepakatan: nama apa ditulis seperti apa, berapa spasi indentasi, kapan baris sebaiknya dipotong. Alasannya sederhana: kode dibaca jauh lebih sering daripada ditulis, dan gaya yang seragam membuat pembaca fokus pada logika, bukan pada format.\n\nBagian yang paling sering kamu pakai adalah penamaan. Variabel, fungsi, dan modul ditulis snake_case (`harga_total`, `cari_stok`). Class ditulis PascalCase (`KeranjangBelanja`). Konstanta di tingkat modul ditulis UPPER_CASE (`BATAS_KREDIT`). Hindari juga karakter yang susah dibedakan mata, seperti `l`, `I`, dan `O` sebagai nama variabel.\n\nNama yang baik menjelaskan dirinya: `sisa_stok` menceritakan isinya, `ss` tidak. Banyak tim menulis nama dalam bahasa Inggris; yang penting konsisten dari ujung ke ujung proyek. Untuk memaksa konsistensi ini, proyek nyata memasang pemeriksa gaya otomatis, dan kamu akan menyentuh alat semacam itu di modul Kode Rapi dan Teruji.",
          code: {
            language: "python",
            content: "harga_total = 150000  # variabel: snake_case\n\ndef hitung_diskon(harga, persen):\n    return harga * persen / 100\n\nclass KeranjangBelanja:  # class: PascalCase\n    pass\n\nBATAS_KREDIT = 5000000  # konstanta modul: UPPER_CASE",
            caption: "Tiga gaya penamaan untuk tiga peran berbeda.",
          },
        },
        {
          kind: "quiz",
          question: "Menurut PEP 8, nama class yang tepat adalah?",
          options: ["kelas_siswa", "KelasSiswa", "kelasSiswa", "KELAS_SISWA"],
          answer: 1,
          explanation: "Class memakai PascalCase (setiap kata diawali huruf besar). snake_case untuk variabel dan fungsi, UPPER_CASE untuk konstanta.",
        },
        {
          kind: "quiz",
          question: "Sebuah nilai pajak yang tidak berubah disimpan di tingkat modul. Menurut PEP 8, namanya sebaiknya?",
          options: ["pajak", "Pajak", "PAJAK", "pAjAk"],
          answer: 2,
          explanation: "Konstanta di tingkat modul ditulis UPPER_CASE dengan garis bawah antar kata, misalnya PAJAK_DASAR. Bentuk itu menandai nilainya tidak boleh diubah.",
        },
      ],
    },
    {
      slug: "underscore-dan-privasi",
      title: "Underscore dan Privasi",
      summary: "Baca sinyal garis bawah: nama internal, variabel buangan, dan name mangling.",
      steps: [
        {
          kind: "theory",
          title: "Sinyal di balik garis bawah",
          body: "Garis bawah membawa pesan. Atribut atau fungsi berawalan satu garis bawah, seperti `_log`, adalah sinyal ke rekan satu tim: ini internal, jangan diandalkan dari luar modul atau class. Python tidak memblokir aksesnya, konvensi ini murni kesepakatan. Efek nyatanya satu: `from modul import *` tidak membawa nama berawalan garis bawah.\n\nGaris bawah tunggal tanpa awalan juga dipakai sebagai nama buangan: `for _ in range(3)` artinya loop tiga kali dan abaikan pencacahnya. Ada pula garis bawah di belakang (`class_`, `id_`) untuk menghindari tabrakan dengan kata kunci atau nama bawaan yang sudah dipakai.\n\nDi dalam class, atribut berawalan dua garis bawah seperti `__pin` diubah namanya otomatis menjadi `_NamaClass__pin`. Ini disebut name mangling, dan tujuannya menghindari bentrok nama pada pewarisan, bukan keamanan sungguhan. Terakhir, nama berformat `__dunder__` (dua garis bawah di depan dan di belakang) adalah milik Python; jangan menciptakan nama seperti itu sendiri.",
          code: {
            language: "python",
            content: 'class Rekening:\n    def __init__(self):\n        self.saldo = 0       # publik\n        self._log = []       # konvensi: internal\n        self.__pin = "1234"  # di-mangling: _Rekening__pin\n\nr = Rekening()\nfor _ in range(2):\n    r.saldo += 5000\nprint(r.saldo)  # 10000',
            caption: "Garis bawah adalah sinyal niat, bukan pagar akses.",
          },
        },
        {
          kind: "quiz",
          question: "Apa makna `for _ in range(3):`?",
          options: [
            "Loop tiga kali dan nilai pencacahnya tidak dipakai",
            "Perulangan tanpa henti",
            "Error karena _ bukan nama variabel yang sah",
            "Mencetak angka 0 sampai 2",
          ],
          answer: 0,
          explanation: "Garis bawah dipakai sebagai nama buangan: loop tetap berjalan tiga kali, tapi pembaca kode tahu nilai pencacahnya tidak digunakan di dalam blok.",
        },
        {
          kind: "quiz",
          question: "Atribut `self.__rahasia` di dalam class Simpanan akan di-mangling menjadi nama apa?",
          options: ["__rahasia", "_Simpanan__rahasia", "rahasia", "__Simpanan__rahasia"],
          answer: 1,
          explanation: "Name mangling menambahkan satu garis bawah dan nama class di depan: _Simpanan__rahasia. Tujuannya mencegah bentrok nama saat pewarisan, bukan menyembunyikan data.",
        },
      ],
    },
    // ==================== MODUL 1: Koleksi Inti ====================
    {
      slug: "tuple-dan-unpacking",
      title: "Tuple",
      summary: "Koleksi urut yang tidak bisa diubah, pas untuk data berstruktur tetap seperti koordinat dan RGB.",
      steps: [
        {
          kind: "theory",
          title: "Tuple: urutan yang dikunci",
          body: "Tuple adalah urutan seperti list, bedanya isinya tidak bisa diubah setelah dibuat. Membuatnya cukup dengan koma: `rgb = 255, 128, 0`, kurung hanyalah pemanis. Satu jebakan klasik: tuple berisi satu elemen wajib ada komanya, `(42,)`. Tanpa koma, `(42)` hanyalah angka di dalam kurung.\n\nKenapa perlu yang immutable? Karena bentuknya yang menjadi janji: koordinat titik selalu dua angka, warna RGB selalu tiga. Tuple juga hashable, sehingga bisa jadi kunci dict dan anggota set, sesuatu yang tidak bisa dilakukan list. Dua pemakaian yang sangat umum: fungsi mengembalikan beberapa nilai sekaligus (otomatis terkemas jadi tuple), dan menukar nilai dengan `a, b = b, a` yang sudah kamu pakai di modul sebelumnya.\n\nAturan memilihnya sederhana: kalau isinya akan berubah, pakai list. Kalau struktur nilainya tetap dan kamu ingin itu tercermin di kode, pakai tuple. Setiap kali pembaca melihat tuple, ia tahu isinya tidak akan disusupi.",
          code: {
            language: "python",
            content: "rgb = (255, 128, 0)\nr, g, b = rgb\nprint(r, g, b)  # 255 128 0\n\nsatu = (42,)\nbukan_tuple = (42)\nprint(type(satu).__name__, type(bukan_tuple).__name__)  # tuple int",
            caption: "Koma yang membuat tuple, bukan kurungnya.",
          },
        },
        {
          kind: "quiz",
          question: "Bagaimana cara membuat tuple berisi satu elemen angka 7?",
          options: ["(7)", "(7,)", "tuple(7)", "[7]"],
          answer: 1,
          explanation: "Tanpa koma, (7) hanyalah ekspresi angka 7 di dalam kurung. Komalah yang menandai tuple.",
        },
        {
          kind: "code",
          title: "Kembalikan dua nilai dari satu fungsi",
          prompt: "Lengkapi return di fungsi supaya mengembalikan tuple berisi luas dan keliling persegi panjang, dalam urutan itu.",
          mode: "fill",
          template: 'def ukuran_persegi_panjang(p, l):\n    return ___\n\np = int(input())\nl = int(input())\nluas, keliling = ukuran_persegi_panjang(p, l)\nprint(f"luas: {luas}")\nprint(f"keliling: {keliling}")',
          solution: 'def ukuran_persegi_panjang(p, l):\n    return (p * l, 2 * (p + l))\n\np = int(input())\nl = int(input())\nluas, keliling = ukuran_persegi_panjang(p, l)\nprint(f"luas: {luas}")\nprint(f"keliling: {keliling}")',
          tests: [
            { stdin: "4\n3", expectedOutput: "luas: 12\nkeliling: 14" },
            { stdin: "5\n5", expectedOutput: "luas: 25\nkeliling: 20" },
            { stdin: "10\n2", expectedOutput: "luas: 20\nkeliling: 24", hidden: true },
          ],
          hints: [
            "Fungsi boleh mengembalikan dua nilai sekaligus kalau keduanya dibungkus menjadi satu tuple.",
            "Luasnya p * l dan kelilingnya 2 * (p + l); pisahkan keduanya dengan koma di dalam kurung.",
            "Jawabannya: (p * l, 2 * (p + l))",
          ],
        },
      ],
    },
    {
      slug: "list-comprehension",
      title: "List Comprehension",
      summary: "Bangun dan saring list dalam satu baris yang terbaca seperti kalimat.",
      steps: [
        {
          kind: "theory",
          title: "List comprehension",
          body: "Pola yang sering muncul di fondasi: buat list kosong, loop, hitung sesuatu, lalu append. Python memadatkan semuanya jadi satu baris yang tetap terbaca: `[ekspresi for x in urutan]`. Contoh `[n * n for n in angka]` menghasilkan kuadrat dari setiap elemen.\n\nSaring dengan if di belakangnya: `[n for n in angka if n % 2 == 0]` hanya mengumpulkan yang lolos syarat. Boleh sekaligus mengubah dan menyaring: `[n * n for n in angka if n % 2 == 0]`. Bacanya dari kiri ke kanan seperti kalimat: ambil n kuadrat, dari angka, yang genap.\n\nComprehension dipakai untuk membangun list. Begitu badannya butuh beberapa langkah, atau loopnya punya efek samping (mencetak, mengubah variabel luar), kembali ke for biasa. Satu comprehension yang rapi lebih didukung daripada dua yang dipaksa.",
          code: {
            language: "python",
            content: "angka = [1, 2, 3, 4, 5]\nkuadrat = [n * n for n in angka]\nprint(kuadrat)  # [1, 4, 9, 16, 25]\n\ngenap_kuadrat = [n * n for n in angka if n % 2 == 0]\nprint(genap_kuadrat)  # [4, 16]",
            caption: "Kumpulkan, dari sebuah urutan, dengan syarat opsional.",
          },
        },
        {
          kind: "quiz",
          question: "Apa hasil dari `[x * 2 for x in range(3)]`?",
          options: ["[0, 2, 4]", "[2, 4, 6]", "[0, 2, 4, 6]", "[1, 2, 3]"],
          answer: 0,
          explanation: "range(3) menghasilkan 0, 1, 2. Setiap nilai dikali dua, jadi hasilnya [0, 2, 4].",
        },
        {
          kind: "code",
          title: "Kuadrat dari angka genap",
          prompt: "Lengkapi comprehension supaya mengumpulkan kuadrat dari angka-angka genap saja.",
          mode: "fill",
          template: "angka = [int(x) for x in input().split()]\nkuadrat_genap = [___ for n in angka if ___]\nprint(kuadrat_genap)",
          solution: "angka = [int(x) for x in input().split()]\nkuadrat_genap = [n * n for n in angka if n % 2 == 0]\nprint(kuadrat_genap)",
          tests: [
            { stdin: "1 2 3 4", expectedOutput: "[4, 16]" },
            { stdin: "2 4 6", expectedOutput: "[4, 16, 36]" },
            { stdin: "1 3 5", expectedOutput: "[]", hidden: true },
          ],
          hints: [
            "Di dalam kurung siku urutannya: nilai yang dikumpulkan dulu, baru for-nya, baru syarat if.",
            "Kuadrat ditulis n * n, dan syarat genap adalah n % 2 == 0.",
            "Jawaban lengkapnya: n * n for n in angka if n % 2 == 0",
          ],
        },
      ],
    },
    {
      slug: "slicing-lanjut",
      title: "Slicing dengan Langkah",
      summary: "Kuasai awal, stop, dan langkah di dalam potongan, termasuk membalik dengan [::-1].",
      steps: [
        {
          kind: "theory",
          title: "awal:stop:langkah",
          body: "Potongan urutan punya tiga komponen: `data[awal:stop:langkah]`. Batas stop tidak ikut, sama seperti di range. Indeks negatif menghitung dari belakang: `data[-1]` adalah elemen terakhir, `data[-3:]` adalah tiga elemen terakhir. Slicing tidak pernah melempar error walaupun rentangnya lewat; hasilnya saja yang berubah jadi kosong.\n\nLangkah mengatur lompatan: `data[::2]` mengambil setiap elemen kedua, `data[1::2]` mulai dari indeks 1. Langkah negatif berjalan mundur, dan kombinasi paling terkenal adalah `data[::-1]`: salinan terbalik. Itu idiom standar Python untuk membalik string atau list tanpa loop.\n\nDua bentuk tanpa angka juga sering dipakai: `data[:]` menyalin seluruh isi (salinan dangkal), dan `data[:n]` mengambil n pertama. Cara terbaik membiasakan diri: bedah contoh di bawah, ubah satu angka, tebak hasilnya, lalu jalankan.",
          code: {
            language: "python",
            content: 's = "belajarpython"\nprint(s[:7])    # belajar\nprint(s[-6:])   # python\nprint(s[::-1])  # nohtyprajaleb\nprint(s[::2])   # bljryhn',
            caption: "Batas stop tidak ikut, langkah negatif berjalan mundur.",
          },
        },
        {
          kind: "quiz",
          question: 'Jika `s = "abcdef"`, apa hasil `s[1:5:2]`?',
          options: ['"bd"', '"bdf"', '"be"', '"ace"'],
          answer: 0,
          explanation: "Mulai indeks 1, berhenti sebelum 5, melangkah dua: indeks 1 dan 3 terambil, yaitu b dan d.",
        },
        {
          kind: "code",
          title: "Balik teks dan ambil setengah awalnya",
          prompt: "Lengkapi potongan di baris kedua supaya teks terbalik urutannya. Baris untuk setengah awal sudah benar, jangan diubah.",
          mode: "fill",
          template: "teks = input()\nterbalik = teks[___]\nprint(terbalik)\nsetengah = teks[:len(teks) // 2]\nprint(setengah)",
          solution: "teks = input()\nterbalik = teks[::-1]\nprint(terbalik)\nsetengah = teks[:len(teks) // 2]\nprint(setengah)",
          tests: [
            { stdin: "belajar", expectedOutput: "rajaleb\nbel" },
            { stdin: "Python", expectedOutput: "nohtyP\nPyt" },
            { stdin: "abc", expectedOutput: "cba\na", hidden: true },
          ],
          hints: [
            "Dua titik dua penuh artinya memakai seluruh urutan; langkah negatif berjalan dari belakang.",
            "Langkah -1 mengambil karakter satu per satu dari akhir ke awal.",
            "Isi blank dengan ::-1",
          ],
        },
      ],
    },
    {
      slug: "zip-dan-enumerate",
      title: "zip dan enumerate",
      summary: "Pasangkan dua list dan dapatkan nomor urut tanpa counter manual.",
      steps: [
        {
          kind: "theory",
          title: "Dua fungsi yang menggantikan counter manual",
          body: "`enumerate(data)` menghasilkan pasangan `(indeks, elemen)` untuk setiap item, mulai dari 0 atau dari angka lain dengan `start=1`. Dengan ini tidak perlu variabel penghitung yang dinaikkan manual di dalam loop.\n\n`zip(a, b)` memasangkan elemen dua urutan sejajar: elemen ke-0 dari a dengan elemen ke-0 dari b, dan seterusnya. Ia berhenti pada urutan terpendek, jadi kalau panjangnya tidak sama, sisanya terpotong diam-diam (sejak Python 3.10 ada `strict=True` yang melempar error bila panjangnya berbeda). Pasangan hasil zip bisa langsung dibongkar di kepala for: `for nama, skor in zip(nama_list, skor_list):`.\n\nHindari kebiasaan `for i in range(len(data))`. Kalau indeks tidak dipakai, loop langsung di datanya saja. Butuh indeks? Pakai enumerate. Dua urutan berjalan sejajar? Pakai zip. Ketiganya membuat loop terbaca seperti maksudnya, bukan seperti mekanismenya.",
          code: {
            language: "python",
            content: 'barang = ["kopi", "teh", "gula"]\nharga = [18000, 12000, 15000]\n\nfor nama, h in zip(barang, harga):\n    print(f"{nama}: Rp{h}")\n\nfor i, b in enumerate(barang, start=1):\n    print(f"{i}. {b}")',
            caption: "Pasangan dibongkar langsung di kepala for.",
          },
        },
        {
          kind: "quiz",
          question: 'Apa hasil dari `list(enumerate(["a", "b"]))`?',
          options: ['[("a", 0), ("b", 1)]', '[(0, "a"), (1, "b")]', '["a", "b"]', '[(1, "a"), (2, "b")]'],
          answer: 1,
          explanation: "enumerate menghasilkan pasangan (indeks, elemen) dengan indeks di depan, mulai dari 0.",
        },
        {
          kind: "code",
          title: "Cetak pasangan nama dan skor",
          prompt: "Lengkapi fungsi bawaan yang memasangkan nama dengan skor supaya loop mencetak tiap pasangan dan menjumlahkan total skornya.",
          mode: "fill",
          template: 'nama = input().split()\nskor = [int(x) for x in input().split()]\ntotal = 0\nfor n, s in ___(nama, skor):\n    print(f"{n}: {s}")\n    total += s\nprint(f"total: {total}")',
          solution: 'nama = input().split()\nskor = [int(x) for x in input().split()]\ntotal = 0\nfor n, s in zip(nama, skor):\n    print(f"{n}: {s}")\n    total += s\nprint(f"total: {total}")',
          tests: [
            { stdin: "ana budi\n90 75", expectedOutput: "ana: 90\nbudi: 75\ntotal: 165" },
            { stdin: "citra dodi eka\n80 85 70", expectedOutput: "citra: 80\ndodi: 85\neka: 70\ntotal: 235" },
            { stdin: "rio\n100", expectedOutput: "rio: 100\ntotal: 100", hidden: true },
          ],
          hints: [
            "Fungsi bawaan yang dimaksud memasangkan elemen dua urutan secara berpasangan.",
            "Tiap pasangan (nama, skor) langsung dibongkar ke dua variabel n dan s di kepala for.",
            "Jawabannya: zip",
          ],
        },
      ],
    },
    {
      slug: "set-dan-operasi-himpunan",
      title: "Set dan Operasi Himpunan",
      summary: "Simpan nilai unik dan pakai irisan, gabungan, serta selisih dengan operator.",
      steps: [
        {
          kind: "theory",
          title: "Set: himpunan tanpa duplikat",
          body: 'Set menyimpan nilai unik, tanpa urutan, dan tidak punya indeks. Membuatnya dengan kurung kurawal berisi nilai: `{"ani", "budi"}`. Satu jebakan: `{}` membuat dict kosong, bukan set kosong; untuk itu ada `set()`. Pemakaian yang paling sering: buang duplikat dengan menampung ulang, `set(data)`.\n\nOperasi himpunan matematika tersedia sebagai operator: `|` gabungan, `&` irisan, `-` selisih, dan `^` yang hanya ada di salah satunya. Sama pentingnya, uji keanggotaan `x in himpunan` berjalan cepat untuk set besar, karena Python menemukan nilai lewat hash, bukan memeriksa satu per satu seperti pada list.\n\nSet comprehension juga ada: `{k[0] for k in kata}` mengumpulkan huruf pertama tiap kata, otomatis unik. Pakai set untuk tag, ID yang tidak boleh dobel, atau membandingkan dua kelompok. Karena isi set tidak menjamin urutan, bungkus dengan `sorted()` saat hasilnya perlu tampil rapi.',
          code: {
            language: "python",
            content: 'kata = "banana"\nunik = set(kata)\nprint(len(unik))     # 3\nprint(sorted(unik))  # [\'a\', \'b\', \'n\']\n\na = {"ani", "budi", "citra"}\nb = {"budi", "dewi"}\nprint(sorted(a & b))  # [\'budi\']\nprint(sorted(a | b))  # [\'ani\', \'budi\', \'citra\', \'dewi\']\nprint(sorted(a - b))  # [\'ani\', \'citra\']',
            caption: "Irisan, gabungan, dan selisih langsung dengan operator.",
          },
        },
        {
          kind: "quiz",
          question: 'Berapa hasil `len(set("banana"))`?',
          options: ["1", "3", "6", "Error"],
          answer: 1,
          explanation: 'Set hanya menyimpan nilai unik. Dari "banana" tersisa tiga karakter: b, a, dan n.',
        },
        {
          kind: "quiz",
          question: "Apa hasil `{1, 2, 3} & {2, 3, 4}`?",
          options: ["{1, 2, 3, 4}", "{2, 3}", "{1, 4}", "{2, 3, 4}"],
          answer: 1,
          explanation: "Operator & adalah irisan: anggota yang muncul di kedua set, yaitu 2 dan 3.",
        },
      ],
    },
    {
      slug: "dict-comprehension",
      title: "Dict Comprehension",
      summary: "Bangun pemetaan kunci nilai dalam satu baris, dari menghitung panjang sampai membalik dict.",
      steps: [
        {
          kind: "theory",
          title: "Dict comprehension",
          body: "Sama seperti list comprehension, tapi hasilnya pasangan kunci nilai: `{kunci: nilai for x in urutan}`. Contoh `{k: len(k) for k in kata}` memetakan tiap kata ke panjangnya. Pola ini muncul terus di kode nyata: tabel pencarian dibangun dalam satu baris.\n\nDua variasi yang sering dipakai. Dari dua list sejajar: `dict(zip(kunci_list, nilai_list))`, atau bentuk comprehension `{k: v for k, v in zip(a, b)}` kalau salah satu perlu diubah dulu. Memutar arah dict: `{v: k for k, v in harga.items()}`, asal nilainya unik; kalau ada duplikat, yang terakhir menimpa.\n\nSaring dengan if seperti di list comprehension. Jagalah keterbacaan: satu comprehension dict yang jelas lebih baik daripada yang bersarang dan harus didekode. Dan sejak Python 3.7 dict menjaga urutan penyisipan, jadi hasil comprehension terurut sesuai sumbernya.",
          code: {
            language: "python",
            content: "kata = [\"apel\", \"kiwi\", \"jeruk\"]\npanjang = {k: len(k) for k in kata}\nprint(panjang)  # {'apel': 4, 'kiwi': 4, 'jeruk': 5}\n\nharga = {\"kopi\": 18000, \"teh\": 12000}\nbalik = {v: k for k, v in harga.items()}\nprint(balik)  # {18000: 'kopi', 12000: 'teh'}",
            caption: "Dari urutan mana pun, jadi pemetaan.",
          },
        },
        {
          kind: "quiz",
          question: "Apa hasil dari `{x: x * x for x in [1, 2, 3]}`?",
          options: ["{1: 1, 2: 4, 3: 9}", "[1, 4, 9]", "{1, 4, 9}", "{1: 2, 2: 4, 3: 6}"],
          answer: 0,
          explanation: "Setiap elemen jadi kunci, dan kuadratnya jadi nilai. Hasilnya {1: 1, 2: 4, 3: 9}.",
        },
        {
          kind: "code",
          title: "Petakan kata ke panjangnya",
          prompt: "Lengkapi dict comprehension supaya memetakan tiap kata ke panjangnya.",
          mode: "fill",
          template: "kata = input().split()\npanjang = {___: ___ for k in kata}\nprint(panjang)",
          solution: "kata = input().split()\npanjang = {k: len(k) for k in kata}\nprint(panjang)",
          tests: [
            { stdin: "belajar python dasar", expectedOutput: "{'belajar': 7, 'python': 6, 'dasar': 5}" },
            { stdin: "a bb ccc", expectedOutput: "{'a': 1, 'bb': 2, 'ccc': 3}" },
            { stdin: "kode", expectedOutput: "{'kode': 4}", hidden: true },
          ],
          hints: [
            "Kuncinya kata itu sendiri, jadi bagian sebelum titik dua cukup k.",
            "Nilainya panjang kata, dihitung dengan fungsi len().",
            "Jawabannya: k: len(k)",
          ],
        },
      ],
    },
    {
      slug: "nested-dict",
      title: "Dict Bercabang",
      summary: "Simpan dan baca data berlapis, dengan akses aman saat kunci mungkin tidak ada.",
      steps: [
        {
          kind: "theory",
          title: "Data berlapis: baca dari luar ke dalam",
          body: 'Nilai dict boleh apa pun, termasuk dict dan list lain. Hasilnya data berlapis seperti profil, konfigurasi, atau jawaban JSON dari API. Aksesnya dirantai: `data["kelas_b"]["wali"]` membaca dict luar dulu, lalu dict dalam.\n\nTiap lapisan bisa gagal: kalau `kelas_b` tidak ada, kamu mendapat KeyError sebelum sempat menyentuh lapisan kedua. Alat pengaman yang lazim adalah `.get` dengan nilai default: `data.get("kelas_c", {})` mengembalikan dict kosong alih-alih error, lalu `.get` berikutnya bisa berjalan. Pilih sesuai kontrak: data yang wajib ada boleh dibiarkan melempar error (pesannya informatif), data opsional dibaca dengan get.\n\nMengubah isi juga dirantai: `sekolah["kelas_a"]["jumlah"] = 25`. Hati-hati saat menyalin struktur berlapis dengan `.copy()`; salinannya masih berbagi dict di dalam. Untuk salinan menyeluruh ada `copy.deepcopy`, dan topik ini muncul lagi saat kamu bekerja dengan JSON di modul File dan Data.',
          code: {
            language: "python",
            content: 'sekolah = {\n    "kelas_a": {"wali": "Bu Sari", "jumlah": 24},\n    "kelas_b": {"wali": "Pak Dedi", "jumlah": 26},\n}\nprint(sekolah["kelas_b"]["wali"])                   # Pak Dedi\nprint(sekolah.get("kelas_c", {}).get("jumlah", 0))  # 0',
            caption: "Akses berlapis dibaca dari luar ke dalam.",
          },
        },
        {
          kind: "quiz",
          question: 'Kode mana yang paling aman membaca `data["profil"]["email"]` ketika profil mungkin tidak ada?',
          options: [
            'data["profil"]["email"]',
            'data.get("profil", {}).get("email", None)',
            'data["profil"].get("email")',
            'data.get(["profil"])["email"]',
          ],
          answer: 1,
          explanation: '.get dengan default {} menghindari KeyError di rantai pertama, lalu .get kedua mengembalikan None kalau email tidak ada. Opsi pertama dan ketiga tetap bisa meledak.',
        },
        {
          kind: "code",
          title: "Baca stok dari dict bercabang",
          prompt: "Lengkapi akses berlapis di baris jumlah supaya membaca barang dari gudang yang dipilih pengguna.",
          mode: "fill",
          template: 'stok = {\n    "gudang_a": {"buku": 12, "pensil": 40},\n    "gudang_b": {"buku": 5, "penghapus": 25},\n}\ngudang = input()\nbarang = input()\njumlah = stok[___][___]\nprint(f"stok {barang} di {gudang}: {jumlah}")',
          solution: 'stok = {\n    "gudang_a": {"buku": 12, "pensil": 40},\n    "gudang_b": {"buku": 5, "penghapus": 25},\n}\ngudang = input()\nbarang = input()\njumlah = stok[gudang][barang]\nprint(f"stok {barang} di {gudang}: {jumlah}")',
          tests: [
            { stdin: "gudang_a\nbuku", expectedOutput: "stok buku di gudang_a: 12" },
            { stdin: "gudang_b\npenghapus", expectedOutput: "stok penghapus di gudang_b: 25" },
            { stdin: "gudang_a\npensil", expectedOutput: "stok pensil di gudang_a: 40", hidden: true },
          ],
          hints: [
            "Akses bertingkat dilakukan dua kali: dict luar dulu, lalu dict dalam.",
            "Di dalam kurung siku tidak perlu tanda kutip karena kita memakai isi variabel, bukan nama kunci langsung.",
            "Isi kurung pertama dengan gudang dan kurung kedua dengan barang.",
          ],
        },
      ],
    },
    {
      slug: "sorted-dengan-key",
      title: "sorted dengan key",
      summary: "Urutkan berdasarkan kriteria sendiri, dari panjang kata sampai nilai absolut.",
      steps: [
        {
          kind: "theory",
          title: "sorted dan parameter key",
          body: "`sorted(data)` mengembalikan list baru yang terurut; `data.sort()` mengurutkan list asli dan mengembalikan None. Keliru menulis `data = data.sort()` adalah bug klasik: hasilnya None. Pakai sorted saat butuh versi terurut tanpa merusak yang asli, dan sort saat listnya memang milikmu dan ingin diubah di tempat.\n\nParameter `key` mengubah kriteria: Python membandingkan hasil pemanggilan fungsi key untuk tiap elemen, bukan elemennya langsung. `sorted(kata, key=len)` mengurutkan kata berdasarkan panjang. Dalam kode nyata key sering ditulis sebaris dengan lambda, dan modul berikutnya membahas itu secara khusus; untuk sekarang, fungsi biasa dengan def sama sahnya.\n\nDua tambahan yang sering dibutuhkan. `reverse=True` membalik arah urutan. Kalau kriteria utamanya seri, Python menjaga urutan asli antara yang seri (sort yang stabil), dan cara rapi menambah kriteria kedua adalah mengembalikan tuple dari fungsi key, misalnya `(len(k), k)` untuk urut panjang lalu alfabetis.",
          code: {
            language: "python",
            content: "angka = [3, -1, 4, -2, 5]\nprint(sorted(angka))                # [-2, -1, 3, 4, 5]\nprint(sorted(angka, key=abs))       # [-1, -2, 3, 4, 5]\nprint(sorted(angka, reverse=True))  # [5, 4, 3, -1, -2]\n\nkata = [\"pisang\", \"apel\", \"kiwi\"]\nprint(sorted(kata, key=len))        # ['apel', 'kiwi', 'pisang']",
            caption: "key= menentukan berdasarkan apa pengurutannya.",
          },
        },
        {
          kind: "quiz",
          question: "Apa beda `sorted(data)` dan `data.sort()`?",
          options: [
            "sorted mengembalikan list baru, sort mengurutkan list asli dan mengembalikan None",
            "Tidak ada beda, keduanya mengembalikan list baru",
            "sorted mengubah list asli, sort mengembalikan list baru",
            "sort hanya bisa dipakai di dalam fungsi",
          ],
          answer: 0,
          explanation: "sorted aman dipakai di ekspresi karena mengembalikan list baru. sort mengubah list di tempat dan return-nya None, jadi tidak boleh ditugaskan.",
        },
        {
          kind: "code",
          title: "Urutkan kata: panjang dulu, lalu alfabetis",
          prompt: "Lengkapi fungsi kunci supaya mengurutkan berdasarkan panjang kata dulu, lalu alfabetis untuk panjang yang sama. Mengembalikan tuple artinya kriteria kedua dipakai hanya saat kriteria pertama seri.",
          mode: "fill",
          template: "def kunci(k):\n    return (___, k)\n\nkata = input().split()\nurut = sorted(kata, key=kunci)\nprint(urut)",
          solution: "def kunci(k):\n    return (len(k), k)\n\nkata = input().split()\nurut = sorted(kata, key=kunci)\nprint(urut)",
          tests: [
            { stdin: "pisang apel jeruk kiwi", expectedOutput: "['apel', 'kiwi', 'jeruk', 'pisang']" },
            { stdin: "bb a ccc aa", expectedOutput: "['a', 'aa', 'bb', 'ccc']" },
            { stdin: "satu dua", expectedOutput: "['dua', 'satu']", hidden: true },
          ],
          hints: [
            "Fungsi kunci menerima satu item dan mengembalikan nilai pembandingnya; di sini ada dua komponen dalam satu tuple.",
            "Panjang kata dihitung dengan len(k), dan k di posisi kedua menengani kata yang panjangnya sama.",
            "Isi blank dengan len(k)",
          ],
        },
      ],
    },
    {
      slug: "memilih-struktur-data",
      title: "Memilih Struktur yang Tepat",
      summary: "List, tuple, set, atau dict: pilih berdasarkan pertanyaan yang sering kamu tanyakan ke data.",
      steps: [
        {
          kind: "theory",
          title: "Struktur mengikuti pertanyaan",
          body: "Cara paling praktis memilih struktur: lihat pertanyaan yang sering kamu tanyakan ke data. Butuh urutan yang boleh berubah dan boleh berisi duplikat? List. Butuh kelompok nilai unik dan sering mengecek keanggotaan? Set. Butuh mencari nilai berdasarkan penanda, seperti ID ke nama? Dict. Butuh paket nilai berstruktur tetap yang tidak boleh berubah? Tuple.\n\nAda sisi kecepatan yang menyertai pilihan ini. Pengecekan `x in daftar` memeriksa elemen satu per satu, makin besar data makin lama. Pada set dan dict, Python menghitung letak nilai dari nilainya sendiri (hash) sehingga pengecekan praktis seketika. Untuk data kecil bedanya tak terasa; untuk ribuan entri yang dicek berulang, memilih set atau dict bisa mengubah program yang lambat jadi responsif.\n\nStruktur juga boleh bertumpuk, dan di situlah kekuatannya: list berisi dict untuk catatan transaksi, dict berisi list untuk indeks kata per huruf. Mulailah dari struktur paling sederhana yang menjawab kebutuhan sekarang, dan ubah saat pertanyaannya berubah. Yang penting keputusannya sadar, bukan kebetulan.",
          code: {
            language: "python",
            content: 'riwayat = ["login", "logout", "login"]  # urutan + duplikat: list\n\npemain = {"B7": "Rina", "B9": "Dodi"}   # cari per penanda: dict\n\nid_dipakai = {"B7", "B9"}               # unik + cek cepat: set\nif "B10" not in id_dipakai:\n    print("B10 tersedia")',
            caption: "Tiap struktur menang di jenis pertanyaan yang berbeda.",
          },
        },
        {
          kind: "quiz",
          question: "Kamu perlu menyimpan tag artikel: tidak boleh ada duplikat dan urutannya tidak penting. Struktur paling pas?",
          options: ["list", "tuple", "set", "dict"],
          answer: 2,
          explanation: "Set menjamin keunikan otomatis dan cepat untuk cek keanggotaan. Urutan tidak penting di sini, jadi list dan tuple tidak menambah apa pun.",
        },
        {
          kind: "quiz",
          question: "Data berbentuk pasangan NIS ke nama siswa, dan sering dicari per NIS. Struktur paling pas?",
          options: ["list berisi pasangan [nis, nama]", "tuple berisi semua siswa", "set berisi NIS", "dict dengan NIS sebagai kunci"],
          answer: 3,
          explanation: "Pencarian berdasarkan penanda unik adalah tugas dict: `siswa[nis]` langsung memberi nama tanpa memeriksa satu per satu.",
        },
      ],
    },
    {
      slug: "mini-latihan-gabungan",
      title: "Latihan Gabungan Koleksi",
      summary: "Rangkai split, set, dict comprehension, dan max untuk meringkas satu baris data.",
      steps: [
        {
          kind: "theory",
          title: "Merangkai alat: dari teks mentah ke ringkasan",
          body: "Pekerjaan data di kode nyata biasanya berantai: teks mentah dipecah menjadi list, list dibersihkan atau dihitung uniknya dengan set, dipetakan jadi dict untuk ringkasan, lalu disajikan dengan sorted atau max. Tiap langkah satu baris, tiap baris satu pekerjaan.\n\nLatihan di bawah meminta tepat itu dari satu baris kata: jumlah kata unik lewat `set`, pemetaan kata ke panjangnya lewat dict comprehension, dan kata terpanjang lewat `max` dengan `key=len`. Catatan kecil: `max` bekerja mirip `sorted` tetapi hanya mengambil yang terbesar, dan saat seri ia mengembalikan yang muncul lebih dulu.\n\nKalau hasilmu keliru, jangan menebak. Cetak variabel perantara (list hasil split, set unik, dict ringkasan) satu per satu dan lihat di langkah mana asumsi dan kenyataan berbeda. Kebiasaan memeriksa antara beginilah yang nanti menjadi dasar debugging.",
          code: {
            language: "python",
            content: 'angka = [int(x) for x in "4 8 15 4".split()]\nunik = set(angka)\nringkas = {n: n * n for n in angka}\nprint(len(unik))   # 3\nprint(ringkas)     # {4: 16, 8: 64, 15: 225}\nprint(max(angka))  # 15',
            caption: "Pecah, bersihkan, petakan, lalu sajikan.",
          },
        },
        {
          kind: "code",
          title: "Ringkas satu baris kata",
          prompt: "Lengkapi dua baris yang bertanda ___: pemetaan kata ke panjangnya (dict comprehension), dan pemilihan kata terpanjang berdasarkan panjangnya.",
          mode: "fill",
          template: 'kata = input().split()\nunik = set(kata)\nringkas = {___: ___ for k in kata}\nterpanjang = ___(kata, key=len)\nprint(f"kata unik: {len(unik)}")\nprint(f"terpanjang: {terpanjang}")\nprint(ringkas)',
          solution: 'kata = input().split()\nunik = set(kata)\nringkas = {k: len(k) for k in kata}\nterpanjang = max(kata, key=len)\nprint(f"kata unik: {len(unik)}")\nprint(f"terpanjang: {terpanjang}")\nprint(ringkas)',
          tests: [
            { stdin: "apel kiwi apel jeruk", expectedOutput: "kata unik: 3\nterpanjang: jeruk\n{'apel': 4, 'kiwi': 4, 'jeruk': 5}" },
            { stdin: "bb a a bb ccc", expectedOutput: "kata unik: 3\nterpanjang: ccc\n{'bb': 2, 'a': 1, 'ccc': 3}" },
            { stdin: "satu", expectedOutput: "kata unik: 1\nterpanjang: satu\n{'satu': 4}", hidden: true },
          ],
          hints: [
            "Baris ringkas memetakan tiap kata ke panjangnya: kuncinya k, nilainya panjang kata.",
            "Panjang string dihitung dengan len(k).",
            "Fungsi yang mengambil item terbesar menurut key bernama max; penulisannya mirip sorted.",
          ],
        },
      ],
    },
  ],
};
