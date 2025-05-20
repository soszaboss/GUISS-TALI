from django.urls import path
from rest_framework.routers import SimpleRouter
from . import views

router = SimpleRouter()

urlpatterns = [
    # Services
    path('services/', views.ServiceListView.as_view(), name='service-list'),
    path('services/<int:pk>/', views.ServiceDetailView.as_view(), name='service-detail'),

    # Staff Members
    path('staff-members/', views.StaffMemberListView.as_view(), name='staff-member-list'),
    path('staff-members/<int:pk>/', views.StaffMemberDetailView.as_view(), name='staff-member-detail'),

    # Appointments
    path('appointment-requests/', views.AppointmentRequestCreateView.as_view(), name='appointment-request-create'),
    path('appointments/', views.AppointmentListView.as_view(), name='appointment-list'),
    path('appointments/<int:pk>/', views.AppointmentDetailView.as_view(), name='appointment-detail'),

    # Slots
    path('available-slots/', views.AvailableSlotsView.as_view(), name='available-slots'),

    # Days Off
    path('days-off/', views.DayOffView.as_view(), name='day-off-list'),
    path('days-off/<int:pk>/', views.DayOffDetailView.as_view(), name='day-off-detail'),

    # Working Hours
    path('working-hours/', views.WorkingHoursView.as_view(), name='working-hours-list'),
    path('working-hours/<int:pk>/', views.WorkingHoursDetailView.as_view(), name='working-hours-detail'),

    # Rescheduling
    path('reschedule/', views.RescheduleAppointmentView.as_view(), name='appointment-reschedule'),
]

urlpatterns += router.urls