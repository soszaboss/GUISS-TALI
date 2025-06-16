from datetime import datetime
import factory
from factory.django import DjangoModelFactory
import factory.fuzzy
from apps.health_record.models import (
    DriverExperience,
    Antecedent,
    HealthRecord
)
from factories.examens import ExamensFactory
from factories.patients import ConducteurFactory
from utils.models.choices import (
    DommageChoices,
    DegatChoices,
    AddictionTypeChoices,
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
    driver_experience = factory.SubFactory(
        DriverExperienceFactory,
        patient=factory.SelfAttribute('..patient')
    )

    @factory.post_generation
    def examens(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            # Si des examens sont fournis, on les ajoute
            for examen in extracted:
                self.examens.add(examen)
        else:
            # Sinon on en génère 3 automatiquement
            for _ in range(3):
                count = _+1
                print(f'patient: {self.patient}')
                print(f'patient email: {self.patient.email}')
                examen = ExamensFactory(patient=self.patient, visite=count)
                self.examens.add(examen)
