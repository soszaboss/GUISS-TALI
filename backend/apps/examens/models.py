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
                if not (0 <= value <= 10):
                    raise ValidationError({field_name: _('La valeur doit être comprise entre 0 et 10.')})

    def save(self, **kwargs):
        self.full_clean()
        return super().save(**kwargs)

    def __str__(self):
        try:
            return f'Acuité visuelle de {self.technicalexamen.patient.get_full_name()} - Visite {self.technicalexamen.visite}'
        except Exception:
            return 'Acuité visuelle (non liée)'

# Refraction model
class Refraction(TimeStampedModel):
    correction_optique = models.BooleanField(_('Correction optique'), default=False)
    od_s = models.DecimalField(_('S OD'),  max_digits=5, decimal_places=3, null=True, blank=True, default=None)
    og_s = models.DecimalField(_('S OG'),  max_digits=5, decimal_places=3, null=True, blank=True, default=None)
    od_c = models.DecimalField(_('C OD'),  max_digits=5, decimal_places=3, null=True, blank=True, default=None)
    og_c = models.DecimalField(_('C OG'),  max_digits=5, decimal_places=3, null=True, blank=True, default=None)
    od_a = models.DecimalField(_('A OD'),  max_digits=5, decimal_places=3, null=True, blank=True, default=None)
    og_a = models.DecimalField(_('A OG'),  max_digits=5, decimal_places=3, null=True, blank=True, default=None)
    avog = models.DecimalField(_('AVOG'),  max_digits=5, decimal_places=3, null=True, blank=True, default=None)
    avod = models.DecimalField(_('AVOD'),  max_digits=5, decimal_places=3, null=True, blank=True, default=None)

    def clean(self):
        super().clean()
        if self.correction_optique:
            refraction_fields = {
                'S OD': self.od_s, 'C OD': self.od_c, 'A OD': self.od_a,
                'S OG': self.og_s, 'C OG': self.og_c, 'A OG': self.og_a,
            }
            for field_name, value in refraction_fields.items():
                if value is None:
                    raise ValidationError(_(f'Le champ {field_name} doit être rempli.'))
                if not (-10.0 <= float(value) <= 10.0):
                    raise ValidationError(_(f'La valeur de {field_name} doit être entre -10.0 et 10.0'))

    def save(self, **kwargs):
        self.full_clean()
        return super().save(**kwargs)

    class Meta:
        verbose_name = _('Réfraction automatisée')
        verbose_name_plural = _('Réfractions automatisées')

    def __str__(self):
        try:
            return f'Refraction de {self.technicalexamen.patient.get_full_name()} - Visite {self.technicalexamen.visite}'
        except Exception:
            return 'Réfraction (non liée)'

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
            if self.ttt_hypotonisant_value is None or self.ttt_hypotonisant_value == '':
                raise ValidationError(_('ttt_hypotonisant_value ne doit pas avoir la valeur null.'))

    def save(self, **kwargs):
        self.full_clean()
        return super().save(**kwargs)

    def __str__(self):
        try:
            return f'Tonus oculaire de {self.technicalexamen.patient.get_full_name()} - Visite {self.technicalexamen.visite}'
        except Exception:
            return 'Tonus oculaire (non lié)'

# Pachymetry model
class Pachymetry(OcularMeasurementBase):
    cto_od = models.FloatField(_('CTO OD (œil droit)'))
    cto_og = models.FloatField(_('CTO OG (œil gauche)'))

    class Meta:
        verbose_name = _('Pachymétrie')
        verbose_name_plural = _('Pachymétries')

    def __str__(self):
        try:
            return f'Pachymétrie de {self.technicalexamen.patient.get_full_name()} - Visite {self.technicalexamen.visite}'
        except Exception:
            return 'Pachymétrie (non liée)'

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

    def __str__(self):
        try:
            return f'Plaintes de {self.eyeside.clinicalexamen.patient.get_full_name()} - Visite {self.eyeside.clinicalexamen.visite}'
        except Exception:
            return 'Plaintes (non liées)'

    class Meta:
        verbose_name = _('Examen clinique - Diplopie, Strabisme, Nystagmus, Ptosis')
        verbose_name_plural = _('Examens cliniques - Diplopie, Strabisme, Nystagmus, Ptosis')

# Segment Anterieur
class BiomicroscopySegmentAnterieur(TimeStampedModel):
    segment = models.CharField(_('Segment'), max_length=20, choices=SegmentChoices.choices)
    cornee = models.CharField(_('Corne'), max_length=30, choices=Cornee.choices, null=True, blank=True, default=None)
    profondeur = models.CharField(_('Profondeur'), max_length=30, choices=ChambreAnterieureProfondeur.choices, null=True, blank=True, default=None)
    transparence = models.CharField(_('Transparence'), max_length=30, choices=ChambreAnterieureTransparence.choices, null=True, blank=True, default=None)
    type_anomalie_value = models.CharField(_('Anormal transparence'), max_length=30, choices=TypeAnomalie.choices, null=True, blank=True, default=None)
    quantite_anomalie = models.CharField(_('quantité anomalie'), max_length=30, choices=QuantiteAnomalie.choices, null=True, blank=True, default=None)
    pupille = models.CharField(_('Pupille'), max_length=30, choices=Pupille.choices, null=True, blank=True, default=None)
    axe_visuel = models.CharField(_('Axe Visuel'), max_length=30, choices=AxeVisuel.choices, null=True, blank=True, default=None)
    rpm = models.CharField(_('RPM'), max_length=30, choices=RPM, null=True, blank=True, default=None)
    iris = models.CharField(_('Iris'), max_length=30, choices=Iris.choices, null=True, blank=True, default=None)
    cristallin = models.CharField(_('Cristallin'), max_length=30, choices=Cristallin.choices, null=True, blank=True, default=None)
    position_cristallin = models.CharField(_('Position Cristallin'), max_length=32, choices=PositionCristallin.choices, null=True, blank=True, default=None)

    class Meta:
        verbose_name = _('Segment antérieur (SA)')
        verbose_name_plural = _('Segment antérieurs (SA)')

    def clean(self):
        super().clean()
        if self.segment == SegmentChoices.PRESENCE_LESION:
            if not self.cornee:
                raise ValidationError(_('Le champs cornee ne doit pas etre nul.'))
            if not self.profondeur:
                raise ValidationError(_('Le champs profondeur ne doit pas etre nul.'))
            if not self.transparence:
                raise ValidationError(_('Le champs transparence ne doit pas etre nul.'))
            elif self.transparence == ChambreAnterieureTransparence.ANORMALE:
                if not self.type_anomalie_value:
                    raise ValidationError(_('Le champs type_anomalie_value ne doit pas etre nul.'))
                if not self.quantite_anomalie:
                    raise ValidationError(_('Le champs quantite_anomalie ne doit pas etre nul.'))
            if not self.pupille:
                raise ValidationError(_('Le champs pupille ne doit pas etre nul.'))
            if not self.axe_visuel:
                raise ValidationError(_('Le champs axe_visuel ne doit pas etre nul.'))
            if not self.rpm:
                raise ValidationError(_('Le champs rpm ne doit pas etre nul.'))
            if not self.iris:
                raise ValidationError(_('Le champs iris ne doit pas etre nul.'))
            if not self.cristallin:
                raise ValidationError(_('Le champs cristallin ne doit pas etre nul.'))
            if not self.position_cristallin:
                raise ValidationError(_('Le champs position_cristallin ne doit pas etre nul.'))

    def save(self, **kwargs):
        self.full_clean()
        return super().save(**kwargs)

    def __str__(self):
        try:
            return f'Segment antérieur de {self.eyeside.clinicalexamen.patient.get_full_name()} - Visite {self.eyeside.clinicalexamen.visite}'
        except Exception:
            return 'Segment antérieur (non lié)'

# Segment Postérieur
class BiomicroscopySegmentPosterieur(TimeStampedModel):
    segment = models.CharField(
        _('Segment'),
        max_length=20,
        choices=SegmentChoices.choices
    )
    vitre = models.CharField(
        _('Vitre'),
        max_length=30,
        choices=Vitre.choices,
        null=True,
        blank=True,
        default=None
    )
    papille = models.CharField(
        _('Papille'),
        max_length=30,
        choices=Papille.choices,
        null=True,
        blank=True,
        default=None
    )
    macula = models.CharField(
        _('Macula'),
        max_length=30,
        choices=Macula.choices,
        null=True,
        blank=True,
        default=None
    )
    retinien_peripherique = models.CharField(
        _('Champ rétinien périphérique'),
        max_length=30,
        choices=ChampRetinienPeripherique.choices,
        null=True,
        blank=True,
        default=None
    )
    vaissaux = models.CharField(
        _('Vaissaux'),
         max_length=30,
        choices=Vaisseaux.choices,
        null=True,
        blank=True,
        default=None
    )
    cd_od = models.DecimalField(
        _('C/D OD'),
        max_digits=5,
        decimal_places=1,
        null=True,
        blank=True,
        default=None
    )
    cd_og = models.DecimalField(
        _('C/D OG'),
        max_digits=5,
        decimal_places=1,
        null=True,
        blank=True,
        default=None
    )
    observation = models.TextField(_('Observation'), null=True, blank=True)

    class Meta:
        verbose_name = _('Segment postérieur (SP)')
        verbose_name_plural = _('Segment postérieurs (SP)')

    def __str__(self):
        try:
            return f'Segment postérieur de {self.eyeside.clinicalexamen.patient.get_full_name()} - Visite {self.eyeside.clinicalexamen.visite}'
        except Exception:
            return 'Segment postérieur (non lié)'
        
    def clean(self):
        if self.segment == SegmentChoices.PRESENCE_LESION:
            if not self.vitre:
                raise ValidationError(_('Le champ vitre ne doit pas être nul.'))
            if not self.papille:
                raise ValidationError(_('Le champ papille ne doit pas être nul.'))
            if not self.macula:
                raise ValidationError(_('Le champ macula ne doit pas être nul.'))
            if not self.retinien_peripherique:
                raise ValidationError(_('Le champ rétinien périphérique ne doit pas être nul.'))
            if not self.vaissaux:
                raise ValidationError(_('Le champ vaissaux ne doit pas être nul.'))
            # if self.cd_od is None or self.cd_od < 0 or self.cd_od > 10:
            #     raise ValidationError(_('C/D OD doit être entre 0 et 10.'))
            # if self.cd_og is None or self.cd_og < 0 or self.cd_og > 10:
            #     raise ValidationError(_('C/D OG doit être entre 0 et 10.'))

# BP supplementary items
class BpSuP(TimeStampedModel):
    retinographie = models.ImageField(upload_to=f'{MEDIA}biomicroscopie/retinographie/', null=True, blank=True)
    oct = models.ImageField(upload_to=f'{MEDIA}biomicroscopie/oct/', null=True, blank=True)
    autres = models.ImageField(upload_to=f'{MEDIA}biomicroscopie/autres/', null=True, blank=True)

    def __str__(self):
        try:
            return f'BP Supplementary items for {self.clinicalexamen.patient.get_full_name()} - Visite {self.clinicalexamen.visite}'
        except Exception:
            return 'BP Supplementary items (non liés)'

# A model for each examen's eye
class EyeSide(TimeStampedModel):
    plaintes = models.ForeignKey(Plaintes, on_delete=models.CASCADE, related_name='eyeside')
    bp_sg_anterieur = models.ForeignKey(BiomicroscopySegmentAnterieur, on_delete=models.CASCADE, related_name='eyeside')
    bp_sg_posterieur = models.ForeignKey(BiomicroscopySegmentPosterieur, on_delete=models.CASCADE, related_name='eyeside')

    def __str__(self):
        try:
            return f'EyeSide de {self.clinicalexamen.patient.get_full_name()} - Visite {self.clinicalexamen.visite}'
        except Exception:
            return 'EyeSide (non lié)'

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

    def __str__(self):
        try:
            return f'Périmétrie de {self.clinicalexamen.patient.get_full_name()} - Visite {self.clinicalexamen.visite}'
        except Exception:
            return 'Périmétrie (non liée)'

# Conclusion model
class Conclusion(TimeStampedModel):
    vision = models.CharField(_('Conclusion sur la conduite'), max_length=50,
                                  choices=[('compatible', _('Compatible')), ('incompatible', _('Incompatible')), ('a_risque', _('À risque'))],
                                  null=True, default=None, blank=True)
    cat = models.TextField(_('CAT'), null=True, default=None, blank=True)
    traitement = models.TextField(_('Traitement'), null=True, default=None, blank=True)
    observation = models.TextField(_('Observation'), null=True, default=None, blank=True)
    rv = models.BooleanField(
        _('RV'),
        default=False,
        help_text=_('6 mois avec True, moins de 6 mois avec False'))
    diagnostic_cim_10 = models.CharField(
        _('Diagnostic CIM-10'), max_length=100, null=True, blank=True,
        default=None
    )

    class Meta:
        verbose_name = _('Conclusion')
        verbose_name_plural = _('Conclusions')

    def __str__(self):
        try:
            return f'Conclusion de {self.clinicalexamen.patient.get_full_name()} - Visite {self.clinicalexamen.visite}'
        except Exception:
            return 'Conclusion (non liée)'

# TechnicalExamen model
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
        self.full_clean()
        self.is_completed = self.completed()
        super().save(*args, **kwargs)

    def __str__(self):
        try:
            return f'Examen technique de {self.patient.get_full_name()} - Visite {self.visite}'
        except Exception:
            return 'Examen technique (non lié)'

# ClinicalExamen model
class ClinicalExamen(Base):
    """
    Examen clinique (biomicroscopie, périmétrie, conclusion, etc.)
    """
    conclusion = models.OneToOneField(Conclusion, on_delete=models.CASCADE, null=True, blank=True, default=None, related_name='clinicalexamen')
    perimetry = models.OneToOneField(Perimetry, on_delete=models.CASCADE, null=True, blank=True, default=None, related_name='clinicalexamen')
    og = models.ForeignKey(EyeSide, on_delete=models.CASCADE, related_name='og_clinicalexamen', null=True, blank=True, default=None)
    od = models.ForeignKey(EyeSide, on_delete=models.CASCADE, related_name='od_clinicalexamen', null=True, blank=True, default=None)
    bp_sup = models.OneToOneField(BpSuP, on_delete=models.CASCADE, null=True, default=None, blank=True, related_name='clinicalexamen')
    is_completed = models.BooleanField(_('Examen clinique complété'), default=False)

    class Meta:
        verbose_name = _('Examen clinique')
        verbose_name_plural = _('Examens cliniques')

    def __str__(self):
        try:
            return f'Examen clinique de {self.patient.get_full_name()} - Visite {self.visite}'
        except Exception:
            return 'Examen clinique (non lié)'

# Examens model
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
        try:
            return f'Examen de {self.patient.get_full_name()} - Visite {self.visite}'
        except Exception:
            return 'Examen (non lié)'

    def save(self, *args, **kwargs):
        is_completed = (
            self.technical_examen and self.technical_examen.is_completed and 
            self.clinical_examen and self.clinical_examen.is_completed
        )
        self.is_completed = bool(is_completed)
        super().save(*args, **kwargs)