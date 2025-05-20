import pytest

from apps.users.models import User, Profile
from tests.unit.conftest import generer_numero_senegalais
from tests.unit.users.factories import UserFactory, ProfileFactory
from django.core.exceptions import ValidationError



@pytest.mark.django_db
class TestUserModel:

    def test_create_user_successfully(self):
        """Teste la création d'un utilisateur avec uniquement les champs obligatoires."""
        user = UserFactory()
        assert user.email
        assert user.check_password("defaultpassword")
        assert user.role in User.Role.values
        assert user.is_active
        assert not user.is_staff  # Par défaut
        assert not user.is_superuser  # Par défaut
        assert str(user) == user.email

    def test_create_user_missing_and_invalid_email(self):
        """🚫 Vérifie qu'une erreur est levée lorsque l'email est absent ou invalide lors de la création de l'utilisateur."""
        with pytest.raises(ValidationError):
            user = User(email=None)
            user.full_clean()

        with pytest.raises(ValidationError):
            User.objects.create_user(
                email="invalid-email",
                role=User.Role.ASSIST,
                password="test",
                phone_number=generer_numero_senegalais(),
            )

    def test_user_email_normalization(self):
        """Teste la normalisation des emails (ex: majuscules -> minuscules)."""
        user = User.objects.create_user(
            email="TEST@EXAMPLE.COM",
            role=User.Role.ADMIN,
            password="test",
            phone_number=generer_numero_senegalais(),
        )
        assert user.email == "TEST@example.com"

    @pytest.mark.parametrize("role", User.Role.values)
    def test_user_roles(self, role):
        """Teste que tous les rôles peuvent être assignés."""
        user = User.objects.create_user(
            email=f"{role}@example.com",
            role=role,
            password="password",
            phone_number=generer_numero_senegalais(),

        )
        user.full_clean()
        assert user.role == role

    def test_create_superuser(self):
        """👑 Vérifie que la création d’un superutilisateur fonctionne avec les bons attributs (is_superuser, is_staff, etc.)."""
        user = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpass',
            phone_number=generer_numero_senegalais(),
        )
        assert user.is_superuser is True
        assert user.is_staff is True
        assert user.is_verified is True
        assert user.role == User.Role.ADMIN
        assert user.check_password('adminpass')

    def test_email_user_sends_email(self, mailoutbox):
        """📧 Vérifie que l’envoi d’un email via la méthode `email_user` fonctionne et envoie un message dans la boîte mail."""
        user = UserFactory()
        user.email_user("Hello", "Test message", from_email="noreply@example.com")
        assert len(mailoutbox) == 1
        assert mailoutbox[0].subject == "Hello"
        assert mailoutbox[0].to == [user.email]


@pytest.mark.django_db
class TestProfileModel:

    def test_profile_creation_and_link_to_user(self):
        """🧩 Vérifie qu’un profil peut être créé et est bien lié à un utilisateur valide."""
        profile = ProfileFactory()
        assert profile.user
        assert profile.first_name
        assert profile.last_name

    def test_profile_full_name(self):
        """👤 Vérifie que la propriété `full_name` retourne le nom complet du profil."""
        profile = ProfileFactory(first_name="Alioune", last_name="Ndoye")
        assert profile.full_name == "Alioune Ndoye"

    def test_profile_short_name(self):
        """🆔 Vérifie que la propriété `short_name` retourne bien le prénom du profil."""
        profile = ProfileFactory(first_name="Alioune")
        assert profile.short_name == "Alioune"

    def test_profile_without_names(self):
        """🔎 Vérifie que `full_name` et `short_name` ne plantent pas même si les noms sont vides ou absents."""
        profile = ProfileFactory(first_name="", last_name=None)
        assert profile.full_name == ""
        assert profile.short_name == ""

    def test_profile_gender_choices(self):
        """⚥ Vérifie que les choix de genre sont bien enregistrés et accessibles via les valeurs définies."""
        male = ProfileFactory(gender=Profile.Gender.MALE)
        female = ProfileFactory(gender=Profile.Gender.FEMALE)
        assert male.gender == 1
        assert female.gender == 2

    def test_profile_optional_fields_null(self):
        """🧪 Vérifie que tous les champs optionnels du profil peuvent être `null` sans causer d’erreurs."""
        profile = ProfileFactory(
            address=None, city=None, zip=None, birthday=None, avatar=None
        )
        assert profile.address is None
        assert profile.city is None
        assert profile.zip is None
        assert profile.birthday is None