import { walletCopy, type WalletTranslations } from "@/locales/wallet";
import { z } from "zod";

export const translationsSchema = z.object({
  nl: z.string().trim().min(1).max(2000),
  fr: z.string().trim().min(1).max(2000),
  en: z.string().trim().min(1).max(2000),
}).strict();
export function localizedString(copy: WalletTranslations) {
  const values = translationsSchema.parse(copy);
  return {
    defaultValue: { language: "nl-BE", value: values.nl },
    translatedValues: [
      { language: "fr-BE", value: values.fr },
      { language: "en-US", value: values.en },
    ],
  };
}
export function walletMessage(id: string, header: WalletTranslations, body: WalletTranslations, notify = false) {
  return {
    id,
    localizedHeader: localizedString(header),
    localizedBody: localizedString(body),
    messageType: notify ? "TEXT_AND_NOTIFY" : "TEXT",
  };
}
export function welcomeMessage() {
  return walletMessage("welcome", walletCopy.welcome, walletCopy.welcomeBody);
}