import type { ID } from "./_models"

export interface AuthModel {
  api_token: string
  refreshToken?: string
}


export interface ProfileModel {
    id: ID
    user: ID
    first_name?: string
    last_name?: string
    avatar?: string
    birthday?: string
    gender?: string
    address?: string
    city?: string
    zip?: string
}

export interface UserPostModel {
  id: ID
  email?: string
  phone_number?: string
  role?: string
}

export interface UserGetModel extends UserPostModel {
  profile?: string
  created?: string
  modified?: string
  last_login?: string
}