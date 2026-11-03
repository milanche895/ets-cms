import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { AboutPreview } from "@/components/home/AboutPreview";
import { Competitions } from "@/components/home/Competitions";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { Hero } from "@/components/home/Hero";
import { LatestNews } from "@/components/home/LatestNews";
import { Programs } from "@/components/home/Programs";
import { QuickLinks } from "@/components/home/QuickLinks";
import { getActivities } from "@/services/activities";
import { getLatestArticles } from "@/services/articles";
import { getGalleryPreview } from "@/services/gallery";
import { getQuickLinks } from "@/services/navigation";
import { getPrograms } from "@/services/programs";
import { getSiteSettings } from "@/services/site";

export default async function HomePage() {
  const [site, links, articles, programs, activities, gallery] = await Promise.all([
    getSiteSettings(),
    getQuickLinks(),
    getLatestArticles(3),
    getPrograms(),
    getActivities(),
    getGalleryPreview(6),
  ]);

  return (
    <>
      <Hero site={site} />
      <Box sx={{ mt: { xs: -6, md: -7 }, position: "relative", zIndex: 2, pb: { xs: 2, md: 3 } }}>
        <Container maxWidth="lg">
          <QuickLinks links={links} />
        </Container>
      </Box>
      <LatestNews articles={articles} />
      <Programs programs={programs} />
      <Competitions activities={activities} />
      <GalleryPreview items={gallery} />
      <AboutPreview site={site} />
    </>
  );
}
