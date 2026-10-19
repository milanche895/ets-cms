export const roles = ["ADMIN", "EDITOR", "AUTHOR", "STUDENT"] as const;

export type Role = (typeof roles)[number];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && roles.includes(value as Role);
}

/**
 * Фаза 1: у панел улази само ADMIN.
 * Кад дође ред на уреднике и ученике, права се додају овде.
 */
export function canAccessAdmin(role: Role): boolean {
  return role === "ADMIN";
}

export const roleLabels: Record<Role, string> = {
  ADMIN: "Администратор",
  EDITOR: "Уредник",
  AUTHOR: "Аутор",
  STUDENT: "Ученик",
};
