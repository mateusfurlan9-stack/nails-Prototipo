<script setup>
import { ref, computed } from "vue";
import { siteConfig as c, media } from "../config/siteConfig";
const selected = ref(0),
  position = ref(50);
const current = computed(() => c.transformations[selected.value]);
</script>
<template>
  <section
    v-if="current"
    id="transformacoes"
    class="section wrap comparison-section"
  >
    <div class="section-heading" data-reveal>
      <p class="eyebrow">ANTES & DEPOIS</p>
      <h2>Um novo olhar para suas unhas.</h2>
      <p>Arraste o controle e explore a transformação demonstrativa.</p>
    </div>
    <div class="comparison-layout">
      <div class="comparison" :style="{ '--position': position + '%' }">
        <img
          class="compare-base"
          :src="media(current.after)"
          alt="Depois: referência ilustrativa de unhas finalizadas"
          width="640"
          height="640"
          loading="lazy"
        /><img
          class="compare-before"
          :src="media(current.before)"
          alt="Antes: referência ilustrativa de unhas naturais"
          width="640"
          height="640"
          loading="lazy"
        /><span class="compare-tag before-tag">Antes</span
        ><span class="compare-tag after-tag">Depois</span
        ><span class="compare-line" aria-hidden="true"><span>↔</span></span
        ><input
          v-model.number="position"
          class="compare-range"
          type="range"
          min="0"
          max="100"
          aria-label="Comparar antes e depois"
          :aria-valuetext="`${position}% da imagem antes visível`"
        />
      </div>
      <div class="comparison-copy">
        <p class="eyebrow">ESTILO EM CADA DETALHE</p>
        <h3>{{ current.title }}</h3>
        <p>{{ current.description }}</p>
        <p>
          Use o toque, arraste com o mouse ou utilize as setas do teclado no
          controle.
        </p>
        <div class="transform-options" aria-label="Escolher transformação">
          <button
            v-for="(item, i) in c.transformations"
            :key="item.title"
            :aria-pressed="selected === i"
            @click="
              selected = i;
              position = 50;
            "
          >
            <img
              :src="`/media/${item.after}-thumb.webp`"
              alt=""
              width="64"
              height="64"
              loading="lazy"
            /><span>{{ item.title }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
