// PrivateRoutes.tsx
import { adminPlatformRoutes } from '@/features/admin/AdminPages'
import { assistantRoutes } from '@/features/assistant/AssistantsPage'
import { doctorRoutes } from '@/features/doctor/DoctorPages'
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

  {
    path: 'doctor/',
    children: doctorRoutes
  },

  //Page Not Found
  {
    path: '*',
    element: <Error404 />
  }
]
