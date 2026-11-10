import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  memberId: z.string().min(3).max(64),
  memberName: z.string().min(1).max(120).default("Lid"),
  hooiBalance: z.number().int().min(0).max(1_000_000).default(0),
  tier: z.string().min(1).max(60).optional(),
  locale: z.enum(["nl", "fr", "en"]).default("nl"),
});

export const Route = createFileRoute("/api/wallet/google/pass")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let input: z.infer<typeof schema>;
        try {
          input = schema.parse(await request.json());
        } catch {
          return Response.json({ error: "invalid_input" }, { status: 400 });
        }

        // Enkel het ingelogde lid mag een pas met zijn eigen klantnummer maken.
        const header = request.headers.get("authorization") ?? "";
        const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
        if (!token) return Response.json({ error: "unauthorized" }, { status: 401 });
        try {
          const { verifyAuthToken } = await import("@/lib/neon-data.server");
          const claims = await verifyAuthToken(token);
          if (String(claims.sub) !== input.memberId) {
            return Response.json({ error: "forbidden" }, { status: 403 });
          }
        } catch {
          return Response.json({ error: "unauthorized" }, { status: 401 });
        }

        const { readWalletCredentials, createMemberSaveUrl, WalletKeyError } = await import(
          "@/lib/google-wallet.server"
        );

        try {
        const creds = readWalletCredentials();
        if (!creds) {
          return Response.json(
            {
              error: "wallet_not_configured",
              message:
                "Google Wallet secrets niet geconfigureerd (GOOGLE_WALLET_ISSUER_ID / GOOGLE_WALLET_CLIENT_EMAIL / GOOGLE_WALLET_KEY).",
            },
            { status: 503 },
          );
        }

          const saveUrl = await createMemberSaveUrl(input, creds);
          return Response.json({ success: true, saveUrl }, { headers: { "Cache-Control": "no-store" } });
        } catch (err) {
          if (err instanceof WalletKeyError) {
            console.error("[Wallet Error] Invalid cryptographic key structure");
            return Response.json({ error: "wallet_not_configured", message: "Google Wallet is tijdelijk niet beschikbaar. De sleutelconfiguratie moet worden gecontroleerd." }, { status: 503, headers: { "Cache-Control": "no-store" } });
          }
          console.error("[Wallet Error] Pass generation failed");
          return Response.json(
            { error: "signing_failed", message: "Kon de pas niet ondertekenen." },
            { status: 500 },
          );
        }
      },
    },
  },
});
