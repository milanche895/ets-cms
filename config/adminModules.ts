import type { IconName } from "@/types/content";

export type AdminModuleSlug =
  | "articles"
  | "categories"
  | "media"
  | "users"
  | "menus"
  | "settings"
  | "sindikat"
  | "parlament"
  | "aktive";

export type AdminModule = {
  slug: AdminModuleSlug;
  href: string;
  title: string;
  description: string;
  icon: IconName;
  fields: string[];
};

export const adminModules: AdminModule[] = [
  {
    slug: "articles",
    href: "/admin/articles",
    title: "Вести",
    description: "Актуелности које се приказују на почетној страни.",
    icon: "articles",
    fields: ["id", "title", "slug", "excerpt", "content", "featuredImage", "categoryId", "status", "publishedAt", "createdAt", "updatedAt", "authorId", "seoTitle", "seoDescription"],
  },
  {
    slug: "categories",
    href: "/admin/categories",
    title: "Категорије",
    description: "Групе за вести, на пример роботика или програмирање.",
    icon: "categories",
    fields: ["id", "name", "slug", "description"],
  },
  {
    slug: "media",
    href: "/admin/galerija",
    title: "Галерија",
    description: "Фотографије и видео снимци на страници Галерија.",
    icon: "media",
    fields: ["id", "filename", "url", "alt", "mimeType", "size", "createdAt"],
  },
  {
    slug: "users",
    href: "/admin/users",
    title: "Корисници",
    description: "Налози за администратора, уреднике и задужене за синдикат, парламент и активе.",
    icon: "users",
    fields: ["id", "name", "email", "passwordHash", "role", "createdAt", "updatedAt"],
  },
  {
    slug: "menus",
    href: "/admin/menus",
    title: "Менији",
    description: "Ставке главног менија и редослед линкова.",
    icon: "menus",
    fields: ["id", "label", "href", "sortOrder", "enabled", "menuId", "parentId"],
  },
  {
    slug: "sindikat",
    href: "/admin/sindikat",
    title: "Синдикат",
    description: "Подаци о организацији, обавештења и активности синдиката.",
    icon: "union",
    fields: ["name", "logo", "about", "presidentName", "email", "phone", "office", "membership"],
  },
  {
    slug: "parlament",
    href: "/admin/parlament",
    title: "Ђачки парламент",
    description: "Подаци о парламенту, обавештења и активности ученика.",
    icon: "parliament",
    fields: ["name", "logo", "about", "presidentName", "email", "phone", "office", "membership"],
  },
  {
    slug: "aktive",
    href: "/admin/aktive",
    title: "Активе",
    description: "Подаци о стручним активима, обавештења и термини.",
    icon: "aktiv",
    fields: ["name", "logo", "about", "presidentName", "email", "phone", "office", "membership"],
  },
  {
    slug: "settings",
    href: "/admin/settings",
    title: "Подешавања",
    description: "Назив школе, адреса, телефон, е-пошта и линкови за подножје.",
    icon: "settings",
    fields: ["schoolName", "address", "phone", "email", "facebookUrl", "instagramUrl", "youtubeUrl", "seoTitle", "seoDescription"],
  },
];

export function getAdminModule(slug: AdminModuleSlug): AdminModule {
  const found = adminModules.find((item) => item.slug === slug);
  if (!found) {
    throw new Error(`Непознат модул: ${slug}`);
  }
  return found;
}
