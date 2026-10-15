<script setup>
import { computed, ref, watch } from "vue";
import { siteConfig as c, media } from "../config/siteConfig";
import Modal from "./Modal.vue";
import Icon from "./Icon.vue";
import PaginationNav from "./PaginationNav.vue";
const page = ref(0),
  pageSize = 4;
const category = ref("Todos"),
  index = ref(-1),
  start = ref(0);
const categories = ["Todos", ...new Set(c.gallery.map((i) => i.category))];
const filtered = computed(() =>
  c.gallery.filter(
    (i) => category.value === "Todos" || category.value === i.category,
  ),
);
const active = computed(() => filtered.value[index.value]);
const visible = computed(() =>
  filtered.value.slice(page.value * pageSize, (page.value + 1) * pageSize),
);
watch(category, () => {
  index.value = -1;
  page.value = 0;
});
function move(n) {
  index.value =
    (index.value + n + filtered.value.length) % filtered.value.length;
}
function swipe(event) {
  const diff = event.changedTouches[0].clientX - start.value;
  if (Math.abs(diff) > 45) move(diff > 0 ? -1 : 1);
}
</script>
<template>
  <section id="portfolio" class="section gallery-section">
    <div class="wrap">
      <div class="section-heading" data-reveal>
        <p class="eyebrow">NOSSO PORTFÓLIO</p>
        <h2>Trabalhos que inspiram.</h2>
        <p>Encontre referências para o seu próximo estilo.</p>
      </div>
      <p class="demo-note" v-if="c.demo">
        Referências visuais geradas · portfólio demonstrativo
      </p>
      <div class="filters" aria-label="Filtrar portfólio">
        <button
          v-for="cat in categories"
          :key="cat"
          :aria-pressed="cat === category"
          @click="category = cat"
        >
          {{ cat }}
        </button>
      </div>
      <p class="sr-only" role="status">
        {{ filtered.length }} imagens na galeria
      </p>
      <div class="gallery-grid">
        <button
          v-for="(photo, i) in visible"
          :key="photo.id"
          class="gallery-item"
          @click="index = page * pageSize + i"
          :aria-label="`Ampliar ${photo.caption}`"
        >
          <img
            :src="media(photo.image)"
            :alt="photo.alt"
            width="640"
            height="640"
            loading="lazy"
            decoding="async"
          /><span>{{ photo.caption }}<Icon name="arrow" /></span>
        </button>
      </div>
      <PaginationNav
        v-model:page="page"
        :total="filtered.length"
        :size="pageSize"
        label="Portfólio"
      />
    </div>
    <Modal
      :open="index >= 0"
      label="Fotografia ampliada do portfólio"
      variant="lightbox"
      @keydown.left.prevent="move(-1)"
      @keydown.right.prevent="move(1)"
      @close="index = -1"
      ><div
        class="lightbox"
        tabindex="0"
        autofocus
        v-if="active"
        @touchstart.passive="start = $event.touches[0].clientX"
        @touchend="swipe"
      >
        <img
          :src="media(active.image)"
          :alt="active.alt"
          width="640"
          height="640"
        />
        <div class="lightbox-controls">
          <button
            class="icon-button"
            aria-label="Foto anterior"
            @click="move(-1)"
          >
            ←
          </button>
          <p aria-live="polite">
            {{ active.caption
            }}<small
              >{{ index + 1 }} / {{ filtered.length }} · imagem
              demonstrativa</small
            >
          </p>
          <button
            class="icon-button"
            aria-label="Próxima foto"
            @click="move(1)"
          >
            →
          </button>
        </div>
      </div></Modal
    >
  </section>
</template>
