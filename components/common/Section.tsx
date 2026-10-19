import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  children: ReactNode;
  tone?: "white" | "gray";
};

export function Section({ id, children, tone = "white" }: SectionProps) {
  return (
    <Box
      component="section"
      id={id}
      sx={{
        py: { xs: 6, md: 9 },
        bgcolor: tone === "gray" ? "background.default" : "background.paper",
        scrollMarginTop: { xs: "88px", lg: "132px" },
      }}
    >
      <Container maxWidth="lg">{children}</Container>
    </Box>
  );
}
