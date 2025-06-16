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

export interface Antecedent {
  id: ID
  antecedents_medico_chirurgicaux: string
  pathologie_ophtalmologique: string
  addiction: boolean
  type_addiction: "tabagisme" | "alcool" | "telephone" | "other" | "" | null
  autre_addiction_detail: string
  tabagisme_detail: string
  familial: "cecité" | "gpao" | "other" | "" | null
  autre_familial_detail: string
  patient: number
}

export const initialAntecedent: Antecedent = {
  id: 0,
  antecedents_medico_chirurgicaux: "",
  pathologie_ophtalmologique: "",
  addiction: false,
  type_addiction: "",
  autre_addiction_detail: "",
  tabagisme_detail: "",
  familial: "",
  autre_familial_detail: "",
  patient: 0,
}

export interface DriverExperience {
  id: ID
  visite: number
  km_parcourus: number | null
  nombre_accidents: number
  tranche_horaire: string | null
  dommage: "corporel" | "materiel" | "" | null
  degat: "important" | "modéré" | "léger" | "" | null
  date_visite: string | null
  patient: number
}

export const initialDriverExperience: DriverExperience = {
  id: 0,
  visite: 0,
  km_parcourus: null,
  nombre_accidents: 0,
  tranche_horaire: "",
  dommage: "",
  degat: "",
  date_visite: "",
  patient: 0,
}

export interface HealthRecord {
  id: ID
  antecedant: Antecedent
  driver_experience: DriverExperience
  examens: Examens[]
  risky_patient: boolean
  patient: number
}

export const initialHealthRecord: HealthRecord = {
  id: 0,
  antecedant: initialAntecedent,
  driver_experience: initialDriverExperience,
  examens: [],
  risky_patient: false,
  patient: 0,
}