from django.test import TestCase
from rest_framework.test import APIClient
from core.models import User  # change if your User model is somewhere else

class CustomTokenLoginTest(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            username='admin',
            password='admin123',
            role='ADMIN'
        )
        self.client = APIClient()

    def test_login_success(self):
        response = self.client.post('/api/login/', {
            'username': 'admin',
            'password': 'admin123'
        })

        # Check status code
        self.assertEqual(response.status_code, 200)

        # Check fields in response
        data = response.json()
        self.assertIn('access', data)
        self.assertIn('refresh', data)
        self.assertEqual(data['username'], 'admin')
        self.assertEqual(data['role'], 'ADMIN')

    def test_login_failure_un(self):
        response = self.client.post('/api/login/', {
            'username': 'admin',
            'password': 'wrongpassword'
        })

        self.assertEqual(response.status_code, 401)  
    
    def test_login_failure_pw(self):
        response = self.client.post('/api/login/',{
            'username': 'adminff',
            'password': 'admin123'
        })

        self.assertEqual(response.status_code,401)
