import { CHANNEL_NAMES } from "../../data/analytics";

export default function ContactsTable({ rows }) {
  return (
    <div className="an-scroll">
      <table className="an-table">
        <thead><tr><th>Дата</th><th>Канал</th><th>Источник</th><th>Страница</th></tr></thead>
        <tbody>
          {rows.length ? rows.map((row) => (
            <tr key={row.id}>
              <td>{row.date}</td>
              <td><span className={`an-badge ${row.channel}`}>{CHANNEL_NAMES[row.channel] || "Другое"}</span></td>
              <td>{row.source}</td><td>{row.page}</td>
            </tr>
          )) : <tr><td colSpan="4">Ще не було кліків по контактних кнопках за вибраний період.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
