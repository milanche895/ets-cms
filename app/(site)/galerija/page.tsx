import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import { ImageCard } from "@/components/common/ImageCard";
import { Section } from "@/components/common/Section";
import { PageHeader } from "@/components/pages/PageHeader";
import { getGalleryImages, getVideos } from "@/services/gallery";

export const metadata: Metadata = {
  title: "Галерија",
  description: "Фотографије са наставе, пројеката и активности.",
};

function youtubeId(url: string): string | null {
  const match = /(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/.exec(url);
  return match?.[1] ?? null;
}

export default async function GalleryPage() {
  const [items, videos] = await Promise.all([getGalleryImages(), getVideos()]);

  return (
    <>
      <PageHeader title="Галерија" subtitle="Фотографије са наставе, пројеката и активности." />
      <Section>
        {items.length === 0 ? (
          <Typography color="text.secondary">Галерија је празна.</Typography>
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
      {videos.length > 0 ? (
        <Section tone="gray">
          <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, mb: 3 }}>
            Видео
          </Typography>
          <Grid container spacing={2}>
            {videos.map((video) => {
              const id = youtubeId(video.url);
              return (
                <Grid key={video.id} size={{ xs: 12, md: 8 }}>
                  {id ? (
                    <Box
                      component="iframe"
                      src={`https://www.youtube.com/embed/${id}`}
                      title={video.alt || "Видео школе"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      sx={{ width: "100%", aspectRatio: "16 / 9", border: 0, borderRadius: 2 }}
                    />
                  ) : (
                    <Typography component="a" href={video.url}>
                      {video.alt || video.filename}
                    </Typography>
                  )}
                </Grid>
              );
            })}
          </Grid>
        </Section>
      ) : null}
    </>
  );
}
