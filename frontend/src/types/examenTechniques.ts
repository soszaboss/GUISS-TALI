import type { ID } from "./_models"

export interface VisualAcuity {
  id?: ID
  avsc_od?: number
  avsc_og?: number
  avsc_odg?: number
  avac_od?: number
  avac_og?: number
  avac_odg?: number
  created?: string
  modified?: string
}

export interface Refraction {
  id?: ID
  correction_optique?: boolean
  od_s?: number | null
  og_s?: number | null
  od_c?: number | null
  og_c?: number | null
  od_a?: number | null
  og_a?: number | null
  avog?: number | null
  avod?: number | null
  // dp?: number | null
  created?: string
  modified?: string
}

export interface OcularTension {
  id?: ID
  od?: number | null
  og?: number | null
  ttt_hypotonisant?: boolean | null
  ttt_hypotonisant_value?: string | null
  created?: string
  modified?: string
}

export interface Pachymetry {
  id?: ID
  od?: number
  og?: number
  cto_od?: number
  cto_og?: number
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
  patient?: ID
  created?: string
  modified?: string
}

export const initialVisualAcuity: VisualAcuity = {
  id: undefined,
  avsc_od: undefined,
  avsc_og: undefined,
  avsc_odg: undefined,
  avac_od: undefined,
  avac_og: undefined,
  avac_odg: undefined,
  created: undefined,
  modified: undefined,
}

export const initialRefraction: Refraction = {
  id: undefined,
  correction_optique: false,
  od_s: null,
  og_s: null,
  od_c: null,
  og_c: null,
  od_a: null,
  og_a: null,
  avog: null,
  avod: null,
  // dp: null,
  created: undefined,
  modified: undefined,
}

export const initialOcularTension: OcularTension = {
  id: undefined,
  od: null,
  og: null,
  ttt_hypotonisant: null,
  ttt_hypotonisant_value: null,
  created: undefined,
  modified: undefined,
}

export const initialPachymetry: Pachymetry = {
  id: undefined,
  od: undefined,
  og: undefined,
  cto_od: undefined,
  cto_og: undefined,
  created: undefined,
  modified: undefined,
}

export const initialTechnicalExamen: TechnicalExamen = {
  id: undefined,
  visual_acuity: undefined,
  refraction: undefined,
  ocular_tension: undefined,
  pachymetry: undefined,
  visite: undefined,
  is_completed: false,
  patient: null,
  created: undefined,
  modified: undefined,
}