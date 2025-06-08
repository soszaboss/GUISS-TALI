import { useState } from "react"
import { DoctorMedicalLayout } from "../layouts/doctor-medical-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar, Download, Filter } from "lucide-react"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"

export function DoctorMedicalStatistics() {
  const [period, setPeriod] = useState("month")
  const [category, setCategory] = useState("all")

  // Données pour les graphiques (simulées)
  const visionCategoriesData = [
    { name: "Vision normale", value: 65, color: "#10b981" },
    { name: "Vision corrigée", value: 25, color: "#f59e0b" },
    { name: "Vision limitée", value: 8, color: "#f97316" },
    { name: "Vision incompatible", value: 2, color: "#ef4444" },
  ]

  const symptomsFrequencyData = [
    { name: "Diplopie", count: 12 },
    { name: "Strabisme", count: 8 },
    { name: "Nystagmus", count: 5 },
    { name: "Ptosis", count: 7 },
    { name: "Cataracte", count: 15 },
    { name: "Glaucome", count: 9 },
    { name: "Rétinopathie", count: 11 },
  ]

  const monthlyVisitsData = [
    { name: "Jan", visits: 45 },
    { name: "Fév", visits: 52 },
    { name: "Mar", visits: 48 },
    { name: "Avr", visits: 61 },
    { name: "Mai", visits: 55 },
    { name: "Juin", visits: 67 },
    { name: "Juil", visits: 70 },
    { name: "Août", visits: 62 },
    { name: "Sep", visits: 75 },
    { name: "Oct", visits: 68 },
    { name: "Nov", visits: 71 },
    { name: "Déc", visits: 78 },
  ]

  const ageDistributionData = [
    { name: "18-25", count: 15 },
    { name: "26-35", count: 28 },
    { name: "36-45", count: 32 },
    { name: "46-55", count: 45 },
    { name: "56-65", count: 38 },
    { name: "66+", count: 22 },
  ]

  const permitCategoriesData = [
    { name: "A", value: 15, color: "#3b82f6" },
    { name: "B", value: 65, color: "#10b981" },
    { name: "C", value: 12, color: "#f59e0b" },
    { name: "D", value: 8, color: "#8b5cf6" },
  ]

  const riskLevelTrendsData = [
    { month: "Jan", high: 8, medium: 15, low: 22 },
    { month: "Fév", high: 7, medium: 16, low: 29 },
    { month: "Mar", high: 9, medium: 14, low: 25 },
    { month: "Avr", high: 10, medium: 18, low: 33 },
    { month: "Mai", high: 8, medium: 20, low: 27 },
    { month: "Juin", high: 11, medium: 19, low: 37 },
  ]

  return (
    <DoctorMedicalLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Statistiques</h1>
          <div className="flex items-center space-x-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="quarter">Ce trimestre</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
                <SelectItem value="all">Toutes les données</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Période personnalisée
            </Button>
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Filtres
            </Button>
            <Button variant="outline" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="vision">Catégories de vision</TabsTrigger>
            <TabsTrigger value="symptoms">Symptômes</TabsTrigger>
            <TabsTrigger value="demographics">Démographie</TabsTrigger>
            <TabsTrigger value="risk">Niveaux de risque</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par catégorie de vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={visionCategoriesData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {visionCategoriesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Visites mensuelles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyVisitsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="visits" stroke="#3b82f6" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fréquence des symptômes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={symptomsFrequencyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tendances des niveaux de risque</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={riskLevelTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="high" stroke="#ef4444" />
                        <Line type="monotone" dataKey="medium" stroke="#f59e0b" />
                        <Line type="monotone" dataKey="low" stroke="#10b981" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vision">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Répartition détaillée par catégorie de vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={visionCategoriesData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value, percent }) => `${name}: ${value}% (${(percent * 100).toFixed(1)}%)`}
                        >
                          {visionCategoriesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Évolution des catégories de vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: "Jan", normale: 62, corrigee: 28, limitee: 8, incompatible: 2 },
                          { month: "Fév", normale: 60, corrigee: 30, limitee: 7, incompatible: 3 },
                          { month: "Mar", normale: 65, corrigee: 25, limitee: 8, incompatible: 2 },
                          { month: "Avr", normale: 63, corrigee: 27, limitee: 9, incompatible: 1 },
                          { month: "Mai", normale: 67, corrigee: 24, limitee: 7, incompatible: 2 },
                          { month: "Juin", normale: 64, corrigee: 26, limitee: 8, incompatible: 2 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="normale" stroke="#10b981" />
                        <Line type="monotone" dataKey="corrigee" stroke="#f59e0b" />
                        <Line type="monotone" dataKey="limitee" stroke="#f97316" />
                        <Line type="monotone" dataKey="incompatible" stroke="#ef4444" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Comparaison par tranche d'âge</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { age: "18-25", normale: 75, corrigee: 20, limitee: 5, incompatible: 0 },
                          { age: "26-35", normale: 70, corrigee: 25, limitee: 4, incompatible: 1 },
                          { age: "36-45", normale: 65, corrigee: 25, limitee: 8, incompatible: 2 },
                          { age: "46-55", normale: 60, corrigee: 30, limitee: 8, incompatible: 2 },
                          { age: "56-65", normale: 55, corrigee: 30, limitee: 12, incompatible: 3 },
                          { age: "66+", normale: 45, corrigee: 35, limitee: 15, incompatible: 5 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="age" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="normale" stackId="a" fill="#10b981" />
                        <Bar dataKey="corrigee" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="limitee" stackId="a" fill="#f97316" />
                        <Bar dataKey="incompatible" stackId="a" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="symptoms">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Fréquence des symptômes signalés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={symptomsFrequencyData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Évolution des symptômes principaux</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: "Jan", diplopie: 8, strabisme: 5, nystagmus: 3, ptosis: 4 },
                          { month: "Fév", diplopie: 10, strabisme: 6, nystagmus: 4, ptosis: 5 },
                          { month: "Mar", diplopie: 9, strabisme: 7, nystagmus: 3, ptosis: 6 },
                          { month: "Avr", diplopie: 12, strabisme: 8, nystagmus: 5, ptosis: 7 },
                          { month: "Mai", diplopie: 11, strabisme: 7, nystagmus: 4, ptosis: 5 },
                          { month: "Juin", diplopie: 13, strabisme: 9, nystagmus: 6, ptosis: 8 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="diplopie" stroke="#3b82f6" />
                        <Line type="monotone" dataKey="strabisme" stroke="#8b5cf6" />
                        <Line type="monotone" dataKey="nystagmus" stroke="#ec4899" />
                        <Line type="monotone" dataKey="ptosis" stroke="#f97316" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Corrélation symptômes / catégories de vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { symptom: "Diplopie", normale: 10, corrigee: 40, limitee: 35, incompatible: 15 },
                          { symptom: "Strabisme", normale: 15, corrigee: 45, limitee: 30, incompatible: 10 },
                          { symptom: "Nystagmus", normale: 5, corrigee: 35, limitee: 40, incompatible: 20 },
                          { symptom: "Ptosis", normale: 20, corrigee: 50, limitee: 25, incompatible: 5 },
                          { symptom: "Cataracte", normale: 5, corrigee: 30, limitee: 45, incompatible: 20 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="symptom" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="normale" stackId="a" fill="#10b981" />
                        <Bar dataKey="corrigee" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="limitee" stackId="a" fill="#f97316" />
                        <Bar dataKey="incompatible" stackId="a" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="demographics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribution par âge</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ageDistributionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Répartition par catégorie de permis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={permitCategoriesData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {permitCategoriesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Kilométrage annuel moyen par tranche d'âge</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { age: "18-25", kilometrage: 12000 },
                          { age: "26-35", kilometrage: 18000 },
                          { age: "36-45", kilometrage: 20000 },
                          { age: "46-55", kilometrage: 15000 },
                          { age: "56-65", kilometrage: 10000 },
                          { age: "66+", kilometrage: 5000 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="age" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="kilometrage" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fréquence de conduite de nuit par tranche d'âge</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { age: "18-25", jamais: 10, occasionnel: 20, regulier: 40, frequent: 30 },
                          { age: "26-35", jamais: 5, occasionnel: 15, regulier: 45, frequent: 35 },
                          { age: "36-45", jamais: 10, occasionnel: 25, regulier: 40, frequent: 25 },
                          { age: "46-55", jamais: 15, occasionnel: 35, regulier: 35, frequent: 15 },
                          { age: "56-65", jamais: 25, occasionnel: 40, regulier: 25, frequent: 10 },
                          { age: "66+", jamais: 45, occasionnel: 35, regulier: 15, frequent: 5 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="age" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="jamais" stackId="a" fill="#94a3b8" />
                        <Bar dataKey="occasionnel" stackId="a" fill="#60a5fa" />
                        <Bar dataKey="regulier" stackId="a" fill="#3b82f6" />
                        <Bar dataKey="frequent" stackId="a" fill="#1d4ed8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risk">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Évolution des niveaux de risque</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={riskLevelTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="high" name="Risque élevé" stroke="#ef4444" strokeWidth={2} />
                        <Line type="monotone" dataKey="medium" name="Risque modéré" stroke="#f59e0b" strokeWidth={2} />
                        <Line type="monotone" dataKey="low" name="Risque faible" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Répartition des niveaux de risque par catégorie de permis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { permis: "A", eleve: 10, modere: 25, faible: 65 },
                          { permis: "B", eleve: 8, modere: 22, faible: 70 },
                          { permis: "C", eleve: 15, modere: 30, faible: 55 },
                          { permis: "D", eleve: 20, modere: 35, faible: 45 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="permis" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="eleve" name="Risque élevé" stackId="a" fill="#ef4444" />
                        <Bar dataKey="modere" name="Risque modéré" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="faible" name="Risque faible" stackId="a" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Corrélation entre accidents et niveau de risque</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { accidents: "0", eleve: 5, modere: 15, faible: 80 },
                          { accidents: "1", eleve: 15, modere: 35, faible: 50 },
                          { accidents: "2", eleve: 40, modere: 45, faible: 15 },
                          { accidents: "3+", eleve: 75, modere: 20, faible: 5 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="accidents" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="eleve" name="Risque élevé" stackId="a" fill="#ef4444" />
                        <Bar dataKey="modere" name="Risque modéré" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="faible" name="Risque faible" stackId="a" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DoctorMedicalLayout>
  )
}
