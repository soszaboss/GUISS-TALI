# health_records/selectors.py
from django.db.models import Prefetch, Q, Count, Sum, Avg, Max, Min, F, OuterRef, Subquery
from django.db.models.functions import Coalesce
from apps.health_record.models import (
    HealthRecord,
    Antecedent,
    DriverExperience,
    Examens
)
from apps.patients.models import Conducteur


class HealthRecordSelector:
    """
    Selectors optimisés pour les dossiers médicaux
    """
    
    @staticmethod
    def get_full_health_record(patient_id):
        """
        Récupère un dossier médical complet avec toutes les relations optimisées
        """
        examens_prefetch = Prefetch(
            'examens',
            queryset=Examens.objects.select_related(
                'technical_examen',
                'clinical_examen'
            ).prefetch_related(
                Prefetch(
                    'technical_examen__visual_acuity'
                ),
                Prefetch(
                    'technical_examen__refraction'
                ),
                Prefetch(
                    'technical_examen__ocular_tension'
                ),
                Prefetch(
                    'technical_examen__pachymetry'
                )
            ).order_by('visite')
        )

        return HealthRecord.objects.filter(
            patient_id=patient_id
        ).select_related(
            'antecedant',
            'driver_experience'
        ).prefetch_related(
            examens_prefetch
        ).first()

    @staticmethod
    def get_health_record_with_risk_factors():
        """
        Récupère les dossiers médicaux avec indicateurs de risque
        """
        return HealthRecord.objects.filter(
            Q(risky_patient=True) |
            Q(antecedant__addiction=True) |
            Q(driver_experience__nombre_accidents__gt=0)
        ).select_related(
            'antecedant',
            'driver_experience'
        ).distinct()

    @staticmethod
    def get_patient_medical_history(patient_id):
        """
        Historique médical complet d'un patient avec statistiques
        """
        from django.db.models import Case, When, Value, IntegerField

        return HealthRecord.objects.filter(
            patient_id=patient_id
        ).annotate(
            total_examens=Count('examens'),
            last_visit_date=Max('examens__created'),
            total_accidents=Coalesce(
                Subquery(
                    DriverExperience.objects.filter(
                        patient_id=OuterRef('patient_id')
                    ).order_by('-visite')
                    .values('nombre_accidents')[:1]
                ),
                0
            ),
            risk_score=Case(
                When(risky_patient=True, then=Value(3)),
                When(antecedant__addiction=True, then=Value(2)),
                When(driver_experience__nombre_accidents__gt=0, then=Value(1)),
                default=Value(0),
                output_field=IntegerField()
            )
        ).first()


class DriverExperienceSelector:
    """
    Selectors pour l'expérience de conduite
    """

    @staticmethod
    def get_driver_stats(patient_id=None):
        """
        Statistiques agrégées d'expérience de conduite
        """
        queryset = DriverExperience.objects
        
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
            
        return queryset.aggregate(
            total_km=Coalesce(Sum('km_parcourus'), 0.0),
            avg_km=Coalesce(Avg('km_parcourus'), 0.0),
            max_accidents=Coalesce(Max('nombre_accidents'), 0),
            total_accidents=Coalesce(Sum('nombre_accidents'), 0),
            night_drivers=Count('id', filter=Q(tranche_horaire__icontains='nuit'))
        )

    @staticmethod
    def get_driver_experiences_by_date_range(start_date, end_date):
        """
        Expériences de conduite dans une période donnée
        """
        return DriverExperience.objects.filter(
            date_visite__range=(start_date, end_date)
        ).select_related(
            'patient'
        ).order_by(
            'date_visite'
        )


class AntecedentSelector:
    """
    Selectors pour les antécédents médicaux
    """
    
    @staticmethod
    def get_patients_by_addiction_type(addiction_type):
        """
        Patients filtrés par type d'addiction
        """
        return Conducteur.objects.filter(
            antecedents__type_addiction=addiction_type
        ).select_related(
            'health_record'
        ).prefetch_related(
            'health_record__examens'
        )

    @staticmethod
    def get_antecedents_with_risk_factors():
        """
        Antécédents avec facteurs de risque importants
        """
        return HealthRecord.objects.filter(risky_patient=True)


class MedicalStatsSelector:
    """
    Selectors pour les statistiques médicales
    """
    
    @staticmethod
    def get_global_medical_stats():
        """
        Statistiques globales sur la santé des patients
        """
        from django.db.models import FloatField
        from django.db.models.functions import Cast

        return {
            'patients_count': Conducteur.objects.count(),
            'avg_accidents': DriverExperience.objects.aggregate(
                avg=Avg('nombre_accidents')
            )['avg'],
            'addiction_stats': Antecedent.objects.aggregate(
                total_addicted=Count('id', filter=Q(addiction=True)),
                smokers=Count('id', filter=Q(type_addiction='tabagisme'))
            ),
            'risk_distribution': HealthRecord.objects.aggregate(
                high_risk=Count('id', filter=Q(risky_patient=True)),
                medium_risk=Count('id', filter=Q(
                    Q(antecedant__addiction=True) | 
                    Q(driver_experience__nombre_accidents__gt=2)
                )),
                low_risk=Count('id', filter=Q(
                    Q(antecedant__addiction=False) &
                    Q(driver_experience__nombre_accidents__lte=2)
                ))
            )
        }

    @staticmethod
    def get_patient_evolution_stats(patient_id):
        """
        Statistiques d'évolution pour un patient spécifique
        """
        examens = Examens.objects.filter(
            patient_id=patient_id
        ).select_related(
            'technical_examen'
        ).order_by('visite')

        driver_experiences = DriverExperience.objects.filter(
            patient_id=patient_id
        ).order_by('visite')

        return {
            'examens_evolution': [
                {
                    'visite': e.visite,
                    'date': e.created.date(),
                    'visual_acuity': {
                        'od': e.technical_examen.visual_acuity.avsc_od if hasattr(e, 'technical_examen') and e.technical_examen.visual_acuity else None,
                        'og': e.technical_examen.visual_acuity.avsc_og if hasattr(e, 'technical_examen') and e.technical_examen.visual_acuity else None
                    }
                }
                for e in examens
            ],
            'driver_evolution': [
                {
                    'visite': de.visite,
                    'date': de.date_visite,
                    'km_parcourus': de.km_parcourus,
                    'accidents': de.nombre_accidents
                }
                for de in driver_experiences
            ]
        }