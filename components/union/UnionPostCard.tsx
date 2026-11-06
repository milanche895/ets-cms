import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { LinkButton } from "@/components/common/LinkButton";
import { unionPostKindLabels } from "@/components/admin/contentFields";
import { formatDate } from "@/lib/format";
import type { UnionPost } from "@/types/content";

export function UnionPostCard({ post, hrefBase = "/sindikat" }: { post: UnionPost; hrefBase?: string }) {
  const when = formatDate(post.startsAt ?? post.publishedAt);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      {post.featuredImage ? (
        <Box component="img" src={post.featuredImage} alt="" sx={{ width: "100%", height: 180, objectFit: "cover" }} />
      ) : null}
      <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", flexGrow: 1, gap: 1.25 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, alignItems: "center" }}>
          <Chip label={unionPostKindLabels[post.kind] ?? post.kind} size="small" color="secondary" variant="outlined" />
          {when ? (
            <Typography variant="body2" color="text.secondary">
              {when}
            </Typography>
          ) : null}
        </Box>
        <Typography variant="h3" component="h3" sx={{ fontSize: "1.2rem", lineHeight: 1.35 }}>
          {post.title}
        </Typography>
        {post.location ? (
          <Typography variant="body2" color="text.secondary">
            {post.location}
          </Typography>
        ) : null}
        {post.excerpt ? (
          <Typography color="text.secondary" sx={{ flexGrow: 1 }}>
            {post.excerpt}
          </Typography>
        ) : null}
        <LinkButton href={`${hrefBase}/${post.slug}`} sx={{ alignSelf: "flex-start", px: 0 }}>
          Прочитај више
        </LinkButton>
      </Box>
    </Box>
  );
}
