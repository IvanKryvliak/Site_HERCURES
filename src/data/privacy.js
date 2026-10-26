import { COMPANY, DATA_RETENTION_MONTHS, ANALYTICS_REGION, POLICY_UPDATED } from "./config";

/* ШАБЛОН політики конфіденційності. Текст бажано показати юристу перед публікацією. */

export const addressLine = (c = COMPANY) =>
  [c.street, [c.zip, c.city].filter(Boolean).join(" ")].filter(Boolean).join(", ");
export const idsLine = (c = COMPANY) =>
  [c.ico && `IČO ${c.ico}`, c.dic && `DIČ ${c.dic}`].filter(Boolean).join(", ");

export function getPolicy(lang) {
  const cs = lang !== "en";
  const ids = idsLine();
  const controller = [COMPANY.name, addressLine(), ids, COMPANY.status].filter(Boolean).join(", ");
  const region = ANALYTICS_REGION ? (cs ? ` Databáze analytiky je umístěna v regionu: ${ANALYTICS_REGION}.` : ` The analytics database is located in the region: ${ANALYTICS_REGION}.`) : "";

  if (cs) {
    return {
      back: "Zpět na web",
      title: "Zásady ochrany osobních údajů",
      updated: `Platné od ${POLICY_UPDATED}`,
      sections: [
        { h: "1. Kdo je správcem vašich údajů", paras: [`Správcem osobních údajů je ${controller}.`, `Kontakt pro dotazy k ochraně osobních údajů: ${COMPANY.email}.`] },
        { h: "2. Jaké údaje zpracováváme a proč", blocks: [
          { h: "Nezbytné cookies", p: "Ukládáme dva nezbytné cookies: vaši volbu jazyka a vaši volbu souhlasu s analytikou. Bez nich by web nemohl zapamatovat vaše nastavení. Souhlas se k nim nevyžaduje. Právní základ: oprávněný zájem správce na funkčním webu (čl. 6 odst. 1 písm. f) GDPR)." },
          { h: "Analytika (pouze se souhlasem)", p: `Pokud kliknete na „Souhlasím“, měříme anonymní návštěvnost webu. Zaznamenáváme náhodný identifikátor návštěvy (cookie hearcures_sid, platí do zavření prohlížeče), navštívenou stránku, zdroj návštěvy (například vyhledávač nebo Instagram), typ zařízení (telefon, tablet, počítač), kliknutí na kontaktní tlačítka (WhatsApp, e-mail, telefon) a čas události. Neukládáme vaše jméno, telefon ani e-mail. Pro ochranu před zneužitím se z IP adresy krátkodobě vytváří jednosměrný kód (hash) s denně se měnící solí, který neumožňuje zjistit vaši IP adresu a po krátké době se automaticky maže. Účelem je zjistit, které části webu fungují, a web zlepšovat. Právní základ: váš souhlas (čl. 6 odst. 1 písm. a) GDPR). Statistické záznamy uchováváme ${DATA_RETENTION_MONTHS} měsíců a poté je automaticky mažeme.` },
          { h: "Komunikace s vámi", p: "Když nás kontaktujete přes WhatsApp, e-mail nebo telefon, zpracováváme údaje, které nám sami sdělíte (například jméno, telefonní číslo, text zprávy), abychom vyřídili vaši poptávku a případně připravili nabídku. Právní základ: opatření před uzavřením smlouvy na vaši žádost a oprávněný zájem na vyřízení dotazu (čl. 6 odst. 1 písm. b) a f) GDPR). Údaje uchováváme po dobu nezbytnou k vyřízení poptávky a navazující zakázky a po dobu, kterou vyžadují právní předpisy." },
          { h: "Provoz webu", p: "Poskytovatel hostingu, na kterém web běží, může v rámci technického provozu zpracovávat provozní záznamy (například IP adresu) nezbytné pro zabezpečení a fungování serveru." },
        ] },
        { h: "3. Komu údaje předáváme", paras: ["Údaje mohou zpracovávat tito poskytovatelé, každý podle vlastních podmínek:"], list: ["Supabase Inc. – databáze pro anonymní statistiku (pouze se souhlasem).", "Poskytovatel hostingu webu.", "WhatsApp (Meta) – pokud nám napíšete přes WhatsApp.", "Poskytovatel e-mailových služeb – pokud nám napíšete e-mailem."] },
        { h: "4. Předávání mimo EU", paras: [`Poskytovatel Supabase Inc. je společnost se sídlem v USA.${region} Předávání údajů mimo Evropský hospodářský prostor zajišťujeme standardními smluvními doložkami nebo jiným mechanismem podle GDPR.`] },
        { h: "5. Cookies na tomto webu", table: { head: ["Cookie", "K čemu slouží", "Doba platnosti", "Typ"], rows: [
          ["hearcures_consent", "Zapamatuje vaši volbu souhlasu s analytikou", "180 dní", "Nezbytný"],
          ["hearcures_lang", "Zapamatuje zvolený jazyk", "365 dní", "Nezbytný"],
          ["hearcures_sid", "Náhodný identifikátor návštěvy pro anonymní statistiku", "Do zavření prohlížeče", "Analytický, pouze se souhlasem"],
        ] } },
        { h: "6. Vaše práva", paras: ["Máte právo na přístup ke svým údajům, jejich opravu, výmaz, omezení zpracování, přenositelnost a právo vznést námitku. Požadavky nám pošlete na e-mail uvedený výše.", "Souhlas s analytikou můžete kdykoli odvolat odkazem „Nastavení cookies“ ve spodní části webu. Odvolání nemá vliv na zákonnost zpracování před jeho odvoláním.", "Máte také právo podat stížnost u Úřadu pro ochranu osobních údajů, Pplk. Sochora 27, 170 00 Praha 7, www.uoou.cz."] },
        { h: "7. Změny zásad", paras: ["Tyto zásady můžeme aktualizovat. Aktuální verze je vždy na této stránce."] },
      ],
    };
  }
  return {
    back: "Back to the website",
    title: "Privacy policy",
    updated: `Effective from ${POLICY_UPDATED}`,
    sections: [
      { h: "1. Who controls your data", paras: [`The data controller is ${controller}.`, `Contact for privacy questions: ${COMPANY.email}.`] },
      { h: "2. What data we process and why", blocks: [
        { h: "Necessary cookies", p: "We store two necessary cookies: your language choice and your analytics consent choice. Without them the site could not remember your settings. No consent is required for them. Legal basis: the controller's legitimate interest in a working website (Art. 6(1)(f) GDPR)." },
        { h: "Analytics (only with your consent)", p: `If you click “Accept”, we measure anonymous website traffic. We record a random visit identifier (cookie hearcures_sid, valid until you close the browser), the page visited, the traffic source (for example a search engine or Instagram), the device type (phone, tablet, computer), clicks on the contact buttons (WhatsApp, e-mail, phone) and the time of the event. We do not store your name, phone number or e-mail. To protect against abuse, a one-way code (hash) with a salt that changes daily is briefly created from your IP address; it does not allow your IP address to be recovered and is deleted automatically after a short time. The purpose is to learn which parts of the site work and to improve it. Legal basis: your consent (Art. 6(1)(a) GDPR). Statistics are kept for ${DATA_RETENTION_MONTHS} months and then deleted automatically.` },
        { h: "Communication with you", p: "When you contact us via WhatsApp, e-mail or phone, we process the data you give us (for example your name, phone number and message) to answer your enquiry and, where relevant, prepare a quote. Legal basis: steps taken at your request before entering into a contract and our legitimate interest in answering enquiries (Art. 6(1)(b) and (f) GDPR). We keep the data for as long as needed to handle the enquiry and any resulting order, and as long as the law requires." },
        { h: "Operating the website", p: "The hosting provider of this website may process server logs (for example IP addresses) as part of technical operation, which are necessary for security and for running the server." },
      ] },
      { h: "3. Who receives your data", paras: ["The following providers may process data, each under its own terms:"], list: ["Supabase Inc. – database for anonymous statistics (only with consent).", "The website hosting provider.", "WhatsApp (Meta) – if you write to us via WhatsApp.", "The e-mail service provider – if you e-mail us."] },
      { h: "4. Transfers outside the EU", paras: [`Supabase Inc. is a company based in the USA.${region} Transfers outside the European Economic Area are protected by standard contractual clauses or another mechanism under the GDPR.`] },
      { h: "5. Cookies on this website", table: { head: ["Cookie", "Purpose", "Lifetime", "Type"], rows: [
        ["hearcures_consent", "Remembers your analytics consent choice", "180 days", "Necessary"],
        ["hearcures_lang", "Remembers your chosen language", "365 days", "Necessary"],
        ["hearcures_sid", "Random visit identifier for anonymous statistics", "Until the browser is closed", "Analytics, only with consent"],
      ] } },
      { h: "6. Your rights", paras: ["You have the right of access, rectification, erasure, restriction of processing, data portability and the right to object. Send requests to the e-mail address above.", "You can withdraw your consent to analytics at any time using the “Cookie settings” link at the bottom of the site. Withdrawal does not affect the lawfulness of processing before it.", "You also have the right to lodge a complaint with the Czech Office for Personal Data Protection (Úřad pro ochranu osobních údajů), Pplk. Sochora 27, 170 00 Prague 7, www.uoou.cz."] },
      { h: "7. Changes", paras: ["We may update this policy. The current version is always on this page."] },
    ],
  };
}
