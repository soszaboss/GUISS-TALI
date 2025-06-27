import type { ID, Response, PaginationResponse } from "@/types/_models"
import type { HealthRecord, DriverExperience, Antecedent } from "@/types/medicalRecord"
import type { AxiosResponse } from "axios"
import axios from "axios"

const API_URL = import.meta.env.VITE_APP_API_URL
const MEDICAL_RECORD_URL = `${API_URL}/health-records/`
const DRIVER_EXPERIENCE_URL = `${MEDICAL_RECORD_URL}driver-experiences/`
const ANTECEDENT_URL = `${MEDICAL_RECORD_URL}antecedents/`


const createAntecedent = (data: Antecedent) => {
  return axios.post(`${ANTECEDENT_URL}create/`, data).then(res => res.data)
}

const updateAntecedent = (data: Antecedent) => {
  return axios.patch(`${ANTECEDENT_URL}${data.id}/`, data).then(res => res.data)
}

const createDriverExperience = (data: DriverExperience) => {
  return axios.post(`${DRIVER_EXPERIENCE_URL}create/`, data).then(res => res.data)
}

const updateDriverExperience = (data: DriverExperience) => {
  return axios.patch(`${DRIVER_EXPERIENCE_URL}${data.id}/`, data).then(res => res.data)
}

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
const getMedicalRecordByPatientId = (id: ID): Promise<HealthRecord | undefined> => {
  return axios
    .get(`${MEDICAL_RECORD_URL}patient/${id}/`)
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

const syncHealthRecord = (
  patientId: number,
  visite: number
): Promise<HealthRecord | undefined> => {
  return axios
    .get(`${MEDICAL_RECORD_URL}visite/${visite}/patient/${patientId}/`)
    .then((response: AxiosResponse<HealthRecord | undefined>) => response.data)
}

const setRiskyPatient = (patientId: ID, isRisky: boolean): Promise<void> => {
  return axios.post(`${MEDICAL_RECORD_URL}set-risky-patient/`, {
    patient_id: patientId,
    risky_patient: isRisky
  }).then(() => {});
}

export {
  getMedicalRecords,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  deleteSelectedMedicalRecords,
  getMedicalRecordByPatientId,
  createDriverExperience,
  updateDriverExperience,
  createAntecedent,
  updateAntecedent,
  syncHealthRecord,
  setRiskyPatient
}