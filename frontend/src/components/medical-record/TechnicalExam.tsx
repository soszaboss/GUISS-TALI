/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
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

// Schéma Zod imbriqué selon les modèles
const technicalExamSchema = z.object({
  id: z.any().optional(),
  visual_acuity: z.object({
    avsc_od: z.coerce.number(),
    avsc_og: z.coerce.number(),
    avsc_odg: z.coerce.number(),
    avac_od: z.coerce.number(),
    avac_og: z.coerce.number(),
    avac_odg: z.coerce.number(),
  }),
  refraction: z.object({
    od_s: z.coerce.number(),
    og_s: z.coerce.number(),
    od_c: z.coerce.number(),
    og_c: z.coerce.number(),
    od_a: z.coerce.number(),
    og_a: z.coerce.number(),
    dp: z.coerce.number(),
  }),
  ocular_tension: z.object({
    od: z.coerce.number(),
    og: z.coerce.number(),
    ttt_hypotonisant: z.boolean(),
    ttt_hypotonisant_value: z.string().optional(),
  }),
  pachymetry: z.object({
    od: z.coerce.number(),
    og: z.coerce.number(),
  }),
  visite: z.number().optional(),
  is_completed: z.boolean().optional(),
  patient: z.number().optional(),
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
  technicalData: any,
  examenID?: number
  visiteID?: number
  patientID?: number
  canEditTechnical: boolean
  onSuccess?: (data: any) => void
}) {
  // Toujours lecture seule par défaut, même si l'utilisateur a le droit
  const [editMode, setEditMode] = React.useState(false)
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: technicalData,
    resolver: zodResolver(
      technicalExamSchema.refine(
        (data) =>
          !data.ocular_tension.ttt_hypotonisant ||
          (data.ocular_tension.ttt_hypotonisant && !!data.ocular_tension.ttt_hypotonisant_value),
        {
          message: "Valeur requise",
          path: ["ocular_tension", "ttt_hypotonisant_value"],
        }
      )
    ),
    mode: "onBlur",
  })

  React.useEffect(() => {
    reset(technicalData)
    setEditMode(false) // Toujours lecture seule au changement de données
  }, [technicalData, reset])

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("Submitting technical exam with data:", data, "and examenID:", examenID)
      if (data.id !== undefined && data.id !== null) {
        return await updateTechnicalExam(data)
      } else {
        if (typeof examenID === "undefined" || examenID === null) {
          throw new Error("examenID est requis pour créer un examen technique")
        }
        console.log("Creating new technical exam with data:", data, "and examenID:", examenID)
        return await createTechnicalExam({
          ...data,
          visite: visiteID,
          patient: patientID
        }, examenID)
      }
    },
    onSuccess: (data) => {
        setEditMode(false)
        if (onSuccess) {onSuccess(data)}
        toast.success("Examen technique enregistré avec succès")
    },
    onError: () => {
      toast.error("Erreur lors de l'enregistrement")
    },
  })

  const onSubmit = (data: any) => {
    console.log("Form submitted with data:", data)
    mutation.mutate(data)
  }

  const tttHypotonisant = watch("ocular_tension.ttt_hypotonisant")

  // Les champs sont désactivés si pas en mode édition
  const isDisabled = !editMode
  console.log(`id de l'examen: ${examenID}`)
  console.log("Données techniques:", technicalData)
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

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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
                  type="number"
                  step="any"
                  {...register("visual_acuity.avsc_od")}
                  disabled={isDisabled}
                />
                {getError(errors, "visual_acuity.avsc_od")?.message && (
                  <span className="text-red-500 text-xs">
                    {getError(errors, "visual_acuity.avsc_od")?.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="avac_od">AVAC OD</Label>
                <Input
                  id="avac_od"
                  type="number"
                  step="any"
                  {...register("visual_acuity.avac_od")}
                  disabled={isDisabled}
                />
                {getError(errors, "visual_acuity.avac_od")?.message && (
                  <span className="text-red-500 text-xs">
                    {getError(errors, "visual_acuity.avac_od")?.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="avsc_og">AVSC OG</Label>
                <Input
                  id="avsc_og"
                  type="number"
                  step="any"
                  {...register("visual_acuity.avsc_og")}
                  disabled={isDisabled}
                />
                {getError(errors, "visual_acuity.avsc_og")?.message && (
                  <span className="text-red-500 text-xs">
                    {getError(errors, "visual_acuity.avsc_og")?.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="avac_og">AVAC OG</Label>
                <Input
                  id="avac_og"
                  type="number"
                  step="any"
                  {...register("visual_acuity.avac_og")}
                  disabled={isDisabled}
                />
                {getError(errors, "visual_acuity.avac_og")?.message && (
                  <span className="text-red-500 text-xs">
                    {getError(errors, "visual_acuity.avac_og")?.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="avsc_odg">AVSC DG</Label>
                <Input
                  id="avsc_odg"
                  type="number"
                  step="any"
                  {...register("visual_acuity.avsc_odg")}
                  disabled={isDisabled}
                />
                {getError(errors, "visual_acuity.avsc_odg")?.message && (
                  <span className="text-red-500 text-xs">
                    {getError(errors, "visual_acuity.avsc_odg")?.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="avac_odg">AVAC DG</Label>
                <Input
                  id="avac_odg"
                  type="number"
                  step="any"
                  {...register("visual_acuity.avac_odg")}
                  disabled={isDisabled}
                />
                {getError(errors, "visual_acuity.avac_odg")?.message && (
                  <span className="text-red-500 text-xs">
                    {getError(errors, "visual_acuity.avac_odg")?.message}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Réfraction */}
          <Card>
            <CardHeader>
              <CardTitle>Réfraction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="od_s">OD S</Label>
                  <Input
                    id="od_s"
                    type="number"
                    step="any"
                    {...register("refraction.od_s")}
                    disabled={isDisabled}
                  />
                  {getError(errors, "refraction.od_s")?.message && (
                    <span className="text-red-500 text-xs">
                      {getError(errors, "refraction.od_s")?.message}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="og_c">OG C</Label>
                  <Input
                    id="og_c"
                    type="number"
                    step="any"
                    {...register("refraction.og_c")}
                    disabled={isDisabled}
                  />
                  {getError(errors, "refraction.og_c")?.message && (
                    <span className="text-red-500 text-xs">
                      {getError(errors, "refraction.og_c")?.message}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="og_a">OG A</Label>
                  <Input
                    id="og_a"
                    type="number"
                    step="any"
                    {...register("refraction.og_a")}
                    disabled={isDisabled}
                  />
                  {getError(errors, "refraction.og_a")?.message && (
                    <span className="text-red-500 text-xs">
                      {getError(errors, "refraction.og_a")?.message}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="og_s">OG S</Label>
                  <Input
                    id="og_s"
                    type="number"
                    step="any"
                    {...register("refraction.og_s")}
                    disabled={isDisabled}
                  />
                  {getError(errors, "refraction.og_s")?.message && (
                    <span className="text-red-500 text-xs">
                      {getError(errors, "refraction.og_s")?.message}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="od_c">OD C</Label>
                  <Input
                    id="od_c"
                    type="number"
                    step="any"
                    {...register("refraction.od_c")}
                    disabled={isDisabled}
                  />
                  {getError(errors, "refraction.od_c")?.message && (
                    <span className="text-red-500 text-xs">
                      {getError(errors, "refraction.od_c")?.message}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="od_a">OD A</Label>
                  <Input
                    id="od_a"
                    type="number"
                    step="any"
                    {...register("refraction.od_a")}
                    disabled={isDisabled}
                  />
                  {getError(errors, "refraction.od_a")?.message && (
                    <span className="text-red-500 text-xs">
                      {getError(errors, "refraction.od_a")?.message}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dp">DP</Label>
                  <Input
                    id="dp"
                    type="number"
                    step="any"
                    {...register("refraction.dp")}
                    disabled={isDisabled}
                  />
                  {getError(errors, "refraction.dp")?.message && (
                    <span className="text-red-500 text-xs">
                      {getError(errors, "refraction.dp")?.message}
                    </span>
                  )}
                </div>
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
                {tttHypotonisant && (
                  <div className="mt-2">
                    <Controller
                      name="ocular_tension.ttt_hypotonisant_value"
                      control={control}
                      render={({ field }) => (
                        <ChoiceSelect
                          label="Préciser le traitement"
                          name="ttt_hypotonisant_value"
                          options={choicesMap.HypotonisantValue}
                          value={field.value}
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
                <Label htmlFor="pachy_od">OD</Label>
                <Input
                  id="pachy_od"
                  type="number"
                  step="any"
                  {...register("pachymetry.od")}
                  disabled={isDisabled}
                />
                {getError(errors, "pachymetry.od")?.message && (
                  <span className="text-red-500 text-xs">
                    {getError(errors, "pachymetry.od")?.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pachy_og">OG</Label>
                <Input
                  id="pachy_og"
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
            </CardContent>
          </Card>

          {/* Boutons */}
          <div className="flex justify-between items-center mt-6">
            {/* Si l'utilisateur a le droit ET n'est pas en mode édition, afficher le bouton modifier */}
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
            {/* Si l'utilisateur a le droit ET est en mode édition, afficher le bouton enregistrer */}
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