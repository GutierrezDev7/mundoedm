import { AdminGuard } from "@/components/admin/AdminGuard";

export const metadata = {
  title: "Admin - Mundo EDM",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>;
}
