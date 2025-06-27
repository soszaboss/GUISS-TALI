
from .examens import get_nombre_incompatibles, get_nombre_tonus_superieur_a_21, get_tonus_moyen
from .health_record import get_evolution_visites, get_nombre_patients_a_risque
from .patients import get_age_moyen, get_duree_moyenne_conduite, get_nombre_par_categorie_permis, get_nombre_patients, get_nombre_professionnels


class DashboardStatsSelector:

    @classmethod
    def employee_stats(cls):
        return {
            'nombre_total_patients': get_nombre_patients(),
            'age_moyen': get_age_moyen(),
            'nombre_professionnels': get_nombre_professionnels(),
            'duree_moyenne_conduite': get_duree_moyenne_conduite(),
            'distribution_permis': get_nombre_par_categorie_permis(),
            'tonus_moyen': get_tonus_moyen(),
            'tonus_superieur_a_21': get_nombre_tonus_superieur_a_21(),
            'nombre_incompatibles': get_nombre_incompatibles(),
            'patients_risque_dossier': get_nombre_patients_a_risque(),
            'evolution_visites': {
                'par_mois': get_evolution_visites(group_by='mois'),
                'par_semaine': get_evolution_visites(group_by='semaine'),
                'par_annee': get_evolution_visites(group_by='annee'),
            },
        }
