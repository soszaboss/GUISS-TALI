"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Partie gauche - Formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-10">
            <Link to="/" className="inline-block mb-6">
              <img
                src="/placeholder.svg?height=60&width=180"
                alt="Doccure Logo"
                width={180}
                height={60}
                className="h-15 w-auto mx-auto"
              />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Setup New Password</h1>
            <p className="mt-2 text-base text-gray-600">
              Have you already reset the password ?{" "}
              <Link to="/login" className="text-primary hover:text-primary/80">
                Sign in
              </Link>
            </p>
          </div>

          <form className="space-y-6" action="#" method="POST">
            <div>
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="Password"
                  className="h-12"
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
            </div>

            <div className="text-sm text-gray-600">
              Use 8 or more characters with a mix of letters, numbers & symbols.
            </div>

            <div>
              <Label htmlFor="confirm-password" className="sr-only">
                Repeat Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="Repeat Password"
                  className="h-12"
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
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked === true)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I Agree &{" "}
                <Link to="/terms" className="text-primary hover:text-primary/80">
                  Terms and conditions
                </Link>
                .
              </label>
            </div>

            <Button type="submit" className="w-full h-12" disabled={!agreeTerms}>
              Submit
            </Button>
          </form>
        </div>
      </div>

      {/* Partie droite - Illustration */}
      <div className="hidden lg:block lg:w-1/2 bg-primary relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
          <div className="mb-8">
            <img
              src="/placeholder.svg?height=80&width=200"
              alt="Logo"
              width={200}
              height={80}
              className="h-20 w-auto"
            />
          </div>

          {/* Illustrations flottantes */}
          <div className="relative w-full h-full max-w-lg mx-auto">
            <div className="absolute top-0 right-0 bg-white rounded-lg shadow-lg p-4 w-64">
              <div className="text-xs text-gray-500 mb-1">Stats by Department</div>
              <div className="flex justify-between mb-2">
                <div>
                  <div className="text-xl font-bold">8,035</div>
                  <div className="text-xs text-gray-500">Actual for April</div>
                </div>
                <div>
                  <div className="text-xl font-bold">4,684</div>
                  <div className="text-xs text-gray-500">GAP</div>
                </div>
              </div>
              <div className="h-24 bg-gray-100 rounded-md"></div>
            </div>

            <div className="absolute top-1/3 left-0 bg-white rounded-lg shadow-lg p-4 w-64">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                <div>
                  <div className="text-sm font-medium">570k</div>
                  <div className="text-xs text-gray-500">Followers</div>
                </div>
              </div>
              <div className="h-16 bg-gray-100 rounded-md"></div>
            </div>

            <div className="absolute bottom-0 left-1/4 bg-white rounded-lg shadow-lg p-4 w-64">
              <div className="text-xs text-gray-500 mb-1">Projects Earnings in April</div>
              <div className="text-xl font-bold mb-2">69,700</div>
              <div className="h-24 bg-gray-100 rounded-md"></div>
            </div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 text-center text-white text-2xl font-bold">
            Fast, Efficient and Productive
          </div>
        </div>
      </div>
    </div>
  )
}
