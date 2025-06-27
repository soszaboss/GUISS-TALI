import AdminKpiCards from "../../components/dashboard/kpi-cards";
import AdminLayout from "../../components/layouts/layout";

export default function AdminDashboard() {
  return (
      <AdminLayout>
        <div className="space-y-8">
          <AdminKpiCards />
        </div>
      </AdminLayout>
  )
}
