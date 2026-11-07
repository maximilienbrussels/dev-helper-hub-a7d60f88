/**
 * Getekende illustraties, sfeerfoto's en netwerklogo's van de vorige site
 * (lafermeduparcmaximilien.be), zelf gehost. Witte achtergronden zijn verwijderd
 * zodat de tekeningen op elke achtergrondkleur passen.
 */
import stageWinter1 from "@/assets/oud/illustraties/stage-winter-1.webp.asset.json";
import stageLente1 from "@/assets/oud/illustraties/stage-lente-1.webp.asset.json";
import stageLente2 from "@/assets/oud/illustraties/stage-lente-2.webp.asset.json";
import stageZomer1 from "@/assets/oud/illustraties/stage-zomer-1.webp.asset.json";
import stageZomer2 from "@/assets/oud/illustraties/stage-zomer-2.webp.asset.json";
import stageHerfst1 from "@/assets/oud/illustraties/stage-herfst-1.webp.asset.json";
import stageHerfst2 from "@/assets/oud/illustraties/stage-herfst-2.webp.asset.json";
import illuVerjaardag from "@/assets/oud/illustraties/illu-verjaardag.webp.asset.json";
import illuSleutel from "@/assets/oud/illustraties/illu-verhuur-sleutel.webp.asset.json";
import illuGiften from "@/assets/oud/illustraties/illu-giften-handen.webp.asset.json";
import illuDieren from "@/assets/oud/illustraties/illu-dieren.webp.asset.json";
import fotoPrivatisatie from "@/assets/oud/fotos/foto-privatisatie-koer.webp.asset.json";
import fotoGiften from "@/assets/oud/fotos/foto-giften-kikkervisjes.webp.asset.json";
import fotoGeitTorens from "@/assets/oud/fotos/foto-geit-torens.webp.asset.json";
import fotoEzels from "@/assets/oud/fotos/foto-ezels-stal.webp.asset.json";
import fotoAnimatie from "@/assets/oud/fotos/foto-animatie-kinderen.webp.asset.json";
import fotoZaalKoer from "@/assets/oud/fotos/foto-zaal-koer-picknick.webp.asset.json";
import fotoVerjaardag from "@/assets/oud/fotos/foto-verjaardag.webp.asset.json";
import fotoStage from "@/assets/oud/fotos/foto-stage-kinderen.webp.asset.json";
import fotoTeambuilding from "@/assets/oud/fotos/foto-teambuilding.webp.asset.json";
import fotoImkerij from "@/assets/oud/fotos/foto-imkerij.webp.asset.json";
import fotoBedrijven from "@/assets/oud/fotos/foto-bedrijven-boerderij.webp.asset.json";
import fotoScholen from "@/assets/oud/fotos/foto-scholen-boerderij.webp.asset.json";
import logoBrussel from "@/assets/oud/logos/logo-brussel.webp.asset.json";
import logoFao from "@/assets/oud/logos/logo-fao.png.asset.json";
import logoFedeau from "@/assets/oud/logos/logo-fedeau.webp.asset.json";
import logoFederatie from "@/assets/oud/logos/logo-federatie-kinderboerderijen.jpg.asset.json";
import logoNatagora from "@/assets/oud/logos/logo-natagora-reseau-nature.jpg.asset.json";
import type { Lang } from "@/lib/i18n";

export type CampSeason = "winter" | "lente" | "zomer" | "herfst";

/** Per seizoen één of twee getekende taferelen; kaarten wisselen ze af. */
export const CAMP_SEASON_ART: Record<CampSeason, string[]> = {
  winter: [stageWinter1.url],
  lente: [stageLente1.url, stageLente2.url],
  zomer: [stageZomer1.url, stageZomer2.url],
  herfst: [stageHerfst1.url, stageHerfst2.url],
};

export function campArt(season: CampSeason, index: number): string {
  const list = CAMP_SEASON_ART[season];
  return list[index % list.length]!;
}

export const ILLUSTRATIONS = {
  verjaardag: illuVerjaardag.url,
  verhuurSleutel: illuSleutel.url,
  giftenHanden: illuGiften.url,
  dierenRij: illuDieren.url,
} as const;

export const OLD_PHOTOS = {
  privatisatieKoer: fotoPrivatisatie.url,
  giftenKikkervisjes: fotoGiften.url,
  geitTorens: fotoGeitTorens.url,
  ezelsStal: fotoEzels.url,
  animatieKinderen: fotoAnimatie.url,
  zaalKoerPicknick: fotoZaalKoer.url,
  verjaardag: fotoVerjaardag.url,
  stageKinderen: fotoStage.url,
  teambuilding: fotoTeambuilding.url,
  imkerij: fotoImkerij.url,
  bedrijven: fotoBedrijven.url,
  scholen: fotoScholen.url,
} as const;

export type NetworkLogo = { id: string; src: string; name: Record<Lang, string>; href: string };

/** Netwerken en erkenningen die op de vroegere "À propos"-pagina stonden. */
export const NETWORK_LOGOS: NetworkLogo[] = [
  { id: "brussel", src: logoBrussel.url, href: "https://environnement.brussels", name: { nl: "Leefmilieu Brussel", fr: "Bruxelles Environnement", en: "Brussels Environment" } },
  { id: "federatie", src: logoFederatie.url, href: "https://www.fermesdanimation.be", name: { nl: "Federatie van kinderboerderijen", fr: "Fédération des fermes d'animation", en: "Federation of educational farms" } },
  { id: "natagora", src: logoNatagora.url, href: "https://www.natagora.be/reseau-nature", name: { nl: "Natagora · Réseau Nature", fr: "Natagora · Réseau Nature", en: "Natagora · Réseau Nature" } },
  { id: "fedeau", src: logoFedeau.url, href: "https://www.agricultureurbaine.brussels", name: { nl: "Federatie stadslandbouw", fr: "Fédération de l'agriculture urbaine", en: "Urban agriculture federation" } },
  { id: "fao", src: logoFao.url, href: "https://www.fao.org", name: { nl: "FAO", fr: "FAO", en: "FAO" } },
];
