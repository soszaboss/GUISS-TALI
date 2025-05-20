from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _
from django_extensions.db.models import TimeStampedModel

from apps.clinical_examen.base import Base
from apps.clinical_examen.models import ExamenClinique
from apps.patients.models import Conducteur
from utils.models.choices import AddictionTypeChoices, FamilialChoices, DommageChoices, DegatChoices


class DriverExperience(Base):
    """
    Informations sur l'expérience de conduite du patient.
    """
    km_parcourus = models.FloatField(_('Kilomètres parcourus'), null=True)
    nombre_accidents = models.PositiveIntegerField(_('Nombre d\'accidents'), default=0)
    tranche_horaire = models.TimeField(_('Tranche horaire de conduite'))
    dommage = models.CharField(_('Dommages'), max_length=10, choices=DommageChoices.choices, null=True)
    degat = models.CharField(_('Dégâts'), max_length=10, choices=DegatChoices.choices, null=True)

    class Meta:
        verbose_name = _('Expérience de conduite')
        verbose_name_plural = _('Expériences de conduite')
        unique_together = ('patient', 'visite')

    def __str__(self):
        return f"{self.visite}ᵉ visite de {self.patient.get_full_name()}"


class Antecedent(TimeStampedModel):
    """
    Informations médicales et familiales du patient.
    """
    patient = models.OneToOneField(Conducteur, on_delete=models.CASCADE)
    antecedents_medico_chirurgicaux = models.TextField(_('Antécédents médico-chirurgicaux'))
    pathologie_ophtalmologique = models.TextField(_('Pathologies ophtalmologiques'))

    # Addictions
    addiction = models.BooleanField(_('Addiction'), default=False)
    type_addiction = models.CharField(_('Type d\'addiction'), choices=AddictionTypeChoices.choices, max_length=15, null=True)
    autre_addiction_detail = models.CharField(_('Autre addiction (si sélectionné)'), max_length=255, null=True, blank=True)
    tabagisme_detail = models.CharField(_('Tabagisme (paquets/année)'), max_length=50, null=True, blank=True)

    # Antécédents familiaux
    familial = models.CharField(_('Familiaux'), choices=FamilialChoices.choices, max_length=10, null=True)
    autre_familial_detail = models.CharField(_('Autres familiaux (si sélectionné)'), max_length=255, null=True, blank=True)

    class Meta:
        verbose_name = _('Antécédent')
        verbose_name_plural = _('Antécédents')

    def clean(self):
        if self.addiction:
            if not self.type_addiction:
                raise ValidationError(_('Veuillez spécifier le type d\'addiction.'))
            if self.type_addiction == 'tabagisme' and not self.tabagisme_detail:
                raise ValidationError(_('Veuillez indiquer les détails pour le tabagisme.'))
            if self.type_addiction == 'other' and not self.autre_addiction_detail:
                raise ValidationError(_('Veuillez indiquer les détails pour l\'autre addiction.'))

        if self.familial == 'other' and not self.autre_familial_detail:
            raise ValidationError(_('Veuillez préciser les autres antécédents familiaux.'))

    def __str__(self):
        return f"Antécédents - {self.patient.get_full_name()}"


class HealthRecord(TimeStampedModel):
    """
    Dossier médical complet du conducteur.
    """
    patient = models.OneToOneField(Conducteur, on_delete=models.CASCADE)
    antecedant = models.OneToOneField(Antecedent, on_delete=models.CASCADE)
    clinical_examen = models.ManyToManyField(ExamenClinique)
    driver_experience = models.ManyToManyField(DriverExperience)

    class Meta:
        verbose_name = _('Dossier médical')
        verbose_name_plural = _('Dossiers médicaux')

    def __str__(self):
        return f"Dossier médical - {self.patient.get_full_name()}"
