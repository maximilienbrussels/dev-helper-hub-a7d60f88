import { describe, expect, it } from "vitest";
import { seasonFor } from "@/lib/season";

describe("seasonFor", () => {
  it("maart is lente", () => expect(seasonFor(new Date(2026, 2, 1))).toBe("lente"));
  it("juli is zomer", () => expect(seasonFor(new Date(2026, 6, 15))).toBe("zomer"));
  it("november is herfst", () => expect(seasonFor(new Date(2026, 10, 30))).toBe("herfst"));
  it("december is winter", () => expect(seasonFor(new Date(2026, 11, 1))).toBe("winter"));
  it("februari is winter", () => expect(seasonFor(new Date(2027, 1, 28))).toBe("winter"));
});
