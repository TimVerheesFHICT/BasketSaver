# basic URL Configurations
from django.urls import include, path
# import routers
from rest_framework import routers

# import everything from views
from .views import *

# define the router
router = routers.DefaultRouter()

# define the router path and viewset to be used
#router.register(r'user_register', UserCreate, basename='user_register')

# specify URL Path for rest_framework
urlpatterns = [
	path('', include(router.urls)),
	path('api-auth/', include('rest_framework.urls')),
    path('account/login', MyObtainTokenPairView.as_view(), name="token_obtain_pair"),
    path('account/register', UserCreate.as_view()),
]
