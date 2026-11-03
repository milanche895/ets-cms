import Stack from "@mui/material/Stack";
import { LinkButton } from "@/components/common/LinkButton";

const links = [
  { key: "profile", href: "/admin/sindikat", label: "Организација" },
  { key: "announcements", href: "/admin/sindikat/obavestenja", label: "Обавештења" },
  { key: "activities", href: "/admin/sindikat/aktivnosti", label: "Активности" },
] as const;

export function UnionNav({ current }: { current: (typeof links)[number]["key"] }) {
  return (
    <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
      {links.map((item) => (
        <LinkButton key={item.key} href={item.href} variant={current === item.key ? "contained" : "outlined"} size="small">
          {item.label}
        </LinkButton>
      ))}
    </Stack>
  );
}
