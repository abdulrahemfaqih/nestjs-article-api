import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '../api/client';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(null);
  const profile = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  // Fetch current user and profile data
  async function fetchCurrentUser() {
    if (!token.value) {
      user.value = null;
      profile.value = null;
      return null;
    }

    try {
      isLoading.value = true;
      const res = await apiClient.get('/auth/getuser');
      user.value = res.data;

      // Also try to fetch profile
      try {
        const profileRes = await apiClient.get('/profile');
        profile.value = profileRes.data?.profile || profileRes.data || null;
      } catch (e) {
        profile.value = null;
      }

      return user.value;
    } catch (err) {
      // If token expired or invalid, clear it
      logout();
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  // Login
  async function login(email, password) {
    try {
      isLoading.value = true;
      error.value = null;
      const res = await apiClient.post('/auth/login', { email, password });
      const accessToken = res.data?.access_token;
      
      if (!accessToken) {
        throw new Error('Token autentikasi tidak ditemukan dalam respon.');
      }

      token.value = accessToken;
      localStorage.setItem('token', accessToken);

      await fetchCurrentUser();
      return true;
    } catch (err) {
      error.value = err.message || 'Login gagal';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Register
  async function register({ name, email, password }) {
    try {
      isLoading.value = true;
      error.value = null;
      const payload = { name, email, password };

      const res = await apiClient.post('/auth/register', payload);
      return res.data;
    } catch (err) {
      error.value = err.message || 'Registrasi gagal';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Update profile
  async function updateProfile({ age, bio }) {
    try {
      isLoading.value = true;
      error.value = null;
      const payload = {
        age: age ? Number(age) : undefined,
        bio: bio || undefined,
      };
      const res = await apiClient.post('/profile', payload);
      // Refresh current profile
      await fetchCurrentUser();
      return res.data;
    } catch (err) {
      error.value = err.message || 'Gagal memperbarui profil';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Logout
  function logout() {
    token.value = null;
    user.value = null;
    profile.value = null;
    localStorage.removeItem('token');
  }

  return {
    token,
    user,
    profile,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    fetchCurrentUser,
    login,
    register,
    updateProfile,
    logout,
  };
});
