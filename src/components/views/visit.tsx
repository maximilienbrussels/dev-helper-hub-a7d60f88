import { PagePhotoBand } from "@/components/PagePhotoBand";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { PHOTO_ALBUMS } from "@/lib/photo-albums";
import { mergedCarousel, useAlbumPhotos } from "@/lib/use-album-photos";

const KIDS_TITLE: Record<Lang, string> = {
  nl: "Kinderen, speeltuin & workshops",
  fr: "Enfants, plaine de jeux & ateliers",
  en: "Children, playground & workshops",
};
import { LocalLink } from "@/components/LocalLink";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { OpeningHoursBadge } from "@/components/OpeningHoursBadge";
import { NavHeader } from "@/components/NavHeader";
import { useT } from "@/lib/i18n";
import {
  getHours,
  getOrganisation,
  fallbackPublicHours,
} from "@/lib/data.functions";
import { pathFor, type Lang } from "@/lib/routes-i18n";

export const orgQO = queryOptions({ queryKey: ["org"], queryFn: () => getOrganisation() });
export const hoursQO = queryOptions({ queryKey: ["hours"], queryFn: () => getHours() });

const COPY: Record<
  Lang,
  {
    title: string;
    lede: string;
    hours: string;
    address: string;
    price: string;
    priceBody: string[];
    transport: string;
    transportBody: string[];
    access: string;
    accessBody: string[];
    animalsCta: string;
    contactCta: string;
    openNow: string;
    closedNow: string;
    photos: string;
  }
> = {
  nl: {
    title: "Bezoek & info",
    lede: "Alles wat je moet weten voor je langskomt: uren, toegang, prijzen en bereikbaarheid.",
    hours: "Openingsuren",
    address: "Adres",
    price: "Prijzen",
    priceBody: [
      "De boerderij is gratis toegankelijk tijdens de openingsuren.",
      "Voor begeleide bezoeken, workshops en schoolbezoeken gelden aparte tarieven — sociale tarieven zijn mogelijk.",
    ],
    transport: "Bereikbaarheid",
    transportBody: [
      "Metro Yser/IJzer (lijn 2 en 6) op 8 minuten wandelen.",
      "Tram 51 en bus 47, 88 stoppen aan het Maximiliaanpark.",
      "Fietsenstalling aan de ingang; parkeren in de buurt is beperkt.",
    ],
    access: "Toegankelijkheid",
    accessBody: [
      "De hoofdpaden zijn rolstoeltoegankelijk.",
      "Honden zijn niet toegelaten omwille van de dieren.",
      "Er is een toilet en een luiertafel aan het onthaal.",
    ],
    animalsCta: "Ontdek onze dieren",
    contactCta: "Een vraag? Contacteer ons",
    photos: "Sfeerbeelden van het erf",
    openNow: "Nu open",
    closedNow: "Nu gesloten",
  },
  fr: {
    title: "Visite & infos",
    lede: "Tout ce qu'il faut savoir avant de venir : horaires, accès, tarifs et transports.",
    hours: "Horaires d'ouverture",
    address: "Adresse",
    price: "Tarifs",
    priceBody: [
      "La ferme est accessible gratuitement pendant les heures d'ouverture.",
      "Les visites guidées, ateliers et visites scolaires ont des tarifs spécifiques — un tarif social est possible.",
    ],
    transport: "Accès",
    transportBody: [
      "Métro Yser (lignes 2 et 6) à 8 minutes à pied.",
      "Tram 51 et bus 47, 88 s'arrêtent au parc Maximilien.",
      "Parking vélos à l'entrée ; le stationnement voiture est limité.",
    ],
    access: "Accessibilité",
    accessBody: [
      "Les allées principales sont accessibles en fauteuil roulant.",
      "Les chiens ne sont pas admis, pour le bien-être des animaux.",
      "Toilettes et table à langer à l'accueil.",
    ],
    animalsCta: "Découvrez nos animaux",
    contactCta: "Une question ? Contactez-nous",
    photos: "Images de la ferme",
    openNow: "Ouvert maintenant",
    closedNow: "Fermé actuellement",
  },
  en: {
    title: "Visit & info",
    lede: "Everything you need before you come: hours, access, prices and transport.",
    hours: "Opening hours",
    address: "Address",
    price: "Prices",
    priceBody: [
      "The farm is free to visit during opening hours.",
      "Guided visits, workshops and school visits have separate rates — reduced rates are available.",
    ],
    transport: "Getting here",
    transportBody: [
      "Metro Yser (lines 2 and 6), an 8-minute walk.",
      "Tram 51 and buses 47, 88 stop at Maximilien Park.",
      "Bicycle parking at the entrance; car parking nearby is limited.",
    ],
    access: "Accessibility",
    accessBody: [
      "The main paths are wheelchair accessible.",
      "Dogs are not allowed, for the wellbeing of the animals.",
      "Toilets and a baby-changing table at reception.",
    ],
    animalsCta: "Meet our animals",
    contactCta: "A question? Contact us",
    photos: "Photos of the farmyard",
    openNow: "Open now",
    closedNow: "Currently closed",
  },
};


type GuideCopy = {
  codeTitle: string;
  codeLede: string;
  rules: { icon: string; title: string; body: string }[];
  planTitle: string;
  plan: string[];
  routeTitle: string;
  routeMaps: string;
  routeStib: string;
  routeVillo: string;
  groupsCta: string;
};

const GUIDE: Record<Lang, GuideCopy> = {
  nl: {
    codeTitle: "De boerderijcode",
    codeLede: "Zo blijven de dieren gezond en rustig, en geniet iedereen van het bezoek.",
    rules: [
      { icon: "🍞", title: "Niets voederen", body: "Geen brood, snoep of etensresten: daar worden de dieren ziek van. Onze verzorgers zorgen voor hun voeding." },
      { icon: "🤫", title: "Rustig en zacht", body: "Dieren schrikken van lawaai en plotse bewegingen. Benader ze langzaam en laat ze zelf naar je toe komen." },
      { icon: "🚪", title: "Poortjes dicht", body: "Sluit elk poortje achter je, zodat geen enkel dier ongemerkt de weide verlaat." },
      { icon: "🌿", title: "Op de paden", body: "Blijf op de paden en klim niet over hekken of omheiningen." },
      { icon: "🧼", title: "Handen wassen", body: "Was je handen na het aaien van de dieren en voor je iets eet." },
      { icon: "👀", title: "Kinderen onder toezicht", body: "Kinderen bezoeken de boerderij altijd onder toezicht van een volwassene." },
      { icon: "🐕", title: "Honden blijven thuis", body: "Ook aangelijnde honden zijn niet toegelaten, omwille van de rust van de dieren." },
    ],
    planTitle: "Plan je bezoek",
    plan: [
      "Stevige schoenen of laarzen: na regen kunnen de paden modderig zijn.",
      "Breng een herbruikbare drinkfles mee.",
      "Kom je met een klas of groep? Reserveer vooraf een begeleid bezoek.",
      "Scan de QR-code bij elke weide voor het verhaal en het geluid van het dier.",
    ],
    routeTitle: "Plan je route",
    routeMaps: "Route in Google Maps",
    routeStib: "Reisplanner MIVB",
    routeVillo: "Villo!-fietsen in de buurt",
    groupsCta: "Begeleid bezoek voor groepen",
  },
  fr: {
    codeTitle: "Le code de la ferme",
    codeLede: "Pour que les animaux restent en bonne santé et sereins, et que chacun profite de la visite.",
    rules: [
      { icon: "🍞", title: "Ne pas nourrir", body: "Pas de pain, de bonbons ni de restes : cela rend les animaux malades. Nos soigneurs s'occupent de leur alimentation." },
      { icon: "🤫", title: "Calme et douceur", body: "Les animaux ont peur du bruit et des gestes brusques. Approchez lentement et laissez-les venir à vous." },
      { icon: "🚪", title: "Barrières fermées", body: "Refermez chaque barrière derrière vous, pour qu'aucun animal ne quitte sa prairie." },
      { icon: "🌿", title: "Sur les chemins", body: "Restez sur les chemins et ne grimpez pas sur les clôtures." },
      { icon: "🧼", title: "Mains lavées", body: "Lavez-vous les mains après avoir caressé les animaux et avant de manger." },
      { icon: "👀", title: "Enfants accompagnés", body: "Les enfants visitent toujours la ferme sous la surveillance d'un adulte." },
      { icon: "🐕", title: "Pas de chiens", body: "Même tenus en laisse, les chiens ne sont pas admis, pour la tranquillité des animaux." },
    ],
    planTitle: "Préparer sa visite",
    plan: [
      "Chaussures solides ou bottes : après la pluie, les chemins peuvent être boueux.",
      "Apportez une gourde réutilisable.",
      "Vous venez avec une classe ou un groupe ? Réservez une visite guidée à l'avance.",
      "Scannez le QR code près de chaque prairie pour l'histoire et le cri de l'animal.",
    ],
    routeTitle: "Planifier son trajet",
    routeMaps: "Itinéraire Google Maps",
    routeStib: "Planificateur STIB",
    routeVillo: "Vélos Villo! à proximité",
    groupsCta: "Visite guidée pour groupes",
  },
  en: {
    codeTitle: "The farm code",
    codeLede: "So the animals stay healthy and calm, and everyone enjoys their visit.",
    rules: [
      { icon: "🍞", title: "No feeding", body: "No bread, sweets or leftovers: they make the animals ill. Our keepers take care of their food." },
      { icon: "🤫", title: "Calm and gentle", body: "Animals are startled by noise and sudden moves. Approach slowly and let them come to you." },
      { icon: "🚪", title: "Close the gates", body: "Close every gate behind you so no animal leaves its meadow unnoticed." },
      { icon: "🌿", title: "Stay on the paths", body: "Stay on the paths and don't climb fences or enclosures." },
      { icon: "🧼", title: "Wash your hands", body: "Wash your hands after stroking the animals and before eating." },
      { icon: "👀", title: "Children supervised", body: "Children always visit the farm under the supervision of an adult." },
      { icon: "🐕", title: "Dogs stay home", body: "Even on a lead, dogs are not allowed, for the animals' peace and quiet." },
    ],
    planTitle: "Plan your visit",
    plan: [
      "Sturdy shoes or boots: the paths can be muddy after rain.",
      "Bring a reusable water bottle.",
      "Coming with a class or group? Book a guided visit in advance.",
      "Scan the QR code at each meadow for the animal's story and sound.",
    ],
    routeTitle: "Plan your route",
    routeMaps: "Directions in Google Maps",
    routeStib: "STIB journey planner",
    routeVillo: "Villo! bikes nearby",
    groupsCta: "Guided visit for groups",
  },
};

const STIB_URL: Record<Lang, string> = {
  nl: "https://www.stib-mivb.be/index.htm?l=nl",
  fr: "https://www.stib-mivb.be/index.htm?l=fr",
  en: "https://www.stib-mivb.be/index.htm?l=en",
};

const DAYS: Record<Lang, string[]> = {
  nl: ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"],
  fr: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

export function VisitPage() {
  const { lang, tx } = useT();
  const source = COPY[lang];
  const c = {
    ...source,
    title: tx(source.title),
    lede: tx(source.lede),
    hours: tx(source.hours),
    address: tx(source.address),
    price: tx(source.price),
    priceBody: source.priceBody.map(tx),
    transport: tx(source.transport),
    transportBody: source.transportBody.map(tx),
    access: tx(source.access),
    accessBody: source.accessBody.map(tx),
    animalsCta: tx(source.animalsCta),
    contactCta: tx(source.contactCta),
    photos: tx(source.photos),
  };
  const g = GUIDE[lang];
  const { data: org } = useSuspenseQuery(orgQO);
  const { data: hours } = useSuspenseQuery(hoursQO);
  const managed = useAlbumPhotos();
  const rows = (hours ?? []).filter((h) => h.audience_type === "public");
  const schedule = rows.length > 0 ? rows : fallbackPublicHours();
  const addressLine = [org?.street, org?.house_number, org?.postal_code, org?.city].filter(Boolean).join(" ");
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    addressLine ? `Maximilien, ${addressLine}` : "Ferme du Parc Maximilien, Bruxelles",
  )}&travelmode=transit`;

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <PagePhotoBand photo="weide-stal" />
      <main className="mx-auto w-full max-w-3xl px-5 py-10">
        <h1 className="font-serif text-4xl text-foreground">{c.title}</h1>
        <p className="mt-3 text-muted-foreground">{c.lede}</p>

        <section className="mt-8 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif text-2xl text-foreground">{c.hours}</h2>
            <OpeningHoursBadge />
          </div>
          <ul className="mt-4 divide-y divide-border text-sm">
            {schedule.map((h) => (
              <li key={`${h.day_of_week}-${h.open_time}`} className="flex justify-between py-2">
                <span className="text-muted-foreground">{tx(DAYS[lang][h.day_of_week] ?? "")}</span>
                <span className="font-medium text-foreground">
                  {String(h.open_time).slice(0, 5)} – {String(h.close_time).slice(0, 5)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-serif text-2xl text-foreground">{c.address}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {org?.street} {org?.house_number}, {org?.postal_code} {org?.city}
          </p>
        </section>

        {[
          { title: c.price, body: c.priceBody },
          { title: c.transport, body: c.transportBody },
          { title: c.access, body: c.accessBody },
        ].map((block) => (
          <section key={block.title} className="mt-6 rounded-2xl border border-border bg-card p-5">
            <h2 className="font-serif text-2xl text-foreground">{block.title}</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {block.body.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        ))}

        <section className="mt-6 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-serif text-2xl text-foreground">{tx(g.routeTitle)}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { href: mapsUrl, label: g.routeMaps, icon: "🗺️" },
              { href: STIB_URL[lang], label: g.routeStib, icon: "🚇" },
              { href: "https://www.villo.be/", label: g.routeVillo, icon: "🚲" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <span aria-hidden>{l.icon}</span>
                {tx(l.label)}
              </a>
            ))}
          </div>
        </section>

        {/* Boerderijcode */}
        <section className="mt-10" aria-labelledby="farm-code">
          <h2 id="farm-code" className="font-serif text-3xl text-foreground">
            {tx(g.codeTitle)}
          </h2>
          <p className="mt-2 text-muted-foreground">{tx(g.codeLede)}</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {g.rules.map((r) => (
              <li key={r.title} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
                <span
                  aria-hidden
                  className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[color:var(--color-cream)] text-2xl"
                >
                  {r.icon}
                </span>
                <div>
                  <p className="font-semibold text-foreground">{tx(r.title)}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{tx(r.body)}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 rounded-2xl border-2 border-[color:var(--color-terracotta)] bg-card p-5">
          <h2 className="font-serif text-2xl text-foreground">{tx(g.planTitle)}</h2>
          <ul className="mt-3 space-y-2 text-sm text-foreground">
            {g.plan.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden className="text-[color:var(--color-terracotta)]">✓</span>
                <span>{tx(line)}</span>
              </li>
            ))}
          </ul>
          <LocalLink
            to={pathFor("education", lang)}
            className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
          >
            {tx(g.groupsCta)}
          </LocalLink>
        </section>

        <section className="mt-10">
          <PhotoCarousel
            title={tx(KIDS_TITLE[lang])}
            photos={mergedCarousel(
              [...PHOTO_ALBUMS.kinderen!, ...PHOTO_ALBUMS.speeltuin!, ...PHOTO_ALBUMS.educatie!],
              managed,
              ["kinderen", "speeltuin", "educatie"],
              lang,
            )}
            autoPlay
          />
        </section>

        <section className="mt-10">
          <PhotoCarousel
            title={c.photos}
            photos={mergedCarousel(
              [
                ...PHOTO_ALBUMS.moestuin!,
                ...PHOTO_ALBUMS.boomgaard!,
                ...PHOTO_ALBUMS.erf!,
                ...PHOTO_ALBUMS.vijver!,
                ...PHOTO_ALBUMS.paden!,
              ],
              managed,
              ["moestuin", "boomgaard", "erf", "vijver", "paden"],
              lang,
            )}
          />
        </section>


        <div className="mt-8 flex flex-wrap gap-3">
          <LocalLink
            to={pathFor("animals", lang)}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            {c.animalsCta}
          </LocalLink>
          <LocalLink
            to={pathFor("contact", lang)}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground"
          >
            {c.contactCta}
          </LocalLink>
        </div>
      </main>
    </div>
  );
}
