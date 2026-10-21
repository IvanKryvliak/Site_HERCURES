/* ПРИМЕРНЫЕ ДАННЫЕ / SAMPLE DATA.
   Замените реальными данными из вашего API, Google Analytics или Plausible.
   Replace with real data from your API, Google Analytics or Plausible. */

const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

export function makeSeries(days) {
  const r = rnd(42 + days);
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const visits = Math.round(120 + Math.sin(i / 3) * 25 + (days - i) * 0.6 + r() * 40);
    const contacts = Math.max(0, Math.round(visits * (0.03 + r() * 0.03)));
    out.push({ date: d.toISOString().slice(0, 10), visits, contacts });
  }
  return out;
}

export const SOURCES = [
  { name: "Google (органика)", value: 42 },
  { name: "Прямые заходы", value: 23 },
  { name: "Instagram", value: 14 },
  { name: "Facebook", value: 9 },
  { name: "Google Ads", value: 8 },
  { name: "Другое", value: 4 },
];

export const DEVICES = [
  { name: "Телефон", value: 64 },
  { name: "Компьютер", value: 30 },
  { name: "Планшет", value: 6 },
];

export const TOP_PAGES = [
  { name: "Главная", views: 4210, time: "1:48", bounce: 38 },
  { name: "Услуги", views: 2350, time: "1:22", bounce: 41 },
  { name: "Наши работы", views: 1980, time: "2:05", bounce: 33 },
  { name: "Контакты", views: 1240, time: "0:57", bounce: 29 },
  { name: "Клиентам", views: 860, time: "1:31", bounce: 44 },
];

export const CHANNELS = [
  { name: "Viber", value: 46 },
  { name: "Эл. почта", value: 31 },
  { name: "Телефон", value: 23 },
];

export const CHANNEL_NAMES = { viber: "Viber", mail: "Эл. почта", tel: "Телефон" };

export const CLICKS = [
  { id: 1, date: "2026-10-17 14:32", channel: "viber", source: "Google", page: "Услуги" },
  { id: 2, date: "2026-10-17 11:08", channel: "tel", source: "Прямые заходы", page: "Контакты" },
  { id: 3, date: "2026-10-16 20:45", channel: "viber", source: "Instagram", page: "Наши работы" },
  { id: 4, date: "2026-10-16 09:12", channel: "mail", source: "Google", page: "Главная" },
  { id: 5, date: "2026-10-15 18:27", channel: "viber", source: "Facebook", page: "Главная" },
  { id: 6, date: "2026-10-15 13:51", channel: "tel", source: "Google Ads", page: "Услуги" },
];
