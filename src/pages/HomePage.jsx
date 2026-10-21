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
import "../styles/site.css";

export default function HomePage() {
  const [lang, setLang] = useLang();
  const t = T[lang];

  return (
    <div className="cs">
      <PaintBackground />
      <Header t={t} lang={lang} setLang={setLang} />
      <main id="top">
        <Hero t={t} />
        <About t={t} />
        <Services t={t} />
        <Works t={t} />
        <Clients t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
      <CallButton />
    </div>
  );
}
