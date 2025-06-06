import { useState } from "react"
import { DoctorMedicalLayout } from "../layouts/doctor-medical-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, AlertTriangle, Clock, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"

export function DoctorMedicalDashboard() {
  const [searchTerm, setSearchTerm] = useState("")

  // Ces données seraient normalement récupérées depuis une API
  const stats = [
    {
      title: "Total Patients",
      value: "125",
      change: "+8%",
      icon: Users,
    },
    {
      title: "Consultations",
      value: "24",
      change: "+12%",
      icon: Calendar,
    },
    {
      title: "Patients à risque",
      value: "5",
      change: "0%",
      icon: AlertTriangle,
    },
    {
      title: "À finaliser",
      value: "7",
      change: "-3%",
      icon: Clock,
    },
  ]

  const upcomingConsultations = [
    {
      id: 1,
      patient: "Jean Dupont",
      time: "10:00",
      date: "Aujourd'hui",
      type: "Première visite",
    },
    {
      id: 2,
      patient: "Marie Martin",
      time: "11:30",
      date: "Aujourd'hui",
      type: "Suivi",
    },
    {
      id: 3,
      patient: "Pierre Durand",
      time: "14:15",
      date: "Aujourd'hui",
      type: "Contrôle annuel",
    },
  ]

  const alerts = [
    {
      id: 1,
      patient: "Robert Lefebvre",
      message: "Visite bloquée - Attente résultats",
      severity: "high",
    },
    {
      id: 2,
      patient: "Sophie Petit",
      message: "Suivi à programmer",
      severity: "medium",
    },
    {
      id: 3,
      patient: "Michel Dubois",
      message: "Résultats anormaux à vérifier",
      severity: "high",
    },
  ]

  // Liste des patients pour la table
  const patients = [
    {
      id: "1",
      name: "Jean Dupont",
      age: 45,
      permitCategory: "B",
      lastVisit: "15/04/2023",
      nextVisit: "15/10/2023",
      riskLevel: "Modéré",
      status: "Actif",
    },
    {
      id: "2",
      name: "Marie Martin",
      age: 32,
      permitCategory: "B",
      lastVisit: "20/05/2023",
      nextVisit: "20/11/2023",
      riskLevel: "Faible",
      status: "Actif",
    },
    {
      id: "3",
      name: "Pierre Durand",
      age: 58,
      permitCategory: "C",
      lastVisit: "05/03/2023",
      nextVisit: "05/09/2023",
      riskLevel: "Élevé",
      status: "Actif",
    },
    {
      id: "4",
      name: "Sophie Petit",
      age: 29,
      permitCategory: "B",
      lastVisit: "10/06/2023",
      nextVisit: "10/12/2023",
      riskLevel: "Faible",
      status: "Actif",
    },
    {
      id: "5",
      name: "Robert Lefebvre",
      age: 67,
      permitCategory: "B",
      lastVisit: "25/02/2023",
      nextVisit: "25/08/2023",
      riskLevel: "Élevé",
      status: "Actif",
    },
  ]

  // Filtrer les patients en fonction du terme de recherche
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.permitCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.riskLevel.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DoctorMedicalLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                    <p className="text-xs text-gray-500 mt-1">{stat.change} ce mois</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-full">
                    <stat.icon className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table des patients */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Liste des patients</h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un patient..."
                    className="pl-8 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Filtres
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Nom</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Âge</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Permis</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Dernière visite</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Prochaine visite</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Niveau de risque</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{patient.name}</td>
                      <td className="py-3 px-4">{patient.age} ans</td>
                      <td className="py-3 px-4">{patient.permitCategory}</td>
                      <td className="py-3 px-4">{patient.lastVisit}</td>
                      <td className="py-3 px-4">{patient.nextVisit}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            patient.riskLevel === "Élevé"
                              ? "bg-red-100 text-red-800"
                              : patient.riskLevel === "Modéré"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {patient.riskLevel}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/doctor/patients/${patient.id}/medical-record`}>Voir dossier</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPatients.length === 0 && (
              <div className="text-center py-4 text-gray-500">Aucun patient ne correspond à votre recherche</div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graphiques et statistiques */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="categories" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="categories">Catégories de vision</TabsTrigger>
                <TabsTrigger value="symptoms">Symptômes fréquents</TabsTrigger>
                <TabsTrigger value="workload">Charge de travail</TabsTrigger>
              </TabsList>

              <TabsContent value="categories">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Répartition par catégorie de vision</h3>
                    <div className="h-[300px] flex items-center justify-center">
                      <img
                        src="/placeholder.svg?height=300&width=600"
                        alt="Graphique de répartition par catégorie de vision"
                        className="max-w-full h-[100%]"
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      <div className="text-center">
                        <div className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                        <span className="text-sm">Vision normale (65%)</span>
                      </div>
                      <div className="text-center">
                        <div className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                        <span className="text-sm">Vision corrigée (25%)</span>
                      </div>
                      <div className="text-center">
                        <div className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
                        <span className="text-sm">Vision limitée (8%)</span>
                      </div>
                      <div className="text-center">
                        <div className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                        <span className="text-sm">Vision incompatible (2%)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="symptoms">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Fréquence des symptômes signalés</h3>
                    <div className="h-[300px] flex items-center justify-center">
                      <img
                        src="/placeholder.svg?height=300&width=600"
                        alt="Graphique de fréquence des symptômes"
                        className="max-w-full h-[100%]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="workload">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Évolution de la charge de travail</h3>
                    <div className="h-[300px] flex items-center justify-center">
                      <img
                        src="/placeholder.svg?height=300&width=600"
                        alt="Graphique d'évolution de la charge de travail"
                        className="max-w-full h-[100%]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Consultations et alertes */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Consultations à venir</h3>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/doctor/consultations">Voir tout</Link>
                  </Button>
                </div>
                <div className="space-y-3">
                  {upcomingConsultations.map((consultation) => (
                    <div key={consultation.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{consultation.patient}</h4>
                        <div className="text-sm text-gray-600">
                          {consultation.date} à {consultation.time} • {consultation.type}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/doctor/patients/${consultation.id}/medical-record`}>Voir</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Alertes</h3>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/doctor/alerts">Voir tout</Link>
                  </Button>
                </div>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        alert.severity === "high" ? "border-red-500 bg-red-50" : "border-yellow-500 bg-yellow-50"
                      }`}
                    >
                      <h4 className="font-medium">{alert.patient}</h4>
                      <p className="text-sm">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DoctorMedicalLayout>
  )
}
