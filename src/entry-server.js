import { createSSRApp } from "vue";
import { createRouter, createMemoryHistory } from "vue-router";
import { renderToString } from "vue/server-renderer";
import App from "./App.vue";
import Home from "./views/HomePage.vue";
import Links from "./views/LinksPage.vue";
export async function render(url) {
  const app = createSSRApp(App);
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: Home },
      { path: "/links", component: Links },
    ],
  });
  app.use(router);
  await router.push(url);
  await router.isReady();
  return renderToString(app);
}
