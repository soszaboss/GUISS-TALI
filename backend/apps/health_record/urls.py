from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    HealthRecordViewSet,
    AntecedentViewSet,
    DriverExperienceViewSet
    )

# Séparation explicite des vues
health_record_list = HealthRecordViewSet.as_view({'get': 'list'})
# health_record_history = HealthRecordViewSet.as_view({'get': 'full_history'})
health_record_patient = HealthRecordViewSet.as_view({'get': 'patient'})
sync_health_record = HealthRecordViewSet.as_view({'get': 'sync_health_record'})
create_driver_experience = DriverExperienceViewSet.as_view({'post': 'create_or_update_for_patient'})
set_risky_patient_state = HealthRecordViewSet.as_view({'post': 'set_risky_patient'})
# antecedent_list = AntecedentViewSet.as_view({'post': 'create'})
antecedent_detail = AntecedentViewSet.as_view({'patch': 'partial_update'})
create_antecedent = AntecedentViewSet.as_view({'post': 'create_or_update_for_patient'})

# driver_exp_list = DriverExperienceViewSet.as_view({'post': 'create'})
driver_exp_detail = DriverExperienceViewSet.as_view({'patch': 'partial_update'})

urlpatterns = [
    # Health Records
    path('', health_record_list, name='health-record-list'),
    path('set-risky-patient/', set_risky_patient_state, name='set-risky-patient'),
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
    path('antecedents/create/', create_antecedent, name='create-antecedent'),

    # Driver Experiences
    # path('driver-experiences/', driver_exp_list, name='driver-exp-list'),
    path('driver-experiences/create/', create_driver_experience, name='create-driver-experience'),
    path('driver-experiences/<int:pk>/', driver_exp_detail, name='driver-exp-detail'),
    
    # Stats
    # path('stats/', StatsAPIView.as_view(), name='medical-stats'),
]
