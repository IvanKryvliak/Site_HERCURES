import { useState } from "react";
import { trackPageView } from "../utils/track";
import { PRIVACY_URL } from "../data/config";
import { getConsent, setConsent } from "../lib/consent";
import "../styles/analytics-consent.css";

const COPY = {
  cs: {
    title: "Soubory cookies",
    text: "Vždy používáme nezbytné cookies (volba jazyka a váš výběr souhlasu). S vaším souhlasem navíc analytické cookies, které měří anonymní návštěvnost a kliknutí na kontaktní tlačítka. Neukládáme vaše jméno, telefon ani e-mail. Souhlas můžete kdykoli změnit nebo odvolat.",
    policy: "Zásady ochrany osobních údajů",
    accept: "Souhlasím",
    decline: "Nesouhlasím",
    manage: "Nastavení cookies",
    status: { granted: "souhlas udělen", rejected: "souhlas neudělen" },
  },
  en: {
    title: "Cookies",
    text: "We always use necessary cookies (your language and your consent choice). With your consent we also use analytics cookies that measure anonymous traffic and clicks on the contact buttons. We do not store your name, phone number or email. You can change or withdraw your consent at any time.",
    policy: "Privacy policy",
    accept: "Accept",
    decline: "Decline",
    manage: "Cookie settings",
    status: { granted: "consent given", rejected: "consent declined" },
  },
};

export default function AnalyticsConsent({ lang }) {
  const [choice, setChoice] = useState(getConsent);
  const [open, setOpen] = useState(() => getConsent() === "unset");
  const copy = COPY[lang === "en" ? "en" : "cs"];

  function choose(value) {
    setConsent(value);
    setChoice(value);
    setOpen(false);
    if (value === "granted") trackPageView();
  }

  return (
    <>
      {open && (
        <div className="analytics-consent" role="dialog" aria-modal="false" aria-labelledby="analytics-consent-title">
          <h2 id="analytics-consent-title">{copy.title}</h2>
          <p>{copy.text}</p>
          {PRIVACY_URL && (
            <a className="analytics-consent-policy" href={PRIVACY_URL} {...(PRIVACY_URL.startsWith("#") ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
              {copy.policy}
            </a>
          )}
          {/* Обидві кнопки однакові за виглядом: відмова так само проста, як згода. */}
          <div className="analytics-consent-actions">
            <button type="button" className="analytics-consent-choice" data-choice="granted" onClick={() => choose("granted")}>{copy.accept}</button>
            <button type="button" className="analytics-consent-choice" data-choice="rejected" onClick={() => choose("rejected")}>{copy.decline}</button>
          </div>
        </div>
      )}
      <div className="analytics-consent-footer">
        <button type="button" className="analytics-consent-manage" onClick={() => setOpen(true)} aria-expanded={open}>
          {copy.manage}{copy.status[choice] ? ` (${copy.status[choice]})` : ""}
        </button>
      </div>
    </>
  );
}
