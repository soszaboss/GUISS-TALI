import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)

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
            <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
            <p className="mt-2 text-base text-gray-600">Your Social Campaigns</p>
          </div>

          {/* Boutons de connexion sociale */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full py-6 flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path
                    fill="#4285F4"
                    d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                  />
                  <path
                    fill="#34A853"
                    d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                  />
                </g>
              </svg>
              <span>Sign in with Google</span>
            </Button>
            <Button variant="outline" className="w-full py-6 flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
                <path d="M10 2c1 .5 2 2 2 5" />
              </svg>
              <span>Sign in with Apple</span>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or with email</span>
            </div>
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

            <div>
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
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

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80">
                Forgot Password ?
              </Link>
            </div>

            <Button type="submit" className="w-full h-12 text-base">
              Sign In
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Not a Member yet?{" "}
              <Link to="/register" className="font-medium text-primary hover:text-primary/80">
                Sign up
              </Link>
            </p>
          </div>
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
