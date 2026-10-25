/* Прості функції для роботи з cookies / Minimal cookie helpers. */
export function getCookie(name) {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`));
    return m ? decodeURIComponent(m[1]) : null;
  } catch { return null; }
}

// days не вказано = сесійний cookie (зникає після закриття браузера)
export function setCookie(name, value, days) {
  try {
    const parts = [`${name}=${encodeURIComponent(value)}`, "path=/", "SameSite=Lax"];
    if (days) parts.push(`max-age=${Math.round(days * 86400)}`);
    if (window.location.protocol === "https:") parts.push("Secure");
    document.cookie = parts.join("; ");
  } catch { /* cookies blocked */ }
}

export function deleteCookie(name) {
  try { document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`; } catch { /* cookies blocked */ }
}
