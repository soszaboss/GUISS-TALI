import pytest
from typing import Dict, Any
from django.db.models import Q
from apps.users.models import User, Profile
from selector.users import (
    user_get,
    user_list,
    profile_get,
    profile_list,
)
from factories.users import UserFactory, ProfileFactory

# ---- Tests pour user_get ----
@pytest.mark.django_db
class TestUserGetSelector:

    def test_retrieve_existing_user(self):
        """✅ Récupère un utilisateur existant par ID."""
        user = UserFactory()
        result = user_get(user_id=user.id)
        assert result == user

    def test_return_none_for_non_existent_user(self):
        """✅ Retourne None si l'utilisateur n'existe pas."""
        result = user_get(user_id=999)  # ID inexistant
        assert result is None

# ---- Tests pour user_list ----
@pytest.mark.django_db
class TestUserListSelector:

    def test_list_all_users_without_filters(self):
        """✅ Liste tous les utilisateurs sans filtres."""
        users = UserFactory.create_batch(3)
        result = user_list(filters=None)
        assert set(result) == set(users)

    @pytest.mark.parametrize("role, expected_count", [
        (User.Role.EMPLOYEE, 2),
        (User.Role.ADMIN, 1),
        ("INVALID_ROLE", 0),
    ])
    def test_filter_users_by_role(self, role, expected_count):
        """✅ Filtre les utilisateurs par rôle."""
        UserFactory.create_batch(2, role=User.Role.EMPLOYEE)
        UserFactory(role=User.Role.ADMIN)
        result = user_list(filters={"role": role})
        assert len(result) == expected_count

    def test_filter_active_users(self):
        """✅ Filtre les utilisateurs actifs/inactifs."""
        active_users = UserFactory.create_batch(2, is_active=True)
        UserFactory(is_active=False)
        result = user_list(filters={"is_active": True})
        assert set(result) == set(active_users)

# ---- Tests pour profile_get ----
@pytest.mark.django_db
class TestProfileGetSelector:

    def test_retrieve_profile_for_user(self):
        """✅ Récupère le profil d'un utilisateur existant."""
        profile = ProfileFactory()
        result = profile_get(user=profile.user)
        assert result == profile

    def test_return_none_if_no_profile(self):
        """✅ Retourne None si l'utilisateur n'a pas de profil."""
        user = UserFactory()
        result = profile_get(user=user)
        assert result is None

# ---- Tests pour profile_list ----
@pytest.mark.django_db
class TestProfileListSelector:

    def test_list_all_profiles_without_filters(self):
        """✅ Liste tous les profils sans filtres."""
        profiles = ProfileFactory.create_batch(3)
        result = profile_list(filters=None)
        assert set(result) == set(profiles)

    @pytest.mark.parametrize("gender, expected_count", [
        (Profile.Gender.MALE, 2),
        (Profile.Gender.FEMALE, 1),
        (99, 0),  # Genre invalide
    ])
    def test_filter_profiles_by_gender(self, gender, expected_count):
        """✅ Filtre les profils par genre."""
        ProfileFactory.create_batch(2, gender=Profile.Gender.MALE)
        ProfileFactory(gender=Profile.Gender.FEMALE)
        result = profile_list(filters={"gender": gender})
        assert len(result) == expected_count

    def test_filter_profiles_by_case_insensitive_city(self):
        """✅ Filtre les profils par ville (case-insensitive)."""
        ProfileFactory(city="Dakar")
        ProfileFactory(city="dakar")  # Test insensibilité à la casse
        ProfileFactory(city="Thiès")
        result = profile_list(filters={"city": "Dakar"})
        assert len(result) == 2
        assert all(profile.city.lower() == "dakar" for profile in result)
