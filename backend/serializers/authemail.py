from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers

from apps.users.models import User

from serializers.users import ProfileSerializer

from services.authemail import user_signup


class SignupSerializer(serializers.Serializer):
    """
    Don't require email to be unique so visitor can signup multiple times,
    if misplace verification email.  Handle in view.
    """
    email = serializers.EmailField(max_length=255)
    role = serializers.ChoiceField(choices=User.Role)
    phone_number = PhoneNumberField(region='SN')
    profile = ProfileSerializer(allow_null=True, required=False)

    def create(self, validated_data):
        email = validated_data['email']
        role = validated_data['role']
        phone_number = validated_data['phone_number']
        profile = validated_data.get('profile', None)
        user = user_signup(
            email=email,
            role=role,
            phone_number=phone_number,
            profile=profile
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(max_length=128)


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)


class PasswordResetVerifiedSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=40)
    password = serializers.CharField(max_length=128)


class PasswordChangeSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=128)


# class EmailChangeSerializer(serializers.Serializer):
#     email = serializers.EmailField(max_length=255)


# class EmailChangeVerifySerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
