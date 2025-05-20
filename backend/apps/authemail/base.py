from django.conf import settings
from django.db import models
from django_extensions.db.models import TimeStampedModel
from django.utils.translation import gettext_lazy as _

from services.authemail import send_multi_format_email


class AbstractBaseCode(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    code = models.CharField(_('code'), max_length=40, unique=True, db_index=True, null=True, blank=True)

    class Meta:
        abstract = True

    def send_email(self, prefix):
        ctxt = {
            'email': self.user.email,
            'first_name': self.user.profile.first_name,
            'last_name': self.user.profile.last_name,
            'code': self.code
        }
        send_multi_format_email(prefix, ctxt, target_email=self.user.email)

    def __str__(self):
        return self.code
