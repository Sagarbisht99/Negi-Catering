import { getAdminUser } from "@/app/actions/auth";
import { AdminProviders } from "./providers";
import AdminShell from "@/components/admin/AdminShell";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  return (
    <AdminProviders>
      <AdminShell user={user}>{children}</AdminShell>
    </AdminProviders>
  );
}
