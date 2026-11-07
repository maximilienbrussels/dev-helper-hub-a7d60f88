export type FarmSeason = "winter" | "lente" | "zomer" | "herfst";

/** Meteorologische seizoenen (België): lente mrt–mei, zomer jun–aug, herfst sep–nov, winter dec–feb. */
export function seasonFor(date: Date): FarmSeason {
  const m = date.getMonth();
  if (m >= 2 && m <= 4) return "lente";
  if (m >= 5 && m <= 7) return "zomer";
  if (m >= 8 && m <= 10) return "herfst";
  return "winter";
}
