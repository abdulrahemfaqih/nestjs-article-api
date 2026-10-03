<template>
  <div class="min-h-[calc(100vh-18rem)] flex items-center justify-center px-4 py-16 text-center">
    <div class="max-w-md">
      <div class="text-6xl font-extrabold text-neutral-900 tracking-tighter mb-4">
        404
      </div>
      <h1 class="text-xl font-bold text-neutral-900 mb-2">
        Halaman Tidak Ditemukan
      </h1>
      <p class="text-xs text-neutral-500 mb-6 leading-relaxed">
        Halaman yang Anda tuju tidak tersedia, mungkin telah dipindahkan atau tautan yang Anda masukkan salah.
      </p>
      <router-link
        to="/"
        class="inline-block px-5 py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors"
      >
        Kembali ke Beranda
      </router-link>
    </div>
  </div>
</template>
