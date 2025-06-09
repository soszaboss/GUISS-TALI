import type { ID, PaginationResponse } from "@/types/_models";
import type { Vehicule } from "@/types/patientsModels";
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;
const VEHICULES_URL = `${API_URL}/patients/vehicules/`;

const getVehicules = (query: string): Promise<PaginationResponse<Vehicule>> => {
  return axios.get(`${VEHICULES_URL}?${query}`).then(res => res.data);
};

const getVehiculeById = (id: ID): Promise<Vehicule | undefined> => {
  return axios.get(`${VEHICULES_URL}${id}/`).then(res => res.data);
};

const createVehicule = (vehicule: Vehicule): Promise<Vehicule | undefined> => {
  return axios.post(`${VEHICULES_URL}create/`, vehicule).then(res => res.data);
};

const updateVehicule = (vehicule: Vehicule): Promise<Vehicule | undefined> => {
  return axios.patch(`${VEHICULES_URL}${vehicule.id}/update/`, vehicule).then(res => res.data);
};

const deleteVehicule = (id: ID): Promise<number> => {
  return axios.delete(`${VEHICULES_URL}${id}/delete/`).then(res => res.status);
};

export {
  getVehicules,
  getVehiculeById,
  createVehicule,
  updateVehicule,
  deleteVehicule,
};