# tests/services/test_examen_services.py
import pytest
from django.core.exceptions import ValidationError
from services.examens import (
    ExamenService,
    TechnicalExamenService,
    ClinicalExamenService,
    ConclusionService
)
from factories.examens import (
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
    """Tests pour ExamenService"""

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
        # Premier appel - création
        examen, created = ExamenService.get_or_create_examen(patient, VisiteChoices.FIRST)
        assert created is True
        
        # Deuxième appel - récupération
        same_examen, created = ExamenService.get_or_create_examen(patient, VisiteChoices.FIRST)
        assert created is False
        assert examen.id == same_examen.id

    def test_complete_examen(self):
        examen = ExamensFactory()
        updated_examen = ExamenService.complete_examen(examen.id)
        assert updated_examen.is_completed is True

@pytest.mark.django_db
class TestTechnicalExamenService:
    """Tests pour TechnicalExamenService"""

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
            'avsc_dg': 0.345,
            'avac_od': 3.456,
            'avac_og': 4.567,
            'avac_dg': 8.567
        }
        va = TechnicalExamenService.update_visual_acuity(technical_examen.id, data)
        assert va.avsc_od == 1.234
        technical_examen.refresh_from_db()
        assert technical_examen.visual_acuity == va

    def test_update_visual_acuity_update(self):
        va = VisualAcuityFactory(avsc_od=0.0)
        technical_examen = TechnicalExamenFactory(visual_acuity=va)
        data = {'avsc_od': 1.234}
        updated_va = TechnicalExamenService.update_visual_acuity(technical_examen.id, data)
        assert updated_va.avsc_od == 1.234
        assert updated_va.id == va.id

    def test_complete_technical_examen(self):
        # Cas incomplet
        technical_examen = TechnicalExamenFactory()
        with pytest.raises(ValidationError):
            technical_examen.visual_acuity.delete()
            technical_examen.save()
            result = TechnicalExamenService.complete_technical_examen(technical_examen.id)

        # Cas complet
        technical_examen = TechnicalExamenFactory()
        result = TechnicalExamenService.complete_technical_examen(technical_examen.id)
        assert result.is_completed is True

@pytest.mark.django_db
class TestClinicalExamenService:
    """Tests pour ClinicalExamenService"""

    def test_init_clinical_examen_new(self):
        examen = ExamensFactory()
        clinical_examen = ClinicalExamenService.init_clinical_examen(examen.id)
        assert clinical_examen is not None
        examen.refresh_from_db()
        assert examen.clinical_examen == clinical_examen

    # def test_create_plaintes_success(self):
    #     clinical_examen = ClinicalExamenFactory()
    #     data = {
    #         'od':{
    #             'eye_symptom': 'BAV',
    #             'diplopie': False
    #         },
    #         'og':{
    #         'eye_symptom': 'AUCUN',
    #         'diplopie': False
    #         }
    #     }
    #     clinical_examen.og.delete()
    #     clinical_examen.od.delete()
    #     plaintes = ClinicalExamenService.create_plaintes(clinical_examen.id, data)
    #     assert plaintes.od_symptom == 'BAV'
    #     clinical_examen.refresh_from_db()
    #     assert clinical_examen.og.plaintes == plaintes
    #     assert clinical_examen.od.plaintes == plaintes

    def test_create_plaintes_already_exists(self):
        clinical_examen = ClinicalExamenFactory(og=EyeSideFactory(), od=EyeSideFactory())
        with pytest.raises(ValidationError, match="existent déjà"):
            ClinicalExamenService.create_plaintes(clinical_examen.id, {})

    def test_update_segment_anterior_create(self):
        eye_side = EyeSideFactory()
        data = {
            'cornee': 'Normal',
            'pupille': 'Normal'
        }
        segment = ClinicalExamenService.update_segment_anterior(eye_side.id, data)
        assert segment.cornee == 'Normal'
        eye_side.refresh_from_db()
        assert eye_side.bp_sg_anterieur == segment

    def test_complete_clinical_examen(self):

        # Cas complet
        clinical_examen = ClinicalExamenFactory()
        result = ClinicalExamenService.complete_clinical_examen(clinical_examen.id)
        assert result.is_completed is True

@pytest.mark.django_db
class TestConclusionService:
    """Tests pour ConclusionService"""

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
