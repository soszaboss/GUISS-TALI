from typing import Optional, List, Dict, Any
from apps.users.models import User, Profile


def user_get(*, user_id: int) -> Optional[User]:
    """Retrieve a single user by ID."""
    return User.objects.filter(id=user_id).first()


def user_list(*, filters: Optional[Dict[str, Any]] = None) -> List[User]:
    """List users with optional filtering."""
    filters = filters or {}
    qs = User.objects.all()

    if role := filters.get('role'):
        qs = qs.filter(role=role)

    if is_active := filters.get('is_active'):
        qs = qs.filter(is_active=is_active)

    return qs


def profile_get(*, user: User) -> Optional[Profile]:
    """Retrieve profile for given user."""
    return Profile.objects.filter(user=user).first()


def profile_list(*, filters: Optional[Dict[str, Any]] = None) -> List[Profile]:
    """List profiles with optional filtering."""
    filters = filters or {}
    qs = Profile.objects.select_related('user')

    if gender := filters.get('gender'):
        qs = qs.filter(gender=gender)

    if city := filters.get('city'):
        qs = qs.filter(city__iexact=city)

    return qs