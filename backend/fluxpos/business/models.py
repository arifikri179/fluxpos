from django.db import models
from django.contrib.auth.models import User
import uuid 

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
    
    # Relasi user
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='businesses')
    owner_name = models.CharField(max_length=100, null=True, blank=True)

    # Info bisnis
    name = models.CharField(max_length=100)
    business_type = models.CharField(max_length=20, choices=TYPES)

    # Kontak
    phone = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)

    # Alamat lengkap
    address = models.TextField()  # alamat jalan lengkap
    city = models.CharField(max_length=100, null=True, blank=True)
    province = models.CharField(max_length=100,null=True, blank=True)
    postal_code = models.CharField(max_length=10,null=True, blank=True)

    # Tambahan opsional
    description = models.TextField(null=True, blank=True)
    
    # Gambar
    image = models.ImageField(upload_to='business_images/', null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    class Meta:
        verbose_name_plural = "Businesses"
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

# 
#class Order(models.Model):
 #   id = models.UUIDField



