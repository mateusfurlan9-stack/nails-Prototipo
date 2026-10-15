<script setup>
import { ref } from "vue";
import { siteConfig as c } from "../config/siteConfig";
import { useBooking } from "../composables/useBooking";
import { useReveal } from "../composables/useReveal";
import HeaderNavigation from "../components/HeaderNavigation.vue";
import ServicesSection from "../components/ServicesSection.vue";
import GallerySection from "../components/GallerySection.vue";
import ComparisonSection from "../components/ComparisonSection.vue";
import PromotionsSection from "../components/PromotionsSection.vue";
import ReviewsSection from "../components/ReviewsSection.vue";
import FaqSection from "../components/FaqSection.vue";
import ContactSection from "../components/ContactSection.vue";
import Brand from "../components/Brand.vue";
import Icon from "../components/Icon.vue";
const { open } = useBooking(),
  root = ref();
useReveal(root);
</script>
<template>
  <div ref="root">
    <HeaderNavigation />
    <main id="main-content" tabindex="-1">
      <section id="inicio" class="hero">
        <div class="wrap hero-inner">
          <div class="hero-copy">
            <p class="eyebrow">{{ c.hero.eyebrow }}</p>
            <h1>{{ c.hero.title }}</h1>
            <p class="hero-description">{{ c.hero.description }}</p>
            <div class="actions">
              <button class="button" @click="open()">
                <Icon name="calendar" /> Agendar meu horário</button
              ><a href="#servicos" class="button outline"
                >Conhecer serviços <Icon name="chevron"
              /></a>
            </div>
            <div class="hero-signature">
              <span class="signature-line"></span
              ><span
                >Cuidado que valoriza<br /><strong
                  >a sua essência.</strong
                ></span
              >
            </div>
          </div>
          <div class="hero-photo">
            <img
              :src="c.hero.image"
              :alt="c.hero.alt"
              width="640"
              height="640"
              fetchpriority="high"
              decoding="async"
            /><span class="photo-script" aria-hidden="true"
              >Beleza em<br />cada detalhe</span
            ><span class="photo-note" v-if="c.demo"
              >Fotografia demonstrativa</span
            >
          </div>
        </div>
        <div class="hero-orbit" aria-hidden="true" />
      </section>
      <div
        class="wrap feature-strip"
        aria-label="Proposta de atendimento demonstrativa"
      >
        <div v-for="f in c.features" :key="f.title">
          <Icon :name="f.icon" /><span>{{ f.title }}</span>
        </div>
      </div>
      <section id="sobre" class="section wrap about-section">
        <figure data-reveal>
          <img
            :src="c.about.photo"
            :alt="c.about.alt"
            width="640"
            height="640"
            loading="lazy"
            decoding="async"
          />
          <figcaption v-if="c.demo">
            Profissional e fotografia ilustrativas
          </figcaption>
        </figure>
        <div data-reveal>
          <p class="eyebrow">SOBRE MIM</p>
          <h2>
            {{ c.about.title }}
            <span class="heart-text" aria-hidden="true">♡</span>
          </h2>
          <p class="professional-role">{{ c.about.role }}</p>
          <p class="about-intro">
            Um atendimento pensado em você. Do formato ao acabamento, cada
            escolha traduz o seu estilo.
          </p>
          <details class="about-story">
            <summary>Conheça minha proposta <Icon name="chevron" /></summary>
            <p v-for="p in c.about.paragraphs" :key="p">{{ p }}</p>
            <p v-for="feature in c.features" :key="feature.title">
              <strong>{{ feature.title }}.</strong> {{ feature.text }}
            </p>
          </details>
          <ul class="about-points">
            <li v-for="point in c.about.points" :key="point">
              <Icon name="check" />{{ point }}
            </li>
          </ul>
          <button class="button" @click="open()">
            Vamos conversar <Icon name="arrow" />
          </button>
        </div>
      </section>
      <ServicesSection /><GallerySection /><ComparisonSection /><PromotionsSection /><ReviewsSection />
      <FaqSection />
      <section class="bio-discovery wrap">
        <div>
          <p class="eyebrow">O STUDIO, A UM TOQUE</p>
          <h2>Seu atalho para o autocuidado.</h2>
          <p>Serviços, inspirações e agendamento em um só lugar.</p>
        </div>
        <RouterLink to="/links" class="button"
          >Conhecer a Link na Bio <Icon name="arrow"
        /></RouterLink>
      </section>
      <ContactSection />
    </main>
    <footer class="site-footer wrap">
      <RouterLink to="/" class="logo"><Brand /></RouterLink>
      <p>{{ c.brand.tagline }}</p>
      <RouterLink to="/links">Link na Bio <Icon name="arrow" /></RouterLink
      ><small
        >© {{ new Date().getFullYear() }} {{ c.brand.name }}.
        <span v-if="c.demo"
          >Site demonstrativo · dados comerciais pendentes de validação.</span
        ></small
      >
    </footer>
  </div>
</template>
