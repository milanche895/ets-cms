export const statusOptions = [
  { value: "DRAFT", label: "Нацрт" },
  { value: "PUBLISHED", label: "Објављено" },
  { value: "HIDDEN", label: "Сакривено" },
];

export const statusLabels: Record<string, string> = {
  DRAFT: "Нацрт",
  PUBLISHED: "Објављено",
  HIDDEN: "Сакривено",
};

export const roleOptions = [
  { value: "ADMIN", label: "Администратор" },
  { value: "EDITOR", label: "Уредник" },
  { value: "AUTHOR", label: "Аутор" },
  { value: "STUDENT", label: "Ученик" },
  { value: "UNION", label: "Председник синдиката" },
  { value: "PARLIAMENT", label: "Председник ђачког парламента" },
  { value: "AKTIV", label: "Координатор актива" },
];

export const unionPostKindOptions = [
  { value: "ANNOUNCEMENT", label: "Обавештење" },
  { value: "ACTIVITY", label: "Активност" },
];

export const unionPostKindLabels: Record<string, string> = {
  ANNOUNCEMENT: "Обавештење",
  ACTIVITY: "Активност",
};
