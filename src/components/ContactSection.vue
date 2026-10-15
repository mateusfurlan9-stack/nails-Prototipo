<script setup>
import { computed, ref } from "vue";
import { siteConfig as c } from "../config/siteConfig";
import { useBooking } from "../composables/useBooking";
import Icon from "./Icon.vue";
const { open } = useBooking();
const mapLoaded = ref(false);
const directions = computed(() =>
  c.contact.address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent([c.contact.address, c.contact.city].filter(Boolean).join(", "))}`
    : null,
);
// Aceita apenas embeds HTTPS do Google Maps, sem HTML arbitrário em configuração.
const mapUrl = computed(() => {
  try {
    const u = new URL(c.contact.mapEmbed);
    return u.protocol === "https:" &&
      ["www.google.com", "maps.google.com"].includes(u.hostname) &&
      u.pathname.startsWith("/maps")
      ? u.href
      : null;
  } catch {
    return null;
  }
});
</script>
<template>
  <section id="contato" class="section wrap contact-section">
    <div data-reveal>
      <p class="eyebrow">VENHA VIVER ESSA EXPERIÊNCIA</p>
      <h2>Seu momento começa<br />com uma conversa.</h2>
      <p>
        Conte o que você imagina para suas unhas. Vamos encontrar o procedimento
        que combina com você.
      </p>
      <div class="contact-details">
        <div>
          <Icon name="pin" /><span
            ><strong>Onde nos encontrar</strong
            >{{
              c.contact.address
                ? `${c.contact.address}${c.contact.city ? ", " + c.contact.city : ""}`
                : "Endereço a configurar pelo estúdio"
            }}</span
          >
        </div>
        <div>
          <Icon name="clock" /><span
            ><strong>Horários de atendimento</strong
            >{{ c.contact.hours || "Horários a configurar pelo estúdio" }}</span
          >
        </div>
      </div>
      <div class="actions">
        <button class="button" @click="open()">
          <Icon name="whatsapp" /> Agendar atendimento</button
        ><a
          v-if="directions"
          class="button outline"
          :href="directions"
          target="_blank"
          rel="noopener noreferrer"
          >Como chegar <Icon name="arrow"
        /></a>
      </div>
      <div class="social-links">
        <a
          v-if="c.contact.instagram"
          :href="c.contact.instagram"
          target="_blank"
          rel="noopener noreferrer"
          ><Icon name="instagram" /> Instagram</a
        ><a v-if="c.contact.email" :href="`mailto:${c.contact.email}`">{{
          c.contact.email
        }}</a
        ><RouterLink to="/links"
          >Nossa Link na Bio <Icon name="arrow"
        /></RouterLink>
      </div>
    </div>
    <div class="map-card">
      <template v-if="mapUrl"
        ><iframe
          v-if="mapLoaded"
          :src="mapUrl"
          title="Mapa do endereço do estúdio"
          loading="lazy"
          referrerpolicy="no-referrer"
          allowfullscreen
        ></iframe>
        <div v-else class="map-placeholder">
          <Icon name="pin" />
          <h3>Encontre o estúdio.</h3>
          <p>O mapa carrega conteúdo externo do Google.</p>
          <button class="button" @click="mapLoaded = true">
            Carregar mapa
          </button>
        </div></template
      >
      <div v-else class="map-placeholder">
        <Icon name="flower" />
        <h3>Um espaço para cuidar de você.</h3>
        <p>
          O endereço e o mapa serão exibidos aqui após a configuração dos dados
          reais.
        </p>
        <span class="pill">Localização não configurada</span>
      </div>
    </div>
  </section>
</template>
