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
import { useMutation } from "@tanstack/react-query"
import { createClinicalExam, updateClinicalExam } from "@/services/clinicalExamen"
import { toast } from "sonner"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { choicesMap } from "@/helpers/ChoicesMap"
import { initialClinicalExamen } from "@/types/examensClinic"

const clinicalExamSchema = z.object({
  id: z.any().optional().nullable(),
  perimetry: z.object({
    pbo: z.string().min(1, "Veuillez sélectionner une valeur pour le champ PBO"),
    limite_superieure: z.coerce.number().nullable().optional(),
    limite_inferieure: z.coerce.number().nullable().optional(),
    limite_temporale_droit: z.coerce.number().nullable().optional(),
    limite_temporale_gauche: z.coerce.number().nullable().optional(),
    limite_horizontal: z.coerce.number().nullable().optional(),
    score_esternmen: z.coerce.number().nullable().optional(),
    image: z.union([z.string(), z.instanceof(File)]).nullable().optional(),
    images: z.union([z.string(), z.instanceof(File)]).nullable().optional(),
  }).optional(),
  bp_sup: z.object({
    retinographie: z.union([z.string(), z.instanceof(File)]).nullable().optional(),
    oct: z.union([z.string(), z.instanceof(File)]).nullable().optional(),
    autres: z.union([z.string(), z.instanceof(File)]).nullable().optional(),
  }).optional(),
  od: z.object({
    plaintes: z.object({
      eye_symptom: z.string().min(1, "Veuillez sélectionner un symptôme"),
      diplopie: z.boolean().nullable().optional(),
      diplopie_type: z.string().nullable().optional(),
      strabisme: z.boolean().nullable().optional(),
      strabisme_eye: z.string().nullable().optional(),
      nystagmus: z.boolean().nullable().optional(),
      nystagmus_eye: z.string().nullable().optional(),
      ptosis: z.boolean().nullable().optional(),
      ptosis_eye: z.string().nullable().optional(),
    }).optional(),
    bp_sg_anterieur: z.object({
      segment: z.string({ required_error: "Ce champ est requis" }),
      cornee: z.string().nullable().optional(),
      profondeur: z.string().nullable().optional(),
      transparence: z.string().nullable().optional(),
      type_anomalie_value: z.string().nullable().optional(),
      quantite_anomalie: z.string().nullable().optional(),
      pupille: z.string().nullable().optional(),
      axe_visuel: z.string().nullable().optional(),
      rpm: z.string().nullable().optional(),
      iris: z.string().nullable().optional(),
      cristallin: z.string().nullable().optional(),
      position_cristallin: z.string().nullable().optional(),
    }).superRefine((data, ctx) => {
      if (data.segment === "PRESENCE_LESION") {
        [
          "cornee",
          "profondeur",
          "transparence",
          "pupille",
          "axe_visuel",
          "rpm",
          "iris",
          "cristallin",
          "position_cristallin"
        ].forEach(field => {
          if (!(data as Record<string, unknown>)[field]) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Champ ${field} requis`,
              path: [field],
            })
          }
        })
        if (data.transparence === "ANORMALE") {
          if (!data.type_anomalie_value) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Type anomalie requis", path: ["type_anomalie_value"] })
          if (!data.quantite_anomalie) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Quantité anomalie requise", path: ["quantite_anomalie"] })
        }
      }
    }).optional(),
    bp_sg_posterieur: z.object({
      segment: z.string({ required_error: "Ce champ est requis" }),
      vitre: z.string().nullable().optional(),
      papille: z.string().nullable().optional(),
      macula: z.string().nullable().optional(),
      retinien_peripherique: z.string().nullable().optional(),
      vaissaux: z.string().nullable().optional(),
      cd_od: z.coerce.number().nullable().optional(),
      cd_og: z.coerce.number().nullable().optional(),
      observation: z.string().nullable().optional(),
    }).superRefine((data, ctx) => {
      if (data.segment === "PRESENCE_LESION") {
        [
          "vitre",
          "papille",
          "macula",
          "retinien_peripherique",
          "vaissaux",
          "cd_od",
          "cd_og",
          "observation"
        ].forEach(field => {
          const value = (data as Record<string, unknown>)[field];
          if (
            (typeof value === "string" && !value) ||
            (typeof value === "number" && (value === null || value === undefined))
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Champ ${field} requis`,
              path: [field],
            })
          }
        })
      }
    }).optional(),
  }).optional(),
  og: z.object({
    plaintes: z.object({
      eye_symptom: z.string().min(1, "Veuillez sélectionner un symptôme"),
      diplopie: z.boolean().nullable().optional(),
      diplopie_type: z.string().nullable().optional(),
      strabisme: z.boolean().nullable().optional(),
      strabisme_eye: z.string().nullable().optional(),
      nystagmus: z.boolean().nullable().optional(),
      nystagmus_eye: z.string().nullable().optional(),
      ptosis: z.boolean().nullable().optional(),
      ptosis_eye: z.string().nullable().optional(),
    }).optional(),
    bp_sg_anterieur: z.object({
      segment: z.string({ required_error: "Ce champ est requis" }),
      cornee: z.string().nullable().optional(),
      profondeur: z.string().nullable().optional(),
      transparence: z.string().nullable().optional(),
      type_anomalie_value: z.string().nullable().optional(),
      quantite_anomalie: z.string().nullable().optional(),
      pupille: z.string().nullable().optional(),
      axe_visuel: z.string().nullable().optional(),
      rpm: z.string().nullable().optional(),
      iris: z.string().nullable().optional(),
      cristallin: z.string().nullable().optional(),
      position_cristallin: z.string().nullable().optional(),
    }).superRefine((data, ctx) => {
      if (data.segment === "PRESENCE_LESION") {
        [
          "cornee",
          "profondeur",
          "transparence",
          "pupille",
          "axe_visuel",
          "rpm",
          "iris",
          "cristallin",
          "position_cristallin"
        ].forEach(field => {
          if (!(data as Record<string, unknown>)[field]) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Champ ${field} requis`,
              path: [field],
            })
          }
        })
        if (data.transparence === "ANORMALE") {
          if (!data.type_anomalie_value) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Type anomalie requis", path: ["type_anomalie_value"] })
          if (!data.quantite_anomalie) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Quantité anomalie requise", path: ["quantite_anomalie"] })
        }
      }
    }).optional(),
    bp_sg_posterieur: z.object({
      segment: z.string({ required_error: "Ce champ est requis" }),
      vitre: z.string().nullable().optional(),
      papille: z.string().nullable().optional(),
      macula: z.string().nullable().optional(),
      retinien_peripherique: z.string().nullable().optional(),
      vaissaux: z.string().nullable().optional(),
      cd_od: z.coerce.number().nullable().optional(),
      cd_og: z.coerce.number().nullable().optional(),
      observation: z.string().nullable().optional(),
    }).superRefine((data, ctx) => {
      if (data.segment === "PRESENCE_LESION") {
        [
          "vitre",
          "papille",
          "macula",
          "retinien_peripherique",
          "vaissaux",
          "cd_od",
          "cd_og",
          "observation"
        ].forEach(field => {
          const value = (data as Record<string, unknown>)[field];
          if (
            (typeof value === "string" && !value) ||
            (typeof value === "number" && (value === null || value === undefined))
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Champ ${field} requis`,
              path: [field],
            })
          }
        })
      }
    }).optional(),
  }).optional(),
  conclusion: z.object({
    vision: z.enum(["compatible", "incompatible", "a_risque"]).nullable().optional(),
    cat: z.string().nullable().optional(),
    traitement: z.string().nullable().optional(),
    observation: z.string().nullable().optional(),
    rv: z.boolean().nullable().optional().default(false),
    diagnostic_cim_10: z.string().nullable().optional(),
  }).optional(),
  visite: z.number().nullable().optional(),
  is_completed: z.boolean().nullable().optional(),
  patient: z.number().nullable().optional(),
  created: z.string().nullable().optional(),
  modified: z.string().nullable().optional(),
})

function getError(errors: any, path: string) {
  return path.split('.').reduce((acc, key) => acc?.[key], errors)
}

export function ClinicalExam({
  clinicalData,
  canEditClinical,
  onSuccess,
  examenID,
  visiteID,
  patientID
}: {
  clinicalData?: any
  canEditClinical: boolean
  onSuccess?: (data: any) => void,
  examenID?: number
  visiteID?: number
  patientID?: number
}) {
  const [editMode, setEditMode] = React.useState(!clinicalData)
  const [preview, setPreview] = React.useState<{ [key: string]: string }>({})
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { isSubmitting, errors },
    reset,
  } = useForm({
    defaultValues: clinicalData ?? initialClinicalExamen,
    resolver: zodResolver(clinicalExamSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
  })

  React.useEffect(() => {
    if (clinicalData) {
      reset(clinicalData)
    }
  }, [clinicalData, reset])

  // Nettoyage automatique des champs dépendants
  const odDiplopie = watch("od.plaintes.diplopie");
  const odStrabisme = watch("od.plaintes.strabisme");
  const odNystagmus = watch("od.plaintes.nystagmus");
  const odPtosis = watch("od.plaintes.ptosis");
  const ogDiplopie = watch("og.plaintes.diplopie");
  const ogStrabisme = watch("og.plaintes.strabisme");
  const ogNystagmus = watch("og.plaintes.nystagmus");
  const ogPtosis = watch("og.plaintes.ptosis");
  const odSegment = watch("od.bp_sg_anterieur.segment");
  const odTransparence = watch("od.bp_sg_anterieur.transparence");
  const ogSegment = watch("og.bp_sg_anterieur.segment");
  const ogTransparence = watch("og.bp_sg_anterieur.transparence");
  const bpSgPosterieurOdSegment = watch("od.bp_sg_posterieur.segment");
  const bpSgPosterieurOgSegment = watch("og.bp_sg_posterieur.segment");

  React.useEffect(() => {
    ["od", "og"].forEach((eye) => {
      const diplopie = watch(`${eye}.plaintes.diplopie`)
      const strabisme = watch(`${eye}.plaintes.strabisme`)
      const nystagmus = watch(`${eye}.plaintes.nystagmus`)
      const ptosis = watch(`${eye}.plaintes.ptosis`)
      if (!diplopie) setValue(`${eye}.plaintes.diplopie_type`, "")
      if (!strabisme) setValue(`${eye}.plaintes.strabisme_eye`, "")
      if (!nystagmus) setValue(`${eye}.plaintes.nystagmus_eye`, "")
      if (!ptosis) setValue(`${eye}.plaintes.ptosis_eye`, "")
  
      const segment = watch(`${eye}.bp_sg_anterieur.segment`)
      const bpSgPosterieurSegment = watch(`${eye}.bp_sg_posterieur.segment`)
      const transparence = watch(`${eye}.bp_sg_anterieur.transparence`)
      if (segment !== "PRESENCE_LESION") {
        setValue(`${eye}.bp_sg_anterieur.cornee`, "")
        setValue(`${eye}.bp_sg_anterieur.profondeur`, "")
        setValue(`${eye}.bp_sg_anterieur.transparence`, "")
        setValue(`${eye}.bp_sg_anterieur.type_anomalie_value`, "")
        setValue(`${eye}.bp_sg_anterieur.quantite_anomalie`, "")
        setValue(`${eye}.bp_sg_anterieur.pupille`, "")
        setValue(`${eye}.bp_sg_anterieur.axe_visuel`, "")
        setValue(`${eye}.bp_sg_anterieur.rpm`, "")
        setValue(`${eye}.bp_sg_anterieur.iris`, "")
        setValue(`${eye}.bp_sg_anterieur.cristallin`, "")
        setValue(`${eye}.bp_sg_anterieur.position_cristallin`, "")
      } else {
        if (transparence !== "ANORMALE") {
          setValue(`${eye}.bp_sg_anterieur.type_anomalie_value`, "")
          setValue(`${eye}.bp_sg_anterieur.quantite_anomalie`, "")
        }
      }

      if(bpSgPosterieurSegment !== "PRESENCE_LESION") {
        setValue(`${eye}.bp_sg_posterieur.vitre`, "")
        setValue(`${eye}.bp_sg_posterieur.papille`, "")
        setValue(`${eye}.bp_sg_posterieur.macula`, "")
        setValue(`${eye}.bp_sg_posterieur.retinien_peripherique`, "")
        setValue(`${eye}.bp_sg_posterieur.vaissaux`, "")
        setValue(`${eye}.bp_sg_posterieur.cd_od`, null)
        setValue(`${eye}.bp_sg_posterieur.cd_og`, null)
        setValue(`${eye}.bp_sg_posterieur.observation`, "")
      }
    })
  }, [
    odDiplopie,
    odStrabisme,
    odNystagmus,
    odPtosis,
    odSegment,
    odTransparence,
    ogDiplopie,
    ogStrabisme,
    ogNystagmus,
    ogPtosis,
    ogSegment,
    ogTransparence,
    bpSgPosterieurOdSegment,
    bpSgPosterieurOgSegment,
    setValue,
    watch
  ])

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (data.id) {
        const formData = buildClinicalExamFormData(data)
        return await updateClinicalExam(data.id, formData)
      } else {
        const formData = buildClinicalExamFormData({
          ...data,
          visite: visiteID,
          patient: patientID,
          examen_id: examenID,
        })
        if (typeof examenID === "undefined") {
          throw new Error("examenID est requis pour créer un examen clinique")
        }
        return await createClinicalExam(examenID, formData)
      }
    },
    onSuccess: (data) => {
      setEditMode(false)
      if (onSuccess) onSuccess(data)
      toast.success("Examen clinique enregistré avec succès")
    },
    onError: () => {
      toast.error("Erreur lors de l'enregistrement")
    },
  })

  const onSubmit = (data: any) => {
    mutation.mutate(data)
  }

  const isDisabled = !editMode

  function renderEyeTabs(section: string, content: (eye: "od" | "og") => React.ReactNode) {
    return (
      <Tabs defaultValue="od" className="w-full">
        <TabsList>
          <TabsTrigger value="od">OD (œil droit)</TabsTrigger>
          <TabsTrigger value="og">OG (œil gauche)</TabsTrigger>
        </TabsList>
        <TabsContent value="od">{content("od")}</TabsContent>
        <TabsContent value="og">{content("og")}</TabsContent>
      </Tabs>
    )
  }

  function renderSelect(
    control: any,
    name: string,
    label: string,
    options: { value: string; label: string }[],
    isDisabled: boolean
  ) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label>{label}</Label>
            <Select onValueChange={field.onChange} value={field.value ?? ""} disabled={isDisabled}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez..." />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getError(errors, name)?.message && (
              <span className="text-red-500 text-xs">{getError(errors, name)?.message}</span>
            )}
          </div>
        )}
      />
    )
  }


  // Gestion de l'aperçu des images pour bp_sup
  const handleBpSupImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue(`bp_sup.${field}` as any, file)
      setPreview((prev) => ({
        ...prev,
        [`bp_sup_${field}`]: URL.createObjectURL(file),
      }))
    }
  }

  // Gestion de l'aperçu des images pour perimetry
  const handlePerimetryImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue(`perimetry.${field}` as any, file)
      setPreview((prev) => ({
        ...prev,
        [`perimetry_${field}`]: URL.createObjectURL(file),
      }))
    }
  }

  const api_url = import.meta.env.VITE_APP_API_URL

  // Construction du FormData pour l'API
  function buildClinicalExamFormData(data: any): FormData {
    const formData = new FormData()
    formData.append("visite", String(data.visite))
    formData.append("is_completed", data.is_completed ? "true" : "false")
    formData.append("patient", String(data.patient))
    if (data.conclusion) {
      Object.entries(data.conclusion).forEach(([key, value]) => {
        if (typeof value === "boolean") {
          formData.append(`conclusion.${key}`, value ? "true" : "false")
        } else if (value !== undefined && value !== null && typeof value !== "object") {
          formData.append(`conclusion.${key}`, String(value))
        }
      })
    }
    if (data.perimetry) {
      Object.entries(data.perimetry).forEach(([key, value]) => {
        if (key === "image" && value instanceof File) {
          formData.append("perimetry.image", value)
        } else if (key === "images" && value instanceof File) {
          formData.append("perimetry.images", value)
        } else if (
          key !== "image" &&
          key !== "images" &&
          value !== undefined &&
          value !== null &&
          typeof value !== "object"
        ) {
          formData.append(`perimetry.${key}`, String(value))
        }
      })
    }
    if (data.bp_sup) {
      ["retinographie", "oct", "autres"].forEach((field) => {
        const value = (data.bp_sup as any)[field]
        if (value instanceof File) {
          formData.append(`bp_sup.${field}`, value)
        }
      })
    }
    ["od", "og"].forEach((eye) => {
      const eyeData = (data as any)[eye]
      if (eyeData) {
        if (eyeData.plaintes) {
          Object.entries(eyeData.plaintes).forEach(([key, value]) => {
            if (typeof value === "boolean") {
              formData.append(`${eye}.plaintes.${key}`, value ? "true" : "false")
            } else if (value !== undefined && value !== null && typeof value !== "object") {
              formData.append(`${eye}.plaintes.${key}`, String(value))
            }
          })
        }
        if (eyeData.bp_sg_anterieur) {
          Object.entries(eyeData.bp_sg_anterieur).forEach(([key, value]) => {
            if (typeof value === "boolean") {
              formData.append(`${eye}.bp_sg_anterieur.${key}`, value ? "true" : "false")
            } else if (value !== undefined && value !== null && typeof value !== "object") {
              formData.append(`${eye}.bp_sg_anterieur.${key}`, String(value))
            }
          })
        }
        if (eyeData.bp_sg_posterieur) {
          Object.entries(eyeData.bp_sg_posterieur).forEach(([key, value]) => {
            if (typeof value === "boolean") {
              formData.append(`${eye}.bp_sg_posterieur.${key}`, value ? "true" : "false")
            } else if (value !== undefined && value !== null && typeof value !== "object") {
              formData.append(`${eye}.bp_sg_posterieur.${key}`, String(value))
            }
          })
        }
      }
    })
    return formData
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Examen clinique
          <span className="ml-2 text-sm font-normal text-gray-500">(À compléter par le médecin)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!canEditClinical && (
          <div className="bg-yellow-50 p-4 rounded-md flex items-center text-yellow-800 mb-4">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p>
              Vous êtes en mode lecture seule. Seuls les médecins et administrateurs peuvent modifier ces informations.
            </p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {/* Plaintes */}
          <Card>
            <CardHeader>
              <CardTitle>Plaintes</CardTitle>
            </CardHeader>
            <CardContent>
              {renderEyeTabs("plaintes", (eye) => (
                <div className="space-y-4">
                  {renderSelect(
                    control,
                    `${eye}.plaintes.eye_symptom`,
                    "Symptômes",
                    choicesMap.Symptomes,
                    isDisabled
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Diplopie */}
                    <div className="flex items-start space-x-2">
                      <Controller
                        name={`${eye}.plaintes.diplopie`}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id={`diplopie_${eye}`}
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                            disabled={isDisabled}
                          />
                        )}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor={`diplopie_${eye}`}>Diplopie</Label>
                        {watch(`${eye}.plaintes.diplopie`) && (
                          <Controller
                            name={`${eye}.plaintes.diplopie_type`}
                            control={control}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value ?? ""} disabled={isDisabled}>
                                <SelectTrigger className="w-full mt-2">
                                  <SelectValue placeholder="Sélectionnez un type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="monoculaire">Monoculaire</SelectItem>
                                  <SelectItem value="binoculaire">Binoculaire</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        )}
                        {getError(errors, `${eye}.plaintes.diplopie_type`)?.message && (
                          <span className="text-red-500 text-xs">
                            {getError(errors, `${eye}.plaintes.diplopie_type`)?.message}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Strabisme */}
                    <div className="flex items-start space-x-2">
                      <Controller
                        name={`${eye}.plaintes.strabisme`}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id={`strabisme_${eye}`}
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                            disabled={isDisabled}
                          />
                        )}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor={`strabisme_${eye}`}>Strabisme</Label>
                        {watch(`${eye}.plaintes.strabisme`) && (
                          <Controller
                            name={`${eye}.plaintes.strabisme_eye`}
                            control={control}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value ?? ""} disabled={isDisabled}>
                                <SelectTrigger className="w-full mt-2">
                                  <SelectValue placeholder="Sélectionnez un côté" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="od">OD</SelectItem>
                                  <SelectItem value="og">OG</SelectItem>
                                  <SelectItem value="odg">ODG</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        )}
                        {getError(errors, `${eye}.plaintes.strabisme_eye`)?.message && (
                          <span className="text-red-500 text-xs">
                            {getError(errors, `${eye}.plaintes.strabisme_eye`)?.message}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Nystagmus */}
                    <div className="flex items-start space-x-2">
                      <Controller
                        name={`${eye}.plaintes.nystagmus`}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id={`nystagmus_${eye}`}
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                            disabled={isDisabled}
                          />
                        )}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor={`nystagmus_${eye}`}>Nystagmus</Label>
                        {watch(`${eye}.plaintes.nystagmus`) && (
                          <Controller
                            name={`${eye}.plaintes.nystagmus_eye`}
                            control={control}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value ?? ""} disabled={isDisabled}>
                                <SelectTrigger className="w-full mt-2">
                                  <SelectValue placeholder="Sélectionnez un côté" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="od">OD</SelectItem>
                                  <SelectItem value="og">OG</SelectItem>
                                  <SelectItem value="odg">ODG</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        )}
                        {getError(errors, `${eye}.plaintes.nystagmus_eye`)?.message && (
                          <span className="text-red-500 text-xs">
                            {getError(errors, `${eye}.plaintes.nystagmus_eye`)?.message}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Ptosis */}
                    <div className="flex items-start space-x-2">
                      <Controller
                        name={`${eye}.plaintes.ptosis`}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id={`ptosis_${eye}`}
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                            disabled={isDisabled}
                          />
                        )}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor={`ptosis_${eye}`}>Ptosis</Label>
                        {watch(`${eye}.plaintes.ptosis`) && (
                          <Controller
                            name={`${eye}.plaintes.ptosis_eye`}
                            control={control}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value ?? ""} disabled={isDisabled}>
                                <SelectTrigger className="w-full mt-2">
                                  <SelectValue placeholder="Sélectionnez un côté" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="od">OD</SelectItem>
                                  <SelectItem value="og">OG</SelectItem>
                                  <SelectItem value="odg">ODG</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        )}
                        {getError(errors, `${eye}.plaintes.ptosis_eye`)?.message && (
                          <span className="text-red-500 text-xs">
                            {getError(errors, `${eye}.plaintes.ptosis_eye`)?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

         {/* Biomicroscopie (segment antérieur) */}
          <Card>
            <CardHeader>
              <CardTitle>Biomicroscopie (segment antérieur)</CardTitle>
            </CardHeader>
            <CardContent>
              {renderEyeTabs("biomicro_ant", (eye: "od" | "og") => {
                const transparenceValue = watch(`${eye}.bp_sg_anterieur.transparence`)
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {renderSelect(
                      control,
                      `${eye}.bp_sg_anterieur.segment`,
                      "Segment",
                      choicesMap.SegmentChoices,
                      isDisabled
                    )}
                    {renderSelect(
                      control,
                      `${eye}.bp_sg_anterieur.cornee`,
                      "Cornée",
                      choicesMap.Cornee,
                      isDisabled
                    )}
                    {renderSelect(
                      control,
                      `${eye}.bp_sg_anterieur.transparence`,
                      "Transparence",
                      choicesMap.ChambreAnterieureTransparence,
                      isDisabled
                    )}
                    {transparenceValue === "ANORMALE" && (
                      <>
                        {renderSelect(
                          control,
                          `${eye}.bp_sg_anterieur.type_anomalie_value`,
                          "Type d'anomalie",
                          choicesMap.TypeAnomalie,
                          isDisabled
                        )}
                        {renderSelect(
                          control,
                          `${eye}.bp_sg_anterieur.quantite_anomalie`,
                          "Quantité anomalie",
                          choicesMap.QuantiteAnomalie,
                          isDisabled
                        )}
                      </>
                    )}
                    {renderSelect(
                      control,
                      `${eye}.bp_sg_anterieur.profondeur`,
                      "Profondeur",
                      choicesMap.ChambreAnterieureProfondeur,
                      isDisabled
                    )}
                    {renderSelect(
                      control,
                      `${eye}.bp_sg_anterieur.iris`,
                      "Iris",
                      choicesMap.Iris,
                      isDisabled
                    )}
                    {renderSelect(
                      control,
                      `${eye}.bp_sg_anterieur.cristallin`,
                      "Cristallin",
                      choicesMap.Cristallin,
                      isDisabled
                    )}
                    {renderSelect(
                      control,
                      `${eye}.bp_sg_anterieur.position_cristallin`,
                      "Position cristallin",
                      choicesMap.PositionCristallin,
                      isDisabled
                    )}
                    {renderSelect(
                      control,
                      `${eye}.bp_sg_anterieur.pupille`,
                      "Pupille",
                      choicesMap.Pupille,
                      isDisabled
                    )}
                    {renderSelect(
                      control,
                      `${eye}.bp_sg_anterieur.axe_visuel`,
                      "Axe visuel",
                      choicesMap.AxeVisuel,
                      isDisabled
                    )}
                    {renderSelect(
                      control,
                      `${eye}.bp_sg_anterieur.rpm`,
                      "RPM",
                      choicesMap.RPM,
                      isDisabled
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
         
          {/* Biomicroscopie (segment postérieur) */}
          <Card>
            <CardHeader>
              <CardTitle>Biomicroscopie (segment postérieur)</CardTitle>
            </CardHeader>
            <CardContent>
              {renderEyeTabs("biomicro_post", (eye) => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderSelect(
                    control,
                    `${eye}.bp_sg_posterieur.segment`,
                    "Segment",
                    choicesMap.SegmentChoices,
                    isDisabled
                  )}
                  {renderSelect(
                    control,
                    `${eye}.bp_sg_posterieur.vitre`,
                    "Vitré",
                    choicesMap.Vitre,
                    isDisabled
                  )}
                  {renderSelect(
                    control,
                    `${eye}.bp_sg_posterieur.papille`,
                    "Papille",
                    choicesMap.Papille,
                    isDisabled
                  )}
                  {renderSelect(
                    control,
                    `${eye}.bp_sg_posterieur.macula`,
                    "Macula",
                    choicesMap.Macula,
                    isDisabled
                  )}
                  {renderSelect(
                    control,
                    `${eye}.bp_sg_posterieur.retinien_peripherique`,
                    "Champ rétinien périphérique",
                    choicesMap.ChampRetinienPeripherique,
                    isDisabled
                  )}
                  {renderSelect(
                    control,
                    `${eye}.bp_sg_posterieur.vaissaux`,
                    "Vaisseaux",
                    choicesMap.Vaisseaux,
                    isDisabled
                  )}
                  {/* CD OD */}
                  <div className="space-y-2">
                    <Label htmlFor={`${eye}_cd_od`}>C/D OD</Label>
                    <Input
                      id={`${eye}_cd_od`}
                      type="number"
                      step="0.1"
                      {...register(`${eye}.bp_sg_posterieur.cd_od`)}
                      disabled={isDisabled}
                    />
                    {getError(errors, `${eye}.bp_sg_posterieur.cd_od`)?.message && (
                      <span className="text-red-500 text-xs">
                        {getError(errors, `${eye}.bp_sg_posterieur.cd_od`)?.message}
                      </span>
                    )}
                  </div>
                  {/* CD OG */}
                  <div className="space-y-2">
                    <Label htmlFor={`${eye}_cd_og`}>C/D OG</Label>
                    <Input
                      id={`${eye}_cd_og`}
                      type="number"
                      step="0.1"
                      {...register(`${eye}.bp_sg_posterieur.cd_og`)}
                      disabled={isDisabled}
                    />
                    {getError(errors, `${eye}.bp_sg_posterieur.cd_og`)?.message && (
                      <span className="text-red-500 text-xs">
                        {getError(errors, `${eye}.bp_sg_posterieur.cd_og`)?.message}
                      </span>
                    )}
                  </div>
                  {/* Observation */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`${eye}_observation`}>Observation</Label>
                    <Textarea
                      id={`${eye}_observation`}
                      {...register(`${eye}.bp_sg_posterieur.observation`)}
                      disabled={isDisabled}
                    />
                    {getError(errors, `${eye}.bp_sg_posterieur.observation`)?.message && (
                      <span className="text-red-500 text-xs">
                        {getError(errors, `${eye}.bp_sg_posterieur.observation`)?.message}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Examens complémentaires */}
          <Card>
            <CardHeader>
              <CardTitle>Biomicroscopie (examens complémentaires)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["retinographie", "oct", "autres"].map((field) => (
                <div className="space-y-2" key={field}>
                  <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                  {preview[`bp_sup_${field}`] && (
                    <div className="flex items-center gap-2 mt-2">
                      <img
                        src={preview[`bp_sup_${field}`]}
                        alt={field}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setValue(`bp_sup.${field}` as any, "")
                          setPreview((prev) => ({ ...prev, [`bp_sup_${field}`]: "" }))
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  )}
                  {!preview[`bp_sup_${field}`] && watch(`bp_sup.${field}` as any) && typeof watch(`bp_sup.${field}` as any) === "string" && (
                    <div className="flex items-center gap-2 mt-2">
                      <img
                        src={`${api_url}${watch(`bp_sup.${field}` as any)}`}
                        alt={field}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <a
                        href={`${api_url}${watch(`bp_sup.${field}` as any)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                        download
                      >
                        Télécharger
                      </a>
                      {editMode && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setValue(`bp_sup.${field}` as any, "")}
                        >
                          Modifier
                        </Button>
                      )}
                    </div>
                  )}
                  {(editMode && (!watch(`bp_sup.${field}` as any) || preview[`bp_sup_${field}`])) && (
                    <Input
                      id={field}
                      type="file"
                      accept="image/*"
                      disabled={!editMode}
                      onChange={(e) => handleBpSupImageChange(e, field)}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Périmétrie */}
          <Card>
            <CardHeader>
              <CardTitle>Périmétrie</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                {renderSelect(
                  control,
                  "perimetry.pbo",
                  "PBO",
                  choicesMap.PerimetrieBinoculaire,
                  isDisabled
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="limite_superieure">Limite supérieure</Label>
                <Input
                  id="limite_superieure"
                  {...register("perimetry.limite_superieure")}
                  disabled={isDisabled}
                  type="number"
                />
                {getError(errors, "perimetry.limite_superieure")?.message && (
                  <span className="text-red-500 text-xs">
                    {getError(errors, "perimetry.limite_superieure")?.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="limite_inferieure">Limite inférieure</Label>
                <Input
                  id="limite_inferieure"
                  {...register("perimetry.limite_inferieure")}
                  disabled={isDisabled}
                  type="number"
                />
                {getError(errors, "perimetry.limite_inferieure")?.message && (
                  <span className="text-red-500 text-xs">
                    {getError(errors, "perimetry.limite_inferieure")?.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="limite_temporale_droit">Limite temporale droit</Label>
                <Input
                  id="limite_temporale_droit"
                  {...register("perimetry.limite_temporale_droit")}
                  disabled={isDisabled}
                  type="number"
                />
                {getError(errors, "perimetry.limite_temporale_droit")?.message && (
                  <span className="text-red-500 text-xs">
                    {getError(errors, "perimetry.limite_temporale_droit")?.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="limite_temporale_gauche">Limite temporale gauche</Label>
                <Input
                  id="limite_temporale_gauche"
                  {...register("perimetry.limite_temporale_gauche")}
                  disabled={isDisabled}
                  type="number"
                />
                {getError(errors, "perimetry.limite_temporale_gauche")?.message && (
                  <span className="text-red-500 text-xs">
                    {getError(errors, "perimetry.limite_temporale_gauche")?.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="limite_horizontal">Limite horizontale</Label>
                <Input
                  id="limite_horizontal"
                  {...register("perimetry.limite_horizontal")}
                  disabled={isDisabled}
                  type="number"
                />
                {getError(errors, "perimetry.limite_horizontal")?.message && (
                  <span className="text-red-500 text-xs">
                    {getError(errors, "perimetry.limite_horizontal")?.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="score_esternmen">Score d'Esterman</Label>
                <Input
                  id="score_esternmen"
                  {...register("perimetry.score_esternmen")}
                  disabled={isDisabled}
                  type="number"
                />
                {getError(errors, "perimetry.score_esternmen")?.message && (
                  <span className="text-red-500 text-xs">
                    {getError(errors, "perimetry.score_esternmen")?.message}
                  </span>
                )}
              </div>
              {/* Image périmétrie */}
              <div className="space-y-2">
                <Label htmlFor="perimetry_image">Image périmétrie</Label>
                {preview.perimetry_image && (
                  <div className="flex items-center gap-2">
                    <img
                      src={preview.perimetry_image}
                      alt="Aperçu upload"
                      className="w-24 h-24 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setValue("perimetry.image", "")
                        setPreview((prev) => ({ ...prev, perimetry_image: "" }))
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                )}
                {!preview.perimetry_image && typeof watch("perimetry.image") === "string" && watch("perimetry.image") && (
                  <div className="flex items-center gap-2">
                    <img
                      src={`${api_url}${watch("perimetry.image")}`}
                      alt="Aperçu périmétrie"
                      className="w-24 h-24 object-cover rounded border"
                    />
                    <a
                      href={`${api_url}${watch("perimetry.image")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                      download
                    >
                      Télécharger
                    </a>
                    {editMode && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setValue("perimetry.image", "")}
                      >
                        Modifier
                      </Button>
                    )}
                  </div>
                )}
                {(editMode && (!watch("perimetry.image") || preview.perimetry_image)) && (
                  <Input
                    id="perimetry_image"
                    type="file"
                    accept="image/*"
                    disabled={!editMode}
                    onChange={e => handlePerimetryImageChange(e, "image")}
                  />
                )}
              </div>
              {/* Fichier ZIP ou autre */}
              <div className="space-y-2">
                <Label htmlFor="perimetry_images">Fichier ZIP ou autre (images)</Label>
                {watch("perimetry.images") && typeof watch("perimetry.images") === "string" && (
                  <div className="flex items-center gap-2">
                    <a
                      href={`${api_url}${watch("perimetry.images")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                      download
                    >
                      Télécharger le fichier
                    </a>
                    {editMode && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setValue("perimetry.images", "")}
                      >
                        Modifier
                      </Button>
                    )}
                  </div>
                )}
                {editMode && (
                  <Input
                    id="perimetry_images"
                    type="file"
                    disabled={!editMode}
                    onChange={e => handlePerimetryImageChange(e, "images")}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Conclusion */}
          <Card>
            <CardHeader>
              <CardTitle>Conclusion</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderSelect(
                control,
                "conclusion.vision",
                "Compatibilité de la vision",
                [
                  { value: "compatible", label: "Compatible" },
                  { value: "incompatible", label: "Incompatible" },
                  { value: "a_risque", label: "À risque" }
                ],
                isDisabled
              )}
              <div className="space-y-2">
                <Label htmlFor="cat">CAT</Label>
                <Textarea
                  id="cat"
                  {...register("conclusion.cat")}
                  disabled={isDisabled}
                />
                {getError(errors, "conclusion.cat")?.message && (
                  <span className="text-red-500 text-xs">
                    {getError(errors, "conclusion.cat")?.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="traitement">Traitement</Label>
                <Textarea
                  id="traitement"
                  {...register("conclusion.traitement")}
                  disabled={isDisabled}
                />
                {getError(errors, "conclusion.traitement")?.message && (
                  <span className="text-red-500 text-xs">
                    {getError(errors, "conclusion.traitement")?.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="observation">Observations</Label>
                <Textarea
                  id="observation"
                  {...register("conclusion.observation")}
                  disabled={isDisabled}
                />
                {getError(errors, "conclusion.observation")?.message && (
                  <span className="text-red-500 text-xs">
                    {getError(errors, "conclusion.observation")?.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="diagnostic_cim_10">Diagnostic CIM-10</Label>
                <Input
                  id="diagnostic_cim_10"
                  {...register("conclusion.diagnostic_cim_10")}
                  disabled={isDisabled}
                />
                {getError(errors, "conclusion.diagnostic_cim_10")?.message && (
                  <span className="text-red-500 text-xs">
                    {getError(errors, "conclusion.diagnostic_cim_10")?.message}
                  </span>
                )}
              </div>
              <div className="space-y-2 flex items-center">
                <Controller
                  name="conclusion.rv"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="rv"
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                      disabled={isDisabled}
                    />
                  )}
                />
                <Label htmlFor="rv" className="ml-2">
                  Rendez-vous:&nbsp;
                  <span className="text-lg font-semibold">
                    {watch("conclusion.rv") === true
                      ? "dans 6 mois"
                      : watch("conclusion.rv") === false
                        ? "moins de 6 mois"
                        : ""}
                  </span>
                </Label>
                {getError(errors, "conclusion.rv")?.message && (
                  <span className="text-red-500 text-xs ml-2">
                    {getError(errors, "conclusion.rv")?.message}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Boutons */}
          <div className="flex justify-between items-center mt-6">
            {canEditClinical && !editMode && (
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
            {canEditClinical && editMode && (
              <Button
                type="submit"
                disabled={mutation.isPending || isSubmitting}
                className="flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {mutation.isPending || isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
            )}
          </div>

        </form>
      </CardContent>
    </Card>
  )
}