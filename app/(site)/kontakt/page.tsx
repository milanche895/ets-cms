import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import { Section } from "@/components/common/Section";
import { PageHeader } from "@/components/pages/PageHeader";
import { phoneHref } from "@/lib/format";
import { getSiteSettings } from "@/services/site";

export const metadata: Metadata = {
  title: "Контакт",
  description: "Адреса, телефон и е-пошта Електротехничке школе „Михајло Пупин“.",
};

export default async function ContactPage() {
  const site = await getSiteSettings();

  const rows = [
    { label: "Адреса", value: `${site.address}, ${site.city} ${site.postalCode}` },
    { label: "Телефон", value: site.phone, href: phoneHref(site.phone) },
    ...(site.phoneAlt ? [{ label: "Телефон", value: site.phoneAlt, href: phoneHref(site.phoneAlt) }] : []),
    { label: "Е-пошта", value: site.email, href: `mailto:${site.email}` },
  ];

  return (
    <>
      <PageHeader title="Контакт" subtitle="Пишите нам или нас позовите. Одговорићемо у најкраћем року." />
      <Section>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            maxWidth: 860,
          }}
        >
          {rows.map((row) => (
            <Box key={`${row.label}-${row.value}`} sx={{ border: 1, borderColor: "divider", borderRadius: 2, p: 2.5 }}>
              <Typography variant="overline" color="secondary">
                {row.label}
              </Typography>
              {row.href ? (
                <Link href={row.href} underline="hover" sx={{ display: "block", fontWeight: 700, fontSize: "1.1rem" }}>
                  {row.value}
                </Link>
              ) : (
                <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>{row.value}</Typography>
              )}
            </Box>
          ))}
        </Box>
      </Section>
    </>
  );
}
