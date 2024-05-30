from django.core.management.base import BaseCommand
from decouple import config
from django.contrib.auth.models import User



class Command(BaseCommand):
    help = 'Generates admin.'

    def handle(self, *args, **options):
        users = User.objects.all().values()
        print(users)
