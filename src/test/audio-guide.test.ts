import { describe, expect, it } from "vitest";
import { audioGuideUrl } from "@/lib/audio-guide";

describe("audioGuideUrl", () => {
  it("heeft een Franse opname voor de ezels", () => expect(audioGuideUrl("ezels", "fr")).toContain("ezels-fr"));
  it("Duits valt terug op Nederlands", () => expect(audioGuideUrl("ezels", "de")).toContain("ezels-nl"));
  it("geen opname voor de moestuin", () => expect(audioGuideUrl("maxi-moestuin", "nl")).toBeNull());
});
