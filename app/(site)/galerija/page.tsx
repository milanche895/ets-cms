import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import { ImageCard } from "@/components/common/ImageCard";
import { Section } from "@/components/common/Section";
import { PageHeader } from "@/components/pages/PageHeader";
import { getMedia } from "@/services/gallery";

export const metadata: Metadata = {
  title: "Галерија",
  description: "Фотографије са наставе, пројеката и активности.",
};

export default async function GalleryPage() {
  const items = (await getMedia()).filter((item) => item.mimeType.startsWith("image/"));

  return (
    <>
      <PageHeader title="Галерија" subtitle="Фотографије са наставе, пројеката и активности." />
      <Section>
        {items.length === 0 ? (
          <Typography color="text.secondary">Галерија је празна. Слике се додају у CMS-у, у делу Медији.</Typography>
        ) : (
          <Grid container spacing={1.5}>
            {items.map((item) => (
              <Grid key={item.id} size={{ xs: 6, md: 4 }}>
                <ImageCard src={item.url} alt={item.alt} />
              </Grid>
            ))}
          </Grid>
        )}
      </Section>
    </>
  );
}
