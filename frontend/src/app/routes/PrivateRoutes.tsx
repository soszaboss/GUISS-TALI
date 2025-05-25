// PrivateRoutes.tsx
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/auth/Auth'

export const PrivateRoutes = () => {
  const { currentUser } = useAuth()

  if (!currentUser) return <Navigate to="/auth/login" replace />

  return <Outlet />
}
