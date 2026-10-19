"use client";

import { createTheme, type PaletteColor, type PaletteColorOptions } from "@mui/material/styles";
import { brand } from "@/theme/tokens";

declare module "@mui/material/styles" {
  interface Palette {
    gold: PaletteColor;
  }
  interface PaletteOptions {
    gold?: PaletteColorOptions;
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: brand.navy,
      dark: brand.navyDeep,
      contrastText: brand.white,
    },
    secondary: {
      main: brand.blue,
      dark: brand.blueDark,
      contrastText: brand.white,
    },
    gold: {
      main: brand.gold,
      dark: brand.goldDark,
      light: brand.goldLight,
      contrastText: brand.navy,
    },
    text: {
      primary: brand.ink,
      secondary: brand.muted,
    },
    background: {
      default: brand.paper,
      paper: brand.white,
    },
    divider: brand.line,
  },
  spacing: 8,
  shape: {
    borderRadius: 12,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: "var(--font-body), 'Segoe UI', sans-serif",
    h1: { fontFamily: "var(--font-heading), 'Segoe UI', sans-serif", fontWeight: 800 },
    h2: { fontFamily: "var(--font-heading), 'Segoe UI', sans-serif", fontWeight: 800 },
    h3: { fontFamily: "var(--font-heading), 'Segoe UI', sans-serif", fontWeight: 700 },
    h4: { fontFamily: "var(--font-heading), 'Segoe UI', sans-serif", fontWeight: 700 },
    h5: { fontFamily: "var(--font-heading), 'Segoe UI', sans-serif", fontWeight: 700 },
    h6: { fontFamily: "var(--font-heading), 'Segoe UI', sans-serif", fontWeight: 700 },
    button: {
      fontFamily: "var(--font-heading), 'Segoe UI', sans-serif",
      fontWeight: 700,
      textTransform: "none",
    },
    overline: {
      textTransform: "none",
      letterSpacing: "0.04em",
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 18,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${brand.line}`,
          boxShadow: "0 10px 30px rgba(12, 35, 64, 0.06)",
          backgroundImage: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        color: "inherit",
        elevation: 0,
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },
  },
});
