import Photo from "./Photo";

export default function About({ t }) {
  return (
    <section id="about" className="alt">
      <div className="wrap two">
        <Photo id="team" label={`${t.photo}: ${t.teamPh}`} style={{ minHeight: 340 }} />
        <div>
          <span className="eyebrow">{t.aboutTag}</span>
          <h2>{t.aboutH}</h2>
          <p className="sub">{t.aboutP}</p>
          <ul className="facts">{t.facts.map((f) => <li key={f}>{f}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}
