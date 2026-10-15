import { readFile, readdir, stat } from "node:fs/promises";
import assert from "node:assert/strict";
import { siteConfig as c, media } from "../src/config/siteConfig.js";
const all = [...c.services, ...c.promotions, ...c.gallery].map((i) =>
  media(i.image),
);
all.push(c.hero.image, c.about.photo);
for (const path of new Set(all)) {
  const s = await stat(`public${path}`);
  assert.ok(s.size > 0, `Mídia ausente: ${path}`);
}
for (const route of ["dist/index.html", "dist/links/index.html"]) {
  const html = await readFile(route, "utf8");
  assert.match(html, /<h1/);
  assert.match(html, /Luna Nails/);
  assert.ok(html.includes(c.demo || !c.seo.url ? "noindex" : "index, follow"));
  assert.doesNotMatch(html, /advocacia|OAB\/|jurídic|Aguiar|Santos/i);
  assert.match(html, /lang="pt-BR"/);
  assert.match(html, /id="main-content"/);
}
const home = await readFile("dist/index.html", "utf8");
for (const id of [
  "inicio",
  "sobre",
  "servicos",
  "portfolio",
  "transformacoes",
  "promocoes",
  "avaliacoes",
  "duvidas",
  "contato",
])
  assert.ok(home.includes(`id="${id}"`), `Seção ausente: ${id}`);
const config = JSON.parse(await readFile("vercel.json", "utf8"));
assert.equal(config.outputDirectory, "dist");
const files = await readdir("dist/assets");
assert.ok(files.some((f) => f.startsWith("HomePage-")));
assert.ok(files.some((f) => f.startsWith("LinksPage-")));
console.log(
  `OK: ${new Set(all).size} mídias locais, 2 páginas pré-renderizadas, 9 seções, metadados e chunks de rotas.`,
);

for (const path of [
  "dist/links.html",
  "dist/linkbio.html",
  "dist/linkbio/index.html",
]) {
  const html = await readFile(path, "utf8");
  assert.match(html, /bio-tabs/);
  assert.match(html, /Agendar meu horário/);
}
const bioHtml = await readFile("dist/links.html", "utf8");
assert.match(bioHtml, /role="tablist"/);
assert.equal((home.match(/class="service-card"/g) || []).length, 3);
assert.match(home, /bio-shortcut/);
console.log(
  "OK: bio em arquivos independentes, abas acessíveis, atalho visível e catálogo compacto.",
);
