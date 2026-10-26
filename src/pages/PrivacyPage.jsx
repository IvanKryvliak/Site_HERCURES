import { useEffect } from "react";
import useLang from "../hooks/useLang";
import PaintBackground from "../components/PaintBackground";
import LangSwitcher from "../components/LangSwitcher";
import AnalyticsConsent from "../components/AnalyticsConsent";
import { getPolicy } from "../data/privacy";
import "../styles/site.css";
import "../styles/privacy.css";

export default function PrivacyPage() {
  const [lang, setLang] = useLang();
  const policy = getPolicy(lang);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => {
    const prev = document.title;
    document.title = `${policy.title} — ${prev.split(" — ").pop()}`;
    return () => { document.title = prev; };
  }, [policy.title]);

  return (
    <div className="cs">
      <PaintBackground />
      <div className="policy-wrap">
        <div className="policy-top">
          <a className="policy-back" href="#/">← {policy.back}</a>
          <LangSwitcher lang={lang} setLang={setLang} />
        </div>
        <article className="policy">
          <h1>{policy.title}</h1>
          <p className="policy-updated">{policy.updated}</p>
          {policy.sections.map((s) => (
            <div className="policy-sec" key={s.h}>
              <h2>{s.h}</h2>
              {s.paras?.map((p) => <p key={p}>{p}</p>)}
              {s.list && <ul>{s.list.map((i) => <li key={i}>{i}</li>)}</ul>}
              {s.blocks?.map((b) => (<div key={b.h}><h3>{b.h}</h3><p>{b.p}</p></div>))}
              {s.table && (
                <div className="policy-scroll">
                  <table>
                    <thead><tr>{s.table.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
                    <tbody>{s.table.rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{i === 0 ? <code>{c}</code> : c}</td>)}</tr>)}</tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </article>
      </div>
      <AnalyticsConsent lang={lang} />
    </div>
  );
}
