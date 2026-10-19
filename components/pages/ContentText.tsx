import Typography from "@mui/material/Typography";

export function ContentText({ content }: { content: string }) {
  const paragraphs = content.split("\n\n").map((paragraph) => paragraph.trim()).filter(Boolean);

  return paragraphs.map((paragraph) => (
    <Typography key={paragraph.slice(0, 48)} sx={{ mb: 2, fontSize: "1.05rem", whiteSpace: "pre-wrap" }}>
      {paragraph}
    </Typography>
  ));
}
