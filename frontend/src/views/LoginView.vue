<template>
  <div class="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-sm">
      <!-- Header -->
      <div class="text-center mb-8">
        <span class="w-8 h-8 bg-black text-white inline-flex items-center justify-center font-bold text-sm rounded-sm mb-3">
          M
        </span>
        <h1 class="text-2xl font-bold tracking-tight text-neutral-900">
          Masuk ke Akun
        </h1>
        <p class="text-xs text-neutral-500 mt-1">
          Masukkan email dan password untuk melanjutkan
        </p>
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
          <label for="email" class="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
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
            autocomplete="current-password"
            placeholder="••••••••"
            class="w-full text-sm px-3 py-2 bg-white border border-neutral-300 rounded focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          {{ isLoading ? 'Memproses...' : 'Masuk' }}
        </button>
      </form>

      <!-- Bottom Hint -->
      <div class="mt-6 text-center text-xs text-neutral-500">
        Belum memiliki akun?
        <router-link to="/register" class="text-black font-semibold underline hover:text-amber-800 ml-1">
          Daftar sekarang
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
  email: '',
  password: '',
});

const isLoading = ref(false);
const errorMessage = ref('');

async function handleSubmit() {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    await authStore.login(form.email, form.password);
    router.push('/');
  } catch (err) {
    errorMessage.value = err.message || 'Email atau kata sandi tidak valid.';
  } finally {
    isLoading.value = false;
  }
}
</script>
