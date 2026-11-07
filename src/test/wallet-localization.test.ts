import { describe, expect, it } from "vitest";
import { localizedString, welcomeMessage } from "@/lib/wallet-localization";
import { walletCopy } from "@/locales/wallet";
import { buildEventTicket, eventClassLocalization } from "@/lib/wallet-event.server";

describe("Wallet localization", () => {
  it("uses the requested locale values in Google's translatedValues array", () => {
    expect(localizedString(walletCopy.groupVisit)).toEqual({
      defaultValue: { language: "nl-BE", value: "Groepsbezoek & Tour" },
      translatedValues: [
        { language: "fr-BE", value: "Visite de Groupe & Visite Guidée" },
        { language: "en-US", value: "Group Visit & Tour" },
      ],
    });
  });
  it("keeps approved class review status unchanged", () => {
    expect(eventClassLocalization()).not.toHaveProperty("reviewStatus");
  });
  it("includes localized welcome messages without promising notifications", () => {
    expect(welcomeMessage().localizedHeader.defaultValue.language).toBe("nl-BE");
    expect(welcomeMessage().messageType).toBe("TEXT");
    expect(buildEventTicket({ ticketId: "abc", participantName: "Test", eventTitle: "Tour", eventDate: "2026-11-09", passType: "ticket", locale: "nl" }, "3388000000023193763").classId).toBe("3388000000023193763.maximilien_event_v1");
  });
});