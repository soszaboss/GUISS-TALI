from django.core.exceptions import ValidationError
from .models import (
    Examens, TechnicalExamen, ClinicalExamen,
    VisualAcuity, Refraction, OcularTension, Pachymetry,
    Plaintes, BiomicroscopySegmentAnterieur, BiomicroscopySegmentPosterieur,
    Perimetry, Conclusion, BpSuP, EyeSide
)

class ExamenService:
    """
    Service pour la gestion des examens globaux
    """
    @staticmethod
    def create_examen(patient, visite):
        """
        Crée un nouvel examen pour un patient et une visite
        """
        if Examens.objects.filter(patient=patient, visite=visite).exists():
            raise ValidationError("Un examen existe déjà pour ce patient et cette visite")
        
        return Examens.objects.create(patient=patient, visite=visite)

    @staticmethod
    def get_or_create_examen(patient, visite):
        """
        Récupère ou crée un examen pour un patient et une visite
        """
        examen, created = Examens.objects.get_or_create(
            patient=patient,
            visite=visite,
            defaults={'patient': patient, 'visite': visite}
        )
        return examen

    @staticmethod
    def complete_examen(examen_id):
        """
        Marque un examen comme complet si toutes les conditions sont remplies
        """
        examen = Examens.objects.get(pk=examen_id)
        examen.save()  # La logique de complétion est déjà dans le save()
        return examen


class TechnicalExamenService:
    """
    Service pour la gestion des examens techniques
    """
    @staticmethod
    def init_technical_examen(examen_id):
        """
        Initialise un examen technique pour un examen global
        """
        examen = Examens.objects.get(pk=examen_id)
        if examen.technical_examen:
            return examen.technical_examen
            
        technical_examen = TechnicalExamen.objects.create()
        examen.technical_examen = technical_examen
        examen.save()
        return technical_examen

    @staticmethod
    def update_visual_acuity(technical_examen_id, data):
        """
        Met à jour l'acuité visuelle
        """
        technical_examen = TechnicalExamen.objects.get(pk=technical_examen_id)
        
        if technical_examen.visual_acuity:
            visual_acuity = technical_examen.visual_acuity
            for field, value in data.items():
                setattr(visual_acuity, field, value)
            visual_acuity.save()
        else:
            visual_acuity = VisualAcuity.objects.create(**data)
            technical_examen.visual_acuity = visual_acuity
            technical_examen.save()
        
        return visual_acuity

    @staticmethod
    def update_refraction(technical_examen_id, data):
        """
        Met à jour la réfraction
        """
        technical_examen = TechnicalExamen.objects.get(pk=technical_examen_id)
        
        if technical_examen.refraction:
            refraction = technical_examen.refraction
            for field, value in data.items():
                setattr(refraction, field, value)
            refraction.save()
        else:
            refraction = Refraction.objects.create(**data)
            technical_examen.refraction = refraction
            technical_examen.save()
        
        return refraction

    @staticmethod
    def complete_technical_examen(technical_examen_id):
        """
        Marque un examen technique comme complet
        """
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
    """
    Service pour la gestion des examens cliniques
    """
    @staticmethod
    def init_clinical_examen(examen_id):
        """
        Initialise un examen clinique pour un examen global
        """
        examen = Examens.objects.get(pk=examen_id)
        if examen.clinical_examen:
            return examen.clinical_examen
            
        clinical_examen = ClinicalExamen.objects.create()
        examen.clinical_examen = clinical_examen
        examen.save()
        return clinical_examen

    @staticmethod
    def create_plaintes(clinical_examen_id, data):
        """
        Crée les plaintes pour un examen clinique
        """
        clinical_examen = ClinicalExamen.objects.get(pk=clinical_examen_id)
        
        if hasattr(clinical_examen, 'og') and clinical_examen.og:
            raise ValidationError("Les plaintes existent déjà pour cet examen clinique")
        
        plaintes = Plaintes.objects.create(**data)
        eye_side = EyeSide.objects.create(plaintes=plaintes)
        clinical_examen.og = eye_side
        clinical_examen.od = eye_side  # À adapter selon votre logique
        clinical_examen.save()
        
        return plaintes

    @staticmethod
    def update_segment_anterior(eye_side_id, data):
        """
        Met à jour le segment antérieur
        """
        eye_side = EyeSide.objects.get(pk=eye_side_id)
        
        if eye_side.bp_sg_anterieur:
            segment = eye_side.bp_sg_anterieur
            for field, value in data.items():
                setattr(segment, field, value)
            segment.save()
        else:
            segment = BiomicroscopySegmentAnterieur.objects.create(**data)
            eye_side.bp_sg_anterieur = segment
            eye_side.save()
        
        return segment

    @staticmethod
    def complete_clinical_examen(clinical_examen_id):
        """
        Marque un examen clinique comme complet
        """
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
    """
    Service pour la gestion des conclusions
    """
    @staticmethod
    def update_conclusion(clinical_examen_id, data):
        """
        Met à jour la conclusion d'un examen clinique
        """
        clinical_examen = ClinicalExamen.objects.get(pk=clinical_examen_id)
        
        if clinical_examen.conclusion:
            conclusion = clinical_examen.conclusion
            for field, value in data.items():
                setattr(conclusion, field, value)
            conclusion.save()
        else:
            conclusion = Conclusion.objects.create(**data)
            clinical_examen.conclusion = conclusion
            clinical_examen.save()
        
        return conclusion