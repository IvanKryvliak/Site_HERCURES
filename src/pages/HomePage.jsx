import useLang from "../hooks/useLang";
import { T } from "../data/translations";
import PaintBackground from "../components/PaintBackground";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import Works from "../components/Works";
import Clients from "../components/Clients";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import CallButton from "../components/CallButton";
import AnalyticsConsent from "../components/AnalyticsConsent";
import { useEffect } from "react";
import { trackPageView } from "../utils/track";
import "../styles/site.css";

export default function HomePage() {
  useEffect(() => { trackPageView(); }, []);
  const [lang, setLang] = useLang();
  const t = T[lang];

  useEffect(() => {
    document.title = t.pageTitle;
    const description = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (description) description.setAttribute("content", t.metaDescription);
    if (ogTitle) ogTitle.setAttribute("content", t.pageTitle);
    if (ogDescription) ogDescription.setAttribute("content", t.metaDescription);
  }, [t]);

  return (
    <div className="cs">
      <PaintBackground />
      <Header t={t} lang={lang} setLang={setLang} />
      <main id="top">
        <Hero t={t} />
        <About t={t} />
        <Services t={t} />
        <Works t={t} lang={lang} />
        <Clients t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
      <CallButton lang={lang} />
      <AnalyticsConsent lang={lang} />
    </div>
  );
}
