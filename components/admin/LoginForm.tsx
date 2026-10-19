"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Пријава није успела.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Пријава није успела. Проверите везу и покушајте поново.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack component="form" spacing={2} onSubmit={onSubmit}>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <TextField
        label="Е-пошта"
        type="email"
        name="email"
        autoComplete="username"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Лозинка"
        type="password"
        name="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        fullWidth
        slotProps={{ htmlInput: { minLength: 8 } }}
      />
      <Button type="submit" variant="contained" size="large" disabled={loading}>
        {loading ? "Пријава..." : "Пријави се"}
      </Button>
    </Stack>
  );
}
