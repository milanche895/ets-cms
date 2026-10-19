import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/AdminHeading";
import { roleOptions } from "@/components/admin/contentFields";
import { DbNotice } from "@/components/admin/DbNotice";
import { DeleteUserButton } from "@/components/admin/DeleteUserButton";
import { SaveForm } from "@/components/admin/SaveForm";
import { getSession } from "@/lib/current-user";
import { roleLabels } from "@/lib/roles";
import { getUsers } from "@/services/users";

export const metadata: Metadata = { title: "Корисници" };

export default async function AdminUsersPage() {
  const [users, session] = await Promise.all([getUsers(), getSession()]);

  return (
    <>
      <AdminHeading title="Корисници" description="У панел за сада улази само улога администратор." />
      <DbNotice />
      <Typography variant="h2" sx={{ fontSize: "1.15rem", mb: 1.5 }}>
        Нови налог
      </Typography>
      <SaveForm
        endpoint="/api/users"
        redirectTo="/admin/users"
        submitLabel="Додај корисника"
        fields={[
          { name: "name", label: "Име", required: true },
          { name: "email", label: "Е-пошта", type: "email", required: true },
          { name: "password", label: "Лозинка", type: "password", required: true, helperText: "Најмање 8 знакова." },
          { name: "role", label: "Улога", type: "select", value: "AUTHOR", options: roleOptions },
        ]}
      />
      <Box sx={{ mt: 4 }}>
        {users.length === 0 ? (
          <Typography color="text.secondary">Нема корисника у бази.</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Име</TableCell>
                <TableCell>Е-пошта</TableCell>
                <TableCell>Улога</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{roleLabels[user.role]}</TableCell>
                  <TableCell align="right">
                    {session && user.id !== session.id ? <DeleteUserButton id={user.id} /> : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    </>
  );
}
