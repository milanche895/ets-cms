import Grid from "@mui/material/Grid";
import { ImageCard } from "@/components/common/ImageCard";
import { Section } from "@/components/common/Section";
import { SectionTitle } from "@/components/common/SectionTitle";
import type { Media } from "@/types/content";

export function GalleryPreview({ items }: { items: Media[] }) {
  return (
    <Section id="galerija">
      <SectionTitle
        kicker="Школа у слици"
        title="Галерија"
        subtitle="Тренуци са наставе, пројеката и активности."
        action={{ href: "/galerija", label: "Цела галерија" }}
      />
      <Grid container spacing={1.5}>
        {items.map((item) => (
          <Grid key={item.id} size={{ xs: 6, md: 4 }}>
            <ImageCard src={item.url} alt={item.alt} />
          </Grid>
        ))}
      </Grid>
    </Section>
  );
}
