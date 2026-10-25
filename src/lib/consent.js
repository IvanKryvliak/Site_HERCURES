import { getCookie, setCookie, deleteCookie } from "./cookies";

/* Усі cookies сайту (перелік для політики конфіденційності):
   hearcures_consent  Ваш вибір щодо аналітики         180 днів     необхідний
   hearcures_lang     Вибрана мова                      365 днів     необхідний (функціональний)
   hearcures_sid      Випадковий номер сесії для статистики  до закриття браузера   аналітичний, лише зі згодою */
export const CONSENT_COOKIE = "hearcures_consent";
export const SESSION_COOKIE = "hearcures_sid";
export const LANG_COOKIE = "hearcures_lang";
export const CONSENT_DAYS = 180; // після цього банер зʼявиться знову
const LEGACY_KEY = "hearcures_analytics_consent";

export function getConsent() {
  const c = getCookie(CONSENT_COOKIE);
  if (c === "granted" || c === "rejected") return c;
  // Перенесення вибору зі старого сховища (localStorage) у cookie
  try {
    const old = localStorage.getItem(LEGACY_KEY);
    if (old === "granted" || old === "rejected") {
      setCookie(CONSENT_COOKIE, old, CONSENT_DAYS);
      localStorage.removeItem(LEGACY_KEY);
      return old;
    }
  } catch { /* storage unavailable */ }
  return "unset";
}

export function setConsent(value) {
  setCookie(CONSENT_COOKIE, value, CONSENT_DAYS);
  if (value !== "granted") deleteCookie(SESSION_COOKIE); // відмова = прибираємо аналітичний cookie
}

export const hasConsent = () => getConsent() === "granted";
