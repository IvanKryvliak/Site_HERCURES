import MaimPhoto from "../assets/Main.jpg"

/* Kontakty, fotky, id sekcí / Contacts, photos, section ids */
export const PHONE = "+420000000000";
export const PHONE_VIEW = "+420 000 000 000";
/* Номер WhatsApp у міжнародному форматі з плюсом / WhatsApp number, international format */
export const WHATSAPP_NUMBER = "+420000000000";
export const EMAIL = "kajiya473@gmail.com";

/* Cesty k fotkám. Prázdný řetězec = zástupný obrázek / Image paths. Empty = placeholder */
export const PHOTOS = { hero: MaimPhoto, team: "", "work-1": "", "work-2": "", "work-3": "", "work-4": "" };

/* Stejné pořadí jako t.nav / Same order as t.nav */
export const SECTION_IDS = ["about", "services", "works", "clients", "contact"];

/* Адреса сторінки з політикою конфіденційності (показується в банері згоди).
   Порожній рядок = посилання не показується. / Privacy policy URL shown in the consent banner. Empty = no link. */
export const PRIVACY_URL = "#/privacy";

/* Дані оператора сайту: показуються в підвалі та в політиці конфіденційності. Порожні поля не показуються.
   Provider data shown in the footer and the privacy policy. Empty fields are hidden. */
export const COMPANY = {
  name: "Kryvliak Ivan",
  street: "Urbankova 67",
  zip: "",    // PSČ, наприклад "110 00"  <- ДОПОВНІТЬ
  city: "Praha",
  ico: "",    // IČO                      <- ДОПОВНІТЬ
  dic: "",    // DIČ, якщо платник ПДВ
  status: "", // наприклад "fyzická osoba zapsaná v živnostenském rejstříku"
  email: "kajiya473@gmail.com",
};

export const DATA_RETENTION_MONTHS = 14; // має збігатися з supabase/migrations/202610250001_retention.sql
export const ANALYTICS_REGION = "";      // регіон проєкту Supabase, наприклад "Frankfurt (EU)"
export const POLICY_UPDATED = "25. 10. 2026";
