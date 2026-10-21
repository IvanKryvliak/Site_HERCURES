export default function Clients({ t }) {
  return (
    <section id="clients">
      <div className="wrap two top">
        <div>
          <span className="eyebrow">{t.clientsTag}</span>
          <p className="quote">{t.quote}</p>
          <p className="sub">{t.clientsP1}</p>
          <p className="sub">{t.clientsP2}</p>
        </div>
        <ol className="steps">
          {t.steps.map(([h, p]) => <li key={h}><strong>{h}</strong><span>{p}</span></li>)}
        </ol>
      </div>
    </section>
  );
}
