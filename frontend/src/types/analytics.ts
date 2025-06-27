export type DistributionPermis = {
  type_permis: string
  nombre: number
}

export type EvolutionItem = {
  periode: string
  nombre: number
}

export type EvolutionVisites = {
  par_mois: EvolutionItem[]
  par_semaine: EvolutionItem[]
  par_annee: EvolutionItem[]
}

export type TonusMoyen = {
  tonus_moyen_od: number
  tonus_moyen_og: number
}

export type DashboardApiResponse = {
  nombre_total_patients: number
  age_moyen: number
  nombre_professionnels: number
  duree_moyenne_conduite: number
  distribution_permis: DistributionPermis[]
  tonus_moyen: TonusMoyen
  tonus_superieur_a_21: number
  nombre_incompatibles: number
  patients_risque_dossier: number
  evolution_visites: EvolutionVisites
}


export type AdminKpis = {
  total_users: number
  admins: number
  doctors: number
  technicians: number
  employees: number
  active_users: number
  inactive_users: number
}

export type RoleDistribution = {
  role: string
  count: number
}

export type UsersCreatedPerMonth = {
  month: string // format ISO ou YYYY-MM
  count: number
}

export type AdminDashboardApiResponse = {
  kpis: AdminKpis
  roles_distribution: RoleDistribution[]
  users_created_per_month: UsersCreatedPerMonth[]
}