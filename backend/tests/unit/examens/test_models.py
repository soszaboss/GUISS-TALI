# tests/test_examens_models.py
import pytest
from django.core.exceptions import ValidationError
from factories.examens import (
    ExamensFactory,
    TechnicalExamenFactory,
    ClinicalExamenFactory,
    VisualAcuityFactory,
    RefractionFactory,
    OcularTensionFactory,
    PachymetryFactory,
    PlaintesFactory,
    BiomicroscopySegmentAnterieurFactory,
    BiomicroscopySegmentPosterieurFactory,
    BpSuPFactory,
    EyeSideFactory,
    PerimetryFactory,
    ConclusionFactory
)
from utils.models.choices import (
    HypotonisantValue,
    ChambreAnterieureTransparence,
    Symptomes
)

@pytest.mark.django_db
class TestExamensModels:
    """Tests complets pour tous les modèles d'examens"""

    # 1. Tests pour VisualAcuity
    def test_visual_acuity_creation(self):
        va = VisualAcuityFactory(
            avsc_od=1.234,
            avsc_og=2.345,
            avac_od=3.456,
            avac_og=4.567
        )
        assert 0 <= va.avsc_od <= 10
        assert 0 <= va.avac_og <= 10

    @pytest.mark.parametrize("field,invalid_value", [
        ('avsc_od', -0.001),
        ('avsc_og', 10.001),
        ('avac_od', 10.1),
        ('avac_og', -1.0)
    ])
    def test_visual_acuity_invalid_values(self, field, invalid_value):
        with pytest.raises(ValidationError):
            va = VisualAcuityFactory(**{field: invalid_value})
            va.full_clean()

    # 2. Tests pour Refraction
    def test_refraction_creation(self):
        refraction = RefractionFactory(
            od_s=-5.0,
            og_c=2.0,
            dp=62.0
        )
        assert -10 <= refraction.od_s <= 10
        assert -10 <= refraction.og_c <= 10

    @pytest.mark.parametrize("field,invalid_value", [
        ('od_s', -10.1),
        ('og_c', 10.1),
        ('od_a', 181),
        ('dp', 0)
    ])
    def test_refraction_invalid_values(self, field, invalid_value):
        with pytest.raises(ValidationError):
            r = RefractionFactory(**{field: invalid_value})
            r.full_clean()

    # 3. Tests pour OcularTension
    def test_ocular_tension_with_ttt(self):
        ot = OcularTensionFactory(
            ttt_hypotonisant=True,
            od=21.0,
            og=8.0,
            ttt_hypotonisant_value=HypotonisantValue.BBLOQUANTS
        )
        assert ot.ttt_hypotonisant_value in [c[0] for c in HypotonisantValue.choices]
        ot.full_clean()

    def test_ocular_tension_missing_ttt_value(self):
        with pytest.raises(ValidationError, match='ne doit pas avoir la valeur null'):
            ot = OcularTensionFactory(
                ttt_hypotonisant=True,
                ttt_hypotonisant_value=None
            )
            ot.full_clean()

    # 4. Tests pour Plaintes
    @pytest.mark.parametrize("condition,required_field", [
        ('diplopie', 'diplopie_type'),
        ('strabisme', 'strabisme_eye'),
        ('nystagmus', 'nystagmus_eye'),
        ('ptosis', 'ptosis_eye')
    ])
    def test_plaintes_required_fields(self, condition, required_field):
        with pytest.raises(ValidationError):
            p = PlaintesFactory(**{
                condition: True,
                required_field: None
            })
            p.full_clean()

    # 5. Tests pour SegmentAntérieur
    def test_segment_anterieur_anomalie(self):
        sa = BiomicroscopySegmentAnterieurFactory(
            transparence=ChambreAnterieureTransparence.ANORMALE,
            type_anomalie_value='Pigments',
            quantite_anomalie='Minime'
        )
        sa.full_clean()

    def test_segment_anterieur_missing_anomalie_details(self):
        with pytest.raises(ValidationError):
            sa = BiomicroscopySegmentAnterieurFactory(
                transparence=ChambreAnterieureTransparence.ANORMALE,
                type_anomalie_value=None
            )
            sa.full_clean()

    # 6. Tests pour TechnicalExamen
    def test_technical_examen_completion(self):
        # Examen complet
        te = TechnicalExamenFactory()
        assert te.is_completed

        # Examen incomplet
        tech = TechnicalExamenFactory()
        tech.visual_acuity.delete()  # supprime en base

        with pytest.raises(ValidationError):
            tech.full_clean()


    # 7. Tests pour ClinicalExamen
    def test_clinical_examen_relations(self):
        ce = ClinicalExamenFactory()
        assert ce.og is not None
        assert ce.od is not None
        assert ce.bp_sup is not None
        assert ce.is_completed

    # 8. Tests pour Examens (conteneur principal)
    def test_examen_completion(self):
        # Examen complet
        examen = ExamensFactory()
        assert examen.is_completed

        # Examen technique manquant
        examen_incomplete_tech = ExamensFactory(technical_examen=None)
        examen_incomplete_tech.save()
        assert not examen_incomplete_tech.is_completed


    def test_examen_unique_patient_visite(self):
        examen = ExamensFactory()
        with pytest.raises(ValidationError):
            ExamensFactory(
                patient=examen.patient,
                visite=examen.visite
            ).full_clean()

    # 9. Tests pour BpSuP (éléments supplémentaires)
    def test_bp_sup_creation(self):
        bp = BpSuPFactory()
        assert 'retinographie' in bp.retinographie.name
        assert 'oct' in bp.oct.name

    # 10. Tests pour Perimetry
    @pytest.mark.parametrize("field,value,valid", [
        ('limite_superieure', 90, True),
        ('limite_inferieure', 0.1, True),
        ('score_esternmen', 100, True),
        ('limite_horizontal', 181, False)
    ])
    def test_perimetry_validation(self, field, value, valid):
        if valid:
            p = PerimetryFactory(**{field: value})
            p.full_clean()
        else:
            with pytest.raises(ValidationError):
                p = PerimetryFactory(**{field: value})
                p.full_clean()

    # 11. Tests pour Conclusion
    def test_conclusion_creation(self):
        conclusion = ConclusionFactory(
            vision='compatible',
            rv=True
        )
        assert conclusion.cat is not None
        assert conclusion.traitement is not None

    # 12. Tests pour EyeSide
    def test_eye_side_relations(self):
        eye_side = EyeSideFactory()
        assert eye_side.plaintes is not None
        assert eye_side.bp_sg_anterieur is not None
        assert eye_side.bp_sg_posterieur is not None