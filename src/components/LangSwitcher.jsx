export default function LangSwitcher({ lang, setLang }) {
  return (
    <div className="lang" role="group" aria-label="Language">
      {["cs", "en"].map((l) => (
        <button key={l} className={lang === l ? "on" : ""} aria-pressed={lang === l} onClick={() => setLang(l)}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
