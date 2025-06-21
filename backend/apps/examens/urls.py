from django.urls import path
from .views import (
    ExamensViewSet, TechnicalExamenViewSet,
    ClinicalExamenViewSet, BpSuPViewSet
)

# Séparation explicite des vues comme demandé
examen_list = ExamensViewSet.as_view({'post': 'create'})
examen_detail = ExamensViewSet.as_view({'delete': 'destroy'})
# examen_complete = ExamensViewSet.as_view({'post': 'complete'})

technical_examen_create = TechnicalExamenViewSet.as_view({'post': 'create_for_tech_examen'})
tech_examen_detail = TechnicalExamenViewSet.as_view({'patch': 'partial_update'})

clinical_examen_detail = ClinicalExamenViewSet.as_view({'patch': 'partial_update'})

bp_sup_create = BpSuPViewSet.as_view({'post': 'create'})
bp_sup_detail = BpSuPViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'})

urlpatterns = [
    # Examens
    path('', examen_list, name='examen-list'),
    path('<int:pk>/', examen_detail, name='examen-detail'),
    # path('<int:pk>/complete/', examen_complete, name='examen-complete'),
    
    # Technical Examens
    path('technical-examens/create/<int:examen_id>/', technical_examen_create, name='tech-examen-create'),
    path('technical-examens/<int:pk>/', tech_examen_detail, name='technical-examen-detail'),
    
    # Clinical Examens
    path('clinical-examens/<int:pk>/', clinical_examen_detail, name='clinical-examen-detail'),
    
    # BP Supplementary
    path('bp-supplementary/', bp_sup_create, name='bp-sup-create'),
    path('bp-supplementary/<int:pk>/', bp_sup_detail, name='bp-sup-detail'),
    
]