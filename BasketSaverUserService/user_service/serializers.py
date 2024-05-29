# import serializer from rest_framework
import pika
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# import model from models.py
def grocery_messager(created_user):
        connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='some-rabbit'))
        channel = connection.channel()

        channel.exchange_declare(exchange='new_user', exchange_type='fanout')
        message = str(created_user.pk)
        channel.basic_publish(
            exchange='new_user', routing_key='', body=message)
        print(f" [x] Sent new user for grocery list creation!")
        connection.close()

# Create a model serializer
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        grocery_messager(user)
        return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)

        # Add custom claims
        token['username'] = user.username
        return token