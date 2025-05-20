from typing import Dict, Optional, List
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils.translation import gettext_lazy as _
import logging

from apps.patients.models import Conducteur
from apps.clinical_examen.models import ExamenClinique
from apps.health_record.models import HealthRecord, Antecedent, DriverExperience

logger = logging.getLogger(__name__)


class HealthRecordService:
    """
    Service principal de gestion des dossiers médicaux.
    """

    @classmethod
    @transaction.atomic
    def create(cls, patient_id: int) -> HealthRecord:
        patient = Conducteur.objects.get(pk=patient_id)

        if HealthRecord.objects.filter(patient=patient).exists():
            raise ValidationError(_("Un dossier médical existe déjà pour ce patient."))

        antecedent = AntecedentService.create(patient)
        record = HealthRecord.objects.create(patient=patient, antecedant=antecedent)

        # Associe les examens cliniques et expériences si déjà créés
        record.clinical_examen.set(ExamenClinique.objects.filter(patient=patient))
        record.driver_experience.set(DriverExperience.objects.filter(patient=patient))

        logger.info(f"Dossier médical créé pour le patient {patient_id}")
        return record

    @classmethod
    def get_by_patient(cls, patient_id: int) -> Optional[HealthRecord]:
        try:
            return HealthRecord.objects.select_related("antecedant", "patient") \
                .prefetch_related("clinical_examen", "driver_experience") \
                .get(patient_id=patient_id)
        except HealthRecord.DoesNotExist:
            return None

    @classmethod
    def delete(cls, patient_id: int) -> None:
        record = cls.get_by_patient(patient_id)
        if not record:
            raise ValidationError(_("Dossier médical introuvable."))

        record.clinical_examen.all().delete()
        record.driver_experience.all().delete()
        record.antecedant.delete()
        record.delete()
        logger.info(f"Dossier médical du patient {patient_id} supprimé.")


class AntecedentService:

    @classmethod
    def create(cls, patient: Conducteur) -> Antecedent:
        return Antecedent.objects.create(
            patient=patient,
            antecedents_medico_chirurgicaux="",
            pathologie_ophtalmologique="",
        )

    @classmethod
    def update(cls, patient_id: int, data: Dict) -> Antecedent:
        antecedent = Antecedent.objects.get(patient_id=patient_id)

        for field, value in data.items():
            setattr(antecedent, field, value)

        antecedent.full_clean()
        antecedent.save()
        return antecedent


class DriverExperienceService:

    @classmethod
    def create(cls, patient_id: int, visite: int) -> DriverExperience:
        return DriverExperience.objects.create(
            patient_id=patient_id,
            visite=visite,
            km_parcourus=0,
            nombre_accidents=0
        )

    @classmethod
    def update(cls, patient_id: int, visite: int, data: Dict) -> DriverExperience:
        try:
            instance = DriverExperience.objects.get(patient_id=patient_id, visite=visite)
        except DriverExperience.DoesNotExist:
            instance = cls.create(patient_id, visite)

        for field, value in data.items():
            setattr(instance, field, value)

        instance.full_clean()
        instance.save()
        return instance
