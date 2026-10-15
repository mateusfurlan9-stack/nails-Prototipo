import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import App from "./App.vue";
import "./style.css";
import { siteConfig as c } from "./config/siteConfig";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: () => import("./views/HomePage.vue") },
    { path: "/links", component: () => import("./views/LinksPage.vue") },
    { path: "/linkbio", redirect: "/links" },
    { path: "/bio", redirect: "/links" },
    {
      path: "/:pathMatch(.*)*",
      component: () => import("./views/NotFound.vue"),
    },
  ],
  scrollBehavior(to, from, saved) {
    if (saved) return saved;
    if (to.hash)
      return {
        el: to.hash,
        top: 95,
        behavior:
          matchMedia("(prefers-reduced-motion: reduce)").matches ||
          document.documentElement.classList.contains("motion-off")
            ? "instant"
            : "smooth",
      };
    return { top: 0 };
  },
});
// Compatibilidade com os antigos links de bio por hash.
if (/^#\/(links|linkbio|bio)\/?$/i.test(location.hash))
  history.replaceState(null, "", "/links");
router.afterEach((to) => {
  const title =
    to.path === "/links"
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
    canonical.href = new URL(to.path, c.seo.url).href;
  }
});
for (const [key, value] of Object.entries(c.theme))
  document.documentElement.style.setProperty(`--${key}`, value);
createApp(App).use(router).mount("#app");
