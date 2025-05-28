import { Outlet } from "react-router-dom";
import AdminLayout from "../../components/layouts/layout";

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}