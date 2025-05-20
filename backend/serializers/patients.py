from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers
from apps.patients.models import Conducteur, Vehicule
from services.patients import conducteur_create, conducteur_update, vehicule_create, vehicule_update


class ConducteurSerializer(serializers.ModelSerializer):
    phone_number = PhoneNumberField(default='SN')
    class Meta:
        model = Conducteur
        fields = '__all__'

    def create(self, validated_data):
        return conducteur_create(**validated_data)

    def update(self, instance, validated_data):
        return conducteur_update(instance, **validated_data)




class VehiculeSerializer(serializers.ModelSerializer):
    conducteur_full_name = serializers.SerializerMethodField()

    class Meta:
        model = Vehicule
        fields = '__all__'

    def get_conducteur_full_name(self, obj):
        return f"{obj.conducteur.first_name} {obj.conducteur.last_name}"

    def create(self, validated_data):
        return vehicule_create(**validated_data)

    def update(self, instance, validated_data):
        return vehicule_update(instance, **validated_data)