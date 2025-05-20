from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils.translation import gettext_lazy as _
from django.shortcuts import get_object_or_404
from django.db.models import Q
from datetime import date, timedelta

from services.appointment import get_available_slots_for_staff
from .models import (
    Appointment,
    AppointmentRequest,
    Service,
    StaffMember,
    DayOff,
    WorkingHours,
    AppointmentRescheduleHistory
)
from serializers.appointement import (
    AppointmentSerializer,
    AppointmentRequestSerializer,
    ServiceSerializer,
    StaffMemberSerializer,
    DayOffSerializer,
    WorkingHoursSerializer,
    AppointmentRescheduleSerializer
)


class ServiceListView(generics.ListCreateAPIView):
    """Gestion des services - Liste et création"""
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return super().get_permissions()


class ServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Détail, mise à jour et suppression d'un service"""
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAdminUser]


class StaffMemberListView(generics.ListCreateAPIView):
    """Gestion des membres du staff - Liste et création"""
    queryset = StaffMember.objects.all()
    serializer_class = StaffMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return super().get_permissions()


class StaffMemberDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Détail, mise à jour et suppression d'un staff member"""
    queryset = StaffMember.objects.all()
    serializer_class = StaffMemberSerializer
    permission_classes = [permissions.IsAdminUser]


class AppointmentRequestCreateView(generics.CreateAPIView):
    """Création d'une demande de rendez-vous"""
    serializer_class = AppointmentRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Auto-assign staff member if not specified
        if 'staff_member' not in serializer.validated_data:
            staff_member = get_object_or_404(StaffMember, user=self.request.user)
            serializer.validated_data['staff_member'] = staff_member
        serializer.save()


class AppointmentListView(generics.ListAPIView):
    """Liste des rendez-vous avec filtres"""
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Appointment.objects.all()

        # Filtre par staff member (pour les assistants)
        if not user.is_superuser:
            staff_member = get_object_or_404(StaffMember, user=user)
            queryset = queryset.filter(appointment_request__staff_member=staff_member)

        # Filtres optionnels
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        staff_id = self.request.query_params.get('staff_id')

        if date_from:
            queryset = queryset.filter(appointment_request__date__gte=date_from)
        if date_to:
            queryset = queryset.filter(appointment_request__date__lte=date_to)
        if staff_id:
            queryset = queryset.filter(appointment_request__staff_member_id=staff_id)

        return queryset


class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Détail, mise à jour et suppression d'un rendez-vous"""
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        instance = self.get_object()
        user = self.request.user

        # Validation des permissions
        if not user.is_superuser:
            staff_member = get_object_or_404(StaffMember, user=user)
            if instance.appointment_request.staff_member != staff_member:
                raise permissions.PermissionDenied(
                    _("Vous ne pouvez modifier que vos propres rendez-vous")
                )

        serializer.save()


class AvailableSlotsView(APIView):
    """Récupère les créneaux disponibles pour un staff member et une date"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        staff_member_id = request.query_params.get('staff_member_id')
        selected_date = request.query_params.get('date')

        if not staff_member_id or not selected_date:
            return Response(
                {"error": _("staff_member_id et date sont requis")},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            staff_member = StaffMember.objects.get(id=staff_member_id)
            available_slots = get_available_slots_for_staff(selected_date, staff_member)

            # Formatage des créneaux
            slots_formatted = [slot.strftime('%H:%M') for slot in available_slots]

            return Response({
                "date": selected_date,
                "staff_member": staff_member.get_staff_member_name(),
                "available_slots": slots_formatted
            })
        except StaffMember.DoesNotExist:
            return Response(
                {"error": _("Staff member non trouvé")},
                status=status.HTTP_404_NOT_FOUND
            )
        except ValueError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class DayOffView(generics.ListCreateAPIView):
    """Gestion des jours de congé"""
    serializer_class = DayOffSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return DayOff.objects.all()

        staff_member = get_object_or_404(StaffMember, user=user)
        return DayOff.objects.filter(staff_member=staff_member)

    def perform_create(self, serializer):
        if not self.request.user.is_superuser:
            staff_member = get_object_or_404(StaffMember, user=self.request.user)
            serializer.validated_data['staff_member'] = staff_member
        serializer.save()


class DayOffDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Détail, mise à jour et suppression d'un jour de congé"""
    queryset = DayOff.objects.all()
    serializer_class = DayOffSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        instance = self.get_object()
        user = self.request.user

        if not user.is_superuser and instance.staff_member.user != user:
            raise permissions.PermissionDenied(
                _("Vous ne pouvez modifier que vos propres jours de congé")
            )

        serializer.save()


class WorkingHoursView(generics.ListCreateAPIView):
    """Gestion des horaires de travail"""
    serializer_class = WorkingHoursSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return WorkingHours.objects.all()

        staff_member = get_object_or_404(StaffMember, user=user)
        return WorkingHours.objects.filter(staff_member=staff_member)

    def perform_create(self, serializer):
        if not self.request.user.is_superuser:
            staff_member = get_object_or_404(StaffMember, user=self.request.user)
            serializer.validated_data['staff_member'] = staff_member
        serializer.save()


class WorkingHoursDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Détail, mise à jour et suppression d'horaire de travail"""
    queryset = WorkingHours.objects.all()
    serializer_class = WorkingHoursSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        instance = self.get_object()
        user = self.request.user

        if not user.is_superuser and instance.staff_member.user != user:
            raise permissions.PermissionDenied(
                _("Vous ne pouvez modifier que vos propres horaires de travail")
            )

        serializer.save()


class RescheduleAppointmentView(generics.CreateAPIView):
    """Demande de réorganisation d'un rendez-vous"""
    serializer_class = AppointmentRescheduleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        appointment_id = request.data.get('appointment_id')
        appointment = get_object_or_404(Appointment, id=appointment_id)

        # Vérification des permissions
        user = request.user
        if not user.is_superuser:
            staff_member = get_object_or_404(StaffMember, user=user)
            if appointment.appointment_request.staff_member != staff_member:
                raise permissions.PermissionDenied(
                    _("Vous ne pouvez réorganiser que vos propres rendez-vous")
                )

        # Vérification si le rendez-vous peut être réorganisé
        if not appointment.appointment_request.can_be_rescheduled():
            return Response(
                {"error": _("Ce rendez-vous ne peut plus être réorganisé")},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Création de l'historique de réorganisation
        reschedule = AppointmentRescheduleHistory.objects.create(
            appointment_request=appointment.appointment_request,
            **serializer.validated_data
        )

        # Incrémenter le compteur de tentatives
        appointment.appointment_request.increment_reschedule_attempts()

        return Response({
            "status": "success",
            "message": _("Demande de réorganisation enregistrée"),
            "reschedule_id": reschedule.id
        }, status=status.HTTP_201_CREATED)