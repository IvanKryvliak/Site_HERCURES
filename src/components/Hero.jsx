import Photo from "./Photo";

export default function Hero({ t }) {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="grid">
          <div>
            <span className="eyebrow">{t.badge}</span>
            <h1>{t.h1}</h1>
            <p className="sub">{t.lead}</p>
            <div className="btns">
              <a className="btn" href="#contact">{t.btn1}</a>
              <a className="btn ghost" href="#works">{t.btn2}</a>
            </div>
          </div>
          <Photo id="hero" label={`${t.photo}: ${t.heroPh}`} />
        </div>
        <div className="stats">
          {t.stats.map(([b, s]) => <div key={b}><b>{b}</b><span>{s}</span></div>)}
        </div>
      </div>
    </section>
  );
}
