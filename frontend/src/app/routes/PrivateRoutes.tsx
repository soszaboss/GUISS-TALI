// PrivateRoutes.tsx
import { assistantRoutes } from '@/features/assistant/AssistantsPage'
import Error404 from '@/features/errors/components/Error404'
import { type RouteObject } from 'react-router-dom'


export const privateRoutes: RouteObject[] = [
  {
    path: 'assistant/',
    children: assistantRoutes,
  },

  //Page Not Found
  {
    path: '*',
    element: <Error404 />
  }
]
