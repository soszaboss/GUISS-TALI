# factories.py
import factory
from factory import fuzzy
from factory.django import DjangoModelFactory
from django.utils import timezone

from apps.health_record.models import DriverExperience, Antecedent, HealthRecord
from tests.unit.clinical_examen.factories import ExamenCliniqueFactory
from tests.unit.patients.factories import ConducteurFactory
from utils.models.choices import (
    AddictionTypeChoices,
    FamilialChoices,
    DommageChoices,
    DegatChoices,
    VisiteChoices
)


class DriverExperienceFactory(DjangoModelFactory):
    class Meta:
        model = DriverExperience

    patient = factory.SubFactory(ConducteurFactory)
    visite = fuzzy.FuzzyChoice([v[0] for v in VisiteChoices.choices])
    km_parcourus = fuzzy.FuzzyFloat(1000, 500000)
    nombre_accidents = fuzzy.FuzzyInteger(0, 10)
    tranche_horaire = fuzzy.FuzzyDateTime(timezone.now())
    dommage = fuzzy.FuzzyChoice([c[0] for c in DommageChoices.choices])
    degat = fuzzy.FuzzyChoice([c[0] for c in DegatChoices.choices])

    class Params:
        with_dommage = factory.Trait(
            dommage=fuzzy.FuzzyChoice(['corporel', 'materiel'])
        )
        with_degat = factory.Trait(
            degat=fuzzy.FuzzyChoice(['important', 'modéré', 'léger'])
        )


class AntecedentFactory(DjangoModelFactory):
    class Meta:
        model = Antecedent

    patient = factory.SubFactory(ConducteurFactory)
    antecedents_medico_chirurgicaux = factory.Faker('text', max_nb_chars=500)
    pathologie_ophtalmologique = factory.Faker('text', max_nb_chars=300)
    addiction = False
    familial = fuzzy.FuzzyChoice([c[0] for c in FamilialChoices.choices])

    class Params:
        with_addiction = factory.Trait(
            addiction=True,
            type_addiction=fuzzy.FuzzyChoice([c[0] for c in AddictionTypeChoices.choices]),
            tabagisme_detail=fuzzy.FuzzyText(length=10)  # Ex: "5 paquets/an"
        )
        with_other_addiction = factory.Trait(
            addiction=True,
            type_addiction='other',
            autre_addiction_detail=factory.Faker('word')
        )
        with_familial = factory.Trait(
            familial=fuzzy.FuzzyChoice(['cecite', 'gpao'])
        )
        with_other_familial = factory.Trait(
            familial='other',
            autre_familial_detail=factory.Faker('sentence')
        )

    @factory.post_generation
    def handle_addiction_details(self, create, extracted, **kwargs):
        if not create:
            return

        if self.addiction and self.type_addiction == 'tabagisme' and not self.tabagisme_detail:
            self.tabagisme_detail = "5 paquets/an"

        if self.addiction and self.type_addiction == 'other' and not self.autre_addiction_detail:
            self.autre_addiction_detail = "Dépendance aux jeux"

        if self.familial == 'other' and not self.autre_familial_detail:
            self.autre_familial_detail = "Antécédents familiaux divers"


class HealthRecordFactory(DjangoModelFactory):
    class Meta:
        model = HealthRecord

    patient = factory.SubFactory(ConducteurFactory)
    antecedant = factory.SubFactory(AntecedentFactory)

    @factory.post_generation
    def clinical_examen(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            self.clinical_examen.set(extracted)
        else:
            self.clinical_examen.set([ExamenCliniqueFactory(), ExamenCliniqueFactory()])

    @factory.post_generation
    def driver_experience(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            self.driver_experience.set(extracted)
        else:
            self.driver_experience.set([DriverExperienceFactory(), DriverExperienceFactory()])

