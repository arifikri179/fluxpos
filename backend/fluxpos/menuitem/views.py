from rest_framework.viewsets import ModelViewSet
from .models import Item, ItemCategory, ItemSubcategory
from .serializers import (
    ItemSerializer,
    ItemCategorySerializer,
    ItemSubcategorySerializer
)

class ItemCategoryViewSet(ModelViewSet):
    queryset = ItemCategory.objects.filter(is_active=True)
    serializer_class = ItemCategorySerializer


class ItemSubcategoryViewSet(ModelViewSet):
    queryset = ItemSubcategory.objects.filter(is_active=True)
    serializer_class = ItemSubcategorySerializer


class ItemViewSet(ModelViewSet):
    queryset = Item.objects.filter(is_active=True)
    serializer_class = ItemSerializer
