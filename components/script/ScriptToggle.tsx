"use client";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useSiteScript } from "@/components/script/ScriptProvider";
import type { SiteScript } from "@/lib/site-script";

const options: Array<{ value: SiteScript; label: string }> = [
  { value: "cyr", label: "Ћир" },
  { value: "lat", label: "Lat" },
];

export function ScriptToggle({ tone = "default" }: { tone?: "default" | "inverse" }) {
  const { script, setScript } = useSiteScript();
  const inverse = tone === "inverse";

  return (
    <Box
      data-script-ignore=""
      role="group"
      aria-label={script === "lat" ? "Ćirilica ili latinica" : "Ћирилица или латиница"}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        flexShrink: 0,
        border: "1px solid",
        borderColor: inverse ? "rgba(255,255,255,0.45)" : "divider",
        borderRadius: 999,
        p: "2px",
      }}
    >
      {options.map((option) => {
        const selected = script === option.value;
        return (
          <Button
            key={option.value}
            size="small"
            aria-pressed={selected}
            onClick={() => setScript(option.value)}
            sx={{
              minWidth: 0,
              px: 1.15,
              py: 0.35,
              borderRadius: 999,
              fontSize: "0.78rem",
              fontWeight: 800,
              lineHeight: 1.2,
              color: selected ? (inverse ? "primary.main" : "primary.contrastText") : inverse ? "inherit" : "text.secondary",
              bgcolor: selected ? (inverse ? "common.white" : "primary.main") : "transparent",
              "&:hover": {
                bgcolor: selected ? (inverse ? "grey.100" : "primary.dark") : inverse ? "rgba(255,255,255,0.14)" : "action.hover",
              },
            }}
          >
            {option.label}
          </Button>
        );
      })}
    </Box>
  );
}
