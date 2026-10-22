import { sendAnalyticsEvent } from "../lib/supabase";
import { isIgnored } from "../lib/ignoreSelf";

const CONSENT_KEY = "hearcures_analytics_consent";
let lastPageViewKey = null;
let fallbackSessionId = null;

function hasConsent() {
  try { return localStorage.getItem(CONSENT_KEY) === "granted"; }
  catch { return false; }
}

function getSessionId() {
  try {
    let id = sessionStorage.getItem("hearcures_analytics_session_id");
    if (!id) {
      id = globalThis.crypto?.randomUUID?.() || `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
      sessionStorage.setItem("hearcures_analytics_session_id", id);
    }
    return id;
  } catch {
    if (!fallbackSessionId) fallbackSessionId = globalThis.crypto?.randomUUID?.() || `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
    return fallbackSessionId;
  }
}

function getSource() {
  try {
    const params = new URLSearchParams(window.location.search);
    const campaignSource = (params.get("utm_source") || "").toLowerCase();
    const combined = `${campaignSource} ${document.referrer || ""}`.toLowerCase();
    if (!document.referrer && !campaignSource) return "Direct";
    if (/google|bing|seznam|yahoo|duckduckgo/.test(combined)) return "Search";
    if (/instagram/.test(combined)) return "Instagram";
    if (/facebook|fb\.com/.test(combined)) return "Facebook";
    if (/linkedin/.test(combined)) return "LinkedIn";
    return "Other";
  } catch {
    return "Direct";
  }
}

function getDevice() {
  const ua = navigator.userAgent || "";
  if (/ipad|tablet|playbook|silk/i.test(ua)) return "Tablet";
  if (/mobile|iphone|ipod|android/i.test(ua)) return "Mobile";
  return "Desktop";
}

function getPagePath() {
  // Do not collect query strings or hash fragments, which may contain user-entered data.
  return window.location.pathname || "/";
}

export function trackPageView() {
  if (!hasConsent() || isIgnored()) return;
  const page_path = getPagePath();
  const session_id = getSessionId();
  const guardKey = `${page_path}:${session_id}`;
  if (lastPageViewKey === guardKey) return; // Prevent React StrictMode from duplicating this event.
  lastPageViewKey = guardKey;
  void sendAnalyticsEvent({
    event_type: "page_view",
    session_id,
    page_path,
    source: getSource(),
    device: getDevice(),
  });
}

export function trackContact(channel) {
  if (!hasConsent() || isIgnored()) return;
  const payload = {
    event_type: "contact_click",
    session_id: getSessionId(),
    page_path: getPagePath(),
    source: getSource(),
    device: getDevice(),
    channel: ["viber", "mail", "tel"].includes(channel) ? channel : "other",
  };
  void sendAnalyticsEvent(payload);

  // Also forward the event to an optional Google Analytics or Plausible tag, if one is configured.
  try {
    window.plausible?.("Contact", { props: { channel } });
    window.gtag?.("event", "contact_click", { channel });
  } catch {
    // Analytics must never block the contact action.
  }
}
