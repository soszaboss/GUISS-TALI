import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer, AlertTriangle, User, Mail, MapPin, Phone, IdCard } from "lucide-react"
import { Link } from "react-router-dom"
import { MedicalVisit } from "./MedicalVisit"

export default function MedicalPatientRecord() {
  const [activeTab, setActiveTab] = useState("general")
  const patientId = "101"
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
      surgeries: [
        { type: "Appendicectomie", year: "2005" }
      ],
      allergies: [
        "Pénicilline"
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
      // ...visites comme avant...
    ],
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
            <img
              src={patient.photo || "/placeholder.svg"}
              alt={patient.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <User className="h-7 w-7 text-blue-600" />
              {patient.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              {patient.riskLevel === "Élevé" || patient.riskLevel === "Modéré" ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Risque {patient.riskLevel.toLowerCase()}
                </span>
              ) : null}
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                <IdCard className="h-4 w-4 mr-1" />
                Permis {patient.permitCategory}
              </span>
            </div>
          </div>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Imprimer
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8 bg-gray-50 rounded-lg p-1">
          <TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
            Informations générales
          </TabsTrigger>
          <TabsTrigger value="visits" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
            Visites
          </TabsTrigger>
        </TabsList>

        {/* Onglet Informations générales */}
        <TabsContent value="general">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 via-white to-gray-50">
            <CardHeader className="border-b-0 pb-0">
              <CardTitle className="text-2xl font-bold text-blue-900 flex items-center gap-3">
                <User className="h-7 w-7 text-blue-600" />
                Informations générales du patient
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-10">

              {/* Identité */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" /> Identité
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
                  <div>
                    <span className="block text-xs text-gray-500">Nom</span>
                    <span className="font-semibold text-base">{patient.name}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500">Âge</span>
                    <span className="font-semibold text-base">{patient.age} ans</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500">Genre</span>
                    <span className="font-semibold text-base">{patient.gender}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500">Date de naissance</span>
                    <span className="font-semibold text-base">{patient.birthDate}</span>
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="block text-xs text-gray-500">Adresse</span>
                    <span className="font-semibold text-base">{patient.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="block text-xs text-gray-500">Téléphone</span>
                    <span className="font-semibold text-base">{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="block text-xs text-gray-500">Email</span>
                    <span className="font-semibold text-base">{patient.email}</span>
                  </div>
                </div>
              </section>

              {/* Permis */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                  <IdCard className="h-5 w-5" /> Permis de conduire
                </h3>
                <div className="flex flex-wrap gap-6 text-gray-800">
                  <div>
                    <span className="block text-xs text-gray-500">Catégorie</span>
                    <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-700 font-semibold text-sm">
                      {patient.permitCategory}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500">Date d'obtention</span>
                    <span className="font-semibold text-base">{patient.permitDate}</span>
                  </div>
                </div>
              </section>

              {/* Antécédents médicaux */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" /> Antécédents médicaux
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="font-semibold mb-1 text-gray-700">Généraux</div>
                    {patient.medicalHistory.general.length === 0 ? (
                      <span className="text-gray-400">Aucun</span>
                    ) : (
                      <ul className="list-disc ml-6 text-gray-700">
                        {patient.medicalHistory.general.map((item, idx) => (
                          <li key={idx}>
                            <span className="font-medium">{item.condition}</span>
                            {item.since && <> (depuis {item.since})</>}
                            {item.treatment && <> — Traitement : {item.treatment}</>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold mb-1 text-gray-700">Chirurgies</div>
                    {patient.medicalHistory.surgeries?.length === 0 ? (
                      <span className="text-gray-400">Aucune</span>
                    ) : (
                      <ul className="list-disc ml-6 text-gray-700">
                        {patient.medicalHistory.surgeries?.map((item, idx) => (
                          <li key={idx}>
                            <span className="font-medium">{item.type}</span>
                            {item.year && <> ({item.year})</>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold mb-1 text-gray-700">Allergies</div>
                    {patient.medicalHistory.allergies?.length === 0 ? (
                      <span className="text-gray-400">Aucune</span>
                    ) : (
                      <ul className="list-disc ml-6 text-gray-700">
                        {patient.medicalHistory.allergies?.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold mb-1 text-gray-700">Ophtalmologiques</div>
                    {patient.medicalHistory.ophthalmological.length === 0 ? (
                      <span className="text-gray-400">Aucun</span>
                    ) : (
                      <ul className="list-disc ml-6 text-gray-700">
                        {patient.medicalHistory.ophthalmological.map((item, idx) => (
                          <li key={idx}>
                            <span className="font-medium">{item.condition}</span>
                            {item.since && <> (depuis {item.since})</>}
                            {item.treatment && <> — Traitement : {item.treatment}</>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold mb-1 text-gray-700">Addictions</div>
                    {patient.medicalHistory.addictions.length === 0 ? (
                      <span className="text-gray-400">Aucune</span>
                    ) : (
                      <ul className="list-disc ml-6 text-gray-700">
                        {patient.medicalHistory.addictions.map((item, idx) => (
                          <li key={idx}>
                            <span className="font-medium">{item.type}</span>
                            {item.status && <> — {item.status}</>}
                            {item.details && <> ({item.details})</>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold mb-1 text-gray-700">Familiaux</div>
                    {patient.medicalHistory.family.length === 0 ? (
                      <span className="text-gray-400">Aucun</span>
                    ) : (
                      <ul className="list-disc ml-6 text-gray-700">
                        {patient.medicalHistory.family.map((item, idx) => (
                          <li key={idx}>
                            <span className="font-medium">{item.condition}</span>
                            {item.relation && <> ({item.relation})</>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Visites */}
        <TabsContent value="visits">
          <div className="space-y-8">
            {patient.visits.map((visit) => (
              <Card key={visit.id} className="overflow-hidden shadow border-gray-200">
                <CardHeader className="bg-blue-50 p-4 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg text-blue-800">Visite du {visit.date}</CardTitle>
                      <p className="text-sm text-gray-500">
                        {visit.type} • {visit.doctor}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-semibold ${
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
                    <TabsList className="w-full rounded-none border-b bg-gray-50">
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