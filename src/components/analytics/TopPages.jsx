export default function TopPages({ rows }) {
  return (
    <div className="an-scroll">
      <table className="an-table">
        <thead><tr><th>Страница</th><th>Просмотры</th><th>Время</th><th>Отказы</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}><td>{r.name}</td><td>{r.views.toLocaleString("ru-RU")}</td><td>{r.time}</td><td>{r.bounce}%</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
