import { useState } from "react";

const W = 700, H = 260, P = { l: 44, r: 40, t: 16, b: 30 };

export default function TrafficChart({ series }) {
  const [hover, setHover] = useState(null);
  const n = series.length;
  if (!n) return <p className="an-empty">Поки немає подій за вибраний період.</p>;
  const maxV = Math.max(...series.map((d) => d.visits), 1) * 1.1;
  const maxL = Math.max(...series.map((d) => d.contacts), 1) * 1.3;
  const chartWidth = W - P.l - P.r;
  const x = (i) => P.l + (n === 1 ? 0.5 : i / (n - 1)) * chartWidth;
  const yV = (v) => H - P.b - (v / maxV) * (H - P.t - P.b);
  const yL = (v) => H - P.b - (v / maxL) * (H - P.t - P.b);
  const line = (key, y) => series.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join(" ");
  const area = `${line("visits", yV)} L${x(n - 1)},${H - P.b} L${x(0)},${H - P.b} Z`;
  const step = Math.ceil(n / 6);

  const onMove = (e) => {
    if (n < 2) { setHover(0); return; }
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    setHover(Math.max(0, Math.min(n - 1, Math.round(((px - P.l) / (W - P.l - P.r)) * (n - 1)))));
  };
  const h = hover != null ? series[hover] : null;

  return (
    <div>
      <div className="an-legend"><span className="v">Посещения</span><span className="l">Контакты</span></div>
      <svg viewBox={`0 0 ${W} ${H}`} className="an-chart" onMouseMove={onMove} onMouseLeave={() => setHover(null)} role="img" aria-label="График посещений и контактов">
        <defs>
          <linearGradient id="anFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d1202b" stopOpacity=".55" />
            <stop offset="100%" stopColor="#d1202b" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((k) => {
          const yy = P.t + (k / 3) * (H - P.t - P.b);
          return <g key={k}><line x1={P.l} x2={W - P.r} y1={yy} y2={yy} stroke="#2b2b2e" /><text x={P.l - 8} y={yy + 4} textAnchor="end" className="an-ax">{Math.round(maxV * (1 - k / 3))}</text></g>;
        })}
        {series.map((d, i) => i % step === 0 && <text key={d.date} x={x(i)} y={H - 8} textAnchor="middle" className="an-ax">{d.date.slice(5)}</text>)}
        <path d={area} fill="url(#anFill)" />
        <path d={line("visits", yV)} fill="none" stroke="#ff5a63" strokeWidth="2.5" />
        <path d={line("contacts", yL)} fill="none" stroke="#f2f2f3" strokeWidth="2" strokeDasharray="5 4" />
        {h && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={P.t} y2={H - P.b} stroke="#66666b" />
            <circle cx={x(hover)} cy={yV(h.visits)} r="4.5" fill="#ff5a63" />
            <circle cx={x(hover)} cy={yL(h.contacts)} r="4" fill="#f2f2f3" />
          </g>
        )}
      </svg>
      <div className="an-tip">{h ? `${h.date}: ${h.visits} посещений, ${h.contacts} контактов` : "Наведите курсор на график"}</div>
    </div>
  );
}
