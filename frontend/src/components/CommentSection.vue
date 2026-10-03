<template>
  <div class="mt-16 pt-10 border-t border-neutral-200">
    <div class="flex items-center justify-between mb-8">
      <h3 class="text-xl font-bold tracking-tight text-neutral-900">
        Diskusi & Komentar
        <span class="text-sm font-normal text-neutral-500 ml-2">({{ comments.length }})</span>
      </h3>
    </div>

    <!-- Add Comment Box -->
    <div v-if="authStore.isAuthenticated" class="mb-10 bg-white border border-neutral-200 rounded p-4">
      <label for="comment-text" class="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
        Tulis Tanggapan
      </label>
      <textarea
        id="comment-text"
        v-model="newComment"
        rows="3"
        placeholder="Bagikan pandangan atau pertanyaan Anda tentang artikel ini..."
        class="w-full text-sm p-3 border border-neutral-200 rounded focus:outline-none focus:border-black resize-y transition-colors"
      ></textarea>
      
      <div v-if="error" class="mt-2 text-xs text-red-600">
        {{ error }}
      </div>

      <div class="mt-3 flex items-center justify-between">
        <span class="text-xs text-neutral-400">
          Mengomentari sebagai <strong class="text-neutral-700">{{ authStore.user?.name }}</strong>
        </span>
        <button
          @click="handleSubmitComment"
          :disabled="isSubmitting || !newComment.trim()"
          class="px-4 py-2 bg-black text-white text-xs font-medium rounded hover:bg-neutral-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          {{ isSubmitting ? 'Mengirim...' : 'Kirim Komentar' }}
        </button>
      </div>
    </div>

    <div v-else class="mb-10 p-5 bg-neutral-50 border border-neutral-200 rounded text-center">
      <p class="text-sm text-neutral-600 mb-3">
        Silakan masuk terlebih dahulu untuk ikut berdiskusi pada artikel ini.
      </p>
      <router-link
        to="/login"
        class="inline-block px-4 py-1.5 bg-black text-white text-xs font-medium rounded hover:bg-neutral-800 transition-colors"
      >
        Masuk Akun
      </router-link>
    </div>

    <!-- Comments List -->
    <div v-if="comments.length > 0" class="space-y-4">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="p-4 bg-white border border-neutral-200 rounded group hover:border-neutral-300 transition-colors"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center space-x-2.5">
            <div class="w-6 h-6 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center text-[10px] font-bold">
              {{ comment.user?.name ? comment.user.name.charAt(0).toUpperCase() : 'U' }}
            </div>
            <span class="text-xs font-semibold text-neutral-900">
              {{ comment.user?.name || 'Anonim' }}
            </span>
            <span class="text-neutral-300 text-xs">&bull;</span>
            <span class="text-xs text-neutral-400">
              {{ formatDate(comment.createdAt) }}
            </span>
          </div>

          <!-- Delete Button (Only for author or admin) -->
          <button
            v-if="canDelete(comment)"
            @click="handleDelete(comment.id)"
            class="text-neutral-400 hover:text-red-600 p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            title="Hapus Komentar"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>

        <p class="text-neutral-700 text-sm leading-relaxed pl-8">
          {{ comment.content }}
        </p>
      </div>
    </div>

    <div v-else class="py-8 text-center text-sm text-neutral-400">
      Belum ada komentar untuk artikel ini. Jadilah yang pertama memberikan tanggapan.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { Trash2 } from 'lucide-vue-next';

const props = defineProps({
  articleId: {
    type: String,
    required: true,
  },
  comments: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['add-comment', 'delete-comment']);

const authStore = useAuthStore();
const newComment = ref('');
const isSubmitting = ref(false);
const error = ref('');

function canDelete(comment) {
  if (!authStore.isAuthenticated) return false;
  if (authStore.isAdmin) return true;
  return comment.user?.id === authStore.user?.id;
}

async function handleSubmitComment() {
  if (!newComment.value.trim()) return;
  try {
    isSubmitting.value = true;
    error.value = '';
    await emit('add-comment', newComment.value.trim());
    newComment.value = '';
  } catch (err) {
    error.value = err.message || 'Gagal mengirim komentar';
  } finally {
    isSubmitting.value = false;
  }
}

function handleDelete(commentId) {
  if (confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
    emit('delete-comment', commentId);
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
</script>
