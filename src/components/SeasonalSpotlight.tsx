import { useEffect, useState } from "react";
import { LocalLink } from "@/components/LocalLink";
import { pathFor } from "@/lib/routes-i18n";
import { useT, type Lang } from "@/lib/i18n";
import { seasonFor, type FarmSeason } from "@/lib/season";
import { campArt } from "@/lib/old-site-illustrations";

type Item = { kicker: string; title: string; body: string; cta: string; to: "camps" | "animals" | "support" | "events" };
const COPY: Record<FarmSeason, Record<Lang, Item>> = {
  lente: {
    nl: { kicker: "Lente op de boerderij", title: "Lammetjes, kuikens en de eerste zaaiingen", body: "De boerderij ontwaakt: jonge dieren in de stallen en de moestuin gaat de grond in. Kom kijken of help mee.", cta: "Ontmoet de dieren", to: "animals" },
    fr: { kicker: "Le printemps à la ferme", title: "Agneaux, poussins et premiers semis", body: "La ferme se réveille : des jeunes animaux dans les étables et le potager reprend vie. Venez voir ou aider.", cta: "Rencontrer les animaux", to: "animals" },
    en: { kicker: "Spring on the farm", title: "Lambs, chicks and the first sowing", body: "The farm wakes up: young animals in the stables and the vegetable garden comes alive. Come and see, or lend a hand.", cta: "Meet the animals", to: "animals" },
  },
  zomer: {
    nl: { kicker: "Zomer op de boerderij", title: "Vakantiestages vol buitenleven", body: "Een week lang dieren verzorgen, oogsten en spelen in het park. Plaatsen zijn beperkt.", cta: "Bekijk de stages", to: "camps" },
    fr: { kicker: "L'été à la ferme", title: "Des stages pleins de vie au grand air", body: "Une semaine pour soigner les animaux, récolter et jouer dans le parc. Places limitées.", cta: "Voir les stages", to: "camps" },
    en: { kicker: "Summer on the farm", title: "Holiday camps full of outdoor life", body: "A week of caring for animals, harvesting and playing in the park. Places are limited.", cta: "See the camps", to: "camps" },
  },
  herfst: {
    nl: { kicker: "Herfst op de boerderij", title: "Oogst, appels en de stallen klaar voor de winter", body: "Help mee met de oogst en ontdek wat er deze herfst op de kalender staat.", cta: "Naar de kalender", to: "events" },
    fr: { kicker: "L'automne à la ferme", title: "Récoltes, pommes et étables prêtes pour l'hiver", body: "Aidez aux récoltes et découvrez ce qui est au programme cet automne.", cta: "Voir l'agenda", to: "events" },
    en: { kicker: "Autumn on the farm", title: "Harvest, apples and stables ready for winter", body: "Help with the harvest and discover what's on the calendar this autumn.", cta: "See the calendar", to: "events" },
  },
  winter: {
    nl: { kicker: "Winter op de boerderij", title: "Warme stallen dankzij jouw steun", body: "In de koude maanden zijn hooi, voer en verzorging extra nodig. Een gift of peterschap maakt het verschil.", cta: "Steun de boerderij", to: "support" },
    fr: { kicker: "L'hiver à la ferme", title: "Des étables au chaud grâce à vous", body: "En hiver, foin, nourriture et soins sont d'autant plus nécessaires. Un don ou un parrainage fait la différence.", cta: "Soutenir la ferme", to: "support" },
    en: { kicker: "Winter on the farm", title: "Warm stables thanks to your support", body: "In the cold months, hay, feed and care matter even more. A gift or sponsorship makes the difference.", cta: "Support the farm", to: "support" },
  },
};

export function SeasonalSpotlight() {
  const { lang } = useT();
  // Seizoen pas na hydratatie bepalen, zodat server en browser hetzelfde tonen.
  const [season, setSeason] = useState<FarmSeason | null>(null);
  useEffect(() => setSeason(seasonFor(new Date())), []);
  if (!season) return <div className="mt-10 h-[280px]" aria-hidden />;
  const c = COPY[season][lang] ?? COPY[season].nl;

  return (
    <section className="mt-10 grid items-center gap-8 overflow-hidden rounded-3xl border border-border bg-card p-6 md:grid-cols-[1.2fr_1fr] md:p-10">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-terracotta)]">{c.kicker}</p>
        <h2 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">{c.title}</h2>
        <p className="mt-4 max-w-prose text-muted-foreground">{c.body}</p>
        <LocalLink
          to={pathFor(c.to, lang)}
          className="mt-6 inline-flex min-h-[48px] items-center rounded-full bg-primary px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
        >
          {c.cta}
        </LocalLink>
      </div>
      <img src={campArt(season, 0)} alt="" className="mx-auto max-h-64 w-full object-contain" loading="lazy" />
    </section>
  );
}
