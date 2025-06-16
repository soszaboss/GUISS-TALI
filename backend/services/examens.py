from django.core.exceptions import ValidationError
from django.db import transaction
from apps.examens.models import (
    Examens, TechnicalExamen, ClinicalExamen,
    VisualAcuity, Refraction, OcularTension, Pachymetry,
    Plaintes, BiomicroscopySegmentAnterieur, BiomicroscopySegmentPosterieur,
    Perimetry, Conclusion, BpSuP, EyeSide
)

class ExamenService:
    """Service pour la gestion des examens globaux"""
    
    @staticmethod
    @transaction.atomic
    def create_examen(patient, visite):
        if Examens.objects.filter(patient=patient, visite=visite).exists():
            raise ValidationError("Un examen existe déjà pour ce patient et cette visite")
        return Examens.objects.create(patient=patient, visite=visite)

    @staticmethod
    def get_or_create_examen(patient, visite):
        return Examens.objects.get_or_create(
            patient=patient,
            visite=visite,
            defaults={'patient': patient, 'visite': visite}
        )

    @staticmethod
    @transaction.atomic
    def complete_examen(examen_id):
        examen = Examens.objects.get(pk=examen_id)
        examen.save()
        return examen

class TechnicalExamenService:
    """Service pour les examens techniques"""
    
    @staticmethod
    @transaction.atomic
    def init_technical_examen(examen_id):
        examen = Examens.objects.get(pk=examen_id)
        if examen.technical_examen:
            return examen.technical_examen
        technical_examen = TechnicalExamen.objects.create()
        examen.technical_examen = technical_examen
        examen.save()
        return technical_examen

    @staticmethod
    @transaction.atomic
    def update_visual_acuity(technical_examen_id, data):
        technical_examen = TechnicalExamen.objects.get(pk=technical_examen_id)
        if technical_examen.visual_acuity:
            for field, value in data.items():
                setattr(technical_examen.visual_acuity, field, value)
            technical_examen.visual_acuity.save()
        else:
            technical_examen.visual_acuity = VisualAcuity.objects.create(**data)
            technical_examen.save()
        return technical_examen.visual_acuity

    @staticmethod
    @transaction.atomic
    def update_refraction(technical_examen_id, data):
        technical_examen = TechnicalExamen.objects.get(pk=technical_examen_id)
        if technical_examen.refraction:
            for field, value in data.items():
                setattr(technical_examen.refraction, field, value)
            technical_examen.refraction.save()
        else:
            technical_examen.refraction = Refraction.objects.create(**data)
            technical_examen.save()
        return technical_examen.refraction

    @staticmethod
    def complete_technical_examen(technical_examen_id):
        technical_examen = TechnicalExamen.objects.get(pk=technical_examen_id)
        technical_examen.is_completed = all([
            technical_examen.visual_acuity,
            technical_examen.refraction,
            technical_examen.ocular_tension,
            technical_examen.pachymetry
        ])
        technical_examen.save()
        return technical_examen

class ClinicalExamenService:
    """Service pour les examens cliniques"""
    
    @staticmethod
    @transaction.atomic
    def init_clinical_examen(examen_id):
        examen = Examens.objects.get(pk=examen_id)
        if examen.clinical_examen:
            return examen.clinical_examen
        clinical_examen = ClinicalExamen.objects.create()
        examen.clinical_examen = clinical_examen
        examen.save()
        return clinical_examen

    @staticmethod
    @transaction.atomic
    def create_plaintes(clinical_examen_id, data):
        clinical_examen = ClinicalExamen.objects.get(pk=clinical_examen_id)
        if hasattr(clinical_examen, 'og'):
            raise ValidationError("Les plaintes og existent déjà")
        if hasattr(clinical_examen, 'od'):
            raise ValidationError("Les plaintes od existent déjà")
        
        od = data.get('od', None)
        og = data.get('og', None)
        plaintes_od = Plaintes.objects.create(**od)
        plaintes_og = Plaintes.objects.create(**og)
        clinical_examen.og = plaintes_og
        clinical_examen.od = plaintes_od
        clinical_examen.save()
        return {
            'od': od,
            'og': og
        }

    @staticmethod
    @transaction.atomic
    def update_segment_anterior(eye_side_id, data):
        eye_side = EyeSide.objects.get(pk=eye_side_id)
        if eye_side.bp_sg_anterieur:
            for field, value in data.items():
                setattr(eye_side.bp_sg_anterieur, field, value)
            eye_side.bp_sg_anterieur.save()
        else:
            eye_side.bp_sg_anterieur = BiomicroscopySegmentAnterieur.objects.create(**data)
            eye_side.save()
        return eye_side.bp_sg_anterieur

    @staticmethod
    def complete_clinical_examen(clinical_examen_id):
        clinical_examen = ClinicalExamen.objects.get(pk=clinical_examen_id)
        clinical_examen.is_completed = all([
            clinical_examen.conclusion,
            clinical_examen.perimetry,
            clinical_examen.og,
            clinical_examen.od,
            clinical_examen.bp_sup
        ])
        clinical_examen.save()
        return clinical_examen

class ConclusionService:
    """Service pour les conclusions"""
    
    @staticmethod
    @transaction.atomic
    def update_conclusion(clinical_examen_id, data):
        clinical_examen = ClinicalExamen.objects.get(pk=clinical_examen_id)
        if clinical_examen.conclusion:
            for field, value in data.items():
                setattr(clinical_examen.conclusion, field, value)
            clinical_examen.conclusion.save()
        else:
            clinical_examen.conclusion = Conclusion.objects.create(**data)
            clinical_examen.save()
        return clinical_examen.conclusion