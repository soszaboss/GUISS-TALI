import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertTriangle, CheckCircle, Clock, Save, FileText } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChoiceSelect } from "../ChoiceSelect"
import { choicesMap } from "@/utils/choicesMap"

interface Visit {
  id: string
  date: string
  type: string
  status: string
  doctor: string
  technician?: string
  technical?: {
    // Acuité visuelle
    avsc_od?: string
    avsc_og?: string
    avac_od?: string
    avac_og?: string

    // Réfraction
    od_s?: string
    od_c?: string
    od_a?: string
    og_s?: string
    og_c?: string
    og_a?: string

    // Tension oculaire
    od?: string
    og?: string
    ttt_hypotonisant?: boolean
    ttt_hypotonisant_value?: string

    // Pachymétrie
    pachy_od?: string
    pachy_og?: string

    // Périmétrie
    limite_sup?: string
    limite_inf?: string
    limite_nas?: string
    limite_temp?: string
    score_esterman?: string
  }
  clinical?: {
    // Symptômes
    diplopie?: boolean
    diplopie_cote?: string
    strabisme?: boolean
    strabisme_cote?: string
    nystagmus?: boolean
    nystagmus_cote?: string
    ptosis?: boolean
    ptosis_cote?: string

    // Biomicroscopie
    cornee?: string
    transparence?: string
    type_anomalie_value?: string
    quantite_anomalie?: string
    iris?: string
    cristallin?: string
    pupille?: string

    // Segment postérieur
    retine?: string
    papille?: string
    vitre?: string

    // Conclusion
    vision?: string
    cat?: string
    traitement?: string
    observation?: string
    rv?: boolean
  }
  drivingExperience?: {
    kilometersPerYear?: number
    accidents?: number
    lastAccidentDate?: string
    nightDriving?: string
    longDistanceDriving?: string
    timeSlot?: string
    damage?: string
    damageType?: string
  }
  conclusion?: string
}

interface DoctorMedicalVisitProps {
  visit: Visit
  userRole: string
}

export function MedicalVisit({ visit, userRole = "doctor" }: DoctorMedicalVisitProps) {
  const [activeTab, setActiveTab] = useState("technical")

  // État pour l'examen technique
  const [technicalData, setTechnicalData] = useState({
    // Acuité visuelle
    avsc_od: visit.technical?.avsc_od || "",
    avsc_og: visit.technical?.avsc_og || "",
    avac_od: visit.technical?.avac_od || "",
    avac_og: visit.technical?.avac_og || "",

    // Réfraction
    od_s: visit.technical?.od_s || "",
    od_c: visit.technical?.od_c || "",
    od_a: visit.technical?.od_a || "",
    og_s: visit.technical?.og_s || "",
    og_c: visit.technical?.og_c || "",
    og_a: visit.technical?.og_a || "",

    // Tension oculaire
    od: visit.technical?.od || "",
    og: visit.technical?.og || "",
    ttt_hypotonisant: visit.technical?.ttt_hypotonisant || false,
    ttt_hypotonisant_value: visit.technical?.ttt_hypotonisant_value || "",

    // Pachymétrie
    pachy_od: visit.technical?.pachy_od || "",
    pachy_og: visit.technical?.pachy_og || "",

    // Périmétrie
    limite_sup: visit.technical?.limite_sup || "",
    limite_inf: visit.technical?.limite_inf || "",
    limite_nas: visit.technical?.limite_nas || "",
    limite_temp: visit.technical?.limite_temp || "",
    score_esterman: visit.technical?.score_esterman || "",
  })

  // État pour l'examen clinique
  const [clinicalData, setClinicalData] = useState({
    // Symptômes
    diplopie: visit.clinical?.diplopie || false,
    diplopie_cote: visit.clinical?.diplopie_cote || "",
    strabisme: visit.clinical?.strabisme || false,
    strabisme_cote: visit.clinical?.strabisme_cote || "",
    nystagmus: visit.clinical?.nystagmus || false,
    nystagmus_cote: visit.clinical?.nystagmus_cote || "",
    ptosis: visit.clinical?.ptosis || false,
    ptosis_cote: visit.clinical?.ptosis_cote || "",

    // Biomicroscopie
    cornee: visit.clinical?.cornee || "normal",
    transparence: visit.clinical?.transparence || "normal",
    type_anomalie_value: visit.clinical?.type_anomalie_value || "Normal",
    quantite_anomalie: visit.clinical?.quantite_anomalie || "",
    iris: visit.clinical?.iris || "normal",
    cristallin: visit.clinical?.cristallin || "normal",
    pupille: visit.clinical?.pupille || "normal",

    // Segment postérieur
    retine: visit.clinical?.retine || "normal",
    papille: visit.clinical?.papille || "normal",
    vitre: visit.clinical?.vitre || "normal",

    // Conclusion
    vision: visit.clinical?.vision || "",
    cat: visit.clinical?.cat || "",
    traitement: visit.clinical?.traitement || "",
    observation: visit.clinical?.observation || "",
    rv: visit.clinical?.rv || false,
  })

  // État pour l'expérience de conduite
  const [drivingData, setDrivingData] = useState({
    kilometersPerYear: visit.drivingExperience?.kilometersPerYear || 0,
    accidents: visit.drivingExperience?.accidents || 0,
    lastAccidentDate: visit.drivingExperience?.lastAccidentDate || "",
    nightDriving: visit.drivingExperience?.nightDriving || "",
    longDistanceDriving: visit.drivingExperience?.longDistanceDriving || "",
    timeSlot: visit.drivingExperience?.timeSlot || "",
    damage: visit.drivingExperience?.damage || "",
    damageType: visit.drivingExperience?.damageType || "",
  })

  const [conclusion, setConclusion] = useState(visit.conclusion || "")
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")

  // Permissions basées sur le rôle
  const canEditTechnical = ["technician", "admin"].includes(userRole) && visit.status !== "Finalisé"
  const canEditClinical = ["doctor", "admin"].includes(userRole) && visit.status !== "Finalisé"
  const canEditDriving = ["doctor", "admin"].includes(userRole) && visit.status !== "Finalisé"
  const canFinalize = ["doctor", "admin"].includes(userRole) && visit.status !== "Finalisé"

  const handleTechnicalChange = (field: string, value: string | boolean) => {
    setTechnicalData((prev) => ({ ...prev, [field]: value }))
    setSaveStatus("idle")
  }

  const handleClinicalChange = (field: string, value: string | boolean) => {
    setClinicalData((prev) => ({ ...prev, [field]: value }))
    setSaveStatus("idle")
  }

  const handleDrivingChange = (field: string, value: string | number | boolean) => {
    setDrivingData((prev) => ({ ...prev, [field]: value }))
    setSaveStatus("idle")
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus("saving")

    try {
      // Simuler une sauvegarde API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Succès
      setSaveStatus("success")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch {
      setSaveStatus("error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleFinalize = async () => {
    setIsSaving(true)
    setSaveStatus("saving")

    try {
      // Simuler une sauvegarde API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Succès
      alert("Visite finalisée avec succès!")
      // Ici, vous redirigeriez normalement vers la liste des visites
    } catch (error) {
      setSaveStatus("error")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-4">
      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
          <div>
            <h3 className="font-medium text-blue-800">Workflow de la visite</h3>
            <p className="text-sm text-blue-700">
              1. Le technicien remplit l'examen technique
              <br />
              2. Le médecin complète l'examen clinique et l'expérience de conduite
              <br />
              3. Le médecin finalise la visite avec une conclusion
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Visite du {visit.date}</h2>
          <p className="text-gray-500">
            {visit.type} • Dr. {visit.doctor}
            {visit.technician && ` • Technicien: ${visit.technician}`}
          </p>
        </div>
        <div className="flex items-center">
          {visit.status === "Finalisé" ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-1" />
              <span>Finalisé</span>
            </div>
          ) : visit.status === "En cours" ? (
            <div className="flex items-center text-amber-600">
              <Clock className="h-5 w-5 mr-1" />
              <span>En cours</span>
            </div>
          ) : (
            <div className="flex items-center text-blue-600">
              <Clock className="h-5 w-5 mr-1" />
              <span>Planifié</span>
            </div>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="technical">Examen technique</TabsTrigger>
          <TabsTrigger value="clinical">Examen clinique</TabsTrigger>
          <TabsTrigger value="driving">Expérience de conduite</TabsTrigger>
        </TabsList>

        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Examen technique
                <span className="ml-2 text-sm font-normal text-gray-500">
                  (Rempli par le technicien: {visit.technician || "Non assigné"})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!canEditTechnical && (
                <div className="bg-yellow-50 p-4 rounded-md flex items-center text-yellow-800 mb-4">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <p>
                    Vous êtes en mode lecture seule. Seuls les techniciens et administrateurs peuvent modifier ces
                    informations.
                  </p>
                </div>
              )}

              <div className="space-y-6">
                {/* Acuité visuelle */}
                <Card>
                  <CardHeader>
                    <CardTitle>Acuité Visuelle</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="avsc_od">AVSC OD</Label>
                      <Input
                        id="avsc_od"
                        value={technicalData.avsc_od}
                        onChange={(e) => handleTechnicalChange("avsc_od", e.target.value)}
                        disabled={!canEditTechnical}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avsc_og">AVSC OG</Label>
                      <Input
                        id="avsc_og"
                        value={technicalData.avsc_og}
                        onChange={(e) => handleTechnicalChange("avsc_og", e.target.value)}
                        disabled={!canEditTechnical}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avsc_od">AVSC OD</Label>
                      <Input
                        id="avsc_od"
                        value={technicalData.avsc_od}
                        onChange={(e) => handleTechnicalChange("avsc_od", e.target.value)}
                        disabled={!canEditTechnical}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avsc_og">AVSC OG</Label>
                      <Input
                        id="avsc_og"
                        value={technicalData.avsc_og}
                        onChange={(e) => handleTechnicalChange("avsc_og", e.target.value)}
                        disabled={!canEditTechnical}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avac_od">AVSC DG</Label>
                      <Input
                        id="avac_od"
                        value={technicalData.avac_od}
                        onChange={(e) => handleTechnicalChange("avac_od", e.target.value)}
                        disabled={!canEditTechnical}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avac_og">AVAC DG</Label>
                      <Input
                        id="avac_og"
                        value={technicalData.avac_og}
                        onChange={(e) => handleTechnicalChange("avac_og", e.target.value)}
                        disabled={!canEditTechnical}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Réfraction */}
                <Card>
                  <CardHeader>
                    <CardTitle>Réfraction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="font-medium">Œil</div>
                      <div className="font-medium">Sphère</div>
                      <div className="font-medium">Cylindre</div>
                      <div className="font-medium">Axe</div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center">OD</div>
                      <Input
                        value={technicalData.od_s}
                        onChange={(e) => handleTechnicalChange("od_s", e.target.value)}
                        disabled={!canEditTechnical}
                      />
                      <Input
                        value={technicalData.od_c}
                        onChange={(e) => handleTechnicalChange("od_c", e.target.value)}
                        disabled={!canEditTechnical}
                      />
                      <Input
                        value={technicalData.od_c}
                        onChange={(e) => handleTechnicalChange("od_c", e.target.value)}
                        disabled={!canEditTechnical}
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="flex items-center">OG</div>
                      <Input
                        value={technicalData.og_s}
                        onChange={(e) => handleTechnicalChange("og_s", e.target.value)}
                        disabled={!canEditTechnical}
                      />
                      <Input
                        value={technicalData.og_c}
                        onChange={(e) => handleTechnicalChange("og_c", e.target.value)}
                        disabled={!canEditTechnical}
                      />
                      <Input
                        value={technicalData.og_c}
                        onChange={(e) => handleTechnicalChange("og_c", e.target.value)}
                        disabled={!canEditTechnical}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Tension oculaire */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tension Oculaire</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="od">OD</Label>
                      <Input
                        id="od"
                        value={technicalData.od}
                        onChange={(e) => handleTechnicalChange("od", e.target.value)}
                        disabled={!canEditTechnical}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="og">OG</Label>
                      <Input
                        id="og"
                        value={technicalData.og}
                        onChange={(e) => handleTechnicalChange("og", e.target.value)}
                        disabled={!canEditTechnical}
                      />
                    </div>

                    <div className="col-span-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="ttt_hypotonisant"
                          checked={technicalData.ttt_hypotonisant}
                          onCheckedChange={(checked) => handleTechnicalChange("ttt_hypotonisant", checked)}
                          disabled={false}
                        />
                        <Label htmlFor="ttt_hypotonisant">Traitement hypotonisant</Label>
                      </div>

                      {technicalData.ttt_hypotonisant && (
                        <div className="mt-2">
                           <ChoiceSelect
                              label="Préciser le traitement" 
                              name="ttt_hypotonisant_value"
                              options={choicesMap.HypotonisantValue}
                              value={technicalData.ttt_hypotonisant_value}
                              onChange={(value) => handleTechnicalChange("ttt_hypotonisant_value", String(value))}
                              multiple={false}
                            />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Pachymétrie */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pachymétrie</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pachy_od">OD</Label>
                      <Input
                        id="pachy_od"
                        value={technicalData.pachy_od}
                        onChange={(e) => handleTechnicalChange("pachy_od", e.target.value)}
                        disabled={!canEditTechnical}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pachy_og">OG</Label>
                      <Input
                        id="pachy_og"
                        value={technicalData.pachy_og}
                        onChange={(e) => handleTechnicalChange("pachy_og", e.target.value)}
                        disabled={!canEditTechnical}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Périmétrie */}
                <Card>
                  <CardHeader>
                    <CardTitle>Périmétrie</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="limite_sup">Limite supérieure</Label>
                      <Input
                        id="limite_sup"
                        value={technicalData.limite_sup}
                        onChange={(e) => handleTechnicalChange("limite_sup", e.target.value)}
                        disabled={!canEditTechnical}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="limite_inf">Limite inférieure</Label>
                      <Input
                        id="limite_inf"
                        value={technicalData.limite_inf}
                        onChange={(e) => handleTechnicalChange("limite_inf", e.target.value)}
                        disabled={!canEditTechnical}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="limite_temp_droit">Limite temporale droit</Label>
                      <Input
                        id="limite_temp_droit"
                        value={technicalData.limite_temp}
                        onChange={(e) => handleTechnicalChange("limite_temp_droit", e.target.value)}
                        disabled={!canEditTechnical}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="limite_temp_gauche">Limite temporale gauche</Label>
                      <Input
                        id="limite_temp_gauche"
                        value={technicalData.limite_temp}
                        onChange={(e) => handleTechnicalChange("limite_temp_gauche", e.target.value)}
                        disabled={!canEditTechnical}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="score_esterman">Limite Horizontal</Label>
                      <Input
                        id="score_esterman"
                        value={technicalData.score_esterman}
                        onChange={(e) => handleTechnicalChange("score_esterman", e.target.value)}
                        disabled={!canEditTechnical}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="score_esterman">Score d'Esterman</Label>
                      <Input
                        id="score_esterman"
                        value={technicalData.score_esterman}
                        onChange={(e) => handleTechnicalChange("score_esterman", e.target.value)}
                        disabled={!canEditTechnical}
                      />
                    </div>

                    <ChoiceSelect
                      label="Périmètre binoculaire" 
                      name="perimetre_binoculaire"
                      options={choicesMap.HypotonisantValue}
                      value={technicalData.ttt_hypotonisant_value}
                      onChange={(value) => handleTechnicalChange("ttt_hypotonisant_value", String(value))}
                      multiple={false}
                    />

                  </CardContent>
                </Card>

                {canEditTechnical && (
                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving}>
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? "Enregistrement..." : "Enregistrer"}
                    </Button>

                    {saveStatus === "success" && (
                      <span className="ml-2 text-green-600 flex items-center">Enregistré avec succès</span>
                    )}

                    {saveStatus === "error" && (
                      <span className="ml-2 text-red-600 flex items-center">Erreur lors de l'enregistrement</span>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clinical">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Examen clinique
                <span className="ml-2 text-sm font-normal text-gray-500">(À compléter par le médecin)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!canEditClinical && (
                <div className="bg-yellow-50 p-4 rounded-md flex items-center text-yellow-800 mb-4">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <p>
                    Vous êtes en mode lecture seule. Seuls les médecins et administrateurs peuvent modifier ces
                    informations.
                  </p>
                </div>
              )}

              <div className="space-y-6">
                {/* Symptômes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Symptômes</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="diplopie"
                          checked={clinicalData.diplopie}
                          onCheckedChange={(checked) => handleClinicalChange("diplopie", checked === true)}
                          disabled={!canEditClinical}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="diplopie">Diplopie</Label>

                          {clinicalData.diplopie && (
                            <Select
                              value={clinicalData.diplopie_cote}
                              onValueChange={(value) => handleClinicalChange("diplopie_cote", value)}
                              disabled={!canEditClinical}
                            >
                              <SelectTrigger className="w-[180px] mt-2">
                                <SelectValue placeholder="Sélectionner un côté" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="monoculaire">Monoculaire</SelectItem>
                                <SelectItem value="binoculaire">Binoculaire</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="strabisme"
                          checked={clinicalData.strabisme}
                          onCheckedChange={(checked) => handleClinicalChange("strabisme", checked === true)}
                          disabled={!canEditClinical}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="strabisme">Strabisme</Label>

                          {clinicalData.strabisme && (
                            <Select
                              value={clinicalData.strabisme_cote}
                              onValueChange={(value) => handleClinicalChange("strabisme_cote", value)}
                              disabled={!canEditClinical}
                            >
                              <SelectTrigger className="w-[180px] mt-2">
                                <SelectValue placeholder="Sélectionner un côté" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="od">OD</SelectItem>
                                <SelectItem value="og">OG</SelectItem>
                                <SelectItem value="odg">ODG</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="nystagmus"
                          checked={clinicalData.nystagmus}
                          onCheckedChange={(checked) => handleClinicalChange("nystagmus", checked === true)}
                          disabled={!canEditClinical}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="nystagmus">Nystagmus</Label>

                          {clinicalData.nystagmus && (
                            <Select
                              value={clinicalData.nystagmus_cote}
                              onValueChange={(value) => handleClinicalChange("nystagmus_cote", value)}
                              disabled={!canEditClinical}
                            >
                              <SelectTrigger className="w-[180px] mt-2">
                                <SelectValue placeholder="Sélectionner un côté" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="od">OD</SelectItem>
                                <SelectItem value="og">OG</SelectItem>
                                <SelectItem value="odg">ODG</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="ptosis"
                          checked={clinicalData.ptosis}
                          onCheckedChange={(checked) => handleClinicalChange("ptosis", checked === true)}
                          disabled={!canEditClinical}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="ptosis">Ptosis</Label>

                          {clinicalData.ptosis && (
                            <Select
                              value={clinicalData.ptosis_cote}
                              onValueChange={(value) => handleClinicalChange("ptosis_cote", value)}
                              disabled={!canEditClinical}
                            >
                              <SelectTrigger className="w-[180px] mt-2">
                                <SelectValue placeholder="Sélectionner un côté" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="od">OD</SelectItem>
                                <SelectItem value="og">OG</SelectItem>
                                <SelectItem value="odg">ODG</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                    </div>

                      <ChoiceSelect
                        name="od_symptomes"
                        label="OD Symptômes"
                        options={choicesMap.Symptomes}
                        value={''}
                        onChange={(val) => setForm((f) => ({ ...f, symptomes: val }))}
                        multiple={false}
                      />

                      <ChoiceSelect
                        name="og_symptomes"
                        label="OG Symptômes"
                        options={choicesMap.Symptomes}
                        value={''}
                        onChange={(val) => setForm((f) => ({ ...f, symptomes: val }))}
                        multiple={false}
                      />
                  </CardContent>
                </Card>

                {/* Biomicroscopie */}
                <Card>
                  <CardHeader>
                    <CardTitle>Biomicroscopie (segment antérieur)</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="od">OD</Label>
                      <Input
                        id="od"
                        name="od"
                        type="number"
                        // value={clinicalData.od}
                        // onChange={(e) => handleClinicalChange("od", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="od">OG</Label>
                      <Input
                        id="og"
                        name="og"
                        type="number"
                        // value={clinicalData.od}
                        // onChange={(e) => handleClinicalChange("od", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <ChoiceSelect
                        name="segment"
                        label="Segment"
                        options={choicesMap.SegmentChoices}
                        value={''}
                        onChange={(val) => setForm((f) => ({ ...f, symptomes: val }))}
                        multiple={false}
                      />
                    </div>

                    <div className="space-y-2">
                      <ChoiceSelect
                        name="cornee"
                        label="Cornée"
                        options={choicesMap.Cornee}
                        value={''}
                        onChange={(val) => setForm((f) => ({ ...f, symptomes: val }))}
                        multiple={false}
                      />
                    </div>

                    <div className="space-y-2">
                       <ChoiceSelect
                        name="transparence"
                        label="Transparence"
                        value={''}
                        options={choicesMap.ChambreAnterieureTransparence}
                        onChange={(value) => handleClinicalChange("transparence", value)}
                        multiple={false}
                      />
                    </div>
                    
                    {clinicalData.transparence === "Anormale" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="type_anomalie_value">Type d'anomalie</Label>
                          <Input
                            id="type_anomalie_value"
                            value={clinicalData.type_anomalie_value}
                            onChange={(e) => handleClinicalChange("type_anomalie_value", e.target.value)}
                            disabled={!canEditClinical}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="quantite_anomalie">Quantité</Label>
                          <Input
                            id="quantite_anomalie"
                            value={clinicalData.quantite_anomalie}
                            onChange={(e) => handleClinicalChange("quantite_anomalie", e.target.value)}
                            disabled={!canEditClinical}
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <ChoiceSelect
                        name="pupille"
                        label="Pupille"
                        options={choicesMap.Pupille}
                        value={''}
                        onChange={(value) => handleClinicalChange("pupille", value)}
                        multiple={false}
                      />
                    </div>

                    <div className="space-y-2">
                      <ChoiceSelect
                        name="iris"
                        label="Iris"
                        options={choicesMap.Iris}
                        value={''}
                        onChange={(value) => handleClinicalChange("iris", value)}
                        multiple={false}
                      />
                    </div>
                    <div className="space-y-2">
                      <ChoiceSelect
                        name="cristallin"
                        label="Cristallin"
                        options={choicesMap.Cristallin}
                        value={''}
                        onChange={(value) => handleClinicalChange("cristallin", value)}
                        multiple={false}
                      />
                    </div>

                    <div className="space-y-2">
                      <ChoiceSelect
                        name="position_cristallin"
                        label="Position du cristallin"
                        options={choicesMap.PositionCristallin}
                        value={''}
                        onChange={(value) => handleClinicalChange("iris", value)}
                        multiple={false}
                      />
                    </div>

                    <div className="space-y-2">
                      <ChoiceSelect
                        name="rpm"
                        label="RPM"
                        options={choicesMap.RPM}
                        value={''}
                        onChange={(value) => handleClinicalChange("rpm", value)}
                        multiple={false}
                      />
                    </div>

                    <div className="space-y-2">
                      <ChoiceSelect
                        name="axe_visuel"
                        label="Axe visuel"
                        options={choicesMap.AxeVisuel}
                        value={''}
                        onChange={(value) => handleClinicalChange("axe_visuel", value)}
                        multiple={false}
                      />
                    </div>

                  </CardContent>
                </Card>

                {/* Segment postérieur */}
                <Card>
                  <CardHeader>
                    <CardTitle>Biomicroscopie (segment postérieur)</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="od">OD</Label>
                      <Input
                        id="od"
                        name="od"
                        type="number"
                        // value={clinicalData.od}
                        // onChange={(e) => handleClinicalChange("od", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="od">OG</Label>
                      <Input
                        id="og"
                        name="og"
                        type="number"
                        // value={clinicalData.od}
                        // onChange={(e) => handleClinicalChange("od", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="retine">Rétine</Label>
                      <Input
                        id="retine"
                        value={clinicalData.retine}
                        onChange={(e) => handleClinicalChange("retine", e.target.value)}
                        type="number"
                      />
                    </div>

                    <div className="space-y-2">
                      <ChoiceSelect
                        name="retinien_peripherique"
                        label="Périphérique rétinien"
                        options={choicesMap.ChampRetinienPeripherique}
                        value={''}
                        onChange={(val) => setForm((f) => ({ ...f, symptomes: val }))}
                        multiple={false}
                      />
                    </div>

                    <div className="space-y-2">
                      <ChoiceSelect
                        name="vitre"
                        label="Vitre"
                        options={choicesMap.Vitre}
                        value={''}
                        onChange={(val) => setForm((f) => ({ ...f, symptomes: val }))}
                        multiple={false}
                      />
                    </div>

                    <div className="space-y-2">
                      <ChoiceSelect
                        name="vaisseaux"
                        label="Vaisseaux"
                        options={choicesMap.Vaisseaux}
                        value={''}
                        onChange={(val) => setForm((f) => ({ ...f, symptomes: val }))}
                        multiple={false}
                      />
                    </div>

                    <div className="space-y-2">
                      <ChoiceSelect
                        name="papille"
                        label="Papille"
                        options={choicesMap.Papille}
                        value={''}
                        onChange={(val) => setForm((f) => ({ ...f, symptomes: val }))}
                        multiple={false}
                      />
                    </div>

                    <div className="space-y-2">
                      <ChoiceSelect
                        name="macula"
                        label="Macula"
                        options={choicesMap.Macula}
                        value={''}
                        onChange={(val) => setForm((f) => ({ ...f, symptomes: val }))}
                        multiple={false}
                      />
                    </div>

                    
                  </CardContent>
                </Card>

                {/* Conclusion */}
                <Card>
                  <CardHeader>
                    <CardTitle>Conclusion</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <ChoiceSelect
                        name="conclusion_conduite"
                        label="Conclusion sur la conduite"
                        options={choicesMap.CompatibiliteChoices}
                        value={''}
                        onChange={(val) => setForm((f) => ({ ...f, symptomes: val }))}
                        multiple={false}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cat">Catégorie</Label>
                      <Textarea
                        id="cat"
                        value={clinicalData.cat}
                        onChange={(e) => handleClinicalChange("cat", e.target.value)}
                        disabled={!canEditClinical}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="traitement">Traitement</Label>
                      <Textarea
                        id="traitement"
                        value={clinicalData.traitement}
                        onChange={(e) => handleClinicalChange("traitement", e.target.value)}
                        disabled={!canEditClinical}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="observation">Observations</Label>
                      <Textarea
                        id="observation"
                        value={clinicalData.observation}
                        onChange={(e) => handleClinicalChange("observation", e.target.value)}
                        disabled={!canEditClinical}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rv"
                        checked={clinicalData.rv}
                        onCheckedChange={(checked) => handleClinicalChange("rv", checked === true)}
                        disabled={!canEditClinical}
                      />
                      <Label htmlFor="rv">Rendez-vous de contrôle nécessaire</Label>
                    </div>
                  </CardContent>
                </Card>

                {canEditClinical && (
                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving}>
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? "Enregistrement..." : "Enregistrer"}
                    </Button>

                    {saveStatus === "success" && (
                      <span className="ml-2 text-green-600 flex items-center">Enregistré avec succès</span>
                    )}

                    {saveStatus === "error" && (
                      <span className="ml-2 text-red-600 flex items-center">Erreur lors de l'enregistrement</span>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="driving">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Expérience de conduite
                <span className="ml-2 text-sm font-normal text-gray-500">(Spécifique à cette visite)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!canEditDriving && (
                <div className="bg-yellow-50 p-4 rounded-md flex items-center text-yellow-800 mb-4">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <p>
                    Vous êtes en mode lecture seule. Seuls les médecins et administrateurs peuvent modifier ces
                    informations.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="kilometersPerYear" className="text-base font-medium">
                    Kilomètres parcourus par an
                  </Label>
                  <Input
                    id="kilometersPerYear"
                    type="number"
                    className="mt-2"
                    placeholder="Ex: 15000"
                    value={drivingData.kilometersPerYear}
                    onChange={(e) => handleDrivingChange("kilometersPerYear", Number.parseInt(e.target.value) || 0)}
                    disabled={!canEditDriving}
                  />
                </div>

                <div>
                  <Label htmlFor="accidents" className="text-base font-medium">
                    Nombre d'accidents
                  </Label>
                  <Input
                    id="accidents"
                    type="number"
                    className="mt-2"
                    placeholder="Ex: 0"
                    value={drivingData.accidents}
                    onChange={(e) => handleDrivingChange("accidents", Number.parseInt(e.target.value) || 0)}
                    disabled={!canEditDriving}
                  />
                </div>

                {drivingData.accidents > 0 && (
                  <div>
                    <Label htmlFor="lastAccidentDate" className="text-base font-medium">
                      Date du dernier accident
                    </Label>
                    <Input
                      id="lastAccidentDate"
                      type="date"
                      className="mt-2"
                      value={drivingData.lastAccidentDate}
                      onChange={(e) => handleDrivingChange("lastAccidentDate", e.target.value)}
                      disabled={!canEditDriving}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="nightDriving" className="text-base font-medium">
                    Tranche Horaire
                  </Label>
                  <Input
                    id="trancheHoraire"
                    type="number" 
                  />
                </div>

                <div>
                  <Label htmlFor="damage" className="text-base font-medium">
                    Dommages
                  </Label>
                  <ChoiceSelect
                    name="damage"
                    label=""
                    options={choicesMap.DommageChoices}
                    value={''}
                    onChange={(val) => setForm((f) => ({ ...f, symptomes: val }))}
                          multiple={false}
                    />
                </div>

                <div>
                  <Label htmlFor="degat" className="text-base font-medium">
                    Dégâts
                  </Label>
                  <ChoiceSelect
                          name="degat"
                          label=""
                          options={choicesMap.DegatChoices}
                          value={''}
                          onChange={(val) => setForm((f) => ({ ...f, symptomes: val }))}
                          multiple={false}
                    />
                </div>
              </div>

              {canEditDriving && (
                <div className="flex justify-end mt-6">
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Enregistrement..." : "Enregistrer"}
                  </Button>

                  {saveStatus === "success" && (
                    <span className="ml-2 text-green-600 flex items-center">Enregistré avec succès</span>
                  )}

                  {saveStatus === "error" && (
                    <span className="ml-2 text-red-600 flex items-center">Erreur lors de l'enregistrement</span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Section de conclusion et finalisation */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Conclusion et finalisation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="conclusion" className="text-base font-medium">
                Conclusion médicale
              </Label>
              <Textarea
                id="conclusion"
                className="mt-2"
                placeholder="Saisir la conclusion médicale"
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                disabled={!canFinalize}
              />
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-700">
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                La finalisation de la visite générera un rapport médical et ne pourra plus être modifiée.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Aperçu du rapport
          </Button>
          <div className="space-x-2 flex">
            <Button variant="outline" className="flex items-center gap-2" onClick={handleSave} disabled={!canFinalize}>
              <Save className="h-4 w-4" />
              Enregistrer
            </Button>
            <Button className="flex items-center gap-2" onClick={handleFinalize} disabled={!canFinalize}>
              <CheckCircle className="h-4 w-4" />
              Finaliser la visite
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
