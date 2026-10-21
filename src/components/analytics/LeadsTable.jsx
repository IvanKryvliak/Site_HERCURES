import { STATUS } from "../../data/analytics";

export default function LeadsTable({ rows }) {
  return (
    <div className="an-scroll">
      <table className="an-table">
        <thead><tr><th>Datum</th><th>Jméno</th><th>Telefon</th><th>Zdroj</th><th>Poptávka</th><th>Stav</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.date}</td><td>{r.name}</td><td><a href={`tel:${r.phone.replace(/[^+\d]/g, "")}`}>{r.phone}</a></td>
              <td>{r.source}</td><td>{r.msg}</td>
              <td><span className={`an-badge ${r.status}`}>{STATUS[r.status]}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
