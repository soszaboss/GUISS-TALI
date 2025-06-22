import type { ID } from "./_models"

export interface Conclusion {
  id: ID
  vision?: "compatible" | "incompatible" | "a_risque" | null
  cat?: string | null
  traitement?: string | null
  observation?: string | null
  rv?: boolean
  created?: string
  modified?: string
}

export interface Perimetry {
  id: ID
  pbo?: string
  limite_superieure?: number
  limite_inferieure?: number
  limite_temporale_droit?: number
  limite_temporale_gauche?: number
  limite_horizontal?: number
  score_esternmen?: number
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
  id: ID
  created?: string
  modified?: string
  segment?: string
  cornee?: string
  profondeur?: string
  transparence?: string
  type_anomalie_value?: string
  quantite_anomalie?: string
  pupille?: string
  axe_visuel?: string
  rpm?: string
  iris?: string
  cristallin?: string
  position_cristallin?: string
}

export interface BpSgPosterieur {
  id: ID
  created?: string
  modified?: string
  segment: string
  vitre?: string
  retine?: number
  papille?: string
  macula?: string
  retinien_peripherique?: string
  vaissaux?: string
}

export interface EyeSide {
  id: ID
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

export const defaultClinicalExamValues = {
  id: undefined,
  perimetry: {
    pbo: undefined,
    limite_superieure: undefined,
    limite_inferieure: undefined,
    limite_temporale_droit: undefined,
    limite_temporale_gauche: undefined,
    limite_horizontal: undefined,
    score_esternmen: undefined,
    image: "",
    images: "",
  },
  bp_sup: {
    retinographie: "",
    oct: "",
    autres: "",
  },
  od: {
    plaintes: {
      eye_symptom: undefined,
      diplopie: false,
      diplopie_type: null,
      strabisme: false,
      strabisme_eye: null,
      nystagmus: false,
      nystagmus_eye: null,
      ptosis: false,
      ptosis_eye: null,
    },
    bp_sg_anterieur: {
      segment: undefined,
      cornee: undefined,
      profondeur: undefined,
      transparence: undefined,
      type_anomalie_value: null,
      quantite_anomalie: null,
      pupille: undefined,
      axe_visuel: undefined,
      rpm: undefined,
      iris: undefined,
      cristallin: undefined,
      position_cristallin: undefined,
    },
    bp_sg_posterieur: {
      segment: undefined,
      vitre: undefined,
      retine: undefined,
      papille: undefined,
      macula: undefined,
      retinien_peripherique: undefined,
      vaissaux: undefined,
    }
  },
  og: {
    plaintes: {
      eye_symptom: undefined,
      diplopie: false,
      diplopie_type: null,
      strabisme: false,
      strabisme_eye: null,
      nystagmus: false,
      nystagmus_eye: null,
      ptosis: false,
      ptosis_eye: null,
    },
    bp_sg_anterieur: {
      segment: undefined,
      cornee: undefined,
      profondeur: undefined,
      transparence: undefined,
      type_anomalie_value: null,
      quantite_anomalie: null,
      pupille: undefined,
      axe_visuel: undefined,
      rpm: undefined,
      iris: undefined,
      cristallin: undefined,
      position_cristallin: undefined,
    },
    bp_sg_posterieur: {
      segment: undefined,
      vitre: undefined,
      retine: undefined,
      papille: undefined,
      macula: undefined,
      retinien_peripherique: undefined,
      vaissaux: undefined,
    },
  },
  conclusion: {
    vision: null,
    cat: null,
    traitement: null,
    observation: null,
    rv: false,
  },
}