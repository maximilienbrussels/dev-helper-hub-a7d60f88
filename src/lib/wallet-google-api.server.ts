import { readWalletCredentials, signRs256 } from "@/lib/google-wallet.server";

export async function googleWalletClient() {
  const credentials = readWalletCredentials();
  if (!credentials) throw new Error("Google Wallet is niet geconfigureerd.");
  const now = Math.floor(Date.now() / 1000);
  const assertion = await signRs256({
    iss: credentials.clientEmail, scope: "https://www.googleapis.com/auth/wallet_object.issuer",
    aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600,
  }, credentials.privateKey);
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
    signal: AbortSignal.timeout(15000),
  });
  const token: unknown = await response.json();
  if (!response.ok || typeof token !== "object" || !token || !("access_token" in token) || typeof token.access_token !== "string") {
    console.error("Google Wallet OAuth rejected", response.status);
    throw new Error("Google weigert de Wallet-toegang. Controleer het gekoppelde serviceaccount.");
  }
  const accessToken = token.access_token;
  return {
    issuerId: credentials.issuerId,
    async request(path: string, method = "GET", body?: unknown): Promise<Record<string, unknown>> {
      const result = await fetch(`https://walletobjects.googleapis.com/walletobjects/v1/${path}`, {
        method, headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(15000),
      });
      if (!result.ok) {
        console.error("Google Wallet request rejected", result.status);
        throw new Error(`Google Wallet heeft de aanvraag geweigerd (${result.status}).`);
      }
      return await result.json() as Record<string, unknown>;
    },
  };
}