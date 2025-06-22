from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.db import transaction

from apps.patients.models import Conducteur, Vehicule
from services.health_records import HealthRecordService

@transaction.atomic
def validate_conducteur_data(data: dict):
    # Vérifie que les dates de permis sont cohérentes
    date_delivrance = data.get("date_delivrance_permis")
    date_peremption = data.get("date_peremption_permis")
    if date_delivrance and date_peremption:
        if date_peremption <= date_delivrance:
            raise ValidationError({
                'date_peremption_permis': _("License expiration date must be after the issue date.")
            })

    # Vérifie que "autre_type_permis" est renseigné si le type est "Autres à préciser"
    if data.get("type_permis") == "Autres à préciser" and not data.get("autre_type_permis", None):
        raise ValidationError({
            'autre_type_permis': _("You must specify the license type if 'Other' is selected.")
        })

@transaction.atomic
def conducteur_create(**data) -> Conducteur:
    validate_conducteur_data(data)
    patient = Conducteur.objects.create(**data)
    if patient:
        HealthRecordService.create_or_update_health_record(patient.id)
    return patient

@transaction.atomic
def conducteur_update(conducteur: Conducteur, **data) -> Conducteur:
    validate_conducteur_data(data)
    for attr, value in data.items():
        setattr(conducteur, attr, value)
    conducteur.save()
    return conducteur

@transaction.atomic
def validate_vehicule_data(data: dict):
    # Vérifie cohérence autre_type_vehicule_conduit
    if data.get("type_vehicule_conduit") == "Autres" and not data.get("autre_type_vehicule_conduit"):
        raise ValidationError({
            'autre_type_vehicule_conduit': _("You must specify the vehicle type if 'Other' is selected.")
        })

@transaction.atomic
def vehicule_create(**data) -> Vehicule:
    validate_vehicule_data(data)
    vehicule = Vehicule.objects.create(**data)
    return vehicule

@transaction.atomic
def vehicule_update(vehicule: Vehicule, **data) -> Vehicule:
    validate_vehicule_data(data)
    for attr, value in data.items():
        setattr(vehicule, attr, value)
    vehicule.save()
    return vehicule
