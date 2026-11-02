import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { CardLink } from "@/components/common/CardLink";
import type { Project } from "@/types/content";
import { interactiveCardSx } from "@/theme/styles";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card sx={{ ...interactiveCardSx, display: "flex", flexDirection: "column" }}>
      <CardLink href={`/projekti/${project.slug}`}>
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Box sx={{ position: "relative", height: 112 }}>
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 25vw"
              style={{ objectFit: "cover" }}
            />
          </Box>
          <CardContent
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              gap: 0.75,
              py: 1.5,
              px: 2,
              "&:last-child": { pb: 1.5 },
            }}
          >
            <Typography variant="h3" component="h3" sx={{ fontSize: "1rem", lineHeight: 1.3 }}>
              {project.title}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                fontSize: "0.9rem",
                lineHeight: 1.45,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {project.summary}
            </Typography>
            <Typography sx={{ mt: "auto", pt: 0.5, color: "secondary.main", fontWeight: 700, fontSize: "0.9rem" }}>
              Прочитај више...
            </Typography>
          </CardContent>
        </Box>
      </CardLink>
    </Card>
  );
}
