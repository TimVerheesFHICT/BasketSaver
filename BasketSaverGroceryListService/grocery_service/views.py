from django.shortcuts import render
from rest_framework.generics import *
from rest_framework.permissions import AllowAny
import pika
import json
from .models import GroceryList, GroceryListItem, Store
from .serializers import GroceryListItemSerializer, GroceryListSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.forms.models import model_to_dict
from rest_framework.views import APIView
import uuid
# Create your views here.

class RpcClient(object):

    def __init__(self):
        credentials = pika.PlainCredentials('bsrabbit', 'bsrabbit99!?')
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(host="myrabbitmq.bmbdabhrhygxcphe.westeurope.azurecontainer.io", port=5672, credentials=credentials))

        self.channel = self.connection.channel()

        result = self.channel.queue_declare(queue='', exclusive=True)
        self.callback_queue = result.method.queue

        self.channel.basic_consume(
            queue=self.callback_queue,
            on_message_callback=self.on_response,
            auto_ack=True)

        self.response = None
        self.corr_id = None

    def on_response(self, ch, method, props, body):
        if self.corr_id == props.correlation_id:
            self.response = body

    def call(self, n):
        self.response = None
        self.corr_id = str(uuid.uuid4())
        self.channel.basic_publish(
            exchange='',
            routing_key='gc_list_request',
            properties=pika.BasicProperties(
                reply_to=self.callback_queue,
                correlation_id=self.corr_id,
            ),
            body=str(n))
        while self.response is None:
            self.connection.process_data_events(time_limit=None)
        return self.response




class GroceryListItemCreate(APIView):
    permission_classes = [AllowAny]
    serializer_class = GroceryListItemSerializer
    
    def post(self,request):
        for item in request.data:
            store_obj = Store.objects.get(name=item["store"])
            grocery_obj = GroceryList.objects.filter(store=store_obj, user=item["user_id"]).first()
            GroceryListItem.objects.get_or_create(
                grocery_list = grocery_obj,
                item = item["item"],
                amount = item["amount"],
            )
        return Response("Created GroceryList Items Successfully!")

class GroceryListItemDelete(APIView):
    permission_classes = [AllowAny]
    serializer_class = GroceryListItemSerializer
    
    def delete(self,request, *args, **kwargs):
        for item in request.data:
            gc_list_item = item["grocery_list_id"]
            gc_list_item_obj = GroceryListItem.objects.get(pk=gc_list_item)
            print(f"Deleting {gc_list_item_obj}")
            gc_list_item_obj.delete()
            
        return Response("Deleted GroceryList Item Successfully!")
    
class GroceryListItemUpdate(APIView):
    permission_classes = [AllowAny]
    serializer_class = GroceryListItemSerializer
    
    def put(self,request):
        gc_list_item = request.data["grocery_list_item"]
        updated_param = request.data["amount"]
        GroceryListItem.objects.filter(pk=gc_list_item).update(amount = updated_param)
        return Response("Updated GroceryList Item Successfully!")
    
class GroceryListGet(APIView):
    permission_classes = [AllowAny]
    serializer_class = GroceryListSerializer

    def get(self, request, *args, **kwargs):
        user = self.request.query_params.get('user_id')
        # Perform your custom logic here using user_id
        grocery_lists = GroceryList.objects.filter(user = user)
        message_list = []
        for grocery_list in grocery_lists:
            grocery_list_items = GroceryListItem.objects.filter(grocery_list = grocery_list).values()
            message_obj = {
                "store": model_to_dict(grocery_list.store)["name"],
                "items": list(grocery_list_items)
            }
            message_list.append(message_obj)
        rpc = RpcClient()
        response = rpc.call(message_list)
        decoded_body = response.decode('utf-8')
        filtered_body = decoded_body.replace("\'", "\"")
        full_payload = json.loads(filtered_body)
        return Response(full_payload)
        

class UserDelete(APIView):
    permission_classes = [AllowAny]
    serializer_class = GroceryListSerializer
    def delete(self,request, *args, **kwargs):
        gc_lists = GroceryList.objects.filter(user=request.data["user_id"])
        for gc in gc_lists:
            gc.delete()