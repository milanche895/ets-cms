import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { AppIcon } from "@/components/common/AppIcon";
import { Section } from "@/components/common/Section";
import { SectionTitle } from "@/components/common/SectionTitle";
import type { Activity } from "@/types/content";

export function Competitions({
  activities,
  showHeading = true,
}: {
  activities: Activity[];
  showHeading?: boolean;
}) {
  const grid = (
    <Grid container spacing={2.5}>
      {activities.map((activity) => (
        <Grid key={activity.id} size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ display: "flex", gap: 2, p: 2.5 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  flexShrink: 0,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                }}
              >
                <AppIcon name={activity.icon} />
              </Box>
              <Box>
                <Typography variant="h3" component="h3" sx={{ fontSize: "1.15rem", mb: 0.5 }}>
                  {activity.title}
                </Typography>
                <Typography color="text.secondary">{activity.summary}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  if (!showHeading) {
    return <Section>{grid}</Section>;
  }

  return (
    <Section id="takmicenja" tone="gray">
      <SectionTitle
        kicker="Живот школе"
        title="Такмичења и активности"
        subtitle="Роботика, програмирање, такмичења и ученички парламент."
        action={{ href: "/takmicenja", label: "Све активности" }}
      />
      {grid}
    </Section>
  );
}
