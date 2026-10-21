export default function SourcesList({ items }) {
  if (!items?.length) return <p className="an-empty">Пока нет данных за выбранный период.</p>;
  return (
    <ul className="an-bars">
      {items.map((s, i) => (
        <li key={s.name}>
          <div><span>{s.name}</span><b>{s.value}%</b></div>
          <div className="an-track"><i style={{ width: `${s.value}%`, opacity: 1 - i * 0.12 }} /></div>
        </li>
      ))}
    </ul>
  );
}
