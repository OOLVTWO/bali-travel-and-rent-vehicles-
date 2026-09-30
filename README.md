# Jelajah Bali — travel & rental kendaraan

Website gabungan **sewa motor/mobil + mobil dengan driver + paket tour** di Bali, plus **panel admin**. Desain mengikuti **Opsi A · Ocean & Sun** (font Outfit + Plus Jakarta Sans, navy / turquoise / kuning matahari).

> Status: **tahap 2**. Data armada, tour, foto & booking disimpan di **Supabase**. Admin login pakai email + password. Booking dari website tersimpan ke database (dapat kode `BK-xxxx`) lalu tamu diarahkan ke WhatsApp. Gambar bawaan masih ilustrasi placeholder, harga masih contoh.

## Jalanin di komputer

Butuh Node.js 20+.

```bash
npm install
cp .env.example .env.local   # isi URL & publishable key Supabase
npm run dev                  # buka http://localhost:3000
npm run build                # cek build production
npm run lint
```

Tanpa `.env.local`, website tamu tetap jalan pakai data contoh di `src/data/` (panel admin butuh Supabase).

## Environment variables

| Nama | Isi |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key (`sb_publishable_…`) dari Supabase → Project Settings → API Keys |
| `NEXT_PUBLIC_SITE_URL` | Opsional. Alamat website buat sitemap & preview link. Default `https://bali-travel-rental.vercel.app`; isi kalau udah pakai domain sendiri (lalu Redeploy). |

Cuma pakai publishable key. **Jangan** taruh secret/service-role key di website — semua akses dijaga Row Level Security di database.

## Supabase

Skema ada di `supabase/migrations/` (urut sesuai nama file):

1. `…_schema.sql` — tabel `vehicles`, `fleet_units`, `tours`, `photos`, `bookings`, `admin_emails`, fungsi `create_booking` (dipanggil form booking publik), RLS, bucket Storage `photos` (publik, maks. 10 MB).
2. `…_seed_content.sql` — isi awal armada, tour & foto (sama dengan data contoh).
3. `…_private_is_admin.sql` — fungsi cek admin dipindah ke schema `private`.
4. `…_reviews.sql` — tabel `reviews` (ulasan tamu) & `site_settings` (rating Google).

Keamanan singkatnya: tamu cuma bisa **baca** armada/tour yang aktif dan **bikin booking** lewat `create_booking`. Baca/ubah booking, unit, harga & foto cuma bisa kalau email login ada di tabel `admin_emails`.

### Nambah admin

1. Buka `/admin/login` → **Bikin akun** pakai email & password.
2. Klik link konfirmasi di email.
3. Daftarkan email itu di Supabase → SQL Editor:
   ```sql
   insert into public.admin_emails (email) values ('email-admin@contoh.com');
   ```

Hapus akses: `delete from public.admin_emails where email = '…';`

### Setelah deploy (wajib)

Supabase → **Authentication → URL Configuration**:
- **Site URL** = alamat website (misal `https://nama-project.vercel.app`)
- **Redirect URLs** tambahkan `https://nama-project.vercel.app/**`

Kalau belum diatur, link konfirmasi email bakal ngarah ke `localhost`.

> Email bawaan Supabase dibatasi (beberapa email per jam) dan cuma buat testing. Buat banyak admin / produksi, pasang SMTP sendiri di Authentication → Emails.

## Halaman

| Untuk tamu | Isi |
|---|---|
| `/` | Landing page: slideshow foto header + kotak cari, 3 cara jelajah, top experiences, armada, trip planner, paket hemat, cara kerja, panduan Bali |
| `/rentals`, `/rentals/[slug]` | Daftar armada (filter motor/mobil, lepas kunci/dengan driver) + detail & form booking |
| `/tours`, `/tours/[slug]` | Daftar tour (filter kategori) + detail: galeri, itinerary, termasuk/tidak, cross-sell sewa motor, form booking |
| `/deals` | Paket hemat (bundling) + form booking |
| `/planner` | Trip planner: bandingin harga naik motor sendiri vs mobil + driver vs ikut tour |
| `/guide`, `/guide/[slug]` | Artikel panduan Bali |

| Panel admin (`/admin`, wajib login) | Isi |
|---|---|
| Dashboard | Booking masuk hari ini, pendapatan bulan ini, utilisasi armada, daftar perlu tindakan, jadwal armada minggu ini, pendapatan per layanan, serah terima hari ini |
| Booking | Semua booking + filter status + cari; ubah status & pasang unit langsung di tabel; catat booking manual (WA / IG / datang langsung) |
| Kalender armada | Jadwal per unit per minggu (bisa maju/mundur), tanda merah kalau ada jadwal bentrok |
| Armada | Tambah/hapus unit (plat nomor), status, km, jadwal servis; ubah harga & tampil/sembunyikan model |
| Paket tour → Edit | Nama, deskripsi EN/ID, harga, durasi, aktif/homepage/best seller, foto cover & galeri (upload, urutan, alt text) |
| Konten & foto | Foto header homepage (slideshow maks. 5), foto per paket tour, foto armada |
| Ulasan tamu | Rating Google (tampil di header), tambah/edit/sembunyikan ulasan, atur urutan (6 teratas tampil di homepage) |

**SEO & preview link:** `/sitemap.xml` (otomatis berisi semua tour, armada & artikel), `robots.txt`, dan gambar preview 1200×630 buat tiap halaman (muncul pas link dibagikan di WhatsApp, Instagram, Facebook, X). Detail tour & rental punya gambar sendiri berisi nama + harga yang ikut ter-update dari panel admin. Desainnya di `src/lib/og.tsx`.

Foto yang di-upload admin otomatis dikecilkan di browser (maks. 2400 px, WebP) sebelum dikirim, jadi foto HP bisa langsung dipakai. Perubahan dari admin muncul di website seketika; selain itu halaman publik di-refresh tiap 5 menit.

## Yang wajib diganti sebelum live

- [x] **Nomor WhatsApp**
- [ ] **Nama brand, email, alamat, Instagram** → `src/data/site.ts`
- [ ] **Harga** (masih contoh) → panel admin → Armada / Paket tour. Paket hemat masih di `src/data/combos.ts`.
- [ ] **Foto**: upload lewat panel admin → Konten & foto. Foto armada wajib foto unit asli.
- [ ] **Ulasan tamu asli & rating Google** → panel admin → Ulasan tamu. Selama kosong, bagian itu otomatis disembunyikan.
- [ ] **Site URL Supabase** diarahkan ke domain asli (lihat di atas).

## Struktur

```
src/
├── app/
│   ├── (site)/          # halaman tamu (header, footer, tombol WhatsApp)
│   ├── actions/         # server action publik (simpan booking)
│   ├── admin/
│   │   ├── login/       # halaman masuk
│   │   ├── (panel)/     # halaman admin (cek login + akses admin)
│   │   ├── actions.ts   # semua aksi admin (booking, armada, tour, foto)
│   │   └── auth-actions.ts
│   └── globals.css      # token warna & font Opsi A
├── components/          # kartu, form booking, section landing, komponen admin
├── data/                # konten statis & data cadangan kalau Supabase belum diatur
├── lib/
│   ├── supabase/        # client server/browser + tipe database
│   ├── content.ts       # ambil armada/tour/foto buat website
│   ├── admin-data.ts    # hitung dashboard & jadwal armada
│   └── upload.ts        # kompres + upload foto
└── proxy.ts             # refresh sesi login & lindungi /admin
supabase/migrations/     # skema database
```

## Tahap berikutnya

1. **Pembayaran DP online** (Midtrans / Xendit: QRIS, VA, kartu).
2. **Cek ketersediaan unit** otomatis di form booking publik.
3. **Dua bahasa** (EN / ID) dan pilihan mata uang.
4. Menu admin yang masih "Segera": driver & guide, paket hemat, promo, artikel, ulasan, laporan.
5. Domain sendiri.

Stack: Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript, Supabase (Postgres, Auth, Storage).
