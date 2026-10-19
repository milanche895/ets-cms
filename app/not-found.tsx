import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import { LinkButton } from "@/components/common/LinkButton";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getMainNavigation } from "@/services/navigation";
import { getSearchEntries } from "@/services/search";
import { getSiteSettings } from "@/services/site";

export const metadata: Metadata = {
  title: "Страница није пронађена",
};

export default async function NotFound() {
  const [site, navigation, searchEntries] = await Promise.all([
    getSiteSettings(),
    getMainNavigation(),
    getSearchEntries(),
  ]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header site={site} navigation={navigation} searchEntries={searchEntries} />
      <Container maxWidth="sm" sx={{ flex: 1, py: { xs: 8, md: 12 }, textAlign: "center" }}>
        <Typography variant="h1" sx={{ fontSize: { xs: "2rem", md: "2.5rem" }, mb: 1.5 }}>
          Страница није пронађена
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Адреса не постоји или страница још није додата.
        </Typography>
        <LinkButton href="/" variant="contained">
          На почетну
        </LinkButton>
      </Container>
      <Footer site={site} navigation={navigation} />
    </Box>
  );
}
