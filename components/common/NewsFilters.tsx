"use client";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Link from "next/link";

export function NewsFilters({
  categories,
  activeSlug,
}: {
  categories: { id: string; name: string; slug: string }[];
  activeSlug?: string;
}) {
  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ mb: 3, flexWrap: "wrap" }}>
      <Chip component={Link} href="/vesti" clickable label="Све" color={activeSlug ? "default" : "primary"} variant={activeSlug ? "outlined" : "filled"} />
      {categories.map((category) => {
        const selected = category.slug === activeSlug;
        return (
          <Chip
            key={category.id}
            component={Link}
            href={`/vesti?kategorija=${category.slug}`}
            clickable
            label={category.name}
            color={selected ? "primary" : "default"}
            variant={selected ? "filled" : "outlined"}
          />
        );
      })}
    </Stack>
  );
}
