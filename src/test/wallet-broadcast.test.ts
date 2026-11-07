import { describe, expect, it, vi } from "vitest";
vi.mock("@/lib/route-auth.server", () => ({ requireRouteAdmin: vi.fn(async () => ({ response: Response.json({ error: "unauthorized" }, { status: 401 }) })) }));
import { Route, broadcastSchema } from "@/routes/api/field/wallet/broadcast-message";
import { walletCopy } from "@/locales/wallet";

describe("Wallet broadcasts", () => {
  it("refuses non-administrators before contacting Google", async () => {
    const handlers = Route.options.server?.handlers;
    if (!handlers || typeof handlers === "function" || typeof handlers.POST !== "function") throw new Error("POST handler missing");
    const response = await handlers.POST({ request: new Request("http://localhost/api/field/wallet/broadcast-message", { method: "POST" }) } as Parameters<typeof handlers.POST>[0]);
    if (!(response instanceof Response)) throw new Error("Expected unauthorized response");
    expect(response.status).toBe(401);
  });
  it("bounds each broadcast and requires event object identifiers", () => {
    const input = { objectIds: ["3388000000023193763.event_demo"], messageId: "daily", header: walletCopy.welcome, body: walletCopy.welcomeBody };
    expect(broadcastSchema.safeParse(input).success).toBe(true);
    expect(broadcastSchema.safeParse({ ...input, objectIds: Array(21).fill(input.objectIds[0]) }).success).toBe(false);
    expect(broadcastSchema.safeParse({ ...input, objectIds: ["3388000000023193763.hooi_member"] }).success).toBe(false);
  });
});