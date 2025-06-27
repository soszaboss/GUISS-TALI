from rest_framework import serializers

from apps.health_record.models import Antecedent, DriverExperience, HealthRecord
from django.core.exceptions import ValidationError
from serializers.patients import ConducteurSerializer
from serializers.examens import ExamensSerializer

class DriverExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverExperience
        fields = '__all__'
        extra_kwargs = {
            'patient': {'read_only': True},
            'km_parcourus': {'min_value': 0},
            'nombre_accidents': {'min_value': 0}
        }

    def validate(self, data):
        if data.get('corporel_dommage') and not data.get('corporel_dommage_type'):
            raise serializers.ValidationError({'corporel_dommage_type': 'Requis si dommage corporel.'})
        if data.get('materiel_dommage') and not data.get('materiel_dommage_type'):
            raise serializers.ValidationError({'materiel_dommage_type': 'Requis si dommage matériel.'})
        return data

class AntecedentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Antecedent
        fields = '__all__'
        extra_kwargs = {
            'patient': {'read_only': True},
            'autre_addiction_detail': {'required': False},
            'tabagisme_detail': {'required': False},
            'autre_familial_detail': {'required': False},
        }

    def validate(self, data):
        # On s'assure que type_addiction et familial sont des listes
        type_addiction = data.get('type_addiction') or []
        familial = data.get('familial') or []

        if isinstance(type_addiction, str):
            type_addiction = [type_addiction]
        if isinstance(familial, str):
            familial = [familial]

        if data.get('addiction') and not type_addiction:
            raise serializers.ValidationError({'type_addiction': 'Requis quand addiction est vraie.'})

        if 'TABAGISME' in type_addiction and not data.get('tabagisme_detail'):
            raise serializers.ValidationError({'tabagisme_detail': 'Détails requis pour le tabagisme.'})

        if 'OTHER' in type_addiction and not data.get('autre_addiction_detail'):
            raise serializers.ValidationError({'autre_addiction_detail': 'Détails requis pour autre addiction.'})

        if 'OTHER' in familial and not data.get('autre_familial_detail'):
            raise serializers.ValidationError({'autre_familial_detail': 'Détails requis pour autre antécédent familial.'})

        return data

class HealthRecordSerializer(serializers.ModelSerializer):
    antecedant = AntecedentSerializer(required=False)
    driver_experience = DriverExperienceSerializer(many=True, read_only=True)
    examens = ExamensSerializer(many=True, read_only=True)
    patient = ConducteurSerializer(read_only=True)

    class Meta:
        model = HealthRecord
        fields = '__all__'
        read_only_fields = ('patient',)

    # Tu peux personnaliser create/update si tu veux gérer la création imbriquée
    # def create(self, validated_data):
    #     ...