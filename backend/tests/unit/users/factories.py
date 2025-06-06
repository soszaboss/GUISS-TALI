# users/tests/factories.py
import factory
from factory.django import DjangoModelFactory
from apps.users.models import User, Profile


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Faker('email')#.Sequence(lambda n: f"user{n}@test.com")
    phone_number = factory.Sequence(lambda n: f"+221771{n:06}")
    role = factory.Iterator(User.Role.values)
    is_active = True
    is_verified = True
    is_staff = False
    password = factory.PostGenerationMethodCall('set_password', 'defaultpassword')


class ProfileFactory(DjangoModelFactory):
    class Meta:
        model = Profile

    user = factory.SubFactory(UserFactory)
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    birthday = factory.Faker("date_of_birth", minimum_age=18)
    gender = factory.Iterator([1, 2])
    address = factory.Faker('street_address')
    city = factory.Faker('city')
    zip = factory.Faker('postcode')
