import { useMemo, useState } from "react";
import PaintBackground from "../components/PaintBackground";
import KpiCard from "../components/analytics/KpiCard";
import TrafficChart from "../components/analytics/TrafficChart";
import SourcesList from "../components/analytics/SourcesList";
import DevicesDonut from "../components/analytics/DevicesDonut";
import TopPages from "../components/analytics/TopPages";
import ContactsTable from "../components/analytics/ContactsTable";
import { makeSeries, SOURCES, CHANNELS, DEVICES, TOP_PAGES, CLICKS } from "../data/analytics";
import "../styles/site.css";
import "../styles/analytics.css";

const RANGES = [7, 30, 90];
const sum = (a, k) => a.reduce((s, d) => s + d[k], 0);
const delta = (a, k) => {
  const h = Math.floor(a.length / 2), first = sum(a.slice(0, h), k), second = sum(a.slice(h), k);
  return first ? ((second - first) / first) * 100 : 0;
};

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const series = useMemo(() => makeSeries(days), [days]);
  const visits = sum(series, "visits"), contacts = sum(series, "contacts");
  const fmt = (n) => n.toLocaleString("ru-RU");

  return (
    <div className="cs an" lang="ru">
      <PaintBackground />
      <div className="an-wrap">
        <div className="an-top">
          <div>
            <a className="an-back" href="#/">← Назад на сайт</a>
            <h1>Анализ сайта</h1>
            <p>Посетители, обращения через Viber, почту и телефон, источники трафика.</p>
          </div>
          <div className="an-range" role="group" aria-label="Период">
            {RANGES.map((r) => (
              <button key={r} className={days === r ? "on" : ""} aria-pressed={days === r} onClick={() => setDays(r)}>{r} дн.</button>
            ))}
          </div>
        </div>

        <div className="an-note">Показаны примерные данные. Реальные цифры появятся после подключения Plausible или Google Analytics. Клики по контактам отправляются туда как событие «Contact».</div>

        <div className="an-kpis">
          <KpiCard label="Посещения" value={fmt(visits)} delta={delta(series, "visits")} />
          <KpiCard label="Уникальные посетители" value={fmt(Math.round(visits * 0.72))} delta={delta(series, "visits")} />
          <KpiCard label="Клики по контактам" value={fmt(contacts)} delta={delta(series, "contacts")} />
          <KpiCard label="Конверсия" value={`${((contacts / visits) * 100).toFixed(1)}%`} delta={delta(series, "contacts") - delta(series, "visits")} />
        </div>

        <div className="an-panel"><h3>Посещения и контакты</h3><TrafficChart series={series} /></div>

        <div className="an-two">
          <div className="an-panel"><h3>Контакты по каналам</h3><SourcesList items={CHANNELS} /></div>
          <div className="an-panel"><h3>Источники трафика</h3><SourcesList items={SOURCES} /></div>
        </div>

        <div className="an-two">
          <div className="an-panel"><h3>Популярные страницы</h3><TopPages rows={TOP_PAGES} /></div>
          <div className="an-panel"><h3>Устройства</h3><DevicesDonut items={DEVICES} /></div>
        </div>

        <div className="an-panel"><h3>Последние клики по контактам</h3><ContactsTable rows={CLICKS} /></div>
      </div>
    </div>
  );
}
