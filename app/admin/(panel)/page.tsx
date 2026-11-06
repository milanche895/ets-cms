import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OverviewCard } from "@/components/admin/OverviewCard";
import { LinkButton } from "@/components/common/LinkButton";
import { adminModules } from "@/config/adminModules";
import { getSession } from "@/lib/current-user";
import { roleLabels } from "@/lib/roles";
import { getDashboardCounts } from "@/services/dashboard";

export const metadata: Metadata = {
  title: "Контролна табла",
};

const countBySlug = {
  articles: "articles",
  categories: "categories",
  users: "users",
  menus: "menus",
  sindikat: "unionPosts",
  parlament: "parliamentPosts",
  aktive: "aktivPosts",
  media: "gallery",
} as const;

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const counts = await getDashboardCounts();

  return (
    <Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h1" sx={{ fontSize: { xs: "1.75rem", md: "2.1rem" } }}>
            Контролна табла
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Здраво, {session.name}. Садржај сајта мењате у модулима испод.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip label={roleLabels[session.role]} color="primary" />
          <LinkButton href="/" variant="outlined">
            Отвори сајт
          </LinkButton>
        </Box>
      </Box>

      {!counts.connected ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
          База још није повезана. Почетна страна и даље ради са пример подацима. Проверите DATABASE_URL, па команде из README-а.
        </Alert>
      ) : null}

      <Grid container spacing={2}>
        {adminModules
          .filter((module) => {
            if (session.role === "UNION") {
              return module.slug === "sindikat";
            }
            if (session.role === "PARLIAMENT") {
              return module.slug === "parlament";
            }
            if (session.role === "AKTIV") {
              return module.slug === "aktive";
            }
            return session.role === "ADMIN";
          })
          .map((module) => {
          const countKey = module.slug in countBySlug ? countBySlug[module.slug as keyof typeof countBySlug] : undefined;
          const value = countKey ? counts[countKey] : undefined;

          return (
            <Grid key={module.slug} size={{ xs: 12, sm: 6, lg: 3 }}>
              <OverviewCard
                title={module.title}
                description={module.description}
                href={module.href}
                icon={module.icon}
                value={value}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
