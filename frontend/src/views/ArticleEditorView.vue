<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12">
    <!-- Header -->
    <div class="mb-8 pb-6 border-b border-neutral-200 flex items-center justify-between">
      <div>
        <router-link
          to="/"
          class="inline-flex items-center text-xs font-medium text-neutral-500 hover:text-black gap-1 mb-2"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          <span>Kembali</span>
        </router-link>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
          {{ isEditing ? 'Edit Artikel' : 'Tulis Artikel Baru' }}
        </h1>
      </div>

      <div class="flex items-center space-x-3">
        <button
          type="button"
          @click="handleSubmit"
          :disabled="isSubmitting"
          class="px-5 py-2 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 disabled:opacity-40 transition-colors"
        >
          {{ isSubmitting ? 'Menyimpan...' : (isEditing ? 'Perbarui' : 'Terbitkan') }}
        </button>
      </div>
    </div>

    <!-- Error Alert -->
    <div
      v-if="errorMessage"
      class="mb-6 p-4 text-xs bg-red-50 border border-red-200 text-red-700 rounded flex items-start space-x-2"
    >
      <AlertTriangle class="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
      <span>{{ errorMessage }}</span>
    </div>

    <!-- Editor Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Title -->
      <div>
        <label for="title" class="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
          Judul Artikel *
        </label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          required
          placeholder="Tulis judul artikel yang jelas dan menarik..."
          class="w-full text-base font-semibold px-3.5 py-2.5 bg-white border border-neutral-300 rounded focus:outline-none focus:border-black transition-colors"
        />
      </div>

      <!-- Category and Status Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Category -->
        <div>
          <label for="category" class="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
            Kategori *
          </label>
          <select
            id="category"
            v-model="form.categoryId"
            required
            class="w-full text-sm px-3 py-2 bg-white border border-neutral-300 rounded focus:outline-none focus:border-black transition-colors cursor-pointer"
          >
            <option value="" disabled>Pilih Kategori</option>
            <option
              v-for="cat in articleStore.categories"
              :key="cat.id"
              :value="cat.id"
            >
              {{ cat.name }}
            </option>
          </select>
        </div>

        <!-- Status -->
        <div>
          <label for="status" class="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
            Status Publikasi
          </label>
          <select
            id="status"
            v-model="form.status"
            class="w-full text-sm px-3 py-2 bg-white border border-neutral-300 rounded focus:outline-none focus:border-black transition-colors cursor-pointer"
          >
            <option value="SUCCESS">SUCCESS (Publikasikan)</option>
            <option value="PENDING">PENDING (Draft / Tertunda)</option>
            <option value="CANCEL">CANCEL (Dibatalkan)</option>
          </select>
        </div>
      </div>

      <!-- Tags Multi-Selection -->
      <div>
        <label class="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
          Pilih Tag Terkait
        </label>
        <div v-if="articleStore.tags.length > 0" class="flex flex-wrap gap-2 p-3 bg-white border border-neutral-200 rounded">
          <label
            v-for="tag in articleStore.tags"
            :key="tag.id"
            class="inline-flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded border cursor-pointer transition-colors"
            :class="form.tagIds.includes(tag.id) ? 'bg-black text-white border-black' : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-400'"
          >
            <input
              type="checkbox"
              :value="tag.id"
              v-model="form.tagIds"
              class="hidden"
            />
            <span>#{{ tag.name }}</span>
          </label>
        </div>
        <div v-else class="text-xs text-neutral-400">
          Belum ada tag yang dibuat. Anda dapat membuatnya di panel Admin.
        </div>
      </div>

      <!-- Image File Upload -->
      <div>
        <label class="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
          Gambar Cover / Thumbnail (Opsional)
        </label>
        
        <div class="flex flex-col sm:flex-row gap-4 items-start">
          <input
            type="file"
            accept="image/*"
            @change="handleFileChange"
            class="text-xs text-neutral-600 file:mr-3 file:py-2 file:px-3 file:rounded file:border file:border-neutral-300 file:text-xs file:font-medium file:bg-white file:text-neutral-700 hover:file:border-black cursor-pointer"
          />

          <!-- Image Preview -->
          <div v-if="imagePreview || existingImageUrl" class="relative w-36 h-24 border border-neutral-300 rounded overflow-hidden bg-neutral-100 shrink-0">
            <img
              :src="imagePreview || existingImageUrl"
              alt="Preview"
              class="w-full h-full object-cover"
            />
            <button
              type="button"
              @click="clearImage"
              class="absolute top-1 right-1 bg-black/70 hover:bg-black text-white p-1 rounded-full text-xs"
              title="Hapus gambar"
            >
              <X class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <!-- Content Textarea -->
      <div>
        <label for="content" class="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
          Isi Konten Artikel *
        </label>
        <textarea
          id="content"
          v-model="form.content"
          required
          rows="14"
          placeholder="Tuliskan isi artikel Anda di sini..."
          class="w-full text-sm p-4 bg-white border border-neutral-300 rounded focus:outline-none focus:border-black resize-y font-sans leading-relaxed transition-colors"
        ></textarea>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useArticleStore } from '../stores/article';
import { ArrowLeft, AlertTriangle, X } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const articleStore = useArticleStore();

const isEditing = computed(() => !!route.params.id);
const isSubmitting = ref(false);
const errorMessage = ref('');

const selectedFile = ref(null);
const imagePreview = ref('');
const existingImageUrl = ref('');

const form = reactive({
  title: '',
  content: '',
  categoryId: '',
  status: 'SUCCESS',
  tagIds: [],
});

function handleFileChange(e) {
  const file = e.target.files?.[0];
  if (file) {
    selectedFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
}

function clearImage() {
  selectedFile.value = null;
  imagePreview.value = '';
  existingImageUrl.value = '';
}

async function handleSubmit() {
  if (!form.title.trim() || !form.content.trim() || !form.categoryId) {
    errorMessage.value = 'Judul, Kategori, dan Isi Konten wajib diisi.';
    return;
  }

  try {
    isSubmitting.value = true;
    errorMessage.value = '';

    const formData = new FormData();
    formData.append('title', form.title.trim());
    formData.append('content', form.content.trim());
    formData.append('status', form.status);
    formData.append('categoryId', form.categoryId);

    // Backend accepts JSON string or comma-separated string for tagIds
    if (form.tagIds && form.tagIds.length > 0) {
      formData.append('tagIds', JSON.stringify(form.tagIds));
    }

    if (selectedFile.value) {
      formData.append('image', selectedFile.value);
    }

    let saved;
    if (isEditing.value) {
      saved = await articleStore.updateArticle(route.params.id, formData);
    } else {
      saved = await articleStore.createArticle(formData);
    }

    router.push(`/article/${saved.id || route.params.id}`);
  } catch (err) {
    errorMessage.value = err.message || 'Gagal menyimpan artikel.';
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(async () => {
  await Promise.all([
    articleStore.fetchCategories(),
    articleStore.fetchTags(),
  ]);

  if (isEditing.value) {
    try {
      const art = await articleStore.fetchArticleById(route.params.id);
      if (art) {
        form.title = art.title || '';
        form.content = art.content || '';
        form.categoryId = art.category?.id || '';
        form.status = art.status || 'SUCCESS';
        form.tagIds = art.tags ? art.tags.map((t) => t.id) : [];
        if (art.image) {
          existingImageUrl.value = art.image;
        }
      }
    } catch (err) {
      errorMessage.value = 'Gagal mengambil data artikel untuk diedit.';
    }
  }
});
</script>
