from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers
from apps.patients.models import Conducteur, Vehicule
from services.patients import conducteur_create, conducteur_update, vehicule_create, vehicule_update

class VehiculeSerializer(serializers.ModelSerializer):
    conducteur_full_name = serializers.SerializerMethodField()

    class Meta:
        model = Vehicule
        fields = '__all__'
        read_only_fields = ('id', 'created', 'modified')
        extra_kwargs = {
            'conducteur': {'required': False, 'allow_null': True}
        }

    def get_conducteur_full_name(self, obj):
        return f"{obj.conducteur.first_name} {obj.conducteur.last_name}"

    def create(self, validated_data):
        return vehicule_create(**validated_data)

    def update(self, instance, validated_data):
        return vehicule_update(instance, **validated_data)
    

class ConducteurSerializer(serializers.ModelSerializer):
    phone_number = PhoneNumberField(default='SN')
    vehicule = VehiculeSerializer(many=True, required=False, source='vehicule_set', read_only=True)
    vehicules_data = VehiculeSerializer(many=True, write_only=True, required=False)

    class Meta:
        model = Conducteur
        fields = '__all__'
        read_only_fields = ('id', 'created', 'modified')
        extra_fields = ['vehicule', 'vehicules_data']

    def create(self, validated_data):
        vehicules_data = validated_data.pop('vehicules_data', [])
        conducteur = conducteur_create(**validated_data)
        if not vehicules_data:
            return conducteur
        for vehicule_data in vehicules_data:
            vehicule_data['conducteur'] = conducteur
            vehicule_create(**vehicule_data)
        return conducteur

    def update(self, instance, validated_data):
        vehicules_data = validated_data.pop('vehicules_data', [])
        conducteur = conducteur_update(instance, **validated_data)
        if not vehicules_data:
            return conducteur
        for vehicule_data in vehicules_data:
            immatriculation = vehicule_data.get('immatriculation')
            vehicule_data['conducteur'] = conducteur
            if immatriculation:
                Vehicule.objects.update_or_create(
                    conducteur=conducteur,
                    immatriculation=immatriculation,
                    defaults=vehicule_data
                )
            else:
                vehicule_create(**vehicule_data)
        return conducteur
