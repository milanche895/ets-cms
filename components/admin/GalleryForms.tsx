"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function GalleryForms() {
  const router = useRouter();
  const [alt, setAlt] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"photo" | "video" | "">("");

  async function addPhoto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) {
      setError("Изаберите слику.");
      return;
    }

    setLoading("photo");
    setError("");
    try {
      const response = await fetch("/api/media", { method: "POST", body: form });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Отпремање није успело.");
        return;
      }
      setAlt("");
      event.currentTarget.reset();
      router.refresh();
    } catch {
      setError("Отпремање није успело.");
    } finally {
      setLoading("");
    }
  }

  async function addVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading("video");
    setError("");
    try {
      const response = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: videoUrl, alt: videoTitle }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Снимак није додат.");
        return;
      }
      setVideoUrl("");
      setVideoTitle("");
      router.refresh();
    } catch {
      setError("Снимак није додат.");
    } finally {
      setLoading("");
    }
  }

  return (
    <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, mb: 4, maxWidth: 980 }}>
      {error ? <Alert severity="error" sx={{ gridColumn: "1 / -1" }}>{error}</Alert> : null}
      <Stack component="form" spacing={2} onSubmit={addPhoto}>
        <Typography sx={{ fontWeight: 800 }}>Нова фотографија</Typography>
        <TextField name="file" type="file" required slotProps={{ htmlInput: { accept: "image/jpeg,image/png,image/webp,image/gif" } }} />
        <TextField label="Опис" name="alt" value={alt} onChange={(event) => setAlt(event.target.value)} fullWidth />
        <Button type="submit" variant="contained" disabled={loading !== ""} sx={{ alignSelf: "flex-start" }}>
          {loading === "photo" ? "Отпремање..." : "Додај фотографију"}
        </Button>
      </Stack>
      <Stack component="form" spacing={2} onSubmit={addVideo}>
        <Typography sx={{ fontWeight: 800 }}>Нови видео</Typography>
        <TextField
          label="YouTube адреса"
          value={videoUrl}
          onChange={(event) => setVideoUrl(event.target.value)}
          required
          fullWidth
          placeholder="https://www.youtube.com/watch?v="
        />
        <TextField label="Назив" value={videoTitle} onChange={(event) => setVideoTitle(event.target.value)} fullWidth />
        <Button type="submit" variant="contained" disabled={loading !== ""} sx={{ alignSelf: "flex-start" }}>
          {loading === "video" ? "Чување..." : "Додај видео"}
        </Button>
      </Stack>
    </Box>
  );
}
