# selectors/clinical_exam_submodels.py

from typing import Optional
from django.core.exceptions import ObjectDoesNotExist

from apps.clinical_examen.models import (
    VisualAcuity, Refraction, OcularTension, Pachymetry,
    ClinicalFindings, Biomicroscopy, PosteriorSegment,
    Perimetry, Conclusion, ExamenClinique, Plaintes
)


def get_visual_acuity(patient_id: int, visit_number: int) -> Optional[VisualAcuity]:
    try:
        return VisualAcuity.objects.select_related('examen_clinique').get(
            patient_id=patient_id, visite=visit_number
        )
    except VisualAcuity.DoesNotExist:
        return None


def get_refraction(patient_id: int, visit_number: int) -> Optional[Refraction]:
    try:
        return Refraction.objects.select_related('examen_clinique').get(
            patient_id=patient_id, visite=visit_number
        )
    except Refraction.DoesNotExist:
        return None


def get_ocular_tension(patient_id: int, visit_number: int) -> Optional[OcularTension]:
    try:
        return OcularTension.objects.select_related('examen_clinique').get(
            patient_id=patient_id, visite=visit_number
        )
    except OcularTension.DoesNotExist:
        return None


def get_pachymetry(patient_id: int, visit_number: int) -> Optional[Pachymetry]:
    try:
        return Pachymetry.objects.select_related('examen_clinique').get(
            patient_id=patient_id, visite=visit_number
        )
    except Pachymetry.DoesNotExist:
        return None


def get_clinical_findings(patient_id: int, visit_number: int) -> Optional[ClinicalFindings]:
    try:
        return ClinicalFindings.objects.select_related('examen_clinique').get(
            patient_id=patient_id, visite=visit_number
        )
    except ClinicalFindings.DoesNotExist:
        return None


def get_biomicroscopy(patient_id: int, visit_number: int) -> Optional[Biomicroscopy]:
    try:
        return Biomicroscopy.objects.select_related('examen_clinique').get(
            patient_id=patient_id, visite=visit_number
        )
    except Biomicroscopy.DoesNotExist:
        return None


def get_posterior_segment(patient_id: int, visit_number: int) -> Optional[PosteriorSegment]:
    try:
        return PosteriorSegment.objects.select_related('examen_clinique').get(
            patient_id=patient_id, visite=visit_number
        )
    except PosteriorSegment.DoesNotExist:
        return None


def get_perimetry(patient_id: int, visit_number: int) -> Optional[Perimetry]:
    try:
        return Perimetry.objects.select_related('examen_clinique').get(
            patient_id=patient_id, visite=visit_number
        )
    except Perimetry.DoesNotExist:
        return None


def get_conclusion(patient_id: int, visit_number: int) -> Optional[Conclusion]:
    try:
        return Conclusion.objects.select_related('examen_clinique').get(
            patient_id=patient_id, visite=visit_number
        )
    except Conclusion.DoesNotExist:
        return None


def get_complaints(patient_id: int, visit_number: int) -> Optional[Plaintes]:
    try:
        return Plaintes.objects.select_related('examen_clinique').get(
            patient_id=patient_id, visite=visit_number
        )
    except Plaintes.DoesNotExist:
        return None


def get_all_exams_by_patient(patient_id: int) -> List[ExamenClinique]:
    """
    Récupère tous les examens cliniques d'un patient, toutes visites confondues.
    """
    return ExamenClinique.objects.filter(patient_id=patient_id).select_related(
        'visualAcuity',
        'conclusion',
        'perimetry',
        'biomicroscopy',
        'plaintes',
        'pachymetry',
        'ocular_tension',
        'refraction'
    ).order_by('visite')

def get_exam_by_patient_and_visit(patient_id: int, visit_number: int) -> Optional[ExamenClinique]:
    """
    Récupère un examen clinique spécifique pour un patient et une visite donnée.
    """
    return ExamenClinique.objects.select_related(
        'visualAcuity',
        'conclusion',
        'perimetry',
        'biomicroscopy',
        'plaintes',
        'pachymetry',
        'ocular_tension',
        'refraction'
    ).filter(patient_id=patient_id, visite=visit_number).first()