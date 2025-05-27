import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, ChevronRight, Save, Upload, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useNavigate } from "react-router-dom"

// Schéma de validation pour le formulaire patient
const patientFormSchema = z
  .object({
    email: z.string().email({ message: "Email invalide" }),
    first_name: z.string().min(1, { message: "Le prénom est requis" }).max(30),
    last_name: z.string().min(1, { message: "Le nom est requis" }).max(30),
    phone_number: z.string().min(10, { message: "Numéro de téléphone invalide" }),
    date_naissance: z.date({
      required_error: "La date de naissance est requise",
    }),
    sexe: z.enum(["Homme", "Femme", "Anonyme"], {
      required_error: "Le sexe est requis",
    }),
    numero_permis: z.string().min(1, { message: "Le numéro de permis est requis" }).max(14),
    type_permis: z.enum(["Léger", "Lourd", "Autres"], {
      required_error: "Le type de permis est requis",
    }),
    autre_type_permis: z.string().max(100).optional(),
    date_delivrance_permis: z.date({
      required_error: "La date de délivrance est requise",
    }),
    date_peremption_permis: z.date({
      required_error: "La date de péremption est requise",
    }),
    transporteur_professionnel: z.enum(["Oui", "Non"], {
      required_error: "Cette information est requise",
    }),
    service: z.enum(["Public", "Privé", "Particulier"], {
      required_error: "Le service est requis",
    }),
    type_instruction_suivie: z.enum(["Française", "Arabe"], {
      required_error: "Le type d'instruction est requis",
    }),
    niveau_instruction: z.enum(["Primaire", "Secondaire", "Supérieure", "Autres", "Aucune"], {
      required_error: "Le niveau d'instruction est requis",
    }),
    annees_experience: z.coerce.number().min(0, { message: "Doit être un nombre positif" }),
    image: z.any().optional(),
  })
  .refine(
    (data) => {
      if (data.type_permis === "Autres" && !data.autre_type_permis) {
        return false
      }
      return true
    },
    {
      message: "Veuillez préciser le type de permis",
      path: ["autre_type_permis"],
    },
  )
  .refine(
    (data) => {
      return data.date_peremption_permis > data.date_delivrance_permis
    },
    {
      message: "La date de péremption doit être postérieure à la date de délivrance",
      path: ["date_peremption_permis"],
    },
  )

// Schéma pour le véhicule
const vehiculeFormSchema = z
  .object({
    immatriculation: z.string().max(15).optional(),
    modele: z.string().max(15).optional(),
    annee: z.string().max(15).optional(),
    type_vehicule_conduit: z.enum(["Léger", "Lourd", "Autres"], {
      required_error: "Le type de véhicule est requis",
    }),
    autre_type_vehicule_conduit: z.string().max(100).optional(),
  })
  .refine(
    (data) => {
      if (data.type_vehicule_conduit === "Autres" && !data.autre_type_vehicule_conduit) {
        return false
      }
      return true
    },
    {
      message: "Veuillez préciser le type de véhicule",
      path: ["autre_type_vehicule_conduit"],
    },
  )

type PatientFormValues = z.infer<typeof patientFormSchema>
type VehiculeFormValues = z.infer<typeof vehiculeFormSchema>

export function PatientForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [vehicules, setVehicules] = useState<VehiculeFormValues[]>([])

  // Formulaire principal du patient
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      sexe: "Homme",
      numero_permis: "",
      type_permis: "Léger",
      autre_type_permis: "",
      transporteur_professionnel: "Non",
      service: "Particulier",
      type_instruction_suivie: "Française",
      niveau_instruction: "Secondaire",
      annees_experience: 0,
    },
  })

  // Formulaire pour l'ajout de véhicule
  const vehiculeForm = useForm<VehiculeFormValues>({
    resolver: zodResolver(vehiculeFormSchema),
    defaultValues: {
      immatriculation: "",
      modele: "",
      annee: "",
      type_vehicule_conduit: "Léger",
      autre_type_vehicule_conduit: "",
    },
  })

  // Soumission du formulaire principal
  async function onSubmit(data: PatientFormValues) {
    setIsSubmitting(true)

    // Simuler un appel API
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("Patient data:", data)
    console.log("Véhicules associés:", vehicules)

    setIsSubmitting(false)
    setIsSuccess(true)

    // Redirection après 2 secondes
    setTimeout(() => {
      navigate("/assistant/patients")
    }, 2000)
  }

  // Ajout d'un véhicule
  function onAddVehicule(data: VehiculeFormValues) {
    setVehicules((prev) => [...prev, data])
    vehiculeForm.reset()
  }

  // Suppression d'un véhicule
  function onRemoveVehicule(index: number) {
    setVehicules((prev) => prev.filter((_, i) => i !== index))
  }

  // Validation de l'étape actuelle et passage à la suivante
  const handleNextStep = async () => {
    if (step === 1) {
      const isValid = await form.trigger()
      if (isValid) {
        setStep(2)
      }
    } else if (step === 2) {
      form.handleSubmit(onSubmit)()
    }
  }

  if (isSuccess) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800">Patient enregistré avec succès</AlertTitle>
          <AlertDescription className="text-green-700">
            Le dossier du patient a été créé. Vous allez être redirigé vers la liste des patients.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/assistant/patients")} className="mr-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Nouveau Patient</h1>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > 1 ? <Check className="h-5 w-5" /> : "1"}
              </div>
              <span className="mt-2 text-sm font-medium">Informations</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div className={`h-full ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`} style={{ width: "100%" }}></div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > 2 ? <Check className="h-5 w-5" /> : "2"}
              </div>
              <span className="mt-2 text-sm font-medium">Véhicules</span>
            </div>
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Entrez les informations du patient. Les champs marqués d'un * sont obligatoires.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Informations de base */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Prénom"
                                {...field}
                                onChange={(e) => {
                                  // Auto-capitalize first letter
                                  const value = e.target.value
                                  field.onChange(value.charAt(0).toUpperCase() + value.slice(1))
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nom"
                                {...field}
                                onChange={(e) => {
                                  // Auto-capitalize first letter
                                  const value = e.target.value
                                  field.onChange(value.charAt(0).toUpperCase() + value.slice(1))
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="email@exemple.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone *</FormLabel>
                            <FormControl>
                              <Input placeholder="+221 77 123 4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="date_naissance"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date de naissance *</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "dd MMMM yyyy", { locale: fr })
                                    ) : (
                                      <span>Sélectionner une date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => {
                                    // Désactiver les dates futures et celles qui rendraient l'utilisateur < 18 ans
                                    const eighteenYearsAgo = new Date()
                                    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18)
                                    return date > eighteenYearsAgo || date < new Date("1900-01-01")
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sexe"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sexe *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        )}
                      />
                    </div>

                    {/* Informations de permis */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="numero_permis"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numéro de permis *</FormLabel>
                            <FormControl>
                              <Input placeholder="SN12345678" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="type_permis"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type de permis *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        )}
                      />

                      {form.watch("type_permis") === "Autres" && (
                        <FormField
                          control={form.control}
                          name="autre_type_permis"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Précisez le type de permis *</FormLabel>
                              <FormControl>
                                <Input placeholder="Type de permis" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="date_delivrance_permis"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date de délivrance du permis *</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "dd MMMM yyyy", { locale: fr })
                                    ) : (
                                      <span>Sélectionner une date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date > new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="date_peremption_permis"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date de péremption du permis *</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "dd MMMM yyyy", { locale: fr })
                                    ) : (
                                      <span>Sélectionner une date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => {
                                    const delivranceDate = form.getValues("date_delivrance_permis")
                                    return delivranceDate && date <= delivranceDate
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {/* Informations professionnelles */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="transporteur_professionnel"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Transporteur professionnel *</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                              >
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="Oui" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Oui</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="Non" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Non</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="service"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        )}
                      />
                    </div>

                    {/* Informations d'instruction */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="type_instruction_suivie"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type d'instruction suivie *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="niveau_instruction"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Niveau d'instruction *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="annees_experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Années d'expérience *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="1"
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Photo</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-4">
                              <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border">
                                {field.value ? (
                                  <img
                                    src={URL.createObjectURL(field.value) || "/placeholder.svg"}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <span className="text-gray-400">Photo</span>
                                )}
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  const input = document.createElement("input")
                                  input.type = "file"
                                  input.accept = "image/jpeg,image/png"
                                  input.onchange = (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0]
                                    if (file) {
                                      if (file.size > 2 * 1024 * 1024) {
                                        alert("La taille de l'image ne doit pas dépasser 2 Mo")
                                        return
                                      }
                                      field.onChange(file)
                                    }
                                  }
                                  input.click()
                                }}
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                Télécharger une photo
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>JPEG ou PNG, max 2 Mo</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/assistant/patients")}>
                Annuler
              </Button>
              <Button onClick={handleNextStep}>
                Continuer
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Véhicules</CardTitle>
              <CardDescription>Ajoutez les véhicules associés à ce patient.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Liste des véhicules ajoutés */}
                {vehicules.length > 0 && (
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Immatriculation</TableHead>
                          <TableHead>Modèle</TableHead>
                          <TableHead>Année</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vehicules.map((vehicule, index) => (
                          <TableRow key={index}>
                            <TableCell>{vehicule.immatriculation || "-"}</TableCell>
                            <TableCell>{vehicule.modele || "-"}</TableCell>
                            <TableCell>{vehicule.annee || "-"}</TableCell>
                            <TableCell>
                              {vehicule.type_vehicule_conduit === "Autres"
                                ? vehicule.autre_type_vehicule_conduit
                                : vehicule.type_vehicule_conduit}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => onRemoveVehicule(index)}>
                                Supprimer
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Formulaire d'ajout de véhicule */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ajouter un véhicule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...vehiculeForm}>
                      <form onSubmit={vehiculeForm.handleSubmit(onAddVehicule)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={vehiculeForm.control}
                            name="immatriculation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Immatriculation</FormLabel>
                                <FormControl>
                                  <Input placeholder="AB-123-CD" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={vehiculeForm.control}
                            name="modele"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Modèle</FormLabel>
                                <FormControl>
                                  <Input placeholder="Toyota Corolla" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={vehiculeForm.control}
                            name="annee"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Année</FormLabel>
                                <FormControl>
                                  <Input placeholder="2020" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={vehiculeForm.control}
                            name="type_vehicule_conduit"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type de véhicule *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            )}
                          />

                          {vehiculeForm.watch("type_vehicule_conduit") === "Autres" && (
                            <FormField
                              control={vehiculeForm.control}
                              name="autre_type_vehicule_conduit"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Précisez le type de véhicule *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Type de véhicule" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>

                        <div className="flex justify-end">
                          <Button type="submit">Ajouter le véhicule</Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
              <Button onClick={handleNextStep} disabled={isSubmitting}>
                {isSubmitting ? (
                  "Enregistrement..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer le patient
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
