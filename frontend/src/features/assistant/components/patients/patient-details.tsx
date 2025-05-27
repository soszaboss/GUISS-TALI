import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Calendar, Plus, AlertTriangle, FileText } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { VehicleModal } from "./vehicle-modal"


// Données fictives pour un patient
const patientData = {
  id: "1",
  first_name: "Vincent",
  last_name: "Viscaal",
  email: "vincent.viscaal@example.com",
  phone_number: "+221 77 123 4567",
  address: "63 Main Drive, Los Angeles, CA",
  date_naissance: "1985-03-29",
  sexe: "Homme",
  numero_permis: "SN12345678",
  type_permis: "Léger",
  date_delivrance_permis: "2010-05-15",
  date_peremption_permis: "2025-05-15",
  transporteur_professionnel: "Non",
  service: "Particulier",
  type_instruction_suivie: "Française",
  niveau_instruction: "Supérieure",
  annees_experience: 8,
  status: "active",
  height: "6' 2\"",
  weight: "185",
  language: "English",
  allergies: [
    { name: "Penicillin", severity: "High" },
    { name: "Tylenol", severity: "Medium" },
  ],
  medications: [
    {
      name: "Atorvastatin",
      generic_name: "Atorvastatin",
      strength: "250mg",
      pack: "100",
      form: "Tab",
      manufacturer: "Apotex Industries",
    },
    {
      name: "Amoxicillin",
      generic_name: "Amoxicillin",
      strength: "500mg",
      pack: "30",
      form: "Pill",
      manufacturer: "Perrigo Company",
    },
    {
      name: "Lisinopril",
      generic_name: "Pregabalin",
      strength: "250mg",
      pack: "100",
      form: "Syrup",
      manufacturer: "Pfizer Inc.",
    },
  ],
  notes: "Knee pain, Headache, Last time he looked sick",
  vehicles: [
    { immatriculation: "AB-123-CD", modele: "Toyota Corolla", annee: "2018", type: "Léger" },
    { immatriculation: "EF-456-GH", modele: "Renault Clio", annee: "2020", type: "Léger" },
  ],
}

export function PatientDetails() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("general")
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false)
  const [vehicles, setVehicles] = useState(patientData.vehicles)
  // Dans une application réelle, vous feriez un appel API ici
  // useEffect(() => {
  //   // Simuler un chargement de données
  //   console.log(`Loading patient data for ID: ${id}`)
  // }, [id])
  const id: number = 1
  const handleAddVehicle = (vehicleData: any) => {
    const newVehicle = {
      immatriculation: vehicleData.immatriculation,
      modele: vehicleData.modele,
      annee: vehicleData.annee,
      type:
        vehicleData.type_vehicule_conduit === "Autres"
          ? vehicleData.autre_type_vehicule_conduit
          : vehicleData.type_vehicule_conduit,
    }
    setVehicles([...vehicles, newVehicle])
  }
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold">Fiche Patient</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/assistant/patients/medical-record/${id}`)}>
              <FileText className="mr-2 h-4 w-4" />
              Cahier Médical
            </Button>
            <Button variant="outline" onClick={() => navigate(`/assistant/appointments/new?patient=${id}`)}>
              <Calendar className="mr-2 h-4 w-4" />
              Planifier un rendez-vous
            </Button>
            <Button variant="outline" onClick={() => navigate(`/assistant/patients/edit/${id}`)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar avec photo et infos de base */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border">
                    <img
                      src="/placeholder.svg?height=128&width=128"
                      alt={`${patientData.first_name} ${patientData.last_name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-semibold mb-1">
                    {patientData.first_name} {patientData.last_name}
                  </h2>
                  <Badge
                    variant={patientData.status === "active" ? "default" : "secondary"}
                    className={
                      patientData.status === "active"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }
                  >
                    {patientData.status === "active" ? "Actif" : "Inactif"}
                  </Badge>

                  <div className="w-full mt-6 space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Genre</p>
                      <p>{patientData.sexe}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Âge</p>
                      <p>{new Date().getFullYear() - new Date(patientData.date_naissance).getFullYear()} ans</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Langue</p>
                      <p>{patientData.language}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Taille</p>
                      <p>{patientData.height}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Poids</p>
                      <p>{patientData.weight} lbs</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Expérience</p>
                      <p>{patientData.annees_experience} ans</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="permis">Permis</TabsTrigger>
                <TabsTrigger value="vehicles">Véhicules</TabsTrigger>
                <TabsTrigger value="allergies">Allergies</TabsTrigger>
                <TabsTrigger value="medications">Médicaments</TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations personnelles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium mb-4">Coordonnées</h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Nom complet</p>
                            <p className="font-medium">
                              {patientData.first_name} {patientData.last_name}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p>{patientData.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Téléphone</p>
                            <p>{patientData.phone_number}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Adresse</p>
                            <p>{patientData.address}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Date de naissance</p>
                            <p>{new Date(patientData.date_naissance).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-4">Informations professionnelles</h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Transporteur professionnel</p>
                            <p>{patientData.transporteur_professionnel}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Service</p>
                            <p>{patientData.service}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Type d'instruction suivie</p>
                            <p>{patientData.type_instruction_suivie}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Niveau d'instruction</p>
                            <p>{patientData.niveau_instruction}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-medium mb-4">Notes</h3>
                      <p className="text-gray-700">{patientData.notes}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="permis">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations du permis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Numéro de permis</p>
                            <p className="font-medium">{patientData.numero_permis}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Type de permis</p>
                            <p>{patientData.type_permis}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Date de délivrance</p>
                            <p>{new Date(patientData.date_delivrance_permis).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Date de péremption</p>
                            <p>{new Date(patientData.date_peremption_permis).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vehicles">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Véhicules</CardTitle>
                    <Button size="sm" onClick={() => setIsVehicleModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter un véhicule
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Immatriculation</TableHead>
                            <TableHead>Modèle</TableHead>
                            <TableHead>Année</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {patientData.vehicles.map((vehicle, index) => (
                            <TableRow key={index}>
                              <TableCell>{vehicle.immatriculation}</TableCell>
                              <TableCell>{vehicle.modele}</TableCell>
                              <TableCell>{vehicle.annee}</TableCell>
                              <TableCell>{vehicle.type}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4 mr-1" />
                                  Modifier
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="allergies">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Allergies</CardTitle>
                    <Button size="sm" onClick={() => navigate(`/assistant/patients/edit/${id}?tab=allergies`)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter une allergie
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {patientData.allergies.map((allergy, index) => (
                        <div key={index} className="flex items-center justify-between border-b pb-3">
                          <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                            <div>
                              <p className="font-medium">{allergy.name}</p>
                              <p className="text-sm text-gray-500">Sévérité: {allergy.severity}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter une allergie
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="medications">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Médicaments utilisés</CardTitle>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter un médicament
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>Nom générique</TableHead>
                            <TableHead>Dosage</TableHead>
                            <TableHead>Quantité</TableHead>
                            <TableHead>Forme</TableHead>
                            <TableHead>Fabricant</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {patientData.medications.map((medication, index) => (
                            <TableRow key={index}>
                              <TableCell>{medication.name}</TableCell>
                              <TableCell>{medication.generic_name}</TableCell>
                              <TableCell>{medication.strength}</TableCell>
                              <TableCell>{medication.pack}</TableCell>
                              <TableCell>{medication.form}</TableCell>
                              <TableCell>{medication.manufacturer}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onSubmit={handleAddVehicle}
      />
    </div>
  )
}
