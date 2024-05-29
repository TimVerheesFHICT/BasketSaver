from django.contrib import admin

from catalog_service.models import Item

# Register your models here.
class ItemAdmin(admin.ModelAdmin):
    list_display = ['name','url','price','weight','store']
    
admin.site.register(Item, ItemAdmin)
