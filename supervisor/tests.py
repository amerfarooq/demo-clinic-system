from django.test import TestCase
from supervisor.models import Doctor

# Create your tests here.
class DoctorTestcase(TestCase):
        def setUp(self):
                self.Obj = Doctor(doctor_name = "John")
        def test_name(self):
                self.assertEqual(self.Obj.doctor_name,"John")