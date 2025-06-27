from typing import Optional

from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin, Group, Permission
from django.core.mail import send_mail
from django.utils.translation import gettext_lazy as _
from django.db import models
from django.utils import timezone
from django_extensions.db.models import TimeStampedModel
from phonenumber_field.modelfields import PhoneNumberField


DEFAULT_AVATAR = 'media/images/profiles/avatars/default-profile-picture.png'


class UserManager(BaseUserManager):
    """
            Creates and saves a User with a given email and password.
    """
    def _create_user(
            self,
            email,
            password,
            is_staff,
            is_superuser,
            is_verified,
            **extra_fields
    )-> 'User':
        if not email:
            raise ValueError(_('Users must have an email address'))

        email = self.normalize_email(email)
        now = timezone.now()

        user = self.model(
            email=email,
            is_staff=is_staff,
            is_active=True,
            is_superuser=is_superuser,
            is_verified=is_verified,
            last_login=now,
            **extra_fields
        )
        user.set_password(password)
        user.full_clean()
        user.save(using=self._db)
        return user

    def create_user(
            self,
            email :str,
            role :str,
            password: Optional[str] = None,
            **extra_fields
    )-> 'User' :
        extra_fields.setdefault('role', role)
        return self._create_user(
            email,
            password,
            False,
            False,
            False,
            **extra_fields
        )

    def create_superuser(
            self,
            email,
            password,
            **extra_fields
    )-> 'User':
        extra_fields.setdefault('role', User.Role.SUPER_USER)
        return self._create_user(
            email,
            password,
            True,
            True,
            True,
            **extra_fields
        )


class User(AbstractBaseUser, PermissionsMixin, TimeStampedModel):
    class Role(models.TextChoices):
        SUPER_USER = 'superuser', _('Superuser')
        ADMIN = 'admin', _('Administrator')
        EMPLOYEE = 'employee', _('Employee')
        DOCTOR = 'doctor', _('Doctor')
        TECHNICIAN = 'technician', _('Technician')

    email = models.EmailField(
        _('email address'),
        max_length=255,
        unique=True,
        db_index=True,
    )
    phone_number = PhoneNumberField(
        default='SN',
        blank=True,
        unique=True,
        db_index=True,
    )

    role = models.CharField(
        _('role'),
        max_length=13,
        choices=Role.choices
    )
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this admin site.')
    )
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_('Designates whether this user should be treated as active.')
    )
    is_verified = models.BooleanField(
        _('verified'),
        default=False,
        help_text=_('Designates whether this user has completed the email verification process.')
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone_number']

    objects = UserManager()

    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_groups',
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_permissions',
        blank=True,
    )
    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        ordering = ['-created']

    def email_user(self, subject, message, from_email=None, **kwargs):
        send_mail(subject, message, from_email, [self.email], **kwargs)

    def __str__(self):
        return self.email


class Profile(TimeStampedModel):
    class Gender(models.IntegerChoices):
        MALE = 1, _("Male")
        FEMALE = 2, _("Female")

    user = models.OneToOneField(
        User,
        related_name="profile",
        on_delete=models.CASCADE
    )
    first_name = models.CharField(
        _('first name'),
        max_length=30,
        blank=True,
        null=True
    )
    last_name = models.CharField(
        _('last name'),
        max_length=30,
        blank=True,
        null=True
    )
    avatar = models.ImageField(
        upload_to="images/profiles/avatars/users/",
        default=DEFAULT_AVATAR,
        null=True,
        blank=True
    )
    birthday = models.DateField(null=True, blank=True)
    gender = models.PositiveSmallIntegerField(
        choices=Gender.choices,
        null=True,
        blank=True
    )
    address = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )
    city = models.CharField(
        max_length=50,
        null=True,
        blank=True
    )
    zip = models.CharField(
        max_length=30,
        null=True,
        blank=True
    )

    class Meta:
        verbose_name = _('Profile')
        verbose_name_plural = _('Profiles')
        ordering = ['-created']

    @property
    def full_name(self):
        return f"{self.first_name or ''} {self.last_name or ''}".strip()

    @property
    def short_name(self):
        return self.first_name or ''
