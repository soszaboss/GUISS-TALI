from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _
from django_extensions.db.models import TimeStampedModel

from apps.examens.base import Base
from apps.examens.models import Examens
from apps.patients.models import Conducteur
from utils.models.choices import AddictionTypeChoices, FamilialChoices, DommageChoices, DegatChoices


class DriverExperience(Base):
    km_parcourus = models.FloatField(_('Kilomètres parcourus'), null=True, blank=True)  # Ajout de blank=True
    nombre_accidents = models.PositiveIntegerField(_('Nombre d\'accidents'), default=0)
    tranche_horaire = models.CharField(
        _('Tranche horaire de conduite'),
        max_length=50, null=True,blank=True
        )  # Changé de TimeField
    dommage = models.CharField(_('Dommages'), max_length=10, choices=DommageChoices.choices, null=True, blank=True)
    degat = models.CharField(_('Dégâts'), max_length=10, choices=DegatChoices.choices, null=True, blank=True)
    date_visite = models.DateField(_('Date de visite'), null=True, default=None, blank=True)
    class Meta:
        verbose_name = _('Expérience de conduite')
        verbose_name_plural = _('Expériences de conduite')
        unique_together = ('patient', 'visite')

    def clean(self):
        super().clean()
        if self.km_parcourus is not None and self.km_parcourus < 0:
            raise ValidationError(_('Les kilomètres parcourus ne peuvent pas être négatifs'))
        if self.nombre_accidents < 0:
            raise ValidationError(_('Le nombre d\'accidents ne peut pas être négatif'))

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)
    
    
class Antecedent(TimeStampedModel):
    patient = models.OneToOneField(Conducteur, on_delete=models.CASCADE, related_name='antecedents')
    antecedents_medico_chirurgicaux = models.TextField(_('Antécédents médico-chirurgicaux'), blank=True)
    pathologie_ophtalmologique = models.TextField(_('Pathologies ophtalmologiques'), blank=True)

    # Addictions
    addiction = models.BooleanField(_('Addiction'), default=False)
    type_addiction = models.CharField(_('Type d\'addiction'), choices=AddictionTypeChoices.choices, 
                                    max_length=15, null=True, blank=True)
    autre_addiction_detail = models.CharField(_('Détail autre addiction'), max_length=255, blank=True)
    tabagisme_detail = models.CharField(_('Tabagisme (paquets/année)'), max_length=50, blank=True)

    # Antécédents familiaux
    familial = models.CharField(_('Antécédents familiaux'), choices=FamilialChoices.choices, 
                              max_length=10, null=True, blank=True)
    autre_familial_detail = models.CharField(_('Détail autre familial'), max_length=255, blank=True)

    class Meta:
        verbose_name = _('Antécédent')
        verbose_name_plural = _('Antécédents')

    def clean(self):
        super().clean()
        # Validation des addictions
        if self.addiction and not self.type_addiction:
            raise ValidationError(_('Veuillez spécifier le type d\'addiction.'))
        
        if self.type_addiction == 'tabagisme' and not self.tabagisme_detail:
            raise ValidationError(_('Veuillez indiquer les détails pour le tabagisme.'))
            
        if self.type_addiction == 'other' and not self.autre_addiction_detail:
            raise ValidationError(_('Veuillez indiquer les détails pour l\'autre addiction.'))
        
        # Validation des antécédents familiaux
        if self.familial == 'other' and not self.autre_familial_detail:
            raise ValidationError(_('Veuillez préciser les autres antécédents familiaux.'))

    def save(self, **kwargs):
        self.full_clean()
        return super().save(**kwargs)
    def __str__(self):
        return f"Antécédents - {self.patient.get_full_name()}"


class HealthRecord(TimeStampedModel):
    """
    Dossier médical complet du conducteur.
    """
    risky_patient = models.BooleanField(
        _('risky patient'),
        default=False
    )
    patient = models.OneToOneField(
        Conducteur, 
        on_delete=models.CASCADE,
        related_name='health_record'
    )
    antecedant = models.OneToOneField(
        Antecedent,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    examens = models.ManyToManyField(Examens, blank=True)
    driver_experience = models.ForeignKey(
        DriverExperience,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    class Meta:
        verbose_name = _('Dossier médical')
        verbose_name_plural = _('Dossiers médicaux')

    def __str__(self):
        return f"Dossier médical - {self.patient.get_full_name()}"

    def clean(self):
        super().clean()
        # Vérification que le patient correspond dans toutes les relations
        if (self.antecedant and self.antecedant.patient != self.patient) or \
           (self.driver_experience and self.driver_experience.patient != self.patient):
            raise ValidationError(_('Incohérence dans les données patient'))
        
    def save(self, **kwargs):
        self.full_clean()
        return super().save(**kwargs)