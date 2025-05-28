// PrivateRoutes.tsx
import { adminPlatformRoutes } from '@/features/admin/AdminPages'
import { assistantRoutes } from '@/features/assistant/AssistantsPage'
import Error404 from '@/features/errors/components/Error404'
import { type RouteObject } from 'react-router-dom'


export const privateRoutes: RouteObject[] = [
  {
    path: 'assistant/',
    children: assistantRoutes,
  },
  {
    path: 'admin-platform/',
    children: adminPlatformRoutes
  },
  //Page Not Found
  {
    path: '*',
    element: <Error404 />
  }
]
