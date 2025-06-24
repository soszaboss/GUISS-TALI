import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, UserCheck, Clock, Eye, AlertTriangle, Shield } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Header } from "../../components/layout/Header"
import { Sidebar } from "../../components/layout/Sidebar"
import { employeeAnalytics } from "@/services/analytics"
import { toast } from "sonner"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-employee-analytics"],
    queryFn: () => employeeAnalytics(),
    cacheTime: 0,
    keepPreviousData: true,
    refetchOnWindowFocus: false
  })

  useEffect(() => {
    if (error) {
      toast("Erreur lors du chargement des données", {
        description: "Veuillez réessayer plus tard.",
      })
    }
  }, [error])

  // Calculs KPI dynamiques
  const tonusMoyen = data
    ? (
        ((data.tonus_moyen.tonus_moyen_od ?? 0) + (data.tonus_moyen.tonus_moyen_og ?? 0)) / 2
      ).toFixed(1)
    : "-"

  // Pour la carte "Tonus > 21", on affiche la valeur brute (c'est un nombre)
  const tonusSup21 = data ? data.tonus_superieur_a_21 : "-"

  // Pie chart permis (on suppose que chaque objet a {categorie, nombre, couleur})
  // (Déclaration supprimée pour éviter la redéclaration)

  // Graphiques visites
  const visitesMois = data?.evolution_visites.par_mois || []
  const visitesAnnee = data?.evolution_visites.par_annee || []

  function getRandomColor() {
  // Génère une couleur hexadécimale aléatoire
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

const categoriesPermis = data?.distribution_permis
  ? data.distribution_permis.map((item) => ({
      ...item,
      couleur: getRandomColor(),
    }))
  : [];

  console.log(data)
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1">
        <Header />
        <main className="p-6 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord Médical</h1>
            <p className="text-muted-foreground">Vue d'ensemble des données médicales et statistiques des conducteurs</p>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nombre de Patients</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : data?.nombre_total_patients}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Âge Moyen</CardTitle>
                <Calendar className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mt-4">
                  {isLoading ? "..." : data?.age_moyen} ans
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conducteurs Professionnels</CardTitle>
                <UserCheck className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : data?.nombre_professionnels}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Durée Conduite Moy.</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : data?.duree_moyenne_conduite} ans
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tonus Moyen</CardTitle>
                <Eye className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mt-4">{isLoading ? "..." : tonusMoyen}</div>
                <p className="text-xs text-muted-foreground">OD/OG</p>
              </CardContent>
            </Card>
          </div>

          {/* Alertes KPI */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* <Card className="border-red-200 bg-red-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-800">Cas Incompatibles</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-700">
                  {isLoading ? "..." : data?.nombre_incompatibles}
                </div>
                <p className="text-xs text-red-600">Nécessitent un suivi</p>
              </CardContent>
            </Card> */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-800">Patients à Risque</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-700">
                  {isLoading ? "..." : data?.patients_risque_dossier}
                </div>
                <p className="text-xs text-orange-600">Surveillance renforcée</p>
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tonus moyen &gt; 21</CardTitle>
                <Shield className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-700">
                  {isLoading ? "..." : tonusSup21}
                </div>
                <p className="text-xs text-amber-600">Nombre de cas</p>
              </CardContent>
            </Card>
          </div>

          {/* Graphiques */}
          <Tabs defaultValue="evolution" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="evolution">Évolution</TabsTrigger>
              <TabsTrigger value="repartition">Répartition</TabsTrigger>
              <TabsTrigger value="tonus">Analyse Tonus</TabsTrigger>
            </TabsList>

            <TabsContent value="evolution" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Visites par Mois</CardTitle>
                </CardHeader>
                <CardContent className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={visitesMois}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="periode" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="nombre" stroke="#3b82f6" strokeWidth={3} name="Visites" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Visites par Année</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={visitesAnnee}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="periode" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="nombre" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="repartition" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Catégories de Permis</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoriesPermis}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="nombre"
                        label={({ type_permis, nombre }) => `${type_permis}: ${nombre}`}
                      >
                        {categoriesPermis.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.couleur} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tonus" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tonus Moyen OD/OG</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          oeil: "OD",
                          tonus: data?.tonus_moyen.tonus_moyen_od.toFixed(3) ?? 0,
                        },
                        {
                          oeil: "OG",
                          tonus: data?.tonus_moyen.tonus_moyen_og.toFixed(3) ?? 0,
                        },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="oeil" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="tonus" fill="#10b981" name="Tonus Moyen" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}