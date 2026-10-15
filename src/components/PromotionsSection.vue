<script setup>
import { computed } from "vue";
import { siteConfig as c, media } from "../config/siteConfig";
import { money, discount, saving, localDate } from "../utils/booking";
import { useBooking } from "../composables/useBooking";
import Icon from "./Icon.vue";
const { open } = useBooking();
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
          Ofertas ilustrativas, sem disponibilidade ou condições comerciais
          confirmadas.
        </p>
      </div>
      <div class="promotions-grid">
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
      <p v-if="!offers.length" class="empty">
        Nenhuma promoção disponível no momento.
      </p>
    </div>
  </section>
</template>
