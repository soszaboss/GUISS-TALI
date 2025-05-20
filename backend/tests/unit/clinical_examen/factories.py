# factories.py
import factory
from factory import fuzzy, post_generation
from factory.django import DjangoModelFactory, ImageField

from apps.clinical_examen.models import (
    VisualAcuity,
    Refraction,
    OcularTension,
    Pachymetry,
    Plaintes,
    SegmentAnterieur,
    SegmentPosterieur,
    Biomicroscopy,
    Perimetry,
    Conclusion,
    ExamenClinique
)

from tests.unit.patients.factories import ConducteurFactory

from utils.models.choices import (
    VisiteChoices,
    Cornee,
    ChambreAnterieureProfondeur,
    ChambreAnterieureTransparence,
    Pupille,
    AxeVisuel,
    Cristallin,
    Vitre,
    TypeAnomalie,
    QuantiteAnomalie,
    RPM,
    Iris,
    Macula,
    ChampRetinienPeripherique,
    Vaisseaux,
    PositionCristallin,
    Papille,
    PerimetrieBinoculaire,
    SegmentChoices, HypotonisantValue
)



class BaseFactory(DjangoModelFactory):
    class Meta:
        abstract = True

    patient = factory.SubFactory(ConducteurFactory)
    visite = fuzzy.FuzzyChoice([v[0] for v in VisiteChoices.choices])


class VisualAcuityFactory(BaseFactory):
    class Meta:
        model = VisualAcuity

    avsc_od = "20/20"
    avsc_og = "20/20"
    avsc_dg = "20/20"
    avac_od = "20/20"
    avac_og = "20/20"
    avac_dg = "20/20"


class RefractionFactory(BaseFactory):
    class Meta:
        model = Refraction

    od_s = fuzzy.FuzzyFloat(-5.0, 5.0)
    od_c = fuzzy.FuzzyFloat(-2.0, 2.0)
    od_a = fuzzy.FuzzyInteger(-10, 10)
    og_s = fuzzy.FuzzyFloat(-5.0, 5.0)
    og_c = fuzzy.FuzzyFloat(-2.0, 2.0)
    og_a = fuzzy.FuzzyInteger(-10, 10)
    dp = fuzzy.FuzzyInteger(55, 70)


class PachymetryFactory(BaseFactory):
    class Meta:
        model = Pachymetry

    od = fuzzy.FuzzyInteger(450, 600)
    og = fuzzy.FuzzyInteger(450, 600)


class OcularTensionFactory(BaseFactory):
    class Meta:
        model = OcularTension

    od = fuzzy.FuzzyFloat(8.0, 21.0)
    og = fuzzy.FuzzyFloat(8.0, 21.0)
    ttt_hypotonisant = False
    ttt_hypotonisant_value = None

class PlaintesFactory(BaseFactory):
    class Meta:
        model = Plaintes

    od_symptom = 'AUCUN'
    og_symptom = 'AUCUN'
    diplopie = False
    strabisme = False
    nystagmus = False
    ptosis = False

    class Params:
        with_diplopie = factory.Trait(
            diplopie=True,
            diplopie_type=fuzzy.FuzzyChoice(['monoculaire', 'binoculaire'])
        )
        with_strabisme = factory.Trait(
            strabisme=True,
            strabisme_eye=fuzzy.FuzzyChoice(['od', 'og', 'odg'])
        )
        with_nystagmus = factory.Trait(
            nystagmus=True,
            nystagmus_eye=fuzzy.FuzzyChoice(['od', 'og', 'odg'])
        )
        with_ptosis = factory.Trait(
            ptosis=True,
            ptosis_eye=fuzzy.FuzzyChoice(['od', 'og', 'odg'])
        )

    @factory.post_generation
    def handle_conditions(self, create, extracted, **kwargs):
        if not create:
            return

        # Gestion des champs conditionnels
        if self.diplopie and not self.diplopie_type:
            self.diplopie_type = 'binoculaire'

        if self.strabisme and not self.strabisme_eye:
            self.strabisme_eye = 'od'

        if self.nystagmus and not self.nystagmus_eye:
            self.nystagmus_eye = 'og'

        if self.ptosis and not self.ptosis_eye:
            self.ptosis_eye = 'odg'


class SegmentAnterieurFactory(BaseFactory):
    class Meta:
        model = SegmentAnterieur

    class Params:
        with_anomalie = factory.Trait(
            transparence=ChambreAnterieureTransparence.ANORMALE,
            type_anomalie_value=fuzzy.FuzzyChoice(TypeAnomalie.values),
            quantite_anomalie=fuzzy.FuzzyChoice(QuantiteAnomalie.values)
        )

    segment = SegmentChoices.NORMAL
    cornee = Cornee.NORMAL
    profondeur = ChambreAnterieureProfondeur.NORM
    transparence = ChambreAnterieureTransparence.NORMAL
    pupille = Pupille.NORMAL
    axe_visuel = AxeVisuel.DEGAGE
    rpm = RPM.NORMAL
    iris = Iris.NORMAL
    cristallin = Cristallin.NORMAL
    position_cristallin = PositionCristallin.NORMALE

    @post_generation
    def validate_anomalie(self, create, extracted, **kwargs):
        if self.transparence == ChambreAnterieureTransparence.ANORMALE:
            if not self.type_anomalie_value:
                self.type_anomalie_value = TypeAnomalie.PIGMENTS
            if not self.quantite_anomalie:
                self.quantite_anomalie = QuantiteAnomalie.MINIME


class SegmentPosterieurFactory(BaseFactory):
    class Meta:
        model = SegmentPosterieur

    segment = SegmentChoices.NORMAL
    vitre = Vitre.NORMAL
    retine = fuzzy.FuzzyFloat(0.5, 1.5)
    papille = Papille.NORMALE
    macula = Macula.NORMAL
    retinien_peripherique = ChampRetinienPeripherique.NORMAL
    vaissaux = Vaisseaux.NORMAUX


class BiomicroscopyFactory(BaseFactory):
    class Meta:
        model = Biomicroscopy

    segment_anterieur = factory.SubFactory(SegmentAnterieurFactory)
    segment_posterieur = factory.SubFactory(SegmentPosterieurFactory)

    @classmethod
    def _after_postgeneration(cls, obj, create, results=None):
        super()._after_postgeneration(obj, create, results)
        if create:
            # Synchronisation patient/visite
            for segment in [obj.segment_anterieur, obj.segment_posterieur]:
                segment.patient = obj.patient
                segment.visite = obj.visite
                segment.save()


class PerimetryFactory(BaseFactory):
    class Meta:
        model = Perimetry

    pbo = PerimetrieBinoculaire.NORMAL
    limite_superieure = fuzzy.FuzzyInteger(40, 50)
    limite_inferieure = fuzzy.FuzzyInteger(40, 50)
    limite_temporale_droit = fuzzy.FuzzyInteger(50, 70)
    limite_temporale_gauche = fuzzy.FuzzyInteger(50, 70)
    limite_horizontal = fuzzy.FuzzyInteger(80, 100)
    score_esternmen = fuzzy.FuzzyInteger(70, 100)
    image = ImageField(filename='perimetry.jpg')
    images = ImageField(filename='perimetry_data.zip')

    @post_generation
    def validate_limits(self, create, extracted, **kwargs):
        self.limite_superieure = min(90, max(0, self.limite_superieure))
        self.limite_inferieure = min(90, max(0, self.limite_inferieure))
        self.limite_horizontal = min(180, max(0, self.limite_horizontal))


class ConclusionFactory(BaseFactory):
    class Meta:
        model = Conclusion

    vision = 'compatible'
    cat = factory.Faker('text', max_nb_chars=200)
    traitement = factory.Faker('text', max_nb_chars=200)
    observation = factory.Faker('text', max_nb_chars=200)
    rv = True


class BiomicroscopyExamenCliniqueFactory(BaseFactory):
    class Meta:
        model = Biomicroscopy
        skip_postgeneration_save = True  # Important pour éviter les validations prématurées

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        patient = kwargs.pop('patient', ConducteurFactory())
        visite = kwargs.pop('visite', VisiteChoices.FIRST)

        # Création des segments en premier
        segment_anterieur = SegmentAnterieurFactory(
            patient=patient,
            visite=visite
        )
        segment_posterieur = SegmentPosterieurFactory(
            patient=patient,
            visite=visite
        )

        # Création de la biomicroscopie avec les segments
        bio = model_class.objects.create(
            patient=patient,
            visite=visite,
            segment_anterieur=segment_anterieur,
            segment_posterieur=segment_posterieur,
            **kwargs
        )

        return bio


class ExamenCliniqueFactory(BaseFactory):
    class Meta:
        model = ExamenClinique
        skip_postgeneration_save = True  # Important pour le contrôle manuel

    status = 'draft'
    is_complete = False

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        patient = kwargs.pop('patient', ConducteurFactory())
        visite = kwargs.pop('visite', VisiteChoices.FIRST)

        # Création de tous les modèles liés
        visualAcuity = VisualAcuityFactory(patient=patient, visite=visite)
        conclusion = ConclusionFactory(patient=patient, visite=visite)
        perimetry = PerimetryFactory(patient=patient, visite=visite)
        biomicroscopy = BiomicroscopyExamenCliniqueFactory(patient=patient, visite=visite)
        plaintes = PlaintesFactory(patient=patient, visite=visite)
        pachymetry = PachymetryFactory(patient=patient, visite=visite)
        ocular_tension = OcularTensionFactory(patient=patient, visite=visite)
        refraction = RefractionFactory(patient=patient, visite=visite)

        # Création de l'examen clinique
        examen = model_class.objects.create(
            patient=patient,
            visite=visite,
            status=kwargs.get('status', 'draft'),
            is_complete=kwargs.get('is_complete', False),
            visualAcuity=visualAcuity,
            conclusion=conclusion,
            perimetry=perimetry,
            biomicroscopy=biomicroscopy,
            plaintes=plaintes,
            pachymetry=pachymetry,
            ocular_tension=ocular_tension,
            refraction=refraction
        )

        return examen