import pytest
from datetime import date, timedelta
from django.core.exceptions import ValidationError
from django.db import IntegrityError

from apps.appointment.models import DayOff
from tests.unit.appointment.factories import DayOffFactory


@pytest.mark.django_db
class TestDayOffModel:
    def test_creation(self):
        day_off = DayOffFactory()
        assert day_off.pk is not None
        assert day_off.staff_member is not None
        assert day_off.start_date == date.today()

    def test_str_representation(self):
        day_off = DayOffFactory(description="Vacances")
        expected_str = f"{date.today()} to {date.today() + timedelta(days=1)} - Vacances"
        assert str(day_off) == expected_str

    def test_date_validation(self):
        # Start date after end date
        with pytest.raises(ValidationError):
            day_off = DayOffFactory(
                start_date=date.today() + timedelta(days=1),
                end_date=date.today()
            )
            day_off.full_clean()

    def test_required_staff_member(self):
        # Sans staff member
        with pytest.raises(IntegrityError):
            DayOff.objects.create(
                start_date=date.today(),
                end_date=date.today() + timedelta(days=1)
            )

    def test_is_owner_method(self, staff_member_factory):
        staff = staff_member_factory()
        day_off = DayOffFactory(staff_member=staff)

        assert day_off.is_owner(staff.user.id)
        assert not day_off.is_owner(9999)  # ID inexistant