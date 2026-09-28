# Jelajah Bali — travel & rental kendaraan

Website gabungan **sewa motor/mobil + mobil dengan driver + paket tour** di Bali, plus **panel admin**. Desain mengikuti **Opsi A · Ocean & Sun** (font Outfit + Plus Jakarta Sans, navy / turquoise / kuning matahari).

> Status: **tahap 1 (MVP tampilan)**. Semua halaman jalan, booking dikirim lewat WhatsApp. Data masih file statis (belum pakai database), gambar masih ilustrasi placeholder, harga masih contoh.

## Jalanin di komputer

Butuh Node.js 20+.

```bash
npm install
npm run dev        # buka http://localhost:3000
npm run build      # cek build production
npm run lint
```

## Halaman

| Untuk tamu | Isi |
|---|---|
| `/` | Landing page: hero foto + kotak cari, 3 cara jelajah, top experiences, armada, trip planner, paket hemat, cara kerja, momen tamu, panduan Bali |
| `/rentals`, `/rentals/[slug]` | Daftar armada (filter motor/mobil, lepas kunci/dengan driver) + detail & form booking |
| `/tours`, `/tours/[slug]` | Daftar tour (filter kategori) + detail: galeri, itinerary, termasuk/tidak, cross-sell sewa motor, form booking |
| `/deals` | Paket hemat (bundling) + form booking |
| `/planner` | Trip planner: bandingin harga naik motor sendiri vs mobil + driver vs ikut tour |
| `/guide`, `/guide/[slug]` | Artikel panduan Bali |

| Panel admin (`/admin`) | Isi |
|---|---|
| Dashboard | KPI, jadwal armada mingguan (rental + tour + servis), perlu tindakan, pendapatan per layanan, serah terima hari ini |
| Booking | Tabel booking + filter status + cari |
| Kalender armada | Jadwal semua unit |
| Armada | Daftar unit, km, jadwal servis |
| Paket tour → Edit | Kelola foto cover & galeri (upload, geser urutan, jadikan cover, alt text), toggle tampil di homepage, preview kartu, checklist kualitas konten |
| Konten & foto | Foto header homepage (slideshow), foto per paket tour, foto armada |

Form booking di website **nggak butuh server**: semua isian dirangkum jadi pesan WhatsApp ke nomor bisnis.

## Yang wajib diganti sebelum live

- [ ] **Nama brand, nomor WhatsApp, email, alamat, Instagram** → `src/data/site.ts`
- [ ] **Harga** (masih contoh) → `src/data/vehicles.ts`, `src/data/tours.ts`, `src/data/combos.ts`
- [ ] **Foto**: taruh foto asli di `public/images/...`, lalu ganti path di `src/data/images.ts` (nama file & ukuran ada di halaman *Prompt Aset Foto*). Foto armada wajib foto unit asli.
- [ ] **Ulasan tamu asli** → `src/data/testimonials.ts` dan rating Google di `reviews` (`src/data/site.ts`). Selama kosong, bagian itu otomatis disembunyikan.
- [ ] **Panel admin belum ada login**. Jangan deploy `/admin` ke publik sebelum tahap 2 selesai.

## Struktur

```
src/
├── app/
│   ├── (site)/        # halaman tamu (header, footer, tombol WhatsApp)
│   ├── admin/         # panel admin (sidebar sendiri, noindex)
│   └── globals.css    # token warna & font Opsi A
├── components/        # kartu, form booking, section landing, komponen admin
├── data/              # semua konten & data contoh (ganti di sini)
└── lib/               # format Rupiah, link WhatsApp
```

## Tahap berikutnya

1. **Supabase**: tabel armada, tour, booking, pelanggan; login admin; upload foto ke Storage (galeri admin jadi tersimpan beneran).
2. **Kalender ketersediaan** real-time dari data booking, biar unit gak dobel.
3. **Pembayaran DP online** (Midtrans / Xendit: QRIS, VA, kartu).
4. **Dua bahasa** (EN / ID) dan pilihan mata uang.
5. **Deploy ke Vercel** + domain.

Stack: Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript.
