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
          <p v-for="p in c.about.paragraphs" :key="p">{{ p }}</p>
          <ul class="about-points">
            <li v-for="point in c.about.points" :key="point">
              <Icon name="check" />{{ point }}
            </li>
          </ul>
          <button class="button" @click="open()">
            Fale com nossa especialista <Icon name="arrow" />
          </button>
        </div>
      </section>
      <ServicesSection /><GallerySection /><ComparisonSection /><PromotionsSection /><ReviewsSection />
      <section class="experience-section">
        <div class="wrap">
          <div class="section-heading" data-reveal>
            <p class="eyebrow">A EXPERIÊNCIA LUNA NAILS</p>
            <h2>O luxo está no cuidado.</h2>
            <p>Uma proposta de atendimento que começa em você.</p>
          </div>
          <div class="experience-grid">
            <article
              v-for="feature in c.features"
              :key="feature.title"
              data-reveal
            >
              <Icon :name="feature.icon" />
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.text }}</p>
            </article>
          </div>
        </div>
      </section>
      <FaqSection />
      <section class="booking-banner wrap" data-reveal>
        <img
          src="/media/nude.webp"
          alt=""
          width="640"
          height="640"
          loading="lazy"
        />
        <div>
          <p class="eyebrow">RESERVE UM MOMENTO PARA VOCÊ</p>
          <h2>Pronta para realçar<br />a sua beleza?</h2>
          <p>Escolha seu procedimento e converse com o estúdio.</p>
          <button class="button cream" @click="open()">
            <Icon name="whatsapp" /> Agendar pelo WhatsApp
          </button>
        </div>
        <Icon name="flower" />
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
