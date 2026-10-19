"use client";

import CardActionArea from "@mui/material/CardActionArea";
import Link from "next/link";
import type { ReactNode } from "react";

export function CardLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <CardActionArea component={Link} href={href} sx={{ height: "100%", alignItems: "stretch" }}>
      {children}
    </CardActionArea>
  );
}
