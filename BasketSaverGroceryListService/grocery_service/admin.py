from django.contrib import admin

from grocery_service.models import GroceryList, GroceryListItem, Store

# Register your models here.
# Register your models here.
class StoreAdmin(admin.ModelAdmin):
    list_display = ['name']
    
admin.site.register(Store, StoreAdmin)

# Register your models here.
class GroceryListAdmin(admin.ModelAdmin):
    list_display = ['user','store']
    
admin.site.register(GroceryList, GroceryListAdmin)

# Register your models here.
class GroceryListItemAdmin(admin.ModelAdmin):
    list_display = ['grocery_list','item','amount']
    
admin.site.register(GroceryListItem, GroceryListItemAdmin)