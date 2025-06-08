/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { resetPassword } from "@/services/authService"
import { useState } from "react"
import { setResetEmail } from "@/helpers/crud-helper/AuthHelpers"

const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
})

type ForgotPasswordFormType = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const [email, setEmail] = useState<string>("")

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const mutation = useMutation({
    mutationFn: (data: ForgotPasswordFormType) => resetPassword(data.email),
    onSuccess: () => {
      setResetEmail(email) // Assuming setResetEmail is a function to store the email for later use
      toast.success("Un email de réinitialisation a été envoyé.")
      navigate("/auth/two-factor-verification")
    },
    onError: (error: any) => {
      if (error?.response?.data?.detail) {
        const detail = error.response.data.detail
        if (typeof detail === "string") {
          toast.error(detail)
        } else if (typeof detail === "object") {
          Object.values(detail).flat().forEach((msg: any) => toast.error(String(msg)))
        } else {
          toast.error("Erreur lors de la demande.")
        }
      } else {
        toast.error("Erreur lors de la demande.")
      }
      setError("email", { message: " " })
    },
  })

  const onSubmit = (data: ForgotPasswordFormType) => {
    setEmail(data.email)
    mutation.mutate(data)
  }

  return (
    <div className="flex min-h-screen">
      {/* Partie gauche - Formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-10">
            <Link to="#" className="inline-block mb-6">
              <img
                src="https://cdn.dribbble.com/userupload/21697832/file/original-fb948cec051fddb3194f463811a8f9b7.png?resize=752x564&vertical=center"
                alt="Doccure Logo"
                width={180}
                height={60}
                className="h-15 w-auto mx-auto"
              />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Mot de passe oublié ?</h1>
            <p className="mt-2 text-base text-gray-600">Entrez votre adresse e-mail pour le réinitialiser.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                className="h-12"
                {...register("email")}
                disabled={isSubmitting}
              />
              {errors.email && (
                <span className="text-xs text-red-500">{errors.email.message}</span>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1 h-12" disabled={isSubmitting}>
                {isSubmitting ? "Envoi..." : "Soumettre"}
              </Button>
              <Button type="button" variant="outline" className="flex-1 h-12" asChild>
                <Link to="/login">Annuler</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Partie droite - Illustration */}
      <div className="hidden lg:block lg:w-1/2 bg-[url(https://i.pinimg.com/736x/9f/0b/cc/9f0bcc0508ec9ed477d95dbb90b15cb8.jpg)] bg-cover bg-center" />
    </div>
  )
}