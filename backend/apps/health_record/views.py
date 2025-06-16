from rest_framework import viewsets, permissions, status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
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

class HealthRecordViewSet(viewsets.ModelViewSet):
    queryset = HealthRecord.objects.all()
    serializer_class = HealthRecordSerializer
    filterset_fields = ['risky_patient']
    filter_backends = [DjangoFilterBackend]
    # permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['get'])
    def full_history(self, request, pk=None):
        record = self.get_object()
        serializer = PatientMedicalHistorySerializer(record)
        return Response(serializer.data)
    
    @action(methods=['get'], detail=True)
    def patient(self, request, patient_id=None):
        record = self.queryset.filter(patient=patient_id).first()
        if not record:
            return Response( '',status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(record)
        return Response(serializer.data)


class AntecedentViewSet(viewsets.ModelViewSet):
    queryset = Antecedent.objects.all()
    serializer_class = AntecedentSerializer
    # permission_classes = [permissions.IsAuthenticated]

class DriverExperienceViewSet(viewsets.ModelViewSet):
    queryset = DriverExperience.objects.all()
    serializer_class = DriverExperienceSerializer
    # permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        parameters=[
            OpenApiParameter(name='patient_id', description='Filtrer par patient', type=int, required=False),
            OpenApiParameter(name='min_accidents', description='Filtrer par nombre minimum d\'accidents', type=int, required=False)
        ]
    )
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        patient_id = request.query_params.get('patient_id')
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
            
        min_accidents = request.query_params.get('min_accidents')
        if min_accidents:
            queryset = queryset.filter(nombre_accidents__gte=min_accidents)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class StatsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(responses={200: None})
    def get(self, request):
        stats = MedicalStatsSelector.get_global_medical_stats()
        return Response(stats)