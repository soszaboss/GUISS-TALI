import { MetronicSplashScreenProvider } from '@/components/ui/splash-screen'
import { AuthProvider } from '@/hooks/auth/Auth'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/AppRoutes'

function App() {
  return (
    <AuthProvider>
      <MetronicSplashScreenProvider>
        <RouterProvider router={router} />
      </MetronicSplashScreenProvider>
    </AuthProvider>
  )
}

export default App
