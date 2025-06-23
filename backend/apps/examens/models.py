from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError

from django_extensions.db.models import TimeStampedModel

from apps.examens.base import OcularMeasurementBase, Base

from utils.models.choices import Cornee, ChambreAnterieureProfondeur, ChambreAnterieureTransparence, QuantiteAnomalie, SegmentChoices, \
    TypeAnomalie, Pupille, AxeVisuel, RPM, Iris, Cristallin, Vitre, Macula, ChampRetinienPeripherique, Vaisseaux, \
    PositionCristallin, Papille, PerimetrieBinoculaire, HypotonisantValue, Symptomes


MEDIA = 'media/images/'

# Visual Acuity model
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

class VisualAcuity(TimeStampedModel):
    avsc_od = models.DecimalField(_('AVSC OD'), max_digits=5, decimal_places=3)
    avsc_og = models.DecimalField(_('AVSC OG'), max_digits=5, decimal_places=3)
    avsc_odg = models.DecimalField(_('AVSC ODG'), max_digits=5, decimal_places=3)
    avac_od = models.DecimalField(_('AVAC OD'), max_digits=5, decimal_places=3)
    avac_og = models.DecimalField(_('AVAC OG'), max_digits=5, decimal_places=3)
    avac_odg = models.DecimalField(_('AVAC ODG'), max_digits=5, decimal_places=3)

    class Meta:
        verbose_name = _('Acuité visuelle')
        verbose_name_plural = _('Acuités visuelles')

    def clean(self):
        super().clean()
        fields = [
            ('avsc_od', self.avsc_od),
            ('avsc_og', self.avsc_og),
            ('avsc_odg', self.avsc_odg),
            ('avac_od', self.avac_od),
            ('avac_og', self.avac_og),
            ('avac_odg', self.avac_odg),
        ]

        for field_name, value in fields:
            if value is not None:
                # Vérifie que la valeur est entre 0 et 13
                if not (0 <= value <= 10):
                    raise ValidationError({field_name: _('La valeur doit être comprise entre 0 et 13.')})
    def save(self, **kwargs):
         self.full_clean()
         return super().save(**kwargs)

# Refraction model
class Refraction(TimeStampedModel):
    od_s = models.DecimalField(_('S OD'),  max_digits=5, decimal_places=3)
    og_s = models.DecimalField(_('S OG'),  max_digits=5, decimal_places=3)
    od_c = models.DecimalField(_('C OD'),  max_digits=5, decimal_places=3)
    og_c = models.DecimalField(_('C OG'),  max_digits=5, decimal_places=3)
    od_a = models.DecimalField(_('A OD'),  max_digits=5, decimal_places=3)
    og_a = models.DecimalField(_('A OG'),  max_digits=5, decimal_places=3)
    dp = models.FloatField(_('DP en mm'))

    def clean(self):
        super().clean()
        refraction_fields = {
            'S OD': self.od_s, 'C OD': self.od_c, 'A OD': self.od_a,
            'S OG': self.og_s, 'C OG': self.og_c, 'A OG': self.og_a
        }
        for field_name, value in refraction_fields.items():
            if value and not (-10.0 <= float(value) <= 10.0):
                raise ValidationError(_(f'La valeur de {field_name} doit être entre -10.0 et 10.0'))
    def save(self, **kwargs):
         self.full_clean()
         return super().save(**kwargs)
    class Meta:
        verbose_name = _('Réfraction automatisée')
        verbose_name_plural = _('Réfractions automatisées')


# Ocular Tension model
class OcularTension(OcularMeasurementBase):

    ttt_hypotonisant = models.BooleanField(_('TTT hypotonisant appliqué'), default=False)
    ttt_hypotonisant_value = models.CharField(
        _('TTT hypotonisant value'), max_length=30,
            choices=HypotonisantValue.choices, null=True,
            default=None, blank=True
    )

    class Meta:
        verbose_name = _('Tonus oculaire')
        verbose_name_plural = _('Tonus oculaires')

    def clean(self):
        super().clean()
        if self.ttt_hypotonisant:
            if self.ttt_hypotonisant_value == None or self.ttt_hypotonisant_value == '':
                raise ValidationError(_('ttt_hypotonisant_value ne doit pas avoir la valeur null.'))

    def save(self, **kwargs):
         self.full_clean()
         return super().save(**kwargs)


# Pachymetry model
class Pachymetry(OcularMeasurementBase):

    class Meta:
        verbose_name = _('Pachymétrie')
        verbose_name_plural = _('Pachymétries')


# Clinical Findings model
class Plaintes(TimeStampedModel):
    YES_NO_CHOICES = [(True, 'Oui'), (False, 'Non')]
    DIPLOPIE_TYPE_CHOICES = [('monoculaire', 'Monoculaire'), ('binoculaire', 'Binoculaire')]
    EYE_CHOICES = [('od', 'OD'), ('og', 'OG'), ('odg', 'ODG')]

    eye_symptom = models.CharField(_('OD symptom'), max_length=30, choices=Symptomes.choices)

    diplopie = models.BooleanField(_('Diplopie'), choices=YES_NO_CHOICES, default=False)
    diplopie_type = models.CharField(_('Diplopie type'), max_length=20,
                                     choices=DIPLOPIE_TYPE_CHOICES,
                                     null=True, blank=True)
    strabisme = models.BooleanField(_('Strabisme'), choices=YES_NO_CHOICES, default=False)
    strabisme_eye = models.CharField(_('Œil affecté par strabisme'), max_length=20,
                                     choices=EYE_CHOICES, null=True, blank=True)
    nystagmus = models.BooleanField(_('Nystagmus'), choices=YES_NO_CHOICES, default=False)
    nystagmus_eye = models.CharField(_('Œil affecté par nystagmus'), max_length=20,
                                     choices=EYE_CHOICES,null=True, blank=True)
    ptosis = models.BooleanField(_('Ptosis'), choices=YES_NO_CHOICES, default=False)
    ptosis_eye = models.CharField(_('Œil affecté par ptosis'), max_length=20,
                                  choices=EYE_CHOICES,
                                  null=True, blank=True)

    def clean(self):
        super().clean()
        if self.diplopie and not self.diplopie_type:
            raise ValidationError(_('Veuillez préciser le type de diplopie.'))
        if self.strabisme and not self.strabisme_eye:
            raise ValidationError(_('Veuillez préciser l\'œil affecté par le strabisme.'))
        if self.nystagmus and not self.nystagmus_eye:
            raise ValidationError(_('Veuillez préciser l\'œil affecté par le nystagmus.'))
        if self.ptosis and not self.ptosis_eye:
            raise ValidationError(_('Veuillez préciser l\'œil affecté par le ptosis.'))

    def save(self, *args, **kwargs):
         self.full_clean()
         return super().save(*args, **kwargs)
    

    class Meta:
        verbose_name = _('Examen clinique - Diplopie, Strabisme, Nystagmus, Ptosis')
        verbose_name_plural = _('Examens cliniques - Diplopie, Strabisme, Nystagmus, Ptosis')


# Segment Anterieur
class BiomicroscopySegmentAnterieur(TimeStampedModel):
    segment = models.CharField(_('Segment'), max_length=20, choices=SegmentChoices.choices)

    # Cornée
    cornee = models.CharField(_('Corne'), max_length=30, choices=Cornee.choices)

    # Chambre antérieure
    profondeur = models.CharField(_('Profondeur'), max_length=30, choices=ChambreAnterieureProfondeur.choices)
    transparence = models.CharField(_('Transparence'), max_length=30, choices=ChambreAnterieureTransparence.choices)
    type_anomalie_value = models.CharField(_('Anormal transparence'), max_length=30, choices=TypeAnomalie.choices, null=True, blank=True)
    quantite_anomalie = models.CharField(_('quantité anomalie'), max_length=30, choices=QuantiteAnomalie.choices, null=True, blank=True)

    pupille = models.CharField(_('Pupille'), max_length=30, choices=Pupille.choices)
    axe_visuel = models.CharField(_('Axe Visuel'), max_length=30, choices=AxeVisuel.choices)
    rpm = models.CharField(_('RPM'), max_length=30, choices=RPM)
    iris = models.CharField(_('Iris'), max_length=30, choices=Iris.choices)

    cristallin = models.CharField(_('Cristallin'), max_length=30, choices=Cristallin.choices)
    position_cristallin = models.CharField(_('Position Cristallin'), max_length=32, choices=PositionCristallin.choices)

    class Meta:
        verbose_name = _('Segment antérieur (SA)')
        verbose_name_plural = _('Segment antérieurs (SA)')

    def clean(self):
        super().clean()
        if self.transparence == ChambreAnterieureTransparence.ANORMALE:
            if not self.type_anomalie_value:
                raise ValidationError(_('Le champs type_anomalie_value ne doit pas etre nul.'))
            if not self.quantite_anomalie:
                raise ValidationError(_('Le champs quantite_anomalie ne doit pas etre nul.'))
    
    def save(self, **kwargs):
         self.full_clean()
         return super().save(**kwargs)

# Segment Postérieur
class BiomicroscopySegmentPosterieur(TimeStampedModel):
    segment = models.CharField(_('Segment'), max_length=20, choices=SegmentChoices.choices)

    vitre = models.CharField(_('Vitre'), max_length=30, choices=Vitre.choices)

    retine = models.FloatField(_('Rétine'))
    papille = models.CharField(_('Papille'), max_length=30, choices=Papille.choices)
    macula = models.CharField(_('Macula'), max_length=30, choices=Macula.choices)
    retinien_peripherique = models.CharField(_('Champ rétinien périphérique'), max_length=30, choices=ChampRetinienPeripherique.choices)
    vaissaux = models.CharField(_('Vaissaux'), max_length=30, choices=Vaisseaux.choices)

    class Meta:
        verbose_name = _('Segment antérieur (SA)')
        verbose_name_plural = _('Segment antérieurs (SA)')


# BP supplementary items
class BpSuP(TimeStampedModel):
    retinographie = models.ImageField(upload_to=f'{MEDIA}biomicroscopie/retinographie/', null=True, blank=True)
    oct = models.ImageField(upload_to=f'{MEDIA}biomicroscopie/oct/', null=True, blank=True)
    autres = models.ImageField(upload_to=f'{MEDIA}biomicroscopie/autres/', null=True, blank=True)

# A model for each examen's eye
class EyeSide(TimeStampedModel):
    plaintes = models.ForeignKey(Plaintes, on_delete=models.CASCADE)
    bp_sg_anterieur = models.ForeignKey(BiomicroscopySegmentAnterieur, on_delete=models.CASCADE)
    bp_sg_posterieur = models.ForeignKey(BiomicroscopySegmentPosterieur, on_delete=models.CASCADE)


# Perimetry model
class Perimetry(TimeStampedModel):
    pbo = models.CharField(_('PBO'), max_length=30,
                           choices=PerimetrieBinoculaire,
                           null=True)
    limite_superieure = models.FloatField(_('Limite supérieure (en degré)'))
    limite_inferieure = models.FloatField(_('Limite inférieure (en degré)'))
    limite_temporale_droit = models.FloatField(_('Limite Temporale  droite'))
    limite_temporale_gauche = models.FloatField(_('Limite Temporale gauche'))
    limite_horizontal = models.FloatField(_('Limite Horizontal'))
    score_esternmen = models.FloatField(_('Score d’Estermen (pourcentage)'))

    image = models.ImageField(_('Image'), upload_to=f'{MEDIA}perimetries_binoculaire/', null=True, blank=True)
    images = models.FileField(_('Images'), upload_to=f'{MEDIA}perimetries_binoculaire/', null=True, blank=True)
    class Meta:
        verbose_name = _('Périmétrie binoculaire')
        verbose_name_plural = _('Périmétries binoculaires')

    def clean(self):
        super().clean()
        if not 0 < self.limite_inferieure <= 90:
            raise ValidationError('limite_inferieure doit se situer entre 0 et 90')
        if not 0 < self.limite_superieure <= 90:
            raise ValidationError('limite_superieure doit se situer entre 0 et 90')
        if not 0 < self.limite_horizontal <= 180:
                    raise ValidationError('limite_horizontal doit se situer entre 0 et 180')
        if not 0 < self.limite_temporale_gauche <= 120:
                    raise ValidationError('limite_temporale_gauche doit se situer entre 0 et 120')
        if not 0 < self.limite_temporale_droit <= 120:
                    raise ValidationError('limite_temporale_droit doit se situer entre 0 et 120')
        if not 0 < self.score_esternmen <= 100:
                    raise ValidationError('score_esternmen doit se situer entre 0 et 100')

    def save(self, **kwargs):
         self.full_clean()
         return super().save(**kwargs)

# Conclusion model
class Conclusion(TimeStampedModel):
    vision = models.CharField(_('Conclusion sur la conduite'), max_length=50,
                                  choices=[('compatible', _('Compatible')), ('incompatible', _('Incompatible')), ('a_risque', _('À risque'))],
                                  null=True)
    cat = models.TextField(_('CAT'), null=True)
    traitement = models.TextField(_('Traitement'), null=True)
    observation = models.TextField(_('Observation'), null=True)
    rv = models.BooleanField(
        _('RV'),
        default=False,
        help_text=_('6 mois avec True, moins de 6 mois avec False'))

    class Meta:
        verbose_name = _('Conclusion')
        verbose_name_plural = _('Conclusions')
        

class TechnicalExamen(Base):
    visual_acuity = models.OneToOneField(
        VisualAcuity, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )
    refraction = models.OneToOneField(
        Refraction, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        default=None
    )
    ocular_tension = models.OneToOneField(
        OcularTension, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        default=None
    )
    pachymetry = models.OneToOneField(
        Pachymetry, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        default=None,
    )
    is_completed = models.BooleanField(_('Examen technique complété'), default=False)

    def completed(self):
        return all([
            self.visual_acuity,
            self.refraction,
            self.ocular_tension,
            self.pachymetry
        ])
    
    def clean(self):
        super().clean()
        is_completed = self.completed()
        # if not is_completed:
        #     raise ValidationError('tous les champs sont obligatoires.')

    def save(self, *args, **kwargs):
        # Déterminez si l'examen technique est complet
        self.full_clean()
        self.is_completed = self.completed()
        super().save(*args, **kwargs)


class ClinicalExamen(Base):
    """
    Examen clinique (biomicroscopie, périmétrie, conclusion, etc.)
    """
    conclusion = models.OneToOneField(Conclusion, on_delete=models.CASCADE, null=True, blank=True, default=None)
    perimetry = models.OneToOneField(Perimetry, on_delete=models.CASCADE, null=True, blank=True, default=None)
    og = models.ForeignKey(EyeSide, on_delete=models.CASCADE, related_name='og', null=True, blank=True, default=None)
    od = models.ForeignKey(EyeSide, on_delete=models.CASCADE, related_name='od', null=True, blank=True, default=None)
    bp_sup = models.OneToOneField(BpSuP, on_delete=models.CASCADE, null=True, default=None, blank=True)
    is_completed = models.BooleanField(_('Examen clinique complété'), default=False)

    class Meta:
        verbose_name = _('Examen clinique')
        verbose_name_plural = _('Examens cliniques')

class Examens(Base):
    """
    Conteneur principal d'un examen (technique + clinique)
    """
    technical_examen = models.OneToOneField(
        TechnicalExamen, 
        null=True, 
        blank=True, 
        on_delete=models.SET_NULL,
        related_name='parent_examen'
    )
    clinical_examen = models.OneToOneField(
        ClinicalExamen, 
        null=True, 
        blank=True, 
        on_delete=models.SET_NULL,
        related_name='parent_examen'
    )
    is_completed = models.BooleanField(_('Examen global complété'), default=False)

    class Meta:
        unique_together = ('patient', 'visite')
        verbose_name = _('Examen global')
        verbose_name_plural = _('Examens globaux')
        ordering = ['visite', '-created']

    def __str__(self):
        return f'Examen de {self.patient.get_full_name()} - Visite {self.get_visite_display()}'

    def save(self, *args, **kwargs):
        # Mise à jour du statut is_completed
        is_completed = (
            self.technical_examen and self.technical_examen.is_completed and 
            self.clinical_examen and self.clinical_examen.is_completed
        )
        if is_completed:
            self.is_completed = True
        else:
            self.is_completed = False
        super().save(*args, **kwargs)


