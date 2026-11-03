import type { SearchEntry } from "@/types/content";
import { getActivities } from "@/services/activities";
import { getPublishedArticles } from "@/services/articles";
import { getPrograms } from "@/services/programs";
import { getProjects } from "@/services/projects";
import { getPublishedUnionPosts, getUnionProfile } from "@/services/union";

export async function getSearchEntries(): Promise<SearchEntry[]> {
  const [articles, programs, projects, activities, union, unionPosts] = await Promise.all([
    getPublishedArticles(),
    getPrograms(),
    getProjects(),
    getActivities(),
    getUnionProfile(),
    getPublishedUnionPosts(),
  ]);

  return [
    ...articles.map((article) => ({
      id: article.id,
      title: article.title,
      group: "Вест",
      href: `/vesti/${article.slug}`,
    })),
    ...programs.map((program) => ({
      id: program.id,
      title: program.title,
      group: "Образовни профил",
      href: `/obrazovni-profili/${program.slug}`,
    })),
    ...projects.map((project) => ({
      id: project.id,
      title: project.title,
      group: "Пројекат",
      href: `/projekti/${project.slug}`,
    })),
    ...activities.map((activity) => ({
      id: activity.id,
      title: activity.title,
      group: "Активност",
      href:
        activity.id === "parlament"
          ? "/o-skoli"
          : `/vesti?kategorija=${activity.id}`,
    })),
    {
      id: "sindikat",
      title: union.name,
      group: "Синдикат",
      href: "/sindikat",
    },
    ...unionPosts.map((post) => ({
      id: post.id,
      title: post.title,
      group: post.kind === "ACTIVITY" ? "Активност синдиката" : "Обавештење синдиката",
      href: `/sindikat/${post.slug}`,
    })),
  ];
}
