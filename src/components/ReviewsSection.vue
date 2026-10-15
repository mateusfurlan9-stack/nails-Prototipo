<script setup>
import { ref } from "vue";
import { siteConfig as c } from "../config/siteConfig";
import Icon from "./Icon.vue";
const track = ref();
function move(n) {
  const card = track.value?.querySelector("article");
  track.value?.scrollBy({
    left: n * ((card?.offsetWidth || 280) + 20),
    behavior:
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.classList.contains("motion-off")
        ? "instant"
        : "smooth",
  });
}
</script>
<template>
  <section id="avaliacoes" class="section wrap">
    <div class="section-heading" data-reveal>
      <p class="eyebrow">AVALIAÇÕES</p>
      <h2>O cuidado também se sente.</h2>
      <p v-if="c.demo">
        Depoimentos fictícios para demonstrar o layout. Não são avaliações do
        Google.
      </p>
    </div>
    <div
      ref="track"
      class="reviews-track"
      tabindex="0"
      aria-label="Depoimentos, role para ver todos"
    >
      <article
        v-for="review in c.reviews"
        :key="review.name"
        class="review-card"
      >
        <div class="review-person">
          <span class="avatar" aria-hidden="true">{{
            review.name.charAt(0)
          }}</span>
          <div>
            <h3>{{ review.name }}</h3>
            <span class="stars" :aria-label="`${review.rating} de 5 estrelas`"
              ><Icon v-for="i in review.rating" :key="i" name="star"
            /></span>
          </div>
        </div>
        <blockquote>“{{ review.text }}”</blockquote>
        <time v-if="review.date" :datetime="review.date">{{
          review.date.split("-").reverse().join("/")
        }}</time
        ><small v-if="c.demo">Demonstração fictícia</small>
      </article>
    </div>
    <div class="reviews-controls">
      <button
        class="icon-button"
        aria-label="Depoimento anterior"
        @click="move(-1)"
      >
        ←</button
      ><span>Deslize para explorar</span
      ><button
        class="icon-button"
        aria-label="Próximo depoimento"
        @click="move(1)"
      >
        →
      </button>
    </div>
    <a
      v-if="c.contact.reviewsUrl"
      class="button outline centered"
      :href="c.contact.reviewsUrl"
      target="_blank"
      rel="noopener noreferrer"
      >Ver avaliações reais <Icon name="arrow"
    /></a>
    <p v-else class="demo-note">
      O link de avaliações reais será disponibilizado pelo estúdio.
    </p>
  </section>
</template>
