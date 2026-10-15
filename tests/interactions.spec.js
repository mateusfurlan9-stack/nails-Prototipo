import { describe, it, expect, afterEach, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { nextTick } from "vue";
import ServicesSection from "../src/components/ServicesSection.vue";
import GallerySection from "../src/components/GallerySection.vue";
import ComparisonSection from "../src/components/ComparisonSection.vue";
import BookingModal from "../src/components/BookingModal.vue";
import AccessibilityMenu from "../src/components/AccessibilityMenu.vue";
import HeaderNavigation from "../src/components/HeaderNavigation.vue";
import WhatsAppWidget from "../src/components/WhatsAppWidget.vue";
import FaqSection from "../src/components/FaqSection.vue";
import LinksPage from "../src/views/LinksPage.vue";
import ContactSection from "../src/components/ContactSection.vue";
import PromotionsSection from "../src/components/PromotionsSection.vue";
import ReviewsSection from "../src/components/ReviewsSection.vue";
import { siteConfig as c } from "../src/config/siteConfig";
import { useBooking } from "../src/composables/useBooking";
import { createRouter, createMemoryHistory } from "vue-router";
let wrappers = [];
const render = (component, options = {}) => {
  const w = mount(component, {
    attachTo: document.body,
    ...options,
    global: { stubs: { teleport: true }, ...options.global },
  });
  wrappers.push(w);
  return w;
};
const router = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: { template: "<div/>" } },
      { path: "/links", component: { template: "<div/>" } },
    ],
  });
afterEach(async () => {
  useBooking().close();
  await nextTick();
  wrappers.forEach((w) => w.unmount());
  wrappers = [];
  document.body.innerHTML = "";
  sessionStorage.clear();
  vi.useRealTimers();
});
describe("serviços e solicitação", () => {
  it("filtra por categoria e pesquisa sem resultados", async () => {
    const w = render(ServicesSection);
    expect(w.findAll(".service-card")).toHaveLength(9);
    const cat = w
      .findAll(".filters button")
      .find((b) => b.text() === "Alongamentos");
    await cat.trigger("click");
    expect(w.findAll(".service-card")).toHaveLength(3);
    await w.find("input[type=search]").setValue("inexistente");
    expect(w.findAll(".service-card")).toHaveLength(0);
    expect(w.text()).toContain("Nenhum serviço encontrado");
  });
  it("abre serviço, confere preferências e protege telefone vazio", async () => {
    const w = render(BookingModal);
    useBooking().open(c.services[4]);
    await flushPromises();
    expect(document.querySelector("dialog").open).toBe(true);
    await w.find("#client-name").setValue("Marina");
    await w.find("#date").setValue("2027-01-02");
    await w.find("#time").setValue("Tarde");
    await w.find("form").trigger("submit");
    expect(w.text()).toContain("Alongamento em fibra");
    expect(w.text()).toContain("175,00");
    expect(w.text()).toContain("02/01/2027");
    expect(w.text()).toContain("Marina");
    expect(w.find('a[href^="https://wa.me"]').exists()).toBe(false);
    expect(w.text()).toContain("WhatsApp ainda não configurado");
  });
  it("produz link WhatsApp configurado sem enviar a mensagem", async () => {
    const before = c.contact.whatsapp;
    c.contact.whatsapp = "5511999999999";
    try {
      const w = render(BookingModal);
      useBooking().open(c.services[0]);
      await flushPromises();
      await w.find("form").trigger("submit");
      const a = w.find('a[href^="https://wa.me"]');
      expect(a.exists()).toBe(true);
      expect(new URL(a.attributes("href")).searchParams.get("text")).toContain(
        "Manicure tradicional",
      );
    } finally {
      c.contact.whatsapp = before;
    }
  });
});
describe("portfólio e comparação", () => {
  it("filtra, amplia, navega e fecha com Escape", async () => {
    const w = render(GallerySection);
    await w
      .findAll(".filters button")
      .find((b) => b.text() === "Francesinha")
      .trigger("click");
    expect(w.findAll(".gallery-item")).toHaveLength(1);
    await w.find(".gallery-item").trigger("click");
    await flushPromises();
    expect(document.querySelector("dialog").open).toBe(true);
    await w.find('[aria-label="Próxima foto"]').trigger("click");
    expect(w.find(".lightbox-controls").text()).toContain("1 / 1");
    document
      .querySelector("dialog")
      .dispatchEvent(new Event("cancel", { cancelable: true }));
    await flushPromises();
    expect(document.querySelector("dialog").open).toBe(false);
  });
  it("compara imagens por range e troca transformação", async () => {
    const w = render(ComparisonSection);
    await w.find("input[type=range]").setValue(75);
    expect(w.find("input").attributes("aria-valuetext")).toContain("75%");
    expect(w.find(".comparison").attributes("style")).toContain("75%");
    await w.findAll(".transform-options button")[1].trigger("click");
    expect(w.text()).toContain("A delicadeza da francesinha");
    expect(w.find("input").element.value).toBe("50");
  });
});
describe("navegação, bio e acessibilidade", () => {
  it("abre menu e fecha ao selecionar seção", async () => {
    const r = router();
    const w = render(HeaderNavigation, { global: { plugins: [r] } });
    await r.isReady();
    await w.find(".menu-toggle").trigger("click");
    await flushPromises();
    expect(document.querySelector("dialog").open).toBe(true);
    await w.find(".mobile-menu nav a").trigger("click");
    await flushPromises();
    expect(document.querySelector("dialog").open).toBe(false);
  });
  it("bio apresenta serviços, combo, referências e acesso ao site", async () => {
    const r = router();
    const w = render(LinksPage, { global: { plugins: [r] } });
    await r.isReady();
    expect(w.findAll(".service-card")).toHaveLength(3);
    expect(w.find("h1").text()).toBe("Luna Nails");
    expect(w.text()).toContain("demonstração fictícia");
    expect(w.text()).toContain("Visite nosso site completo");
    await w.find(".bio-book").trigger("click");
    expect(useBooking().visible.value).toBe(true);
  });
  it("ajusta fonte, contraste, movimento e restaura", async () => {
    const w = render(AccessibilityMenu);
    await w.find(".access-button").trigger("click");
    await flushPromises();
    await w.find('[aria-label="Aumentar fonte"]').trigger("click");
    expect(document.documentElement.style.fontSize).toBe("110%");
    const inputs = w.findAll("input[type=checkbox]");
    await inputs[0].setValue(true);
    expect(
      document.documentElement.classList.contains("accessible-contrast"),
    ).toBe(true);
    await inputs[3].setValue(true);
    expect(document.documentElement.classList.contains("motion-off")).toBe(
      true,
    );
    await w
      .findAll(".text-button")
      .find((b) => b.text() === "Restaurar padrão")
      .trigger("click");
    expect(document.documentElement.style.fontSize).toBe("100%");
    expect(
      document.documentElement.classList.contains("accessible-contrast"),
    ).toBe(false);
  });
  it("convite WhatsApp abre uma vez por sessão e pode ser fechado", async () => {
    vi.useFakeTimers();
    const w = render(WhatsAppWidget);
    await vi.advanceTimersByTimeAsync(c.widget.delay + 10);
    await nextTick();
    expect(w.find(".whatsapp-bubble").exists()).toBe(true);
    await w.find('[aria-label="Fechar convite"]').trigger("click");
    expect(w.find(".whatsapp-bubble").exists()).toBe(false);
    w.unmount();
    const w2 = render(WhatsAppWidget);
    await vi.advanceTimersByTimeAsync(c.widget.delay + 10);
    expect(w2.find(".whatsapp-bubble").exists()).toBe(false);
  });
});

describe("integrações e ofertas", () => {
  it("lightbox responde a setas e gesto de toque", async () => {
    const w = render(GallerySection);
    await w.find(".gallery-item").trigger("click");
    await flushPromises();
    await w.find(".lightbox").trigger("keydown", { key: "ArrowRight" });
    expect(w.find(".lightbox-controls").text()).toContain("2 / 7");
    await w
      .find(".lightbox")
      .trigger("touchstart", { touches: [{ clientX: 200 }] });
    await w
      .find(".lightbox")
      .trigger("touchend", { changedTouches: [{ clientX: 100 }] });
    expect(w.find(".lightbox-controls").text()).toContain("3 / 7");
  });
  it("mapa bloqueia origem não autorizada e não inventa endereço", async () => {
    const old = c.contact.mapEmbed;
    c.contact.mapEmbed = "https://example.com/maps";
    try {
      const w = render(ContactSection, { global: { plugins: [router()] } });
      expect(w.find("iframe").exists()).toBe(false);
      expect(w.text()).toContain("Endereço a configurar");
    } finally {
      c.contact.mapEmbed = old;
    }
  });
  it("Google Maps só carrega após ação explícita", async () => {
    const old = c.contact.mapEmbed;
    c.contact.mapEmbed = "https://www.google.com/maps/embed?pb=demo";
    try {
      const w = render(ContactSection, { global: { plugins: [router()] } });
      expect(w.find("iframe").exists()).toBe(false);
      await w
        .findAll("button")
        .find((b) => b.text() === "Carregar mapa")
        .trigger("click");
      expect(w.find("iframe").exists()).toBe(true);
    } finally {
      c.contact.mapEmbed = old;
    }
  });
  it("ofertas vencidas não são exibidas", () => {
    const old = c.promotions[0].validUntil;
    c.promotions[0].validUntil = "2020-01-01";
    try {
      const w = render(PromotionsSection);
      expect(w.findAll(".offer")).toHaveLength(2);
      expect(w.text()).not.toContain("Combo beleza completa");
    } finally {
      c.promotions[0].validUntil = old;
    }
  });
  it("depoimentos permitem rolagem por controle e não usam Google fictício", async () => {
    const w = render(ReviewsSection);
    await w.find('[aria-label="Próximo depoimento"]').trigger("click");
    expect(Element.prototype.scrollBy).toHaveBeenCalled();
    expect(w.findAll(".review-card")).toHaveLength(3);
    expect(w.text()).toContain("Não são avaliações do Google");
  });
});

describe("recursos preservados", () => {
  it("FAQ pesquisa sem acentos e oferece checklist baixável", async () => {
    const w = render(FaqSection);
    await w.find("input[type=search]").setValue("manutencao");
    expect(w.findAll("details[name=faq]").length).toBeGreaterThan(0);
    await w.find(".care-content input").setValue(true);
    URL.createObjectURL = vi.fn(() => "blob:teste");
    URL.revokeObjectURL = vi.fn();
    const spy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    await w.find(".care-content button").trigger("click");
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
  it("bio compartilha o endereço canônico da página quando suportado", async () => {
    const old = navigator.share;
    Object.defineProperty(navigator, "share", {
      value: vi.fn().mockResolvedValue(undefined),
      configurable: true,
    });
    try {
      const w = render(LinksPage, { global: { plugins: [router()] } });
      await w.find(".bio-share").trigger("click");
      await flushPromises();
      expect(navigator.share).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Luna Nails",
          url: expect.stringMatching(/\/links$/),
        }),
      );
      expect(w.text()).toContain("Link compartilhado.");
    } finally {
      Object.defineProperty(navigator, "share", {
        value: old,
        configurable: true,
      });
    }
  });
});
