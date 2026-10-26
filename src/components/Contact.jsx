import ContactActions from "./ContactActions";
import { PHONE, PHONE_VIEW, EMAIL, PHONE_CONFIGURED } from "../data/config";

export default function Contact({ t }) {
  return (
    <section id="contact" className="dark">
      <div className="wrap two top">
        <div>
          <span className="eyebrow">{t.contactTag}</span>
          <h2>{t.contactH}</h2>
          <p className="sub">{t.contactP}</p>
          <ul className="contact-list">
            {t.cl.filter((_, i) => i !== 0 || PHONE_CONFIGURED).map(([label]) => {
              const isPhone = label === t.cl[0][0];
              return (
                <li key={label}>
                  <small>{label}</small>
                  {isPhone ? <a href={`tel:${PHONE}`}>{PHONE_VIEW}</a> : <a href={`mailto:${EMAIL}`}>{EMAIL}</a>}
                </li>
              );
            })}
          </ul>
        </div>
        <ContactActions t={t} />
      </div>
    </section>
  );
}
