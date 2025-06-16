import type { ID, Response, PaginationResponse } from "@/types/_models"
import type { HealthRecord } from "@/types/medicalRecord"
import type { AxiosResponse } from "axios"
import axios from "axios"

const API_URL = import.meta.env.VITE_APP_API_URL
const MEDICAL_RECORD_URL = `${API_URL}/medical-records/`

const getMedicalRecords = (query: string): Promise<PaginationResponse<HealthRecord>> => {
  return axios
    .get(`${MEDICAL_RECORD_URL}?${query}`)
    .then((d: AxiosResponse<PaginationResponse<HealthRecord>>) => d.data)
}

const getMedicalRecordById = (id: ID): Promise<HealthRecord | undefined> => {
  return axios
    .get(`${MEDICAL_RECORD_URL}${id}/`)
    .then((response: AxiosResponse<HealthRecord | undefined>) => response.data)
}

const createMedicalRecord = (record: HealthRecord): Promise<HealthRecord | undefined> => {
  return axios
    .post(`${MEDICAL_RECORD_URL}`, record)
    .then((response: AxiosResponse<HealthRecord | undefined>) => response.data)
}

const updateMedicalRecord = (record: HealthRecord): Promise<HealthRecord | undefined> => {
  return axios
    .patch(`${MEDICAL_RECORD_URL}${record.id}/`, record)
    .then((response: AxiosResponse<Response<HealthRecord>>) => response.data)
    .then((response: Response<HealthRecord>) => response.data)
}

const deleteMedicalRecord = (recordId: ID): Promise<number> => {
  return axios.delete(`${MEDICAL_RECORD_URL}${recordId}/`).then(res => res.status)
}

const deleteSelectedMedicalRecords = (recordIds: Array<ID>): Promise<void> => {
  const requests = recordIds.map((id) => axios.delete(`${MEDICAL_RECORD_URL}${id}/`))
  return axios.all(requests).then(() => {})
}

export {
  getMedicalRecords,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  deleteSelectedMedicalRecords,
}