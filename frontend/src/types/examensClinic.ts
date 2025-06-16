import type { ID } from "./_models"


export interface Conclusion {
  id?: ID
  vision?: "compatible" | "incompatible" | "a_risque" | null
  cat?: string | null
  traitement?: string | null
  observation?: string | null
  rv?: boolean
  created?: string
  modified?: string
}

export interface Perimetry {
  id?: ID
  pbo?: string | null
  limite_superieure?: number | null
  limite_inferieure?: number | null
  limite_temporale_droit?: number | null
  limite_temporale_gauche?: number | null
  limite_horizontal?: number | null
  score_esternmen?: number | null
  image?: string
  images?: string
  created?: string
  modified?: string
}

export interface BpSuP {
  id?: ID
  retinographie?: string
  oct?: string
  autres?: string
  created?: string
  modified?: string
}

export interface EyeSide {
  id?: ID
  plaintes?: number
  bp_sg_anterieur?: number
  bp_sg_posterieur?: number
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
  patient?: number
}

export const initialClinicalExamen: ClinicalExamen = {
  id: null,
  conclusion: {
    id: null,
    vision: null,
    cat: "",
    traitement: "",
    observation: "",
    rv: false,
    created: "",
    modified: "",
  },
  perimetry: {
    id: null,
    pbo: null,
    limite_superieure: null,
    limite_inferieure: null,
    limite_temporale_droit: null,
    limite_temporale_gauche: null,
    limite_horizontal: null,
    score_esternmen: null,
    image: "",
    images: "",
    created: "",
    modified: "",
  },
  bp_sup: {
    id: null,
    retinographie: "",
    oct: "",
    autres: "",
    created: "",
    modified: "",
  },
  og: undefined,
  od: undefined,
  visite: 1,
  is_completed: false,
  patient: undefined,
}