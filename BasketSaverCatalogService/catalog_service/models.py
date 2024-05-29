from django.db import models

# Create your models here.
class Item(models.Model):
    name = models.CharField(
        max_length = 120,
    )

    url = models.TextField(
        max_length=240,
    )

    price = models.DecimalField(
        max_digits = 6,
        decimal_places = 2,
    )

    weight = models.CharField(
        max_length = 46,
    )

    store = models.CharField(
        null=False,
        blank=False,
        max_length=16
    )