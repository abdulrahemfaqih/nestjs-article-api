import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ArticleDetailView from '../views/ArticleDetailView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ProfileView from '../views/ProfileView.vue';
import ArticleEditorView from '../views/ArticleEditorView.vue';
import AdminDashboardView from '../views/AdminDashboardView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/article/:id',
    name: 'article-detail',
    component: ArticleDetailView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { guestOnly: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: '/write',
    name: 'write-article',
    component: ArticleEditorView,
    meta: { requiresAdmin: true },
  },
  {
    path: '/article/:id/edit',
    name: 'edit-article',
    component: ArticleEditorView,
    meta: { requiresAdmin: true },
  },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: AdminDashboardView,
    meta: { requiresAdmin: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // If token exists in storage but user state is not loaded yet, fetch user
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchCurrentUser();
    } catch (e) {
      // Ignored, token will be cleared
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next({ name: 'home' });
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next({ name: 'home' });
  }

  next();
});

export default router;
