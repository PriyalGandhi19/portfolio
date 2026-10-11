from django.contrib import admin
from django.urls import path , include
from apps.health.views import HealthCheckView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health', HealthCheckView.as_view(), name='system-health'),
    path('api/', include('apps.portfolio.urls')),
    path('api/', include('apps.contact.urls')),
    path('api/', include('apps.analytics.urls')),
]