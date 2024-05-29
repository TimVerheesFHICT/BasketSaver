from django.db import models

# Create your models here.
class Store(models.Model):
    name = models.CharField(
        max_length=40,
    )

    def __str__(self):
        return self.name

class GroceryList(models.Model):
    user = models.IntegerField(
        blank=False,
        null=False,
    )

    store = models.ForeignKey(
        Store,
        on_delete=models.CASCADE,
    )
    def __str__(self):
        return self.store.name

class GroceryListItem(models.Model):
    grocery_list = models.ForeignKey(
        GroceryList,
        on_delete = models.CASCADE,
    )

    item = models.IntegerField(
        blank=False,
        null=False,
    )

    amount = models.IntegerField(
        blank=False,
        null=False
    )

    