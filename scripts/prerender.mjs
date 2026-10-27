/* Після збірки вставляє готовий HTML (чеською) у dist/index.html, щоб пошукові системи бачили текст без JavaScript,
   виставляє title/description/canonical/Open Graph, додає JSON-LD і створює sitemap.xml та robots.txt. */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

Object.defineProperty(globalThis, "navigator", { value: { language: "cs-CZ" }, configurable: true });

const { render, seo } = await import(pathToFileURL(path.resolve("dist-ssr/entry-server.js")).href);
const s = seo();
const esc = (v) => String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const file = path.resolve("dist/index.html");
let html = fs.readFileSync(file, "utf8");
if (!html.includes('<div id="root"></div>')) throw new Error("dist/index.html: очікувався порожній <div id=\"root\"></div>");

html = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`);
html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(s.title)}</title>`);

let extra = "";
function meta(attr, key, value) {
  const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`;
  const re = new RegExp(`<meta\\s+${attr}="${key}"[^>]*>`);
  if (re.test(html)) html = html.replace(re, tag); else extra += `    ${tag}\n`;
}
meta("name", "description", s.description);
meta("property", "og:title", s.title);
meta("property", "og:description", s.description);
meta("property", "og:type", "website");
meta("property", "og:url", `${s.siteUrl}/`);
meta("property", "og:locale", "cs_CZ");
meta("property", "og:locale:alternate", "en_US");
meta("property", "og:site_name", "HEFEST REK-BYT");
if (s.image) { meta("property", "og:image", s.image); meta("name", "twitter:image", s.image); }
meta("name", "twitter:card", s.image ? "summary_large_image" : "summary");
meta("name", "twitter:title", s.title);
meta("name", "twitter:description", s.description);
extra += `    <link rel="canonical" href="${s.siteUrl}/" />\n`;
extra += `    <script type="application/ld+json">${JSON.stringify(s.ld).replace(/</g, "\\u003c")}</script>\n`;
html = html.replace("</head>", `${extra}  </head>`);
fs.writeFileSync(file, html);

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${s.siteUrl}/</loc>\n    <lastmod>${today}</lastmod>\n  </url>\n</urlset>\n`);
fs.writeFileSync("dist/robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${s.siteUrl}/sitemap.xml\n`);
console.log(`prerender OK: ${html.length} bytes, title "${s.title}"`);
