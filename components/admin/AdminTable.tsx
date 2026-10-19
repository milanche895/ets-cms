import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { TextLink } from "@/components/common/TextLink";

export type AdminRow = {
  href?: string;
  cells: string[];
};

export function AdminTable({ headers, rows }: { headers: string[]; rows: AdminRow[] }) {
  if (rows.length === 0) {
    return <Typography color="text.secondary">Нема записа.</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.cells.join("|")} hover>
              {row.cells.map((cell, index) => (
                <TableCell key={`${cell}-${index}`}>
                  {index === 0 && row.href ? <TextLink href={row.href}>{cell}</TextLink> : cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
