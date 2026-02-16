from rest_framework import serializers
from .models import Business, Branch

class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = ['id', 'name', 'business_type', 'created_at']
        read_only_fields = ['id', 'created_at'] # Owner nggak perlu diinput user

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ['id', 'business', 'name', 'address', 'created_at']
        # We make 'business' read_only because the backend will 
        # assign it automatically from the logged-in user's business.
        read_only_fields = ['id', 'business', 'created_at']