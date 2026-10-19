"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function MediaUpload() {
  const router = useRouter();
  const [alt, setAlt] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (!(form.get("file") instanceof File) || (form.get("file") as File).size === 0) {
      setError("Изаберите фајл.");
      return;
    }

    setLoading(true);
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
      setLoading(false);
    }
  }

  return (
    <Stack component="form" spacing={2} onSubmit={onSubmit} sx={{ maxWidth: 520, mb: 3 }}>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <TextField name="file" type="file" required slotProps={{ htmlInput: { accept: "image/jpeg,image/png,image/webp,image/gif,application/pdf" } }} />
      <TextField label="Опис слике" name="alt" value={alt} onChange={(event) => setAlt(event.target.value)} fullWidth />
      <Button type="submit" variant="contained" disabled={loading} sx={{ alignSelf: "flex-start" }}>
        {loading ? "Отпремање..." : "Додај фајл"}
      </Button>
    </Stack>
  );
}
