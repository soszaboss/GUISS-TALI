import { useForm, type SubmitHandler, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link, useNavigate } from "react-router-dom"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { initUser, initProfile, type UserRole, type Gender } from "@/types/userModels"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createUser, getUserById, updateUser } from "@/services/usersService"
import { QUERIES } from "@/helpers/crud-helper/consts"
import { toast } from "sonner"
import { useListView } from "@/hooks/_ListViewProvider"
import { useEffect } from "react"
import { isNotEmpty } from "@/helpers/crud-helper/helpers"

const profileSchema = z.object({
  first_name: z.string().optional().nullable(),
  last_name: z.string().optional().nullable(),
  birthday: z.string().optional().nullable(),
  gender: z.union([z.literal(1), z.literal(2)]).optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  zip: z.number().optional().nullable()
})

const userSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  phone_number: z.string().min(8, "Numéro requis"),
  role: z.enum(['admin', 'doctor', 'technician', 'assistant']),
  profile: profileSchema,
})

type UserFormType = z.infer<typeof userSchema>

export default function AdminUserForm() {
  const navigate = useNavigate()
  const { itemIdForUpdate, setItemIdForUpdate } = useListView()

  // Form setup
  const methods = useForm<UserFormType>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      ...initUser,
      profile: { ...initProfile },
    },
  })
  const { register, setValue, handleSubmit, reset, formState: { errors } } = methods
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  // Query pour récupérer l'utilisateur à éditer
  const {
    data,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: [QUERIES.USERS_LIST, 'getUser', itemIdForUpdate],
    queryFn: () => getUserById(itemIdForUpdate),
    enabled: enabledQuery,
    cacheTime: 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError:(err:any) => {
      setItemIdForUpdate(undefined)
      console.error(err)
    }
  })

  // Remplir le formulaire si édition
  useEffect(() => {
    if (data && itemIdForUpdate) {
      reset({
        email: data.email ?? "",
        phone_number: data.phone_number ?? "",
        role: data.role ?? "assistant",
        profile: {
          ...initProfile,
          ...data.profile,
        },
      })
    }
  }, [data, itemIdForUpdate, reset])

  // Rediriger si erreur serveur ou utilisateur inexistant
  useEffect(() => {
    if (isUserError) {
      toast.error("Impossible de charger l'utilisateur.")
      navigate('/admin/users')
    }
  }, [isUserError, navigate])

  // Mutation création/mise à jour
  const mutation = useMutation({
    mutationFn: (data: UserFormType) =>
      itemIdForUpdate
        ? updateUser({ ...data, id: itemIdForUpdate })
        : createUser(data),
    mutationKey: [QUERIES.USERS_LIST, itemIdForUpdate ? 'updateUser' : 'createUser'],
    onSuccess: () => {
      reset()
      navigate('/admin/users')
      toast.success(
        itemIdForUpdate
          ? "Utilisateur mis à jour avec succès"
          : "Utilisateur créé avec succès"
      )
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const status = error?.response?.status
      const data = error?.response?.data
      if (status === 400 && data?.detail) {
        Object.values(data.detail).forEach((err) => {
          toast.error(err as string)
        })
      } else {
        toast.error("Une erreur est survenue, veuillez réessayer plus tard.")
      }
    },
  })

  const onSubmit: SubmitHandler<UserFormType> = (data) => {
    mutation.mutate(data)
  }

  // Affichage du loader pendant le chargement des données utilisateur
  if (itemIdForUpdate && isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <svg className="animate-spin h-8 w-8 text-primary mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <span className="text-gray-400 mt-4">Chargement des informations utilisateur...</span>
      </div>
    )
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link to="/admin/users">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              {itemIdForUpdate ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
            </h1>
          </div>

          <Tabs defaultValue="basic-info" className="space-y-6">
            <TabsList className="grid grid-cols-2 w-[400px]">
              <TabsTrigger value="basic-info">Informations de base</TabsTrigger>
              <TabsTrigger value="profile">Profil (optionnel)</TabsTrigger>
            </TabsList>

            {/* Infos de base */}
            <TabsContent value="basic-info">
              <Card>
                <CardHeader>
                  <CardTitle>Informations de base</CardTitle>
                  <CardDescription>Champs obligatoires pour la création de l'utilisateur</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" placeholder="email@exemple.com" {...register("email")} />
                      {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone_number">Téléphone *</Label>
                      <PhoneInput
                        id="phone_number"
                        international
                        defaultCountry="SN"
                        className="w-full rounded border px-3 py-2"
                        value={methods.watch("phone_number")}
                        onChange={value => setValue("phone_number", value ?? "")}
                        limitMaxLength
                      />
                      {errors.phone_number && <span className="text-red-500 text-xs">{errors.phone_number.message}</span>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Rôle *</Label>
                      <Select
                        value={methods.watch("role")}
                        onValueChange={value => setValue("role", value as UserRole)}
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrateur</SelectItem>
                          <SelectItem value="doctor">Médecin</SelectItem>
                          <SelectItem value="technician">Technicien</SelectItem>
                          <SelectItem value="assistant">Assistant</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.role && <span className="text-red-500 text-xs">{errors.role.message}</span>}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Un mot de passe temporaire sera généré et envoyé à l'utilisateur par email.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profil optionnel */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profil utilisateur</CardTitle>
                  <CardDescription>Ces champs sont facultatifs et peuvent être complétés plus tard.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">Prénom</Label>
                      <Input id="first_name" placeholder="Prénom" {...register("profile.first_name")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Nom</Label>
                      <Input id="last_name" placeholder="Nom" {...register("profile.last_name")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthday">Date de naissance</Label>
                      <Input id="birthday" type="date" {...register("profile.birthday")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Genre</Label>
                      <Select
                        value={methods.watch("profile.gender")?.toString() ?? ""}
                        onValueChange={value => setValue("profile.gender", value ? Number(value) as Gender : undefined)}
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Sélectionner un genre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Homme</SelectItem>
                          <SelectItem value="2">Femme</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse</Label>
                      <Input id="address" placeholder="Adresse" {...register("profile.address")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Input id="city" placeholder="Ville" {...register("profile.city")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">Code postal</Label>
                      <Input id="zip" placeholder="Code postal" {...register("profile.zip")} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" asChild>
              <Link to="/admin/users">Annuler</Link>
            </Button>
            <Button type="submit">
              {itemIdForUpdate ? "Mettre à jour l'utilisateur" : "Créer l'utilisateur"}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}