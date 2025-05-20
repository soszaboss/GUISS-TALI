from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.text import gettext_lazy as _
from django.conf import settings
from rest_framework import serializers
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
        Class personnalisé pour ajouter des claims supplémentaire tel que
        le role de l'utilisateur.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user_email'] = user.email
        token['user_role'] = user.role

        return token


class RefreshTokenSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    default_error_messages = {
        'bad_token': _('Token is invalid or expired')
    }

    def validate(self, attrs):
        self.token = attrs['refresh']
        return attrs

    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except TokenError:
            self.fail('bad_token')


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
