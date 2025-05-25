// errors-routes.tsx
// errors-routes.tsx
import type { RouteObject } from 'react-router-dom'
import Error404 from './components/Error404'
import Error500 from './components/Error500'

export const errorRoutes: RouteObject[] = [
  {
    path: '/404',
    element: <Error404 />,
  },
  {
    path: '/500',
    element: <Error500 />,
  },
  {
    path: '*', // fallback route
    element: <Error404 />,
  },
]
