import { type RouteObject } from 'react-router-dom'
import Login from './pages/login'
import ForgotPassword from './pages/forgot-password'
import Register from './pages/register'
import { EmailVerification } from './pages/email-verification'
import ResetPassword from './pages/reset-password'
import { TwoFactorVerification } from './pages/two-factor-verification'
import Error404 from '../errors/components/Error404'

export const authRoutes: RouteObject[] = [
  {
    index: true,
    element: <Login />,
  },
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'registration',
    element: <Register />,
  },
  {
    path: 'forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: 'reset-password',
    element: <ResetPassword />,
  },
  {
    path: 'two-factor-verification',
    element: <TwoFactorVerification />,
  },
  {
    path: 'email-verification',
    element: <EmailVerification />,
  },
  {
    path: '*',
    element: <Error404 />
  }
]