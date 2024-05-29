from django.apps import AppConfig

class CatalogServiceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'catalog_service'
    # def ready(self):
    #     call_command('start_worker')