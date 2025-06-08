/* eslint-disable @typescript-eslint/no-explicit-any */

import type { AuthModel } from "@/types/authModels"


const AUTH_LOCAL_STORAGE_KEY = 'kt-auth-react-v'

const getAuth = (): AuthModel | undefined => {
  if (!localStorage) {
    return
  }

  const lsValue: string | null = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY)
  if (!lsValue) {
    return
  }

  try {
    const auth: AuthModel = JSON.parse(lsValue) as AuthModel
    if (auth) {
      // You can easily check auth_token expiration also
      return auth
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error)
  }
}

const setAuth = (auth: AuthModel) => {
  if (!localStorage) {
    return
  }

  try {
    const lsValue = JSON.stringify(auth)
    localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, lsValue)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SAVE ERROR', error)
  }
}

const removeAuth = () => {
  if (!localStorage) {
    return
  }

  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error)
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}


 // Redirection selon le rôle
  // switch (decoded.role) {
  //   case "admin":
  //     navigate("/admin/dashboard")
  //     break
  //   case "doctor":
  //     navigate("/doctor/dashboard")
  //     break
  //   case "technician":
  //     navigate("/technician/dashboard")
  //     break
  //   case "assistant":
  //     navigate("/assistant/dashboard")
  //     break
  //   default:
  //     navigate("/")
  // }
export {getAuth, setAuth, removeAuth, AUTH_LOCAL_STORAGE_KEY}
