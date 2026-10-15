import { createApp } from "vue";
import { makeRouter } from "./router";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import App from "./App.vue";
import "./style.css";
import { siteConfig as c } from "./config/siteConfig";
// Normaliza os links antigos antes de o router ler o endereço inicial.
if (/^#\/(links|linkbio|bio)\/?$/i.test(location.hash))
  history.replaceState(null, "", "/links");
const router = makeRouter();
router.afterEach((to) => {
  const title = [
    "/links",
    "/linkbio",
    "/bio",
    "/links.html",
    "/linkbio.html",
    "/links/index.html",
    "/linkbio/index.html",
  ].includes(to.path.replace(/\/$/, ""))
    ? `${c.brand.name} | Links e agendamento`
    : c.seo.title;
  document.title = title;
  document.querySelector('meta[name="description"]').content =
    c.seo.description;
  document.querySelector('meta[property="og:title"]').content = title;
  document.querySelector('meta[name="robots"]').content =
    c.demo || !c.seo.url ? "noindex, nofollow" : "index, follow";
  if (c.seo.url) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.append(canonical);
    }
    canonical.href = new URL(
      to.matched[0]?.aliasOf?.path || to.path,
      c.seo.url,
    ).href;
  }
});
for (const [key, value] of Object.entries(c.theme))
  document.documentElement.style.setProperty(`--${key}`, value);
const app = createApp(App).use(router);
router.isReady().then(() => app.mount("#app"));
