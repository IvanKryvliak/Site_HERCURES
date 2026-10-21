import { useState, useEffect } from "react";

export default function useLang() {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "cs" || saved === "en") return saved;
    } catch { /* storage unavailable */ }
    return (navigator.language || "cs").startsWith("cs") ? "cs" : "en";
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem("lang", lang); } catch { /* storage unavailable */ }
  }, [lang]);

  return [lang, setLang];
}
