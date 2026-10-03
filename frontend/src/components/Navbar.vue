<template>
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <!-- Brand -->
      <router-link to="/" class="flex items-center space-x-2 text-neutral-900 group">
        <span class="w-6 h-6 bg-black text-white flex items-center justify-center font-bold text-xs rounded-sm">
          M
        </span>
        <span class="font-bold tracking-tight text-lg">
          Monolog<span class="text-amber-600">.</span>
        </span>
      </router-link>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center space-x-6 text-sm font-medium text-neutral-600">
        <router-link
          to="/"
          class="hover:text-black transition-colors"
          active-class="text-black font-semibold"
        >
          Artikel
        </router-link>

        <router-link
          v-if="authStore.isAdmin"
          to="/write"
          class="hover:text-black transition-colors flex items-center gap-1.5"
          active-class="text-black font-semibold"
        >
          <PenTool class="w-3.5 h-3.5" />
          <span>Tulis</span>
        </router-link>

        <router-link
          v-if="authStore.isAdmin"
          to="/admin"
          class="hover:text-black transition-colors flex items-center gap-1.5"
          active-class="text-black font-semibold"
        >
          <SlidersHorizontal class="w-3.5 h-3.5" />
          <span>Kelola</span>
        </router-link>
      </nav>

      <!-- User / Auth Actions -->
      <div class="hidden md:flex items-center space-x-4">
        <template v-if="authStore.isAuthenticated">
          <router-link
            to="/profile"
            class="flex items-center space-x-2 text-sm text-neutral-700 hover:text-black py-1 px-2 rounded hover:bg-neutral-100 transition-colors"
          >
            <div class="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-semibold">
              {{ userInitial }}
            </div>
            <div class="text-left leading-tight">
              <span class="font-medium text-xs block text-neutral-900">{{ authStore.user?.name }}</span>
              <span class="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
                {{ authStore.user?.role }}
              </span>
            </div>
          </router-link>

          <button
            @click="handleLogout"
            class="text-neutral-500 hover:text-red-600 p-1.5 rounded hover:bg-neutral-100 transition-colors"
            title="Keluar"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </template>

        <template v-else>
          <router-link
            to="/login"
            class="text-sm font-medium text-neutral-600 hover:text-black px-3 py-1.5 transition-colors"
          >
            Masuk
          </router-link>
          <router-link
            to="/register"
            class="text-xs font-medium bg-black text-white px-3.5 py-2 rounded hover:bg-neutral-800 transition-colors"
          >
            Daftar Akun
          </router-link>
        </template>
      </div>

      <!-- Mobile Menu Toggle -->
      <div class="md:hidden flex items-center space-x-2">
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="p-2 text-neutral-700 hover:text-black focus:outline-none"
        >
          <Menu v-if="!mobileMenuOpen" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu Drawer -->
    <div
      v-if="mobileMenuOpen"
      class="md:hidden border-t border-neutral-200 bg-white px-4 py-4 space-y-3"
    >
      <router-link
        to="/"
        @click="mobileMenuOpen = false"
        class="block py-2 text-sm font-medium text-neutral-700 hover:text-black"
      >
        Semua Artikel
      </router-link>

      <router-link
        v-if="authStore.isAdmin"
        to="/write"
        @click="mobileMenuOpen = false"
        class="block py-2 text-sm font-medium text-neutral-700 hover:text-black"
      >
        Tulis Artikel Baru
      </router-link>

      <router-link
        v-if="authStore.isAdmin"
        to="/admin"
        @click="mobileMenuOpen = false"
        class="block py-2 text-sm font-medium text-neutral-700 hover:text-black"
      >
        Panel Administrator
      </router-link>

      <div class="pt-3 border-t border-neutral-200">
        <template v-if="authStore.isAuthenticated">
          <router-link
            to="/profile"
            @click="mobileMenuOpen = false"
            class="flex items-center space-x-2 py-2 text-sm text-neutral-800"
          >
            <UserIcon class="w-4 h-4" />
            <span>Profil Saya ({{ authStore.user?.name }})</span>
          </router-link>

          <button
            @click="handleLogout"
            class="w-full text-left py-2 text-sm text-red-600 hover:text-red-700 flex items-center space-x-2"
          >
            <LogOut class="w-4 h-4" />
            <span>Keluar Akun</span>
          </button>
        </template>

        <template v-else>
          <div class="flex flex-col space-y-2 pt-1">
            <router-link
              to="/login"
              @click="mobileMenuOpen = false"
              class="w-full text-center py-2 text-sm border border-neutral-300 rounded font-medium text-neutral-800"
            >
              Masuk
            </router-link>
            <router-link
              to="/register"
              @click="mobileMenuOpen = false"
              class="w-full text-center py-2 text-sm bg-black text-white rounded font-medium"
            >
              Daftar Akun
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import {
  PenTool,
  SlidersHorizontal,
  LogOut,
  Menu,
  X,
  User as UserIcon,
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const mobileMenuOpen = ref(false);

const userInitial = computed(() => {
  return authStore.user?.name ? authStore.user.name.charAt(0).toUpperCase() : '?';
});

function handleLogout() {
  authStore.logout();
  mobileMenuOpen.value = false;
  router.push('/login');
}
</script>
