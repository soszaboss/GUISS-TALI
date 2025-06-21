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
import type { Antecedent } from "@/types/medicalRecord"
import { updateAntecedent, createAntecedent } from "@/services/medicalRecord"

// Schéma Zod pour Antecedent
const antecedentSchema = z.object({
  id: z.any().optional(),
  antecedents_medico_chirurgicaux: z.string().min(1, "Champ requis"),
  pathologie_ophtalmologique: z.string().min(1, "Champ requis"),
  addiction: z.boolean(),
  type_addiction: z.enum(["TABAGISME", "ALCOOL", "TELEPHONE", "OTHER"]),
  autre_addiction_detail: z.string().optional(),
  tabagisme_detail: z.string().optional(),
  familial: z.enum(["CECITÉ", "GPAO", "OTHER"]),
  autre_familial_detail: z.string().optional(),
  patient: z.any().optional(),
})

export function Antecedent({
  antecedentData,
  canEdit,
  onSuccess,
}: {
  antecedentData?: Antecedent
  canEdit: boolean
  onSuccess?: (data: any) => void
}) {
  const [editMode, setEditMode] = React.useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    defaultValues: antecedentData,
    resolver: zodResolver(antecedentSchema),
    mode: "onBlur",
  })

  React.useEffect(() => {
    reset(antecedentData)
    setEditMode(false)
  }, [antecedentData, reset])

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (data.id) {
        return await updateAntecedent(data)
      } else {
        return await createAntecedent(data)
      }
    },
    onSuccess: (data) => {
      setEditMode(false)
      if (onSuccess) onSuccess(data)
      toast.success("Antécédents enregistrés avec succès")
    },
    onError: () => {
      toast.error("Erreur lors de l'enregistrement")
    },
  })

  const onSubmit = (data: any) => {
    mutation.mutate(data)
  }

  const isDisabled = !editMode
  const addiction = watch("addiction")
  const type_addiction = watch("type_addiction")
  const familial = watch("familial")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Antécédents</CardTitle>
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
              <Label htmlFor="antecedents_medico_chirurgicaux">Antécédents médico-chirurgicaux</Label>
              <Input
                id="antecedents_medico_chirurgicaux"
                type="text"
                {...register("antecedents_medico_chirurgicaux")}
                disabled={isDisabled}
              />
              {errors.antecedents_medico_chirurgicaux && (
                <span className="text-red-500 text-xs">{errors.antecedents_medico_chirurgicaux.message as string}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pathologie_ophtalmologique">Pathologie ophtalmologique</Label>
              <Input
                id="pathologie_ophtalmologique"
                type="text"
                {...register("pathologie_ophtalmologique")}
                disabled={isDisabled}
              />
              {errors.pathologie_ophtalmologique && (
                <span className="text-red-500 text-xs">{errors.pathologie_ophtalmologique.message as string}</span>
              )}
            </div>
            <div className="space-y-2 flex items-center">
              <input
                id="addiction"
                type="checkbox"
                {...register("addiction")}
                disabled={isDisabled}
                className="mr-2"
              />
              <Label htmlFor="addiction">Addiction</Label>
              {errors.addiction && (
                <span className="text-red-500 text-xs ml-2">{errors.addiction.message as string}</span>
              )}
            </div>
            {addiction && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="type_addiction">Type d'addiction</Label>
                  <select
                    id="type_addiction"
                    {...register("type_addiction")}
                    disabled={isDisabled}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="TABAGISME">Tabagisme</option>
                    <option value="ALCOOL">Alcool</option>
                    <option value="TELEPHONE">Téléphone</option>
                    <option value="OTHER">Autre</option>
                  </select>
                  {errors.type_addiction && (
                    <span className="text-red-500 text-xs">{errors.type_addiction.message as string}</span>
                  )}
                </div>
                {type_addiction === "OTHER" && (
                  <div className="space-y-2">
                    <Label htmlFor="autre_addiction_detail">Détail autre addiction</Label>
                    <Input
                      id="autre_addiction_detail"
                      type="text"
                      {...register("autre_addiction_detail")}
                      disabled={isDisabled}
                    />
                    {errors.autre_addiction_detail && (
                      <span className="text-red-500 text-xs">{errors.autre_addiction_detail.message as string}</span>
                    )}
                  </div>
                )}
                {type_addiction === "TABAGISME" && (
                  <div className="space-y-2">
                    <Label htmlFor="tabagisme_detail">Détail tabagisme</Label>
                    <Input
                      id="tabagisme_detail"
                      type="text"
                      {...register("tabagisme_detail")}
                      disabled={isDisabled}
                    />
                    {errors.tabagisme_detail && (
                      <span className="text-red-500 text-xs">{errors.tabagisme_detail.message as string}</span>
                    )}
                  </div>
                )}
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="familial">Antécédents familiaux</Label>
              <select
                id="familial"
                {...register("familial")}
                disabled={isDisabled}
                className="w-full border rounded px-2 py-1"
              >
                <option value="CECITÉ">Cécité</option>
                <option value="GPAO">GPAO</option>
                <option value="OTHER">Autre</option>
              </select>
              {errors.familial && (
                <span className="text-red-500 text-xs">{errors.familial.message as string}</span>
              )}
            </div>
            {familial === "OTHER" && (
              <div className="space-y-2">
                <Label htmlFor="autre_familial_detail">Détail autre antécédents familiaux</Label>
                <Input
                  id="autre_familial_detail"
                  type="text"
                  {...register("autre_familial_detail")}
                  disabled={isDisabled}
                />
                {errors.autre_familial_detail && (
                  <span className="text-red-500 text-xs">{errors.autre_familial_detail.message as string}</span>
                )}
              </div>
            )}
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