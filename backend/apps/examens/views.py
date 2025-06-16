from rest_framework import viewsets, permissions, parsers
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    Examens, TechnicalExamen, ClinicalExamen,BpSuP
)

from serializers.examens import (
    ExamensSerializer, TechnicalExamenSerializer, ClinicalExamenSerializer,
    VisualAcuitySerializer, BpSuPSerializer
)

from services.examens import (
    ExamenService, TechnicalExamenService,
    ClinicalExamenService
)

from drf_spectacular.utils import extend_schema, OpenApiParameter


class ExamensViewSet(viewsets.ModelViewSet):
    queryset = Examens.objects.all()
    serializer_class = ExamensSerializer
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        description="Liste tous les examens avec possibilité de filtrage par patient et visite",
        parameters=[
            OpenApiParameter(name='patient', description='Filtrer par ID patient', required=False, type=int),
            OpenApiParameter(name='visite', description='Filtrer par numéro de visite', required=False, type=int)
        ]
    )
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        patient_id = request.query_params.get('patient')
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
            
        visite = request.query_params.get('visite')
        if visite:
            queryset = queryset.filter(visite=visite)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @extend_schema(
        description="Crée un nouvel examen",
        request=ExamensSerializer,
        responses={201: ExamensSerializer}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        examen = self.get_object()
        ExamenService.complete_examen(examen.id)
        return Response({'status': 'examen completed'})

class TechnicalExamenViewSet(viewsets.ModelViewSet):
    queryset = TechnicalExamen.objects.all()
    serializer_class = TechnicalExamenSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['patch'])
    def update_visual_acuity(self, request, pk=None):
        technical_examen = self.get_object()
        serializer = VisualAcuitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        updated = TechnicalExamenService.update_visual_acuity(
            technical_examen.id,
            serializer.validated_data
        )
        return Response(VisualAcuitySerializer(updated).data)

class ClinicalExamenViewSet(viewsets.ModelViewSet):
    queryset = ClinicalExamen.objects.all()
    serializer_class = ClinicalExamenSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.JSONParser]

    @action(detail=True, methods=['post'])
    def add_plaintes(self, request, pk=None):
        clinical_examen = self.get_object()
        try:
            result = ClinicalExamenService.create_plaintes(
                clinical_examen.id,
                request.data
            )
            return Response(result, status=201)
        except ValidationError as e:
            return Response({'error': str(e)}, status=400)

class BpSuPViewSet(viewsets.ModelViewSet):
    queryset = BpSuP.objects.all()
    serializer_class = BpSuPSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser]