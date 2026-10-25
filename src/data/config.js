import MainPhoto from "../assets/Main.jpg";

/* Kontakty, fotky, id sekcí / Contacts, photos, section ids */
export const PHONE = "+420000000000";
export const PHONE_VIEW = "+420 000 000 000";
/* Номер WhatsApp у міжнародному форматі з плюсом / WhatsApp number, international format */
export const WHATSAPP_NUMBER = "+420000000000";
export const EMAIL = "info@example.com";

/* Cesty k fotkám. Prázdný řetězec = zástupný obrázek / Image paths. Empty = placeholder */
export const PHOTOS = { hero: MainPhoto, team: "", "work-1": "", "work-2": "", "work-3": "", "work-4": "" };

/* Stejné pořadí jako t.nav / Same order as t.nav */
export const SECTION_IDS = ["about", "services", "works", "clients", "contact"];

/* Адреса сторінки з політикою конфіденційності (показується в банері згоди).
   Порожній рядок = посилання не показується. / Privacy policy URL shown in the consent banner. Empty = no link. */
export const PRIVACY_URL = "";
