import type { ID } from "./_models"

export interface VisualAcuity {
  id: ID
  avsc_od?: number
  avsc_og?: number
  avsc_dg?: number
  avac_od?: number
  avac_og?: number
  avac_dg?: number
  created?: string
  modified?: string
}

export interface Refraction {
  id?: ID
  od_s?: number
  og_s?: number
  od_c?: number
  og_c?: number
  od_a?: number
  og_a?: number
  dp?: number
  created?: string
  modified?: string
}

export interface OcularTension {
  id?: ID
  od?: number
  og?: number
  ttt_hypotonisant?: boolean
  ttt_hypotonisant_value?: string | null
  created?: string
  modified?: string
}

export interface Pachymetry {
  id?: ID
  od?: number
  og?: number
  created?: string
  modified?: string
}

export interface TechnicalExamen {
  id: ID
  visual_acuity: VisualAcuity
  refraction: Refraction
  ocular_tension: OcularTension
  pachymetry: Pachymetry
  visite: number
  is_completed: boolean
  patient: number
}

export const initTechnicalData = {
  visual_acuity: {
    avsc_od: "",
    avsc_og: "",
    avsc_odg: "",
    avac_od: "",
    avac_og: "",
    avac_odg: "",
  },
  refraction: {
    od_s: "",
    og_s: "",
    od_c: "",
    og_c: "",
    od_a: "",
    og_a: "",
    dp: "",
  },
  ocular_tension: {
    od: "",
    og: "",
    ttt_hypotonisant: false,
    ttt_hypotonisant_value: "",
  },
  pachymetry: {
    od: "",
    og: "",
  },
  // PAS de id ici !
  visite: undefined,
  is_completed: false,
  patient: undefined,
}