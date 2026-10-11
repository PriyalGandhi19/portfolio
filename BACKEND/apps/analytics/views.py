from django.db.models import Count
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework import status

from .serializers import AnalyticsEventSerializer
from .models import AnalyticsEvent


class AnalyticsEventView(APIView):
    """
    Write-only event log for page views, terminal commands,
    and resume downloads. Contact form submissions are logged separately
    in apps.contact (they need the full message, not just an event type).

    No IP address or device fingerprinting is stored \u2014 just an event type,
    a short free-text detail, and Django's session key (so you can see it
    was "one visitor asking 3 things" vs "3 different visitors" without
    storing anything more identifying than that).
    """

    throttle_scope = 'analytics'

    def post(self, request):
        serializer = AnalyticsEventSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if not request.session.session_key:
            request.session.create()

        serializer.save(session_key=request.session.session_key or '')
        return Response({'status': 'logged'}, status=status.HTTP_201_CREATED)


class AnalyticsStatsView(APIView):
    """
    Read-only summary: unique visitor sessions, and counts per event type,
    for the last 30 days. This is for YOU to check (e.g. via a quick
    logged-in fetch or the Django admin), not exposed on the public site \u2014
    there's no visitor-facing link to it anywhere in the frontend.

    This is deliberately simple. For real traffic-volume analytics (unique
    visitors over time, referrers, geography), a dedicated tool like
    Plausible or Google Analytics will tell you far more than this table
    ever will \u2014 this just answers "did anyone use the terminal/resume
    button."
    """

    permission_classes = [IsAdminUser]

    def get(self, request):
        from apps.contact.models import ContactMessage

        since = timezone.now() - timedelta(days=30)
        recent = AnalyticsEvent.objects.filter(created_at__gte=since)

        by_type = list(
            recent.values('event_type').annotate(count=Count('id')).order_by('-count')
        )
        unique_sessions = recent.exclude(session_key='').values('session_key').distinct().count()

        return Response({
            'window_days': 30,
            'unique_sessions': unique_sessions,
            'events_by_type': by_type,
            'contact_messages_last_30_days': ContactMessage.objects.filter(created_at__gte=since).count(),
            'contact_messages_all_time': ContactMessage.objects.count(),
            'recent_terminal_commands': list(
                recent.filter(event_type='terminal_command').order_by('-created_at').values('detail', 'created_at')[:20]
            ),
        })
