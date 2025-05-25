import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function EmailVerification() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-amber-700 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 items-center text-center pt-8">
          <div className="w-12 h-12 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10 8L20 20L30 8M10 32L20 20L30 32"
                stroke="#F43F5E"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 pb-8">
          <div className="text-center text-muted-foreground">
            Did't receive an email?{" "}
            <Button variant="link" className="p-0 text-blue-500 font-medium">
              Try Again
            </Button>
          </div>

          <Button className="w-full bg-blue-500 hover:bg-blue-600">Skip for now</Button>

          <div className="flex justify-center">
            <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_1_2)">
                <path d="M90 120L135 75L120 60L90 90L75 75L60 90L90 120Z" fill="#000" />
                <path
                  d="M135 45H45C37.5 45 30 52.5 30 60V120C30 127.5 37.5 135 45 135H135C142.5 135 150 127.5 150 120V60C150 52.5 142.5 45 135 45Z"
                  stroke="#000"
                  strokeWidth="6"
                />
                <path
                  d="M90 105C97.5 105 105 97.5 105 90C105 82.5 97.5 75 90 75C82.5 75 75 82.5 75 90C75 97.5 82.5 105 90 105Z"
                  fill="#7C3AED"
                />
                <path d="M75 120L60 135M105 120L120 135M60 45L75 60M120 45L105 60" stroke="#000" strokeWidth="3" />
                <path d="M75 90H60M105 90H120" stroke="#000" strokeWidth="3" />
                <path d="M60 75L75 60M120 75L105 60" stroke="#000" strokeWidth="3" />
                <path d="M90 75V60M90 120V105" stroke="#000" strokeWidth="3" />
                <path d="M60 105L75 120M120 105L105 120" stroke="#000" strokeWidth="3" />
                <path d="M90 90L105 75M90 90L75 105" fill="#7C3AED" />
              </g>
              <defs>
                <clipPath id="clip0_1_2">
                  <rect width="180" height="180" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
