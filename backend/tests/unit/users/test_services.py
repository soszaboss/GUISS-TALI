# apps/users/tests/unit/test_services.py
import pytest
from django.core.exceptions import ValidationError

from apps.users.models import User, Profile

from services.users import user_create, user_update, profile_create
from factories.users import UserFactory, ProfileFactory

from tests.unit.users.test_models import generer_numero_senegalais


@pytest.mark.django_db
class TestUserCreateService:

    def test_user_create_successfully(self):
        """✅ Vérifie que le service `user_create` crée un utilisateur et un profil lié correctement."""
        email = "newuser@example.com"
        user = user_create(
            email=email,
            password="securepass",
            role=User.Role.EMPLOYEE,
            phone_number=generer_numero_senegalais()
        )
        assert isinstance(user, User)
        assert user.email == email
        assert user.profile  # Profil automatiquement créé

    def test_user_create_missing_fields(self):
        """🚫 Vérifie que la création échoue si des champs requis sont manquants ou invalides."""
        with pytest.raises(ValidationError):
            user_create(
                email="",  # email vide
                password="securepass",
                role=User.Role.ADMIN,
                phone_number=generer_numero_senegalais()
            )

    def test_create_user_with_existing_email_fails(self):
        """Teste qu'un email dupliqué lève une ValidationError."""
        existing_user = UserFactory(email="duplicate@example.com")

        with pytest.raises(ValidationError) as excinfo:
            user_create(
                email="duplicate@example.com",
                password="test",
                role=User.Role.ASSIST,
                phone_number="+221701234568"
            )

        assert "email" in str(excinfo.value)

    def test_create_user_with_existing_phone_fails(self):
        """Teste qu'un numéro de téléphone dupliqué lève une ValidationError."""
        existing_user = UserFactory(phone_number="+221701234567")

        with pytest.raises(ValidationError) as excinfo:
            user_create(
                email="new@example.com",
                password="test",
                role=User.Role.TECHNICAL,
                phone_number="+221701234567"
            )

        assert "phone_number" in str(excinfo.value)

    def test_create_user_with_invalid_role_fails(self):
        """Teste qu'un rôle invalide lève une ValidationError."""
        with pytest.raises(ValidationError):
            user_create(
                email="test@example.com",
                password="test",
                role="INVALID_ROLE",
                phone_number="+221701234567"
            )


# ---- Tests pour user_update ----
@pytest.mark.django_db
class TestUserUpdateService:

    def test_update_user_successfully(self):
        """Teste la mise à jour des champs autorisés."""
        user = UserFactory(role=User.Role.ASSIST, phone_number="+221701234567")
        updated_user = user_update(
            user=user,
            email="updated@example.com",  # Doit être ignoré (non autorisé)
            phone_number="+221701234568"
        )

        assert updated_user.phone_number == "+221701234568"
        assert updated_user.role == User.Role.ASSIST
        assert updated_user.email != "updated@example.com"  # Email non modifié

    def test_update_user_with_invalid_data_fails(self):
        """Teste que les données invalides lèvent une ValidationError."""
        user = UserFactory()

        with pytest.raises(ValidationError):
            user_update(
                user=user,
                phone_number="invalid_phone"  # Format invalide
            )

# ---- Tests pour profile_create ----
@pytest.mark.django_db
class TestProfileCreateUpdateService:

    def test_create_profile_successfully(self):
        """Teste la création d'un profil avec des données valides."""
        user = UserFactory()
        profile = profile_create(
            user=user,
            first_name="Alioune",
            last_name="Ndoye",
            gender=Profile.Gender.MALE
        )

        assert profile.user == user
        assert profile.full_name == "Alioune Ndoye"
        assert profile.gender == Profile.Gender.MALE

    def test_create_profile_for_user_with_existing_profile_fails(self):
        """Teste qu'un utilisateur ne peut avoir qu'un seul profil."""
        user = UserFactory()
        ProfileFactory(user=user)  # Crée un premier profil

        with pytest.raises(ValidationError) as excinfo:
            profile_create(user=user)

        assert "already has a profile" in str(excinfo.value)

    def test_create_profile_with_optional_fields_null(self):
        """Teste que les champs optionnels peuvent être omis."""
        user = UserFactory()
        profile = profile_create(user=user)

        assert profile.first_name == ""
        assert profile.birthday is None

    def test_profile_create_already_exists(self):
        """🚫 Vérifie que `profile_create` lève une erreur si un profil existe déjà pour l'utilisateur."""
        profile = ProfileFactory()
        with pytest.raises(ValidationError):
            profile_create(user=profile.user, first_name="Test")

