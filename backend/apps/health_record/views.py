from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from django_filters.rest_framework import DjangoFilterBackend

from apps.patients.models import Conducteur
from services.health_records import DriverExperienceService, HealthRecordService
from .models import HealthRecord, Antecedent, DriverExperience

from serializers.health_records import (
    HealthRecordSerializer, 
    AntecedentSerializer,
    DriverExperienceSerializer,
    PatientMedicalHistorySerializer,
)

from selector.health_record import (
    MedicalStatsSelector
)

from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample


class HealthRecordViewSet(viewsets.ModelViewSet):
    queryset = HealthRecord.objects.all()
    serializer_class = HealthRecordSerializer
    filterset_fields = ['risky_patient']
    filter_backends = [DjangoFilterBackend]

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
            HealthRecordService.create_or_update_health_record_with_exam_and_experience(
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
        
class AntecedentViewSet(viewsets.ModelViewSet):
    queryset = Antecedent.objects.all()
    serializer_class = AntecedentSerializer
    # permission_classes = [permissions.IsAuthenticated]


class DriverExperienceViewSet(viewsets.ModelViewSet):
    queryset = DriverExperience.objects.all()
    serializer_class = DriverExperienceSerializer
    # permission_classes = [permissions.IsAuthenticated]

class StatsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(responses={200: None})
    def get(self, request):
        stats = MedicalStatsSelector.get_global_medical_stats()
        return Response(stats)