import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SchoolLogo } from "@/components/common/SchoolLogo";
import { TextLink } from "@/components/common/TextLink";
import { phoneHref } from "@/lib/format";
import type { NavItem, SiteSettings } from "@/types/content";
import type { ReactElement } from "react";

type FooterProps = {
  site: SiteSettings;
  navigation: NavItem[];
};

export function Footer({ site, navigation }: FooterProps) {
  const year = new Date().getFullYear();
  const socials = [
    { href: site.facebookUrl, label: "Facebook", icon: <FacebookIcon /> },
    { href: site.instagramUrl, label: "Instagram", icon: <InstagramIcon /> },
    { href: site.youtubeUrl, label: "YouTube", icon: <YouTubeIcon /> },
  ].filter((item): item is { href: string; label: string; icon: ReactElement } => Boolean(item.href));

  return (
    <Box component="footer" id="kontakt" sx={{ bgcolor: "primary.main", color: "primary.contrastText", mt: "auto", scrollMarginTop: { xs: "88px", lg: "132px" } }}>
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Box
          sx={{
            display: "grid",
            gap: 4,
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1.4fr 1fr 1fr 0.8fr" },
          }}
        >
          <Box>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
              <SchoolLogo size={44} />
              <Typography sx={{ fontWeight: 800, lineHeight: 1.25 }}>{site.schoolName}</Typography>
            </Stack>
            <Typography variant="body2" sx={{ opacity: 0.86, maxWidth: 360 }}>
              {site.location}. {site.tagline}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 800, mb: 1.5 }}>Контакт</Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {site.address}
              <br />
              {site.city} {site.postalCode}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1.5 }}>
              <Link href={phoneHref(site.phone)} color="inherit" underline="hover">
                {site.phone}
              </Link>
              {site.phoneAlt ? (
                <>
                  <br />
                  <Link href={phoneHref(site.phoneAlt)} color="inherit" underline="hover">
                    {site.phoneAlt}
                  </Link>
                </>
              ) : null}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1.5 }}>
              <Link href={`mailto:${site.email}`} color="inherit" underline="hover">
                {site.email}
              </Link>
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 800, mb: 1.5 }}>Брзи линкови</Typography>
            <Stack spacing={0.75}>
              {navigation.map((item) => (
                <TextLink key={item.href} href={item.href}>
                  {item.label}
                </TextLink>
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 800, mb: 1.5 }}>Друштвене мреже</Typography>
            <Stack direction="row" spacing={0.5}>
              {socials.map((item) => (
                <IconButton
                  key={item.label}
                  component="a"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  sx={{ color: "inherit", border: "1px solid rgba(255,255,255,0.25)" }}
                >
                  {item.icon}
                </IconButton>
              ))}
            </Stack>
          </Box>
        </Box>
      </Container>
      <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {year} {site.schoolName}. Сва права задржана.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
