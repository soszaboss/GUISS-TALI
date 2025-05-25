import { useAuth } from '@/hooks/auth/Auth'
import {useEffect} from 'react'
import {Navigate, Routes} from 'react-router-dom'

export function Logout() {
  const {logout} = useAuth()
  useEffect(() => {
    logout()
    document.location.reload()
  }, [logout])

  return (
    <Routes>
      <Navigate to='/auth/login' />
    </Routes>
  )
}
