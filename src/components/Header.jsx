import { useState } from "react";
import LangSwitcher from "./LangSwitcher";
import { BRAND } from "../data/translations";
import { SECTION_IDS } from "../data/config";

export default function Header({ t, lang, setLang }) {
  const [open, setOpen] = useState(false);

  const onNavClick = (e) => {
    const a = e.target.closest("a[href^='#']");
    if (!a) return;
    e.preventDefault();
    setOpen(false);
    document.getElementById(a.getAttribute("href").slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header>
      <div className="wrap bar">
        <a className="logo" href="#top">{BRAND[lang][0]}{BRAND[lang][1]}</a>
        <nav id="menu" className={open ? "open" : ""} aria-label="Menu" onClick={onNavClick}>
          {t.nav.map((n, i) => <a key={n} href={`#${SECTION_IDS[i]}`}>{n}</a>)}
        </nav>
        <div className="right">
          <LangSwitcher lang={lang} setLang={setLang} />
          <button className="burger" aria-label="Menu" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}><i /></button>
        </div>
      </div>
    </header>
  );
}
