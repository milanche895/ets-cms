"use client";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SchoolLogo } from "@/components/common/SchoolLogo";
import { MobileNav } from "@/components/layout/MobileNav";
import { SearchDialog } from "@/components/layout/SearchDialog";
import { phoneHref } from "@/lib/format";
import type { NavItem, SearchEntry, SiteSettings } from "@/types/content";

type HeaderProps = {
  site: SiteSettings;
  navigation: NavItem[];
  searchEntries: SearchEntry[];
};

export function Header({ site, navigation, searchEntries }: HeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <Box component="header" sx={{ position: "sticky", top: 0, zIndex: (theme) => theme.zIndex.appBar }}>
      <Box sx={{ bgcolor: "primary.main", color: "primary.contrastText", display: { xs: "none", md: "block" } }}>
        <Container maxWidth="lg">
          <Stack direction="row" spacing={3} sx={{ py: 0.75, fontSize: 14 }}>
            <Typography variant="body2">{site.location}</Typography>
            <Typography component="a" href={phoneHref(site.phone)} variant="body2" sx={{ color: "inherit" }}>
              {site.phone}
            </Typography>
            <Typography component="a" href={`mailto:${site.email}`} variant="body2" sx={{ color: "inherit" }}>
              {site.email}
            </Typography>
          </Stack>
        </Container>
      </Box>

      <AppBar position="static" sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 72, lg: 80 }, gap: 1 }}>
            <Box
              component={Link}
              href="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                color: "inherit",
                textDecoration: "none",
                minWidth: 0,
                flexShrink: 0,
              }}
            >
              <SchoolLogo size={46} />
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  component="span"
                  sx={{ display: { xs: "block", sm: "none" }, fontWeight: 800, lineHeight: 1.2 }}
                >
                  {site.shortName}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    display: { xs: "none", sm: "block" },
                    fontFamily: "var(--font-heading), sans-serif",
                    fontWeight: 800,
                    lineHeight: 1.15,
                    fontSize: "0.98rem",
                  }}
                >
                  {site.nameLine1}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    display: { xs: "none", sm: "block" },
                    color: "primary.main",
                    fontWeight: 700,
                    lineHeight: 1.15,
                  }}
                >
                  {site.nameLine2}
                </Typography>
              </Box>
            </Box>

            <Stack
              component="nav"
              aria-label="Главни мени"
              direction="row"
              sx={{
                display: { xs: "none", lg: "flex" },
                flexGrow: 1,
                justifyContent: "flex-end",
                gap: 0.25,
              }}
            >
              {navigation.map((item) => {
                const current = item.href === "/" && pathname === "/";
                return (
                  <Button
                    key={item.href}
                    component={Link}
                    href={item.href}
                    color="inherit"
                    aria-current={current ? "page" : undefined}
                    sx={{
                      color: current ? "secondary.main" : "text.primary",
                      fontWeight: current ? 800 : 600,
                      fontSize: "0.92rem",
                      px: 1,
                      minWidth: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Stack>

            <Box sx={{ display: "flex", alignItems: "center", ml: { xs: "auto", lg: 0.5 } }}>
              <IconButton aria-label="Отвори претрагу" onClick={() => setSearchOpen(true)}>
                <SearchIcon />
              </IconButton>
              <IconButton
                aria-label="Отвори мени"
                onClick={() => setMenuOpen(true)}
                sx={{ display: { lg: "none" } }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={navigation}
        schoolName={site.shortName}
      />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} entries={searchEntries} />
    </Box>
  );
}
