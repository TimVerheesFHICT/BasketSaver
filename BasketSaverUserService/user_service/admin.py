from django.contrib import admin

from user_service.models import FilterSettings

# Register your models here.
class FilterSettingsAdmin(admin.ModelAdmin):
    list_display = ['user','shop']
    
admin.site.register(FilterSettings, FilterSettingsAdmin)