from django.db import transaction
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

from apps.users.models import User, Profile


@transaction.atomic
def user_create(*, email: str, password: str, role: str, phone_number: str) -> User:
    # if User.objects.filter(email=email).exists():
    #     raise ValidationError(_("A user with this email already exists."))
    # if User.objects.filter(phone_number=phone_number).exists():
    #     raise ValidationError(_("A user with this phone number already exists."))

    user = User(
        email=email,
        role=role,
        phone_number=phone_number,
    )
    user.set_password(password)
    user.full_clean()

    with transaction.atomic():
        user.save()

        # Create user profil
        profile_create(user=user)

    return user


@transaction.atomic
def user_update(*, user: User, **data) -> User:
    for attr, value in data.items():
        if not attr in ['role', 'email']:
            setattr(user, attr, value)
    user.full_clean()
    user.save()
    return user


@transaction.atomic
def profile_create(
    *,
    user: User,
    first_name: str = "",
    last_name: str = "",
    birthday=None,
    gender=None,
    address: str = "",
    city: str = "",
    zip: str = "",
) -> Profile:
    if hasattr(user, 'profile'):
        raise ValidationError(_("This user already has a profile."))

    profile = Profile.objects.create(
        user=user,
        first_name=first_name,
        last_name=last_name,
        birthday=birthday,
        gender=gender,
        address=address,
        city=city,
        zip=zip
    )

    return profile


@transaction.atomic
def profile_update(
    *,
    user: User,
    first_name: str = None,
    last_name: str = None,
    birthday=None,
    gender=None,
    address: str = None,
    city: str = None,
    zip: str = None,
) -> Profile:
    """
    Met à jour le profil de l'utilisateur s'il existe.
    """
    try:
        profile = user.profile
    except Profile.DoesNotExist:
        raise ValidationError(_("This user does not have a profile."))

    # Mise à jour des champs fournis
    if first_name is not None:
        profile.first_name = first_name
    if last_name is not None:
        profile.last_name = last_name
    if birthday is not None:
        profile.birthday = birthday
    if gender is not None:
        profile.gender = gender
    if address is not None:
        profile.address = address
    if city is not None:
        profile.city = city
    if zip is not None:
        profile.zip = zip

    profile.save()
    return profile