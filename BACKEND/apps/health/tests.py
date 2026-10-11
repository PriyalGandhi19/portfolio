from django.test import TestCase
from rest_framework.test import APIClient


class HealthCheckViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_health_check_reports_operational_with_db_connected(self):
        response = self.client.get('/api/health')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'Operational')
        self.assertTrue(response.data['services']['database'])
        self.assertTrue(response.data['services']['portfolioApi'])
        self.assertIn('timestamp', response.data)
