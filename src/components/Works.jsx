import { useMemo, useState } from "react";
import SectionHead from "./SectionHead";
import Lightbox from "./Lightbox";
import { WORKS } from "../data/works";
import { PHOTO_CAPTIONS } from "../data/photoCaptions";
import "../styles/gallery.css";

const PAGE = 3; // скільки фото показувати спочатку і скільки додавати по кнопці
const PLACEHOLDERS = Array.from({ length: PAGE * 2 }, (_, i) => ({ id: `ph-${i}`, src: "", category: "", title: "" }));

export default function Works({ t, lang }) {
  const items = useMemo(() => WORKS.length
    ? WORKS.map((w) => ({ ...w, title: PHOTO_CAPTIONS[w.number]?.[lang] || w.title }))
    : PLACEHOLDERS, [lang]);
  const categories = useMemo(() => [...new Set(items.map((w) => w.category).filter(Boolean))], [items]);
  const [cat, setCat] = useState("");
  const [shown, setShown] = useState(PAGE);
  const [open, setOpen] = useState(-1);

  const list = cat ? items.filter((w) => w.category === cat) : items;
  const label = (c) => t.cats[c] || c.charAt(0).toUpperCase() + c.slice(1);
  const choose = (c) => { setCat(c); setShown(PAGE); };

  return (
    <section id="works" className="alt">
      <div className="wrap">
        <SectionHead tag={t.worksTag} title={t.worksH} text={t.worksP} />

        {categories.length > 1 && (
          <div className="works-filter" role="group" aria-label={t.worksH}>
            <button className="works-chip" aria-pressed={cat === ""} onClick={() => choose("")}>{t.all}<small>{items.length}</small></button>
            {categories.map((c) => (
              <button key={c} className="works-chip" aria-pressed={cat === c} onClick={() => choose(c)}>
                {label(c)}<small>{items.filter((w) => w.category === c).length}</small>
              </button>
            ))}
          </div>
        )}

        <div className="works-grid">
          {list.slice(0, shown).map((w, i) =>
            w.src ? (
              <button key={w.id} className="work-tile" onClick={() => setOpen(i)} aria-label={`${t.lb.open}: ${w.title || i + 1}`}>
                <img src={w.src} alt={w.title} loading="lazy" decoding="async" />
                {w.title && <span className="work-cap">{w.title}</span>}
              </button>
            ) : (
              <div key={w.id} className="work-tile work-ph"><span>{t.photo} {i + 1}</span></div>
            )
          )}
        </div>

        {shown < list.length && (
          <div className="works-more">
            <button className="btn ghost" onClick={() => setShown(shown + PAGE)}>{t.more} ({list.length - shown})</button>
          </div>
        )}
      </div>

      {open >= 0 && list[open]?.src && (
        <Lightbox items={list} index={open} onIndex={setOpen} onClose={() => setOpen(-1)} t={t} label={t.worksH} />
      )}
    </section>
  );
}
