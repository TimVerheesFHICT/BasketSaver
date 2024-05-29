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
	path('api-auth/', include('rest_framework.urls')),
    path('grocery_list/get_items', GroceryListGet.as_view()),
    path('grocery_list/item_add', GroceryListItemCreate.as_view()),
    path('grocery_list/item_delete', GroceryListItemDelete.as_view()),
    path('grocery_list/item_update', GroceryListItemUpdate.as_view())
]
