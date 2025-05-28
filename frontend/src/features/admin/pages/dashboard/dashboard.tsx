import AdminCharts from "../../components/dashboard/charts";
import AdminKpiCards from "../../components/dashboard/kpi-cards";
import AdminLayout from "../../components/layouts/layout";

export default function AdminDashboard() {
  return (
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tableau de bord administrateur</h1>
            <p className="text-muted-foreground">Vue d'ensemble des statistiques et activités de la plateforme</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-3">
              <AdminKpiCards />
              <div className="mt-8">
                <AdminCharts />
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
  )
}
