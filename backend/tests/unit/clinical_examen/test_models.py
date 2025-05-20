# tests/test_models.py
import pytest
from django.core.exceptions import ValidationError

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
from tests.unit.clinical_examen.factories import (
    VisualAcuityFactory,
    RefractionFactory,
    OcularTensionFactory,
    PachymetryFactory,
    PlaintesFactory,
    SegmentAnterieurFactory,
    SegmentPosterieurFactory,
    BiomicroscopyFactory,
    PerimetryFactory,
    ConclusionFactory,
    ExamenCliniqueFactory
)
from tests.unit.patients.factories import ConducteurFactory
from utils.models.choices import HypotonisantValue, SegmentChoices, ChambreAnterieureTransparence, Vitre, VisiteChoices


# 1. VisualAcuity Model Tests
@pytest.mark.django_db
class TestVisualAcuityModel:
    def test_create_visual_acuity(self):
        va = VisualAcuityFactory()
        assert va.avsc_od == "20/20"
        assert VisualAcuity.objects.count() == 1

    def test_unique_patient_visite_constraint(self):
        va = VisualAcuityFactory()
        with pytest.raises(ValidationError):
            VisualAcuityFactory(patient=va.patient, visite=va.visite)

# 2. Refraction Model Tests
@pytest.mark.django_db
class TestRefractionModel:
    def test_valid_refraction(self):
        refraction = RefractionFactory()
        assert -10 <= refraction.od_s <= 10
        assert Refraction.objects.count() == 1

    def test_invalid_refraction_values(self):
        refraction = RefractionFactory.build(od_s=15.0)
        with pytest.raises(ValidationError):
            refraction.full_clean()

# 3. OcularTension Model Tests
@pytest.mark.django_db
class TestOcularTensionModel:
    def test_without_ttt(self):
        ot = OcularTensionFactory()
        assert ot.ttt_hypotonisant is False
        assert ot.ttt_hypotonisant_value is None

    def test_with_ttt(self):
        ot = OcularTensionFactory(
            ttt_hypotonisant=True,
            ttt_hypotonisant_value=HypotonisantValue.PROSTAGLANDINES
        )
        assert ot.ttt_hypotonisant is True
        assert ot.ttt_hypotonisant_value is not None

    def test_ttt_validation(self):
        ot = OcularTensionFactory.build(ttt_hypotonisant=True, ttt_hypotonisant_value=HypotonisantValue.PROSTAGLANDINES)
        with pytest.raises(ValidationError):
            ot.full_clean()

# 4. Pachymetry Model Tests
@pytest.mark.django_db
class TestPachymetryModel:
    def test_pachymetry_creation(self):
        pachy = PachymetryFactory()
        assert 450 <= pachy.od <= 600
        assert Pachymetry.objects.count() == 1

# 5. Plaintes Model Tests
@pytest.mark.django_db
class TestPlaintesModel:
    def test_basic_complaint(self):
        plaintes = PlaintesFactory(diplopie=False,
                                   diplopie_type=None,
                                   strabisme=False,
                                   strabisme_eye=None,
                                   nystagmus=False,
                                   nystagmus_eye=None,
                                   ptosis=False,
                                   ptosis_eye=None)


        assert plaintes.od_symptom == 'AUCUN'

    # def test_diplopie_validation(self):
    #     plaintes = PlaintesFactory.build(diplopie=True, diplopie_type=None)
    #     with pytest.raises(ValidationError):
    #         plaintes.full_clean()
    @pytest.mark.parametrize(
        "diplopie,diplopie_type,strabisme,strabisme_eye,nystagmus,nystagmus_eye,ptosis,ptosis_eye",
        [
            (True, 'monoculaire', True, 'od', True, 'od', True, 'od'),
            (True, 'binoculaire', True, 'og', True, 'og', True, 'og'),
            (True, 'monoculaire', True, 'odg', True, 'odg', True, 'odg'),
        ]
    )
    def test_complete_complaint(
            self, diplopie, diplopie_type, strabisme,
            strabisme_eye, nystagmus, nystagmus_eye, ptosis,
            ptosis_eye
    ):
        plaintes = PlaintesFactory(
            diplopie=diplopie,
            diplopie_type=diplopie_type,
            strabisme=strabisme,
            strabisme_eye=strabisme_eye,
            nystagmus=nystagmus,
            nystagmus_eye=nystagmus_eye,
            ptosis=ptosis,
            ptosis_eye=ptosis_eye,
            od_symptom='BAV'
        )

        assert plaintes.diplopie_type in ['monoculaire', 'binoculaire']
        assert plaintes.strabisme_eye in ['od', 'og', 'odg']
        assert plaintes.nystagmus_eye in ['od', 'og', 'odg']
        assert plaintes.ptosis_eye in ['od', 'og', 'odg']

# 6. SegmentAnterieur Model Tests
@pytest.mark.django_db
class TestSegmentAnterieurModel:
    def test_normal_segment(self):
        segment = SegmentAnterieurFactory()
        assert segment.transparence == ChambreAnterieureTransparence.NORMAL

    def test_anomalie_validation(self):
        segment = SegmentAnterieurFactory(with_anomalie=True)
        assert segment.type_anomalie_value is not None
        assert segment.quantite_anomalie is not None

    def test_invalid_anomalie(self):
        segment = SegmentAnterieurFactory.build(
            transparence='ANORMALE',
            type_anomalie_value=None
        )
        with pytest.raises(ValidationError):
            segment.full_clean()

# 7. SegmentPosterieur Model Tests
@pytest.mark.django_db
class TestSegmentPosterieurModel:
    def test_segment_creation(self):
        segment = SegmentPosterieurFactory()
        assert segment.vitre == Vitre.NORMAL
        assert SegmentPosterieur.objects.count() == 1

# 8. Biomicroscopy Model Tests
@pytest.mark.django_db
class TestBiomicroscopyModel:
    def test_biomicroscopy_creation(self):
        patient = ConducteurFactory()
        visite = VisiteChoices.FIRST
        sa = SegmentAnterieurFactory(patient=patient, visite=visite)
        sp = SegmentPosterieurFactory(patient=patient, visite=visite)
        sa.save()
        sp.save()
        bio = BiomicroscopyFactory(
            patient=patient,
            segment_posterieur=sp,
            segment_anterieur=sa,
            visite=visite
        )
        bio.save()
        assert bio.segment_anterieur is not None
        assert bio.segment_posterieur is not None

    def test_patient_visite_consistency(self):
        patient = ConducteurFactory()
        visite = VisiteChoices.FIRST
        sa = SegmentAnterieurFactory(patient=patient, visite=visite)
        sp = SegmentPosterieurFactory(patient=patient, visite=visite)
        sa.save()
        sp.save()
        bio = BiomicroscopyFactory(
            patient=patient,
            segment_posterieur=sp,
            segment_anterieur=sa,
            visite=visite
        )
        bio.save()
        assert bio.segment_anterieur.patient == bio.patient
        assert bio.segment_posterieur.visite == bio.visite

    def test_inconsistent_patient(self):
        patient = ConducteurFactory()
        visite = VisiteChoices.FIRST
        sa = SegmentAnterieurFactory(patient=patient, visite=visite)
        sp = SegmentPosterieurFactory(patient=patient, visite=visite)
        sa.save()
        sp.save()
        bio = BiomicroscopyFactory(
            patient=patient,
            segment_posterieur=sp,
            segment_anterieur=sa,
            visite=visite
        )
        bio.save()
        with pytest.raises(ValidationError):
            bio.segment_anterieur.patient = ConducteurFactory()
            bio.full_clean()

# 9. Perimetry Model Tests
@pytest.mark.django_db
class TestPerimetryModel:
    def test_perimetry_creation(self):
        perimetry = PerimetryFactory()
        assert perimetry.image.name is not None

    @pytest.mark.parametrize(
        "limite_inferieure,limite_superieure,limite_horizontal,limite_temporale_gauche,limite_temporale_droit,score_esternmen",
        [
            (-5, -12, -8, -1, -23, -7),
            (192, 195, 198, 191, 197, 193)
        ]
    )
    def test_limit_validation(
            self, limite_inferieure, limite_superieure, limite_horizontal,
            limite_temporale_gauche, limite_temporale_droit, score_esternmen
    ):
        perimetry = PerimetryFactory.build(
            limite_inferieure=limite_inferieure,
            limite_superieure=limite_superieure,
            limite_horizontal=limite_horizontal,
            limite_temporale_gauche=limite_temporale_gauche,
            limite_temporale_droit=limite_temporale_droit,
            score_esternmen=score_esternmen
        )
        with pytest.raises(ValidationError):
            perimetry.full_clean()

# 10. Conclusion Model Tests
@pytest.mark.django_db
class TestConclusionModel:
    def test_conclusion_creation(self):
        conclusion = ConclusionFactory()
        assert conclusion.vision in ['compatible', 'incompatible', 'a_risque']

    def test_conclusion_false_choices(self):
        with pytest.raises(ValidationError):
            conclusion = ConclusionFactory(vision='compatibles')
            conclusion.full_clean()


# 11. ExamenClinique Model Tests
@pytest.mark.django_db
class TestExamenCliniqueModel:
    def test_examen_creation(self):
        examen = ExamenCliniqueFactory()
        assert examen.status == 'draft'
        assert ExamenClinique.objects.count() == 1

        # Vérifier que la biomicroscopie et ses segments sont cohérents
        assert examen.biomicroscopy.patient == examen.patient
        assert examen.biomicroscopy.visite == examen.visite
        assert examen.biomicroscopy.segment_anterieur.patient == examen.patient
        assert examen.biomicroscopy.segment_posterieur.patient == examen.patient

    def test_completed_examen(self):
        examen = ExamenCliniqueFactory(is_complete=True)
        examen.save()
        assert examen.status == 'completed'
        assert examen.is_complete is True

    def test_unique_patient_visite(self):
        examen = ExamenCliniqueFactory()
        with pytest.raises(ValidationError):
            ExamenCliniqueFactory(patient=examen.patient, visite=examen.visite)

    def test_related_models_consistency(self):
        examen = ExamenCliniqueFactory()

        # Vérifier que tous les modèles liés ont le bon patient/visite
        for model in [examen.visualAcuity, examen.conclusion, examen.perimetry,
                      examen.plaintes, examen.pachymetry, examen.ocular_tension,
                      examen.refraction, examen.biomicroscopy]:
            assert model.patient == examen.patient
            assert model.visite == examen.visite

    def test_complete_status_transition(self):
        examen = ExamenCliniqueFactory()
        examen.status = 'completed'
        examen.full_clean()
        examen.save()