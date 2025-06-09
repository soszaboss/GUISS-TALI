import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function Error403() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-200 via-yellow-100 to-purple-300">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full mx-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Accès refusé</h1>
        <p className="text-gray-600 mb-8">
          Désolé, vous n'avez pas l'autorisation d'accéder à cette page.
        </p>

        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="text-[120px] font-bold text-gray-900 leading-none flex items-center justify-center">
              <span>4</span>
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01M9.172 9.172a4 4 0 015.656 0M15 15h.01M9 15h.01"
                    />
                  </svg>
                </div>
                <div className="absolute -bottom-4 -right-4">
                  <div className="w-12 h-16 bg-red-500 rounded-lg transform rotate-45 translate-x-2 translate-y-2"></div>
                </div>
              </div>
              <span>3</span>
            </div>
          </div>
        </div>

        <Button
          className="bg-red-600 hover:bg-red-700"
          onClick={() => navigate(-1)}
        >
          Retour en arrière
        </Button>
      </div>
    </div>
  )
}