import { activities } from "@/data/activities";
import type { Activity } from "@/types/content";

export async function getActivities(): Promise<Activity[]> {
  return activities;
}
