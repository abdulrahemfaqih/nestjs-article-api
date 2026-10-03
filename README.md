# NestJS Article & Blog API

RESTful API komprehensif untuk platform penerbitan artikel dan manajemen konten yang dibangun menggunakan NestJS, TypeORM, PostgreSQL, dan Cloudinary. Proyek ini dilengkapi dengan autentikasi berbasis JWT, kontrol akses berbasis peran (Role-Based Access Control), relasi database tingkat lanjut, paginasi dinamis, serta dokumentasi interaktif OpenAPI (Swagger).

---

## Daftar Isi
- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Struktur Relasi Database](#struktur-relasi-database)
- [Prasyarat Sistem](#prasyarat-sistem)
- [Konfigurasi Environment Variable](#konfigurasi-environment-variable)
- [Panduan Instalasi dan Menjalankan Proyek](#panduan-instalasi-dan-menjalankan-proyek)
- [Migrasi Database](#migrasi-database)
- [Dokumentasi API (Swagger)](#dokumentasi-api-swagger)
- [Daftar Endpoint Utama](#daftar-endpoint-utama)
- [Lisensi](#lisensi)

---

## Fitur Utama

### 1. Autentikasi dan Otorisasi (RBAC)
- Registrasi dan login pengguna dengan enkripsi password menggunakan bcrypt.
- Autentikasi berbasis JSON Web Token (JWT).
- Role-Based Access Control (Roles: `admin` dan `user`) dengan Guard kustom (`AuthGuard` dan `RolesGuard`).

### 2. Manajemen Artikel (CRUD)
- Pembuatan, pembaruan, penghapusan, dan pembacaan artikel.
- Upload gambar artikel langsung ke Cloudinary menggunakan streaming buffer.
- Paginasi server-side dinamis dengan konfigurasi `page` dan `limit`.
- Pencarian judul artikel secara case-insensitive (`ILIKE`).
- Filter artikel berdasarkan kategori (`categoryId`), tag (`tagId`), atau penulis (`userId`).
- Pengurutan data dinamis berdasarkan kolom dan arah (`asc` / `desc`).
- Endpoint khusus untuk melihat artikel milik pengguna yang sedang login (`/api/v1/article/user/my-articles`).

### 3. Kategori dan Tag
- Relasi One-to-Many antara Kategori dan Artikel.
- Relasi Many-to-Many antara Artikel dan Tag menggunakan tabel perantara (`article_tags`).
- Manajemen CRUD lengkap untuk entitas Kategori dan Tag.

### 4. Sistem Komentar
- Relasi Many-to-One antara Komentar dengan Artikel dan Pengguna.
- Mekanisme penghapusan kaskade (`CASCADE` delete): jika artikel atau pengguna dihapus, komentar terkait akan terhapus otomatis.
- Validasi kepemilikan: pengguna hanya dapat menghapus komentar miliknya sendiri, sementara administrator memiliki akses penghapusan global.

### 5. Profil Pengguna
- Relasi One-to-One antara Pengguna dan Profil (`age`, `bio`).
- Manajemen pembuatan dan pembaruan profil pengguna berbasis token autentikasi.

### 6. Dokumentasi API Interaktif
- Terintegrasi penuh dengan `@nestjs/swagger`.
- Konfigurasi Authorize JWT Bearer dengan persistensi token saat halaman dimuat ulang.
- Dukungan form multipart/form-data untuk upload berkas langsung melalui antarmuka Swagger.

---

## Teknologi yang Digunakan

- **Backend Framework:** NestJS (v12)
- **Bahasa Pemrograman:** TypeScript
- **Database:** PostgreSQL
- **Object-Relational Mapping (ORM):** TypeORM
- **Cloud Media Storage:** Cloudinary SDK
- **Validasi dan Transformasi:** class-validator, class-transformer
- **Dokumentasi API:** OpenAPI / Swagger (@nestjs/swagger)
- **Pengujian:** Vitest

---

## Struktur Relasi Database

- **User - Profile:** One-to-One
  Setiap user memiliki satu profil opsional.
- **User - Article:** One-to-Many
  Satu user dapat menulis banyak artikel.
- **Category - Article:** One-to-Many
  Satu kategori dapat menampung banyak artikel.
- **Article - Tag:** Many-to-Many
  Satu artikel dapat memiliki banyak tag, dan satu tag dapat digunakan oleh banyak artikel (dikelola melalui tabel `article_tags`).
- **Article - Comment:** One-to-Many
  Satu artikel dapat memiliki banyak komentar dari berbagai user.
- **User - Comment:** One-to-Many
  Satu user dapat mengirim banyak komentar pada berbagai artikel.

---

## Prasyarat Sistem

Pastikan perangkat Anda telah terpasang:
- Node.js versi 18 atau lebih baru
- npm, yarn, atau pnpm
- PostgreSQL server (aktif)
- Akun Cloudinary aktif untuk kredensial API

---

## Konfigurasi Environment Variable

Buat berkas `.env` pada direktori root proyek dan sesuaikan nilainya:

```env
# Server Configuration
PORT=3000

# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password_database_anda
DB_NAME=nama_database_anda

# JWT Secret
JWT_SECRET=rahasia_kunci_jwt_anda

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=cloud_name_anda
CLOUDINARY_API_KEY=api_key_anda
CLOUDINARY_API_KEY_SECRET=api_secret_anda
```

---

## Panduan Instalasi dan Menjalankan Proyek

1. Clone repositori:
```bash
git clone https://github.com/abdulrahemfaqih/nama-repo-anda.git
cd belajar-nest-js
```

2. Pasang seluruh dependensi:
```bash
npm install
```

3. Jalankan migrasi database:
```bash
npm run migration:run
```

4. Jalankan aplikasi dalam mode pengembangan:
```bash
npm run start:dev
```

Aplikasi akan berjalan di: `http://localhost:3000`

---

## Migrasi Database

Manajemen skema database dikelola melalui TypeORM CLI:

- **Membuat migrasi otomatis dari perubahan entitas:**
```bash
npm run migration:generate -- src/migrations/NamaMigrasi
```

- **Menjalankan migrasi tertunda ke database:**
```bash
npm run migration:run
```

- **Membangun proyek untuk produksi:**
```bash
npm run build
```

---

## Dokumentasi API (Swagger)

Setelah server berjalan, dokumentasi interaktif dapat diakses melalui browser pada:

```
http://localhost:3000/api/docs
```

Untuk menguji endpoint yang terproteksi:
1. Jalankan request `POST /api/v1/auth/login`.
2. Salin token dari `access_token` pada response.
3. Klik tombol **Authorize** di pojok kanan atas halaman Swagger.
4. Masukkan token tersebut dan klik **Authorize**.

---

## Daftar Endpoint Utama

Prefix global API: `/api/v1`

### Auth (`/api/v1/auth`)
| Method | Endpoint | Akses | Keterangan |
| :--- | :--- | :--- | :--- |
| POST | `/auth/register` | Publik | Registrasi akun baru |
| POST | `/auth/login` | Publik | Autentikasi dan penerbitan JWT token |
| GET | `/auth/getuser` | User Login | Mengambil data akun yang sedang login |
| GET | `/auth/test` | Admin | Verifikasi akses peran admin |

### Article (`/api/v1/article`)
| Method | Endpoint | Akses | Keterangan |
| :--- | :--- | :--- | :--- |
| GET | `/article` | Publik | Daftar artikel dengan pagination, search, dan filter |
| GET | `/article/user/my-articles` | User Login | Mengambil artikel milik user yang sedang login |
| GET | `/article/user/:userId` | Publik | Mengambil daftar artikel berdasarkan ID penulis |
| GET | `/article/:id` | Publik | Detail artikel beserta relasi kategori, tag, dan komentar |
| POST | `/article` | Admin | Membuat artikel baru (mendukung upload gambar multipart) |
| PATCH | `/article/:id` | Admin | Memperbarui data artikel dan gambar |
| DELETE | `/article/:id` | Admin | Menghapus artikel secara permanen |

### Category (`/api/v1/category`)
| Method | Endpoint | Akses | Keterangan |
| :--- | :--- | :--- | :--- |
| GET | `/category` | Publik | Mengambil semua kategori |
| GET | `/category/:id` | Publik | Detail kategori beserta daftar artikel terkait |
| POST | `/category` | Publik | Menambahkan kategori baru |
| PATCH | `/category/:id` | Publik | Memperbarui nama kategori |
| DELETE | `/category/:id` | Publik | Menghapus kategori |

### Tag (`/api/v1/tag`)
| Method | Endpoint | Akses | Keterangan |
| :--- | :--- | :--- | :--- |
| GET | `/tag` | Publik | Mengambil semua tag |
| GET | `/tag/:id` | Publik | Mengambil detail tag |
| POST | `/tag` | Publik | Menambahkan tag baru |
| PATCH | `/tag/:id` | Publik | Memperbarui nama tag |
| DELETE | `/tag/:id` | Publik | Menghapus tag |

### Comment (`/api/v1`)
| Method | Endpoint | Akses | Keterangan |
| :--- | :--- | :--- | :--- |
| POST | `/article/:articleId/comments` | User Login | Menulis komentar pada artikel |
| GET | `/article/:articleId/comments` | Publik | Mengambil semua komentar pada suatu artikel |
| DELETE | `/comment/:id` | Pemilik / Admin | Menghapus komentar |

### Profile (`/api/v1/profile`)
| Method | Endpoint | Akses | Keterangan |
| :--- | :--- | :--- | :--- |
| POST | `/profile` | User Login | Membuat atau memperbarui profil user |
| GET | `/profile` | User Login | Mengambil profil user beserta daftar artikelnya |

### Users (`/api/v1/users`)
| Method | Endpoint | Akses | Keterangan |
| :--- | :--- | :--- | :--- |
| GET | `/users` | Admin | Mengambil seluruh daftar pengguna |
| GET | `/users/:id` | Admin | Mengambil detail pengguna beserta artikelnya |
| PATCH | `/users/:id` | Admin | Memperbarui role pengguna (`user` / `admin`) |

---

## Lisensi

Proyek ini dirilis di bawah lisensi [UNLICENSED](LICENSE).
