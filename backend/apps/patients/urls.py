from django.urls import path
from apps.patients.views import VehiculeViewSet, ConducteurViewSet


list_vehicules = VehiculeViewSet.as_view({'get': 'list'})
vehicule_create = VehiculeViewSet.as_view({'post': 'create'})
vehicule_details = VehiculeViewSet.as_view({'get': 'retrieve'})
vehicule_delete = VehiculeViewSet.as_view({'delete': 'destroy'})
vehicule_update = VehiculeViewSet.as_view({'put': 'update', 'patch': 'partial_update'})

conducteur_list = ConducteurViewSet.as_view({'get': 'list'})
conducteur_create = ConducteurViewSet.as_view({'post': 'create'})
conducteur_details = ConducteurViewSet.as_view({'get': 'retrieve'})
conducteur_delete = ConducteurViewSet.as_view({'delete': 'destroy'})
conducteur_update = ConducteurViewSet.as_view({'put': 'update', 'patch': 'partial_update'})

urlpatterns = [
    path('vehicules/', list_vehicules, name='vehicules'),
    path('vehicules/create/', vehicule_create, name='vehicule-create'),
    path('vehicules/<int:pk>/', vehicule_details, name='vehicule-details'),
    path('vehicules/<int:pk>/delete/', vehicule_delete, name='vehicule-delete'),
    path('vehicules/<int:pk>/update/', vehicule_update, name='vehicule-update'),

    path('', conducteur_list, name='conducteurs'),
    path('create/', conducteur_create, name='conducteur-create'),
    path('<int:pk>/', conducteur_details, name='conducteur-details'),
    path('<int:pk>/delete/', conducteur_delete, name='conducteur-delete'),
    path('<int:pk>/update/', conducteur_update, name='conducteur-update'),
]