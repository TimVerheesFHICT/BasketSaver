import json
from django.core.management.base import BaseCommand
from decouple import config
from django.contrib.auth.models import User

from catalog_service.models import Item



class Command(BaseCommand):
    help = 'Populates product database'

    def handle(self, *args, **options):
        with open('supermarkets.json', 'r', encoding="utf-8") as file:
            data = json.load(file)

        for store in data:
            i = 0
            for product in store["d"]:
                try:
                    Item.objects.get_or_create(
                        name=product["n"],
                        url=product["l"],
                        price=product["p"],
                        weight=product["s"],
                        store=store["n"],
                        )
                    print(f"Added {product['n']} to database")
                except Exception as e:
                    print("Something went wrong with" + product["n"])
                    print(e)    
                i=i+1
                if i > 9 :
                    break