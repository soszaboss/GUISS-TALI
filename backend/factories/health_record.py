import factory
from factory.django import DjangoModelFactory
from apps.health_record.models import (
    DriverExperience,
    Antecedent,
    HealthRecord
)
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
    
    patient = factory.SubFactory(ConducteurFactory)
    antecedant = factory.SubFactory(AntecedentFactory, patient=factory.SelfAttribute('..patient'))
    driver_experience = factory.SubFactory(
        DriverExperienceFactory,
        patient=factory.SelfAttribute('..patient')
    )


    @factory.post_generation
    def sExamenss(self, create, extracted, **kwargs):
        if not create:
            return
            
        if extracted:
            # Utilisation correcte de set() après création
            self.sExamenss.set(extracted)