import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { SchoolLogo } from "@/components/common/SchoolLogo";
import { brand } from "@/theme/tokens";

export const metadata: Metadata = {
  title: "Пријава",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        py: 4,
        background: `linear-gradient(160deg, ${brand.navyDeep} 0%, ${brand.navy} 55%, ${brand.blue} 140%)`,
      }}
    >
      <Paper sx={{ width: "100%", maxWidth: 440, p: { xs: 3, sm: 4 } }}>
        <Stack spacing={1} sx={{ alignItems: "center", textAlign: "center", mb: 3 }}>
          <SchoolLogo size={64} />
          <Typography variant="h1" sx={{ fontSize: "1.6rem" }}>
            Пријава у CMS
          </Typography>
          <Typography color="text.secondary">
            Електротехничка школа „Михајло Пупин“
          </Typography>
        </Stack>
        <LoginForm />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2.5 }}>
          Налог се прави командом npm run db:seed. Лозинка стоји у .env фајлу, не у коду сајта.
        </Typography>
      </Paper>
    </Box>
  );
}
