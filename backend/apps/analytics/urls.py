from django.urls import path
from .views import DashboardStatsView

urlpatterns = [
    path("employee/", DashboardStatsView.as_view(), name="dashboard-stats"),
]
