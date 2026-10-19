import type { NavItem } from "@/types/content";

/**
 * Главни мени.
 * Ако база ради, мени се чита из CMS-а.
 * Овај списак је почетно стање и резерва кад база није покренута.
 */
export const mainNavigation: NavItem[] = [
  { label: "Почетна", href: "/" },
  { label: "Актуелно", href: "/vesti" },
  { label: "О школи", href: "/o-skoli" },
  { label: "Образовни профили", href: "/obrazovni-profili" },
  { label: "Пројекти", href: "/projekti" },
  { label: "Такмичења", href: "/takmicenja" },
  { label: "Галерија", href: "/galerija" },
  { label: "Контакт", href: "/kontakt" },
];
