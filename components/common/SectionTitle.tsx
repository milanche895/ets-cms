import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { LinkButton } from "@/components/common/LinkButton";

type SectionTitleProps = {
  kicker?: string;
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
};

export function SectionTitle({ kicker, title, subtitle, action }: SectionTitleProps) {
  return (
    <Box sx={{ mb: { xs: 3, md: 4.5 }, maxWidth: action ? "none" : 680, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 2 }}>
      <Box sx={{ maxWidth: 680 }}>
      {kicker ? (
        <Typography variant="overline" color="secondary" sx={{ display: "block" }}>
          {kicker}
        </Typography>
      ) : null}
      <Typography
        variant="h2"
        component="h2"
        sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" }, lineHeight: 1.2, mt: 0.5 }}
      >
        {title}
      </Typography>
      <Box sx={{ width: 48, height: 3, bgcolor: "gold.main", borderRadius: 1, mt: 1.5 }} />
      {subtitle ? (
        <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: "1.05rem" }}>
          {subtitle}
        </Typography>
      ) : null}
      </Box>
      {action ? (
        <LinkButton href={action.href} variant="outlined" sx={{ alignSelf: "flex-end" }}>
          {action.label}
        </LinkButton>
      ) : null}
    </Box>
  );
}
