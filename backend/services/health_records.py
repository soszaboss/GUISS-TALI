from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.db import transaction
from apps.health_record.models import (
    DriverExperience, Antecedent, HealthRecord, Conducteur, Examens
)
from services.examens import ClinicalExamenService, ExamenService, TechnicalExamenService

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
            'date_visite': data.get('date_visite', None) if data.get('date_visite') and data.get('date_visite') != '' else None
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
    
    @staticmethod
    @transaction.atomic
    def delete_driver_experience(patient_id, visite=None):
        """
        Supprime une ou plusieurs expériences de conduite selon les paramètres.
        
        :param patient_id: ID du conducteur concerné
        :param visite: Si précisé, supprime uniquement l'expérience pour cette visite
        """
        queryset = DriverExperience.objects.filter(patient_id=patient_id)
        if visite is not None:
            experience = queryset.filter(visite=visite).first()
            if experience:
                experience.delete()
                return True
            return False
        else:
            # Supprime toutes les expériences du patient
            deleted, _ = queryset.delete()
            return deleted > 0


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
    def create_or_update_health_record(patient_id, antecedent_id=None, driver_exp_ids=None, examen_ids=None):
        patient = Conducteur.objects.get(pk=patient_id)
        antecedent = Antecedent.objects.filter(pk=antecedent_id).first() if antecedent_id else None
        
        if antecedent and antecedent.patient != patient:
            raise ValidationError("L'antécédent ne correspond pas au patient")
        
        health_record, created = HealthRecord.objects.update_or_create(
            patient=patient,
            defaults={
                'antecedant': antecedent,
            }
        )
        
        if examen_ids:
            examens = Examens.objects.filter(pk__in=examen_ids, patient=patient)
            health_record.examens.add(*examens)

        if driver_exp_ids:
            driver_experience = DriverExperience.objects.filter(pk__in=driver_exp_ids, patient=patient)
            health_record.driver_experience.add(*driver_experience)

        return health_record

    @staticmethod
    @transaction.atomic
    def create_or_update_health_record_with_exam_and_experience(patient_id, visite, driver_exp_data=None, examen_data=None):
        """
        Crée ou met à jour :
        - une expérience de conduite
        - un examen (et ses sous-examens)
        - lie les deux à un HealthRecord
        
        :param patient_id: ID du patient
        :param visite: numéro de visite
        :param driver_exp_data: données expérience de conduite
        :param examen_data: {
            "technical_examen": {...},
            "clinical_examen": {...}
        }
        """
        patient = Conducteur.objects.get(pk=patient_id)

        # Créer ou mettre à jour l'expérience de conduite
        driver_exp = None
        if driver_exp_data:
            driver_exp = DriverExperienceService.create_or_update_driver_experience(
                patient_id=patient_id,
                visite=visite,
                data=driver_exp_data
            )

        # Créer ou récupérer l'examen
        examen, _ = ExamenService.get_or_create_examen(patient, visite)

        # Créer ou mettre à jour les sous-examens
        if examen_data:
            if 'technical_examen' in examen_data:
                tech = TechnicalExamenService.init_technical_examen(examen.id)
                tech_data = examen_data['technical_examen']
                if 'visual_acuity' in tech_data:
                    TechnicalExamenService.update_visual_acuity(tech.id, tech_data['visual_acuity'])
                if 'refraction' in tech_data:
                    TechnicalExamenService.update_refraction(tech.id, tech_data['refraction'])
                if 'ocular_tension' in tech_data:
                    TechnicalExamenService.update_ocular_tension(tech.id, tech_data['ocular_tension'])
                if 'pachymetry' in tech_data:
                    TechnicalExamenService.update_pachymetry(tech.id, tech_data['pachymetry'])

            if 'clinical_examen' in examen_data:
                clinical = ClinicalExamenService.init_clinical_examen(examen.id)
                cl_data = examen_data['clinical_examen']
                if 'conclusion' in cl_data:
                    from services.examens import ConclusionService
                    ConclusionService.update_conclusion(clinical.id, cl_data['conclusion'])
                if 'perimetry' in cl_data:
                    ClinicalExamenService.update_perimetry(clinical.id, cl_data['perimetry'])
                if 'bp_sup' in cl_data:
                    ClinicalExamenService.update_bp_sup(clinical.id, cl_data['bp_sup'])
                if 'og' in cl_data:
                    ClinicalExamenService.create_or_update_eye_side(clinical.id, 'og', cl_data['og'])
                if 'od' in cl_data:
                    ClinicalExamenService.create_or_update_eye_side(clinical.id, 'od', cl_data['od'])

        # Lier à un HealthRecord
        health_record, _ = HealthRecord.objects.get_or_create(patient=patient)

        # Ajouter l'examen (ManyToMany)
        health_record.examens.add(examen)

        # Ajouter l'expérience de conduite
        if driver_exp:
            health_record.driver_experience.add(driver_exp)

        health_record.save()
        return health_record

    @staticmethod
    def get_full_health_record(patient_id):
        """
        Retourne un dossier complet avec tous les examens et expériences.
        """
        try:
            return HealthRecord.objects.select_related(
                'antecedant'
            ).prefetch_related(
                'examens',
                'examens__technical_examen',
                'examens__clinical_examen',
                'driver_experience',
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
    pass
    # @staticmethod
    # def get_complete_patient_history(patient_id):
    #     health_record = HealthRecordService.get_full_health_record(patient_id)
    #     if not health_record:
    #         return None
            
    #     return {
    #         'health_record': health_record,
    #         'all_driver_experiences': DriverExperience.objects.filter(
    #             patient_id=patient_id
    #         ).order_by('visite'),
    #         'all_examens': health_record.examens.all().order_by('visite'),
    #         'antecedent': health_record.antecedant,
    #         'current_driver_experience': health_record.driver_experience
    #     }