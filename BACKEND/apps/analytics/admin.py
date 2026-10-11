from django.contrib import admin

from .models import AnalyticsEvent


@admin.register(AnalyticsEvent)
class AnalyticsEventAdmin(admin.ModelAdmin):
    list_display = ('event_type', 'detail', 'session_key', 'created_at')
    list_filter = ('event_type', 'created_at')
    search_fields = ('detail', 'session_key')
    readonly_fields = ('event_type', 'detail', 'session_key', 'created_at')

    def has_add_permission(self, request):
        return False  # events are only ever created by visitors, via the API
