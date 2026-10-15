<script setup>
import { siteConfig as c } from "../config/siteConfig";
</script>
<template>
  <span class="brand-mark"
    ><img
      v-if="c.brand.logo"
      :src="c.brand.logo"
      :alt="c.brand.name"
      width="180"
      height="64"
    /><template v-else
      ><span class="brand-name">{{ c.brand.name }}</span
      ><span class="brand-caption">{{ c.brand.subtitle }}</span></template
    ></span
  >
</template>
