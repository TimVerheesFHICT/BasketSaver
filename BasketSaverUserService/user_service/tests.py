from django.core.management import call_command
from django.test import TestCase
from django.contrib.auth.models import User
# Create your tests here.
class TestDataGeneration(TestCase):
    def test_testdata_generation(self):
        """Making sure the Test Data Generation is functioning."""
        call_command('gen-admin')
        users = list(User.objects.all())
        user = users[0].username
        self.assertEquals(user,"administrator")