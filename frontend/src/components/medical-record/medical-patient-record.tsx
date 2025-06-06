import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer, AlertTriangle } from "lucide-react"
import { Link } from "react-router-dom"
import { MedicalVisit } from "./medical-visit"


export default function MedicalPatientRecord() {
  const [activeTab, setActiveTab] = useState("antecedents")
  const patientId = "101" // ID fictif du patient, à remplacer par l'ID réel
  // Ces données seraient normalement récupérées depuis une API
  const patient = {
    id: patientId,
    name: "Jean Dupont",
    age: 45,
    birthDate: "15/05/1978",
    gender: "Homme",
    address: "123 Rue de Paris, 75001 Paris",
    phone: "06 12 34 56 78",
    email: "jean.dupont@email.com",
    permitCategory: "B",
    permitDate: "10/06/2000",
    photo: "/placeholder.svg?height=80&width=80",
    riskLevel: "Modéré",
    medicalHistory: {
      general: [
        { condition: "Hypertension", since: "2015", treatment: "Lisinopril" },
        { condition: "Diabète type 2", since: "2018", treatment: "Metformine" },
      ],
      ophthalmological: [
        { condition: "Myopie", since: "1995", treatment: "Lunettes correctrices" },
        { condition: "Début de cataracte", since: "2022", treatment: "Surveillance" },
      ],
      addictions: [
        { type: "Tabac", status: "Ancien fumeur", details: "Arrêt en 2010" },
        { type: "Alcool", status: "Consommation occasionnelle", details: "1-2 verres/semaine" },
      ],
      family: [
        { condition: "Glaucome", relation: "Père" },
        { condition: "Diabète", relation: "Mère" },
      ],
    },
    visits: [
      {
        id: "1",
        date: "15/04/2023",
        type: "Visite périodique",
        doctor: "Dr. Martin",
        status: "Finalisé",
        technical: {
          visualAcuity: {
            rightEye: "9/10",
            leftEye: "10/10",
            withCorrection: true,
          },
          visualField: {
            rightEye: "Normal",
            leftEye: "Normal",
          },
          intraocularPressure: {
            rightEye: "14 mmHg",
            leftEye: "15 mmHg",
          },
          colorVision: "Normal",
          contrastSensitivity: "Normal",
        },
        clinical: {
          symptoms: ["Fatigue oculaire occasionnelle", "Légère sensibilité à la lumière"],
          biomicroscopy: "Légère opacification du cristallin OD",
          fundusExamination: "Normal",
          diagnosis: "Début de cataracte OD, vision compatible avec la conduite",
          recommendations: "Contrôle dans 6 mois, port de lunettes obligatoire pour la conduite",
          followUpNeeded: true,
          followUpDate: "15/10/2023",
        },
        drivingExperience: {
          kilometersPerYear: 15000,
          accidents: 1,
          lastAccidentDate: "2018",
          nightDriving: "Régulier",
          longDistanceDriving: "Fréquent",
          timeSlot: "Jour et nuit",
          damage: "Oui",
          damageType: "Matériel uniquement",
        },
        conclusion: "Vision compatible avec la conduite",
      },
      {
        id: "2",
        date: "10/10/2022",
        type: "Visite périodique",
        doctor: "Dr. Martin",
        status: "Finalisé",
        technical: {
          visualAcuity: {
            rightEye: "9/10",
            leftEye: "10/10",
            withCorrection: true,
          },
          visualField: {
            rightEye: "Normal",
            leftEye: "Normal",
          },
          intraocularPressure: {
            rightEye: "14 mmHg",
            leftEye: "14 mmHg",
          },
          colorVision: "Normal",
          contrastSensitivity: "Normal",
        },
        clinical: {
          symptoms: ["Aucun symptôme particulier"],
          biomicroscopy: "Normal",
          fundusExamination: "Normal",
          diagnosis: "Vision compatible avec la conduite",
          recommendations: "Contrôle dans 6 mois, port de lunettes obligatoire pour la conduite",
          followUpNeeded: true,
          followUpDate: "15/04/2023",
        },
        drivingExperience: {
          kilometersPerYear: 14000,
          accidents: 0,
          lastAccidentDate: "",
          nightDriving: "Régulier",
          longDistanceDriving: "Fréquent",
          timeSlot: "Jour uniquement",
          damage: "Non",
          damageType: "",
        },
        conclusion: "Vision compatible avec la conduite",
      },
      {
        id: "3",
        date: "12/04/2022",
        type: "Visite périodique",
        doctor: "Dr. Martin",
        status: "En cours",
        technical: {
          visualAcuity: {
            rightEye: "9/10",
            leftEye: "10/10",
            withCorrection: true,
          },
          visualField: {
            rightEye: "Normal",
            leftEye: "Normal",
          },
          intraocularPressure: {
            rightEye: "15 mmHg",
            leftEye: "14 mmHg",
          },
          colorVision: "Normal",
          contrastSensitivity: "Normal",
        },
        clinical: {
          symptoms: [""],
          biomicroscopy: "",
          fundusExamination: "",
          diagnosis: "",
          recommendations: "",
          followUpNeeded: false,
          followUpDate: "",
        },
        drivingExperience: {
          kilometersPerYear: 0,
          accidents: 0,
          lastAccidentDate: "",
          nightDriving: "",
          longDistanceDriving: "",
          timeSlot: "",
          damage: "",
          damageType: "",
        },
        conclusion: "",
      },
    ],
  }

  return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dossier médical</h1>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Imprimer
            </Button>
          </div>
        </div>

        {/* En-tête patient */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                <img
                  src={patient.photo || "/placeholder.svg"}
                  alt={patient.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center">
                  <h2 className="text-xl font-bold">{patient.name}</h2>
                  {patient.riskLevel === "Élevé" || patient.riskLevel === "Modéré" ? (
                    <div className="ml-2 flex items-center text-sm font-medium text-red-600">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Risque {patient.riskLevel.toLowerCase()}
                    </div>
                  ) : null}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-500">Âge</p>
                    <p className="font-medium">{patient.age} ans</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Genre</p>
                    <p className="font-medium">{patient.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Permis</p>
                    <p className="font-medium">{patient.permitCategory}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date du permis</p>
                    <p className="font-medium">{patient.permitDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Onglets du dossier médical */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="antecedents">Antécédents médicaux</TabsTrigger>
            <TabsTrigger value="visits">Visites</TabsTrigger>
          </TabsList>

          <TabsContent value="antecedents">
            <Card>
              <CardHeader>
                <CardTitle>Antécédents médicaux</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Antécédents généraux</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-sm text-gray-500">
                            <th className="pb-2">Condition</th>
                            <th className="pb-2">Depuis</th>
                            <th className="pb-2">Traitement</th>
                          </tr>
                        </thead>
                        <tbody>
                          {patient.medicalHistory.general.map((item, index) => (
                            <tr key={index} className="border-t border-gray-200">
                              <td className="py-2">{item.condition}</td>
                              <td className="py-2">{item.since}</td>
                              <td className="py-2">{item.treatment}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Antécédents ophtalmologiques</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-sm text-gray-500">
                            <th className="pb-2">Condition</th>
                            <th className="pb-2">Depuis</th>
                            <th className="pb-2">Traitement</th>
                          </tr>
                        </thead>
                        <tbody>
                          {patient.medicalHistory.ophthalmological.map((item, index) => (
                            <tr key={index} className="border-t border-gray-200">
                              <td className="py-2">{item.condition}</td>
                              <td className="py-2">{item.since}</td>
                              <td className="py-2">{item.treatment}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Addictions</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-sm text-gray-500">
                              <th className="pb-2">Type</th>
                              <th className="pb-2">Statut</th>
                              <th className="pb-2">Détails</th>
                            </tr>
                          </thead>
                          <tbody>
                            {patient.medicalHistory.addictions.map((item, index) => (
                              <tr key={index} className="border-t border-gray-200">
                                <td className="py-2">{item.type}</td>
                                <td className="py-2">{item.status}</td>
                                <td className="py-2">{item.details}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Antécédents familiaux</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-sm text-gray-500">
                              <th className="pb-2">Condition</th>
                              <th className="pb-2">Relation</th>
                            </tr>
                          </thead>
                          <tbody>
                            {patient.medicalHistory.family.map((item, index) => (
                              <tr key={index} className="border-t border-gray-200">
                                <td className="py-2">{item.condition}</td>
                                <td className="py-2">{item.relation}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visits">

            <div className="space-y-6">
              {patient.visits.map((visit) => (
                <Card key={visit.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">Visite du {visit.date}</CardTitle>
                        <p className="text-sm text-gray-500">
                          {visit.type} • {visit.doctor}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            visit.status === "Finalisé"
                              ? "bg-green-100 text-green-800"
                              : visit.status === "En cours"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {visit.status}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Tabs defaultValue="summary" className="w-full">
                      <TabsList className="w-full rounded-none border-b">
                        <TabsTrigger value="summary" className="flex-1">
                          Résumé
                        </TabsTrigger>
                        <TabsTrigger value="details" className="flex-1">
                          Détails complets
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="summary" className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Acuité visuelle</h3>
                            <p>
                              OD: {visit.technical?.visualAcuity?.rightEye || "N/A"}, OG:{" "}
                              {visit.technical?.visualAcuity?.leftEye || "N/A"}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Diagnostic</h3>
                            <p>{visit.clinical?.diagnosis || "Non renseigné"}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Conduite</h3>
                            <p>
                              {visit.drivingExperience?.kilometersPerYear || "N/A"} km/an,{" "}
                              {visit.drivingExperience?.accidents || "0"} accident(s)
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Conclusion</h3>
                            <p>{visit.conclusion || "Non finalisé"}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/doctor/visits/${visit.id}`}>Voir tous les détails</Link>
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="details" className="p-0">
                        <MedicalVisit visit={visit} />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
  )
}
