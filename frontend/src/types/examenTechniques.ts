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
  id?: ID
  visual_acuity?: VisualAcuity
  refraction?: Refraction
  ocular_tension?: OcularTension
  pachymetry?: Pachymetry
  visite?: number
  is_completed?: boolean
  patient?: number
}

export const initialTechnicalExamen: TechnicalExamen = {
  id: null,
  visual_acuity: {
    id: null,
    avsc_od: 0,
    avsc_og: 0,
    avsc_dg: 0,
    avac_od: 0,
    avac_og: 0,
    avac_dg: 0,
    created: "",
    modified: "",
  },
  refraction: {
    id: null,
    od_s: 0,
    og_s: 0,
    od_c: 0,
    og_c: 0,
    od_a: 0,
    og_a: 0,
    dp: 0,
    created: "",
    modified: "",
  },
  ocular_tension: {
    id: null,
    od: 0,
    og: 0,
    ttt_hypotonisant: false,
    ttt_hypotonisant_value: "",
    created: "",
    modified: "",
  },
  pachymetry: {
    id: null,
    od: 0,
    og: 0,
    created: "",
    modified: "",
  },
  visite: 1,
  is_completed: false,
  patient: 0,
}