import { useCallback, useEffect, useMemo, useState } from "react";
import PaintBackground from "../components/PaintBackground";
import KpiCard from "../components/analytics/KpiCard";
import TrafficChart from "../components/analytics/TrafficChart";
import SourcesList from "../components/analytics/SourcesList";
import DevicesDonut from "../components/analytics/DevicesDonut";
import TopPages from "../components/analytics/TopPages";
import ContactsTable from "../components/analytics/ContactsTable";
import { emptySeries } from "../data/analytics";
import { fetchAnalyticsSummary, getStoredAnalyticsSession, isAnalyticsConfigured, signInWithPassword, signOut } from "../lib/supabase";
import "../styles/site.css";
import "../styles/analytics.css";

const RANGES = [7, 30, 90];
const sum = (rows, key) => rows.reduce((total, row) => total + Number(row[key] || 0), 0);
const delta = (rows, key) => {
  const midpoint = Math.floor(rows.length / 2);
  const first = sum(rows.slice(0, midpoint), key);
  const second = sum(rows.slice(midpoint), key);
  return first ? ((second - first) / first) * 100 : null;
};
const number = (value) => Number(value || 0).toLocaleString("ru-RU");
const emptySummary = (days) => ({
  visits: 0,
  uniqueVisitors: 0,
  contacts: 0,
  series: emptySeries(days),
  sources: [],
  channels: [],
  devices: [],
  topPages: [],
  latestClicks: [],
});

function SetupNotice() {
  return (
    <div className="an-auth-card">
      <span className="an-auth-kicker">НАЛАШТУВАННЯ</span>
      <h2>Підключи Supabase</h2>
      <p>Сторінка аналітики більше не показує вигадані цифри. Щоб записувати та переглядати реальні події, додай параметри проєкту у файл <code>.env</code>.</p>
      <pre><code>VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co{"\n"}VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY</code></pre>
      <p>Потім створи таблицю та Edge Function за інструкцією у папці <code>supabase/</code> і перезапусти Vite.</p>
      <a className="an-back" href="#/">← Назад на сайт</a>
    </div>
  );
}

function LoginPanel({ onLogin, busy, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form className="an-auth-card" onSubmit={(event) => { event.preventDefault(); onLogin(email, password); }}>
      <span className="an-auth-kicker">ПРИВАТНА ПАНЕЛЬ</span>
      <h2>Вхід в аналітику</h2>
      <p>Увійди з обліковим записом адміністратора Supabase. Реєстрація з цієї сторінки вимкнена.</p>
      <label htmlFor="analytics-email">Email адміністратора</label>
      <input id="analytics-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <label htmlFor="analytics-password">Пароль</label>
      <input id="analytics-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      {error && <p className="an-auth-error" role="alert">{error}</p>}
      <button className="an-login-button" type="submit" disabled={busy}>{busy ? "Вхід…" : "Увійти"}</button>
      <a className="an-back" href="#/">← Назад на сайт</a>
    </form>
  );
}

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const [session, setSession] = useState(() => getStoredAnalyticsSession());
  const [summary, setSummary] = useState(() => emptySummary(30));
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const configured = isAnalyticsConfigured;

  const loadSummary = useCallback(async (period) => {
    if (!configured || !getStoredAnalyticsSession()) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchAnalyticsSummary(period);
      setSummary({ ...emptySummary(period), ...data, series: Array.isArray(data.series) ? data.series : emptySeries(period) });
      setLastUpdated(new Date());
    } catch (err) {
      setError(err?.message || "Не вдалося завантажити аналітику.");
      if (/увійти|сесія завершилася/i.test(err?.message || "")) {
        signOut();
        setSession(null);
      }
    } finally {
      setLoading(false);
    }
  }, [configured]);

  useEffect(() => {
    if (session && configured) void loadSummary(days);
  }, [session, configured, days, loadSummary]);

  const onLogin = async (email, password) => {
    setBusy(true);
    setError("");
    try {
      const nextSession = await signInWithPassword(email, password);
      setSession(nextSession);
    } catch (err) {
      setError(err?.message || "Не вдалося увійти. Перевір email і пароль.");
    } finally {
      setBusy(false);
    }
  };

  const onLogout = () => {
    signOut();
    setSession(null);
    setSummary(emptySummary(days));
    setLastUpdated(null);
    setError("");
  };

  const series = useMemo(() => summary.series?.length ? summary.series : emptySeries(days), [summary.series, days]);
  const visits = Number(summary.visits || 0);
  const contacts = Number(summary.contacts || 0);
  const visitorCount = Number(summary.uniqueVisitors || 0);
  const conversion = visits ? (contacts / visits) * 100 : 0;
  const conversionDelta = (() => {
    const midpoint = Math.floor(series.length / 2);
    const firstHalf = series.slice(0, midpoint);
    const secondHalf = series.slice(midpoint);
    const firstVisits = sum(firstHalf, "visits");
    const secondVisits = sum(secondHalf, "visits");
    const firstRate = firstVisits ? (sum(firstHalf, "contacts") / firstVisits) * 100 : 0;
    const secondRate = secondVisits ? (sum(secondHalf, "contacts") / secondVisits) * 100 : 0;
    return firstRate ? ((secondRate - firstRate) / firstRate) * 100 : null;
  })();

  return (
    <div className="cs an" lang="ru">
      <PaintBackground />
      <div className="an-wrap">
        {!configured ? <SetupNotice /> : !session ? (
          <LoginPanel onLogin={onLogin} busy={busy} error={error} />
        ) : (
          <>
            <div className="an-top">
              <div>
                <a className="an-back" href="#/">← Назад на сайт</a>
                <h1>Анализ сайта</h1>
                <p>Реальные посещения и клики по Viber, почте и телефону.</p>
              </div>
              <div className="an-header-actions">
                <div className="an-range" role="group" aria-label="Период">
                  {RANGES.map((range) => (
                    <button key={range} className={days === range ? "on" : ""} aria-pressed={days === range} onClick={() => setDays(range)}>{range} дн.</button>
                  ))}
                </div>
                <button className="an-logout" type="button" onClick={onLogout}>Выйти</button>
              </div>
            </div>

            <div className="an-note">
              {loading ? "Загрузка статистики…" : lastUpdated ? `Данные загружены ${lastUpdated.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}. Учитываются только события после согласия на аналитику.` : "Ожидание данных…"}
              <button className="an-refresh" type="button" onClick={() => void loadSummary(days)} disabled={loading}>{loading ? "Обновление…" : "Обновить"}</button>
            </div>
            {error && <div className="an-error" role="alert">{error}</div>}

            <div className="an-kpis">
              <KpiCard label="Просмотры страниц" value={number(visits)} delta={delta(series, "visits")} />
              <KpiCard label="Уникальные сессии" value={number(visitorCount)} delta={delta(series, "visitors")} />
              <KpiCard label="Клики по контактам" value={number(contacts)} delta={delta(series, "contacts")} />
              <KpiCard label="Контактные клики / просмотры" value={`${conversion.toFixed(1)}%`} delta={conversionDelta} />
            </div>

            {!loading && visits === 0 && contacts === 0 && <p className="an-empty-note">Пока нет записанной статистики за этот период. После настройки Supabase и согласия посетителей на аналитику здесь появятся реальные данные. Демонстрационные цифры не используются.</p>}

            <div className="an-panel"><h3>Посещения и клики по контактам</h3><TrafficChart series={series} /></div>
            <div className="an-two">
              <div className="an-panel"><h3>Контакты по каналам</h3><SourcesList items={summary.channels || []} /></div>
              <div className="an-panel"><h3>Источники трафика</h3><SourcesList items={summary.sources || []} /></div>
            </div>
            <div className="an-two">
              <div className="an-panel"><h3>Популярные страницы</h3><TopPages rows={summary.topPages || []} /></div>
              <div className="an-panel"><h3>Устройства</h3><DevicesDonut items={summary.devices || []} /></div>
            </div>
            <div className="an-panel"><h3>Последние клики по контактам</h3><ContactsTable rows={summary.latestClicks || []} /></div>
          </>
        )}
      </div>
    </div>
  );
}
