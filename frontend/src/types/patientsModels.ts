import type { ID } from "./_models";

export type Sexe = 'Homme' | 'Femme' | 'Anonyme';
export type TypePermis = 'Léger' | 'Lourd' | 'Autres à préciser';
export type Service = 'Public' | 'Privé' | 'Particulier';
export type Instruction = 'Française' | 'Arabe';
export type NiveauInstruction = 'Primaire' | 'Secondaire' | 'Supérieure' | 'Autres' | 'Aucune';
export type VehiculeType = 'Léger' | 'Lourd' | 'Autres';

export interface Conducteur {
  id: ID;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  date_naissance: string;
  sexe: Sexe;
  numero_permis: string;
  type_permis: TypePermis;
  autre_type_permis?: string | null;
  date_delivrance_permis: string;
  date_peremption_permis: string;
  transporteur_professionnel: boolean;
  service: Service;
  type_instruction_suivie: Instruction;
  niveau_instruction: NiveauInstruction;
  annees_experience: number;
  image?: string | null;
  created?: string;
  modified?: string;
}

export interface Vehicule {
  id: ID;
  immatriculation?: string | null;
  modele?: string | null;
  annee?: string | null;
  type_vehicule_conduit: VehiculeType;
  autre_type_vehicule_conduit?: string | null;
  conducteur: ID;
  created?: string;
  modified?: string;
}

export const initConducteur: Conducteur = {
  id: null,
  email: '',
  first_name: '',
  last_name: '',
  phone_number: '',
  date_naissance: '',
  sexe: 'Homme',
  numero_permis: '',
  type_permis: 'Léger',
  autre_type_permis: '',
  date_delivrance_permis: '',
  date_peremption_permis: '',
  transporteur_professionnel: false,
  service: 'Public',
  type_instruction_suivie: 'Française',
  niveau_instruction: 'Primaire',
  annees_experience: 0,
  image: '',
  created: '',
  modified: '',
};

export const initVehicule: Vehicule = {
  id: null,
  immatriculation: '',
  modele: '',
  annee: '',
  type_vehicule_conduit: 'Léger',
  autre_type_vehicule_conduit: '',
  conducteur: 0,
  created: '',
  modified: '',
};