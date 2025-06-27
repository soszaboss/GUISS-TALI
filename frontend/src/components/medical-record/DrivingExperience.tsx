/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import { useForm } from "react-hook-form"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Save, Pencil, AlertTriangle } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { createDriverExperience, updateDriverExperience } from "@/services/medicalRecord"
import { defaultDriverExperienceValues } from "@/types/medicalRecord"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// Schéma Zod strictement aligné avec DriverExperience
const driverExperienceSchema = z.object({
  id: z.number().optional().nullable(),
  patient: z.any().optional(),
  visite: z.number().min(1, "Numéro de visite requis").optional(),
  etat_conducteur: z.enum(["ACTIF", "INACTIF", "DECEDE", "PERTE_DE_VUE"], { required_error: "État du conducteur requis" }),
  deces_cause: z.string().optional().nullable(),
  inactif_cause: z.string().optional().nullable(),
  km_parcourus: z.preprocess(
    val => val === "" || val === undefined || val === null ? null : Number(val),
    z.number().min(0, "Km parcourus doit être supérieur ou égal à 0").optional().nullable()
  ),
  nombre_accidents: z.preprocess(
    val => val === "" || val === undefined || val === null ? null : Number(val),
    z.number().min(0, "Nombre d'accidents doit être supérieur ou égal à 0").optional().nullable()
  ),
  tranche_horaire: z.string().optional().nullable(),
  corporel_dommage: z.boolean(),
  corporel_dommage_type: z.preprocess(
    val => val === "" || val === undefined || val === null ? null : String(val),
    z.enum(["LEGER", "MODERE", "IMPORTANT"]).optional().nullable()
  ),
  materiel_dommage: z.boolean(),
  materiel_dommage_type:  z.preprocess(
    val => val === "" || val === undefined || val === null ? null : String(val),
    z.enum(["LEGER", "MODERE", "IMPORTANT"]).optional().nullable()
  ),
  date_visite: z.string().optional().nullable(),
  date_dernier_accident: z.string().optional().nullable(),
}).superRefine((data, ctx) => {
  // Dommage corporel
  if (data.corporel_dommage) {
    if (!data.corporel_dommage_type) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Type de dommage corporel requis",
        path: ["corporel_dommage_type"],
      })
    }
  } else {
    if (data.corporel_dommage_type !== null && data.corporel_dommage_type !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le type de dommage corporel doit être vide si pas de dommage corporel",
        path: ["corporel_dommage_type"],
      })
    }
  }

  // Dommage matériel
  if (data.materiel_dommage) {
    if (!data.materiel_dommage_type) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Type de dommage matériel requis",
        path: ["materiel_dommage_type"],
      })
    }
  } else {
    if (data.materiel_dommage_type !== null && data.materiel_dommage_type !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le type de dommage matériel doit être vide si pas de dommage matériel",
        path: ["materiel_dommage_type"],
      })
    }
  }

  // Cause décès
  if (data.etat_conducteur === "DECEDE") {
    if (!data.deces_cause) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cause du décès requise",
        path: ["deces_cause"],
      })
    }
  } else {
    if (data.deces_cause !== null && data.deces_cause !== undefined && data.deces_cause !== "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La cause du décès doit être vide si le conducteur n'est pas décédé",
        path: ["deces_cause"],
      })
    }
  }

  // Cause inactivité
  if (data.etat_conducteur === "INACTIF") {
    if (!data.inactif_cause) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cause de l'inactivité requise",
        path: ["inactif_cause"],
      })
    }
  } else {
    if (data.inactif_cause !== null && data.inactif_cause !== undefined && data.inactif_cause !== "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La cause de l'inactivité doit être vide si le conducteur n'est pas inactif",
        path: ["inactif_cause"],
      })
    }
  }
})

type DriverExperienceForm = z.infer<typeof driverExperienceSchema>

export function DrivingExperience({
  driverExperienceData,
  canEdit,
  onSuccess,
  visiteID,
  patientID
}: {
  driverExperienceData: Partial<DriverExperienceForm>
  canEdit: boolean
  onSuccess?: (data: DriverExperienceForm) => void
  visiteID?: number
  patientID?: number
}) {
  const [editMode, setEditMode] = React.useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<DriverExperienceForm>({
    defaultValues: { ...defaultDriverExperienceValues, ...driverExperienceData },
    resolver: zodResolver(driverExperienceSchema) as any,
    mode: "onBlur",
  })

  React.useEffect(() => {
    reset({ ...defaultDriverExperienceValues, ...driverExperienceData })
    setEditMode(false)
  }, [driverExperienceData, reset])

  const mutation = useMutation({
    mutationFn: async (data: DriverExperienceForm) => {
      if (data.id) {
        return await updateDriverExperience(data)
      } else {
        return await createDriverExperience({
          ...data,
          visite: visiteID,
          patient: patientID
        })
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

 const cleanDriverExperience = (data: DriverExperienceForm): DriverExperienceForm => ({
  ...data,
  corporel_dommage_type: data.corporel_dommage ? data.corporel_dommage_type : null,
  materiel_dommage_type: data.materiel_dommage ? data.materiel_dommage_type : null,
  deces_cause: data.etat_conducteur === "DECEDE" ? data.deces_cause : null,
  inactif_cause: data.etat_conducteur === "INACTIF" ? data.inactif_cause : null,
})

const onSubmit = (rawData: DriverExperienceForm) => {
  const data = cleanDriverExperience(rawData)
  mutation.mutate(data)
}

const onInvalid = (errors: any) => {
  // Pour materiel_dommage_type caché mais en erreur
  if (!materiel_dommage && errors.materiel_dommage_type) {
    toast.error(errors.materiel_dommage_type.message as string)
  }
  // Pour corporel_dommage_type caché mais en erreur
  if (!corporel_dommage && errors.corporel_dommage_type) {
    toast.error(errors.corporel_dommage_type.message as string)
  }
  // Ajoute d'autres champs conditionnels si besoin

  // Message global si besoin
  if (Object.keys(errors).length > 0) {
    toast.error("Merci de corriger les champs signalés avant de soumettre.")
  }
}

  const isDisabled = !editMode
  const corporel_dommage = watch("corporel_dommage")
  const materiel_dommage = watch("materiel_dommage")
  const etat_conducteur = watch("etat_conducteur")

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

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit, onInvalid)} autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="etat_conducteur">État du conducteur</Label>
              <select
                id="etat_conducteur"
                {...register("etat_conducteur")}
                disabled={isDisabled}
                className="w-full border rounded px-2 py-1"
              >
                <option value="ACTIF">Actif</option>
                <option value="INACTIF">Inactif</option>
                <option value="PERTE_DE_VUE">Perte de vue</option>
                <option value="DECEDE">Décédé</option>
              </select>
              {errors.etat_conducteur && (
                <span className="text-red-500 text-xs">{errors.etat_conducteur.message as string}</span>
              )}
            </div>
            {etat_conducteur === "DECEDE" && (
              <div className="space-y-2">
                <Label htmlFor="deces_cause">Cause du décès</Label>
                <select
                  id="deces_cause"
                  {...register("deces_cause")}
                  disabled={isDisabled}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="MORT_NATUREL">Mort naturel</option>
                  <option value="ACCIDENT">Accident</option>
                  <option value="NON_PRECESEE">Non précisée</option>
                </select>
                {errors.deces_cause && (
                  <span className="text-red-500 text-xs">{errors.deces_cause.message as string}</span>
                )}
              </div>
            )}
            {etat_conducteur === "INACTIF" && (
              <div className="space-y-2">
                <Label htmlFor="inactif_cause">Cause de l'inactivité</Label>
                <select
                  id="inactif_cause"
                  {...register("inactif_cause")}
                  disabled={isDisabled}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="MALADIE">Maladie</option>
                  <option value="ACCIDENT">Accident</option>
                  <option value="AUTRE">Autre</option>
                  <option value="CHOMAGE">Chomage</option>
                </select>
                {errors.inactif_cause && (
                  <span className="text-red-500 text-xs">{errors.inactif_cause.message as string}</span>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="km_parcourus">Km parcourus</Label>
              <Input
                id="km_parcourus"
                step="any" // Permet les valeurs décimales
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
            <div className="space-y-2 flex items-center">
              <input
                id="corporel_dommage"
                type="checkbox"
                {...register("corporel_dommage")}
                disabled={isDisabled}
                className="mr-2"
              />
              <Label htmlFor="corporel_dommage">Dommage corporel</Label>
            </div>
            {corporel_dommage && (
              <div className="space-y-2">
                <Label htmlFor="corporel_dommage_type">Type de dommage corporel</Label>
                <select
                  id="corporel_dommage_type"
                  {...register("corporel_dommage_type")}
                  disabled={isDisabled}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">--</option>
                  <option value="LEGER">Léger</option>
                  <option value="MODERE">Modéré</option>
                  <option value="IMPORTANT">Important</option>
                </select>
                {errors.corporel_dommage_type && (
                  <span className="text-red-500 text-xs">{errors.corporel_dommage_type.message as string}</span>
                )}
              </div>
            )}
            <div className="space-y-2 flex items-center">
              <input
                id="materiel_dommage"
                type="checkbox"
                {...register("materiel_dommage")}
                disabled={isDisabled}
                className="mr-2"
              />
              <Label htmlFor="materiel_dommage">Dommage matériel</Label>
            </div>
            {materiel_dommage && (
              <div className="space-y-2">
                <Label htmlFor="materiel_dommage_type">Type de dommage matériel</Label>
                <select
                  id="materiel_dommage_type"
                  {...register("materiel_dommage_type")}
                  disabled={isDisabled}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">--</option>
                  <option value="LEGER">Léger</option>
                  <option value="MODERE">Modéré</option>
                  <option value="IMPORTANT">Important</option>
                </select>
                {errors.materiel_dommage_type && (
                  <span className="text-red-500 text-xs">{errors.materiel_dommage_type.message as string}</span>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="date_visite">Date de l'examen</Label>
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
            <div className="space-y-2">
              <Label htmlFor="date_dernier_accident">Date du dernier accident</Label>
              <Input
                id="date_dernier_accident"
                type="date"
                {...register("date_dernier_accident")}
                disabled={isDisabled}
              />
              {errors.date_dernier_accident && (
                <span className="text-red-500 text-xs">{errors.date_dernier_accident.message as string}</span>
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