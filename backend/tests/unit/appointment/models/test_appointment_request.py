import pytest
from datetime import date, time, timedelta
from django.core.exceptions import ValidationError

from tests.unit.appointment.factories import AppointmentRequestFactory


@pytest.mark.django_db
class TestAppointmentRequest:
    def test_creation(self, appointment_request_factory):
        req = appointment_request_factory()
        assert req.pk is not None
        assert req.date == date.today()

    def test_time_validation(self, appointment_request_factory):
        # Fin avant début
        with pytest.raises(ValidationError):
            appointment_request_factory(
                start_time=time(10, 0),
                end_time=time(11, 0)
            ).full_clean()

        # Même heure
        with pytest.raises(ValidationError):
            appointment_request_factory(
                start_time=time(10, 0),
                end_time=time(10, 0)
            ).full_clean()

    def test_date_validation(self, appointment_request_factory):
        # Date passée
        past_date = date.today() - timedelta(days=1)
        with pytest.raises(ValidationError):
            appointment_request_factory(date=past_date).full_clean()

    def test_service_relationship(self, appointment_request_factory, service_factory):
        service = service_factory(name="Radiologie")
        req = appointment_request_factory(service=service)
        assert req.get_service_name() == "Radiologie"
        assert req.service.duration == timedelta(minutes=30)

    def test_reschedule_logic(self, appointment_request_factory):
        req = appointment_request_factory()
        assert req.reschedule_attempts == 0
        assert req.can_be_rescheduled()

        req.increment_reschedule_attempts()
        assert req.reschedule_attempts == 1

    def test_date_in_past_is_invalid(self):
        """🚫 Impossible de créer une requête pour une date passée."""
        appt = AppointmentRequestFactory.build(date=date.today() - timedelta(days=1))
        with pytest.raises(ValidationError):
            appt.full_clean()

    def test_reschedule_attempts_increment(self):
        """🔁 Vérifie que les tentatives de report sont incrémentées correctement."""
        appt = AppointmentRequestFactory(service__reschedule_limit=2, service__allow_rescheduling=True)
        assert appt.can_be_rescheduled()
        appt.increment_reschedule_attempts()
        assert appt.reschedule_attempts == 1
        appt.increment_reschedule_attempts()
        assert appt.reschedule_attempts == 2
        assert not appt.can_be_rescheduled()

    def test_service_related_methods(self):
        """🔗 Vérifie les getters liés au service (name, desc)."""
        appt = AppointmentRequestFactory()
        assert appt.get_service_name() == appt.service.name
        assert appt.get_service_description() == appt.service.description