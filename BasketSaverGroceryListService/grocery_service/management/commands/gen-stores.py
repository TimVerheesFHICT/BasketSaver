from django.core.management.base import BaseCommand

from grocery_service.models import Store




class Command(BaseCommand):
    help = 'Generates stores.'

    def handle(self, *args, **options):
        available_stores=["ah","aldi","coop","dekamarkt","dirk","hoogvliet","janlinders","jumbo","picnic","plus", "spar","spar","vomar"]
        for store in available_stores:
            try:
                Store.objects.get_or_create(
                    name=store
                )
                print(f"Added {store}")
            except:
                print(f"Failed adding {store}")
