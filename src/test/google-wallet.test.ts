import { describe, expect, it } from "vitest";
import { buildMemberClass, buildMemberPassObject, MEMBER_BACKGROUND } from "@/lib/google-wallet.server";

const input = { memberId: "member-123", memberName: "Example", hooiBalance: 42, locale: "nl" as const };
describe("Loyalty Wallet", () => {
  it("uses the requested loyalty class", () => {
    expect(buildMemberPassObject(input, "3388000000023193763").classId).toBe("3388000000023193763.maximilien_ticket_v1");
    expect(buildMemberPassObject(input, "3388000000023193763").loyaltyPoints.balance.int).toBe(42);
  });
  it("never claims NFC without collector provisioning", () => {
    expect(buildMemberClass("3388000000023193763", "nl").enableSmartTap).toBe(false);
    expect(buildMemberPassObject(input, "3388000000023193763")).not.toHaveProperty("smartTapRedemptionValue");
  });
  it("uses Google's string redemption field only with a configured collector", () => {
    const config = { redemptionIssuers: ["123456789"], redemptionValue: "test-member-token" };
    expect(buildMemberClass("3388000000023193763", "nl", config).enableSmartTap).toBe(true);
    expect(buildMemberPassObject(input, "3388000000023193763", config).smartTapRedemptionValue).toBe("test-member-token");
  });
  it("uses the premium matte identity and HTTPS artwork", () => {
    const card = buildMemberClass("3388000000023193763", "nl");
    expect(card.hexBackgroundColor).toBe(MEMBER_BACKGROUND);
    expect(card.programLogo.sourceUri.uri.startsWith("https://")).toBe(true);
  });
});