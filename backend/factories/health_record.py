import factory
from factory.django import DjangoModelFactory
import factory.fuzzy
from apps.health_record.models import (
    DriverExperience,
    Antecedent,
    HealthRecord
)
from factories.examens import ClinicalExamenFactory, ExamensFactory, TechnicalExamenFactory
from factories.patients import ConducteurFactory
from utils.models.choices import (
    DommageChoices,
    FamilialChoices,
    AddictionTypeChoices,
    EtatConducteurChoices,
    DECESCauseChoices,
    ArretCauseChoices,
)

class DriverExperienceFactory(DjangoModelFactory):
    class Meta:
        model = DriverExperience

    patient = factory.SubFactory(ConducteurFactory)
    visite = factory.Sequence(lambda n: n + 1)
    etat_conducteur = EtatConducteurChoices.ACTIF
    deces_cause = None
    inactif_cause = None
    km_parcourus = factory.fuzzy.FuzzyFloat(1000, 100000)
    nombre_accidents = factory.fuzzy.FuzzyInteger(0, 5)
    tranche_horaire = factory.fuzzy.FuzzyChoice(["Journée", "Nuit", "Mixte"])
    corporel_dommage = factory.fuzzy.FuzzyChoice([True, False])
    materiel_dommage_type = factory.LazyAttribute(
        lambda o: factory.fuzzy.FuzzyChoice([DommageChoices.MODERE, DommageChoices.LEGER, DommageChoices.IMPORTANT]) if o.materiel_dommage else None
    )
    materiel_dommage = factory.fuzzy.FuzzyChoice([True, False])
    materiel_dommage_type = factory.LazyAttribute(
        lambda o: factory.fuzzy.FuzzyChoice([DommageChoices.MODERE, DommageChoices.LEGER, DommageChoices.IMPORTANT]) if o.materiel_dommage else None
    )
    date_visite = factory.Faker(
        "date_between",
        start_date="-12M",
        end_date="today"
    )
    date_dernier_accident = factory.Faker(
        "date_between",
        start_date="-24M",
        end_date="today"
    )

class AntecedentFactory(DjangoModelFactory):
    class Meta:
        model = Antecedent

    patient = factory.SubFactory(ConducteurFactory)
    antecedents_medico_chirurgicaux = "Antécédents généraux"
    pathologie_ophtalmologique = "Myopie"
    addiction = factory.fuzzy.FuzzyChoice([True, False])
    type_addiction = factory.LazyAttribute(
        lambda o: [AddictionTypeChoices.TABAGISME, AddictionTypeChoices.ALCOOL,
                    AddictionTypeChoices.SANS_PARTICULARITE, AddictionTypeChoices.OTHER,
                    AddictionTypeChoices.TELEPHONE] if o.addiction else []
    )
    autre_addiction_detail = factory.LazyAttribute(
        lambda o: "Autre addiction" if AddictionTypeChoices.OTHER in o.type_addiction else ""
    )
    tabagisme_detail = factory.LazyAttribute(
        lambda o: "10 paquets/an" if AddictionTypeChoices.TABAGISME in o.type_addiction else ""
    )
    familial = factory.LazyAttribute(
        lambda o: [FamilialChoices.CECITE, FamilialChoices.GPAO, FamilialChoices.OTHER]
    )
    autre_familial_detail = factory.LazyAttribute(
        lambda o: "Antécédent familial autre" if FamilialChoices.OTHER in o.familial else ""
    )

    @factory.post_generation
    def set_addiction_fields(self, create, extracted, **kwargs):
        # Gère les détails conditionnels selon le contenu de type_addiction
        if not create:
            return
        if self.addiction:
            if AddictionTypeChoices.TABAGISME in self.type_addiction:
                self.tabagisme_detail = "10 paquets/an"
            if AddictionTypeChoices.OTHER in self.type_addiction:
                self.autre_addiction_detail = "Autre addiction"
            self.save()
        if "OTHER" in self.familial:
            self.autre_familial_detail = "Antécédent familial autre"
            self.save()

class HealthRecordFactory(DjangoModelFactory):
    class Meta:
        model = HealthRecord

    risky_patient = factory.fuzzy.FuzzyChoice([True, False])
    patient = factory.SubFactory(ConducteurFactory)
    antecedant = factory.SubFactory(AntecedentFactory, patient=factory.SelfAttribute('..patient'))

    @factory.post_generation
    def examens(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            self.examens.set(extracted)
        else:
            generated_examens = []
            for i in range(3):
                technical_examen = TechnicalExamenFactory(patient=self.patient, visite=i + 1)
                clinical_examen = ClinicalExamenFactory(patient=self.patient, visite=i + 1)
                examen = ExamensFactory(
                    patient=self.patient,
                    visite=i + 1,
                    technical_examen=technical_examen,
                    clinical_examen=clinical_examen
                )
                generated_examens.append(examen)
            self.examens.set(generated_examens)

    @factory.post_generation
    def driver_experience(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            self.driver_experience.set(extracted)
            self.save()
        else:
            driver_experiences = [DriverExperienceFactory(patient=self.patient, visite=i+1) for i in range(3)]
            self.driver_experience.set(driver_experiences)
            self.save()