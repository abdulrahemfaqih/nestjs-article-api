<template>
  <article class="group bg-white border border-neutral-200 rounded-sm hover:border-black transition-colors duration-200 flex flex-col overflow-hidden">
    <!-- Image Thumbnail (Clickable) -->
    <router-link
      v-if="article.image"
      :to="`/article/${article.id}`"
      class="block aspect-[16/9] w-full overflow-hidden bg-neutral-100 border-b border-neutral-100 cursor-pointer"
    >
      <img
        :src="optimizeImageUrl(article.image, { width: 700, crop: 'fill' })"
        :alt="article.title"
        class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
        loading="lazy"
        decoding="async"
      />
    </router-link>

    <!-- Content Body -->
    <div class="p-6 flex-1 flex flex-col justify-between">
      <div>
        <!-- Meta Row -->
        <div class="flex items-center justify-between text-xs text-neutral-500 mb-3 gap-2">
          <div class="flex items-center gap-2">
            <span
              v-if="article.category?.name"
              class="px-2 py-0.5 border border-neutral-300 rounded text-neutral-800 font-medium text-[11px]"
            >
              {{ article.category.name }}
            </span>
            <span>&bull;</span>
            <time :datetime="article.createdAt">
              {{ formatDate(article.createdAt) }}
            </time>
          </div>

          <span
            v-if="article.status && article.status !== 'SUCCESS'"
            class="text-[10px] uppercase font-mono px-1.5 py-0.5 border"
            :class="article.status === 'PENDING' ? 'border-amber-400 text-amber-800 bg-amber-50' : 'border-red-300 text-red-700 bg-red-50'"
          >
            {{ article.status }}
          </span>
        </div>

        <!-- Title -->
        <h3 class="text-xl font-bold tracking-tight text-neutral-900 group-hover:text-amber-800 transition-colors mb-2.5">
          <router-link :to="`/article/${article.id}`" class="hover:underline">
            {{ article.title }}
          </router-link>
        </h3>

        <!-- Excerpt -->
        <p class="text-neutral-600 text-sm leading-relaxed line-clamp-3 mb-4">
          {{ cleanExcerpt(article.content) }}
        </p>

        <!-- Read More Button -->
        <router-link
          :to="`/article/${article.id}`"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 group-hover:text-amber-800 transition-colors mb-2"
        >
          <span>Baca Selengkapnya</span>
          <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </router-link>
      </div>

      <!-- Bottom Meta -->
      <div class="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <!-- Author -->
        <div class="flex items-center gap-1.5">
          <span class="text-neutral-400">Oleh</span>
          <span class="font-medium text-neutral-800">{{ article.user?.name || 'Anonim' }}</span>
        </div>

        <!-- Tags -->
        <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap gap-1">
          <span
            v-for="tag in article.tags.slice(0, 2)"
            :key="tag.id"
            class="text-[11px] text-neutral-500 hover:text-neutral-900"
          >
            #{{ tag.name }}
          </span>
          <span v-if="article.tags.length > 2" class="text-[11px] text-neutral-400">
            +{{ article.tags.length - 2 }}
          </span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ArrowRight } from 'lucide-vue-next';
import { optimizeImageUrl } from '../utils/image';

defineProps({
  article: {
    type: Object,
    required: true,
  },
});

function cleanExcerpt(content) {
  if (!content) return '';
  return content
    .replace(/^#+\s+/gm, '')
    .replace(/[*_~`]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
</script>
