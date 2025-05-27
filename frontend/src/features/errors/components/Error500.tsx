import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function Error500() {
    const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-300 via-blue-300 to-purple-500">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full mx-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Erreur Système</h1>
        <p className="text-gray-600 mb-8">Une erreur est survenue ! Veuillez réessayer plus tard.</p>

        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="text-[120px] font-bold text-gray-900 leading-none flex items-center justify-center">
              <span>5</span>
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center">
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="absolute -bottom-4 -right-4">
                  <div className="w-12 h-16 bg-blue-500 rounded-lg transform rotate-45 translate-x-2 translate-y-2"></div>
                </div>
              </div>
              <span>0</span>
            </div>
          </div>
        </div>

        <Button  
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate(-1)}
        >
          Retour en arrière
        </Button>
      </div>
    </div>
  )
}
