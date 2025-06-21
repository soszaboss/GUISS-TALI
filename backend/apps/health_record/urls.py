from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    HealthRecordViewSet,
    AntecedentViewSet,
    DriverExperienceViewSet,
    StatsAPIView
)

# Séparation explicite des vues
health_record_list = HealthRecordViewSet.as_view({'get': 'list'})
# health_record_history = HealthRecordViewSet.as_view({'get': 'full_history'})
health_record_patient = HealthRecordViewSet.as_view({'get': 'patient'})
sync_health_record = HealthRecordViewSet.as_view({'get': 'sync_health_record'})

# antecedent_list = AntecedentViewSet.as_view({'post': 'create'})
antecedent_detail = AntecedentViewSet.as_view({'patch': 'partial_update'})

# driver_exp_list = DriverExperienceViewSet.as_view({'post': 'create'})
driver_exp_detail = DriverExperienceViewSet.as_view({'patch': 'partial_update'})

urlpatterns = [
    # Health Records
    path('', health_record_list, name='health-record-list'),
    # path('<int:pk>/history/', health_record_history, name='health-record-history'),
    path('patient/<int:patient_id>/', health_record_patient, name='health-record-patient'),
    path(
            'visite/<int:visite>/patient/<int:patient_id>/',
            sync_health_record,
            name='sync-health-record'
        ),
            
    # Antecedents
    # path('antecedents/', antecedent_list, name='antecedent-list'),
    path('antecedents/<int:pk>/', antecedent_detail, name='antecedent-detail'),
    
    # Driver Experiences
    # path('driver-experiences/', driver_exp_list, name='driver-exp-list'),
    path('driver-experiences/<int:pk>/', driver_exp_detail, name='driver-exp-detail'),
    
    # Stats
    # path('stats/', StatsAPIView.as_view(), name='medical-stats'),
]
