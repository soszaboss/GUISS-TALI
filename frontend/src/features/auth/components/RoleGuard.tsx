// components/auth/RoleGuard.tsx
import { useAuth } from '@/hooks/auth/Auth'
import { Navigate, Outlet } from 'react-router-dom'

type RoleGuardProps = {
  allowedRoles: string[]
  fallback?: string // optionnel, sinon redirige vers /403
}

export const RoleGuard = ({ allowedRoles, fallback = '/error/403' }: RoleGuardProps) => {
    const { currentUser } = useAuth()
    const role = currentUser?.role?.toLowerCase()
    if (!currentUser) return <Navigate to="/auth/login" replace />

    if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={fallback} replace />
    }

    return <Outlet />
}
