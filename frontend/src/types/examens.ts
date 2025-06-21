import type { ID } from "./_models"
import type { ClinicalExamen } from "./examensClinic"
import type { TechnicalExamen } from "./examenTechniques"

export interface Examens {
  id: ID
  technical_examen?: TechnicalExamen
  clinical_examen?: ClinicalExamen
  patient?: number
  visite?: number
  is_completed?: boolean
}

export const initialExamens: Examens = {
  id: 0,
  technical_examen: undefined,
  clinical_examen: undefined,
  patient: 0,
  visite: 0,
  is_completed: false,
}