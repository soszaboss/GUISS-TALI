/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuth, setAuth, removeAuth } from '@/helpers/crud-helper/AuthHelpers'
import { refreshToken } from '@/services/authService'
import Axios, { type InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_APP_API_URL

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const auth = getAuth()
  if (auth && auth.access) {
    config.headers.Authorization = `Bearer ${auth.access}`
  }
  if (config.headers) {
    config.headers.Accept = 'application/json'
  }
  return config
}

export function setupAxios(axios: typeof Axios) {
  axios.defaults.baseURL = API_URL
  axios.interceptors.request.use(authRequestInterceptor)

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      // Si 401 et pas déjà tenté de refresh
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !window.location.pathname.startsWith('/auth/login')
      ) {
        originalRequest._retry = true

        const auth = getAuth()
        if (auth?.refresh) {
          if (isRefreshing) {
            // Si déjà en cours de refresh, on met la requête en attente
            return new Promise((resolve, reject) => {
              failedQueue.push({
                resolve: (token: unknown) => {
                  originalRequest.headers['Authorization'] = 'Bearer ' + token
                  resolve(axios(originalRequest))
                },
                reject: (err) => {
                  reject(err)
                }
              })
            })
          }

          isRefreshing = true
          try {
            const newAuth = await refreshToken(auth.refresh)
            if (newAuth && newAuth.access) {
              setAuth({ ...auth, access: newAuth.access })
              axios.defaults.headers.common['Authorization'] = 'Bearer ' + newAuth.access
              processQueue(null, newAuth.access)
              originalRequest.headers['Authorization'] = 'Bearer ' + newAuth.access
              return axios(originalRequest)
            } else {
              processQueue(new Error('Refresh token failed'), null)
              removeAuth()
              window.location.href = '/auth/login'
              return Promise.reject(error)
            }
          } catch (refreshError) {
            processQueue(refreshError, null)
            removeAuth()
            window.location.href = '/auth/login'
            return Promise.reject(refreshError)
          } finally {
            isRefreshing = false
          }
        } else {
          removeAuth()
          window.location.href = '/auth/login'
          return Promise.reject(error)
        }
      }

      // Toast pour toute autre erreur
      const message = error.response?.data?.message || error.message
      toast.error(message, {
        description: error.response?.data?.description || '',
      })

      return Promise.reject(error)
    }
  )
}