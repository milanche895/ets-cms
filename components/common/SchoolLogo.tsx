import Box from "@mui/material/Box";
import { brand } from "@/theme/tokens";

export function SchoolLogo({ size = 48 }: { size?: number }) {
  return (
    <Box
      component="svg"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden
      sx={{ display: "block", flexShrink: 0 }}
    >
      <circle cx="32" cy="32" r="31" fill={brand.navy} />
      <circle cx="32" cy="32" r="26.5" fill="none" stroke={brand.gold} strokeWidth="1.6" />
      <path d="M35 14 L24 34 h8.5 L29 50 l15-22 h-9.2 L38 14 z" fill={brand.white} />
    </Box>
  );
}
