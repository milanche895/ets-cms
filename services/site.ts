import { siteSettings } from "@/data/site";
import { queryDatabase } from "@/lib/database";
import { emptyToNull, mapSettings } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import type { AboutFact, SiteSettings } from "@/types/content";

export type SettingsInput = Omit<SiteSettings, "aboutFacts"> & {
  aboutFacts: AboutFact[];
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const row = await queryDatabase(() => prisma.siteSettings.findUnique({ where: { id: "default" } }));
  if (row === "down" || !row) {
    return siteSettings;
  }
  return mapSettings(row, siteSettings.aboutFacts);
}

export async function updateSiteSettings(input: SettingsInput): Promise<SiteSettings> {
  const row = await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      ...input,
      phoneAlt: emptyToNull(input.phoneAlt),
      facebookUrl: emptyToNull(input.facebookUrl),
      instagramUrl: emptyToNull(input.instagramUrl),
      youtubeUrl: emptyToNull(input.youtubeUrl),
    },
    create: {
      id: "default",
      ...input,
      phoneAlt: emptyToNull(input.phoneAlt),
      facebookUrl: emptyToNull(input.facebookUrl),
      instagramUrl: emptyToNull(input.instagramUrl),
      youtubeUrl: emptyToNull(input.youtubeUrl),
    },
  });
  return mapSettings(row, siteSettings.aboutFacts);
}

export function parseFacts(value: string): AboutFact[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split("|");
      return { label: label.trim(), value: rest.join("|").trim() };
    })
    .filter((fact) => fact.label && fact.value);
}

export function formatFacts(facts: AboutFact[]): string {
  return facts.map((fact) => `${fact.label} | ${fact.value}`).join("\n");
}
