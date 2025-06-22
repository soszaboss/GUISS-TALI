from rest_framework import viewsets, permissions, parsers, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    Examens, TechnicalExamen, ClinicalExamen,BpSuP
)

from serializers.examens import (
    ExamensSerializer, TechnicalExamenSerializer, ClinicalExamenSerializer,
    BpSuPSerializer
)

from services.examens import ExamenService

class ExamensViewSet(viewsets.ModelViewSet):
    queryset = Examens.objects.all()
    serializer_class = ExamensSerializer
    permission_classes = [permissions.IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        examen_id = self.get_object().id
        try:
            ExamenService.delete_examen_complet(examen_id)
            return Response('', status=status.HTTP_204_NO_CONTENT)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": f"Erreur lors de la suppression : {str(e)}"}, status=500)


    # @action(detail=True, methods=['post'])
    # def complete(self, request, pk=None):
    #     examen = self.get_object()
    #     ExamenService.complete_examen(examen.id)
    #     return Response({'status': 'examen completed'})

class TechnicalExamenViewSet(viewsets.ModelViewSet):
    queryset = TechnicalExamen.objects.all()
    serializer_class = TechnicalExamenSerializer

    @action(detail=False, methods=['post'], url_path='create-for-examen')
    def create_for_tech_examen(self, request, examen_id=None):
        examen_id = request.data.pop('examen_id', None)
        if not examen_id:
            return Response({'detail': 'examen_id est requis'}, status=400)

        serializer = self.get_serializer(data=request.data, context={'examen_id': examen_id})
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        # Création réelle de l'objet
        instance = serializer.save()

        # Re-serialization pour l'affichage
        response_serializer = self.get_serializer(instance)
        return Response(response_serializer.data, status=201)


    # permission_classes = [permissions.IsAuthenticated]

class ClinicalExamenViewSet(viewsets.ModelViewSet):
    queryset = ClinicalExamen.objects.all()
    serializer_class = ClinicalExamenSerializer
    # permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], url_path='create-for-examen')
    def create_for_examen(self, request, examen_id, *args, **kwargs):
        request.data.pop('examen_id', None)
        if not examen_id:
            return Response({'detail': 'examen_id est requis'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=request.data, context={'examen_id': examen_id})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)




class BpSuPViewSet(viewsets.ModelViewSet):
    queryset = BpSuP.objects.all()
    serializer_class = BpSuPSerializer
    # permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]