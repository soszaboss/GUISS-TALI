// app-router.tsx
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom'
import { Logout } from '@/features/auth/Logout'
import { errorRoutes } from '@/features/errors/ErrorsPage'
import { authRoutes } from '@/features/auth/AuthPage'
import { privateRoutes } from './PrivateRoutes'




const routes: RouteObject[] = [
  {
    path: 'error/*',
    children: errorRoutes,
  },

  {
    path: 'logout',
    element: <Logout />,
  },

  {
    path: '/*',
    children:privateRoutes,
  },

  {
    path: '/auth/*',
    children: authRoutes,
  },
  
  {
    path: '',
    index: true,
    element: <Navigate to='auth/login' replace/>
  }

];

export const router = createBrowserRouter(routes);
