import type { ID, Response, PaginationResponse } from "@/types/_models"
import type { ClinicalExamen } from "@/types/examensClinic"
import type { AxiosResponse } from "axios"
import axios from "axios"

const API_URL = import.meta.env.VITE_APP_API_URL
const CLINICAL_EXAM_URL = `${API_URL}/clinical-exams/`

const getClinicalExams = (query: string): Promise<PaginationResponse<ClinicalExamen>> => {
  return axios
    .get(`${CLINICAL_EXAM_URL}?${query}`)
    .then((d: AxiosResponse<PaginationResponse<ClinicalExamen>>) => d.data)
}

const getClinicalExamById = (id: ID): Promise<ClinicalExamen | undefined> => {
  return axios
    .get(`${CLINICAL_EXAM_URL}${id}/`)
    .then((response: AxiosResponse<ClinicalExamen | undefined>) => response.data)
}

const createClinicalExam = (exam: ClinicalExamen): Promise<ClinicalExamen | undefined> => {
  return axios
    .post(`${CLINICAL_EXAM_URL}`, exam)
    .then((response: AxiosResponse<ClinicalExamen | undefined>) => response.data)
}

const updateClinicalExam = (exam: ClinicalExamen): Promise<ClinicalExamen | undefined> => {
  return axios
    .patch(`${CLINICAL_EXAM_URL}${exam.id}/`, exam)
    .then((response: AxiosResponse<Response<ClinicalExamen>>) => response.data)
    .then((response: Response<ClinicalExamen>) => response.data)
}

const deleteClinicalExam = (examId: ID): Promise<number> => {
  return axios.delete(`${CLINICAL_EXAM_URL}${examId}/`).then(res => res.status)
}

const deleteSelectedClinicalExams = (examIds: Array<ID>): Promise<void> => {
  const requests = examIds.map((id) => axios.delete(`${CLINICAL_EXAM_URL}${id}/`))
  return axios.all(requests).then(() => {})
}

export {
  getClinicalExams,
  getClinicalExamById,
  createClinicalExam,
  updateClinicalExam,
  deleteClinicalExam,
  deleteSelectedClinicalExams,
}