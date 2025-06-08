// components/IndexPage.tsx
import { useAuth } from "@/hooks/auth/Auth"
import type { UserRole } from "@/types/userModels"
import { Navigate } from "react-router-dom"

const redirectPage = (role: UserRole | undefined): string => {
  switch (role) {
    case "admin":
      return "/admin/dashboard"
    case "assistant":
      return "/assistant/dashboard"
    case "technician":
      return "/technician/welcome"
    case "doctor":
      return "/doctor/welcome"
    default:
      return "/auth/login"
  }
}

export default function IndexPage() {
  const { currentUser } = useAuth()
  const redirectTo: string = redirectPage(currentUser?.role?.toLowerCase() as UserRole)
    console.log("IndexPage redirectTo:", redirectTo)
    console.log("IndexPage currentUser:", currentUser)
  return <Navigate to={redirectTo} replace />
}
