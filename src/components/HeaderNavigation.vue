<script setup>
import { ref } from "vue";
import Brand from "./Brand.vue";
import Icon from "./Icon.vue";
import Modal from "./Modal.vue";
import { siteConfig as c } from "../config/siteConfig";
import { useBooking } from "../composables/useBooking";
const { open } = useBooking();
const menu = ref(false);
const links = [
  ["Home", "inicio"],
  ["Sobre", "sobre"],
  ["Serviços", "servicos"],
  ["Portfólio", "portfolio"],
  ["Promoções", "promocoes"],
  ["Avaliações", "avaliacoes"],
  ["Contato", "contato"],
];
</script>
<template>
  <header class="site-header">
    <div class="wrap header-inner">
      <RouterLink
        to="/#inicio"
        class="logo"
        :aria-label="`${c.brand.name} — início`"
        ><Brand
      /></RouterLink>
      <nav class="desktop-nav" aria-label="Navegação principal">
        <RouterLink v-for="[name, id] in links" :key="id" :to="`/#${id}`">{{
          name
        }}</RouterLink>
      </nav>
      <button class="button header-book" @click="open()">
        <Icon name="calendar" /> Agendar agora <Icon name="chevron" /></button
      ><button
        class="icon-button menu-toggle"
        aria-label="Abrir menu"
        :aria-expanded="menu"
        @click="menu = true"
      >
        <Icon name="menu" />
      </button>
    </div>
  </header>
  <Modal :open="menu" label="Menu principal" @close="menu = false"
    ><div class="mobile-menu">
      <Brand />
      <p class="eyebrow">SEU PRÓXIMO MOMENTO DE BELEZA</p>
      <nav aria-label="Navegação mobile">
        <RouterLink
          v-for="([name, id], i) in links"
          :key="id"
          :to="`/#${id}`"
          @click="menu = false"
          ><small>0{{ i + 1 }}</small
          >{{ name }}<Icon name="arrow"
        /></RouterLink>
      </nav>
      <button
        class="button full"
        @click="
          menu = false;
          open();
        "
      >
        <Icon name="whatsapp" /> Agendar pelo WhatsApp</button
      ><RouterLink to="/links" class="text-button" @click="menu = false"
        >Conheça nossa Link na Bio</RouterLink
      >
    </div></Modal
  >
</template>
