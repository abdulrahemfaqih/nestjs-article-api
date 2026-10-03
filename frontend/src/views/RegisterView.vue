<template>
  <div class="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-sm">
      <!-- Header -->
      <div class="text-center mb-8">
        <span class="w-8 h-8 bg-black text-white inline-flex items-center justify-center font-bold text-sm rounded-sm mb-3">
          M
        </span>
        <h1 class="text-2xl font-bold tracking-tight text-neutral-900">
          Buat Akun Baru
        </h1>
        <p class="text-xs text-neutral-500 mt-1">
          Daftarkan akun untuk membaca, berkomentar, dan menulis artikel
        </p>
      </div>

      <!-- Success Notification -->
      <div
        v-if="successMessage"
        class="mb-5 p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 rounded"
      >
        {{ successMessage }}
      </div>

      <!-- Error Alert -->
      <div
        v-if="errorMessage"
        class="mb-5 p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded flex items-start space-x-2"
      >
        <AlertTriangle class="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="name" class="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
            Nama Lengkap
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            placeholder="misal: Abdul Rahem"
            class="w-full text-sm px-3 py-2 bg-white border border-neutral-300 rounded focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div>
          <label for="email" class="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
            Alamat Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="nama@email.com"
            class="w-full text-sm px-3 py-2 bg-white border border-neutral-300 rounded focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div>
          <label for="password" class="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="Minimal 8 karakter"
            class="w-full text-sm px-3 py-2 bg-white border border-neutral-300 rounded focus:outline-none focus:border-black transition-colors"
          />
          <p class="text-[11px] text-neutral-400 mt-1">
            Wajib: Min 8 karakter, 1 huruf besar (A-Z), 1 angka (0-9), dan 1 simbol (@, #, dll).
          </p>
        </div>

        <div>
          <label for="role" class="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
            Peran Akun (Role)
          </label>
          <select
            id="role"
            v-model="form.role"
            class="w-full text-sm px-3 py-2 bg-white border border-neutral-300 rounded focus:outline-none focus:border-black transition-colors cursor-pointer"
          >
            <option value="user">User (Pembaca & Komentar)</option>
            <option value="admin">Admin (Publikasi Artikel & Manajemen)</option>
          </select>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          {{ isLoading ? 'Mendaftarkan...' : 'Daftar Akun' }}
        </button>
      </form>

      <!-- Bottom Hint -->
      <div class="mt-6 text-center text-xs text-neutral-500">
        Sudah memiliki akun?
        <router-link to="/login" class="text-black font-semibold underline hover:text-amber-800 ml-1">
          Masuk di sini
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { AlertTriangle } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'user',
});

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

async function handleSubmit() {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    await authStore.register(form);
    successMessage.value = 'Registrasi berhasil! Mengarahkan ke halaman login...';
    
    setTimeout(() => {
      router.push('/login');
    }, 1200);
  } catch (err) {
    errorMessage.value = err.message || 'Gagal melakukan pendaftaran akun.';
  } finally {
    isLoading.value = false;
  }
}
</script>
