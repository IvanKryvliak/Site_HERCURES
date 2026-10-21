import ContactActions from "./ContactActions";
import { PHONE, PHONE_VIEW, EMAIL } from "../data/config";

export default function Contact({ t }) {
  return (
    <section id="contact" className="dark">
      <div className="wrap two top">
        <div>
          <span className="eyebrow">{t.contactTag}</span>
          <h2>{t.contactH}</h2>
          <p className="sub">{t.contactP}</p>
          <ul className="contact-list">
            {t.cl.map(([label, v], i) => (
              <li key={label}>
                <small>{label}</small>
                {i === 0 ? <a href={`tel:${PHONE}`}>{PHONE_VIEW}</a> : i === 1 ? <a href={`mailto:${EMAIL}`}>{EMAIL}</a> : v}
              </li>
            ))}
          </ul>
        </div>
        <ContactActions t={t} />
      </div>
    </section>
  );
}
