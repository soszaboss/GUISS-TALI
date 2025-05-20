# # tests/unit/auth/test_services.py
# import pytest
# from datetime import date, timedelta
# from django.conf import settings
# from django.contrib.auth import get_user_model
# from django.core.exceptions import ValidationError
# from rest_framework import status
# from unittest.mock import patch
#
# from apps.authemail.models import SignupCode
# from services.authemail import (
#     user_signup,
#     user_login,
#     user_reset_password,
#     user_reset_password_verify,
#     user_reset_password_verified,
#     email_change_request,
#     email_change_verify,
#     password_change
# )
# from tests.unit.authemail.factories import UserFactory, SignupCodeFactory, PasswordResetCodeFactory, \
#     EmailChangeCodeFactory
#
#
# @pytest.mark.django_db
# class TestUserSignupService:
#     @patch('apps.authemail.services.send_multi_format_email')
#     def test_signup_new_user(self, mock_send_email):
#         """Teste l'inscription d'un nouvel utilisateur"""
#         email = "new@example.com"
#         phone = "+221701234567"
#         user = user_signup(email=email, role="ASSISTANT", phone_number=phone)
#
#         assert user.email == email
#         assert user.phone_number == phone
#         assert user.role == "ASSISTANT"
#         mock_send_email.assert_called_once()
#
#     def test_signup_existing_verified_user_fails(self):
#         """Teste qu'un email déjà utilisé échoue"""
#         existing_user = UserFactory(email="exists@example.com", is_verified=True)
#         with pytest.raises(ValidationError) as excinfo:
#             user_signup(email="exists@example.com", role="ASSISTANT", phone_number="+221701234567")
#         assert "Email address already taken" in str(excinfo.value)
#
#     @patch('apps.authemail.services.send_multi_format_email')
#     def test_signup_unverified_user_creates_new_code(self, mock_send):
#         """Teste qu'un utilisateur non vérifié peut redemander un code"""
#         user = UserFactory(is_verified=False)
#         old_code = SignupCodeFactory(user=user)
#
#         new_user = user_signup(email=user.email, role="ASSISTANT", phone_number="+221701234568")
#         assert new_user == user
#         assert not SignupCode.objects.filter(code=old_code.code).exists()
#
#
# @pytest.mark.django_db
# class TestUserLoginService:
#     def test_login_successful(self):
#         """Teste une connexion réussie"""
#         user = UserFactory(email="test@example.com", password="password")
#         result = user_login(email="test@example.com", password="password")
#         assert 'access' in result
#         assert 'refresh' in result
#
#     def test_login_unverified_user_fails(self):
#         """Teste qu'un utilisateur non vérifié ne peut pas se connecter"""
#         user = UserFactory(is_verified=False)
#         result = user_login(email=user.email, password="password")
#         assert result.status_code == status.HTTP_401_UNAUTHORIZED
#
#
# @pytest.mark.django_db
# class TestPasswordResetService:
#     @patch('apps.authemail.services.send_multi_format_email')
#     def test_password_reset_request(self, mock_send):
#         """Teste la demande de réinitialisation"""
#         user = UserFactory()
#         result = user_reset_password(user.email)
#         assert result == user.email
#         mock_send.assert_called_once()
#
#     def test_password_reset_verify(self):
#         """Teste la vérification du code"""
#         code = PasswordResetCodeFactory()
#         result = user_reset_password_verify(code.code)
#         assert "success" in result
#
#     def test_password_reset_verified(self):
#         """Teste le changement effectif de mot de passe"""
#         code = PasswordResetCodeFactory()
#         new_password = "newSecurePassword123!"
#         result = user_reset_password_verified(code.code, new_password)
#         assert "success" in result
#         assert code.user.check_password(new_password)
#
#
# @pytest.mark.django_db
# class TestEmailChangeService:
#     @patch('apps.authemail.services.send_multi_format_email')
#     def test_email_change_request(self, mock_send):
#         """Teste la demande de changement d'email"""
#         user = UserFactory()
#         new_email = "new@example.com"
#         result = email_change_request(user=user, new_email=new_email)
#         assert result == new_email
#         assert mock_send.call_count == 2
#
#     def test_email_change_verify(self):
#         """Teste la vérification du changement d'email"""
#         code = EmailChangeCodeFactory(email="new@example.com")
#         result = email_change_verify(code=code.code)
#         assert "success" in result
#         assert code.user.email == "new@example.com"
#
#
# @pytest.mark.django_db
# class TestPasswordChangeService:
#     def test_password_change_success(self):
#         """Teste le changement de mot de passe"""
#         user = UserFactory()
#         new_password = "NewSecurePassword123!"
#         result = password_change(user=user, password=new_password)
#         assert "success" in result
#         assert user.check_password(new_password)
#
#     def test_password_change_validation(self):
#         """Teste la validation du mot de passe"""
#         user = UserFactory()
#         with pytest.raises(ValidationError):
#             password_change(user=user, password="123")  # Mot de passe trop simple