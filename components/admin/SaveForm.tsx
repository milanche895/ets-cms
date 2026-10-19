"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export type FormField = {
  name: string;
  label: string;
  value?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  helperText?: string;
  type?: "text" | "email" | "password" | "select";
  options?: { value: string; label: string }[];
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

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await send(endpoint, method, values);
      if (redirectTo) {
        router.push(redirectTo);
      }
      router.refresh();
    } catch (caught) {
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
        field.type === "select" ? (
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
