import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function Error404() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 via-red-100 to-purple-400">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full mx-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Requête Invalide</h1>
        <p className="text-gray-600 mb-8">Désolé, votre requête n'a pas pu être traitée correctement.</p>

        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="text-[120px] font-bold text-gray-900 leading-none flex items-center justify-center">
              <span>4</span>
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-amber-600 flex items-center justify-center">
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
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="absolute -bottom-4 -right-4">
                  <div className="w-12 h-16 bg-amber-500 rounded-lg transform rotate-45 translate-x-2 translate-y-2"></div>
                </div>
              </div>
              <span>4</span>
            </div>
          </div>
        </div>

        <Button
          className="bg-amber-600
          hover:bg-amber-700"
          onClick={() => navigate(-1)}
        >
          Retour en arrière
        </Button>
      </div>
    </div>
  )
}
