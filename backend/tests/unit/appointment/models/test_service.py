import pytest
from datetime import timedelta
from django.core.exceptions import ValidationError
from django.db import DataError, transaction

from apps.appointment.models import Service
from tests.unit.appointment.factories import StaffMemberFactory, ServiceFactory


@pytest.mark.django_db
class TestServiceModel:
    """Tests complets pour le modèle Service, adaptés de django-appointment"""

    # --------------------------------------------------
    # Tests de création et attributs de base
    # --------------------------------------------------
    def test_service_creation(self, service_factory):
        service = service_factory(name="Radiologie")
        assert service.pk is not None
        assert isinstance(service.duration, timedelta)

    def test_timestamps(self, service_factory):
        service = service_factory()
        assert service.created is not None
        assert service.modified is not None

    def test_str_representation(self, service_factory):
        service = service_factory(name="Echographie")
        assert str(service) == "Echographie"

    # --------------------------------------------------
    # Tests de durée
    # --------------------------------------------------
    @pytest.mark.parametrize("duration,expected", [
        (timedelta(minutes=30), "30 minutes"),
        (timedelta(hours=2), "2 hours"),
        (timedelta(days=1, hours=2), "1 day 2 hours"),
        (timedelta(seconds=45), "45 seconds")
    ])
    def test_duration_representation(self, service_factory, duration, expected):
        service = service_factory(duration=duration)
        assert service.get_duration() == expected

    # --------------------------------------------------
    # Tests de validation
    # --------------------------------------------------
    def test_name_validation(self, service_factory):
        # Test nom trop long
        with pytest.raises(DataError):
            with transaction.atomic():
                service = service_factory(name="X" * 101)
                service.full_clean()
                service.save()

        # Test nom vide
        with pytest.raises(ValidationError):
            Service.objects.create(name="", duration=timedelta(minutes=30)).full_clean()

    def test_duration_validation(self):
        from apps.appointment.models import Service

        # Test durée nulle
        with pytest.raises(ValidationError):
            Service(name="Test", duration=timedelta(0)).full_clean()

        # Test durée négative
        with pytest.raises(ValidationError):
            Service(name="Test", duration=timedelta(seconds=-1)).full_clean()

    # --------------------------------------------------
    # Tests des fonctionnalités de replanification
    # --------------------------------------------------
    def test_rescheduling_features(self, service_factory):
        service = service_factory(
            allow_rescheduling=True,
            reschedule_limit=3
        )
        assert service.allow_rescheduling is True
        assert service.reschedule_limit == 3

    # --------------------------------------------------
    # Tests des relations
    # --------------------------------------------------
    def test_staff_relationship(self, service_factory):
        service = service_factory()
        staff = StaffMemberFactory(services_offered=[service])
        staff.save()

        assert staff.services_offered.count() == 1
        assert service in staff.services_offered.all()

    # --------------------------------------------------
    # Tests des méthodes spéciales
    # --------------------------------------------------
    def test_to_dict_method(self, service_factory):
        service = service_factory(
            name="Scanner",
            description="Examen scanographique"
        )
        result = service.to_dict()

        assert result == {
            "id": service.id,
            "name": "Scanner",
            "description": "Examen scanographique"
        }

    def test_background_color(self, service_factory):
        # Test génération automatique
        service = ServiceFactory(background_color='rgb(')
        service.save()
        assert service.background_color.startswith('rgb(')

        # Test couleur personnalisée
        service = ServiceFactory(background_color='rgb(255, 0, 0)')
        service.save()
        assert service.background_color == 'rgb(255, 0, 0)'
