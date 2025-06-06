from django.urls import path
from apps.patients.views import VehiculeViewSet, ConducteurViewSet


list_vehicules = VehiculeViewSet.as_view({'get': 'list'})
vehicule_details = VehiculeViewSet.as_view({'get': 'retrieve'})
vehicule_delete = VehiculeViewSet.as_view({'delete': 'destroy'})
vehicule_update = VehiculeViewSet.as_view({'put': 'update', 'patch': 'partial_update'})

conducteur_list = ConducteurViewSet.as_view({'get': 'list'})
conducteur_details = ConducteurViewSet.as_view({'get': 'retrieve'})
conducteur_delete = ConducteurViewSet.as_view({'delete': 'destroy'})
conducteur_update = ConducteurViewSet.as_view({'put': 'update', 'patch': 'partial_update'})

urlpatterns = [
    path('vehicules/', list_vehicules, name='vehicules'),
    path('vehicules/<int:pk>/', vehicule_details, name='vehicule_details'),
    path('vehicules/<int:pk>/delete/', vehicule_delete, name='vehicule_delete'),
    path('vehicules/<int:pk>/update/', vehicule_update, name='vehicule_update'),

    path('conducteurs/', conducteur_list, name='conducteurs'),
    path('conducteurs/<int:pk>/', conducteur_details, name='conducteur_details'),
    path('conducteurs/<int:pk>/delete/', conducteur_delete, name='conducteur_delete'),
    path('conducteurs/<int:pk>/update/', conducteur_update, name='conducteur_update'),
]