import { describe, expect, it } from "vitest";
import { residentGallery, residentPhoto } from "@/lib/resident-photo";
import { validateResidentImageUrl } from "@/lib/resident-image-url";
import type { AlbumPhotoMap } from "@/lib/album-photos.functions";

const animal = { id: 3, name: "Pino", species: "konijn", image_url: "https://example.org/pino.jpg" };
const photo = (url: string, albumKey: string) => ({ id: url, albumKey, url, position: 0, alt: { nl: "", fr: "", en: "" } });
const albums: AlbumPhotoMap = {
  "dier-3": [photo("https://example.org/personal.jpg", "dier-3")],
  konijnen: [photo("https://example.org/rabbits.jpg", "konijnen")],
};
describe("resident photos", () => {
  it("keeps the selected profile photo ahead of album photos", () => {
    expect(residentPhoto(animal, albums)).toBe("https://example.org/pino.jpg");
  });
  it("falls back to the personal album before species photos", () => {
    expect(residentPhoto({ ...animal, image_url: null }, albums)).toBe("https://example.org/personal.jpg");
  });
  it("includes profile and administrator uploads first in the gallery", () => {
    expect(residentGallery(animal, albums).slice(0, 3)).toEqual([animal.image_url, "https://example.org/personal.jpg", "https://example.org/rabbits.jpg"]);
  });
  it.each(["https://", "https:// bad", "http://example.org/a.jpg", "javascript:alert(1)", "//example.org/a.jpg"])("rejects malformed or unsafe photo URL %s", (url) => {
    expect(() => validateResidentImageUrl(url)).toThrow();
  });
  it("preserves valid public photos, object keys, and clearing", () => {
    expect(validateResidentImageUrl(animal.image_url)).toBe(animal.image_url);
    expect(validateResidentImageUrl("animals/pino.jpg")).toBe("animals/pino.jpg");
    expect(validateResidentImageUrl(null)).toBeNull();
  });
});