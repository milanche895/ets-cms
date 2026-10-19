import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { AppIcon } from "@/components/common/AppIcon";
import type { Program } from "@/types/content";
import { interactiveCardSx } from "@/theme/styles";

export function ProgramCard({ program }: { program: Program }) {
  return (
    <Card sx={interactiveCardSx}>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            bgcolor: "secondary.main",
            color: "secondary.contrastText",
            mb: 2,
          }}
        >
          <AppIcon name={program.icon} />
        </Box>
        <Chip label={program.duration} size="small" sx={{ mb: 1.5, bgcolor: "gold.light", color: "primary.main" }} />
        <Typography variant="h3" component="h3" sx={{ fontSize: "1.25rem", mb: 1 }}>
          {program.title}
        </Typography>
        <Typography color="text.secondary">{program.summary}</Typography>
      </CardContent>
    </Card>
  );
}
