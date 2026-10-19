import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { AppIcon } from "@/components/common/AppIcon";
import { CardLink } from "@/components/common/CardLink";
import type { IconName } from "@/types/content";

type OverviewCardProps = {
  title: string;
  description: string;
  href: string;
  icon: IconName;
  value?: number | null;
};

export function OverviewCard({ title, description, href, icon, value }: OverviewCardProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardLink href={href}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            >
              <AppIcon name={icon} fontSize="small" />
            </Box>
            {value !== undefined ? (
              <Typography variant="h3" component="p" sx={{ fontSize: "1.75rem" }}>
                {value === null ? "—" : value}
              </Typography>
            ) : null}
          </Box>
          <Typography variant="h3" component="h2" sx={{ fontSize: "1.1rem", mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardLink>
    </Card>
  );
}
