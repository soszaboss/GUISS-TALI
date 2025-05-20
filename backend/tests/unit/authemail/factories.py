# tests/unit/auth/factories.py
import os
import binascii
import factory
from django.utils import timezone
from apps.authemail.models import SignupCode, PasswordResetCode, EmailChangeCode
from tests.unit.users.factories import UserFactory


class AbstractCodeFactory(factory.django.DjangoModelFactory):
    class Meta:
        abstract = True

    user = factory.SubFactory(UserFactory)
    code = factory.LazyFunction(lambda: binascii.hexlify(os.urandom(20)).decode('utf-8'))
    created = factory.LazyFunction(timezone.now)


class SignupCodeFactory(AbstractCodeFactory):
    class Meta:
        model = SignupCode

    ipaddr = factory.Faker('ipv4')


class PasswordResetCodeFactory(AbstractCodeFactory):
    class Meta:
        model = PasswordResetCode


class EmailChangeCodeFactory(AbstractCodeFactory):
    class Meta:
        model = EmailChangeCode

    email = factory.Faker('email')