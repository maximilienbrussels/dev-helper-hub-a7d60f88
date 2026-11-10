/** Validate media URLs before storage normalization, preserving relative object keys. */
export function validateResidentImageUrl(raw: string | null): string | null {
  const value = raw?.trim() || null;
  if (!value) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(value) || value.includes("://")) {
    try {
      const url = new URL(value);
      if (url.protocol === "https:" && url.hostname && !url.username && !url.password && !/\s/.test(value)) return value;
    } catch { /* Invalid absolute URL. */ }
    throw new Error("Deze foto-link is ongeldig. Kies een foto uit de mediabibliotheek.");
  }
  if (value.startsWith("//")) throw new Error("Deze foto-link is ongeldig. Kies een foto uit de mediabibliotheek.");
  return value;
}