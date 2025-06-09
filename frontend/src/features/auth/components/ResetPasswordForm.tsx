/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { verifyTwoFactorCode, resetPasswordWithCode } from "@/services/authService"

const passwordSchema = z.object({
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
  confirmPassword: z.string(),
  agreeTerms: z.literal(true, { errorMap: () => ({ message: "Vous devez accepter les conditions." }) }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
})

type PasswordFormType = z.infer<typeof passwordSchema>

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const { code } = useParams<{ code: string }>()
  const [isVerifying, setIsVerifying] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<PasswordFormType>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      agreeTerms: true,
    },
  })

  // Vérification du code à l'arrivée
  useEffect(() => {
    if (!code) {
      navigate("/auth/forgot-password", { replace: true })
      return
    }
    verifyTwoFactorCode(code)
      .then(() => setIsVerifying(false))
      .catch(() => {
        toast.error("Lien invalide ou expiré.")
        navigate("/auth/forgot-password", { replace: true })
      })
    // eslint-disable-next-line
  }, [code])

  const onSubmit = async (data: PasswordFormType) => {
    if (!code) return
    try {
      await resetPasswordWithCode(code, data.password)
      toast.success("Mot de passe modifié avec succès. Vous pouvez vous connecter.")
      reset()
      localStorage.removeItem("emailForPasswordReset")
      navigate("/auth/login")
    } catch (err: any) {
      if (err?.response?.data?.detail) {
        setError("password", { message: err.response.data.detail })
      } else {
        setError("password", { message: "Erreur lors de la modification du mot de passe." })
      }
    }
  }

  if (isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-gray-700">Vérification du lien en cours...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Partie gauche - Formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-10">
            <Link to="/" className="inline-block mb-6">
              <img
                src="https://cdn.dribbble.com/userupload/21697832/file/original-fb948cec051fddb3194f463811a8f9b7.png?resize=752x564&vertical=center"
                alt="Doccure Logo"
                width={180}
                height={60}
                className="h-15 w-auto mx-auto"
              />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Définir un nouveau mot de passe</h1>
            <p className="mt-2 text-base text-gray-600">
              Vous avez déjà réinitialisé le mot de passe ?{" "}
              <Link to="/auth/login" className="text-primary hover:text-primary/80">
                Se connecter
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <Label htmlFor="password" className="sr-only">
                Nouveau mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Nouveau mot de passe"
                  className="h-12"
                  {...register("password")}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-red-500">{errors.password.message}</span>
              )}
            </div>

            <div className="text-sm text-gray-600">
              Utilisez 8 caractères ou plus avec un mélange de lettres, chiffres et symboles.
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="sr-only">
                Confirmer le mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirmer le mot de passe"
                  className="h-12"
                  {...register("confirmPassword")}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                {...register("agreeTerms")}
                disabled={isSubmitting}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                J'accepte les{" "}
                <Link to="/terms" className="text-primary hover:text-primary/80">
                  conditions générales
                </Link>
                .
              </label>
            </div>

            <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
              {isSubmitting ? "Changement..." : "Valider"}
            </Button>
          </form>
        </div>
      </div>

      {/* Partie droite - Illustration */}
      <div className="hidden lg:block lg:w-1/2 bg-[url(https://i.pinimg.com/736x/f6/a0/ad/f6a0ad1e85efbd5040c8ef57948af3ee.jpg)] bg-cover bg-center" />
    </div>
  )
}