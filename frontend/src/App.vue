<template>
  <div class="min-h-screen flex flex-col bg-[#fafafa] text-neutral-900 font-sans selection:bg-black selection:text-white">
    <Navbar />
    <main class="flex-1">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();

onMounted(async () => {
  if (authStore.token && !authStore.user) {
    await authStore.fetchCurrentUser();
  }
});
</script>
