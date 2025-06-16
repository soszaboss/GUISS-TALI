from typing import Optional, List
from apps.patients.models import Conducteur, Vehicule


# --- Conducteur Selectors ---

def get_conducteur_by_id(conducteur_id: int) -> Optional[Conducteur]:
    return Conducteur.objects.filter(id=conducteur_id).first()


def get_all_conducteurs() -> List[Conducteur]:
    return list(Conducteur.objects.all())


def search_conducteurs_by_nom(nom: str) -> List[Conducteur]:
    return list(Conducteur.objects.filter(last_name__icontains=nom))


# --- Vehicule Selectors ---

def get_vehicule_by_id(vehicule_id: int) -> Optional[Vehicule]:
    return Vehicule.objects.filter(id=vehicule_id).first()


def get_all_vehicules() -> List[Vehicule]:
    return list(Vehicule.objects.select_related('conducteur').all())


def get_vehicules_by_conducteur(conducteur_id: int) -> List[Vehicule]:
    return list(Vehicule.objects.filter(conducteur_id=conducteur_id))
