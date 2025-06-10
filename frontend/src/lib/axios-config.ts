import { getAuth } from '@/helpers/crud-helper/AuthHelpers';
import Axios, { type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_APP_API_URL;

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
    // config.withCredentials = true;
    const auth = getAuth()
    if (auth && auth.access) {
        config.headers.Authorization = `Bearer ${auth.access}`
    }
    if (config.headers) {
    config.headers.Accept = 'application/json';
    }
  return config;
}

export function setupAxios(axios: typeof Axios) {
  axios.defaults.baseURL = API_URL;
  axios.interceptors.request.use(authRequestInterceptor);
  axios.interceptors.response.use(
  (response) => {
  return response;
},
(error) => {
  const message = error.response?.data?.message || error.message;
  toast.error(message, {
    description: error.response?.data?.description || '',
  });

  if (
    error.response?.status === 401 &&
    !window.location.pathname.startsWith('/auth/login')
  ) {
    const searchParams = new URLSearchParams(window.location.search);
    const redirectTo = searchParams.get('redirectTo') || window.location.pathname;
    window.location.href = `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`;
    }

    return Promise.reject(error);
  },
)}

