from typing import Optional, List

from django.db import models
from django.db.models import Avg, Count

from apps.patients.models import Conducteur, Vehicule

from datetime import date

# --- Conducteur Selectors ---

def get_conducteur_by_id(conducteur_id: int) -> Optional[Conducteur]:
    return Conducteur.objects.filter(id=conducteur_id).first()


def get_all_conducteurs() -> List[Conducteur]:
    return list(Conducteur.objects.all())


def search_conducteurs_by_nom(nom: str) -> List[Conducteur]:
    return list(Conducteur.objects.filter(last_name__icontains=nom))


def get_nombre_patients():
    return Conducteur.objects.count()


def get_age_moyen():
    today = date.today()
    return Conducteur.objects.annotate(
        age=today.year - models.functions.ExtractYear('date_naissance')
    ).aggregate(age_moyen=Avg('age'))['age_moyen']


def get_nombre_par_categorie_permis():
    return Conducteur.objects.values('type_permis').annotate(nombre=Count('id'))


def get_duree_moyenne_conduite():
    return Conducteur.objects.aggregate(moyenne_annees=Avg('annees_experience'))['moyenne_annees']


def get_nombre_professionnels():
    return Conducteur.objects.filter(transporteur_professionnel=True).count()


def get_distribution_par_zone():
    # Nécessite un champ `zone` ou `adresse` ou `localisation` dans le modèle, sinon à adapter
    return Conducteur.objects.values('adresse__ville').annotate(nombre=Count('id'))

# --- Vehicule Selectors ---

def get_vehicule_by_id(vehicule_id: int) -> Optional[Vehicule]:
    return Vehicule.objects.filter(id=vehicule_id).first()


def get_all_vehicules() -> List[Vehicule]:
    return list(Vehicule.objects.select_related('conducteur').all())


def get_vehicules_by_conducteur(conducteur_id: int) -> List[Vehicule]:
    return list(Vehicule.objects.filter(conducteur_id=conducteur_id))


