import SectionHead from "./SectionHead";

export default function Services({ t }) {
  return (
    <section id="services">
      <div className="wrap">
        <SectionHead tag={t.servTag} title={t.servH} text={t.servP} />
        <div className="cards">
          {t.serv.map(([h, p], i) => (
            <div className="card" key={i}>
              <div className="n">{String(i + 1).padStart(2, "0")}</div>
              <h3>{h}</h3>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
