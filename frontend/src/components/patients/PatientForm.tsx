/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { useForm, useFieldArray, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Save, Plus, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createPatient, getPatientById, updatePatient } from "@/services/patientsService"
import { QUERIES } from "@/helpers/crud-helper/consts"
import { toast } from "sonner"
import { useListView } from "@/hooks/_ListViewProvider"
import { isNotEmpty } from "@/helpers/crud-helper/helpers"
import { initConducteur } from "@/types/patientsModels"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
// import { useAuth } from "@/hooks/auth/Auth"

const vehiculeSchema = z.object({
  immatriculation: z.string().min(1, "Immatriculation requise"),
  modele: z.string().min(1, "Modèle requis"),
  annee: z.string().min(1, "Année requise"),
  type_vehicule_conduit: z.enum(["Léger", "Lourd", "Autres"], { required_error: "Type requis" }),
  autre_type_vehicule_conduit: z.string().min(1, "Précisez le type").optional().or(z.literal("")),
}).refine(
  (data) => data.type_vehicule_conduit !== "Autres" || !!data.autre_type_vehicule_conduit,
  { message: "Précisez le type de véhicule", path: ["autre_type_vehicule_conduit"] }
)

const patientSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  first_name: z.string().min(1, "Prénom requis"),
  last_name: z.string().min(1, "Nom requis"),
  phone_number: z.string().min(8, "Numéro requis"),
  date_naissance: z.string().min(1, "Date de naissance requise"),
  sexe: z.enum(["Homme", "Femme", "Anonyme"], { required_error: "Sexe requis" }),
  numero_permis: z.string().min(1, "Numéro de permis requis"),
  type_permis: z.enum(["leger", "lourd", "autres"], { required_error: "Type de permis requis" }),
  autre_type_permis: z.string().min(1, "Précisez le type").optional().or(z.literal("")),
  date_delivrance_permis: z.string().min(1, "Date de délivrance requise"),
  date_peremption_permis: z.string().min(1, "Date de péremption requise"),
  transporteur_professionnel: z.enum(["true", "false"], { required_error: "Champ requis" }),
  service: z.enum(["Public", "Privé", "Particulier"], { required_error: "Service requis" }),
  type_instruction_suivie: z.enum(["Française", "Arabe"], { required_error: "Instruction requise" }),
  niveau_instruction: z.enum(["Primaire", "Secondaire", "Supérieure", "Autres", "Aucune"], { required_error: "Niveau requis" }),
  annees_experience: z.coerce.number().min(0, "Nombre d'années requis"),
  vehicules_data: z.array(vehiculeSchema).min(1, "Au moins un véhicule est requis"),
})

type PatientFormType = z.infer<typeof patientSchema>

export default function PatientForm() {
  const navigate = useNavigate()
  const { itemIdForUpdate, setItemIdForUpdate } = useListView()
  // const { currentUser } = useAuth()
  
  // const role = currentUser?.role?.toLowerCase() 
  const isEdit = isNotEmpty(itemIdForUpdate)

  // Form setup
  const methods = useForm<PatientFormType>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      ...{
        ...initConducteur,
        autre_type_permis: initConducteur.autre_type_permis ?? "",
      },
      type_permis: "leger",
      sexe: "Homme",
      service: "Public",
      type_instruction_suivie: "Française",
      niveau_instruction: "Primaire",
      transporteur_professionnel: "false",
      vehicules_data: [{ immatriculation: "", modele: "", annee: "", type_vehicule_conduit: "Léger", autre_type_vehicule_conduit: "" }],
    },
    mode: "onTouched",
  })

  const { control, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = methods
  const { fields, append, remove } = useFieldArray({ control, name: "vehicules_data" })

  // Charger le patient à éditer
  const { data: patientData, isLoading: isPatientLoading } = useQuery({
    queryKey: [QUERIES.PATIENTS_LIST, "getPatient", itemIdForUpdate],
    queryFn: () => getPatientById(itemIdForUpdate!.toString()),
    enabled: isEdit,
    cacheTime: 0,
    onError: () => {
      toast.error("Impossible de charger le patient.")
      setItemIdForUpdate(undefined)
      navigate(-1)
    }
  })

  // Pré-remplir le formulaire en édition
  useEffect(() => {
    if (isEdit && patientData) {
      reset({
        ...patientData,
        type_permis: patientData.type_permis,
        transporteur_professionnel: patientData.transporteur_professionnel ? "true" : "false",
        autre_type_permis: patientData.autre_type_permis ?? "",
        vehicules_data: patientData.vehicule && patientData.vehicule.length > 0
          ? patientData.vehicule.map(v => ({
              immatriculation: v.immatriculation ?? "",
              modele: v.modele ?? "",
              annee: v.annee ?? "",
              type_vehicule_conduit: v.type_vehicule_conduit,
              autre_type_vehicule_conduit: v.autre_type_vehicule_conduit ?? "",
            }))
          : [{ immatriculation: "", modele: "", annee: "", type_vehicule_conduit: "Léger", autre_type_vehicule_conduit: "" }]
      })
    }
  }, [isEdit, patientData, reset])

  // Mutation création/mise à jour
  const mutation = useMutation({
    mutationFn: (data: PatientFormType) => {
      // Adapt vehicules_data to match Vehicule[] (add id and conducteur if needed)
      const vehicules = data.vehicules_data.map((v: any) => ({
        ...v,
        id: v.id ?? undefined, // or generate a temp id if needed
        conducteur: undefined, // or set to the patient id if required by your backend
      }));
      const payload = {
        ...data,
        vehicules_data: vehicules,
        id: isEdit ? itemIdForUpdate : undefined,
        transporteur_professionnel: data.transporteur_professionnel === "true",
      };
      return isEdit
        ? updatePatient(payload)
        : createPatient(payload);
    },
    mutationKey: [QUERIES.PATIENTS_LIST, isEdit ? "updatePatient" : "createPatient"],
    onSuccess: () => {
      reset()
      setItemIdForUpdate(undefined)
      navigate(-1)
      toast.success(isEdit ? "Patient mis à jour avec succès" : "Patient créé avec succès")
    },
    onError: (error: any) => {
      const status = error?.response?.status
      const data = error?.response?.data
      if (status === 400 && data) {
        Object.entries(data).forEach(([field, err]) => {
          toast.error(`${field}: ${Array.isArray(err) ? err.join(", ") : err}`)
        })
      } else {
        toast.error("Une erreur est survenue, veuillez réessayer plus tard.")
      }
    },
  })

  // Affichage du loader pendant le chargement des données patient
  if (isEdit && isPatientLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <svg className="animate-spin h-8 w-8 text-primary mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <span className="text-gray-400 mt-4">Chargement des informations patient...</span>
      </div>
    )
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-8 max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" type="button" onClick={() => navigate(-1)} className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEdit ? "Modifier un patient" : "Ajouter un patient"}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations du patient</CardTitle>
            <CardDescription>Champs obligatoires pour l'enregistrement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={control} name="first_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom *</FormLabel>
                  <FormControl>
                    <Input placeholder="Prénom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="last_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@exemple.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="phone_number" render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone *</FormLabel>
                <FormControl>
                  <PhoneInput
                    {...field}
                    defaultCountry="SN"
                    international
                    countryCallingCodeEditable={false}
                    placeholder="+221 77 123 4567"
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
              <FormField control={control} name="date_naissance" render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de naissance *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="sexe" render={({ field }) => (
                <FormItem>
                  <FormLabel>Sexe *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Homme">Homme</SelectItem>
                      <SelectItem value="Femme">Femme</SelectItem>
                      <SelectItem value="Anonyme">Anonyme</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="numero_permis" render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de permis *</FormLabel>
                  <FormControl>
                    <Input placeholder="SN12345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="type_permis" render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de permis *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="leger">Léger</SelectItem>
                      <SelectItem value="lourd">Lourd</SelectItem>
                      <SelectItem value="autres">Autres à préciser</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              {watch("type_permis") === "autres" && (
                <FormField control={control} name="autre_type_permis" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Précisez le type de permis *</FormLabel>
                    <FormControl>
                      <Input placeholder="Type de permis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
              <FormField control={control} name="date_delivrance_permis" render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de délivrance du permis *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="date_peremption_permis" render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de péremption du permis *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="transporteur_professionnel" render={({ field }) => (
                <FormItem>
                  <FormLabel>Transporteur professionnel *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Oui</SelectItem>
                      <SelectItem value="false">Non</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="service" render={({ field }) => (
                <FormItem>
                  <FormLabel>Service *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Public">Public</SelectItem>
                      <SelectItem value="Privé">Privé</SelectItem>
                      <SelectItem value="Particulier">Particulier</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="type_instruction_suivie" render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'instruction suivie *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Française">Française</SelectItem>
                      <SelectItem value="Arabe">Arabe</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="niveau_instruction" render={({ field }) => (
                <FormItem>
                  <FormLabel>Niveau d'instruction *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Primaire">Primaire</SelectItem>
                      <SelectItem value="Secondaire">Secondaire</SelectItem>
                      <SelectItem value="Supérieure">Supérieure</SelectItem>
                      <SelectItem value="Autres">Autres</SelectItem>
                      <SelectItem value="Aucune">Aucune</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="annees_experience" render={({ field }) => (
                <FormItem>
                  <FormLabel>Années d'expérience *</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Véhicules associés</CardTitle>
            <CardDescription>Ajoutez un ou plusieurs véhicules (tous les champs sont obligatoires)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.map((vehicule, idx) => (
              <div key={vehicule.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end border-b pb-4 mb-4">
                <FormField control={control} name={`vehicules_data.${idx}.immatriculation`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Immatriculation</FormLabel>
                    <FormControl>
                      <Input placeholder="AB-123-CD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={control} name={`vehicules_data.${idx}.modele`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modèle</FormLabel>
                    <FormControl>
                      <Input placeholder="Toyota Corolla" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={control} name={`vehicules_data.${idx}.annee`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Année</FormLabel>
                    <FormControl>
                      <Input placeholder="2020" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={control} name={`vehicules_data.${idx}.type_vehicule_conduit`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Léger">Léger</SelectItem>
                        <SelectItem value="Lourd">Lourd</SelectItem>
                        <SelectItem value="Autres">Autres</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                {watch(`vehicules_data.${idx}.type_vehicule_conduit`) === "Autres" && (
                  <FormField control={control} name={`vehicules_data.${idx}.autre_type_vehicule_conduit`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Précisez *</FormLabel>
                      <FormControl>
                        <Input placeholder="Type de véhicule" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}
                <Button
                  type="button"
                  variant="ghost"
                  className="mt-2"
                  onClick={() => remove(idx)}
                  disabled={fields.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ immatriculation: "", modele: "", annee: "", type_vehicule_conduit: "Léger", autre_type_vehicule_conduit: "" })}
              className="mt-2"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un véhicule
            </Button>
            {errors.vehicules_data && (
              <p className="text-red-500 text-sm">{errors.vehicules_data.message as string}</p>
            )}
          </CardContent>
        </Card>

        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => navigate(-1)}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEdit ? "Mettre à jour" : "Enregistrer"}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </FormProvider>
  )
}