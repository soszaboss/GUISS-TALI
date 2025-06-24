
import type { AuthModel } from "@/types/authModels";
import axios, { type AxiosResponse } from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const LOGIN_URL = `${API_URL}/auth/login/`;
export const REQUEST_PASSWORD_URL = `${API_URL}/auth/password/reset/`;

// Server should return AuthModel
export function login(email: string, password: string):Promise<AuthModel | undefined> {
  return axios.post<AuthModel>(LOGIN_URL, {
    email,
    password,
  }).then((response: AxiosResponse<AuthModel>) => response.data);
}

// Server should return AuthModel
// export function register(
//   email: string,
//   phone_number: string,
//   roles: string
// ) {
//   return axios.post(REGISTER_URL, {
//     email,
//     phone_number: phone_number,
//     roles: roles
//   });
// }



export function refreshToken(refresh: string): Promise<AuthModel | undefined> {
  return axios.post<AuthModel>(`${API_URL}/auth/token/refresh/`, {
    refresh: refresh,
  }).then((response: AxiosResponse<AuthModel>) => response.data);
}

export function blacklistToken(refresh: string): Promise<void> {
  return axios.post(`${API_URL}/auth/token/blacklist/`, {
    refresh: refresh,
  }).then(() => {});
}

export function resetPassword(email: string): Promise<void> {
  return axios.post(REQUEST_PASSWORD_URL, {
    email: email,
  }).then(() => {});
}

export function verifyTwoFactorCode(code:string): Promise<void> {
  return axios.get(`${API_URL}/auth/password/reset/verify/`, {
    params: {
      code: code,
    },
  }).then(() => {});
}

export function resetPasswordWithCode(code: string, password: string): Promise<void> {
  return axios.post(`${API_URL}/auth/password/reset/verified/`, {
    code: code,
    password: password,
  }).then(() => {});
}
