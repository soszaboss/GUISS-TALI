from django.contrib import admin
from .models import HealthRecord, Antecedent, DriverExperience

# class AntecedentInline(admin.StackedInline):
#     model = Antecedent
#     extra = 0
#     fields = ('addiction', 'type_addiction', 'familial', 'pathologie_ophtalmologique')
#     readonly_fields = ('created', 'modified')

# class DriverExperienceInline(admin.TabularInline):
#     model = DriverExperience
#     extra = 0
#     fields = ('visite', 'km_parcourus', 'nombre_accidents', 'date_visite')
#     readonly_fields = ('created', 'modified')

class ExamensInline(admin.TabularInline):
    model = HealthRecord.examens.through
    extra = 0
    verbose_name = "Examen associé"
    verbose_name_plural = "Examens associés"

@admin.register(HealthRecord)
class HealthRecordAdmin(admin.ModelAdmin):
    list_display = ('patient', 'risky_patient', 'created')
    list_filter = ('risky_patient',)
    search_fields = ('patient__first_name', 'patient__last_name')
    inlines = [ExamensInline]
    exclude = ('examens',)  # Géré via through model

@admin.register(Antecedent)
class AntecedentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'addiction', 'familial')
    list_filter = ('addiction', 'familial')
    search_fields = ('patient__first_name', 'patient__last_name')
    readonly_fields = ('created', 'modified')

@admin.register(DriverExperience)
class DriverExperienceAdmin(admin.ModelAdmin):
    list_display = ('patient', 'visite', 'nombre_accidents', 'date_visite')
    list_filter = ('visite',)
    search_fields = ('patient__first_name', 'patient__last_name')
    readonly_fields = ('created', 'modified')