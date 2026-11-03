import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { LinkButton } from "@/components/common/LinkButton";

export function AdminHeading({
  title,
  description,
  action,
  actions,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
  actions?: { href: string; label: string }[];
}) {
  const buttons = actions ?? (action ? [action] : []);

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
      {buttons.length > 0 ? (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {buttons.map((item, index) => (
            <LinkButton key={item.href} href={item.href} variant={index === 0 ? "contained" : "outlined"}>
              {item.label}
            </LinkButton>
          ))}
        </Box>
      ) : null}
    </Box>
  );
}
