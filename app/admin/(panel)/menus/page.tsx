import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/AdminHeading";
import { DbNotice } from "@/components/admin/DbNotice";
import { SaveForm } from "@/components/admin/SaveForm";
import { formatMenu, getMenuLines } from "@/services/navigation";

export const metadata: Metadata = { title: "Мени" };

export default async function AdminMenusPage() {
  const text = formatMenu(await getMenuLines());

  return (
    <>
      <AdminHeading
        title="Главни мени"
        description="Једна ставка по реду. Редослед у тексту је редослед у менију."
      />
      <DbNotice />
      <SaveForm
        endpoint="/api/menus"
        method="PUT"
        redirectTo="/admin/menus"
        fields={[
          {
            name: "text",
            label: "Ставке",
            multiline: true,
            rows: 10,
            required: true,
            value: text,
            helperText: "Облик: ознака | /путања",
          },
        ]}
      />
    </>
  );
}
