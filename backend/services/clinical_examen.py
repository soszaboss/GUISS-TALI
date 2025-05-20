from django.db import transaction, models
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from typing import Dict, Optional, Type, List, Tuple
import logging

from .models import (
    ExamenClinique, VisualAcuity, Refraction, OcularTension,
    Pachymetry, Biomicroscopy, Plaintes,
    Conclusion, Perimetry, SegmentAnterieur, SegmentPosterieur
)

logger = logging.getLogger(__name__)


class ExamInitializationService:
    """
    Service d'initialisation des examens avec création complète des modèles
    """

    RELATED_MODELS = {
        'visualAcuity': VisualAcuity,
        'refraction': Refraction,
        'ocular_tension': OcularTension,
        'pachymetry': Pachymetry,
        'plaintes': Plaintes,
        'conclusion': Conclusion,
        'perimetry': Perimetry,
        'biomicroscopy': Biomicroscopy
    }

    @classmethod
    @transaction.atomic
    def initialize_patient_exams(cls, patient_id: int) -> Tuple[List[ExamenClinique], List[Exception]]:
        """
        Crée les 3 examens complets avec tous les sous-modèles initiaux
        Retourne un tuple (exams_created, errors)
        """
        exams = []
        errors = []

        for visit in [1, 2, 3]:
            try:
                exam = cls._create_full_exam(patient_id, visit)
                exams.append(exam)
                logger.info(f"Initialized complete exam {exam.id} for patient {patient_id}")
            except Exception as e:
                logger.error(f"Failed to initialize exam for visit {visit}: {str(e)}")
                errors.append(e)

        return exams, errors

    @classmethod
    def _create_full_exam(cls, patient_id: int, visit: int) -> ExamenClinique:
        """Crée un examen avec tous les sous-modèles nécessaires"""
        exam = ExamenClinique.objects.create(
            patient_id=patient_id,
            visite=visit,
            status='draft'
        )

        # Création des segments oculaires
        segment_anterieur = SegmentAnterieur.objects.create(
            patient_id=patient_id,
            visite=visit,
            segment='NORMAL'
        )
        segment_posterieur = SegmentPosterieur.objects.create(
            patient_id=patient_id,
            visite=visit,
            segment='NORMAL'
        )

        # Création de tous les sous-modèles liés
        Biomicroscopy.objects.create(
            examen_clinique=exam,
            segment_anterieur=segment_anterieur,
            segment_posterieur=segment_posterieur
        )

        for field, model in cls.RELATED_MODELS.items():
            if field != 'biomicroscopy':
                model.objects.create(examen_clinique=exam)

        return exam


class ExamDataService:
    """
    Service centralisé pour la gestion des données d'examen
    """

    @classmethod
    def get_full_exam(cls, exam_id: int) -> ExamenClinique:
        """
        Récupère un examen avec toutes ses relations optimisées
        Utilise select_related et prefetch_related pour les performances
        """
        return ExamenClinique.objects.select_related(
            'visualAcuity',
            'refraction',
            'ocular_tension',
            'pachymetry',
            'plaintes',
            'conclusion',
            'perimetry',
            'biomicroscopy'
        ).prefetch_related(
            'biomicroscopy__segment_anterieur',
            'biomicroscopy__segment_posterieur'
        ).get(pk=exam_id)

    @classmethod
    @transaction.atomic
    def update_exam_field(
            cls,
            exam_id: int,
            model_name: str,
            field_name: str,
            value,
            validation_func: Optional[callable] = None
    ) -> models.Model:
        """
        Met à jour un champ spécifique d'un sous-modèle avec validation
        """
        exam = ExamenClinique.objects.get(pk=exam_id)
        model_class = ExamInitializationService.RELATED_MODELS.get(model_name)

        if not model_class:
            raise ValidationError(_("Modèle invalide"))

        instance, created = model_class.objects.get_or_create(examen_clinique=exam)

        # Validation personnalisée si fournie
        if validation_func:
            validation_func(value)

        # Mise à jour du champ
        setattr(instance, field_name, value)
        instance.full_clean()
        instance.save()

        # Mise à jour du statut si nécessaire
        cls._update_exam_status(exam)

        return instance

    @staticmethod
    def _update_exam_status(exam: ExamenClinique):
        """Met à jour le statut de l'examen en fonction de son avancement"""
        if exam.status == 'draft' and ExamValidationService.is_tech_ready(exam):
            exam.status = 'tech_review'
            exam.save()


class ExamValidationService:
    """
    Service de validation avancé avec vérifications multi-niveaux
    """

    TECH_REQUIRED_FIELDS = {
        'visualAcuity': ['avsc_od', 'avsc_og'],
        'ocular_tension': ['od', 'og'],
        'pachymetry': ['od', 'og']
    }

    MEDICAL_REQUIRED_FIELDS = {
        'conclusion': ['vision', 'cat'],
        'biomicroscopy': ['segment_anterieur']
    }

    @classmethod
    def is_tech_ready(cls, exam: ExamenClinique) -> bool:
        """Vérifie si l'examen technique est complet"""
        for model, fields in cls.TECH_REQUIRED_FIELDS.items():
            if not hasattr(exam, model):
                return False
            for field in fields:
                if getattr(getattr(exam, model), field) in [None, ""]:
                    return False
        return True

    @classmethod
    def is_medically_complete(cls, exam: ExamenClinique) -> bool:
        """Vérifie si l'examen médical est complet"""
        for model, fields in cls.MEDICAL_REQUIRED_FIELDS.items():
            if not hasattr(exam, model):
                return False
            for field in fields:
                if getattr(getattr(exam, model), field) in [None, ""]:
                    return False
        return True

    @classmethod
    @transaction.atomic
    def validate_exam(
            cls,
            exam_id: int,
            user_role: str,
            user_id: int
    ) -> ExamenClinique:
        """Valide l'examen selon le rôle de l'utilisateur"""
        exam = ExamenClinique.objects.get(pk=exam_id)

        if user_role == 'technician':
            if not cls.is_tech_ready(exam):
                raise ValidationError(_("Examen technique incomplet"))
            exam.status = 'tech_review'
            exam.tech_validated_by = user_id
            exam.tech_validated_at = timezone.now()

        elif user_role == 'doctor':
            if exam.status != 'tech_review':
                raise ValidationError(_("Examen technique non validé"))
            if not cls.is_medically_complete(exam):
                raise ValidationError(_("Examen médical incomplet"))
            exam.status = 'completed'
            exam.med_validated_by = user_id
            exam.med_validated_at = timezone.now()

        exam.save()
        logger.info(f"Exam {exam_id} validated by {user_role} {user_id}")
        return exam


class ExamExportService:
    """
    Service d'export des données d'examen
    """

    @classmethod
    def generate_pdf_report(cls, exam_id: int) -> bytes:
        """Génère un rapport PDF complet"""
        exam = ExamDataService.get_full_exam(exam_id)
        # Utilisation de WeasyPrint ou autre librairie PDF
        return pdf_content

    @classmethod
    def export_to_csv(cls, exam_ids: List[int]) -> str:
        """Exporte les données au format CSV"""
        exams = ExamenClinique.objects.filter(id__in=exam_ids)
        # Construction du CSV
        return csv_data


class ExamCleanupService:
    """
    Service de nettoyage et suppression sécurisée
    """

    @classmethod
    @transaction.atomic
    def delete_exam(cls, exam_id: int) -> None:
        """Supprime un examen et tous ses sous-modèles de manière sécurisée"""
        exam = ExamenClinique.objects.get(pk=exam_id)

        # Suppression ordonnée pour éviter les ForeignKey violations
        try:
            if hasattr(exam, 'biomicroscopy'):
                if exam.biomicroscopy.segment_anterieur:
                    exam.biomicroscopy.segment_anterieur.delete()
                if exam.biomicroscopy.segment_posterieur:
                    exam.biomicroscopy.segment_posterieur.delete()
                exam.biomicroscopy.delete()
        except Exception as e:
            logger.error(f"Error deleting biomicroscopy: {str(e)}")

        # Suppression des autres sous-modèles
        for field in ExamInitializationService.RELATED_MODELS.keys():
            try:
                if hasattr(exam, field):
                    getattr(exam, field).delete()
            except Exception as e:
                logger.error(f"Error deleting {field}: {str(e)}")

        exam.delete()
        logger.warning(f"Exam {exam_id} deleted")