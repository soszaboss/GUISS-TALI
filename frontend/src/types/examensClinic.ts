import type { ID } from "./_models"

export interface Conclusion {
  id: ID
  vision: "compatible" | "incompatible" | "a_risque" | null
  cat: string | null
  traitement: string | null
  observation: string | null
  rv: boolean
  created?: string
  modified?: string
}

export interface Perimetry {
  id: ID
  pbo: string
  limite_superieure: number
  limite_inferieure: number
  limite_temporale_droit: number
  limite_temporale_gauche: number
  limite_horizontal: number
  score_esternmen: number
  image?: string
  images?: string
  created?: string
  modified?: string
}

export interface BpSuP {
  id: ID
  retinographie?: string
  oct?: string
  autres?: string
  created?: string
  modified?: string
}

export interface Plaintes {
  id: ID
  created?: string
  modified?: string
  eye_symptom: string
  diplopie: boolean
  diplopie_type?: string | null
  strabisme: boolean
  strabisme_eye?: string | null
  nystagmus: boolean
  nystagmus_eye?: string | null
  ptosis: boolean
  ptosis_eye?: string | null
}

export interface BpSgAnterieur {
  id: ID
  created?: string
  modified?: string
  segment: string
  cornee: string
  profondeur: string
  transparence: string
  type_anomalie_value?: string
  quantite_anomalie?: string
  pupille: string
  axe_visuel: string
  rpm: string
  iris: string
  cristallin: string
  position_cristallin: string
}

export interface BpSgPosterieur {
  id: ID
  created?: string
  modified?: string
  segment: string
  vitre: string
  retine: number
  papille: string
  macula: string
  retinien_peripherique: string
  vaissaux: string
}

export interface EyeSide {
  id: ID
  plaintes: Plaintes
  bp_sg_anterieur: BpSgAnterieur
  bp_sg_posterieur: BpSgPosterieur
  created?: string
  modified?: string
}

export interface ClinicalExamen {
  id?: ID
  conclusion: Conclusion
  perimetry: Perimetry
  bp_sup: BpSuP
  og: EyeSide
  od: EyeSide
  visite: number
  is_completed: boolean
  patient: ID
  created?: string
  modified?: string
}

// export const initialClinicalExamen: ClinicalExamen = {
//   id: null,
//   conclusion: {
//     id: null,
//     vision: null,
//     cat: "",
//     traitement: "",
//     observation: "",
//     rv: false,
//     created: "",
//     modified: "",
//   },
//   perimetry: {
//     id: null,
//     pbo: null,
//     limite_superieure: null,
//     limite_inferieure: null,
//     limite_temporale_droit: null,
//     limite_temporale_gauche: null,
//     limite_horizontal: null,
//     score_esternmen: null,
//     image: "",
//     images: "",
//     created: "",
//     modified: "",
//   },
//   bp_sup: {
//     id: null,
//     retinographie: "",
//     oct: "",
//     autres: "",
//     created: "",
//     modified: "",
//   },
//   og: {
//     id: null,
//     plaintes: {
//       id: null,
//       created: "",
//       modified: "",
//       eye_symptom: "",
//       diplopie: false,
//       diplopie_type: "",
//       strabisme: false,
//       strabisme_eye: "",
//       nystagmus: false,
//       nystagmus_eye: "",
//       ptosis: false,
//       ptosis_eye: "",
//     },
//     bp_sg_anterieur: {
//       id: null,
//       created: "",
//       modified: "",
//       segment: "",
//       cornee: "",
//       profondeur: "",
//       transparence: "",
//       type_anomalie_value: "",
//       quantite_anomalie: "",
//       pupille: "",
//       axe_visuel: "",
//       rpm: "",
//       iris: "",
//       cristallin: "",
//       position_cristallin: "",
//     },
//     bp_sg_posterieur: {
//       id: null,
//       created: "",
//       modified: "",
//       segment: "",
//       vitre: "",
//       retine: 0,
//       papille: "",
//       macula: "",
//       retinien_peripherique: "",
//       vaissaux: "",
//     },
//     created: "",
//     modified: "",
//   },
//   od: {
//     id: null,
//     plaintes: {
//       id: null,
//       created: "",
//       modified: "",
//       eye_symptom: "",
//       diplopie: false,
//       diplopie_type: "",
//       strabisme: false,
//       strabisme_eye: "",
//       nystagmus: false,
//       nystagmus_eye: "",
//       ptosis: false,
//       ptosis_eye: "",
//     },
//     bp_sg_anterieur: {
//       id: null,
//       created: "",
//       modified: "",
//       segment: "",
//       cornee: "",
//       profondeur: "",
//       transparence: "",
//       type_anomalie_value: "",
//       quantite_anomalie: "",
//       pupille: "",
//       axe_visuel: "",
//       rpm: "",
//       iris: "",
//       cristallin: "",
//       position_cristallin: "",
//     },
//     bp_sg_posterieur: {
//       id: null,
//       created: "",
//       modified: "",
//       segment: "",
//       vitre: "",
//       retine: 0,
//       papille: "",
//       macula: "",
//       retinien_peripherique: "",
//       vaissaux: "",
//     },
//     created: "",
//     modified: "",
//   },
//   visite: 1,
//   is_completed: false,
//   patient: null,
//   created: "",
//   modified: "",
// }