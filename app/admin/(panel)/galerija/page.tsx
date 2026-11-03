import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/AdminHeading";
import { DbNotice } from "@/components/admin/DbNotice";
import { DeleteRecordButton } from "@/components/admin/DeleteRecordButton";
import { GalleryForms } from "@/components/admin/GalleryForms";
import { getGalleryImages, getVideos } from "@/services/gallery";

export const metadata: Metadata = { title: "Галерија" };

export default async function AdminGalleryPage() {
  const [photos, videos] = await Promise.all([getGalleryImages(), getVideos()]);

  return (
    <>
      <AdminHeading
        title="Галерија"
        description="Фотографије и видео снимци који се виде на страници Галерија и у прегледу на почетној."
        action={{ href: "/galerija", label: "Отвори галерију" }}
      />
      <DbNotice />
      <GalleryForms />

      <Typography variant="h2" sx={{ fontSize: "1.2rem", mb: 1.5 }}>
        Фотографије
      </Typography>
      {photos.length === 0 ? (
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Нема фотографија.
        </Typography>
      ) : (
        <Grid container spacing={1.5} sx={{ mb: 4 }}>
          {photos.map((item) => (
            <Grid key={item.id} size={{ xs: 6, sm: 4, md: 3 }}>
              <Box sx={{ border: 1, borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
                <Box component="img" src={item.url} alt={item.alt} sx={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", display: "block" }} />
                <Box sx={{ p: 1, display: "flex", justifyContent: "space-between", gap: 1, alignItems: "center" }}>
                  <Typography variant="body2" sx={{ minWidth: 0 }} noWrap>
                    {item.alt || item.filename}
                  </Typography>
                  <DeleteRecordButton endpoint={`/api/media/${item.id}`} />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <Typography variant="h2" sx={{ fontSize: "1.2rem", mb: 1.5 }}>
        Видео
      </Typography>
      {videos.length === 0 ? (
        <Typography color="text.secondary">Нема видео снимака.</Typography>
      ) : (
        <Box sx={{ display: "grid", gap: 1 }}>
          {videos.map((item) => (
            <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center", border: 1, borderColor: "divider", borderRadius: 2, p: 1.5 }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700 }} noWrap>
                  {item.alt || item.filename}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {item.url}
                </Typography>
              </Box>
              <DeleteRecordButton endpoint={`/api/media/${item.id}`} />
            </Box>
          ))}
        </Box>
      )}
    </>
  );
}
