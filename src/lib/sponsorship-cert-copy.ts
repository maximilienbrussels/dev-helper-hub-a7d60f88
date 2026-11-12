/**
 * Teksten van het Peter/Meterschap-certificaat. Gedeeld door de PDF (server)
 * en het live voorbeeld op de steunpagina, zodat beide altijd gelijk lopen.
 */
export const SPONSOR_CERT_COPY = {
  nl: {
    kicker: "OFFICIEEL CERTIFICAAT",
    title: "Peter- of Meterschap",
    intro: "Hierbij verklaren wij dat",
    body: (a: string) => `Peter of Meter is geworden van ${a}, en zo bijdraagt aan de dagelijkse zorg, voeding en het welzijn van dit dier op Maximilien.`,
    tier: "Formule",
    date: "Datum",
    code: "Certificaatnummer",
    thanks: "Namens alle dieren en het team: hartelijk dank voor je steun!",
  },
  fr: {
    kicker: "CERTIFICAT OFFICIEL",
    title: "Parrainage / Marrainage",
    intro: "Nous certifions par la présente que",
    body: (a: string) => `est devenu(e) parrain/marraine de ${a}, contribuant ainsi aux soins quotidiens, à l'alimentation et au bien-être de cet animal à La Ferme du parc Maximilien.`,
    tier: "Formule",
    date: "Date",
    code: "Numéro de certificat",
    thanks: "Au nom de tous les animaux et de l'équipe : merci pour votre soutien !",
  },
  en: {
    kicker: "OFFICIAL CERTIFICATE",
    title: "Animal Sponsorship",
    intro: "This certifies that",
    body: (a: string) => `has become a sponsor of ${a}, contributing to the daily care, food and welfare of this animal at La Ferme du parc Maximilien.`,
    tier: "Tier",
    date: "Date",
    code: "Certificate number",
    thanks: "On behalf of all the animals and the team: thank you for your support!",
  },
} as const;
