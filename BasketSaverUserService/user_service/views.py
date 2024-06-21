# import viewsets
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
# import local data
from rest_framework.generics import *
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer
from django.contrib.auth.models import User
from .serializers import MyTokenObtainPairSerializer
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response

# create a viewset
class UserCreate(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny, )

class MyObtainTokenPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer

class UserDelete(APIView):
    permission_classes = [AllowAny]

    def delete(self,request, *args, **kwargs):
        user = User.objects.get(pk=request.data["user_id"])
        user.delete()
        return Response("Account deletion successful")