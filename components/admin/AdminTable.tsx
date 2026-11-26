"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import type { ReactNode } from "react";

export type AdminRow = {
  href?: string;
  cells: string[];
};

function RowContent({ headers, row }: { headers: string[]; row: AdminRow }) {
  const [title, ...meta] = row.cells;
  return (
    <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.5, height: "100%" }}>
      <Typography sx={{ fontWeight: 800, lineHeight: 1.3, overflowWrap: "anywhere" }}>{title}</Typography>
      {meta.length > 0 ? (
        <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 0.75, mt: "auto" }}>
          {meta.map((value, index) => (
            <Chip
              key={`${headers[index + 1]}-${index}`}
              size="small"
              variant="outlined"
              label={`${headers[index + 1] ?? ""}: ${value}`}
            />
          ))}
        </Stack>
      ) : null}
    </CardContent>
  );
}

function RowCard({ href, children }: { href?: string; children: ReactNode }) {
  return (
    <Card variant="outlined" sx={{ height: "100%", transition: "box-shadow .15s, border-color .15s", "&:hover": { boxShadow: 3 } }}>
      {href ? (
        <CardActionArea component={NextLink} href={href} sx={{ height: "100%", alignItems: "stretch" }}>
          {children}
        </CardActionArea>
      ) : (
        children
      )}
    </Card>
  );
}

export function AdminTable({ headers, rows }: { headers: string[]; rows: AdminRow[] }) {
  if (rows.length === 0) {
    return <Typography color="text.secondary">Нема записа.</Typography>;
  }

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
      }}
    >
      {rows.map((row, index) => (
        <RowCard key={`${row.href ?? row.cells.join("|")}-${index}`} href={row.href}>
          <RowContent headers={headers} row={row} />
        </RowCard>
      ))}
    </Box>
  );
}
