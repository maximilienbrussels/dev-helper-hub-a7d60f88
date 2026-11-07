import { WALLET_CONFIG, signRs256, type WalletCredentials, type WalletPassInput } from "@/lib/google-wallet.server";
import { localizedString, welcomeMessage } from "@/lib/wallet-localization";
import { walletCopy, type WalletTranslations } from "@/locales/wallet";

export const EVENT_CLASS_SUFFIX = "maximilien_event_v1";
export function buildEventTicket(input: WalletPassInput & { eventTranslations?: WalletTranslations }, issuerId: string) {
  return {
    id: `${issuerId}.event_${input.ticketId.toLowerCase().replace(/[^a-z0-9_-]/g, "_")}`,
    classId: `${issuerId}.${EVENT_CLASS_SUFFIX}`,
    state: "ACTIVE",
    ticketHolderName: input.participantName,
    ticketNumber: input.ticketId,
    barcode: { type: "QR_CODE", value: input.verifyUrl ?? `${WALLET_CONFIG.verifyBase}?id=${encodeURIComponent(input.ticketId)}` },
    textModulesData: [
      { id: "event", localizedHeader: localizedString(input.eventTranslations ?? walletCopy.groupVisit), localizedBody: localizedString(input.eventTranslations ?? walletCopy.groupVisit) },
      { id: "date", localizedHeader: localizedString(walletCopy.date), localizedBody: localizedString({ nl: input.eventDate, fr: input.eventDate, en: input.eventDate }) },
    ],
    messages: [welcomeMessage()],
  };
}
/** Patch only these translated fields on the approved class; never resubmit reviewStatus. */
export function eventClassLocalization(eventName: WalletTranslations = walletCopy.groupVisit) {
  return { eventName: localizedString(eventName), venue: { name: localizedString(walletCopy.venue) } };
}
export async function createEventSaveUrl(input: WalletPassInput & { eventTranslations?: WalletTranslations }, credentials: WalletCredentials) {
  const jwt = await signRs256({
    iss: credentials.clientEmail, aud: "google", typ: "savetowallet", iat: Math.floor(Date.now() / 1000),
    origins: [...WALLET_CONFIG.origins],
    payload: { eventTicketObjects: [buildEventTicket(input, credentials.issuerId)] },
  }, credentials.privateKey);
  return `https://pay.google.com/gp/v/save/${jwt}`;
}