import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { getSession } from "@/lib/current-user";
import { canAccessAdmin } from "@/lib/roles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session || !canAccessAdmin(session.role)) {
    redirect("/admin/login");
  }

  return <AdminShell user={session}>{children}</AdminShell>;
}
