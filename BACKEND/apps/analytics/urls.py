from django.urls import path

from .views import AnalyticsEventView, AnalyticsStatsView

urlpatterns = [
    path('track/', AnalyticsEventView.as_view(), name='analytics-track'),
    path('stats/', AnalyticsStatsView.as_view(), name='analytics-stats'),
]
