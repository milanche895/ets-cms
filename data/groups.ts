import type { SchoolGroupProfile } from "@/lib/school-groups";

export const parliamentProfile: SchoolGroupProfile = {
  key: "PARLIAMENT",
  name: "Ђачки парламент ЕТШ „Михајло Пупин“",
  logo: null,
  summary: "Обавештења, акције и информације ђачког парламента.",
  about:
    "Ђачки парламент окупља ученике Електротехничке школе „Михајло Пупин“. Ученици кроз парламент учествују у животу школе, предлажу активности и преносе обавештења одељењима.\n\nОбавештења и термине објављује председник парламента.",
  presidentName: "",
  email: "",
  phone: "",
  office: "",
  officeHours: "",
  membership: "Ученици се укључују преко одељењских заједница и председника парламента.",
  benefits: "Парламент преноси предлоге ученика, организује акције и обавештава школу о ученичким активностима.",
  affiliation: "",
  facebookUrl: null,
  seoTitle: "Ђачки парламент",
  seoDescription: "Ђачки парламент Електротехничке школе „Михајло Пупин“: обавештења, активности и информације за ученике.",
};

export const aktivProfile: SchoolGroupProfile = {
  key: "AKTIV",
  name: "Активе ЕТШ „Михајло Пупин“",
  logo: null,
  summary: "Обавештења и активности стручних актива школе.",
  about:
    "Стручни активи окупљају наставнике истих или сродних предмета. Договорају наставу, такмичења и ваннаставни рад и обавештавају колеге о терминима.\n\nОбавештења и термине објављује координатор актива.",
  presidentName: "",
  email: "",
  phone: "",
  office: "",
  officeHours: "",
  membership: "Наставник је члан актива предмета који предаје.",
  benefits: "Активи усаглашавају наставу, припремају такмичења и деле обавештења са наставницима.",
  affiliation: "",
  facebookUrl: null,
  seoTitle: "Активе",
  seoDescription: "Стручни активи Електротехничке школе „Михајло Пупин“: обавештења и активности наставника.",
};

export const schoolGroupProfiles: Record<SchoolGroupProfile["key"], SchoolGroupProfile> = {
  PARLIAMENT: parliamentProfile,
  AKTIV: aktivProfile,
};
