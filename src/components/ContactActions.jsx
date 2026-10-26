import { PHONE, PHONE_VIEW, EMAIL, WHATSAPP_NUMBER, PHONE_CONFIGURED, WHATSAPP_CONFIGURED } from "../data/config";
import { trackContact } from "../utils/track";

const svgProps = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

export default function ContactActions({ t }) {
  const items = [
    WHATSAPP_CONFIGURED && {
      href: `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`,
      channel: "whatsapp",
      label: t.whatsapp, value: WHATSAPP_NUMBER.replace(/^\+(\d{3})(\d{3})(\d{3})(\d{3})$/, "+$1 $2 $3 $4"),
      icon: <path d="M21 11.5a8.4 8.4 0 0 1-12.2 7.5L3 20.5l1.6-5.3A8.4 8.4 0 1 1 21 11.5z" />,
    },
    {
      href: `mailto:${EMAIL}`,
      channel: "mail",
      label: t.mail, value: EMAIL,
      icon: <><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m3 7 9 6 9-6" /></>,
    },
    PHONE_CONFIGURED && {
      href: `tel:${PHONE}`,
      channel: "tel",
      label: t.callLbl, value: PHONE_VIEW,
      icon: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />,
    },
  ].filter(Boolean);

  return (
    <div className="actions">
      <h3>{t.reachH}</h3>
      <p className="sub">{t.reachP}</p>
      {items.map((i) => (
        <a key={i.label} className="action" href={i.href} onClick={() => trackContact(i.channel)}>
          <span className="ico"><svg {...svgProps}>{i.icon}</svg></span>
          <span><b>{i.label}</b><small>{i.value}</small></span>
          <span className="arr" aria-hidden="true">→</span>
        </a>
      ))}
    </div>
  );
}
