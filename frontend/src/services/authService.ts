
import type { AuthModel } from "@/types/authModels";
import axios, { type AxiosResponse } from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const LOGIN_URL = `${API_URL}/auth/login/`;
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`;

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

// Server should return object => { result: boolean } (Is Email in DB)
// export function requestPassword(email: string) {
//   return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
//     email,
//   });
// }


export function refreshToken(refresh: string): Promise<AuthModel | undefined> {
  return axios.post<AuthModel>(`${API_URL}/api/token/refresh/`, {
    refresh: refresh,
  }).then((response: AxiosResponse<AuthModel>) => response.data);
}

export function blacklistToken(refresh: string): Promise<void> {
  return axios.post(`${API_URL}/auth/logout/`, {
    refresh: refresh,
  }).then(() => {});
}
