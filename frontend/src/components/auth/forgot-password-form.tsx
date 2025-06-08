import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ForgotPasswordForm() {
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
            <h1 className="text-3xl font-bold text-gray-900">Forgot Password ?</h1>
            <p className="mt-2 text-base text-gray-600">Enter your email to reset your password.</p>
          </div>

          <form className="space-y-6" action="#" method="POST">
            <div>
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email"
                className="h-12"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1 h-12">
                Submit
              </Button>
              <Button type="button" variant="outline" className="flex-1 h-12" asChild>
                <Link to="/login">Cancel</Link>
              </Button>
            </div>
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
