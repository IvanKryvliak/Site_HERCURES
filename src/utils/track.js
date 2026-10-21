/* Записывает клик по контакту в Plausible или Google Analytics,
   если они установлены на сайте. / Logs a contact click to Plausible or Google Analytics if installed. */
export function trackContact(channel) {
  try {
    window.plausible?.("Contact", { props: { channel } });
    window.gtag?.("event", "contact_click", { channel });
  } catch (e) {}
}
