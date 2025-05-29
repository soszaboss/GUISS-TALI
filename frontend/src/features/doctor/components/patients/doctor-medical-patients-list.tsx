import { useState } from "react"
import { DoctorMedicalLayout } from "../layouts/doctor-medical-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, Eye, AlertTriangle } from "lucide-react"
import { Link } from "react-router-dom"

export function DoctorMedicalPatientsList() {
  const [searchTerm, setSearchTerm] = useState("")

  // Ces données seraient normalement récupérées depuis une API
  const patients = [
    {
      id: "1",
      name: "Jean Dupont",
      age: 45,
      gender: "Homme",
      permitCategory: "B",
      lastVisit: "15/04/2023",
      nextVisit: "15/10/2023",
      status: "normal",
    },
    {
      id: "2",
      name: "Marie Martin",
      age: 38,
      gender: "Femme",
      permitCategory: "B",
      lastVisit: "10/03/2023",
      nextVisit: "10/09/2023",
      status: "normal",
    },
    {
      id: "3",
      name: "Pierre Durand",
      age: 52,
      gender: "Homme",
      permitCategory: "B, C",
      lastVisit: "05/05/2023",
      nextVisit: "05/11/2023",
      status: "normal",
    },
    {
      id: "4",
      name: "Sophie Petit",
      age: 29,
      gender: "Femme",
      permitCategory: "B",
      lastVisit: "20/04/2023",
      nextVisit: "20/10/2023",
      status: "normal",
    },
    {
      id: "5",
      name: "Robert Lefebvre",
      age: 67,
      gender: "Homme",
      permitCategory: "B",
      lastVisit: "25/03/2023",
      nextVisit: "25/09/2023",
      status: "risk",
    },
    {
      id: "6",
      name: "Michel Dubois",
      age: 58,
      gender: "Homme",
      permitCategory: "B, D",
      lastVisit: "12/04/2023",
      nextVisit: "12/10/2023",
      status: "risk",
    },
  ]

  const filteredPatients = patients.filter((patient) => patient.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <DoctorMedicalLayout>
      <div className="p-6">
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Rechercher un patient..."
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

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Âge</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Permis</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière visite
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prochaine visite
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="font-medium text-gray-900">
                          {patient.name}
                          {patient.status === "risk" && <AlertTriangle className="h-4 w-4 text-red-500 inline ml-2" />}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{patient.age} ans</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{patient.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{patient.permitCategory}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{patient.lastVisit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{patient.nextVisit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/doctor/medical-records/${patient.id}`}>
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
        </div>
      </div>
    </DoctorMedicalLayout>
  )
}
