<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-12">
    <!-- Profile Header -->
    <header class="mb-10 pb-8 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center space-x-4">
        <div class="w-16 h-16 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-2xl">
          {{ userInitial }}
        </div>
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-neutral-900">
            {{ authStore.user?.name }}
          </h1>
          <p class="text-xs text-neutral-500 mt-0.5">
            {{ authStore.user?.email }} &bull;
            <span class="uppercase font-mono font-semibold text-neutral-700">{{ authStore.user?.role }}</span>
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <router-link
          v-if="authStore.isAdmin"
          to="/write"
          class="px-3.5 py-2 bg-black text-white text-xs font-medium rounded hover:bg-neutral-800 transition-colors"
        >
          + Tulis Artikel Baru
        </router-link>
      </div>
    </header>

    <!-- Tabs -->
    <div class="flex items-center space-x-6 border-b border-neutral-200 mb-8">
      <button
        @click="activeTab = 'profile'"
        class="pb-3 text-sm font-medium transition-colors border-b-2"
        :class="activeTab === 'profile' ? 'border-black text-black' : 'border-transparent text-neutral-500 hover:text-black'"
      >
        Pengaturan Profil
      </button>

      <button
        @click="activeTab = 'articles'"
        class="pb-3 text-sm font-medium transition-colors border-b-2"
        :class="activeTab === 'articles' ? 'border-black text-black' : 'border-transparent text-neutral-500 hover:text-black'"
      >
        Artikel Saya ({{ myArticles.length }})
      </button>
    </div>

    <!-- Tab 1: Profile Form -->
    <div v-if="activeTab === 'profile'" class="max-w-lg">
      <div
        v-if="feedbackMessage"
        class="mb-6 p-3 text-xs rounded border"
        :class="feedbackType === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'"
      >
        {{ feedbackMessage }}
      </div>

      <form @submit.prevent="handleSaveProfile" class="space-y-4">
        <div>
          <label for="age" class="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
            Usia (Tahun)
          </label>
          <input
            id="age"
            v-model="profileForm.age"
            type="number"
            min="1"
            max="120"
            placeholder="Contoh: 25"
            class="w-full text-sm px-3 py-2 bg-white border border-neutral-300 rounded focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div>
          <label for="bio" class="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
            Biografi Singkat
          </label>
          <textarea
            id="bio"
            v-model="profileForm.bio"
            rows="4"
            placeholder="Ceritakan sedikit tentang latar belakang, minat teknologi, atau topik tulisan Anda..."
            class="w-full text-sm px-3 py-2 bg-white border border-neutral-300 rounded focus:outline-none focus:border-black resize-y transition-colors"
          ></textarea>
        </div>

        <button
          type="submit"
          :disabled="isSaving"
          class="px-5 py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 disabled:opacity-40 transition-colors"
        >
          {{ isSaving ? 'Menyimpan...' : 'Perbarui Profil' }}
        </button>
      </form>
    </div>

    <!-- Tab 2: My Articles -->
    <div v-else-if="activeTab === 'articles'">
      <div v-if="isLoadingArticles" class="py-12 text-center text-xs text-neutral-400">
        Memuat artikel Anda...
      </div>

      <div v-else-if="myArticles.length > 0" class="space-y-4">
        <div
          v-for="art in myArticles"
          :key="art.id"
          class="p-4 bg-white border border-neutral-200 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-black transition-colors"
        >
          <div>
            <div class="flex items-center gap-2 text-xs text-neutral-500 mb-1">
              <span v-if="art.category?.name" class="font-medium text-neutral-800">
                {{ art.category.name }}
              </span>
              <span>&bull;</span>
              <span>{{ formatDate(art.createdAt) }}</span>
              <span>&bull;</span>
              <span
                class="text-[10px] uppercase font-mono px-1.5 py-0.2 border rounded"
                :class="art.status === 'SUCCESS' ? 'border-emerald-300 text-emerald-800 bg-emerald-50' : 'border-amber-300 text-amber-800 bg-amber-50'"
              >
                {{ art.status }}
              </span>
            </div>

            <h3 class="text-base font-bold text-neutral-900 hover:text-amber-800">
              <router-link :to="`/article/${art.id}`">
                {{ art.title }}
              </router-link>
            </h3>
          </div>

          <div class="flex items-center space-x-2 shrink-0">
            <router-link
              :to="`/article/${art.id}`"
              class="text-xs px-2.5 py-1.5 border border-neutral-300 rounded hover:border-black text-neutral-700"
            >
              Lihat
            </router-link>

            <router-link
              v-if="authStore.isAdmin"
              :to="`/article/${art.id}/edit`"
              class="text-xs px-2.5 py-1.5 border border-neutral-300 rounded hover:border-black text-neutral-700"
            >
              Edit
            </router-link>
          </div>
        </div>
      </div>

      <div v-else class="py-16 text-center border border-dashed border-neutral-300 rounded bg-white">
        <p class="text-sm text-neutral-500 mb-3">
          Anda belum memiliki artikel yang ditulis.
        </p>
        <router-link
          v-if="authStore.isAdmin"
          to="/write"
          class="inline-block px-4 py-2 bg-black text-white text-xs font-medium rounded hover:bg-neutral-800"
        >
          Tulis Artikel Pertama
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useArticleStore } from '../stores/article';

const authStore = useAuthStore();
const articleStore = useArticleStore();

const activeTab = ref('profile');
const isSaving = ref(false);
const isLoadingArticles = ref(false);
const myArticles = ref([]);
const feedbackMessage = ref('');
const feedbackType = ref('success');

const profileForm = reactive({
  age: '',
  bio: '',
});

const userInitial = computed(() => {
  return authStore.user?.name ? authStore.user.name.charAt(0).toUpperCase() : '?';
});

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

async function handleSaveProfile() {
  try {
    isSaving.value = true;
    feedbackMessage.value = '';
    await authStore.updateProfile(profileForm);
    feedbackType.value = 'success';
    feedbackMessage.value = 'Profil berhasil diperbarui.';
  } catch (err) {
    feedbackType.value = 'error';
    feedbackMessage.value = err.message || 'Gagal memperbarui profil.';
  } finally {
    isSaving.value = false;
  }
}

onMounted(async () => {
  // Sync profile data if already in auth store
  if (authStore.profile) {
    profileForm.age = authStore.profile.age || '';
    profileForm.bio = authStore.profile.bio || '';
  }

  try {
    isLoadingArticles.value = true;
    const res = await articleStore.fetchMyArticles();
    myArticles.value = res;
  } catch (e) {
    myArticles.value = [];
  } finally {
    isLoadingArticles.value = false;
  }
});
</script>
