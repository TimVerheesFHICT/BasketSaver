from django.core.management.base import BaseCommand
from decouple import config
from grocery_service.models import GroceryList



class Command(BaseCommand):
    help = 'Generates admin.'

    def handle(self, *args, **options):
        gc_lists = GroceryList.objects.all().values()
        print(gc_lists)