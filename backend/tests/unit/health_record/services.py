from datetime import datetime
import pytest
from django.core.exceptions import ValidationError
from apps.health_record.models import DriverExperience, Antecedent, HealthRecord, Conducteur
from services.health_records import (
    DriverExperienceService,
    AntecedentService,
    HealthRecordService,
    MedicalHistoryService
)
from factories.health_record import (
    DriverExperienceFactory,
    AntecedentFactory,
    HealthRecordFactory,
    ConducteurFactory
)
from utils.models.choices import (
    DommageChoices, AddictionTypeChoices
)

@pytest.mark.django_db
class TestDriverExperienceService:
    def test_create_or_update_driver_experience(self):
        patient = ConducteurFactory()
        data = {
            'etat_conducteur': 'actif',
            'km_parcourus': 50000,
            'nombre_accidents': 1,
            'tranche_horaire': 'Journée',
            'corporel_dommage': True,
            'corporel_dommage_type': DommageChoices.CORPOREL,
            'materiel_dommage': False,
            'materiel_dommage_type': None,
            'date_visite': '2023-01-01'
        }
        # Test création
        driver_exp = DriverExperienceService.create_or_update_driver_experience(
            patient.id, 1, data
        )
        assert DriverExperience.objects.count() == 1
        assert driver_exp.km_parcourus == 50000
        assert driver_exp.corporel_dommage is True
        assert driver_exp.corporel_dommage_type == DommageChoices.CORPOREL

        # Test mise à jour
        updated_data = {'km_parcourus': 60000}
        updated_exp = DriverExperienceService.create_or_update_driver_experience(
            patient.id, 1, updated_data
        )
        assert DriverExperience.objects.count() == 1
        assert updated_exp.km_parcourus == 60000

@pytest.mark.django_db
class TestAntecedentService:
    def test_create_or_update_antecedent(self):
        patient = ConducteurFactory()
        data = {
            'antecedents_medico_chirurgicaux': 'Diabète',
            'pathologie_ophtalmologique': 'Myopie',
            'addiction': True,
            'type_addiction': [AddictionTypeChoices.TABAGISME],
            'tabagisme_detail': '10 paquets/an',
            'familial': [],
        }
        antecedent = AntecedentService.create_or_update_antecedent(patient.id, data)
        assert Antecedent.objects.count() == 1
        assert antecedent.addiction is True
        assert antecedent.type_addiction == [AddictionTypeChoices.TABAGISME]
        assert antecedent.tabagisme_detail == '10 paquets/an'

        # Test mise à jour
        updated_data = {'addiction': False, 'type_addiction': [], 'familial': []}
        updated_ant = AntecedentService.create_or_update_antecedent(patient.id, updated_data)
        assert Antecedent.objects.count() == 1
        assert updated_ant.addiction is False
        assert updated_ant.type_addiction == []

@pytest.mark.django_db
class TestHealthRecordService:
    def test_create_or_update_health_record(self):
        patient = ConducteurFactory()
        antecedent = AntecedentFactory(patient=patient)
        driver_exp = DriverExperienceFactory(patient=patient)

        health_record = HealthRecordService.create_or_update_health_record(
            patient.id, antecedent.id, [driver_exp.id]
        )

        assert HealthRecord.objects.count() == 1
        assert health_record.antecedant == antecedent
        assert driver_exp in health_record.driver_experience.all()

        # Test validation patient mismatch
        other_patient = ConducteurFactory()
        other_antecedent = AntecedentFactory(patient=other_patient)

        with pytest.raises(ValidationError):
            HealthRecordService.create_or_update_health_record(
                patient.id, other_antecedent.id, [driver_exp.id]
            )