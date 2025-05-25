// auth-routes.tsx
// auth-routes.tsx
import type { RouteObject } from 'react-router-dom'
import Login from './pages/login'
import ForgotPassword from './pages/forgot-password'
import Register from './pages/register'
import { EmailVerification } from './pages/email-verification'
import ResetPassword from './pages/reset-password'
import { TwoFactorVerification } from './pages/two-factor-verification'

export const authRoutes: RouteObject[] = [
  {
    path: '/auth/login',
    element: <Login />,
  },
  {
    path: '/auth/registration',
    element: <Register />,
  },
  {
    path: '/auth/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/auth/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/auth/two-factor-verification',
    element: <TwoFactorVerification />,
  },
  {
    path: '/auth/email-verification',
    element: <EmailVerification />,
  },
  {
    path: '/auth',
    index: true,
    element:<Login />
  }
]
