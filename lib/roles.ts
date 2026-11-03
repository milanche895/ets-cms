export const roles = ["ADMIN", "EDITOR", "AUTHOR", "STUDENT", "UNION"] as const;

export type Role = (typeof roles)[number];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && roles.includes(value as Role);
}

/** У панел улазе администратор и председник синдиката. */
export function canAccessAdmin(role: Role): boolean {
  return role === "ADMIN" || role === "UNION";
}

/** Цео сајт: вести, корисници, мени и подешавања. */
export function canManageSite(role: Role): boolean {
  return role === "ADMIN";
}

/** Подаци, обавештења и активности синдиката. */
export function canManageUnion(role: Role): boolean {
  return role === "ADMIN" || role === "UNION";
}

export const roleLabels: Record<Role, string> = {
  ADMIN: "Администратор",
  EDITOR: "Уредник",
  AUTHOR: "Аутор",
  STUDENT: "Ученик",
  UNION: "Председник синдиката",
};
