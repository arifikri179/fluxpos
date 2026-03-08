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
        # Tetap amankan agar user hanya bisa melihat branch dari bisnis miliknya
        return Branch.objects.filter(business__owner=self.request.user, is_active=True)

    def perform_create(self, serializer):
        # 1. Ambil ID bisnis yang dikirim dari Frontend (localStorage tadi)
        business_id = self.request.data.get('business')
        
        if not business_id:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({"detail": "Business ID is required."})

        try:
            # 2. Cari bisnis berdasarkan ID DAN harus milik user tersebut (Security Check)
            business = Business.objects.get(id=business_id, owner=self.request.user)
            
            # 3. Simpan branch ke bisnis yang spesifik
            serializer.save(business=business)
            
        except Business.DoesNotExist:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({"detail": "Business not found or access denied."})
        except Exception as e:
            from rest_framework.exceptions import APIException
            raise APIException(str(e))