export type WalletTranslations = { nl: string; fr: string; en: string };
export const walletCopy = {
  groupVisit: { nl: "Groepsbezoek & Tour", fr: "Visite de Groupe & Visite Guidée", en: "Group Visit & Tour" },
  venue: { nl: "Stadsboerderij Maximilien", fr: "Ferme du Parc Maximilien", en: "Maximilien City Farm" },
  welcome: { nl: "Welkom op de Stadsboerderij", fr: "Bienvenue à la Ferme", en: "Welcome to the Farm" },
  welcomeBody: {
    nl: "Bezoekers, vrijwilligers en coördinatoren zorgen samen voor de dieren en activiteiten op de stadsboerderij.",
    fr: "Visiteurs, bénévoles et coordinateurs prennent soin ensemble des animaux et des activités de la ferme urbaine.",
    en: "Visitors, volunteers and coordinators care together for the animals and activities at the city farm.",
  },
  date: { nl: "Datum en tijd", fr: "Date et heure", en: "Date and time" },
  participant: { nl: "Deelnemer", fr: "Participant", en: "Participant" },
} satisfies Record<string, WalletTranslations>;