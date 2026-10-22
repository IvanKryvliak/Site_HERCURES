import { useState } from "react";
import { trackPageView } from "../utils/track";
import "../styles/analytics-consent.css";

const CONSENT_KEY = "hearcures_analytics_consent";

function getInitialChoice() {
  try { return localStorage.getItem(CONSENT_KEY) || "unset"; }
  catch { return "unset"; }
}

export default function AnalyticsConsent({ lang }) {
  const [choice, setChoice] = useState(getInitialChoice);
  const [open, setOpen] = useState(() => getInitialChoice() === "unset");

  function choose(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch { /* site still works without saved consent */ }
    setChoice(value);
    setOpen(false);
    if (value === "granted") trackPageView();
  }

  const copy = lang === "en" ? {
    title: "Analytics settings",
    text: "With your permission, this site records basic traffic statistics and clicks on the contact buttons. It does not send your name, phone number or email address to the analytics table. You can change this choice at any time.",
    allow: "Allow analytics",
    reject: "Reject",
    manage: "Analytics settings",
  } : {
    title: "Nastavení analytiky",
    text: "Se souhlasem měříme základní návštěvnost a kliknutí na kontaktní tlačítka. Do analytické tabulky neposíláme vaše jméno, telefon ani e-mail. Toto nastavení můžete kdykoli změnit.",
    allow: "Povolit analytiku",
    reject: "Odmítnout",
    manage: "Nastavení analytiky",
  };

  return (
    <>
      {open && (
        <div className="analytics-consent" role="dialog" aria-modal="false" aria-labelledby="analytics-consent-title">
          <div className="analytics-consent-copy">
            <h2 id="analytics-consent-title">{copy.title}</h2>
            <p>{copy.text}</p>
          </div>
          <div className="analytics-consent-actions">
            <button type="button" className="analytics-consent-accept" onClick={() => choose("granted")}>{copy.allow}</button>
            <button type="button" className="analytics-consent-reject" onClick={() => choose("rejected")}>{copy.reject}</button>
          </div>
        </div>
      )}
      <div className="analytics-consent-footer">
      <button type="button" className="analytics-consent-manage" onClick={() => setOpen(true)} aria-expanded={open}>
        {copy.manage}{choice === "granted" ? " · ✓" : choice === "rejected" ? " · ✕" : ""}
      </button>
      </div>
    </>
  );
}
