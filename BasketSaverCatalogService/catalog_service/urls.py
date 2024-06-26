# basic URL Configurations
from django.urls import include, path
# import routers
from rest_framework import routers

# import everything from views
from .views import *

# define the router
router = routers.DefaultRouter()

# define the router path and viewset to be used

#router.register(r'grocery_list/get_items', g_list, basename='grocery_list/get_items')

# specify URL Path for rest_framework
urlpatterns = [
	path('', include(router.urls)),
    path('get_items', ItemSearch.as_view()),
]
