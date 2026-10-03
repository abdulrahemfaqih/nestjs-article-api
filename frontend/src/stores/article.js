import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '../api/client';

export const useArticleStore = defineStore('article', () => {
  const articles = ref([]);
  const meta = ref({
    total: 0,
    page: 1,
    limit: 6,
    lastPage: 1,
  });
  const currentArticle = ref(null);
  const myArticles = ref([]);
  const categories = ref([]);
  const tags = ref([]);
  const users = ref([]);

  const isLoading = ref(false);
  const isDetailLoading = ref(false);
  const error = ref(null);

  // Fetch articles with search, filter, pagination
  async function fetchArticles(params = {}) {
    try {
      isLoading.value = true;
      error.value = null;

      const cleanParams = {};
      if (params.page) cleanParams.page = params.page;
      if (params.limit) cleanParams.limit = params.limit;
      if (params.title) cleanParams.title = params.title;
      if (params.categoryId) cleanParams.categoryId = params.categoryId;
      if (params.tagId) cleanParams.tagId = params.tagId;
      if (params.sortBy) cleanParams.sortBy = params.sortBy;
      if (params.sortOrder) cleanParams.sortOrder = params.sortOrder;

      const res = await apiClient.get('/article', { params: cleanParams });
      
      if (res.data?.data) {
        articles.value = res.data.data;
        meta.value = res.data.meta || {
          total: res.data.data.length,
          page: cleanParams.page || 1,
          limit: cleanParams.limit || 6,
          lastPage: 1,
        };
      } else if (Array.isArray(res.data)) {
        articles.value = res.data;
      }
      return articles.value;
    } catch (err) {
      error.value = err.message || 'Gagal memuat artikel';
      articles.value = [];
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Fetch single article
  async function fetchArticleById(id) {
    try {
      isDetailLoading.value = true;
      error.value = null;
      const res = await apiClient.get(`/article/${id}`);
      currentArticle.value = res.data;
      return res.data;
    } catch (err) {
      error.value = err.message || 'Gagal memuat artikel';
      currentArticle.value = null;
      throw err;
    } finally {
      isDetailLoading.value = false;
    }
  }

  // Fetch current user articles
  async function fetchMyArticles() {
    try {
      isLoading.value = true;
      const res = await apiClient.get('/article/user/my-articles');
      myArticles.value = Array.isArray(res.data) ? res.data : [];
      return myArticles.value;
    } catch (err) {
      myArticles.value = [];
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Fetch categories
  async function fetchCategories() {
    try {
      const res = await apiClient.get('/category');
      categories.value = Array.isArray(res.data) ? res.data : [];
      return categories.value;
    } catch (err) {
      categories.value = [];
      return [];
    }
  }

  // Category CRUD
  async function createCategory(name) {
    const res = await apiClient.post('/category', { name });
    await fetchCategories();
    return res.data;
  }

  async function updateCategory(id, name) {
    const res = await apiClient.patch(`/category/${id}`, { name });
    await fetchCategories();
    return res.data;
  }

  async function deleteCategory(id) {
    await apiClient.delete(`/category/${id}`);
    await fetchCategories();
  }

  // Fetch tags
  async function fetchTags() {
    try {
      const res = await apiClient.get('/tag');
      tags.value = Array.isArray(res.data) ? res.data : [];
      return tags.value;
    } catch (err) {
      tags.value = [];
      return [];
    }
  }

  // Tag CRUD
  async function createTag(name) {
    const res = await apiClient.post('/tag', { name });
    await fetchTags();
    return res.data;
  }

  async function updateTag(id, name) {
    const res = await apiClient.patch(`/tag/${id}`, { name });
    await fetchTags();
    return res.data;
  }

  async function deleteTag(id) {
    await apiClient.delete(`/tag/${id}`);
    await fetchTags();
  }

  // Create article (multipart/form-data)
  async function createArticle(formData) {
    const res = await apiClient.post('/article', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  }

  // Update article (multipart/form-data)
  async function updateArticle(id, formData) {
    const res = await apiClient.patch(`/article/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  }

  // Delete article
  async function deleteArticle(id) {
    await apiClient.delete(`/article/${id}`);
    articles.value = articles.value.filter((a) => a.id !== id);
  }

  // Comments
  async function createComment(articleId, content) {
    const res = await apiClient.post(`/article/${articleId}/comments`, { content });
    // Refresh article detail to show new comment
    if (currentArticle.value?.id === articleId) {
      await fetchArticleById(articleId);
    }
    return res.data;
  }

  async function deleteComment(commentId, articleId) {
    await apiClient.delete(`/comment/${commentId}`);
    if (currentArticle.value?.id === articleId) {
      await fetchArticleById(articleId);
    }
  }

  // Admin users management
  async function fetchUsers() {
    const res = await apiClient.get('/users');
    users.value = Array.isArray(res.data) ? res.data : [];
    return users.value;
  }

  async function updateUserRole(id, role) {
    const res = await apiClient.patch(`/users/${id}`, { role });
    await fetchUsers();
    return res.data;
  }

  return {
    articles,
    meta,
    currentArticle,
    myArticles,
    categories,
    tags,
    users,
    isLoading,
    isDetailLoading,
    error,
    fetchArticles,
    fetchArticleById,
    fetchMyArticles,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
    createArticle,
    updateArticle,
    deleteArticle,
    createComment,
    deleteComment,
    fetchUsers,
    updateUserRole,
  };
});
