import type { Metadata } from "next";
import { UnionPostEditor } from "@/components/admin/UnionPostEditor";

export const metadata: Metadata = { title: "Нова активност" };

export default function NewUnionActivityPage() {
  return <UnionPostEditor kind="ACTIVITY" />;
}
