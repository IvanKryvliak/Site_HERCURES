export const CHANNEL_NAMES = {
  whatsapp: "WhatsApp",
  mail: "Эл. почта",
  tel: "Телефон",
  other: "Другое",
};

export function emptySeries(days) {
  const rows = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - offset);
    rows.push({ date: date.toISOString().slice(0, 10), visits: 0, contacts: 0, visitors: 0 });
  }
  return rows;
}
