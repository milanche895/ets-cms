"use client";

import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { ScriptToggle } from "@/components/script/ScriptToggle";
import type { NavItem } from "@/types/content";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  schoolName: string;
};

export function MobileNav({ open, onClose, items, schoolName }: MobileNavProps) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose} ModalProps={{ keepMounted: true }}>
      <Box sx={{ width: 300, p: 2 }} role="navigation" aria-label="Мобилни мени">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, pr: 1 }}>
            {schoolName}
          </Typography>
          <IconButton aria-label="Затвори мени" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ px: 1, py: 1.5 }}>
          <Typography variant="overline" sx={{ display: "block", mb: 0.75, color: "text.secondary" }}>
            Писмо
          </Typography>
          <ScriptToggle />
        </Box>
        <Divider />
        <List>
          {items.map((item) => (
            <ListItemButton key={item.href} component={Link} href={item.href} onClick={onClose}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
