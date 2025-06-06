import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar, Download } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useState } from "react"

// Données fictives pour les graphiques
const monthlyData = [
  { name: "Jan", examens: 120, temps: 25 },
  { name: "Fév", examens: 140, temps: 24 },
  { name: "Mar", examens: 160, temps: 23 },
  { name: "Avr", examens: 180, temps: 22 },
  { name: "Mai", examens: 200, temps: 21 },
  { name: "Juin", examens: 220, temps: 20 },
  { name: "Juil", examens: 240, temps: 19 },
  { name: "Août", examens: 230, temps: 20 },
  { name: "Sep", examens: 210, temps: 21 },
  { name: "Oct", examens: 190, temps: 22 },
  { name: "Nov", examens: 170, temps: 23 },
  { name: "Déc", examens: 150, temps: 24 },
]

const examenTypeData = [
  { name: "Acuité visuelle", value: 35 },
  { name: "Réfraction", value: 25 },
  { name: "Tension oculaire", value: 20 },
  { name: "Pachymétrie", value: 10 },
  { name: "Périmétrie", value: 10 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const technicianPerformanceData = [
  { name: "Thomas", examens: 248, temps: 24, completion: 94 },
  { name: "Sophie", examens: 235, temps: 26, completion: 92 },
  { name: "Lucas", examens: 220, temps: 28, completion: 90 },
  { name: "Emma", examens: 210, temps: 25, completion: 88 },
  { name: "Hugo", examens: 200, temps: 27, completion: 86 },
]

export function TechnicianStatisticsPage() {
  const [period, setPeriod] = useState("year")

  return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Statistiques</h1>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="quarter">Ce trimestre</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="exams">Types d'examens</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Examens réalisés</CardTitle>
                  <CardDescription>Nombre d'examens réalisés par mois</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={monthlyData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="examens" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Temps moyen par examen</CardTitle>
                  <CardDescription>Temps moyen en minutes par examen</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="temps" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="exams" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des types d'examens</CardTitle>
                  <CardDescription>Pourcentage par type d'examen</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={examenTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {examenTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Taux de complétion par type d'examen</CardTitle>
                  <CardDescription>Pourcentage de complétion par type</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Acuité", taux: 95 },
                        { name: "Réfraction", taux: 88 },
                        { name: "Tension", taux: 92 },
                        { name: "Pachymétrie", taux: 85 },
                        { name: "Périmétrie", taux: 78 },
                      ]}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="taux" fill="#8884d8" radius={[4, 4, 0, 0]}>
                        {examenTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance des techniciens</CardTitle>
                <CardDescription>Comparaison des performances par technicien</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={technicianPerformanceData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="examens" name="Examens réalisés" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="temps" name="Temps moyen (min)" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="completion" name="Taux de complétion (%)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  )
}
