from django.urls import path
from .views import DashboardStatsView, admin_dashboard_data

urlpatterns = [
    path("employee/", DashboardStatsView.as_view(), name="dashboard-stats"),
    path("admin/", admin_dashboard_data, name="admin-dashboard-stats"),
]
