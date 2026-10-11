from rest_framework import serializers

from .models import AnalyticsEvent

VALID_EVENT_TYPES = {choice[0] for choice in AnalyticsEvent.EVENT_TYPES}


class AnalyticsEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalyticsEvent
        fields = ['event_type', 'detail']

    def validate_event_type(self, value):
        if value not in VALID_EVENT_TYPES:
            raise serializers.ValidationError('Unknown event_type.')
        return value

    def validate_detail(self, value):
        # Truncate rather than reject — analytics shouldn't ever 400 on a
        # visitor's legitimate long question.
        return value[:500]
