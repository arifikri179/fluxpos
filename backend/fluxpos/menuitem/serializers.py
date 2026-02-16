from rest_framework import serializers
from .models import (Item, ItemCategory, ItemSubcategory)

class ItemCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategory
        fields = '__all__'

class ItemSubcategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemSubcategory
        fields = '__all__'

class ItemSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Item 
        fields = '__all__'