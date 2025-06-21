from django.core.exceptions import ValidationError
from django.db import transaction

from apps.examens.models import( BiomicroscopySegmentAnterieur, BiomicroscopySegmentPosterieur, BpSuP, ClinicalExamen, Conclusion, Examens, EyeSide, OcularTension,
Pachymetry, Perimetry, Plaintes, Refraction, TechnicalExamen, VisualAcuity)
from apps.health_record.models import DriverExperience


class ExamenService:
    """Service pour la gestion des examens globaux"""
    
    @staticmethod
    @transaction.atomic
    def create_examen(patient, visite):
        if Examens.objects.filter(patient=patient, visite=visite).exists():
            raise ValidationError("Un examen existe déjà pour ce patient et cette visite")
        return Examens.objects.create(patient=patient, visite=visite)

    @staticmethod
    @transaction.atomic
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

    @staticmethod
    @transaction.atomic
    def delete_examen_complet(examen_id):
        try:
            examen = Examens.objects.get(pk=examen_id)
            visite = examen.visite
            patient = examen.patient
        except Examens.DoesNotExist:
            raise ValueError(f"L'examen avec l'ID {examen_id} n'existe pas.", code=404)

        # Supprimer les sous-examens s'ils existent
        try:
            technical_examen = TechnicalExamen.objects.get(visite=visite, patient=patient)
            if technical_examen:
                technical_examen.delete()
        except TechnicalExamen.DoesNotExist:
            pass
        # Supprimer l'examen clinique s'il existe
        try:
            clinical_examen = ClinicalExamen.objects.get(visite=visite, patient=patient)
            if clinical_examen:   
                clinical_examen.delete()
        except ClinicalExamen.DoesNotExist:
            pass
        # Supprimer l'examen principal
        examen.delete()
        try:
            driver_experience = DriverExperience.objects.get(patient=patient, visite=visite)
            if driver_experience:
                driver_experience.delete()
        except driver_experience.DoesNotExist:
            pass
        return {"detail": f"Examen #{examen_id} et ses dépendances supprimés avec succès."}
class ClinicalExamenService:
    """
    Service pour la gestion des examens cliniques
    """

    @staticmethod
    def init_clinical_examen(examen_id):
        examen = Examens.objects.get(pk=examen_id)
        if examen.clinical_examen:
            return examen.clinical_examen
            
        clinical_examen = ClinicalExamen.objects.create(
            patient=examen.patient,
            visite=examen.visite
        )
        examen.clinical_examen = clinical_examen
        examen.save()
        return clinical_examen

    @staticmethod
    def create_plaintes(clinical_examen_id, data):
        clinical_examen = ClinicalExamen.objects.get(pk=clinical_examen_id)
        plaintes = Plaintes.objects.create(**data)
        clinical_examen.save()
        return plaintes

    @staticmethod
    def update_eye_side(eye_side_id, data):
        eye = EyeSide.objects.get(pk=eye_side_id)
        for field, value in data.items():
            setattr(eye, field, value)
        eye.save()
        return eye

    @staticmethod
    def update_segment_anterior(eye_side_id, data):
        eye = EyeSide.objects.get(pk=eye_side_id)
        if eye.bp_sg_anterieur:
            for field, value in data.items():
                setattr(eye.bp_sg_anterieur, field, value)
            eye.bp_sg_anterieur.save()
        else:
            segment = BiomicroscopySegmentAnterieur.objects.create(**data)
            eye.bp_sg_anterieur = segment
            eye.save()
        return eye.bp_sg_anterieur

    @staticmethod
    def update_segment_posterior(eye_side_id, data):
        eye = EyeSide.objects.get(pk=eye_side_id)
        if eye.bp_sg_posterieur:
            for field, value in data.items():
                setattr(eye.bp_sg_posterieur, field, value)
            eye.bp_sg_posterieur.save()
        else:
            segment = BiomicroscopySegmentPosterieur.objects.create(**data)
            eye.bp_sg_posterieur = segment
            eye.save()
        return eye.bp_sg_posterieur

    @staticmethod
    def update_perimetry(clinical_examen_id, data, replace=False):
        exam = ClinicalExamen.objects.get(pk=clinical_examen_id)

        if exam.perimetry:
            for field, value in data.items():
                if replace:
                    old = getattr(exam.perimetry, field)
                    if old and value and old != value and hasattr(old, 'delete'):
                        old.delete(save=False)
                setattr(exam.perimetry, field, value)
            exam.perimetry.save()
        else:
            peri = Perimetry.objects.create(**data)
            exam.perimetry = peri
            exam.save()

        return exam.perimetry

    @staticmethod
    def update_bp_sup(clinical_examen_id, data, replace=False):
        exam = ClinicalExamen.objects.get(pk=clinical_examen_id)

        if exam.bp_sup:
            for field, value in data.items():
                if replace:
                    old = getattr(exam.bp_sup, field)
                    # Supprimer l'ancien fichier si un nouveau est soumis et différent
                    if old and value and old != value and hasattr(old, 'delete'):
                        old.delete(save=False)
                setattr(exam.bp_sup, field, value)
            exam.bp_sup.save()
        else:
            bp = BpSuP.objects.create(**data)
            exam.bp_sup = bp
            exam.save()

        return exam.bp_sup
    
    @staticmethod
    def create_or_update_eye_side(clinical_examen_id, side: str, data: dict):
        """
        Crée ou met à jour og / od pour un examen clinique.
        - side doit être 'og' ou 'od'
        """
        clinical_examen = ClinicalExamen.objects.get(pk=clinical_examen_id)
        current_eye: EyeSide = getattr(clinical_examen, side, None)

        plaintes_data = data.get("plaintes", {})
        sg_ant_data = data.get("bp_sg_anterieur", {})
        sg_post_data = data.get("bp_sg_posterieur", {})

        if current_eye:
            # Mise à jour si déjà lié
            if plaintes_data:
                for f, v in plaintes_data.items():
                    setattr(current_eye.plaintes, f, v)
                current_eye.plaintes.save()

            if sg_ant_data:
                if current_eye.bp_sg_anterieur:
                    for f, v in sg_ant_data.items():
                        setattr(current_eye.bp_sg_anterieur, f, v)
                    current_eye.bp_sg_anterieur.save()
                else:
                    segment = BiomicroscopySegmentAnterieur.objects.create(**sg_ant_data)
                    current_eye.bp_sg_anterieur = segment

            if sg_post_data:
                if current_eye.bp_sg_posterieur:
                    for f, v in sg_post_data.items():
                        setattr(current_eye.bp_sg_posterieur, f, v)
                    current_eye.bp_sg_posterieur.save()
                else:
                    segment = BiomicroscopySegmentPosterieur.objects.create(**sg_post_data)
                    current_eye.bp_sg_posterieur = segment

            current_eye.save()

        else:
            # Création d’un nouveau EyeSide
            plaintes = Plaintes.objects.create(**plaintes_data)
            sg_anterieur = BiomicroscopySegmentAnterieur.objects.create(**sg_ant_data) if sg_ant_data else None
            sg_posterieur = BiomicroscopySegmentPosterieur.objects.create(**sg_post_data) if sg_post_data else None

            eye_side = EyeSide.objects.create(
                plaintes=plaintes,
                bp_sg_anterieur=sg_anterieur,
                bp_sg_posterieur=sg_posterieur
            )
            setattr(clinical_examen, side, eye_side)
            clinical_examen.save()

        return getattr(clinical_examen, side)
    
    @staticmethod
    def complete_clinical_examen(clinical_examen_id):
        exam = ClinicalExamen.objects.get(pk=clinical_examen_id)
        exam.is_completed = all([
            exam.conclusion,
            exam.perimetry,
            exam.bp_sup,
            exam.og,
            exam.od
        ])
        exam.save()
        return exam

class TechnicalExamenService:
    """
    Service pour la gestion des examens techniques
    """

    @staticmethod
    @transaction.atomic
    def init_technical_examen(examen_id):
        examen = Examens.objects.select_related('technical_examen').get(pk=examen_id)
        print(f"Initialisation de l'examen technique pour l'examen ID: {examen_id}")

        if examen.technical_examen:
            return examen.technical_examen

        print(f"Aucun examen technique trouvé pour l'examen ID: {examen_id}. Création d'un nouvel examen technique.")

        try:
            defaults = {
                            'visual_acuity': None,
                            'refraction': None,
                            'ocular_tension': None,
                            'pachymetry': None,
                            'is_completed': False
                        }
            technical_examen, created = TechnicalExamen.objects.get_or_create(
                patient=examen.patient,
                visite=examen.visite,
                defaults=defaults
            )
            print(f"Examen technique créé: {technical_examen.id}, créé: {created}")
        except Exception as e:
            print(f"ERREUR lors de la création du TechnicalExamen: {e}")
            raise


        print(f"Examen technique créé: {technical_examen.id}, créé: {created}")

        examen.technical_examen = technical_examen
        examen.save(update_fields=["technical_examen"])

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
            visual = VisualAcuity.objects.create(**data)
            technical_examen.visual_acuity = visual
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
            refr = Refraction.objects.create(**data)
            technical_examen.refraction = refr
            technical_examen.save()
        return technical_examen.refraction

    @staticmethod
    @transaction.atomic
    def update_ocular_tension(technical_examen_id, data):
        technical_examen = TechnicalExamen.objects.get(pk=technical_examen_id)
        if technical_examen.ocular_tension:
            for field, value in data.items():
                setattr(technical_examen.ocular_tension, field, value)
            technical_examen.ocular_tension.save()
        else:
            tension = OcularTension.objects.create(**data)
            technical_examen.ocular_tension = tension
            technical_examen.save()
        return technical_examen.ocular_tension

    @staticmethod
    @transaction.atomic
    def update_pachymetry(technical_examen_id, data):
        technical_examen = TechnicalExamen.objects.get(pk=technical_examen_id)
        if technical_examen.pachymetry:
            for field, value in data.items():
                setattr(technical_examen.pachymetry, field, value)
            technical_examen.pachymetry.save()
        else:
            pachy = Pachymetry.objects.create(**data)
            technical_examen.pachymetry = pachy
            technical_examen.save()
        return technical_examen.pachymetry

    @staticmethod
    @transaction.atomic
    def complete_technical_examen(technical_examen_id):
        technical_examen = TechnicalExamen.objects.get(pk=technical_examen_id)
        technical_examen.is_completed = technical_examen.completed()
        technical_examen.save()
        return technical_examen


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