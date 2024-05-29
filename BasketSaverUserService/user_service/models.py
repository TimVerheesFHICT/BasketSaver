from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class FilterSettings(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )

    shop = models.IntegerField(
        blank=True,
        null=True,
    )
