"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxImageBytes = 8 * 1024 * 1024;

export type FormField = {
  name: string;
  label: string;
  value?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  helperText?: string;
  type?: "text" | "email" | "password" | "select" | "image" | "date";
  options?: { value: string; label: string }[];
  imageFit?: "cover" | "contain";
};

type SaveFormProps = {
  endpoint: string;
  method?: "POST" | "PUT";
  fields: FormField[];
  redirectTo?: string;
  deleteEndpoint?: string;
  submitLabel?: string;
};

export function SaveForm({
  endpoint,
  method = "POST",
  fields,
  redirectTo,
  deleteEndpoint,
  submitLabel = "Сачувај",
}: SaveFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.name, field.value ?? ""])),
  );
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(url: string, httpMethod: string, body?: unknown) {
    const response = await fetch(url, {
      method: httpMethod,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      throw new Error(data.error ?? "Радња није успела.");
    }
  }

  async function uploadImage(file: File): Promise<string> {
    const body = new FormData();
    body.set("file", file);
    const response = await fetch("/api/uploads", { method: "POST", body });
    const data = (await response.json().catch(() => ({}))) as { url?: string; error?: string };
    if (!response.ok || !data.url) {
      throw new Error(data.error ?? "Отпремање слике није успело.");
    }
    return data.url;
  }

  function chooseImage(name: string, file: File | null) {
    if (file && (!imageTypes.has(file.type) || file.size > maxImageBytes)) {
      setError("Дозвољене су слике JPG, PNG, WEBP и GIF, до 8 MB.");
      return;
    }
    setError("");
    setFiles((current) => ({ ...current, [name]: file }));
    setPreviews((current) => {
      const previous = current[name];
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return { ...current, [name]: file ? URL.createObjectURL(file) : "" };
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const payload = { ...values };
    const uploaded: string[] = [];

    try {
      for (const field of fields) {
        const file = files[field.name];
        if (field.type !== "image" || !file) {
          continue;
        }
        const url = await uploadImage(file);
        uploaded.push(url);
        payload[field.name] = url;
      }
      await send(endpoint, method, payload);
      if (redirectTo) {
        router.push(redirectTo);
      }
      router.refresh();
    } catch (caught) {
      await Promise.all(
        uploaded.map((url) =>
          fetch("/api/uploads", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
          }).catch(() => undefined),
        ),
      );
      setError(caught instanceof Error ? caught.message : "Чување није успело.");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    if (!deleteEndpoint || !window.confirm("Обрисати овај запис?")) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      await send(deleteEndpoint, "DELETE");
      router.push(redirectTo ?? "/admin");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Брисање није успело.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack component="form" spacing={2} onSubmit={onSubmit} sx={{ maxWidth: 760 }}>
      {error ? <Alert severity="error">{error}</Alert> : null}
      {fields.map((field) =>
        field.type === "image" ? (
          <Stack key={field.name} spacing={1}>
            <Typography variant="body2">{field.label}</Typography>
            {previews[field.name] || values[field.name] ? (
              <Box
                component="img"
                src={previews[field.name] || values[field.name]}
                alt=""
                sx={{
                  width: field.imageFit === "contain" ? "auto" : 240,
                  maxWidth: 240,
                  height: field.imageFit === "contain" ? 120 : 150,
                  objectFit: field.imageFit ?? "cover",
                  borderRadius: 1,
                  bgcolor: "background.default",
                }}
              />
            ) : null}
            <Stack direction="row" spacing={1}>
              <Button component="label" variant="outlined">
                {values[field.name] || files[field.name] ? "Промени слику" : "Додај слику"}
                <input
                  hidden
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(event) => chooseImage(field.name, event.target.files?.[0] ?? null)}
                />
              </Button>
              {values[field.name] || files[field.name] ? (
                <Button
                  type="button"
                  color="inherit"
                  onClick={() => {
                    chooseImage(field.name, null);
                    setValues((current) => ({ ...current, [field.name]: "" }));
                  }}
                >
                  Уклони
                </Button>
              ) : null}
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {field.helperText ?? "JPG, PNG, WEBP или GIF, до 8 MB."}
            </Typography>
          </Stack>
        ) : field.type === "date" ? (
          <TextField
            key={field.name}
            label={field.label}
            name={field.name}
            type="date"
            value={values[field.name] ?? ""}
            onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
            required={field.required}
            helperText={field.helperText}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        ) : field.type === "select" ? (
          <TextField
            key={field.name}
            select
            label={field.label}
            name={field.name}
            value={values[field.name] ?? ""}
            onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
            required={field.required}
            helperText={field.helperText}
            fullWidth
          >
            {(field.options ?? []).map((option) => (
              <MenuItem key={option.value || "empty"} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <TextField
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type ?? "text"}
            value={values[field.name] ?? ""}
            onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
            required={field.required}
            helperText={field.helperText}
            multiline={field.multiline}
            rows={field.rows}
            fullWidth
          />
        ),
      )}
      <Stack direction="row" spacing={1}>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Чување..." : submitLabel}
        </Button>
        {deleteEndpoint ? (
          <Button type="button" color="error" variant="outlined" onClick={onDelete} disabled={loading}>
            Обриши
          </Button>
        ) : null}
      </Stack>
    </Stack>
  );
}
