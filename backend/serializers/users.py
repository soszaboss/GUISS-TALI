from rest_framework import serializers
from apps.users.models import User, Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'
        read_only_fields = ('id', 'created', 'modified')
        extra_kwargs = {
            'user': {'read_only': True, 'required': False},
        }


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'phone_number', 'profile', 'role', 'created', 'modified', 'last_login', 'is_active']
        read_only_fields = ['id', 'role', 'created', 'modified', 'last_login', 'email', 'is_active']

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        if profile_data:
            profile_serializer = ProfileSerializer(instance.profile, data=profile_data, partial=True)
            if profile_serializer.is_valid(raise_exception=True):
                profile_serializer.save()
        return super().update(instance, validated_data)
    
