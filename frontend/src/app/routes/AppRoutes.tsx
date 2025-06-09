// routes/AppRoutes.tsx
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { Logout } from '@/features/auth/Logout'
import { errorRoutes } from '@/features/errors/ErrorsPage'
import { authRoutes } from '@/features/auth/AuthPage'
import { privateRoutes } from './PrivateRoutes'
import { useAuth } from '@/hooks/auth/Auth'
import IndexPage from '@/components/IndexPage'
import { LayoutSplashScreen } from '@/components/ui/splash-screen'

export function AppRoutes() {
  const { currentUser, auth } = useAuth()

  // 🧠 Empêche le routeur de charger tant que l’état est indéfini
  if (auth && !currentUser) {
    return <LayoutSplashScreen />
  }

  const routes = [
    {
      path: 'error/*',
      children: errorRoutes,
    },
    {
      path: 'logout',
      element: <Logout />,
    },
    {
      index: true,
      element: <IndexPage />,
    },
    ...(currentUser
      ? [
          {
            path: '/*',
            children: privateRoutes,
          },
        ]
      : [
          {
            path: '/auth/*',
            children: authRoutes,
          },
          {
            path:'*',
            element: <Navigate to={'/error/404'} />,
          }
        ]),
  ]

  const router = createBrowserRouter(routes)

  return <RouterProvider router={router} />
}
