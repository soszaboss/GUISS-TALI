import type { ID } from "./_models"
import type { Examens } from "./examens"
import type { Conducteur } from "./patientsModels"

// Types exacts pour les choix
export type AddictionType = "TABAGISME" | "ALCOOL" | "TELEPHONE" | "OTHER"
export type FamilialType = "CECITE" | "GPAO" | "GLAUCOME" | "OTHER"
export type DommageType =  "MODERE" | "IMPORTANT"
export type EtatConducteurType = "ACTIF" | "INACTIF" | "DECEDE" | "PERTE_DE_VUE"

export interface Antecedent {
  id?: ID
  antecedents_medico_chirurgicaux: string
  pathologie_ophtalmologique: string
  addiction: boolean
  type_addiction: AddictionType[]
  autre_addiction_detail?: string
  tabagisme_detail?: string
  familial: FamilialType[]
  autre_familial_detail?: string
  patient?: ID
}

export type DriverExperience = {
  id?: number | null
  patient?: ID
  visite?: number
  etat_conducteur: "ACTIF" | "INACTIF" | "DECEDE" | "PERTE_DE_VUE"
  deces_cause?: string | null
  inactif_cause?: string | null
  km_parcourus?: number | null
  nombre_accidents?: number | null
  tranche_horaire?: string | null
  corporel_dommage: boolean
  corporel_dommage_type?: "LEGER" | "MODERE" | "IMPORTANT" | null
  materiel_dommage: boolean
  materiel_dommage_type?: "LEGER" | "MODERE" | "IMPORTANT" | null
  date_visite?: string | null
  date_dernier_accident?: string | null
}

export interface HealthRecord {
  id: ID
  antecedant: Antecedent
  driver_experience: DriverExperience[]
  examens: Examens[]
  risky_patient: boolean
  patient: Conducteur
}

// Valeurs par défaut pour un antécédent
export const defaultAntecedentValues: Antecedent = {
  id: 0,
  antecedents_medico_chirurgicaux: '',
  pathologie_ophtalmologique: '',
  addiction: false,
  type_addiction: [],
  autre_addiction_detail: '',
  tabagisme_detail: '',
  familial: [],
  autre_familial_detail: '',
  patient: undefined,
}

// Valeurs par défaut pour une expérience de conduite
export const defaultDriverExperienceValues: DriverExperience = {
  id: null,
  patient: null,
  visite: undefined,
  etat_conducteur: "ACTIF",
  deces_cause: null,
  inactif_cause: null,
  km_parcourus: null,
  nombre_accidents: null,
  tranche_horaire: null,
  corporel_dommage: false,
  corporel_dommage_type: null,
  materiel_dommage: false,
  materiel_dommage_type: null,
  date_visite: undefined,
  date_dernier_accident: undefined,
}