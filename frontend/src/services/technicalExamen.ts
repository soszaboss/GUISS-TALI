import type { ID, Response, PaginationResponse } from "@/types/_models"
import type { TechnicalExamen } from "@/types/examenTechniques"
import type { AxiosResponse } from "axios"
import axios from "axios"

const API_URL = import.meta.env.VITE_APP_API_URL
const TECHNICAL_EXAM_URL = `${API_URL}/technical-exams/`

const getTechnicalExams = (query: string): Promise<PaginationResponse<TechnicalExamen>> => {
  return axios
    .get(`${TECHNICAL_EXAM_URL}?${query}`)
    .then((d: AxiosResponse<PaginationResponse<TechnicalExamen>>) => d.data)
}

const getTechnicalExamById = (id: ID): Promise<TechnicalExamen | undefined> => {
  return axios
    .get(`${TECHNICAL_EXAM_URL}${id}/`)
    .then((response: AxiosResponse<TechnicalExamen | undefined>) => response.data)
}

const createTechnicalExam = (exam: TechnicalExamen): Promise<TechnicalExamen | undefined> => {
  return axios
    .post(`${TECHNICAL_EXAM_URL}`, exam)
    .then((response: AxiosResponse<TechnicalExamen | undefined>) => response.data)
}

const updateTechnicalExam = (exam: TechnicalExamen): Promise<TechnicalExamen | undefined> => {
  return axios
    .patch(`${TECHNICAL_EXAM_URL}${exam.id}/`, exam)
    .then((response: AxiosResponse<Response<TechnicalExamen>>) => response.data)
    .then((response: Response<TechnicalExamen>) => response.data)
}

const deleteTechnicalExam = (examId: ID): Promise<number> => {
  return axios.delete(`${TECHNICAL_EXAM_URL}${examId}/`).then(res => res.status)
}

const deleteSelectedTechnicalExams = (examIds: Array<ID>): Promise<void> => {
  const requests = examIds.map((id) => axios.delete(`${TECHNICAL_EXAM_URL}${id}/`))
  return axios.all(requests).then(() => {})
}

export {
  getTechnicalExams,
  getTechnicalExamById,
  createTechnicalExam,
  updateTechnicalExam,
  deleteTechnicalExam,
  deleteSelectedTechnicalExams,
}