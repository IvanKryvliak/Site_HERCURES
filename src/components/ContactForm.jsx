import { useState } from "react";
import { sendLead } from "../services/sendLead";

export default function ContactForm({ t, lang }) {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (data.website) return; // пастка для спам-ботів / honeypot
    setStatus("sending");
    try {
      await sendLead({ name: data.name, phone: data.phone, message: data.msg || "", lang });
      setStatus("sent");
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <label>{t.fName}<input name="name" required autoComplete="name" /></label>
      <label>{t.fPhone}<input name="phone" type="tel" required autoComplete="tel" inputMode="tel" /></label>
      <label>{t.fMsg}<textarea name="msg" /></label>
      <div className="hp" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
      <button className="btn" type="submit" disabled={status === "sending"}>
        {status === "sending" ? t.sending : t.send}
      </button>
      <div aria-live="polite">
        {status === "sent" && <p className="ok">{t.ok}</p>}
        {status === "error" && <p className="ok err">{t.err}</p>}
      </div>
    </form>
  );
}
