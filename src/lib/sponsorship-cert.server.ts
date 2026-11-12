/**
 * A4-certificaat "Peter/Meterschap" (Worker-safe, jsPDF zonder DOM/canvas).
 */
export type SponsorCertData = {
  sponsorName: string;
  animalName: string;
  tierLabel: string;
  certificateId: string;
  date: Date;
  lang: "nl" | "fr" | "en";
};

import { SPONSOR_CERT_COPY as COPY } from "@/lib/sponsorship-cert-copy";

export async function buildSponsorshipCertificatePdf(data: SponsorCertData): Promise<Uint8Array> {
  const { jsPDF } = await import("jspdf");
  const t = COPY[data.lang] ?? COPY.nl;
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  // Achtergrond + dubbele rand.
  doc.setFillColor(253, 251, 247);
  doc.rect(0, 0, W, H, "F");
  doc.setDrawColor(122, 111, 74);
  doc.setLineWidth(1.1);
  doc.rect(8, 8, W - 16, H - 16);
  doc.setDrawColor(168, 152, 95);
  doc.setLineWidth(0.4);
  doc.rect(12, 12, W - 24, H - 24);

  const center = W / 2;
  let y = 34;

  doc.setTextColor(122, 111, 74);
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text(t.kicker, center, y, { align: "center" });

  y += 12;
  doc.setTextColor(59, 59, 47);
  doc.setFont("helvetica", "bolditalic").setFontSize(30);
  doc.text(t.title, center, y, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.setTextColor(122, 111, 74);
  y += 8;
  doc.text("Maximilien · Bruxelles", center, y, { align: "center" });

  y += 16;
  doc.setFont("helvetica", "italic").setFontSize(12);
  doc.setTextColor(59, 59, 47);
  doc.text(t.intro, center, y, { align: "center" });

  y += 12;
  doc.setFont("helvetica", "bold").setFontSize(24);
  doc.text(data.sponsorName, center, y, { align: "center" });
  doc.setDrawColor(168, 152, 95);
  doc.line(center - 60, y + 3, center + 60, y + 3);

  y += 14;
  doc.setFont("helvetica", "normal").setFontSize(13);
  const bodyLines = doc.splitTextToSize(t.body(data.animalName), 180) as string[];
  doc.text(bodyLines, center, y, { align: "center" });
  y += bodyLines.length * 7 + 6;

  doc.setFontSize(11);
  doc.text(`${t.tier}: ${data.tierLabel}`, center, y, { align: "center" });

  y = H - 30;
  doc.setFontSize(9);
  doc.setTextColor(122, 111, 74);
  const dateStr = data.date.toLocaleDateString(
    data.lang === "fr" ? "fr-BE" : data.lang === "en" ? "en-GB" : "nl-BE",
    { day: "numeric", month: "long", year: "numeric" },
  );
  doc.text(`${t.date}: ${dateStr}`, 24, y);
  doc.text(`${t.code}: ${data.certificateId}`, W - 24, y, { align: "right" });

  y = H - 20;
  doc.setFont("helvetica", "italic").setFontSize(10);
  doc.text(t.thanks, center, y, { align: "center" });

  const buffer = doc.output("arraybuffer") as ArrayBuffer;
  return new Uint8Array(buffer);
}
