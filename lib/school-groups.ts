import type { IconName, UnionProfile } from "@/types/content";
import type { Role } from "@/lib/roles";

export const schoolGroupIds = ["parliament", "aktiv"] as const;

export type SchoolGroupId = (typeof schoolGroupIds)[number];

export type SchoolGroupConfig = {
  id: SchoolGroupId;
  key: "PARLIAMENT" | "AKTIV";
  role: Role;
  publicPath: string;
  adminPath: string;
  title: string;
  description: string;
  icon: IconName;
  presidentLabel: string;
  affiliationLabel: string;
  membershipTitle: string;
  benefitsTitle: string;
  organizationSubtitle: string;
  announcementsSubtitle: string;
  activitiesSubtitle: string;
};

export const schoolGroups: Record<SchoolGroupId, SchoolGroupConfig> = {
  parliament: {
    id: "parliament",
    key: "PARLIAMENT",
    role: "PARLIAMENT",
    publicPath: "/parlament",
    adminPath: "/admin/parlament",
    title: "Ђачки парламент",
    description: "Подаци о парламенту, обавештења и активности ученика.",
    icon: "parliament",
    presidentLabel: "Председник",
    affiliationLabel: "Задужени наставник",
    membershipTitle: "Како се укључити",
    benefitsTitle: "Шта парламент ради",
    organizationSubtitle: "Контакт и начин на који ученици учествују у парламенту.",
    announcementsSubtitle: "Поруке председника парламента за ученике.",
    activitiesSubtitle: "Састанци, акције и други термини парламента.",
  },
  aktiv: {
    id: "aktiv",
    key: "AKTIV",
    role: "AKTIV",
    publicPath: "/aktive",
    adminPath: "/admin/aktive",
    title: "Активе",
    description: "Подаци о стручним активима, обавештења и термини.",
    icon: "aktiv",
    presidentLabel: "Координатор",
    affiliationLabel: "Веза са школом",
    membershipTitle: "Ко чини актив",
    benefitsTitle: "Чиме се активи баве",
    organizationSubtitle: "Контакт и начин на који наставници раде у активима.",
    announcementsSubtitle: "Поруке координатора актива за наставнике.",
    activitiesSubtitle: "Састанци и други термини стручних актива.",
  },
};

export function isSchoolGroupId(value: string): value is SchoolGroupId {
  return schoolGroupIds.includes(value as SchoolGroupId);
}

export function schoolGroupByRole(role: Role): SchoolGroupConfig | null {
  return Object.values(schoolGroups).find((group) => group.role === role) ?? null;
}

export type SchoolGroupProfile = UnionProfile & { key: SchoolGroupConfig["key"] };
