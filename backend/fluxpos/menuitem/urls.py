from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, ItemCategoryViewSet, ItemSubcategoryViewSet

router = DefaultRouter()
router.register(r'categories', ItemCategoryViewSet)
router.register(r'subcategories', ItemSubcategoryViewSet)
router.register(r'items', ItemViewSet)

urlpatterns = router.urls