import { PrismaClient, type Prisma } from "@prisma/client";
import { hash } from "bcryptjs";
import { articles } from "../data/articles";
import { categories } from "../data/categories";
import { schoolMedia } from "../data/schoolMedia";
import { mainNavigation } from "../data/navigation";
import { pages } from "../data/pages";
import { siteSettings } from "../data/site";
import { unionProfile } from "../data/union";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Администратор";

  if (!email || !password) {
    throw new Error("У .env фајлу недостају ADMIN_EMAIL и ADMIN_PASSWORD.");
  }

  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD мора имати најмање 8 знакова.");
  }

  const passwordHash = await hash(password, 12);
  const admin = await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash, role: "ADMIN" },
    create: { name, email, passwordHash, role: "ADMIN" },
  });

  const categoryIds = new Map<string, string>();

  for (const category of categories) {
    const existing = await prisma.category.findUnique({ where: { slug: category.slug } });
    const saved = existing
      ? existing
      : await prisma.category.create({
          data: {
            name: category.name,
            slug: category.slug,
            description: category.description,
          },
        });
    categoryIds.set(category.slug, saved.id);
  }

  for (const article of articles) {
    const existing = await prisma.article.findUnique({ where: { slug: article.slug } });
    if (existing) {
      continue;
    }

    await prisma.article.create({
      data: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        featuredImage: article.featuredImage,
        categoryId: categoryIds.get(article.categoryId),
        status: article.status,
        publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
        authorId: admin.id,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
      },
    });
  }

  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  if (!settings) {
    await prisma.siteSettings.create({
      data: {
        id: "default",
        schoolName: siteSettings.schoolName,
        shortName: siteSettings.shortName,
        nameLine1: siteSettings.nameLine1,
        nameLine2: siteSettings.nameLine2,
        location: siteSettings.location,
        tagline: siteSettings.tagline,
        aboutTeaser: siteSettings.aboutTeaser,
        aboutFacts: siteSettings.aboutFacts as Prisma.InputJsonValue,
        address: siteSettings.address,
        city: siteSettings.city,
        postalCode: siteSettings.postalCode,
        phone: siteSettings.phone,
        phoneAlt: siteSettings.phoneAlt,
        email: siteSettings.email,
        facebookUrl: siteSettings.facebookUrl,
        instagramUrl: siteSettings.instagramUrl,
        youtubeUrl: siteSettings.youtubeUrl,
        seoTitle: siteSettings.seoTitle,
        seoDescription: siteSettings.seoDescription,
      },
    });
  }

  for (const page of pages) {
    const existing = await prisma.page.findUnique({ where: { slug: page.slug } });
    if (existing) {
      continue;
    }
    await prisma.page.create({
      data: {
        title: page.title,
        slug: page.slug,
        content: page.content,
        featuredImage: page.featuredImage,
        status: page.status,
        seoTitle: page.seoTitle,
        seoDescription: page.seoDescription,
        createdById: admin.id,
      },
    });
  }

  const menu = await prisma.menu.upsert({
    where: { slug: "glavni" },
    update: { name: "Главни мени" },
    create: { name: "Главни мени", slug: "glavni" },
  });
  const menuItems = await prisma.menuItem.findMany({ where: { menuId: menu.id }, orderBy: { sortOrder: "asc" } });
  if (menuItems.length === 0) {
    await prisma.menuItem.createMany({
      data: mainNavigation.map((item, index) => ({
        label: item.label,
        href: item.href,
        sortOrder: index,
        menuId: menu.id,
      })),
    });
  } else {
    for (const item of mainNavigation) {
      const match = menuItems.find((row) => row.label === item.label);
      if (match && match.href !== item.href) {
        await prisma.menuItem.update({ where: { id: match.id }, data: { href: item.href } });
      }
    }

    await prisma.menuItem.deleteMany({
      where: { menuId: menu.id, href: { in: ["/projekti", "/takmicenja"] } },
    });

    if (!menuItems.some((row) => row.href === "/sindikat")) {
      const kontakt = menuItems.find((row) => row.href === "/kontakt");
      const sortOrder = kontakt?.sortOrder ?? menuItems.length;
      if (kontakt) {
        await prisma.menuItem.updateMany({
          where: { menuId: menu.id, sortOrder: { gte: kontakt.sortOrder } },
          data: { sortOrder: { increment: 1 } },
        });
      }
      await prisma.menuItem.create({
        data: { label: "Синдикат", href: "/sindikat", sortOrder, menuId: menu.id },
      });
    }
  }

  const unionRecords = prisma as unknown as {
    unionProfile: {
      findUnique(args: { where: { id: string } }): Promise<{ id: string } | null>;
      create(args: { data: typeof unionProfile & { id: string } }): Promise<unknown>;
    };
  };
  const union = await unionRecords.unionProfile.findUnique({ where: { id: "default" } });
  if (!union) {
    await unionRecords.unionProfile.create({
      data: { id: "default", ...unionProfile },
    });
  }

  for (const item of schoolMedia) {
    const existing = await prisma.media.findFirst({ where: { url: item.url } });
    if (existing) {
      continue;
    }
    await prisma.media.create({
      data: {
        filename: item.filename,
        url: item.url,
        alt: item.alt,
        mimeType: item.mimeType,
        size: item.size,
        createdAt: new Date(item.createdAt),
        uploadedById: admin.id,
      },
    });
  }

  console.log(`Администратор је спреман: ${admin.email}`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
