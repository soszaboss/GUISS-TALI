# tests/unit/auth/test_models.py
import faker
import pytest
import binascii
import os
from datetime import timedelta

from django.conf import settings
from django.db import IntegrityError
from django.utils import timezone
from django.core.exceptions import ValidationError
from faker.proxy import Faker

from apps.authemail.models import PasswordResetCode, EmailChangeCode
from apps.users.models import User
from services.users import user_create
from factories.authmail import (
    SignupCodeFactory,
    PasswordResetCodeFactory,
    EmailChangeCodeFactory
)

from factories.users import UserFactory


fake = Faker('Fr')

@pytest.mark.django_db
class TestSignupCodeModel:
    def test_code_generation(self):
        """Vérifie que le code est bien généré et unique"""
        code1 = SignupCodeFactory().code
        code2 = SignupCodeFactory().code
        assert len(code1) == 40  # SHA-1 hexdigest
        assert code1 != code2

    def test_ip_address_required(self):
        """Vérifie que l'adresse IP est obligatoire"""
        with pytest.raises(IntegrityError):
            code = SignupCodeFactory(ipaddr=None)
            code.full_clean()

    def test_verification_workflow(self):
        """Test complet du workflow de vérification"""
        # Création du code
        user = user_create(
            email=fake.email(),
            password=fake.password(),
            role=User.Role.ASSIST,
            phone_number="+221786543443"
        )
        signup_code = SignupCodeFactory(user=user)
        assert not signup_code.user.is_verified

        # Vérification via le manager
        from apps.authemail.managers import SignupCodeManager
        manager = SignupCodeManager()
        assert manager.set_user_is_verified(signup_code.code) is True

        # Vérification du résultat
        signup_code.user.refresh_from_db()
        assert signup_code.user.is_verified

        # Tentative avec un code invalide
        assert manager.set_user_is_verified("invalid_code") is False


@pytest.mark.django_db
class TestPasswordResetCodeModel:
    def test_expiry_period(self):
        """Vérifie la période d'expiration"""
        from apps.authemail.managers import PasswordResetCodeManager
        manager = PasswordResetCodeManager()
        assert manager.get_expiry_period() == settings.AUTH_EMAIL_EXPIRY_PERIOD

    def test_reset_workflow(self):
        """Test complet du workflow de réinitialisation"""
        # Création du code
        reset_code = PasswordResetCodeFactory()

        # Vérification du code

        assert PasswordResetCode.objects.filter(code=reset_code.code).exists()

        # Expiration du code
        # reset_code.created = timezone.now() - timedelta(days=settings.AUTH_EMAIL_EXPIRY_PERIOD + 1)
        # reset_code.save()
        # assert not PasswordResetCode.objects.filter(code=reset_code.code).exists()


@pytest.mark.django_db
class TestEmailChangeCodeModel:
    def test_email_validation(self):
        """Vérifie la validation de l'email"""
        with pytest.raises(ValidationError):
            code = EmailChangeCodeFactory(email="invalid-email")
            code.full_clean()

    def test_change_workflow(self):
        """Test complet du workflow de changement d'email"""
        # Création du code
        old_email = "old@example.com"
        new_email = "new@example.com"
        user = UserFactory(email=old_email)
        change_code = EmailChangeCodeFactory(user=user, email=new_email)

        # Code valide
        assert EmailChangeCode.objects.filter(code=change_code.code).exists()

        # Changement d'email
        user.email = new_email
        user.save()
        change_code.delete()

        # Vérification finale
        user.refresh_from_db()
        assert user.email == new_email
        assert not EmailChangeCode.objects.filter(code=change_code.code).exists()