import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

// Données fictives pour les graphiques
const visitData = [
  { name: "Sem 1", visits: 40 },
  { name: "Sem 2", visits: 35 },
  { name: "Sem 3", visits: 50 },
  { name: "Sem 4", visits: 45 },
  { name: "Sem 5", visits: 60 },
  { name: "Sem 6", visits: 55 },
  { name: "Sem 7", visits: 70 },
  { name: "Sem 8", visits: 65 },
]

const diagnosisData = [
  { name: "Vision compatible", value: 65 },
  { name: "Vision avec restrictions", value: 25 },
  { name: "Vision incompatible", value: 10 },
]

const userActivityData = [
  { name: "Lun", techniciens: 12, medecins: 8, assistants: 5 },
  { name: "Mar", techniciens: 15, medecins: 10, assistants: 7 },
  { name: "Mer", techniciens: 10, medecins: 12, assistants: 6 },
  { name: "Jeu", techniciens: 18, medecins: 15, assistants: 8 },
  { name: "Ven", techniciens: 20, medecins: 17, assistants: 10 },
]

const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F"]

export default function AdminCharts() {
  return (
    <Tabs defaultValue="weekly">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Graphiques analytiques</h2>
        <TabsList>
          <TabsTrigger value="weekly">Hebdomadaire</TabsTrigger>
          <TabsTrigger value="monthly">Mensuel</TabsTrigger>
          <TabsTrigger value="yearly">Annuel</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="weekly" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Visites par semaine</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visitData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ paddingTop: "10px" }}
                  />
                  <Line type="monotone" dataKey="visits" stroke="#3b82f6" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>Répartition des diagnostics</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diagnosisData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name.length > 15 ? name.substring(0, 15) + "..." : name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {diagnosisData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ paddingTop: "10px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card> */}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Activité par utilisateur</CardTitle>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ paddingTop: "10px" }}
                />
                <Bar dataKey="techniciens" fill="#3b82f6" />
                <Bar dataKey="medecins" fill="#10b981" />
                <Bar dataKey="assistants" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="monthly">
        <Card>
          <CardHeader>
            <CardTitle>Données mensuelles</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">Sélectionnez une période pour afficher les données mensuelles</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="yearly">
        <Card>
          <CardHeader>
            <CardTitle>Données annuelles</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">Sélectionnez une période pour afficher les données annuelles</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
