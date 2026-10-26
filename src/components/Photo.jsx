import { PHOTOS } from "../data/config";

export default function Photo({ id, label, className = "", style }) {
  const src = PHOTOS[id];
  return (
    <div className={`ph ${className}`} data-photo={id} style={style}>
      {src ? (
        <img
          src={src}
          srcSet={id === "hero"
            ? "/images/hero-540.webp 540w, /images/hero-750.webp 750w, /images/hero-1000.webp 1000w"
            : undefined}
          sizes={id === "hero" ? "(max-width: 860px) calc(100vw - 40px), 45vw" : undefined}
          width={id === "hero" ? 1000 : undefined}
          height={id === "hero" ? 1000 : undefined}
          loading={id === "hero" ? "eager" : "lazy"}
          fetchPriority={id === "hero" ? "high" : "auto"}
          decoding="async"
          alt={label}
        />
      ) : <span>{label}</span>}
    </div>
  );
}
