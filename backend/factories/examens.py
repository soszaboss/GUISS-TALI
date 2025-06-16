import random
import factory
from factory import fuzzy
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
from utils.models.choices import ChambreAnterieureTransparence, HypotonisantValue, QuantiteAnomalie, SegmentChoices, Symptomes, TypeAnomalie, VisiteChoices


class BaseFactory(DjangoModelFactory):
    class Meta:
        abstract = True
    
    patient = factory.SubFactory(ConducteurFactory)
    visite = fuzzy.FuzzyChoice([v[0] for v in VisiteChoices.choices])

class VisualAcuityFactory(DjangoModelFactory):
    class Meta:
        model = VisualAcuity
    
    avsc_od = factory.Faker('pyfloat', min_value=0, max_value=10, right_digits=3)
    avsc_og = factory.Faker('pyfloat', min_value=0, max_value=10, right_digits=3)
    avsc_dg = factory.Faker('pyfloat', min_value=0, max_value=10, right_digits=3)
    avac_od = factory.Faker('pyfloat', min_value=0, max_value=10, right_digits=3)
    avac_og = factory.Faker('pyfloat', min_value=0, max_value=10, right_digits=3)
    avac_dg = factory.Faker('pyfloat', min_value=0, max_value=10, right_digits=3)


class RefractionFactory(DjangoModelFactory):
    class Meta:
        model = Refraction
    
    od_s = fuzzy.FuzzyFloat(-5.0, 5.0)
    od_c = fuzzy.FuzzyFloat(-2.0, 2.0)
    od_a = fuzzy.FuzzyInteger(0, 180)
    og_s = fuzzy.FuzzyFloat(-5.0, 5.0)
    og_c = fuzzy.FuzzyFloat(-2.0, 2.0)
    og_a = fuzzy.FuzzyInteger(0, 180)
    dp = fuzzy.FuzzyInteger(55, 70)

class PachymetryFactory(DjangoModelFactory):
    class Meta:
        model = Pachymetry
    
    od = fuzzy.FuzzyInteger(450, 600)
    og = fuzzy.FuzzyInteger(450, 600)


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
    
    od = 0.0
    og = 0.0
    segment = fuzzy.FuzzyChoice([c[0] for c in SegmentChoices.choices])
    transparence = fuzzy.FuzzyChoice([c[0] for c in ChambreAnterieureTransparence.choices])
    type_anomalie_value = factory.LazyAttribute(
        lambda o: random.choice([c[0] for c in TypeAnomalie.choices])
        if o.transparence == ChambreAnterieureTransparence.ANORMALE else None
    )
    quantite_anomalie = factory.LazyAttribute(
        lambda o: random.choice([c[0] for c in QuantiteAnomalie.choices])
        if o.transparence == ChambreAnterieureTransparence.ANORMALE else None
    )

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
    
    od = 0.0
    og = 0.0
    segment = 'NORMAL'
    vitre = 'NORMAL'
    retine = 1.0
    papille = 'NORMALE'
    macula = 'NORMAL'
    retinien_peripherique = 'NORMAL'
    vaissaux = 'NORMAUX'

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
    
    pbo = 'Normal'
    limite_superieure = 45
    limite_inferieure = 45
    limite_temporale_droit = 60
    limite_temporale_gauche = 60
    limite_horizontal = 90
    score_esternmen = 80
    image = ImageField(filename='perimetry.jpg')
    images = ImageField(filename='perimetry_data.zip')

class ConclusionFactory(DjangoModelFactory):
    class Meta:
        model = Conclusion
    
    vision = 'compatible'
    cat = factory.Faker('text', max_nb_chars=200)
    traitement = factory.Faker('text', max_nb_chars=200)
    observation = factory.Faker('text', max_nb_chars=200)
    rv = True

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