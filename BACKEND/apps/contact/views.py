import logging

from django.conf import settings
from django.core.mail import EmailMessage
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import ContactMessageSerializer

logger = logging.getLogger(__name__)


class ContactMessageView(APIView):
    """
    Persists every submission first, then attempts real email delivery.
    The response tells the truth about whether the email actually went out
    rather than always claiming success — if CONTACT_RECIPIENT_EMAIL isn't
    configured, or SMTP delivery fails, the caller is told so (the message
    is still saved and visible in /admin either way).
    """

    throttle_scope = 'contact'

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        contact_message = serializer.save()

        recipient = getattr(settings, 'CONTACT_RECIPIENT_EMAIL', '')
        delivered = False
        error_detail = None

        if not recipient:
            error_detail = 'CONTACT_RECIPIENT_EMAIL is not configured on the server.'
        else:
            try:
                email = EmailMessage(
                    subject=f"Portfolio contact from {contact_message.name}",
                    body=(
                        f"{contact_message.message}\n\n"
                        f"\u2014 {contact_message.name} ({contact_message.email})"
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[recipient],
                    reply_to=[contact_message.email],
                )
                email.send(fail_silently=False)
                delivered = True
            except Exception as exc:  # noqa: BLE001 - report any backend failure, not just SMTP
                logger.error("Contact email delivery failed: %s", exc)
                error_detail = 'Message saved, but email delivery failed. Please try emailing directly.'

        contact_message.email_delivered = delivered
        contact_message.save(update_fields=['email_delivered'])

        if delivered:
            return Response({'status': 'sent'}, status=status.HTTP_201_CREATED)

        return Response(
            {'status': 'saved_not_sent', 'detail': error_detail},
            status=status.HTTP_202_ACCEPTED,
        )
