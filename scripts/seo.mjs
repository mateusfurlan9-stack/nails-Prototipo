import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createServer } from "vite";
import { siteConfig as c } from "../src/config/siteConfig.js";
const escape = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const json = (s) => JSON.stringify(s).replaceAll("<", "\\u003c");
const configured = c.seo.url && !c.demo;
if (configured) {
  const u = new URL(c.seo.url);
  if (u.protocol !== "https:")
    throw new Error("Configure uma URL HTTPS em seo.url.");
  if (!c.contact.whatsapp || !c.contact.address)
    throw new Error(
      "Preencha telefone e endereço reais antes de ativar o modo público.",
    );
}
const template = await readFile("dist/index.html", "utf8");
const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});
try {
  const { render } = await server.ssrLoadModule("/src/entry-server.js");
  for (const route of ["/", "/links"]) {
    const title =
      route === "/links"
        ? `${c.brand.name} | Links e agendamento`
        : c.seo.title;
    const canonical = configured ? new URL(route, c.seo.url).href : "";
    const schema = configured
      ? {
          "@context": "https://schema.org",
          "@type": "NailSalon",
          name: c.brand.name,
          url: c.seo.url,
          telephone: `+${c.contact.whatsapp}`,
          image: new URL(c.hero.image, c.seo.url).href,
          address: {
            "@type": "PostalAddress",
            streetAddress: c.contact.address,
            addressLocality: c.contact.city,
            addressCountry: "BR",
          },
          sameAs: [c.contact.instagram, c.contact.tiktok].filter(Boolean),
        }
      : null;
    let html = template
      .replace(
        '<div id="app"></div>',
        `<div id="app">${await render(route)}</div>`,
      )
      .replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`)
      .replace(
        /(<meta name="description" content=")[^"]*/,
        `$1${escape(c.seo.description)}`,
      )
      .replace(
        /(<meta property="og:title" content=")[^"]*/,
        `$1${escape(title)}`,
      )
      .replace(
        /(<meta property="og:description" content=")[^"]*/,
        `$1${escape(c.seo.description)}`,
      )
      .replace(
        "noindex, nofollow",
        configured ? "index, follow" : "noindex, nofollow",
      );
    if (canonical)
      html = html.replace(
        "</head>",
        `<link rel="canonical" href="${escape(canonical)}"><meta property="og:url" content="${escape(canonical)}"><meta property="og:image" content="${escape(new URL(c.hero.image, c.seo.url).href)}">${schema ? `<script type="application/ld+json">${json(schema)}</script>` : ""}</head>`,
      );
    const file = route === "/" ? "dist/index.html" : "dist/links/index.html";
    if (route !== "/") await mkdir("dist/links", { recursive: true });
    await writeFile(file, html);
  }
  await writeFile(
    "dist/robots.txt",
    configured
      ? `User-agent: *\nAllow: /\nSitemap: ${new URL("/sitemap.xml", c.seo.url).href}\n`
      : "User-agent: *\nDisallow: /\n",
  );
  await writeFile(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${configured ? ["/", "/links"].map((p) => `<url><loc>${escape(new URL(p, c.seo.url).href)}</loc></url>`).join("") : ""}</urlset>`,
  );
  console.log(
    "Pré-renderização concluída: / e /links. SEO público:",
    Boolean(configured),
  );
} finally {
  await server.close();
}
