from django.db import models
import uuid

class ItemCategory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=250)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'item_category'

    def __str__(self):
        return self.name


class ItemSubcategory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(
        ItemCategory,
        on_delete=models.PROTECT,
        related_name='subcategories'
    )
    name = models.CharField(max_length=250)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'item_subcategory'

    def __str__(self):
        return self.name


class Item(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=10, unique=True, editable=False)
    name = models.CharField(max_length=250)

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    image = models.ImageField(
        upload_to='items/',
        null=True,
        blank=True
    )

    subcategory = models.ForeignKey(
        ItemSubcategory,
        on_delete=models.PROTECT,
        related_name='items'
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'item'
        ordering = ['code']

    def save(self, *args, **kwargs):
        if not self.code:
            prefix = self.subcategory.name[:3].upper()
            last = Item.objects.filter(
                code__startswith=prefix
            ).order_by('-code').first()

            number = int(last.code.split('-')[1]) + 1 if last else 1
            self.code = f"{prefix}-{str(number).zfill(3)}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.code} - {self.name}"
