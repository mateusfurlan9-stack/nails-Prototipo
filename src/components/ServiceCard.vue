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
        sizes="(max-width: 650px) 96px, (max-width: 950px) 30vw, 360px"
        :alt="item.alt || `${item.name}, foto ilustrativa`"
        width="504"
        height="504"
        loading="lazy"
        decoding="async"
      /><span v-if="discount(item)" class="badge"
        >−{{ discount(item) }}%<span v-if="c.demo"> demo</span></span
      >
    </div>
    <div class="service-content">
      <p class="category">{{ item.category || "SEU MOMENTO" }}</p>
      <h3>{{ item.name }}</h3>
      <p class="service-description">{{ item.description }}</p>
      <div v-if="item.duration" class="duration">
        <Icon name="clock" />{{ item.duration }} min · estimativa
      </div>
      <div class="service-bottom">
        <p class="prices">
          <del v-if="discount(item)">{{ money(item.original) }}</del
          ><strong>{{ money(item.price) }}</strong>
        </p>
        <button
          class="button small"
          @click="open(item)"
          :aria-label="`Ver detalhes e agendar ${item.name}`"
        >
          Escolher <Icon name="arrow" />
        </button>
      </div>
    </div>
  </article>
</template>
