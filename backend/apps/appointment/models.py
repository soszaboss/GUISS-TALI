# models.py
# Path: appointment/models.py

"""
Author: Adams Pierre David
Since: 1.0.0
"""
import colorsys
import datetime
import random
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import CheckConstraint, Q
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django_extensions.db.models import TimeStampedModel
from phonenumber_field.modelfields import PhoneNumberField

from .utils.date_time import convert_minutes_in_human_readable_format, get_timestamp, get_weekday_num, \
    time_difference
from .utils.view_helpers import generate_random_id

from apps.patients.models import Conducteur
from apps.users.models import User


DAYS_OF_WEEK = (
    (0, 'Sunday'),
    (1, 'Monday'),
    (2, 'Tuesday'),
    (3, 'Wednesday'),
    (4, 'Thursday'),
    (5, 'Friday'),
    (6, 'Saturday'),
)


def generate_rgb_color():
    hue = random.random()  # Random hue between 0 and 1
    saturation = 0.9  # High saturation to ensure a vivid color
    value = 0.9  # High value to ensure a bright color

    r, g, b = colorsys.hsv_to_rgb(hue, saturation, value)

    # Convert to 0-255 RGB values
    r = int(r * 255)
    g = int(g * 255)
    b = int(b * 255)

    return f'rgb({r}, {g}, {b})'


class Service(TimeStampedModel):
    """
    Represents a service provided by the appointment system.

    Author: Adams Pierre David
    Version: 1.1.0
    Since: 1.0.0
    """
    name = models.CharField(max_length=100, blank=False)
    description = models.TextField(blank=True, null=True)
    duration = models.DurationField(validators=[MinValueValidator(datetime.timedelta(seconds=1))])
    background_color = models.CharField(max_length=50, null=True, blank=True, default=generate_rgb_color)
    reschedule_limit = models.PositiveIntegerField(
        default=0,
        help_text=_("Maximum number of times an appointment can be rescheduled.")
    )
    allow_rescheduling = models.BooleanField(
        default=False,
        help_text=_("Indicates whether appointments for this service can be rescheduled.")
    )

    def __str__(self):
        return self.name

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
        }

    def get_duration_parts(self):
        total_seconds = int(self.duration.total_seconds())
        days = total_seconds // 86400
        hours = (total_seconds % 86400) // 3600
        minutes = (total_seconds % 3600) // 60
        seconds = total_seconds % 60
        return days, hours, minutes, seconds

    def get_duration(self):
        days, hours, minutes, seconds = self.get_duration_parts()
        parts = []

        if days:
            parts.append(f"{days} day{'s' if days > 1 else ''}")
        if hours:
            parts.append(f"{hours} hour{'s' if hours > 1 else ''}")
        if minutes:
            parts.append(f"{minutes} minute{'s' if minutes > 1 else ''}")
        if seconds:
            parts.append(f"{seconds} second{'s' if seconds > 1 else ''}")

        return ' '.join(parts)


class StaffMember(TimeStampedModel):
    user = models.OneToOneField(
                User,
                on_delete=models.CASCADE,
                limit_choices_to={'role__in': [User.Role.ASSIST, User.Role.ADMIN]}
                )
    services_offered = models.ManyToManyField(Service)
    slot_duration = models.PositiveIntegerField(
        null=True, blank=True,
        help_text=_("Minimum time for an appointment in minutes, recommended 30.")
    )
    lead_time = models.TimeField(
        null=True, blank=True,
        help_text=_("Time when the staff member starts working.")
    )
    finish_time = models.TimeField(
        null=True, blank=True,
        help_text=_("Time when the staff member stops working.")
    )
    appointment_buffer_time = models.FloatField(
        blank=True, null=True,
        help_text=_("Time between now and the first available slot for the current day (doesn't affect tomorrow). "
                    "e.g: If you start working at 9:00 AM and the current time is 8:30 AM and you set it to 30 "
                    "minutes, the first available slot will be at 9:00 AM. If you set the appointment buffer time to "
                    "60 minutes, the first available slot will be at 9:30 AM.")
    )
    work_on_saturday = models.BooleanField(default=False)
    work_on_sunday = models.BooleanField(default=False)


    def __str__(self):
        return f"{self.get_staff_member_name()}"

    def get_slot_duration(self):
        config = Config.objects.first()
        return self.slot_duration or (config.slot_duration if config else 0)

    def get_slot_duration_text(self):
        slot_duration = self.get_slot_duration()
        return convert_minutes_in_human_readable_format(slot_duration)

    def get_lead_time(self):
        config = Config.objects.first()
        return self.lead_time or (config.lead_time if config else None)

    def get_finish_time(self):
        config = Config.objects.first()
        return self.finish_time or (config.finish_time if config else None)

    def works_on_both_weekends_day(self):
        return self.work_on_saturday and self.work_on_sunday

    def get_staff_member_name(self):
        name_options = [
            getattr(self.user, 'get_full_name', lambda: '')(),
            f"{self.user.profile.first_name} {self.user.profile.last_name}",
            self.user.email,
            f"Staff Member {self.id}"
        ]
        return next((name.strip() for name in name_options if name.strip()), "Unknown")

    def get_staff_member_first_name(self):
        return self.user.profile.first_name

    def get_non_working_days(self):
        non_working_days = []

        if not self.work_on_saturday:
            non_working_days.append(6)  # Saturday
        if not self.work_on_sunday:
            non_working_days.append(0)  # Sunday
        return non_working_days

    def get_weekend_days_worked_text(self):
        if self.work_on_saturday and self.work_on_sunday:
            return _("Saturday and Sunday")
        elif self.work_on_saturday:
            return _("Saturday")
        elif self.work_on_sunday:
            return _("Sunday")
        else:
            return _("None")

    def get_services_offered(self):
        return self.services_offered.all()

    def get_service_offered_text(self):
        return ', '.join([service.name for service in self.services_offered.all()])

    def get_service_is_offered(self, service_id):
        return self.services_offered.filter(id=service_id).exists()

    def get_appointment_buffer_time(self):
        config = Config.objects.first()
        return self.appointment_buffer_time or (config.appointment_buffer_time if config else 0)

    def get_appointment_buffer_time_text(self):
        # convert buffer time (which is in minutes) in day hours minutes if necessary
        return convert_minutes_in_human_readable_format(self.get_appointment_buffer_time())

    def get_days_off(self):
        return DayOff.objects.filter(staff_member=self)

    def get_working_hours(self):
        return self.workinghours_set.all()

    def update_upon_working_hours_deletion(self, day_of_week: int):
        if day_of_week == 6:
            self.work_on_saturday = False
        elif day_of_week == 0:
            self.work_on_sunday = False
        self.save()

    def is_working_day(self, day: int):
        return day not in self.get_non_working_days()


class AppointmentRequest(TimeStampedModel):
    """
    Represents an appointment request made by an admin or assist user.

    Author: Adams Pierre David
    Since: 1.0.0
    """
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    staff_member = models.ForeignKey(StaffMember, on_delete=models.SET_NULL, null=True)
    reschedule_attempts = models.PositiveIntegerField(default=0)


    def __str__(self):
        return f"{self.date} - {self.start_time} to {self.end_time} - {self.service.name}"

    def clean(self):
        if self.start_time is not None and self.end_time is not None:
            if self.start_time > self.end_time:
                raise ValidationError(_("Start time must be before end time"))
            if self.start_time == self.end_time:
                raise ValidationError(_("Start time and end time cannot be the same"))

        # Ensure the date is not in the past:
        if self.date and self.date < datetime.date.today():
            raise ValidationError(_("Date cannot be in the past"))

    def save(self, *args, **kwargs):
        # start time should not be equal to end time
        if self.start_time == self.end_time:
            raise ValidationError(_("Start time and end time cannot be the same"))
        # date should not be in the past
        if self.date < datetime.date.today():
            raise ValidationError(_("Date cannot be in the past"))
        # duration should not exceed the service duration
        if time_difference(self.start_time, self.end_time) > self.service.duration:
            raise ValidationError(_("Duration cannot exceed the service duration"))
        return super().save(*args, **kwargs)

    def get_service_name(self):
        return self.service.name

    def get_service_description(self):
        return self.service.description

    def can_be_rescheduled(self):
        return self.reschedule_attempts < self.service.reschedule_limit

    def increment_reschedule_attempts(self):
        self.reschedule_attempts += 1
        self.save(update_fields=['reschedule_attempts'])

    def get_reschedule_history(self):
        return self.reschedule_histories.all().order_by('-created')


class AppointmentRescheduleHistory(TimeStampedModel):
    appointment_request = models.ForeignKey(
        'AppointmentRequest',
        on_delete=models.CASCADE, related_name='reschedule_histories'
    )
    date = models.DateField(help_text=_("The previous date of the appointment before it was rescheduled."))
    start_time = models.TimeField(
        help_text=_("The previous start time of the appointment before it was rescheduled.")
    )
    end_time = models.TimeField(
        help_text=_("The previous end time of the appointment before it was rescheduled.")
    )
    staff_member = models.ForeignKey(
        StaffMember, on_delete=models.SET_NULL, null=True,
        help_text=_("The previous staff member of the appointment before it was rescheduled.")
    )
    reason_for_rescheduling = models.TextField(
        blank=True, null=True,
        help_text=_("Reason for the appointment reschedule.")
    )
    reschedule_status = models.CharField(
        max_length=10,
        choices=[('pending', 'Pending'), ('confirmed', 'Confirmed')],
        default='pending',
        help_text=_("Indicates the status of the reschedule action.")
    )

    class Meta:
        verbose_name = _("Appointment Reschedule History")
        verbose_name_plural = _("Appointment Reschedule Histories")
        ordering = ['-created']

    def __str__(self):
        return f"Reschedule history for {self.appointment_request} from {self.date}"

    def save(self, *args, **kwargs):

        # date should not be in the past
        if self.date < datetime.date.today():
            raise ValidationError(_("Date cannot be in the past"))
        try:
            datetime.datetime.strptime(str(self.date), '%Y-%m-%d')
        except ValueError:
            raise ValidationError(_("The date is not valid"))
        return super().save(*args, **kwargs)

    def still_valid(self):
        # if more than 5 minutes have passed, it is no longer valid
        now = timezone.now()  # This is offset-aware to match self.created
        delta = now - self.created
        return delta.total_seconds() < 300


class Appointment(TimeStampedModel):
    """
    Represents an appointment made by an admin or assist user. It is created when the admin or assist user confirms the appointment request.

    Author: Adams Pierre David
    Version: 1.1.0
    Since: 1.0.0
    """
    patient = models.ForeignKey(Conducteur, on_delete=models.SET_NULL, null=True,)
    appointment_request = models.OneToOneField(AppointmentRequest, on_delete=models.CASCADE)
    phone = PhoneNumberField(blank=True)
    address = models.CharField(max_length=255, blank=True, null=True, default="",
                               help_text=_("Does not have to be specific, just the city and the state"))
    want_reminder = models.BooleanField(default=True)
    additional_info = models.TextField(blank=True, null=True)


    def __str__(self):
        return f"{self.patient} - " \
               f"{self.appointment_request.start_time.strftime('%Y-%m-%d %H:%M')} to " \
               f"{self.appointment_request.end_time.strftime('%Y-%m-%d %H:%M')}"

    def save(self, *args, **kwargs):
        if not hasattr(self, 'appointment_request'):
            raise ValidationError("Appointment request is required")
        return super().save(*args, **kwargs)

    def get_client_name(self):
        if hasattr(self.patient, 'get_full_name') and callable(getattr(self.patient, 'get_full_name')):
            name = self.patient.get_full_name()
        else:
            name = self.patient.first_name
        return name

    def get_date(self):
        return self.appointment_request.date

    def get_start_time(self):
        return datetime.datetime.combine(self.get_date(), self.appointment_request.start_time)

    def get_end_time(self):
        return datetime.datetime.combine(self.get_date(), self.appointment_request.end_time)

    def get_service(self):
        return self.appointment_request.service

    def get_service_name(self):
        return self.appointment_request.get_service_name()

    def get_service_duration(self):
        return self.appointment_request.service.get_duration()

    def get_staff_member_name(self):
        if not self.appointment_request.staff_member:
            return ""
        return self.appointment_request.staff_member.get_staff_member_name()

    def get_staff_member(self):
        return self.appointment_request.staff_member

    def get_service_description(self):
        return self.appointment_request.get_service_description()

    def get_appointment_date(self):
        return self.appointment_request.date

    # def get_absolute_url(self, request=None):
    #     url = reverse('appointment:display_appointment', args=[str(self.id)])
    #     return request.build_absolute_uri(url) if request else url

    def get_background_color(self):
        return self.appointment_request.service.background_color

    @staticmethod
    def is_valid_date(appt_date, start_time, staff_member, current_appointment_id, weekday: str):
        weekday_num = get_weekday_num(weekday)
        sm_name = staff_member.get_staff_member_name()

        # Check if the staff member works on the given day
        try:
            working_hours = WorkingHours.objects.get(staff_member=staff_member, day_of_week=weekday_num)
        except WorkingHours.DoesNotExist:
            message = _("{staff_member} does not work on this day.").format(staff_member=sm_name)
            return False, message

        # Check if the start time falls within the staff member's working hours
        if not (working_hours.start_time <= start_time.time() <= working_hours.end_time):
            message = _("The appointment start time is outside of {staff_member}'s working hours.").format(
                staff_member=sm_name)
            return False, message

        # Check if the staff member already has an appointment on the given date and time
        # Using prefetch_related to reduce DB hits when accessing related objects
        appt_list = Appointment.objects.filter(appointment_request__staff_member=staff_member,
                                               appointment_request__date=appt_date).exclude(
            id=current_appointment_id).prefetch_related('appointment_request')
        for appt in appt_list:
            if appt.appointment_request.start_time <= start_time.time() <= appt.appointment_request.end_time:
                message = _("{staff_member} already has an appointment at this time.").format(staff_member=sm_name)
                return False, message

        # Check if the staff member has a day off on the appointment's date
        days_off = DayOff.objects.filter(staff_member=staff_member, start_date__lte=appt_date, end_date__gte=appt_date)
        if days_off.exists():
            message = _("{staff_member} has a day off on this date.").format(staff_member=sm_name)
            return False, message

        return True, ""

    def is_owner(self, staff_user_id):
        return self.appointment_request.staff_member.user.id == staff_user_id

    def to_dict(self):
        return {
            "id": self.id,
            "patient_email": self.patient.email,
            "start_time": self.appointment_request.start_time.strftime('%Y-%m-%d %H:%M'),
            "end_time": self.appointment_request.end_time.strftime('%Y-%m-%d %H:%M'),
            "service_name": self.appointment_request.service.name,
            "address": self.address,
            "want_reminder": self.want_reminder,
            "additional_info": self.additional_info,
        }


class Config(TimeStampedModel):
    """
    Represents configuration settings for the appointment system. There can only be one Config object in the database.
    If you want to change the settings, you must edit the existing Config object.

    Author: Adams Pierre David
    Version: 1.1.0
    Since: 1.1.0
    """
    slot_duration = models.PositiveIntegerField(
        null=True,
        help_text=_("Minimum time for an appointment in minutes, recommended 30."),
    )
    lead_time = models.TimeField(
        null=True,
        help_text=_("Time when we start working."),
    )
    finish_time = models.TimeField(
        null=True,
        help_text=_("Time when we stop working."),
    )
    appointment_buffer_time = models.FloatField(
        null=True,
        help_text=_("Time between now and the first available slot for the current day (doesn't affect tomorrow)."),
    )
    website_name = models.CharField(
        max_length=255,
        default="",
        help_text=_("Name of your website."),
    )
    app_offered_by_label = models.CharField(
        max_length=255,
        default=_("Offered by"),
        help_text=_("Label for `Offered by` on the appointment page")
    )
    default_reschedule_limit = models.PositiveIntegerField(
        default=3,
        help_text=_("Default maximum number of times an appointment can be rescheduled across all services.")
    )
    allow_staff_change_on_reschedule = models.BooleanField(
        default=True,
        help_text=_("Allows clients to change the staff member when rescheduling an appointment.")
    )

    def clean(self):
        if Config.objects.exists() and not self.pk:
            raise ValidationError(_("You can only create one Config object"))
        if self.lead_time is not None and self.finish_time is not None:
            if self.lead_time >= self.finish_time:
                raise ValidationError(_("Lead time must be before finish time"))
        if self.appointment_buffer_time is not None and self.appointment_buffer_time < 0:
            raise ValidationError(_("Appointment buffer time cannot be negative"))
        if self.slot_duration is not None and self.slot_duration <= 0:
            raise ValidationError(_("Slot duration must be greater than 0"))

    def save(self, *args, **kwargs):
        self.clean()
        self.pk = 1
        super(Config, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def get_instance(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return f"Config {self.pk}: slot_duration={self.slot_duration}, lead_time={self.lead_time}, " \
               f"finish_time={self.finish_time}"


class DayOff(TimeStampedModel):
    staff_member = models.ForeignKey(StaffMember, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    description = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.start_date} to {self.end_date} - {self.description if self.description else 'Day off'}"

    def clean(self):
        if self.start_date is not None and self.end_date is not None:
            if self.start_date > self.end_date:
                raise ValidationError(_("Start date must be before end date"))

    def is_owner(self, user_id):
        return self.staff_member.id == user_id


class WorkingHours(TimeStampedModel):
    staff_member = models.ForeignKey(StaffMember, on_delete=models.CASCADE)
    day_of_week = models.PositiveIntegerField(choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return f"{self.get_day_of_week_display()} - {self.start_time} to {self.end_time}"

    def save(self, *args, **kwargs):
        # Call the original save method
        super(WorkingHours, self).save(*args, **kwargs)

        # Update staff member's weekend working status
        if self.day_of_week == '6' or self.day_of_week == 6:  # Saturday
            self.staff_member.work_on_saturday = True
        elif self.day_of_week == '0' or self.day_of_week == 0:  # Sunday
            self.staff_member.work_on_sunday = True
        self.staff_member.save()

    def clean(self):
        if self.start_time >= self.end_time:
            raise ValidationError("Start time must be before end time")

    def get_start_time(self):
        return self.start_time

    def get_end_time(self):
        return self.end_time

    def get_day_of_week_str(self):
        # return the name of the day instead of the integer
        return self.get_day_of_week_display()

    def is_owner(self, user_id):
        return self.staff_member.id == user_id

    class Meta:
        verbose_name = "Working Hour"
        verbose_name_plural = "Working Hours"
        unique_together = ['staff_member', 'day_of_week']
