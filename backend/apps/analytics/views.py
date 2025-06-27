from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions

from selector.analytics import DashboardStatsSelector
from selector.users import (
    get_user_kpis,
    get_user_roles_distribution,
    get_users_created_per_month,
)
from serializers.analytics import DashboardStatsSerializer

class DashboardStatsView(APIView):

    @extend_schema(
        summary="Statistiques générales du dashboard médical",
        responses={200: DashboardStatsSerializer}
    )
    def get(self, request):
        data = DashboardStatsSelector.employee_stats()
        return Response(data)

@api_view(["GET"])
@permission_classes([permissions.IsAdminUser])
def admin_dashboard_data(request):
    return Response({
        "kpis": get_user_kpis(),
        "roles_distribution": get_user_roles_distribution(),
        "users_created_per_month": get_users_created_per_month(),
    })