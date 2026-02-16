from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BusinessViewSet, BranchViewSet

router = DefaultRouter()
router.register(r'info', BusinessViewSet, basename='business-info')
router.register(r'branches', BranchViewSet, basename='business-branches')

urlpatterns = [
    path('', include(router.urls)),
]