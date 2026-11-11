import { describe, expect, it, vi } from "vitest";
import { generateKeyPair, exportPKCS8, importSPKI, exportSPKI, jwtVerify } from "jose";
import { createMemberSaveUrl, createSaveUrl, sanitizePrivateKey, signRs256, WalletKeyError } from "@/lib/google-wallet.server";

describe("defensive Wallet signing", () => {
  it("normalizes escaped newlines, Windows newlines, quotes and service-account JSON", () => {
    const pem = "-----BEGIN PRIVATE KEY-----\nTEST\n-----END PRIVATE KEY-----";
    expect(sanitizePrivateKey(pem.replace(/\n/g, "\\n"))).toBe(pem);
    expect(sanitizePrivateKey(pem.replace(/\n/g, "\r\n"))).toBe(pem);
    expect(sanitizePrivateKey(`'${pem}'`)).toBe(pem);
    expect(sanitizePrivateKey(JSON.stringify({ private_key: pem }))).toBe(pem);
  });
  it.each(['{"private_key":123}', '{"private_key":""}', '{}', '{broken'])("rejects malformed JSON %s atomically", (raw) => {
    expect(() => sanitizePrivateKey(raw)).toThrow(WalletKeyError);
  });
  it("returns a typed error for invalid cryptographic structures", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    try { await expect(signRs256({}, "invalid")).rejects.toBeInstanceOf(WalletKeyError); }
    finally { log.mockRestore(); }
  });
  it("signs Unicode claims and preserves separate Loyalty and Generic resource types", async () => {
    const keys = await generateKeyPair("RS256", { extractable: true });
    const privateKey = await exportPKCS8(keys.privateKey);
    const publicKey = await importSPKI(await exportSPKI(keys.publicKey), "RS256");
    const creds = { issuerId: "3388000000023193763", clientEmail: "test@example.org", privateKey };
    const member = await createMemberSaveUrl({ memberId: "member-123", memberName: "Élodie 🐐", hooiBalance: 42, locale: "fr" }, creds);
    const verified = await jwtVerify(member.split("/save/")[1] ?? "", publicKey, { audience: "google" });
    const payload = verified.payload.payload as { loyaltyObjects: { accountName: string }[] };
    expect(payload.loyaltyObjects[0]?.accountName).toBe("Élodie 🐐");
    expect(payload).not.toHaveProperty("loyaltyClasses");
    const ticket = await createSaveUrl({ ticketId: "ticket-123", participantName: "Élodie", eventTitle: "Tour", eventDate: "2026-11-09", passType: "ticket", locale: "fr" }, creds);
    const generic = (await jwtVerify(ticket.split("/save/")[1] ?? "", publicKey)).payload.payload;
    expect(generic).not.toHaveProperty("genericClasses");
    expect((generic as { eventTicketObjects: { classId: string }[] }).eventTicketObjects[0]?.classId).toBe("3388000000023193763.maximilien_event_v1");
    expect(generic).not.toHaveProperty("loyaltyObjects");
  });
});