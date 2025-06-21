/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Save, Pencil, AlertTriangle } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import type { DriverExperience } from "@/types/medicalRecord"
import { createDriverExperience, updateDriverExperience } from "@/services/medicalRecord"

// Schéma Zod basé sur le serializer fourni
const driverExperienceSchema = z.object({
  id: z.number().optional().nullable(),
  visite: z.number(),
  km_parcourus: z.number(),
  nombre_accidents: z.number(),
  tranche_horaire: z.string(),
  dommage: z.enum(["CORPOREL", "MATERIEL"]),
  degat: z.enum(["IMPORTANT", "MODÉRÉ", "LÉGER"]),
  date_visite: z.string().optional()
})

export function DrivingExperience({
  driverExperienceData,
  canEdit,
  onSuccess,
}: {
  driverExperienceData?: DriverExperience
  canEdit: boolean
  onSuccess?: (data: any) => void
}) {
  const [editMode, setEditMode] = React.useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: driverExperienceData,
    resolver: zodResolver(driverExperienceSchema),
    mode: "onBlur",
  })

  React.useEffect(() => {
    reset(driverExperienceData)
    setEditMode(false)
  }, [driverExperienceData, reset])

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (data.id) {
        return await updateDriverExperience(data)
      } else {
        return await createDriverExperience(data)
      }
    },
    onSuccess: (data) => {
      setEditMode(false)
      if (onSuccess) onSuccess(data)
      toast.success("Expérience conducteur enregistrée avec succès")
    },
    onError: () => {
      toast.error("Erreur lors de l'enregistrement")
    },
  })

  const onSubmit = (data: any) => {
    mutation.mutate(data)
  }

  const isDisabled = !editMode

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expérience du conducteur</CardTitle>
      </CardHeader>
      <CardContent>
        {!canEdit && (
          <div className="bg-yellow-50 p-4 rounded-md flex items-center text-yellow-800 mb-4">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p>
              Vous êtes en mode lecture seule. Seuls les utilisateurs autorisés peuvent modifier ces informations.
            </p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="visite">Visite</Label>
              <Input
                id="visite"
                type="number"
                {...register("visite")}
                disabled={isDisabled}
              />
              {errors.visite && (
                <span className="text-red-500 text-xs">{errors.visite.message as string}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="km_parcourus">Km parcourus</Label>
              <Input
                id="km_parcourus"
                type="number"
                {...register("km_parcourus")}
                disabled={isDisabled}
              />
              {errors.km_parcourus && (
                <span className="text-red-500 text-xs">{errors.km_parcourus.message as string}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre_accidents">Nombre d'accidents</Label>
              <Input
                id="nombre_accidents"
                type="number"
                {...register("nombre_accidents")}
                disabled={isDisabled}
              />
              {errors.nombre_accidents && (
                <span className="text-red-500 text-xs">{errors.nombre_accidents.message as string}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tranche_horaire">Tranche horaire</Label>
              <Input
                id="tranche_horaire"
                type="text"
                {...register("tranche_horaire")}
                disabled={isDisabled}
              />
              {errors.tranche_horaire && (
                <span className="text-red-500 text-xs">{errors.tranche_horaire.message as string}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dommage">Dommage</Label>
              <select
                id="dommage"
                {...register("dommage")}
                disabled={isDisabled}
                className="w-full border rounded px-2 py-1"
              >
                <option value="">--</option>
                <option value="CORPOREL">Corporel</option>
                <option value="MATERIEL">Matériel</option>
              </select>
              {errors.dommage && (
                <span className="text-red-500 text-xs">{errors.dommage.message as string}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="degat">Dégât</Label>
              <select
                id="degat"
                {...register("degat")}
                disabled={isDisabled}
                className="w-full border rounded px-2 py-1"
              >
                <option value="">--</option>
                <option value="IMPORTANT">Important</option>
                <option value="MODERE">Modéré</option>
                <option value="LEGER">Léger</option>
              </select>
              {errors.degat && (
                <span className="text-red-500 text-xs">{errors.degat.message as string}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_visite">Date de la visite</Label>
              <Input
                id="date_visite"
                type="date"
                {...register("date_visite")}
                disabled={isDisabled}
              />
              {errors.date_visite && (
                <span className="text-red-500 text-xs">{errors.date_visite.message as string}</span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            {canEdit && !editMode && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditMode(true)}
                className="flex items-center"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
            {canEdit && editMode && (
              <Button
                type="submit"
                disabled={mutation.isLoading || isSubmitting}
                className="flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {mutation.isLoading || isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}