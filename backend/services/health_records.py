from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.db import transaction
from apps.health_record.models import (
    DriverExperience, Antecedent, HealthRecord, Conducteur, Examens
)

class DriverExperienceService:
    """Service pour l'expérience de conduite"""
    
    @staticmethod
    @transaction.atomic
    def create_or_update_driver_experience(patient_id, visite, data):
        patient = Conducteur.objects.get(pk=patient_id)
        defaults:DriverExperience = {
            'km_parcourus': data.get('km_parcourus'),
            'nombre_accidents': data.get('nombre_accidents', 0),
            'tranche_horaire': data.get('tranche_horaire', None),
            'dommage': data.get('dommage'),
            'degat': data.get('degat'),
            'date_visite': data.get('date_visite', None)
        }
        driver_exp, created = DriverExperience.objects.update_or_create(
            patient=patient,
            visite=visite,
            defaults=defaults
        )
        return driver_exp

    @staticmethod
    def get_driver_experience(patient_id, visite=None):
        queryset = DriverExperience.objects.filter(patient_id=patient_id)
        if visite:
            return queryset.filter(visite=visite).first()
        return queryset.order_by('-visite').first()

class AntecedentService:
    """Service pour les antécédents médicaux"""
    
    @staticmethod
    @transaction.atomic
    def create_or_update_antecedent(patient_id, data):
        patient = Conducteur.objects.get(pk=patient_id)
        antecedent_data = {
            'antecedents_medico_chirurgicaux': data.get('antecedents_medico_chirurgicaux', ''),
            'pathologie_ophtalmologique': data.get('pathologie_ophtalmologique', ''),
            'addiction': data.get('addiction', False),
            'type_addiction': data.get('type_addiction'),
            'autre_addiction_detail': data.get('autre_addiction_detail', ''),
            'tabagisme_detail': data.get('tabagisme_detail', ''),
            'familial': data.get('familial'),
            'autre_familial_detail': data.get('autre_familial_detail', '')
        }
        antecedent, created = Antecedent.objects.update_or_create(
            patient=patient,
            defaults=antecedent_data
        )
        return antecedent

    @staticmethod
    def get_antecedent(patient_id):
        try:
            return Antecedent.objects.get(patient_id=patient_id)
        except ObjectDoesNotExist:
            return None

class HealthRecordService:
    """Service pour les dossiers médicaux"""
    
    @staticmethod
    @transaction.atomic
    def create_or_update_health_record(patient_id, antecedent_id=None, driver_exp_id=None, examen_ids=None):
        patient = Conducteur.objects.get(pk=patient_id)
        antecedent = Antecedent.objects.filter(pk=antecedent_id).first() if antecedent_id else None
        driver_exp = DriverExperience.objects.filter(pk=driver_exp_id).first() if driver_exp_id else None
        
        if antecedent and antecedent.patient != patient:
            raise ValidationError("L'antécédent ne correspond pas au patient")
        if driver_exp and driver_exp.patient != patient:
            raise ValidationError("L'expérience de conduite ne correspond pas au patient")
        
        health_record, created = HealthRecord.objects.update_or_create(
            patient=patient,
            defaults={
                'antecedant': antecedent,
                'driver_experience': driver_exp
            }
        )
        
        if examen_ids:
            examens = Examens.objects.filter(pk__in=examen_ids, patient=patient)
            health_record.examens.set(examens)
        
        return health_record

    @staticmethod
    def get_full_health_record(patient_id):
        try:
            return HealthRecord.objects.select_related(
                'antecedant', 'driver_experience'
            ).prefetch_related(
                'examens',
                'examens__technical_examen',
                'examens__clinical_examen'
            ).get(patient_id=patient_id)
        except ObjectDoesNotExist:
            return None

    @staticmethod
    @transaction.atomic
    def add_examen_to_health_record(health_record_id, examen_id):
        health_record = HealthRecord.objects.get(pk=health_record_id)
        examen = Examens.objects.get(pk=examen_id)
        if examen.patient != health_record.patient:
            raise ValidationError("L'examen ne correspond pas au patient")
        health_record.examens.add(examen)
        return health_record

class MedicalHistoryService:
    """Service pour l'historique médical complet"""
    
    @staticmethod
    def get_complete_patient_history(patient_id):
        health_record = HealthRecordService.get_full_health_record(patient_id)
        if not health_record:
            return None
            
        return {
            'health_record': health_record,
            'all_driver_experiences': DriverExperience.objects.filter(
                patient_id=patient_id
            ).order_by('visite'),
            'all_examens': health_record.examens.all().order_by('visite'),
            'antecedent': health_record.antecedant,
            'current_driver_experience': health_record.driver_experience
        }