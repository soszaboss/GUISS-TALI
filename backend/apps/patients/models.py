from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _
from django_extensions.db.models import TimeStampedModel
from phonenumber_field.modelfields import PhoneNumberField


class Conducteur(TimeStampedModel):
    TYPE_PERMIS_CHOICES = [
        ('Léger', _('Light')),
        ('Lourd', _('Heavy')),
        ('Autres à préciser', _('Other (please specify)')),
    ]

    OUI_NON_CHOICES = [
        (True, _('Yes')),
        (False, _('No')),
    ]

    SERVICE_CHOICES = [
        ('Public', _('Public')),
        ('Privé', _('Private')),
        ('Particulier', _('Individual')),
    ]

    INSTRUCTION_CHOICES = [
        ('Française', _('French')),
        ('Arabe', _('Arabic')),
    ]

    SEXE_CHOICES = [
        ('Homme', _('Male')),
        ('Femme', _('Female')),
        ('Anonyme', _('Anonymous')),
    ]

    NIVEAU_INSTRUCTION_CHOICES = [
        ('Primaire', _('Primary')),
        ('Secondaire', _('Secondary')),
        ('Supérieure', _('Higher education')),
        ('Autres', _('Other')),
        ('Aucune', _('None')),
    ]

    email = models.EmailField(_('Email'), unique=True, db_index=True, null=False, blank=False)
    first_name = models.CharField(_('First name'), max_length=30)
    last_name = models.CharField(_('Last name'), max_length=30)
    phone_number = PhoneNumberField(_('Phone number'), default='SN', unique=True, db_index=True)
    date_naissance = models.DateField(_('Date of birth'))
    sexe = models.CharField(_('Gender'), choices=SEXE_CHOICES, max_length=10, default='Homme')

    numero_permis = models.CharField(_('License number'), max_length=14, unique=True, db_index=True)
    type_permis = models.CharField(_('License type'), choices=TYPE_PERMIS_CHOICES)
    autre_type_permis = models.CharField(_('Other license type'), max_length=100, blank=True, null=True)
    date_delivrance_permis = models.DateField(_('License issue date'))
    date_peremption_permis = models.DateField(_('License expiration date'))

    transporteur_professionnel = models.BooleanField(_('Professional transporter'), choices=OUI_NON_CHOICES)
    service = models.CharField(_('Service'), max_length=12, choices=SERVICE_CHOICES)

    type_instruction_suivie = models.CharField(_('Instruction type'), choices=INSTRUCTION_CHOICES, max_length=15)
    niveau_instruction = models.CharField(_('Education level'), choices=NIVEAU_INSTRUCTION_CHOICES, max_length=15)

    annees_experience = models.PositiveIntegerField(_('Years of experience'))
    image = models.ImageField(_('Profile picture'), upload_to='profils/conducteurs',
                              default='profils/profile_avatars/avatar.png', null=True)

    class Meta:
        verbose_name = _('Driver')
        verbose_name_plural = _('Drivers')

    def clean(self):
        super().clean()

        if self.date_peremption_permis <= self.date_delivrance_permis:
            raise ValidationError(
                {'date_expiration_permis': _('Doit être après la date de délivrance')}
            )

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"


class Vehicule(TimeStampedModel):
    VEHICULE_CHOICES = [
        ('Léger', _('Light')),
        ('Lourd', _('Heavy')),
        ('Autres', _('Other')),
    ]

    immatriculation = models.CharField(_('Registration'), max_length=15, blank=True, null=True)
    modele = models.CharField(_('Model'), max_length=15, blank=True, null=True)
    annee = models.CharField(_('Year'), max_length=15, blank=True, null=True)

    type_vehicule_conduit = models.CharField(_('Vehicle type driven'), choices=VEHICULE_CHOICES, max_length=15)
    autre_type_vehicule_conduit = models.CharField(_('Other vehicle type'), max_length=100, blank=True, null=True)
    conducteur = models.ForeignKey(Conducteur, on_delete=models.CASCADE, verbose_name=_('Driver'))

    class Meta:
        verbose_name = _('Vehicle')
        verbose_name_plural = _('Vehicles')

    def __str__(self):
        return f"{self.modele} | {self.immatriculation}"
