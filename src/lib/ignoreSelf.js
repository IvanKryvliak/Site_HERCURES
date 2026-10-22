/* Не рахувати візити власника сайту на цьому пристрої / Skip the owner's own visits on this device. */
const KEY = "hearcures_analytics_ignore";

export function isIgnored() {
  try { return localStorage.getItem(KEY) === "1"; } catch { return false; }
}

export function setIgnored(value) {
  try { localStorage.setItem(KEY, value ? "1" : "0"); } catch { /* storage unavailable */ }
}

// true, якщо власник уже робив вибір (щоб не перезаписувати його) / true once a choice was made
export function wasIgnoreChosen() {
  try { return localStorage.getItem(KEY) !== null; } catch { return true; }
}
