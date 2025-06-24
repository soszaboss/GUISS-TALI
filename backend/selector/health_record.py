from django.db.models import Count
from apps.health_record.models import DriverExperience, HealthRecord
from django.db.models.functions import TruncMonth, TruncWeek, TruncYear



# ➤ Nombre de patients marqués "à risque" dans leur dossier médical
def get_nombre_patients_a_risque():
    count = HealthRecord.objects.filter(risky_patient=True).count()
    return HealthRecord.objects.filter(risky_patient=True).count()


def get_evolution_visites(group_by="mois"):
    """
    Retourne l'évolution des visites à partir de DriverExperience :
    - par mois (default)
    - par semaine
    - par année

    :param group_by: "mois" | "semaine" | "annee"
    :return: List[{"periode": "2025-01", "nombre": 8}, ...]
    """
    trunc_map = {
        "mois": TruncMonth,
        "semaine": TruncWeek,
        "annee": TruncYear,
    }

    if group_by not in trunc_map:
        raise ValueError("group_by doit être 'mois', 'semaine' ou 'annee'")

    trunc_fn = trunc_map[group_by]

    visites = (
        DriverExperience.objects
        .filter(date_visite__isnull=False)
        .annotate(periode=trunc_fn('date_visite'))
        .values('periode')
        .annotate(nombre=Count('id'))
        .order_by('periode')
    )

    return [
        {"periode": v["periode"].strftime({
            "mois": "%Y-%m",
            "semaine": "Semaine %W %Y",
            "annee": "%Y"
        }[group_by]), "nombre": v["nombre"]}
        for v in visites
    ]

