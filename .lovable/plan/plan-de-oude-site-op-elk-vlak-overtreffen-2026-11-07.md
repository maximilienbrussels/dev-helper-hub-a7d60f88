# Plan: de oude site op elk vlak overtreffen

Uitgangspunt: de oude site is enkel bron (feiten, beelden, documenten). Elke functie wordt herontworpen in onze huidige premium stijl, nooit 1-op-1 gekopieerd. Ons ontwerp blijft leidend.

## Fase 0 — Volledige bronoogst (eerst, grondig)
- Elke pagina, submenu, evenement, dierenfiche, PDF, boekje, plattegrond en foto van de oude site opnieuw doorlopen (ook pagina's buiten het menu, sitemap en downloadlinks).
- Inventaris per item: wat het is, waar het nu bij ons hoort, of wij het al hebben, en hoe we het beter maken.
- Alle beelden en documenten in de hoogste beschikbare kwaliteit overnemen in onze eigen opslag (niet naar de oude site linken). Witte achtergronden van tekeningen verwijderen waar nodig.
- PDF's niet als dode download overnemen: hun inhoud wordt een echte pagina (doorzoekbaar, vertaalbaar), met daarnaast een mooi opgemaakte, door ons gegenereerde PDF.

## Fase 1 — Levende homepage per seizoen
- Homepage past zich automatisch aan het seizoen aan (lente-geboortes, zomerstages, herfst, winter) met de oude seizoenstekeningen.
- "Vandaag op de boerderij": openingsuren, eerstvolgende activiteit, weer-tip.

## Fase 2 — Interactieve terreinkaart en dierengids
- Officiële plattegrond als klikbare kaart: elke zone en elk dier aanklikbaar, met foto, fiche en route.
- Per dier een volwaardige digitale fiche (vervangt de oude PDF-fiches), afdrukbaar voor scholen.
- Audiogids NL/FR/EN per dier, te starten via QR-bordjes op het terrein.

## Fase 3 — Verjaardagsstudio
- Uitnodiging direct op de site invullen met live voorbeeld, dan kiezen: afdrukken, opslaan als PDF, of betaald laten drukken (ophalen of leveren).
- Beschikbaarheid van verjaardagsdata live zichtbaar, dubbele boekingen onmogelijk.
- Alle info uit het oude verjaardagsboekje (programma, wat meebrengen, prijzen) als heldere pagina.

## Fase 4 — Verhuurstudio
- Galerij per zaal met de oude foto's, capaciteit, opstellingen en voorzieningen.
- Offertecalculator voor bedrijven en particulieren, met aanvraag die meteen bij het team terechtkomt.

## Fase 5 — Steunen en peterschap
- Giften: eenmalig en maandelijks, duidelijke impact per bedrag, fiscaal attest-info.
- Dierenpeterschap met genummerd, verifieerbaar certificaat en bijhorende Wallet-kaart.
- Transparantie: jaarverslagen en impactcijfers uit de oude site als visueel overzicht.

## Fase 6 — Scholen, stages, vrijwilligers en evenementen
- Educatieve pakketten en lesmateriaal (uit de oude documenten) per leeftijd, downloadbaar.
- Publieke evenementenkalender met inschrijving.
- Stages en vrijwilligerswerk: alle oude info, beter gestructureerd.

## Afwerking per fase
- Alles in alle talen van de site, ook op gsm, getest in de browser.
- Kleine tests voor regels (prijzen, limieten, beschikbaarheid).
- Takenlijst bijwerken na elke fase.

## Wat niet in deze plannen kan zonder jou
- Echte betalingen testen (maandelijkse giften, drukwerk): nood aan live betaaltest.
- Google Wallet en NFC: blijven wachten op een geldige Google-sleutel en goedkeuring.
- Leverprijs en drukpartner voor uitnodigingen: ik vul tijdelijke waarden in en vraag die daarna na.

## Technische details
- Media via de asset-opslag van het project (`.asset.json`), ingevoerd onder `src/assets/oud/`; mapping in `src/lib/old-site-illustrations.ts` uitbreiden.
- Bestaande componenten (kaart, uitnodigingseditor, giften) uitbreiden in plaats van dupliceren; routes blijven in `src/routes`, pagina-inhoud in `src/components/views`.
- Beschikbaarheid via de bestaande Neon-database met unieke beperking op tijdslot.
- Volgorde: Fase 0 volledig, daarna fases 1 tot 6 één voor één, elk afgerond en gecontroleerd voor de volgende start.
