from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from django_filters.rest_framework import DjangoFilterBackend

from apps.patients.models import Conducteur
from services.health_records import AntecedentService, DriverExperienceService, HealthRecordService
from .models import HealthRecord, Antecedent, DriverExperience

from serializers.health_records import (
    HealthRecordSerializer, 
    AntecedentSerializer,
    DriverExperienceSerializer,
)


from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample


class HealthRecordViewSet(viewsets.ModelViewSet):
    queryset = HealthRecord.objects.all()
    serializer_class = HealthRecordSerializer
    filterset_fields = ['risky_patient']
    filter_backends = [DjangoFilterBackend]
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['get'])
    def full_history(self, request, pk=None):
        record = self.get_object()
        serializer = PatientMedicalHistorySerializer(record)
        return Response(serializer.data)

    @action(methods=['get'], detail=True)
    def patient(self, request, patient_id=None):
        record = self.queryset.filter(patient=patient_id).first()
        if not record:
            return Response('', status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(record)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def sync_health_record(self, request, patient_id, visite):
        try:
            health_record = HealthRecordService.create_or_update_health_record_with_exam_and_experience(
                patient_id=patient_id,
                visite=visite
            )
            DriverExperienceService.delete_driver_experience(patient_id, visite)
            record = self.queryset.filter(patient=patient_id).first()
            if not record:
                return Response({"detail": "Dossier introuvable"}, status=404)

            serializer = self.serializer_class(record)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Conducteur.DoesNotExist:
            return Response({"detail": "Patient introuvable."}, status=404)

        except Exception as e:
            return Response(
                {"detail": f"Une erreur est survenue : {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    @action(detail=False, methods=['post'], url_path='set-risky')
    def set_risky_patient(self, request):
        patient_id = request.data.get('patient_id')
        risky = request.data.get('risky_patient')
        if not patient_id:
            return Response({'detail': 'patient_id est requis'}, status=status.HTTP_400_BAD_REQUEST)
        if risky is None:
            return Response({'detail': 'risky_patient est requis (true ou false)'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            record = HealthRecord.objects.get(patient_id=patient_id)
            record.risky_patient = bool(risky) if isinstance(risky, bool) else str(risky).lower() == "true"
            record.save()
            return Response({'status': f"Patient {'marqué' if record.risky_patient else 'démarqué'} comme à risque"}, status=status.HTTP_200_OK)
        except HealthRecord.DoesNotExist:
            return Response({'detail': 'Dossier médical introuvable'}, status=status.HTTP_404_NOT_FOUND)
        
        
class AntecedentViewSet(viewsets.ModelViewSet):
    queryset = Antecedent.objects.all()
    serializer_class = AntecedentSerializer
    permission_classes = [permissions.IsAuthenticated]
    @action(detail=False, methods=['post'], url_path='create-for-patient')
    def create_or_update_for_patient(self, request):
        patient_id = request.data.get('patient')
        if not patient_id:
            return Response({"detail": "patient est requis"}, status=400)
        try:
            antecedent = AntecedentService.create_or_update_antecedent(
                patient_id=patient_id,
                data=request.data
            )
            health_record = HealthRecordService.create_or_update_health_record(
                patient_id=patient_id,
                antecedent_id=antecedent.id,
                driver_exp_ids=None
            )
            health_record.save()
            serializer = self.get_serializer(antecedent)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"detail": str(e)}, status=500)

class DriverExperienceViewSet(viewsets.ModelViewSet):
    queryset = DriverExperience.objects.all()
    serializer_class = DriverExperienceSerializer
    permission_classes = [permissions.IsAuthenticated]
    @action(detail=False, methods=['post'], url_path='create-for-patient')
    def create_or_update_for_patient(self, request):
        patient_id = request.data.get('patient')
        visite = request.data.get('visite')
        if not patient_id or not visite:
            return Response({"detail": "patient et visite sont requis"}, status=400)
        
        try:
            driver_exp = DriverExperienceService.create_or_update_driver_experience(
                patient_id=patient_id,
                visite=visite,
                data=request.data
            )
            health_record = HealthRecordService.create_or_update_health_record(
                patient_id=patient_id,
                driver_exp_ids=[driver_exp.id]
            )
            health_record.save()
            serializer = self.get_serializer(driver_exp)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"detail": str(e)}, status=500)
