import type { ID } from "./_models"

export interface Conclusion {
  id?: ID
  vision?: "compatible" | "incompatible" | "a_risque" | null
  cat?: string | null
  traitement?: string | null
  observation?: string | null
  rv?: boolean
  diagnostic_cim_10?: string | null
  created?: string
  modified?: string
}

export interface Perimetry {
  id?: ID
  pbo?: string | null
  limite_superieure?: number
  limite_inferieure?: number
  limite_temporale_droit?: number
  limite_temporale_gauche?: number
  limite_horizontal?: number
  score_esternmen?: number
  image?: string | null
  images?: string | null
  created?: string
  modified?: string
}

export interface BpSuP {
  id?: ID
  retinographie?: string | null
  oct?: string | null
  autres?: string | null
  created?: string
  modified?: string
}

export interface Plaintes {
  id?: ID
  created?: string
  modified?: string
  eye_symptom: string
  diplopie?: boolean
  diplopie_type?: string | null
  strabisme?: boolean
  strabisme_eye?: string | null
  nystagmus?: boolean
  nystagmus_eye?: string | null
  ptosis?: boolean
  ptosis_eye?: string | null
}

export interface BpSgAnterieur {
  id?: ID
  created?: string
  modified?: string
  segment?: string
  cornee?: string | null
  profondeur?: string | null
  transparence?: string | null
  type_anomalie_value?: string | null
  quantite_anomalie?: string | null
  pupille?: string | null
  axe_visuel?: string | null
  rpm?: string | null
  iris?: string | null
  cristallin?: string | null
  position_cristallin?: string | null
}

export interface BpSgPosterieur {
  id?: ID
  created?: string
  modified?: string
  segment?: string
  vitre?: string
  papille?: string
  macula?: string
  retinien_peripherique?: string
  vaissaux?: string
  cd_od?: number | null
  cd_og?: number | null
  observation?: string | null
}

export interface EyeSide {
  id?: ID
  plaintes?: Plaintes
  bp_sg_anterieur?: BpSgAnterieur
  bp_sg_posterieur?: BpSgPosterieur
  created?: string
  modified?: string
}

export interface ClinicalExamen {
  id?: ID
  conclusion?: Conclusion
  perimetry?: Perimetry
  bp_sup?: BpSuP
  og?: EyeSide
  od?: EyeSide
  visite?: number
  is_completed?: boolean
  patient?: ID
  created?: string
  modified?: string
}

export const initialConclusion: Conclusion = {
  id: undefined,
  vision: null,
  cat: null,
  traitement: null,
  observation: null,
  rv: false,
  diagnostic_cim_10: null,
  created: undefined,
  modified: undefined,
}

export const initialPerimetry: Perimetry = {
  id: undefined,
  pbo: null,
  limite_superieure: undefined,
  limite_inferieure: undefined,
  limite_temporale_droit: undefined,
  limite_temporale_gauche: undefined,
  limite_horizontal: undefined,
  score_esternmen: undefined,
  image: null,
  images: null,
  created: undefined,
  modified: undefined,
}

export const initialBpSuP: BpSuP = {
  id: undefined,
  retinographie: null,
  oct: null,
  autres: null,
  created: undefined,
  modified: undefined,
}

export const initialPlaintes: Plaintes = {
  id: undefined,
  created: undefined,
  modified: undefined,
  eye_symptom: "",
  diplopie: false,
  diplopie_type: null,
  strabisme: false,
  strabisme_eye: null,
  nystagmus: false,
  nystagmus_eye: null,
  ptosis: false,
  ptosis_eye: null,
}

export const initialBpSgAnterieur: BpSgAnterieur = {
  id: undefined,
  created: undefined,
  modified: undefined,
  segment: undefined,
  cornee: null,
  profondeur: null,
  transparence: null,
  type_anomalie_value: null,
  quantite_anomalie: null,
  pupille: null,
  axe_visuel: null,
  rpm: null,
  iris: null,
  cristallin: null,
  position_cristallin: null,
}

export const initialBpSgPosterieur: BpSgPosterieur = {
  id: undefined,
  created: undefined,
  modified: undefined,
  segment: undefined,
  vitre: undefined,
  papille: undefined,
  macula: undefined,
  retinien_peripherique: undefined,
  vaissaux: undefined,
  cd_od: null,
  cd_og: null,
  observation: null,
}

export const initialEyeSide: EyeSide = {
  id: undefined,
  plaintes: undefined,
  bp_sg_anterieur: undefined,
  bp_sg_posterieur: undefined,
  created: undefined,
  modified: undefined,
}

export const initialClinicalExamen: ClinicalExamen = {
  id: undefined,
  conclusion: undefined,
  perimetry: undefined,
  bp_sup: undefined,
  og: undefined,
  od: undefined,
  visite: undefined,
  is_completed: false,
  patient: undefined,
  created: undefined,
  modified: undefined,
}