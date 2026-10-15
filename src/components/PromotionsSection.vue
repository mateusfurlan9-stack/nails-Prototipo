<script setup>
import { computed, ref } from "vue";
import { siteConfig as c, media } from "../config/siteConfig";
import { money, discount, saving, localDate } from "../utils/booking";
import { useBooking } from "../composables/useBooking";
import Icon from "./Icon.vue";
const { open } = useBooking();
const track = ref(),
  slide = ref(0);
function step() {
  const card = track.value?.querySelector(".offer");
  return (card?.getBoundingClientRect().width || 300) + 12;
}
function move(n) {
  const next = Math.max(0, Math.min(offers.value.length - 1, slide.value + n));
  track.value?.scrollBy({
    left: (next - slide.value) * step(),
    behavior:
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.classList.contains("motion-off")
        ? "instant"
        : "smooth",
  });
  slide.value = next;
}
function syncSlide() {
  if (track.value?.scrollWidth > track.value?.clientWidth)
    slide.value = Math.max(
      0,
      Math.min(
        offers.value.length - 1,
        Math.round(track.value.scrollLeft / step()),
      ),
    );
}
const offers = computed(() =>
  c.promotions.filter((p) => !p.validUntil || p.validUntil >= localDate()),
);
</script>
<template>
  <section id="promocoes" class="section promo-section">
    <div class="wrap">
      <div class="section-heading" data-reveal>
        <p class="eyebrow">PROMOÇÕES</p>
        <h2>Um cuidado especial para você.</h2>
        <p v-if="c.demo">
          Combos e valores demonstrativos, a confirmar com o estúdio.
        </p>
      </div>
      <div
        ref="track"
        class="promotions-grid"
        role="region"
        aria-label="Ofertas especiais"
        aria-roledescription="carrossel"
        tabindex="0"
        @scroll.passive="syncSlide"
        @keydown.left.prevent="move(-1)"
        @keydown.right.prevent="move(1)"
      >
        <article v-for="offer in offers" :key="offer.id" class="offer">
          <div class="offer-image">
            <img
              :src="media(offer.image)"
              :alt="`${offer.name}, fotografia demonstrativa`"
              width="640"
              height="640"
              loading="lazy"
            /><span class="badge"
              >−{{ discount(offer) }}% {{ c.demo ? "demo" : "" }}</span
            >
          </div>
          <div class="offer-copy">
            <h3>{{ offer.name }}</h3>
            <p>{{ offer.description }}</p>
            <p class="prices">
              <strong>{{ money(offer.price) }}</strong
              ><del>{{ money(offer.original) }}</del>
            </p>
            <small
              >Economia {{ c.demo ? "demonstrativa" : "" }} de
              {{ money(saving(offer)) }}</small
            ><small v-if="offer.validUntil"
              >Válida até
              {{ offer.validUntil.split("-").reverse().join("/") }}</small
            ><button class="button full small" @click="open(offer)">
              Escolher esta oferta <Icon name="arrow" />
            </button>
          </div>
        </article>
      </div>
      <div v-if="offers.length > 1" class="promo-controls">
        <button
          class="icon-button"
          aria-label="Oferta anterior"
          :disabled="slide === 0"
          @click="move(-1)"
        >
          ←</button
        ><span aria-live="polite"
          >{{ slide + 1 }} / {{ offers.length }}
          <small>Deslize para explorar</small></span
        ><button
          class="icon-button"
          aria-label="Próxima oferta"
          :disabled="slide === offers.length - 1"
          @click="move(1)"
        >
          →
        </button>
      </div>
      <p v-if="!offers.length" class="empty">
        Nenhuma promoção disponível no momento.
      </p>
    </div>
  </section>
</template>
