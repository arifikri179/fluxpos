from django.db import models
from django.contrib.auth.models import User
import uuid 

class Business(models.Model):
    TYPES = [
        ('fnb', 'Food & Beverage'),
        ('retail', 'Retail'),
        ('service', 'Service'),
    ]

   
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.OneToOneField(User, on_delete=models.CASCADE, related_name='business')
    name = models.CharField(max_length=100)
    business_type = models.CharField(max_length=20, choices=TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Business"
        db_table = 'business' 

    def __str__(self):
        return self.name

class Branch(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='branches')
    name = models.CharField(max_length=100)
    address = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Branches"
        db_table = 'branch'

    def __str__(self):
        return f"{self.name} ({self.business.name})"