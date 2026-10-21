export default function KpiCard({ label, value, delta }) {
  const hasComparison = typeof delta === "number" && Number.isFinite(delta);
  const up = hasComparison && delta >= 0;
  return (
    <div className="an-panel an-kpi">
      <span>{label}</span>
      <b>{value}</b>
      <em className={hasComparison ? (up ? "up" : "down") : "neutral"}>
        {hasComparison ? `${up ? "▲" : "▼"} ${Math.abs(delta).toFixed(1)}%` : "— нет базы для сравнения"}
      </em>
    </div>
  );
}
