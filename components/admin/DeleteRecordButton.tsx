"use client";

import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteRecordButton({ endpoint, label = "Обриши" }: { endpoint: string; label?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    if (!window.confirm("Обрисати овај запис?")) {
      return;
    }
    setLoading(true);
    const response = await fetch(endpoint, { method: "DELETE" });
    setLoading(false);
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      window.alert(data.error ?? "Брисање није успело.");
      return;
    }
    router.refresh();
  }

  return (
    <Button size="small" color="error" onClick={onClick} disabled={loading}>
      {label}
    </Button>
  );
}
