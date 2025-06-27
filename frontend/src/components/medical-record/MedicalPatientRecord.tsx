import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, IdCard, Trash2, PlusCircle } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { MedicalVisit } from "./MedicalVisit"
import { useMutation, useQuery } from "@tanstack/react-query"
import { QUERIES } from "@/helpers/crud-helper/consts"
import { getMedicalRecordByPatientId, setRiskyPatient, syncHealthRecord } from "@/services/medicalRecord"
import { deleteExamen } from "@/services/examens"
import { toast } from "sonner"
import { Antecedent } from "./Antecedent"
import { useAuth } from "@/hooks/auth/Auth"
import { initialTechnicalExamen } from "@/types/examenTechniques"
import { initialClinicalExamen } from "@/types/examensClinic"

// Modal générique
function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmer",
  confirmColor = "bg-blue-600 hover:bg-blue-700",
  children
}: {
  isOpen: boolean,
  onClose: () => void,
  onConfirm: () => void,
  title: string,
  description?: string,
  confirmLabel?: string,
  confirmColor?: string,
  children?: React.ReactNode
}) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px]">
        <div className="text-lg font-semibold mb-2">{title}</div>
        {description && <div className="mb-4">{description}</div>}
        {children}
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded text-white font-semibold ${confirmColor}`}
            disabled={confirmLabel === "Ajouter" && !children}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}



export default function MedicalPatientRecord() {
  const { patientId } = useParams();
  const [activeTab, setActiveTab] = useState("general")
  const [deleteModal, setDeleteModal] = useState<{ open: boolean, examenId?: number, visiteNumber?: number }>({ open: false })
  const [addModal, setAddModal] = useState(false)
  const [selectedVisit, setSelectedVisit] = useState<number | null>(null)
  const { currentUser } = useAuth()
  const navigate = useNavigate();
  
  const role = currentUser?.role?.toLocaleLowerCase()
  const canEditAntecedent = role === "employee" || role === "doctor"

  const {
    data: medicalRecord,
    refetch
  } = useQuery({
    queryKey: [QUERIES.MEDICAL_RECORDS_LIST, 'patiendId', patientId],
    queryFn: () => getMedicalRecordByPatientId(Number(patientId)),
    enabled: !!patientId,
    cacheTime: 0,
    keepPreviousData: true,
    refetchOnWindowFocus: false
  })
  const API_URL = import.meta.env.VITE_APP_API_URL
  const antecedents = medicalRecord?.antecedant
  const handleDrivingExperienceByVisit = (visitNumber: number) => {
    return medicalRecord?.driver_experience.find(driverExp => driverExp?.visite === visitNumber)
  }
  const deleteVisit = useMutation({
    mutationFn: (examenId: number) => deleteExamen(examenId),
    mutationKey: [QUERIES.EXAMENS_LIST, 'delete', deleteModal.examenId],
    onSuccess: () => {
      setDeleteModal({ open: false })
      refetch()
      toast.success("Visite supprimée avec succès.")
    },
    onError: () => {
      setDeleteModal({ open: false })
      toast.error(`Erreur lors de la suppression de la visite.`)
    }
  })

  const createVisit = useMutation({
    mutationFn: ({ PatientId, visite }: { PatientId: number, visite: number }) => syncHealthRecord(PatientId, visite),
    onSuccess: () => {
      setAddModal(false)
      setSelectedVisit(null)
      refetch()
      toast.success("Visite ajoutée avec succès.")
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout de la visite.")
    },
    mutationKey: [QUERIES.EXAMENS_LIST, 'create', selectedVisit]
  })
  
const toggleRiskMutation = useMutation(
  async () => {
    if (medicalRecord?.patient?.id && typeof medicalRecord.patient.id === "number") {
      return setRiskyPatient(medicalRecord.patient.id, !medicalRecord.risky_patient)
    }
    // Always return a Promise to satisfy MutationFunction signature
    return Promise.reject(new Error("Patient ID is not available"));
  },
  {
    mutationKey: [QUERIES.MEDICAL_RECORDS_LIST, 'toggleRisk', medicalRecord?.patient?.id],
    onSuccess: () => {
      refetch()
      toast.success("Statut du patient mis à jour.")
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du statut à risque.")
    }
  }
)
  // Gestion des droits
  const canAddVisit = ["employee", "docteur"].includes(currentUser?.role ?? "")
  const canDeleteVisit = ["employee", "docteur"].includes(currentUser?.role ?? "")

  // Suppression
  const handleDeleteVisit = (examenId: number, visiteNumber: number) => {
    setDeleteModal({ open: true, examenId, visiteNumber })
  }
  const confirmDeleteVisit = () => {
    if (deleteModal.examenId){
      deleteVisit.mutate(deleteModal.examenId)
    }
  }

  // Ajout
  const handleAddVisit = () => {
    setAddModal(true)
    setSelectedVisit(null)
  }
  const confirmAddVisit = () => {
    if (
      selectedVisit &&
      medicalRecord?.id &&
      medicalRecord?.patient &&
      typeof medicalRecord.patient.id === "number"
    ) {
      createVisit.mutate({ PatientId: medicalRecord.patient.id, visite: selectedVisit })
    }
  }

  // Récupère les numéros de visites existantes
  const existingVisits = (medicalRecord?.examens ?? []).map(e => e.visite)
  const visitOptions = [1, 2, 3]

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen ">
      {/* Bouton retour */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-blue-700 hover:underline font-semibold"
      >
        <svg width="20" height="20" fill="none"><path d="M15 10H5M10 15l-5-5 5-5" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Retour
      </button>

      {/* Modal de suppression */}
      <ConfirmationModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false })}
        onConfirm={confirmDeleteVisit}
        title="Confirmation de suppression"
        description={`Êtes-vous sûr de vouloir supprimer la visite n°${deleteModal.visiteNumber} ?`}
        confirmLabel="Supprimer"
        confirmColor="bg-red-600 hover:bg-red-700"
      />

      {/* Modal d'ajout de visite */}
      <ConfirmationModal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        onConfirm={confirmAddVisit}
        title="Ajouter une nouvelle visite"
        confirmLabel="Ajouter"
        confirmColor="bg-blue-600 hover:bg-blue-700"
        children={
          <>
            <div className="mb-2">Sélectionnez le numéro de visite à ajouter :</div>
            <div className="flex gap-4">
              {visitOptions.map(num => (
                <button
                  key={num}
                  type="button"
                  disabled={existingVisits.includes(num)}
                  onClick={() => setSelectedVisit(num)}
                  className={`px-4 py-2 rounded font-semibold border transition
                    ${selectedVisit === num ? "bg-blue-600 text-white border-blue-600" : "bg-white text-blue-700 border-blue-300"}
                    ${existingVisits.includes(num) ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50"}
                  `}
                >
                  Visite {num}
                </button>
              ))}
            </div>
          </>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8 bg-gray-50 rounded-lg p-1">
          <TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
            Informations générales
          </TabsTrigger>
          <TabsTrigger value="antecedent" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
            Antecédents
          </TabsTrigger>
          <TabsTrigger value="visits" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
            Visites
          </TabsTrigger>
        </TabsList>

        {/* Onglet Informations générales */}
        <TabsContent value="general" className="pb-10">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 via-white to-gray-50">
            <CardHeader className="border-b-0 pb-0">
              <CardTitle className="text-2xl font-bold text-blue-900 flex items-center gap-3">
                <User className="h-7 w-7 text-blue-600" />
                <p>Informations générales du patient</p>
                {/* Badge patient à risque */}
                {medicalRecord?.risky_patient && (
                  <span className="inline-block mb-4 px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-sm">
                    ⚠️ Patient à risque
                  </span>
                )}
                {/* Bouton de (dé)catégorisation */}
                {currentUser?.role === "employee" ||  currentUser?.role === "doctor" && (
                  <button
                    type="button"
                    onClick={() => toggleRiskMutation.mutate()}
                    className={`ml-3 px-3 py-1 rounded-full font-semibold text-xs transition
                      ${medicalRecord?.risky_patient
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"}
                    `}
                    disabled={toggleRiskMutation.isLoading}
                  >
                    {medicalRecord?.risky_patient
                      ? "Retirer des patients à risque"
                      : "Catégoriser comme patient à risque"}
                  </button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
              <section>
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="h-24 w-24 rounded-full  bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                    <img
                      src={medicalRecord?.patient?.image ? `${API_URL}/${medicalRecord.patient.image}` : "/placeholder.svg"}
                      alt={medicalRecord?.patient?.first_name + " " + medicalRecord?.patient?.last_name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
                    <div>
                      <span className="block text-xs text-gray-500">Nom</span>
                      <span className="font-semibold text-base">{medicalRecord?.patient?.last_name}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">Prénom</span>
                      <span className="font-semibold text-base">{medicalRecord?.patient?.first_name}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">Sexe</span>
                      <span className="font-semibold text-base">{medicalRecord?.patient?.sexe}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">Date de naissance</span>
                      <span className="font-semibold text-base">{medicalRecord?.patient?.date_naissance}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">Téléphone</span>
                      <span className="font-semibold text-base">{medicalRecord?.patient?.phone_number}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">Email</span>
                      <span className="font-semibold text-base">{medicalRecord?.patient?.email}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">Niveau d'instruction</span>
                      <span className="font-semibold text-base">{medicalRecord?.patient?.niveau_instruction}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">Instruction suivie</span>
                      <span className="font-semibold text-base">{medicalRecord?.patient?.type_instruction_suivie}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">Service</span>
                      <span className="font-semibold text-base">{medicalRecord?.patient?.service}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">Transporteur professionnel</span>
                      <span className="font-semibold text-base">
                        {medicalRecord?.patient?.transporteur_professionnel ? "Oui" : "Non"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">Années d'expérience</span>
                      <span className="font-semibold text-base">{medicalRecord?.patient?.annees_experience}</span>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                  <IdCard className="h-5 w-5" /> Permis de conduire
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
                  <div>
                    <span className="block text-xs text-gray-500">Numéro de permis</span>
                    <span className="font-semibold text-base">{medicalRecord?.patient?.numero_permis}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500">Type de permis</span>
                    <span className="font-semibold text-base">{medicalRecord?.patient?.type_permis}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500">Date de délivrance</span>
                    <span className="font-semibold text-base">{medicalRecord?.patient?.date_delivrance_permis}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500">Date d'expiration</span>
                    <span className="font-semibold text-base">{medicalRecord?.patient?.date_peremption_permis}</span>
                  </div>
                </div>
              </section>

            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Visites */}
        <TabsContent value="visits">
          <div className="space-y-8 pb-10">
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={handleAddVisit}
                disabled={!canAddVisit || (medicalRecord?.examens?.length ?? 0) >= 3}
                className={`flex items-center gap-2 px-4 py-2 rounded bg-blue-600 text-white font-semibold shadow transition
                  ${(!canAddVisit || (medicalRecord?.examens?.length ?? 0) >= 3) ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
              >
                <PlusCircle className="h-5 w-5" />
                Ajouter une visite
              </button>
            </div>
            {medicalRecord?.examens.map((examen) => {
              const driverExprience = typeof examen?.visite === "number" ? handleDrivingExperienceByVisit(examen.visite) : undefined;
              return (
                <Card key={examen.id} className="overflow-hidden shadow border-gray-200 ">
                  <CardHeader className="bg-blue-50 p-4 border-b">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg text-blue-800">Visite du {examen.visite}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        {canDeleteVisit && (
                          <button
                            type="button"
                            onClick={() =>
                              typeof examen.id === "number" &&
                              typeof examen.visite === "number" &&
                              handleDeleteVisit(examen.id, examen.visite)
                            }
                            className="ml-2 p-2 rounded hover:bg-red-100 transition"
                            title="Supprimer cette visite"
                          >
                            <Trash2 className="h-5 w-5 text-red-600" />
                          </button>
                        )}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white rounded-lg shadow p-5 border border-blue-100">
                            <h3 className="text-base font-semibold text-blue-800 mb-3 flex items-center gap-2">
                              <svg width="20" height="20" fill="none" className="inline-block text-blue-400"><circle cx="10" cy="10" r="10" fill="#DBEAFE"/><path d="M7 10l2 2 4-4" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              Expérience conducteur
                            </h3>
                            {driverExprience ? (
                              <ul className="space-y-2">
                                <li className="flex items-center gap-2">
                                  <span className="text-blue-600 font-medium">🚗 Kilométrage :</span>
                                  <span>{driverExprience.km_parcourus ?? "N/A"} km/an</span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <span className="text-blue-600 font-medium">💥 Accidents :</span>
                                  <span>{driverExprience.nombre_accidents ?? "N/A"}</span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <span className="text-blue-600 font-medium">⏰ Tranche horaire :</span>
                                  <span>{driverExprience.tranche_horaire || "N/A"}</span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <span className="text-blue-600 font-medium">📅 Date :</span>
                                  <span>{driverExprience.date_visite || "N/A"}</span>
                                </li>
                              </ul>
                            ) : (
                              <div className="text-gray-400 italic">Aucune donnée renseignée pour cette visite.</div>
                            )}
                          </div>
                          <div className="bg-white rounded-lg shadow p-5 border border-blue-100">
                            <h3 className="text-base font-semibold text-blue-800 mb-3 flex items-center gap-2">
                              <svg width="20" height="20" fill="none" className="inline-block text-blue-400"><circle cx="10" cy="10" r="10" fill="#DBEAFE"/><path d="M7 10l2 2 4-4" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              Examens
                            </h3>
                            <ul className="space-y-2">
                              <li className="flex items-center gap-2">
                                <span className="text-blue-600 font-medium">🔬 Examen technique :</span>
                                <span>{examen.technical_examen ? "Présent" : <span className="text-gray-400">Non renseigné</span>}</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="text-blue-600 font-medium">🩺 Examen clinique :</span>
                                <span>{examen.clinical_examen ? "Présent" : <span className="text-gray-400">Non renseigné</span>}</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="details" className="p-0">
                        <MedicalVisit
                          driving_experience={driverExprience}
                          technical_examen={examen.technical_examen || initialTechnicalExamen}
                          clinical_examen={examen.clinical_examen || initialClinicalExamen}
                          antecedent={antecedents}
                          extra={{
                            visitID: examen.visite,
                            patientID: medicalRecord?.patient?.id ?? undefined,
                            examenID: typeof examen.id === "number" ? examen.id : undefined,
                          }}
                        />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Onglet Antecédents */}
       <TabsContent value="antecedent">
          <Antecedent
            canEdit={canEditAntecedent}
            antecedentData={medicalRecord?.antecedant}
            patient={medicalRecord?.patient?.id ?? undefined}
          />
        </TabsContent>

      </Tabs>
    </div>
  )
}