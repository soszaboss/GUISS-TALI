
from rest_framework import serializers

from apps.health_record.models import Antecedent, DriverExperience, HealthRecord

from django.core.exceptions import ValidationError

from serializers.patients import ConducteurSerializer

from serializers.examens import ExamensSerializer

from services.health_records import HealthRecordService


class DriverExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverExperience
        fields = '__all__'
        extra_kwargs = {
            'patient': {'read_only': True},
            'km_parcourus': {'min_value': 0},
            'nombre_accidents': {'min_value': 0}
        }


class AntecedentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Antecedent
        fields = '__all__'
        extra_kwargs = {
            'patient': {'read_only': True},
            'autre_addiction_detail': {'required': False},
            'tabagisme_detail': {'required': False}
        }

    def validate(self, data):
        if data.get('addiction') and not data.get('type_addiction'):
            raise ValidationError({'type_addiction': 'Requis quand addiction est vrai'})
        if data.get('type_addiction') == 'other' and not data.get('autre_addiction_detail'):
            raise ValidationError({'autre_addiction_detail': 'Détails requis pour autre addiction'})
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

    # def create(self, validated_data):
        # request = self.context.get('request')
        # patient = request.user.patient if hasattr(request.user, 'patient') else None

        # antecedent_data = validated_data.pop('antecedant', None)
        # driver_data = validated_data.pop('driver_experience', None)
        # examen_ids = self.initial_data.get('examen_ids', [])

        # health_record = HealthRecordService.create_or_update_health_record(
        #     patient_id=patient.id,
        #     antecedent_data=antecedent_data,
        #     driver_exp_data=driver_data,
        #     examen_ids=examen_ids
        # )
        # return health_record

