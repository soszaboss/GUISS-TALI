import pytest
from datetime import datetime, time, timedelta, date
from django.core.exceptions import ValidationError
from django.utils import timezone

from tests.unit.appointment.factories import AppointmentFactory, StaffMemberFactory
from tests.unit.patients.factories import ConducteurFactory


@pytest.mark.django_db
class TestAppointmentModel:
    def test_creation(self):
        appointment = AppointmentFactory(phone='+221776543443')
        assert appointment.id is not None
        assert appointment.created is not None
        assert appointment.phone == '+221776543443'

    # def test_string_representation(self):
    #     patient = ConducteurFactory()
    #     patient.first_name = 'DIOP'
    #     patient.last_name = 'Alioune'
    #     patient.save()
    #     appointment = AppointmentFactory(patient=patient)
    #     expected_str = f"DIOP Alioune - {appointment.get_start_time().strftime('%Y-%m-%d %H:%M')} to {appointment.get_end_time().strftime('%Y-%m-%d %H:%M')}"
    #     assert str(appointment) == expected_str

    def test_getters(self):
        appointment = AppointmentFactory()
        assert isinstance(appointment.get_start_time(), datetime)
        assert isinstance(appointment.get_end_time(), datetime)
        assert appointment.get_service_name() == appointment.appointment_request.service.name

    def test_validation(self):
        # Test numéro de téléphone invalide
        with pytest.raises(ValidationError):
            appointment = AppointmentFactory(phone="123")
            appointment.full_clean()

    def test_to_dict(self, user_factory):
        patient = ConducteurFactory()
        patient.email = 'patient@email.com'
        patient.save()
        appointment = AppointmentFactory(patient=patient, want_reminder=True)
        result = appointment.to_dict()

        assert result['patient_email'] == 'patient@email.com'
        assert result['want_reminder'] is True
        assert 'start_time' in result


@pytest.mark.django_db
class TestAppointmentValidation:
    def test_date_validation(self, working_hours_factory, user_factory):
        # Configuration des heures de travail

        staff_member = StaffMemberFactory(
            user=user_factory(email='staff@email.com'),
        )
        working_hours_factory(
            staff_member=staff_member,
            day_of_week=1,  # Lundi
            start_time=time(9, 0),
            end_time=time(17, 0)
        )

        # Test jour non travaillé
        from apps.appointment.models import Appointment
        sunday_date = date.today() + timedelta(days=(6 - date.today().weekday()))  # Prochain dimanche
        is_valid, message = Appointment.is_valid_date(
            sunday_date,
            datetime.combine(sunday_date, time(10, 0)),
            staff_member,
            None,
            "Sunday"
        )
        assert not is_valid
        assert "does not work on this day" in message

    def test_day_off_validation(self, day_off_factory, user_factory):
        appointment = AppointmentFactory()
        staff_member = StaffMemberFactory(
            user=user_factory(email='staff_2@email.com'),
        )
        appt_date = appointment.appointment_request.date

        # Création d'un jour de congé
        day_off_factory(
            staff_member=staff_member,
            start_date=appt_date,
            end_date=appt_date
        )

        from apps.appointment.models import Appointment
        is_valid, message = Appointment.is_valid_date(
            appt_date,
            datetime.combine(appt_date, time(10, 0)),
            staff_member,
            None,
            "Monday"
        )
        assert not is_valid
        assert 'staff_2@email.com does not work on this day.' in message