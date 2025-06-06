import type { AuthModel,  } from "@/modules/auth";
import type { UserGetModel } from "@/types/userModels";
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`;
export const LOGIN_URL = `${API_URL}/login`;
export const REGISTER_URL = `${API_URL}/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`;

// Server should return AuthModel
export function login(email: string, password: string) {
  return axios.post<AuthModel>(LOGIN_URL, {
    email,
    password,
  });
}

// Server should return AuthModel
export function register(
  email: string,
  phone_number: string,
  roles: string
) {
  return axios.post(REGISTER_URL, {
    email,
    phone_number: phone_number,
    roles: roles
  });
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
    email,
  });
}

export function getUserByToken(token: string) {
  return axios.post<UserGetModel>(GET_USER_BY_ACCESSTOKEN_URL, {
    api_token: token,
  });
}
