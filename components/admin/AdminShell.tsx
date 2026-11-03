"use client";

import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { AppIcon } from "@/components/common/AppIcon";
import { SchoolLogo } from "@/components/common/SchoolLogo";
import { adminModules } from "@/config/adminModules";
import { roleLabels } from "@/lib/roles";
import type { SessionUser } from "@/lib/session";

const drawerWidth = 260;

type AdminShellProps = {
  user: SessionUser;
  children: ReactNode;
};

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const modules = user.role === "UNION" ? [] : adminModules;
  const items = [
    ...(user.role === "UNION"
      ? [
          { href: "/admin/sindikat", label: "Организација", icon: "union" as const, exact: true },
          { href: "/admin/sindikat/obavestenja", label: "Обавештења", icon: "articles" as const, exact: false },
          { href: "/admin/sindikat/aktivnosti", label: "Активности", icon: "trophy" as const, exact: false },
        ]
      : [
          { href: "/admin", label: "Преглед", icon: "dashboard" as const, exact: true },
          ...modules.map((item) => ({
            href: item.href,
            label: item.title,
            icon: item.icon,
            exact: false,
          })),
        ]),
  ];

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar sx={{ gap: 1.25, px: 2 }}>
        <SchoolLogo size={36} />
        <Box>
          <Typography sx={{ fontWeight: 800, lineHeight: 1.2, fontSize: "0.95rem" }}>ЕТШ CMS</Typography>
          <Typography variant="caption" color="text.secondary">
            {roleLabels[user.role]}
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1, py: 1, flexGrow: 1 }}>
        {items.map((item) => {
          const selected = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={selected}
              onClick={() => setMobileOpen(false)}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 38 }}>
                <AppIcon name={item.icon} fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {user.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
          {user.email}
        </Typography>
        <Button startIcon={<LogoutOutlinedIcon />} onClick={logout} color="inherit" size="small">
          Одјава
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="fixed"
        sx={{
          display: { md: "none" },
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Toolbar>
          <IconButton edge="start" aria-label="Отвори мени" onClick={() => setMobileOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography sx={{ fontWeight: 800, ml: 1 }}>ЕТШ CMS</Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: 0 }} aria-label="Админ мени">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width: drawerWidth } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box", borderRight: 1, borderColor: "divider" },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, mt: { xs: 7, md: 0 }, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        {children}
      </Box>
    </Box>
  );
}
