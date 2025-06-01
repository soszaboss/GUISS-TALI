import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Save, AlertCircle } from "lucide-react"

interface MedicalHistoryProps {
  patientId: string
  userRole: string
}

export function MedicalHistory({ patientId, userRole }: MedicalHistoryProps) {
  const [formData, setFormData] = useState({
    antecedents_medico_chirurgicaux: "",
    pathologie_ophtalmologique: "",
    addiction: false,
    type_addiction: "",
    tabagisme_detail: "",
    autre_addiction_detail: "",
    familial: "",
    autre_familial_detail: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")

  const canEdit = ["assistant", "doctor", "admin"].includes(userRole)

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when field is changed
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    // Auto-save after a delay
    setSaveStatus("idle")
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.antecedents_medico_chirurgicaux) {
      newErrors.antecedents_medico_chirurgicaux = "Ce champ est obligatoire"
    }

    if (!formData.pathologie_ophtalmologique) {
      newErrors.pathologie_ophtalmologique = "Ce champ est obligatoire"
    }

    // Conditional validation
    if (formData.addiction) {
      if (!formData.type_addiction) {
        newErrors.type_addiction = "Veuillez sélectionner un type d'addiction"
      } else if (formData.type_addiction === "Tabagisme" && !formData.tabagisme_detail) {
        newErrors.tabagisme_detail = "Veuillez préciser le tabagisme"
      } else if (formData.type_addiction === "Autres" && !formData.autre_addiction_detail) {
        newErrors.autre_addiction_detail = "Veuillez préciser l'addiction"
      }
    }

    if (formData.familial) {
      if (formData.familial === "Autres" && !formData.autre_familial_detail) {
        newErrors.autre_familial_detail = "Veuillez préciser l'antécédent familial"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    setIsSaving(true)
    setSaveStatus("saving")

    try {
      // Simuler une sauvegarde API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Succès
      setSaveStatus("success")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch (error) {
      setSaveStatus("error")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {!canEdit && (
        <div className="bg-yellow-50 p-4 rounded-md flex items-center text-yellow-800 mb-4">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>
            Vous êtes en mode lecture seule. Seuls les assistants, médecins et administrateurs peuvent modifier ces
            informations.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Antécédents médicaux et ophtalmologiques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="antecedents_medico_chirurgicaux" className="flex">
              Antécédents médico-chirurgicaux
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="antecedents_medico_chirurgicaux"
              placeholder="Ex: Diabète, chirurgie cardiaque, etc."
              value={formData.antecedents_medico_chirurgicaux}
              onChange={(e) => handleChange("antecedents_medico_chirurgicaux", e.target.value)}
              disabled={!canEdit}
              className={errors.antecedents_medico_chirurgicaux ? "border-red-500" : ""}
            />
            {errors.antecedents_medico_chirurgicaux && (
              <p className="text-red-500 text-sm">{errors.antecedents_medico_chirurgicaux}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pathologie_ophtalmologique" className="flex">
              Pathologies ophtalmologiques connues
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="pathologie_ophtalmologique"
              placeholder="Ex: Glaucome, myopie forte, etc."
              value={formData.pathologie_ophtalmologique}
              onChange={(e) => handleChange("pathologie_ophtalmologique", e.target.value)}
              disabled={!canEdit}
              className={errors.pathologie_ophtalmologique ? "border-red-500" : ""}
            />
            {errors.pathologie_ophtalmologique && (
              <p className="text-red-500 text-sm">{errors.pathologie_ophtalmologique}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Habitudes à risque et addictions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="addiction"
              checked={formData.addiction}
              onCheckedChange={(checked) => handleChange("addiction", checked)}
              disabled={!canEdit}
            />
            <Label htmlFor="addiction" className="flex">
              Présence d'addiction
              <span className="text-red-500 ml-1">*</span>
            </Label>
          </div>

          {formData.addiction && (
            <div className="space-y-4 pl-6 border-l-2 border-gray-200">
              <div className="space-y-2">
                <Label htmlFor="type_addiction" className="flex">
                  Type d'addiction
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select
                  value={formData.type_addiction}
                  onValueChange={(value) => handleChange("type_addiction", value)}
                  disabled={!canEdit}
                >
                  <SelectTrigger className={errors.type_addiction ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tabagisme">Tabagisme</SelectItem>
                    <SelectItem value="Alcool">Alcool</SelectItem>
                    <SelectItem value="Téléphone portable">Téléphone portable</SelectItem>
                    <SelectItem value="Autres">Autres</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type_addiction && <p className="text-red-500 text-sm">{errors.type_addiction}</p>}
              </div>

              {formData.type_addiction === "Tabagisme" && (
                <div className="space-y-2">
                  <Label htmlFor="tabagisme_detail" className="flex">
                    Tabagisme (paquets/année)
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="tabagisme_detail"
                    value={formData.tabagisme_detail}
                    onChange={(e) => handleChange("tabagisme_detail", e.target.value)}
                    disabled={!canEdit}
                    className={errors.tabagisme_detail ? "border-red-500" : ""}
                  />
                  {errors.tabagisme_detail && <p className="text-red-500 text-sm">{errors.tabagisme_detail}</p>}
                </div>
              )}

              {formData.type_addiction === "Autres" && (
                <div className="space-y-2">
                  <Label htmlFor="autre_addiction_detail" className="flex">
                    Préciser l'addiction
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="autre_addiction_detail"
                    value={formData.autre_addiction_detail}
                    onChange={(e) => handleChange("autre_addiction_detail", e.target.value)}
                    disabled={!canEdit}
                    className={errors.autre_addiction_detail ? "border-red-500" : ""}
                  />
                  {errors.autre_addiction_detail && (
                    <p className="text-red-500 text-sm">{errors.autre_addiction_detail}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Antécédents familiaux ophtalmologiques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="familial" className="flex">
              Présence d'antécédents familiaux
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={formData.familial}
              onValueChange={(value) => handleChange("familial", value)}
              disabled={!canEdit}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un antécédent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cécité">Cécité</SelectItem>
                <SelectItem value="GPAO">GPAO</SelectItem>
                <SelectItem value="Autres">Autres</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.familial === "Autres" && (
            <div className="space-y-2">
              <Label htmlFor="autre_familial_detail" className="flex">
                Préciser l'antécédent familial
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="autre_familial_detail"
                value={formData.autre_familial_detail}
                onChange={(e) => handleChange("autre_familial_detail", e.target.value)}
                disabled={!canEdit}
                className={errors.autre_familial_detail ? "border-red-500" : ""}
              />
              {errors.autre_familial_detail && <p className="text-red-500 text-sm">{errors.autre_familial_detail}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {canEdit && (
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
  )
}
