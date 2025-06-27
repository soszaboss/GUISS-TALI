from typing import Optional, List, Dict, Any

from apps.users.models import User, Profile

from django.db.models import Count



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

def get_user_kpis():
    return {
        "total_users": User.objects.count(),
        "admins": User.objects.filter(role="admin").count(),
        "doctors": User.objects.filter(role="doctor").count(),
        "technicians": User.objects.filter(role="technician").count(),
        "employees": User.objects.filter(role="employee").count(),
        "active_users": User.objects.filter(is_active=True).count(),
        "inactive_users": User.objects.filter(is_active=False).count(),
    }

def get_user_roles_distribution():
    return list(
        User.objects.values("role").annotate(count=Count("id")).order_by("-count")
    )

def get_users_created_per_month():
    from django.db.models.functions import TruncMonth
    return list(
        User.objects.annotate(month=TruncMonth("created"))
        .values("month")
        .annotate(count=Count("id"))
        .order_by("month")
    )