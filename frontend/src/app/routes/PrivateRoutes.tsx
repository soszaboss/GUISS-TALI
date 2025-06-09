// routes/PrivateRoutes.tsx
import { adminPlatformRoutes } from '@/features/admin/AdminPages'
import { assistantRoutes } from '@/features/assistant/AssistantsPage'
import { doctorRoutes } from '@/features/doctor/DoctorPages'
import { technicianRoutes } from '@/features/technician/TechniciansPage'
import Error404 from '@/features/errors/components/Error404'
import { RoleGuard } from '@/features/auth/components/RoleGuard'

export const privateRoutes = [
  {
    path: 'admin/',
    element: <RoleGuard allowedRoles={['admin']} />,
    children: adminPlatformRoutes,
  },
  {
    path: 'assistant/',
    element: <RoleGuard allowedRoles={['assistant']} />,
    children: assistantRoutes,
  },
  {
    path: 'doctor/',
    element: <RoleGuard allowedRoles={['doctor']} />,
    children: doctorRoutes,
  },
  {
    path: 'technician/',
    element: <RoleGuard allowedRoles={['technician']} />,
    children: technicianRoutes,
  },
  {
    path: '*',
    element: <Error404 />,
  },
]
