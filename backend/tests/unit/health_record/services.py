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

@pytest.mark.django_db
class TestDriverExperienceService:
    def test_create_or_update_driver_experience(self):
        patient = ConducteurFactory()
        data = {
            'km_parcourus': 50000,
            'nombre_accidents': 1,
            'tranche_horaire': 'Journée',
            'dommage': 'corporel',
            'degat': 'léger',
            'date_visite': '2023-01-01'  # Ajout de ce champ

        }
        
        # Test création
        driver_exp = DriverExperienceService.create_or_update_driver_experience(
            patient.id, 1, data
        )
        assert DriverExperience.objects.count() == 1
        assert driver_exp.km_parcourus == 50000
        
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
            'type_addiction': 'tabagisme',
            'tabagisme_detail': '10 paquets/an'  # Détails requis
        }
        
        antecedent = AntecedentService.create_or_update_antecedent(patient.id, data)
        assert Antecedent.objects.count() == 1
        assert antecedent.addiction is True
        
        # Test mise à jour
        updated_data = {'addiction': False}
        updated_ant = AntecedentService.create_or_update_antecedent(patient.id, updated_data)
        assert Antecedent.objects.count() == 1
        assert updated_ant.addiction is False

@pytest.mark.django_db
class TestHealthRecordService:
    def test_create_or_update_health_record(self):
        patient = ConducteurFactory()
        antecedent = AntecedentFactory(patient=patient)
        driver_exp = DriverExperienceFactory(patient=patient)
        
        health_record = HealthRecordService.create_or_update_health_record(
            patient.id, antecedent.id, driver_exp.id
        )
        
        assert HealthRecord.objects.count() == 1
        assert health_record.antecedant == antecedent
        assert health_record.driver_experience == driver_exp
        
        # Test validation patient mismatch
        other_patient = ConducteurFactory()
        other_antecedent = AntecedentFactory(patient=other_patient)
        
        with pytest.raises(ValidationError):
            HealthRecordService.create_or_update_health_record(
                patient.id, other_antecedent.id, driver_exp.id
            )

@pytest.mark.django_db
class TestMedicalHistoryService:
    def test_get_complete_patient_history(self):
        patient = ConducteurFactory()
        antecedent = AntecedentFactory(patient=patient)
        driver_exp1 = DriverExperienceFactory(patient=patient, visite=1)
        driver_exp2 = DriverExperienceFactory(patient=patient, visite=2)
        health_record = HealthRecordFactory(
            patient=patient,
            antecedant=antecedent,
            driver_experience=driver_exp2
        )
        
        history = MedicalHistoryService.get_complete_patient_history(patient.id)
        
        assert history is not None
        assert history['health_record'] == health_record
        assert history['antecedent'] == antecedent
        assert history['current_driver_experience'] == driver_exp2
        assert len(history['all_driver_experiences']) == 2