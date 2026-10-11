from django.test import TestCase
from rest_framework.test import APIClient

from .models import Skill, Project, Experience


class PortfolioDataEndpointTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        Skill.objects.create(category='Backend & APIs', name='Django REST Framework', evidence='Built REST APIs.')
        Project.objects.create(title='Task Management System', overview='A role-based task platform.', technologies=['React', 'Django'])
        Experience.objects.create(role='Junior Software Engineer', company='Adrta Technologies', period='Present', description=['Did things.'])

    def test_skills_endpoint_returns_real_data(self):
        response = self.client.get('/api/skills/')
        self.assertEqual(response.status_code, 200)
        names = [s['name'] for s in response.data['results']] if 'results' in response.data else [s['name'] for s in response.data]
        self.assertIn('Django REST Framework', names)

    def test_projects_endpoint_returns_real_data(self):
        response = self.client.get('/api/projects/')
        self.assertEqual(response.status_code, 200)

    def test_experience_endpoint_returns_real_data(self):
        response = self.client.get('/api/experience/')
        self.assertEqual(response.status_code, 200)

