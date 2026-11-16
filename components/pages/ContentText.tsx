import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function ContentText({ content }: { content: string }) {
  const paragraphs = content.split("\n\n").map((paragraph) => paragraph.trim()).filter(Boolean);

  return (
    <Box>
      {paragraphs.map((paragraph, index) => {
        if (paragraph.startsWith("## ")) {
          return (
            <Typography
              key={`${index}-${paragraph.slice(3, 32)}`}
              component="h2"
              sx={{ mt: index === 0 ? 0 : 4, mb: 1.5, fontSize: "1.35rem", fontWeight: 700, lineHeight: 1.3 }}
            >
              {paragraph.slice(3)}
            </Typography>
          );
        }

        return (
          <Typography key={`${index}-${paragraph.slice(0, 48)}`} sx={{ mb: 2, fontSize: "1.05rem", whiteSpace: "pre-wrap" }}>
            {paragraph}
          </Typography>
        );
      })}
    </Box>
  );
}
