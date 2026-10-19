import Alert from "@mui/material/Alert";
import { isDatabaseAvailable } from "@/lib/database";

export async function DbNotice() {
  if (await isDatabaseAvailable()) {
    return null;
  }

  return (
    <Alert severity="warning" sx={{ mb: 2 }}>
      База није доступна, па се приказују пример подаци. Измене се чувају тек кад је MongoDB доступна и после npm run db:setup.
    </Alert>
  );
}
