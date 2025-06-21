from datetime import datetime
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
    DegatChoices,
    FamilialChoices
)

class DriverExperienceFactory(DjangoModelFactory):
    class Meta:
        model = DriverExperience
    
    patient = factory.SubFactory(ConducteurFactory)
    visite = 1  # Première visite par défaut
    km_parcourus = 50000.0
    nombre_accidents = 0
    tranche_horaire = "Journée"
    dommage = DommageChoices.CORPOREL
    degat = DegatChoices.LEGER
    date_visite = factory.LazyFunction(datetime.now().date) 

class AntecedentFactory(DjangoModelFactory):
    class Meta:
        model = Antecedent
    
    patient = factory.SubFactory(ConducteurFactory)
    antecedents_medico_chirurgicaux = "Antécédents généraux"
    pathologie_ophtalmologique = "Myopie"
    addiction = False
    familial = FamilialChoices.CECITE

    @factory.post_generation
    def set_addiction_fields(self, create, extracted, **kwargs):
        if self.addiction and self.type_addiction == 'tabagisme':
            self.tabagisme_detail = "10 paquets/an"
        elif self.addiction and self.type_addiction == 'other':
            self.autre_addiction_detail = "Autre addiction"

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
            self.examens.set(extracted)  # On suppose que c’est un queryset ou une liste
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
            self.examens.set(generated_examens)  # ✅ Là c’est bien une liste


    @factory.post_generation
    def driver_experience(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            # Si des driver_experiences sont fournis, on les ajoute après la création
            self.driver_experience.set(extracted)
            self.save()
        else:
            # Sinon on en génère 3 automatiquement après la création
            driver_experiences = [DriverExperienceFactory(patient=self.patient, visite=i+1) for i in range(3)]
            self.driver_experience.set(driver_experiences)
            self.save()