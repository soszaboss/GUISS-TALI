import { useState } from "react"
import { DoctorMedicalLayout } from "../layouts/doctor-medical-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, List, Clock, Eye } from "lucide-react"
import { Link } from "react-router-dom"

export function DoctorMedicalConsultations() {
  const [view, setView] = useState("list")

  // Ces données seraient normalement récupérées depuis une API
  const consultations = [
    {
      id: "1",
      patient: "Jean Dupont",
      time: "10:00",
      date: "15/05/2023",
      type: "Première visite",
      status: "Confirmé",
    },
    {
      id: "2",
      patient: "Marie Martin",
      time: "11:30",
      date: "15/05/2023",
      type: "Suivi",
      status: "Confirmé",
    },
    {
      id: "3",
      patient: "Pierre Durand",
      time: "14:15",
      date: "15/05/2023",
      type: "Contrôle annuel",
      status: "Confirmé",
    },
    {
      id: "4",
      patient: "Sophie Petit",
      time: "15:30",
      date: "15/05/2023",
      type: "Suivi",
      status: "En attente",
    },
    {
      id: "5",
      patient: "Robert Lefebvre",
      time: "09:00",
      date: "16/05/2023",
      type: "Contrôle annuel",
      status: "Confirmé",
    },
    {
      id: "6",
      patient: "Michel Dubois",
      time: "10:30",
      date: "16/05/2023",
      type: "Suivi",
      status: "Confirmé",
    },
    {
      id: "7",
      patient: "Jeanne Moreau",
      time: "14:00",
      date: "16/05/2023",
      type: "Première visite",
      status: "Confirmé",
    },
    {
      id: "8",
      patient: "Paul Leroy",
      time: "16:00",
      date: "16/05/2023",
      type: "Suivi",
      status: "En attente",
    },
  ]

  return (
    <DoctorMedicalLayout>
      <div className="p-6">

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <Button
              variant={view === "calendar" ? "default" : "outline"}
              className="flex items-center gap-2"
              onClick={() => setView("calendar")}
            >
              <Calendar className="h-4 w-4" />
              Calendrier
            </Button>
            <Button
              variant={view === "list" ? "default" : "outline"}
              className="flex items-center gap-2"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
              Liste
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Aujourd'hui
            </Button>
            <div className="flex">
              <Button variant="outline" size="sm">
                &lt;
              </Button>
              <Button variant="outline" size="sm">
                &gt;
              </Button>
            </div>
            <span className="text-sm font-medium">15 - 21 Mai 2023</span>
          </div>
        </div>

        {view === "calendar" ? (
          <Card>
            <CardContent className="p-6">
              <div className="h-[600px] flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">Vue calendrier à implémenter</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="today">
            <TabsList className="mb-6">
              <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
              <TabsTrigger value="tomorrow">Demain</TabsTrigger>
              <TabsTrigger value="week">Cette semaine</TabsTrigger>
              <TabsTrigger value="all">Toutes</TabsTrigger>
            </TabsList>

            <TabsContent value="today">
              <Card>
                <CardHeader>
                  <CardTitle>Consultations du jour</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {consultations
                      .filter((c) => c.date === "15/05/2023")
                      .map((consultation) => (
                        <div
                          key={consultation.id}
                          className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center">
                            <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                              <Clock className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium">{consultation.patient}</h4>
                              <div className="text-sm text-gray-500">
                                {consultation.time} • {consultation.type}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span
                              className={`px-2 py-1 text-xs rounded-full mr-3 ${
                                consultation.status === "Confirmé"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {consultation.status}
                            </span>
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/doctor/patients/${consultation.id}/medical-record`}>
                                <Eye className="h-4 w-4 mr-1" />
                                Dossier
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tomorrow">
              <Card>
                <CardHeader>
                  <CardTitle>Consultations de demain</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {consultations
                      .filter((c) => c.date === "16/05/2023")
                      .map((consultation) => (
                        <div
                          key={consultation.id}
                          className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center">
                            <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                              <Clock className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium">{consultation.patient}</h4>
                              <div className="text-sm text-gray-500">
                                {consultation.time} • {consultation.type}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span
                              className={`px-2 py-1 text-xs rounded-full mr-3 ${
                                consultation.status === "Confirmé"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {consultation.status}
                            </span>
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/doctor/patients/${consultation.id}/medical-record`}>
                                <Eye className="h-4 w-4 mr-1" />
                                Dossier
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="week">
              <Card>
                <CardHeader>
                  <CardTitle>Consultations de la semaine</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {["15/05/2023", "16/05/2023"].map((date) => (
                      <div key={date}>
                        <h3 className="font-medium mb-3">{date}</h3>
                        <div className="space-y-4">
                          {consultations
                            .filter((c) => c.date === date)
                            .map((consultation) => (
                              <div
                                key={consultation.id}
                                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center">
                                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                                    <Clock className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{consultation.patient}</h4>
                                    <div className="text-sm text-gray-500">
                                      {consultation.time} • {consultation.type}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <span
                                    className={`px-2 py-1 text-xs rounded-full mr-3 ${
                                      consultation.status === "Confirmé"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {consultation.status}
                                  </span>
                                  <Button size="sm" variant="outline" asChild>
                                    <Link to={`/doctor/patients/${consultation.id}/medical-record`}>
                                      <Eye className="h-4 w-4 mr-1" />
                                      Dossier
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>Toutes les consultations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-3 font-medium text-gray-500">Date</th>
                          <th className="pb-3 font-medium text-gray-500">Heure</th>
                          <th className="pb-3 font-medium text-gray-500">Patient</th>
                          <th className="pb-3 font-medium text-gray-500">Type</th>
                          <th className="pb-3 font-medium text-gray-500">Statut</th>
                          <th className="pb-3 font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {consultations.map((consultation) => (
                          <tr key={consultation.id}>
                            <td className="py-3">{consultation.date}</td>
                            <td className="py-3">{consultation.time}</td>
                            <td className="py-3">{consultation.patient}</td>
                            <td className="py-3">{consultation.type}</td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  consultation.status === "Confirmé"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {consultation.status}
                              </span>
                            </td>
                            <td className="py-3">
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/doctor/patients/${consultation.id}/medical-record`}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  Dossier
                                </Link>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DoctorMedicalLayout>
  )
}
