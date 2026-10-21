import { PHOTOS } from "../data/config";

export default function Photo({ id, label, className = "", style }) {
  const src = PHOTOS[id];
  return (
    <div className={`ph ${className}`} data-photo={id} style={style}>
      {src ? <img src={src} alt={label} /> : <span>{label}</span>}
    </div>
  );
}
