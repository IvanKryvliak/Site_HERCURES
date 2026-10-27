import { renderToString } from "react-dom/server";
import HomePage from "./pages/HomePage";
import { T } from "./data/translations";
import { COMPANY, EMAIL, PHONE, PHONE_CONFIGURED, PHOTOS, SITE_URL, SITE_NAME } from "./data/config";

/* Використовується лише під час збірки (scripts/prerender.mjs): готує HTML для пошукових систем. */
export function render() {
  return renderToString(<HomePage />);
}

export function seo() {
  const t = T.cs;
  const hero = PHOTOS.hero;
  const image = typeof hero === "string" && hero.startsWith("/") ? SITE_URL + hero : undefined;
  const ld = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    description: t.metaDescription,
    email: EMAIL,
    ...(PHONE_CONFIGURED ? { telephone: PHONE } : {}),
    ...(image ? { image } : {}),
    address: { "@type": "PostalAddress", addressLocality: COMPANY.city || "Praha", addressCountry: "CZ" },
    areaServed: { "@type": "City", name: "Praha" },
    availableLanguage: ["cs", "en"],
    knowsAbout: t.serv.map((s) => s[0]),
  };
  return { siteUrl: SITE_URL, title: t.pageTitle, description: t.metaDescription, image, ld };
}
