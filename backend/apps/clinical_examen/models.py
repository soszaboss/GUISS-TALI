from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError

from apps.clinical_examen.base import OcularMeasurementBase, Base, Segment
from utils.models.choices import Cornee, ChambreAnterieureProfondeur, ChambreAnterieureTransparence, QuantiteAnomalie, \
    TypeAnomalie, Pupille, AxeVisuel, RPM, Iris, Cristallin, Vitre, Macula, ChampRetinienPeripherique, Vaisseaux, \
    PositionCristallin, Papille, PerimetrieBinoculaire, HypotonisantValue


# Visual Acuity model
class VisualAcuity(Base):
    avsc_od = models.CharField(_('AVSC OD'), max_length=100)
    avsc_og = models.CharField(_('AVSC OG'), max_length=100)
    avsc_dg = models.CharField(_('AVSC ODG'), max_length=100)
    avac_od = models.CharField(_('AVAC OD'), max_length=100)
    avac_og = models.CharField(_('AVAC OG'), max_length=100)
    avac_dg = models.CharField(_('AVAC ODG'), max_length=100)

    class Meta:
        verbose_name = _('Acuité visuelle')
        verbose_name_plural = _('Acuités visuelles')


# Refraction model
class Refraction(Base):
    od_s = models.FloatField(_('S OD'), null=True)
    od_c = models.FloatField(_('C OD'), null=True)
    od_a = models.FloatField(_('A OD'), null=True)
    og_s = models.FloatField(_('S OG'), null=True)
    og_c = models.FloatField(_('C OG'), null=True)
    og_a = models.FloatField(_('A OG'), null=True)
    dp = models.FloatField(_('DP en mm'), null=True)

    def clean(self):
        refraction_fields = {
            'S OD': self.od_s, 'C OD': self.od_c, 'A OD': self.od_a,
            'S OG': self.og_s, 'C OG': self.og_c, 'A OG': self.og_a
        }
        for field_name, value in refraction_fields.items():
            if value and not (-10.0 <= value <= 10.0):
                raise ValidationError(_(f'La valeur de {field_name} doit être entre -10.0 et 10.0'))

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
        if self.ttt_hypotonisant and not self.ttt_hypotonisant_value:
            raise ValidationError(_('ttt_hypotonisant_value ne doit pas avoir la valeur null.'))


# Pachymetry model
class Pachymetry(OcularMeasurementBase):

    class Meta:
        verbose_name = _('Pachymétrie')
        verbose_name_plural = _('Pachymétries')


# Clinical Findings model
class Plaintes(Base):
    YES_NO_CHOICES = [(True, 'Oui'), (False, 'Non')]
    DIPLOPIE_TYPE_CHOICES = [('monoculaire', 'Monoculaire'), ('binoculaire', 'Binoculaire')]
    EYE_CHOICES = [('od', 'OD'), ('og', 'OG'), ('odg', 'ODG')]

    class Symptomes(models.TextChoices):
        AUCUN = 'AUCUN', _('Aucun')
        BAV = 'BAV', _('BAV')
        ROUGEUR = 'ROUGEUR', _('ROUGEUR')
        DOULEUR = 'DOULEUR', _('DOULEUR')
        DIPLOPIE = 'DIPLOPIE', _('DIPLOPIE')
        STARBISME = 'STARBISME', _('STARBISME')
        NYSTAGMUS = 'NYSTAGMUS', _('NYSTAGMUS')
        PTOSIS = 'PTOSIS', _('PTOSIS')
        AUTRES = 'AUTRES', _('AUTRES')

    od_symptom = models.CharField(_('OD symptom'), max_length=30, choices=Symptomes.choices)
    og_symptom = models.CharField(_('OG symptom'), max_length=30, choices=Symptomes.choices)

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
        if self.diplopie and not self.diplopie_type:
            raise ValidationError(_('Veuillez préciser le type de diplopie.'))
        if self.strabisme and not self.strabisme_eye:
            raise ValidationError(_('Veuillez préciser l\'œil affecté par le strabisme.'))
        if self.nystagmus and not self.nystagmus_eye:
            raise ValidationError(_('Veuillez préciser l\'œil affecté par le nystagmus.'))
        if self.ptosis and not self.ptosis_eye:
            raise ValidationError(_('Veuillez préciser l\'œil affecté par le ptosis.'))

    class Meta:
        verbose_name = _('Examen clinique - Diplopie, Strabisme, Nystagmus, Ptosis')
        verbose_name_plural = _('Examens cliniques - Diplopie, Strabisme, Nystagmus, Ptosis')


# Segment Anterieur
class SegmentAnterieur(Segment):
    # Cornée
    cornee = models.CharField(_('Corne'), max_length=30, choices=Cornee, blank=True)

    # Chambre antérieure
    profondeur = models.CharField(_('Profondeur'), max_length=30, choices=ChambreAnterieureProfondeur, blank=True)
    transparence = models.CharField(_('Transparence'), max_length=30, choices=ChambreAnterieureTransparence, blank=True)
    type_anomalie_value = models.CharField(_('Anormal transparence'), max_length=30, choices=TypeAnomalie, null=True, blank=True)
    quantite_anomalie = models.CharField(_('quantité anomalie'), max_length=30, choices=QuantiteAnomalie, null=True, blank=True)

    pupille = models.CharField(_('Pupille'), max_length=30, choices=Pupille, blank=True)
    axe_visuel = models.CharField(_('Axe Visuel'), max_length=30, choices=AxeVisuel, blank=True)
    rpm = models.CharField(_('RPM'), max_length=30, choices=RPM, blank=True)
    iris = models.CharField(_('Iris'), max_length=30, choices=Iris, blank=True)

    cristallin = models.CharField(_('Cristallin'), max_length=30, choices=Cristallin, blank=True)
    position_cristallin = models.CharField(_('Position Cristallin'), max_length=32, choices=PositionCristallin, blank=True)

    class Meta:
        verbose_name = _('Segment antérieur (SA)')
        verbose_name_plural = _('Segment antérieurs (SA)')

    def clean(self):
        if self.transparence == ChambreAnterieureTransparence.ANORMALE:
            if not self.type_anomalie_value:
                raise ValidationError(_('Le champs type_anomalie_value ne doit pas etre nul.'))
            if not self.quantite_anomalie:
                raise ValidationError(_('Le champs quantite_anomalie ne doit pas etre nul.'))


# Segment Postérieur
class SegmentPosterieur(Segment):
    vitre = models.CharField(_('Vitre'), max_length=30, choices=Vitre, blank=True)

    retine = models.FloatField(_('Rétine'))
    papille = models.CharField(_('Papille'), max_length=30, choices=Papille, blank=True)
    macula = models.CharField(_('Macula'), max_length=30, choices=Macula, blank=True)
    retinien_peripherique = models.CharField(_('Champ rétinien périphérique'), max_length=30, choices=ChampRetinienPeripherique, blank=True)
    vaissaux = models.CharField(_('Vaissaux'), max_length=30, choices=Vaisseaux, blank=True)

    class Meta:
        verbose_name = _('Segment antérieur (SA)')
        verbose_name_plural = _('Segment antérieurs (SA)')


# Biomicroscopy model
class Biomicroscopy(Base):
    segment_posterieur = models.ForeignKey(
        SegmentPosterieur,
        on_delete=models.CASCADE,  # Changé de SET_NULL à CASCADE
        verbose_name=_('Segment postérieur')
    )
    segment_anterieur = models.ForeignKey(
        SegmentAnterieur,
        on_delete=models.CASCADE,  # Changé de SET_NULL à CASCADE
        verbose_name=_('Segment antérieur')
    )

    class Meta:
        verbose_name = _('Biomicroscopie (SA + SP)')
        verbose_name_plural = _('Biomicroscopies (SA + SP)')

    def clean(self):
        # Validation de cohérence patient/visite
        for segment, field_name in [
            (self.segment_anterieur, 'segment_anterieur'),
            (self.segment_posterieur, 'segment_posterieur')
        ]:
            if not segment:
                raise ValidationError(
                    {field_name: [_('Ce champ est obligatoire.')]}
                )

            if segment.patient != self.patient:
                raise ValidationError(
                    {field_name: [_('Ne correspond pas au patient.')]}
                )

            if segment.visite != self.visite:
                raise ValidationError(
                    {field_name: [_('Ne correspond pas à la visite.')]}
                )

# Perimetry model
class Perimetry(Base):
    pbo = models.CharField(_('PBO'), max_length=30,
                           choices=PerimetrieBinoculaire,
                           null=True)
    limite_superieure = models.FloatField(_('Limite supérieure (en degré)'), null=True)
    limite_inferieure = models.FloatField(_('Limite inférieure (en degré)'), null=True)
    limite_temporale_droit = models.FloatField(_('Limite Temporale  droite'), null=True)
    limite_temporale_gauche = models.FloatField(_('Limite Temporale gauche'), null=True)
    limite_horizontal = models.FloatField(_('Limite Horizontal'), null=True)
    score_esternmen = models.FloatField(_('Score d’Estermen (pourcentage)'), null=True)

    image = models.ImageField(_('Image'), upload_to='images/perimetries_binoculaire/')
    images = models.FileField(_('Images'), upload_to='images/perimetries_binoculaire/')
    class Meta:
        verbose_name = _('Périmétrie binoculaire')
        verbose_name_plural = _('Périmétries binoculaires')

    def clean(self):
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


# Conclusion model
class Conclusion(Base):
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


# Examen Clinique model
class ExamenClinique(Base):
    STATUS_CHOICES = [
        ('draft', _('Brouillon Technique')),
        ('tech_review', _('Prêt pour Médecin')),
        ('md_review', _('En Revue Clinique')),
        ('completed', _('Terminé'))
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    visualAcuity = models.ForeignKey(VisualAcuity, on_delete=models.CASCADE)
    conclusion = models.ForeignKey(Conclusion, on_delete=models.CASCADE)
    perimetry = models.ForeignKey(Perimetry, on_delete=models.CASCADE)
    biomicroscopy = models.ForeignKey(Biomicroscopy, on_delete=models.CASCADE)
    plaintes = models.ForeignKey(Plaintes, on_delete=models.CASCADE)
    pachymetry = models.ForeignKey(Pachymetry, on_delete=models.CASCADE)
    ocular_tension = models.ForeignKey(OcularTension, on_delete=models.CASCADE)
    refraction = models.ForeignKey(Refraction, on_delete=models.CASCADE)
    is_complete = models.BooleanField(default=False)

    class Meta:
        unique_together = ('patient', 'visite')
        verbose_name = _('Examen Clinique')
        verbose_name_plural = _('Examens Cliniques')

    def __str__(self):
        return f'Examens Cliniques de {self.patient.first_name} {self.patient.last_name}'

    def save(self, *args, **kwargs):
        if self.status == 'completed' or self.is_complete:
            self.is_complete = True
            self.status = 'completed'

        super().save(*args, **kwargs)


