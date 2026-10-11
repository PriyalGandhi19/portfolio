from rest_framework import serializers

from .models import ContactMessage


class ContactMessageSerializer(serializers.ModelSerializer):
    # Honeypot: a real visitor never fills this in (it's hidden via CSS on
    # the frontend). Bots that auto-fill every field will trip it.
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'message', 'website']

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Name is required.")
        return value

    def validate_message(self, value):
        value = value.strip()
        if len(value) < 10:
            raise serializers.ValidationError("Message is too short.")
        return value

    def validate(self, attrs):
        if attrs.pop('website', ''):
            # Honeypot tripped. Don't tell the bot why — just reject like
            # any other validation error.
            raise serializers.ValidationError("Unable to submit this form.")
        return attrs
