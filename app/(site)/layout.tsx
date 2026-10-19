import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getMainNavigation } from "@/services/navigation";
import { getSearchEntries } from "@/services/search";
import { getSiteSettings } from "@/services/site";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [site, navigation, searchEntries] = await Promise.all([
    getSiteSettings(),
    getMainNavigation(),
    getSearchEntries(),
  ]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header site={site} navigation={navigation} searchEntries={searchEntries} />
      <Box component="main" id="sadrzaj" sx={{ flex: 1 }}>
        {children}
      </Box>
      <Footer site={site} navigation={navigation} />
    </Box>
  );
}
