import type { ID, Response, PaginationResponse } from "@/types/_models";
import type { User } from "@/types/userModels";
import type { AxiosResponse } from "axios";
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;
const USER_URL = `${API_URL}/users/`;
export const GET_USER_BY_ACCESSTOKEN_URL = '/users/me/';

const getUsers = (query: string): Promise<PaginationResponse<User>> => {
  return axios
    .get(`${USER_URL}?${query}`)
    .then((d: AxiosResponse<PaginationResponse<User>>) => {
      return d.data
    });
};

const getUserById = (id: ID): Promise<User | undefined> => {
  return axios
    .get(`${USER_URL}${id}/`)
    .then((response: AxiosResponse<User | undefined>) => {
      return response.data;
    });
};

const createUser = (user: User): Promise<User | undefined> => {
  return axios
    .post(`${USER_URL}create/`, user)
    .then()
};

const updateUser = (user: User): Promise<User | undefined> => {
  return axios
    .patch(`${USER_URL}${user.id}/update/`, user)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data);
};

const deleteUser = (userId: ID): Promise<number> => {
  return axios.delete(`${USER_URL}${userId}/delete/`).then(res => res.status);
};

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${USER_URL}${id}`));
  return axios.all(requests).then(() => {});
};

function getUserByToken(): Promise<AxiosResponse<User>> {
  return axios.get<User>(GET_USER_BY_ACCESSTOKEN_URL);
}
export {
  getUsers,
  deleteUser,
  deleteSelectedUsers,
  getUserById,
  createUser,
  updateUser,
  getUserByToken
};
