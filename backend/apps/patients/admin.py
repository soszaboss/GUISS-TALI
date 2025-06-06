from django.contrib import admin
from .models import Conducteur, Vehicule


class VehiculeInline(admin.TabularInline):  # ou StackedInline
    model = Vehicule
    extra = 1
    fields = ('modele', 'annee', 'immatriculation', 'type_vehicule_conduit', 'autre_type_vehicule_conduit')
    show_change_link = True

@admin.register(Conducteur)
class ConducteurAdmin(admin.ModelAdmin):
    list_display = (
        'first_name', 'last_name', 'email', 'phone_number',
        'type_permis', 'numero_permis', 'date_naissance'
    )
    search_fields = ('first_name', 'last_name', 'email', 'numero_permis', 'phone_number')
    list_filter = ('type_permis', 'service', 'sexe', 'niveau_instruction')
    inlines = [VehiculeInline]
    readonly_fields = ('created', 'modified')
    list_per_page = 15



@admin.register(Vehicule)
class VehiculeAdmin(admin.ModelAdmin):
    list_display = (
        'modele', 'immatriculation', 'annee', 'type_vehicule_conduit',
        'conducteur_full_name', 'conducteur'
    )
    search_fields = ('modele', 'immatriculation', 'conducteur__first_name', 'conducteur__last_name')
    list_filter = ('type_vehicule_conduit',)
    autocomplete_fields = ('conducteur',)
    readonly_fields = ('created', 'modified')
    list_per_page = 15

    def conducteur_full_name(self, obj):
        return f"{obj.conducteur.first_name} {obj.conducteur.last_name}"
