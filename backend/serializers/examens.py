# serializers.py
from rest_framework import serializers

from django.core.exceptions import ValidationError
from django.db.models import TextChoices, IntegerChoices

from apps.examens.models import (
    Examens, TechnicalExamen, ClinicalExamen,
    VisualAcuity, Refraction, OcularTension, Pachymetry,
    Plaintes, BiomicroscopySegmentAnterieur, BiomicroscopySegmentPosterieur,
    Perimetry, Conclusion, BpSuP, EyeSide
)
from apps.health_record.models import HealthRecord

from services.examens import (
    ExamenService,
    TechnicalExamenService,
    ClinicalExamenService,
    ConclusionService
)

from selector.health_record import HealthRecordSelector

class VisualAcuitySerializer(serializers.ModelSerializer):
    class Meta:
        model = VisualAcuity
        fields = '__all__'

    def validate(self, data):
        for field in ['avsc_od', 'avsc_og', 'avsc_odg', 'avac_od', 'avac_og', 'avac_odg']:
            value = data.get(field)
            if value is not None and not (0 <= value <= 10):
                raise ValidationError(f"{field} doit être entre 0 et 10")
        return data


class RefractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refraction
        fields = '__all__'


class OcularTensionSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcularTension
        fields = '__all__'

    def validate(self, data):
        if data.get('ttt_hypotonisant') and not data.get('ttt_hypotonisant_value'):
            raise ValidationError("ttt_hypotonisant_value est requis quand ttt_hypotonisant est True")
        return data


class PachymetrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Pachymetry
        fields = '__all__'


class PlaintesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plaintes
        fields = '__all__'
        extra_kwargs = {
            'diplopie_type': {'required': False},
            'strabisme_eye': {'required': False},
            'nystagmus_eye': {'required': False},
            'ptosis_eye': {'required': False}
        }

    def validate(self, data):
        conditions = [
            ('diplopie', 'diplopie_type'),
            ('strabisme', 'strabisme_eye'),
            ('nystagmus', 'nystagmus_eye'),
            ('ptosis', 'ptosis_eye')
        ]
        
        for condition, required_field in conditions:
            if data.get(condition) and not data.get(required_field):
                raise ValidationError(f"{required_field} est requis quand {condition} est True")
        return data


class BiomicroscopySegmentAnterieurSerializer(serializers.ModelSerializer):
    class Meta:
        model = BiomicroscopySegmentAnterieur
        fields = '__all__'


class BiomicroscopySegmentPosterieurSerializer(serializers.ModelSerializer):
    class Meta:
        model = BiomicroscopySegmentPosterieur
        fields = '__all__'


class PerimetrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Perimetry
        fields = '__all__'


class ConclusionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conclusion
        fields = '__all__'


class BpSuPSerializer(serializers.ModelSerializer):
    class Meta:
        model = BpSuP
        fields = '__all__'
        extra_kwargs = {
            'retinographie': {'required': False},
            'oct': {'required': False},
            'autres': {'required': False}
        }

class EyeSideSerializer(serializers.ModelSerializer):
    plaintes = PlaintesSerializer()
    bp_sg_anterieur = BiomicroscopySegmentAnterieurSerializer()
    bp_sg_posterieur = BiomicroscopySegmentPosterieurSerializer()

    class Meta:
        model = EyeSide
        fields = '__all__'

    def create(self, validated_data):
        # Délégation au service pour une création complexe
        plaintes_data = validated_data.pop('plaintes')
        anterior_data = validated_data.pop('bp_sg_anterieur')
        posterior_data = validated_data.pop('bp_sg_posterieur')

        plaintes = Plaintes.objects.create(**plaintes_data)
        anterior = BiomicroscopySegmentAnterieur.objects.create(**anterior_data)
        posterior = BiomicroscopySegmentPosterieur.objects.create(**posterior_data)

        return EyeSide.objects.create(
            plaintes=plaintes,
            bp_sg_anterieur=anterior,
            bp_sg_posterieur=posterior,
            **validated_data
        )

class TechnicalExamenSerializer(serializers.ModelSerializer):
    visual_acuity = VisualAcuitySerializer(required=False)
    refraction = RefractionSerializer(required=False)
    ocular_tension = OcularTensionSerializer(required=False)
    pachymetry = PachymetrySerializer(required=False)

    class Meta:
        model = TechnicalExamen
        fields = '__all__'

    def create(self, validated_data):
        examen_id = self.context.get('examen_id')
        print("VALIDATED DATA =>", validated_data)
        print("examen_id =>", examen_id)
        technical_examen = TechnicalExamenService.init_technical_examen(examen_id)
        nested_fields = {
            'visual_acuity': TechnicalExamenService.update_visual_acuity,
            'refraction': TechnicalExamenService.update_refraction,
            'ocular_tension': TechnicalExamenService.update_ocular_tension,
            'pachymetry': TechnicalExamenService.update_pachymetry,
        }

        for field, service in nested_fields.items():
            if field in validated_data:
                service(technical_examen.id, validated_data.pop(field))

        technical_examen.refresh_from_db()
        return technical_examen

    def update(self, instance, validated_data):
        nested_fields = {
            'visual_acuity': TechnicalExamenService.update_visual_acuity,
            'refraction': TechnicalExamenService.update_refraction,
            'ocular_tension': TechnicalExamenService.update_ocular_tension,
            'pachymetry': TechnicalExamenService.update_pachymetry,
        }

        for field, service in nested_fields.items():
            if field in validated_data:
                service(instance.id, validated_data.pop(field))

        # Update des autres champs simples
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        instance.refresh_from_db()
        return instance

class ClinicalExamenSerializer(serializers.ModelSerializer):
    conclusion = ConclusionSerializer(required=False)
    perimetry = PerimetrySerializer(required=False)
    bp_sup = BpSuPSerializer(required=False)
    og = EyeSideSerializer(required=False)
    od = EyeSideSerializer(required=False)

    class Meta:
        model = ClinicalExamen
        fields = '__all__'

    def to_internal_value(self, data):
        request = self.context.get('request')
        files = request.FILES if request else {}

        data = data.copy() if hasattr(data, 'copy') else dict(data)

        nested_data = {}

        def assign_nested(dct, keys, value):
            for key in keys[:-1]:
                dct = dct.setdefault(key, {})
            dct[keys[-1]] = value

        for key, value in data.items():
            keys = key.split('.')
            if isinstance(value, list) and len(value) == 1:
                value = value[0]
            assign_nested(nested_data, keys, value)

        # ➤ Ajout fichiers perimetry
        peri_data = nested_data.get('perimetry', {})
        for field in ['image', 'images']:
            file_key = f'perimetry.{field}'
            if file_key in files:
                peri_data[field] = files[file_key]
            elif isinstance(peri_data.get(field), str):
                # Keep existing path
                continue
            else:
                peri_data.pop(field, None)
        nested_data['perimetry'] = peri_data

        # ➤ Ajout fichiers bp_sup
        bp_sup_data = nested_data.get('bp_sup', {})
        for field in ['retinographie', 'oct', 'autres']:
            if field in files:
                bp_sup_data[field] = files[field]
            elif isinstance(bp_sup_data.get(field), str):
                continue
            else:
                bp_sup_data.pop(field, None)
        nested_data['bp_sup'] = bp_sup_data

        # ➤ Normalisation des booléens
        def normalize_booleans(d):
            for key, value in d.items():
                if isinstance(value, dict):
                    normalize_booleans(value)
                elif isinstance(value, str):
                    if value.lower() == 'true':
                        d[key] = True
                    elif value.lower() == 'false':
                        d[key] = False

        normalize_booleans(nested_data)

        print("NESTED DATA =>", nested_data)
        return super().to_internal_value(nested_data)

    def create(self, validated_data):
        bp_sup_data = validated_data.pop('bp_sup', None)
        clinical_examen = ClinicalExamenService.init_clinical_examen(
            examen_id=validated_data.pop('examen_id')
        )

        for side in ['og', 'od']:
            eye_data = validated_data.pop(side, None)
            if eye_data:
                ClinicalExamenService.create_or_update_eye_side(clinical_examen.id, side, eye_data)

        if 'conclusion' in validated_data:
            ConclusionService.update_conclusion(clinical_examen.id, validated_data.pop('conclusion'))

        if 'perimetry' in validated_data:
            ClinicalExamenService.update_perimetry(clinical_examen.id, validated_data.pop('perimetry'))

        if bp_sup_data:
            ClinicalExamenService.update_bp_sup(clinical_examen.id, bp_sup_data)

        clinical_examen.save()
        return clinical_examen

    def update(self, instance, validated_data):
        if 'og' in validated_data:
            ClinicalExamenService.create_or_update_eye_side(instance.id, 'og', validated_data.pop('og'))

        if 'od' in validated_data:
            ClinicalExamenService.create_or_update_eye_side(instance.id, 'od', validated_data.pop('od'))

        if 'conclusion' in validated_data:
            ConclusionService.update_conclusion(instance.id, validated_data.pop('conclusion'))

        if 'perimetry' in validated_data:
            ClinicalExamenService.update_perimetry(instance.id, validated_data.pop('perimetry'), replace=True)

        if 'bp_sup' in validated_data:
            ClinicalExamenService.update_bp_sup(instance.id, validated_data.pop('bp_sup'), replace=True)

        instance.save()
        return instance

class ExamensSerializer(serializers.ModelSerializer):
    technical_examen = TechnicalExamenSerializer(required=False)
    clinical_examen = ClinicalExamenSerializer(required=False)
    patient = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Examens
        fields = '__all__'
        read_only_fields = ('is_completed',)

    def create(self, validated_data):
        # Utilisation du service principal
        request = self.context.get('request')
        patient = validated_data.get('patient') or request.user.patient
        
        examen = ExamenService.get_or_create_examen(
            patient=patient,
            visite=validated_data.get('visite')
        )[0]

        # Création des sous-examens si fournis
        technical_data = validated_data.pop('technical_examen', None)
        clinical_data = validated_data.pop('clinical_examen', None)

        if technical_data:
            examen.technical_examen = TechnicalExamenSerializer().create({
                **technical_data,
                'examen_id': examen.id
            })
        
        if clinical_data:
            examen.clinical_examen = ClinicalExamenSerializer().create({
                **clinical_data,
                'examen_id': examen.id
            })
        
        examen.save()
        return examen

# class HealthRecordSerializer(serializers.ModelSerializer):
#     examens = ExamensSerializer(many=True, read_only=True)
#     antecedant = serializers.PrimaryKeyRelatedField(read_only=True)
#     driver_experience = serializers.PrimaryKeyRelatedField(read_only=True)

#     class Meta:
#         model = HealthRecord
#         fields = '__all__'
#         read_only_fields = ('risky_patient',)

#     def to_representation(self, instance):
#         # Utilisation des selectors pour une représentation optimisée
#         representation = super().to_representation(instance)
#         full_record = HealthRecordSelector.get_full_health_record(instance.patient_id)
        
#         if full_record:
#             representation.update({
#                 'examens': ExamensSerializer(full_record.examens.all(), many=True).data,
#                 'antecedant': full_record.antecedant.id if full_record.antecedant else None,
#                 'driver_experience': full_record.driver_experience.id if full_record.driver_experience else None
#             })
        
#         return representation