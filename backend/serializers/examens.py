from django.http import QueryDict
from rest_framework import serializers

from django.core.exceptions import ValidationError
from django.db.models import TextChoices, IntegerChoices

from apps.examens.models import (
    Examens, TechnicalExamen, ClinicalExamen,
    VisualAcuity, Refraction, OcularTension, Pachymetry,
    Plaintes, BiomicroscopySegmentAnterieur, BiomicroscopySegmentPosterieur,
    Perimetry, Conclusion, BpSuP, EyeSide
)

from services.examens import (
    ExamenService,
    TechnicalExamenService,
    ClinicalExamenService,
    ConclusionService
)


class VisualAcuitySerializer(serializers.ModelSerializer):
    class Meta:
        model = VisualAcuity
        fields = '__all__'

    def validate(self, data):
        for field in ['avsc_od', 'avsc_og', 'avsc_odg', 'avac_od', 'avac_og', 'avac_odg']:
            value = data.get(field)
            if value is not None and not (0 <= value <= 10):
                raise ValidationError({field: "La valeur doit être comprise entre 0 et 10"})
        return data


class RefractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refraction
        fields = '__all__'

    def validate(self, data):
        if data.get('correction_optique'):
            champs = ['od_s', 'od_c', 'od_a', 'og_s', 'og_c', 'og_a']
            for champ in champs:
                value = data.get(champ)
                if value is None:
                    raise ValidationError({champ: "Ce champ doit être rempli si correction_optique est True"})
                if not (-10.0 <= float(value) <= 10.0):
                    raise ValidationError({champ: "La valeur doit être entre -10.0 et 10.0"})
        return data


class OcularTensionSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcularTension
        fields = '__all__'

    def validate(self, data):
        if data.get('ttt_hypotonisant') and not data.get('ttt_hypotonisant_value'):
            raise ValidationError({"ttt_hypotonisant_value": "Ce champ est requis quand ttt_hypotonisant est True"})
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
        errors = {}
        conditions = [
            ('diplopie', 'diplopie_type'),
            ('strabisme', 'strabisme_eye'),
            ('nystagmus', 'nystagmus_eye'),
            ('ptosis', 'ptosis_eye')
        ]
        for condition, required_field in conditions:
            if data.get(condition) and not data.get(required_field):
                errors[required_field] = f"{required_field} est requis quand {condition} est True"
        if errors:
            raise ValidationError(errors)
        return data


class BiomicroscopySegmentAnterieurSerializer(serializers.ModelSerializer):
    class Meta:
        model = BiomicroscopySegmentAnterieur
        fields = '__all__'

    def validate(self, data):
        segment = data.get('segment')
        transparence = data.get('transparence')
        errors = {}
        if segment == 'PRESENCE_LESION':
            required_fields = [
                'cornee', 'profondeur', 'transparence', 'pupille', 'axe_visuel',
                'rpm', 'iris', 'cristallin', 'position_cristallin'
            ]
            for field in required_fields:
                if not data.get(field):
                    errors[field] = f"{field} ne doit pas être nul."
            if transparence == 'ANORMALE':
                if not data.get('type_anomalie_value'):
                    errors['type_anomalie_value'] = "Ce champ ne doit pas être nul."
                if not data.get('quantite_anomalie'):
                    errors['quantite_anomalie'] = "Ce champ ne doit pas être nul."
        if errors:
            raise ValidationError(errors)
        return data


class BiomicroscopySegmentPosterieurSerializer(serializers.ModelSerializer):
    class Meta:
        model = BiomicroscopySegmentPosterieur
        fields = '__all__'

    def validate(self, data):
        errors = {}
        if errors:
            raise ValidationError(errors)
        return data


class PerimetrySerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)
    images = serializers.FileField(required=False, allow_null=True)
    class Meta:
        model = Perimetry
        fields = '__all__'

    def validate(self, data):
        errors = {}
        if 'limite_inferieure' in data and not (0 < data['limite_inferieure'] <= 90):
            errors['limite_inferieure'] = "Doit être entre 0 et 90"
        if 'limite_superieure' in data and not (0 < data['limite_superieure'] <= 90):
            errors['limite_superieure'] = "Doit être entre 0 et 90"
        if 'limite_horizontal' in data and not (0 < data['limite_horizontal'] <= 180):
            errors['limite_horizontal'] = "Doit être entre 0 et 180"
        if 'limite_temporale_gauche' in data and not (0 < data['limite_temporale_gauche'] <= 120):
            errors['limite_temporale_gauche'] = "Doit être entre 0 et 120"
        if 'limite_temporale_droit' in data and not (0 < data['limite_temporale_droit'] <= 120):
            errors['limite_temporale_droit'] = "Doit être entre 0 et 120"
        if 'score_esternmen' in data and not (0 < data['score_esternmen'] <= 100):
            errors['score_esternmen'] = "Doit être entre 0 et 100"
        if errors:
            raise ValidationError(errors)
        return data


class ConclusionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conclusion
        fields = '__all__'
        extra_kwargs = {
            'cat': {'required': False, 'allow_null': True},
            'traitement': {'required': False, 'allow_null': True},
            'observation': {'required': False, 'allow_null': True},
            'diagnostic_cim_10': {'required': False, 'allow_null': True},
        }


class BpSuPSerializer(serializers.ModelSerializer):
    retinographie = serializers.ImageField(required=False, allow_null=True)
    oct = serializers.ImageField(required=False, allow_null=True)
    autres = serializers.ImageField(required=False, allow_null=True)
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
        files = request.FILES if request and hasattr(request, 'FILES') else {}

        if isinstance(data, QueryDict):
            data = dict(data.lists())
        else:
            data = dict(data)

        nested_data = {}

        def assign_nested(dct, keys, value):
            for key in keys[:-1]:
                dct = dct.setdefault(key, {})
            dct[keys[-1]] = value

        for key, value in data.items():
            if isinstance(value, list) and len(value) == 1:
                value = value[0]
            assign_nested(nested_data, key.split('.'), value)

        perimetry_data = nested_data.get('perimetry', {})
        for field in ['image', 'images']:
            file_obj = files.get(f'perimetry.{field}') or files.get(field)
            if file_obj:
                perimetry_data[field] = file_obj
        nested_data['perimetry'] = perimetry_data

        bp_sup_data = nested_data.get('bp_sup', {})
        for field in ['retinographie', 'oct', 'autres']:
            file_obj = files.get(f'bp_sup.{field}') or files.get(field)
            if file_obj:
                bp_sup_data[field] = file_obj
        nested_data['bp_sup'] = bp_sup_data

        def normalize_booleans(d):
            for k, v in d.items():
                if isinstance(v, dict):
                    normalize_booleans(v)
                elif isinstance(v, str):
                    if v.lower() == "true":
                        d[k] = True
                    elif v.lower() == "false":
                        d[k] = False
        normalize_booleans(nested_data)

        return super().to_internal_value(nested_data)

    def create(self, validated_data):
        examen_id = self.context.get('examen_id') or validated_data.get('examen_id')
        if not examen_id:
            raise serializers.ValidationError("examen_id est requis dans le contexte")

        bp_sup_data = validated_data.pop('bp_sup', None)
        perimetry_data = validated_data.pop('perimetry', None)
        conclusion_data = validated_data.pop('conclusion', None)
        og_data = validated_data.pop('og', None)
        od_data = validated_data.pop('od', None)

        clinical_examen = ClinicalExamenService.init_clinical_examen(examen_id)

        if og_data:
            ClinicalExamenService.create_or_update_eye_side(clinical_examen.id, 'og', og_data)
        if od_data:
            ClinicalExamenService.create_or_update_eye_side(clinical_examen.id, 'od', od_data)
        if conclusion_data:
            ConclusionService.update_conclusion(clinical_examen.id, conclusion_data)
        if perimetry_data:
            ClinicalExamenService.update_perimetry(clinical_examen.id, perimetry_data)
        if bp_sup_data:
            ClinicalExamenService.update_bp_sup(clinical_examen.id, bp_sup_data)

        clinical_examen.refresh_from_db()
        return clinical_examen
    
    def update(self, instance, validated_data):        
        examen_id = Examens.objects.filter(clinical_examen=instance.id).values_list('id', flat=True).first()
        if not examen_id:
            raise serializers.ValidationError("examen_id est requis pour mettre à jour l'examen")
        clinical_examen = validated_data.copy()
        clinical_examen['examen_id'] = examen_id
        return self.create(clinical_examen)

class ExamensSerializer(serializers.ModelSerializer):
    technical_examen = TechnicalExamenSerializer(required=False)
    clinical_examen = ClinicalExamenSerializer(required=False)
    patient = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Examens
        fields = '__all__'
        read_only_fields = ('is_completed',)

    def create(self, validated_data):
        request = self.context.get('request')
        patient = validated_data.get('patient') or request.user.patient
        
        examen = ExamenService.get_or_create_examen(
            patient=patient,
            visite=validated_data.get('visite')
        )[0]

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