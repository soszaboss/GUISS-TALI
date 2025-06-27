from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _
from django_extensions.db.models import TimeStampedModel

from apps.examens.base import Base
from apps.examens.models import Examens
from apps.patients.models import Conducteur
from utils.models.choices import AddictionTypeChoices, ArretCauseChoices, DECESCauseChoices, EtatConducteurChoices, FamilialChoices, DommageChoices
from django.contrib.postgres.fields import ArrayField

# Antécédents médicaux (modifiés)
class Antecedent(TimeStampedModel):
    patient = models.OneToOneField(Conducteur, on_delete=models.CASCADE, related_name='antecedents')
    antecedents_medico_chirurgicaux = models.TextField(_('Antécédents médico-chirurgicaux'), blank=True)
    pathologie_ophtalmologique = models.TextField(_('Pathologies ophtalmologiques'), blank=True)

    # Addictions (multi-choix)
    addiction = models.BooleanField(_('Addiction'), default=False)
    type_addiction = ArrayField(
        models.CharField(_('Type d\'addiction'), choices=AddictionTypeChoices.choices, max_length=18),
        verbose_name=_('Types d\'addiction'),
        blank=True,
        default=list,
    )
    autre_addiction_detail = models.CharField(_('Détail autre addiction'), max_length=255, blank=True)
    tabagisme_detail = models.CharField(_('Tabagisme (paquets/année)'), max_length=50, blank=True)

    # Antécédents familiaux (multi-choix)
    familial = ArrayField(
        models.CharField(_('Antécédents familiaux'), choices=FamilialChoices.choices, max_length=18),
        verbose_name=_('Antécédents familiaux'),
        blank=True,
        default=list,
    )
    autre_familial_detail = models.CharField(_('Détail autre familial'), max_length=255, blank=True)

    class Meta:
        verbose_name = _('Antécédent')
        verbose_name_plural = _('Antécédents')

    def clean(self):
        super().clean()
        # Validation des addictions
        if self.addiction and not self.type_addiction:
            raise ValidationError(_('Veuillez spécifier au moins un type d\'addiction.'))
        if 'TABAGISME' in self.type_addiction and not self.tabagisme_detail:
            raise ValidationError(_('Veuillez indiquer les détails pour le tabagisme.'))
        if 'OTHER' in self.type_addiction and not self.autre_addiction_detail:
            raise ValidationError(_('Veuillez indiquer les détails pour l\'autre addiction.'))
        if self.type_addiction and not self.type_addiction:
            raise ValidationError(_('Veuillez sélectionner au moins un type d\'addiction.'))
        # Validation des antécédents familiaux
        if 'OTHER' in self.familial and not self.autre_familial_detail:
            raise ValidationError(_('Veuillez préciser les autres antécédents familiaux.'))

    def save(self, **kwargs):
        self.full_clean()
        return super().save(**kwargs)

    def __str__(self):
        return f"Antécédents - {self.patient.get_full_name()}"

# Expérience de conduite (modifié)
class DriverExperience(Base):

    etat_conducteur = models.CharField(
        _('État du conducteur'),
        max_length=50, choices=EtatConducteurChoices.choices,
        default=EtatConducteurChoices.ACTIF
    )
    deces_cause = models.CharField(
        _('Cause du décès'),
        max_length=255, null=True, blank=True,
        choices=DECESCauseChoices.choices
    )
    inactif_cause = models.CharField(
        _('Cause de l\'inactivité'),
        max_length=255, null=True, blank=True,
        choices=ArretCauseChoices.choices
    )
    km_parcourus = models.FloatField(
        _('Kilomètres parcourus'),
        null=True, blank=True  # Ajout de blank=True
    )
    nombre_accidents = models.PositiveIntegerField(
        _('Nombre d\'accidents'),
        default=0
    )
    tranche_horaire = models.CharField(
        _('Tranche horaire de conduite'),
        max_length=50, null=True,blank=True
    ) 
     # Changé de TimeField
    corporel_dommage = models.BooleanField(
        _('Dommage corporel'),
        default=False
    )
    corporel_dommage_type = models.CharField(
        _('Type de dommage corporel'),
         choices=DommageChoices.choices,
        null=True, blank=True
    )
    materiel_dommage = models.BooleanField(
        _('Dommage matériel'),
        default=False
    )
    materiel_dommage_type = models.CharField(
        _('Type de dommage matériel'),
        choices=DommageChoices.choices,
        null=True, blank=True  
    )
    date_visite = models.DateField(_('Date de visite'),
                                    null=True, default=None, blank=True
                                )
    date_dernier_accident = models.DateField(
        _('Date du dernier accident'),
        null=True, default=None, blank=True
    )

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
        if self.etat_conducteur == EtatConducteurChoices.DCD and not self.deces_cause:
            raise ValidationError(_('Veuillez spécifier la cause du décès.'))
        if self.deces_cause and self.etat_conducteur != EtatConducteurChoices.DCD or self.deces_cause == '':
            raise ValidationError(_('La cause du décès ne peut être spécifiée que si l\'état du conducteur est "Décédé".'))
        if self.etat_conducteur == EtatConducteurChoices.INACTIF and not self.inactif_cause:
            raise ValidationError(_('Veuillez spécifier la cause de l\'inactivité.'))
        if self.inactif_cause and self.etat_conducteur != EtatConducteurChoices.INACTIF or self.inactif_cause == '':
            raise ValidationError(_('La cause de l\'inactivité ne peut être spécifiée que si l\'état du conducteur est "Inactif".'))
        if self.corporel_dommage and not self.corporel_dommage_type:
            raise ValidationError(_('Veuillez spécifier le type de dommage corporel.'))
        if self.corporel_dommage_type and self.corporel_dommage_type not in [choice[0] for choice in DommageChoices.choices]:
            raise ValidationError(_('Le type de dommage corporel doit être l\'un des choix valides.'))
        if self.materiel_dommage and not self.materiel_dommage_type:
            raise ValidationError(_('Veuillez spécifier le type de dommage matériel.'))
        if self.materiel_dommage_type and self.materiel_dommage_type not in [choice[0] for choice in DommageChoices.choices]:
            raise ValidationError(_('Le type de dommage matériel doit être l\'un des choix valides.'))
    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)
    
    
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
    driver_experience = models.ManyToManyField(DriverExperience, blank=True)

    class Meta:
        verbose_name = _('Dossier médical')
        verbose_name_plural = _('Dossiers médicaux')

    def __str__(self):
        return f"Dossier médical - {self.patient.get_full_name()}"

    def clean(self):
        super().clean()
        # Vérification que le patient correspond dans toutes les relations
        if (self.antecedant and self.antecedant.patient != self.patient):
            raise ValidationError(_('Incohérence dans les données patient'))
        
    def save(self, **kwargs):
        self.full_clean()
        return super().save(**kwargs)