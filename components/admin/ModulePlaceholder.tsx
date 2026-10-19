import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { AdminModule } from "@/config/adminModules";

export function ModulePlaceholder({ module }: { module: AdminModule }) {
  return (
    <Box>
      <Typography variant="h1" sx={{ fontSize: { xs: "1.75rem", md: "2rem" }, mb: 1 }}>
        {module.title}
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 640, mb: 3 }}>
        {module.description}
      </Typography>
      <Alert severity="info">
        Модел и путања су спремни. Форме за унос, измену и брисање долазе у наредној фази, кад овај модул буде задатак на часу.
      </Alert>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h2" sx={{ fontSize: "1.1rem", mb: 2 }}>
          Поља у моделу
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
          {module.fields.map((field) => (
            <Chip key={field} label={field} variant="outlined" />
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
