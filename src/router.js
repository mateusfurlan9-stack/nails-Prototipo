import { createRouter, createWebHistory } from "vue-router";
import { nextTick } from "vue";
export const routes = [
  { path: "/", component: () => import("./views/HomePage.vue") },
  {
    path: "/links",
    alias: [
      "/linkbio",
      "/bio",
      "/links.html",
      "/linkbio.html",
      "/links/index.html",
      "/linkbio/index.html",
    ],
    component: () => import("./views/LinksPage.vue"),
  },
  { path: "/:pathMatch(.*)*", component: () => import("./views/NotFound.vue") },
];
export function makeRouter(history = createWebHistory()) {
  return createRouter({
    history,
    routes,
    async scrollBehavior(to, from, saved) {
      if (saved) return saved;
      await nextTick();
      if (to.hash) {
        const id = decodeURIComponent(to.hash.slice(1));
        const element = document.getElementById(id);
        if (element)
          return {
            el: element,
            top:
              (document.querySelector(".site-header")?.getBoundingClientRect()
                .height || 72) + 16,
            behavior:
              matchMedia("(prefers-reduced-motion: reduce)").matches ||
              document.documentElement.classList.contains("motion-off")
                ? "instant"
                : "smooth",
          };
      }
      return { top: 0 };
    },
  });
}
