import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

import { MLogo } from "@/components/MLogo";
import type { Lang } from "@/lib/routes-i18n";
import type { PassportCopy, SpeciesKey } from "@/lib/animal-passport";

/**
 * Printbare A4-lesfiche (portret) per dier, voor scholen en groepen.
 * Wordt enkel getoond bij printen via printSheet() (#worksheet-print-area).
 * Stijl staat in styles.css onder `.fact-sheet` zodat de fiche in elk thema
 * (ook donker) als een licht, inktzuinig blad wordt afgedrukt.
 */
const COPY = {
  nl: {
    kicker: "Lesfiche · De Boerderij van het Maximiliaanpark",
    idCard: "Identiteitskaart",
    species: "Diersoort",
    latin: "Wetenschappelijke naam",
    zone: "Waar op de boerderij?",
    since: "Bij ons sinds",
    character: "Karakter",
    food: "Wat mag ik eten?",
    facts: "Wist je dat…?",
    tasks: "Kijkopdrachten op de boerderij",
    legs: (n: string) => `Hoeveel poten tel je bij ${n}?`,
    colors: (n: string) => `Welke kleuren zie je aan ${n}?`,
    doing: (n: string) => `Wat doet ${n} op dit moment?`,
    doingOptions: ["eten", "slapen", "wandelen", "spelen", "iets anders"],
    sound: (n: string) => `Welk geluid maakt ${n}? Schrijf het op.`,
    draw: (n: string) => `Teken ${n} in dit kader`,
    learned: "Wat heb ik vandaag geleerd?",
    pupil: "Naam",
    date: "Datum",
    teacher:
      "Voor begeleiders: scan de QR-code voor het volledige dierenpaspoort, het geluid en de audiogids in het Nederlands, Frans en Engels.",
    footer: "Maximilien · Stadsboerderij Brussel · maximilien.brussels",
  },
  fr: {
    kicker: "Fiche pédagogique · La Ferme du parc Maximilien",
    idCard: "Carte d'identité",
    species: "Espèce",
    latin: "Nom scientifique",
    zone: "Où à la ferme ?",
    since: "Chez nous depuis",
    character: "Caractère",
    food: "Qu'ai-je le droit de manger ?",
    facts: "Le savais-tu… ?",
    tasks: "Missions d'observation à la ferme",
    legs: (n: string) => `Combien de pattes comptes-tu chez ${n} ?`,
    colors: (n: string) => `Quelles couleurs vois-tu sur ${n} ?`,
    doing: (n: string) => `Que fait ${n} en ce moment ?`,
    doingOptions: ["il mange", "il dort", "il marche", "il joue", "autre chose"],
    sound: (n: string) => `Quel bruit fait ${n} ? Écris-le.`,
    draw: (n: string) => `Dessine ${n} dans ce cadre`,
    learned: "Qu'ai-je appris aujourd'hui ?",
    pupil: "Nom",
    date: "Date",
    teacher:
      "Pour les accompagnants : scannez le QR code pour le passeport complet, le cri et l'audioguide en français, néerlandais et anglais.",
    footer: "Maximilien · Ferme urbaine de Bruxelles · maximilien.brussels",
  },
  en: {
    kicker: "Fact sheet · Maximilien Park City Farm",
    idCard: "ID card",
    species: "Species",
    latin: "Scientific name",
    zone: "Where on the farm?",
    since: "With us since",
    character: "Character",
    food: "What may I eat?",
    facts: "Did you know…?",
    tasks: "Things to spot on the farm",
    legs: (n: string) => `How many legs does ${n} have?`,
    colors: (n: string) => `Which colours can you see on ${n}?`,
    doing: (n: string) => `What is ${n} doing right now?`,
    doingOptions: ["eating", "sleeping", "walking", "playing", "something else"],
    sound: (n: string) => `What sound does ${n} make? Write it down.`,
    draw: (n: string) => `Draw ${n} in this frame`,
    learned: "What did I learn today?",
    pupil: "Name",
    date: "Date",
    teacher:
      "For teachers and group leaders: scan the QR code for the full animal passport, the sound and the audio guide in English, Dutch and French.",
    footer: "Maximilien · Brussels City Farm · maximilien.brussels",
  },
} as const;

export type FactSheetCopy = (typeof COPY)[Lang];

export function factSheetCopy(lang: Lang, tx: (s: string) => string = (s) => s) {
  const c = COPY[lang];
  return {
    ...c,
    kicker: tx(c.kicker),
    idCard: tx(c.idCard),
    species: tx(c.species),
    latin: tx(c.latin),
    zone: tx(c.zone),
    since: tx(c.since),
    character: tx(c.character),
    food: tx(c.food),
    facts: tx(c.facts),
    tasks: tx(c.tasks),
    doingOptions: c.doingOptions.map(tx),
    learned: tx(c.learned),
    pupil: tx(c.pupil),
    date: tx(c.date),
    teacher: tx(c.teacher),
    footer: tx(c.footer),
  };
}

export function AnimalFactSheet({
  lang,
  tx,
  name,
  speciesLabel,
  speciesKey,
  passport,
  zoneLabel,
  since,
  photo,
  diet,
}: {
  lang: Lang;
  tx: (s: string) => string;
  name: string;
  speciesLabel: string;
  speciesKey: SpeciesKey;
  passport: PassportCopy;
  zoneLabel: string | null;
  since: string | null;
  photo: string | undefined;
  diet: string;
}) {
  const c = factSheetCopy(lang, tx);
  // Paginalink voor de QR enkel in de browser bepalen (geen hydration-verschil).
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    setUrl(`${window.location.origin}${window.location.pathname}`);
  }, []);
  const isBird = speciesKey === "peacock";

  return (
    <div id="worksheet-print-area" aria-hidden="true">
      <article className="fact-sheet">
        <header className="fs-head">
          <MLogo className="fs-logo" variant="brand" />
          <div>
            <p className="fs-kicker">{c.kicker}</p>
            <h1 className="fs-title">{name}</h1>
            <p className="fs-sub">
              {speciesLabel}
              {passport.latin && passport.latin !== "—" ? <em> · {passport.latin}</em> : null}
            </p>
          </div>
          <div className="fs-pupil">
            <span>{c.pupil}: ____________________</span>
            <span>{c.date}: ____ / ____ / ________</span>
          </div>
        </header>

        <section className="fs-intro">
          {photo ? <img src={photo} alt="" className="fs-photo" /> : <div className="fs-photo" />}
          <div className="fs-id">
            <h2>{c.idCard}</h2>
            <dl>
              <dt>{c.species}</dt>
              <dd>{passport.breed}</dd>
              {passport.latin && passport.latin !== "—" ? (
                <>
                  <dt>{c.latin}</dt>
                  <dd>
                    <em>{passport.latin}</em>
                  </dd>
                </>
              ) : null}
              {zoneLabel ? (
                <>
                  <dt>{c.zone}</dt>
                  <dd>{zoneLabel}</dd>
                </>
              ) : null}
              {since ? (
                <>
                  <dt>{c.since}</dt>
                  <dd>{since}</dd>
                </>
              ) : null}
              <dt>{c.character}</dt>
              <dd>{passport.character}</dd>
            </dl>
          </div>
        </section>

        <section className="fs-food">
          <h2>🚨 {c.food}</h2>
          <p>{diet}</p>
        </section>

        <section className="fs-facts">
          <h2>{c.facts}</h2>
          <ol>
            {passport.facts.map((f) => (
              <li key={f.q}>
                <strong>{f.q}</strong> {f.a}
              </li>
            ))}
          </ol>
        </section>

        <section className="fs-tasks">
          <h2>{c.tasks}</h2>
          <div className="fs-grid">
            <div className="fs-col">
              <p className="fs-q">1. {c.legs(name)}</p>
              <p className="fs-legs">
                {(isBird ? [2, 4, 6] : [2, 4, 6]).map((n) => (
                  <span key={n}>☐ {n}</span>
                ))}
              </p>
              <p className="fs-q">2. {c.colors(name)}</p>
              <p className="fs-line" />
              <p className="fs-q">3. {c.doing(name)}</p>
              <p className="fs-options">
                {c.doingOptions.map((o) => (
                  <span key={o}>☐ {o}</span>
                ))}
              </p>
              <p className="fs-q">4. {c.sound(name)}</p>
              <p className="fs-line" />
            </div>
            <div className="fs-draw">
              <span>5. {c.draw(name)}</span>
            </div>
          </div>
          <p className="fs-q">6. {c.learned}</p>
          <p className="fs-line" />
          <p className="fs-line" />
        </section>

        <footer className="fs-foot">
          <p>{c.teacher}</p>
          {url ? <QRCodeSVG value={url} size={72} level="M" marginSize={1} /> : null}
        </footer>
        <p className="fs-brand">{c.footer}</p>
      </article>
    </div>
  );
}
