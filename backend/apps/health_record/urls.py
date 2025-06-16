from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    HealthRecordViewSet,
    AntecedentViewSet,
    DriverExperienceViewSet,
    StatsAPIView
)

# Séparation explicite des vues
health_record_list = HealthRecordViewSet.as_view({'get': 'list', 'post': 'create'})
health_record_detail = HealthRecordViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update'})
health_record_history = HealthRecordViewSet.as_view({'get': 'full_history'})
health_record_patient = HealthRecordViewSet.as_view({'get': 'patient'})

antecedent_list = AntecedentViewSet.as_view({'get': 'list', 'post': 'create'})
antecedent_detail = AntecedentViewSet.as_view({'get': 'retrieve', 'put': 'update'})

driver_exp_list = DriverExperienceViewSet.as_view({'get': 'list', 'post': 'create'})
driver_exp_detail = DriverExperienceViewSet.as_view({'get': 'retrieve', 'put': 'update'})

urlpatterns = [
    # Health Records
    path('', health_record_list, name='health-record-list'),
    path('<int:pk>/', health_record_detail, name='health-record-detail'),
    path('<int:pk>/history/', health_record_history, name='health-record-history'),
    path('patient/<int:patient_id>/', health_record_patient, name='health-record-patient'),
    
    # Antecedents
    path('antecedents/', antecedent_list, name='antecedent-list'),
    path('antecedents/<int:pk>/', antecedent_detail, name='antecedent-detail'),
    
    # Driver Experiences
    path('driver-experiences/', driver_exp_list, name='driver-exp-list'),
    path('driver-experiences/<int:pk>/', driver_exp_detail, name='driver-exp-detail'),
    
    # Stats
    path('stats/', StatsAPIView.as_view(), name='medical-stats'),
]
