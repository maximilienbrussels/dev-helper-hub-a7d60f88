import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { translationsSchema, walletMessage } from "@/lib/wallet-localization";

export const broadcastSchema = z.object({
  objectIds: z.array(z.string().regex(/^\d+\.event_[a-z0-9_-]+$/)).min(1).max(20),
  messageId: z.string().regex(/^[a-zA-Z0-9_-]{1,64}$/),
  header: translationsSchema,
  body: translationsSchema,
  notify: z.boolean().default(false),
}).strict();

export const Route = createFileRoute("/api/field/wallet/broadcast-message")({
  server: { handlers: { POST: async ({ request }) => {
    const { requireRouteAdmin } = await import("@/lib/route-auth.server");
    const authorization = await requireRouteAdmin(request);
    if ("response" in authorization) return authorization.response;
    let input: z.infer<typeof broadcastSchema>;
    try { input = broadcastSchema.parse(await request.json()); }
    catch { return Response.json({ error: "invalid_input" }, { status: 400 }); }
    try {
      const { googleWalletClient } = await import("@/lib/wallet-google-api.server");
      const client = await googleWalletClient();
      const { EVENT_CLASS_SUFFIX } = await import("@/lib/wallet-event.server");
      const results: { objectId: string; delivered: boolean; error?: string }[] = [];
      const ids = [...new Set(input.objectIds)];
      // Bounded concurrency, not unbounded fan-out. Each ID must be an active ticket in our issuer/class.
      for (let offset = 0; offset < ids.length; offset += 4) {
        const batch = await Promise.all(ids.slice(offset, offset + 4).map(async (objectId) => {
          try {
            if (!objectId.startsWith(`${client.issuerId}.event_`)) throw new Error("wrong_issuer");
            const path = `eventTicketObject/${encodeURIComponent(objectId)}`;
            const pass = await client.request(path);
            if (pass.state !== "ACTIVE" || pass.classId !== `${client.issuerId}.${EVENT_CLASS_SUFFIX}`) throw new Error("ineligible_pass");
            const messages = Array.isArray(pass.messages) ? pass.messages : [];
            if (messages.some((m: unknown) => typeof m === "object" && m && "id" in m && m.id === input.messageId)) return { objectId, delivered: true };
            await client.request(`${path}/addMessage`, "POST", { message: walletMessage(input.messageId, input.header, input.body, input.notify) });
            return { objectId, delivered: true };
          } catch (error) { return { objectId, delivered: false, error: error instanceof Error ? error.message : "delivery_failed" }; }
        }));
        results.push(...batch);
      }
      return Response.json({ results, notificationRequested: input.notify }, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
      console.error("Wallet broadcast unavailable", error instanceof Error ? error.message : "unknown");
      return Response.json({ error: "wallet_unavailable" }, { status: 503 });
    }
  } } },
});