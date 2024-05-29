from django.core.management.base import BaseCommand
import json



class Command(BaseCommand):
    help = 'Searches for all cheeses in the AH store'

    def handle(self, *args, **options):
        with open('supermarkets.json', 'r', encoding="utf-8") as file:
            data = json.load(file)

        for store in data:
            print(store["n"])