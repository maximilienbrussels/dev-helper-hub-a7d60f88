import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/field/wallet/event-class-localization")({
  server: { handlers: { POST: async ({ request }) => {
    const { requireRouteAdmin } = await import("@/lib/route-auth.server");
    const authorization = await requireRouteAdmin(request);
    if ("response" in authorization) return authorization.response;
    try {
      const { googleWalletClient } = await import("@/lib/wallet-google-api.server");
      const { eventClassLocalization, EVENT_CLASS_SUFFIX } = await import("@/lib/wallet-event.server");
      const client = await googleWalletClient();
      await client.request(`eventTicketClass/${client.issuerId}.${EVENT_CLASS_SUFFIX}`, "PATCH", eventClassLocalization());
      return Response.json({ updated: true }, { headers: { "Cache-Control": "no-store" } });
    } catch { return Response.json({ error: "wallet_unavailable" }, { status: 503 }); }
  } } },
});