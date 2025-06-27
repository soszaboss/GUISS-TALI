import pytest
from django.core.exceptions import ValidationError
from apps.health_record.models import Antecedent, DriverExperience, HealthRecord
from apps.patients.models import Conducteur
from utils.models.choices import (
    AddictionTypeChoices, FamilialChoices, EtatConducteurChoices, DommageChoices
)
from datetime import date

@pytest.mark.django_db
def test_antecedent_addiction_and_familial_validation():
    patient = Conducteur.objects.create(
        first_name="Jean", last_name="Dupont", date_naissance="1980-01-01"
    )

    # Cas valide : addiction tabagisme avec détail, familial avec OTHER et détail
    antecedent = Antecedent(
        patient=patient,
        addiction=True,
        type_addiction=[AddictionTypeChoices.TABAGISME, AddictionTypeChoices.OTHER],
        tabagisme_detail="10 paquets/an",
        autre_addiction_detail="Cannabis",
        familial=[FamilialChoices.CECITE, "OTHER"],
        autre_familial_detail="Glaucome familial"
    )
    antecedent.full_clean()  # Ne doit pas lever d'exception

    # Cas erreur : addiction True sans type_addiction
    antecedent2 = Antecedent(
        patient=patient,
        addiction=True,
        type_addiction=[],
        familial=[]
    )
    with pytest.raises(ValidationError) as excinfo:
        antecedent2.full_clean()
    assert "spécifier au moins un type d'addiction" in str(excinfo.value)

    # Cas erreur : tabagisme sans détail
    antecedent3 = Antecedent(
        patient=patient,
        addiction=True,
        type_addiction=[AddictionTypeChoices.TABAGISME],
        tabagisme_detail="",
        familial=[]
    )
    with pytest.raises(ValidationError) as excinfo:
        antecedent3.full_clean()
    assert "détails pour le tabagisme" in str(excinfo.value)

    # Cas erreur : familial OTHER sans détail
    antecedent4 = Antecedent(
        patient=patient,
        addiction=False,
        type_addiction=[],
        familial=["OTHER"],
        autre_familial_detail=""
    )
    with pytest.raises(ValidationError) as excinfo:
        antecedent4.full_clean()
    assert "préciser les autres antécédents familiaux" in str(excinfo.value)

@pytest.mark.django_db
def test_driver_experience_validation():
    patient = Conducteur.objects.create(
        first_name="Marie", last_name="Martin", date_naissance="1975-05-05"
    )
    # Cas valide
    exp = DriverExperience(
        patient=patient,
        visite=1,
        etat_conducteur=EtatConducteurChoices.ACTIF,
        km_parcourus=10000,
        nombre_accidents=0,
        tranche_horaire="Journée",
        corporel_dommage=True,
        corporel_dommage_type=DommageChoices.MODERE,
        materiel_dommage=True,
        materiel_dommage_type=DommageChoices.MODERE,
        date_visite=date.today()
    )
    exp.full_clean()  # Ne doit pas lever d'exception

    # Cas erreur : km_parcourus négatif
    exp2 = DriverExperience(
        patient=patient,
        visite=2,
        etat_conducteur=EtatConducteurChoices.ACTIF,
        km_parcourus=-100,
        nombre_accidents=0
    )
    with pytest.raises(ValidationError) as excinfo:
        exp2.full_clean()
    assert "kilomètres parcourus ne peuvent pas être négatifs" in str(excinfo.value).lower()

    # Cas erreur : nombre_accidents négatif
    exp3 = DriverExperience(
        patient=patient,
        visite=3,
        etat_conducteur=EtatConducteurChoices.ACTIF,
        km_parcourus=100,
        nombre_accidents=-1
    )
    with pytest.raises(ValidationError) as excinfo:
        exp3.full_clean()
    assert "nombre d'accidents ne peut pas être négatif" in str(excinfo.value).lower()

    # Cas erreur : corporel_dommage sans type
    exp4 = DriverExperience(
        patient=patient,
        visite=4,
        etat_conducteur=EtatConducteurChoices.ACTIF,
        corporel_dommage=True,
        corporel_dommage_type=None
    )
    with pytest.raises(ValidationError) as excinfo:
        exp4.full_clean()
    assert "spécifier le type de dommage corporel" in str(excinfo.value).lower()

@pytest.mark.django_db
def test_health_record_patient_coherence():
    patient1 = Conducteur.objects.create(
        first_name="Paul", last_name="Durand", date_naissance="1990-02-02"
    )
    patient2 = Conducteur.objects.create(
        first_name="Alice", last_name="Lemoine", date_naissance="1985-03-03"
    )
    antecedent = Antecedent.objects.create(
        patient=patient1,
        addiction=False,
        type_addiction=[],
        familial=[]
    )
    # Cas valide
    record = HealthRecord(
        patient=patient1,
        antecedant=antecedent
    )
    record.full_clean()  # Ne doit pas lever d'exception

    # Cas erreur : incohérence patient/antecedant
    record2 = HealthRecord(
        patient=patient2,
        antecedant=antecedent
    )
    with pytest.raises(ValidationError) as excinfo:
        record2.full_clean()
    assert "incohérence dans les données patient" in str(excinfo.value).lower()