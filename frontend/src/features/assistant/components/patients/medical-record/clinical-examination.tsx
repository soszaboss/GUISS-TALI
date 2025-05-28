"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Save, AlertCircle } from "lucide-react"

interface ClinicalExaminationProps {
  visitId: string
  patientId: string
  userRole: string
}

export function ClinicalExamination({ visitId, patientId, userRole }: ClinicalExaminationProps) {
  const [formData, setFormData] = useState({
    // Symptômes
    diplopie: false,
    diplopie_cote: "",
    strabisme: false,
    strabisme_cote: "",
    nystagmus: false,
    nystagmus_cote: "",
    ptosis: false,
    ptosis_cote: "",

    // Biomicroscopie
    cornee: "normal",
    transparence: "normal",
    type_anomalie_value: "",
    quantite_anomalie: "",
    iris: "normal",
    cristallin: "normal",
    pupille: "normal",

    // Segment postérieur
    retine: "normal",
    papille: "normal",
    vitre: "normal",

    // Conclusion
    vision: "",
    cat: "",
    traitement: "",
    observation: "",
    rv: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")

  const canEdit = ["doctor", "admin"].includes(userRole)

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

  const handleSave = async () => {
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
            Vous êtes en mode lecture seule. Seuls les médecins et administrateurs peuvent modifier ces informations.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Symptômes</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="diplopie"
                checked={formData.diplopie}
                onCheckedChange={(checked) => handleChange("diplopie", checked === true)}
                disabled={!canEdit}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="diplopie">Diplopie</Label>

                {formData.diplopie && (
                  <Select
                    value={formData.diplopie_cote}
                    onValueChange={(value) => handleChange("diplopie_cote", value)}
                    disabled={!canEdit}
                  >
                    <SelectTrigger className="w-[180px] mt-2">
                      <SelectValue placeholder="Sélectionner un côté" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OD">OD</SelectItem>
                      <SelectItem value="OG">OG</SelectItem>
                      <SelectItem value="ODG">ODG</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="strabisme"
                checked={formData.strabisme}
                onCheckedChange={(checked) => handleChange("strabisme", checked === true)}
                disabled={!canEdit}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="strabisme">Strabisme</Label>

                {formData.strabisme && (
                  <Select
                    value={formData.strabisme_cote}
                    onValueChange={(value) => handleChange("strabisme_cote", value)}
                    disabled={!canEdit}
                  >
                    <SelectTrigger className="w-[180px] mt-2">
                      <SelectValue placeholder="Sélectionner un côté" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OD">OD</SelectItem>
                      <SelectItem value="OG">OG</SelectItem>
                      <SelectItem value="ODG">ODG</SelectItem>
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
                checked={formData.nystagmus}
                onCheckedChange={(checked) => handleChange("nystagmus", checked === true)}
                disabled={!canEdit}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="nystagmus">Nystagmus</Label>

                {formData.nystagmus && (
                  <Select
                    value={formData.nystagmus_cote}
                    onValueChange={(value) => handleChange("nystagmus_cote", value)}
                    disabled={!canEdit}
                  >
                    <SelectTrigger className="w-[180px] mt-2">
                      <SelectValue placeholder="Sélectionner un côté" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OD">OD</SelectItem>
                      <SelectItem value="OG">OG</SelectItem>
                      <SelectItem value="ODG">ODG</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="ptosis"
                checked={formData.ptosis}
                onCheckedChange={(checked) => handleChange("ptosis", checked === true)}
                disabled={!canEdit}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="ptosis">Ptosis</Label>

                {formData.ptosis && (
                  <Select
                    value={formData.ptosis_cote}
                    onValueChange={(value) => handleChange("ptosis_cote", value)}
                    disabled={!canEdit}
                  >
                    <SelectTrigger className="w-[180px] mt-2">
                      <SelectValue placeholder="Sélectionner un côté" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OD">OD</SelectItem>
                      <SelectItem value="OG">OG</SelectItem>
                      <SelectItem value="ODG">ODG</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Biomicroscopie (segment antérieur)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cornee">Cornée</Label>
            <Select
              value={formData.cornee}
              onValueChange={(value) => handleChange("cornee", value)}
              disabled={!canEdit}
            >
              <SelectTrigger id="cornee">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="anormal">Anormal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transparence">Transparence</Label>
            <Select
              value={formData.transparence}
              onValueChange={(value) => handleChange("transparence", value)}
              disabled={!canEdit}
            >
              <SelectTrigger id="transparence">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="anormal">Anormal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.transparence === "anormal" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="type_anomalie_value">Type d'anomalie</Label>
                <Input
                  id="type_anomalie_value"
                  value={formData.type_anomalie_value}
                  onChange={(e) => handleChange("type_anomalie_value", e.target.value)}
                  disabled={!canEdit}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantite_anomalie">Quantité</Label>
                <Input
                  id="quantite_anomalie"
                  value={formData.quantite_anomalie}
                  onChange={(e) => handleChange("quantite_anomalie", e.target.value)}
                  disabled={!canEdit}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="iris">Iris</Label>
            <Select value={formData.iris} onValueChange={(value) => handleChange("iris", value)} disabled={!canEdit}>
              <SelectTrigger id="iris">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="anormal">Anormal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cristallin">Cristallin</Label>
            <Select
              value={formData.cristallin}
              onValueChange={(value) => handleChange("cristallin", value)}
              disabled={!canEdit}
            >
              <SelectTrigger id="cristallin">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="anormal">Anormal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pupille">Pupille</Label>
            <Select
              value={formData.pupille}
              onValueChange={(value) => handleChange("pupille", value)}
              disabled={!canEdit}
            >
              <SelectTrigger id="pupille">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="anormal">Anormal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Segment postérieur</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="retine">Rétine</Label>
            <Select
              value={formData.retine}
              onValueChange={(value) => handleChange("retine", value)}
              disabled={!canEdit}
            >
              <SelectTrigger id="retine">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="anormal">Anormal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="papille">Papille</Label>
            <Select
              value={formData.papille}
              onValueChange={(value) => handleChange("papille", value)}
              disabled={!canEdit}
            >
              <SelectTrigger id="papille">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="anormal">Anormal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vitre">Vitré</Label>
            <Select value={formData.vitre} onValueChange={(value) => handleChange("vitre", value)} disabled={!canEdit}>
              <SelectTrigger id="vitre">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="anormal">Anormal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conclusion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vision">Vision</Label>
            <Select
              value={formData.vision}
              onValueChange={(value) => handleChange("vision", value)}
              disabled={!canEdit}
            >
              <SelectTrigger id="vision">
                <SelectValue placeholder="Sélectionner un état" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normale">Normale</SelectItem>
                <SelectItem value="diminuee">Diminuée</SelectItem>
                <SelectItem value="tres_diminuee">Très diminuée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cat">Catégorie</Label>
            <Textarea
              id="cat"
              value={formData.cat}
              onChange={(e) => handleChange("cat", e.target.value)}
              disabled={!canEdit}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="traitement">Traitement</Label>
            <Textarea
              id="traitement"
              value={formData.traitement}
              onChange={(e) => handleChange("traitement", e.target.value)}
              disabled={!canEdit}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observation">Observations</Label>
            <Textarea
              id="observation"
              value={formData.observation}
              onChange={(e) => handleChange("observation", e.target.value)}
              disabled={!canEdit}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="rv"
              checked={formData.rv}
              onCheckedChange={(checked) => handleChange("rv", checked === true)}
              disabled={!canEdit}
            />
            <Label htmlFor="rv">Rendez-vous de contrôle nécessaire</Label>
          </div>
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
