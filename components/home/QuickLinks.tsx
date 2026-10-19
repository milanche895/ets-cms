import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { AppIcon } from "@/components/common/AppIcon";
import { CardLink } from "@/components/common/CardLink";
import type { QuickLink } from "@/types/content";

export function QuickLinks({ links }: { links: QuickLink[] }) {
  return (
    <Grid container spacing={2}>
      {links.map((link) => (
        <Grid key={link.href} size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardLink href={link.href}>
              <CardContent sx={{ p: 2.5 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    mb: 1.5,
                  }}
                >
                  <AppIcon name={link.icon} />
                </Box>
                <Typography variant="h3" component="h2" sx={{ fontSize: "1.1rem", mb: 0.75 }}>
                  {link.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {link.description}
                </Typography>
              </CardContent>
            </CardLink>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
