import { CHANNEL_NAMES } from "../../data/analytics";

export default function ContactsTable({ rows }) {
  return (
    <div className="an-scroll">
      <table className="an-table">
        <thead><tr><th>Дата</th><th>Канал</th><th>Источник</th><th>Страница</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.date}</td>
              <td><span className={`an-badge ${r.channel}`}>{CHANNEL_NAMES[r.channel]}</span></td>
              <td>{r.source}</td><td>{r.page}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
