import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Дозволені сайти: supabase secrets set ALLOWED_ORIGINS=https://vasadomena.cz,http://localhost:5173
// Якщо змінну не задано, запити приймаються з будь-якого сайту (небезпечно для продакшну).
const allowedOrigins = (Deno.env.get("ALLOWED_ORIGINS") || "").split(",").map((s) => s.trim()).filter(Boolean);
const allowedSources = new Set(["Direct", "Search", "Instagram", "Facebook", "LinkedIn", "Other"]);
const allowedDevices = new Set(["Mobile", "Tablet", "Desktop"]);
const allowedChannels = new Set(["viber", "mail", "tel", "other"]);
const MAX_BODY_BYTES = 2000;

function corsFor(origin: string | null) {
  const allowOrigin = allowedOrigins.length === 0 ? "*" : origin && allowedOrigins.includes(origin) ? origin : "";
  return {
    ...(allowOrigin ? { "Access-Control-Allow-Origin": allowOrigin } : {}),
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, cors: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json; charset=utf-8" },
  });
}

async function sha256(text: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin");
  const cors = corsFor(origin);
  const originAllowed = allowedOrigins.length === 0 || (origin !== null && allowedOrigins.includes(origin));

  if (request.method === "OPTIONS") return new Response(originAllowed ? "ok" : "Forbidden", { status: originAllowed ? 200 : 403, headers: cors });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, cors);
  if (!originAllowed) return json({ error: "Origin not allowed" }, 403, cors);

  let raw = "";
  try {
    raw = await request.text();
  } catch {
    return json({ error: "Invalid body" }, 400, cors);
  }
  if (raw.length > MAX_BODY_BYTES) return json({ error: "Payload too large" }, 413, cors);

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(raw);
  } catch {
    return json({ error: "Invalid JSON" }, 400, cors);
  }

  const eventType = event.event_type;
  const sessionId = typeof event.session_id === "string" ? event.session_id : "";
  const pagePath = typeof event.page_path === "string" ? event.page_path : "/";
  const source = typeof event.source === "string" && allowedSources.has(event.source) ? event.source : "Other";
  const device = typeof event.device === "string" && allowedDevices.has(event.device) ? event.device : "Desktop";
  const channel = typeof event.channel === "string" && allowedChannels.has(event.channel) ? event.channel : null;

  if (eventType !== "page_view" && eventType !== "contact_click") return json({ error: "Unsupported event type" }, 400, cors);
  if (!/^[a-zA-Z0-9-]{8,80}$/.test(sessionId)) return json({ error: "Invalid session ID" }, 400, cors);
  if (!pagePath.startsWith("/") || pagePath.length > 100 || pagePath.includes("?") || pagePath.includes("#")) return json({ error: "Invalid page path" }, 400, cors);
  if (eventType === "contact_click" && !channel) return json({ error: "Invalid contact channel" }, 400, cors);

  const projectUrl = Deno.env.get("SUPABASE_URL");
  let serverKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""; // Legacy key injected by Supabase.
  if (!serverKey) {
    // New projects can expose server-only keys as a JSON dictionary in SUPABASE_SECRET_KEYS.
    try {
      const secretKeys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
      const values = secretKeys && typeof secretKeys === "object" ? Object.values(secretKeys) : [];
      serverKey = String(values.find((value) => typeof value === "string" && value.startsWith("sb_secret_")) || "");
    } catch {
      serverKey = "";
    }
  }
  if (!projectUrl || !serverKey) return json({ error: "Analytics ingestion is not configured" }, 500, cors);

  // Service credentials remain on the Supabase server, never in the browser bundle.
  const admin = createClient(projectUrl, serverKey, { auth: { persistSession: false } });

  // Ліміт частоти: за IP (зберігається лише денний хеш) і за сесією.
  const ip = (request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  const salt = Deno.env.get("RATE_LIMIT_SALT") || projectUrl;
  const ipHash = await sha256(`${ip}:${new Date().toISOString().slice(0, 10)}:${salt}`);
  const { data: allowed, error: limitError } = await admin.rpc("analytics_allow_event", { p_ip_hash: ipHash, p_session_id: sessionId });
  if (limitError) {
    console.error("Rate limit check failed:", limitError.message);
    return json({ error: "Could not record event" }, 500, cors);
  }
  if (allowed !== true) return json({ error: "Too many requests" }, 429, cors);

  const { error } = await admin.from("analytics_events").insert({
    event_type: eventType,
    session_id: sessionId,
    page_path: pagePath,
    source,
    device,
    channel: eventType === "contact_click" ? channel : null,
  });

  if (error) {
    console.error("Analytics insert failed:", error.message);
    return json({ error: "Could not record event" }, 500, cors);
  }
  return json({ ok: true }, 201, cors);
});
