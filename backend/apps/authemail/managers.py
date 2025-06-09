from django.db import models
from django.conf import settings

from services.authemail import _generate_code


EXPIRY_PERIOD = settings.AUTH_EMAIL_EXPIRY_PERIOD

class SignupCodeManager(models.Manager):
    def create_signup_code(self, user, ipaddr):
        code = _generate_code()
        while self.filter(code=code).exists():  # Vérifier que le code n'est pas déjà utilisé
            code = _generate_code()
        signup_code = self.create(user=user, code=code, ipaddr=ipaddr)

        return signup_code

    def set_user_is_verified(self, code):
        from apps.authemail.models import SignupCode

        try:
            signup_code = SignupCode.objects.get(code=code)
            signup_code.user.is_verified = True
            signup_code.user.save()
            return True
        except SignupCode.DoesNotExist:
            pass

        return False


class PasswordResetCodeManager(models.Manager):
    def create_password_reset_code(self, user):
        code = _generate_code()
        while self.filter(code=code).exists():  # Vérifier que le code n'est pas déjà utilisé
            code = _generate_code()
        password_reset_code = self.create(user=user, code=code)

        return password_reset_code

    def get_expiry_period(self):
        return EXPIRY_PERIOD


class EmailChangeCodeManager(models.Manager):
    def create_email_change_code(self, user, email):
        code = _generate_code()
        while self.filter(code=code).exists():  # Vérifier que le code n'est pas déjà utilisé
            code = _generate_code()
        email_change_code = self.create(user=user, code=code, email=email)

        return email_change_code

    def get_expiry_period(self):
        return EXPIRY_PERIOD