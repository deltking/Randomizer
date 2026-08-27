# Randomizer Kosakata Geodesi

Website statis (HTML/CSS/JS murni, tanpa build tool) untuk mengacak dan
melatih hafalan kosakata/istilah ilmu Geodesi — dikelompokkan per bagian
(fotogrametri, geodesi geometrik, hukum agraria, survei & pemetaan, geodesi
satelit, dan seterusnya).

## Menjalankan di komputer sendiri
Cukup buka `index.html` langsung di browser, atau jalankan server lokal
sederhana supaya font & path lebih rapi:

```bash
cd geodesi-randomizer
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

## Deploy ke GitHub Pages
1. Buat repository baru di GitHub (bisa public/private, Pages gratis untuk public).
2. Push semua isi folder ini ke branch `main`:
   ```bash
   git init
   git add .
   git commit -m "Randomizer kosakata geodesi"
   git branch -M main
   git remote add origin https://github.com/USERNAME/NAMA-REPO.git
   git push -u origin main
   ```
3. Di GitHub: **Settings → Pages → Build and deployment → Source**, pilih
   **Deploy from a branch**, branch `main`, folder `/ (root)`, lalu Save.
4. Setelah beberapa menit, situs aktif di:
   `https://USERNAME.github.io/NAMA-REPO/`

Tidak perlu backend/server apa pun — semuanya berjalan di browser pengguna.

## Cara menambah kosakata / bagian

Ada dua cara, bisa dipakai berbarengan:

### 1. Lewat tampilan web (cepat, tanpa buka kode)
- Klik **"+ Tambah Kosakata"** untuk menambah istilah ke bagian yang sedang
  dibuka.
- Klik **"+ Bagian baru"** di deretan tab untuk membuat kategori baru
  (misalnya "Kartografi", "Hidrografi", dll), lalu isi kosakatanya.
- Data ini tersimpan di `localStorage` browser kamu. Artinya **hanya
  tersimpan di perangkat/browser itu** dan bisa hilang jika cache
  dibersihkan.
- Supaya permanen dan ikut ter-deploy ke semua orang yang membuka situs,
  klik **"⇩ Export Kode Data"**, salin teksnya, lalu tempel untuk menimpa
  isi file `js/data.js` (lihat cara #2), commit, dan push lagi ke GitHub.

### 2. Langsung edit `js/data.js` (permanen, cara utama untuk kontribusi tetap)
Buka `js/data.js`. Setiap bagian adalah satu objek di dalam array
`GEODESI_DATA.categories`:

```js
{
  id: "fotogrametri",       // unik, huruf kecil, tanpa spasi
  name: "Fotogrametri",     // nama yang tampil
  symbol: "FG",             // kode singkat 2 huruf di tab
  description: "...",
  terms: [
    { term: "Ortofoto", definition: "Foto udara yang telah dikoreksi geometrik…" },
    // tambahkan baris baru di sini untuk kosakata baru
  ],
}
```

- **Menambah kosakata ke bagian yang sudah ada:** tambahkan objek
  `{ term: "...", definition: "..." }` baru di array `terms` bagian itu.
- **Menambah bagian baru:** salin (copy-paste) satu blok objek kategori,
  tempel sebagai anggota baru di array `categories`, lalu ubah isinya.
  `definition` boleh dikosongkan `""` kalau belum sempat ditulis.

Setelah `fotogrametri` diisi kosakata sungguhan darimu, tinggal tempel ke
array `terms` bagian `fotogrametri` — struktur dan tampilannya sudah siap
menampung.

## Struktur folder

```
geodesi-randomizer/
├── index.html          # struktur halaman
├── css/styles.css       # tampilan (tema "peta blueprint")
├── js/data.js           # ⭐ kosakata & bagian — ubah file ini untuk isi konten
├── js/storage.js        # logika tambah/gabung/export data dari localStorage
├── js/app.js            # logika tampilan, animasi dial, pencarian, modal
└── README.md
```

## Aksesibilitas & performa
- Menghormati preferensi *reduced motion* pengguna (animasi dial dilewati,
  hasil langsung tampil).
- Semua kontrol bisa dioperasikan dengan keyboard (dial bisa di-fokus dan
  ditekan Enter/Spasi).
- Tidak ada dependency eksternal selain Google Fonts — ringan dan cepat
  dimuat di GitHub Pages.
