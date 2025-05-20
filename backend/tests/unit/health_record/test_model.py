# tests/unit/health_record/test_factories.py
import pytest
from django.utils import timezone
from apps.health_record.models import DriverExperience, Antecedent, HealthRecord
from tests.unit.clinical_examen.factories import ExamenCliniqueFactory
from tests.unit.health_record.factories import (
    DriverExperienceFactory,
    AntecedentFactory,
    HealthRecordFactory
)
from utils.models.choices import (
    AddictionTypeChoices,
    FamilialChoices,
    DommageChoices,
    DegatChoices,
    VisiteChoices
)


@pytest.mark.django_db
class TestDriverExperienceFactory:
    def test_basic_creation(self):
        """Test la création basique d'un DriverExperience"""
        experience = DriverExperienceFactory()
        assert experience.pk is not None
        assert isinstance(experience.km_parcourus, float)
        assert 1000 <= experience.km_parcourus <= 500000
        assert isinstance(experience.nombre_accidents, int)
        assert 0 <= experience.nombre_accidents <= 10
        assert experience.visite in [v[0] for v in VisiteChoices.choices]
        assert experience.dommage in [c[0] for c in DommageChoices.choices]
        assert experience.degat in [c[0] for c in DegatChoices.choices]

    def test_with_dommage_trait(self):
        """Test le trait with_dommage"""
        experience = DriverExperienceFactory(with_dommage=True)
        assert experience.dommage in ['corporel', 'materiel']

    def test_with_degat_trait(self):
        """Test le trait with_degat"""
        experience = DriverExperienceFactory(with_degat=True)
        assert experience.degat in ['important', 'modéré', 'leger']

    def test_tranche_horaire(self):
        """Test que tranche_horaire est bien un objet time"""
        experience = DriverExperienceFactory()
        assert hasattr(experience.tranche_horaire, 'hour')
        assert hasattr(experience.tranche_horaire, 'minute')


@pytest.mark.django_db
class TestAntecedentFactory:
    def test_basic_creation(self):
        """Test la création basique d'un Antecedent"""
        antecedent = AntecedentFactory()
        assert antecedent.pk is not None
        assert isinstance(antecedent.antecedents_medico_chirurgicaux, str)
        assert isinstance(antecedent.pathologie_ophtalmologique, str)
        assert antecedent.addiction is False
        assert antecedent.familial in [c[0] for c in FamilialChoices.choices]

    def test_with_addiction_trait(self):
        """Test le trait with_addiction"""
        antecedent = AntecedentFactory(with_addiction=True)
        assert antecedent.addiction is True
        assert antecedent.type_addiction in [c[0] for c in AddictionTypeChoices.choices]
        if antecedent.type_addiction == 'tabagisme':
            assert antecedent.tabagisme_detail is not None

    def test_with_other_addiction_trait(self):
        """Test le trait with_other_addiction"""
        antecedent = AntecedentFactory(with_other_addiction=True)
        assert antecedent.addiction is True
        assert antecedent.type_addiction == 'other'
        assert antecedent.autre_addiction_detail is not None

    def test_with_familial_trait(self):
        """Test le trait with_familial"""
        antecedent = AntecedentFactory(with_familial=True)
        assert antecedent.familial in ['cecite', 'gpao']

    def test_with_other_familial_trait(self):
        """Test le trait with_other_familial"""
        antecedent = AntecedentFactory(with_other_familial=True)
        assert antecedent.familial == 'other'
        assert antecedent.autre_familial_detail is not None

    def test_post_generation_addiction_details(self):
        """Test la post_generation pour les détails d'addiction"""
        # Test tabagisme
        antecedent = AntecedentFactory(
            addiction=True,
            type_addiction='tabagisme',
            tabagisme_detail=None
        )
        assert antecedent.tabagisme_detail == "5 paquets/an"

        # Test other addiction
        antecedent = AntecedentFactory(
            addiction=True,
            type_addiction='other',
            autre_addiction_detail=None
        )
        assert antecedent.autre_addiction_detail == "Dépendance aux jeux"

        # Test other familial
        antecedent = AntecedentFactory(
            familial='other',
            autre_familial_detail=None
        )
        assert antecedent.autre_familial_detail == "Antécédents familiaux divers"


@pytest.mark.django_db
class TestHealthRecordFactory:
    def test_basic_creation(self):
        """Test la création basique d'un HealthRecord"""
        health_record = HealthRecordFactory()
        assert health_record.pk is not None
        assert health_record.antecedant is not None
        assert health_record.clinical_examen.count() == 2
        assert health_record.driver_experience.count() == 2

    def test_with_custom_antecedant(self):
        """Test avec un antecedant personnalisé"""
        antecedant = AntecedentFactory()
        health_record = HealthRecordFactory(antecedant=antecedant)
        assert health_record.antecedant == antecedant

    def test_with_custom_clinical_examens(self):
        """Test avec des examens cliniques personnalisés"""
        examens = [ExamenCliniqueFactory() for _ in range(3)]
        health_record = HealthRecordFactory(clinical_examen=examens)
        assert health_record.clinical_examen.count() == 3
        assert list(health_record.clinical_examen.all()) == examens

    def test_with_custom_driver_experiences(self):
        """Test avec des expériences de conduite personnalisées"""
        experiences = [DriverExperienceFactory() for _ in range(3)]
        health_record = HealthRecordFactory(driver_experience=experiences)
        assert health_record.driver_experience.count() == 3
        assert list(health_record.driver_experience.all()) == experiences

    # def test_relations_patient_coherence(self):
    #     """Test que tous les objets liés ont le même patient"""
    #     health_record = HealthRecordFactory()
    #     patient = health_record.patient
    #
    #     assert health_record.antecedant.patient == patient
    #
    #     for exam in health_record.clinical_examen.all():
    #         assert exam.patient == patient
    #
    #     for exp in health_record.driver_experience.all():
    #         assert exp.patient == patient