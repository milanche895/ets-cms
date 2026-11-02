import Box from "@mui/material/Box";
import Image from "next/image";

type ImageCardProps = {
  src: string;
  alt: string;
};

export function ImageCard({ src, alt }: ImageCardProps) {
  return (
    <Box
      sx={{
        position: "relative",
        aspectRatio: "4 / 3",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "primary.main",
      }}
    >
      {src.startsWith("http") ? (
        <Box component="img" src={src} alt={alt} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <Image src={src} alt={alt} fill sizes="(max-width: 900px) 50vw, 33vw" style={{ objectFit: "cover" }} />
      )}
    </Box>
  );
}
