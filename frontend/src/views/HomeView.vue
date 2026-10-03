<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
    <!-- Editorial Headline -->
    <header class="mb-10 pb-8 border-b border-neutral-200">
      <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 mb-3">
        Koleksi Tulisan & Artikel
      </h1>
      <p class="text-neutral-500 text-base max-w-2xl leading-relaxed">
        Eksplorasi wawasan mendalam seputar teknologi, arsitektur perangkat lunak, dan catatan teknis pilihan.
      </p>
    </header>

    <!-- Search & Filter Bar -->
    <div class="mb-8 space-y-4">
      <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <!-- Search -->
        <div class="relative flex-1 max-w-md">
          <Search class="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Cari artikel berdasarkan judul..."
            class="w-full pl-9 pr-8 py-2 text-sm bg-white border border-neutral-300 rounded focus:outline-none focus:border-black transition-colors"
          />
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Sorting -->
        <div class="flex items-center gap-2">
          <label class="text-xs text-neutral-500 whitespace-nowrap">Urutkan:</label>
          <select
            v-model="selectedSort"
            @change="handleSortChange"
            class="text-xs bg-white border border-neutral-300 rounded px-2.5 py-2 text-neutral-700 focus:outline-none focus:border-black cursor-pointer"
          >
            <option value="createdAt-desc">Terbaru</option>
            <option value="createdAt-asc">Terlama</option>
            <option value="title-asc">Judul (A-Z)</option>
            <option value="title-desc">Judul (Z-A)</option>
          </select>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
        <button
          @click="selectCategory(null)"
          class="text-xs px-3 py-1.5 rounded transition-colors whitespace-nowrap"
          :class="selectedCategoryId === null ? 'bg-black text-white font-medium' : 'border border-neutral-300 bg-white text-neutral-700 hover:border-black'"
        >
          Semua Kategori
        </button>

        <button
          v-for="cat in articleStore.categories"
          :key="cat.id"
          @click="selectCategory(cat.id)"
          class="text-xs px-3 py-1.5 rounded transition-colors whitespace-nowrap"
          :class="selectedCategoryId === cat.id ? 'bg-black text-white font-medium' : 'border border-neutral-300 bg-white text-neutral-700 hover:border-black'"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Tag Filter Pills (if any selected or available) -->
      <div v-if="articleStore.tags.length > 0" class="flex items-center gap-1.5 flex-wrap pt-1">
        <span class="text-xs text-neutral-400 mr-1">Tag:</span>
        <button
          v-for="tag in articleStore.tags"
          :key="tag.id"
          @click="selectTag(tag.id)"
          class="text-[11px] px-2 py-0.5 rounded transition-colors"
          :class="selectedTagId === tag.id ? 'bg-amber-800 text-white font-medium' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'"
        >
          #{{ tag.name }}
        </button>
        <button
          v-if="selectedTagId"
          @click="selectTag(null)"
          class="text-[11px] text-neutral-500 hover:text-black underline ml-1"
        >
          Hapus filter tag
        </button>
      </div>
    </div>

    <!-- Active Filters Summary (if any) -->
    <div
      v-if="searchQuery || selectedCategoryId || selectedTagId"
      class="mb-6 flex items-center justify-between text-xs bg-neutral-100 p-2.5 rounded border border-neutral-200"
    >
      <div class="flex items-center gap-2">
        <span class="text-neutral-500">Filter Aktif:</span>
        <span v-if="searchQuery" class="font-medium text-neutral-800">Cari: "{{ searchQuery }}"</span>
        <span v-if="selectedCategoryId" class="font-medium text-neutral-800">
          Kategori: {{ currentCategoryName }}
        </span>
        <span v-if="selectedTagId" class="font-medium text-neutral-800">
          Tag: #{{ currentTagName }}
        </span>
      </div>
      <button
        @click="resetAllFilters"
        class="text-xs text-neutral-600 hover:text-black underline font-medium"
      >
        Reset Semua
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="articleStore.isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="n in 6"
        :key="n"
        class="h-72 bg-neutral-100 border border-neutral-200 rounded-sm"
      ></div>
    </div>

    <!-- Articles Grid -->
    <div
      v-else-if="articleStore.articles.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <ArticleCard
        v-for="article in articleStore.articles"
        :key="article.id"
        :article="article"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="py-16 text-center border border-dashed border-neutral-300 rounded bg-white"
    >
      <FileText class="w-8 h-8 text-neutral-400 mx-auto mb-3" />
      <h3 class="text-base font-semibold text-neutral-800 mb-1">
        Tidak ada artikel ditemukan
      </h3>
      <p class="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
        Coba ubah kata kunci pencarian atau sesuaikan kategori yang dipilih.
      </p>
      <button
        @click="resetAllFilters"
        class="text-xs px-3.5 py-1.5 bg-black text-white rounded font-medium hover:bg-neutral-800 transition-colors"
      >
        Bersihkan Filter
      </button>
    </div>

    <!-- Pagination -->
    <Pagination
      v-if="!articleStore.isLoading && articleStore.articles.length > 0"
      :current-page="currentPage"
      :total-pages="articleStore.meta.lastPage || 1"
      :total-items="articleStore.meta.total || 0"
      @change-page="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useArticleStore } from '../stores/article';
import ArticleCard from '../components/ArticleCard.vue';
import Pagination from '../components/Pagination.vue';
import { Search, X, FileText } from 'lucide-vue-next';

const articleStore = useArticleStore();

const searchQuery = ref('');
const selectedCategoryId = ref(null);
const selectedTagId = ref(null);
const selectedSort = ref('createdAt-desc');
const currentPage = ref(1);

const currentCategoryName = computed(() => {
  const cat = articleStore.categories.find((c) => c.id === selectedCategoryId.value);
  return cat ? cat.name : '';
});

const currentTagName = computed(() => {
  const tag = articleStore.tags.find((t) => t.id === selectedTagId.value);
  return tag ? tag.name : '';
});

async function loadArticles() {
  const [sortBy, sortOrder] = selectedSort.value.split('-');
  await articleStore.fetchArticles({
    page: currentPage.value,
    limit: 6,
    title: searchQuery.value || undefined,
    categoryId: selectedCategoryId.value || undefined,
    tagId: selectedTagId.value || undefined,
    sortBy,
    sortOrder,
  });
}

function handleSearch() {
  currentPage.value = 1;
  loadArticles();
}

function clearSearch() {
  searchQuery.value = '';
  currentPage.value = 1;
  loadArticles();
}

function selectCategory(id) {
  selectedCategoryId.value = id;
  currentPage.value = 1;
  loadArticles();
}

function selectTag(id) {
  selectedTagId.value = id;
  currentPage.value = 1;
  loadArticles();
}

function handleSortChange() {
  currentPage.value = 1;
  loadArticles();
}

function handlePageChange(page) {
  currentPage.value = page;
  loadArticles();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetAllFilters() {
  searchQuery.value = '';
  selectedCategoryId.value = null;
  selectedTagId.value = null;
  selectedSort.value = 'createdAt-desc';
  currentPage.value = 1;
  loadArticles();
}

onMounted(async () => {
  // Load categories, tags, and initial articles simultaneously in parallel
  await Promise.all([
    articleStore.fetchCategories(),
    articleStore.fetchTags(),
    loadArticles(),
  ]);
});
</script>
