from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from selector.analytics import DashboardStatsSelector
from serializers.analytics import DashboardStatsSerializer

class DashboardStatsView(APIView):

    @extend_schema(
        summary="Statistiques générales du dashboard médical",
        responses={200: DashboardStatsSerializer}
    )
    def get(self, request):
        data = DashboardStatsSelector.employee_stats()
        return Response(data)
