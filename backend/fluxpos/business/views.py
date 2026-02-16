from rest_framework.viewsets import ModelViewSet
from .models import Branch, Business
from .serializers import BusinessSerializer, BranchSerializer
from rest_framework.permissions import IsAuthenticated

class BusinessViewSet(ModelViewSet):
    serializer_class = BusinessSerializer
    permission_classes = [IsAuthenticated] # Wajib login

    def get_queryset(self):
        # User cuma boleh liat bisnis miliknya sendiri
        return Business.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # OTOMATIS set owner ke user yang lagi login
        # Ini yang bikin Error 400 hilang
        serializer.save(owner=self.request.user)

class BranchViewSet(ModelViewSet):
    serializer_class = BranchSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Branch.objects.filter(business__owner=self.request.user, is_active=True)

    def perform_create(self, serializer):
        # Ambil bisnis milik user ini lalu pasangkan ke cabang baru
        business = Business.objects.get(owner=self.request.user)
        serializer.save(business=business)