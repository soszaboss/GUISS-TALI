# tests/factories.py
import random

import factory
from datetime import datetime, timedelta, time
from django.utils import timezone
from apps.appointment.models import (
    Service,
    StaffMember,
    AppointmentRequest,
    Appointment,
    Config,
    DayOff,
    WorkingHours, AppointmentRescheduleHistory
)
from apps.users.models import User
from tests.unit.patients.factories import ConducteurFactory
from tests.unit.users.factories import UserFactory


class ServiceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Service

    name = factory.Sequence(lambda n: f"Service {n}")
    description = factory.Faker('sentence')
    duration = timedelta(minutes=30)
    background_color = factory.LazyFunction(
        lambda: f"rgb({random.randint(0, 255)}, {random.randint(0, 255)}, {random.randint(0, 255)})")
    allow_rescheduling = True
    reschedule_limit = 2


class ConfigFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Config

    slot_duration = 30
    lead_time = time(8, 0)
    finish_time = time(18, 0)
    appointment_buffer_time = 30
    website_name = "Medical Appointments"
    default_reschedule_limit = 3

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        """Garantit le pattern singleton"""
        obj, _ = model_class.objects.get_or_create(pk=1, defaults=kwargs)
        return obj


class StaffMemberFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = StaffMember

    user = factory.SubFactory(UserFactory, role=User.Role.ASSIST)
    slot_duration = 30
    lead_time = time(9, 0)
    finish_time = time(17, 0)

    @factory.post_generation
    def services_offered(self, create, extracted, **kwargs):
        if not create or not extracted:
            return
        self.services_offered.add(*extracted)


class AppointmentRequestFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = AppointmentRequest

    date = factory.LazyFunction(timezone.now().date)
    start_time = time(10, 0)
    end_time = time(10, 30)
    service = factory.SubFactory(ServiceFactory)
    staff_member = factory.SubFactory(StaffMemberFactory)


class AppointmentRescheduleHistoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = AppointmentRescheduleHistory

    date = factory.LazyFunction(timezone.now().date)
    start_time = time(10, 0)
    end_time = time(10, 30)
    staff_member = factory.SubFactory(StaffMemberFactory)
    reason_for_rescheduling = factory.Faker('sentence')
    appointment_request = factory.SubFactory(AppointmentRequestFactory)
    reschedule_status = 'pending'


class AppointmentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Appointment

    patient = factory.SubFactory(ConducteurFactory)
    appointment_request = factory.SubFactory(AppointmentRequestFactory)
    phone = factory.Sequence(lambda n: f"+22177{n:07}")
    address = factory.Faker('city')
    want_reminder = True
    additional_info = factory.Faker('paragraph')


class WorkingHoursFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = WorkingHours

    staff_member = factory.SubFactory(StaffMemberFactory)
    day_of_week = 1  # Lundi
    start_time = time(9, 0)
    end_time = time(17, 0)


class DayOffFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = DayOff

    staff_member = factory.SubFactory(StaffMemberFactory)
    start_date = factory.LazyFunction(timezone.now().date)
    end_date = factory.LazyAttribute(lambda o: o.start_date + timedelta(days=1))
    description = factory.Faker('sentence')