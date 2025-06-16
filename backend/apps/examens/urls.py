from django.urls import path
from .views import (
    ExamensViewSet, TechnicalExamenViewSet,
    ClinicalExamenViewSet, BpSuPViewSet
)
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

# Séparation explicite des vues comme demandé
examen_list = ExamensViewSet.as_view({'get': 'list', 'post': 'create'})
examen_detail = ExamensViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'})
examen_complete = ExamensViewSet.as_view({'post': 'complete'})

tech_examen_detail = TechnicalExamenViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update'})
update_visual_acuity = TechnicalExamenViewSet.as_view({'patch': 'update_visual_acuity'})

clinical_examen_detail = ClinicalExamenViewSet.as_view({'get': 'retrieve', 'put': 'update'})
add_plaintes = ClinicalExamenViewSet.as_view({'post': 'add_plaintes'})

bp_sup_create = BpSuPViewSet.as_view({'post': 'create'})
bp_sup_detail = BpSuPViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'})

urlpatterns = [
    # Examens
    path('', examen_list, name='examen-list'),
    path('<int:pk>/', examen_detail, name='examen-detail'),
    path('<int:pk>/complete/', examen_complete, name='examen-complete'),
    
    # Technical Examens
    path('technical-examens/<int:pk>/', tech_examen_detail, name='technical-examen-detail'),
    path('technical-examens/<int:pk>/visual-acuity/', update_visual_acuity, name='update-visual-acuity'),
    
    # Clinical Examens
    path('clinical-examens/<int:pk>/', clinical_examen_detail, name='clinical-examen-detail'),
    path('clinical-examens/<int:pk>/plaintes/', add_plaintes, name='add-plaintes'),
    
    # BP Supplementary
    path('bp-supplementary/', bp_sup_create, name='bp-sup-create'),
    path('bp-supplementary/<int:pk>/', bp_sup_detail, name='bp-sup-detail'),
    
]