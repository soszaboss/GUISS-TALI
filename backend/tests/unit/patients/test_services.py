# apps/patients/tests/unit/test_services.py
import pytest
from datetime import date, timedelta
from django.core.exceptions import ValidationError

from apps.patients.models import Conducteur, Vehicule
from apps.health_record.models import HealthRecord

from services.patients import (
    conducteur_create, conducteur_update,
    vehicule_create, vehicule_update
)
from factories.patients import ConducteurFactory, VehiculeFactory


@pytest.mark.django_db
class TestConducteurServices:

    def test_conducteur_create_successfully(self):
        """✅ Crée un conducteur valide via le service."""
        data = ConducteurFactory.build().__dict__
        data.pop("_state")  # Nettoyage
        conducteur = conducteur_create(**data)
        assert isinstance(conducteur, Conducteur)
        assert Conducteur.objects.filter(id=conducteur.id).exists()
        assert HealthRecord.objects.filter(patient=conducteur.id).exists()

    def test_conducteur_create_invalid_dates(self):
        """🚫 Échec si la date de péremption est avant celle de délivrance."""
        data = ConducteurFactory.build(
            date_delivrance_permis=date.today(),
            date_peremption_permis=date.today() - timedelta(days=1)
        ).__dict__
        data.pop("_state")
        with pytest.raises(ValidationError):
            conducteur_create(**data)

    def test_conducteur_create_requires_autre_type_permis(self):
        """🚫 Échec si 'Autres à préciser' est choisi sans champ précisé."""
        data = ConducteurFactory.build(
            type_permis='Autres à préciser',
            autre_type_permis=None
        ).__dict__
        data.pop("_state")
        with pytest.raises(ValidationError):
            conducteur_create(**data)

    def test_conducteur_update_successfully(self):
        """✅ Mise à jour d’un conducteur existant via le service."""
        conducteur = ConducteurFactory()
        updated = conducteur_update(conducteur, first_name="Modifié")
        assert updated.first_name == "Modifié"


@pytest.mark.django_db
class TestVehiculeServices:

    def test_vehicule_create_successfully(self):
        """✅ Crée un véhicule avec conducteur via service."""
        conducteur = ConducteurFactory()
        data = VehiculeFactory.build(conducteur=conducteur).__dict__
        data.pop("_state")
        vehicule = vehicule_create(**data)
        assert isinstance(vehicule, Vehicule)
        assert vehicule.conducteur == conducteur

    def test_vehicule_create_requires_autre_type_if_autre(self):
        """🚫 Échec si type = Autres mais champ vide."""
        conducteur = ConducteurFactory()
        data = VehiculeFactory.build(
            conducteur=conducteur,
            type_vehicule_conduit="Autres",
            autre_type_vehicule_conduit=None
        ).__dict__
        data.pop("_state")
        with pytest.raises(ValidationError):
            vehicule_create(**data)

    def test_vehicule_update_successfully(self):
        """✅ Mise à jour d’un véhicule existant."""
        vehicule = VehiculeFactory(modele="Toyota")
        updated = vehicule_update(vehicule, modele="Nissan")
        assert updated.modele == "Nissan"
