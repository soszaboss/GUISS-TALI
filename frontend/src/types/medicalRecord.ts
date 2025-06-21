import type { ID } from "./_models"
import type { Examens } from "./examens"
import {type Conducteur } from "./patientsModels"


export interface Antecedent {
  id: ID
  antecedents_medico_chirurgicaux: string
  pathologie_ophtalmologique: string
  addiction: boolean
  type_addiction: "TABAGISME" | "ALCOOL" | "TELEPHONE" | "OTHER"
  autre_addiction_detail: string
  tabagisme_detail: string
  familial: "CECITÉ" | "GPAO" | "OTHER"
  autre_familial_detail: string
  patient?: ID
}

export type DriverExperience = {
  id?: ID
  patient?: ID
  visite: number
  km_parcourus: number
  nombre_accidents: number
  tranche_horaire: string
  dommage: "CORPOREL" | "MATERIEL"
  degat: "IMPORTANT" | "MODÉRÉ" | "LÉGER"
  date_visite?: string
}

// export const initialAntecedent: Antecedent = {
//   id: 0,
//   antecedents_medico_chirurgicaux: "",
//   pathologie_ophtalmologique: "",
//   addiction: false,
//   type_addiction: "",
//   autre_addiction_detail: "",
//   tabagisme_detail: "",
//   familial: "",
//   autre_familial_detail: "",
//   patient: 0,
// }


// export const initialDriverExperience: DriverExperience = {
//   id: 0,
//   visite: 0,
//   km_parcourus: null,
//   nombre_accidents: 0,
//   tranche_horaire: "",
//   dommage: "",
//   degat: "",
//   date_visite: "",
//   patient: 0,
// }

export interface HealthRecord {
  id: ID
  antecedant: Antecedent
  driver_experience: DriverExperience[]
  examens: Examens[]
  risky_patient: boolean
  patient: Conducteur
}

// export const initialHealthRecord: HealthRecord = {
//   id: 0,
//   antecedant: initialAntecedent,
//   driver_experience: [],
//   examens: [],
//   risky_patient: false,
//   patient: initConducteur,
// }