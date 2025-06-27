import pytest
from django.core.exceptions import ValidationError
from services.examens import (
    ExamenService,
    TechnicalExamenService,
    ClinicalExamenService,
    ConclusionService
)
from factories.examens import (
    BiomicroscopySegmentPosterieurFactory,
    BpSuPFactory,
    ConclusionFactory,
    ExamensFactory,
    OcularTensionFactory,
    PachymetryFactory,
    PerimetryFactory,
    TechnicalExamenFactory,
    ClinicalExamenFactory,
    VisualAcuityFactory,
    RefractionFactory,
    EyeSideFactory
)
from factories.patients import ConducteurFactory
from utils.models.choices import VisiteChoices

@pytest.mark.django_db
class TestExamenService:
    def test_create_examen_success(self):
        patient = ConducteurFactory()
        examen = ExamenService.create_examen(patient, VisiteChoices.FIRST)
        assert examen.patient == patient
        assert examen.visite == VisiteChoices.FIRST

    def test_create_examen_duplicate(self):
        patient = ConducteurFactory()
        ExamenService.create_examen(patient, VisiteChoices.FIRST)
        with pytest.raises(ValidationError, match="existe déjà"):
            ExamenService.create_examen(patient, VisiteChoices.FIRST)

    def test_get_or_create_examen(self):
        patient = ConducteurFactory()
        examen, created = ExamenService.get_or_create_examen(patient, VisiteChoices.FIRST)
        assert created is True
        same_examen, created = ExamenService.get_or_create_examen(patient, VisiteChoices.FIRST)
        assert created is False
        assert examen.id == same_examen.id

    def test_complete_examen(self):
        examen = ExamensFactory()
        updated_examen = ExamenService.complete_examen(examen.id)
        assert updated_examen.is_completed is True

@pytest.mark.django_db
class TestTechnicalExamenService:
    def test_init_technical_examen_new(self):
        examen = ExamensFactory()
        technical_examen = TechnicalExamenService.init_technical_examen(examen.id)
        assert technical_examen is not None
        examen.refresh_from_db()
        assert examen.technical_examen == technical_examen

    def test_init_technical_examen_existing(self):
        examen = ExamensFactory(technical_examen=TechnicalExamenFactory())
        existing = examen.technical_examen
        technical_examen = TechnicalExamenService.init_technical_examen(examen.id)
        assert technical_examen == existing

    def test_update_visual_acuity_create(self):
        technical_examen = TechnicalExamenFactory()
        data = {
            'avsc_od': 1.234,
            'avsc_og': 2.345,
            'avsc_odg': 0.345,
            'avac_od': 3.456,
            'avac_og': 4.567,
            'avac_odg': 8.567
        }
        va = TechnicalExamenService.update_visual_acuity(technical_examen.id, data)
        assert float(va.avsc_od) == 1.234
        technical_examen.refresh_from_db()
        assert technical_examen.visual_acuity == va

    def test_update_visual_acuity_update(self):
        va = VisualAcuityFactory(avsc_od=0.0)
        technical_examen = TechnicalExamenFactory(visual_acuity=va)
        data = {'avsc_od': 1.234}
        updated_va = TechnicalExamenService.update_visual_acuity(technical_examen.id, data)
        assert float(updated_va.avsc_od) == 1.234
        assert updated_va.id == va.id

    def test_complete_technical_examen(self):
        technical_examen = TechnicalExamenFactory()
        with pytest.raises(ValidationError):
            technical_examen.visual_acuity.delete()
            technical_examen.save()
            TechnicalExamenService.complete_technical_examen(technical_examen.id)
        technical_examen = TechnicalExamenFactory()
        result = TechnicalExamenService.complete_technical_examen(technical_examen.id)
        assert result.is_completed is True

@pytest.mark.django_db
class TestClinicalExamenService:
    def test_init_clinical_examen_new(self):
        examen = ExamensFactory()
        clinical_examen = ClinicalExamenService.init_clinical_examen(examen.id)
        assert clinical_examen is not None
        examen.refresh_from_db()
        assert examen.clinical_examen == clinical_examen

    def test_create_plaintes_already_exists(self):
        clinical_examen = ClinicalExamenFactory(og=EyeSideFactory(), od=EyeSideFactory())
        with pytest.raises(ValidationError):
            ClinicalExamenService.create_plaintes(clinical_examen.id, {})

    def test_update_segment_anterior_create(self):
        eye_side = EyeSideFactory()
        data = {
            'cornee': 'NORMAL',
            'pupille': 'NORMAL'
        }
        segment = ClinicalExamenService.update_segment_anterior(eye_side.id, data)
        assert segment.cornee == 'NORMAL'
        eye_side.refresh_from_db()
        assert eye_side.bp_sg_anterieur == segment

    def test_complete_clinical_examen(self):
        clinical_examen = ClinicalExamenFactory()
        result = ClinicalExamenService.complete_clinical_examen(clinical_examen.id)
        assert result.is_completed is True

@pytest.mark.django_db
class TestConclusionService:
    def test_update_conclusion_create(self):
        clinical_examen = ClinicalExamenFactory()
        data = {
            'vision': 'compatible',
            'cat': 'Suivi standard'
        }
        conclusion = ConclusionService.update_conclusion(clinical_examen.id, data)
        assert conclusion.vision == 'compatible'
        clinical_examen.refresh_from_db()
        assert clinical_examen.conclusion == conclusion

    def test_update_conclusion_update(self):
        clinical_examen = ClinicalExamenFactory()
        data = {'vision': 'compatible'}
        updated = ConclusionService.update_conclusion(clinical_examen.id, data)
        assert updated.vision == 'compatible'

@pytest.mark.django_db
class TestTechnicalExamenServiceExtras:
    def test_update_ocular_tension_create(self):
        technical_examen = TechnicalExamenFactory()
        data = {
            'od': 18.5,
            'og': 17.2,
            'ttt_hypotonisant': True,
            'ttt_hypotonisant_value': 'BBLOQUANTS'
        }
        obj = TechnicalExamenService.update_ocular_tension(technical_examen.id, data)
        assert obj.od == 18.5
        technical_examen.refresh_from_db()
        assert technical_examen.ocular_tension == obj

    def test_update_ocular_tension_update(self):
        instance = OcularTensionFactory(od=12.5)
        technical_examen = TechnicalExamenFactory(ocular_tension=instance)
        data = {'od': 20.5}
        updated = TechnicalExamenService.update_ocular_tension(technical_examen.id, data)
        assert updated.od == 20.5
        assert updated.id == instance.id

    def test_update_pachymetry_create(self):
        technical_examen = TechnicalExamenFactory()
        data = {
            'od': 545,
            'og': 555
        }
        obj = TechnicalExamenService.update_pachymetry(technical_examen.id, data)
        assert obj.od == 545
        assert obj.og == 555
        technical_examen.refresh_from_db()
        assert technical_examen.pachymetry == obj

    def test_update_pachymetry_update(self):
        instance = PachymetryFactory(od=490)
        technical_examen = TechnicalExamenFactory(pachymetry=instance)
        data = {'od': 505}
        updated = TechnicalExamenService.update_pachymetry(technical_examen.id, data)
        assert updated.od == 505
        assert updated.id == instance.id

@pytest.mark.django_db
class TestClinicalExamenServiceExtras:
    def test_update_bp_sup_create(self):
        clinical_examen = ClinicalExamenFactory(bp_sup=None)
        data = {
            'retinographie': 'retinographie.jpg',
            'oct': 'oct.jpg',
            'autres': 'autres.jpg'
        }
        bp = ClinicalExamenService.update_bp_sup(clinical_examen.id, data)
        assert bp.retinographie.name.endswith('retinographie.jpg')
        clinical_examen.refresh_from_db()
        assert clinical_examen.bp_sup == bp

    def test_update_bp_sup_update(self):
        bp = BpSuPFactory()
        clinical_examen = ClinicalExamenFactory(bp_sup=bp)
        data = {'oct': 'nouveau_oct.jpg'}
        updated = ClinicalExamenService.update_bp_sup(clinical_examen.id, data)
        assert updated.oct.name.endswith('nouveau_oct.jpg')

    def test_update_perimetry_create(self):
        clinical_examen = ClinicalExamenFactory()
        data = {
            'pbo': 'Normal',
            'limite_superieure': 50,
            'limite_inferieure': 50,
            'limite_temporale_droit': 60,
            'limite_temporale_gauche': 60,
            'limite_horizontal': 90,
            'score_esternmen': 85,
            'image': 'perimetry.jpg',
            'images': 'perimetry_data.zip'
        }
        peri = ClinicalExamenService.update_perimetry(clinical_examen.id, data)
        assert peri.pbo == 'Normal'
        clinical_examen.refresh_from_db()
        assert clinical_examen.perimetry == peri

    def test_update_perimetry_update(self):
        peri = PerimetryFactory(score_esternmen=60)
        clinical_examen = ClinicalExamenFactory(perimetry=peri)
        data = {'score_esternmen': 88}
        updated = ClinicalExamenService.update_perimetry(clinical_examen.id, data)
        assert updated.score_esternmen == 88
        assert updated.id == peri.id

    def test_update_segment_posterior_create(self):
        eye_side = EyeSideFactory()
        data = {
            'segment': 'NORMAL',
            'vitre': 'NORMAL',
            'papille': 'NORMALE',
            'macula': 'NORMAL',
            'retinien_peripherique': 'NORMAL',
            'vaissaux': 'NORMAUX'
        }
        seg = ClinicalExamenService.update_segment_posterior(eye_side.id, data)
        assert seg.macula == 'NORMAL'
        eye_side.refresh_from_db()
        assert eye_side.bp_sg_posterieur == seg

    def test_update_segment_posterior_update(self):
        seg = BiomicroscopySegmentPosterieurFactory(macula='ALTÉRÉ')
        eye_side = EyeSideFactory(bp_sg_posterieur=seg)
        data = {'macula': 'NORMAL'}
        updated = ClinicalExamenService.update_segment_posterior(eye_side.id, data)
        assert updated.macula == 'NORMAL'