import pytest
from datetime import timedelta, date
from django.core.exceptions import ValidationError
from django.utils import timezone

from tests.unit.appointment.factories import AppointmentRescheduleHistoryFactory


@pytest.mark.django_db
class TestAppointmentRescheduleHistory:
    def test_creation(self):
        history = AppointmentRescheduleHistoryFactory()
        assert history.pk is not None
        assert history.reschedule_status == 'pending'
        assert history.still_valid()

    def test_past_date_validation(self):
        past_date = date.today() - timedelta(days=1)
        with pytest.raises(ValidationError):
            AppointmentRescheduleHistoryFactory(date=past_date)

    def test_status_validation(self):
        with pytest.raises(ValidationError):
            history = AppointmentRescheduleHistoryFactory()
            history.reschedule_status = 'invalid'
            history.full_clean()

    def test_still_valid_method(self):
        history = AppointmentRescheduleHistoryFactory()
        assert history.still_valid()  # Par défaut valide

        # Simuler un historique expiré
        history.created = timezone.now() - timedelta(minutes=6)
        history.save()
        assert not history.still_valid()

    def test_relationship_with_request(self, appointment_request_factory):
        request = appointment_request_factory()
        history = AppointmentRescheduleHistoryFactory(appointment_request=request)

        assert history.appointment_request == request
        assert history in request.reschedule_histories.all()