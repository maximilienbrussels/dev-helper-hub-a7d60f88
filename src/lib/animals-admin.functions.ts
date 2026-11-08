/**
 * Beheer van de bewoners (dieren): naam, soort, verhaaltje en profielfoto.
 *
 * De browser schrijft nooit rechtstreeks naar de databank: elke actie loopt
 * hier langs een rechtencontrole (`manage_media`) en validatie.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAuth } from "@/lib/auth-middleware";
import { requirePermission } from "@/lib/portal-permissions";

export type AdminAnimal = {
  id: number;
  name: string;
  species: string;
  description: string | null;
  image_url: string | null;
  arrived_on: string | null;
};

async function readAll(): Promise<AdminAnimal[]> {
  const { db, hasDatabase } = await import("@/lib/neon.server");
  if (!hasDatabase()) return [];
  try {
    const { ensureAnimalColumns } = await import("@/lib/data.functions");
    await ensureAnimalColumns();
    const rows = (await db()`
      select id, name, species, description, image_url, arrived_on::text as arrived_on
        from animals
       order by name
    `) as unknown as AdminAnimal[];
    return rows.map((r) => ({ ...r, id: Number(r.id) }));
  } catch (error) {
    console.error("dieren lezen mislukt:", error);
    return [];
  }
}

/** Alle dieren voor het beheerportaal. */
export const listAnimalsAdmin = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .handler(async ({ context }): Promise<AdminAnimal[]> => {
    await requirePermission(context, "view_media");
    return readAll();
  });

const updateSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1, "Geef een naam op.").max(120),
  species: z.string().trim().min(1, "Geef een soort op.").max(120),
  description: z.string().trim().max(4000).default(""),
  arrivedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().default(null),
});

/** Naam, soort en verhaaltje van één dier aanpassen. */
export const updateAnimal = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((d: unknown) => updateSchema.parse(d))
  .handler(async ({ data, context }): Promise<AdminAnimal[]> => {
    await requirePermission(context, "manage_media");
    const { db } = await import("@/lib/neon.server");
    await db()`
      update animals
         set name = ${data.name}, species = ${data.species},
             description = ${data.description || null},
             arrived_on = ${data.arrivedOn}
       where id = ${data.id}
    `;
    return readAll();
  });

const imageSchema = z.object({
  id: z.number().int().positive(),
  imageUrl: z.string().trim().max(1000).nullable(),
});

/** Profielfoto van één dier instellen of wissen. */
export const setAnimalImage = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((d: unknown) => imageSchema.parse(d))
  .handler(async ({ data, context }): Promise<AdminAnimal[]> => {
    await requirePermission(context, "manage_media");
    const { db } = await import("@/lib/neon.server");
    const { normalizePublicImageUrl } = await import("@/lib/s3.server");
    const raw = data.imageUrl && data.imageUrl.length ? data.imageUrl : null;
    if (raw && !/^(https:\/\/|\/api\/public\/media\/)/.test(raw) && raw.includes("://")) {
      throw new Error("Deze foto-link is ongeldig. Kies een foto uit de mediabibliotheek.");
    }
    const url = normalizePublicImageUrl(raw);
    await db()`update animals set image_url = ${url} where id = ${data.id}`;
    return readAll();
  });
