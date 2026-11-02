export type ContentStatus = "DRAFT" | "PUBLISHED" | "HIDDEN";

export type IconName =
  | "news"
  | "profiles"
  | "projects"
  | "trophy"
  | "computer"
  | "network"
  | "bolt"
  | "code"
  | "robot"
  | "groups"
  | "dashboard"
  | "articles"
  | "categories"
  | "media"
  | "users"
  | "menus"
  | "settings";

export type Page = {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage: string | null;
  status: ContentStatus;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  categoryId: string;
  categoryName: string;
  status: ContentStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type Media = {
  id: string;
  filename: string;
  url: string;
  publicId?: string | null;
  alt: string;
  mimeType: string;
  size: number;
  createdAt: string;
  uploadedBy: string;
};

export type AboutFact = {
  label: string;
  value: string;
};

export type SiteSettings = {
  schoolName: string;
  shortName: string;
  nameLine1: string;
  nameLine2: string;
  location: string;
  tagline: string;
  aboutTeaser: string;
  aboutFacts: AboutFact[];
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  phoneAlt: string | null;
  email: string;
  facebookUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  seoTitle: string;
  seoDescription: string;
};

export type NavItem = {
  label: string;
  href: string;
};

export type QuickLink = {
  title: string;
  description: string;
  href: string;
  icon: IconName;
};

export type Program = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  duration: string;
  level: string;
  icon: IconName;
  body: string;
  highlights: string[];
  image: string;
  imageAlt: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  highlights: string[];
  image: string;
  imageAlt: string;
};

export type Activity = {
  id: string;
  title: string;
  summary: string;
  icon: IconName;
};

export type SearchEntry = {
  id: string;
  title: string;
  group: string;
  href: string;
};
