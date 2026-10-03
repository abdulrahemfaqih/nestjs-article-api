<template>
  <footer class="mt-24 border-t border-neutral-200 bg-white">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-neutral-500">
        <!-- Brand & Info -->
        <div class="flex items-center space-x-3">
          <span class="w-5 h-5 bg-black text-white flex items-center justify-center font-bold text-[10px] rounded-xs">
            M
          </span>
          <span class="font-medium text-neutral-900">Monolog</span>
          <span>&mdash;</span>
          <span>Platform Publikasi Artikel & Jurnal Digital</span>
        </div>

        <!-- System & Links -->
        <div class="flex items-center space-x-6 text-xs text-neutral-400">
          <span class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>NestJS API v1 Terhubung</span>
          </span>
          <span>&copy; {{ currentYear }} Monolog. Hak Cipta Dilindungi.</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>
