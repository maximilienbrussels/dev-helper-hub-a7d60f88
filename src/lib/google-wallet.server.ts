/**
 * Google Wallet pass generatie — server-only.
 * RS256 JWT-ondertekening via Web Crypto (werkt in de Cloudflare Worker runtime).
 */

import memberLogo from "@/assets/wallet-member-logo.asset.json";
import memberHero from "@/assets/wallet-member-hero.asset.json";

export type WalletPassType = "ticket" | "pickup" | "certificate";
export type WalletLocale = "nl" | "fr" | "en";

export const WALLET_CONFIG = {
  issuerId: "3388000000023193763",
  backgroundColor: "#1D3528",
  logoUri: memberLogo.url,
  location: { latitude: 50.85885, longitude: 4.350356 },
  locationName: "Maximilien",
  homepage: "https://maximilien.brussels",
  origins: ["https://maximilien.brussels", "https://maximilien.site"],
  verifyBase: "https://maximilien.brussels/verify",
} as const;

const LABELS: Record<
  WalletLocale,
  { account: string; ticket: string; event: string; date: string; site: string }
> = {
  nl: {
    account: "Deelnemer",
    ticket: "Ticketnummer",
    event: "Evenement",
    date: "Datum / Date",
    site: "Website",
  },
  fr: {
    account: "Participant",
    ticket: "Numéro de ticket",
    event: "Événement",
    date: "Datum / Date",
    site: "Site web",
  },
  en: {
    account: "Participant",
    ticket: "Ticket Number",
    event: "Event",
    date: "Datum / Date",
    site: "Website",
  },
};

export type WalletPassInput = {
  ticketId: string;
  participantName: string;
  eventTitle: string;
  eventDate: string;
  passType: WalletPassType;
  locale: WalletLocale;
  /** Optioneel: eigen verificatie-URL voor de QR-code. */
  verifyUrl?: string;
};

export type WalletCredentials = {
  issuerId: string;
  clientEmail: string;
  privateKey: string;
};

/** Leest de service-account gegevens uit de omgeving. Alleen binnen een handler aanroepen. */
export function readWalletCredentials(): WalletCredentials | null {
  const issuerId = process.env["GOOGLE_WALLET_ISSUER_ID"] || WALLET_CONFIG.issuerId;
  const clientEmail = (
    process.env["GOOGLE_WALLET_CLIENT_EMAIL"] ||
    process.env["GOOGLE_SERVICE_ACCOUNT_EMAIL"] ||
    ""
  ).trim();
  const privateKey = sanitizePrivateKey(
    process.env["GOOGLE_WALLET_KEY"] || process.env["GOOGLE_WALLET_PRIVATE_KEY"],
  );

  if (!clientEmail || !privateKey) return null;
  return { issuerId, clientEmail, privateKey };
}

export class WalletKeyError extends Error {
  constructor(message = "Invalid cryptographic key structure") {
    super(message);
    this.name = "WalletKeyError";
  }
}

/**
 * Herstelt een private key die door de omgeving is platgeslagen: letterlijke "\\n",
 * Windows-regeleindes, omringende aanhalingstekens of een geplakte service-account-JSON.
 */
export function sanitizePrivateKey(raw: string | undefined): string {
  if (!raw) return "";
  let key = raw.trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1).trim();
  }
  if (key.startsWith("{")) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(key);
    } catch {
      throw new WalletKeyError();
    }
    if (!parsed || typeof parsed !== "object" || !("private_key" in parsed) || typeof parsed.private_key !== "string" || !parsed.private_key.trim()) throw new WalletKeyError();
    key = parsed.private_key;
  }
  key = key.replace(/\\r/g, "").replace(/\\n/g, "\n").replace(/\r\n?/g, "\n");
  return key.trim();
}

function sanitizeId(ticketId: string) {
  return ticketId.toLowerCase().replace(/[^a-z0-9_-]/g, "_");
}


function base64Url(bytes: Uint8Array | string) {
  const raw =
    typeof bytes === "string"
      ? bytes
      : Array.from(bytes, (b) => String.fromCharCode(b)).join("");
  return btoa(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function pemToArrayBuffer(pem: string) {
  if (!/-----BEGIN PRIVATE KEY-----/.test(pem) || !/-----END PRIVATE KEY-----/.test(pem)) {
    throw new WalletKeyError("Invalid cryptographic key structure: missing PKCS#8 PEM markers");
  }
  const body = pem
    .replace(/-----BEGIN [^-]+-----/g, "")
    .replace(/-----END [^-]+-----/g, "")
    .replace(/\s+/g, "");
  let binary: string;
  try {
    binary = atob(body);
  } catch {
    throw new WalletKeyError("Invalid cryptographic key structure: key body is not valid base64");
  }
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

/** Ondertekent een JWT-payload met RS256. */
export async function signRs256(payload: Record<string, unknown>, privateKeyPem: string) {
  try {
    const key = await crypto.subtle.importKey(
      "pkcs8",
      pemToArrayBuffer(sanitizePrivateKey(privateKeyPem)),
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"],
    );
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const body = base64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signingInput = `${header}.${body}`;
  const signature = new Uint8Array(
    await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      key,
      new TextEncoder().encode(signingInput),
    ),
  );
  return `${signingInput}.${base64Url(signature)}`;
  } catch {
    console.error("[Wallet Error] Invalid cryptographic key structure");
    throw new WalletKeyError();
  }
}

/** Bouwt de "save to wallet" URL voor tickets: altijd een EventTicket onder maximilien_event_v1. */
export async function createSaveUrl(input: WalletPassInput, creds: WalletCredentials) {
  const { createEventSaveUrl } = await import("@/lib/wallet-event.server");
  return createEventSaveUrl(input, creds);
}

/**
 * Compatibiliteitslaag voor de oudere `wallet.functions.ts` serverfunctie.
 * Geeft `null` terug wanneer de Google Wallet-secrets ontbreken.
 */
export async function generateGoogleWalletPassUrl(input: {
  id: string;
  type: "pickup_ticket" | "booking" | "certificate";
  title: { nl: string; fr: string; en: string };
  subtitle?: { nl: string; fr: string; en: string };
  recipientName?: string;
  eventDate?: string;
  verificationUrl: string;
  lang: WalletLocale;
}): Promise<string | null> {
  const creds = readWalletCredentials();
  if (!creds) return null;

  const passType: WalletPassType =
    input.type === "certificate" ? "certificate" : input.type === "pickup_ticket" ? "pickup" : "ticket";

  return createSaveUrl(
    {
      ticketId: input.id,
      participantName: input.recipientName ?? input.subtitle?.[input.lang] ?? "",
      eventTitle: input.title[input.lang],
      eventDate: input.eventDate ?? "",
      passType,
      locale: input.lang,
      verifyUrl: input.verificationUrl,
    },
    creds,
  );
}

/* ------------------------------------------------------------------ */
/* Mijn Hooi — digitale ledenpas                                       */
/* ------------------------------------------------------------------ */

export const MEMBER_CLASS_SUFFIX = "maximilien_loyalty_v1";
export const MEMBER_BACKGROUND = "#793E32";
const ASSET_ORIGIN = "https://maximilien.brussels";
const memberImage = (url: string, locale: WalletLocale) => ({
  sourceUri: { uri: new URL(url, ASSET_ORIGIN).href },
  contentDescription: { defaultValue: { language: locale, value: "Maximilien" } },
});
export type SmartTapConfig = { redemptionIssuers: string[]; redemptionValue: string };

const MEMBER_LABELS: Record<
  WalletLocale,
  { title: string; member: string; number: string; balance: string; tier: string; site: string }
> = {
  nl: {
    title: "Mijn Hooi - Digital Pass",
    member: "Lid",
    number: "Lidnummer",
    balance: "Hoefjes",
    tier: "Status",
    site: "Website",
  },
  fr: {
    title: "Mijn Hooi - Digital Pass",
    member: "Membre",
    number: "Numéro de membre",
    balance: "Hoefjes",
    tier: "Statut",
    site: "Site web",
  },
  en: {
    title: "Mijn Hooi - Digital Pass",
    member: "Member",
    number: "Member number",
    balance: "Hoefjes",
    tier: "Status",
    site: "Website",
  },
};

const MEMBER_TIER_DEFAULT: Record<WalletLocale, string> = {
  nl: "Boerderijvriend",
  fr: "Ami de la ferme",
  en: "Farm friend",
};

export type WalletMemberInput = {
  memberId: string;
  memberName: string;
  hooiBalance: number;
  tier?: string;
  locale: WalletLocale;
};

/** Bouwt het generic-pass object voor de Mijn Hooi ledenkaart. */
export function buildMemberPassObject(input: WalletMemberInput, issuerId: string, smartTap?: SmartTapConfig) {
  const l = MEMBER_LABELS[input.locale] ?? MEMBER_LABELS.nl;

  return {
    id: `${issuerId}.hooi_${sanitizeId(input.memberId)}`,
    classId: `${issuerId}.${MEMBER_CLASS_SUFFIX}`,
    state: "ACTIVE",
    accountName: input.memberName,
    accountId: input.memberId,
    loyaltyPoints: { label: l.balance, balance: { int: input.hooiBalance } },
    ...(smartTap?.redemptionIssuers.length && smartTap.redemptionValue
      ? { smartTapRedemptionValue: smartTap.redemptionValue } : {}),
    barcode: {
      type: "QR_CODE",
      value: `fermemaximilien:customer:${input.memberId}`,
      alternateText: input.memberId,
    },
    textModulesData: [
      { id: "balance", header: l.balance, body: String(input.hooiBalance) },
      { id: "tier", header: l.tier, body: input.tier || MEMBER_TIER_DEFAULT[input.locale] },
    ],
    linksModuleData: {
      uris: [{ uri: WALLET_CONFIG.homepage, description: l.site, id: "website" }],
    },
    locations: [
      { latitude: WALLET_CONFIG.location.latitude, longitude: WALLET_CONFIG.location.longitude },
    ],
    heroImage: memberImage(memberHero.url, input.locale),
    // Getoond in de pas; Google kan deze ook als melding tonen wanneer je in de buurt bent.
    messages: [
      {
        id: "nearby",
        header: NEARBY[input.locale].header,
        body: NEARBY[input.locale].body,
        messageType: "TEXT_AND_NOTIFY",
      },
    ],
  };
}

const NEARBY: Record<WalletLocale, { header: string; body: string }> = {
  nl: {
    header: "Welkom op de boerderij 🐐",
    body: "Toon deze pas aan de kassa of bij een activiteit om Hoefjes te verzamelen.",
  },
  fr: {
    header: "Bienvenue à la ferme 🐐",
    body: "Montrez ce pass à la caisse ou lors d'une activité pour collecter des Hoefjes.",
  },
  en: {
    header: "Welcome to the farm 🐐",
    body: "Show this pass at the desk or during an activity to collect Hoefjes.",
  },
};

/** Optionele brede foto bovenaan de pas (absolute https-URL via GOOGLE_WALLET_HERO_URL). */
function heroImage(locale: WalletLocale) {
  const uri = process.env["GOOGLE_WALLET_HERO_URL"];
  if (!uri || !uri.startsWith("https://")) return null;
  return {
    heroImage: {
      sourceUri: { uri },
      contentDescription: { defaultValue: { language: locale, value: WALLET_CONFIG.locationName } },
    },
  };
}

/**
 * Klasse met een verzorgde lay-out: saldo en status naast elkaar op de kaart,
 * gedetailleerde info onderaan. Google maakt de klasse aan bij de eerste save.
 */
export function buildMemberClass(issuerId: string, locale: WalletLocale, smartTap?: SmartTapConfig) {
  const labels = MEMBER_LABELS[locale];
  const ref = (id: string) => ({
    firstValue: { fields: [{ fieldPath: `object.textModulesData['${id}']` }] },
  });
  return {
    id: `${issuerId}.${MEMBER_CLASS_SUFFIX}`,
    issuerName: "Maximilien",
    programName: "Mijn Hooi",
    programLogo: memberImage(memberLogo.url, locale),
    heroImage: memberImage(memberHero.url, locale),
    hexBackgroundColor: MEMBER_BACKGROUND,
    accountNameLabel: labels.member,
    accountIdLabel: labels.number,
    reviewStatus: "UNDER_REVIEW",
    enableSmartTap: Boolean(smartTap?.redemptionIssuers.length && smartTap.redemptionValue),
    ...(smartTap?.redemptionIssuers.length && smartTap.redemptionValue
      ? { redemptionIssuers: smartTap.redemptionIssuers } : {}),
    multipleDevicesAndHoldersAllowedStatus: "ONE_USER_ALL_DEVICES",
    classTemplateInfo: {
      cardTemplateOverride: {
        cardRowTemplateInfos: [
          { twoItems: { startItem: ref("balance"), endItem: ref("tier") } },
        ],
      },
    },
    linksModuleData: {
      uris: [{ uri: WALLET_CONFIG.homepage, description: "Maximilien", id: "home" }],
    },
  };
}

/** Bouwt de "save to wallet" URL voor de Mijn Hooi ledenkaart. */
export async function createMemberSaveUrl(
  input: WalletMemberInput,
  creds: WalletCredentials,
) {
  const claims = {
    iss: creds.clientEmail,
    aud: "google",
    typ: "savetowallet",
    iat: Math.floor(Date.now() / 1000),
    payload: {
      // The existing Loyalty class is managed in Google's issuer console.
      // Issuing an object must never resubmit or reset its approval status.
      loyaltyObjects: [buildMemberPassObject(input, creds.issuerId)],
    },
  };

  const token = await signRs256(claims, creds.privateKey);
  return `https://pay.google.com/gp/v/save/${token}`;
}
