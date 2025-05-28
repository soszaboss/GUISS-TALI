"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Save, AlertCircle } from "lucide-react"

interface DrivingExperienceProps {
  patientId: string
  userRole: string
}

interface VisitExperience {
  km_parcourus: string
  nombre_accidents: string
  tranche_horaire: string
  dommage: string
  degat: string
}

export function DrivingExperience({ patientId, userRole }: DrivingExperienceProps) {
  const [formData, setFormData] = useState<{
    visite1: VisitExperience
    visite2: VisitExperience
    visite3: VisitExperience
  }>({
    visite1: {
      km_parcourus: "",
      nombre_accidents: "",
      tranche_horaire: "",
      dommage: "",
      degat: "",
    },
    visite2: {
      km_parcourus: "",
      nombre_accidents: "",
      tranche_horaire: "",
      dommage: "",
      degat: "",
    },
    visite3: {
      km_parcourus: "",
      nombre_accidents: "",
      tranche_horaire: "",
      dommage: "",
      degat: "",
    },
  })

  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({
    visite1: {},
    visite2: {},
    visite3: {},
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")

  const canEdit = ["assistant", "doctor", "admin"].includes(userRole)

  const handleChange = (visit: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [visit]: {
        ...prev[visit as keyof typeof prev],
        [field]: value,
      },
    }))

    // Clear error when field is changed
    if (errors[visit]?.[field]) {
      setErrors((prev) => ({
        ...prev,
        [visit]: {
          ...prev[visit],
          [field]: "",
        },
      }))
    }

    // Auto-save after a delay
    setSaveStatus("idle")
  }

  const validate = () => {
    const newErrors = {
      visite1: {} as Record<string, string>,
      visite2: {} as Record<string, string>,
      visite3: {} as Record<string, string>,
    }

    let isValid = true

    // For each visit, if any field is filled, all fields become required
    for (const visit of ["visite1", "visite2", "visite3"] as const) {
      const visitData = formData[visit]
      const hasAnyValue = Object.values(visitData).some((value) => value !== "")

      if (hasAnyValue) {
        for (const [field, value] of Object.entries(visitData)) {
          if (!value) {
            newErrors[visit][field] = "Ce champ est obligatoire"
            isValid = false
          }
        }
      }
    }

    setErrors(newErrors)
    return isValid
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

  const renderVisitForm = (visit: "visite1" | "visite2" | "visite3", title: string, colorClass: string) => {
    const visitData = formData[visit]
    const visitErrors = errors[visit]

    return (
      <Card className={`border-l-4 ${colorClass}`}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${visit}-km_parcourus`} className="flex">
              Kilomètres parcourus
              {visitErrors.km_parcourus && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex">
              <Input
                id={`${visit}-km_parcourus`}
                type="number"
                value={visitData.km_parcourus}
                onChange={(e) => handleChange(visit, "km_parcourus", e.target.value)}
                disabled={!canEdit}
                className={`${visitErrors.km_parcourus ? "border-red-500" : ""} rounded-r-none`}
              />
              <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                km
              </span>
            </div>
            {visitErrors.km_parcourus && <p className="text-red-500 text-sm">{visitErrors.km_parcourus}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${visit}-nombre_accidents`} className="flex">
              Nombre d'accidents
              {visitErrors.nombre_accidents && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={`${visit}-nombre_accidents`}
              type="number"
              value={visitData.nombre_accidents}
              onChange={(e) => handleChange(visit, "nombre_accidents", e.target.value)}
              disabled={!canEdit}
              className={visitErrors.nombre_accidents ? "border-red-500" : ""}
            />
            {visitErrors.nombre_accidents && <p className="text-red-500 text-sm">{visitErrors.nombre_accidents}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${visit}-tranche_horaire`} className="flex">
              Tranche horaire
              {visitErrors.tranche_horaire && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={visitData.tranche_horaire}
              onValueChange={(value) => handleChange(visit, "tranche_horaire", value)}
              disabled={!canEdit}
            >
              <SelectTrigger
                id={`${visit}-tranche_horaire`}
                className={visitErrors.tranche_horaire ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Sélectionner une tranche" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Jour">Jour</SelectItem>
                <SelectItem value="Nuit">Nuit</SelectItem>
                <SelectItem value="Aube/Crépuscule">Aube/Crépuscule</SelectItem>
              </SelectContent>
            </Select>
            {visitErrors.tranche_horaire && <p className="text-red-500 text-sm">{visitErrors.tranche_horaire}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${visit}-dommage`} className="flex">
              Dommage
              {visitErrors.dommage && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={visitData.dommage}
              onValueChange={(value) => handleChange(visit, "dommage", value)}
              disabled={!canEdit}
            >
              <SelectTrigger id={`${visit}-dommage`} className={visitErrors.dommage ? "border-red-500" : ""}>
                <SelectValue placeholder="Sélectionner un dommage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aucun">Aucun</SelectItem>
                <SelectItem value="Léger">Léger</SelectItem>
                <SelectItem value="Moyen">Moyen</SelectItem>
                <SelectItem value="Grave">Grave</SelectItem>
              </SelectContent>
            </Select>
            {visitErrors.dommage && <p className="text-red-500 text-sm">{visitErrors.dommage}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${visit}-degat`} className="flex">
              Dégât
              {visitErrors.degat && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={visitData.degat}
              onValueChange={(value) => handleChange(visit, "degat", value)}
              disabled={!canEdit}
            >
              <SelectTrigger id={`${visit}-degat`} className={visitErrors.degat ? "border-red-500" : ""}>
                <SelectValue placeholder="Sélectionner un dégât" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aucun">Aucun</SelectItem>
                <SelectItem value="Matériel">Matériel</SelectItem>
                <SelectItem value="Corporel">Corporel</SelectItem>
                <SelectItem value="Matériel et corporel">Matériel et corporel</SelectItem>
              </SelectContent>
            </Select>
            {visitErrors.degat && <p className="text-red-500 text-sm">{visitErrors.degat}</p>}
          </div>
        </CardContent>
      </Card>
    )
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

      {renderVisitForm("visite1", "Visite 1", "border-green-500")}
      {renderVisitForm("visite2", "Visite 2", "border-blue-500")}
      {renderVisitForm("visite3", "Visite 3", "border-purple-500")}

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
