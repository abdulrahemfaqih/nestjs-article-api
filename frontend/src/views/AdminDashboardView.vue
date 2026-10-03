<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
    <!-- Header -->
    <header class="mb-8 pb-6 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
          Panel Administrator
        </h1>
        <p class="text-xs text-neutral-500 mt-1">
          Kelola artikel, taksonomi kategori & tag, serta hak akses pengguna
        </p>
      </div>

      <router-link
        to="/write"
        class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors"
      >
        <Plus class="w-3.5 h-3.5" />
        <span>Tulis Artikel</span>
      </router-link>
    </header>

    <!-- Navigation Tabs -->
    <div class="flex items-center space-x-1 sm:space-x-4 border-b border-neutral-200 mb-8 overflow-x-auto pb-1 no-scrollbar">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap"
        :class="activeTab === tab.id ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-black'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Feedback Message -->
    <div
      v-if="feedback.message"
      class="mb-6 p-3 text-xs rounded border"
      :class="feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'"
    >
      {{ feedback.message }}
    </div>

    <!-- TAB 1: ARTICLES MANAGEMENT -->
    <div v-if="activeTab === 'articles'">
      <div class="bg-white border border-neutral-200 rounded overflow-hidden">
        <div class="p-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-neutral-900">Daftar Semua Artikel</h2>
          <span class="text-xs text-neutral-500">{{ articleStore.articles.length }} artikel dimuat</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider">
              <tr>
                <th class="py-3 px-4">Judul</th>
                <th class="py-3 px-4">Kategori</th>
                <th class="py-3 px-4">Penulis</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100">
              <tr v-for="art in articleStore.articles" :key="art.id" class="hover:bg-neutral-50/60">
                <td class="py-3 px-4 font-medium text-neutral-900 max-w-xs truncate">
                  <router-link :to="`/article/${art.id}`" class="hover:underline">
                    {{ art.title }}
                  </router-link>
                </td>
                <td class="py-3 px-4 text-neutral-600">
                  {{ art.category?.name || '-' }}
                </td>
                <td class="py-3 px-4 text-neutral-600">
                  {{ art.user?.name || '-' }}
                </td>
                <td class="py-3 px-4">
                  <span
                    class="text-[10px] uppercase font-mono px-1.5 py-0.5 border rounded"
                    :class="art.status === 'SUCCESS' ? 'border-emerald-300 text-emerald-800 bg-emerald-50' : 'border-amber-300 text-amber-800 bg-amber-50'"
                  >
                    {{ art.status }}
                  </span>
                </td>
                <td class="py-3 px-4 text-right space-x-2">
                  <router-link
                    :to="`/article/${art.id}/edit`"
                    class="inline-block px-2.5 py-1 border border-neutral-300 rounded hover:border-black text-neutral-700 font-medium"
                  >
                    Edit
                  </router-link>
                  <button
                    @click="handleDeleteArticle(art.id)"
                    class="px-2.5 py-1 border border-red-200 text-red-600 rounded hover:bg-red-50 font-medium"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
              <tr v-if="articleStore.articles.length === 0">
                <td colspan="5" class="py-8 text-center text-neutral-400">
                  Belum ada artikel yang tersedia.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 2: CATEGORIES MANAGEMENT -->
    <div v-else-if="activeTab === 'categories'" class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Create Category Form -->
      <div class="bg-white border border-neutral-200 rounded p-5">
        <h2 class="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">
          Tambah Kategori
        </h2>
        <form @submit.prevent="handleCreateCategory" class="space-y-4">
          <div>
            <label for="category-name" class="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
              Nama Kategori
            </label>
            <input
              id="category-name"
              v-model="newCategoryName"
              type="text"
              required
              placeholder="misal: Teknologi, Tutorial"
              class="w-full text-xs px-3 py-2 bg-white border border-neutral-300 rounded focus:outline-none focus:border-black"
            />
          </div>
          <button
            type="submit"
            :disabled="!newCategoryName.trim()"
            class="w-full py-2 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 disabled:opacity-40"
          >
            Simpan Kategori
          </button>
        </form>
      </div>

      <!-- Categories List Table -->
      <div class="md:col-span-2 bg-white border border-neutral-200 rounded overflow-hidden">
        <div class="p-4 border-b border-neutral-200">
          <h2 class="text-sm font-semibold text-neutral-900">Daftar Kategori Aktif</h2>
        </div>
        <table class="w-full text-left text-xs">
          <thead class="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider">
            <tr>
              <th class="py-3 px-4">Nama Kategori</th>
              <th class="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr v-for="cat in articleStore.categories" :key="cat.id" class="hover:bg-neutral-50/60">
              <td class="py-3 px-4 font-medium text-neutral-800">
                <template v-if="editingCategoryId === cat.id">
                  <input
                    v-model="editingCategoryName"
                    class="px-2 py-1 border border-black rounded text-xs w-48"
                  />
                </template>
                <template v-else>
                  {{ cat.name }}
                </template>
              </td>
              <td class="py-3 px-4 text-right space-x-2">
                <template v-if="editingCategoryId === cat.id">
                  <button
                    @click="handleSaveCategory(cat.id)"
                    class="px-2 py-1 bg-black text-white rounded text-[11px]"
                  >
                    Simpan
                  </button>
                  <button
                    @click="editingCategoryId = null"
                    class="px-2 py-1 border border-neutral-300 rounded text-[11px]"
                  >
                    Batal
                  </button>
                </template>
                <template v-else>
                  <button
                    @click="startEditCategory(cat)"
                    class="px-2 py-1 border border-neutral-300 rounded hover:border-black text-[11px]"
                  >
                    Ubah
                  </button>
                  <button
                    @click="handleDeleteCategory(cat.id)"
                    class="px-2 py-1 border border-red-200 text-red-600 rounded hover:bg-red-50 text-[11px]"
                  >
                    Hapus
                  </button>
                </template>
              </td>
            </tr>
            <tr v-if="articleStore.categories.length === 0">
              <td colspan="2" class="py-6 text-center text-neutral-400">Belum ada kategori.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 3: TAGS MANAGEMENT -->
    <div v-else-if="activeTab === 'tags'" class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Create Tag Form -->
      <div class="bg-white border border-neutral-200 rounded p-5">
        <h2 class="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">
          Tambah Tag
        </h2>
        <form @submit.prevent="handleCreateTag" class="space-y-4">
          <div>
            <label for="tag-name" class="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
              Nama Tag
            </label>
            <input
              id="tag-name"
              v-model="newTagName"
              type="text"
              required
              placeholder="misal: nestjs, typescript"
              class="w-full text-xs px-3 py-2 bg-white border border-neutral-300 rounded focus:outline-none focus:border-black"
            />
          </div>
          <button
            type="submit"
            :disabled="!newTagName.trim()"
            class="w-full py-2 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 disabled:opacity-40"
          >
            Simpan Tag
          </button>
        </form>
      </div>

      <!-- Tags List Table -->
      <div class="md:col-span-2 bg-white border border-neutral-200 rounded overflow-hidden">
        <div class="p-4 border-b border-neutral-200">
          <h2 class="text-sm font-semibold text-neutral-900">Daftar Tag Aktif</h2>
        </div>
        <table class="w-full text-left text-xs">
          <thead class="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider">
            <tr>
              <th class="py-3 px-4">Nama Tag</th>
              <th class="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr v-for="tag in articleStore.tags" :key="tag.id" class="hover:bg-neutral-50/60">
              <td class="py-3 px-4 font-medium text-neutral-800">
                <template v-if="editingTagId === tag.id">
                  <input
                    v-model="editingTagName"
                    class="px-2 py-1 border border-black rounded text-xs w-48"
                  />
                </template>
                <template v-else>
                  #{{ tag.name }}
                </template>
              </td>
              <td class="py-3 px-4 text-right space-x-2">
                <template v-if="editingTagId === tag.id">
                  <button
                    @click="handleSaveTag(tag.id)"
                    class="px-2 py-1 bg-black text-white rounded text-[11px]"
                  >
                    Simpan
                  </button>
                  <button
                    @click="editingTagId = null"
                    class="px-2 py-1 border border-neutral-300 rounded text-[11px]"
                  >
                    Batal
                  </button>
                </template>
                <template v-else>
                  <button
                    @click="startEditTag(tag)"
                    class="px-2 py-1 border border-neutral-300 rounded hover:border-black text-[11px]"
                  >
                    Ubah
                  </button>
                  <button
                    @click="handleDeleteTag(tag.id)"
                    class="px-2 py-1 border border-red-200 text-red-600 rounded hover:bg-red-50 text-[11px]"
                  >
                    Hapus
                  </button>
                </template>
              </td>
            </tr>
            <tr v-if="articleStore.tags.length === 0">
              <td colspan="2" class="py-6 text-center text-neutral-400">Belum ada tag.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 4: USERS MANAGEMENT -->
    <div v-else-if="activeTab === 'users'">
      <div class="bg-white border border-neutral-200 rounded overflow-hidden">
        <div class="p-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-neutral-900">Daftar Pengguna Terdaftar</h2>
          <span class="text-xs text-neutral-500">{{ articleStore.users.length }} pengguna</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider">
              <tr>
                <th class="py-3 px-4">Nama Pengguna</th>
                <th class="py-3 px-4">Email</th>
                <th class="py-3 px-4">Peran (Role)</th>
                <th class="py-3 px-4 text-right">Ubah Peran</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100">
              <tr v-for="u in articleStore.users" :key="u.id" class="hover:bg-neutral-50/60">
                <td class="py-3 px-4 font-medium text-neutral-900">
                  {{ u.name }}
                </td>
                <td class="py-3 px-4 text-neutral-600">
                  {{ u.email }}
                </td>
                <td class="py-3 px-4">
                  <span
                    class="text-[10px] uppercase font-mono px-2 py-0.5 border rounded font-semibold"
                    :class="u.role === 'admin' ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 text-neutral-700 bg-neutral-50'"
                  >
                    {{ u.role }}
                  </span>
                </td>
                <td class="py-3 px-4 text-right">
                  <select
                    :value="u.role"
                    @change="handleChangeUserRole(u.id, $event.target.value)"
                    class="text-xs bg-white border border-neutral-300 rounded px-2 py-1 text-neutral-800 cursor-pointer focus:outline-none focus:border-black"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
              </tr>
              <tr v-if="articleStore.users.length === 0">
                <td colspan="4" class="py-8 text-center text-neutral-400">
                  Tidak ada data pengguna.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useArticleStore } from '../stores/article';
import { Plus } from 'lucide-vue-next';

const articleStore = useArticleStore();

const tabs = [
  { id: 'articles', label: 'Artikel' },
  { id: 'categories', label: 'Kategori' },
  { id: 'tags', label: 'Tag' },
  { id: 'users', label: 'Pengguna' },
];

const activeTab = ref('articles');
const feedback = reactive({ type: 'success', message: '' });

// Category state
const newCategoryName = ref('');
const editingCategoryId = ref(null);
const editingCategoryName = ref('');

// Tag state
const newTagName = ref('');
const editingTagId = ref(null);
const editingTagName = ref('');

function showFeedback(type, message) {
  feedback.type = type;
  feedback.message = message;
  setTimeout(() => {
    feedback.message = '';
  }, 4000);
}

// Articles
async function handleDeleteArticle(id) {
  if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
    try {
      await articleStore.deleteArticle(id);
      showFeedback('success', 'Artikel berhasil dihapus.');
      await articleStore.fetchArticles({ limit: 100 });
    } catch (err) {
      showFeedback('error', err.message || 'Gagal menghapus artikel.');
    }
  }
}

// Categories
async function handleCreateCategory() {
  try {
    await articleStore.createCategory(newCategoryName.value.trim());
    newCategoryName.value = '';
    showFeedback('success', 'Kategori baru berhasil ditambahkan.');
  } catch (err) {
    showFeedback('error', err.message || 'Gagal menambahkan kategori.');
  }
}

function startEditCategory(cat) {
  editingCategoryId.value = cat.id;
  editingCategoryName.value = cat.name;
}

async function handleSaveCategory(id) {
  try {
    await articleStore.updateCategory(id, editingCategoryName.value.trim());
    editingCategoryId.value = null;
    showFeedback('success', 'Kategori berhasil diperbarui.');
  } catch (err) {
    showFeedback('error', err.message || 'Gagal memperbarui kategori.');
  }
}

async function handleDeleteCategory(id) {
  if (confirm('Hapus kategori ini?')) {
    try {
      await articleStore.deleteCategory(id);
      showFeedback('success', 'Kategori berhasil dihapus.');
    } catch (err) {
      showFeedback('error', err.message || 'Gagal menghapus kategori.');
    }
  }
}

// Tags
async function handleCreateTag() {
  try {
    await articleStore.createTag(newTagName.value.trim());
    newTagName.value = '';
    showFeedback('success', 'Tag baru berhasil ditambahkan.');
  } catch (err) {
    showFeedback('error', err.message || 'Gagal menambahkan tag.');
  }
}

function startEditTag(tag) {
  editingTagId.value = tag.id;
  editingTagName.value = tag.name;
}

async function handleSaveTag(id) {
  try {
    await articleStore.updateTag(id, editingTagName.value.trim());
    editingTagId.value = null;
    showFeedback('success', 'Tag berhasil diperbarui.');
  } catch (err) {
    showFeedback('error', err.message || 'Gagal memperbarui tag.');
  }
}

async function handleDeleteTag(id) {
  if (confirm('Hapus tag ini?')) {
    try {
      await articleStore.deleteTag(id);
      showFeedback('success', 'Tag berhasil dihapus.');
    } catch (err) {
      showFeedback('error', err.message || 'Gagal menghapus tag.');
    }
  }
}

// Users
async function handleChangeUserRole(userId, newRole) {
  try {
    await articleStore.updateUserRole(userId, newRole);
    showFeedback('success', 'Peran pengguna berhasil diperbarui.');
  } catch (err) {
    showFeedback('error', err.message || 'Gagal memperbarui peran pengguna.');
  }
}

onMounted(async () => {
  await Promise.all([
    articleStore.fetchArticles({ limit: 100 }),
    articleStore.fetchCategories(),
    articleStore.fetchTags(),
    articleStore.fetchUsers(),
  ]);
});
</script>
