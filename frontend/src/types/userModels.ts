import type { ID } from "./_models"
import type { Response } from "./_models"

export type UserRole = 'admin' |'employee'  | 'doctor' | 'technician';

export type Gender = 1 | 2;

export interface Profile {
  id?: ID;
  user?: ID; // user id
  first_name?: string | null;
  last_name?: string | null;
  avatar?: string | null;
  birthday?: string | null;
  gender?: Gender | null;
  address?: string | null;
  city?: string | null;
  zip?: string | null;
  created?: string; // ISO date string
  modified?: string; // ISO date string
}

export interface User {
  id?: ID;
  email?: string;
  phone_number?: string;
  role?: UserRole;
  is_staff?: boolean;
  is_active?: boolean;
  is_verified?: boolean;
  profile?: Profile;
  last_login?: string;
  created?: string; // ISO date string
  modified?: string; // ISO date string
}

export type UsersQueryResponse = Response<Array<User>>

export const initProfile: Profile = {
  id: null,
  user: null,
  first_name: null,
  last_name: null,
  avatar: null,
  birthday: null,
  gender: 1,
  address: null,
  city: null,
  zip: null,
  created: '',
  modified: '',
};

export const initUser: User = {
  id: null,
  email: '',
  phone_number: '',
  role: 'employee', // Default role
  is_staff: false,
  is_active: true,
  is_verified: true,
  profile: initProfile,
  created: '',
  modified: '',
};