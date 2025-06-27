import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts"
import { adminDashboardAnalytics } from "@/services/analytics"
import type { AdminDashboardApiResponse } from "@/types/analytics"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"]

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useQuery<AdminDashboardApiResponse>({
    queryKey: ["dashboard-admin"],
    queryFn: adminDashboardAnalytics,
    refetchOnWindowFocus: false,
  })

  if (isLoading) return <div>Chargement...</div>
  if (error || !data) return <div>Erreur lors du chargement</div>

  const kpis = data.kpis
  const rolesData = data.roles_distribution.map(r => ({
    name: r.role.charAt(0).toUpperCase() + r.role.slice(1),
    value: r.count,
  }))
  const usersPerMonth = data.users_created_per_month.map(item => ({
    month: item.month?.slice(0, 7) ?? "",
    count: item.count,
  }))

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard Administrateur</h1>
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader><CardTitle>Utilisateurs</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{kpis.total_users}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Admins</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{kpis.admins}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Médecins</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{kpis.doctors}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Techniciens</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{kpis.technicians}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Employés</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{kpis.employees}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Actifs</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{kpis.active_users}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Inactifs</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{kpis.inactive_users}</div></CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <Tabs defaultValue="roles">
        <TabsList>
          <TabsTrigger value="roles">Répartition rôles</TabsTrigger>
          <TabsTrigger value="evolution">Nouveaux utilisateurs</TabsTrigger>
        </TabsList>
        <TabsContent value="roles">
          <Card>
            <CardHeader><CardTitle>Répartition des rôles</CardTitle></CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={rolesData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {rolesData.map((_entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="evolution">
          <Card>
            <CardHeader><CardTitle>Utilisateurs créés par mois</CardTitle></CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usersPerMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" name="Nouveaux utilisateurs" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}