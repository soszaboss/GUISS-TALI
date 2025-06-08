import type { ID, Response } from "@/types/_models";
import type { Conducteur, Vehicule } from "@/types/patientsModels";
import type { AxiosResponse } from "axios";
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const CONDUCTEUR_URL = `${API_URL}/conducteur`;
const GET_CONDUCTEURS_URL = `${API_URL}/conducteurs/query`;
const VEHICULE_URL = `${API_URL}/vehicule`;
const GET_VEHICULES_URL = `${API_URL}/vehicules/query`;

// Conducteurs
export const getConducteurs = (query: string): Promise<Response<Conducteur[]>> => {
  return axios
    .get(`${GET_CONDUCTEURS_URL}?${query}`)
    .then((d: AxiosResponse<Response<Conducteur[]>>) => d.data);
};

export const getConducteurById = (id: ID): Promise<Conducteur | undefined> => {
  return axios
    .get(`${CONDUCTEUR_URL}/${id}`)
    .then((response: AxiosResponse<Response<Conducteur>>) => response.data)
    .then((response: Response<Conducteur>) => response.data);
};

export const createConducteur = (conducteur: Conducteur): Promise<Conducteur | undefined> => {
  return axios
    .put(CONDUCTEUR_URL, conducteur)
    .then((response: AxiosResponse<Response<Conducteur>>) => response.data)
    .then((response: Response<Conducteur>) => response.data);
};

export const updateConducteur = (conducteur: Conducteur): Promise<Conducteur | undefined> => {
  return axios
    .post(`${CONDUCTEUR_URL}/${conducteur.id}`, conducteur)
    .then((response: AxiosResponse<Response<Conducteur>>) => response.data)
    .then((response: Response<Conducteur>) => response.data);
};

export const deleteConducteur = (id: ID): Promise<void> => {
  return axios.delete(`${CONDUCTEUR_URL}/${id}`).then(() => {});
};

export const deleteSelectedConducteurs = (ids: Array<ID>): Promise<void> => {
  const requests = ids.map((id) => axios.delete(`${CONDUCTEUR_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

// Vehicules
export const getVehicules = (query: string): Promise<Response<Vehicule[]>> => {
  return axios
    .get(`${GET_VEHICULES_URL}?${query}`)
    .then((d: AxiosResponse<Response<Vehicule[]>>) => d.data);
};

export const getVehiculeById = (id: ID): Promise<Vehicule | undefined> => {
  return axios
    .get(`${VEHICULE_URL}/${id}`)
    .then((response: AxiosResponse<Response<Vehicule>>) => response.data)
    .then((response: Response<Vehicule>) => response.data);
};

export const createVehicule = (vehicule: Vehicule): Promise<Vehicule | undefined> => {
  return axios
    .put(VEHICULE_URL, vehicule)
    .then((response: AxiosResponse<Response<Vehicule>>) => response.data)
    .then((response: Response<Vehicule>) => response.data);
};

export const updateVehicule = (vehicule: Vehicule): Promise<Vehicule | undefined> => {
  return axios
    .post(`${VEHICULE_URL}/${vehicule.id}`, vehicule)
    .then((response: AxiosResponse<Response<Vehicule>>) => response.data)
    .then((response: Response<Vehicule>) => response.data);
};

export const deleteVehicule = (id: ID): Promise<void> => {
  return axios.delete(`${VEHICULE_URL}/${id}`).then(() => {});
};

export const deleteSelectedVehicules = (ids: Array<ID>): Promise<void> => {
  const requests = ids.map((id) => axios.delete(`${VEHICULE_URL}/${id}`));
  return axios.all(requests).then(() => {});
};