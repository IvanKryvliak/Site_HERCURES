export default function TopPages({ rows }) {
  return (
    <div className="an-scroll">
      <table className="an-table">
        <thead><tr><th>Страница</th><th>Просмотры</th><th>Доля</th></tr></thead>
        <tbody>
          {rows.length ? rows.map((row) => (
            <tr key={row.name}><td>{row.name}</td><td>{Number(row.views || 0).toLocaleString("ru-RU")}</td><td>{Number(row.share || 0)}%</td></tr>
          )) : <tr><td colSpan="3">Пока нет данных</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
