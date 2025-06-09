# apps/conducteurs/tests/unit/factories.py
import factory
from factory.django import DjangoModelFactory
from apps.patients.models import Conducteur, Vehicule
from datetime import date, timedelta

from utils.generate_fake_data import generate_random_phone_number, generate_random_license_number, generate_random_plate_number


class ConducteurFactory(DjangoModelFactory):
    class Meta:
        model = Conducteur

    email = factory.Faker('email')
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    phone_number = factory.LazyFunction(lambda: generate_random_phone_number())
    date_naissance = date(1990, 1, 1)
    sexe = "Homme"

    numero_permis = factory.LazyFunction(lambda: generate_random_license_number())
    type_permis = factory.Iterator(['leger', 'lourd', 'autres'])
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

    immatriculation = factory.LazyFunction(lambda: generate_random_plate_number())
    modele = "Toyota"
    annee = "2019"
    type_vehicule_conduit = "Léger"
    autre_type_vehicule_conduit = None
    conducteur = factory.SubFactory(ConducteurFactory)

