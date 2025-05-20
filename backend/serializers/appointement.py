from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers

from apps.appointment.models import (
    Appointment, AppointmentRequest, AppointmentRescheduleHistory,
    DayOff, WorkingHours, Service, StaffMember
)
from services.appointment import (
    create_new_appointment, update_existing_appointment, save_appointment,
    create_or_update_day_off, create_or_update_working_hours,
    create_or_update_service, create_staff_member
)

class AppointmentRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentRequest
        fields = ['date', 'start_time', 'end_time', 'service', 'staff_member']

    def create(self, validated_data):
        # Delegate to service
        request = self.context.get('request')
        return create_new_appointment(data=validated_data, request=request)

    def update(self, instance, validated_data):
        # Use save_appointment service
        request = self.context.get('request')
        return save_appointment(appointment=instance.appointment, data={**validated_data, 'client_phone': instance.phone})

class AppointmentSerializer(serializers.ModelSerializer):
    phone = PhoneNumberField()

    class Meta:
        model = Appointment
        fields = ['phone', 'want_reminder', 'address', 'additional_info']

    def update(self, instance, validated_data):
        # Delegate to save_appointment service
        data = {
            'client_phone': validated_data.get('phone'),
            'want_reminder': validated_data.get('want_reminder'),
            'client_address': validated_data.get('address'),
            'additional_info': validated_data.get('additional_info'),
            'service_id': instance.appointment_request.service.id,
            'client_email': instance.client.email,
            'client_name': instance.client.get_full_name(),
        }
        return save_appointment(appointment=instance, data=data)

class AppointmentRescheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentRescheduleHistory
        fields = ['reason_for_rescheduling']

    def create(self, validated_data):
        staff_member = self.context['request'].user.staffmember
        return create_or_update_day_off(staff_member=staff_member, data=validated_data)

class DayOffSerializer(serializers.ModelSerializer):
    class Meta:
        model = DayOff
        fields = ['start_date', 'end_date', 'description']

    def create(self, validated_data):
        staff_member = self.context['request'].user.staffmember
        return create_or_update_day_off(staff_member=staff_member, data=validated_data)

    def update(self, instance, validated_data):
        staff_member = self.context['request'].user.staffmember
        data = {'id': instance.id, **validated_data}
        return create_or_update_day_off(staff_member=staff_member, data=data)

class WorkingHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkingHours
        fields = ['day_of_week', 'start_time', 'end_time']

    def create(self, validated_data):
        staff_member = self.context['request'].user.staffmember
        return create_or_update_working_hours(staff_member=staff_member, data=validated_data)

    def update(self, instance, validated_data):
        staff_member = self.context['request'].user.staffmember
        data = {'id': instance.id, **validated_data}
        return create_or_update_working_hours(staff_member=staff_member, data=data)

class StaffMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffMember
        fields = [
            'user', 'services_offered', 'slot_duration', 'lead_time', 'finish_time',
            'appointment_buffer_time', 'work_on_saturday', 'work_on_sunday'
        ]

    def create(self, validated_data):
        return create_staff_member(data=validated_data)

    def update(self, instance, validated_data):
        # direct update
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()
        return instance

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['name', 'description', 'duration', 'background_color', 'reschedule_limit', 'allow_rescheduling']

    def create(self, validated_data):
        return create_or_update_service(data=validated_data)

    def update(self, instance, validated_data):
        return create_or_update_service(data={'id': instance.id, **validated_data})
