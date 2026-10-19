/** Благо подизање картице. Без дугих анимација. */
export const interactiveCardSx = {
  height: "100%",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 16px 40px rgba(12, 35, 64, 0.12)",
  },
};
