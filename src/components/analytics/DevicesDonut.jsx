const COLORS = ["#d1202b", "#ff5a63", "#6e0f16"];

export default function DevicesDonut({ items }) {
  if (!items?.length) return <p className="an-empty">Пока нет данных об устройствах.</p>;
  const R = 52, C = 2 * Math.PI * R;
  const offsets = items.reduce((list, d, i) => [...list, i ? list[i - 1] + (items[i - 1].value / 100) * C : 0], []);
  return (
    <div className="an-donut">
      <svg viewBox="0 0 140 140" role="img" aria-label="Устройства посетителей">
        <g transform="rotate(-90 70 70)">
          {items.map((d, i) => {
            const len = (d.value / 100) * C;
            return <circle key={d.name} cx="70" cy="70" r={R} fill="none" stroke={COLORS[i]} strokeWidth="18" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offsets[i]} />;
          })}
        </g>
        <text x="70" y="76" textAnchor="middle" className="an-donut-n">{items[0].value}%</text>
      </svg>
      <ul>
        {items.map((d, i) => <li key={d.name}><i style={{ background: COLORS[i] }} />{d.name}<b>{d.value}%</b></li>)}
      </ul>
    </div>
  );
}
