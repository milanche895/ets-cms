import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/AdminHeading";
import { DbNotice } from "@/components/admin/DbNotice";
import { SaveForm } from "@/components/admin/SaveForm";
import { formatFacts, getSiteSettings } from "@/services/site";

export const metadata: Metadata = { title: "Подешавања" };

export default async function AdminSettingsPage() {
  const site = await getSiteSettings();

  return (
    <>
      <AdminHeading
        title="Подешавања"
        description="Назив, контакт и чињенице о школи. Виде се у подножју, на контакту и на страници О школи."
      />
      <DbNotice />
      <SaveForm
        endpoint="/api/settings"
        method="PUT"
        redirectTo="/admin/settings"
        fields={[
          { name: "schoolName", label: "Пун назив", required: true, value: site.schoolName },
          { name: "shortName", label: "Кратак назив", required: true, value: site.shortName },
          { name: "nameLine1", label: "Први ред у заглављу", required: true, value: site.nameLine1 },
          { name: "nameLine2", label: "Други ред у заглављу", required: true, value: site.nameLine2 },
          { name: "location", label: "Место", required: true, value: site.location },
          { name: "tagline", label: "Реченица на почетној", multiline: true, rows: 2, value: site.tagline },
          { name: "aboutTeaser", label: "Кратак текст о школи", multiline: true, rows: 4, value: site.aboutTeaser },
          {
            name: "aboutFacts",
            label: "Чињенице",
            multiline: true,
            rows: 5,
            value: formatFacts(site.aboutFacts),
            helperText: "Свака чињеница у новом реду: ознака | вредност",
          },
          { name: "address", label: "Адреса", value: site.address },
          { name: "city", label: "Град", value: site.city },
          { name: "postalCode", label: "Поштански број", value: site.postalCode },
          { name: "phone", label: "Телефон", value: site.phone },
          { name: "phoneAlt", label: "Други телефон", value: site.phoneAlt ?? "" },
          { name: "email", label: "Е-пошта", type: "email", required: true, value: site.email },
          { name: "facebookUrl", label: "Facebook", value: site.facebookUrl ?? "" },
          { name: "instagramUrl", label: "Instagram", value: site.instagramUrl ?? "" },
          { name: "youtubeUrl", label: "YouTube", value: site.youtubeUrl ?? "" },
          { name: "seoTitle", label: "SEO наслов", value: site.seoTitle },
          { name: "seoDescription", label: "SEO опис", multiline: true, rows: 2, value: site.seoDescription },
        ]}
      />
    </>
  );
}
