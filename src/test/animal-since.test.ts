import { describe, expect, it } from "vitest";
import { sinceLabel } from "@/components/views/animal-passport";

describe("sinceLabel", () => {
  it("shows how many full years an animal has lived on the farm", () => {
    expect(sinceLabel("2021-03-10", "nl", new Date("2026-11-08T12:00:00"))).toBe("maart 2021 · 5 jaar");
  });
  it("does not count a year before the anniversary", () => {
    expect(sinceLabel("2025-12-01", "en", new Date("2026-11-08T12:00:00"))).toBe("December 2025");
  });
  it("returns null for an invalid date", () => {
    expect(sinceLabel("nope", "nl")).toBeNull();
  });
});
