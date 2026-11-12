import { MLogo } from "@/components/MLogo";
import { SPONSOR_CERT_COPY } from "@/lib/sponsorship-cert-copy";

type L = "nl" | "fr" | "en";

const UI: Record<L, { title: string; lede: string; ribbon: string; cert: string; yourName: string; ribbonOf: (a: string) => string; pending: string; place: string }> = {
  nl: {
    title: "Live voorbeeld",
    lede: "Zo ziet je lintje op de boerderij en je certificaat eruit. Typ je naam en kijk mee.",
    ribbon: "Lintje op de boerderij",
    cert: "Persoonlijk certificaat (PDF)",
    yourName: "Jouw naam",
    ribbonOf: (a) => `Peter/Meter van ${a}`,
    pending: "toegekend na betaling",
    place: "Maximilien · Brussel",
  },
  fr: {
    title: "Aperçu en direct",
    lede: "Voici votre ruban à la ferme et votre certificat. Tapez votre nom et regardez.",
    ribbon: "Ruban à la ferme",
    cert: "Certificat personnel (PDF)",
    yourName: "Votre nom",
    ribbonOf: (a) => `Parrain/marraine de ${a}`,
    pending: "attribué après paiement",
    place: "Maximilien · Bruxelles",
  },
  en: {
    title: "Live preview",
    lede: "This is how your ribbon at the farm and your certificate will look. Type your name and watch.",
    ribbon: "Ribbon at the farm",
    cert: "Personal certificate (PDF)",
    yourName: "Your name",
    ribbonOf: (a) => `Sponsor of ${a}`,
    pending: "assigned after payment",
    place: "Maximilien · Brussels",
  },
};

const DATE_LOCALE: Record<L, string> = { nl: "nl-BE", fr: "fr-BE", en: "en-GB" };

/**
 * Live voorbeeld van het lintje en het certificaat terwijl de bezoeker typt.
 * De certificaatteksten komen uit dezelfde bron als de PDF.
 */
export function SponsorPreview({
  lang,
  tx,
  sponsorName,
  animalName,
  tierLabel,
}: {
  lang: L;
  tx: (s: string) => string;
  sponsorName: string;
  animalName: string;
  tierLabel: string | null;
}) {
  const ui = UI[lang];
  const t = SPONSOR_CERT_COPY[lang];
  const name = sponsorName.trim();
  const shown = name || tx(ui.yourName);
  const date = new Date().toLocaleDateString(DATE_LOCALE[lang], { day: "numeric", month: "long", year: "numeric" });

  return (
    <section aria-live="polite" className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-7">
      <h2 className="font-serif text-xl text-foreground">{tx(ui.title)}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{tx(ui.lede)}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center">
        {/* Lintje */}
        <figure className="flex flex-col items-center">
          <div className="relative w-full max-w-[320px] pt-6">
            {/* touwtje */}
            <span aria-hidden className="absolute left-1/2 top-0 h-7 w-px -translate-x-1/2 bg-[color:var(--color-cert-gold)]" />
            <span aria-hidden className="absolute left-1/2 top-0 size-2 -translate-x-1/2 rounded-full bg-[color:var(--color-cert-gold)]" />
            <div
              className="relative mx-auto bg-[color:var(--color-terracotta)] px-10 py-5 text-center text-[color:var(--color-on-terracotta)] shadow-md"
              style={{ clipPath: "polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%, 8% 50%)" }}
            >
              <span aria-hidden className="pointer-events-none absolute inset-x-[9%] inset-y-2 border-y border-dashed border-[color:var(--color-on-terracotta)]/50" />
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] opacity-90">{tx(ui.ribbonOf(animalName))}</p>
              <p
                className={`mt-1 break-words font-serif text-2xl leading-tight transition-opacity ${name ? "" : "italic opacity-70"}`}
              >
                {shown}
              </p>
            </div>
          </div>
          <figcaption className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {tx(ui.ribbon)}
          </figcaption>
        </figure>

        {/* Certificaat (A4 liggend, zelfde opbouw als de PDF) */}
        <figure>
          <div className="@container relative aspect-[297/210] w-full overflow-hidden rounded-lg bg-[color:var(--color-cream)] text-[color:var(--color-cert-ink)] shadow-md ring-1 ring-border">
            <div className="absolute inset-[2.7%] border-[0.4cqw] border-[color:var(--color-cert-gold)]" />
            <div className="absolute inset-[4%] border-[0.15cqw] border-[color:var(--color-cert-gold-soft)]" />
            <div className="absolute inset-[6%] flex flex-col items-center text-center">
              <MLogo className="h-[7cqw] w-auto" />
              <p className="mt-[1.2cqw] text-[1.9cqw] font-bold uppercase tracking-[0.18em] text-[color:var(--color-cert-gold)]">
                {tx(t.kicker)}
              </p>
              <p className="mt-[0.6cqw] font-serif text-[5cqw] font-bold italic leading-none">{tx(t.title)}</p>
              <p className="mt-[0.8cqw] text-[1.6cqw] text-[color:var(--color-cert-gold)]">{tx(ui.place)}</p>
              <p className="mt-[2.4cqw] text-[2cqw] italic">{tx(t.intro)}</p>
              <p className={`mt-[1cqw] max-w-[80%] truncate border-b border-[color:var(--color-cert-gold-soft)] px-[4cqw] pb-[0.6cqw] font-serif text-[4.2cqw] font-bold leading-tight ${name ? "" : "italic opacity-50"}`}>
                {shown}
              </p>
              <p className="mt-[1.8cqw] max-w-[70%] text-[1.9cqw] leading-snug">{tx(t.body(animalName))}</p>
              {tierLabel ? (
                <p className="mt-[1.2cqw] text-[1.7cqw]">
                  {tx(t.tier)}: {tierLabel}
                </p>
              ) : null}
              <div className="mt-auto flex w-full items-end justify-between text-[1.45cqw] text-[color:var(--color-cert-gold)]">
                <span>
                  {tx(t.date)}: {date}
                </span>
                <span className="italic">{tx(t.thanks)}</span>
                <span>
                  {tx(t.code)}: {tx(ui.pending)}
                </span>
              </div>
            </div>
          </div>
          <figcaption className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {tx(ui.cert)}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
