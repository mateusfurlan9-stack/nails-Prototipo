<script setup>
import { computed } from "vue";
const props = defineProps({
  page: Number,
  total: Number,
  size: Number,
  label: String,
});
const emit = defineEmits(["update:page"]);
const pages = computed(() => Math.max(1, Math.ceil(props.total / props.size)));
</script>
<template>
  <nav v-if="total > size" class="pagination" :aria-label="label">
    <button
      class="icon-button"
      :disabled="page === 0"
      @click="emit('update:page', page - 1)"
      :aria-label="`${label}: página anterior`"
    >
      ←</button
    ><span role="status"
      >{{ page * size + 1 }}–{{ Math.min((page + 1) * size, total) }}
      <span>de {{ total }}</span></span
    >
    <div class="page-dots">
      <button
        v-for="n in pages"
        :key="n"
        :aria-label="`${label}: página ${n}`"
        :aria-current="page === n - 1 ? 'page' : undefined"
        @click="emit('update:page', n - 1)"
      >
        <span />
      </button>
    </div>
    <button
      class="icon-button"
      :disabled="page >= pages - 1"
      @click="emit('update:page', page + 1)"
      :aria-label="`${label}: próxima página`"
    >
      →
    </button>
  </nav>
</template>
