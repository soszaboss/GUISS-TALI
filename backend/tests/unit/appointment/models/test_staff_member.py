import pytest

from services.users import profile_update

from tests.unit.appointment.factories import ServiceFactory


@pytest.mark.django_db
class TestStaffMemberModel:
    def test_creation(self, staff_member_factory, user_factory):
        user = user_factory()
        profile_update(
            user=user,
            first_name="Jean",
            last_name="Dupont"
        )
        staff = staff_member_factory(user=user)
        assert str(staff) == "Jean Dupont"
        assert staff.user == user

    def test_service_relationship(self, staff_member_factory, service_factory):
        services = ServiceFactory.create_batch(2)
        staff = staff_member_factory()
        staff.services_offered.set(services)
        staff.save()
        assert staff.services_offered.count() == 2

    def test_working_hours(self, staff_member_factory):
        staff = staff_member_factory(
            work_on_saturday=True,
            work_on_sunday=False
        )
        assert staff.get_non_working_days() == [0]  # Seul dimanche non travaillé

    def test_time_config_fallback(self, staff_member_factory):
        staff = staff_member_factory(
            slot_duration=None,
            lead_time=None
        )
        # Supposons que vos valeurs par défaut sont dans settings
        assert staff.get_slot_duration() == 0
        assert staff.get_lead_time() == None

    def test_name_display(self, staff_member_factory, user_factory):
        # Test avec nom complet
        user1 = user_factory()
        profile_update(
            user=user1,
            first_name="Pierre",
            last_name="Martin"
        )
        staff1 = staff_member_factory(user=user1)
        assert staff1.get_staff_member_name() == "Pierre Martin"

        # Test avec seulement email
        user2 = user_factory(first_name="", last_name="", email="test@example.com")
        staff2 = staff_member_factory(user=user2)
        assert staff2.get_staff_member_name() == "test@example.com"