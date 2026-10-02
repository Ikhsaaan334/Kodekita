import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "python",
  moduleRange: [8, 9],
  modules: [
    {
      title: "Kode Rapi dan Teruji",
      description: "type hints, pytest dasar, enum, debugging, dan refactoring aman.",
    },
    {
      title: "Menuju Proyek Lapangan",
      description:
        "Struktur aplikasi CLI yang rapi, HTTP dengan urllib/requests-style, konfigurasi, dan mini proyek akhir.",
    },
  ],
  lessons: [
    // ==== Modul 8: Kode Rapi dan Teruji ====
    {
      slug: "type-hints-dasar",
      title: "Type Hints Dasar",
      summary: "Tandai tipe parameter dan nilai balik fungsi dengan anotasi yang terbaca.",
      steps: [
        {
          kind: "theory",
          title: "Anotasi tipe pada fungsi",
          body: "Anotasi tipe ditulis tepat pada daftar parameter dan nilai balik fungsi. `def tarif(jarak_km: float) -> int:` berarti fungsi menerima jarak bertipe `float` dan mengembalikan `int`. Tanda titik dua memisahkan nama parameter dari tipenya, dan panah `->` menandai tipe hasil.\n\nPython sendiri tidak memaksa anotasi saat program berjalan: memberi `str` ke parameter beranotasi `int` tetap dieksekusi. Nilai anotasi justru dirasakan pembaca kode, editor (isi otomatis dan peringatan ketik), serta alat pemeriksa seperti mypy. Anggap anotasi sebagai dokumentasi yang bisa diperiksa mesin.\n\nMulailah dari fungsi yang dipakai lintas berkas, karena di situlah salah paham tipe paling mahal. Fungsi lama tanpa anotasi tetap sah: penambahannya boleh bertahap tanpa menulis ulang semuanya.",
          code: {
            language: "python",
            content:
              'def tarif(jarak_km: float) -> int:\n    return round(5000 * jarak_km)\n\ndef sapa(nama: str, ulang: int) -> list[str]:\n    return [f"Halo, {nama}!" for _ in range(ulang)]',
            caption: "Tipe parameter mengikuti titik dua; tipe hasil mengikuti panah ->.",
          },
        },
        {
          kind: "quiz",
          question: "Pada `def hitung(x: int) -> str:`, apa arti `-> str`?",
          options: [
            "Parameter x harus berupa str",
            "Fungsi mengembalikan nilai str",
            "Fungsi mengubah x menjadi str",
            "Fungsi mencetak teks str",
          ],
          answer: 1,
          explanation:
            "Panah -> di akhir tanda kurung menandai tipe nilai balik: hitung dipakai mengembalikan str. Tipe x sendiri tertulis sebelum panah, yaitu int.",
        },
        {
          kind: "code",
          title: "Beri anotasi pada tarif",
          prompt:
            "Lengkapi anotasi fungsi `tarif`: menerima `jarak_km` bertipe `float` dan mengembalikan `int` berupa 5000 per kilometer yang dibulatkan. Ganti setiap `___`.",
          mode: "fill",
          template:
            "def tarif(jarak_km: ___) ___ int:\n    return round(5000 * jarak_km)\n\njarak = float(input())\nprint(tarif(jarak))",
          solution:
            "def tarif(jarak_km: float) -> int:\n    return round(5000 * jarak_km)\n\njarak = float(input())\nprint(tarif(jarak))",
          tests: [
            { stdin: "3.2", expectedOutput: "16000" },
            { stdin: "0.5", expectedOutput: "2500" },
            { stdin: "7", expectedOutput: "35000", hidden: true },
          ],
          hints: [
            "Tipe untuk jarak yang boleh pecahan ditulis float.",
            "Tanda panah nilai balik ditulis dua karakter tanpa spasi: tanda lebih besar lalu sama dengan, ->.",
          ],
        },
      ],
    },
    {
      slug: "typing-lanjut",
      title: "Optional, list[int], dan Union",
      summary: "Anotasi koleksi, nilai yang boleh None, dan pilihan lebih dari satu tipe.",
      steps: [
        {
          kind: "theory",
          title: "Tipe yang menggambarkan struktur",
          body: "Anotasi koleksi memakai tanda kurung siku seperti penulisannya di kode: `list[str]` untuk daftar teks, `dict[int, str]` untuk kamus berisi kunci int dan nilai str, `tuple[str, int]` untuk pasangan tetap. Pembaca langsung tahu isi di dalamnya tanpa membuka badan fungsi.\n\nNilai yang memang bisa absen dianotasi `Optional[str]`, artinya `str` atau `None`. Ia diimpor dari modul `typing` dan memaksa setiap pemanggil mengakui kemungkinan None lewat pengecekan `is None` sebelum nilai dipakai. Lupa cek ini adalah sumber error paling umum di kode nyata.\n\nBila satu nilai sah berupa beberapa tipe sekaligus, gunakan `Union[int, str]` dari typing, atau bentuk pendek `int | str` yang tersedia sejak Python 3.10. Pilih tipe yang paling jujur menggambarkan data, bukan yang paling longgar.",
          code: {
            language: "python",
            content:
              'from typing import Optional\n\ndef cari(nis: dict[int, str], target: int) -> Optional[str]:\n    return nis.get(target)\n\nhasil = cari({101: "Ayu"}, 102)\nif hasil is None:\n    print("tidak terdaftar")\nelse:\n    print(hasil.upper())',
            caption: "Optional pada nilai balik menandai jalur None yang wajib dicek.",
          },
        },
        {
          kind: "quiz",
          question: "Apa arti anotasi `Optional[str]` sebagai tipe nilai balik?",
          options: [
            "Selalu bertipe str",
            "str atau None",
            "Parameter yang boleh tidak dikirim",
            "str yang boleh kosong",
          ],
          answer: 1,
          explanation:
            "Optional[str] sama dengan Union[str, None]: hasilnya bisa str, bisa juga None. Ia tidak ada hubungannya dengan parameter opsional berdefault.",
        },
        {
          kind: "code",
          title: "Pencarian dengan Optional",
          prompt:
            "Lengkapi program pencarian NIS. `cari_siswa` mengembalikan `Optional[str]`, dan `tampilkan` menuliskan `terdaftar: <nama>` atau `tidak terdaftar`.",
          mode: "fill",
          template:
            'from typing import Optional\n\ndef cari_siswa(nis: dict[int, str], target: int) -> Optional[str]:\n    return nis.___(target)\n\ndef tampilkan(nama: Optional[str]) -> str:\n    if nama is ___:\n        return "tidak terdaftar"\n    return f"terdaftar: {nama}"\n\nnis = {101: "Ayu", 102: "Budi", 103: "Citra"}\nprint(tampilkan(cari_siswa(nis, int(input()))))',
          solution:
            'from typing import Optional\n\ndef cari_siswa(nis: dict[int, str], target: int) -> Optional[str]:\n    return nis.get(target)\n\ndef tampilkan(nama: Optional[str]) -> str:\n    if nama is None:\n        return "tidak terdaftar"\n    return f"terdaftar: {nama}"\n\nnis = {101: "Ayu", 102: "Budi", 103: "Citra"}\nprint(tampilkan(cari_siswa(nis, int(input()))))',
          tests: [
            { stdin: "102", expectedOutput: "terdaftar: Budi" },
            { stdin: "999", expectedOutput: "tidak terdaftar" },
            { stdin: "101", expectedOutput: "terdaftar: Ayu", hidden: true },
          ],
          hints: [
            "Metode dict yang mengembalikan None bila kunci tidak ada bernama get.",
            "Uji keberadaan None memakai is, bukan ==.",
          ],
        },
      ],
    },
    {
      slug: "mypy-konsep",
      title: "Memeriksa Tipe dengan mypy",
      summary: "Kenali pemeriksa tipe statis: menangkap kesalahan sebelum program dijalankan.",
      steps: [
        {
          kind: "theory",
          title: "Analisis statis, bukan saat berjalan",
          body: "Anotasi tidak diperiksa Python saat program berjalan. Panggilan `ringkas([1, 2, 3])` pada fungsi beranotasi `teks: str` tetap dieksekusi dan hasilnya malah benar, karena `len` kebetulan bekerja pada list. Kesalahan semacam ini lolos dari uji coba biasa.\n\nmypy adalah pemeriksa tipe statis: ia membaca kode, membandingkan anotasi dengan pemakaiannya, dan melaporkan ketidakcocokan per baris tanpa menjalankan program apa pun. Ia dijalankan dari terminal dengan `mypy namafile.py`, dan editor modern menampilkan hasilnya sebagai peringatan langsung di kode.\n\nKekuatannya ada pada gradual typing: berkas lama tanpa anotasi tidak langsung dipenuhi laporan, dan kamu bisa memperketat sambil menambah anotasi. Mulailah dari modul yang paling sering berubah, karena di situ bug tipe paling sering muncul.",
          code: {
            language: "python",
            content:
              'def ringkas(teks: str) -> int:\n    return len(teks)\n\nringkas("kata")     # aman\nringkas([1, 2, 3])  # jalan normal, tapi mypy menandai baris ini',
            caption: "Saat berjalan lolos; pemeriksa statis yang menolaknya.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang dilakukan mypy terhadap kode yang melanggar anotasi tipe?",
          options: [
            "Menjalankan program sampai error muncul",
            "Menandai baris yang bermasalah tanpa menjalankan program",
            "Memperbaiki kode secara otomatis",
            "Menghapus anotasi yang salah",
          ],
          answer: 1,
          explanation:
            "mypy menganalisis kode secara statis: ia hanya membaca dan melaporkan, tidak mengeksekusi. Eksekusi tetap urusan Python.",
        },
        {
          kind: "quiz",
          question: "Pada contoh di atas, apa yang terjadi pada `ringkas([1, 2, 3])`?",
          options: [
            "Python menolaknya saat runtime",
            "Programnya jalan normal, dan mypy menandainya sebagai pelanggaran anotasi",
            "mypy menghentikan eksekusi program",
            "Anotasi diabaikan dan len menghasilkan error",
          ],
          answer: 1,
          explanation:
            "len bekerja pada list, jadi saat program berjalan tidak ada error. Ketidakcocokan dengan anotasi hanya terlihat oleh pemeriksa statis seperti mypy.",
        },
      ],
    },
    {
      slug: "enum-status",
      title: "enum: Konstanta Bernama",
      summary: "Ganti string ajaib dengan kumpulan nilai tetap yang sah menurut tipe.",
      steps: [
        {
          kind: "theory",
          title: "Kumpulan nilai yang tertutup",
          body: 'Sebagian nilai memang tertutup: status tugas hanya baru, proses, atau selesai. Menyimpannya sebagai string bebas mengundang typo diam-diam, seperti `"Proses"` berkapital atau `"proses "` berekstra spasi, yang baru ketahuan saat perbandingan gagal.\n\n`enum.Enum` menutup celah itu. Definisikan class yang mewarisi Enum, tiap anggota bernama diberi nilai tetap, dan tak ada anggota lain di luar daftar. Anggota dibandingkan dengan `is`, dan konversi dari nilai mentah memakai `Status("baru")` yang melempar ValueError bila nilainya tak terdaftar: input liar tertangkap di pintu.\n\nFungsi beranotasi `def label(status: Status) -> str` tidak bisa disalahpahami. Pemanggil melihat pilihan sahnya langsung di definisi enum, dan editor melengkapinya otomatis.',
          code: {
            language: "python",
            content:
              'import enum\n\nclass Status(enum.Enum):\n    BARU = "baru"\n    PROSES = "proses"\n    SELESAI = "selesai"\n\nstatus = Status("proses")\nif status is Status.PROSES:\n    print("sedang dikerjakan")',
            caption: "Status(\"proses\") mengubah nilai mentah menjadi anggota enum.",
          },
        },
        {
          kind: "quiz",
          question: "Cara membandingkan anggota enum yang tepat adalah...",
          options: [
            'status == "proses"',
            "status is Status.PROSES",
            "status.value == Status",
            "status.matches(Status.PROSES)",
          ],
          answer: 1,
          explanation:
            "Anggota enum dibandingkan identitas dengan is terhadap anggota lain. Membandingkannya dengan string mentah justru melewatkan perlindungan tipe yang ditawarkan enum.",
        },
        {
          kind: "code",
          title: "Mesin label status",
          prompt:
            "Lengkapi program: definisikan enum `Status`, fungsi `label` yang menjabarkan tiap status, lalu konversi input menjadi anggota enum sebelum dicetak.",
          mode: "fill",
          template:
            'import enum\n\nclass Status(___.Enum):\n    BARU = "baru"\n    PROSES = "proses"\n    SELESAI = "selesai"\n\ndef label(status: Status) -> str:\n    if status ___ Status.BARU:\n        return "menunggu diproses"\n    if status is Status.PROSES:\n        return "sedang dikerjakan"\n    return "sudah rampung"\n\npilihan = input().strip()\nprint(label(Status(___)))',
          solution:
            'import enum\n\nclass Status(enum.Enum):\n    BARU = "baru"\n    PROSES = "proses"\n    SELESAI = "selesai"\n\ndef label(status: Status) -> str:\n    if status is Status.BARU:\n        return "menunggu diproses"\n    if status is Status.PROSES:\n        return "sedang dikerjakan"\n    return "sudah rampung"\n\npilihan = input().strip()\nprint(label(Status(pilihan)))',
          tests: [
            { stdin: "baru", expectedOutput: "menunggu diproses" },
            { stdin: "proses", expectedOutput: "sedang dikerjakan" },
            { stdin: "selesai", expectedOutput: "sudah rampung", hidden: true },
          ],
          hints: [
            "Enum berasal dari modul bawaan bernama enum, diakses sebagai enum.Enum.",
            "Konversi nilai mentah menjadi anggota enum dengan Status(nilai); nilainya sudah tersimpan di variabel pilihan.",
          ],
        },
      ],
    },
    {
      slug: "docstring-dan-konvensi",
      title: "Docstring dan Konvensi",
      summary: "Dokumentasi yang tinggal di dalam kode, plus kebiasaan penamaan yang konsisten.",
      steps: [
        {
          kind: "theory",
          title: "Docstring: dokumentasi yang ikut diimpor",
          body: 'Docstring adalah string yang diletakkan sebagai pernyataan pertama di badan fungsi, class, atau di awal berkas. Python menyimpannya pada atribut `__doc__`, sehingga `help(fungsi)` menampilkannya dan alat pembuat dokumentasi memanfaatkannya sebagai sumber utama.\n\nBentuk ringkas cukup satu baris kalimat perintah: `"""Bagi total secara adil."""`. Bentuk lengkap menambah baris kosong lalu uraian parameter dan nilai balik. Konsistensi lebih penting daripada panjang: docstring menjawab apa yang tidak kelihatan dari tanda tangan fungsi.\n\nPenamaan pun punya konvensi baku dari PEP 8: fungsi dan variabel snake_case, class PascalCase, konstanta UPPER_SNAKE. Saat semua mengikuti pola yang sama, pembaca bisa menebak peran sebuah nama sebelum membaca isinya.',
          code: {
            language: "python",
            content:
              'def bagi(total: int, porsi: int) -> float:\n    """Bagi total secara adil ke sejumlah porsi.\n\n    Hasil dibulatkan dua angka desimal.\n    """\n    return round(total / porsi, 2)\n\nprint(bagi.__doc__)',
            caption: "help(bagi) menampilkan docstring yang sama tanpa menjalankan apa pun.",
          },
        },
        {
          kind: "quiz",
          question: "Di mana docstring sebuah fungsi diletakkan?",
          options: [
            "Sebelum baris def",
            "Sebagai pernyataan pertama di dalam badan fungsi",
            "Setelah return terakhir",
            "Sebagai komentar di atas berkas",
          ],
          answer: 1,
          explanation:
            "Docstring adalah ekspresi string pertama di badan fungsi, class, atau modul. Python menyimpannya di atribut __doc__.",
        },
        {
          kind: "quiz",
          question: "Nama konstanta yang sesuai konvensi penamaan adalah...",
          options: ["BatasMaksimal", "batas_maksimal", "BATAS_MAKSIMAL", "batasMaksimal"],
          answer: 2,
          explanation:
            "Konstanta ditulis UPPER_SNAKE: huruf besar semua dengan pemisah garis bawah. PascalCase untuk class, dan camelCase bukan gaya Python.",
        },
      ],
    },
    {
      slug: "test-gaya-pytest",
      title: "Menulis Test ala pytest",
      summary: "Bungkus fungsi dengan tes assert sederhana; pola yang sama dipakai pytest.",
      steps: [
        {
          kind: "theory",
          title: "Tes sebagai jaring pengaman",
          body: "pytest mengandalkan pola sederhana: fungsi tes bernama diawali `test_`, isinya serangkaian `assert` yang membandingkan hasil fungsi dengan nilai yang diharapkan. Bila satu assert menghasilkan False, pytest berhenti di situ dan menampilkan kedua nilai, sehingga perbedaannya kelihatan sekaligus.\n\nPada judge platform ini pytest tidak terpasang, jadi fungsi tes dipanggil manual di akhir program. Pola pikirnya tetap sama: susun kasus di dalam `test_rata_rata()`, panggil, dan bila program berjalan tanpa AssertionError berarti seluruh kasus lulus.\n\nTest yang baik menutup tiga lapis: kasus normal, kasus batas seperti satu elemen atau nol, dan kasus yang dulu pernah salah. Semakin sering sebuah fungsi berubah, semakin berharga jaring pengaman ini.",
          code: {
            language: "python",
            content:
              'def kuadrat(x: int) -> int:\n    return x * x\n\ndef test_kuadrat():\n    assert kuadrat(3) == 9\n    assert kuadrat(0) == 0\n    assert kuadrat(-4) == 16\n\ntest_kuadrat()\nprint("semua kasus lulus")',
            caption: "Tanpa pytest sekalipun, pola test_ plus assert tetap bisa dijalankan.",
          },
        },
        {
          kind: "quiz",
          question: "Menurut konvensi pytest, nama fungsi tes harus...",
          options: [
            "Diawali tes_",
            "Diawali test_",
            "Diakhiri _test",
            "Ditulis di dalam class Test",
          ],
          answer: 1,
          explanation:
            "pytest mengumpulkan fungsi berawalan test_ secara otomatis. Tanpa awalan itu, kolektor pytest tidak menemukan fungsi apa pun untuk dijalankan.",
        },
        {
          kind: "code",
          title: "Tes manual untuk rata_rata",
          prompt:
            "Lengkapi fungsi `rata_rata`, fungsi tes ala pytest, dan panggil fungsinya. Setelah tes lulus, program membaca satu baris angka dan mencetak rata-ratanya.",
          mode: "fill",
          template:
            'def rata_rata(angka: list[float]) -> float:\n    ___ sum(angka) / len(angka)\n\ndef test_rata_rata():\n    assert rata_rata([2.0, 4.0, 6.0]) == 4.0\n    assert rata_rata([10.0]) == ___\n\n___()\nprint("test lulus")\n\nnilai = [float(x) for x in input().split()]\nprint(rata_rata(nilai))',
          solution:
            'def rata_rata(angka: list[float]) -> float:\n    return sum(angka) / len(angka)\n\ndef test_rata_rata():\n    assert rata_rata([2.0, 4.0, 6.0]) == 4.0\n    assert rata_rata([10.0]) == 10.0\n\ntest_rata_rata()\nprint("test lulus")\n\nnilai = [float(x) for x in input().split()]\nprint(rata_rata(nilai))',
          tests: [
            { stdin: "2 4 6", expectedOutput: "test lulus\n4.0" },
            { stdin: "5", expectedOutput: "test lulus\n5.0" },
            { stdin: "1 2", expectedOutput: "test lulus\n1.5", hidden: true },
          ],
          hints: [
            "Mengirim hasil keluar dari fungsi memakai return.",
            "Satu elemen [10.0] punya rata-rata 10.0, dan fungsi tes dipanggil tanpa argumen.",
          ],
        },
      ],
    },
    {
      slug: "debugging-traceback",
      title: "Debugging Secara Disiplin",
      summary: "Baca traceback dari bawah, sisipkan print berlabel, dan rapikan setelah ketemu.",
      steps: [
        {
          kind: "theory",
          title: "Dari pesan error ke penyebab",
          body: 'Traceback dibaca dari bawah ke atas. Baris paling akhir menyebut jenis exception dan pesannya, misalnya `TypeError: can only concatenate str`, dan baris di atasnya menunjuk berkas serta nomor baris pemicunya. Mulai dari situ, jangan menebak dari awal berkas.\n\nPrint debugging tetap sah bila disiplin: beri label pada tiap cetakan seperti `print(f"total = {total}")`, letakkan tepat sebelum titik yang dicurigai, dan hapus semuanya setelah kasus selesai. Menabur print tanpa label di sepuluh tempat justru mengubur informasi yang dicari.\n\nBila keadaan program perlu diintip lebih dalam, sisipkan `breakpoint()` lalu jalankan: Python membuka debugger pdb. Perintah `n` melangkah satu baris, `p nama` menampilkan isi variabel, dan `c` melanjutkan eksekusi. Debugger melihat semua keadaan tanpa menambah satu baris print.',
          code: {
            language: "python",
            content:
              'def total_bayar(harga: int, jumlah: int, persen: int) -> int:\n    total = harga * jumlah\n    potongan = total * persen / 100\n    print(f"potongan = {potongan}")  # hapus setelah ketemu\n    return round(total - potongan)',
            caption: "Satu print berlabel pada variabel yang dicurigai, bukan semua variabel sekaligus.",
          },
        },
        {
          kind: "quiz",
          question: "Ketika traceback muncul di layar, bagian mana yang dibaca lebih dulu?",
          options: [
            "Baris paling atas",
            "Baris paling bawah: jenis exception dan pesannya",
            "Nama berkas di tengah traceback",
            "Semua baris sekaligus, urut naik",
          ],
          answer: 1,
          explanation:
            "Baris terakhir traceback menyebut jenis exception dan pesan penyebutnya; baris di atasnya menunjuk letak kejadiannya. Dari situlah penyelidikan dimulai.",
        },
        {
          kind: "code",
          title: "Diskon yang meledak",
          prompt:
            "Program penjualan menghitung total bayar setelah diskon, tapi hasilnya jauh dari masuk akal. Jalankan dengan test pertama, baca keluarannya, lalu perbaiki satu kesalahan yang ada sampai semua test lulus.",
          mode: "fix",
          template:
            "def total_bayar(harga: int, jumlah: int, persen: int) -> int:\n    total = harga * jumlah\n    diskon = total * persen\n    return round(total - diskon)\n\nharga = int(input())\njumlah = int(input())\npersen = int(input())\nprint(total_bayar(harga, jumlah, persen))",
          solution:
            "def total_bayar(harga: int, jumlah: int, persen: int) -> int:\n    total = harga * jumlah\n    diskon = total * persen / 100\n    return round(total - diskon)\n\nharga = int(input())\njumlah = int(input())\npersen = int(input())\nprint(total_bayar(harga, jumlah, persen))",
          tests: [
            { stdin: "25000\n3\n20", expectedOutput: "60000" },
            { stdin: "12000\n2\n25", expectedOutput: "18000" },
            { stdin: "10000\n1\n0", expectedOutput: "10000", hidden: true },
          ],
          hints: [
            "Coba hitung manual: harga 25000 kali 3 dengan diskon 20 persen seharusnya tidak menghasilkan angka jutaan.",
            "Persen berarti per seratus; potongan dihitung total dikali persen dibagi 100.",
          ],
        },
      ],
    },
    {
      slug: "refactoring-extract-function",
      title: "Refactoring Aman",
      summary: "Pindahkan logika ke fungsi kecil tanpa mengubah perilaku, dijaga oleh test.",
      steps: [
        {
          kind: "theory",
          title: "Ubah bentuk, jaga perilaku",
          body: "Refactoring adalah mengubah struktur kode tanpa mengubah perilakunya: menamai ulang, memecah fungsi panjang, menghapus duplikasi. Batas antara refactor dan perombakan sembarangan ada pada jaminan perilaku, dan jaminan itu datang dari test yang lulus sebelum dan sesudah perubahan.\n\nTeknik yang paling sering dipakai bernama extract function: ambil blok yang punya satu tujuan, pindahkan ke fungsi bernama jelas, kirim datanya lewat parameter, dan kembalikan hasilnya dengan return. Fungsi utama lalu terbaca seperti ringkasan cerita, dan blok yang dipindah bisa diuji terpisah.\n\nBekerjalah dalam langkah kecil: satu ekstraksi, jalankan test, baru lanjut ke berikutnya. Mengubah lima hal sekaligus membuat sumber masalah tidak tertelusur saat test tiba-tiba gagal.",
          code: {
            language: "python",
            content:
              "# sebelum: logika diskon menempel di alur utama\ntotal = harga * jumlah\nif total > 500000:\n    total = total - total * 10 // 100\n\n# sesudah: extract function\ndef dengan_diskon(total: int) -> int:\n    if total > 500000:\n        return total - total * 10 // 100\n    return total",
            caption: "Nama fungsi menggantikan kebutuhan komentar; test memastikan hasilnya tetap sama.",
          },
        },
        {
          kind: "quiz",
          question: "Sebuah refactoring disebut aman bila...",
          options: [
            "Kodenya jadi lebih pendek dari sebelumnya",
            "Test tetap lulus sebelum dan sesudah perubahan",
            "Perubahan selesai sebelum tenggat",
            "Dikerjakan bersamaan dengan fitur baru",
          ],
          answer: 1,
          explanation:
            "Ukuran keberhasilan refactor adalah perilaku yang tidak berubah, dan yang membuktikannya adalah test. Kode lebih pendek hanya efek samping, bukan tujuan.",
        },
        {
          kind: "code",
          title: "Pecah program nilai",
          prompt:
            "Program ini sudah dipecah menjadi dua fungsi, tinggal diisi. `hitung_rata` menghitung rata-rata, dan `status_kelulusan` menentukan lulus untuk rata-rata minimal 75. Lengkapi bagian yang hilang.",
          mode: "fill",
          template:
            'def hitung_rata(nilai: list[int]) -> float:\n    return ___(nilai) / ___(nilai)\n\ndef status_kelulusan(rata: float) -> str:\n    if rata ___ 75:\n        return "lulus"\n    return "mengulang"\n\nn = int(input())\nnilai = [int(input()) for _ in range(n)]\nrata = hitung_rata(nilai)\nprint(f"rata-rata: {rata:.1f}")\nprint(status_kelulusan(rata))',
          solution:
            'def hitung_rata(nilai: list[int]) -> float:\n    return sum(nilai) / len(nilai)\n\ndef status_kelulusan(rata: float) -> str:\n    if rata >= 75:\n        return "lulus"\n    return "mengulang"\n\nn = int(input())\nnilai = [int(input()) for _ in range(n)]\nrata = hitung_rata(nilai)\nprint(f"rata-rata: {rata:.1f}")\nprint(status_kelulusan(rata))',
          tests: [
            { stdin: "3\n80\n70\n90", expectedOutput: "rata-rata: 80.0\nlulus" },
            { stdin: "2\n60\n70", expectedOutput: "rata-rata: 65.0\nmengulang" },
            { stdin: "4\n70\n75\n80\n79", expectedOutput: "rata-rata: 76.0\nlulus", hidden: true },
          ],
          hints: [
            "Fungsi bawaan untuk menjumlahkan isi dan menghitung banyaknya: sum dan len.",
            "Minimal 75 berarti perbandingan rata >= 75.",
          ],
        },
      ],
    },
    {
      slug: "big-o-praktis",
      title: "Kompleksitas Secara Praktis",
      summary: "Perkirakan biaya kode dengan notasi O besar dan pilih struktur yang murah.",
      steps: [
        {
          kind: "theory",
          title: "Menghitung langkah, bukan detik",
          body: "Notasi O besar menggambarkan pertumbuhan jumlah langkah saat data membesar, bukan detik di jam dinding. Mencari satu nama dalam list memeriksa isi satu per satu: O(n). Mengecek keanggotaan dalam set memakai tabel hash: kira-kira O(1) untuk tiap pengecekan, apa pun ukurannya.\n\nLoop bersarang melipatgandakan biaya: dua loop atas n item berarti O(n^2), dan n sebesar 10.000 sudah sekitar seratus juta perbandingan. Banyak pola berpasangan yang tampak wajar sebenarnya bisa ditulis ulang dengan set atau dict menjadi sekali jalan O(n).\n\nKebiasaan yang murah dan berdampak: daftar yang akan sering dicek keanggotaannya dikonversi ke `set()` sekali di awal, lalu pengecekan berlangsung murah di dalam loop. Satu baris konversi menghemat jutaan perbandingan.",
          code: {
            language: "python",
            content:
              '# O(n^2): tiap nama dibandingkan ke seluruh daftar dilarang\nfor nama in pengiriman:\n    if nama in dilarang_list:\n        print(nama, "ditolak")\n\n# O(n): dilarang jadi set sekali, tiap cek jadi murah\ndilarang = set(dilarang_list)\nfor nama in pengiriman:\n    if nama in dilarang:\n        print(nama, "ditolak")',
            caption: "Hasilnya sama persis; jumlah langkahnya beda kelas.",
          },
        },
        {
          kind: "quiz",
          question: "Loop bersarang yang membandingkan tiap item dengan tiap item lain pada data n berukuran...",
          options: ["O(1)", "O(n)", "O(n log n)", "O(n^2)"],
          answer: 3,
          explanation:
            "Untuk tiap satu dari n item, loop dalam lagi memeriksa n item: n kali n langkah, itulah O(n^2).",
        },
        {
          kind: "code",
          title: "Pasangan berjumlah target",
          prompt:
            "Baca target dari baris pertama dan kumpulan angka dari baris kedua. Cetak `True` bila ada dua angka pada posisi berbeda yang berjumlah target, selain itu `False`. Lengkapi pola set yang bekerja dalam O(n).",
          mode: "fill",
          template:
            "def ada_pasangan(angka: list[int], target: int) -> bool:\n    terlihat: set[int] = set()\n    for x in angka:\n        if target - x ___ terlihat:\n            return True\n        terlihat.___(x)\n    return ___\n\ntarget = int(input())\nangka = [int(x) for x in input().split()]\nprint(ada_pasangan(angka, target))",
          solution:
            "def ada_pasangan(angka: list[int], target: int) -> bool:\n    terlihat: set[int] = set()\n    for x in angka:\n        if target - x in terlihat:\n            return True\n        terlihat.add(x)\n    return False\n\ntarget = int(input())\nangka = [int(x) for x in input().split()]\nprint(ada_pasangan(angka, target))",
          tests: [
            { stdin: "9\n2 7 11 15", expectedOutput: "True" },
            { stdin: "10\n1 2 3", expectedOutput: "False" },
            { stdin: "6\n4 3 8 2", expectedOutput: "True", hidden: true },
          ],
          hints: [
            "Pasangan x dengan angka yang sudah lewat: cek apakah target dikurangi x pernah terlihat.",
            "Set menerima anggota baru lewat add; bila tidak ada pasangan sama sekali, hasilnya False.",
          ],
        },
      ],
    },
    {
      slug: "latihan-gabungan-rapi",
      title: "Latihan Gabungan: Kode Rapi",
      summary: "Satu program kecil yang menyatukan anotasi, fungsi murni, dan test manual.",
      steps: [
        {
          kind: "theory",
          title: "Daftar periksa kode rapi",
          body: "Sebelum menyerahkan kode, lalui daftar periksa pendek ini: tiap fungsi punya satu tujuan dan namanya jujur, parameter dan nilai balik beranotasi, kasus batas tercakup oleh test, dan nilai tetap tidak berhamburan sebagai string ajaib.\n\nMenulis test sebelum implementasi terasa terbalik di awal, tapi manfaatnya nyata: assert menjadi spesifikasi yang bisa dijalankan. Pada latihan ini batas kelulusan 85, 70, dan 60 sudah tertulis di fungsi `uji_klasifikasi`, dan tugasmu memenuhi kontrak itu, bukan menemukannya sendiri.\n\nBaca assert dari atas ke bawah: tiap barisnya mengunci satu batas. Bila implementasimu melanggar satu saja, AssertionError menyebut barisnya, dan perbaikan tinggal mengikuti arah yang sudah ditentukan test.",
          code: {
            language: "python",
            content:
              'def uji_klasifikasi():\n    assert klasifikasi(95) == "A"\n    assert klasifikasi(59) == "D"',
            caption: "Dua assert ini sudah menyimpan dua batas: 85 dan 60.",
          },
        },
        {
          kind: "code",
          title: "Klasifikasi nilai teruji",
          prompt:
            "Isi batas yang hilang pada `klasifikasi` sampai seluruh assert di `uji_klasifikasi` lulus, lalu program mencetak klasifikasi dari nilai input. Perhatikan: 85 harus tetap masuk A, dan 60 masuk C.",
          mode: "fill",
          template:
            'def klasifikasi(nilai: int) -> str:\n    if nilai >= ___:\n        return "A"\n    if nilai >= 70:\n        return "B"\n    if nilai >= ___:\n        return "C"\n    return "D"\n\ndef uji_klasifikasi():\n    assert klasifikasi(95) == "A"\n    assert klasifikasi(85) == "A"\n    assert klasifikasi(70) == "B"\n    assert klasifikasi(60) == "C"\n    assert klasifikasi(59) == "D"\n\nuji_klasifikasi()\nprint("test lulus")\nprint(klasifikasi(int(input())))',
          solution:
            'def klasifikasi(nilai: int) -> str:\n    if nilai >= 85:\n        return "A"\n    if nilai >= 70:\n        return "B"\n    if nilai >= 60:\n        return "C"\n    return "D"\n\ndef uji_klasifikasi():\n    assert klasifikasi(95) == "A"\n    assert klasifikasi(85) == "A"\n    assert klasifikasi(70) == "B"\n    assert klasifikasi(60) == "C"\n    assert klasifikasi(59) == "D"\n\nuji_klasifikasi()\nprint("test lulus")\nprint(klasifikasi(int(input())))',
          tests: [
            { stdin: "95", expectedOutput: "test lulus\nA" },
            { stdin: "70", expectedOutput: "test lulus\nB" },
            { stdin: "59", expectedOutput: "test lulus\nD", hidden: true },
          ],
          hints: [
            "Baca assert-nya: 85 harus tetap A, jadi batas A tidak boleh berada di atas 85.",
            'Batas C dipisahkan dari D oleh assert klasifikasi(60) == "C".',
          ],
        },
      ],
    },
    // ==== Modul 9: Menuju Proyek Lapangan ====
    {
      slug: "struktur-proyek-cli",
      title: "Anatomi Aplikasi CLI",
      summary: "Susun program baris perintah menjadi lapisan: entri tipis, inti murni, tes terpisah.",
      steps: [
        {
          kind: "theory",
          title: "Pisahkan entri dari inti",
          body: 'Aplikasi CLI yang nyaman dirawat memisahkan tiga urusan: lapisan entri yang membaca `sys.argv` dan menampilkan hasil, logika inti yang murni (terima data, kembalikan hasil), dan pengujian yang menyasar logika inti. Fungsi `main()` dibuat tipis karena tugasnya hanya merangkai ketiganya.\n\nStruktur folder khasnya: paket bernama sama dengan aplikasi berisi `cli.py` dan modul inti, folder `tests/` untuk pengujian, ditambah README yang menjelaskan cara pakai. Logika inti tidak memanggil print dan tidak menyentuh argv, sehingga bisa diuji cepat tanpa menyalakan terminal.\n\nPembagian ini terasa nilainya saat aplikasi membesar: menambah opsi CLI hanya menyentuh `cli.py`, mengubah aturan laporan hanya menyentuh modul inti, dan test tetap berjalan kilat karena tidak mensimulasikan apa pun.',
          code: {
            language: "python",
            content:
              '# cli.py: entri yang tipis\nimport sys\n\ndef main() -> None:\n    argumen = sys.argv[1:]\n    hasil = proses(argumen)  # logika inti, murni\n    print(hasil)\n\nif __name__ == "__main__":\n    main()',
            caption: "main membaca dunia luar; proses tidak menyentuhnya sama sekali.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa logika inti sebaiknya tidak memanggil print atau membaca sys.argv?",
          options: [
            "Agar program berjalan lebih cepat",
            "Supaya bisa diuji dan dipakai ulang tanpa menjalankan CLI",
            "Karena print melanggar konvensi PEP 8",
            "Supaya berkas utamanya tetap kecil",
          ],
          answer: 1,
          explanation:
            "Fungsi murni yang menerima data dan mengembalikan hasil bisa dites langsung dan dipanggil dari mana saja. Ketergantungan pada argv dan print hanya sah di lapisan entri.",
        },
        {
          kind: "quiz",
          question: 'Baris `if __name__ == "__main__":` di cli.py berfungsi untuk...',
          options: [
            "Menandai folder sebagai paket",
            "Menjalankan main hanya saat berkas dieksekusi langsung, bukan saat diimpor",
            "Mendaftarkan opsi CLI",
            "Memisahkan tes dari kode utama",
          ],
          answer: 1,
          explanation:
            "Idiom ini menjaga main() hanya berjalan saat berkas dieksekusi sebagai program. Saat diimpor untuk diuji, isinya tidak ikut terpanggil.",
        },
      ],
    },
    {
      slug: "sys-argv-parsing",
      title: "Mengurai sys.argv Manual",
      summary: "Baca argumen mentah dari sys.argv dan pisahkan flag dari argumen posisi.",
      steps: [
        {
          kind: "theory",
          title: "Argumen mentah berupa list",
          body: "`sys.argv` adalah list berisi seluruh token baris perintah: indeks 0 berisi nama program, sisanya argumen pengguna. Perintah `python salin.py a.txt b.txt` menghasilkan `['salin.py', 'a.txt', 'b.txt']`, jadi argumen pertama pengguna selalu ada di `sys.argv[1]`.\n\nMengurai manual berarti menetapkan sendiri aturannya: token mana yang berupa flag diawali `--`, mana nilai flag, mana argumen posisi. Pola yang umum: satu loop dengan indeks, atau dua wadah, list untuk flag dan list untuk argumen posisi.\n\nSiapkan selalu jalur untuk input kosong: `len(sys.argv) == 1` berarti tidak ada argumen sama sekali, dan program yang sopan menampilkan cara pakai lalu keluar, bukan mati dengan IndexError. Catatan untuk latihan di platform ini: judge mengirim input lewat stdin, jadi argumen disimulasikan sebagai baris pertama stdin.",
          code: {
            language: "python",
            content:
              'import sys\n\n# python rapor.py --ringkas laporan.txt\nargumen = sys.argv[1:]\nflag = []\nposisi = []\nfor token in argumen:\n    if token.startswith("--"):\n        flag.append(token)\n    else:\n        posisi.append(token)\nprint(flag)     # [\'--ringkas\']\nprint(posisi)   # [\'laporan.txt\']',
            caption: "argv[1:] membuang nama program; tiap token lalu masuk wadahnya.",
          },
        },
        {
          kind: "quiz",
          question: "Perintah `python salin.py asal.txt tujuan.txt` membuat len(sys.argv) bernilai...",
          options: ["1", "2", "3", "4"],
          answer: 2,
          explanation:
            "argv memuat nama program ditambah dua argumen: ['salin.py', 'asal.txt', 'tujuan.txt'], total tiga token.",
        },
        {
          kind: "code",
          title: "Pengurai flag dan posisi",
          prompt:
            'Baris pertama stdin berisi argumen ala CLI dan bisa kosong. Flag `--besar` membuat hasil dicetak kapital semua; token sisanya adalah teks posisi yang digabung dengan spasi. Cetak `hasil: <teks>`.',
          mode: "fill",
          template:
            'import sys\n\ntokens = sys.stdin.readline().split()\nbesar = ___\nposisi = []\nfor token in tokens:\n    if token ___ "--besar":\n        besar = True\n    else:\n        posisi.append(token)\n\nteks = " ".join(posisi)\nif besar:\n    teks = teks.___()\nprint(f"hasil: {teks}")',
          solution:
            'import sys\n\ntokens = sys.stdin.readline().split()\nbesar = False\nposisi = []\nfor token in tokens:\n    if token == "--besar":\n        besar = True\n    else:\n        posisi.append(token)\n\nteks = " ".join(posisi)\nif besar:\n    teks = teks.upper()\nprint(f"hasil: {teks}")',
          tests: [
            { stdin: "--besar halo dunia", expectedOutput: "hasil: HALO DUNIA" },
            { stdin: "halo dunia", expectedOutput: "hasil: halo dunia" },
            { stdin: "satu", expectedOutput: "hasil: satu", hidden: true },
          ],
          hints: [
            "Sebelum loop berjalan, belum ada flag yang terlihat: nilai awalnya False.",
            "Flag dikenali dari kesamaan token dengan teks --besar; konversi kapital memakai metode upper.",
          ],
        },
      ],
    },
    {
      slug: "http-urllib",
      title: "HTTP dengan urllib",
      summary: "Ambil data lewat HTTP dengan stdlib, lalu olah respons JSON-nya.",
      steps: [
        {
          kind: "theory",
          title: "Permintaan GET satu fungsi",
          body: '`urllib.request.urlopen("https://api.contoh.id/cuaca")` mengirim permintaan GET dan mengembalikan objek respons. Properti `status` memuat kode HTTP, dengan 200 berarti sukses, dan `read()` mengambil isi tubuh respons dalam bentuk `bytes`. Dibungkus `with`, koneksi tertutup otomatis seperti berkas.\n\nIsi respons dari API umumnya JSON. `json.loads` menerimanya langsung, baik berupa bytes maupun str, dan mengembalikan dict yang siap diakses. Jaringan tidak tersedia di judge platform ini, jadi latihan kodenya menyimulasikan tahap sesudah respons tiba: teks JSON dibaca dari stdin lalu diurai dengan pola yang sama persis.\n\nDi dunia nyata, panggilan jaringan selalu dibungkus try/except: `URLError` saat tak terhubung dan `HTTPError` saat server menjawab kode galat, keduanya dari modul `urllib.error`. Layanan eksternal adalah dunia luar, dan dunia luar sering gagal menjawab.',
          code: {
            language: "python",
            content:
              'import json\nfrom urllib.request import urlopen\n\nwith urlopen("https://api.contoh.id/cuaca") as respons:\n    if respons.status == 200:\n        data = json.loads(respons.read())\n        print(data["kota"])',
            caption: "respons.read() menghasilkan bytes, dan json.loads menerimanya langsung.",
          },
        },
        {
          kind: "quiz",
          question: "Apa tipe hasil `respons.read()` dari objek urlopen?",
          options: ["str", "bytes", "dict yang sudah diurai", "list of bytes"],
          answer: 1,
          explanation:
            'read() mengembalikan bytes mentah. json.loads menerima bytes langsung; bila akan dipakai sebagai teks, decode dulu dengan .decode("utf-8").',
        },
        {
          kind: "code",
          title: "Urai respons JSON",
          prompt:
            'Anggap stdin adalah tubuh respons API. Bila `status` bernilai "ok", cetak `<kota>: <suhu> derajat` dari isi `data`. Selain itu cetak `galat: <pesan>`.',
          mode: "fill",
          template:
            "import json\n\nrespons = json.___(input())\nif respons[\"status\"] ___ \"ok\":\n    data = respons[\"data\"]\n    print(f\"{data['kota']}: {data['suhu']} derajat\")\nelse:\n    print(f\"galat: {respons['pesan']}\")",
          solution:
            'import json\n\nrespons = json.loads(input())\nif respons["status"] == "ok":\n    data = respons["data"]\n    print(f"{data[\'kota\']}: {data[\'suhu\']} derajat")\nelse:\n    print(f"galat: {respons[\'pesan\']}")',
          tests: [
            {
              stdin: '{"status":"ok","data":{"kota":"Bandung","suhu":27}}',
              expectedOutput: "Bandung: 27 derajat",
            },
            {
              stdin: '{"status":"gagal","pesan":"waktu tunggu habis"}',
              expectedOutput: "galat: waktu tunggu habis",
            },
            {
              stdin: '{"status":"ok","data":{"kota":"Medan","suhu":31}}',
              expectedOutput: "Medan: 31 derajat",
              hidden: true,
            },
          ],
          hints: [
            "Fungsi json yang mengurai teks JSON bernama loads.",
            'Bandingkan status dengan kesamaan nilai: == "ok".',
          ],
        },
      ],
    },
    {
      slug: "env-var-konfigurasi",
      title: "Konfigurasi Environment Variable",
      summary: "Baca pengaturan dari lingkungan dengan nilai bawaan yang aman.",
      steps: [
        {
          kind: "theory",
          title: "Pengaturan di luar kode",
          body: 'Nilai yang berbeda antar mesin, seperti alamat server, level log, atau kunci akses, jangan ditulis mati di kode. Tempat wajarnya environment variable: pasangan kunci dan nilai yang disetel di lingkungan tempat program berjalan, dan dibaca lewat `os.environ` yang berperilaku seperti dict.\n\nAkses yang aman memakai `os.environ.get("KUNCI", "bawaan")`: bila kunci tidak ada, bawaan dipakai dan program tetap hidup. Akses `os.environ["KUNCI"]` langsung justru melempar KeyError saat kunci absen; itu hanya layak untuk nilai yang memang wajib ada.\n\nProgram lapangan menyusun lapisan: environment variable menang paling atas, di bawahnya berkas konfigurasi, dan paling bawah nilai bawaan di kode. Latihan berikut menyimulasikan dua lapis: environment (yang di judge kosong) lalu satu baris konfigurasi dari stdin.',
          code: {
            language: "python",
            content:
              'import os\n\nalamat = os.environ.get("SERVER_ALAMAT", "localhost:8000")\nprint(f"menyambung ke {alamat}")',
            caption: "Tanpa SERVER_ALAMAT di lingkungan, program tetap berjalan dengan bawaan.",
          },
        },
        {
          kind: "quiz",
          question: "Kunci SERVER_PORT belum diatur di lingkungan. Baris mana yang tidak menghentikan program?",
          options: [
            'os.environ["SERVER_PORT"]',
            'os.environ.get("SERVER_PORT", "8080")',
            'os.environ.get("SERVER_PORT") yang dipakai langsung tanpa cek',
            'os.environ.pop("SERVER_PORT")',
          ],
          answer: 1,
          explanation:
            'get dengan nilai bawaan mengembalikan "8080" saat kunci absen. Dua pilihan lain melempar KeyError karena kuncinya tidak ada.',
        },
        {
          kind: "code",
          title: "Tiga lapis konfigurasi",
          prompt:
            'Lengkapi urutan baca level log: ambil `APP_LEVEL` dari environment; bila kosong, baca satu baris konfigurasi dari stdin; bila baris itu juga kosong, pakai bawaan "info". Cetak `level log: <nilai>`. Di judge, APP_LEVEL tidak diatur.',
          mode: "fill",
          template:
            'import os\nimport sys\n\ndef ambil_level() -> str:\n    dari_env = os.environ.___("APP_LEVEL")\n    if dari_env:\n        return dari_env\n    dari_file = sys.stdin.read().___()\n    if dari_file:\n        return dari_file\n    ___ "info"\n\nprint(f"level log: {ambil_level()}")',
          solution:
            'import os\nimport sys\n\ndef ambil_level() -> str:\n    dari_env = os.environ.get("APP_LEVEL")\n    if dari_env:\n        return dari_env\n    dari_file = sys.stdin.read().strip()\n    if dari_file:\n        return dari_file\n    return "info"\n\nprint(f"level log: {ambil_level()}")',
          tests: [
            { stdin: "", expectedOutput: "level log: info" },
            { stdin: "debug", expectedOutput: "level log: debug" },
            { stdin: "warning", expectedOutput: "level log: warning", hidden: true },
          ],
          hints: [
            "Metode dict yang menyediakan nilai bila kunci absen adalah get.",
            "Baris konfigurasi perlu dibersihkan dari spasi dan newline dengan strip; nilai bawaan dikirim dengan return.",
          ],
        },
      ],
    },
    {
      slug: "proyek-laporan-statistik",
      title: "Mini Proyek: Laporan Statistik",
      summary: "Program utuh dari data stdin: min, max, rata-rata, dan median dengan fungsi murni.",
      steps: [
        {
          kind: "theory",
          title: "Rencanakan kontraknya dulu",
          body: "Program kecil pun layak direncanakan lewat kontraknya: masukan berupa satu bilangan n diikuti n bilangan bulat, satu per baris; keluaran empat baris berlabel min, max, rata, dan median. Kontrak yang jelas membuat test bisa ditulis bahkan sebelum kode ada.\n\nMedian sedikit licik: data berjumlah ganjil punya satu nilai tengah, data genap harus merata-ratakan dua nilai tengah. Simpan logika ini di fungsi murni `median(angka)` agar bisa diuji terpisah, persis pola extract function dari modul sebelumnya.\n\nFormat angka menentukan bentuk akhir: min dan max dicetak sebagai bilangan bulat, sedangkan rata dan median dua angka desimal dengan `:.2f`. Uji dulu kasus satu elemen dan jumlah genap, dua kasus yang paling sering menyandung.",
          code: {
            language: "python",
            content:
              "urut = sorted([4, 10, 7])    # [4, 7, 10]\ntengah = len(urut) // 2      # indeks 1\nprint(urut[tengah])          # 7, median untuk jumlah ganjil",
            caption: "Untuk jumlah genap, rata-ratakan urut[tengah - 1] dan urut[tengah].",
          },
        },
        {
          kind: "code",
          title: "Susun laporannya",
          prompt:
            "Lengkapi program laporan: fungsi `median` wajib menangani jumlah data ganjil maupun genap, dan keluaran empat baris mengikuti format yang sudah tersedia di template.",
          mode: "fill",
          template:
            'def median(angka: list[int]) -> float:\n    urut = ___(angka)\n    tengah = len(urut) // 2\n    if len(urut) % 2 ___ 1:\n        return urut[tengah]\n    return (urut[tengah - 1] + urut[tengah]) / ___\n\nn = int(input())\nangka = [int(input()) for _ in range(n)]\nprint(f"min: {min(angka)}")\nprint(f"max: {max(angka)}")\nprint(f"rata: {sum(angka) / n:.2f}")\nprint(f"median: {median(angka):.2f}")',
          solution:
            'def median(angka: list[int]) -> float:\n    urut = sorted(angka)\n    tengah = len(urut) // 2\n    if len(urut) % 2 == 1:\n        return urut[tengah]\n    return (urut[tengah - 1] + urut[tengah]) / 2\n\nn = int(input())\nangka = [int(input()) for _ in range(n)]\nprint(f"min: {min(angka)}")\nprint(f"max: {max(angka)}")\nprint(f"rata: {sum(angka) / n:.2f}")\nprint(f"median: {median(angka):.2f}")',
          tests: [
            { stdin: "3\n4\n10\n7", expectedOutput: "min: 4\nmax: 10\nrata: 7.00\nmedian: 7.00" },
            { stdin: "4\n2\n8\n-3\n9", expectedOutput: "min: -3\nmax: 9\nrata: 4.00\nmedian: 5.00" },
            { stdin: "1\n5", expectedOutput: "min: 5\nmax: 5\nrata: 5.00\nmedian: 5.00", hidden: true },
          ],
          hints: [
            "Median dihitung dari data yang sudah terurut; sorted mengembalikan urutan baru tanpa mengubah aslinya.",
            "Ganjil dicek dengan sisa bagi 2; jumlah genap merata-ratakan dua nilai tengah, dibagi 2.",
          ],
        },
      ],
    },
    {
      slug: "proyek-csv-ke-json",
      title: "Mini Proyek: CSV ke JSON",
      summary: "Rangkai csv.DictReader dan json.dumps menjadi pengonversi baris perintah.",
      steps: [
        {
          kind: "theory",
          title: "Pipa tiga tahap: baca, ubah, keluarkan",
          body: "Pengonversi data punya bentuk yang sama dengan program lapangan pada umumnya: baca, ubah, keluarkan. Baca dengan `csv.DictReader(sys.stdin)`: baris pertama menjadi nama kolom, tiap baris berikutnya menjadi dict. Ubah bila perlu, lalu keluarkan dengan `json.dumps`.\n\nSatu hal yang sering mengejutkan: DictReader menghasilkan semua nilai berupa str, termasuk yang terlihat seperti angka. Bila keluaran memang harus bertipe angka, konversi secara eksplisit per kolom dengan `int()` atau `float()`; kolom teks dibiarkan tetap str.\n\n`json.dumps(data, ensure_ascii=False)` menghasilkan satu baris JSON kompak, dan parameter `ensure_ascii=False` menjaga huruf non-ASCII tampil apa adanya alih-alih menjadi urutan \\u.... Untuk berkas yang akan dibaca manusia, tambahkan `indent=2`.",
          code: {
            language: "python",
            content:
              'import csv\nimport json\nimport sys\n\npembaca = csv.DictReader(sys.stdin)\nfor baris in pembaca:\n    baris["umur"] = int(baris["umur"])',
            caption: "DictReader memberi dict per baris; konversi tipe dilakukan per kolom secara eksplisit.",
          },
        },
        {
          kind: "quiz",
          question: "Kolom populasi berisi 2500. Setelah lewat csv.DictReader, nilainya bertipe...",
          options: ["int", "float", "str", "tergantung isinya"],
          answer: 2,
          explanation:
            "CSV adalah teks murni; DictReader tidak menebak tipe. Semua nilai keluar sebagai str sampai kamu mengonversinya sendiri.",
        },
        {
          kind: "code",
          title: "Konversi CSV ke JSON",
          prompt:
            "Stdin berisi CSV dengan baris pertama sebagai kepala kolom. Ubah menjadi JSON: satu baris keluaran berisi array of object dengan urutan kunci mengikuti kepala kolom. Pakai `DictReader` dan `dumps` dengan `ensure_ascii=False`.",
          mode: "fill",
          template:
            "import csv\nimport json\nimport sys\n\npembaca = csv.___(sys.stdin)\ndata = [dict(baris) for baris in pembaca]\nprint(json.___(data, ensure_ascii=False))",
          solution:
            'import csv\nimport json\nimport sys\n\npembaca = csv.DictReader(sys.stdin)\ndata = [dict(baris) for baris in pembaca]\nprint(json.dumps(data, ensure_ascii=False))',
          tests: [
            {
              stdin: "nama,peran\nAni,backend\nBudi,frontend",
              expectedOutput:
                '[{"nama": "Ani", "peran": "backend"}, {"nama": "Budi", "peran": "frontend"}]',
            },
            {
              stdin: "kota,populasi\nBandung,2500\nSolo,600",
              expectedOutput: '[{"kota": "Bandung", "populasi": "2500"}, {"kota": "Solo", "populasi": "600"}]',
            },
            {
              stdin: "id,produk\n1,Kopi",
              expectedOutput: '[{"id": "1", "produk": "Kopi"}]',
              hidden: true,
            },
          ],
          hints: [
            "Kelas csv yang membaca baris sebagai dict bernama DictReader.",
            "Metode json untuk menuang objek menjadi teks JSON bernama dumps.",
          ],
        },
      ],
    },
    {
      slug: "proyek-menu-cli",
      title: "Mini Proyek: Menu CLI",
      summary: "Loop perintah interaktif: tambah, hapus, lihat, selesai dijalankan lewat stdin.",
      steps: [
        {
          kind: "theory",
          title: "Loop perintah dengan sinyal berhenti",
          body: 'Program interaktif bekerja seperti mesin: baca satu perintah, kerjakan, tampilkan hasil, lalu tunggu perintah berikutnya sampai pengguna mengetik kata berhenti. Pola ini disebut command loop, dan di judge platform ini urutan perintah dikirim sebagai baris-baris stdin.\n\nTiap baris dipecah dengan `split(maxsplit=1)` sehingga aksi dan sisanya terpisah: `tambah apel` menjadi aksi "tambah" dan argumen "apel". Aksi tanpa argumen seperti `lihat` dan `selesai` cukup dibandingkan dari kata pertamanya.\n\nKata berhenti ditangani dengan `break` agar loop selesai dengan bersih. Aksi `hapus` atas item yang tidak ada sebaiknya diabaikan saja, bukan meledak jadi error: program interaktif tidak boleh mati karena satu perintah aneh.',
          code: {
            language: "python",
            content:
              'while True:\n    baris = input()\n    if baris == "selesai":\n        break\n    print(f"mengerjakan: {baris}")',
            caption: "Kata berhenti ditangani dengan break; sisanya diproses biasa.",
          },
        },
        {
          kind: "quiz",
          question: 'Pada `"tambah apel merah".split(maxsplit=1)`, hasilnya...',
          options: [
            "['tambah', 'apel', 'merah']",
            "['tambah', 'apel merah']",
            "['tambah apel', 'merah']",
            "['tambah', 'apel merah', '']",
          ],
          answer: 1,
          explanation:
            "maxsplit=1 membatasi pemecahan hanya sekali, sehingga sisa teks utuh sebagai satu argumen.",
        },
        {
          kind: "code",
          title: "Keranjang belanja interaktif",
          prompt:
            'Baca perintah dari stdin sampai baris `selesai`. Aksi: `tambah <item>` memasukkan ke keranjang, `hapus <item>` membuangnya bila ada (abaikan bila tidak ada), `lihat` mencetak isi dipisah ", " atau `(kosong)` bila kosong, `selesai` menghentikan program.',
          mode: "fill",
          template:
            'import sys\n\ndef jalankan(perintah: list[str]) -> None:\n    keranjang: list[str] = []\n    for baris in perintah:\n        bagian = baris.split(maxsplit=1)\n        aksi = bagian[0]\n        if aksi == "tambah":\n            keranjang.___(bagian[1])\n        elif aksi == "hapus":\n            if bagian[1] ___ keranjang:\n                keranjang.remove(bagian[1])\n        elif aksi == "lihat":\n            if keranjang:\n                print(", ".join(keranjang))\n            else:\n                print("(kosong)")\n        elif aksi == "selesai":\n            ___\n\njalankan(sys.stdin.read().splitlines())',
          solution:
            'import sys\n\ndef jalankan(perintah: list[str]) -> None:\n    keranjang: list[str] = []\n    for baris in perintah:\n        bagian = baris.split(maxsplit=1)\n        aksi = bagian[0]\n        if aksi == "tambah":\n            keranjang.append(bagian[1])\n        elif aksi == "hapus":\n            if bagian[1] in keranjang:\n                keranjang.remove(bagian[1])\n        elif aksi == "lihat":\n            if keranjang:\n                print(", ".join(keranjang))\n            else:\n                print("(kosong)")\n        elif aksi == "selesai":\n            break\n\njalankan(sys.stdin.read().splitlines())',
          tests: [
            {
              stdin: "tambah apel\ntambah jeruk\nlihat\nhapus apel\nlihat\nselesai",
              expectedOutput: "apel, jeruk\njeruk",
            },
            {
              stdin: "lihat\ntambah buku\nlihat\nselesai",
              expectedOutput: "(kosong)\nbuku",
            },
            {
              stdin: "tambah a\ntambah b\ntambah c\nhapus b\nlihat\nselesai",
              expectedOutput: "a, c",
              hidden: true,
            },
          ],
          hints: [
            "Memasukkan item ke list memakai append.",
            "Membuang item yang mungkin tidak ada perlu pengecekan keanggotaan dengan in; aksi selesai ditutup dengan break.",
          ],
        },
      ],
    },
    {
      slug: "ekosistem-python",
      title: "Ekosistem dan Arah Belajar",
      summary: "Pilih satu bidang untuk digarap serius: web, data, otomasi, atau pengujian.",
      steps: [
        {
          kind: "theory",
          title: "Satu bidang, satu pustaka utama",
          body: "Setelah dasar dan stdlib berdiri kokoh, kemajuan datang dari menggarap satu bidang sampai dalam, bukan mencoba semuanya sekaligus. Untuk web ada Flask dan FastAPI (API ringan) serta Django (aplikasi lengkap). Untuk data ada pandas dan NumPy. Untuk otomasi, kombinasi requests, pathlib, dan rich sudah menopang banyak skrip kantor. Untuk pengujian, pytest.\n\nSemua pustaka pihak ketiga tersedia di PyPI dan dipasang lewat pip di dalam virtualenv masing-masing proyek, seperti dibahas pada modul 6. Kalau butuh memilih pustaka, baca dokumentasi resminya, bukan rangkuman acak: dokumentasi selalu mengikuti versi terbaru, sementara tutorial lama sering menyisakan cara yang sudah usang.\n\nArah yang terbukti: pilih masalah milikmu sendiri, misalnya pencatat keuangan pribadi, pengingat tugas, atau pengolah data kelas, lalu bangun dengan satu bidang di atas. Proyek milik sendiri menjaga semangat jauh lebih lama daripada menyalin tutorial orang.",
          code: {
            language: "python",
            content:
              "# satu bidang, satu pustaka utama\n# web       -> fastapi, flask, django\n# data      -> pandas, numpy\n# otomasi   -> requests, rich\n# pengujian -> pytest",
            caption: "Pilih satu baris, garap sampai dalam, sisanya menyusul.",
          },
        },
        {
          kind: "quiz",
          question: "Semua paket pihak ketiga Python terkumpul di...",
          options: [
            "GitHub saja",
            "PyPI, dipasang lewat pip",
            "App Store",
            "Dokumentasi resmi Python",
          ],
          answer: 1,
          explanation:
            "PyPI (Python Package Index) adalah gudang paketnya, dan pip alat pasangnya. Git hanyalah alat kontrol versi, bukan gudang paket.",
        },
        {
          kind: "quiz",
          question: "Kamu hendak membuat API web kecil di Python. Pustaka yang paling tepat dari daftar ini?",
          options: ["pandas", "FastAPI", "pytest", "NumPy"],
          answer: 1,
          explanation:
            "FastAPI memang dirancang untuk API web. pandas dan NumPy urusan data, pytest urusan pengujian.",
        },
      ],
    },
    {
      slug: "membaca-dokumentasi",
      title: "Membaca Dokumentasi dan Kode Orang Lain",
      summary: "Jadikan dokumen resmi dan source code bahan belajar utama, bukan tempat terakhir.",
      steps: [
        {
          kind: "theory",
          title: "Tiga sumber, satu kebiasaan",
          body: "Dokumentasi resmi punya anatomi yang bisa dipelajari: tanda tangan fungsi beserta parameter dan tipenya, uraian perilaku, contoh yang bisa disalin, lalu bagian catatan dan peringatan yang sering menyelamatkan dari jebakan. Urutan membaca yang efisien: tanda tangan dulu, contoh berikutnya, uraian panjang belakangan.\n\nDua alat bawaan berperan saat offline: `help(objek)` menampilkan docstring dan tanda tangan, sedangkan `dir(objek)` mendaftar semua atribut dan metode. `dir(dict)` misalnya mengungkap metode yang belum pernah kamu pakai, yang bisa langsung diselidiki dengan help satu per satu.\n\nSource code pustaka populer di GitHub adalah bacaan lanjutan: mulai dari `__init__.py` untuk melihat antarmuka publiknya, ikuti satu fungsi sampai tuntas, dan jangan berharap paham semuanya sekaligus. Selain menjawab rasa penasaran, membaca kode orang lain memberi contoh gaya yang bisa dibawa ke kodemu.",
          code: {
            language: "python",
            content:
              "help(dict.get)   # tanda tangan dan docstring method get\nprint(dir(str))  # semua metode str, termasuk yang belum kamu kenal",
            caption: "Dua panggilan ini mengubah interpreter jadi kamus yang selalu siap.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang ditampilkan `help(str.strip)`?",
          options: [
            "Kode sumber lengkap metode strip",
            "Docstring: tanda tangan dan uraian cara pakai",
            "Daftar semua metode str",
            "Halaman web dokumentasi resmi",
          ],
          answer: 1,
          explanation:
            "help menampilkan docstring objek, termasuk tanda tangan dan uraian parameternya. Daftar metode adalah pekerjaan dir().",
        },
        {
          kind: "quiz",
          question: "`dir(dict)` mengembalikan...",
          options: [
            "Isi sebuah dict",
            "Daftar atribut dan metode milik tipe dict",
            "Dokumentasi modul dict",
            "Error, karena dict adalah tipe bawaan",
          ],
          answer: 1,
          explanation:
            "dir() mendaftar seluruh atribut dan metode yang bisa diakses dari objek atau tipenya.",
        },
      ],
    },
    {
      slug: "rekap-jalur-python",
      title: "Rekap dan Langkah Berikutnya",
      summary: "Rangkum perjalanan sepuluh modul dan putuskan langkah nyata setelah jalur ini.",
      steps: [
        {
          kind: "theory",
          title: "Sepuluh modul dalam satu halaman",
          body: "Perjalanan sepuluh modul ini bisa dirangkum satu tarikan napas: idiom dan koleksi inti membuat kode ringkas; fungsi, exception, dan OOP memberi struktur; modul, paket, dan virtualenv memberi tempat berteduh; file, datetime, collections, itertools, re, logging, dan argparse melengkapi peralatan kerja; type hints, enum, test, debugging, dan refactoring menjaga mutu; lalu CLI, HTTP, dan konfigurasi menyiapkan program untuk dipakai orang lain.\n\nTiga kebiasaan yang membedakan penonton dari pelaku: menulis test sejak fungsi pertama, memeriksa tipe dengan alat statis, dan membaca ulang kode sendiri seminggu kemudian untuk merapikannya. Ketiganya murah bila dilakukan sejak sekarang, dan mahal sekali bila ditunda.\n\nLangkah berikutnya yang konkret: bangun satu proyek CLI utuh milikmu, misalnya pencatat pengeluaran atau pembaca RSS, dalam repositori sendiri dengan README, test, dan konfigurasi environment variable. Setelah jalan, minta orang lain memakainya lalu perbaiki dari masukan mereka. Jalur ini selesai; proyekmu yang melanjutkan.",
          code: {
            language: "python",
            content:
              "# kerangka proyek pertamamu\n# proyekku/\n#   pyproject.toml\n#   README.md\n#   proyekku/\n#     __init__.py\n#     cli.py\n#   tests/\n#     test_cli.py",
            caption: "Struktur ini dipakai dari proyek pertama sampai yang serius.",
          },
        },
        {
          kind: "quiz",
          question: "Kombinasi yang paling membuat refactoring bisa dilakukan tanpa rasa was-was adalah...",
          options: [
            "Komentar panjang di tiap baris",
            "Test yang lulus sebelum dan sesudah perubahan",
            "Nama variabel yang pendek-pendek",
            "Menghafal seluruh isi kode",
          ],
          answer: 1,
          explanation:
            "Test adalah bukti perilaku yang tidak berubah. Dengan jaring itu, mengubah struktur jadi pekerjaan rutin, bukan pertaruhan.",
        },
        {
          kind: "quiz",
          question: "Nilai yang berbeda antara mesin pengembang dan server produksi sebaiknya disimpan di...",
          options: [
            "Konstanta di dalam kode",
            "Environment variable dengan nilai bawaan yang aman",
            "Komentar di atas fungsi",
            "Nama berkas",
          ],
          answer: 1,
          explanation:
            "Environment variable membuat satu bangunan kode bisa jalan di mana-mana dengan pengaturan berbeda, dan nilai bawaan menjaga program tetap hidup saat kunci absen.",
        },
      ],
    },
  ],
};
