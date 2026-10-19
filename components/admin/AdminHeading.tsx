import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { LinkButton } from "@/components/common/LinkButton";

export function AdminHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, mb: 2, flexWrap: "wrap" }}>
      <Box>
        <Typography variant="h1" sx={{ fontSize: { xs: "1.75rem", md: "2rem" } }}>
          {title}
        </Typography>
        {description ? (
          <Typography color="text.secondary" sx={{ mt: 0.5, maxWidth: 640 }}>
            {description}
          </Typography>
        ) : null}
      </Box>
      {action ? (
        <LinkButton href={action.href} variant="contained">
          {action.label}
        </LinkButton>
      ) : null}
    </Box>
  );
}
