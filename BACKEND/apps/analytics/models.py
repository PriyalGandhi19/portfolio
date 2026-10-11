from django.db import models


class AnalyticsEvent(models.Model):
    EVENT_TYPES = [
        ('page_view', 'Page View'),
        ('terminal_command', 'Terminal Command'),
        ('ai_question', 'AI Question'),
        ('resume_download', 'Resume Download'),
        ('contact_submit', 'Contact Form Submit'),
    ]

    event_type = models.CharField(max_length=30, choices=EVENT_TYPES)
    # Free-form small payload: the command typed, the question asked, the
    # page path viewed, etc. Kept intentionally small and non-identifying —
    # no IP address or precise fingerprinting is stored.
    detail = models.CharField(max_length=500, blank=True)
    session_key = models.CharField(max_length=40, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.event_type} @ {self.created_at:%Y-%m-%d %H:%M}"
