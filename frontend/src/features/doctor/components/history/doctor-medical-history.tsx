import { useState } from "react"
import { DoctorMedicalLayout } from "../layouts/doctor-medical-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Calendar, Eye, Filter } from "lucide-react"
import { Link } from "react-router-dom"

export function DoctorMedicalHistory() {
  const [searchTerm, setSearchTerm] = useState("")

  // Ces données seraient normalement récupérées depuis une API
  const visits = [
    {
      id: "1",
      patient: "Jean Dupont",
      date: "15/04/2023",
      type: "Visite périodique",
      status: "Finalisé",
      conclusion: "Vision compatible avec la conduite",
      followUp: "15/10/2023",
    },
    {
      id: "2",
      patient: "Marie Martin",
      date: "10/04/2023",
      type: "Visite périodique",
      status: "Finalisé",
      conclusion: "Vision compatible avec la conduite",
      followUp: "10/10/2023",
    },
    {
      id: "3",
      patient: "Pierre Durand",
      date: "05/04/2023",
      type: "Visite périodique",
      status: "Finalisé",
      conclusion: "Vision compatible avec la conduite",
      followUp: "05/10/2023",
    },
    {
      id: "4",
      patient: "Sophie Petit",
      date: "01/04/2023",
      type: "Première visite",
      status: "Finalisé",
      conclusion: "Vision compatible avec la conduite",
      followUp: "01/10/2023",
    },
    {
      id: "5",
      patient: "Robert Lefebvre",
      date: "25/03/2023",
      type: "Visite périodique",
      status: "Finalisé",
      conclusion: "Vision compatible avec la conduite avec restrictions",
      followUp: "25/09/2023",
    },
    {
      id: "6",
      patient: "Michel Dubois",
      date: "20/03/2023",
      type: "Visite périodique",
      status: "Finalisé",
      conclusion: "Vision compatible avec la conduite avec restrictions",
      followUp: "20/09/2023",
    },
    {
      id: "7",
      patient: "Jeanne Moreau",
      date: "15/03/2023",
      type: "Visite périodique",
      status: "Finalisé",
      conclusion: "Vision compatible avec la conduite",
      followUp: "15/09/2023",
    },
    {
      id: "8",
      patient: "Paul Leroy",
      date: "10/03/2023",
      type: "Visite périodique",
      status: "Finalisé",
      conclusion: "Vision compatible avec la conduite",
      followUp: "10/09/2023",
    },
  ]

  const filteredVisits = visits.filter((visit) => visit.patient.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <DoctorMedicalLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Historique & Suivi</h1>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Rechercher par nom de patient..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historique des visites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-3 font-medium text-gray-500">Date</th>
                    <th className="pb-3 font-medium text-gray-500">Patient</th>
                    <th className="pb-3 font-medium text-gray-500">Type</th>
                    <th className="pb-3 font-medium text-gray-500">Conclusion</th>
                    <th className="pb-3 font-medium text-gray-500">Suivi</th>
                    <th className="pb-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredVisits.map((visit) => (
                    <tr key={visit.id}>
                      <td className="py-3">{visit.date}</td>
                      <td className="py-3">{visit.patient}</td>
                      <td className="py-3">{visit.type}</td>
                      <td className="py-3">{visit.conclusion}</td>
                      <td className="py-3">{visit.followUp}</td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/doctor/visits/${visit.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Détails
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-center">
              <div className="flex space-x-1">
                <Button variant="outline" size="sm" disabled>
                  Précédent
                </Button>
                <Button variant="outline" size="sm" className="bg-blue-50">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Suivant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Suivi à venir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: "1",
                  patient: "Jean Dupont",
                  date: "15/10/2023",
                  reason: "Suivi périodique",
                },
                {
                  id: "2",
                  patient: "Marie Martin",
                  date: "10/10/2023",
                  reason: "Suivi périodique",
                },
                {
                  id: "3",
                  patient: "Robert Lefebvre",
                  date: "25/09/2023",
                  reason: "Suivi condition à risque",
                },
              ].map((followUp) => (
                <div key={followUp.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">{followUp.patient}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {followUp.date}
                      <span className="mx-2">•</span>
                      {followUp.reason}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/doctor/patients/${followUp.id}/medical-record`}>Dossier</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DoctorMedicalLayout>
  )
}
