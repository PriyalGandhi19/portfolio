from django.core import mail
from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework.test import APIClient


@override_settings(CONTACT_RECIPIENT_EMAIL='owner@example.com')
class ContactMessageViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('contact-message')

    def test_valid_submission_sends_email(self):
        response = self.client.post(self.url, {
            'name': 'Jane Recruiter',
            'email': 'jane@example.com',
            'message': 'Hi, I would like to talk about a role.',
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['status'], 'sent')
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('Jane Recruiter', mail.outbox[0].subject)

    def test_missing_fields_rejected(self):
        response = self.client.post(self.url, {'name': '', 'email': '', 'message': ''})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(mail.outbox), 0)

    def test_honeypot_rejected(self):
        response = self.client.post(self.url, {
            'name': 'Bot',
            'email': 'bot@example.com',
            'message': 'This is a spam message from a bot.',
            'website': 'http://spam.example.com',
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(mail.outbox), 0)

    @override_settings(CONTACT_RECIPIENT_EMAIL='')
    def test_unconfigured_recipient_still_saves_message(self):
        response = self.client.post(self.url, {
            'name': 'Jane Recruiter',
            'email': 'jane@example.com',
            'message': 'Hi, I would like to talk about a role.',
        })
        self.assertEqual(response.status_code, 202)
        self.assertEqual(response.data['status'], 'saved_not_sent')
