/**
 * =====================================================================
 *  DATA KOSAKATA GEODESI — data.js
 * =====================================================================
 *  Ini SATU-SATUNYA file yang perlu kamu ubah kalau mau menambah
 *  kosakata atau bagian (kategori) baru secara permanen (langsung
 *  tersimpan di kode, tidak hilang saat cache browser dibersihkan).
 *
 *  Kalau cuma mau coba-coba cepat tanpa edit kode, pakai tombol
 *  "+ Tambah Kosakata" / "+ Tambah Bagian" di halaman — data itu
 *  otomatis tersimpan di browser (localStorage) dan bisa di-export
 *  jadi potongan kode untuk ditempel ke sini kapan saja.
 *
 * ---------------------------------------------------------------------
 *  CARA MENAMBAH KOSAKATA BARU DI KATEGORI YANG SUDAH ADA:
 *  Cari kategori yang dituju di bawah, lalu tambahkan objek baru
 *  di dalam array "terms":
 *
 *      { term: "Ortofoto", definition: "Foto udara yang telah
 *        dikoreksi geometrik sehingga memiliki skala seragam." }
 *
 *  "definition" boleh dikosongkan ("") kalau belum sempat diisi.
 *
 * ---------------------------------------------------------------------
 *  CARA MENAMBAH BAGIAN (KATEGORI) BARU:
 *  Salin (copy) satu blok { id, name, symbol, description, terms }
 *  di bawah, tempel sebagai anggota baru di array GEODESI_DATA.categories,
 *  lalu ganti isinya. "id" harus unik (huruf kecil, tanpa spasi).
 * =====================================================================
 */

const GEODESI_DATA = {
  categories: [
    {
      id: "fotogrametri",
      name: "Fotogrametri",
      symbol: "FG",
      description: "Pengukuran & pemetaan dari foto udara / citra.",
      terms: [
        { term: "Stereoskopik", definition: "Kondisi dua foto bertampalan yang memungkinkan pengamatan tiga dimensi." },
        { term: "Titik Kontrol Tanah (GCP)", definition: "Titik di lapangan dengan koordinat diketahui untuk mengikat foto ke sistem koordinat." },
        { term: "Overlap", definition: "Persentase tampalan antar foto udara yang berurutan." },
        { term: "Ortofoto", definition: "Foto udara yang telah dikoreksi geometrik sehingga memiliki skala seragam." },
        { term: "Bundle Adjustment", definition: "Proses hitung perataan simultan seluruh parameter orientasi foto dan koordinat titik." },
        { term: "Wahana Tanpa Awak (UAV)", definition: "Pesawat/drone yang membawa kamera untuk akuisisi foto udara." },
        { term: "Digital Surface Model (DSM)", definition: "Model permukaan bumi termasuk objek di atasnya (bangunan, vegetasi)." },
        { term: "Digital Terrain Model (DTM)", definition: "Model permukaan tanah tanpa objek di atasnya." },
      ],
    },
    {
      id: "geodesi-geometrik",
      name: "Geodesi Geometrik",
      symbol: "GG",
      description: "Bentuk, ukuran bumi, dan sistem koordinat.",
      terms: [
        { term: "Ellipsoid Referensi", definition: "Model matematis bentuk bumi yang digunakan sebagai acuan hitungan." },
        { term: "Datum Geodetik", definition: "Kerangka acuan yang mendefinisikan posisi ellipsoid terhadap bumi nyata." },
        { term: "Geoid", definition: "Bidang ekuipotensial gravitasi bumi yang mendekati permukaan laut rata-rata." },
        { term: "Proyeksi UTM", definition: "Sistem proyeksi peta silinder transversal yang membagi bumi ke dalam zona-zona." },
        { term: "Azimuth", definition: "Sudut horizontal diukur searah jarum jam dari arah utara ke suatu arah target." },
        { term: "Poligon", definition: "Rangkaian titik-titik yang dihubungkan garis untuk kerangka kontrol horizontal." },
      ],
    },
    {
      id: "hukum-agraria",
      name: "Hukum Agraria",
      symbol: "HA",
      description: "Regulasi pertanahan dan kadaster.",
      terms: [
        { term: "Sertipikat Hak Milik", definition: "Bukti kepemilikan tanah dengan hak terkuat dan terpenuh menurut UUPA." },
        { term: "Bidang Tanah", definition: "Satuan terkecil objek pendaftaran tanah dengan batas-batas tertentu." },
        { term: "Kadaster", definition: "Sistem informasi pertanahan yang mencatat kepemilikan, nilai, dan penggunaan tanah." },
        { term: "UUPA", definition: "Undang-Undang Pokok Agraria (UU No. 5 Tahun 1960), dasar hukum pertanahan Indonesia." },
        { term: "Pendaftaran Tanah Sistematis Lengkap (PTSL)", definition: "Program percepatan pendaftaran seluruh bidang tanah dalam suatu wilayah." },
      ],
    },
    {
      id: "survei-pemetaan",
      name: "Survei & Pemetaan",
      symbol: "SP",
      description: "Pengukuran lapangan dan penyajian peta.",
      terms: [
        { term: "Total Station", definition: "Alat ukur elektronik yang menggabungkan pengukuran sudut dan jarak." },
        { term: "Benchmark (BM)", definition: "Titik tetap di lapangan dengan nilai koordinat/tinggi yang telah diketahui." },
        { term: "Waterpass", definition: "Metode pengukuran beda tinggi menggunakan alat sipat datar." },
        { term: "Skala Peta", definition: "Perbandingan jarak di peta dengan jarak sebenarnya di lapangan." },
      ],
    },
    {
      id: "geodesi-satelit",
      name: "Geodesi Satelit",
      symbol: "GS",
      description: "Penentuan posisi menggunakan satelit (GNSS).",
      terms: [
        { term: "GNSS", definition: "Global Navigation Satellite System, sistem satelit navigasi global (GPS, GLONASS, dll)." },
        { term: "RTK (Real Time Kinematic)", definition: "Metode penentuan posisi presisi tinggi secara real-time menggunakan koreksi diferensial." },
        { term: "CORS", definition: "Continuously Operating Reference Station, stasiun referensi GNSS yang beroperasi terus-menerus." },
        { term: "Ambiguitas Fase", definition: "Jumlah gelombang penuh yang belum diketahui antara satelit dan penerima GNSS." },
      ],
    },
  ],
};
