<script setup>
import { computed, ref, onUnmounted } from "vue";
import { siteConfig as c, media } from "../config/siteConfig";
import { useBooking } from "../composables/useBooking";
import Brand from "../components/Brand.vue";
import Icon from "../components/Icon.vue";
import ServiceCard from "../components/ServiceCard.vue";
import { money, saving, localDate } from "../utils/booking";
const { open } = useBooking();
const shareStatus = ref("");
let shareTimer;
async function sharePage() {
  const data = {
    title: c.brand.name,
    text: c.brand.tagline,
    url: new URL("/links", location.origin).href,
  };
  try {
    if (navigator.share) {
      await navigator.share(data);
      shareStatus.value = "Link compartilhado.";
    } else {
      await navigator.clipboard.writeText(data.url);
      shareStatus.value = "Link copiado.";
    }
  } catch (error) {
    if (error.name !== "AbortError")
      shareStatus.value =
        "Não foi possível compartilhar. Copie o endereço da barra do navegador.";
  }
  clearTimeout(shareTimer);
  shareTimer = setTimeout(() => (shareStatus.value = ""), 5000);
}
onUnmounted(() => clearTimeout(shareTimer));
const offer = computed(() =>
  c.promotions.find((p) => !p.validUntil || p.validUntil >= localDate()),
);
const featured = c.services.filter((s) =>
  ["gel", "esmaltacao", "art"].includes(s.id),
);
const links = [
  ["Conheça nossos serviços", "servicos", "sparkles"],
  ["Descubra seu próximo estilo", "portfolio", "gem"],
  ["Promoções e combos", "promocoes", "heart"],
  ["Avaliações demonstrativas", "avaliacoes", "star"],
  ["Localização e contato", "contato", "pin"],
];
</script>
<template>
  <main id="main-content" tabindex="-1" class="bio-page">
    <div class="bio-shell">
      <div class="bio-top">
        <RouterLink to="/" aria-label="Luna Nails, site completo"
          ><Brand /></RouterLink
        ><span class="bio-flower" aria-hidden="true">✧</span>
      </div>
      <div class="bio-profile">
        <img
          :src="c.about.photo"
          :alt="c.about.alt"
          width="160"
          height="160"
          fetchpriority="high"
        />
        <p class="eyebrow">SEU MOMENTO DE BELEZA</p>
        <h1>{{ c.brand.name }}</h1>
        <p>{{ c.brand.tagline }}</p>
        <div class="bio-socials">
          <a
            v-if="c.contact.instagram"
            :href="c.contact.instagram"
            aria-label="Instagram, abre em nova aba"
            target="_blank"
            rel="noopener noreferrer"
            ><Icon name="instagram" /></a
          ><span
            v-else
            class="unconfigured-social"
            title="Instagram a configurar pelo estúdio"
            ><Icon name="instagram" /><span class="sr-only"
              >Instagram a configurar</span
            ></span
          ><button
            aria-label="Solicitar atendimento pelo WhatsApp"
            @click="open()"
          >
            <Icon name="whatsapp" /></button
          ><RouterLink to="/#contato" aria-label="Localização e contato"
            ><Icon name="pin" /></RouterLink
          ><a
            v-if="c.contact.tiktok"
            :href="c.contact.tiktok"
            target="_blank"
            rel="noopener noreferrer"
            >TikTok</a
          >
        </div>
        <p v-if="c.demo" class="bio-demo">
          Studio, profissional e mídias demonstrativos
        </p>
      </div>
      <button class="button full bio-book" @click="open()">
        <Icon name="calendar" /> Agendar meu horário <Icon name="chevron" />
      </button>
      <div class="bio-editorial">
        <img
          src="/media/nude.webp"
          alt="Fotografia demonstrativa de manicure nude"
          width="640"
          height="640"
        />
        <div>
          <small>BELEZA EM CADA DETALHE</small>
          <h2>Seu estilo.<br />Seu momento.</h2>
          <RouterLink to="/#portfolio"
            >Explore o portfólio <Icon name="arrow"
          /></RouterLink>
        </div>
      </div>
      <nav class="bio-links" aria-label="Links do estúdio">
        <RouterLink v-for="[label, id, icon] in links" :key="id" :to="`/#${id}`"
          ><Icon :name="icon" /><span>{{ label }}</span
          ><Icon name="chevron" /></RouterLink
        ><button @click="open()">
          <Icon name="whatsapp" /><span>Fale pelo WhatsApp</span
          ><Icon name="chevron" />
        </button>
      </nav>
      <section class="bio-services">
        <div class="bio-heading">
          <p class="eyebrow">ESCOLHA SEU PROCEDIMENTO</p>
          <h2>Serviços em destaque.</h2>
        </div>
        <div class="bio-service-grid">
          <ServiceCard v-for="s in featured" :key="s.id" :item="s" compact />
        </div>
        <RouterLink class="button full" to="/#servicos"
          >Ver tabela completa <Icon name="arrow"
        /></RouterLink>
      </section>
      <section class="bio-offer" v-if="offer">
        <p class="eyebrow">COMBO DEMONSTRATIVO</p>
        <h2>{{ offer.name }}</h2>
        <p>{{ offer.description }}</p>
        <p class="prices">
          <del>{{ money(offer.original) }}</del
          ><strong>{{ money(offer.price) }}</strong>
        </p>
        <small>Economia ilustrativa de {{ money(saving(offer)) }}</small
        ><button class="button outline full" @click="open(offer)">
          Conhecer o combo <Icon name="arrow" />
        </button>
      </section>
      <section class="bio-mini-gallery">
        <h2>Inspire-se.</h2>
        <div>
          <RouterLink
            v-for="p in c.gallery.slice(0, 3)"
            :key="p.id"
            to="/#portfolio"
            :aria-label="`Ver portfólio: ${p.caption}`"
            ><img
              :src="media(p.image)"
              :alt="p.alt"
              width="200"
              height="200"
              loading="lazy"
          /></RouterLink>
        </div>
        <small>Fotografias demonstrativas geradas</small>
      </section>
      <section class="bio-quote" v-if="c.reviews.length">
        <div class="stars" aria-label="5 estrelas demonstrativas">
          <Icon v-for="i in 5" :key="i" name="star" />
        </div>
        <blockquote>“{{ c.reviews[0].text }}”</blockquote>
        <small>{{ c.reviews[0].name }} · demonstração fictícia</small>
      </section>
      <RouterLink class="button full" to="/"
        >Visite nosso site completo <Icon name="arrow" /></RouterLink
      ><button class="text-button bio-share" @click="sharePage">
        Compartilhar esta página <Icon name="arrow" />
      </button>
      <p class="share-status" role="status">{{ shareStatus }}</p>
      <footer class="bio-footer">
        <Brand />
        <p>
          {{
            c.demo
              ? "Experiência demonstrativa · valores a validar"
              : c.brand.tagline
          }}
        </p>
      </footer>
    </div>
  </main>
</template>
