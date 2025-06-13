# apps/patients/tests/unit/test_selectors.py
import pytest
from my_selectors.patients import (
    get_conducteur_by_id,
    get_all_conducteurs,
    search_conducteurs_by_nom,
    get_vehicule_by_id,
    get_all_vehicules,
    get_vehicules_by_conducteur
)
from backend.factories.patients import ConducteurFactory, VehiculeFactory


@pytest.mark.django_db
class TestConducteurSelectors:

    def test_get_conducteur_by_id(self):
        conducteur = ConducteurFactory()
        result = get_conducteur_by_id(conducteur.id)
        assert result == conducteur

    def test_get_all_conducteurs(self):
        ConducteurFactory.create_batch(3)
        result = get_all_conducteurs()
        assert len(result) == 3

    def test_search_conducteurs_by_nom(self):
        ConducteurFactory(last_name="Diallo")
        ConducteurFactory(last_name="Fall")
        result = search_conducteurs_by_nom("Dial")
        assert len(result) == 1
        assert result[0].last_name == "Diallo"


@pytest.mark.django_db
class TestVehiculeSelectors:

    def test_get_vehicule_by_id(self):
        vehicule = VehiculeFactory()
        result = get_vehicule_by_id(vehicule.id)
        assert result == vehicule

    def test_get_all_vehicules(self):
        VehiculeFactory.create_batch(2)
        result = get_all_vehicules()
        assert len(result) == 2

    def test_get_vehicules_by_conducteur(self):
        conducteur = ConducteurFactory()
        VehiculeFactory.create_batch(2, conducteur=conducteur)
        result = get_vehicules_by_conducteur(conducteur.id)
        assert len(result) == 2
