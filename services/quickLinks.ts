import { quickLinks } from "@/data/quickLinks";
import type { QuickLink } from "@/types/content";

export async function getQuickLinks(): Promise<QuickLink[]> {
  return quickLinks;
}
