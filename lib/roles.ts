export const roles = ["ADMIN", "EDITOR", "AUTHOR", "STUDENT", "UNION", "PARLIAMENT", "AKTIV"] as const;

export type Role = (typeof roles)[number];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && roles.includes(value as Role);
}

/** У панел улазе администратор и задужени за синдикат, парламент и активе. */
export function canAccessAdmin(role: Role): boolean {
  return role === "ADMIN" || role === "UNION" || role === "PARLIAMENT" || role === "AKTIV";
}

/** Цео сајт: вести, корисници, мени и подешавања. */
export function canManageSite(role: Role): boolean {
  return role === "ADMIN";
}

/** Подаци, обавештења и активности синдиката. */
export function canManageUnion(role: Role): boolean {
  return role === "ADMIN" || role === "UNION";
}

/** Почетна страна у панелу. Задужени виде само свој модул. */
export function adminHome(role: Role): string {
  if (role === "UNION") {
    return "/admin/sindikat";
  }
  if (role === "PARLIAMENT") {
    return "/admin/parlament";
  }
  if (role === "AKTIV") {
    return "/admin/aktive";
  }
  return "/admin";
}

export const roleLabels: Record<Role, string> = {
  ADMIN: "Администратор",
  EDITOR: "Уредник",
  AUTHOR: "Аутор",
  STUDENT: "Ученик",
  UNION: "Председник синдиката",
  PARLIAMENT: "Председник ђачког парламента",
  AKTIV: "Координатор актива",
};
