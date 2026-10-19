import Box from "@mui/material/Box";

export function SchoolLogo({ size = 48 }: { size?: number }) {
  return (
    <Box
      component="img"
      src="/images/school/LogoETS3.png"
      alt=""
      sx={{ display: "block", flexShrink: 0, height: size, width: "auto", maxWidth: size * 2.6, objectFit: "contain" }}
    />
  );
}
