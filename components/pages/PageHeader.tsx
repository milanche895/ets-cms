import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Box sx={{ bgcolor: "primary.main", color: "primary.contrastText", py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Typography variant="h1" sx={{ fontSize: { xs: "2rem", md: "2.75rem" }, lineHeight: 1.15 }}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography sx={{ mt: 1.5, maxWidth: 680, fontSize: "1.05rem", color: "rgba(255,255,255,0.86)" }}>
            {subtitle}
          </Typography>
        ) : null}
      </Container>
    </Box>
  );
}
