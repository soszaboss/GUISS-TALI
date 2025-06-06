import { DoctorMedicalLayout } from "../layouts/doctor-medical-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Eye } from "lucide-react"
import { Link } from "react-router-dom"

export function DoctorMedicalRiskPatients() {
  // Ces données seraient normalement récupérées depuis une API
  const riskPatients = [
    {
      id: "1",
      name: "Robert Lefebvre",
      age: 67,
      gender: "Homme",
      permitCategory: "B",
      lastVisit: "25/03/2023",
      riskLevel: "Élevé",
      riskFactors: ["Âge > 65 ans", "Début de cataracte", "Hypertension", "Conduite nocturne fréquente"],
    },
    {
      id: "2",
      name: "Michel Dubois",
      age: 58,
      gender: "Homme",
      permitCategory: "B, D",
      lastVisit: "12/04/2023",
      riskLevel: "Élevé",
      riskFactors: ["Diabète non contrôlé", "Glaucome", "Conduite professionnelle"],
    },
    {
      id: "3",
      name: "Jeanne Moreau",
      age: 72,
      gender: "Femme",
      permitCategory: "B",
      lastVisit: "05/02/2023",
      riskLevel: "Modéré",
      riskFactors: ["Âge > 65 ans", "Traitement médicamenteux avec effets secondaires"],
    },
    {
      id: "4",
      name: "Paul Leroy",
      age: 49,
      gender: "Homme",
      permitCategory: "A, B",
      lastVisit: "18/03/2023",
      riskLevel: "Modéré",
      riskFactors: ["Antécédent d'accident", "Myopie forte"],
    },
    {
      id: "5",
      name: "Lucie Fontaine",
      age: 35,
      gender: "Femme",
      permitCategory: "B",
      lastVisit: "30/04/2023",
      riskLevel: "Modéré",
      riskFactors: ["Épilepsie contrôlée", "Conduite nocturne fréquente"],
    },
  ]

  return (
    <DoctorMedicalLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Patients à risque</h1>
          <Button variant="outline">Exporter la liste</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-red-600">3</h3>
                  <p className="text-sm text-gray-500">Risque élevé</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-amber-600">5</h3>
                  <p className="text-sm text-gray-500">Risque modéré</p>
                </div>
                <div className="p-3 bg-amber-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des patients à risque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={`border rounded-lg overflow-hidden ${
                    patient.riskLevel === "Élevé" ? "border-red-300" : "border-amber-300"
                  }`}
                >
                  <div
                    className={`px-4 py-3 flex justify-between items-center ${
                      patient.riskLevel === "Élevé" ? "bg-red-50" : "bg-amber-50"
                    }`}
                  >
                    <div className="flex items-center">
                      <AlertTriangle
                        className={`h-5 w-5 mr-2 ${patient.riskLevel === "Élevé" ? "text-red-600" : "text-amber-600"}`}
                      />
                      <h3 className="font-medium">{patient.name}</h3>
                    </div>
                    <div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          patient.riskLevel === "Élevé" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        Risque {patient.riskLevel.toLowerCase()}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Âge</p>
                        <p>{patient.age} ans</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Permis</p>
                        <p>{patient.permitCategory}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Dernière visite</p>
                        <p>{patient.lastVisit}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Facteurs de risque</p>
                      <div className="flex flex-wrap gap-2">
                        {patient.riskFactors.map((factor, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 text-xs rounded-full ${
                              patient.riskLevel === "Élevé" ? "bg-red-100" : "bg-amber-100"
                            }`}
                          >
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button size="sm" asChild>
                        <Link to={`/doctor/medical-records/${patient.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          Voir le dossier
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DoctorMedicalLayout>
  )
}
