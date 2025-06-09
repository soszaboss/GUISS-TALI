import type { PaginationResponse } from "@/types/_models";
import type { Conducteur } from "@/types/patientsModels";
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;
const PATIENTS_URL = `${API_URL}/patients/`;

const getPatients = (query: string): Promise<PaginationResponse<Conducteur>> => {
  return axios.get(`${PATIENTS_URL}?${query}`).then(res => res.data);
};

const getPatientById = (id: string): Promise<Conducteur | undefined> => {
  return axios.get(`${PATIENTS_URL}${id}/`).then(res => res.data);
};

const createPatient = (patient: Conducteur): Promise<Conducteur | undefined> => {
  return axios.post(`${PATIENTS_URL}create/`, patient).then(res => res.data);
};

const updatePatient = (patient: Conducteur): Promise<Conducteur | undefined> => {
  return axios.patch(`${PATIENTS_URL}${patient.id}/update/`, patient).then(res => res.data);
};

const deletePatient = (id: string): Promise<number> => {
  return axios.delete(`${PATIENTS_URL}${id}/delete/`).then(res => res.status);
};

export {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};