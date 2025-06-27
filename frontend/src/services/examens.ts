import type { ID } from "@/types/_models"
import type { Examens } from "@/types/examens"
import type { AxiosResponse } from "axios"
import axios from "axios"

const API_URL = import.meta.env.VITE_APP_API_URL
const EXAMENS_URL = `${API_URL}/examens/`

// Récupérer la liste des examens (optionnel, avec query string)
const getExamens = (query = ""): Promise<Examens[]> => {
  return axios
    .get(`${EXAMENS_URL}${query ? `?${query}` : ""}`)
    .then((res: AxiosResponse<Examens[]>) => res.data)
}

// Récupérer un examen par ID
const getExamenById = (id: ID): Promise<Examens | undefined> => {
  return axios
    .get(`${EXAMENS_URL}${id}/`)
    .then((res: AxiosResponse<Examens | undefined>) => res.data)
}

// Créer un examen
const createExamen = (exam: Partial<Examens>): Promise<Examens | undefined> => {
  return axios
    .post(`${EXAMENS_URL}`, exam)
    .then((res: AxiosResponse<Examens | undefined>) => res.data)
}

// Mettre à jour un examen
const updateExamen = (exam: Examens): Promise<Examens | undefined> => {
  return axios
    .put(`${EXAMENS_URL}${exam.id}/`, exam)
    .then((res: AxiosResponse<Examens | undefined>) => res.data)
}

// Supprimer un examen par ID
const deleteExamen = (id: ID): Promise<number> => {
  return axios.delete(`${EXAMENS_URL}${id}/`).then(res => res.status)
}

// Supprimer plusieurs examens (optionnel)
const deleteSelectedExamens = (ids: Array<ID>): Promise<void> => {
  const requests = ids.map((id) => axios.delete(`${EXAMENS_URL}${id}/`))
  return axios.all(requests).then(() => {})
}

export {
  getExamens,
  getExamenById,
  createExamen,
  updateExamen,
  deleteExamen,
  deleteSelectedExamens,
}