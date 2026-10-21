export default function KpiCard({ label, value, delta }) {
  const up = delta >= 0;
  return (
    <div className="an-panel an-kpi">
      <span>{label}</span>
      <b>{value}</b>
      <em className={up ? "up" : "down"}>{up ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%</em>
    </div>
  );
}
