/* A small Supabase REST client. No service-role key is ever exposed to the browser. */
const STORAGE_KEY = "hearcures_analytics_session";

export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || "").trim().replace(/\/$/, "");
export const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();
export const isAnalyticsConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

function publicHeaders() {
  return {
    apikey: SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
  };
}

function userHeaders(accessToken) {
  return { ...publicHeaders(), Authorization: `Bearer ${accessToken}` };
}

async function readError(response) {
  let detail = "Request failed";
  try {
    const body = await response.json();
    detail = body.msg || body.message || body.error_description || body.error || detail;
  } catch {
    // Keep the fallback message when the server did not return JSON.
  }
  return new Error(detail);
}

export function getStoredAnalyticsSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session?.access_token || !session?.refresh_token) return null;
    return session;
  } catch {
    return null;
  }
}

function storeSession(data) {
  const session = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    token_type: data.token_type || "bearer",
    expires_at: Date.now() + Number(data.expires_in || 3600) * 1000,
    user: data.user || null,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    throw new Error("Браузер не дозволив зберегти сесію. Увімкни localStorage для цього сайту.");
  }
  return session;
}

export async function signInWithPassword(email, password) {
  if (!isAnalyticsConfigured) throw new Error("Спочатку налаштуй VITE_SUPABASE_URL та VITE_SUPABASE_ANON_KEY у файлі .env.");
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: publicHeaders(),
    body: JSON.stringify({ email: email.trim(), password }),
  });
  if (!response.ok) throw await readError(response);
  return storeSession(await response.json());
}

export function signOut() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore storage errors */ }
}

async function refreshSession(session) {
  if (!isAnalyticsConfigured || !session?.refresh_token) throw new Error("Сесія завершилася. Увійди ще раз.");
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: publicHeaders(),
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  if (!response.ok) {
    signOut();
    throw new Error("Сесія завершилася. Увійди в панель аналітики ще раз.");
  }
  return storeSession(await response.json());
}

async function getValidSession() {
  let session = getStoredAnalyticsSession();
  if (!session) throw new Error("Потрібно увійти в панель аналітики.");
  if (Number(session.expires_at || 0) < Date.now() + 30_000) session = await refreshSession(session);
  return session;
}

export async function fetchAnalyticsSummary(days) {
  if (!isAnalyticsConfigured) throw new Error("Аналітика ще не налаштована. Заповни змінні Supabase у .env.");
  let session = await getValidSession();
  let response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_analytics_summary`, {
    method: "POST",
    headers: userHeaders(session.access_token),
    body: JSON.stringify({ p_days: days }),
  });
  if (response.status === 401) {
    session = await refreshSession(session);
    response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_analytics_summary`, {
      method: "POST",
      headers: userHeaders(session.access_token),
      body: JSON.stringify({ p_days: days }),
    });
  }
  if (!response.ok) throw await readError(response);
  return response.json();
}

export async function sendAnalyticsEvent(event) {
  if (!isAnalyticsConfigured) return;
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/track-event`, {
      method: "POST",
      headers: publicHeaders(),
      body: JSON.stringify(event),
      keepalive: true,
    });
    if (!response.ok) {
      // Tracking failures must not break site navigation or contact buttons.
      console.warn("Analytics event was not recorded.");
    }
  } catch {
    // The public website remains usable when analytics is temporarily unavailable.
  }
}
