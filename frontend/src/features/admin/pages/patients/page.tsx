import { Outlet } from "react-router-dom";
import AdminLayout from "../../components/layouts/layout";


export default function AdminPatientsPage() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}
