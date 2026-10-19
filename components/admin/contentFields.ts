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
];
