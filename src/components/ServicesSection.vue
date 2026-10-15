<script setup>
import { ref, computed, watch } from "vue";
import { siteConfig as c } from "../config/siteConfig";
import ServiceCard from "./ServiceCard.vue";
import PaginationNav from "./PaginationNav.vue";
import { usePageSize } from "../composables/usePageSize";
const category = ref("Todos"),
  query = ref(""),
  page = ref(0),
  pageSize = usePageSize();
const categories = ["Todos", ...new Set(c.services.map((s) => s.category))];
const normalize = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const filtered = computed(() =>
  c.services.filter(
    (s) =>
      (category.value === "Todos" || s.category === category.value) &&
      normalize(`${s.name} ${s.description}`).includes(
        normalize(query.value.trim()),
      ),
  ),
);
const visible = computed(() =>
  filtered.value.slice(
    page.value * pageSize.value,
    (page.value + 1) * pageSize.value,
  ),
);
watch([category, query, pageSize], () => (page.value = 0));
</script>
<template>
  <section id="servicos" class="section wrap">
    <div class="section-heading" data-reveal>
      <p class="eyebrow">O SEU PRÓXIMO FAVORITO</p>
      <h2>Um cuidado. Muitas possibilidades.</h2>
      <p>Escolha o procedimento e veja os detalhes ao agendar.</p>
    </div>
    <div class="catalog-toolbar">
      <label class="mobile-category"
        ><span class="sr-only">Categoria de serviços</span
        ><select v-model="category">
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select></label
      >
      <div class="filters" aria-label="Filtrar serviços">
        <button
          v-for="cat in categories"
          :key="cat"
          :aria-pressed="category === cat"
          @click="category = cat"
        >
          {{ cat }}
        </button>
      </div>
      <label class="search-field"
        ><span class="sr-only">Pesquisar serviço</span
        ><input v-model="query" type="search" placeholder="Buscar serviço"
      /></label>
    </div>
    <p class="demo-note" v-if="c.demo">
      Valores e descontos demonstrativos · sujeitos à validação do estúdio
    </p>
    <p class="sr-only" role="status">
      {{ filtered.length }} serviços encontrados
    </p>
    <div class="services-grid">
      <ServiceCard v-for="item in visible" :key="item.id" :item="item" />
    </div>
    <PaginationNav
      v-model:page="page"
      :total="filtered.length"
      :size="pageSize"
      label="Serviços"
    />
    <p v-if="!filtered.length" class="empty">
      Nenhum serviço encontrado. Tente outra palavra ou categoria.
    </p>
  </section>
</template>
