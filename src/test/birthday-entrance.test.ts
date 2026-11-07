import { describe, expect, it } from "vitest";
import { guestEntranceFor } from "@/lib/birthday-packages";

describe("guestEntranceFor", () => {
  it("1 april: hoofdingang", () => expect(guestEntranceFor(new Date(2026, 3, 1))).toBe("main"));
  it("31 oktober: hoofdingang", () => expect(guestEntranceFor(new Date(2026, 9, 31))).toBe("main"));
  it("1 november: kleine ingang", () => expect(guestEntranceFor(new Date(2026, 10, 1))).toBe("small"));
  it("31 maart: kleine ingang", () => expect(guestEntranceFor(new Date(2026, 2, 31))).toBe("small"));
});
