# tests/test_medical_records.py
import pytest
from django.core.exceptions import ValidationError
from factories.examens import ExamensFactory
from factories.health_record import (
    DriverExperienceFactory,
    AntecedentFactory,
    HealthRecordFactory
)
from factories.patients import ConducteurFactory
from utils.models.choices import (
    DommageChoices,
    DegatChoices,
    AddictionTypeChoices,
    FamilialChoices
)

@pytest.mark.django_db
class TestDriverExperienceModel:
    """Tests pour le modèle DriverExperience"""
    
    def test_valid_driver_experience(self):
        de = DriverExperienceFactory(
            km_parcourus=50000,
            nombre_accidents=2,
            tranche_horaire="Journée"
        )
        assert de.km_parcourus == 50000
        assert de.nombre_accidents == 2
        assert de.tranche_horaire == "Journée"

    @pytest.mark.parametrize("field,value,expected_error", [
        ('km_parcourus', -100, 'ne peuvent pas être négatifs'),
        ('nombre_accidents', -1, 'ne peut pas être négatif')
    ])
    def test_negative_values_validation(self, field, value, expected_error):
        with pytest.raises(ValidationError, match=expected_error):
            DriverExperienceFactory(**{field: value}).full_clean()

    def test_unique_patient_visite_constraint(self):
        de = DriverExperienceFactory()
        with pytest.raises(ValidationError):
            DriverExperienceFactory(
                patient=de.patient,
                visite=de.visite
            ).full_clean()

    def test_dommage_degat_choices(self):
        for dommage, _ in DommageChoices.choices:
            DriverExperienceFactory(dommage=dommage).full_clean()
        
        for degat, _ in DegatChoices.choices:
            DriverExperienceFactory(degat=degat).full_clean()

@pytest.mark.django_db
class TestAntecedentModel:
    """Tests pour le modèle Antecedent"""
    
    def test_antecedent_creation(self):
        antecedent = AntecedentFactory()
        assert antecedent.patient is not None
        assert isinstance(antecedent.addiction, bool)

    def test_addiction_validation(self):
        # Addiction sans type
        with pytest.raises(ValidationError, match='spécifier le type'):
            AntecedentFactory(addiction=True, type_addiction=None).full_clean()

        # Tabagisme sans détail
        with pytest.raises(ValidationError, match='détails pour le tabagisme'):
            AntecedentFactory(
                addiction=True,
                type_addiction='tabagisme',
                tabagisme_detail=''
            ).full_clean()

        # Autre addiction sans détail
        with pytest.raises(ValidationError, match='détails pour l\'autre addiction'):
            AntecedentFactory(
                addiction=True,
                type_addiction='other',
                autre_addiction_detail=''
            ).full_clean()

    def test_valid_addiction_scenarios(self):
        # Tabagisme valide
        AntecedentFactory(
            addiction=True,
            type_addiction='tabagisme',
            tabagisme_detail='10 paquets/an'
        ).full_clean()

        # Autre addiction valide
        AntecedentFactory(
            addiction=True,
            type_addiction='other',
            autre_addiction_detail='Jeu compulsif'
        ).full_clean()

    def test_familial_validation(self):
        # Autre familial sans détail
        with pytest.raises(ValidationError, match='préciser les autres'):
            AntecedentFactory(
                familial='other',
                autre_familial_detail=''
            ).full_clean()

    def test_all_addiction_choices(self):
        for choice, _ in AddictionTypeChoices.choices:
            AntecedentFactory(
                addiction=True,
                type_addiction=choice,
                tabagisme_detail='10 paquets/an' if choice == 'tabagisme' else '',
                autre_addiction_detail='Détail' if choice == 'other' else ''
            ).full_clean()

    def test_all_familial_choices(self):
        for choice, _ in FamilialChoices.choices:
            AntecedentFactory(
                familial=choice,
                autre_familial_detail='Détail' if choice == 'other' else ''
            ).full_clean()

@pytest.mark.django_db
class TestHealthRecordModel:
    """Tests pour le modèle HealthRecord"""
    

    def test_patient_consistency_validation(self):
        other_patient = ConducteurFactory()
        
        # Test incohérence antecedant
        with pytest.raises(ValidationError, match='Incohérence'):
            HealthRecordFactory(
                antecedant__patient=other_patient
            ).full_clean()

        # Test incohérence driver_experience
        # with pytest.raises(ValidationError, match='Incohérence'):
        #     HealthRecordFactory(
        #         driver_experience__patient=other_patient
        #     ).full_clean()


    def test_one_to_one_patient_constraint(self):
        patient = ConducteurFactory()
        HealthRecordFactory(patient=patient)
        
        with pytest.raises(Exception):  # IntegrityError ou ValidationError
            HealthRecordFactory(patient=patient)

    def test_health_record_creation(self):
        hr = HealthRecordFactory()  # Création avec relations par défaut
        assert hr.pk is not None  # Vérifie que l'objet est bien sauvegardé
        assert hr.driver_experience.count() == 3  # Vérifie les relations

    def test_relations_optional(self):
        hr = HealthRecordFactory(
        )
        assert hr.examens.count() == 3
        assert hr.driver_experience.count() == 3

    def test_examens_relation(self):
        examens = [ExamensFactory() for _ in range(3)]
        hr = HealthRecordFactory(examens=examens)
        assert hr.examens.count() == 3