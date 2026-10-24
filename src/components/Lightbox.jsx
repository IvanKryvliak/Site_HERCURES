import { useCallback, useEffect, useRef } from "react";

export default function Lightbox({ items, index, onIndex, onClose, t, label }) {
  const total = items.length;
  const item = items[index];
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const thumbsRef = useRef(null);
  const touchX = useRef(null);

  const go = useCallback((d) => onIndex((index + d + total) % total), [index, total, onIndex]);

  // блокуємо прокрутку сторінки, повертаємо фокус після закриття
  useEffect(() => {
    const prevFocus = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, []);

  // клавіатура: Esc, стрілки, Tab не виходить за межі вікна
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "Tab") {
        const f = dialogRef.current?.querySelectorAll("button");
        if (!f?.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  // підвантажуємо сусідні фото наперед
  useEffect(() => {
    [1, -1].forEach((d) => {
      const n = items[(index + d + total) % total];
      if (n?.src) new Image().src = n.src;
    });
  }, [index, items, total]);

  // активна мініатюра завжди видима
  useEffect(() => {
    thumbsRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [index]);

  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };
  const stop = (e) => e.stopPropagation();

  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label={label} ref={dialogRef} onClick={onClose}>
      <div className="lb-top">
        <span className="lb-count">{index + 1} {t.lb.of} {total}</span>
        <button ref={closeRef} className="lb-btn" onClick={(e) => { stop(e); onClose(); }} aria-label={t.lb.close}>✕</button>
      </div>

      {total > 1 && <button className="lb-nav prev" onClick={(e) => { stop(e); go(-1); }} aria-label={t.lb.prev}>‹</button>}

      <figure className="lb-stage" onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }} onTouchEnd={onTouchEnd}>
        <img key={item.id} src={item.src} alt={item.title} onClick={stop} />
        {item.title && <figcaption onClick={stop}>{item.title}</figcaption>}
      </figure>

      {total > 1 && <button className="lb-nav next" onClick={(e) => { stop(e); go(1); }} aria-label={t.lb.next}>›</button>}

      {total > 1 && (
        <div className="lb-thumbs" ref={thumbsRef} onClick={stop}>
          {items.map((w, i) => (
            <button key={w.id} aria-current={i === index} aria-label={`${i + 1} ${t.lb.of} ${total}`} onClick={() => onIndex(i)}>
              <img src={w.src} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
