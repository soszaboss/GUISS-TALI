// routes/PrivateRoutes.tsx
import { adminPlatformRoutes } from '@/features/admin/AdminPages'
import { EmployeeRoutes } from '@/features/employee/EmployeesPage'
import Error404 from '@/features/errors/components/Error404'
import { RoleGuard } from '@/features/auth/components/RoleGuard'

export const privateRoutes = [
  {
    path: 'admin/',
    element: <RoleGuard allowedRoles={['admin']} />,
    children: adminPlatformRoutes,
  },
  {
    path: 'employee/',
    element: <RoleGuard allowedRoles={['employee', 'doctor', 'technician']} />,
    children: EmployeeRoutes,
  },
  {
    path: '*',
    element: <Error404 />,
  },
]
