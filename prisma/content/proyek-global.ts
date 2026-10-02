import type { GlobalProjectContent } from "./types";
import { makeStarters } from "./algoritma";

/**
 * Proyek lintas-bahasa: satu brief dan satu set ujian akhir untuk semua bahasa.
 * Starter discaffold per bahasa lewat makeStarters; solusi referensi python
 * diverifikasi mesin oleh scripts/verify-konten.ts sebelum seed.
 */

export const PROYEK_GLOBAL: GlobalProjectContent[] = [
  {
    slug: "kalkulator-diskon",
    title: "Kalkulator Diskon Kasir",
    summary: "Program struk sederhana: hitung total belanja lalu terapkan diskon.",
    brief:
      "Kamu diminta membuat program kasir kecil. Program membaca harga satuan barang, jumlah barang, dan persen diskon dari input, lalu menghitung total bayar.\n\nAturan diskon: total kotor (harga kali jumlah) dikurangi sesuai persen diskon. Semua data uji dijamin hasilnya bilangan bulat, jadi pembagian bulat biasa sudah cukup tanpa pembulatan.\n\n**Format input**\nBaris 1: harga satuan (int)\nBaris 2: jumlah barang (int)\nBaris 3: persen diskon (int, 0 sampai 100)\n\n**Format output**\nSatu baris: total bayar (int)",
    steps: [
      {
        title: "Rancang input dan output",
        detail:
          "Tentukan tiga variabel input dan satu keluaran. Tulis kerangka program yang membaca ketiga bilangan dari stdin.",
        hint: "Tiga nilai boleh dibaca tiga kali berurutan, atau sekaligus kalau bahasamu mendukungnya.",
      },
      {
        title: "Hitung total kotor",
        detail: "Kalikan harga satuan dengan jumlah barang, simpan di variabel total kotor.",
        hint: "total_kotor = harga * jumlah",
      },
      {
        title: "Terapkan diskon",
        detail:
          "Kurangi total kotor sesuai persen diskon. Persen berarti per seratus: kalikan (100 - diskon) dulu, baru bagi 100, supaya hasilnya tetap bilangan bulat.",
        hint: "total_bayar = total_kotor * (100 - diskon) / 100, dengan pembagian bulat",
      },
      {
        title: "Cetak dan uji dengan kasus nyata",
        detail:
          "Cetak total bayar. Uji dengan contoh: harga 25000, jumlah 3, diskon 20. Hasil yang benar: 60000. Lalu kumpulkan lewat tombol Kumpulkan di bawah.",
        hint: "Cetak angkanya saja tanpa teks tambahan, sesuai format keluaran.",
      },
    ],
    finalTests: [
      { stdin: "25000\n3\n20", expectedOutput: "60000" },
      { stdin: "10000\n2\n0", expectedOutput: "20000" },
      { stdin: "15000\n4\n25", expectedOutput: "45000" },
    ],
    refSolution:
      'import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    harga, jumlah, diskon = int(data[0]), int(data[1]), int(data[2])\n    total_kotor = harga * jumlah\n    print(total_kotor * (100 - diskon) // 100)\n\nmain()',
    xpReward: 300,
  },
  {
    slug: "penilaian-siswa",
    title: "Penilaian Siswa",
    summary: "Program penilaian ujian: rata-rata tiga nilai dan nilai hurufnya.",
    brief:
      "Kamu diminta membuat program penilaian untuk guru. Program membaca tiga nilai ujian dari input, menghitung rata-ratanya, lalu menentukan nilai huruf.\n\nAturan huruf: rata-rata 85 ke atas mendapat A, 70 sampai 84 mendapat B, 60 sampai 69 mendapat C, di bawah itu D.\n\n**Format input**\nBaris 1 sampai 3: nilai ujian (int)\n\n**Format output**\nBaris 1: `Rata-rata: <dua angka desimal>`\nBaris 2: `Nilai: <huruf>`",
    steps: [
      {
        title: "Rancang input dan output",
        detail:
          "Tentukan tiga variabel input dan dua keluaran. Tulis kerangka program yang membaca ketiga nilai.",
        hint: "Tiga baris input berarti tiga pembacaan berurutan, atau tiga token dari satu pembacaan penuh stdin.",
      },
      {
        title: "Hitung rata-rata",
        detail:
          "Jumlahkan ketiga nilai lalu bagi tiga. Pastikan pembagiannya menghasilkan pecahan, bukan dibuang sisa pembulatan.",
        hint: "Bagi dengan 3.0 (atau konversi ke pecahan dulu), bukan pembagian bulat dengan 3.",
      },
      {
        title: "Tentukan nilai huruf",
        detail:
          "Pakai percabangan bertingkat mulai dari syarat paling tinggi: 85 ke atas A, lalu 70 ke atas B, lalu 60 ke atas C, sisanya D.",
        hint: "Cek rata >= 85 dulu, baru turun; kalau dibalik urutannya, nilai 90 akan salah masuk B.",
      },
      {
        title: "Cetak dua desimal dan uji",
        detail:
          "Cetak rata-rata dengan dua angka desimal sesuai bahasamu (misal format %.2f atau padanannya), lalu baris hurufnya. Uji dengan nilai 85, 90, 88: rata-ratanya 87.67 dan hurufnya A. Lalu kumpulkan lewat tombol Kumpulkan di bawah.",
        hint: "Labelnya persis `Rata-rata: ` dan `Nilai: `, termasuk spasi setelah titik dua.",
      },
    ],
    finalTests: [
      { stdin: "85\n90\n88", expectedOutput: "Rata-rata: 87.67\nNilai: A" },
      { stdin: "70\n75\n65", expectedOutput: "Rata-rata: 70.00\nNilai: B" },
      { stdin: "40\n50\n45", expectedOutput: "Rata-rata: 45.00\nNilai: D" },
    ],
    refSolution:
      'import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    a, b, c = int(data[0]), int(data[1]), int(data[2])\n    rata = (a + b + c) / 3\n    if rata >= 85:\n        huruf = "A"\n    elif rata >= 70:\n        huruf = "B"\n    elif rata >= 60:\n        huruf = "C"\n    else:\n        huruf = "D"\n    print(f"Rata-rata: {rata:.2f}")\n    print(f"Nilai: {huruf}")\n\nmain()',
    xpReward: 300,
  },
  {
    slug: "konverter-detik",
    title: "Konverter Detik",
    summary: "Pengurai waktu: ubah total detik menjadi jam, menit, dan detik.",
    brief:
      "Kamu diminta membuat pengurai waktu untuk papan skor. Program membaca satu bilangan bulat berupa total detik, lalu mengurainya menjadi jam, menit, dan detik.\n\n**Format input**\nBaris 1: total detik (int, 0 sampai 86399)\n\n**Format output**\nSatu baris: `<h> jam <m> menit <s> detik`",
    steps: [
      {
        title: "Rancang input dan output",
        detail: "Baca satu bilangan dari input, lalu siapkan variabel jam, menit, dan detik.",
        hint: "Hanya ada satu bilangan, jadi satu pembacaan cukup.",
      },
      {
        title: "Pecah dengan bagi dan sisa bagi",
        detail:
          "Satu jam 3600 detik dan satu menit 60 detik. Operator pembagian bulat memberi hasil bagi dan operator sisa memberi sisanya.",
        hint: "jam = total / 3600 (bulat); sisa = total % 3600; menit = sisa / 60 (bulat); detik = sisa % 60.",
      },
      {
        title: "Bungkus dalam fungsi",
        detail:
          "Pindahkan perhitungan dan penyusunan kalimat ke sebuah fungsi yang menerima total detik dan mengembalikan kalimatnya, supaya mudah dipakai ulang.",
        hint: "Fungsi mengembalikan teks seperti `1 jam 1 menit 5 detik`, main yang mencetak.",
      },
      {
        title: "Cetak dan uji dengan kasus nyata",
        detail:
          "Cetak hasil fungsi dari main. Uji dengan input 3665 yang benar hasilnya 1 jam 1 menit 5 detik. Lalu kumpulkan lewat tombol Kumpulkan di bawah.",
        hint: "Jaga jarak satu spasi di tiap batas kata.",
      },
    ],
    finalTests: [
      { stdin: "3665", expectedOutput: "1 jam 1 menit 5 detik" },
      { stdin: "59", expectedOutput: "0 jam 0 menit 59 detik" },
      { stdin: "86399", expectedOutput: "23 jam 59 menit 59 detik" },
    ],
    refSolution:
      'import sys\n\ndef main():\n    total = int(sys.stdin.read().split()[0])\n    jam = total // 3600\n    sisa = total % 3600\n    menit = sisa // 60\n    detik = sisa % 60\n    print(f"{jam} jam {menit} menit {detik} detik")\n\nmain()',
    xpReward: 300,
  },
  {
    slug: "laporan-rapor-siswa",
    title: "Laporan Rapor Siswa",
    summary: "Program laporan kecil: baca nama dan tiga nilai, hitung rata-rata, tentukan kelulusan.",
    brief:
      "Kamu diminta membuat program laporan nilai. Program membaca nama siswa dan tiga nilai ujian, lalu mencetak laporan singkat.\n\nAturan kelulusan: rata-rata nilai 75 atau lebih berarti LULUS, selain itu TIDAK LULUS.\n\n**Format input**\nBaris 1: nama siswa (satu baris teks)\nBaris 2 sampai 4: tiga nilai ujian (int)\n\n**Format output**\nTiga baris:\n```\nNama: <nama>\nRata-rata: <rata-rata, dua angka desimal>\nStatus: LULUS atau TIDAK LULUS\n```",
    steps: [
      {
        title: "Baca input dan simpan nilainya",
        detail:
          "Nama dibaca sebagai SATU BARIS utuh (bisa mengandung spasi), lalu tiga nilai dibaca sebagai bilangan bulat. Simpan masing-masing di variabelnya sendiri.",
        hint: "Nama harus dibaca per baris, bukan per token, supaya nama dengan spasi tidak terpotong.",
      },
      {
        title: "Hitung rata-rata",
        detail: "Jumlahkan ketiga nilai lalu bagi tiga sebagai pecahan, dan simpan di variabel rata-rata.",
        hint: "Bagi dengan 3.0 atau konversi ke pecahan supaya tidak terpotong.",
      },
      {
        title: "Tentukan status kelulusan",
        detail: "Jika rata-rata 75 atau lebih statusnya LULUS, selain itu TIDAK LULUS. Simpan di variabel status.",
        hint: "Teks statusnya persis LULUS dan TIDAK LULUS, huruf besar semua.",
      },
      {
        title: "Cetak laporan dan uji dengan kasus nyata",
        detail:
          "Cetak tiga baris: nama, rata-rata dua desimal, dan status. Uji dengan contoh: Budi, nilai 80, 75, 86. Hasil yang benar: rata-rata 80.33, status LULUS. Lalu kumpulkan lewat tombol Kumpulkan di bawah.",
        hint: "Setiap bahasa punya cara format dua desimal masing-masing; cari padanan printf %.2f di bahasamu.",
      },
    ],
    finalTests: [
      { stdin: "Budi\n80\n75\n86", expectedOutput: "Nama: Budi\nRata-rata: 80.33\nStatus: LULUS" },
      { stdin: "Ani\n90\n90\n90", expectedOutput: "Nama: Ani\nRata-rata: 90.00\nStatus: LULUS" },
      { stdin: "Cika\n40\n50\n60", expectedOutput: "Nama: Cika\nRata-rata: 50.00\nStatus: TIDAK LULUS" },
    ],
    refSolution:
      'import sys\n\ndef main():\n    baris = sys.stdin.read().split("\\n")\n    nama = baris[0].strip()\n    a, b, c = int(baris[1]), int(baris[2]), int(baris[3])\n    rata = (a + b + c) / 3\n    status = "LULUS" if rata >= 75 else "TIDAK LULUS"\n    print(f"Nama: {nama}")\n    print(f"Rata-rata: {rata:.2f}")\n    print(f"Status: {status}")\n\nmain()',
    xpReward: 300,
  },
  {
    slug: "tagihan-listrik",
    title: "Tagihan Listrik Rumah",
    summary: "Program PLN mini: pilih tarif per golongan, kalikan pemakaian, lalu tambahkan abodemen.",
    brief:
      "Kamu diminta membuat program penghitung tagihan listrik. Program membaca golongan pelanggan dan jumlah pemakaian dalam kWh, lalu menghitung total tagihan.\n\nAturan: setiap golongan punya tarif per kWh dan biaya abodemen tetap.\n\n- Golongan 1: tarif 1000 per kWh, abodemen 15000\n- Golongan 2: tarif 1300 per kWh, abodemen 25000\n- Golongan 3: tarif 1500 per kWh, abodemen 40000\n\nTotal tagihan = tarif kali pemakaian, ditambah abodemen.\n\n**Format input**\nBaris 1: golongan (int, 1 sampai 3)\nBaris 2: pemakaian dalam kWh (int)\n\n**Format output**\nSatu baris: total tagihan (int)",
    steps: [
      {
        title: "Baca input dan siapkan variabel",
        detail: "Baca golongan dan pemakaian sebagai bilangan bulat, lalu siapkan variabel tarif dan abodemen.",
        hint: "Dua baris input, dua pembacaan.",
      },
      {
        title: "Tentukan tarif dan abodemen",
        detail:
          "Pakai percabangan untuk memilih nilai tarif dan abodemen sesuai golongan. Jangan sampai golongan 2 terlewat.",
        hint: "Cek golongan 1, lalu golongan 2, sisanya golongan 3.",
      },
      {
        title: "Hitung total tagihan",
        detail: "Kalikan tarif dengan pemakaian, lalu tambahkan abodemen. Simpan di variabel total.",
        hint: "total = tarif * kwh + abodemen",
      },
      {
        title: "Cetak dan uji dengan kasus nyata",
        detail:
          "Cetak total. Uji dengan contoh: golongan 1, pemakaian 100 kWh. Hasil yang benar: 115000. Lalu kumpulkan lewat tombol Kumpulkan di bawah.",
        hint: "Cetak angkanya saja tanpa teks tambahan.",
      },
    ],
    finalTests: [
      { stdin: "1\n100", expectedOutput: "115000" },
      { stdin: "2\n50", expectedOutput: "90000" },
      { stdin: "3\n25", expectedOutput: "77500" },
    ],
    refSolution:
      'import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    golongan, kwh = int(data[0]), int(data[1])\n    if golongan == 1:\n        tarif, abodemen = 1000, 15000\n    elif golongan == 2:\n        tarif, abodemen = 1300, 25000\n    else:\n        tarif, abodemen = 1500, 40000\n    print(tarif * kwh + abodemen)\n\nmain()',
    xpReward: 300,
  },
];

export function startersProyek(judul: string): Record<string, string> {
  return makeStarters(`Proyek: ${judul}. Tulis solusimu di bawah, baca input dari stdin.`);
}
