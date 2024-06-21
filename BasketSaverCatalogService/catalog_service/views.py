from django.shortcuts import render
from rest_framework.generics import *
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
import json
import re
from .models import Item
from rest_framework.views import APIView

class ItemSearch(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        search_term = self.request.query_params.get('search_query')
        items = Item.objects.all().values()
        print(items)
        products = []
        last_product_store = ""
        store_product_list = []
        pattern = re.compile(rf'\b{search_term}\b|(?<=-){search_term}\b|\b{search_term}(?=-)', re.IGNORECASE)
        for product in items:
            if pattern.search(product["name"]):
                if last_product_store != product["store"] and len(store_product_list) != 0:
                    store_product_list = sorted(store_product_list, key=lambda x: x['price'])
                    products.append({
                        "store": last_product_store,
                        "items": store_product_list
                    })
                    store_product_list = []
                    store_product_list.append(product)
                else:
                    store_product_list.append(product)
                last_product_store = product["store"]
        return Response(products)
