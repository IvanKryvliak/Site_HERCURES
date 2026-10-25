import { useState, useEffect } from "react";
import { getCookie, setCookie } from "../lib/cookies";
import { LANG_COOKIE } from "../lib/consent";

const valid = (v) => v === "cs" || v === "en";

export default function useLang() {
  const [lang, setLang] = useState(() => {
    const saved = getCookie(LANG_COOKIE);
    if (valid(saved)) return saved;
    try { // перенесення зі старого сховища
      const old = localStorage.getItem("lang");
      if (valid(old)) return old;
    } catch { /* storage unavailable */ }
    return (navigator.language || "cs").startsWith("cs") ? "cs" : "en";
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    setCookie(LANG_COOKIE, lang, 365); // функціональний cookie: вибір мови
    try { localStorage.removeItem("lang"); } catch { /* storage unavailable */ } // прибираємо старе сховище
  }, [lang]);

  return [lang, setLang];
}
