from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.authemail.base import AbstractBaseCode
from services.authemail import send_multi_format_email
from apps.authemail.managers import SignupCodeManager, EmailChangeCodeManager, PasswordResetCodeManager


class PasswordResetCode(AbstractBaseCode):
    objects = PasswordResetCodeManager()

    def send_password_reset_email(self):
        prefix = 'password_reset_email'
        self.send_email(prefix)


class EmailChangeCode(AbstractBaseCode):
    email = models.EmailField(_('email address'), max_length=255)

    objects = EmailChangeCodeManager()

    def send_email_change_emails(self):
        prefix = 'email_change_notify_previous_email'
        self.send_email(prefix)

        prefix = 'email_change_confirm_new_email'
        ctxt = {
            'email': self.email,
            'code': self.code
        }

        send_multi_format_email(prefix, ctxt, target_email=self.email)


class SignupCode(AbstractBaseCode):
    ipaddr = models.GenericIPAddressField(_('ip address'))

    objects = SignupCodeManager()

    def send_signup_email(self):
        prefix = 'signup_email'
        self.send_email(prefix)
