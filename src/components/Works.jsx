import Photo from "./Photo";
import SectionHead from "./SectionHead";

export default function Works({ t }) {
  return (
    <section id="works" className="alt">
      <div className="wrap">
        <SectionHead tag={t.worksTag} title={t.worksH} text={t.worksP} />
        <div className="gallery">
          {t.works.map((l, i) => (
            <Photo key={i} id={`work-${i + 1}`} label={`${t.photo} ${i + 1}: ${l}`} className={i === 0 ? "big" : i === 3 ? "wide" : ""} />
          ))}
        </div>
      </div>
    </section>
  );
}
