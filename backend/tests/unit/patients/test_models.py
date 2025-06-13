# apps/patients/tests/unit/test_models.py
import pytest
from apps.patients.models import Conducteur, Vehicule
from django.core.exceptions import ValidationError
from datetime import date, timedelta

from backend.factories.patients import ConducteurFactory, VehiculeFactory


@pytest.mark.django_db
class TestConducteurModel:

    def test_create_patient_successfully(self):
        """✅ Crée un patient valide avec toutes les infos requises."""
        patient = ConducteurFactory()
        assert patient.email
        assert patient.numero_permis
        assert patient.date_peremption_permis > patient.date_delivrance_permis
        assert str(patient) == f"{patient.first_name} {patient.last_name}"

    def test_unique_email_phone_number_and_permis(self):
        """🚫 Vérifie les contraintes d’unicité sur l'email et le permis."""
        patient = ConducteurFactory()
        with pytest.raises(Exception):
            ConducteurFactory(email=patient.email)

        with pytest.raises(Exception):
            ConducteurFactory(numero_permis=patient.numero_permis)

        with pytest.raises(Exception):
            ConducteurFactory(phone_number=patient.phone_number)

    def test_invalid_date_permis_validation(self):
        """🚫 La date de péremption ne doit pas être avant celle de délivrance."""
        patient = ConducteurFactory.build(
            date_delivrance_permis=date.today(),
            date_peremption_permis=date.today() - timedelta(days=1)
        )
        with pytest.raises(ValidationError):
            patient.full_clean()

    def test_autre_type_permis_optional(self):
        """🆗 Le champ 'autre_type_permis' peut rester vide sauf si 'Autres à préciser' est choisi."""
        patient = ConducteurFactory(type_permis="Léger", autre_type_permis=None)
        patient.full_clean()  # Pas d’erreur attendue

    def test_sexe_choices(self):
        """🎭 Vérifie les différentes valeurs acceptées pour le sexe."""
        homme = ConducteurFactory(sexe="Homme")
        femme = ConducteurFactory(sexe="Femme")
        anonyme = ConducteurFactory(sexe="Anonyme")

        assert homme.sexe == "Homme"
        assert femme.sexe == "Femme"
        assert anonyme.sexe == "Anonyme"

        with pytest.raises(ValidationError):
            patient = ConducteurFactory(sexe="H")
            patient.full_clean()

    @pytest.mark.parametrize("field,value,valid", [
        ('email', 'invalid-email', False),
        ('phone_number', '123', False),
        ('numero_permis', 'SN2023ABCD', True),
        ('sexe', 'Invalid', False),
        ('type_permis', 'Invalid', False),
    ])
    def test_field_validation(self, field, value, valid):
        """Teste la validation des différents champs"""
        conducteur = ConducteurFactory()
        setattr(conducteur, field, value)

        if valid:
            conducteur.full_clean()
        else:
            with pytest.raises(ValidationError):
                conducteur.full_clean()

    # def test_other_license_type_required(self):
    #     """Teste que 'autre_type_permis' est requis quand type_permis='Autres'"""
    #     conducteur = ConducteurFactory(
    #         type_permis='Autres à préciser',
    #         autre_type_permis=None
    #     )
    #     with pytest.raises(ValidationError):
    #         conducteur.full_clean()

    def test_str_representation(self):
        """Teste la représentation en string"""
        conducteur = ConducteurFactory(
            first_name="Jean",
            last_name="Dupont"
        )
        assert str(conducteur) == "Jean Dupont"


@pytest.mark.django_db
class TestVehiculeModel:

    def test_create_vehicule_successfully(self):
        """✅ Crée un véhicule avec un patient lié."""
        vehicule = VehiculeFactory()
        assert vehicule.conducteur
        assert str(vehicule) == f"{vehicule.modele} | {vehicule.immatriculation}"

    def test_optional_fields_can_be_null(self):
        """🆗 Les champs immatriculation, modèle, année peuvent être nuls."""
        vehicule = VehiculeFactory(
            immatriculation=None,
            modele=None,
            annee=None
        )
        vehicule.full_clean()

    def test_autre_type_vehicule_optional(self):
        """🆗 Le champ 'autre_type_vehicule_conduit' est optionnel."""
        vehicule = VehiculeFactory(autre_type_vehicule_conduit=None)
        vehicule.full_clean()

    def test_foreign_key_constraint(self):
        """🔗 Vérifie la liaison obligatoire avec un patient."""
        patient = ConducteurFactory()
        vehicule = VehiculeFactory(conducteur=patient)
        assert vehicule.conducteur == patient

    def test_conducteur_relation(self):
        """Teste la relation avec Conducteur"""
        conducteur = ConducteurFactory()
        vehicule = VehiculeFactory(conducteur=conducteur)

        assert vehicule.conducteur == conducteur
        assert conducteur.vehicule_set.count() == 1

    def test_str_representation(self):
        """Teste la représentation en string"""
        vehicule = VehiculeFactory(
            modele="Toyota",
            immatriculation="DK-1234-A"
        )
        assert str(vehicule) == "Toyota | DK-1234-A"
