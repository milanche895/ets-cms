import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/AdminHeading";
import { DbNotice } from "@/components/admin/DbNotice";
import { DeleteRecordButton } from "@/components/admin/DeleteRecordButton";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { getMedia } from "@/services/gallery";

export const metadata: Metadata = { title: "Медији" };

export default async function AdminMediaPage() {
  const items = await getMedia();

  return (
    <>
      <AdminHeading
        title="Медији"
        description="Слике из овог списка приказују се у галерији. Адресу слике можете унети и у вести."
      />
      <DbNotice />
      <MediaUpload />
      {items.length === 0 ? (
        <Typography color="text.secondary">Нема фајлова.</Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Фајл</TableCell>
              <TableCell>Адреса</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    {item.mimeType.startsWith("image/") ? (
                      <Box component="img" src={item.url} alt="" sx={{ width: 56, height: 40, objectFit: "cover", borderRadius: 1 }} />
                    ) : null}
                    {item.alt || item.filename}
                  </Box>
                </TableCell>
                <TableCell>{item.url}</TableCell>
                <TableCell align="right">
                  <DeleteRecordButton endpoint={`/api/media/${item.id}`} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
