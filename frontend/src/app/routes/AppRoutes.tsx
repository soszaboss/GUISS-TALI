// app-router.tsx
import { createBrowserRouter } from 'react-router-dom'
import { Logout } from '@/features/auth/Logout'
// import { useCurrentUserLoader } from '@/utils/AuthHelpers'
import { errorRoutes } from '@/features/errors/ErrorsPage'
import { authRoutes } from '@/features/auth/AuthPage'
import LoginPage from '@/features/auth/pages/login'



export const router = createBrowserRouter(
  [
    {
      path: '/',
      children: [
        {
          path: 'logout',
          element: <Logout />,
        },
        {
          index: true,
          element: <LoginPage />,
        },
        ...errorRoutes,
        ...authRoutes,
      ],
    },
  ],
)
