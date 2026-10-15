<script setup>
import { ref, computed } from "vue";
import { siteConfig as c } from "../config/siteConfig";
import ServiceCard from "./ServiceCard.vue";
const category = ref("Todos"),
  query = ref("");
const categories = ["Todos", ...new Set(c.services.map((s) => s.category))];
const filtered = computed(() =>
  c.services.filter(
    (s) =>
      (category.value === "Todos" || s.category === category.value) &&
      `${s.name} ${s.description}`
        .toLocaleLowerCase("pt-BR")
        .includes(query.value.toLocaleLowerCase("pt-BR")),
  ),
);
</script>
<template>
  <section id="servicos" class="section wrap">
    <div class="section-heading" data-reveal>
      <p class="eyebrow">NOSSOS SERVIÇOS</p>
      <h2>Escolha o seu momento de beleza.</h2>
      <p>Da beleza natural ao seu próximo estilo favorito.</p>
    </div>
    <p v-if="c.demo" class="demo-note">
      Tabela de demonstração · preços, descontos e durações precisam de
      validação.
    </p>
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
      ><input
        v-model="query"
        type="search"
        placeholder="Qual procedimento você procura?"
    /></label>
    <p class="sr-only" role="status">
      {{ filtered.length }} serviços encontrados
    </p>
    <TransitionGroup name="cards" tag="div" class="services-grid"
      ><ServiceCard v-for="item in filtered" :key="item.id" :item="item"
    /></TransitionGroup>
    <p v-if="!filtered.length" class="empty">
      Nenhum serviço encontrado. Tente outra palavra ou categoria.
    </p>
  </section>
</template>
