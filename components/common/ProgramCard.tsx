import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { CardLink } from "@/components/common/CardLink";
import type { Program } from "@/types/content";
import { interactiveCardSx } from "@/theme/styles";

export function ProgramCard({ program }: { program: Program }) {
  return (
    <Card sx={{ ...interactiveCardSx, display: "flex", flexDirection: "column" }}>
      <CardLink href={`/obrazovni-profili/${program.slug}`}>
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Box sx={{ position: "relative", height: 160 }}>
            <Image
              src={program.image}
              alt={program.imageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </Box>
          <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1, p: 2.5, "&:last-child": { pb: 2 } }}>
            <Chip label={program.duration} size="small" sx={{ alignSelf: "flex-start", bgcolor: "gold.light", color: "primary.main" }} />
            <Typography variant="h3" component="h3" sx={{ fontSize: "1.15rem", lineHeight: 1.3 }}>
              {program.title}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {program.summary}
            </Typography>
            <Typography sx={{ mt: "auto", pt: 0.5, color: "secondary.main", fontWeight: 700 }}>
              Прочитај више...
            </Typography>
          </CardContent>
        </Box>
      </CardLink>
    </Card>
  );
}
