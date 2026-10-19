import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { LinkButton } from "@/components/common/LinkButton";
import type { SiteSettings } from "@/types/content";
import { brand } from "@/theme/tokens";

export function Hero({ site }: { site: SiteSettings }) {
  return (
    <Box
      sx={{
        position: "relative",
        color: "common.white",
        minHeight: { xs: 560, md: 640 },
        display: "flex",
        alignItems: "center",
        pb: { xs: 9, md: 11 },
      }}
    >
      <Image
        src="/images/school/SajamTehnikeETS07.jpg"
        alt="Робот школе на полигону сајма технике"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
      <Box sx={{ position: "absolute", inset: 0, background: brand.heroOverlay }} />
      <Container maxWidth="lg" sx={{ position: "relative", py: { xs: 6, md: 8 } }}>
        <Box sx={{ maxWidth: 720 }}>
          <Chip
            label={site.location}
            sx={{
              mb: 2,
              bgcolor: "rgba(196, 163, 90, 0.2)",
              color: "gold.light",
              border: "1px solid rgba(196, 163, 90, 0.45)",
            }}
          />
          <Typography variant="h1" sx={{ fontSize: { xs: "2.05rem", sm: "2.8rem", md: "3.45rem" }, lineHeight: 1.12 }}>
            {site.schoolName}
          </Typography>
          <Typography sx={{ mt: 2.5, fontSize: { xs: "1.05rem", md: "1.2rem" }, maxWidth: 560, color: "rgba(255,255,255,0.88)" }}>
            {site.tagline}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 3.5 }}>
            <LinkButton
              href="/obrazovni-profili"
              variant="contained"
              sx={{ bgcolor: "gold.main", color: "gold.contrastText", "&:hover": { bgcolor: "gold.dark" } }}
            >
              Образовни профили
            </LinkButton>
            <LinkButton
              href="/vesti"
              variant="outlined"
              sx={{ color: "common.white", borderColor: "rgba(255,255,255,0.7)" }}
            >
              Најновије вести
            </LinkButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
