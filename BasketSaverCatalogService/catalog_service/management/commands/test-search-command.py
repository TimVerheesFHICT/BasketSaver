from django.core.management.base import BaseCommand
from decouple import config
from django.contrib.auth.models import User
import re
from catalog_service.models import Item



class Command(BaseCommand):
    help = 'Searches for all cheeses in the AH store'

    def handle(self, *args, **options):
        omega = Item.objects.filter(store="ah")
        search_term = "kaas"
        rookworst_products = []
        pattern = re.compile(rf'\b({search_term}|-{search_term}|{search_term}-)\b', re.IGNORECASE)
        for product in omega:
            if pattern.search(product.name):
                print(product.name)
                rookworst_products.append(product)