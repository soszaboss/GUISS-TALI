/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { login } from "@/services/authService"
import { useAuth } from "@/hooks/auth/Auth"
import { useMutation } from "@tanstack/react-query"
import { QUERIES } from "@/helpers/crud-helper/consts"

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(4, "Mot de passe requis est d'au moins 6 caractères"),
})

type LoginFormType = z.infer<typeof loginSchema>

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { saveAuth } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const mutation = useMutation({
    mutationFn: (data: LoginFormType) => login(data.email, data.password),
    mutationKey: [QUERIES, 'login'],
    onSuccess: (tokens) => {
      toast.success("Connexion réussie !")
      saveAuth(tokens)
    },
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        toast.error("Email ou mot de passe incorrect.")
      } else if (error?.response?.data?.detail) {
        const detail = error.response.data.detail
        if (typeof detail === "string") {
          toast.error(detail)
        } else if (typeof detail === "object") {
          Object.values(detail).flat().forEach((msg: any) => toast.error(String(msg)))
        } else {
          toast.error("Erreur lors de la connexion.")
        }
      } else {
        toast.error("Erreur lors de la connexion.")
      }
      setError("email", { message: " " })
      setError("password", { message: " " })
    },
  })

  const onSubmit = (data: LoginFormType) => {
    mutation.mutate(data)
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 60%, #fff 100%)",
      }}
    >
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 rounded-xl shadow-2xl bg-white/95 p-8">
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
            <h1 className="text-3xl font-bold text-blue-800">Se Connecter</h1>
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
                className="h-12 bg-gray-50 border-gray-200 focus:border-blue-400"
                {...register("email")}
                disabled={isSubmitting}
              />
              {errors.email && (
                <span className="text-xs text-red-500">{errors.email.message}</span>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="sr-only">
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Mot de passe"
                  className="h-12 bg-gray-50 border-gray-200 focus:border-blue-400"
                  {...register("password")}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-blue-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-blue-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-red-500">{errors.password.message}</span>
              )}
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm font-medium text-blue-700 hover:text-blue-900">
                Mot de passe oublié ?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base bg-blue-700 hover:bg-blue-800 text-white shadow"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Connexion..." : "Se Connecter"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}