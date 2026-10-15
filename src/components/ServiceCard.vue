<script setup>
import { siteConfig as c, media } from "../config/siteConfig";
import { discount, money } from "../utils/booking";
import { useBooking } from "../composables/useBooking";
import Icon from "./Icon.vue";
defineProps({ item: Object, compact: Boolean });
const { open } = useBooking();
</script>
<template>
  <article class="service-card" :class="{ compact }">
    <div class="service-image">
      <img
        :src="media(item.image)"
        :srcset="`/media/${item.image}-thumb.webp 256w, ${media(item.image)} 504w`"
        :sizes="
          compact
            ? '(max-width: 360px) 120px, 170px'
            : '(max-width: 360px) 90vw, (max-width: 950px) 45vw, 390px'
        "
        :alt="item.alt || `${item.name}, foto ilustrativa`"
        width="640"
        height="640"
        loading="lazy"
        decoding="async"
      /><span v-if="discount(item)" class="badge"
        >−{{ discount(item) }}% <span v-if="c.demo">demo</span></span
      >
    </div>
    <div class="service-content">
      <p v-if="!compact" class="category">{{ item.category }}</p>
      <h3>{{ item.name }}</h3>
      <p v-if="!compact">{{ item.description }}</p>
      <div v-if="item.duration && !compact" class="duration">
        <Icon name="clock" /> {{ item.duration }} min <span>· estimativa</span>
      </div>
      <p class="prices">
        <del v-if="discount(item)">{{ money(item.original) }}</del
        ><strong>{{ money(item.price) }}</strong>
      </p>
      <small v-if="c.demo" class="demo-price">Valores demonstrativos</small
      ><button class="button full small" @click="open(item)">
        <Icon name="calendar" />
        {{ compact ? "Escolher" : "Agendar este serviço" }}
      </button>
    </div>
  </article>
</template>
