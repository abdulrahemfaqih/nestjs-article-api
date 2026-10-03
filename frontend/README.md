# Monolog Frontend (Vue.js + Tailwind CSS)

Frontend minimalis, modern, dan modular untuk RESTful API NestJS Article. Dirancang dengan estetika editorial monokrom (hitam & putih) dengan aksen warna hangat (*warm amber*) yang elegan, fokus pada keterbacaan, tipografi yang rapi, dan kemudahan perawatan kode.

---

## 🎨 Karakteristik Desain

- **Minimalis & Bersih**: Mengutamakan *whitespace*, border yang presisi, dan hierarki visual yang jelas.
- **Monokrom & Aksen Hangat**: Dominasi warna hitam (#111111, #000000) dan putih (#ffffff, #fafafa) dengan aksen amber/cognac (#b45309) yang halus dan berkelas.
- **Tanpa AI-slop / Pulse / Gradien**: Menghindari elemen visual yang ramai, animasi berlebihan, efek gradien neon, dan lencana/eyebrow yang tidak perlu.
- **Tipografi Terkurasi**: Menggunakan font *Inter* dengan tracking dan leading yang optimal untuk membaca artikel.

---

## 🚀 Fitur Frontend

1. **Eksplorasi Artikel (`/`)**:
   - Pencarian artikel secara instan berdasarkan judul.
   - Filter dinamis berdasarkan Kategori dan Tag.
   - Pengurutan data (Terbaru, Terlama, Judul A-Z / Z-A).
   - Kartu artikel editorial dengan thumbnail, estimasi baca, dan meta penulis.
   - Paginasi server-side yang rapi.

2. **Detail Pembaca Artikel (`/article/:id`)**:
   - Tampilan membaca layaknya jurnal digital / Medium.
   - Profil penulis dengan avatar inisial.
   - Relasi kategori, tag, dan gambar utama dari Cloudinary.
   - **Sistem Komentar & Diskusi**: Pengguna login dapat menambahkan tanggapan, serta menghapus komentar miliknya (atau oleh Admin).

3. **Autentikasi Akun**:
   - **Login (`/login`)**: Input email dan password dengan validasi dan persistensi JWT.
   - **Register (`/register`)**: Pendaftaran akun dengan opsi role (`user` / `admin`) dan petunjuk kriteria password (min 8 karakter, huruf besar, angka, simbol).

4. **Profil Pengguna (`/profile`)**:
   - Melihat informasi akun dan role pengguna saat ini.
   - Form pembaruan usia (*age*) dan biografi (*bio*).
   - Tab "Artikel Saya" untuk melihat daftar artikel yang telah ditulis beserta status publikasinya (`SUCCESS`, `PENDING`, `CANCEL`).

5. **Editor Artikel (`/write` & `/article/:id/edit`)**:
   - Khusus pengguna dengan role `admin`.
   - Form input judul, pemilihan kategori, tag multi-pilih, dan status publikasi.
   - Dukungan unggah gambar cover (*multipart/form-data*) dengan pratinjau (*live preview*).
   - Area penulisan konten yang luas dan nyaman.

6. **Panel Administrator (`/admin`)**:
   - **Kelola Artikel**: Tabel lengkap seluruh artikel dengan aksi lihat, edit, dan hapus.
   - **Kelola Kategori**: Tambah kategori baru, ubah nama secara inline, dan hapus kategori.
   - **Kelola Tag**: Tambah tag baru, ubah nama tag, dan hapus tag.
   - **Kelola Pengguna**: Melihat daftar user terdaftar dan mengubah hak akses/role (`user` <-> `admin`).

---

## 🛠️ Struktur Direktori Frontend

```
frontend/
├── src/
│   ├── api/
│   │   └── client.js           # Axios client, auth bearer interceptor & format error
│   ├── components/
│   │   ├── ArticleCard.vue     # Komponen kartu artikel editorial
│   │   ├── CommentSection.vue  # Sistem komentar & interaksi diskusi
│   │   ├── Footer.vue          # Footer minimalis & status koneksi
│   │   ├── Navbar.vue          # Navigasi sticky monokrom
│   │   └── Pagination.vue      # Komponen navigasi halaman
│   ├── router/
│   │   └── index.js            # Vue Router dengan guard auth & admin
│   ├── stores/
│   │   ├── article.js          # Pinia store untuk artikel, kategori, tag, user
│   │   └── auth.js             # Pinia store untuk auth & profil
│   ├── views/
│   │   ├── AdminDashboardView.vue # Panel kelola admin
│   │   ├── ArticleDetailView.vue  # Halaman membaca artikel
│   │   ├── ArticleEditorView.vue  # Editor penulisan artikel
│   │   ├── HomeView.vue           # Halaman utama feed artikel
│   │   ├── LoginView.vue          # Halaman masuk
│   │   ├── NotFoundView.vue       # Halaman 404
│   │   ├── ProfileView.vue        # Halaman profil & artikel saya
│   │   └── RegisterView.vue       # Halaman pendaftaran
│   ├── App.vue                 # Root view
│   ├── main.js                 # Bootstrapping Vue, Router, Pinia
│   └── style.css               # Tailwind CSS entrypoint & kustomisasi
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js              # Vite config dengan alias `@` & proxy `/api`
```

---

## 💻 Cara Menjalankan

1. **Jalankan Backend NestJS**:
   ```bash
   cd backend
   npm run start:dev
   ```
   Backend akan berjalan di `http://localhost:3000`.

2. **Jalankan Frontend Vue**:
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend akan berjalan di `http://localhost:5173`.

   *Atau dari root folder proyek:*
   ```bash
   npm run dev:backend   # Menjalankan backend
   npm run dev:frontend  # Menjalankan frontend
   ```
