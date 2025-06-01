// PrivateRoutes.tsx
import { adminPlatformRoutes } from '@/features/admin/AdminPages'
import { assistantRoutes } from '@/features/assistant/AssistantsPage'
import { doctorRoutes } from '@/features/doctor/DoctorPages'
import Error404 from '@/features/errors/components/Error404'
import { technicianRoutes } from '@/features/technician/TechniciansPage'
import { type RouteObject } from 'react-router-dom'


export const privateRoutes: RouteObject[] = [

  // Default route for assistants
  {
    path: 'assistant/',
    children: assistantRoutes,
  },
  
  // Default route for admin platform
  {
    path: 'admin/',
    children: adminPlatformRoutes
  },

  // Default route for doctors
  {
    path: 'doctor/',
    children: doctorRoutes
  },

  // Default route for technicians
  {
    path: 'technician/',
    children: technicianRoutes
  },

  //Page Not Found
  {
    path: '*',
    element: <Error404 />
  }
]
