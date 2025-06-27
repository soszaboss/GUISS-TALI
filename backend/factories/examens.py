import random
import factory
from factory import fuzzy
from decimal import Decimal, ROUND_HALF_UP
from factory.django import DjangoModelFactory, ImageField

from apps.patients.models import Conducteur
from apps.examens.models import (
    VisualAcuity,
    Refraction,
    OcularTension,
    Pachymetry,
    Plaintes,
    BiomicroscopySegmentAnterieur,
    BiomicroscopySegmentPosterieur,
    BpSuP,
    EyeSide,
    Perimetry,
    Conclusion,
    TechnicalExamen,
    ClinicalExamen,
    Examens
)
from factories.patients import ConducteurFactory
from utils.models.choices import RPM, AxeVisuel, ChambreAnterieureProfondeur, ChambreAnterieureTransparence, ChampRetinienPeripherique, Cornee, Cristallin, HypotonisantValue, Iris, Macula, Papille, PositionCristallin, Pupille, QuantiteAnomalie, SegmentChoices, Symptomes, TypeAnomalie, Vaisseaux, VisiteChoices, Vitre

def random_decimal(min_val=-10.0, max_val=10.0, places=3):
    value = Decimal(str(random.uniform(min_val, max_val)))
    return value.quantize(Decimal('1.' + '0' * places), rounding=ROUND_HALF_UP)

class BaseFactory(DjangoModelFactory):
    class Meta:
        abstract = True
    
    patient = factory.SubFactory(ConducteurFactory)
    visite = fuzzy.FuzzyChoice([v[0] for v in VisiteChoices.choices])


class VisualAcuityFactory(DjangoModelFactory):
    class Meta:
        model = VisualAcuity
    
    avsc_od = fuzzy.FuzzyDecimal(0.0, 10.0, precision=3)
    avsc_og = fuzzy.FuzzyDecimal(0.0, 10.0, precision=3)
    avsc_odg = fuzzy.FuzzyDecimal(0.0, 10.0, precision=3)
    avac_od = fuzzy.FuzzyDecimal(0.0, 10.0, precision=3)
    avac_og = fuzzy.FuzzyDecimal(0.0, 10.0, precision=3)
    avac_odg = fuzzy.FuzzyDecimal(0.0, 10.0, precision=3)


class RefractionFactory(DjangoModelFactory):
    class Meta:
        model = Refraction

    correction_optique = fuzzy.FuzzyChoice([True, False])
    od_s = factory.LazyAttribute(lambda o: random_decimal() if o.correction_optique else None)
    og_s = factory.LazyAttribute(lambda o: random_decimal() if o.correction_optique else None)
    od_c = factory.LazyAttribute(lambda o: random_decimal() if o.correction_optique else None)
    og_c = factory.LazyAttribute(lambda o: random_decimal() if o.correction_optique else None)
    od_a = factory.LazyAttribute(lambda o: random_decimal() if o.correction_optique else None)
    og_a = factory.LazyAttribute(lambda o: random_decimal() if o.correction_optique else None)
    avog = fuzzy.FuzzyDecimal(0.0, 10.0, precision=3)
    avod = fuzzy.FuzzyDecimal(0.0, 10.0, precision=3)
    # dp = fuzzy.FuzzyDecimal(0.0, 10.0, precision=3)


class PachymetryFactory(DjangoModelFactory):
    class Meta:
        model = Pachymetry
    
    od = fuzzy.FuzzyInteger(450, 600)
    og = fuzzy.FuzzyInteger(450, 600)
    cto_od = fuzzy.FuzzyInteger(450, 600)
    cto_og = fuzzy.FuzzyInteger(450, 600)


# Factory pour OcularTension avec gestion du traitement hypotonisant
class OcularTensionFactory(DjangoModelFactory):
    class Meta:
        model = OcularTension

    od = fuzzy.FuzzyFloat(8.0, 21.0)
    og = fuzzy.FuzzyFloat(8.0, 21.0)
    ttt_hypotonisant = fuzzy.FuzzyChoice([True, False])

    ttt_hypotonisant_value = factory.LazyAttribute(
        lambda o: random.choice([c[0] for c in HypotonisantValue.choices])
        if o.ttt_hypotonisant else None
    )
    
    
# Factory pour SegmentAntérieur avec anomalies
class BiomicroscopySegmentAnterieurFactory(DjangoModelFactory):
    class Meta:
        model = BiomicroscopySegmentAnterieur

    segment = fuzzy.FuzzyChoice([c[0] for c in SegmentChoices.choices])
    cornee = factory.LazyAttribute(lambda o: random.choice([c[0] for c in Cornee.choices]) if o.segment == SegmentChoices.PRESENCE_LESION else None)
    profondeur = factory.LazyAttribute(lambda o: random.choice([c[0] for c in ChambreAnterieureProfondeur.choices]) if o.segment == SegmentChoices.PRESENCE_LESION else None)
    transparence = factory.LazyAttribute(lambda o: random.choice([c[0] for c in ChambreAnterieureTransparence.choices]) if o.segment == SegmentChoices.PRESENCE_LESION else None)
    type_anomalie_value = factory.LazyAttribute(
        lambda o: random.choice([c[0] for c in TypeAnomalie.choices])
        if o.segment == SegmentChoices.PRESENCE_LESION and o.transparence == ChambreAnterieureTransparence.ANORMALE else None
    )
    quantite_anomalie = factory.LazyAttribute(
        lambda o: random.choice([c[0] for c in QuantiteAnomalie.choices])
        if o.segment == SegmentChoices.PRESENCE_LESION and o.transparence == ChambreAnterieureTransparence.ANORMALE else None
    )
    pupille = factory.LazyAttribute(lambda o: random.choice([c[0] for c in Pupille.choices]) if o.segment == SegmentChoices.PRESENCE_LESION else None)
    axe_visuel = factory.LazyAttribute(lambda o: random.choice([c[0] for c in AxeVisuel.choices]) if o.segment == SegmentChoices.PRESENCE_LESION else None)
    rpm = factory.LazyAttribute(lambda o: random.choice([c[0] for c in RPM.choices]) if o.segment == SegmentChoices.PRESENCE_LESION else None)
    iris = factory.LazyAttribute(lambda o: random.choice([c[0] for c in Iris.choices]) if o.segment == SegmentChoices.PRESENCE_LESION else None)
    cristallin = factory.LazyAttribute(lambda o: random.choice([c[0] for c in Cristallin.choices]) if o.segment == SegmentChoices.PRESENCE_LESION else None)
    position_cristallin = factory.LazyAttribute(lambda o: random.choice([c[0] for c in PositionCristallin.choices]) if o.segment == SegmentChoices.PRESENCE_LESION else None)


# Factory pour Plaintes avec conditions
class PlaintesFactory(DjangoModelFactory):
    class Meta:
        model = Plaintes

    eye_symptom = fuzzy.FuzzyChoice([c[0] for c in Symptomes.choices])
    diplopie = fuzzy.FuzzyChoice([True, False])
    strabisme = fuzzy.FuzzyChoice([True, False])
    nystagmus = fuzzy.FuzzyChoice([True, False])
    ptosis = fuzzy.FuzzyChoice([True, False])

    diplopie_type = factory.LazyAttribute(
        lambda o: random.choice([c[0] for c in Plaintes.DIPLOPIE_TYPE_CHOICES]) if o.diplopie else None
    )
    strabisme_eye = factory.LazyAttribute(
        lambda o: random.choice([c[0] for c in Plaintes.EYE_CHOICES]) if o.strabisme else None
    )
    nystagmus_eye = factory.LazyAttribute(
        lambda o: random.choice([c[0] for c in Plaintes.EYE_CHOICES]) if o.nystagmus else None
    )
    ptosis_eye = factory.LazyAttribute(
        lambda o: random.choice([c[0] for c in Plaintes.EYE_CHOICES]) if o.ptosis else None
    )


class BiomicroscopySegmentPosterieurFactory(DjangoModelFactory):
    class Meta:
        model = BiomicroscopySegmentPosterieur

    segment = fuzzy.FuzzyChoice([c[0] for c in SegmentChoices.choices])
    vitre = fuzzy.FuzzyChoice([c[0] for c in Vitre.choices])
    papille = fuzzy.FuzzyChoice([c[0] for c in Papille.choices])
    macula = fuzzy.FuzzyChoice([c[0] for c in Macula.choices])
    retinien_peripherique = fuzzy.FuzzyChoice([c[0] for c in ChampRetinienPeripherique.choices])
    vaissaux = fuzzy.FuzzyChoice([c[0] for c in Vaisseaux.choices])
    cd_od = fuzzy.FuzzyDecimal(0.0, 10.0, precision=1)
    cd_og = fuzzy.FuzzyDecimal(0.0, 10.0, precision=1)
    observation = factory.Faker('sentence', nb_words=8)


class ConclusionFactory(DjangoModelFactory):
    class Meta:
        model = Conclusion

    vision = fuzzy.FuzzyChoice(['compatible', 'incompatible', 'a_risque'])
    cat = factory.Faker('sentence', nb_words=6)
    traitement = factory.Faker('sentence', nb_words=6)
    observation = factory.Faker('sentence', nb_words=8)
    rv = fuzzy.FuzzyChoice([True, False])
    diagnostic_cim_10 = factory.Faker('bothify', text='CIM-10-###??')


class BpSuPFactory(DjangoModelFactory):
    class Meta:
        model = BpSuP
    
    retinographie = ImageField(filename='retinographie.jpg')
    oct = ImageField(filename='oct.jpg')
    autres = ImageField(filename='autres.jpg')


class EyeSideFactory(DjangoModelFactory):
    class Meta:
        model = EyeSide
    
    plaintes = factory.SubFactory(PlaintesFactory)
    bp_sg_anterieur = factory.SubFactory(BiomicroscopySegmentAnterieurFactory)
    bp_sg_posterieur = factory.SubFactory(BiomicroscopySegmentPosterieurFactory)


class PerimetryFactory(DjangoModelFactory):
    class Meta:
        model = Perimetry
    
    pbo = 'NORMAL'
    limite_superieure = 45
    limite_inferieure = 45
    limite_temporale_droit = 60
    limite_temporale_gauche = 60
    limite_horizontal = 90
    score_esternmen = 80
    image = ImageField(filename='perimetry.jpg')
    images = ImageField(filename='perimetry_data.zip')


class TechnicalExamenFactory(BaseFactory):
    class Meta:
        model = TechnicalExamen
    
    visual_acuity = factory.SubFactory(VisualAcuityFactory)
    refraction = factory.SubFactory(RefractionFactory)
    ocular_tension = factory.SubFactory(OcularTensionFactory)
    pachymetry = factory.SubFactory(PachymetryFactory)
    is_completed = True


class ClinicalExamenFactory(BaseFactory):
    class Meta:
        model = ClinicalExamen
    
    conclusion = factory.SubFactory(ConclusionFactory)
    perimetry = factory.SubFactory(PerimetryFactory)
    og = factory.SubFactory(EyeSideFactory)
    od = factory.SubFactory(EyeSideFactory)
    bp_sup = factory.SubFactory(BpSuPFactory)
    is_completed = True


class ExamensFactory(BaseFactory):
    class Meta:
        model = Examens
    
    technical_examen = factory.SubFactory(TechnicalExamenFactory)
    clinical_examen = factory.SubFactory(ClinicalExamenFactory)
    is_completed = True