/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Smartphone } from "lucide-react"
import { toast } from "sonner"
import { verifyTwoFactorCode } from "@/services/authService"
import { getResetEmail } from "@/helpers/crud-helper/AuthHelpers"

function maskEmail(email: string) {
  if (!email) return ""
  const [user, domain] = email.split("@")
  if (!user || !domain) return email
  const maskedUser = user.length <= 2 ? user[0] + "*" : user[0] + "*".repeat(user.length - 2) + user.slice(-1)
  return `${maskedUser}@${domain}`
}

export function TwoFactorVerification() {
  const [code, setCode] = useState<string[]>(Array(6).fill(""))
  const [error, setError] = useState<string>("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>("")

  // Récupère l'email depuis le localStorage
  useEffect(() => {
    const storedEmail = getResetEmail()
    if (!storedEmail) {
      navigate("/auth/forgot-password", { replace: true })
      toast.error("Aucun email trouvé pour la vérification.")
    } else {
      setEmail(storedEmail)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6)
  }, [])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0]
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const verificationCode = code.join("")
    if (verificationCode.length !== 6) {
      setError("Veuillez entrer le code à 6 chiffres.")
      return
    }
    try {
      await verifyTwoFactorCode(verificationCode)
      toast.success("Code vérifié, veuillez choisir un nouveau mot de passe.")
      navigate(`/auth/reset-password/${verificationCode}`)
    } catch (err: any) {
      if (err?.response?.data?.detail) {
        setError(err.response.data.detail)
      } else {
        setError("Code invalide ou expiré.")
      }
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-primary">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-6 items-center text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <Smartphone className="h-8 w-8 text-blue-500" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-center">Vérification en deux étapes</CardTitle>
            <CardDescription className="text-center mt-2">
              Saisissez le code de vérification envoyé à
            </CardDescription>
            <p className="text-center text-lg mt-2">{maskEmail(email)}</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <p className="font-medium mb-4">Entrez votre code de sécurité à 6 chiffres</p>
                <div className="flex gap-2 justify-between">
                  {code.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      className="h-14 w-14 text-center text-xl"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              </div>
              <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                Valider
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}