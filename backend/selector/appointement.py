from django.core.exceptions import PermissionDenied
from django.utils.translation import gettext as _, gettext_lazy as _

from apps.appointment.models import StaffMember, Appointment
from apps.appointment.utils.db_helpers import get_all_appointments, get_appointment_by_id

from apps.users.models import User


def fetch_all_appointments_if_admin(user) -> list:
    """Return all appointments if the user is a superuser."""
    if user.is_superuser:
        return get_all_appointments()
    raise PermissionDenied(_("Only superusers can access all appointments."))


def get_appointments_for_assistant(staff_member: StaffMember) -> list:
    if staff_member.user.role != User.Role.ASSIST:
        raise PermissionDenied(_("Only assistants can access this list."))
    return Appointment.objects.filter(appointment_request__staff_member=staff_member)


def prepare_appointment_display_data(user, appointment_id):
    appointment = get_appointment_by_id(appointment_id)

    if not appointment:
        return None, None, _("Appointment does not exist."), 404

    if not user.Role != User.Role.ASSIST or user.is_superuser or user.role != User.Role.DOCTOR:
        return None, None, _("You are not authorized to view this appointment."), 403

    return appointment, None, 200