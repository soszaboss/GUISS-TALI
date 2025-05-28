"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Save, AlertCircle } from "lucide-react"

interface TechnicalExaminationProps {
  visitId: string
  patientId: string
  userRole: string
}

export function TechnicalExamination({ visitId, patientId, userRole }: TechnicalExaminationProps) {
  const [formData, setFormData] = useState({
    // Acuité visuelle
    avsc_od: "",
    avsc_og: "",
    avac_od: "",
    avac_og: "",

    // Réfraction
    od_s: "",
    od_c: "",
    od_a: "",
    og_s: "",
    og_c: "",
    og_a: "",

    // Tension oculaire
    od: "",
    og: "",
    ttt_hypotonisant: false,
    ttt_hypotonisant_value: "",

    // Pachymétrie
    pachy_od: "",
    pachy_og: "",

    // Périmétrie
    limite_sup: "",
    limite_inf: "",
    limite_nas: "",
    limite_temp: "",
    score_esterman: "",
    image: null as File | null,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")

  const canEdit = ["technician", "doctor", "admin"].includes(userRole)

  const handleChange = (field: string, value: string | boolean | File | null) => {
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
            Vous êtes en mode lecture seule. Seuls les techniciens, médecins et administrateurs peuvent modifier ces
            informations.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Acuité Visuelle</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="avsc_od">AVSC OD</Label>
            <Input
              id="avsc_od"
              value={formData.avsc_od}
              onChange={(e) => handleChange("avsc_od", e.target.value)}
              disabled={!canEdit}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avsc_og">AVSC OG</Label>
            <Input
              id="avsc_og"
              value={formData.avsc_og}
              onChange={(e) => handleChange("avsc_og", e.target.value)}
              disabled={!canEdit}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avac_od">AVAC OD</Label>
            <Input
              id="avac_od"
              value={formData.avac_od}
              onChange={(e) => handleChange("avac_od", e.target.value)}
              disabled={!canEdit}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avac_og">AVAC OG</Label>
            <Input
              id="avac_og"
              value={formData.avac_og}
              onChange={(e) => handleChange("avac_og", e.target.value)}
              disabled={!canEdit}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Réfraction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="font-medium">Œil</div>
            <div className="font-medium">Sphère</div>
            <div className="font-medium">Cylindre</div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex items-center">OD</div>
            <Input value={formData.od_s} onChange={(e) => handleChange("od_s", e.target.value)} disabled={!canEdit} />
            <Input value={formData.od_c} onChange={(e) => handleChange("od_c", e.target.value)} disabled={!canEdit} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center">OG</div>
            <Input value={formData.og_s} onChange={(e) => handleChange("og_s", e.target.value)} disabled={!canEdit} />
            <Input value={formData.og_c} onChange={(e) => handleChange("og_c", e.target.value)} disabled={!canEdit} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tension Oculaire</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="od">OD</Label>
            <Input
              id="od"
              value={formData.od}
              onChange={(e) => handleChange("od", e.target.value)}
              disabled={!canEdit}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="og">OG</Label>
            <Input
              id="og"
              value={formData.og}
              onChange={(e) => handleChange("og", e.target.value)}
              disabled={!canEdit}
            />
          </div>

          <div className="col-span-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="ttt_hypotonisant"
                checked={formData.ttt_hypotonisant}
                onCheckedChange={(checked) => handleChange("ttt_hypotonisant", checked)}
                disabled={!canEdit}
              />
              <Label htmlFor="ttt_hypotonisant">Traitement hypotonisant</Label>
            </div>

            {formData.ttt_hypotonisant && (
              <div className="mt-2">
                <Label htmlFor="ttt_hypotonisant_value">Préciser le traitement</Label>
                <Input
                  id="ttt_hypotonisant_value"
                  value={formData.ttt_hypotonisant_value}
                  onChange={(e) => handleChange("ttt_hypotonisant_value", e.target.value)}
                  disabled={!canEdit}
                  className="mt-1"
                />
              </div>
            )}
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
