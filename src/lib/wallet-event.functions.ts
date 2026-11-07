import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { translationsSchema } from "@/lib/wallet-localization";

const eventSchema = z.object({
  ticketId: z.string().regex(/^[a-zA-Z0-9_-]{3,64}$/),
  participantName: z.string().trim().min(1).max(120),
  eventTranslations: translationsSchema,
  eventDate: z.string().trim().min(1).max(80),
  locale: z.enum(["nl", "fr", "en"]).default("nl"),
  verifyUrl: z.string().url().refine((value) => new URL(value).protocol === "https:"),
});
/** Trusted staff issuance only; never sign client-supplied booking claims on a public function. */
export const issueEventWalletPass = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => eventSchema.parse(input))
  .handler(async ({ data }) => {
    const { getRequest } = await import("@tanstack/react-start/server");
    const { requireRouteAdmin } = await import("@/lib/route-auth.server");
    const authorization = await requireRouteAdmin(getRequest());
    if ("response" in authorization) return { url: null, error: "unauthorized" };
    const { readWalletCredentials } = await import("@/lib/google-wallet.server");
    const credentials = readWalletCredentials();
    if (!credentials) return { url: null, error: "wallet_not_configured" };
    const { createEventSaveUrl } = await import("@/lib/wallet-event.server");
    return { url: await createEventSaveUrl({ ...data, eventTitle: data.eventTranslations[data.locale], passType: "ticket" }, credentials), error: null };
  });