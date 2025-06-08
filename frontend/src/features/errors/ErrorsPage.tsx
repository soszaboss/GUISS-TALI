// errors-routes.tsx
// errors-routes.tsx
import type { RouteObject } from 'react-router-dom'
import Error404 from './components/Error404'
import Error500 from './components/Error500'
import Error403 from './components/Error403'

export const errorRoutes: RouteObject[] = [
  {
    path: '404',
    element: <Error404 />,
  },
  {
    path: '500',
    element: <Error500 />,
  },
  {
    path: '403',
    element: <Error403 />,
  },
  {
    path: '*', // fallback route
    element: <Error404 />,
  },
]
