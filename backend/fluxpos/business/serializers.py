from rest_framework import serializers
from .models import Business, Branch

class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = '__all__'
        # Masukkan 'owner' ke sini agar Django tidak menagihnya saat POST/PUT
        read_only_fields = ['id', 'owner', 'created_at']

        
class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'
        # We make 'business' read_only because the backend will 
        # assign it automatically from the logged-in user's business.
        read_only_fields = ['id', 'business', 'created_at']