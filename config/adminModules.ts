import type { IconName } from "@/types/content";

export type AdminModuleSlug =
  | "pages"
  | "articles"
  | "categories"
  | "media"
  | "users"
  | "menus"
  | "settings";

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
    slug: "pages",
    href: "/admin/pages",
    title: "Странице",
    description: "Сталне странице сајта: наслов, садржај, статус и SEO.",
    icon: "pages",
    fields: ["id", "title", "slug", "content", "featuredImage", "status", "seoTitle", "seoDescription", "createdAt", "updatedAt", "createdBy"],
  },
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
    href: "/admin/media",
    title: "Медији",
    description: "Слике и документи који се касније везују за вести и странице.",
    icon: "media",
    fields: ["id", "filename", "url", "alt", "mimeType", "size", "createdAt", "uploadedBy"],
  },
  {
    slug: "users",
    href: "/admin/users",
    title: "Корисници",
    description: "Налози за администратора, уредника, аутора и касније ученика.",
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
