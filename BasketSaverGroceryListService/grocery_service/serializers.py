# import serializer from rest_framework
import pika
from rest_framework import serializers
from .models import GroceryList, GroceryListItem
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class GroceryListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryListItem
        fields = ('__all__')

class GroceryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryList
        fields = ('__all__')