from django.core.management.base import BaseCommand
from decouple import config
from django.contrib.auth.models import User



class Command(BaseCommand):
    help = 'Generates admin.'

    def handle(self, *args, **options):
        su_username = config('DJANGO_ADMIN_USER')
        su_password = config('DJANGO_ADMIN_PASS')
        print(f"Generating superuser:\n\t{su_username}\n\t{su_password}")

        User.objects.create_user(
            username = su_username,
            email = config('DJANGO_ADMIN_EMAIL'),
            is_superuser = True,
            is_staff = True,
            is_active = True,
            password = su_password
        )
        