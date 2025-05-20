import pytest
import random
from datetime import timedelta, date, time

from apps.users.models import User
from services.users import user_create


def generer_numero_senegalais():
    # Liste des préfixes valides pour les numéros sénégalais
    prefixes = ['70', '76', '77', '78']
    # Choisir un préfixe aléatoire
    prefix = random.choice(prefixes)
    # Générer les 7 chiffres restants
    numero = ''.join([str(random.randint(0, 9)) for _ in range(7)])
    # Combiner le préfixe et les chiffres
    return f"+221{prefix}{numero[:3]}{numero[3:5]}{numero[5:]}"

@pytest.fixture
def service_factory(db):
    from apps.appointment.models import Service  # Adaptez l'import

    def create_service(**kwargs):
        defaults = {
            'name': "Consultation standard",
            'duration': timedelta(minutes=30),
            'description': "Description par défaut",
            'background_color': 'rgb(100, 200, 150)',
            'allow_rescheduling': True,
            'reschedule_limit': 2
        }
        defaults.update(kwargs)
        return Service.objects.create(**defaults)

    return create_service


@pytest.fixture
def staff_member_factory(db, user_factory):
    from apps.appointment.models import StaffMember  # Adaptez l'import

    def create_staff_member(**kwargs):
        user = kwargs.pop('user', None) or user_factory()
        staff = StaffMember.objects.create(user=user, **kwargs)

        if 'services_offered' in kwargs:
            staff.services_offered.set(kwargs['services_offered'])
            staff.save()

        return staff

    return create_staff_member


@pytest.fixture
def user_factory(db):

    def create_user(**kwargs):
        return user_create(
            email=kwargs.get('email', 'user@example.com'),
            password=kwargs.get('password', 'password123'),
            role=User.Role.ADMIN,
            phone_number=generer_numero_senegalais()
        )

    return create_user


@pytest.fixture
def appointment_request_factory(db, service_factory, staff_member_factory):
    def create_request(**kwargs):
        from apps.appointment.models import AppointmentRequest
        defaults = {
            'date': date.today(),
            'start_time': time(9, 0),
            'end_time': time(9, 30),
            'service': kwargs.pop('service', service_factory()),
            'staff_member': kwargs.pop('staff_member', staff_member_factory())
        }
        defaults.update(kwargs)
        return AppointmentRequest.objects.create(**defaults)

    return create_request


@pytest.fixture
def reschedule_history_factory(db, appointment_request_factory, staff_member_factory):
    def create_history(**kwargs):
        from apps.appointment.models import AppointmentRescheduleHistory
        request = kwargs.pop('appointment_request', appointment_request_factory())
        defaults = {
            'date': date.today() + timedelta(days=1),
            'start_time': time(9, 0),
            'end_time': time(10, 0),
            'staff_member': kwargs.pop('staff_member', staff_member_factory()),
            'reason_for_rescheduling': "Client request",
            'reschedule_status': 'pending'
        }
        defaults.update(kwargs)
        return AppointmentRescheduleHistory.objects.create(appointment_request=request, **defaults)
    return create_history


@pytest.fixture
def appointment_factory(db, appointment_request_factory, user_factory):
    def create_appointment(**kwargs):
        from apps.appointment.models import Appointment
        defaults = {
            'appointment_request': kwargs.pop('appointment_request', appointment_request_factory()),
            'patient': kwargs.pop('patient', user_factory()),
            'phone': '+1234567890',
            'address': '123 Test Street',
            'want_reminder': False,
            'additional_info': None
        }
        defaults.update(kwargs)
        return Appointment.objects.create(**defaults)
    return create_appointment


@pytest.fixture
def config_factory(db):
    def create_config(**kwargs):
        from apps.appointment.models import Config
        defaults = {
            'slot_duration': 30,
            'lead_time': time(9, 0),
            'finish_time': time(17, 0),
            'appointment_buffer_time': 15.0,
            'website_name': 'Test Clinic'
        }
        defaults.update(kwargs)
        return Config.objects.create(**defaults)
    return create_config


@pytest.fixture
def day_off_factory(db, staff_member_factory):
    def create_day_off(**kwargs):
        from apps.appointment.models import DayOff
        defaults = {
            'staff_member': kwargs.pop('staff_member', staff_member_factory()),
            'start_date': date.today(),
            'end_date': date.today() + timedelta(days=1),
            'description': "Congé annuel"
        }
        defaults.update(kwargs)
        return DayOff.objects.create(**defaults)
    return create_day_off


@pytest.fixture
def working_hours_factory(db, staff_member_factory):
    def create_working_hours(**kwargs):
        from apps.appointment.models import WorkingHours
        defaults = {
            'staff_member': kwargs.pop('staff_member', staff_member_factory()),
            'day_of_week': 1,  # Lundi
            'start_time': time(9, 0),
            'end_time': time(17, 0)
        }
        defaults.update(kwargs)
        return WorkingHours.objects.create(**defaults)
    return create_working_hours