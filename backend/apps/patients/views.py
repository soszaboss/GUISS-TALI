from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Vehicule, Conducteur
from serializers.patients import VehiculeSerializer, ConducteurSerializer


class VehiculeViewSet(viewsets.ModelViewSet):
    queryset = Vehicule.objects.select_related('conducteur').all().order_by('-created')
    serializer_class = VehiculeSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['conducteur']
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = [
        'immatriculation',
        'modele',
        'type_vehicule_conduit',
        'conducteur__first_name',
        'conducteur__last_name'
    ]

class ConducteurViewSet(viewsets.ModelViewSet):
    queryset = Conducteur.objects.all().order_by('-created')
    serializer_class = ConducteurSerializer
    permission_classes = [IsAuthenticated]

    # Ajout des filtres
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = ['numero_permis', 'type_permis']
    search_fields = [
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'numero_permis'
    ]
