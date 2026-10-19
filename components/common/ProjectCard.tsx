import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import type { Project } from "@/types/content";
import { interactiveCardSx } from "@/theme/styles";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card sx={{ ...interactiveCardSx, display: "flex", flexDirection: "column" }}>
      <Box sx={{ position: "relative", height: 170 }}>
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 25vw"
          style={{ objectFit: "cover" }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h3" component="h3" sx={{ fontSize: "1.15rem", mb: 1 }}>
          {project.title}
        </Typography>
        <Typography color="text.secondary">{project.summary}</Typography>
      </CardContent>
    </Card>
  );
}
