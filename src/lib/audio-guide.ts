/** Ingesproken audiogids per dierenzone (NL/FR/EN), vooraf opgenomen en zelf gehost. */
const files = import.meta.glob("@/assets/audiogids/*.mp3.asset.json", { eager: true, import: "default" }) as Record<string, { url: string }>;

const BY_KEY: Record<string, string> = {};
for (const [path, asset] of Object.entries(files)) {
  const m = path.match(/([^/]+)-(nl|fr|en)\.mp3\.asset\.json$/);
  if (m) BY_KEY[`${m[1]}:${m[2]}`] = asset.url;
}

/** Talen zonder eigen opname vallen terug op Nederlands. */
export function audioGuideUrl(slug: string, lang: string): string | null {
  const l = lang === "fr" || lang === "en" ? lang : "nl";
  return BY_KEY[`${slug}:${l}`] ?? null;
}
