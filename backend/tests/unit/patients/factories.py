# apps/conducteurs/tests/unit/factories.py
import factory
from factory.django import DjangoModelFactory
from apps.patients.models import Conducteur, Vehicule
from datetime import date, timedelta


class ConducteurFactory(DjangoModelFactory):
    class Meta:
        model = Conducteur

    email = factory.Sequence(lambda n: f"conducteur{n}@mail.com")
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    phone_number = factory.Sequence(lambda n: f"+2217700000{n:02}")
    date_naissance = date(1990, 1, 1)
    sexe = "Homme"

    numero_permis = factory.Sequence(lambda n: f"PERMIS{n:07}")
    type_permis = "Léger"
    autre_type_permis = None
    date_delivrance_permis = factory.LazyFunction(lambda: date.today() - timedelta(days=365 * 5))
    date_peremption_permis = factory.LazyFunction(lambda: date.today() + timedelta(days=365 * 2))

    transporteur_professionnel = True
    service = "Public"

    type_instruction_suivie = "Française"
    niveau_instruction = "Secondaire"
    annees_experience = 5
    image = 'media/images/profiles/avatars/default-profile-picture.png'


class VehiculeFactory(DjangoModelFactory):
    class Meta:
        model = Vehicule

    immatriculation = factory.Sequence(lambda n: f"DK-{n:04}-A")
    modele = "Toyota"
    annee = "2019"
    type_vehicule_conduit = "Léger"
    autre_type_vehicule_conduit = None
    conducteur = factory.SubFactory(ConducteurFactory)
