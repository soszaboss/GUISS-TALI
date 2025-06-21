from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _
from django_extensions.db.models import TimeStampedModel

from apps.patients.models import Conducteur
from utils.models.choices import VisiteChoices


class Base(TimeStampedModel):
    patient = models.ForeignKey(Conducteur, on_delete=models.CASCADE, db_index=True)
    visite = models.IntegerField(choices=VisiteChoices.choices, db_index=True)

    class Meta:
        abstract = True

    def clean(self):
        """
        Vérifie qu'une seule instance par (patient, visite) existe pour chaque sous-modèle.
        """
        model_class = self.__class__
        if model_class.objects.filter(patient=self.patient, visite=self.visite).exclude(pk=self.pk).exists():
            raise ValidationError(
                f"Une instance de {model_class.__name__} pour le patient {self.patient} "
                f"et la visite {self.get_visite_display()} existe déjà."
            )

    def save(self, *args, **kwargs):
        self.full_clean()  # Appelle clean() avant de sauvegarder
        super().save(*args, **kwargs)


class OcularMeasurementBase(TimeStampedModel):
    od = models.FloatField(_('OD (œil droit)'))
    og = models.FloatField(_('OG (œil gauche)'))

    class Meta:
        abstract = True

    def validate_eye_measurements(self, field_prefix, min_val, max_val):
        """Valide les mesures pour OD/OG"""
        for eye in ['od', 'og']:
            value = getattr(self, f"{field_prefix}_{eye}", None)
            if value is not None and not (min_val <= value <= max_val):
                raise ValidationError(
                    _(f"La valeur {eye} doit être entre {min_val} et {max_val}")
                )
