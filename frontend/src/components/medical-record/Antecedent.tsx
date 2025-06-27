/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Save, Pencil, AlertTriangle } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { defaultAntecedentValues, type Antecedent } from "@/types/medicalRecord"
import { updateAntecedent, createAntecedent } from "@/services/medicalRecord"

// Schéma Zod pour Antecedent (multi-select et validations conditionnelles)
const antecedentSchema = z.object({
  id: z.any().optional(),
  antecedents_medico_chirurgicaux: z.string().min(1, "Champ requis"),
  pathologie_ophtalmologique: z.string().min(1, "Champ requis"),
  addiction: z.boolean().default(false),
  type_addiction: z.array(z.enum(["TABAGISME", "ALCOOL", "TELEPHONE", "OTHER"])).default([]),
  autre_addiction_detail: z.string().optional(),
  tabagisme_detail: z.string().optional(),
  familial: z.array(z.enum(["CECITE", "GPAO", "GLAUCOME", "OTHER"])).default([]),
  autre_familial_detail: z.string().optional(),
  patient: z.any().optional(),
}).superRefine((data, ctx) => {
  if (data.addiction && (!data.type_addiction || data.type_addiction.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Au moins un type d'addiction est requis",
      path: ["type_addiction"],
    })
  }
  if (data.type_addiction?.includes("TABAGISME") && !data.tabagisme_detail) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Détails requis pour le tabagisme",
      path: ["tabagisme_detail"],
    })
  }
  if (data.type_addiction?.includes("OTHER") && !data.autre_addiction_detail) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Détails requis pour autre addiction",
      path: ["autre_addiction_detail"],
    })
  }
  if (data.familial?.includes("OTHER") && !data.autre_familial_detail) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Détails requis pour autre antécédent familial",
      path: ["autre_familial_detail"],
    })
  }
})

export function Antecedent({
  antecedentData,
  canEdit,
  onSuccess,
  patient
}: {
  antecedentData?: Antecedent
  canEdit: boolean
  patient?: number
  onSuccess?: (data: Antecedent) => void
}) {
  const [editMode, setEditMode] = React.useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    control,
    setValue,
  } = useForm({
    defaultValues: antecedentData || defaultAntecedentValues,
    resolver: zodResolver(antecedentSchema),
    mode: "onBlur",
  })

  React.useEffect(() => {
    reset(antecedentData || defaultAntecedentValues)
    setEditMode(false)
  }, [antecedentData, reset])

  // ...autres imports et code...

  // Nettoyage automatique des champs dépendants dans le formulaire (UX)
  const addiction = watch("addiction")
  const type_addiction = watch("type_addiction") || []
  const familial = watch("familial") || []

  React.useEffect(() => {
    if (!addiction) {
      setValue("type_addiction", [])
      setValue("tabagisme_detail", "")
      setValue("autre_addiction_detail", "")
    } else {
      if (!type_addiction.includes("TABAGISME")) setValue("tabagisme_detail", "")
      if (!type_addiction.includes("OTHER")) setValue("autre_addiction_detail", "")
    }
    if (!familial.includes("OTHER")) setValue("autre_familial_detail", "")
  }, [addiction, type_addiction, familial, setValue])

// ...reste du code...

  // Nettoyage avant soumission
  const cleanAntecedent = (data: Antecedent): Antecedent => ({
    ...data,
    type_addiction: data.addiction ? data.type_addiction : [],
    tabagisme_detail: data.type_addiction?.includes("TABAGISME") ? data.tabagisme_detail : '',
    autre_addiction_detail: data.type_addiction?.includes("OTHER") ? data.autre_addiction_detail : '',
    familial: data.familial || [],
    autre_familial_detail: data.familial?.includes("OTHER") ? data.autre_familial_detail : '',
  })

  const onInvalid = (errors: any) => {
    if (!addiction && errors.type_addiction) {
      toast.error(errors.type_addiction.message as string)
    }
    if (addiction && !type_addiction.includes("TABAGISME") && errors.tabagisme_detail) {
      toast.error(errors.tabagisme_detail.message as string)
    }
    if (addiction && !type_addiction.includes("OTHER") && errors.autre_addiction_detail) {
      toast.error(errors.autre_addiction_detail.message as string)
    }
    if (!familial.includes("OTHER") && errors.autre_familial_detail) {
      toast.error(errors.autre_familial_detail.message as string)
    }
    if (Object.keys(errors).length > 0) {
      toast.error("Merci de corriger les champs signalés avant de soumettre.")
    }
  }

  const mutation = useMutation({
    mutationFn: async (data: Antecedent) => {
      if (data.id) {
        return await updateAntecedent(data)
      } else {
        return await createAntecedent({
          ...data,
          patient: patient
        })
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

  const onSubmit = (rawData: Antecedent) => {
    const data = cleanAntecedent(rawData)
    mutation.mutate(data)
  }

  const isDisabled = !editMode

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

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit, onInvalid)} autoComplete="off">
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
            {(addiction || errors.type_addiction || errors.tabagisme_detail || errors.autre_addiction_detail) && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="type_addiction">Type(s) d'addiction</Label>
                  <Controller
                    control={control}
                    name="type_addiction"
                    render={({ field }) => (
                      <select
                        id="type_addiction"
                        multiple
                        value={field.value}
                        onChange={e => {
                          const selected = Array.from(e.target.selectedOptions).map(option => option.value)
                          field.onChange(selected)
                        }}
                        disabled={isDisabled}
                        className="w-full border rounded px-2 py-1"
                      >
                        <option value="TABAGISME">Tabagisme</option>
                        <option value="ALCOOL">Alcool</option>
                        <option value="TELEPHONE">Téléphone</option>
                        <option value="OTHER">Autre</option>
                      </select>
                    )}
                  />
                  {errors.type_addiction && (
                    <span className="text-red-500 text-xs">{errors.type_addiction.message as string}</span>
                  )}
                </div>
                {(type_addiction.includes("OTHER") || errors.autre_addiction_detail) && (
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
                {(type_addiction.includes("TABAGISME") || errors.tabagisme_detail) && (
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
              <Controller
                control={control}
                name="familial"
                render={({ field }) => (
                  <select
                    id="familial"
                    multiple
                    value={field.value}
                    onChange={e => {
                      const selected = Array.from(e.target.selectedOptions).map(option => option.value)
                      field.onChange(selected)
                    }}
                    disabled={isDisabled}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="CECITE">Cécité</option>
                    <option value="GPAO">GPAO</option>
                    <option value="GLAUCOME">Glaucome</option>
                    <option value="OTHER">Autre</option>
                  </select>
                )}
              />
              {errors.familial && (
                <span className="text-red-500 text-xs">{errors.familial.message as string}</span>
              )}
            </div>
            {(familial.includes("OTHER") || errors.autre_familial_detail) && (
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