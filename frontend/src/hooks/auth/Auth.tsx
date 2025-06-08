/* eslint-disable react-refresh/only-export-components */
import type { AuthModel } from '@/types/authModels'
import type { WithChildren } from '@/utils/react18MigrationHelpers'
import * as authHelper from '@/helpers/crud-helper/AuthHelpers'
import {type FC, useState, useEffect, createContext, useContext, type Dispatch, type SetStateAction} from 'react'
import { getUserByToken } from '@/services/usersService'
import { LayoutSplashScreen } from '@/components/ui/splash-screen'
import type { User } from '@/types/userModels'
import { isTokenExpired } from '@/helpers/crud-helper/AuthHelpers'
import { useMutation } from '@tanstack/react-query'
import { blacklistToken, refreshToken } from '@/services/authService'
import { QUERIES } from '@/helpers/crud-helper/consts'

type AuthContextProps = {
  auth: AuthModel | undefined
  saveAuth: (auth: AuthModel | undefined) => void
  currentUser: User | undefined
  setCurrentUser: Dispatch<SetStateAction<User | undefined>>
  logout: () => void
}

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => {},
  currentUser: undefined,
  setCurrentUser: () => {},
  logout: () => {},
}

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState)

const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider: FC<WithChildren> = ({children}) => {
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth())
  const [currentUser, setCurrentUser] = useState<User | undefined>()

  const persistAuth = (auth: AuthModel | undefined) => {
    setAuth(auth)
    if (auth) {
      authHelper.setAuth(auth)
    } else {
      authHelper.removeAuth()
    }
  }

  const mutateRefreshToken = useMutation({
    mutationFn: (token: string) => refreshToken(token),
    mutationKey: [QUERIES, 'refreshToken'],
    onSuccess: (newAuth) => {
      if (newAuth) {
        persistAuth(newAuth)
      } else {
        persistAuth(undefined)
        setCurrentUser(undefined)
      }
    },
    onError: () => {
      persistAuth(undefined)
      setCurrentUser(undefined)
    },
  })

  const mutateLogout = useMutation({
    mutationKey: [QUERIES, 'logout'],
    mutationFn: (refresh: string) => blacklistToken(refresh),
    onSuccess: () => {
      saveAuth(undefined)
      setCurrentUser(undefined)
    }
  })

  const saveAuth = (auth: AuthModel | undefined) => {
    if (!auth) return persistAuth(undefined)

    const { access, refresh } = auth

    if (access && isTokenExpired(access)) {
      if (refresh && !isTokenExpired(refresh)) {
        mutateRefreshToken.mutate(refresh)
      } else {
        persistAuth(undefined)
        setCurrentUser(undefined)
      }
    } else {
      persistAuth(auth)
    }
  }

  const logout = () => {
    if (auth && auth.refresh && !isTokenExpired(auth.refresh)) {
      mutateLogout.mutate(auth.refresh)
    } else {
      saveAuth(undefined)
      setCurrentUser(undefined)
    }
  }

  /** 🔁 Vérifie token au montage */
  useEffect(() => {
    if (auth?.access && isTokenExpired(auth.access)) {
      if (auth.refresh && !isTokenExpired(auth.refresh)) {
        mutateRefreshToken.mutate(auth.refresh)
      } else {
        persistAuth(undefined)
        setCurrentUser(undefined)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider value={{auth, saveAuth, currentUser, setCurrentUser, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

const AuthInit: FC<WithChildren> = ({children}) => {
  const {auth, currentUser, logout, setCurrentUser} = useAuth()
  const [showSplashScreen, setShowSplashScreen] = useState(true)

  useEffect(() => {
    
    const requestUser = async () => {
      try {
        if (!currentUser) {
          const {data} = await getUserByToken()
          if (data) {
            setCurrentUser(data)
          }
        }
      } catch (error) {
        console.error(error)
        if (currentUser) {
          logout()
        }
      } finally {
        setShowSplashScreen(false)
      }
    }

    if (auth && auth.access) {
      requestUser()
    } else {
      logout()
      setShowSplashScreen(false)
    }
    // eslint-disable-next-line
  }, [])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
}

export {AuthProvider, AuthInit, useAuth}
