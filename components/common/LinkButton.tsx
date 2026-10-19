"use client";

import Button from "@mui/material/Button";
import type { ButtonProps } from "@mui/material/Button";
import Link from "next/link";

type LinkButtonProps = {
  href: string;
} & Omit<ButtonProps, "href">;

/** Дугме које води на адресу. Линк остаје у клијент компоненти. */
export function LinkButton({ href, ...props }: LinkButtonProps) {
  return <Button component={Link} href={href} {...props} />;
}
