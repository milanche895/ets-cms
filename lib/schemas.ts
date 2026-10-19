import { z } from "zod";

const text = z.string().trim();

export const contentStatusSchema = z.enum(["DRAFT", "PUBLISHED", "HIDDEN"]);

export const articleSchema = z.object({
  title: text.min(1),
  slug: text.optional().default(""),
  excerpt: text.optional().default(""),
  content: text.optional().default(""),
  featuredImage: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  status: contentStatusSchema.optional().default("DRAFT"),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
});

export const pageSchema = z.object({
  title: text.min(1),
  slug: text.optional().default(""),
  content: text.optional().default(""),
  featuredImage: z.string().nullable().optional(),
  status: contentStatusSchema.optional().default("DRAFT"),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
});

export const categorySchema = z.object({
  name: text.min(1),
  slug: text.optional().default(""),
  description: text.optional().default(""),
});

export const userSchema = z.object({
  name: text.min(1),
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "EDITOR", "AUTHOR", "STUDENT"]),
});

export const userDeleteSchema = z.object({
  id: z.string().min(1),
});

export const settingsSchema = z.object({
  schoolName: text.min(1),
  shortName: text.min(1),
  nameLine1: text.min(1),
  nameLine2: text.min(1),
  location: text.min(1),
  tagline: text,
  aboutTeaser: text,
  aboutFacts: text,
  address: text,
  city: text,
  postalCode: text,
  phone: text,
  phoneAlt: z.string().optional().default(""),
  email: z.email(),
  facebookUrl: z.string().optional().default(""),
  instagramUrl: z.string().optional().default(""),
  youtubeUrl: z.string().optional().default(""),
  seoTitle: text,
  seoDescription: text,
});

export const menuSchema = z.object({
  text: text,
});
