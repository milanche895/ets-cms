import { programs } from "@/data/programs";
import type { Program } from "@/types/content";

export async function getPrograms(): Promise<Program[]> {
  return programs;
}

export async function getProgramBySlug(slug: string): Promise<Program | null> {
  return programs.find((program) => program.slug === slug) ?? null;
}
