/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Plus, FileText, Loader2, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useQuery, useMutation } from "@tanstack/react-query"
import { getPatientById } from "@/services/patientsService"
import { getVehicules, createVehicule, updateVehicule, deleteVehicule } from "@/services/vehiculesService"
import { QUERIES } from "@/helpers/crud-helper/consts"
import { toast } from "sonner"
import { useListView } from "@/hooks/_ListViewProvider"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

const vehiculeSchema = z.object({
  immatriculation: z.string().min(1, "Immatriculation requise"),
  modele: z.string().min(1, "Modèle requis"),
  annee: z.string().min(1, "Année requise"),
  type_vehicule_conduit: z.enum(["Léger", "Lourd", "Autres"], { required_error: "Type requis" }),
  autre_type_vehicule_conduit: z.string().min(1, "Précisez le type").optional().or(z.literal("")),
}).refine(
  (data) => data.type_vehicule_conduit !== "Autres" || !!data.autre_type_vehicule_conduit,
  { message: "Précisez le type de véhicule", path: ["autre_type_vehicule_conduit"] }
)

type VehiculeFormType = z.infer<typeof vehiculeSchema>

function VehicleModal({ isOpen, onClose, onSubmit, defaultValues }: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: VehiculeFormType) => void
  defaultValues?: Partial<VehiculeFormType>
}) {
  const methods = useForm<VehiculeFormType>({
    resolver: zodResolver(vehiculeSchema),
    defaultValues: defaultValues || {
      immatriculation: "",
      modele: "",
      annee: "",
      type_vehicule_conduit: "Léger",
      autre_type_vehicule_conduit: "",
    },
  })

  // Reset le formulaire à chaque ouverture avec les bonnes valeurs
  useEffect(() => {
    if (isOpen) {
      methods.reset(defaultValues || {
        immatriculation: "",
        modele: "",
        annee: "",
        type_vehicule_conduit: "Léger",
        autre_type_vehicule_conduit: "",
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, defaultValues])

  const { handleSubmit, watch, formState: { isSubmitting } } = methods

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button className="absolute top-2 right-2" onClick={onClose}>
          <span className="text-xl">&times;</span>
        </button>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit((data) => {
              onSubmit(data)
              onClose()
            })}
            className="space-y-4"
          >
            <h2 className="text-lg font-bold mb-2">Ajouter / Modifier un véhicule</h2>
            <FormField control={methods.control} name="immatriculation" render={({ field }) => (
              <FormItem>
                <FormLabel>Immatriculation *</FormLabel>
                <FormControl>
                  <Input placeholder="AB-123-CD" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={methods.control} name="modele" render={({ field }) => (
              <FormItem>
                <FormLabel>Modèle *</FormLabel>
                <FormControl>
                  <Input placeholder="Toyota Corolla" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={methods.control} name="annee" render={({ field }) => (
              <FormItem>
                <FormLabel>Année *</FormLabel>
                <FormControl>
                  <Input placeholder="2020" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={methods.control} name="type_vehicule_conduit" render={({ field }) => (
              <FormItem>
                <FormLabel>Type *</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Léger">Léger</SelectItem>
                    <SelectItem value="Lourd">Lourd</SelectItem>
                    <SelectItem value="Autres">Autres</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {watch("type_vehicule_conduit") === "Autres" && (
              <FormField control={methods.control} name="autre_type_vehicule_conduit" render={({ field }) => (
                <FormItem>
                  <FormLabel>Précisez *</FormLabel>
                  <FormControl>
                    <Input placeholder="Type de véhicule" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
              <Button type="submit" disabled={isSubmitting}>Enregistrer</Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}

export function PatientDetails() {
  const { patientId } = useParams<{ patientId: string }>()
  const navigate = useNavigate()
  const { setItemIdForUpdate } = useListView()

  // Patient data
  const { data: patient, isLoading: isPatientLoading } = useQuery({
    queryKey: [QUERIES.PATIENTS_LIST, "getPatient", patientId],
    queryFn: () => getPatientById(patientId!.toString()),
    enabled: !!patientId,
    cacheTime: 0,
    onError: () => {
      toast.error("Impossible de charger le patient.")
      navigate(-1)
    }
  })

  // Vehicules data
  const { data: vehicules, isLoading: isVehiculesLoading, refetch: refetchVehicules } = useQuery({
    queryKey: [QUERIES.VEHICULES_LIST, "byPatient", patientId],
    queryFn: () => getVehicules(`conducteur=${patientId}`),
    enabled: !!patientId,
    cacheTime: 0,
    select: (data) => data.results,
  })

  // Ajout/modification véhicule
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false)
  const [vehicleToEdit, setVehicleToEdit] = useState<any>(null)

  const mutationVehicule = useMutation({
    mutationFn: async (vehicule: VehiculeFormType & { id?: string }) => {
      if (vehicule.id) {
        return updateVehicule({ ...vehicule, conducteur: Number(patientId), id: vehicule.id ? Number(vehicule.id) : undefined })
      }
      return createVehicule({ ...vehicule, conducteur: Number(patientId), id: vehicule.id ? Number(vehicule.id) : undefined })
    },
    onSuccess: () => {
      toast.success("Véhicule enregistré avec succès")
      setIsVehicleModalOpen(false)
      setVehicleToEdit(null)
      refetchVehicules()
    },
    onError: (error: any) => {
      const status = error?.response?.status
      const data = error?.response?.data
      if (status === 400 && data) {
        Object.entries(data).forEach(([field, err]) => {
          toast.error(`${field}: ${Array.isArray(err) ? err.join(", ") : err}`)
        })
      } else {
        toast.error("Erreur lors de l'enregistrement du véhicule.")
      }
    }
  })

  // Suppression véhicule
  const mutationDeleteVehicule = useMutation({
    mutationFn: (vehiculeId: number) => deleteVehicule(vehiculeId),
    onSuccess: () => {
      toast.success("Véhicule supprimé avec succès")
      refetchVehicules()
    },
    onError: () => {
      toast.error("Erreur lors de la suppression du véhicule.")
    }
  })

  // Spinner de chargement
  if (isPatientLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="animate-spin h-8 w-8 text-primary mb-4" />
        <span className="text-gray-400 mt-4">Chargement des informations patient...</span>
      </div>
    )
  }

  if (!patient) return null

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
            <Button variant="outline" onClick={() => navigate(`/assistant/patients/medical-record/${patient.id}`)}>
              <FileText className="mr-2 h-4 w-4" />
              Cahier Médical
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setItemIdForUpdate(patient.id)
                navigate(`/assistant/patients/edit`)
              }}
            >
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
                      src={patient.image || "/placeholder.svg?height=128&width=128"}
                      alt={`${patient.first_name} ${patient.last_name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-semibold mb-1">
                    {patient.first_name} {patient.last_name}
                  </h2>
                  <Badge
                    variant={patient.status === "active" ? "default" : "secondary"}
                    className={
                      patient.status === "active"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }
                  >
                    {patient.status === "active" ? "Actif" : "Inactif"}
                  </Badge>

                  <div className="w-full mt-6 space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Sexe</p>
                      <p>{patient.sexe}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date de naissance</p>
                      <p>{new Date(patient.date_naissance).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Expérience</p>
                      <p>{patient.annees_experience} ans</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="permis">Permis</TabsTrigger>
                <TabsTrigger value="vehicles">Véhicules</TabsTrigger>
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
                              {patient.first_name} {patient.last_name}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p>{patient.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Téléphone</p>
                            <p>{patient.phone_number}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-4">Informations professionnelles</h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Transporteur professionnel</p>
                            <p>{patient.transporteur_professionnel ? "Oui" : "Non"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Service</p>
                            <p>{patient.service}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Type d'instruction suivie</p>
                            <p>{patient.type_instruction_suivie}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Niveau d'instruction</p>
                            <p>{patient.niveau_instruction}</p>
                          </div>
                        </div>
                      </div>
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
                            <p className="font-medium">{patient.numero_permis}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Type de permis</p>
                            <p>
                              {patient.type_permis === "leger"
                                ? "Léger"
                                : patient.type_permis === "lourd"
                                ? "Lourd"
                                : `Autres${patient.autre_type_permis ? `: ${patient.autre_type_permis}` : ""}`}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Date de délivrance</p>
                            <p>{new Date(patient.date_delivrance_permis).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Date de péremption</p>
                            <p>{new Date(patient.date_peremption_permis).toLocaleDateString()}</p>
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
                    <Button size="sm" onClick={() => { setVehicleToEdit(null); setIsVehicleModalOpen(true) }}>
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter un véhicule
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isVehiculesLoading ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Loader2 className="animate-spin h-8 w-8 text-primary mb-4" />
                        <span className="text-gray-400 mt-4">Chargement des véhicules...</span>
                      </div>
                    ) : (
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
                            {vehicules && vehicules.length > 0 ? (
                              vehicules.map((vehicle) => (
                                <TableRow key={vehicle.id}>
                                  <TableCell>{vehicle.immatriculation}</TableCell>
                                  <TableCell>{vehicle.modele}</TableCell>
                                  <TableCell>{vehicle.annee}</TableCell>
                                  <TableCell>
                                    {vehicle.type_vehicule_conduit === "Autres"
                                      ? vehicle.autre_type_vehicule_conduit
                                      : vehicle.type_vehicule_conduit}
                                  </TableCell>
                                  <TableCell className="text-right flex gap-2 justify-end">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setVehicleToEdit(vehicle)
                                        setIsVehicleModalOpen(true)
                                      }}
                                    >
                                      <Edit className="h-4 w-4 mr-1" />
                                      Modifier
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => mutationDeleteVehicule.mutate(Number(vehicle.id))}
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" />
                                      Supprimer
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                  Aucun véhicule enregistré
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <VehicleModal
                  key={vehicleToEdit ? vehicleToEdit.id : "new"}
                  isOpen={isVehicleModalOpen}
                  onClose={() => { setIsVehicleModalOpen(false); setVehicleToEdit(null) }}
                  onSubmit={(data) => mutationVehicule.mutate(vehicleToEdit ? { ...data, id: vehicleToEdit.id } : data)}
                  defaultValues={vehicleToEdit || undefined}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}