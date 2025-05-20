# services.py
# Path: appointment/services.py

"""
Author: Adams Pierre David
Since: 2.0.0
"""

from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.utils import timezone
from django.utils.translation import gettext as _, gettext_lazy as _

from apps.appointment.utils.date_time import (
    convert_12_hour_time_to_24_hour_time, convert_str_to_date, convert_str_to_time, get_ar_end_time)
from apps.appointment.utils.db_helpers import (
    Appointment, AppointmentRequest, Service, StaffMember, WorkingHours, calculate_slots,
    calculate_staff_slots, check_day_off_for_staff, create_new_user,
    day_off_exists_for_date_range, exclude_booked_slots, exclude_pending_reschedules,
     get_times_from_config, get_user_by_email, get_weekday_num_from_date,
    get_working_hours_for_staff_and_day, parse_name, update_appointment_reminder,
    working_hours_exist)

from apps.appointment.models import DayOff


###############################################################
# handler for adding, updating, and deleting day off and working hours
# services/appointment/save_appt_datetime.py
def create_or_update_day_off(*, staff_member, data: dict) -> DayOff:
    """
    Crée ou met à jour un jour de congé (DayOff) pour un membre du staff.
    """
    try:
        days_off = DayOff.objects.update_or_create(**data)
    except IntegrityError:
        ValidationError('Informations incorrecte', code=400)
    else:
        # Validation business : éviter doublon sur cette période
        if day_off_exists_for_date_range(
            staff_member,
            days_off.start_date,
            days_off.end_date,
            days_off.id
        ):
            raise ValidationError({"non_field_errors": [_("A day off in this date range already exists.")]})

        return days_off


def create_or_update_working_hours(
    *,
    staff_member,
    data: dict,
) -> WorkingHours:
    """
    Crée ou met à jour les heures de travail (WorkingHours) d’un staff.
    """
    data["start_time"] = convert_12_hour_time_to_24_hour_time(data["start_time"])
    data["end_time"] = convert_12_hour_time_to_24_hour_time(data["end_time"])

    if data["start_time"] >= data["end_time"]:
        raise ValidationError({"start_time": [_("Start time must be before end time.")]})

    if working_hours_exist(data["day_of_week"], staff_member):
        raise ValidationError({"day_of_week": [_("Working hours already exist for this day.")]})

    try:
        working_hours = WorkingHours.objects.update_or_create(**data)
        return working_hours
    except IntegrityError:
        raise ValidationError({"day_of_week": [_("Working hours already exist for this day.")]})


def save_appointment(*, appointment: Appointment, data: dict) -> Appointment:
    """
    Modifie un rendez-vous existant avec nouvelles infos (client, service, date, reminder...).
    """
    try:
        service = Service.objects.get(id=data["service_id"])
    except Service.DoesNotExist:
        raise ValidationError({"service_id": "Service not found."})

    staff_member = None
    if data.get("staff_member_id"):
        try:
            staff_member = StaffMember.objects.get(id=data["staff_member_id"])
        except StaffMember.DoesNotExist:
            raise ValidationError({"staff_member_id": "Staff member not found."})

        if not staff_member.get_service_is_offered(service.id):
            raise ValidationError({"service": "Service not offered by this staff member."})

    # Client infos
    first_name, last_name = parse_name(data.get("client_name", ""))
    client = appointment.client
    client.first_name = first_name
    client.last_name = last_name
    client.email = data["client_email"]
    client.save()

    # Handle time
    start_time = data.get("start_time")
    if isinstance(start_time, str):
        start_time = convert_str_to_time(start_time)
    end_time = get_ar_end_time(start_time, service.duration)

    appt_request = appointment.appointment_request
    appt_request.service = service
    appt_request.start_time = start_time
    appt_request.end_time = end_time
    if staff_member:
        appt_request.staff_member = staff_member
    appt_request.save()

    # Reminder
    update_appointment_reminder(appointment=appointment, new_date=appt_request.date,
                                new_start_time=start_time, want_reminder=data.get("want_reminder"))

    # Appointment
    appointment.phone = data.get("client_phone")
    appointment.address = data.get("client_address")
    appointment.want_reminder = data.get("want_reminder", False)
    appointment.additional_info = data.get("additional_info", "")
    appointment.save()

    return appointment


def create_new_appointment(*, data: dict, request) -> Appointment:
    try:
        service = Service.objects.get(id=data["service_id"])
    except Service.DoesNotExist:
        raise ValidationError({"service_id": "Service not found"})

    staff_member = StaffMember.objects.get(id=data["staff_member"]) if data.get("staff_member") \
        else StaffMember.objects.get(user=request.user)

    date = convert_str_to_date(data["date"])
    start_time = convert_str_to_time(data["start_time"])
    end_time = get_ar_end_time(start_time, service.duration)

    appointment_request = AppointmentRequest.objects.create(
        date=date,
        start_time=start_time,
        end_time=end_time,
        service=service,
        staff_member=staff_member
    )

    email = data.get("client_email")
    user = get_user_by_email(email)
    if not user:
        user = create_new_user({
            "first_name": data.get("client_name").split()[0],
            "last_name": data.get("client_name").split()[-1],
            "email": email
        })

    appointment = Appointment.objects.create(
        appointment_request=appointment_request,
        client=user,
        phone=data.get("client_phone"),
        address=data.get("client_address"),
        want_reminder=data.get("want_reminder", False),
        additional_info=data.get("additional_info", ""),
        paid=False
    )

    return appointment


def update_existing_appointment(*, appointment_id: int, data: dict) -> Appointment:
    try:
        appointment = Appointment.objects.get(id=appointment_id)
    except Appointment.DoesNotExist:
        raise ValidationError({"appointment_id": "Appointment not found."})

    return save_appointment(appointment=appointment, data=data)


def save_appt_date_time(*, appointment_id: int, date, start_time) -> Appointment:
    try:
        appointment = Appointment.objects.get(id=appointment_id)
    except Appointment.DoesNotExist:
        raise ValidationError({"appointment_id": "Appointment not found."})

    if isinstance(start_time, str):
        start_time = convert_str_to_time(start_time)
    if isinstance(date, str):
        date = convert_str_to_date(date)

    service = appointment.get_service()
    end_time = get_ar_end_time(start_time, service.duration)

    update_appointment_reminder(
        appointment=appointment,
        new_date=date,
        new_start_time=start_time,
    )

    appt_request = appointment.appointment_request
    appt_request.date = date
    appt_request.start_time = start_time
    appt_request.end_time = end_time
    appt_request.save()

    appointment.save()
    return appointment


def get_available_slots(date, appointments):
    start_time, end_time, slot_duration, buff_time = get_times_from_config(date)
    now = timezone.now()
    buffer_time = now + buff_time if date == now.date() else now
    slots = calculate_slots(start_time, end_time, buffer_time, slot_duration)
    return exclude_booked_slots(appointments, slots, slot_duration)


def get_available_slots_for_staff(date, staff_member):
    if check_day_off_for_staff(staff_member, date):
        return []

    day_of_week = get_weekday_num_from_date(date)
    working_hours = get_working_hours_for_staff_and_day(staff_member, day_of_week)
    if not working_hours:
        return []

    slot_duration = staff_member.get_slot_duration()
    slots = calculate_staff_slots(date, staff_member)
    slots = exclude_pending_reschedules(slots, staff_member, date)

    appointments = Appointment.objects.filter(
        appointment_request__staff_member=staff_member,
        appointment_request__date=date,
        appointment_request__start_time__gte=working_hours['start_time'],
        appointment_request__end_time__lte=working_hours['end_time']
    )

    return exclude_booked_slots(appointments, slots, slot_duration)


def create_or_update_service(data: dict) -> Service:
    try:
        service = Service.objects.update_or_create(**data)
        return service
    except IntegrityError:
        raise ValidationError('Informatons incorrecte.', code=400)


def create_staff_member(data: dict):
   staff_member = StaffMember.objects.get(id=data['id'])
   if staff_member.exist():
       raise ValidationError('Staff member already exists.', code=400)
   try:
       return StaffMember.objects.create(**data)
   except IntegrityError:
       raise ValidationError('Staff member already exists.', code=400)
