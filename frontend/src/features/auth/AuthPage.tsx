import { type RouteObject } from 'react-router-dom'
import { EmailVerification } from './components/email-verification'
import { TwoFactorVerification } from './components/two-factor-verification'
import Error404 from '../errors/components/Error404'
import { LoginForm } from './components/LoginForm'
import { ForgotPasswordForm } from './components/ForgotPasswordForm'
import { ResetPasswordForm } from './components/ResetPasswordForm'

export const authRoutes: RouteObject[] = [
  {
    index: true,
    element: <LoginForm />,
  },
  {
    path: 'login',
    element: <LoginForm />,
  },
  {
    path: 'forgot-password',
    element: <ForgotPasswordForm />,
  },
  {
    path: 'reset-password/:code',
    element: <ResetPasswordForm />,
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