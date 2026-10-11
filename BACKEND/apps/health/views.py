from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from django.db.utils import OperationalError
import datetime

class HealthCheckView(APIView):
    """
    Production-grade system health endpoint checking DB connectivity and API status.
    """
    def get(self, request):
        db_operational = True
        try:
            connection.ensure_connection()
        except OperationalError:
            db_operational = False

        overall_status = "Operational" if db_operational else "Degraded"

        data = {
            "status": overall_status,
            "services": {
                "portfolioApi": True,
                "database": db_operational,
            },
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
        
        status_code = status.HTTP_200_OK if db_operational else status.HTTP_503_SERVICE_UNAVAILABLE
        return Response(data, status=status_code)