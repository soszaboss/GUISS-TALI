from django.db.models import Q, Prefetch
from apps.examens.models import (
    Examens, TechnicalExamen, ClinicalExamen,
    VisualAcuity, Refraction, OcularTension, Pachymetry,
    Plaintes, BiomicroscopySegmentAnterieur, BiomicroscopySegmentPosterieur,
    Perimetry, Conclusion, BpSuP, EyeSide
)

class ExamenSelector:
    """
    Selectors pour les examens globaux
    """
    @staticmethod
    def get_examen_by_patient_and_visit(patient_id, visite):
        """
        Récupère un examen pour un patient et une visite donnée
        """
        return Examens.objects.filter(
            patient_id=patient_id,
            visite=visite
        ).first()

    @staticmethod
    def get_completed_examens_for_patient(patient_id):
        """
        Récupère tous les examens complétés pour un patient
        """
        return Examens.objects.filter(
            patient_id=patient_id,
            is_completed=True
        ).order_by('-visite')

    @staticmethod
    def get_last_examen_for_patient(patient_id):
        """
        Récupère le dernier examen (par visite) pour un patient
        """
        return Examens.objects.filter(
            patient_id=patient_id
        ).order_by('-visite').first()

    @staticmethod
    def get_examens_with_technical_details():
        """
        Récupère tous les examens avec les détails techniques préchargés
        """
        return Examens.objects.select_related(
            'technical_examen',
            'technical_examen__visual_acuity',
            'technical_examen__refraction',
            'technical_examen__ocular_tension',
            'technical_examen__pachymetry'
        ).all()


class TechnicalExamenSelector:
    """
    Selectors pour les examens techniques
    """
    @staticmethod
    def get_technical_examen_with_details(technical_examen_id):
        """
        Récupère un examen technique avec tous ses détails
        """
        return TechnicalExamen.objects.select_related(
            'visual_acuity',
            'refraction',
            'ocular_tension',
            'pachymetry'
        ).get(pk=technical_examen_id)

    @staticmethod
    def get_incomplete_technical_examens():
        """
        Récupère les examens techniques incomplets
        """
        return TechnicalExamen.objects.filter(
            is_completed=False
        ).prefetch_related('parent_examen')


class ClinicalExamenSelector:
    """
    Selectors pour les examens cliniques
    """
    @staticmethod
    def get_clinical_examen_with_details(clinical_examen_id):
        """
        Récupère un examen clinique avec tous ses détails
        """
        return ClinicalExamen.objects.select_related(
            'conclusion',
            'perimetry',
            'bp_sup'
        ).prefetch_related(
            Prefetch('og', queryset=EyeSide.objects.select_related(
                'plaintes',
                'bp_sg_anterieur',
                'bp_sg_posterieur'
            )),
            Prefetch('od', queryset=EyeSide.objects.select_related(
                'plaintes',
                'bp_sg_anterieur',
                'bp_sg_posterieur'
            ))
        ).get(pk=clinical_examen_id)

    @staticmethod
    def get_clinical_examens_by_symptom(symptom):
        """
        Récupère les examens cliniques filtrés par symptôme
        """
        return ClinicalExamen.objects.filter(
            Q(og__plaintes__od_symptom=symptom)
        ).distinct()


class PatientExamenHistorySelector:
    """
    Selectors pour l'historique des examens d'un patient
    """
    @staticmethod
    def get_patient_full_history(patient_id):
        """
        Récupère l'historique complet des examens d'un patient avec tous les détails
        """
        return Examens.objects.filter(
            patient_id=patient_id
        ).select_related(
            'technical_examen',
            'clinical_examen'
        ).prefetch_related(
            Prefetch('technical_examen', queryset=TechnicalExamen.objects.select_related(
                'visual_acuity',
                'refraction',
                'ocular_tension',
                'pachymetry'
            )),
            Prefetch('clinical_examen', queryset=ClinicalExamen.objects.select_related(
                'conclusion',
                'perimetry',
                'bp_sup'
            ).prefetch_related(
                Prefetch('og', queryset=EyeSide.objects.select_related(
                    'plaintes',
                    'bp_sg_anterieur',
                    'bp_sg_posterieur'
                )),
                Prefetch('od', queryset=EyeSide.objects.select_related(
                    'plaintes',
                    'bp_sg_anterieur',
                    'bp_sg_posterieur'
                ))
            ))
        ).order_by('-visite')


class StatsSelector:
    """
    Selectors pour les statistiques et rapports
    """
    @staticmethod
    def get_examens_stats(start_date, end_date):
        """
        Récupère les statistiques des examens entre deux dates
        """
        from django.db.models import Count, Q
        
        return Examens.objects.filter(
            created__range=(start_date, end_date)
        ).aggregate(
            total_examens=Count('id'),
            completed_examens=Count('id', filter=Q(is_completed=True)),
            technical_only=Count('id', filter=Q(technical_examen__is_completed=True) & Q(clinical_examen__isnull=True)),
            clinical_only=Count('id', filter=Q(clinical_examen__is_completed=True) & Q(technical_examen__isnull=True))
        )

    @staticmethod
    def get_common_symptoms(start_date, end_date, limit=5):
        """
        Récupère les symptômes les plus courants entre deux dates
        """
        from django.db.models import Count
        
        eye_symptom = Plaintes.objects.filter(
            created__range=(start_date, end_date)
        ).values('od_symptom') \
         .annotate(count=Count('od_symptom')) \
         .order_by('-count')[:limit]


        return {
            'eye_symptom': eye_symptom,
        }