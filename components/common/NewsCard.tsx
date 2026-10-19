import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { LinkButton } from "@/components/common/LinkButton";
import type { Article } from "@/types/content";

type NewsCardProps = {
  article: Article;
  dateLabel: string;
};

export function NewsCard({ article, dateLabel }: NewsCardProps) {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
        boxShadow: "0 10px 30px rgba(12, 35, 64, 0.06)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 16px 40px rgba(12, 35, 64, 0.12)",
        },
      }}
    >
      <Box sx={{ position: "relative", height: 190 }}>
        {article.featuredImage ? (
          <Image
            src={article.featuredImage}
            alt=""
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
          />
        ) : null}
      </Box>
      <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", flexGrow: 1, gap: 1.25 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, alignItems: "center" }}>
          <Chip label={article.categoryName || "Вест"} size="small" color="secondary" variant="outlined" />
          <Typography variant="body2" color="text.secondary">
            {dateLabel}
          </Typography>
        </Box>
        <Typography variant="h3" component="h3" sx={{ fontSize: "1.2rem", lineHeight: 1.35 }}>
          {article.title}
        </Typography>
        <Typography color="text.secondary" sx={{ flexGrow: 1 }}>
          {article.excerpt}
        </Typography>
        <LinkButton href={`/vesti/${article.slug}`} sx={{ alignSelf: "flex-start", px: 0 }}>
          Прочитај више
        </LinkButton>
      </Box>
    </Box>
  );
}
