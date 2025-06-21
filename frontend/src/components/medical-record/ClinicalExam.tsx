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
import type { ClinicalExamen } from "@/types/examensClinic"
import { toast } from "sonner"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { choicesMap } from "@/helpers/choicesMap"

// Schéma Zod corrigé pour correspondre à l'API et aux types
const clinicalExamSchema = z.object({
  id: z.any().optional(),
  perimetry: z.object({
    id: z.any(),
    pbo: z.string(),
    limite_superieure: z.number(),
    limite_inferieure: z.number(),
    limite_temporale_droit: z.number(),
    limite_temporale_gauche: z.number(),
    limite_horizontal: z.number(),
    score_esternmen: z.number(),
    image: z.string().optional(),
    images: z.string().optional(),
    created: z.string().optional(),
    modified: z.string().optional(),
  }),
  bp_sup: z.object({
    id: z.any(),
    retinographie: z.string().optional(),
    oct: z.string().optional(),
    autres: z.string().optional(),
    created: z.string().optional(),
    modified: z.string().optional(),
  }),
  od: z.object({
    id: z.any(),
    plaintes: z.object({
      id: z.any(),
      eye_symptom: z.string(),
      diplopie: z.boolean(),
      diplopie_type: z.string().nullable().optional(),
      strabisme: z.boolean(),
      strabisme_eye: z.string().nullable().optional(),
      nystagmus: z.boolean(),
      nystagmus_eye: z.string().nullable().optional(),
      ptosis: z.boolean(),
      ptosis_eye: z.string().nullable().optional(),
      created: z.string().optional(),
      modified: z.string().optional(),
    }),
    bp_sg_anterieur: z.object({
      id: z.any(),
      segment: z.string(),
      cornee: z.string(),
      profondeur: z.string(),
      transparence: z.string(),
      type_anomalie_value: z.string().nullable().optional(),
      quantite_anomalie: z.string().nullable().optional(),
      pupille: z.string(),
      axe_visuel: z.string(),
      rpm: z.string(),
      iris: z.string(),
      cristallin: z.string(),
      position_cristallin: z.string(),
      created: z.string().optional(),
      modified: z.string().optional(),
    }),
    bp_sg_posterieur: z.object({
      id: z.any(),
      segment: z.string(),
      vitre: z.string(),
      retine: z.number(),
      papille: z.string(),
      macula: z.string(),
      retinien_peripherique: z.string(),
      vaissaux: z.string(),
      created: z.string().optional(),
      modified: z.string().optional(),
    }),
    created: z.string().optional(),
    modified: z.string().optional(),
  }),
  og: z.object({
    id: z.any(),
    plaintes: z.object({
      id: z.any(),
      eye_symptom: z.string(),
      diplopie: z.boolean(),
      diplopie_type: z.string().nullable().optional(),
      strabisme: z.boolean(),
      strabisme_eye: z.string().nullable().optional(),
      nystagmus: z.boolean(),
      nystagmus_eye: z.string().nullable().optional(),
      ptosis: z.boolean(),
      ptosis_eye: z.string().nullable().optional(),
      created: z.string().optional(),
      modified: z.string().optional(),
    }),
    bp_sg_anterieur: z.object({
      id: z.any(),
      segment: z.string(),
      cornee: z.string(),
      profondeur: z.string(),
      transparence: z.string(),
      type_anomalie_value: z.string().nullable().optional(),
      quantite_anomalie: z.string().nullable().optional(),
      pupille: z.string(),
      axe_visuel: z.string(),
      rpm: z.string(),
      iris: z.string(),
      cristallin: z.string(),
      position_cristallin: z.string(),
      created: z.string().optional(),
      modified: z.string().optional(),
    }),
    bp_sg_posterieur: z.object({
      id: z.any(),
      segment: z.string(),
      vitre: z.string(),
      retine: z.number(),
      papille: z.string(),
      macula: z.string(),
      retinien_peripherique: z.string(),
      vaissaux: z.string(),
      created: z.string().optional(),
      modified: z.string().optional(),
    }),
    created: z.string().optional(),
    modified: z.string().optional(),
  }),
  visite: z.number(),
  is_completed: z.boolean(),
  patient: z.any(),
  conclusion: z.object({
    id: z.any(),
    vision: z.enum(["compatible", "incompatible", "a_risque"]).nullable(),
    cat: z.string().nullable(),
    traitement: z.string().nullable(),
    observation: z.string().nullable(),
    rv: z.boolean(),
    created: z.string().optional(),
    modified: z.string().optional(),
  }),
  created: z.string().optional(),
  modified: z.string().optional(),
})

export function ClinicalExam({
  clinicalData,
  canEditClinical,
  onSuccess,
}: {
  clinicalData?: ClinicalExamen
  canEditClinical: boolean
  onSuccess?: (data: any) => void
}) {
  const [editMode, setEditMode] = React.useState(false)
  const [preview, setPreview] = React.useState<{ [key: string]: string }>({})
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { isSubmitting },
    reset,
  } = useForm({
    defaultValues: clinicalData,
    resolver: zodResolver(clinicalExamSchema),
    mode: "onBlur",
  })

  React.useEffect(() => {
    reset(clinicalData)
  }, [clinicalData, reset])

  const mutation = useMutation({
    mutationFn: async (data: ClinicalExamen) => {
      if (data.id) {
        const formData = buildClinicalExamFormData(data)
        return await updateClinicalExam(data.id, formData)
      } else {
        const formData = buildClinicalExamFormData(data)
        return await createClinicalExam(formData)
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
function buildClinicalExamFormData(data: ClinicalExamen): FormData {
  const formData = new FormData();

  // Champs simples
  formData.append("visite", String(data.visite));
  formData.append("is_completed", data.is_completed ? "true" : "false");
  formData.append("patient", String(data.patient));

  // Conclusion
  if (data.conclusion) {
    Object.entries(data.conclusion).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        formData.append(`conclusion.${key}`, value ? "true" : "false");
      } else if (value !== undefined && value !== null && typeof value !== "object") {
        formData.append(`conclusion.${key}`, String(value));
      }
    });
  }

  // Périmétrie
  if (data.perimetry) {
    Object.entries(data.perimetry).forEach(([key, value]) => {
      if (key === "image" && value instanceof File) {
        formData.append("perimetry.image", value);
      } else if (key === "images" && value instanceof File) {
        formData.append("perimetry.images", value);
      } else if (
        key !== "image" &&
        key !== "images" &&
        value !== undefined &&
        value !== null &&
        typeof value !== "object"
      ) {
        formData.append(`perimetry.${key}`, String(value));
      }
    });
  }

  // bp_sup (examens complémentaires)
  if (data.bp_sup) {
    ["retinographie", "oct", "autres"].forEach((field) => {
      const value = (data.bp_sup as any)[field];
      if (value instanceof File) {
        formData.append(`bp_sup.${field}`, value);
      }
      // NE RIEN ENVOYER si ce n'est pas un fichier
    });
  }

  // Pour od et og
  ["od", "og"].forEach((eye) => {
    const eyeData = (data as any)[eye];
    if (eyeData) {
      // plaintes
      if (eyeData.plaintes) {
        Object.entries(eyeData.plaintes).forEach(([key, value]) => {
          if (typeof value === "boolean") {
            formData.append(`${eye}.plaintes.${key}`, value ? "true" : "false");
          } else if (value !== undefined && value !== null && typeof value !== "object") {
            formData.append(`${eye}.plaintes.${key}`, String(value));
          }
        });
      }
      // bp_sg_anterieur
      if (eyeData.bp_sg_anterieur) {
        Object.entries(eyeData.bp_sg_anterieur).forEach(([key, value]) => {
          if (typeof value === "boolean") {
            formData.append(`${eye}.bp_sg_anterieur.${key}`, value ? "true" : "false");
          } else if (value !== undefined && value !== null && typeof value !== "object") {
            formData.append(`${eye}.bp_sg_anterieur.${key}`, String(value));
          }
        });
      }
      // bp_sg_posterieur
      if (eyeData.bp_sg_posterieur) {
        Object.entries(eyeData.bp_sg_posterieur).forEach(([key, value]) => {
          if (typeof value === "boolean") {
            formData.append(`${eye}.bp_sg_posterieur.${key}`, value ? "true" : "false");
          } else if (value !== undefined && value !== null && typeof value !== "object") {
            formData.append(`${eye}.bp_sg_posterieur.${key}`, String(value));
          }
        });
      }
    }
  });

  return formData;
}
  // Pour l'affichage du texte RV
  const rvValue = watch("conclusion.rv")
  // Fonction pour rendre les onglets pour une section
  const renderEyeTabs = (section: string, content: (eye: "od" | "og") => React.ReactNode) => (
    <Tabs defaultValue="od" className="w-full">
      <TabsList>
        <TabsTrigger value="od">OD (œil droit)</TabsTrigger>
        <TabsTrigger value="og">OG (œil gauche)</TabsTrigger>
      </TabsList>
      <TabsContent value="od">{content("od")}</TabsContent>
      <TabsContent value="og">{content("og")}</TabsContent>
    </Tabs>
  )

  // Fonction pour rendre un sélecteur avec options
  const renderSelect = (
    control: any,
    name: string,
    label: string,
    options: { value: string; label: string }[],
    isDisabled: boolean
  ) => (
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
        </div>
      )}
    />
  )
const api_url = import.meta.env.VITE_APP_API_URL

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
                const transparenceValue = watch(`${eye}.bp_sg_anterieur.transparence`);
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

                  <div className="space-y-2">
                    <Label>Rétine</Label>
                    <Input
                      type="number"
                      {...register(`${eye}.bp_sg_posterieur.retine`)}
                      disabled={isDisabled}
                    />
                  </div>

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
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Examens complémentaires */}
          <Card>
            <CardHeader>
              <CardTitle>Examens complémentaires</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["retinographie", "oct", "autres"].map((field) => (
                <div className="space-y-2" key={field}>
                  <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                  {/* Aperçu si image locale uploadée */}
                  {preview[`bp_sup_${field}`] && (
                    <div className="flex items-center gap-2 mt-2">
                      <img
                        src={`${api_url}${preview[`bp_sup_${field}`]}`}
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
                  {/* Aperçu si image déjà enregistrée (URL) */}
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
                  {/* Input file si pas d'image ou si on veut modifier */}
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="limite_inferieure">Limite inférieure</Label>
                <Input
                  id="limite_inferieure"
                  {...register("perimetry.limite_inferieure")}
                  disabled={isDisabled}
                  type="number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="limite_temporale_droit">Limite temporale droit</Label>
                <Input
                  id="limite_temporale_droit"
                  {...register("perimetry.limite_temporale_droit")}
                  disabled={isDisabled}
                  type="number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="limite_temporale_gauche">Limite temporale gauche</Label>
                <Input
                  id="limite_temporale_gauche"
                  {...register("perimetry.limite_temporale_gauche")}
                  disabled={isDisabled}
                  type="number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="limite_horizontal">Limite horizontale</Label>
                <Input
                  id="limite_horizontal"
                  {...register("perimetry.limite_horizontal")}
                  disabled={isDisabled}
                  type="number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="score_esternmen">Score d'Esterman</Label>
                <Input
                  id="score_esternmen"
                  {...register("perimetry.score_esternmen")}
                  disabled={isDisabled}
                  type="number"
                />
              </div>
               {/* Image périmétrie */}
              <div className="space-y-2">
                <Label htmlFor="perimetry_image">Image périmétrie</Label>
                {/* Aperçu si image locale uploadée */}
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
                {/* Aperçu si image déjà enregistrée (URL) */}
                {!preview.perimetry_image && typeof watch("perimetry.image") === "string" && watch("perimetry.image") && watch("perimetry.image") && (
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
                {/* Input file si pas d'image ou si on veut modifier */}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="traitement">Traitement</Label>
                <Textarea
                  id="traitement"
                  {...register("conclusion.traitement")}
                  disabled={isDisabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observation">Observations</Label>
                <Textarea
                  id="observation"
                  {...register("conclusion.observation")}
                  disabled={isDisabled}
                />
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
                    {rvValue === true
                      ? "dans 6 mois"
                      : rvValue === false
                        ? "moins de 6 mois"
                        : ""}
                  </span>
                </Label>
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