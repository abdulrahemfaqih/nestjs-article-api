<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12">
    <!-- Back Link -->
    <div class="mb-8">
      <router-link
        to="/"
        class="inline-flex items-center text-xs font-medium text-neutral-500 hover:text-black transition-colors gap-1.5"
      >
        <ArrowLeft class="w-3.5 h-3.5" />
        <span>Kembali ke semua artikel</span>
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="articleStore.isDetailLoading" class="space-y-6">
      <div class="h-6 w-32 bg-neutral-200 rounded"></div>
      <div class="h-12 w-full bg-neutral-200 rounded"></div>
      <div class="h-64 w-full bg-neutral-100 rounded"></div>
      <div class="space-y-3">
        <div class="h-4 w-full bg-neutral-200 rounded"></div>
        <div class="h-4 w-5/6 bg-neutral-200 rounded"></div>
        <div class="h-4 w-4/6 bg-neutral-200 rounded"></div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="articleStore.error || !article"
      class="py-16 text-center border border-neutral-300 rounded bg-white"
    >
      <AlertCircle class="w-8 h-8 text-neutral-400 mx-auto mb-2" />
      <h2 class="text-base font-semibold text-neutral-900 mb-1">
        Artikel tidak ditemukan
      </h2>
      <p class="text-xs text-neutral-500 mb-4">
        {{ articleStore.error || 'Artikel yang Anda cari mungkin telah dihapus atau URL tidak valid.' }}
      </p>
      <router-link
        to="/"
        class="inline-block px-4 py-2 bg-black text-white text-xs font-medium rounded hover:bg-neutral-800"
      >
        Kembali ke Beranda
      </router-link>
    </div>

    <!-- Article Detail Content -->
    <article v-else class="space-y-8">
      <!-- Header -->
      <header class="space-y-4 pb-6 border-b border-neutral-200">
        <!-- Category & Date Meta -->
        <div class="flex items-center justify-between text-xs text-neutral-500">
          <div class="flex items-center gap-2">
            <span
              v-if="article.category?.name"
              class="px-2.5 py-0.5 border border-neutral-300 rounded text-neutral-800 font-medium text-xs"
            >
              {{ article.category.name }}
            </span>
            <span>&bull;</span>
            <time :datetime="article.createdAt">
              {{ formatDate(article.createdAt) }}
            </time>
          </div>

          <!-- Admin actions -->
          <div v-if="authStore.isAdmin" class="flex items-center space-x-2">
            <router-link
              :to="`/article/${article.id}/edit`"
              class="flex items-center gap-1 text-xs px-2.5 py-1 border border-neutral-300 rounded hover:border-black text-neutral-700 hover:text-black transition-colors"
            >
              <Edit class="w-3 h-3" />
              <span>Edit</span>
            </router-link>
            <button
              @click="handleDeleteArticle"
              class="flex items-center gap-1 text-xs px-2.5 py-1 border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors"
            >
              <Trash2 class="w-3 h-3" />
              <span>Hapus</span>
            </button>
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
          {{ article.title }}
        </h1>

        <!-- Author Profile Bar -->
        <div class="flex items-center justify-between pt-2">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
              {{ authorInitial }}
            </div>
            <div>
              <div class="text-sm font-semibold text-neutral-900">
                {{ article.user?.name || 'Penulis Anonim' }}
              </div>
              <div class="text-xs text-neutral-500">
                {{ article.user?.email || '' }}
              </div>
            </div>
          </div>

          <div v-if="article.status" class="text-right">
            <span
              class="text-[11px] font-mono uppercase px-2 py-0.5 border rounded"
              :class="article.status === 'SUCCESS' ? 'border-neutral-300 text-neutral-700 bg-neutral-50' : 'border-amber-400 text-amber-800 bg-amber-50'"
            >
              {{ article.status }}
            </span>
          </div>
        </div>
      </header>

      <!-- Featured Image (if available) -->
      <div v-if="article.image" class="overflow-hidden border border-neutral-200 rounded-sm">
        <img
          :src="article.image"
          :alt="article.title"
          class="w-full h-auto max-h-[500px] object-cover"
        />
      </div>

      <!-- Article Body Content -->
      <div class="py-4">
        <div class="text-neutral-800 text-base sm:text-lg leading-relaxed whitespace-pre-line space-y-4 font-normal">
          {{ article.content }}
        </div>
      </div>

      <!-- Tags Section -->
      <div v-if="article.tags && article.tags.length > 0" class="pt-6 border-t border-neutral-200">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-xs text-neutral-400 font-medium">Topik:</span>
          <span
            v-for="tag in article.tags"
            :key="tag.id"
            class="text-xs px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded hover:bg-neutral-200 transition-colors"
          >
            #{{ tag.name }}
          </span>
        </div>
      </div>

      <!-- Comments Section -->
      <CommentSection
        :article-id="article.id"
        :comments="article.comments || []"
        @add-comment="handleAddComment"
        @delete-comment="handleDeleteComment"
      />
    </article>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useArticleStore } from '../stores/article';
import { useAuthStore } from '../stores/auth';
import CommentSection from '../components/CommentSection.vue';
import { ArrowLeft, Edit, Trash2, AlertCircle } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const articleStore = useArticleStore();
const authStore = useAuthStore();

const article = computed(() => articleStore.currentArticle);

const authorInitial = computed(() => {
  return article.value?.user?.name ? article.value.user.name.charAt(0).toUpperCase() : 'U';
});

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

async function handleAddComment(content) {
  if (!article.value?.id) return;
  await articleStore.createComment(article.value.id, content);
}

async function handleDeleteComment(commentId) {
  if (!article.value?.id) return;
  await articleStore.deleteComment(commentId, article.value.id);
}

async function handleDeleteArticle() {
  if (confirm('Apakah Anda yakin ingin menghapus artikel ini secara permanen?')) {
    try {
      await articleStore.deleteArticle(article.value.id);
      router.push('/');
    } catch (err) {
      alert(err.message || 'Gagal menghapus artikel');
    }
  }
}

onMounted(async () => {
  const articleId = route.params.id;
  if (articleId) {
    await articleStore.fetchArticleById(articleId);
  }
});
</script>
