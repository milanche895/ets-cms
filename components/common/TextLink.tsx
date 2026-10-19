"use client";

import MuiLink from "@mui/material/Link";
import NextLink from "next/link";
import type { ReactNode } from "react";

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <MuiLink component={NextLink} href={href} color="inherit" underline="hover" variant="body2">
      {children}
    </MuiLink>
  );
}
