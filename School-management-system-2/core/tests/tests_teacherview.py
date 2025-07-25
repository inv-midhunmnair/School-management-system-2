from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from core.models import User
from core.models import Teacher

class TeacherAdminViewSetTest(TestCase):
    def setUp(self):
        # Create admin user
        self.admin_user = User.objects.create_user(
            username="admin1", password="adminpass", role="admin"
        )

        # Generate access token
        refresh = RefreshToken.for_user(self.admin_user)
        self.access_token = str(refresh.access_token)

        # Initialize authenticated client
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

        # Create some teachers
        Teacher.objects.create(id=1,
                               first_name="abel",
                               last_name="abraham",
                               email="abel@gmail.com",
                               subject_specialization="react",
                               employee_id="STU001",
                               date_of_joining="2025-07-22",
                               status="active",
                               phone="9207535725",
                               user_id=1)

    def test_list_teachers_as_admin(self):
        response = self.client.get("/api/admin/teachers/")
        self.assertEqual(response.status_code, 200)

        # Check the paginated response contains "results"
        self.assertIn("results", response.data)

        # Make sure only one teacher is returned
        self.assertEqual(len(response.data["results"]), 1)

        # Get the first_name of each teacher in the results list
        names = [teacher["first_name"].lower() for teacher in response.data["results"]]

        # Assert that 'abel' is among the returned names
        self.assertIn("abel", names)

