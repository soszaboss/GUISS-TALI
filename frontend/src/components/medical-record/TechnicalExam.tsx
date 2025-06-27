/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Save, Pencil, AlertTriangle } from "lucide-react"
import { ChoiceSelect } from "../ChoiceSelect"
import { choicesMap } from "@/helpers/ChoicesMap"
import { useMutation } from "@tanstack/react-query"
import { createTechnicalExam, updateTechnicalExam } from "@/services/technicalExamen"
import { toast } from "sonner"
import { z } from "zod"
import type { TechnicalExamen } from "@/types/examenTechniques"

// Schéma Zod complet avec toutes les contraintes métiers
const technicalExamSchema = z.object({
  id: z.any().optional(),
  visual_acuity: z.object({
    avsc_od: z.coerce.number().min(0, "Min 0").max(10, "Max 10").optional(),
    avsc_og: z.coerce.number().min(0, "Min 0").max(10, "Max 10").optional(),
    avsc_odg: z.coerce.number().min(0, "Min 0").max(10, "Max 10").optional(),
    avac_od: z.coerce.number().min(0, "Min 0").max(10, "Max 10").optional(),
    avac_og: z.coerce.number().min(0, "Min 0").max(10, "Max 10").optional(),
    avac_odg: z.coerce.number().min(0, "Min 0").max(10, "Max 10").optional(),
  }).optional(),

  refraction: z.object({
    correction_optique: z.boolean().default(false),
    od_s: z.coerce.number().min(-10, "Min -10").max(10, "Max 10").nullable().optional(),
    og_s: z.coerce.number().min(-10, "Min -10").max(10, "Max 10").nullable().optional(),
    od_c: z.coerce.number().min(-10, "Min -10").max(10, "Max 10").nullable().optional(),
    og_c: z.coerce.number().min(-10, "Min -10").max(10, "Max 10").nullable().optional(),
    od_a: z.coerce.number().min(-10, "Min -10").max(10, "Max 10").nullable().optional(),
    og_a: z.coerce.number().min(-10, "Min -10").max(10, "Max 10").nullable().optional(),
    avog: z.coerce.number().nullable().optional(),
    avod: z.coerce.number().nullable().optional(),
    dp: z.coerce.number().nullable().optional(),
  }).refine(
    (data) =>
      !data.correction_optique ||
      (
        data.od_s !== null && data.od_s !== undefined &&
        data.og_s !== null && data.og_s !== undefined &&
        data.od_c !== null && data.od_c !== undefined &&
        data.og_c !== null && data.og_c !== undefined &&
        data.od_a !== null && data.od_a !== undefined &&
        data.og_a !== null && data.og_a !== undefined
      ),
    {
      message: "Tous les champs S, C, A doivent être renseignés si correction optique.",
      path: ["correction_optique"],
    }
  ).optional(),

  ocular_tension: z.object({
    od: z.coerce.number().nullable().optional(),
    og: z.coerce.number().nullable().optional(),
    ttt_hypotonisant: z.boolean().nullable().optional(),
    ttt_hypotonisant_value: z.string().nullable().optional(),
  }).refine(
    (data) =>
      !data.ttt_hypotonisant || !!data.ttt_hypotonisant_value,
    {
      message: "Préciser le traitement hypotonisant",
      path: ["ttt_hypotonisant_value"],
    }
  ).optional(),

  pachymetry: z.object({
    cto_od: z.coerce.number().optional(),
    cto_og: z.coerce.number().optional(),
    od: z.coerce.number().optional(),
    og: z.coerce.number().optional(),
  }).optional(),

  visite: z.number().optional(),
  is_completed: z.boolean().optional(),
  patient: z.number().optional().nullable(),
  created: z.string().optional(),
  modified: z.string().optional(),
})

// Helper pour accéder aux erreurs imbriquées
function getError(errors: any, path: string) {
  return path.split('.').reduce((acc, key) => acc?.[key], errors)
}

export function TechnicalExam({
  technicalData,
  canEditTechnical,
  onSuccess,
  examenID,
  visiteID,
  patientID
}: {
  technicalData: TechnicalExamen,
  examenID?: number
  visiteID?: number
  patientID?: number
  canEditTechnical: boolean
  onSuccess?: (data: any) => void
}) {
  const [editMode, setEditMode] = React.useState(false)
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    defaultValues: technicalData,
    resolver: zodResolver(technicalExamSchema),
    mode: "onBlur",
  })

  React.useEffect(() => {
    reset(technicalData)
    setEditMode(false)
  }, [technicalData, reset])

  // Champs conditionnels
  const correctionOptique = watch("refraction.correction_optique")
  const tttHypotonisant = watch("ocular_tension.ttt_hypotonisant")

  // Nettoyage automatique des champs dépendants dans le formulaire (UX)
  React.useEffect(() => {
    if (!correctionOptique) {
      setValue("refraction.od_s", null)
      setValue("refraction.og_s", null)
      setValue("refraction.od_c", null)
      setValue("refraction.og_c", null)
      setValue("refraction.od_a", null)
      setValue("refraction.og_a", null)
    }
    if (!tttHypotonisant) {
      setValue("ocular_tension.ttt_hypotonisant_value", null)
    }
    // eslint-disable-next-line
  }, [correctionOptique, tttHypotonisant, setValue])

  // Nettoyage avant soumission
  const cleanTechnicalExam = (data: any) => {
    const cleaned = { ...data }
    if (!cleaned.refraction?.correction_optique) {
      cleaned.refraction = {
        ...cleaned.refraction,
        od_s: null,
        og_s: null,
        od_c: null,
        og_c: null,
        od_a: null,
        og_a: null,
      }
    }
    if (!cleaned.ocular_tension?.ttt_hypotonisant) {
      cleaned.ocular_tension = {
        ...cleaned.ocular_tension,
        ttt_hypotonisant_value: null,
      }
    }
    return cleaned
  }

  // Toasts pour erreurs sur champs conditionnels cachés
  const onInvalid = (errors: any) => {
    if (!correctionOptique) {
      if (
        getError(errors, "refraction.od_s") ||
        getError(errors, "refraction.og_s") ||
        getError(errors, "refraction.od_c") ||
        getError(errors, "refraction.og_c") ||
        getError(errors, "refraction.od_a") ||
        getError(errors, "refraction.og_a")
      ) {
        toast.error("Tous les champs S, C, A doivent être renseignés si correction optique.")
      }
    }
    if (!tttHypotonisant && getError(errors, "ocular_tension.ttt_hypotonisant_value")) {
      toast.error(getError(errors, "ocular_tension.ttt_hypotonisant_value")?.message)
    }
    if (Object.keys(errors).length > 0) {
      toast.error("Merci de corriger les champs signalés avant de soumettre.")
    }
  }

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (data.id !== undefined && data.id !== null) {
        return await updateTechnicalExam(data)
      } else {
        if (typeof examenID === "undefined" || examenID === null) {
          throw new Error("examenID est requis pour créer un examen technique")
        }
        return await createTechnicalExam({
          ...data,
          visite: visiteID,
          patient: patientID
        }, examenID)
      }
    },
    onSuccess: (data) => {
      setEditMode(false)
      if (onSuccess) { onSuccess(data) }
      toast.success("Examen technique enregistré avec succès")
    },
    onError: () => {
      toast.error("Erreur lors de l'enregistrement")
    },
  })

  const onSubmit = (rawData: any) => {
    const data = cleanTechnicalExam(rawData)
    mutation.mutate(data)
  }

  // Les champs sont désactivés si pas en mode édition
  const isDisabled = !editMode

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Examen technique
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
        <div className="bg-yellow-50 p-4 rounded-md flex items-center text-yellow-800 mb-4">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p>
                Les valeurs numériques ne doivent pas dépasser 3 chiffres après la virgule.
            </p>
          </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit, onInvalid)} autoComplete="off">
          {/* Acuité visuelle */}
          <Card>
            <CardHeader>
              <CardTitle>Acuité Visuelle</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["avsc_od", "avsc_og", "avsc_odg", "avac_od", "avac_og", "avac_odg"].map((field) => (
                <div className="space-y-2" key={field}>
                  <Label htmlFor={field}>{field.replace(/_/g, " ").toUpperCase()}</Label>
                  <Input
                    id={field}
                    type="number"
                    step="any"
                    {...register(`visual_acuity.${field}` as any)}
                    disabled={isDisabled}
                  />
                  {getError(errors, `visual_acuity.${field}`)?.message && (
                    <span className="text-red-500 text-xs">
                      {getError(errors, `visual_acuity.${field}`)?.message}
                    </span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Réfraction */}
          <Card>
            <CardHeader>
              <CardTitle>Réfraction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Controller
                  name="refraction.correction_optique"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="correction_optique"
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                      disabled={isDisabled}
                    />
                  )}
                />
                <Label htmlFor="correction_optique">Correction optique</Label>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { id: "od_s", label: "OD S" },
                  { id: "og_s", label: "OG S" },
                  { id: "od_c", label: "OD C" },
                  { id: "og_c", label: "OG C" },
                  { id: "od_a", label: "OD A" },
                  { id: "og_a", label: "OG A" },
                  { id: "avog", label: "AVOG" },
                  { id: "avod", label: "AVOD" },
                  { id: "dp", label: "DP" },
                ].map(({ id, label }) => (
                  // Affichage conditionnel intelligent
                  (["od_s", "og_s", "od_c", "og_c", "od_a", "og_a"].includes(id) ?
                    (correctionOptique || getError(errors, `refraction.${id}`)) : true
                  ) && (
                    <div className="space-y-2" key={id}>
                      <Label htmlFor={id}>{label}</Label>
                      <Input
                        id={id}
                        type="number"
                        step="any"
                        {...register(`refraction.${id}` as any)}
                        disabled={isDisabled || (["od_s", "og_s", "od_c", "og_c", "od_a", "og_a"].includes(id) && !correctionOptique)}
                      />
                      {getError(errors, `refraction.${id}`)?.message && (
                        <span className="text-red-500 text-xs">
                          {getError(errors, `refraction.${id}`)?.message}
                        </span>
                      )}
                    </div>
                  )
                ))}
              </div>
              {getError(errors, "refraction.correction_optique")?.message && (
                <span className="text-red-500 text-xs">
                  {getError(errors, "refraction.correction_optique")?.message}
                </span>
              )}
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
                  type="number"
                  step="any"
                  {...register("ocular_tension.od")}
                  disabled={isDisabled}
                />
                {getError(errors, "ocular_tension.od")?.message && (
                  <span className="text-red-500 text-xs">
                    {getError(errors, "ocular_tension.od")?.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="og">OG</Label>
                <Input
                  id="og"
                  type="number"
                  step="any"
                  {...register("ocular_tension.og")}
                  disabled={isDisabled}
                />
                {getError(errors, "ocular_tension.og")?.message && (
                  <span className="text-red-500 text-xs">
                    {getError(errors, "ocular_tension.og")?.message}
                  </span>
                )}
              </div>
              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  <Controller
                    name="ocular_tension.ttt_hypotonisant"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="ttt_hypotonisant"
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        disabled={isDisabled}
                      />
                    )}
                  />
                  <Label htmlFor="ttt_hypotonisant">Traitement hypotonisant</Label>
                </div>
                {(tttHypotonisant || getError(errors, "ocular_tension.ttt_hypotonisant_value")) && (
                  <div className="mt-2">
                    <Controller
                      name="ocular_tension.ttt_hypotonisant_value"
                      control={control}
                      render={({ field }) => (
                        <ChoiceSelect
                          label="Préciser le traitement"
                          name="ttt_hypotonisant_value"
                          options={choicesMap.HypotonisantValue}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          multiple={false}
                          disabled={isDisabled}
                        />
                      )}
                    />
                    {getError(errors, "ocular_tension.ttt_hypotonisant_value")?.message && (
                      <span className="text-red-500 text-xs">
                        {getError(errors, "ocular_tension.ttt_hypotonisant_value")?.message}
                      </span>
                    )}
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
                <Label htmlFor="od">OD</Label>
                <Input
                  id="od"
                  type="number"
                  step="any"
                  {...register("pachymetry.od")}
                  disabled={isDisabled}
                />
                {getError(errors, "od")?.message && (
                  <span className="text-red-500 text-xs">
                    {getError(errors, "od")?.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="og">OG</Label>
                <Input
                  id="og"
                  type="number"
                  step="any"
                  {...register("pachymetry.og")}
                  disabled={isDisabled}
                />
                {getError(errors, "pachymetry.og")?.message && (
                  <span className="text-red-500 text-xs">
                    {getError(errors, "pachymetry.og")?.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cto_od">CTO OD</Label>
                <Input
                  id="cto_od"
                  type="number"
                  step="any"
                  {...register("pachymetry.cto_od")}
                  disabled={isDisabled}
                />
                {getError(errors, "pachymetry.cto_od")?.message && (
                  <span className="text-red-500 text-xs">
                    {getError(errors, "pachymetry.cto_od")?.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cto_og">CTO OG</Label>
                <Input
                  id="cto_og"
                  type="number"
                  step="any"
                  {...register("pachymetry.cto_og")}
                  disabled={isDisabled}
                />
                {getError(errors, "pachymetry.cto_og")?.message && (
                  <span className="text-red-500 text-xs">
                    {getError(errors, "pachymetry.cto_og")?.message}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Boutons */}
          <div className="flex justify-between items-center mt-6">
            {canEditTechnical && !editMode && (
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
            {canEditTechnical && editMode && (
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