from django.contrib import admin
from .models import (
    Examens, TechnicalExamen, ClinicalExamen,
    VisualAcuity, Refraction, OcularTension, Pachymetry,
    Plaintes, BiomicroscopySegmentAnterieur, BiomicroscopySegmentPosterieur,
    Perimetry, Conclusion, BpSuP, EyeSide
)

# class TechnicalExamenInline(admin.StackedInline):
#     model = TechnicalExamen
#     extra = 0
#     fields = ('visual_acuity', 'refraction', 'ocular_tension', 'pachymetry', 'is_completed')
#     show_change_link = True

# class ClinicalExamenInline(admin.StackedInline):
#     model = ClinicalExamen
#     extra = 0
#     fields = ('conclusion', 'perimetry', 'og', 'od', 'bp_sup', 'is_completed')
#     show_change_link = True

@admin.register(Examens)
class ExamensAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'visite', 'is_completed', 'created')
    list_filter = ('is_completed', 'visite')
    search_fields = ('patient__first_name', 'patient__last_name')
    # inlines = [TechnicalExamenInline, ClinicalExamenInline]
    readonly_fields = ('is_completed',)

@admin.register(TechnicalExamen)
class TechnicalExamenAdmin(admin.ModelAdmin):
    list_display = ('id', 'is_completed')
    list_filter = ('is_completed',)
    raw_id_fields = ('visual_acuity', 'refraction', 'ocular_tension', 'pachymetry')

@admin.register(ClinicalExamen)
class ClinicalExamenAdmin(admin.ModelAdmin):
    list_display = ('id', 'is_completed')
    list_filter = ('is_completed',)
    raw_id_fields = ('conclusion', 'perimetry', 'og', 'od', 'bp_sup')

# Enregistrement des autres modèles
admin.site.register(VisualAcuity)
admin.site.register(Refraction)
admin.site.register(OcularTension)
admin.site.register(Pachymetry)
admin.site.register(Plaintes)
admin.site.register(BiomicroscopySegmentAnterieur)
admin.site.register(BiomicroscopySegmentPosterieur)
admin.site.register(Perimetry)
admin.site.register(Conclusion)
admin.site.register(BpSuP)
admin.site.register(EyeSide)