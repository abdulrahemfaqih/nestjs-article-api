<template>
  <div v-if="totalPages > 1" class="flex items-center justify-between py-6 border-t border-neutral-200">
    <!-- Meta text -->
    <div class="text-xs text-neutral-500">
      Halaman <span class="font-medium text-neutral-900">{{ currentPage }}</span> dari <span class="font-medium text-neutral-900">{{ totalPages }}</span>
      <span v-if="totalItems" class="ml-1">({{ totalItems }} total artikel)</span>
    </div>

    <!-- Controls -->
    <div class="flex items-center space-x-1.5">
      <button
        :disabled="currentPage <= 1"
        @click="$emit('change-page', currentPage - 1)"
        class="px-3 py-1.5 text-xs font-medium border border-neutral-300 rounded hover:border-black disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        Sebelumnya
      </button>

      <button
        v-for="page in pages"
        :key="page"
        @click="$emit('change-page', page)"
        class="w-8 h-8 flex items-center justify-center text-xs font-medium rounded transition-colors"
        :class="page === currentPage ? 'bg-black text-white' : 'border border-neutral-300 text-neutral-700 hover:border-black'"
      >
        {{ page }}
      </button>

      <button
        :disabled="currentPage >= totalPages"
        @click="$emit('change-page', currentPage + 1)"
        class="px-3 py-1.5 text-xs font-medium border border-neutral-300 rounded hover:border-black disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        Selanjutnya
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    default: 0,
  },
});

defineEmits(['change-page']);

const pages = computed(() => {
  const list = [];
  for (let i = 1; i <= props.totalPages; i++) {
    // simple page range for clean UI
    if (
      i === 1 ||
      i === props.totalPages ||
      (i >= props.currentPage - 1 && i <= props.currentPage + 1)
    ) {
      list.push(i);
    }
  }
  return list;
});
</script>
