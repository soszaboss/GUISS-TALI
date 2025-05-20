from rest_framework import serializers
from apps.users.models import User, Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'
        read_only_fields = ('id', 'created', 'modified')


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'phone_number', 'profile', 'role', 'created', 'modified', 'last_login']
        read_only_fields = ['id', 'role', 'created', 'modified', 'last_login', 'profile', 'email']
