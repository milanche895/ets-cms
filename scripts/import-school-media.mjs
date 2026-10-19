import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();
const root = process.cwd();
const imageDir = path.join(root, "public", "images", "school");
const placeholderSlugs = [
  "sekcija-robotike-pocinje-novu-sezonu",
  "ucenicki-radovi-iz-programiranja",
  "skola-na-takmicenjima",
];

const categories = [
  { slug: "aktuelnosti", name: "Актуелности", description: "Вести и обавештења из живота школе." },
  { slug: "robotika", name: "Роботика", description: "Секција роботике и такмичења са роботима." },
  { slug: "programiranje", name: "Програмирање", description: "Ученички радови и вежбе из програмирања." },
  { slug: "projekti", name: "Пројекти", description: "Ученички и наставни пројекти." },
  { slug: "takmicenja", name: "Такмичења", description: "Наступи школе на такмичењима." },
  { slug: "tehnologija", name: "Технологија", description: "Технички радови и примена у настави." },
];

const categoryRank = ["takmicenja", "robotika", "programiranje", "projekti", "tehnologija", "aktuelnosti"];

const wpCategory = {
  10: "aktuelnosti",
  5: "robotika",
  4: "programiranje",
  11: "projekti",
  9: "takmicenja",
  2: "tehnologija",
};

function decode(text) {
  return text
    .replace(/&#(\d+);/g, (_, value) => String.fromCharCode(Number(value)))
    .replace(/&#x([0-9a-f]+);/gi, (_, value) => String.fromCharCode(parseInt(value, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&hellip;/g, "…");
}

function tidy(text) {
  return text
    .replace(/\[\s*…\s*\]/g, "")
    .replace(/[ \t]*\n[ \t]*(?!\n)/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function htmlToText(html) {
  return tidy(
    decode(
      html
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n\n")
        .replace(/<\/(h\d|li|div|figcaption)>/gi, "\n")
        .replace(/<li[^>]*>/gi, "• ")
        .replace(/<[^>]+>/g, ""),
    )
      .replace(/\r/g, "")
      .replace(/[ \t]+\n/g, "\n"),
  );
}

function filenameOf(url) {
  const name = decodeURIComponent(url.split("/").pop() || "slika").split("?")[0];
  return name.replace(/[^\w.\-()+\u0400-\u04FF]+/g, "-");
}

function isThemeDemo(url) {
  const name = filenameOf(url).toLowerCase();
  if (url.includes("/sites/120/")) {
    return true;
  }
  return (
    /^(blog|client|review|project)-\d/.test(name) ||
    name.startsWith("client_img") ||
    name.startsWith("about-img") ||
    name.startsWith("about-image") ||
    name.startsWith("banner-image") ||
    name.startsWith("bg-image") ||
    name.startsWith("main-logo") ||
    name.includes("preloader")
  );
}

function labelFor(filename, alt, title) {
  const named = [
    [/SajamTehnike/i, "Сајам технике"],
    [/poklonicko/i, "Поклоничко путовање"],
    [/Ugljare/i, "Посета ученика из Угљара"],
    [/StoniTenis|stoni-tenis/i, "Турнир у стоном тенису"],
    [/DaniZdravlja/i, "Дани здравља"],
    [/DaniKnjige/i, "Међународни дан књиге"],
    [/MargitaArsic/i, "Маргита Арсић"],
    [/zvono/i, "Електронско звоно"],
    [/FirstLegoLeague/i, "Прва Лего лига"],
    [/SecanjeNaTragediju/i, "Недеља сећања и заједништва"],
    [/AI_Startup/i, "Радионица о вештачкој интелигенцији"],
    [/smotra-recitatora/i, "Смотра рецитатора"],
    [/fudbal/i, "Хуманитарни турнир"],
    [/ets-sah/i, "Шаховски турнир"],
    [/lego-robotica/i, "Spike Лего робот"],
    [/EV3-lego/i, "EV3 Лего робот"],
    [/LogoETS/i, "Лого Електротехничке школе „Михајло Пупин“"],
    [/sindikatETS/i, "Лого синдиката школе"],
    [/sindikatOBRAZOVANJA/i, "Лого синдиката образовања"],
    [/mpn-logo/i, "Лого Министарства просвете"],
    [/unijasprs/i, "Лого Уније СПРС"],
    [/^VLS/i, "Лого ВЛС"],
    [/site-icon|cropped-site-icon/i, "Икона сајта школе"],
  ];
  const match = named.find(([pattern]) => pattern.test(filename));
  if (match) {
    return match[1];
  }
  const text = decode(alt || title || "").replace(/<[^>]+>/g, "").trim();
  return text || "Фотографија са активности школе";
}

function articleSlug(slug) {
  if (slug.startsWith("%")) {
    return "ucenici-ets-first-lego-league-kragujevac";
  }
  return slug;
}

function pickCategory(ids) {
  const slugs = ids.map((id) => wpCategory[id]).filter(Boolean);
  return categoryRank.find((slug) => slugs.includes(slug)) ?? "aktuelnosti";
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${url}`);
  }
  return response.json();
}

async function allMedia() {
  const items = [];
  for (let page = 1; page <= 3; page += 1) {
    const batch = await fetchJson(
      `https://ets.edu.rs/wp-json/wp/v2/media?per_page=100&page=${page}&_fields=id,date,mime_type,source_url,alt_text,title,media_details`,
    );
    if (!Array.isArray(batch) || batch.length === 0) {
      break;
    }
    items.push(...batch);
    if (batch.length < 100) {
      break;
    }
  }
  return items;
}

async function download(url, destination) {
  if (fs.existsSync(destination) && fs.statSync(destination).size > 0) {
    return fs.statSync(destination).size;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${url}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(destination, buffer);
  return buffer.length;
}

async function mapPool(items, limit, worker) {
  const queue = [...items];
  const runners = Array.from({ length: limit }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      await worker(item);
    }
  });
  await Promise.all(runners);
}

function writeTs(file, source) {
  fs.writeFileSync(path.join(root, file), source, "utf8");
}

const homeHtml = await (await fetch("https://ets.edu.rs/")).text();
const altByUrl = new Map();
for (const tag of homeHtml.matchAll(/<img\b[^>]*>/gi)) {
  const src = /src="([^"]+)"/i.exec(tag[0])?.[1]?.replace(/&amp;/g, "&");
  const alt = /alt="([^"]*)"/i.exec(tag[0])?.[1] ?? "";
  if (src) {
    altByUrl.set(src, decode(alt));
  }
}

const posts = await fetchJson(
  "https://ets.edu.rs/wp-json/wp/v2/posts?per_page=100&_fields=id,slug,date,title,excerpt,content,featured_media,categories",
);
const media = await allMedia();
const kept = [];
const seenUrl = new Set();

for (const item of media) {
  if (!item.source_url || seenUrl.has(item.source_url)) {
    continue;
  }
  if (isThemeDemo(item.source_url)) {
    continue;
  }
  seenUrl.add(item.source_url);
  kept.push(item);
}

fs.mkdirSync(imageDir, { recursive: true });
const localByMediaId = new Map();
let downloaded = 0;

await mapPool(kept, 6, async (item) => {
  const filename = filenameOf(item.source_url);
  const destination = path.join(imageDir, filename);
  const size = await download(item.source_url, destination);
  const alt = labelFor(filename, altByUrl.get(item.source_url) || item.alt_text, item.title?.rendered);
  localByMediaId.set(item.id, {
    filename,
    url: `/images/school/${filename}`,
    alt,
    mimeType: item.mime_type || "image/jpeg",
    size,
    createdAt: item.date,
  });
  downloaded += 1;
  if (downloaded % 20 === 0) {
    console.log(`Преузето ${downloaded}/${kept.length}`);
  }
});

const schoolMedia = [...localByMediaId.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
const logo = schoolMedia.find((item) => item.filename === "LogoETS3.png");
if (logo) {
  fs.copyFileSync(path.join(imageDir, logo.filename), path.join(root, "app", "icon.png"));
}

const videoIds = new Set(["22JhAh0ffjk"]);
for (const post of posts) {
  const html = `${post.content?.rendered ?? ""} ${post.excerpt?.rendered ?? ""}`;
  for (const match of html.matchAll(/youtu(?:\.be\/|be\.com\/(?:watch\?v=|embed\/))([\w-]{6,})/g)) {
    videoIds.add(match[1]);
  }
}
for (const match of homeHtml.matchAll(/youtu(?:\.be\/|be\.com\/(?:watch\?v=|embed\/))([\w-]{6,})/g)) {
  videoIds.add(match[1]);
}

const videos = [];
for (const id of videoIds) {
  let title = "Видео школе";
  try {
    const info = await fetchJson(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`,
    );
    title = decode(info.title || title);
  } catch {
    // Наслов остаје општи ако YouTube не врати податке.
  }
  videos.push({
    filename: `${id}.youtube`,
    url: `https://www.youtube.com/watch?v=${id}`,
    alt: title,
    mimeType: "video/youtube",
    size: 0,
    createdAt: "2026-01-01T08:00:00.000Z",
  });
}

const records = [...schoolMedia, ...videos];
writeTs(
  "data/schoolMedia.ts",
  `import type { Media } from "@/types/content";

export const schoolLogoUrl = "/images/school/LogoETS3.png";

export const schoolMedia: Media[] = ${JSON.stringify(
    records.map((item, index) => ({
      id: `school-${index + 1}`,
      filename: item.filename,
      url: item.url,
      alt: item.alt,
      mimeType: item.mimeType,
      size: item.size,
      createdAt: new Date(item.createdAt).toISOString(),
      uploadedBy: "admin",
    })),
    null,
    2,
  )};
`,
);

const articles = posts
  .map((post) => {
    const content = htmlToText(post.content?.rendered ?? "");
    const excerpt = htmlToText(post.excerpt?.rendered ?? "").replace(/\s+/g, " ").trim();
    if (content.length < 40) {
      return null;
    }
    const image = localByMediaId.get(post.featured_media);
    const title = decode(post.title?.rendered ?? "").replace(/<[^>]+>/g, "").trim();
    const categoryId = pickCategory(post.categories ?? []);
    const categoryName = categories.find((category) => category.slug === categoryId)?.name ?? "Актуелности";
    return {
      id: articleSlug(post.slug),
      title,
      slug: articleSlug(post.slug),
      excerpt: excerpt || content.slice(0, 180),
      content,
      featuredImage: image?.url ?? null,
      categoryId,
      categoryName,
      status: "PUBLISHED",
      publishedAt: new Date(post.date).toISOString(),
      createdAt: new Date(post.date).toISOString(),
      updatedAt: new Date(post.date).toISOString(),
      authorId: "admin",
      seoTitle: title,
      seoDescription: (excerpt || content).slice(0, 160),
    };
  })
  .filter(Boolean)
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

writeTs(
  "data/articles.ts",
  `import type { Article } from "@/types/content";

export const articles: Article[] = ${JSON.stringify(articles, null, 2)};
`,
);

writeTs(
  "data/categories.ts",
  `import type { Category } from "@/types/content";

export const categories: Category[] = ${JSON.stringify(
    categories.map((category) => ({
      id: category.slug,
      name: category.name,
      slug: category.slug,
      description: category.description,
    })),
    null,
    2,
  )};
`,
);

const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
if (!admin) {
  throw new Error("Нема администратора у бази. Покрените npm run db:seed.");
}

const categoryIds = new Map();
for (const category of categories) {
  const saved = await prisma.category.upsert({
    where: { slug: category.slug },
    update: { name: category.name, description: category.description },
    create: category,
  });
  categoryIds.set(category.slug, saved.id);
}

await prisma.media.deleteMany({
  where: {
    OR: [
      { url: { startsWith: "/images/gallery-" } },
      { filename: { startsWith: "about-img" } },
      { filename: { startsWith: "about-image" } },
      { filename: { startsWith: "blog-" } },
      { filename: { startsWith: "client" } },
      { filename: { startsWith: "review-" } },
      { filename: { startsWith: "banner-image" } },
      { filename: { startsWith: "bg-image" } },
      { filename: { startsWith: "main-logo" } },
    ],
  },
});

for (const item of records) {
  const existing = await prisma.media.findFirst({ where: { url: item.url } });
  if (existing) {
    await prisma.media.update({
      where: { id: existing.id },
      data: { alt: item.alt, mimeType: item.mimeType, size: item.size, filename: item.filename },
    });
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

await prisma.article.updateMany({
  where: { slug: { in: placeholderSlugs } },
  data: { status: "HIDDEN" },
});

for (const article of articles) {
  const existing = await prisma.article.findUnique({ where: { slug: article.slug } });
  const data = {
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    featuredImage: article.featuredImage,
    categoryId: categoryIds.get(article.categoryId),
    status: "PUBLISHED",
    publishedAt: new Date(article.publishedAt),
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
  };
  if (existing) {
    await prisma.article.update({ where: { id: existing.id }, data });
    continue;
  }
  await prisma.article.create({
    data: {
      ...data,
      slug: article.slug,
      authorId: admin.id,
    },
  });
}

const mediaCount = await prisma.media.count();
const articleCount = await prisma.article.count({ where: { status: "PUBLISHED" } });
console.log(`Медији: ${mediaCount}. Објављене вести: ${articleCount}. Фајлова: ${schoolMedia.length}. Видеа: ${videos.length}.`);

await prisma.$disconnect();
