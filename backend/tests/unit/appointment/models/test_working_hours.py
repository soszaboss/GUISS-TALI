import pytest
from datetime import time
from django.core.exceptions import ValidationError
from django.db import IntegrityError

from apps.appointment.models import WorkingHours
from tests.unit.appointment.factories import WorkingHoursFactory


@pytest.mark.django_db
class TestWorkingHoursModel:
    def test_creation(self):
        wh = WorkingHoursFactory()
        assert wh.pk is not None
        assert wh.day_of_week == 1  # Lundi
        assert wh.start_time == time(9, 0)

    def test_str_representation(self):
        wh = WorkingHoursFactory(day_of_week=2)  # Mardi
        assert "Tuesday" in str(wh)
        assert "09:00:00" in str(wh)

    def test_time_validation(self):
        # Start time after end time
        with pytest.raises(ValidationError):
            wh = WorkingHoursFactory(
                start_time=time(18, 0),
                end_time=time(9, 0)
            )
            wh.full_clean()

    def test_required_staff_member(self):
        # Sans staff member
        with pytest.raises(IntegrityError):
            WorkingHours.objects.create(
                day_of_week=1,
                start_time=time(9, 0),
                end_time=time(17, 0)
            )

    def test_unique_day_constraint(self):
        wh = WorkingHoursFactory(day_of_week=3)  # Mercredi
        with pytest.raises(IntegrityError):
            WorkingHoursFactory(
                staff_member=wh.staff_member,
                day_of_week=3  # Même jour
            )

    def test_weekend_status_update(self, staff_member_factory):
        staff = staff_member_factory(work_on_saturday=False)

        # Création d'horaires pour samedi
        WorkingHoursFactory(
            staff_member=staff,
            day_of_week=6  # Samedi
        )
        staff.refresh_from_db()
        assert staff.work_on_saturday is True

        # Création d'horaires pour dimanche
        WorkingHoursFactory(
            staff_member=staff,
            day_of_week=0  # Dimanche
        )
        staff.refresh_from_db()
        assert staff.work_on_sunday is True