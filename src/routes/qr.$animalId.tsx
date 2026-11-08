import { createFileRoute, notFound, redirect, Link } from "@tanstack/react-router";
import { animalSlug, pathFor } from "@/lib/routes-i18n";
import { queryOptions } from "@tanstack/react-query";
import { getAnimals } from "@/lib/data.functions";
import { useT } from "@/lib/i18n";

const animalsQO = queryOptions({ queryKey: ["animals"], queryFn: () => getAnimals() });

export const Route = createFileRoute("/qr/$animalId")({
  loader: async ({ params, context }) => {
    // Fail-safe: een databasefout tijdens SSR mag de pagina niet laten crashen.
    const animals = await context.queryClient.ensureQueryData(animalsQO).catch((err) => {
      console.error("SSR data loading warning (qr):", err);
      return [];
    });
    const animal = animals.find((a) => a.id === parseInt(params.animalId, 10));
    if (!animal) throw notFound();
    // QR-stickers leiden naar het volledige dierenpaspoort (zelfde foto, info en chat).
    throw redirect({ href: `${pathFor("animals", "nl", animalSlug(animal, "nl"))}?source=qr` });
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData ? `Ontmoet · Ferme Maximilien` : "Dier niet gevonden",
      },
    ],
  }),
  // De loader stuurt altijd door naar het dierenpaspoort.
  component: () => null,
  notFoundComponent: () => <QrNotFound />,
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <p className="text-sm text-destructive">{error instanceof Error ? error.message : String(error)}</p>
    </div>
  ),
});

function QrNotFound() {
  const { t } = useT();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-sm text-center border border-border p-6">
        <h1 className="text-lg font-semibold uppercase tracking-[0.2em]">{t("qr.unknownTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("qr.unknownBody")}</p>
        <Link
          to="/"
          className="mt-4 inline-flex min-h-[48px] items-center border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] hover:border-primary hover:text-primary"
        >
          {t("qr.backHub")}
        </Link>
      </div>
    </div>
  );
}
